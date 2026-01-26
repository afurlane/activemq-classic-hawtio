import creedengo from "@creedengo/eslint-plugin";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [

  // ============================
  // 1. Creedengo preset ufficiale
  // ============================
  creedengo.configs["flat/recommended"],

  // ============================
  // 2. Override per JS/TS + regole custom
  // ============================
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],

    ignores: [
      "dist/",
      "build/",
      "node_modules/"
    ],

    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json"
      }
    },

    plugins: {
      "@creedengo": creedengo,
      "@typescript-eslint": tseslint
    },

    rules: {
      // ============================
      // TypeScript rules
      // ============================
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",

      // ============================
      // Regole Creedengo aggiuntive
      // ============================
      "@creedengo/no-multiple-access-dom-element": "error",

      // ============================
      // Regole personalizzate
      // ============================
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "complexity": ["warn", 10],
      "max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true, skipComments: true }],
      "max-depth": ["warn", 4]
    }
  }
];
