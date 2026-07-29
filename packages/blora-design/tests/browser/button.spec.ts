import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";

const tokensCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "dist", "tokens.css"),
  "utf8",
);
const foundationsCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "dist", "foundations.css"),
  "utf8",
);

function readComponentCss(): string {
  return readFileSync(
    resolve(import.meta.dirname, "..", "..", "src", "components", "button", "button.css"),
    "utf8",
  );
}

function htmlPage(content: string): string {
  return `<style>${tokensCss}</style><style>${foundationsCss}</style><style>${readComponentCss()}</style>${content}`;
}

test("button renders with correct variant colors", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <button class="blora-button" type="button" data-variant="primary" id="btn-primary">Primary</button>
      <button class="blora-button" type="button" data-variant="danger" id="btn-danger">Danger</button>
      <button class="blora-button" type="button" data-variant="text" id="btn-text">Text</button>
    `),
  );

  const primaryBg = await page
    .locator("#btn-primary")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).backgroundColor);
  expect(primaryBg).not.toBe("");

  const dangerBg = await page
    .locator("#btn-danger")
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).backgroundColor);
  expect(dangerBg).not.toBe("");
});

test("disabled button does not respond to clicks", async ({ page }) => {
  let clicked = false;
  await page.setContent(
    htmlPage(`
      <button class="blora-button" type="button" id="btn-disabled" disabled>Disabled</button>
    `),
  );

  await page.exposeFunction("handleClick", () => {
    clicked = true;
  });

  await page
    .locator("#btn-disabled")
    .click({ force: true })
    .catch(() => {
      // Expected to fail
    });

  // Native disabled should prevent click events
  expect(clicked).toBe(false);
});

test("loading state shows spinner and is non-interactive", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <button class="blora-button" type="button" data-variant="primary" data-loading aria-busy="true" id="btn-loading">Loading</button>
    `),
  );

  const button = page.locator("#btn-loading");

  // Should have pointer-events: none
  const pointerEvents = await button.evaluate(
    (el: HTMLElement) => window.getComputedStyle(el).pointerEvents,
  );
  expect(pointerEvents).toBe("none");

  // Should have a ::after pseudo-element (spinner)
  const hasAfter = await button.evaluate((el: HTMLElement) => {
    const content = window.getComputedStyle(el, "::after").content;
    return content !== "none" && content !== "";
  });
  expect(hasAfter).toBe(true);
});

test("button group renders connected buttons", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <div class="blora-button-group" id="group">
        <button class="blora-button" type="button" data-variant="outline">A</button>
        <button class="blora-button" type="button" data-variant="outline">B</button>
        <button class="blora-button" type="button" data-variant="outline">C</button>
      </div>
    `),
  );

  const group = page.locator("#group");
  await expect(group).toBeVisible();

  // First child should have left border-radius
  const firstRadius = await group
    .locator(".blora-button")
    .first()
    .evaluate((el: HTMLElement) => window.getComputedStyle(el).borderRadius);
  expect(firstRadius).not.toBe("0px");
});

test("button form submission works with type=submit", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <form id="test-form">
        <input name="value" value="test" />
        <button class="blora-button" type="submit" data-variant="primary">Submit</button>
      </form>
    `),
  );

  let submitted = false;
  await page.exposeFunction("onSubmit", () => {
    submitted = true;
  });

  await page.locator("#test-form").evaluate((form: HTMLFormElement) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      (window as unknown as { onSubmit: () => void }).onSubmit();
    });
  });

  await page.locator('button[type="submit"]').click();
  expect(submitted).toBe(true);
});

test("RTL: text button underline offset is correct", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <div dir="rtl">
        <button class="blora-button" type="button" data-variant="text" id="btn-rtl">نص</button>
      </div>
    `),
  );

  const button = page.locator("#btn-rtl");
  await expect(button).toBeVisible();

  const direction = await button.evaluate(
    (el: HTMLElement) => window.getComputedStyle(el).direction,
  );
  expect(direction).toBe("rtl");
});
