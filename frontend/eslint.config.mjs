import creedengo from "@creedengo/eslint-plugin";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import globals from "globals";
import unusedImports from "eslint-plugin-unused-imports";
import reactHooks from "eslint-plugin-react-hooks";
import reactPerf from "eslint-plugin-react-perf";

export default [

  // ============================
  // 0. Ignore global build folders
  // ============================
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

  // ============================
  // 2. Global language options
  // ============================
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // ============================
  // 3. Override per JS/TS/TSX
  // ============================
  {
    files: ["**/*.{js,ts,tsx}"],

    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.test.json"],
      },
    },

    plugins: {
      "@creedengo": creedengo,
      "@typescript-eslint": tseslint,
      "unused-imports": unusedImports,
      "react-hooks": reactHooks,
      "react-perf": reactPerf,
    },

    rules: {
      // ============================
      // TypeScript
      // ============================
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",

      // ============================
      // Unused imports
      // ============================
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // ============================
      // Creedengo
      // ============================
      "@creedengo/no-multiple-access-dom-element": "error",
      "@creedengo/no-multiple-access-dom-element": "error",
      "@creedengo/no-multiple-style-changes": "warn",
      "@creedengo/no-import-all-from-library": "warn",
      "@creedengo/prefer-shorthand-css-notations": "warn",
      "@creedengo/prefer-collections-with-pagination": "warn",
      "@creedengo/avoid-css-animations": "warn",
      
      // ============================
      // Custom rules
      // ============================
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "complexity": ["warn", 10],
      "max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true, skipComments: true }],
      "max-depth": ["warn", 4],
      "max-statements": ["warn", 30],
      "max-nested-callbacks": ["warn", 3],
      "max-params": ["warn", 4],

      // ============================
      // React Hooks
      // ============================
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // ============================
      // React Performance
      // ============================
      "react-perf/jsx-no-new-function-as-prop": "warn",
      "react-perf/jsx-no-new-object-as-prop": "warn",
      "react-perf/jsx-no-new-array-as-prop": "warn",
    },
  },

  // ============================
  // 4. Config per file di config
  // ============================
  {
    files: ["webpack.config.js", "*.config.js", "*.cjs"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },

  // ============================
  // 5. JSX/TSX override
  // ============================
  {
    files: ["**/*.{tsx,jsx}"],
    rules: {
      "max-lines-per-function": "off",
      "complexity": "off",
      "max-lines": "off",
      "max-depth": "off",
    },
  },
];
