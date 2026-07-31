/**
 * Blora Design 2.0 - Rate controller
 * Click stars to set rating, hover to preview.
 */
export interface RateController {
  destroy(): void;
}

export function createRateController(root: HTMLElement): RateController {
  const stars = Array.from(root.querySelectorAll<HTMLElement>(".blora-rate__star"));
  if (stars.length === 0) return { destroy: () => {} };

  const readonly = root.hasAttribute("data-readonly");
  let currentValue = Number(root.dataset.value ?? 0);

  const render = (previewVal: number | null) => {
    const val = previewVal ?? currentValue;
    stars.forEach((star, i) => {
      if (i < val) star.setAttribute("data-active", "");
      else star.removeAttribute("data-active");
    });
  };

  if (readonly) {
    render(null);
    return { destroy: () => {} };
  }

  const onMove = (e: MouseEvent) => {
    const idx = stars.indexOf(e.target as HTMLElement);
    if (idx === -1) return;
    render(idx + 1);
  };

  const onLeave = () => render(null);

  const onClick = (e: MouseEvent) => {
    const idx = stars.indexOf(e.target as HTMLElement);
    if (idx === -1) return;
    currentValue = idx + 1;
    root.dataset.value = String(currentValue);
    render(null);
  };

  root.addEventListener("mouseover", onMove);
  root.addEventListener("mouseleave", onLeave);
  root.addEventListener("click", onClick);
  render(null);

  return {
    destroy() {
      root.removeEventListener("mouseover", onMove);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("click", onClick);
    },
  };
}
