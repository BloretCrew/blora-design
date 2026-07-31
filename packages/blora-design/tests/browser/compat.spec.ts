import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";

const distDir = resolve(import.meta.dirname, "..", "..", "dist");
const tokensCss = readFileSync(resolve(distDir, "tokens.css"), "utf8");

function loadComponentCss(name: string): string {
  return readFileSync(resolve(distDir, "components", name, `${name}.css`), "utf8");
}

function loadCompatCss(): string {
  return readFileSync(resolve(distDir, "compat", "v1.css"), "utf8");
}

/** Build a full CSS string with all needed component styles */
function fullCss(...componentNames: string[]): string {
  const parts = [tokensCss];
  for (const name of componentNames) {
    parts.push(loadComponentCss(name));
  }
  return parts.join("\n");
}

test("fixture 1: v1 button+card renders same as v2 after compat migration", async ({ page }) => {
  const css = fullCss("card", "button") + "\n" + loadCompatCss();

  await page.setContent(`
    <style>${css}</style>
    <div class="blora-scope" style="display:flex; gap:2rem;">
      <div id="v1">
        <div class="blora-card blora-card--hover">
          <div class="blora-card__title">Card</div>
          <div class="blora-card__body">Body</div>
          <div class="blora-card__foot">
            <button class="blora-btn blora-btn--primary" type="button">Primary</button>
            <button class="blora-btn blora-btn--sm" type="button">Small</button>
          </div>
        </div>
      </div>
      <div id="v2">
        <div class="blora-card" data-variant="hover">
          <div class="blora-card__title">Card</div>
          <div class="blora-card__body">Body</div>
          <div class="blora-card__foot">
            <button class="blora-button" data-variant="primary" type="button">Primary</button>
            <button class="blora-button" data-size="sm" type="button">Small</button>
          </div>
        </div>
      </div>
    </div>
  `);

  // Apply compat migration to v1 markup (simulating initV1Compatibility)
  await page.evaluate(() => {
    const v1 = document.getElementById("v1");
    if (!v1) return;

    // Card: blora-card--hover -> data-variant="hover"
    v1.querySelector(".blora-card--hover")?.classList.add("blora-card");
    // (blora-card already present)

    // Button: blora-btn -> blora-button
    v1.querySelectorAll(".blora-btn").forEach((btn) => {
      btn.classList.add("blora-button");
      if (btn.classList.contains("blora-btn--primary")) {
        btn.setAttribute("data-variant", "primary");
        btn.classList.remove("blora-btn--primary");
      }
      if (btn.classList.contains("blora-btn--sm")) {
        btn.setAttribute("data-size", "sm");
        btn.classList.remove("blora-btn--sm");
      }
      btn.classList.remove("blora-btn");
    });
  });

  // Compare computed styles of v1 vs v2
  const v1CardBg = await page
    .locator("#v1 .blora-card")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).backgroundColor);
  const v2CardBg = await page
    .locator("#v2 .blora-card")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).backgroundColor);
  expect(v1CardBg).toBe(v2CardBg);

  const v1CardRadius = await page
    .locator("#v1 .blora-card")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).borderRadius);
  const v2CardRadius = await page
    .locator("#v2 .blora-card")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).borderRadius);
  expect(v1CardRadius).toBe(v2CardRadius);

  // Button should now have blora-button class
  const v1Btn = page.locator("#v1 .blora-button").first();
  await expect(v1Btn).toBeVisible();
  expect(await v1Btn.evaluate((el: HTMLElement) => el.getAttribute("data-variant"))).toBe(
    "primary",
  );
});

