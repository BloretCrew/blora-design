import { BloraElement } from "../../core/blora-element.js";
import { attachFormInternals, setHostFormValue } from "../../core/form-associated.js";
import { t } from "../../core/i18n.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_NUMBER_INPUT_TAG = "blora-number-input";

export class BloraNumberInput extends BloraElement {
  static formAssociated = true;
  private internals: ElementInternals | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["name", "value", "min", "max", "step", "label", "disabled"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get value(): number {
    return Number(
      this.querySelector<HTMLInputElement>("input")?.value ?? this.getAttribute("value") ?? 0,
    );
  }

  set value(value: number) {
    this.setAttribute("value", String(value));
  }

  override focus(options?: FocusOptions): void {
    this.querySelector<HTMLInputElement>("input")?.focus(options);
  }

  protected render(): void {
    this.internals ??= attachFormInternals(this);
    const doc = this.ownerDocument;
    const root = doc.createElement("div");
    root.className = "blora-number-input";
    root.dataset.bloraGenerated = "";
    const fieldId = `blora-number-input-${Math.random().toString(36).slice(2, 9)}`;
    const label = this.getAttribute("label");
    if (label) {
      const labelNode = doc.createElement("label");
      labelNode.className = "blora-number-input__label";
      labelNode.htmlFor = fieldId;
      labelNode.textContent = label;
      root.appendChild(labelNode);
    }
    const control = doc.createElement("div");
    control.className = "blora-number-input__control";
    const input = doc.createElement("input");
    input.id = fieldId;
    input.className = "blora-input blora-number-input__field";
    input.type = "number";
    input.name = this.internals ? "" : (this.getAttribute("name") ?? "");
    input.value = this.getAttribute("value") ?? "0";
    for (const name of ["min", "max", "step"] as const) {
      const value = this.getAttribute(name);
      if (value !== null) input.setAttribute(name, value);
    }
    input.disabled = this.hasAttribute("disabled");
    const controls = doc.createElement("div");
    controls.className = "blora-number-input__actions";
    const down = this.makeButton(t("number.decrease"), "minus", -1);
    const up = this.makeButton(t("number.increase"), "plus", 1);
    controls.append(down, up);
    control.append(input, controls);
    root.appendChild(control);
    this.replaceChildren(root);
    setHostFormValue(this.internals, String(this.value));
  }

  private makeButton(label: string, icon: "minus" | "plus", direction: -1 | 1): HTMLButtonElement {
    const button = this.ownerDocument.createElement("button");
    button.type = "button";
    button.className = "blora-number-input__button";
    button.dataset.direction = String(direction);
    button.disabled = this.hasAttribute("disabled");
    button.setAttribute("aria-label", label);
    button.appendChild(createBloraIcon(icon, 14, this.ownerDocument));
    return button;
  }

  protected override sync(): void {
    const input = this.querySelector<HTMLInputElement>("input");
    if (!input) return;
    input.name = this.internals ? "" : (this.getAttribute("name") ?? "");
    if (document.activeElement !== input) input.value = this.getAttribute("value") ?? input.value;
    for (const name of ["min", "max", "step"] as const) {
      const value = this.getAttribute(name);
      if (value !== null) input.setAttribute(name, value);
      else input.removeAttribute(name);
    }
    input.disabled = this.hasAttribute("disabled");
    const label = this.querySelector<HTMLLabelElement>(".blora-number-input__label");
    if (label) label.textContent = this.getAttribute("label") ?? "";
    this.querySelectorAll<HTMLButtonElement>(".blora-number-input__button").forEach((button) => {
      button.disabled = this.hasAttribute("disabled");
    });
    setHostFormValue(this.internals, String(this.value));
  }

  protected bindEvents(): void {
    const input = this.querySelector<HTMLInputElement>("input");
    if (!input) return;
    this.listen(input, "change", () => this.reflectValue(input));
    this.querySelectorAll<HTMLButtonElement>(".blora-number-input__button").forEach((button) => {
      this.listen(button, "click", () => {
        const direction = Number(button.dataset.direction);
        if (direction > 0) input.stepUp();
        else input.stepDown();
        this.reflectValue(input);
      });
    });
  }

  private reflectValue(input: HTMLInputElement): void {
    this.reflecting = true;
    this.setAttribute("value", input.value);
    this.reflecting = false;
    setHostFormValue(this.internals, input.value);
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

export function defineBloraNumberInput(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_NUMBER_INPUT_TAG)) return;
  registry.define(BLORA_NUMBER_INPUT_TAG, BloraNumberInput);
}
