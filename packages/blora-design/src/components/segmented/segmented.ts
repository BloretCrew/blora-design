/**
 * Segmented control with sliding indicator (v1 initSegmented).
 */
import { BloraElement } from "../../core/blora-element.js";

export const BLORA_SEGMENTED_TAG = "blora-segmented";

export interface SegmentedController {
  destroy(): void;
}

export function createSegmentedController(root: HTMLElement): SegmentedController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const win = root.ownerDocument.defaultView!;
  let indicator = root.querySelector<HTMLElement>(".blora-segmented__indicator");
  if (!indicator) {
    indicator = root.ownerDocument.createElement("span");
    indicator.className = "blora-segmented__indicator";
    indicator.setAttribute("aria-hidden", "true");
    root.insertBefore(indicator, root.firstChild);
  }
  const items = Array.from(root.querySelectorAll<HTMLElement>(".blora-segmented__item"));
  root.setAttribute("role", "radiogroup");

  const moveIndicator = (item: HTMLElement) => {
    const segRect = root.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    indicator!.style.left = `${itemRect.left - segRect.left}px`;
    indicator!.style.width = `${itemRect.width}px`;
  };

  const enabled = () => items.filter((item) => item.getAttribute("aria-disabled") !== "true");

  const activate = (item: HTMLElement, focus = false, emit = true) => {
    if (!item || !enabled().includes(item)) return;
    items.forEach((candidate) => {
      const active = candidate === item;
      candidate.toggleAttribute("data-active", active);
      candidate.setAttribute("aria-checked", String(active));
      if (candidate.getAttribute("aria-disabled") !== "true") {
        candidate.tabIndex = active ? 0 : -1;
      }
    });
    root.dataset.value = item.dataset.value || item.textContent?.trim() || "";
    moveIndicator(item);
    if (focus) item.focus();
    if (emit) {
      root.dispatchEvent(
        new CustomEvent("blora-change", {
          bubbles: true,
          detail: { value: root.dataset.value, item },
        }),
      );
    }
  };

  items.forEach((item) => {
    item.setAttribute("role", "radio");
    const disabled = item.getAttribute("aria-disabled") === "true";
    item.setAttribute("aria-checked", String(item.hasAttribute("data-active")));
    item.tabIndex = disabled ? -1 : item.hasAttribute("data-active") ? 0 : -1;
    item.addEventListener("click", () => activate(item));
  });

  const onKey = (e: KeyboardEvent) => {
    const candidates = enabled();
    if (!candidates.length) return;
    const doc = root.ownerDocument;
    const current = candidates.indexOf(doc.activeElement as HTMLElement);
    let next = current < 0 ? 0 : current;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (next + 1) % candidates.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (next - 1 + candidates.length) % candidates.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = candidates.length - 1;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate(doc.activeElement as HTMLElement);
      return;
    } else return;
    e.preventDefault();
    activate(candidates[next]!, true);
  };

  root.addEventListener("keydown", onKey);
  const onResize = () => {
    const cur = items.find((i) => i.hasAttribute("data-active"));
    if (cur) moveIndicator(cur);
  };
  win.addEventListener("resize", onResize);

  const active = items.find((i) => i.hasAttribute("data-active")) || enabled()[0];
  if (active) {
    activate(active, false, false);
    win.requestAnimationFrame(() => moveIndicator(active));
  }

  return {
    destroy() {
      root.removeEventListener("keydown", onKey);
      win.removeEventListener("resize", onResize);
    },
  };
}

interface SegmentDefinition {
  disabled: boolean;
  label: string;
  selected: boolean;
  value: string;
}

/** Composite CE. Child `<blora-segment>` definitions become official buttons. */
export class BloraSegmented extends BloraElement {
  private controller: SegmentedController | null = null;
  private definitions: SegmentDefinition[] | null = null;

  static get observedAttributes(): string[] {
    return ["value", "disabled"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal) return;
    this.sync();
  }

  get value(): string {
    return this.querySelector<HTMLElement>(".blora-segmented")?.dataset.value ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-segment")
        .map((item) => {
          const label = item.getAttribute("label") ?? item.textContent?.trim() ?? "";
          return {
            disabled: item.hasAttribute("disabled"),
            label,
            selected: item.hasAttribute("selected"),
            value: item.getAttribute("value") ?? label,
          };
        });
    }

    const selectedValue =
      this.getAttribute("value") ??
      this.definitions.find((definition) => definition.selected)?.value ??
      this.definitions.find((definition) => !definition.disabled)?.value;
    const root = document.createElement("div");
    root.className = "blora-segmented";
    root.dataset.bloraGenerated = "";
    const indicator = document.createElement("span");
    indicator.className = "blora-segmented__indicator";
    indicator.setAttribute("aria-hidden", "true");
    root.appendChild(indicator);

    for (const definition of this.definitions) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "blora-segmented__item";
      item.dataset.value = definition.value;
      item.textContent = definition.label;
      item.disabled = definition.disabled || this.hasAttribute("disabled");
      if (item.disabled) item.setAttribute("aria-disabled", "true");
      if (definition.value === selectedValue) {
        item.dataset.active = "";
      }
      root.appendChild(item);
    }
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
    const root = this.querySelector<HTMLElement>(".blora-segmented");
    if (root) this.controller = createSegmentedController(root);
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraSegmented(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_SEGMENTED_TAG)) return;
  registry.define(BLORA_SEGMENTED_TAG, BloraSegmented);
}
