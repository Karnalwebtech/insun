import globals from "globals";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    env: {
      node: true,  // Enables Node.js global variables like `process`
      es6: true,
    },
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,  // ✅ Use recommended JavaScript rules
      ...tseslint.configs.recommended.rules, // ✅ Use recommended TypeScript rules
      "no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
    ignores: ["node_modules/", "dist/"], // ✅ Ignores files instead of .eslintignore
  },
];
