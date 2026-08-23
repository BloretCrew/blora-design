/**
 * Blora Design 2.0 - Speed Dial controller
 * Stays in core (product decision). Baseline: v1 initSpeedDial.
 */
import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";
import { createBloraIcon, type BloraIconName } from "../../core/icons.js";

export const BLORA_SPEED_DIAL_TAG = "blora-speed-dial";

function createNamedIcon(
  doc: Document,
  name: string | null,
  fallback: BloraIconName,
): SVGSVGElement {
  const icon = createBloraIcon((name ?? fallback) as BloraIconName, 18, doc);
  return icon.childElementCount ? icon : createBloraIcon(fallback, 18, doc);
}

export interface SpeedDialController {
  open(): void;
  close(): void;
  /** Flip open state; used by host-level delegation so re-rendered subtrees stay live. */
  toggle(): void;
  destroy(): void;
}

export interface SpeedDialControllerOptions {
  /** Skip the controller's own trigger click binding (host delegates instead). */
  triggerDelegated?: boolean;
}

/** v1 initSpeedDial parity: menu roles, keyboard, outside close. */
export function createSpeedDialController(
  root: HTMLElement,
  options: SpeedDialControllerOptions = {},
): SpeedDialController {
  if (typeof document === "undefined") {
    return {
      open: () => {},
      close: () => {},
      toggle: () => {},
      destroy: () => {},
    };
  }

  const doc = root.ownerDocument;
  const trigger = root.querySelector<HTMLElement>(
    "[data-blora-speed-dial-trigger], .blora-speed-dial__trigger",
  );
  const actions = root.querySelector<HTMLElement>(".blora-speed-dial__actions");
  const closeBtn = root.querySelector<HTMLElement>(
    "[data-blora-speed-dial-close], .blora-speed-dial__close",
  );
  const mainBtn = root.querySelector<HTMLElement>(
    "[data-blora-speed-dial-main], .blora-speed-dial__main",
  );
  if (!trigger || !actions) {
    return { open: () => {}, close: () => {}, toggle: () => {}, destroy: () => {} };
  }

  const actionItems = Array.from(
    actions.querySelectorAll<HTMLElement>(".blora-speed-dial__action"),
  );

  if (!actions.id) {
    actions.id = `blora-sd-actions-${Math.random().toString(36).slice(2, 9)}`;
  }

  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", actions.id);
  actions.setAttribute("role", "menu");
  actions.setAttribute("aria-hidden", "true");
  actionItems.forEach((action) => {
    action.setAttribute("role", "menuitem");
    action.setAttribute("tabindex", "-1");
  });
  closeBtn?.setAttribute("tabindex", "-1");
  closeBtn?.setAttribute("aria-hidden", "true");
  mainBtn?.setAttribute("tabindex", "-1");
  mainBtn?.setAttribute("aria-hidden", "true");

  const setOpen = (open: boolean, focus = false) => {
    if (open) {
      root.setAttribute("data-open", "");
    } else {
      root.removeAttribute("data-open");
    }
    trigger.setAttribute("aria-expanded", String(open));
    actions.setAttribute("aria-hidden", String(!open));
    closeBtn?.setAttribute("aria-hidden", String(!open));
    if (mainBtn) {
      mainBtn.setAttribute("aria-hidden", String(!open));
      mainBtn.setAttribute("tabindex", open ? "0" : "-1");
    }
    actionItems.forEach((action) => action.setAttribute("tabindex", open ? "0" : "-1"));
    if (open && focus) {
      (mainBtn ?? actionItems[0])?.focus();
    }
    if (!open) {
      actionItems.forEach((action) => action.setAttribute("tabindex", "-1"));
    }
    root.dispatchEvent(
      new CustomEvent("blora-speed-dial-toggle", { bubbles: true, detail: { open } }),
    );
  };

  const onTriggerClick = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(!root.hasAttribute("data-open"));
  };

  const onTriggerKey = (e: KeyboardEvent) => {
    if (
      e.key === "ArrowDown" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      e.preventDefault();
      setOpen(true, true);
    }
  };

  const onDialKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && root.hasAttribute("data-open")) {
      e.preventDefault();
      setOpen(false);
      trigger.focus();
      return;
    }
    if (!root.hasAttribute("data-open")) return;
    const focusables = mainBtn ? [mainBtn, ...actionItems] : actionItems;
    const index = focusables.indexOf(e.target as HTMLElement);
    if (index < 0) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      focusables[(index + 1) % focusables.length]?.focus();
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      focusables[(index - 1 + focusables.length) % focusables.length]?.focus();
    }
    if (e.key === "Home") {
      e.preventDefault();
      focusables[0]?.focus();
    }
    if (e.key === "End") {
      e.preventDefault();
      focusables[focusables.length - 1]?.focus();
    }
  };

  const onActionsClick = (e: MouseEvent) => {
    const action = (e.target as HTMLElement).closest<HTMLElement>(".blora-speed-dial__action");
    if (action) {
      root.dispatchEvent(
        new CustomEvent("blora-speed-dial-select", {
          bubbles: true,
          detail: { value: action.dataset.value ?? "" },
        }),
      );
      setOpen(false);
    }
  };

  const onDocClick = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) setOpen(false);
  };

  const onClose = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    trigger.focus();
  };

  if (!options.triggerDelegated) trigger.addEventListener("click", onTriggerClick);
  trigger.addEventListener("keydown", onTriggerKey);
  root.addEventListener("keydown", onDialKey);
  actions.addEventListener("click", onActionsClick);
  closeBtn?.addEventListener("click", onClose);
  mainBtn?.addEventListener("click", onClose);
  doc.addEventListener("click", onDocClick);

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!root.hasAttribute("data-open")),
    destroy() {
      if (!options.triggerDelegated) trigger.removeEventListener("click", onTriggerClick);
      trigger.removeEventListener("keydown", onTriggerKey);
      root.removeEventListener("keydown", onDialKey);
      actions.removeEventListener("click", onActionsClick);
      closeBtn?.removeEventListener("click", onClose);
      mainBtn?.removeEventListener("click", onClose);
      doc.removeEventListener("click", onDocClick);
    },
  };
}

