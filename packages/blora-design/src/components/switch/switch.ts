import { BloraElement } from "../../core/blora-element.js";
import { attachFormInternals, setHostFormValue } from "../../core/form-associated.js";

export const BLORA_SWITCH_TAG = "blora-switch";

/** Switch CE backed by a real light-DOM checkbox. */
export class BloraSwitch extends BloraElement {
  static formAssociated = true;
  private internals: ElementInternals | null = null;
  private initialLabel: string | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["name", "value", "checked", "disabled", "required", "label", "size"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get checked(): boolean {
    return this.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked ?? false;
  }

  set checked(checked: boolean) {
    this.toggleAttribute("checked", checked);
  }

  get value(): string {
    return this.getAttribute("value") ?? "on";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  override focus(options?: FocusOptions): void {
    this.querySelector<HTMLInputElement>('input[type="checkbox"]')?.focus(options);
  }

  private syncFormValue(): void {
    setHostFormValue(this.internals, this.checked ? this.value : null);
  }

  protected render(): void {
    this.internals ??= attachFormInternals(this);
    if (this.initialLabel === null) this.initialLabel = this.textContent?.trim() ?? "";
    const doc = this.ownerDocument;
    const label = doc.createElement("label");
    label.className = "blora-switch";
    label.dataset.bloraGenerated = "";
    const size = this.getAttribute("size");
    if (size === "sm" || size === "lg") label.dataset.size = size;
    const input = doc.createElement("input");
    input.type = "checkbox";
    input.name = this.internals ? "" : (this.getAttribute("name") ?? "");
    input.value = this.value;
    input.checked = this.hasAttribute("checked");
    input.disabled = this.hasAttribute("disabled");
    input.required = this.hasAttribute("required");
    const track = doc.createElement("span");
    track.className = "blora-switch__track";
    track.setAttribute("aria-hidden", "true");
    label.append(input, track, doc.createTextNode(this.getAttribute("label") ?? this.initialLabel));
    this.replaceChildren(label);
    this.syncFormValue();
  }

  protected override sync(): void {
    const input = this.querySelector<HTMLInputElement>('input[type="checkbox"]');
    const label = this.querySelector<HTMLLabelElement>(".blora-switch");
    if (!input || !label) return;
    const size = this.getAttribute("size");
    if (size === "sm" || size === "lg") label.dataset.size = size;
    else delete label.dataset.size;
    input.name = this.internals ? "" : (this.getAttribute("name") ?? "");
    input.value = this.value;
    input.checked = this.hasAttribute("checked");
    input.disabled = this.hasAttribute("disabled");
    input.required = this.hasAttribute("required");
    const last = label.lastChild;
    if (last?.nodeType === Node.TEXT_NODE) {
      last.textContent = this.getAttribute("label") ?? this.initialLabel ?? "";
    }
    this.syncFormValue();
  }

  protected bindEvents(): void {
    const input = this.querySelector<HTMLInputElement>('input[type="checkbox"]');
    if (!input) return;
    this.listen(input, "change", () => {
      this.reflecting = true;
      this.toggleAttribute("checked", input.checked);
      this.reflecting = false;
      this.syncFormValue();
    });
  }
}

export function defineBloraSwitch(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_SWITCH_TAG)) return;
  registry.define(BLORA_SWITCH_TAG, BloraSwitch);
}
