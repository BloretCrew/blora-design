/**
 * Blora Design 2.0 - Select Web Component
 * Spec §17.2: Form-associated combobox, §11.2: ElementInternals
 */
import { BloraElement } from "../../core/blora-element.js";
import { OverlayController } from "../../controllers/overlay-controller.js";

import selectStyles from "./select.css?inline";

export const BLORA_SELECT_TAG = "blora-select";

export interface BloraOptionData {
  value: string;
  label: string;
  disabled?: boolean;
}

export class BloraSelect extends BloraElement {
  static formAssociated = true;

  static get observedAttributes(): string[] {
    return ["value", "disabled", "required", "placeholder"];
  }

  private _internals: ElementInternals | null = null;
  private _overlay: OverlayController | null = null;
  private _isOpen = false;
  private _activeIndex = -1;
  private _options: BloraOptionData[] = [];
  private _value = "";

  // Shadow DOM refs
  private _trigger: HTMLButtonElement | null = null;
  private _popup: HTMLElement | null = null;
  private _listbox: HTMLElement | null = null;

  attributeChangedCallback(name: string, _old: string, value: string): void {
    if (!this.isConnectedInternal) return;

    if (name === "value") {
      this._value = value;
      this._updateDisplay();
      if (typeof this._internals?.setFormValue === "function") {
        this._internals.setFormValue(value);
      }
    }
  }

  protected render(): void {
    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = selectStyles;
    shadow.appendChild(style);

    // Trigger button
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "blora-select__trigger";
    trigger.setAttribute("part", "trigger");
    trigger.setAttribute("role", "combobox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-haspopup", "listbox");

    const valueSpan = document.createElement("span");
    valueSpan.className = "blora-select__value";
    valueSpan.setAttribute("part", "value");
    trigger.appendChild(valueSpan);

    // Popup
    const popup = document.createElement("div");
    popup.className = "blora-select__popup";
    popup.setAttribute("part", "popup");
    popup.setAttribute("role", "listbox");

    const listbox = document.createElement("div");
    listbox.className = "blora-select__listbox";
    listbox.setAttribute("part", "listbox");
    popup.appendChild(listbox);

    // Slot for blora-option elements
    const slot = document.createElement("slot");
    listbox.appendChild(slot);

    shadow.appendChild(trigger);
    shadow.appendChild(popup);

    this._trigger = trigger;
    this._popup = popup;
    this._listbox = listbox;

    // Setup ElementInternals for form association
    if (typeof this.attachInternals === "function") {
      this._internals = this.attachInternals();
    }

    // Collect initial options
    this._initOptions();
  }

  protected bindEvents(): void {
    if (!this._trigger || !this._popup) return;

    this.listen(this._trigger, "click", () => {
      if (this._isOpen) {
        this.close("trigger-click");
      } else {
        this.open();
      }
    });

    this.listen(this._trigger, "keydown", (e: Event) => {
      this._onKeyDown(e as KeyboardEvent);
    });

    this.listen(this._popup, "pointerdown", (e: Event) => {
      const target = e.target as HTMLElement;
      const option = target.closest?.(".blora-select__option") as HTMLElement | null;
      if (option && !option.hasAttribute("data-disabled")) {
        const index = Number((option as HTMLElement).dataset.index);
        this._selectIndex(index);
        this.close("option-click");
      }
    });
  }

  // Public API

  get value(): string {
    return this._value;
  }

  set value(v: string) {
    this.setAttribute("value", v);
  }

  get selectedOptions(): readonly BloraOptionData[] {
    const selected = this._options.find((o) => o.value === this._value);
    return selected ? [selected] : [];
  }

  get options(): readonly BloraOptionData[] {
    return this._options;
  }

  open(): void {
    if (this._isOpen || this.hasAttribute("disabled")) return;

    const beforeOpen = this.emit(
      "blora-before-open",
      { source: "api", reason: "open" },
      { cancelable: true },
    );
    if (!beforeOpen) return;

    this._isOpen = true;
    this._trigger?.setAttribute("aria-expanded", "true");
    this._popup?.setAttribute("data-open", "");
    this._activeIndex = this._options.findIndex((o) => o.value === this._value);
    this._updateActiveOption();

    if (this._popup) {
      this._overlay = new OverlayController(this._popup, {
        modal: false,
        closeOnEscape: true,
        closeOnOutsidePointer: false,
        restoreFocus: true,
        trapFocus: false,
        lockScroll: false,
      });
      this._overlay.open();
    }

    this.emit("blora-open", { source: "api", reason: "open" });
  }

  close(reason: string = "api"): void {
    if (!this._isOpen) return;

    const beforeClose = this.emit(
      "blora-before-close",
      { source: "api", reason },
      { cancelable: true },
    );
    if (!beforeClose) return;

    this._isOpen = false;
    this._trigger?.setAttribute("aria-expanded", "false");
    this._popup?.removeAttribute("data-open");
    this._overlay?.close();
    this._overlay = null;

    this.emit("blora-close", { source: "api", reason });
  }

  focus(): void {
    this._trigger?.focus();
  }

  checkValidity(): boolean {
    if (this._internals) {
      return this._internals.checkValidity();
    }
    return true;
  }

  reportValidity(): boolean {
    if (this._internals) {
      return this._internals.reportValidity();
    }
    return true;
  }

  setCustomValidity(message: string): void {
    this._internals?.setValidity({ customError: !!message }, message);
  }

