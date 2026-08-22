/**
 * Popconfirm: confirm before action.
 */
import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";

export const BLORA_POPCONFIRM_TAG = "blora-popconfirm";
export interface PopconfirmController {
  destroy(): void;
}

export function createPopconfirmController(root: HTMLElement): PopconfirmController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const trigger =
    root.querySelector<HTMLElement>(
      "[data-blora-popconfirm-trigger], .blora-popconfirm__trigger",
    ) || root.querySelector<HTMLElement>("button");
  const panel = root.querySelector<HTMLElement>(".blora-popconfirm__panel");
  if (!trigger || !panel) return { destroy: () => {} };

  const setOpen = (open: boolean) => {
    if (open) {
      root.setAttribute("data-open", "");
    } else {
      root.removeAttribute("data-open");
    }
  };

  const onTrigger = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(!root.hasAttribute("data-open"));
  };
  const onPanel = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-confirm], [data-blora-confirm]")) {
      root.dispatchEvent(new CustomEvent("blora-confirm", { bubbles: true }));
      setOpen(false);
    }
    if (t.closest("[data-cancel], [data-blora-cancel], [data-blora-close]")) setOpen(false);
  };
  const onDoc = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) setOpen(false);
  };

  trigger.addEventListener("click", onTrigger);
  panel.addEventListener("click", onPanel);
  root.ownerDocument.addEventListener("click", onDoc);

  return {
    destroy() {
      trigger.removeEventListener("click", onTrigger);
      panel.removeEventListener("click", onPanel);
      root.ownerDocument.removeEventListener("click", onDoc);
    },
  };
}

/** Confirmation popover CE with generated trigger, question and actions. */
export class BloraPopconfirm extends BloraElement {
  private controller: PopconfirmController | null = null;

  static get observedAttributes(): string[] {
    return ["trigger", "message", "confirm-label", "cancel-label", "open", "disabled"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal) return;
    if (name === "open") {
      if (this.hasAttribute("open")) this.open();
      else this.close();
      return;
    }
    this.sync();
  }

  open(): void {
    this.querySelector<HTMLElement>(".blora-popconfirm")?.setAttribute("data-open", "");
  }

  close(): void {
    this.querySelector<HTMLElement>(".blora-popconfirm")?.removeAttribute("data-open");
  }

  protected render(): void {
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-popconfirm";
    root.dataset.bloraGenerated = "";
    if (this.hasAttribute("open")) root.dataset.open = "";
    const trigger = this.ownerDocument.createElement("button");
    trigger.type = "button";
    trigger.className = "blora-button blora-popconfirm__trigger";
    trigger.dataset.variant = "danger";
    trigger.dataset.bloraPopconfirmTrigger = "";
    trigger.disabled = this.hasAttribute("disabled");
    trigger.textContent = this.getAttribute("trigger") ?? t("popconfirm.trigger");
    const panel = this.ownerDocument.createElement("div");
    panel.className = "blora-popconfirm__panel";
    panel.setAttribute("role", "alertdialog");
    const title = this.ownerDocument.createElement("p");
    title.className = "blora-popconfirm__title";
    title.textContent = this.getAttribute("message") ?? t("popconfirm.message");
    const actions = this.ownerDocument.createElement("div");
    actions.className = "blora-popconfirm__actions";
    const cancel = this.ownerDocument.createElement("button");
    cancel.type = "button";
    cancel.className = "blora-button";
    cancel.dataset.size = "sm";
    cancel.dataset.variant = "ghost";
    cancel.dataset.cancel = "";
    cancel.textContent = this.getAttribute("cancel-label") ?? t("common.cancel");
    const confirm = this.ownerDocument.createElement("button");
    confirm.type = "button";
    confirm.className = "blora-button";
    confirm.dataset.size = "sm";
    confirm.dataset.variant = "danger";
    confirm.dataset.confirm = "";
    confirm.textContent = this.getAttribute("confirm-label") ?? t("common.confirm");
    actions.append(cancel, confirm);
    panel.append(title, actions);
    root.append(trigger, panel);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const trigger = this.querySelector<HTMLButtonElement>(".blora-popconfirm__trigger");
    if (trigger) {
      trigger.textContent = this.getAttribute("trigger") ?? t("popconfirm.trigger");
      trigger.disabled = this.hasAttribute("disabled");
    }
    const title = this.querySelector(".blora-popconfirm__title");
    if (title) title.textContent = this.getAttribute("message") ?? t("popconfirm.message");
    const cancel = this.querySelector<HTMLElement>("[data-cancel]");
    if (cancel) cancel.textContent = this.getAttribute("cancel-label") ?? t("common.cancel");
    const confirm = this.querySelector<HTMLElement>("[data-confirm]");
    if (confirm) confirm.textContent = this.getAttribute("confirm-label") ?? t("common.confirm");
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-popconfirm");
    this.controller?.destroy();
    this.controller = root ? createPopconfirmController(root) : null;
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraPopconfirm(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_POPCONFIRM_TAG)) return;
  registry.define(BLORA_POPCONFIRM_TAG, BloraPopconfirm);
}
