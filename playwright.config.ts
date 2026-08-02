import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./packages/blora-design/tests/browser",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI
    ? 1
    : process.env.PLAYWRIGHT_WORKERS
      ? parseInt(process.env.PLAYWRIGHT_WORKERS, 10)
      : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:6006",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /a11y\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      testIgnore: /a11y\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "a11y",
      testMatch: /a11y\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Interaction specs use setContent; Storybook still used by smoke.spec.
    command: "pnpm storybook --ci",
    url: "http://localhost:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
