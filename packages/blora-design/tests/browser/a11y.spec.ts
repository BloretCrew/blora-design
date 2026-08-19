/**
 * Real axe-core checks (project "a11y" only).
 * Interaction specs stay on chromium / mobile-chromium.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const tokensCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "dist", "tokens.css"),
  "utf8",
);
const foundationsCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "dist", "foundations.css"),
  "utf8",
);
const buttonCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "src", "components", "button", "button.css"),
  "utf8",
);
const fieldCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "src", "components", "field", "field.css"),
  "utf8",
);
const inputCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "src", "components", "input", "input.css"),
  "utf8",
);
const showcasePath = resolve(import.meta.dirname, "../../../..", "examples/showcase-v2/index.html");

function pageHtml(body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Blora a11y smoke</title><style>${tokensCss}${foundationsCss}${buttonCss}${fieldCss}${inputCss}</style></head><body>${body}</body></html>`;
}

test.describe("axe a11y smoke", () => {
  test("primary button and labeled field have no serious/critical violations", async ({ page }) => {
    await page.setContent(
      pageHtml(`
      <main>
        <h1>Form</h1>
        <button type="button" class="blora-button" data-variant="primary">Save</button>
        <label class="blora-field">
          <span class="blora-field__label">Email</span>
          <input class="blora-input" name="email" type="email" />
        </label>
      </main>
    `),
    );

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });

  test("showcase component catalog has no serious/critical violations", async ({ page }) => {
    await page.goto(`${pathToFileURL(showcasePath).href}#accordion`);
    await page.waitForSelector("#demo-accordion .blora-accordion__head");
    await page.locator("[data-blora-palette-trigger]").click();
    await page.waitForSelector(".blora-palette-picker[data-open]");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});
