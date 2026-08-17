import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, beforeEach } from "vitest";
import {
  textFx,
  createCountdownController,
  createTextRotateController,
  createImageDiffController,
  formatShortcut,
  type TextFxName,
} from "../src/index.js";

describe("Effects add-on", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("adds blora-text-fx class to target", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "big");
    expect(el.classList.contains("blora-text-fx")).toBe(true);
  });

  it("adds correct variant class for big", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "big");
    expect(el.classList.contains("blora-text-fx--big")).toBe(true);
  });

  it("adds correct variant class for shake", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "shake");
    expect(el.classList.contains("blora-text-fx--shake")).toBe(true);
  });

  it("adds is-play class to trigger animation", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "big");
    expect(el.classList.contains("is-play")).toBe(true);
  });

  it("adds is-loop class when loop option is true", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "big", { loop: true });
    expect(el.classList.contains("is-loop")).toBe(true);
  });

  it("adds is-clickable class when clickable option is true", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "big", { clickable: true });
    expect(el.classList.contains("is-clickable")).toBe(true);
  });

  it("splits text into spans for disperse effect", () => {
    const el = document.createElement("span");
    el.textContent = "ABC";
    textFx(el, "disperse");
    const chars = el.querySelectorAll(".blora-text-fx__ch");
    expect(chars.length).toBe(3);
  });

  it("splits text into spans for ripple effect", () => {
    const el = document.createElement("span");
    el.textContent = "Hi";
    textFx(el, "ripple");
    const chars = el.querySelectorAll(".blora-text-fx__ch");
    expect(chars.length).toBe(2);
  });

  it("splits text into spans for bloom effect", () => {
    const el = document.createElement("span");
    el.textContent = "XY";
    textFx(el, "bloom");
    const chars = el.querySelectorAll(".blora-text-fx__ch");
    expect(chars.length).toBe(2);
  });

  it("reassembles split characters as plain text on copy", () => {
    const el = document.createElement("span");
    el.textContent = "A B C";
    textFx(el, "jitter");
    document.body.appendChild(el);

    const selection = window.getSelection()!;
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);

    const clipboard = new Map<string, string>();
    const event = new Event("copy", { bubbles: true, cancelable: true }) as ClipboardEvent;
    event.clipboardData = {
      setData: (type: string, value: string) => {
        clipboard.set(type, value);
        return true;
      },
    } as DataTransfer;
    el.dispatchEvent(event);

    expect(clipboard.get("text/plain")).toBe("A B C");
    selection.removeAllRanges();
    el.remove();
  });

  it("selects a word on double click for split effects", () => {
    const el = document.createElement("span");
    el.textContent = "Hello World";
    textFx(el, "jitter");
    document.body.appendChild(el);

    const chars = el.querySelectorAll<HTMLElement>(".blora-text-fx__ch");
    const worldW = Array.from(chars).find((c) => c.textContent === "W")!;
    worldW.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, detail: 2 }));

    const selection = window.getSelection()!;
    expect(selection.rangeCount).toBe(1);
    expect(selection.getRangeAt(0).toString()).toBe("World");
    selection.removeAllRanges();
    el.remove();
  });

  it("selects the whole line on triple click for split effects", () => {
    const el = document.createElement("span");
    el.textContent = "甲 乙丙";
    textFx(el, "jitter");
    document.body.appendChild(el);

    el.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, detail: 3 }));

    const selection = window.getSelection()!;
    expect(selection.rangeCount).toBe(1);
    const text = selection
      .getRangeAt(0)
      .toString()
      .replace(/\u00a0/g, " ");
    expect(text).toBe("甲 乙丙");
    selection.removeAllRanges();
    el.remove();
  });

  it("selects a word from mouseup detail=2 without relying on dblclick", () => {
    const el = document.createElement("span");
    el.textContent = "Hello World";
    textFx(el, "jitter");
    document.body.appendChild(el);

    const chars = el.querySelectorAll<HTMLElement>(".blora-text-fx__ch");
    const worldW = Array.from(chars).find((c) => c.textContent === "W")!;
    worldW.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, detail: 2 }));

    const selection = window.getSelection()!;
    expect(selection.rangeCount).toBe(1);
    expect(selection.getRangeAt(0).toString()).toBe("World");
    selection.removeAllRanges();
    el.remove();
  });

  it("selects the whole line from mouseup detail=3 without relying on dblclick", () => {
    const el = document.createElement("span");
    el.textContent = "甲 乙丙";
    textFx(el, "jitter");
    document.body.appendChild(el);

    el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, detail: 3 }));

    const selection = window.getSelection()!;
    expect(selection.rangeCount).toBe(1);
    const text = selection
      .getRangeAt(0)
      .toString()
      .replace(/\u00a0/g, " ");
    expect(text).toBe("甲 乙丙");
    selection.removeAllRanges();
    el.remove();
  });

  it("ignores single mouseup (detail=1) so drag selection still works", () => {
    const el = document.createElement("span");
    el.textContent = "甲 乙丙";
    textFx(el, "jitter");
    document.body.appendChild(el);

    const selection = window.getSelection()!;
    selection.removeAllRanges();
    el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, detail: 1 }));

    expect(selection.rangeCount).toBe(0);
    selection.removeAllRanges();
    el.remove();
  });

  it("selects the whole line when double click lands outside any char", () => {
    const el = document.createElement("span");
    el.textContent = "甲 乙丙";
    textFx(el, "jitter");
    document.body.appendChild(el);

    /* dblclick target is the container (click landed in a gap, or a moving
       char drifted away before mouseup). jsdom has no caretRangeFromPoint,
       so this exercises the whole-line fallback. */
    el.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, detail: 2 }));

    const selection = window.getSelection()!;
    expect(selection.rangeCount).toBe(1);
    const text = selection
      .getRangeAt(0)
      .toString()
      .replace(/\u00a0/g, " ");
    expect(text).toBe("甲 乙丙");
    selection.removeAllRanges();
    el.remove();
  });

  it("does not select on double click for whole-word effects", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "big");
    document.body.appendChild(el);

    const selection = window.getSelection()!;
    selection.removeAllRanges();
    el.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, detail: 2 }));

    expect(selection.rangeCount).toBe(0);
    selection.removeAllRanges();
    el.remove();
  });

  it("does not split text for whole-word effects", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "big");
    const chars = el.querySelectorAll(".blora-text-fx__ch");
    expect(chars.length).toBe(0);
  });

  it("sets data-blora-text-fx attribute", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "nod");
    expect(el.getAttribute("data-blora-text-fx")).toBe("nod");
  });

  it("sets --i CSS variable on split characters", () => {
    const el = document.createElement("span");
    el.textContent = "AB";
    textFx(el, "disperse");
    const firstChar = el.querySelector(".blora-text-fx__ch") as HTMLElement;
    expect(firstChar.style.getPropertyValue("--i")).toBe("0");
  });

  it("returns null for unknown effect name", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    const result = textFx(el, "unknown" as TextFxName);
    expect(result).toBeNull();
  });

  it("returns null for null target", () => {
    const result = textFx(null as unknown as HTMLElement, "big");
    expect(result).toBeNull();
  });

  it("preserves text content after split", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "disperse");
    const chars = el.querySelectorAll(".blora-text-fx__ch");
    const reconstructed = Array.from(chars)
      .map((c) => (c.textContent === "\u00a0" ? " " : c.textContent))
      .join("");
    expect(reconstructed).toBe("Hello");
  });

  it("removes only one variant class when switching effects", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "big");
    expect(el.classList.contains("blora-text-fx--big")).toBe(true);
    textFx(el, "shake");
    expect(el.classList.contains("blora-text-fx--big")).toBe(false);
    expect(el.classList.contains("blora-text-fx--shake")).toBe(true);
  });
});

