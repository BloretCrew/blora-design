/**
 * Blora Design 2.0 - Carousel controller
 * Arrows/dots + pointer/touch drag swipe (v1 parity).
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_CAROUSEL_TAG = "blora-carousel";

export interface CarouselController {
  destroy(): void;
  next(): void;
  prev(): void;
  goTo(i: number): void;
}

export function createCarouselController(root: HTMLElement): CarouselController {
  const track = root.querySelector<HTMLElement>(".blora-carousel__track");
  const slides = Array.from(root.querySelectorAll<HTMLElement>(".blora-carousel__slide"));
  const dots = Array.from(root.querySelectorAll<HTMLElement>(".blora-carousel__dot"));
  const prevBtn = root.querySelector<HTMLElement>(".blora-carousel__arrow--prev");
  const nextBtn = root.querySelector<HTMLElement>(".blora-carousel__arrow--next");

  if (!track || slides.length === 0) {
    return { destroy: () => {}, next: () => {}, prev: () => {}, goTo: () => {} };
  }

  let current = 0;
  let autoplayTimer: ReturnType<typeof setInterval> | null = null;
  const autoplay = root.hasAttribute("data-autoplay");
  const last = slides.length - 1;
  const THRESHOLD = 0.2;
  const VELOCITY = 0.35;

  type Drag = {
    x: number;
    y: number;
    dx: number;
    locked: "x" | "y" | null;
    lx: number;
    lt: number;
    vx: number;
    pointerId: number;
  } | null;
  let drag: Drag = null;

  const paint = (animate: boolean) => {
    track.classList.toggle("is-dragging", !animate);
    track.toggleAttribute("data-dragging", !animate);
    track.style.transform = `translate3d(${-current * 100}%, 0, 0)`;
    dots.forEach((dot, idx) => {
      if (idx === current) dot.setAttribute("data-active", "");
      else dot.removeAttribute("data-active");
    });
  };

  const goTo = (i: number) => {
    current = ((i % slides.length) + slides.length) % slides.length;
    paint(true);
    root.dispatchEvent(
      new CustomEvent("blora-carousel-change", { bubbles: true, detail: { index: current } }),
    );
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const startAutoplay = () => {
    if (!autoplay) return;
    stopAutoplay();
    autoplayTimer = setInterval(next, 3500);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const widthOf = () => root.getBoundingClientRect().width || 1;
  const resist = (dx: number) => {
    if ((current === 0 && dx > 0) || (current === last && dx < 0)) return dx * 0.35;
    return dx;
  };
  const applyDrag = (dx: number) => {
    const offset = resist(dx);
    track.classList.add("is-dragging");
    track.setAttribute("data-dragging", "");
    track.style.transform = `translate3d(calc(${-current * 100}% + ${offset}px), 0, 0)`;
  };

  const onDragStart = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (
      target.closest?.(
        ".blora-carousel__arrow, .blora-carousel__dot, a, button, input, textarea, select, label",
      )
    )
      return;
    drag = {
      x: e.clientX,
      y: e.clientY,
      dx: 0,
      locked: null,
      lx: e.clientX,
      lt: Date.now(),
      vx: 0,
      pointerId: e.pointerId,
    };
    try {
      root.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    stopAutoplay();
  };

  const onDragMove = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (drag.locked == null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      drag.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (drag.locked === "y") {
        drag = null;
        if (autoplay) startAutoplay();
        return;
      }
    }
    if (drag.locked !== "x") return;
    if (e.cancelable) e.preventDefault();
    const now = Date.now();
    const dt = Math.max(1, now - drag.lt);
    drag.vx = (e.clientX - drag.lx) / dt;
    drag.lx = e.clientX;
    drag.lt = now;
    drag.dx = dx;
    applyDrag(dx);
  };

  const finishDrag = (cancelled: boolean) => {
    if (!drag) return;
    const dx = drag.dx;
    const vx = drag.vx;
    const wasX = drag.locked === "x";
    drag = null;
    track.classList.remove("is-dragging");
    track.removeAttribute("data-dragging");
    if (!wasX || cancelled) {
      paint(true);
    } else {
      const w = widthOf();
      let nextIdx = current;
      if (dx <= -w * THRESHOLD || vx <= -VELOCITY) nextIdx = current + 1;
      else if (dx >= w * THRESHOLD || vx >= VELOCITY) nextIdx = current - 1;
      current = Math.max(0, Math.min(last, nextIdx));
      paint(true);
    }
    if (autoplay) startAutoplay();
  };

  const onDragEnd = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (drag.locked === "x") {
      drag.dx = e.clientX - drag.x;
      const now = Date.now();
      const dt = Math.max(1, now - drag.lt);
      drag.vx = (e.clientX - drag.lx) / dt;
    }
    finishDrag(false);
  };
  const onDragCancel = () => finishDrag(true);

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);
  const dotHandlers = dots.map((dot, idx) => {
    const fn = () => goTo(idx);
    dot.addEventListener("click", fn);
    return { dot, fn };
  });

  root.addEventListener("pointerdown", onDragStart);
  root.addEventListener("pointermove", onDragMove);
  root.addEventListener("pointerup", onDragEnd);
  root.addEventListener("pointercancel", onDragCancel);
  root.style.touchAction = "pan-y";

  if (autoplay) {
    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);
    startAutoplay();
  }

  goTo(0);

  return {
    destroy() {
      stopAutoplay();
      prevBtn?.removeEventListener("click", prev);
      nextBtn?.removeEventListener("click", next);
      dotHandlers.forEach(({ dot, fn }) => dot.removeEventListener("click", fn));
      root.removeEventListener("pointerdown", onDragStart);
      root.removeEventListener("pointermove", onDragMove);
      root.removeEventListener("pointerup", onDragEnd);
      root.removeEventListener("pointercancel", onDragCancel);
      root.removeEventListener("mouseenter", stopAutoplay);
      root.removeEventListener("mouseleave", startAutoplay);
    },
    next,
    prev,
    goTo,
  };
}

interface CarouselSlideDefinition {
  label: string;
  nodes: Node[];
}

function carouselArrow(doc: Document, direction: "prev" | "next"): HTMLButtonElement {
  const button = doc.createElement("button");
  button.className = `blora-carousel__arrow blora-carousel__arrow--${direction}`;
  button.type = "button";
  button.setAttribute("aria-label", direction === "prev" ? "上一张" : "下一张");
  button.appendChild(
    createBloraIcon(direction === "prev" ? "chevron-left" : "chevron-right", 18, doc),
  );
  return button;
}

/** Carousel CE that consumes declarative slides and owns navigation controls. */
export class BloraCarousel extends BloraElement {
  private controller: CarouselController | null = null;
  private definitions: CarouselSlideDefinition[] | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["current", "autoplay", "label"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get current(): number {
    return Number(this.getAttribute("current") ?? 0);
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
        .filter((item) => item.localName === "blora-carousel-slide")
        .map((item) => ({
          label: item.getAttribute("label") ?? "",
          nodes: Array.from(item.childNodes).map((node) => node.cloneNode(true)),
        }));
    }
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-carousel";
    root.dataset.bloraGenerated = "";
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", this.getAttribute("label") ?? "轮播图");
    if (this.hasAttribute("autoplay")) root.dataset.autoplay = "";
    const track = this.ownerDocument.createElement("div");
    track.className = "blora-carousel__track";
    this.definitions.forEach((definition, index) => {
      const slide = this.ownerDocument.createElement("div");
      slide.className = "blora-carousel__slide";
      slide.setAttribute("role", "group");
      slide.setAttribute(
        "aria-label",
        definition.label || `${index + 1} / ${this.definitions!.length}`,
      );
      slide.append(...definition.nodes.map((node) => node.cloneNode(true)));
      track.appendChild(slide);
    });
    const dots = this.ownerDocument.createElement("div");
    dots.className = "blora-carousel__dots";
    this.definitions.forEach((_, index) => {
      const dot = this.ownerDocument.createElement("button");
      dot.className = "blora-carousel__dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `转到第 ${index + 1} 张`);
      dots.appendChild(dot);
    });
    root.append(
      track,
      carouselArrow(this.ownerDocument, "prev"),
      carouselArrow(this.ownerDocument, "next"),
      dots,
    );
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
    const root = this.querySelector<HTMLElement>(".blora-carousel");
    if (!root) return;
    this.controller = createCarouselController(root);
    const initial = Number(this.getAttribute("current") ?? 0);
    if (initial) this.controller.goTo(initial);
    this.listen(root, "blora-carousel-change", (event) => {
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

export function defineBloraCarousel(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_CAROUSEL_TAG)) return;
  registry.define(BLORA_CAROUSEL_TAG, BloraCarousel);
}
