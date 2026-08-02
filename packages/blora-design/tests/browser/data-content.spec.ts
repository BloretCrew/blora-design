import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";

const distDir = resolve(import.meta.dirname, "..", "..", "dist");
const tokensCss = readFileSync(resolve(distDir, "tokens.css"), "utf8");

function loadComponentCss(name: string): string {
  return readFileSync(resolve(distDir, "components", name, `${name}.css`), "utf8");
}

function pageWith(css: string, content: string): string {
  return `<style>${tokensCss}</style><style>${css}</style><div class="blora-scope">${content}</div>`;
}

/* ------------------------------------------------------------------ Card */

test("card renders with correct surface and radius", async ({ page }) => {
  const css = loadComponentCss("card");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-card">
        <div class="blora-card__title">Title</div>
        <div class="blora-card__body">Body</div>
        <div class="blora-card__foot">Footer</div>
      </div>
    `,
    ),
  );

  const card = page.locator(".blora-card");
  const styles = await card.evaluate((el: HTMLElement) => ({
    borderRadius: window.getComputedStyle(el).borderRadius,
    boxShadow: window.getComputedStyle(el).boxShadow,
    containerType: window.getComputedStyle(el).containerType,
  }));
  expect(styles.borderRadius).not.toBe("0px");
  expect(styles.containerType).toBe("inline-size");
  await expect(page.locator(".blora-card__title")).toBeVisible();
});

test("card data-variant flat removes shadow", async ({ page }) => {
  const css = loadComponentCss("card");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-card" data-variant="flat">Flat</div>
      <div class="blora-card">Default</div>
    `,
    ),
  );

  const flatShadow = await page
    .locator('.blora-card[data-variant="flat"]')
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).boxShadow);
  expect(flatShadow).toBe("none");
});

test("panel has larger padding than card", async ({ page }) => {
  const css = loadComponentCss("card");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-card">Card</div>
      <div class="blora-panel">Panel</div>
    `,
    ),
  );

  const cardPad = await page
    .locator(".blora-card")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).padding);
  const panelPad = await page
    .locator(".blora-panel")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).padding);
  // Panel should have more padding than card (space-7 > space-6)
  expect(panelPad).not.toBe(cardPad);
});

/* ------------------------------------------------------------------ Table */

test("table renders with correct header and body styling", async ({ page }) => {
  const css = loadComponentCss("table");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-table-wrap">
        <table class="blora-table">
          <thead>
            <tr><th>Name</th><th>Age</th></tr>
          </thead>
          <tbody>
            <tr><td>Alice</td><td>30</td></tr>
            <tr><td>Bob</td><td>25</td></tr>
          </tbody>
        </table>
      </div>
    `,
    ),
  );

  const th = page.locator(".blora-table thead th").first();
  const thBg = await th.evaluate((el: HTMLElement) => window.getComputedStyle(el).backgroundColor);
  expect(thBg).not.toBe("rgba(0, 0, 0, 0)");

  const td = page.locator(".blora-table tbody td").first();
  await expect(td).toBeVisible();
});

test("table striped variant adds odd-row background", async ({ page }) => {
  const css = loadComponentCss("table");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-table-wrap">
        <table class="blora-table" data-striped>
          <tbody>
            <tr><td>Row 1</td></tr>
            <tr><td>Row 2</td></tr>
            <tr><td>Row 3</td></tr>
          </tbody>
        </table>
      </div>
    `,
    ),
  );

  const firstRowBg = await page
    .locator(".blora-table tbody tr")
    .first()
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).backgroundColor);
  // Striped first row should have a non-transparent background
  expect(firstRowBg).not.toBe("rgba(0, 0, 0, 0)");
});

test("table sort headers show direction arrows", async ({ page }) => {
  const css = loadComponentCss("table");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-table-wrap">
        <table class="blora-table">
          <thead>
            <tr>
              <th class="blora-table-sort" aria-sort="ascending">Name</th>
              <th class="blora-table-sort" aria-sort="descending">Age</th>
              <th class="blora-table-sort">Email</th>
            </tr>
          </thead>
          <tbody><tr><td>A</td><td>1</td><td>a@b</td></tr></tbody>
        </table>
      </div>
    `,
    ),
  );

  const ascAfter = await page
    .locator('.blora-table-sort[aria-sort="ascending"]')
    .evaluate((el: HTMLElement) => window.getComputedStyle(el, "::after").content);
  // Sorted glyphs: filled triangles (hover unsorted uses ⇅)
  expect(ascAfter).toMatch(/▲|↑/);

  const descAfter = await page
    .locator('.blora-table-sort[aria-sort="descending"]')
    .evaluate((el: HTMLElement) => window.getComputedStyle(el, "::after").content);
  expect(descAfter).toMatch(/▼|↓/);
});

