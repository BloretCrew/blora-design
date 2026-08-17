import { test, expect } from "@playwright/test";

test("storybook loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/storybook/i);
});
