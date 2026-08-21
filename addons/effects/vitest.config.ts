import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup-canvas.ts"],
  },
});
