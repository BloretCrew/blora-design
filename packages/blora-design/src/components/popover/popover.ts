/**
 * Popover toggle (v1 simplified, no portal required).
 */
import { BloraElement } from "../../core/blora-element.js";

export const BLORA_POPOVER_TAG = "blora-popover";
export interface PopoverController {
  open(): void;
  close(): void;
  destroy(): void;
}

export function createPopoverController(
  root: HTMLElement,
  onOpenChange?: (open: boolean) => void,
): PopoverController {
  if (typeof document === "undefined") {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }
  const trigger =
    root.querySelector<HTMLElement>("[data-blora-popover], .blora-popover__trigger") ||
    root.querySelector<HTMLElement>("button");
  const panel = root.querySelector<HTMLElement>(".blora-popover__panel");
  if (!trigger || !panel) {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }

  const doc = root.ownerDocument;
  const setOpen = (open: boolean) => {
    if (open) {
      root.setAttribute("data-open", "");
      root.classList.add("is-open");
      panel.classList.add("is-open");
    } else {
      root.removeAttribute("data-open");
      root.classList.remove("is-open");
      panel.classList.remove("is-open");
    }
    trigger.setAttribute("aria-expanded", String(open));
    onOpenChange?.(open);
  };

  const onTrigger = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(!root.hasAttribute("data-open"));
  };
  const onDoc = (e: MouseEvent) => {
    if (!root.contains(e.target as Node) && !panel.contains(e.target as Node)) setOpen(false);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };
  const onClose = () => setOpen(false);

  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-expanded", "false");
  trigger.addEventListener("click", onTrigger);
  doc.addEventListener("click", onDoc);
  doc.addEventListener("keydown", onKey);
  panel.querySelectorAll("[data-blora-close]").forEach((b) => b.addEventListener("click", onClose));
  setOpen(root.hasAttribute("data-open"));

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    destroy() {
      trigger.removeEventListener("click", onTrigger);
      doc.removeEventListener("click", onDoc);
      doc.removeEventListener("keydown", onKey);
      panel
        .querySelectorAll("[data-blora-close]")
        .forEach((button) => button.removeEventListener("click", onClose));
    },
  };
}

/** Popover CE with generated trigger and dialog panel. */
export class BloraPopover extends BloraElement {
  private controller: PopoverController | null = null;
  private reflecting = false;
  private contentNodes: Node[] | null = null;

  static get observedAttributes(): string[] {
    return ["trigger", "content", "close-label", "open", "disabled"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    if (name === "open") {
      if (this.hasAttribute("open")) this.controller?.open();
      else this.controller?.close();
      return;
    }
    this.sync();
  }

  open(): void {
    this.setAttribute("open", "");
  }

  close(): void {
    this.removeAttribute("open");
  }

  protected render(): void {
    if (!this.contentNodes) {
      const existing = this.querySelector(".blora-popover__content");
      const kids = existing
        ? Array.from(existing.childNodes)
        : Array.from(this.childNodes).filter(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE || (node.textContent?.trim().length ?? 0) > 0,
          );
      this.contentNodes = kids.length ? kids : null;
    }
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-popover";
    root.dataset.bloraGenerated = "";
    if (this.hasAttribute("open")) root.dataset.open = "";
    const trigger = this.ownerDocument.createElement("button");
    trigger.type = "button";
    trigger.className = "blora-button blora-popover__trigger";
    trigger.dataset.variant = "outline";
    trigger.dataset.bloraPopover = "";
    trigger.disabled = this.hasAttribute("disabled");
    trigger.textContent = this.getAttribute("trigger") ?? "Open Popover";
    const panel = this.ownerDocument.createElement("div");
    panel.className = "blora-popover__panel";
    panel.setAttribute("role", "dialog");
    const content = this.ownerDocument.createElement("div");
    content.className = "blora-popover__content";
    if (this.contentNodes) content.append(...this.contentNodes);
    else content.textContent = this.getAttribute("content") ?? "";
    const close = this.ownerDocument.createElement("button");
    close.type = "button";
    close.className = "blora-button";
    close.dataset.size = "sm";
    close.dataset.bloraClose = "";
    close.textContent = this.getAttribute("close-label") ?? "Close";
    panel.append(content, close);
    root.append(trigger, panel);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-popover");
    if (!root) return;
    const trigger = root.querySelector<HTMLButtonElement>(".blora-popover__trigger");
    if (trigger) {
      trigger.textContent = this.getAttribute("trigger") ?? "Open Popover";
      trigger.disabled = this.hasAttribute("disabled");
    }
    const content = root.querySelector<HTMLElement>(".blora-popover__content");
    if (content && !this.contentNodes) content.textContent = this.getAttribute("content") ?? "";
    const close = root.querySelector<HTMLElement>("[data-blora-close]");
    if (close) close.textContent = this.getAttribute("close-label") ?? "Close";
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-popover");
    this.controller?.destroy();
    this.controller = root
      ? createPopoverController(root, (open) => {
          this.reflecting = true;
          this.toggleAttribute("open", open);
          this.reflecting = false;
        })
      : null;
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraPopover(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_POPOVER_TAG)) return;
  registry.define(BLORA_POPOVER_TAG, BloraPopover);
}
