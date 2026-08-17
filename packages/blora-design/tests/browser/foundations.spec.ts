import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";

const foundationsCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "dist", "foundations.css"),
  "utf8",
);
const tokensCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "dist", "tokens.css"),
  "utf8",
);

function htmlPage(content: string): string {
  return `<style>${tokensCss}</style><style>${foundationsCss}</style><div class="blora-scope">${content}</div>`;
}

test("foundations render correctly at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await page.setContent(
    htmlPage(`
      <h1 class="blora-h1">Heading</h1>
      <p class="blora-text-lead">Lead text</p>
      <div class="blora-stack">
        <div class="blora-card">
          <div class="blora-card__title">Card Title</div>
          <div class="blora-card__body">Card body content</div>
        </div>
        <div class="blora-row">
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </div>
        <div class="blora-grid blora-grid--4">
          <div>Col 1</div>
          <div>Col 2</div>
          <div>Col 3</div>
          <div>Col 4</div>
        </div>
      </div>
    `),
  );

  await expect(page.locator(".blora-h1")).toBeVisible();
  await expect(page.locator(".blora-card")).toBeVisible();

  // Grid should collapse to a single column at 320px via @media fallback
  const grid = page.locator(".blora-grid--4");
  const gridTemplate = await grid.evaluate(
    (el: HTMLElement) => window.getComputedStyle(el).gridTemplateColumns,
  );
  // At 320px the @media (max-width: 880px) rule collapses to a single 1fr track.
  // A single track value contains no space separator.
  const trackCount = gridTemplate.split(" ").filter(Boolean).length;
  expect(trackCount).toBe(1);
});

test("foundations respect RTL direction", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.setContent(
    `<style>${tokensCss}</style><style>${foundationsCss}</style>` +
      `<div class="blora-scope" dir="rtl" style="padding: 1rem;">` +
      `<blockquote class="blora-quote">RTL quote</blockquote>` +
      `<div class="blora-row"><span>RTL item</span></div>` +
      `<hr class="blora-divider" />` +
      `</div>`,
  );

  const scope = page.locator(".blora-scope");
  const direction = await scope.evaluate(
    (el: HTMLElement) => window.getComputedStyle(el).direction,
  );
  expect(direction).toBe("rtl");

  const quote = page.locator(".blora-quote");
  await expect(quote).toBeVisible();
});
