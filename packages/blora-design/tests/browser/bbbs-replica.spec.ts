import { test, expect } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const homePath = resolve(import.meta.dirname, "../../../..", "examples/bbbs-replica/index.html");

async function sidebarGeometry(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const aside = document.querySelector<HTMLElement>(".blora-sidebar-layout__aside")!;
    const search = document.querySelector<HTMLElement>("blora-search")!;
    const input = search.querySelector<HTMLInputElement>("input")!;
    const icon = search.querySelector<HTMLElement>(".blora-search__icon")!;
    const clear = search.querySelector<HTMLElement>(".blora-search__clear")!;
    const asideRect = aside.getBoundingClientRect();
    const searchRect = search.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();
    const clearRect = clear.getBoundingClientRect();
    const asideStyle = getComputedStyle(aside);
    const bodyStyle = getComputedStyle(document.body);
    return {
      bodyClasses: [...document.body.classList],
      asideOverflowX: asideStyle.overflowX,
      asideScrollLeft: aside.scrollLeft,
      asideScrollWidth: aside.scrollWidth,
      asideClientWidth: aside.clientWidth,
      asideScrollbarColor: asideStyle.scrollbarColor,
      bodyScrollbarColor: bodyStyle.scrollbarColor,
      searchInsideAside:
        searchRect.left >= asideRect.left && searchRect.right <= asideRect.right + 0.5,
      inputInsideSearch:
        inputRect.left >= searchRect.left && inputRect.right <= searchRect.right + 0.5,
      iconInsideSearch:
        iconRect.left >= searchRect.left && iconRect.right <= searchRect.right + 0.5,
      clearInsideSearch:
        clear.hidden ||
        (clearRect.left >= searchRect.left && clearRect.right <= searchRect.right + 0.5),
    };
  });
}

test("BBBS replica search and sidebar remain contained across theme changes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(pathToFileURL(homePath).href);
  await page.waitForFunction(
    () =>
      customElements.get("blora-sidebar-layout") &&
      customElements.get("blora-palette-picker") &&
      customElements.get("blora-search"),
  );
  await page.waitForTimeout(300);

  const initial = await sidebarGeometry(page);
  expect(initial.bodyClasses).toEqual(expect.arrayContaining(["blora-page", "blora-scope"]));
  expect(initial.asideOverflowX).toBe("hidden");
  expect(initial.asideScrollLeft).toBe(0);
  expect(initial.asideScrollWidth).toBeLessThanOrEqual(initial.asideClientWidth + 1);
  expect(initial.asideScrollbarColor).not.toBe("auto");
  expect(initial.bodyScrollbarColor).not.toBe("auto");
  expect(initial.searchInsideAside).toBe(true);
  expect(initial.inputInsideSearch).toBe(true);
  expect(initial.iconInsideSearch).toBe(true);
  expect(initial.clearInsideSearch).toBe(true);

  const palette = page.locator("blora-palette-picker");
  const paletteRoot = palette.locator(".blora-palette-picker");
  const paletteTrigger = palette.locator("[data-blora-palette-trigger]");
  const paletteMenu = palette.locator(".blora-palette-picker__menu");
  await expect(paletteMenu).toHaveAttribute("hidden", "");
  await paletteTrigger.click();
  await expect(paletteRoot).toHaveAttribute("data-open", "");
  await expect(paletteMenu).not.toHaveAttribute("hidden", "");
  const palettePlacement = await page.evaluate(() => {
    const trigger = document.querySelector<HTMLElement>("[data-blora-palette-trigger]")!;
    const menu = document.querySelector<HTMLElement>(".blora-palette-picker__menu")!;
    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    return {
      insideViewport:
        menuRect.top >= 0 &&
        menuRect.left >= 0 &&
        menuRect.right <= window.innerWidth &&
        menuRect.bottom <= window.innerHeight,
      aboveTrigger: menuRect.bottom <= triggerRect.top,
    };
  });
  expect(palettePlacement.insideViewport).toBe(true);
  expect(palettePlacement.aboveTrigger).toBe(true);
  await paletteTrigger.click();
  await expect(paletteRoot).not.toHaveAttribute("data-open", "");
  await expect(paletteMenu).toHaveAttribute("hidden", "");

  await page.locator("blora-color-scheme-toggle button").click();
  await page.locator("blora-search input").fill("BBBS");
  const after = await sidebarGeometry(page);
  expect(after.asideScrollLeft).toBe(0);
  expect(after.asideScrollWidth).toBeLessThanOrEqual(after.asideClientWidth + 1);
  expect(after.searchInsideAside).toBe(true);
  expect(after.inputInsideSearch).toBe(true);
  expect(after.iconInsideSearch).toBe(true);
  expect(after.clearInsideSearch).toBe(true);
});
