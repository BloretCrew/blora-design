/**
 * Blora Design 2.0 - Deck controller
 * Stacked cards with drag/wheel navigation (v1 parity).
 */
export interface DeckController {
  destroy(): void;
}

export function createDeckController(root: HTMLElement): DeckController {
  const cards = () =>
    Array.from(root.children).filter((el): el is HTMLElement => el.nodeType === 1);
  if (!cards().length) return { destroy: () => {} };
  if (!root.hasAttribute("tabindex")) root.tabIndex = 0;

  // Slightly larger gap than v1 min so mid cards read clearly in demos
  const GAP = 0.72;
  const STEP_PX = 96;
  const VISIBLE = 2.35;
  const clampN = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  const wrapDelta = (i: number, off: number, n: number) => {
    let d = i - off;
    d -= n * Math.round(d / n);
    return d;
  };
  const poseAt = (d: number) => {
    const ad = Math.abs(d);
    if (ad > VISIBLE) {
      return { y: d > 0 ? -GAP * VISIBLE : GAP * VISIBLE, scale: 0.88, opacity: 0, z: 0 };
    }
    const y = -d * GAP;
    const scale = 1 - clampN(ad, 0, 3) * 0.04;
    // Keep a higher floor so stacked cards stay visible (user feedback vs v1)
    const opacity =
      ad <= 0.15 ? 1 : Math.max(0.28, clampN(1 - (ad - 0.15) / (VISIBLE - 0.15), 0, 1));
    const z = Math.round(40 - ad * 10);
    return { y, scale, opacity, z };
  };

  let offset = (() => {
    const list = cards();
    let i = list.findIndex((c) => c.classList.contains("is-front") || c.hasAttribute("data-front"));
    if (i < 0) i = 0;
    return i;
  })();

  type Drag = {
    y: number;
    startOffset: number;
    locked: "y" | "x" | null;
    ly: number;
    lt: number;
    vy: number;
    pointerId: number;
  } | null;
  let drag: Drag = null;
  let wheelAcc = 0;
  let wheelLock = 0;

  const paint = (dragging: boolean) => {
    const list = cards();
    const n = list.length;
    if (!n) return;
    root.toggleAttribute("data-dragging", dragging);
    let frontIdx = 0;
    let frontScore = Infinity;
    list.forEach((card, i) => {
      const d = wrapDelta(i, offset, n);
      const pose = poseAt(d);
      card.style.setProperty("--blora-deck-y", pose.y + "rem");
      card.style.setProperty("--blora-deck-scale", String(pose.scale));
      card.style.setProperty("--blora-deck-opacity", String(pose.opacity));
      card.style.zIndex = String(pose.z);
      if (Math.abs(d) < frontScore) {
        frontScore = Math.abs(d);
        frontIdx = i;
      }
    });
    list.forEach((card, i) => {
      const isFront = i === frontIdx;
      card.toggleAttribute("data-front", isFront);
      card.setAttribute("aria-hidden", String(!isFront));
    });
  };

  const snap = () => {
    const n = cards().length;
    if (!n) return;
    offset = Math.round(offset);
    offset = ((offset % n) + n) % n;
    paint(false);
  };

  const go = (delta: number) => {
    const n = cards().length;
    if (!n) return;
    offset = Math.round(offset) + delta;
    snap();
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag = {
      y: e.clientY,
      startOffset: offset,
      locked: null,
      ly: e.clientY,
      lt: Date.now(),
      vy: 0,
      pointerId: e.pointerId,
    };
    try {
      root.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const dy = e.clientY - drag.y;
    if (drag.locked == null && (Math.abs(dy) > 6 || Math.abs(e.movementX) > 6)) {
      drag.locked = Math.abs(dy) >= Math.abs(e.movementX) ? "y" : "x";
      if (drag.locked === "x") {
        drag = null;
        return;
      }
    }
    if (drag.locked !== "y") return;
    e.preventDefault();
    const now = Date.now();
    const dt = Math.max(1, now - drag.lt);
    drag.vy = (e.clientY - drag.ly) / dt;
    drag.ly = e.clientY;
    drag.lt = now;
    // v1: finger down (dy>0) → cards follow down → offset increases
    offset = drag.startOffset + dy / STEP_PX;
    paint(true);
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const wasY = drag.locked === "y";
    const vy = drag.vy;
    const start = drag.startOffset;
    drag = null;
    if (!wasY) {
      offset = start;
      paint(false);
      return;
    }
    // v1 velocity snap
    if (vy <= -0.4) offset -= 0.55;
    else if (vy >= 0.4) offset += 0.55;
    snap();
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now < wheelLock) return;
    wheelAcc += e.deltaY;
    if (Math.abs(wheelAcc) > 40) {
      // wheel down → next card (same as drag-down)
      go(wheelAcc > 0 ? 1 : -1);
      wheelAcc = 0;
      wheelLock = now + 280;
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      go(-1);
    }
  };

  root.addEventListener("pointerdown", onPointerDown);
  root.addEventListener("pointermove", onPointerMove);
  root.addEventListener("pointerup", onPointerUp);
  root.addEventListener("pointercancel", onPointerUp);
  root.addEventListener("wheel", onWheel, { passive: false });
  root.addEventListener("keydown", onKey);
  paint(false);

  return {
    destroy() {
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("keydown", onKey);
    },
  };
}
