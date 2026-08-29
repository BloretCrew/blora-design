import { describe, it, expect, beforeEach } from "vitest";
import { applyDocumentLocale, t } from "@bloret-crew/blora-design";
import {
  applyTheme,
  getTheme,
  THEME_PRESETS,
  applyColorScheme,
  getColorScheme,
} from "../src/index.js";

describe("theming add-on", () => {
  beforeEach(() => {
    document.documentElement.lang = "zh-CN";
    applyDocumentLocale();
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("data-blora-theme");
    document.documentElement.removeAttribute("data-blora-color-scheme");
    document.documentElement.style.colorScheme = "";
  });

  it("has the six shipping presets", () => {
    expect(Object.keys(THEME_PRESETS).sort()).toEqual(
      ["circuit", "coral", "dusk", "graphite", "indigo", "mono"].sort(),
    );
  });

  it("applyTheme sets data-blora-theme", () => {
    applyTheme("indigo", document.documentElement, { persist: false, emit: false });
    expect(getTheme()).toBe("indigo");
  });

  it("keeps the selected theme when switching to dark mode", () => {
    applyTheme("indigo", document.documentElement, { persist: false, emit: false });
    applyColorScheme("dark", document.documentElement, { persist: false, emit: false });
    expect(getTheme()).toBe("indigo");
    expect(document.documentElement.getAttribute("data-blora-theme")).toBe("indigo");
  });

  it("palette picker supports an icon-only trigger without removing the menu", () => {
    document.body.innerHTML = `<blora-palette-picker icon-only></blora-palette-picker>`;
    const picker = document.querySelector("blora-palette-picker")!;
    const trigger = picker.querySelector<HTMLButtonElement>(".blora-palette-picker__trigger")!;
    expect(trigger.dataset.iconOnly).toBe("");
    expect(trigger.querySelector(".blora-palette-picker__label")).toBeNull();
    expect(trigger.getAttribute("aria-label")).toBe(t("palette.title"));
    trigger.click();
    expect(picker.querySelector<HTMLElement>(".blora-palette-picker")?.dataset.open).toBe("");
  });

  it("palette picker CE builds options and keeps its closed menu out of layout", () => {
    document.body.innerHTML = `<blora-palette-picker></blora-palette-picker>`;
    const picker = document.querySelector("blora-palette-picker")!;
    const menu = picker.querySelector<HTMLElement>(".blora-palette-picker__menu")!;
    expect(picker.querySelectorAll("[data-blora-palette-option]").length).toBeGreaterThan(3);
    expect(picker.querySelector(".blora-palette-picker__title")?.textContent).toBe(
      t("palette.title"),
    );
    expect(picker.querySelector(".blora-palette-picker__hint")?.textContent).toBe(
      t("palette.hint"),
    );
    expect(menu.hidden).toBe(true);
  });

  it("removes the palette menu from layout after its leave transition", () => {
    document.body.innerHTML = `<blora-palette-picker></blora-palette-picker>`;
    const picker = document.querySelector("blora-palette-picker")!;
    const root = picker.querySelector<HTMLElement>(".blora-palette-picker")!;
    const trigger = picker.querySelector<HTMLButtonElement>(".blora-palette-picker__trigger")!;
    const menu = picker.querySelector<HTMLElement>(".blora-palette-picker__menu")!;

    trigger.click();
    expect(menu.hidden).toBe(false);
    expect(root.hasAttribute("data-open")).toBe(true);

    trigger.click();
    expect(menu.hidden).toBe(false);
    const transitionEnd = new Event("transitionend") as Event & { propertyName: string };
    Object.defineProperty(transitionEnd, "propertyName", { value: "transform" });
    menu.dispatchEvent(transitionEnd);
    expect(menu.hidden).toBe(true);
    expect(root.hasAttribute("data-open")).toBe(false);
  });

  it("palette menu is fixed and start-aligned when there is room", () => {
    document.body.innerHTML = `<blora-palette-picker></blora-palette-picker>`;
    const trigger = document.querySelector<HTMLButtonElement>(".blora-palette-picker__trigger")!;
    const menu = document.querySelector<HTMLElement>(".blora-palette-picker__menu")!;
    trigger.getBoundingClientRect = () =>
      ({
        x: 24,
        y: 80,
        top: 80,
        bottom: 120,
        left: 24,
        right: 120,
        width: 96,
        height: 40,
        toJSON() {
          return {};
        },
      }) as DOMRect;
    Object.defineProperty(menu, "offsetWidth", { configurable: true, value: 320 });
    Object.defineProperty(menu, "offsetHeight", { configurable: true, value: 280 });
    trigger.click();
    expect(menu.style.position).toBe("fixed");
    expect(menu.style.left).toBe("24px");
    expect(menu.style.right).toBe("auto");
  });

  it("palette menu end-aligns when the trigger sits on the right", () => {
    document.body.innerHTML = `<blora-palette-picker></blora-palette-picker>`;
    const trigger = document.querySelector<HTMLButtonElement>(".blora-palette-picker__trigger")!;
    const menu = document.querySelector<HTMLElement>(".blora-palette-picker__menu")!;
    const viewWidth = window.innerWidth;
    trigger.getBoundingClientRect = () =>
      ({
        x: viewWidth - 200,
        y: 80,
        top: 80,
        bottom: 120,
        left: viewWidth - 200,
        right: viewWidth - 80,
        width: 120,
        height: 40,
        toJSON() {
          return {};
        },
      }) as DOMRect;
    Object.defineProperty(menu, "offsetWidth", { configurable: true, value: 320 });
    Object.defineProperty(menu, "offsetHeight", { configurable: true, value: 280 });
    trigger.click();
    expect(menu.style.position).toBe("fixed");
    expect(menu.style.left).toBe("auto");
    expect(menu.style.right).toBe("80px");
  });

  it("palette menu flips to the end when the start side overflows", () => {
    document.body.innerHTML = `<blora-palette-picker></blora-palette-picker>`;
    const trigger = document.querySelector<HTMLButtonElement>(".blora-palette-picker__trigger")!;
    const menu = document.querySelector<HTMLElement>(".blora-palette-picker__menu")!;
    const viewWidth = window.innerWidth;
    trigger.getBoundingClientRect = () =>
      ({
        x: viewWidth - 96,
        y: 80,
        top: 80,
        bottom: 120,
        left: viewWidth - 96,
        right: viewWidth - 16,
        width: 80,
        height: 40,
        toJSON() {
          return {};
        },
      }) as DOMRect;
    Object.defineProperty(menu, "offsetWidth", { configurable: true, value: 320 });
    Object.defineProperty(menu, "offsetHeight", { configurable: true, value: 280 });
    trigger.click();
    expect(menu.style.position).toBe("fixed");
    expect(menu.style.left).toBe("auto");
    expect(menu.style.right).toBe("16px");
  });

  it("palette menu flips above a trigger near the viewport bottom", () => {
    document.body.innerHTML = `<blora-palette-picker></blora-palette-picker>`;
    const trigger = document.querySelector<HTMLButtonElement>(".blora-palette-picker__trigger")!;
    const menu = document.querySelector<HTMLElement>(".blora-palette-picker__menu")!;
    const triggerTop = window.innerHeight - 60;
    trigger.getBoundingClientRect = () =>
      ({
        x: 24,
        y: triggerTop,
        top: triggerTop,
        bottom: triggerTop + 40,
        left: 24,
        right: 120,
        width: 96,
        height: 40,
        toJSON() {
          return {};
        },
      }) as DOMRect;
    Object.defineProperty(menu, "offsetWidth", { configurable: true, value: 320 });
    Object.defineProperty(menu, "offsetHeight", { configurable: true, value: 280 });

    trigger.click();

    expect(menu.style.position).toBe("fixed");
    expect(Number.parseFloat(menu.style.top)).toBe(triggerTop - 8 - 280);
    expect(Number.parseFloat(menu.style.top) + 280).toBeLessThan(triggerTop);
  });

  it("keeps a placed menu fixed on the same frame as close", () => {
    document.body.innerHTML = `<blora-palette-picker></blora-palette-picker>`;
    const trigger = document.querySelector<HTMLButtonElement>(".blora-palette-picker__trigger")!;
    const menu = document.querySelector<HTMLElement>(".blora-palette-picker__menu")!;
    trigger.getBoundingClientRect = () =>
      ({
        x: 24,
        y: 80,
        top: 80,
        bottom: 120,
        left: 24,
        right: 120,
        width: 96,
        height: 40,
        toJSON() {
          return {};
        },
      }) as DOMRect;
    Object.defineProperty(menu, "offsetWidth", { configurable: true, value: 320 });
    trigger.click();
    expect(menu.style.position).toBe("fixed");
    trigger.click();
    expect(menu.style.position).toBe("fixed");
  });

  it("color scheme toggle CE changes the scheme", () => {
    document.body.innerHTML = `<blora-color-scheme-toggle></blora-color-scheme-toggle>`;
    document.querySelector<HTMLButtonElement>("blora-color-scheme-toggle button")!.click();
    expect(getColorScheme()).toBe("dark");
  });

  it("applyColorScheme sets dark attribute", () => {
    applyColorScheme("dark", document.documentElement, { persist: false, emit: false });
    expect(getColorScheme()).toBe("dark");
    applyColorScheme("light", document.documentElement, { persist: false, emit: false });
    expect(getColorScheme()).toBe("light");
  });

  it("keeps the chosen theme after a color-scheme toggle", () => {
    applyTheme("indigo", document.documentElement, { persist: false, emit: false });
    applyColorScheme("dark", document.documentElement, { persist: false, emit: false });
    expect(getTheme()).toBe("indigo");
    expect(document.documentElement.getAttribute("data-blora-theme")).toBe("indigo");
    expect(document.body.hasAttribute("data-blora-color-scheme")).toBe(false);
    applyTheme("graphite", document.documentElement, { persist: false, emit: false });
    expect(getTheme()).toBe("graphite");
    applyColorScheme("light", document.documentElement, { persist: false, emit: false });
    expect(getTheme()).toBe("graphite");
    expect(document.body.hasAttribute("data-blora-color-scheme")).toBe(false);
  });
});
