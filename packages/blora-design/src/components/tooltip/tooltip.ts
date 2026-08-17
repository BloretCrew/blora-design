/**
 * Tooltip: reposition bubble (v1 fitFloatingInline simplified).
 */
import { BloraElement } from "../../core/blora-element.js";

export const BLORA_TOOLTIP_TAG = "blora-tooltip";
export interface TooltipController {
  destroy(): void;
}

export function createTooltipController(root: HTMLElement): TooltipController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const bubble = root.querySelector<HTMLElement>(".blora-tooltip__bubble");
  if (!bubble) return { destroy: () => {} };
  const win = root.ownerDocument.defaultView!;

  const position = () => {
    bubble.style.setProperty("--blora-float-shift-x", "0px");
    bubble.style.setProperty("--blora-float-shift-y", "0px");
    const rect = bubble.getBoundingClientRect();
    const gutter = 12;
    let shiftX = 0;
    let shiftY = 0;
    if (rect.left < gutter) shiftX += gutter - rect.left;
    if (rect.right + shiftX > win.innerWidth - gutter) {
      shiftX -= rect.right + shiftX - (win.innerWidth - gutter);
    }
    if (rect.top < gutter) shiftY += gutter - rect.top;
    if (rect.bottom + shiftY > win.innerHeight - gutter) {
      shiftY -= rect.bottom + shiftY - (win.innerHeight - gutter);
    }
    bubble.style.setProperty("--blora-float-shift-x", `${shiftX}px`);
    bubble.style.setProperty("--blora-float-shift-y", `${shiftY}px`);
  };

  root.addEventListener("pointerenter", position);
  root.addEventListener("focusin", position);
  win.addEventListener("resize", position);

  return {
    destroy() {
      root.removeEventListener("pointerenter", position);
      root.removeEventListener("focusin", position);
      win.removeEventListener("resize", position);
    },
  };
}

/** Tooltip CE that owns the trigger/bubble relationship. */
export class BloraTooltip extends BloraElement {
  private controller: TooltipController | null = null;
  private triggerNodes: Node[] | null = null;

  static get observedAttributes(): string[] {
    return ["text", "trigger", "placement", "disabled"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal) return;
    this.sync();
  }

  override focus(options?: FocusOptions): void {
    this.querySelector<HTMLElement>(".blora-tooltip")?.focus(options);
  }

  protected render(): void {
    if (!this.triggerNodes) {
      const existing = this.querySelector(".blora-tooltip");
      this.triggerNodes = existing
        ? Array.from(existing.childNodes).filter(
            (node) =>
              !(node instanceof HTMLElement) || !node.classList.contains("blora-tooltip__bubble"),
          )
        : Array.from(this.childNodes);
    }
    const root = this.ownerDocument.createElement("span");
    root.className = "blora-tooltip";
    root.dataset.bloraGenerated = "";
    root.tabIndex = this.hasAttribute("disabled") ? -1 : 0;
    const trigger = this.getAttribute("trigger");
    if (trigger) root.appendChild(this.ownerDocument.createTextNode(trigger));
    else root.append(...this.triggerNodes);
    const bubble = this.ownerDocument.createElement("span");
    bubble.className = "blora-tooltip__bubble";
    bubble.setAttribute("role", "tooltip");
    bubble.textContent = this.getAttribute("text") ?? "";
    root.appendChild(bubble);
    this.replaceChildren(root);
    this.sync();
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-tooltip");
    if (!root) return;
    root.tabIndex = this.hasAttribute("disabled") ? -1 : 0;
    const placement = this.getAttribute("placement");
    if (placement) root.dataset.placement = placement;
    else delete root.dataset.placement;
    const bubble = root.querySelector<HTMLElement>(".blora-tooltip__bubble");
    if (bubble) bubble.textContent = this.getAttribute("text") ?? "";
    const trigger = this.getAttribute("trigger");
    if (trigger) {
      const first = root.firstChild;
      if (first?.nodeType === Node.TEXT_NODE) first.textContent = trigger;
    }
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-tooltip");
    this.controller?.destroy();
    this.controller = root && !this.hasAttribute("disabled") ? createTooltipController(root) : null;
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraTooltip(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_TOOLTIP_TAG)) return;
  registry.define(BLORA_TOOLTIP_TAG, BloraTooltip);
}
