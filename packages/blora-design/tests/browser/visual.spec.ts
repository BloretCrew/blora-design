/**
 * Visual regression (project "visual" only).
 * Baselines: packages/blora-design/tests/browser/visual.spec.ts-snapshots/
 * Review flow: docs/refactor/visual-review.md
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { test, expect } from "@playwright/test";

const distDir = resolve(import.meta.dirname, "..", "..", "dist");
const showcasePath = resolve(import.meta.dirname, "../../../..", "examples/showcase-v2/index.html");
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

function disclosureMarkup(component: "accordion" | "collapse"): string {
  return `<div class="blora-${component}" style="width:360px">
    <div class="blora-${component}__item" data-open>
      <button type="button" class="blora-${component}__head" aria-expanded="true">
        <span>What is Blora Design?</span>
        <span class="blora-${component}__icon"></span>
      </button>
      <div class="blora-${component}__body" style="--blora-collapse-h:48px">
        <div class="blora-${component}__content">Token-driven UI built on Web standards.</div>
      </div>
    </div>
  </div>`;
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

  test("button group keyboard focus", async ({ page }) => {
    await page.setContent(
      htmlDoc(
        loadCss("button"),
        `<div class="blora-button-group" aria-label="Text alignment">
          <button type="button" class="blora-button" data-variant="outline">Left</button>
          <button type="button" class="blora-button" data-variant="outline" id="center">Center</button>
          <button type="button" class="blora-button" data-variant="outline">Right</button>
        </div>`,
      ),
    );
    await page.locator("#center").focus();
    await expect(page.locator(".blora-button-group")).toHaveScreenshot("button-group-focus.png", {
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

  for (const component of ["accordion", "collapse"] as const) {
    test(`${component} heading hover`, async ({ page }) => {
      await page.setContent(htmlDoc(loadCss(component), disclosureMarkup(component)));
      const root = page.locator(`.blora-${component}`);
      await root.locator(`.blora-${component}__head`).hover();
      await expect(root).toHaveScreenshot(`${component}-heading-hover.png`, {
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});

test.describe("showcase full component catalog", () => {
  test("floating navbar stays visible and sidebar selection preserves scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${pathToFileURL(showcasePath).href}#mockup`);
    await page.waitForSelector('[data-component-panel="mockup"][data-hydrated="true"]');

    const navbar = page.locator("blora-navbar");
    const initialTop = await navbar.evaluate((element) => element.getBoundingClientRect().top);
    expect(initialTop).toBe(16);
    await page.evaluate(() => scrollTo(0, 1800));
    await page.waitForTimeout(100);
    const scrolledTop = await navbar.evaluate((element) => element.getBoundingClientRect().top);
    expect(Math.abs(scrolledTop - initialTop)).toBeLessThanOrEqual(1);

    const sidebar = page.locator("#component-sidebar");
    await sidebar.evaluate((element) => {
      element.scrollTop = 900;
    });
    const before = await sidebar.evaluate((element) => element.scrollTop);
    await page
      .locator(".blora-sidebar-nav__link[data-value='notification']")
      .evaluate((element) => (element as HTMLElement).click());
    await page.waitForTimeout(100);
    const after = await sidebar.evaluate((element) => element.scrollTop);
    expect(after).toBe(before);
  });

  test("sidebar stays vertically stable when switching from Button to Copy", async ({ page }) => {
    await page.setViewportSize({ width: 1776, height: 1184 });
    await page.goto(`${pathToFileURL(showcasePath).href}#button`);
    await page.waitForSelector('[data-component-panel="button"][data-hydrated="true"]');
    await page.evaluate(() => scrollTo(0, 1800));

    const sidebar = page.locator("#component-sidebar");
    const before = await sidebar.evaluate((element) => ({
      pageScrollTop: scrollY,
      sidebarScrollTop: element.scrollTop,
      sidebarTop: element.getBoundingClientRect().top,
    }));

    await page.locator('.blora-sidebar-nav__link[data-value="copy"]').click();
    await expect(page.locator('[data-component-panel="copy"]')).toBeVisible();
    const after = await sidebar.evaluate((element) => ({
      pageScrollTop: scrollY,
      sidebarScrollTop: element.scrollTop,
      sidebarTop: element.getBoundingClientRect().top,
    }));

    expect(after).toEqual(before);
  });

  test("desktop Accordion catalog", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${pathToFileURL(showcasePath).href}#accordion`);
    await page.locator("html").evaluate((element) => {
      element.setAttribute("data-blora-color-scheme", "light");
    });
    await page.waitForSelector("#demo-accordion .blora-accordion__head");
    await expect(page.locator('[data-example="accordion"]')).toHaveScreenshot(
      "showcase-accordion-preview-panel.png",
      {
        animations: "disabled",
        maxDiffPixelRatio: 0.01,
      },
    );
    await expect(page).toHaveScreenshot("showcase-prototype-desktop.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("showcase heading uses a compact rounded focus indicator", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${pathToFileURL(showcasePath).href}#steps`);
    await page.waitForSelector('[data-component-panel="steps"][data-hydrated="true"]');
    const heading = page.locator('[data-component-panel="steps"] h1');
    await heading.focus();
    const metrics = await heading.evaluate((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        borderRadius: parseFloat(style.borderRadius),
        headingWidth: rect.width,
        outlineWidth: parseFloat(style.outlineWidth),
        parentWidth: element.parentElement!.getBoundingClientRect().width,
      };
    });
    expect(metrics.outlineWidth).toBe(3);
    expect(metrics.borderRadius).toBeGreaterThan(0);
    expect(metrics.headingWidth).toBeLessThan(metrics.parentWidth / 2);
    await expect(heading.locator("..")).toHaveScreenshot("showcase-heading-focus.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });
  });

  test("desktop palette picker open", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${pathToFileURL(showcasePath).href}#accordion`);
    await page.locator("html").evaluate((element) => {
      element.setAttribute("data-blora-color-scheme", "light");
    });
    await page.locator("[data-blora-palette-trigger]").click();
    await expect(page.locator(".blora-palette-picker")).toHaveAttribute("data-open", "");
    await expect(page.locator(".blora-palette-picker__menu")).toHaveScreenshot(
      "showcase-palette-picker-menu-open.png",
      {
        animations: "disabled",
        maxDiffPixelRatio: 0.01,
      },
    );
    await expect(page).toHaveScreenshot("showcase-palette-picker-open.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("desktop Collapse code panel", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${pathToFileURL(showcasePath).href}#collapse`);
    await page.locator("html").evaluate((element) => {
      element.setAttribute("data-blora-color-scheme", "light");
    });
    const example = page.locator('[data-example="collapse"]');
    await example.locator(".blora-tabs__tab").filter({ hasText: "HTML" }).click();
    await expect(example.locator(".showcase-code-panel")).toBeVisible();
    await expect(example).toHaveScreenshot("showcase-collapse-code-panel.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("mobile component sidebar", async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto(`${pathToFileURL(showcasePath).href}#accordion`);
    await page.locator("html").evaluate((element) => {
      element.setAttribute("data-blora-color-scheme", "light");
    });
    await page.locator("blora-sidebar-layout").getByRole("button", { name: "组件导航" }).click();
    const sidebar = page.locator("#component-sidebar");
    await sidebar.evaluate((element) => {
      element.scrollTop = Math.round((element.scrollHeight - element.clientHeight) / 2);
      element.dispatchEvent(new Event("scroll"));
    });
    await expect(sidebar).toHaveAttribute("data-overflow-start", "");
    await expect(sidebar).toHaveAttribute("data-overflow-end", "");
    await expect(sidebar).toHaveCSS("mask-image", "none");
    await expect(page).toHaveScreenshot("showcase-prototype-mobile-sidebar.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  for (const component of [
    "fab",
    "speed-dial",
    "button",
    "avatar",
    "statistic",
    "table",
    "dialog",
    "drawer",
    "effects",
    "layout",
    "markdown",
    "mockup",
    "qrcode",
    "select",
    "tabs",
    "theming",
    "thread",
  ] as const) {
    test(`desktop ${component} catalog`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 960 });
      await page.goto(`${pathToFileURL(showcasePath).href}#${component}`);
      await page.locator("html").evaluate((element) => {
        element.setAttribute("data-blora-color-scheme", "light");
      });
      await expect(page.locator(`[data-component-panel="${component}"]`)).toHaveAttribute(
        "data-hydrated",
        "true",
      );
      const example = page.locator(`[data-example="${component}"]`);
      await expect(example).toHaveScreenshot(`showcase-${component}-preview-panel.png`, {
        animations: "disabled",
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});
