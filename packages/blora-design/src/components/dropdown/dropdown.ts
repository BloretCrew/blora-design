/**
 * Blora Design 2.0 - Dropdown controller
 *
 * Spec §16.2: Dropdown with toggle, outside-click, and Escape close.
 * Ported from v1 initDropdown, adapted as a destroyable headless controller.
 *
 * The CSS-only base works without this controller (set `data-open` on the
 * root manually). The controller adds proper ARIA, outside-click, Escape,
 * and item-click-to-close behavior.
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_DROPDOWN_TAG = "blora-dropdown";

export interface DropdownController {
  /** Open the dropdown. */
  open(): void;
  /** Close the dropdown. */
  close(): void;
  /** Toggle open/closed state. */
  toggle(): void;
  /** Destroy the controller, removing all listeners. */
  destroy(): void;
}

/**
 * Create a dropdown controller on a `.blora-dropdown` root element.
 *
 * Expected markup:
 * ```html
 * <div class="blora-dropdown">
 *   <button data-dropdown-trigger>Trigger</button>
 *   <div class="blora-dropdown__menu">...</div>
 * </div>
 * ```
 *
 * - Toggles `data-open` on the root element.
 * - Closes on outside click (document click).
 * - Closes on Escape key.
 * - Closes when a `.blora-dropdown__item` is clicked.
 * - Sets `aria-haspopup` and syncs `aria-expanded` on the trigger.
 * - Cleans up all listeners on `destroy()`.
 */
export function createDropdownController(root: HTMLElement): DropdownController {
  const abortController = new AbortController();
  const { signal } = abortController;

  const triggerEl = root.querySelector<HTMLElement>("[data-dropdown-trigger]");
  const menuEl = root.querySelector<HTMLElement>(".blora-dropdown__menu");

  if (!triggerEl || !menuEl) {
    return {
      open: () => {},
      close: () => {},
      toggle: () => {},
      destroy: () => {},
    };
  }
  const trigger: HTMLElement = triggerEl;
  const menu: HTMLElement = menuEl;

  // --- ARIA setup ---
  trigger.setAttribute("aria-haspopup", "menu");
  if (!trigger.id) {
    trigger.id = `blora-dropdown-trigger-${Math.random().toString(36).slice(2, 9)}`;
  }
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-labelledby", trigger.id);

  function isOpen(): boolean {
    return root.hasAttribute("data-open");
  }

  function syncAria(): void {
    trigger.setAttribute("aria-expanded", String(isOpen()));
    menu.setAttribute("aria-hidden", String(!isOpen()));
  }

  function open(): void {
    root.setAttribute("data-open", "");
    syncAria();
  }

  function close(): void {
    root.removeAttribute("data-open");
    syncAria();
  }

  function toggle(): void {
    if (isOpen()) {
      close();
    } else {
      open();
    }
  }

  // --- Trigger click: toggle ---
  trigger.addEventListener(
    "click",
    (event: Event) => {
      event.stopPropagation();
      toggle();
    },
    { signal },
  );

  // --- Item click: close ---
  menu.addEventListener(
    "click",
    (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".blora-dropdown__item")) {
        close();
      }
    },
    { signal },
  );

  // --- Escape: close ---
  root.addEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen()) {
        event.stopPropagation();
        close();
        trigger.focus();
      }
    },
    { signal },
  );

  // --- Outside click: close ---
  document.addEventListener(
    "click",
    () => {
      if (isOpen()) {
        close();
      }
    },
    { signal },
  );

  // --- Initial ARIA state ---
  syncAria();

  return { open, close, toggle, destroy: () => abortController.abort() };
}

interface DropdownItemDefinition {
  disabled: boolean;
  href: string | null;
  label: string;
  separator: boolean;
  value: string;
}

/** Dropdown CE. Child item definitions become the official menu tree. */
export class BloraDropdown extends BloraElement {
  private controller: DropdownController | null = null;
  private definitions: DropdownItemDefinition[] | null = null;

  static get observedAttributes(): string[] {
    return ["label", "open", "disabled"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal) return;
    if (name === "open") {
      if (this.hasAttribute("open")) this.controller?.open();
      else this.controller?.close();
      return;
    }
    this.sync();
  }

  open(): void {
    this.controller?.open();
  }

  close(): void {
    this.controller?.close();
  }

  toggle(): void {
    this.controller?.toggle();
  }

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-dropdown-item")
        .map((item) => ({
          disabled: item.hasAttribute("disabled"),
          href: item.getAttribute("href"),
          label: item.getAttribute("label") ?? item.textContent?.trim() ?? "",
          separator: item.hasAttribute("separator"),
          value: item.getAttribute("value") ?? item.textContent?.trim() ?? "",
        }));
    }
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-dropdown";
    root.dataset.bloraGenerated = "";
    if (this.hasAttribute("open")) root.dataset.open = "";
    const trigger = this.ownerDocument.createElement("button");
    trigger.type = "button";
    trigger.className = "blora-button";
    trigger.dataset.variant = "outline";
    trigger.dataset.dropdownTrigger = "";
    trigger.disabled = this.hasAttribute("disabled");
    const label = this.ownerDocument.createElement("span");
    label.className = "blora-dropdown__label";
    label.textContent = this.getAttribute("label") ?? "Menu";
    trigger.append(label, createBloraIcon("chevron-down", 16, this.ownerDocument));
    const menu = this.ownerDocument.createElement("div");
    menu.className = "blora-dropdown__menu";
    for (const definition of this.definitions) {
      if (definition.separator) {
        const separator = this.ownerDocument.createElement("div");
        separator.className = "blora-dropdown__sep";
        separator.setAttribute("role", "separator");
        menu.appendChild(separator);
      }
      const item = definition.href
        ? this.ownerDocument.createElement("a")
        : this.ownerDocument.createElement("button");
      item.className = "blora-dropdown__item";
      item.dataset.value = definition.value;
      item.textContent = definition.label;
      if (item instanceof HTMLAnchorElement) item.href = definition.href!;
      else item.type = "button";
      if (definition.disabled) {
        item.setAttribute("aria-disabled", "true");
        if (item instanceof HTMLButtonElement) item.disabled = true;
      }
      menu.appendChild(item);
    }
    root.append(trigger, menu);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const trigger = this.querySelector<HTMLButtonElement>("[data-dropdown-trigger]");
    if (!trigger) return;
    trigger.disabled = this.hasAttribute("disabled");
    const label = trigger.querySelector<HTMLElement>(".blora-dropdown__label");
    if (label) label.textContent = this.getAttribute("label") ?? "Menu";
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-dropdown");
    if (!root) return;
    this.controller?.destroy();
    this.controller = createDropdownController(root);
    this.listen(root, "click", (event) => {
      const item = (event.target as HTMLElement).closest<HTMLElement>(".blora-dropdown__item");
      if (item && item.getAttribute("aria-disabled") !== "true") {
        this.emit("blora-select", { value: item.dataset.value ?? "" });
      }
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraDropdown(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_DROPDOWN_TAG)) return;
  registry.define(BLORA_DROPDOWN_TAG, BloraDropdown);
}