  // Internal methods

  private _collectOptions(): void {
    const slotted = this.querySelectorAll("blora-option");
    this._options = Array.from(slotted).map((el) => {
      const option = el as HTMLElement;
      return {
        value: option.getAttribute("value") ?? option.textContent ?? "",
        label: option.textContent ?? "",
        disabled: option.hasAttribute("disabled"),
      };
    });
    this._renderOptions();
    this._updateDisplay();
  }

  private _renderOptions(): void {
    if (!this._listbox) return;

    // Clear existing rendered options (keep the slot)
    const existing = this._listbox.querySelectorAll(".blora-select__option, .blora-select__empty");
    existing.forEach((el) => el.remove());

    if (this._options.length === 0) {
      const empty = document.createElement("div");
      empty.className = "blora-select__empty";
      empty.textContent = "No options";
      this._listbox.appendChild(empty);
      return;
    }

    this._options.forEach((opt, index) => {
      const div = document.createElement("div");
      div.className = "blora-select__option";
      div.setAttribute("part", "option");
      div.setAttribute("role", "option");
      div.dataset.index = String(index);
      div.dataset.value = opt.value;
      div.textContent = opt.label;

      if (opt.disabled) {
        div.setAttribute("data-disabled", "");
        div.setAttribute("aria-disabled", "true");
      }
      if (opt.value === this._value) {
        div.setAttribute("data-selected", "");
        div.setAttribute("aria-selected", "true");
      }

      this._listbox!.appendChild(div);
    });
  }

  private _updateDisplay(): void {
    if (!this._trigger) return;
    const valueSpan = this._trigger.querySelector(".blora-select__value");
    if (!valueSpan) return;

    const selected = this._options.find((o) => o.value === this._value);
    if (selected) {
      valueSpan.textContent = selected.label;
      this._trigger.removeAttribute("data-placeholder");
    } else {
      const placeholder = this.getAttribute("placeholder") ?? "";
      valueSpan.textContent = placeholder;
      if (placeholder) {
        this._trigger.setAttribute("data-placeholder", "");
      }
    }
  }

  private _selectIndex(index: number): void {
    const option = this._options[index];
    if (!option || option.disabled) return;

    const oldValue = this._value;
    this._value = option.value;
    this.setAttribute("value", option.value);
    if (typeof this._internals?.setFormValue === "function") {
      this._internals.setFormValue(option.value);
    }

    // Update selected display
    this._renderOptions();
    this._updateDisplay();

    if (oldValue !== option.value) {
      this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    }
  }

  private _updateActiveOption(): void {
    if (!this._listbox) return;

    const optionEls = this._listbox.querySelectorAll(".blora-select__option");
    optionEls.forEach((el, i) => {
      if (i === this._activeIndex) {
        el.setAttribute("data-active", "");
        el.scrollIntoView({ block: "nearest" });
      } else {
        el.removeAttribute("data-active");
      }
    });

    if (this._trigger && this._activeIndex >= 0) {
      this._trigger.setAttribute("aria-activedescendant", `select-option-${this._activeIndex}`);
    }
  }

  private _onKeyDown(e: KeyboardEvent): void {
    if (this.hasAttribute("disabled")) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!this._isOpen) {
          this.open();
        } else {
          this._activeIndex = Math.min(this._activeIndex + 1, this._options.length - 1);
          this._skipDisabled(1);
          this._updateActiveOption();
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (this._isOpen) {
          this._activeIndex = Math.max(this._activeIndex - 1, 0);
          this._skipDisabled(-1);
          this._updateActiveOption();
        }
        break;
      case "Home":
        if (this._isOpen) {
          e.preventDefault();
          this._activeIndex = 0;
          this._skipDisabled(1);
          this._updateActiveOption();
        }
        break;
      case "End":
        if (this._isOpen) {
          e.preventDefault();
          this._activeIndex = this._options.length - 1;
          this._skipDisabled(-1);
          this._updateActiveOption();
        }
        break;
      case "Enter":
        if (this._isOpen && this._activeIndex >= 0) {
          e.preventDefault();
          this._selectIndex(this._activeIndex);
          this.close("enter");
        }
        break;
      case "Escape":
        if (this._isOpen) {
          e.preventDefault();
          this.close("escape");
        }
        break;
      case "Tab":
        if (this._isOpen) {
          this.close("tab");
        }
        break;
    }
  }

  private _skipDisabled(direction: number): void {
    while (
      this._activeIndex >= 0 &&
      this._activeIndex < this._options.length &&
      this._options[this._activeIndex]?.disabled
    ) {
      this._activeIndex += direction;
    }
    if (this._activeIndex < 0) this._activeIndex = 0;
    if (this._activeIndex >= this._options.length) this._activeIndex = this._options.length - 1;
  }

  protected onDisconnect(): void {
    this._overlay?.destroy();
    this._overlay = null;
    this._isOpen = false;
  }

  // Called by connectedCallback to collect initial options
  private _initOptions(): void {
    this._collectOptions();

    // Watch for slot content changes
    if (this._listbox) {
      const slot = this._listbox.querySelector("slot");
      if (slot) {
        const observer = new MutationObserver(() => this._collectOptions());
        observer.observe(this, { childList: true, subtree: true, attributes: true });
      }
    }
  }
}

export function defineBloraSelect(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_SELECT_TAG)) return;
  registry.define(BLORA_SELECT_TAG, BloraSelect);
}
