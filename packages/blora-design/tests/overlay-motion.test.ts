import { readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect, beforeEach } from "vitest";
import { BloraDialog, defineBloraDialog } from "../src/components/dialog/index.js";
import { createDrawerController } from "../src/components/drawer/drawer.js";
import { openImagePreview } from "../src/components/image/index.js";
import { BloraCommand, defineBloraCommand } from "../src/components/command-palette/index.js";
import { createTourController } from "../src/components/tour/tour.js";
import { whenMotionDone } from "../src/core/motion.js";

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), "../src");

function readCss(relative: string): string {
  return readFileSync(join(srcRoot, relative), "utf8");
}

function walkCss(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkCss(path));
    else if (extname(path) === ".css") files.push(path);
  }
  return files;
}

describe("overlay motion — discrete CSS path", () => {
  beforeEach(() => {
    defineBloraDialog();
    defineBloraCommand();
    document.body.innerHTML = "";
    document.querySelectorAll(".blora-image-preview").forEach((el) => el.remove());
  });

  it("ships starting-style + allow-discrete on the dialog stylesheet that is inlined at build", () => {
    const css = readCss("components/dialog/dialog.css");
    expect(css).toContain("@starting-style");
    expect(css).toContain("allow-discrete");
    expect(css).not.toContain("data-closing");
    expect(css).not.toMatch(/animation:\s*blora-dialog-/);
    const dialog = document.createElement("blora-dialog") as BloraDialog;
    document.body.append(dialog);
    expect(dialog.shadowRoot?.querySelector(".blora-dialog__panel")).not.toBeNull();
  });

  it("drawer and image preview CSS use the same discrete enter/leave path", () => {
    const drawer = readCss("components/drawer/drawer.css");
    expect(drawer).toContain("@starting-style");
    expect(drawer).toContain("allow-discrete");
    expect(drawer).not.toContain("is-leaving");
    expect(drawer).not.toMatch(/@keyframes\s+blora-drawer-/);

    const image = readCss("components/image/image.css");
    expect(image).toContain("@starting-style");
    expect(image).toContain("allow-discrete");
    expect(image).toContain(".blora-image-preview[data-open]");
  });

  it("command overlay and tour tooltip CSS animate display with starting-style", () => {
    const command = readCss("components/command-palette/command-palette.css");
    expect(command).toContain("blora-command[data-overlay]");
    expect(command).toContain("@starting-style");
    expect(command).toContain("allow-discrete");

    const tour = readCss("components/tour/tour.css");
    expect(tour).toContain(".blora-tour__overlay[data-open]");
    expect(tour).toContain(".blora-tour__tooltip[data-open]");
    expect(tour).toContain("@starting-style");
    /* Opacity on the masked overlay collapses the highlight hole. */
    expect(tour).not.toMatch(/\.blora-tour__overlay\s*\{[^}]*\bopacity\s*:/);
  });

  it("popup menus and megamenu no longer snap via display-only toggles", () => {
    for (const file of [
      "components/autocomplete/autocomplete.css",
      "components/cascader/cascader.css",
      "components/mentions/mentions.css",
      "components/megamenu/megamenu.css",
    ]) {
      const css = readCss(file);
      expect(css, file).toContain("@starting-style");
      expect(css, file).toContain("allow-discrete");
    }
    const treeSelect = readCss("components/tree-select/tree-select.css");
    expect(treeSelect).toContain("grid-template-rows");
    expect(treeSelect).not.toMatch(/\.blora-treeselect__children\s*\{\s*display:\s*none/);
  });

  it("closes a dialog on the real API without data-closing", () => {
    const dialog = document.createElement("blora-dialog") as BloraDialog;
    document.body.append(dialog);
    dialog.show();
    expect(dialog.hasAttribute("open")).toBe(true);
    dialog.close();
    expect(dialog.hasAttribute("open")).toBe(false);
    expect(dialog.hasAttribute("data-closing")).toBe(false);
  });

  it("opens and closes a drawer without is-leaving classes", () => {
    const root = document.createElement("div");
    root.className = "blora-drawer";
    root.innerHTML = `<div class="blora-drawer__mask"></div><div class="blora-drawer__panel"></div>`;
    document.body.append(root);
    const ctrl = createDrawerController(root);
    ctrl.open();
    expect(root.hasAttribute("open")).toBe(true);
    expect(root.classList.contains("is-leaving")).toBe(false);
    ctrl.close();
    expect(root.hasAttribute("open")).toBe(false);
    expect(root.classList.contains("is-leaving")).toBe(false);
    ctrl.destroy();
  });

  it("image preview overlay stays until close() runs the real handle", () => {
    const handle = openImagePreview([{ src: "https://example.com/a.png", alt: "a" }]);
    expect(handle).not.toBeNull();
    const overlay = document.querySelector(".blora-image-preview");
    expect(overlay?.hasAttribute("data-open")).toBe(true);
    handle!.close();
    expect(document.querySelector(".blora-image-preview")).toBeNull();
  });

  it("command show() portals the overlay to body so fixed positioning is viewport-relative", () => {
    const wrap = document.createElement("div");
    wrap.style.transform = "translateX(80px)";
    const command = document.createElement("blora-command") as BloraCommand;
    command.innerHTML = `<blora-command-item value="new" label="新建"></blora-command-item>`;
    wrap.append(command);
    document.body.append(wrap);
    command.show();
    expect(command.parentElement).toBe(document.body);
    expect(command.hasAttribute("open")).toBe(true);
    expect(command.hasAttribute("data-overlay")).toBe(true);
    command.close();
    expect(command.hasAttribute("open")).toBe(false);
    expect(command.parentElement).toBe(wrap);
  });

  it("tour start stamps overlay/tooltip open and punches a highlight hole", () => {
    document.body.innerHTML = `
      <div data-blora-tour>
        <button data-tour-start type="button">start</button>
        <div data-tour-step data-tour-title="A" data-tour-desc="one"><span>A</span></div>
      </div>`;
    const root = document.querySelector<HTMLElement>("[data-blora-tour]")!;
    const tour = createTourController(root);
    tour.start();
    const overlay = document.querySelector<HTMLElement>(".blora-tour__overlay");
    expect(overlay?.hasAttribute("data-open")).toBe(true);
    expect(document.querySelector(".blora-tour__tooltip")?.hasAttribute("data-open")).toBe(true);
    const mask = overlay?.style.maskImage || overlay?.style.webkitMaskImage || "";
    expect(mask).toContain("url(");
    tour.end();
    expect(document.querySelector(".blora-tour__overlay")).toBeNull();
    tour.destroy();
  });
});

describe("motion helpers and consistency", () => {
  it("whenMotionDone fires immediately when the element has no transition", () => {
    const el = document.createElement("div");
    document.body.append(el);
    let done = false;
    whenMotionDone(el, () => {
      done = true;
    });
    expect(done).toBe(true);
  });

  it("component CSS does not use transition: all", () => {
    const hits: string[] = [];
    for (const file of walkCss(join(srcRoot, "components"))) {
      const css = readFileSync(file, "utf8");
      if (/transition(?:-property)?\s*:\s*all\b/.test(css)) hits.push(file);
    }
    expect(hits).toEqual([]);
  });
});