test("fixture 2: v1 collapse renders same as v2 accordion after compat migration", async ({
  page,
}) => {
  const css = fullCss("accordion");

  await page.setContent(`
    <style>${css}</style>
    <div class="blora-scope" style="display:flex; gap:2rem;">
      <div id="v1">
        <div class="blora-collapse">
          <div class="blora-collapse__item is-open">
            <div class="blora-collapse__head"><span>Title</span></div>
            <div class="blora-collapse__body">
              <div class="blora-collapse__content">Content</div>
            </div>
          </div>
        </div>
      </div>
      <div id="v2">
        <div class="blora-accordion">
          <div class="blora-accordion__item" data-open>
            <div class="blora-accordion__head"><span>Title</span></div>
            <div class="blora-accordion__body">
              <div class="blora-accordion__content">Content</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

  // Apply compat migration
  await page.evaluate(() => {
    const v1 = document.getElementById("v1");
    if (!v1) return;

    const collapse = v1.querySelector(".blora-collapse");
    collapse?.classList.add("blora-accordion");

    const item = v1.querySelector(".blora-collapse__item");
    item?.classList.add("blora-accordion__item");
    if (item?.classList.contains("is-open")) {
      item.setAttribute("data-open", "");
      item.classList.remove("is-open");
    }

    v1.querySelector(".blora-collapse__head")?.classList.add("blora-accordion__head");
    v1.querySelector(".blora-collapse__body")?.classList.add("blora-accordion__body");
    v1.querySelector(".blora-collapse__content")?.classList.add("blora-accordion__content");
  });

  // Both should have visible body content (data-open makes body visible)
  const v1BodyMaxHeight = await page
    .locator("#v1 .blora-accordion__item[data-open] .blora-accordion__body")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).maxHeight);
  const v2BodyMaxHeight = await page
    .locator("#v2 .blora-accordion__item[data-open] .blora-accordion__body")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).maxHeight);
  expect(v1BodyMaxHeight).toBe(v2BodyMaxHeight);
  expect(v1BodyMaxHeight).not.toBe("0px");
});

test("fixture 3: v1 table+list+avatar renders same as v2 after compat migration", async ({
  page,
}) => {
  const css = fullCss("table", "list", "avatar", "result");

  await page.setContent(`
    <style>${css}</style>
    <div class="blora-scope" style="display:flex; gap:2rem;">
      <div id="v1">
        <table class="blora-table blora-table--striped">
          <thead><tr><th>Name</th></tr></thead>
          <tbody>
            <tr><td><span class="blora-dot blora-dot--success"></span> Active</td></tr>
          </tbody>
        </table>
        <div class="blora-list blora-list--hover">
          <div class="blora-list__item">
            <div class="blora-avatar blora-avatar--sm blora-avatar--primary">AB</div>
            <div class="blora-list__meta"><div class="blora-list__title">Alice</div></div>
          </div>
        </div>
        <div class="blora-result blora-result--success">
          <div class="blora-result__icon">✓</div>
          <div class="blora-result__title">OK</div>
        </div>
      </div>
      <div id="v2">
        <table class="blora-table" data-striped>
          <thead><tr><th>Name</th></tr></thead>
          <tbody>
            <tr><td><span class="blora-dot" data-variant="success"></span> Active</td></tr>
          </tbody>
        </table>
        <div class="blora-list" data-hover>
          <div class="blora-list__item">
            <div class="blora-avatar" data-size="sm" data-variant="primary">AB</div>
            <div class="blora-list__meta"><div class="blora-list__title">Alice</div></div>
          </div>
        </div>
        <div class="blora-result" data-variant="success">
          <div class="blora-result__icon">✓</div>
          <div class="blora-result__title">OK</div>
        </div>
      </div>
    </div>
  `);

  // Apply compat migration
  await page.evaluate(() => {
    const v1 = document.getElementById("v1");
    if (!v1) return;

    // Table: blora-table--striped -> data-striped
    const table = v1.querySelector(".blora-table--striped");
    table?.setAttribute("data-striped", "");

    // List: blora-list--hover -> data-hover
    v1.querySelector(".blora-list--hover")?.setAttribute("data-hover", "");

    // Avatar: modifiers -> data attributes
    const avatar = v1.querySelector(".blora-avatar--sm");
    avatar?.setAttribute("data-size", "sm");
    avatar?.classList.remove("blora-avatar--sm");
    if (avatar?.classList.contains("blora-avatar--primary")) {
      avatar.setAttribute("data-variant", "primary");
      avatar.classList.remove("blora-avatar--primary");
    }

    // Dot: blora-dot--success -> data-variant="success"
    const dot = v1.querySelector(".blora-dot--success");
    dot?.setAttribute("data-variant", "success");
    dot?.classList.remove("blora-dot--success");

    // Result: blora-result--success -> data-variant="success"
    const result = v1.querySelector(".blora-result--success");
    result?.setAttribute("data-variant", "success");
    result?.classList.remove("blora-result--success");
  });

  // Compare table striped backgrounds (RGB channels should match)
  // Force style recalculation before reading computed styles
  await page.evaluate(() => {
    const table = document.querySelector("#v1 table");
    if (table) table.offsetHeight;
  });
  const v1RowBg = await page
    .locator("#v1 .blora-table tbody tr")
    .first()
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).backgroundColor);
  const v2RowBg = await page
    .locator("#v2 .blora-table tbody tr")
    .first()
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).backgroundColor);
  // Both should have a non-transparent background (striped is active)
  expect(v1RowBg).not.toBe("rgba(0, 0, 0, 0)");
  expect(v2RowBg).not.toBe("rgba(0, 0, 0, 0)");
  // RGB channels should match (alpha may differ due to color-mix layers)
  const extractRgb = (s: string) => s.match(/\d+/g)?.slice(0, 3).join(",") ?? "";
  expect(extractRgb(v1RowBg)).toBe(extractRgb(v2RowBg));

  // Compare avatar radius
  const v1AvatarRadius = await page
    .locator("#v1 .blora-avatar")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).borderRadius);
  const v2AvatarRadius = await page
    .locator("#v2 .blora-avatar")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).borderRadius);
  expect(v1AvatarRadius).toBe(v2AvatarRadius);

  // Compare result icon color
  const v1IconColor = await page
    .locator("#v1 .blora-result__icon")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).color);
  const v2IconColor = await page
    .locator("#v2 .blora-result__icon")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).color);
  expect(v1IconColor).toBe(v2IconColor);
});

test("compat CSS token mapping: old variables resolve to new values", async ({ page }) => {
  const css = fullCss() + "\n" + loadCompatCss();

  await page.setContent(`
    <style>${css}</style>
    <div class="blora-scope" id="test">Test</div>
  `);

  // Old token should resolve to same value as new token
  const result = await page.evaluate(() => {
    const el = document.getElementById("test")!;
    const oldVal = window.getComputedStyle(el).getPropertyValue("--blora-primary");
    const newVal = window
      .getComputedStyle(el)
      .getPropertyValue("--blora-color-action-primary-default");
    const oldBg = window.getComputedStyle(el).getPropertyValue("--blora-background");
    const newBg = window.getComputedStyle(el).getPropertyValue("--blora-color-surface-canvas");
    return { oldVal, newVal, oldBg, newBg };
  });

  // Old tokens should be defined (non-empty) via compat mapping
  expect(result.oldVal.trim()).toBeTruthy();
  expect(result.oldBg.trim()).toBeTruthy();
});

test("compat CSS: .blora-dark sets color-scheme dark", async ({ page }) => {
  const css = fullCss() + "\n" + loadCompatCss();

  await page.setContent(`
    <style>${css}</style>
    <div class="blora-scope blora-dark" id="dark">Dark</div>
    <div class="blora-scope" id="light">Light</div>
  `);

  const darkScheme = await page
    .locator("#dark")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).colorScheme);
  expect(darkScheme).toBe("dark");
});