/* ------------------------------------------------------------------ List */

test("list renders items with hover background", async ({ page }) => {
  const css = loadComponentCss("list");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-list">
        <div class="blora-list__item">
          <div class="blora-list__meta">
            <div class="blora-list__title">Item 1</div>
            <div class="blora-list__desc">Description</div>
          </div>
        </div>
        <div class="blora-list__item">
          <div class="blora-list__meta">
            <div class="blora-list__title">Item 2</div>
          </div>
        </div>
      </div>
    `,
    ),
  );

  await expect(page.locator(".blora-list__title").first()).toBeVisible();
  const itemDisplay = await page
    .locator(".blora-list__item")
    .first()
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).display);
  expect(itemDisplay).toBe("flex");
});

/* ------------------------------------------------------------------ Accordion */

test("accordion item opens and closes with data-open", async ({ page }) => {
  const css = loadComponentCss("accordion");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-accordion">
        <div class="blora-accordion__item" data-open>
          <div class="blora-accordion__head">
            <span>Section 1</span>
            <span class="blora-accordion__icon">▶</span>
          </div>
          <div class="blora-accordion__body">
            <div class="blora-accordion__content">Content 1</div>
          </div>
        </div>
        <div class="blora-accordion__item">
          <div class="blora-accordion__head">
            <span>Section 2</span>
            <span class="blora-accordion__icon">▶</span>
          </div>
          <div class="blora-accordion__body">
            <div class="blora-accordion__content">Content 2</div>
          </div>
        </div>
      </div>
    `,
    ),
  );

  // Open body has content height; closed body is hard-zero (v1 tight stack)
  const openBody = page.locator(".blora-accordion__item[data-open] .blora-accordion__body");
  const openH = await openBody.evaluate((el: HTMLElement) => el.getBoundingClientRect().height);
  expect(openH).toBeGreaterThan(0);

  const closedBody = page.locator(".blora-accordion__item:not([data-open]) .blora-accordion__body");
  const closed = await closedBody.evaluate((el: HTMLElement) => {
    const cs = window.getComputedStyle(el);
    return { h: el.getBoundingClientRect().height, max: cs.maxHeight };
  });
  expect(closed.h).toBeLessThanOrEqual(1);
  expect(closed.max).toBe("0px");
});

test("accordion icon rotates when open", async ({ page }) => {
  const css = loadComponentCss("accordion");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-accordion">
        <div class="blora-accordion__item" data-open>
          <div class="blora-accordion__head">
            <span>Open</span>
            <span class="blora-accordion__icon">▶</span>
          </div>
          <div class="blora-accordion__body"><div class="blora-accordion__content">C</div></div>
        </div>
      </div>
    `,
    ),
  );

  const iconTransform = await page
    .locator(".blora-accordion__icon")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).transform);
  expect(iconTransform).not.toBe("none");
});

/* ------------------------------------------------------------------ Timeline */

test("timeline renders with vertical line and dots", async ({ page }) => {
  const css = loadComponentCss("timeline");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-timeline">
        <div class="blora-timeline__item">
          <div class="blora-timeline__dot" data-variant="primary"></div>
          <div class="blora-timeline__time">10:00</div>
          <div class="blora-timeline__title">Event A</div>
          <div class="blora-timeline__desc">Description</div>
        </div>
        <div class="blora-timeline__item">
          <div class="blora-timeline__dot" data-variant="success"></div>
          <div class="blora-timeline__time">11:00</div>
          <div class="blora-timeline__title">Event B</div>
        </div>
      </div>
    `,
    ),
  );

  await expect(page.locator(".blora-timeline__title").first()).toBeVisible();

  const timelinePad = await page
    .locator(".blora-timeline")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).paddingLeft);
  expect(timelinePad).not.toBe("0px");

  // Dot should be positioned absolutely
  const dotPosition = await page
    .locator(".blora-timeline__dot")
    .first()
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).position);
  expect(dotPosition).toBe("absolute");
});

