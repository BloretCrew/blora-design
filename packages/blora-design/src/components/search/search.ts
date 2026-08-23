/**
 * Blora Design 2.0 - Search controller
 * Wires up the clear button visibility and click-to-clear behavior.
 */
import { BloraElement } from "../../core/blora-element.js";
import { attachFormInternals, setHostFormValue } from "../../core/form-associated.js";
import { t } from "../../core/i18n.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_SEARCH_TAG = "blora-search";

export interface SearchController {
  destroy(): void;
}

export function createSearchController(root: HTMLElement): SearchController {
  const input = root.querySelector<HTMLInputElement>("input");
  const clear = root.querySelector<HTMLButtonElement>(".blora-search__clear");

  if (!input) return { destroy: () => {} };

  const updateClear = () => {
    if (clear) clear.hidden = input.value.length === 0;
  };

  const onInput = () => updateClear();
  const onClear = (e: Event) => {
    e.preventDefault();
    input.value = "";
    updateClear();
    input.focus();
  };

  input.addEventListener("input", onInput);
  clear?.addEventListener("click", onClear);
  updateClear();

  return {
    destroy() {
      input.removeEventListener("input", onInput);
      clear?.removeEventListener("click", onClear);
    },
  };
}

/** Composite CE that owns the search icon, native field and clear affordance. */
export class BloraSearch extends BloraElement {
  static formAssociated = true;

  private controller: SearchController | null = null;
  private internals: ElementInternals | null = null;

  /** Submitted under `name` via ElementInternals; inner input stays unnamed. */
  private syncFormValue(): void {
    const value = this.querySelector<HTMLInputElement>(".blora-input")?.value ?? "";
    setHostFormValue(this.internals, value === "" ? null : value);
  }

  static get observedAttributes(): string[] {
    return ["value", "placeholder", "name", "disabled", "required", "label"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal) return;
    this.sync();
  }

  get value(): string {
    return this.querySelector<HTMLInputElement>(".blora-input")?.value ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  focus(options?: FocusOptions): void {
    this.querySelector<HTMLInputElement>(".blora-input")?.focus(options);
  }

  protected render(): void {
    this.internals ??= attachFormInternals(this);
    const root = document.createElement("div");
    root.className = "blora-search";
    root.dataset.bloraGenerated = "";

    const search = document.createElement("button");
    search.className = "blora-search__icon";
    search.type = "button";
    search.setAttribute("aria-label", this.getAttribute("label") ?? t("search.label"));
    search.appendChild(createBloraIcon("search"));

    const input = document.createElement("input");
    input.className = "blora-input";
    input.type = "search";
    input.value = this.getAttribute("value") ?? "";
    input.placeholder = this.getAttribute("placeholder") ?? t("search.placeholder");
    input.disabled = this.hasAttribute("disabled");
    input.required = this.hasAttribute("required");
    input.name = this.internals ? "" : (this.getAttribute("name") ?? "");

    const clear = document.createElement("button");
    clear.className = "blora-search__clear";
    clear.type = "button";
    clear.hidden = input.value.length === 0;
    clear.disabled = input.disabled;
    clear.setAttribute("aria-label", t("common.clear"));
    clear.appendChild(createBloraIcon("close"));

    root.append(search, input, clear);
    this.replaceChildren(root);
    this.syncFormValue();
  }

  protected override sync(): void {
    const input = this.querySelector<HTMLInputElement>(".blora-input");
    if (!input) return;
    if (document.activeElement !== input) input.value = this.getAttribute("value") ?? input.value;
    input.placeholder = this.getAttribute("placeholder") ?? t("search.placeholder");
    input.disabled = this.hasAttribute("disabled");
    input.required = this.hasAttribute("required");
    input.name = this.internals ? "" : (this.getAttribute("name") ?? "");
    const clear = this.querySelector<HTMLButtonElement>(".blora-search__clear");
    if (clear) {
      clear.hidden = input.value.length === 0;
      clear.disabled = input.disabled;
    }
    const search = this.querySelector<HTMLButtonElement>(".blora-search__icon");
    if (search) search.setAttribute("aria-label", this.getAttribute("label") ?? t("search.label"));
    this.syncFormValue();
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-search");
    this.controller?.destroy();
    this.controller = root ? createSearchController(root) : null;
    const input = this.querySelector<HTMLInputElement>(".blora-input");
    if (input) this.listen(input, "input", () => this.syncFormValue());
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraSearch(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_SEARCH_TAG)) return;
  registry.define(BLORA_SEARCH_TAG, BloraSearch);
}
