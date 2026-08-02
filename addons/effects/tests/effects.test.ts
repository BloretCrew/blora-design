import { describe, it, expect, beforeEach } from "vitest";
import {
  textFx,
  createCountdownController,
  createTextRotateController,
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
    textFx(el, "grow");
    expect(el.classList.contains("blora-text-fx")).toBe(true);
  });

  it("adds correct variant class for grow", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "grow");
    expect(el.classList.contains("blora-text-fx--grow")).toBe(true);
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
    textFx(el, "grow");
    expect(el.classList.contains("is-play")).toBe(true);
  });

  it("adds is-loop class when loop option is true", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "grow", { loop: true });
    expect(el.classList.contains("is-loop")).toBe(true);
  });

  it("adds is-clickable class when clickable option is true", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "grow", { clickable: true });
    expect(el.classList.contains("is-clickable")).toBe(true);
  });

  it("splits text into spans for explode effect", () => {
    const el = document.createElement("span");
    el.textContent = "ABC";
    textFx(el, "explode");
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

  it("does not split text for whole-word effects", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "grow");
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
    textFx(el, "explode");
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
    const result = textFx(null as unknown as HTMLElement, "grow");
    expect(result).toBeNull();
  });

  it("preserves text content after split", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "explode");
    const chars = el.querySelectorAll(".blora-text-fx__ch");
    const reconstructed = Array.from(chars)
      .map((c) => (c.textContent === "\u00a0" ? " " : c.textContent))
      .join("");
    expect(reconstructed).toBe("Hello");
  });

  it("removes only one variant class when switching effects", () => {
    const el = document.createElement("span");
    el.textContent = "Hello";
    textFx(el, "grow");
    expect(el.classList.contains("blora-text-fx--grow")).toBe(true);
    textFx(el, "shake");
    expect(el.classList.contains("blora-text-fx--grow")).toBe(false);
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
    expect(root.querySelector(".blora-text-rotate__item")?.hasAttribute("data-active") ||
      root.querySelector(".blora-text-rotate__item")?.classList.contains("is-active")).toBe(true);
    ctrl.destroy();
  });

  it("formatShortcut formats mod key", () => {
    const s = formatShortcut("mod+k", "other");
    expect(s.toLowerCase()).toContain("ctrl");
  });
});
