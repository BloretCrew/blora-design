/**
 * Global adaptive focus ring.
 *
 * The CSS `outline` fallback follows `border-radius`, but a handful of Blora
 * containers use `corner-shape: superellipse(...)` (which outline does not
 * follow) and welded/scroll groups can clip an external ring. This module draws
 * one per-document overlay ring in viewport coordinates and measures the focused
 * element's corner radii — the same approach the Tour spotlight uses — so every
 * Blora focus indicator hugs the target's own shape.
 *
 * When JS is active the root gets `blora-js-focus-ring`, which turns off the CSS
 * outline for in-scope `:focus-visible` targets so the two never double up; the
 * CSS rule stays as a no-JS fallback.
 */

function cssLengthToPx(value: string, axis: number): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  if (trimmed.endsWith("%")) return (Number.parseFloat(trimmed) / 100) * axis;
  return Number.parseFloat(trimmed) || 0;
}

function cornerRadius(value: string, axis: number, pad: number): number {
  return cssLengthToPx(value.trim().split(/\s+/)[0] ?? "0px", axis) + pad;
}

function clampCornerRadii(
  width: number,
  height: number,
  radii: { tl: number; tr: number; br: number; bl: number },
): { tl: number; tr: number; br: number; bl: number } {
  const maxRadius = Math.max(0, Math.min(width, height) / 2);
  const clamp = (value: number): number => Math.max(0, Math.min(value, maxRadius));
  return {
    tl: clamp(radii.tl),
    tr: clamp(radii.tr),
    br: clamp(radii.br),
    bl: clamp(radii.bl),
  };
}

const RING_PAD = 2;

const rings = new WeakMap<Document, HTMLDivElement>();

function ringFor(doc: Document): HTMLDivElement {
  let ring = rings.get(doc);
  if (!ring) {
    ring = doc.createElement("div");
    ring.className = "blora-focus-ring";
    ring.setAttribute("aria-hidden", "true");
    (doc.body ?? doc.documentElement).appendChild(ring);
    rings.set(doc, ring);
  }
  return ring;
}

function isInScope(target: HTMLElement): boolean {
  return (
    target.matches('[class^="blora-"], [class*=" blora-"]') ||
    !!target.closest(".blora-page, .blora-scope, .blora-portal")
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable]';

function isFocusable(target: HTMLElement): boolean {
  return target.matches(FOCUSABLE);
}

let currentTarget: HTMLElement | null = null;
let currentDoc: Document | null = null;
let targetObserver: MutationObserver | null = null;

function reposition(): void {
  if (!currentTarget || !currentTarget.isConnected) return;
  const doc = currentTarget.ownerDocument;
  const ring = rings.get(doc);
  if (!ring) return;
  const rect = currentTarget.getBoundingClientRect();
  if (!rect.width && !rect.height) return;
  const win = doc.defaultView!;
  const style = win.getComputedStyle(currentTarget);
  const pad = RING_PAD;
  const width = Math.max(0, rect.width + pad * 2);
  const height = Math.max(0, rect.height + pad * 2);
  const radii = clampCornerRadii(width, height, {
    tl: cornerRadius(style.borderTopLeftRadius, rect.width, pad),
    tr: cornerRadius(style.borderTopRightRadius, rect.width, pad),
    br: cornerRadius(style.borderBottomRightRadius, rect.width, pad),
    bl: cornerRadius(style.borderBottomLeftRadius, rect.width, pad),
  });
  const cornerShape = style.getPropertyValue("corner-shape").trim();
  ring.style.left = `${rect.left - pad}px`;
  ring.style.top = `${rect.top - pad}px`;
  ring.style.width = `${width}px`;
  ring.style.height = `${height}px`;
  ring.style.borderRadius = `${radii.tl}px ${radii.tr}px ${radii.br}px ${radii.bl}px`;
  if (cornerShape && cornerShape !== "round") {
    ring.style.setProperty("corner-shape", cornerShape);
  } else {
    ring.style.removeProperty("corner-shape");
  }
}

function show(target: HTMLElement): void {
  const doc = target.ownerDocument;
  const ring = ringFor(doc);
  targetObserver?.disconnect();
  currentTarget = target;
  currentDoc = doc;
  reposition();
  ring.dataset.open = "";
  if (typeof MutationObserver !== "undefined") {
    targetObserver = new MutationObserver(() => {
      if (currentTarget) reposition();
    });
    targetObserver.observe(target, { attributes: true, childList: true, subtree: true });
  }
}

function hide(): void {
  targetObserver?.disconnect();
  targetObserver = null;
  if (currentDoc && currentTarget) {
    const ring = rings.get(currentDoc);
    if (ring) {
      delete ring.dataset.open;
      ring.removeAttribute("style");
    }
  }
  currentTarget = null;
  currentDoc = null;
}

function onFocusIn(event: FocusEvent): void {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!isInScope(target) || !isFocusable(target)) return;
  show(target);
}

function onFocusOut(event: FocusEvent): void {
  const related = event.relatedTarget;
  if (related instanceof HTMLElement && isInScope(related) && isFocusable(related)) {
    return; // moving within the scope; the next focusin repositions the ring
  }
  hide();
}

export function initFocusRing(): void {
  if (typeof document === "undefined") return;
  document.body?.classList.add("blora-js-focus-ring");
  document.addEventListener("focusin", onFocusIn as EventListener, true);
  document.addEventListener("focusout", onFocusOut as EventListener, true);
  const win = document.defaultView;
  win?.addEventListener("scroll", reposition, true);
  win?.addEventListener("resize", reposition);
}
