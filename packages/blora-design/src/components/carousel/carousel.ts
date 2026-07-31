/**
 * Blora Design 2.0 - Carousel controller
 * Advances slides via arrows/dots, optional autoplay.
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

  const goTo = (i: number) => {
    current = ((i % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, idx) => {
      if (idx === current) dot.setAttribute("data-active", "");
      else dot.removeAttribute("data-active");
    });
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

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);
  dots.forEach((dot, idx) => dot.addEventListener("click", () => goTo(idx)));

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
      dots.forEach((dot, idx) => dot.removeEventListener("click", () => goTo(idx)));
      root.removeEventListener("mouseenter", stopAutoplay);
      root.removeEventListener("mouseleave", startAutoplay);
    },
    next,
    prev,
    goTo,
  };
}
