import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./packages/blora-design/tests/browser",
  passWithNoTests: true,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI
    ? 1
    : process.env.PLAYWRIGHT_WORKERS
      ? parseInt(process.env.PLAYWRIGHT_WORKERS, 10)
      : undefined,
  reporter: "html",
  // Platform-agnostic visual baselines (linux CI + local)
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.03,
      animations: "disabled",
    },
  },
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /a11y\.spec\.ts|visual\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      testIgnore: /a11y\.spec\.ts|visual\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "a11y",
      testMatch: /a11y\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual",
      testMatch: /visual\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testIgnore: /a11y\.spec\.ts|visual\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testIgnore: /a11y\.spec\.ts|visual\.spec\.ts/,
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
