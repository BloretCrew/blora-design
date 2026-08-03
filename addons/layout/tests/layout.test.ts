import { describe, it, expect, beforeEach } from "vitest";
import {
  createSidebarLayoutController,
  createAffixController,
  createAnchorController,
  initSmoothScroll,
} from "../src/index.js";

describe("layout add-on", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("sidebar opens and closes in drawer width", () => {
    document.body.innerHTML = `
      <div class="blora-sidebar-layout" data-blora-sidebar-layout style="width:360px">
        <button type="button" data-blora-sidebar-toggle>菜单</button>
        <aside class="blora-sidebar-layout__aside"><a href="#x">链接</a></aside>
        <div class="blora-sidebar-layout__mask"></div>
        <div class="blora-sidebar-layout__content"></div>
      </div>`;
    const root = document.querySelector<HTMLElement>(".blora-sidebar-layout")!;
    /* jsdom getBoundingClientRect often returns 0 — force drawer metrics */
    Object.defineProperty(root, "clientWidth", { configurable: true, get: () => 360 });
    root.getBoundingClientRect = () =>
      ({ width: 360, height: 400, top: 0, left: 0, bottom: 400, right: 360, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

    const ctrl = createSidebarLayoutController(root);
    expect(root.hasAttribute("data-drawer") || root.classList.contains("blora-sidebar-layout--drawer")).toBe(
      true,
    );
    ctrl.open();
    expect(root.classList.contains("is-open")).toBe(true);

    const mask = root.querySelector<HTMLElement>(".blora-sidebar-layout__mask")!;
    mask.click();
    expect(root.classList.contains("is-open")).toBe(false);

    ctrl.open();
    root.querySelector("a")!.click();
    expect(root.classList.contains("is-open")).toBe(false);

    ctrl.destroy();
  });

  it("sidebar ignores open when wide (desktop columns)", () => {
    document.body.innerHTML = `
      <div class="blora-sidebar-layout" style="width:1100px">
        <button type="button" data-blora-sidebar-toggle>菜单</button>
        <aside class="blora-sidebar-layout__aside"></aside>
        <div class="blora-sidebar-layout__mask"></div>
        <div class="blora-sidebar-layout__content"></div>
      </div>`;
    const root = document.querySelector<HTMLElement>(".blora-sidebar-layout")!;
    Object.defineProperty(root, "clientWidth", { configurable: true, get: () => 1100 });
    root.getBoundingClientRect = () =>
      ({ width: 1100, height: 400, top: 0, left: 0, bottom: 400, right: 1100, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
    const ctrl = createSidebarLayoutController(root);
    ctrl.open();
    expect(root.classList.contains("is-open")).toBe(false);
    ctrl.destroy();
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

  it("initSmoothScroll installs once", () => {
    const off = initSmoothScroll(document);
    expect(typeof off).toBe("function");
    off();
  });
});