interface SpeedDialActionDefinition {
  icon: string | null;
  label: string;
  nodes: Node[];
  variant: string;
  value: string;
}

/** Speed Dial CE that consumes declarative actions and owns trigger/menu controls. */
export class BloraSpeedDial extends BloraElement {
  private controller: SpeedDialController | null = null;
  private definitions: SpeedDialActionDefinition[] | null = null;
  private reflecting = false;
  private dialTreeObserver: MutationObserver | null = null;
  private lastToggleEvent: Event | null = null;

  static get observedAttributes(): string[] {
    return [
      "label",
      "mode",
      "action-appearance",
      "open",
      "close-button",
      "main-label",
      "main-icon",
    ];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  open(): void {
    this.controller?.open();
  }

  close(): void {
    this.controller?.close();
  }

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-speed-dial-action")
        .map((item) => ({
          icon: item.getAttribute("icon"),
          label: item.getAttribute("label") ?? item.textContent?.trim() ?? "",
          nodes: Array.from(item.childNodes).map((node) => node.cloneNode(true)),
          variant: item.getAttribute("variant") ?? "secondary",
          value: item.getAttribute("value") ?? "",
        }));
    }
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-speed-dial";
    const mode = this.getAttribute("mode");
    if (mode === "left" || mode === "flower") root.classList.add(`blora-speed-dial--${mode}`);
    root.dataset.bloraGenerated = "";
    root.dataset.bloraSpeedDial = "";
    const trigger = this.ownerDocument.createElement("button");
    trigger.className = "blora-button blora-speed-dial__trigger";
    trigger.dataset.size = "icon";
    trigger.dataset.variant = "primary";
    trigger.dataset.bloraSpeedDialTrigger = "";
    trigger.type = "button";
    trigger.setAttribute("aria-label", this.getAttribute("label") ?? t("speedDial.label"));
    trigger.appendChild(createNamedIcon(this.ownerDocument, "plus", "plus"));
    root.appendChild(trigger);
    if (this.hasAttribute("close-button")) {
      const close = this.ownerDocument.createElement("button");
      close.className = "blora-button blora-speed-dial__close";
      close.dataset.size = "icon";
      close.dataset.variant = "danger";
      close.dataset.bloraSpeedDialClose = "";
      close.type = "button";
      close.setAttribute("aria-label", t("common.close"));
      close.appendChild(createNamedIcon(this.ownerDocument, "close", "close"));
      root.appendChild(close);
    }
    const mainLabel = this.getAttribute("main-label");
    if (mainLabel) {
      const main = this.ownerDocument.createElement("button");
      main.className = "blora-button blora-speed-dial__main";
      main.dataset.size = "icon";
      main.dataset.variant = "secondary";
      main.dataset.bloraSpeedDialMain = "";
      main.type = "button";
      main.setAttribute("aria-label", mainLabel);
      main.appendChild(createNamedIcon(this.ownerDocument, this.getAttribute("main-icon"), "plus"));
      root.appendChild(main);
    }
    const actions = this.ownerDocument.createElement("div");
    actions.className = "blora-speed-dial__actions";
    const appearance = this.getAttribute("action-appearance") ?? "icon";
    this.definitions.forEach((definition) => {
      const action = this.ownerDocument.createElement("button");
      action.className = "blora-button blora-speed-dial__action";
      action.dataset.size = appearance === "button" ? "sm" : "icon";
      action.dataset.variant = definition.variant;
      action.dataset.value = definition.value;
      action.type = "button";
      action.setAttribute("aria-label", definition.label);
      action.title = definition.label;
      if (appearance === "button") action.textContent = definition.label;
      else if (definition.icon)
        action.appendChild(createNamedIcon(this.ownerDocument, definition.icon, "document"));
      else if (definition.nodes.length)
        action.append(...definition.nodes.map((node) => node.cloneNode(true)));
      else action.appendChild(createNamedIcon(this.ownerDocument, null, "document"));
      if (appearance === "label") {
        const item = this.ownerDocument.createElement("div");
        item.className = "blora-speed-dial__item";
        const label = this.ownerDocument.createElement("span");
        label.className = "blora-speed-dial__label";
        label.textContent = definition.label;
        item.append(label, action);
        actions.appendChild(item);
      } else actions.appendChild(action);
    });
    root.appendChild(actions);
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
    this.controller?.destroy();
    this.controller = null;
    const root = this.querySelector<HTMLElement>(".blora-speed-dial");
    if (!root) return;
    // Trigger activation is delegated on the host: showcase hydration can
    // rebuild the inner subtree after binding, which orphans node-level
    // listeners (dead dial on slower engines). Host delegation survives it,
    // and the observer below rebinds the rest of the controller to the new
    // subtree as soon as the swap lands. Duplicate listener generations have
    // been observed on Chromium; the last-event guard makes a doubled
    // dispatch a no-op instead of an open/close flicker.
    this.controller = createSpeedDialController(root, { triggerDelegated: true });
    this.dialTreeObserver?.disconnect();
    this.dialTreeObserver = new MutationObserver(() => {
      if (!this.isConnectedInternal) return;
      this.rebind();
    });
    this.dialTreeObserver.observe(this, { childList: true });
    this.listen(this, "click", (event) => {
      if (this.lastToggleEvent === event) return;
      const target = event.target as Element | null;
      if (!target || !target.closest("[data-blora-speed-dial-trigger], .blora-speed-dial__trigger"))
        return;
      if (!this.contains(target)) return;
      this.lastToggleEvent = event;
      event.stopPropagation();
      this.controller?.toggle();
    });
    this.listen(this, "keydown", (event) => {
      const keyEvent = event as KeyboardEvent;
      if (this.lastToggleEvent === event) return;
      const target = event.target as Element | null;
      if (
        !target ||
        !target.closest("[data-blora-speed-dial-trigger], .blora-speed-dial__trigger") ||
        !this.contains(target)
      )
        return;
      if (keyEvent.key !== "Enter" && keyEvent.key !== " ") return;
      this.lastToggleEvent = event;
      event.preventDefault();
      event.stopPropagation();
      this.controller?.toggle();
    });
    this.listen(root, "blora-speed-dial-toggle", (event) => {
      const open = (event as CustomEvent<{ open: boolean }>).detail.open;
      this.reflecting = true;
      this.toggleAttribute("open", open);
      this.reflecting = false;
    });
    if (this.hasAttribute("open")) this.controller.open();
  }

  protected onDisconnect(): void {
    this.dialTreeObserver?.disconnect();
    this.dialTreeObserver = null;
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraSpeedDial(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_SPEED_DIAL_TAG)) return;
  registry.define(BLORA_SPEED_DIAL_TAG, BloraSpeedDial);
}
