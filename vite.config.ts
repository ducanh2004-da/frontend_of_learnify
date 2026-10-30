// vite.config.ts
import { defineConfig, type PluginOption } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import babelPlugin from "@rolldown/plugin-babel";
import { visualizer } from "rollup-plugin-visualizer";

const rawBackendUrl =
  process.env.BACKEND_URL ||
  process.env.VITE_BACKEND_URL ||
  (process.env.VITE_GRAPHQL_ENDPOINT?.startsWith("http")
    ? process.env.VITE_GRAPHQL_ENDPOINT
    : undefined) ||
  "https://learnify-be.onrender.com/graphql";

const backendOrigin = (() => {
  try {
    return new URL(rawBackendUrl).origin;
  } catch {
    return "https://learnify-be.onrender.com";
  }
})();

export default defineConfig(({ command }) => {
  const isBuild = command === "build";
  if (isBuild) {
    process.env.NODE_ENV = "production";
  }

  const plugins: PluginOption[] = [
    tanstackStart(),
    nitro({
      routeRules: {
        "/backend-graphql": {
          proxy: `${backendOrigin}/graphql`,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            "CDN-Cache-Control": "no-store",
            "Vercel-CDN-Cache-Control": "no-store",
          },
        },
        "/csrf-token": {
          proxy: `${backendOrigin}/csrf-token`,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            "CDN-Cache-Control": "no-store",
            "Vercel-CDN-Cache-Control": "no-store",
          },
        },
      },
    }),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
    babelPlugin({
      presets: [reactCompilerPreset()],
    }),
  ];

  if (process.env.ANALYZE) {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: "stats.html",
      })
    );
  }

  return {
    oxc: {
      jsx: {
        runtime: "automatic",
        development: !isBuild,
      },
    },
    server: {
      port: 3000,
      proxy: {
        "/backend-graphql": {
          target: backendOrigin,
          changeOrigin: true,
          rewrite: () => "/graphql",
        },
        "/csrf-token": {
          target: backendOrigin,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      tsconfigPaths: true,
      alias: {
        "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      },
    },
    plugins,
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes("node_modules/react-dom") ||
              id.includes("node_modules/react/")
            )
              return "vendor-react";
            if (id.includes("node_modules/gsap")) return "vendor-anim";
            if (
              id.includes("node_modules/lodash") ||
              id.includes("node_modules/zod")
            )
              return "vendor-util";
            if (id.includes("node_modules/@tanstack")) return "vendor-tanstack";
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ["import", "global-builtin"],
        },
      },
    },
  };
});
