import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createAffixController, createAnchorController, initSmoothScroll } from "../src/index.js";
import type { BloraSidebarLayout } from "../src/index.js";

const srcDir = dirname(fileURLToPath(import.meta.url));

describe("layout add-on", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("sidebar CE opens and closes in drawer width", () => {
    document.body.innerHTML = `
      <blora-sidebar-layout toggle-label="菜单">
        <blora-sidebar-layout-sidebar><a href="#x">链接</a></blora-sidebar-layout-sidebar>
        <blora-sidebar-layout-content>内容</blora-sidebar-layout-content>
      </blora-sidebar-layout>`;
    const host = document.querySelector<BloraSidebarLayout>("blora-sidebar-layout")!;
    const root = host.querySelector<HTMLElement>(".blora-sidebar-layout")!;
    /* jsdom getBoundingClientRect often returns 0 — force drawer metrics */
    Object.defineProperty(root, "clientWidth", { configurable: true, get: () => 360 });
    root.getBoundingClientRect = () =>
      ({
        width: 360,
        height: 400,
        top: 0,
        left: 0,
        bottom: 400,
        right: 360,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    window.dispatchEvent(new Event("resize"));
    expect(
      root.hasAttribute("data-drawer") || root.classList.contains("blora-sidebar-layout--drawer"),
    ).toBe(true);
    host.open();
    expect(root.hasAttribute("data-open")).toBe(true);

    const mask = root.querySelector<HTMLElement>(".blora-sidebar-layout__mask")!;
    mask.click();
    expect(root.hasAttribute("data-open")).toBe(false);

    host.open();
    root.querySelector("a")!.click();
    expect(root.hasAttribute("data-open")).toBe(false);
  });

  it("sidebar CE ignores open when wide (desktop columns)", () => {
    document.body.innerHTML = `
      <blora-sidebar-layout>
        <blora-sidebar-layout-sidebar></blora-sidebar-layout-sidebar>
        <blora-sidebar-layout-content></blora-sidebar-layout-content>
      </blora-sidebar-layout>`;
    const host = document.querySelector<BloraSidebarLayout>("blora-sidebar-layout")!;
    const root = host.querySelector<HTMLElement>(".blora-sidebar-layout")!;
    Object.defineProperty(root, "clientWidth", { configurable: true, get: () => 1100 });
    root.getBoundingClientRect = () =>
      ({
        width: 1100,
        height: 400,
        top: 0,
        left: 0,
        bottom: 400,
        right: 1100,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    window.dispatchEvent(new Event("resize"));
    host.open();
    expect(root.hasAttribute("data-open")).toBe(false);
  });

  it("marks overflow edges when the aside can scroll", () => {
    document.body.innerHTML = `
      <blora-sidebar-layout sticky>
        <blora-sidebar-layout-sidebar><a href="#x">链接</a></blora-sidebar-layout-sidebar>
        <blora-sidebar-layout-content>内容</blora-sidebar-layout-content>
      </blora-sidebar-layout>`;
    const aside = document.querySelector<HTMLElement>(".blora-sidebar-layout__aside")!;
    Object.defineProperty(aside, "scrollHeight", { configurable: true, get: () => 800 });
    Object.defineProperty(aside, "clientHeight", { configurable: true, get: () => 400 });
    Object.defineProperty(aside, "scrollTop", { configurable: true, writable: true, value: 0 });

    aside.dispatchEvent(new Event("scroll"));
    expect(aside.hasAttribute("data-overflow-start")).toBe(false);
    expect(aside.hasAttribute("data-overflow-end")).toBe(true);

    aside.scrollTop = 200;
    aside.dispatchEvent(new Event("scroll"));
    expect(aside.hasAttribute("data-overflow-start")).toBe(true);
    expect(aside.hasAttribute("data-overflow-end")).toBe(true);

    aside.scrollTop = 400;
    aside.dispatchEvent(new Event("scroll"));
    expect(aside.hasAttribute("data-overflow-start")).toBe(true);
    expect(aside.hasAttribute("data-overflow-end")).toBe(false);
  });

  it("preserves a sticky sidebar position when its content shrinks", async () => {
    document.body.innerHTML = `
      <blora-sidebar-layout sticky>
        <blora-sidebar-layout-sidebar>导航</blora-sidebar-layout-sidebar>
        <blora-sidebar-layout-content><section id="panel">内容</section></blora-sidebar-layout-content>
      </blora-sidebar-layout>`;
    const root = document.querySelector<HTMLElement>(".blora-sidebar-layout")!;
    let rootHeight = 2400;
    root.getBoundingClientRect = () =>
      ({
        width: 1100,
        height: rootHeight,
        top: 100 - window.scrollY,
        left: 0,
        bottom: 100 - window.scrollY + rootHeight,
        right: 1100,
        x: 0,
        y: 100 - window.scrollY,
        toJSON: () => ({}),
      }) as DOMRect;
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 900 });
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation((options) => {
      if (typeof options === "object") window.scrollY = Number(options.top ?? 0);
    });
    window.dispatchEvent(new Event("scroll"));

    rootHeight = 400;
    document.querySelector("#panel")!.setAttribute("hidden", "");
    await Promise.resolve();

    expect(root.style.minHeight).toBe("1600px");
    expect(scrollTo).toHaveBeenCalledWith({ top: 900, behavior: "instant" });
    scrollTo.mockRestore();
  });

  it("affix controller destroys", () => {
    document.body.innerHTML = `<div class="blora-affix" data-offset="0"><div>Hi</div></div>`;
    const root = document.querySelector<HTMLElement>(".blora-affix")!;
    const ctrl = createAffixController(root);
    expect(root.querySelector(".blora-affix__inner")).not.toBeNull();
    ctrl.destroy();
  });

  it("anchor controller marks active", () => {
    document.body.innerHTML = `
      <div id="s1" style="height:10px"></div>
      <nav class="blora-anchor"><a href="#s1">一</a></nav>`;
    const nav = document.querySelector<HTMLElement>(".blora-anchor")!;
    const ctrl = createAnchorController(nav);
    expect(nav.querySelector("a")?.classList.contains("blora-anchor__link")).toBe(true);
    ctrl.destroy();
  });

  it("blora-affix owns the inner wrap", () => {
    document.body.innerHTML = `<blora-affix offset="8"><span>Hi</span></blora-affix>`;
    const el = document.querySelector("blora-affix")!;
    expect(el.classList.contains("blora-affix")).toBe(true);
    expect(el.querySelector(".blora-affix__inner")).not.toBeNull();
  });

  it("blora-anchor marks links", () => {
    document.body.innerHTML = `
      <div id="s1"></div>
      <blora-anchor offset="80"><a href="#s1">一</a></blora-anchor>`;
    const el = document.querySelector("blora-anchor")!;
    expect(el.classList.contains("blora-anchor")).toBe(true);
    expect(el.querySelector("a")?.classList.contains("blora-anchor__link")).toBe(true);
  });

  it("initSmoothScroll installs once", () => {
    const off = initSmoothScroll(document);
    expect(typeof off).toBe("function");
    off();
  });

  it("resets sidebar tokens on each host so nested shells do not inherit page chrome", () => {
    const css = readFileSync(resolve(srcDir, "../src/layout.css"), "utf8");
    const hostBlock = css.match(/(?:^|\n)blora-sidebar-layout\s*\{[^}]+\}/)?.[0] ?? "";
    expect(hostBlock).toContain("--blora-sidebar-min-height: 28rem");
    expect(hostBlock).toContain("--blora-sidebar-aside-background:");
    expect(hostBlock).toContain("--blora-sidebar-aside-padding:");
    expect(hostBlock).toContain("--blora-sidebar-content-padding:");
    expect(css).toMatch(
      /blora-sidebar-layout\[compact\]\s*\{[^}]*--blora-sidebar-min-height:\s*20rem/s,
    );
  });

  it("anchors sticky edge fades to the aside viewport instead of content flow", () => {
    const css = readFileSync(resolve(srcDir, "../src/layout.css"), "utf8");
    const before =
      [...css.matchAll(/\.blora-sidebar-layout__aside::before\s*\{([^}]+)\}/g)]
        .map((match) => match[1])
        .find((block) => block.includes("position: absolute")) ?? "";
    const after =
      [...css.matchAll(/\.blora-sidebar-layout__aside::after\s*\{([^}]+)\}/g)]
        .map((match) => match[1])
        .find((block) => block.includes("position: absolute")) ?? "";
    expect(before).toContain("position: absolute");
    expect(before).toContain("inset-inline: 0");
    expect(after).toContain("position: absolute");
    expect(after).toContain("inset-block-end: 0");
    expect(after).toContain("inset-inline: 0");
  });
});
