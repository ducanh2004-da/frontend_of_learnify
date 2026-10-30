import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "build",
      ".output",
      "node_modules",
      ".vinxi",
      "src/routeTree.gen.ts",
      "lambda",
      "scripts",
      "config",
      ".history",
      "public",
      "mock",
    ],
  },
  prettierConfig,
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      "@tanstack/query": pluginQuery,
      "@tanstack/router": pluginRouter,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...pluginQuery.configs.recommended.rules,
      ...pluginRouter.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      quotes: ["error", "double", { avoidEscape: true }],
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": ["warn", { allow: ["info", "warn", "error", "debug"] }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);
