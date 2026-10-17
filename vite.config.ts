// vite.config.ts
import { defineConfig, type PluginOption } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import babelPlugin from "@rolldown/plugin-babel";
import { visualizer } from "rollup-plugin-visualizer";

const plugins: PluginOption[] = [
  tanstackStart(),
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

export default defineConfig({
  server: {
    port: 3000,
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
});
