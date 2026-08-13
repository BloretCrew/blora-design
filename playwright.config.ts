import { defineConfig, devices } from "@playwright/test";

const storybookPort = process.env.BLORA_PLAYWRIGHT_PORT ?? "6106";
const storybookUrl = `http://localhost:${storybookPort}`;

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
  // Platform-agnostic visual baselines (linux CI + local)
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.03,
      animations: "disabled",
    },
  },
  use: {
    baseURL: storybookUrl,
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
  ],
  webServer: {
    command: `pnpm --filter @bloret-crew/blora-design exec storybook dev -p ${storybookPort} -h 0.0.0.0 --ci`,
    url: storybookUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
