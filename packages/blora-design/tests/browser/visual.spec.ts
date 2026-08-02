/**
 * Visual regression (project "visual" only).
 * Baselines: packages/blora-design/tests/browser/visual.spec.ts-snapshots/
 * Review flow: docs/refactor/visual-review.md
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";

const distDir = resolve(import.meta.dirname, "..", "..", "dist");
const tokensCss = readFileSync(resolve(distDir, "tokens.css"), "utf8");
const foundationsCss = readFileSync(resolve(distDir, "foundations.css"), "utf8");

function loadCss(name: string): string {
  return readFileSync(resolve(distDir, "components", name, `${name}.css`), "utf8");
}

function htmlDoc(css: string, body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>visual</title>
<style>
  html,body{margin:0;padding:16px;background:#faf7f8;font-family:system-ui,sans-serif;}
  ${tokensCss}${foundationsCss}${css}
</style></head><body class="blora-scope">${body}</body></html>`;
}

test.describe("visual baseline smoke", () => {
  test.use({
    viewport: { width: 480, height: 360 },
    deviceScaleFactor: 1,
  });

  test("button primary secondary danger", async ({ page }) => {
    await page.setContent(
      htmlDoc(
        loadCss("button"),
        `<div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button type="button" class="blora-button" data-variant="primary">Primary</button>
          <button type="button" class="blora-button" data-variant="secondary">Secondary</button>
          <button type="button" class="blora-button" data-variant="danger">Danger</button>
          <button type="button" class="blora-button" data-variant="outline">Outline</button>
        </div>`,
      ),
    );
    await expect(page.locator("body")).toHaveScreenshot("buttons.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("table basic chrome", async ({ page }) => {
    await page.setContent(
      htmlDoc(
        loadCss("table"),
        `<div class="blora-table-wrap">
          <table class="blora-table">
            <thead><tr><th>Name</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Alice</td><td>Admin</td></tr>
              <tr><td>Bob</td><td>Editor</td></tr>
            </tbody>
          </table>
        </div>`,
      ),
    );
    await expect(page.locator(".blora-table-wrap")).toHaveScreenshot("table.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("field input invalid state", async ({ page }) => {
    await page.setContent(
      htmlDoc(
        `${loadCss("field")}${loadCss("input")}`,
        `<label class="blora-field" data-state="invalid">
          <span class="blora-field__label">Email</span>
          <input class="blora-input" type="email" value="bad" />
          <span class="blora-field__error">Invalid email</span>
        </label>`,
      ),
    );
    await expect(page.locator(".blora-field")).toHaveScreenshot("field-invalid.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });
});
