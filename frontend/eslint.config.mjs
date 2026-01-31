import creedengo from "@creedengo/eslint-plugin";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import globals from "globals";

export default [

  // Ignore global build folders
  { 
    ignores: [
       ".yarn/",
       "dist/", 
       "build/", 
       "node/",
       "node_modules/", 
       "**/*.chunk.js", 
       "remoteEntry.js" 
      ]
  },
  // ============================
  // 1. Creedengo preset ufficiale
  // ============================
  creedengo.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // ============================
  // 2. Override per JS/TS + regole custom
  // ============================
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],

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
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
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
  },
  {
    files: ["webpack.config.js", "*.config.js", "*.cjs"],
    languageOptions: {
      parserOptions: {
        project: null
      }
    }
  },
  {
  files: ["**/*.tsx", "**/*.jsx"],
    rules: {
      "max-lines-per-function": "off",
      "complexity": "off",
      "max-lines": "off",
      "max-depth": "off"
    }
  },
];
