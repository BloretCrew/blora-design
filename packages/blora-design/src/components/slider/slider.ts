/**
 * Blora Design 2.0 - Slider controller
 * Updates the value display and track fill as the native range input changes.
 */
export interface SliderController {
  destroy(): void;
}

export function createSliderController(root: HTMLElement): SliderController {
  const input = root.querySelector<HTMLInputElement>(".blora-slider__input");
  const value = root.querySelector<HTMLElement>(".blora-slider__value");

  if (!input) return { destroy: () => {} };

  const update = () => {
    const v = Number(input.value);
    const min = Number(input.min) || 0;
    const max = Number(input.max) || 100;
    const pct = ((v - min) / (max - min)) * 100;
    root.style.setProperty("--blora-slider-fill", `${pct}%`);
    if (value) value.textContent = String(v);
  };

  input.addEventListener("input", update);
  update();

  return {
    destroy() {
      input.removeEventListener("input", update);
    },
  };
}
