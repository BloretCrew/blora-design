/**
 * Blora Design 2.0 - Autocomplete controller
 * Filters options from data-options and shows a dropdown.
 */
import { BloraElement } from "../../core/blora-element.js";

export const BLORA_AUTOCOMPLETE_TAG = "blora-autocomplete";

export interface AutocompleteController {
  destroy(): void;
}

export function createAutocompleteController(root: HTMLElement): AutocompleteController {
  const doc = root.ownerDocument;
  const input = root.querySelector<HTMLInputElement>("input");
  if (!input) return { destroy: () => {} };

  const raw = root.dataset.options ?? "[]";
  let options: string[] = [];
  try {
    options = JSON.parse(raw);
  } catch {
    options = [];
  }

  let menu = root.querySelector<HTMLElement>(".blora-autocomplete__menu");
  if (!menu) {
    menu = doc.createElement("div");
    menu.className = "blora-autocomplete__menu";
    root.appendChild(menu);
  }
  const menuEl: HTMLElement = menu;

  let activeIndex = -1;

  const render = (filter: string) => {
    const filtered = filter
      ? options.filter((o) => o.toLowerCase().includes(filter.toLowerCase()))
      : options;

    if (filtered.length === 0 || !filter) {
      menuEl.removeAttribute("data-open");
      menuEl.replaceChildren();
      return;
    }

    menuEl.setAttribute("data-open", "");
    menuEl.replaceChildren(
      ...filtered.map((opt, i) => {
        const div = doc.createElement("div");
        div.className = "blora-autocomplete__option";
        div.dataset.idx = String(i);
        div.setAttribute("role", "option");
        div.textContent = opt;
        return div;
      }),
    );
    activeIndex = -1;
  };

  const select = (val: string) => {
    input.value = val;
    menuEl.removeAttribute("data-open");
    menuEl.replaceChildren();
    root.dispatchEvent(
      new CustomEvent("blora-autocomplete-change", {
        bubbles: true,
        detail: { value: val },
      }),
    );
  };

  const onInput = () => render(input.value);

  const onKeyDown = (e: KeyboardEvent) => {
    if (!menuEl.hasAttribute("data-open")) return;
    const opts = Array.from(menuEl.querySelectorAll<HTMLElement>(".blora-autocomplete__option"));

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, opts.length - 1);
      opts.forEach((o, i) => o.toggleAttribute("data-active", i === activeIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      opts.forEach((o, i) => o.toggleAttribute("data-active", i === activeIndex));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = opts[activeIndex];
      if (opt) select(opt.textContent ?? "");
    } else if (e.key === "Escape") {
      menuEl.removeAttribute("data-open");
    }
  };

  const onClick = (e: MouseEvent) => {
    const opt = (e.target as HTMLElement).closest(".blora-autocomplete__option");
    if (opt) select(opt.textContent ?? "");
  };

  const onDocClick = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) {
      menuEl.removeAttribute("data-open");
    }
  };

  input.addEventListener("input", onInput);
  input.addEventListener("keydown", onKeyDown);
  menu.addEventListener("click", onClick);
  doc.addEventListener("click", onDocClick);

  return {
    destroy() {
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKeyDown);
      menuEl.removeEventListener("click", onClick);
      doc.removeEventListener("click", onDocClick);
    },
  };
}

interface AutocompleteDefinition {
  disabled: boolean;
  label: string;
  value: string;
}

/** Autocomplete CE that owns the label, search field and suggestion menu. */
export class BloraAutocomplete extends BloraElement {
  private controller: AutocompleteController | null = null;
  private definitions: AutocompleteDefinition[] | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["options", "label", "placeholder", "value", "disabled"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get value(): string {
    return this.querySelector<HTMLInputElement>("input")?.value ?? this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-autocomplete-option")
        .map((item) => ({
          disabled: item.hasAttribute("disabled"),
          label: item.getAttribute("label") ?? item.textContent?.trim() ?? "",
          value: item.getAttribute("value") ?? item.textContent?.trim() ?? "",
        }))
        .filter((item) => item.value && !item.disabled);
    }
    const attributeOptions = this.getAttribute("options") ?? this.getAttribute("data-options");
    let values = this.definitions.map((item) => item.label || item.value);
    if (attributeOptions) {
      try {
        const parsed = JSON.parse(attributeOptions) as unknown;
        if (Array.isArray(parsed)) values = parsed.map(String);
      } catch {
        values = [];
      }
    }

    const root = this.ownerDocument.createElement("div");
    root.className = "blora-autocomplete";
    root.dataset.bloraGenerated = "";
    root.dataset.options = JSON.stringify(values);
    const labelText = this.getAttribute("label");
    if (labelText) {
      const label = this.ownerDocument.createElement("label");
      label.className = "blora-label";
      label.textContent = labelText;
      root.appendChild(label);
    }
    const control = this.ownerDocument.createElement("div");
    control.className = "blora-autocomplete__control";
    const input = this.ownerDocument.createElement("input");
    input.className = "blora-input";
    input.type = "search";
    input.autocomplete = "off";
    input.placeholder = this.getAttribute("placeholder") ?? "";
    input.value = this.getAttribute("value") ?? "";
    input.disabled = this.hasAttribute("disabled");
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    const menu = this.ownerDocument.createElement("div");
    menu.className = "blora-autocomplete__menu";
    menu.setAttribute("role", "listbox");
    control.append(input, menu);
    root.appendChild(control);
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
    const root = this.querySelector<HTMLElement>(".blora-autocomplete");
    if (!root || this.hasAttribute("disabled")) return;
    this.controller = createAutocompleteController(root);
    this.listen(root, "blora-autocomplete-change", (event) => {
      const value = (event as CustomEvent<{ value: string }>).detail.value;
      this.reflecting = true;
      this.setAttribute("value", value);
      this.reflecting = false;
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraAutocomplete(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_AUTOCOMPLETE_TAG)) return;
  registry.define(BLORA_AUTOCOMPLETE_TAG, BloraAutocomplete);
}
