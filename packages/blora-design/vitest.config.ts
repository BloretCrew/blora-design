import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

const packageJson = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf8"));

export default defineConfig({
  define: {
    __BLORA_VERSION__: JSON.stringify(packageJson.version),
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup-locale.ts"],
    passWithNoTests: true,
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/browser/**", "node_modules/**", "dist/**"],
    pool: "forks",
    poolOptions: {
      forks: { singleFork: true },
    },
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["**/*.d.ts", "**/index.ts"],
    },
  },
});
