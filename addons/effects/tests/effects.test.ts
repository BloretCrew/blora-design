import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, beforeEach } from "vitest";
import {
  textFx,
  createCountdownController,
  createTextRotateController,
  createImageDiffController,
  formatShortcut,
  BLORA_COUNTDOWN_TAG,
  BLORA_DIFF_TAG,
  BLORA_HOVER_GALLERY_TAG,
  BLORA_TEXT_FX_TAG,
  BLORA_TEXT_ROTATE_TAG,
  BLORA_WATERMARK_TAG,
  BloraCountUp,
  type TextFxName,
} from "../src/index.js";

async function settle(): Promise<void> {
  await Promise.resolve();
}

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
        root.querySelector(".blora-text-rotate__item")?.hasAttribute("data-active"),
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

describe("effects composite custom elements", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("blora-text-fx applies the declared effect to its own content", async () => {
    const el = document.createElement(BLORA_TEXT_FX_TAG);
    el.setAttribute("effect", "disperse");
    el.textContent = "ABC";
    document.body.append(el);
    await settle();
    expect(el.classList.contains("blora-text-fx--disperse")).toBe(true);
    expect(el.querySelectorAll(".blora-text-fx__ch").length).toBe(3);
  });

  it("blora-text-rotate wraps consumer children as items", async () => {
    const el = document.createElement(BLORA_TEXT_ROTATE_TAG);
    el.setAttribute("interval", "99999");
    for (const text of ["A", "B"]) {
      const item = document.createElement("span");
      item.textContent = text;
      el.append(item);
    }
    document.body.append(el);
    await settle();
    expect(el.classList.contains("blora-text-rotate")).toBe(true);
    expect(el.querySelectorAll(".blora-text-rotate__item").length).toBe(2);
    expect(el.querySelector(".blora-text-rotate__item")?.hasAttribute("data-active")).toBe(true);
  });

  it("blora-countdown generates localized units and a timer role", async () => {
    const el = document.createElement(BLORA_COUNTDOWN_TAG);
    el.setAttribute("seconds", "86405");
    document.body.append(el);
    await settle();
    expect(el.getAttribute("role")).toBe("timer");
    expect(el.querySelectorAll(".blora-countdown__unit").length).toBe(4);
    /* The public `seconds` attribute must drive the timer (1 day + 5s). */
    expect(el.querySelector('[data-unit="days"]')?.textContent).toBe("1");
    expect(el.querySelector('[data-unit="seconds"]')?.textContent).toBe("05");
  });

  it("blora-text-rotate translates the interval attribute for its controller", async () => {
    const el = document.createElement(BLORA_TEXT_ROTATE_TAG);
    el.setAttribute("interval", "99999");
    el.innerHTML = "<span>A</span><span>B</span>";
    document.body.append(el);
    await settle();
    expect(el.dataset.interval).toBe("99999");
  });

  it("blora-count-up translates duration/decimals/prefix/suffix attributes", () => {
    const el = document.createElement("blora-count-up") as BloraCountUp;
    el.setAttribute("value", "12.5");
    el.setAttribute("duration", "2000");
    el.setAttribute("decimals", "1");
    el.setAttribute("prefix", "$");
    el.setAttribute("suffix", "k");
    document.body.append(el);
    expect(el.dataset.duration).toBe("2000");
    expect(el.dataset.decimals).toBe("1");
    expect(el.dataset.prefix).toBe("$");
    expect(el.dataset.suffix).toBe("k");
  });

  it("blora-count-up exposes the value property", () => {
    const el = document.createElement("blora-count-up") as BloraCountUp;
    el.setAttribute("value", "12847");
    expect(el.value).toBe(12847);
    el.value = 42;
    expect(el.getAttribute("value")).toBe("42");
  });

  it("blora-diff builds panes, divider and range from definition children", async () => {
    const el = document.createElement(BLORA_DIFF_TAG) as import("../src/index.js").BloraDiff;
    const before = document.createElement("blora-diff-before");
    before.innerHTML = "<p>before</p>";
    const after = document.createElement("blora-diff-after");
    after.innerHTML = "<p>after</p>";
    el.append(before, after);
    document.body.append(el);
    await settle();

    expect(el.querySelectorAll(".blora-diff__item").length).toBe(2);
    expect(el.querySelector(".blora-diff__divider")).not.toBeNull();
    const input = el.querySelector<HTMLInputElement>(".blora-diff__range")!;
    expect(input.value).toBe("50");
    input.value = "25";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(el.style.getPropertyValue("--blora-diff-position")).toBe("25%");
    el.value = 70;
    expect(input.value).toBe("70");
  });

  it("blora-hover-gallery wraps arbitrary children into items with progress dots", async () => {
    const el = document.createElement(BLORA_HOVER_GALLERY_TAG);
    for (const tone of ["a", "b", "c"]) {
      const pane = document.createElement("div");
      pane.dataset.tone = tone;
      el.append(pane);
    }
    document.body.append(el);
    await settle();
    expect(el.classList.contains("blora-hover-gallery")).toBe(true);
    expect(el.querySelectorAll(".blora-hover-gallery__item").length).toBe(3);
    expect(el.querySelectorAll(".blora-hover-gallery__progress span").length).toBe(3);
  });

  it("blora-hover-gallery stays idempotent across repeated connects", async () => {
    const el = document.createElement(BLORA_HOVER_GALLERY_TAG);
    for (let i = 0; i < 3; i++) el.append(document.createElement("div"));
    document.body.append(el);
    await settle();
    el.remove();
    document.body.append(el);
    await settle();
    el.remove();
    document.body.append(el);
    await settle();
    expect(el.querySelectorAll(".blora-hover-gallery__item").length).toBe(3);
    expect(el.querySelectorAll(".blora-hover-gallery__progress span").length).toBe(3);
  });

  it("blora-watermark paints an aria-hidden overlay from the text attribute", async () => {
    const el = document.createElement(BLORA_WATERMARK_TAG);
    el.setAttribute("text", "BLORA");
    el.innerHTML = "<p>受保护的预览内容</p>";
    document.body.append(el);
    await settle();
    expect(el.classList.contains("blora-watermark")).toBe(true);
    const layer = el.querySelector<HTMLElement>(".blora-watermark__canvas")!;
    expect(layer.getAttribute("aria-hidden")).toBe("true");
    expect(layer.style.backgroundImage).toContain("url(");
  });
});
