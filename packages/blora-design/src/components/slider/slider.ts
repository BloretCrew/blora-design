/**
 * Blora Design 2.0 - Slider controller
 * Value display, track fill, optional tooltip-on-drag (data-tooltip).
 */
import { BloraElement } from "../../core/blora-element.js";

export const BLORA_SLIDER_TAG = "blora-slider";
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

/** Range input CE that owns the official slider structure. */
export class BloraSlider extends BloraElement {
  private controller: SliderController | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["min", "max", "step", "value", "name", "disabled", "tooltip", "hide-value"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get value(): number {
    return Number(this.querySelector<HTMLInputElement>('input[type="range"]')?.value ?? 0);
  }

  set value(value: number) {
    this.setAttribute("value", String(value));
  }

  override focus(options?: FocusOptions): void {
    this.querySelector<HTMLInputElement>('input[type="range"]')?.focus(options);
  }

  protected render(): void {
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-slider";
    root.dataset.bloraGenerated = "";
    if (this.hasAttribute("tooltip")) root.dataset.tooltip = "true";
    const input = this.ownerDocument.createElement("input");
    input.className = "blora-slider__input";
    input.type = "range";
    input.min = this.getAttribute("min") ?? "0";
    input.max = this.getAttribute("max") ?? "100";
    input.step = this.getAttribute("step") ?? "1";
    input.value = this.getAttribute("value") ?? input.min;
    input.name = this.getAttribute("name") ?? "";
    input.disabled = this.hasAttribute("disabled");
    root.appendChild(input);
    if (!this.hasAttribute("hide-value")) {
      const output = this.ownerDocument.createElement("output");
      output.className = "blora-slider__value";
      output.textContent = input.value;
      root.appendChild(output);
    }
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-slider");
    const input = root?.querySelector<HTMLInputElement>('input[type="range"]');
    if (!root || !input) return;
    const hideValue = this.hasAttribute("hide-value");
    const output = root.querySelector("output");
    if (hideValue !== !output) {
      this.render();
      this.rebind();
      return;
    }
    if (this.hasAttribute("tooltip")) root.dataset.tooltip = "true";
    else delete root.dataset.tooltip;
    input.min = this.getAttribute("min") ?? "0";
    input.max = this.getAttribute("max") ?? "100";
    input.step = this.getAttribute("step") ?? "1";
    if (document.activeElement !== input) input.value = this.getAttribute("value") ?? input.value;
    input.name = this.getAttribute("name") ?? "";
    input.disabled = this.hasAttribute("disabled");
    if (output) output.textContent = input.value;
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-slider");
    const input = root?.querySelector<HTMLInputElement>('input[type="range"]');
    if (!root || !input) return;
    this.controller?.destroy();
    this.controller = createSliderController(root);
    this.listen(input, "input", () => {
      this.reflecting = true;
      this.setAttribute("value", input.value);
      this.reflecting = false;
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraSlider(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_SLIDER_TAG)) return;
  registry.define(BLORA_SLIDER_TAG, BloraSlider);
}
