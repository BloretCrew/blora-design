import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup-canvas.ts"],
    // Controllers / jsdom can leave handles; force clean exit in CI
    pool: "forks",
    poolOptions: {
      forks: { singleFork: true },
    },
  },
});
