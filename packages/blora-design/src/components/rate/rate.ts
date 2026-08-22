/**
 * Blora Design 2.0 - Rate controller
 * Click stars to set rating, hover to preview.
 */
import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_RATE_TAG = "blora-rate";
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

  const starFromEvent = (event: Event): HTMLElement | null => {
    const node = event.target;
    if (!(node instanceof Element)) return null;
    const star = node.closest<HTMLElement>(".blora-rate__star");
    return star && stars.includes(star) ? star : null;
  };

  const onMove = (e: MouseEvent) => {
    const star = starFromEvent(e);
    if (!star) return;
    render(stars.indexOf(star) + 1);
  };

  const onLeave = () => render(null);

  const onClick = (e: MouseEvent) => {
    const star = starFromEvent(e);
    if (!star) return;
    currentValue = stars.indexOf(star) + 1;
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

/** Rating CE that generates the official star collection. */
export class BloraRate extends BloraElement {
  private controller: RateController | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["value", "max", "readonly", "label"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    if (name === "max") {
      this.render();
      this.rebind();
      return;
    }
    this.sync();
  }

  get value(): number {
    return Number(this.querySelector<HTMLElement>(".blora-rate")?.dataset.value ?? 0);
  }

  set value(value: number) {
    this.setAttribute("value", String(value));
  }

  protected render(): void {
    const max = Math.max(1, Number(this.getAttribute("max") ?? 5));
    const value = Math.min(max, Math.max(0, Number(this.getAttribute("value") ?? 0)));
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-rate";
    root.dataset.bloraGenerated = "";
    root.dataset.value = String(value);
    root.setAttribute("role", "radiogroup");
    root.setAttribute("aria-label", this.getAttribute("label") ?? t("rate.label"));
    if (this.hasAttribute("readonly")) root.dataset.readonly = "";
    for (let index = 1; index <= max; index += 1) {
      const star = this.ownerDocument.createElement("span");
      star.className = "blora-rate__star";
      star.appendChild(createBloraIcon("star", 20, this.ownerDocument));
      star.dataset.value = String(index);
      star.setAttribute("role", "radio");
      star.setAttribute("aria-checked", String(index === value));
      star.setAttribute("aria-label", t("rate.of", { n: index, max }));
      star.tabIndex = this.hasAttribute("readonly") ? -1 : index === Math.max(1, value) ? 0 : -1;
      if (index <= value) star.dataset.active = "";
      root.appendChild(star);
    }
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-rate");
    if (!root) return;
    const max = Math.max(1, Number(this.getAttribute("max") ?? 5));
    const value = Math.min(max, Math.max(0, Number(this.getAttribute("value") ?? 0)));
    root.dataset.value = String(value);
    root.setAttribute("aria-label", this.getAttribute("label") ?? t("rate.label"));
    root.toggleAttribute("data-readonly", this.hasAttribute("readonly"));
    root.querySelectorAll<HTMLElement>(".blora-rate__star").forEach((star, index) => {
      const n = index + 1;
      star.setAttribute("aria-checked", String(n === value));
      star.tabIndex = this.hasAttribute("readonly") ? -1 : n === Math.max(1, value) ? 0 : -1;
      star.toggleAttribute("data-active", n <= value);
    });
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-rate");
    if (!root) return;
    this.controller?.destroy();
    this.controller = createRateController(root);
    const commit = (star: HTMLElement) => {
      if (this.hasAttribute("readonly")) return;
      star.click();
      const value = root.dataset.value ?? "0";
      this.reflecting = true;
      this.setAttribute("value", value);
      this.reflecting = false;
      root.querySelectorAll<HTMLElement>(".blora-rate__star").forEach((candidate) => {
        const active = candidate === star;
        candidate.setAttribute("aria-checked", String(active));
        candidate.tabIndex = active ? 0 : -1;
      });
      this.emit("blora-change", { value: Number(value) });
    };
    this.listen(root, "click", (event) => {
      const star = (event.target as HTMLElement).closest<HTMLElement>(".blora-rate__star");
      if (!star || !root.contains(star)) return;
      const value = root.dataset.value ?? "0";
      this.reflecting = true;
      this.setAttribute("value", value);
      this.reflecting = false;
      root.querySelectorAll<HTMLElement>(".blora-rate__star").forEach((candidate) => {
        const active = candidate === star;
        candidate.setAttribute("aria-checked", String(active));
        candidate.tabIndex = active ? 0 : -1;
      });
      this.emit("blora-change", { value: Number(value) });
    });
    this.listen(root, "keydown", (event) => {
      const keyboardEvent = event as KeyboardEvent;
      const star = (keyboardEvent.target as HTMLElement).closest<HTMLElement>(".blora-rate__star");
      if (!star || (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ")) return;
      keyboardEvent.preventDefault();
      commit(star);
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraRate(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_RATE_TAG)) return;
  registry.define(BLORA_RATE_TAG, BloraRate);
}