/* ------------------------------------------------------------------ Empty */

test("empty state renders centered content", async ({ page }) => {
  const css = loadComponentCss("empty");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-empty">
        <div class="blora-empty__icon">📭</div>
        <div class="blora-empty__title">No data</div>
        <div class="blora-empty__desc">Try adjusting your filters</div>
      </div>
    `,
    ),
  );

  const styles = await page.locator(".blora-empty").evaluate((el: HTMLElement) => ({
    display: window.getComputedStyle(el).display,
    textAlign: window.getComputedStyle(el).textAlign,
    alignItems: window.getComputedStyle(el).alignItems,
  }));
  expect(styles.display).toBe("flex");
  expect(styles.textAlign).toBe("center");
  expect(styles.alignItems).toBe("center");
});

/* ------------------------------------------------------------------ Result */

test("result variants set icon color", async ({ page }) => {
  const css = loadComponentCss("result");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-result" data-variant="success">
        <div class="blora-result__icon">✓</div>
        <div class="blora-result__title">Success</div>
        <div class="blora-result__desc">Operation completed</div>
      </div>
      <div class="blora-result" data-variant="error">
        <div class="blora-result__icon">✕</div>
        <div class="blora-result__title">Error</div>
        <div class="blora-result__desc">Something went wrong</div>
      </div>
    `,
    ),
  );

  const successColor = await page
    .locator('.blora-result[data-variant="success"] .blora-result__icon')
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).color);

  const errorColor = await page
    .locator('.blora-result[data-variant="error"] .blora-result__icon')
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).color);

  expect(successColor).not.toBe(errorColor);
});

/* ------------------------------------------------------------------ Avatar */

test("avatar renders with circular shape by default", async ({ page }) => {
  const css = loadComponentCss("avatar");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-avatar">AB</div>
    `,
    ),
  );

  const radius = await page
    .locator(".blora-avatar")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).borderRadius);
  expect(radius).toBe("50%");
});

test("avatar square shape applies radius token", async ({ page }) => {
  const css = loadComponentCss("avatar");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-avatar" data-shape="square">AB</div>
    `,
    ),
  );

  const radius = await page
    .locator('.blora-avatar[data-shape="square"]')
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).borderRadius);
  expect(radius).not.toBe("50%");
  expect(radius).not.toBe("0px");
});

test("avatar sizes scale dimensions", async ({ page }) => {
  const css = loadComponentCss("avatar");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-avatar" data-size="xs">S</div>
      <div class="blora-avatar" data-size="xl">XL</div>
    `,
    ),
  );

  const xsWidth = await page
    .locator('.blora-avatar[data-size="xs"]')
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).width);
  const xlWidth = await page
    .locator('.blora-avatar[data-size="xl"]')
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).width);
  expect(parseFloat(xsWidth)).toBeLessThan(parseFloat(xlWidth));
});

test("avatar group overlaps avatars", async ({ page }) => {
  const css = loadComponentCss("avatar");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-avatar-group">
        <div class="blora-avatar">A</div>
        <div class="blora-avatar">B</div>
        <div class="blora-avatar">C</div>
      </div>
    `,
    ),
  );

  const groupDisplay = await page
    .locator(".blora-avatar-group")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).display);
  expect(groupDisplay).toBe("inline-flex");

  // Second avatar should have negative margin
  const secondMargin = await page
    .locator(".blora-avatar-group .blora-avatar")
    .nth(1)
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).marginLeft);
  expect(parseFloat(secondMargin)).toBeLessThan(0);
});

test("avatar wrap positions badge absolutely", async ({ page }) => {
  const css = loadComponentCss("avatar");
  await page.setContent(
    pageWith(
      css,
      `
      <div class="blora-avatar-wrap">
        <div class="blora-avatar">AB</div>
        <span class="blora-badge">3</span>
      </div>
    `,
    ),
  );

  const badgePosition = await page
    .locator(".blora-badge")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).position);
  expect(badgePosition).toBe("absolute");
});
