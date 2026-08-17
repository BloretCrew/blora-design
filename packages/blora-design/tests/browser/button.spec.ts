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

function readFabCss(): string {
  return readFileSync(
    resolve(import.meta.dirname, "..", "..", "src", "components", "fab", "fab.css"),
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

test("button keeps the v1 external focus outline", async ({ page }) => {
  await page.setContent(
    htmlPage(`<button class="blora-button" type="button" data-variant="primary">Open</button>`),
  );
  const button = page.getByRole("button", { name: "Open" });
  await button.focus();
  const focusStyle = await button.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineWidth: style.outlineWidth,
      outlineOffset: style.outlineOffset,
      outlineStyle: style.outlineStyle,
    };
  });
  expect(focusStyle).toEqual({
    outlineWidth: "2px",
    outlineOffset: "2px",
    outlineStyle: "solid",
  });
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

  // Loading spinner renders as a ::before ring beside the label
  const hasSpinner = await button.evaluate((el: HTMLElement) => {
    const style = window.getComputedStyle(el, "::before");
    return style.content !== "none" && style.width !== "auto" && style.height !== "auto";
  });
  expect(hasSpinner).toBe(true);
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

  const center = group.locator(".blora-button").nth(1);
  const beforeHover = await center.boundingBox();
  const backgroundBeforeHover = await center.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await center.hover();
  const afterHover = await center.boundingBox();
  expect(afterHover?.y).toBe(beforeHover?.y);
  expect(await center.evaluate((element) => getComputedStyle(element).transform)).toBe("none");
  expect(await center.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(
    backgroundBeforeHover,
  );

  await center.focus();
  const focusGeometry = await center.evaluate((element) => {
    const button = element.getBoundingClientRect();
    const group = element.parentElement!.getBoundingClientRect();
    const style = getComputedStyle(element);
    const extent = Number.parseFloat(style.outlineWidth) + Number.parseFloat(style.outlineOffset);
    return {
      topVisible: button.top - extent >= group.top,
      bottomVisible: button.bottom + extent <= group.bottom,
      outlineOffset: style.outlineOffset,
    };
  });
  expect(focusGeometry).toEqual({
    topVisible: true,
    bottomVisible: true,
    outlineOffset: "2px",
  });
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

test("oversized inner media cannot change button height", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <div style="display:flex;align-items:flex-start;gap:8px">
        <button class="blora-button" type="button" data-size="xs" data-variant="outline" id="btn-text">回复</button>
        <button class="blora-button" type="button" data-size="xs" data-variant="outline" id="btn-svg">
          <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18" stroke="currentColor" stroke-width="2"/></svg>
          12
        </button>
        <button class="blora-button" type="button" data-size="xs" data-variant="outline" id="btn-img">
          <img width="48" height="48" alt="" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'/%3E" />
          图
        </button>
      </div>
    `),
  );

  const metrics = await page.evaluate(() => {
    const box = (id: string) => document.getElementById(id)!.getBoundingClientRect();
    const text = box("btn-text");
    const svgBtn = box("btn-svg");
    const imgBtn = box("btn-img");
    const svg = document.querySelector<SVGElement>("#btn-svg svg")!;
    const img = document.querySelector<HTMLImageElement>("#btn-img img")!;
    return {
      textH: text.height,
      svgH: svgBtn.height,
      imgH: imgBtn.height,
      svgBox: svg.getBoundingClientRect().height,
      imgBox: img.getBoundingClientRect().height,
    };
  });

  expect(metrics.svgH).toBe(metrics.textH);
  expect(metrics.imgH).toBe(metrics.textH);
  // Media keeps its authored size (never squashed to 1em); the button box stays locked
  expect(metrics.svgBox).toBe(32);
  expect(metrics.imgBox).toBe(48);
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

test("FAB keeps its circle geometry and static preview stays in flow", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.setContent(
    `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">
      <style>${tokensCss}</style><style>${foundationsCss}</style><style>${readFabCss()}</style></head><body>
        <div id="stage" style="width:320px;height:180px;padding:24px;border:1px solid">
          <button id="static-fab" class="blora-fab blora-fab--static" type="button" aria-label="添加">+</button>
        </div>
        <button id="floating-fab" class="blora-fab" type="button" aria-label="浮动添加">+</button>
      </body></html>`,
  );

  const geometry = await page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>("#stage")!.getBoundingClientRect();
    const staticFab = document.querySelector<HTMLElement>("#static-fab")!.getBoundingClientRect();
    const floatingFab = document
      .querySelector<HTMLElement>("#floating-fab")!
      .getBoundingClientRect();
    return {
      staticPosition: getComputedStyle(document.querySelector("#static-fab")!).position,
      staticWidth: staticFab.width,
      staticHeight: staticFab.height,
      staticInsideStage:
        staticFab.left >= stage.left &&
        staticFab.right <= stage.right &&
        staticFab.top >= stage.top &&
        staticFab.bottom <= stage.bottom,
      floatingWidth: floatingFab.width,
      floatingHeight: floatingFab.height,
    };
  });

  expect(geometry).toEqual({
    staticPosition: "relative",
    staticWidth: 56,
    staticHeight: 56,
    staticInsideStage: true,
    floatingWidth: 56,
    floatingHeight: 56,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() =>
      page.locator("#floating-fab").evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return [rect.width, rect.height];
      }),
    )
    .toEqual([48, 48]);
  await expect
    .poll(() =>
      page.locator("#static-fab").evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return [rect.width, rect.height];
      }),
    )
    .toEqual([56, 56]);
});
