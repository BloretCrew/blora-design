/**
 * Blora Design 2.0 - Slider controller
 * Value display, track fill, optional tooltip-on-drag (data-tooltip).
 */
export interface SliderController {
  destroy(): void;
}

export function createSliderController(root: HTMLElement): SliderController {
  const input = root.querySelector<HTMLInputElement>(".blora-slider__input, input[type='range']");
  const value = root.querySelector<HTMLElement>(".blora-slider__value");
  if (!input) return { destroy: () => {} };

  const showTip = root.hasAttribute("data-tooltip") || root.dataset.tooltip === "true";
  let tip: HTMLElement | null = null;
  if (showTip) {
    tip = root.querySelector<HTMLElement>(".blora-slider__tip");
    if (!tip) {
      tip = document.createElement("span");
      tip.className = "blora-slider__tip";
      tip.setAttribute("aria-hidden", "true");
      root.appendChild(tip);
    }
  }

  const update = () => {
    const v = Number(input.value);
    const min = Number(input.min) || 0;
    const max = Number(input.max) || 100;
    const pct = ((v - min) / (max - min)) * 100;
    root.style.setProperty("--blora-slider-fill", `${pct}%`);
    if (value) value.textContent = String(v);
    if (tip) {
      tip.textContent = String(v);
      tip.style.left = `${pct}%`;
    }
  };

  const show = () => {
    if (tip) tip.setAttribute("data-show", "");
  };
  const hide = () => {
    if (tip) tip.removeAttribute("data-show");
  };

  input.addEventListener("input", update);
  if (showTip) {
    input.addEventListener("pointerdown", show);
    input.addEventListener("pointerup", hide);
    input.addEventListener("focus", show);
    input.addEventListener("blur", hide);
  }
  update();

  return {
    destroy() {
      input.removeEventListener("input", update);
      if (showTip) {
        input.removeEventListener("pointerdown", show);
        input.removeEventListener("pointerup", hide);
        input.removeEventListener("focus", show);
        input.removeEventListener("blur", hide);
      }
    },
  };
}
