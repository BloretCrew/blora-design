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
  // Typed-linting block: rules that require type information
  {
    files: ["packages/*/src/**/*.ts", "packages/*/tests/**/*.test.ts"],
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
);
