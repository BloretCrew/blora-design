/**
 * Blora Design 2.0 - Deck controller
 * Stacked cards with drag/wheel navigation (v1 parity).
 */
import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";

export const BLORA_DECK_TAG = "blora-deck";

export interface DeckController {
  destroy(): void;
  next(): void;
  prev(): void;
  goTo(index: number): void;
  getCurrent(): number;
}

export function createDeckController(root: HTMLElement): DeckController {
  const cards = () =>
    Array.from(root.children).filter((el): el is HTMLElement => el.nodeType === 1);
  if (!cards().length)
    return {
      destroy: () => {},
      next: () => {},
      prev: () => {},
      goTo: () => {},
      getCurrent: () => 0,
    };
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
    let i = list.findIndex((c) => c.hasAttribute("data-front"));
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
    root.dispatchEvent(
      new CustomEvent("blora-deck-change", { bubbles: true, detail: { index: offset } }),
    );
  };

  const go = (delta: number) => {
    const n = cards().length;
    if (!n) return;
    offset = Math.round(offset) + delta;
    snap();
  };
  const goTo = (index: number) => {
    offset = index;
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
    next: () => go(1),
    prev: () => go(-1),
    goTo,
    getCurrent: () => Math.round(offset),
  };
}

interface DeckCardDefinition {
  front: boolean;
  nodes: Node[];
  variant: string;
}

/** Deck CE that consumes declarative cards and owns drag/wheel/keyboard navigation. */
export class BloraDeck extends BloraElement {
  private controller: DeckController | null = null;
  private definitions: DeckCardDefinition[] | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["current", "label"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get current(): number {
    return this.controller?.getCurrent() ?? Number(this.getAttribute("current") ?? 0);
  }

  set current(index: number) {
    this.setAttribute("current", String(index));
  }

  next(): void {
    this.controller?.next();
  }

  prev(): void {
    this.controller?.prev();
  }

  goTo(index: number): void {
    this.controller?.goTo(index);
  }

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-deck-card")
        .map((item) => ({
          front: item.hasAttribute("front"),
          nodes: Array.from(item.childNodes).map((node) => node.cloneNode(true)),
          variant: item.getAttribute("variant") ?? "flat",
        }));
    }
    const current = Number(this.getAttribute("current") ?? 0);
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-deck";
    root.dataset.bloraGenerated = "";
    root.tabIndex = 0;
    root.setAttribute("aria-label", this.getAttribute("label") ?? t("deck.label"));
    this.definitions.forEach((definition, index) => {
      const card = this.ownerDocument.createElement("article");
      card.className = "blora-card";
      card.dataset.variant = definition.variant;
      if (definition.front || index === current) card.dataset.front = "";
      card.append(...definition.nodes.map((node) => node.cloneNode(true)));
      root.appendChild(card);
    });
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const field = this.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    if (field) {
      field.disabled = this.hasAttribute("disabled");
      if (this.hasAttribute("placeholder"))
        field.placeholder = this.getAttribute("placeholder") ?? "";
      if (this.hasAttribute("value") && this.ownerDocument.activeElement !== field) {
        field.value = this.getAttribute("value") ?? field.value;
      }
    }
    this.rebind();
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-deck");
    if (!root) return;
    this.controller = createDeckController(root);
    const current = Number(this.getAttribute("current") ?? 0);
    if (current) this.controller.goTo(current);
    this.listen(root, "blora-deck-change", (event) => {
      const index = (event as CustomEvent<{ index: number }>).detail.index;
      this.reflecting = true;
      this.setAttribute("current", String(index));
      this.reflecting = false;
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraDeck(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_DECK_TAG)) return;
  registry.define(BLORA_DECK_TAG, BloraDeck);
}
