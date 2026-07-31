import js from "@eslint/js";
import tseslint from "typescript-eslint";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "legacy/**",
      "dist/**",
      "node_modules/**",
      ".storybook-static/**",
      "playwright-report/**",
      "test-results/**",
      "coverage/**",
      "*.config.{js,mjs,ts}",
      "packages/*/dist/**",
      "packages/*/scripts/**/*.mjs",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: { "no-unsanitized": noUnsanitized },
    rules: {
      // §5.4 禁止生产代码 console.log
      "no-console": ["error", { allow: ["warn", "error"] }],

      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // §22.1 禁止 innerHTML 写入未经可信构造的字符串
      "no-unsanitized/method": "error",
      "no-unsanitized/property": "error",

      // §22.1 禁止 eval / new Function
      "no-eval": "error",
      "no-new-func": "error",

      "prefer-const": "error",
      "no-var": "error",
    },
  },
  // Typed-linting block for blora-design package
  {
    files: ["packages/blora-design/src/**/*.ts", "packages/blora-design/tests/**/*.test.ts"],
    languageOptions: {
      parserOptions: {
        project: "packages/blora-design/tsconfig.lint.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // §5.4 禁止未处理 Promise
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
  // Typed-linting block for blora-tokens package
  {
    files: ["packages/tokens/src/**/*.ts", "packages/tokens/tests/**/*.test.ts"],
    languageOptions: {
      parserOptions: {
        project: "packages/tokens/tsconfig.lint.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
  // Typed-linting block for addon packages
  {
    files: [
      "addons/markdown/src/**/*.ts",
      "addons/markdown/tests/**/*.test.ts",
      "addons/qrcode/src/**/*.ts",
      "addons/qrcode/tests/**/*.test.ts",
      "addons/thread/src/**/*.ts",
      "addons/thread/tests/**/*.test.ts",
      "addons/effects/src/**/*.ts",
      "addons/effects/tests/**/*.test.ts",
    ],
    languageOptions: {
      parserOptions: {
        project: [
          "addons/markdown/tsconfig.lint.json",
          "addons/qrcode/tsconfig.lint.json",
          "addons/thread/tsconfig.lint.json",
          "addons/effects/tsconfig.lint.json",
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
);
