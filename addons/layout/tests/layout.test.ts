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

  it("sidebar opens and closes", () => {
    document.body.innerHTML = `
      <div class="blora-sidebar-layout" data-blora-sidebar-layout>
        <button type="button" data-blora-sidebar-toggle>菜单</button>
        <aside class="blora-sidebar-layout__aside"></aside>
        <div class="blora-sidebar-layout__mask"></div>
        <div class="blora-sidebar-layout__content"></div>
      </div>`;
    const root = document.querySelector<HTMLElement>(".blora-sidebar-layout")!;
    const ctrl = createSidebarLayoutController(root);
    ctrl.open();
    expect(root.classList.contains("is-open")).toBe(true);
    ctrl.close();
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