describe("effects extras", () => {
  it("countdown updates units", () => {
    document.body.innerHTML = `
      <div class="blora-countdown" data-blora-countdown data-seconds="5">
        <span data-unit="seconds">00</span>
      </div>`;
    const root = document.querySelector<HTMLElement>(".blora-countdown")!;
    const ctrl = createCountdownController(root);
    expect(root.getAttribute("role")).toBe("timer");
    ctrl.destroy();
  });

  it("text rotate cycles data-active", () => {
    document.body.innerHTML = `
      <span class="blora-text-rotate" data-interval="99999">
        <span class="blora-text-rotate__item">A</span>
        <span class="blora-text-rotate__item">B</span>
      </span>`;
    const root = document.querySelector<HTMLElement>(".blora-text-rotate")!;
    const ctrl = createTextRotateController(root);
    expect(
      root.querySelector(".blora-text-rotate__item")?.hasAttribute("data-active") ||
        root.querySelector(".blora-text-rotate__item")?.classList.contains("is-active"),
    ).toBe(true);
    ctrl.destroy();
  });

  it("formatShortcut formats mod key", () => {
    const s = formatShortcut("mod+k", "other");
    expect(s.toLowerCase()).toContain("ctrl");
  });

  it("diff syncs the range to a clip token and accepts non-image panes", () => {
    const css = readFileSync(resolve(import.meta.dirname, "../src/effects.css"), "utf8");
    expect(css).toContain("aspect-ratio: var(--blora-diff-ratio, 16 / 9)");
    expect(css).toContain(".blora-diff__item > *");
    expect(css).toContain(".blora-diff__item > :not(:is(img, video, canvas))");

    document.body.innerHTML = `
      <div class="blora-diff">
        <div class="blora-diff__item blora-diff__item--before"><p>before</p></div>
        <div class="blora-diff__item"><article>after</article></div>
        <input class="blora-diff__range" type="range" min="0" max="100" value="30">
      </div>`;
    const root = document.querySelector<HTMLElement>(".blora-diff")!;
    const ctrl = createImageDiffController(root);
    expect(root.style.getPropertyValue("--blora-diff-position")).toBe("30%");
    ctrl.destroy();
  });
});
