/**
 * Blora Design 2.0 - Effects add-on.
 * Spec §9: Add-on package, not bundled into core.
 * Includes textFx + text-rotate / countdown / countup / diff / hover-gallery /
 * watermark / shortcut hints (migrated from core 2026-08).
 * @packageDocumentation
 */

export {
  createTextRotateController,
  createCountdownController,
  createCountUpController,
  createImageDiffController,
  createHoverGalleryController,
  createWatermarkController,
  initShortcutHints,
  formatShortcut,
  getShortcutPlatform,
  type TextRotateController,
  type CountdownController,
  type CountUpController,
  type ImageDiffController,
  type HoverGalleryController,
  type WatermarkController,
} from "./extras.js";

export type TextFxName =
  "big" | "small" | "shake" | "nod" | "disperse" | "ripple" | "bloom" | "jitter";

export interface TextFxOptions {
  /** Loop the animation (default: false) */
  loop?: boolean;
  /** Make the element clickable (default: false) */
  clickable?: boolean;
}

const TEXT_FX: TextFxName[] = ["big", "small", "shake", "nod", "disperse", "ripple", "bloom", "jitter"];

const TEXT_FX_SET = new Set<string>(TEXT_FX);

const TEXT_FX_SPLIT: TextFxName[] = ["shake", "disperse", "ripple", "bloom", "jitter"];

function textFxNameFromEl(el: HTMLElement): string {
  const raw = (el.getAttribute("data-blora-text-fx") || "").trim().toLowerCase();
  if (TEXT_FX_SET.has(raw)) return raw;
  for (const fx of TEXT_FX) {
    if (el.classList.contains(`blora-text-fx--${fx}`)) return fx;
  }
  return "";
}

function prefersReduced(el: HTMLElement): boolean {
  const win = el.ownerDocument?.defaultView;
  return !!win?.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function layoutTextFxPhysics(el: HTMLElement, name: string): void {
  const chars = el.querySelectorAll(".blora-text-fx__ch");
  const n = chars.length || 1;
  const mid = (n - 1) / 2;

  chars.forEach((span, i) => {
    const charSpan = span as HTMLElement;
    const ratio = n <= 1 ? 0.5 : i / (n - 1);
    charSpan.style.setProperty("--i", String(i));
    charSpan.style.setProperty("--fx-ratio", ratio.toFixed(3));

    if (name === "disperse") {
      const angle = (ratio - 0.5) * 1.6 + (Math.random() - 0.5) * 0.5;
      const dist = 1.4 + Math.random() * 1.1;
      const x = Math.sin(angle) * dist;
      const y = -Math.cos(angle) * dist - Math.random() * 0.5;
      const r = (Math.random() - 0.5) * 50;
      charSpan.style.setProperty("--fx-x", `${x.toFixed(2)}em`);
      charSpan.style.setProperty("--fx-y", `${y.toFixed(2)}em`);
      charSpan.style.setProperty("--fx-r", `${r.toFixed(1)}deg`);
    } else if (name === "bloom") {
      charSpan.style.setProperty("--fx-center-delay", `${Math.round(Math.abs(i - mid) * 28)}ms`);
    } else {
      charSpan.style.removeProperty("--fx-x");
      charSpan.style.removeProperty("--fx-y");
      charSpan.style.removeProperty("--fx-r");
      charSpan.style.removeProperty("--fx-center-delay");
    }
  });
}

function splitTextFxLetters(el: HTMLElement): void {
  if (el.dataset.bloraFxSplit === "1") {
    layoutTextFxPhysics(el, textFxNameFromEl(el));
    return;
  }

  const text = el.textContent || "";
  el.textContent = "";

  Array.from(text).forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "blora-text-fx__ch";
    span.style.setProperty("--i", String(i));
    span.textContent = ch === " " ? "\u00a0" : ch;
    el.appendChild(span);
  });

  el.dataset.bloraFxSplit = "1";
  el.dataset.bloraFxText = text;
  layoutTextFxPhysics(el, textFxNameFromEl(el));
}

function unsplitTextFxLetters(el: HTMLElement): void {
  if (el.dataset.bloraFxSplit !== "1") return;

  const text = el.dataset.bloraFxText ?? "";
  el.textContent = text;
  el.removeAttribute("data-blora-fx-split");
  el.removeAttribute("data-blora-fx-text");
}

function applyTextFxName(el: HTMLElement, name: TextFxName): boolean {
  if (!TEXT_FX_SET.has(name)) return false;

  el.classList.add("blora-text-fx");

  for (const fx of TEXT_FX) {
    el.classList.remove(`blora-text-fx--${fx}`);
  }
  el.classList.add(`blora-text-fx--${name}`);

  el.setAttribute("data-blora-text-fx", name);

  if (TEXT_FX_SPLIT.includes(name)) {
    splitTextFxLetters(el);
    layoutTextFxPhysics(el, name);
  } else {
    unsplitTextFxLetters(el);
  }

  return true;
}

function restartTextFxAnimation(el: HTMLElement): void {
  el.classList.remove("is-play");
  el.querySelectorAll(".blora-text-fx__ch").forEach((ch) => {
    (ch as HTMLElement).style.animation = "none";
  });
  // Force reflow
  void el.offsetWidth;
  el.querySelectorAll(".blora-text-fx__ch").forEach((ch) => {
    (ch as HTMLElement).style.animation = "";
  });
  el.classList.add("is-play");
}

/**
 * Apply a text effect to a target element.
 *
 * @param target - The element to apply the effect to
 * @param name - Effect name (big, small, shake, nod, disperse, ripple, bloom, jitter)
 * @param options - Loop and clickable options
 * @returns The element if successful, null otherwise
 */
export function textFx(
  target: HTMLElement,
  name?: TextFxName,
  options?: TextFxOptions,
): HTMLElement | null {
  if (typeof document === "undefined") return null;
  if (!target) return null;

  if (name) {
    if (!applyTextFxName(target, name)) return null;
  } else {
    if (!textFxNameFromEl(target)) return null;
    layoutTextFxPhysics(target, textFxNameFromEl(target));
  }

  if (options?.loop) {
    target.classList.add("is-loop");
  } else {
    target.classList.remove("is-loop");
  }

  if (options?.clickable) {
    target.classList.add("is-clickable");
  } else {
    target.classList.remove("is-clickable");
  }

  if (prefersReduced(target)) {
    target.classList.add("is-play");
    return target;
  }

  restartTextFxAnimation(target);
  return target;
}
