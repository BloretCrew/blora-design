import { BloraElement } from "../../core/blora-element.js";

export const BLORA_RADIO_TAG = "blora-radio";

/** Radio CE backed by a real light-DOM `<input type="radio">`. */
export class BloraRadio extends BloraElement {
  private initialLabel: string | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["name", "value", "checked", "disabled", "required", "label"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get checked(): boolean {
    return this.querySelector<HTMLInputElement>('input[type="radio"]')?.checked ?? false;
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
    this.querySelector<HTMLInputElement>('input[type="radio"]')?.focus(options);
  }

  protected render(): void {
    if (this.initialLabel === null) this.initialLabel = this.textContent?.trim() ?? "";
    const doc = this.ownerDocument;
    const label = doc.createElement("label");
    label.className = "blora-radio";
    label.dataset.bloraGenerated = "";
    const input = doc.createElement("input");
    input.type = "radio";
    input.name = this.getAttribute("name") ?? "";
    input.value = this.value;
    input.checked = this.hasAttribute("checked");
    input.disabled = this.hasAttribute("disabled");
    input.required = this.hasAttribute("required");
    const dot = doc.createElement("span");
    dot.className = "blora-radio__dot";
    dot.setAttribute("aria-hidden", "true");
    label.append(input, dot, doc.createTextNode(this.getAttribute("label") ?? this.initialLabel));
    this.replaceChildren(label);
  }

  protected override sync(): void {
    const input = this.querySelector<HTMLInputElement>('input[type="radio"]');
    if (!input) return;
    input.name = this.getAttribute("name") ?? "";
    input.value = this.value;
    input.checked = this.hasAttribute("checked");
    input.disabled = this.hasAttribute("disabled");
    input.required = this.hasAttribute("required");
    const label = this.querySelector<HTMLLabelElement>(".blora-radio");
    if (label) {
      const last = label.lastChild;
      if (last?.nodeType === Node.TEXT_NODE) {
        last.textContent = this.getAttribute("label") ?? this.initialLabel ?? "";
      }
    }
  }

  protected bindEvents(): void {
    const input = this.querySelector<HTMLInputElement>('input[type="radio"]');
    if (!input) return;
    this.listen(input, "change", () => {
      if (input.checked && input.name) {
        for (const peer of this.ownerDocument.querySelectorAll<HTMLInputElement>(
          'blora-radio input[type="radio"]',
        )) {
          if (peer === input || peer.name !== input.name || peer.form !== input.form) continue;
          const host = peer.closest("blora-radio");
          if (host?.hasAttribute("checked")) host.removeAttribute("checked");
        }
      }
      this.reflecting = true;
      this.toggleAttribute("checked", input.checked);
      this.reflecting = false;
    });
  }
}

export function defineBloraRadio(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_RADIO_TAG)) return;
  registry.define(BLORA_RADIO_TAG, BloraRadio);
}
