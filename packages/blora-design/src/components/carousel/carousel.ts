/**
 * Blora Design 2.0 - Carousel controller
 * Arrows/dots + pointer/touch drag swipe (v1 parity).
 */
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
  root.addEventListener("pointercancel", () => finishDrag(true));
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
      root.removeEventListener("mouseenter", stopAutoplay);
      root.removeEventListener("mouseleave", startAutoplay);
    },
    next,
    prev,
    goTo,
  };
}
