/**
 * Checkbox group: data-blora-checkall master toggle (v1 initCheckbox).
 */
import { BloraElement } from "../../core/blora-element.js";

export const BLORA_CHECKBOX_TAG = "blora-checkbox";
export interface CheckboxController {
  destroy(): void;
}

export function createCheckboxController(root: HTMLElement): CheckboxController {
  const master = root.querySelector<HTMLInputElement>(
    "[data-blora-checkall], .blora-checkbox__input[data-blora-checkall]",
  );
  if (!master) return { destroy: () => {} };

  const items = () =>
    Array.from(
      root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:not([data-blora-checkall])'),
    );

  const syncMaster = () => {
    const list = items();
    const checked = list.filter((i) => i.checked).length;
    master.checked = list.length > 0 && checked === list.length;
    master.indeterminate = checked > 0 && checked < list.length;
  };

  const onMaster = () => {
    items().forEach((i) => {
      if (!i.disabled) i.checked = master.checked;
    });
    master.indeterminate = false;
  };

  const onChange = (event: Event) => {
    if (event.target !== master) syncMaster();
  };

  master.addEventListener("change", onMaster);
  root.addEventListener("change", onChange);
  syncMaster();

  return {
    destroy() {
      master.removeEventListener("change", onMaster);
      root.removeEventListener("change", onChange);
    },
  };
}

interface CheckboxDefinition {
  checked: boolean;
  checkAll: boolean;
  disabled: boolean;
  label: string;
  value: string;
}

/** Native checkbox CE; optional child definitions create a check-all group. */
export class BloraCheckbox extends BloraElement {
  private controller: CheckboxController | null = null;
  private definitions: CheckboxDefinition[] | null = null;
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
    return this.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked ?? false;
  }

  set checked(checked: boolean) {
    this.toggleAttribute("checked", checked);
  }

  get values(): string[] {
    return Array.from(
      this.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]:checked:not([data-blora-checkall])',
      ),
      (input) => input.value,
    );
  }

  override focus(options?: FocusOptions): void {
    this.querySelector<HTMLInputElement>('input[type="checkbox"]')?.focus(options);
  }

  protected render(): void {
    if (this.initialLabel === null) this.initialLabel = this.textContent?.trim() ?? "";
    if (!this.definitions) {
      const options = Array.from(this.children).filter(
        (item) => item.localName === "blora-checkbox-option",
      );
      if (options.length) {
        this.definitions = options.map((item) => ({
          checked: item.hasAttribute("checked"),
          checkAll: item.hasAttribute("check-all"),
          disabled: item.hasAttribute("disabled"),
          label: item.getAttribute("label") ?? item.textContent?.trim() ?? "",
          value: item.getAttribute("value") ?? item.textContent?.trim() ?? "on",
        }));
      }
    }

    if (this.definitions) {
      const group = this.ownerDocument.createElement("div");
      group.className = "blora-stack";
      group.dataset.bloraGenerated = "";
      group.setAttribute("role", "group");
      if (this.getAttribute("label")) group.setAttribute("aria-label", this.getAttribute("label")!);
      this.definitions.forEach((definition) =>
        group.appendChild(this.createCheckbox(definition, this.getAttribute("name") ?? "")),
      );
      this.replaceChildren(group);
      this.dataset.group = "";
      return;
    }

    this.removeAttribute("data-group");
    this.replaceChildren(
      this.createCheckbox(
        {
          checked: this.hasAttribute("checked"),
          checkAll: false,
          disabled: this.hasAttribute("disabled"),
          label: this.getAttribute("label") ?? this.initialLabel,
          value: this.getAttribute("value") ?? "on",
        },
        this.getAttribute("name") ?? "",
      ),
    );
  }

  protected override sync(): void {
    this.captureLiveState();
    const inputs = Array.from(this.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
    if (!inputs.length) return;
    const name = this.getAttribute("name") ?? "";
    const required = this.hasAttribute("required");
    if (this.definitions) {
      inputs.forEach((input, index) => {
        const definition = this.definitions![index];
        if (!definition) return;
        input.name = name;
        input.required = required;
        input.disabled = definition.disabled;
      });
      const group = this.querySelector<HTMLElement>("[role='group']");
      if (group) {
        if (this.getAttribute("label"))
          group.setAttribute("aria-label", this.getAttribute("label")!);
        else group.removeAttribute("aria-label");
      }
      return;
    }
    const input = inputs[0]!;
    input.name = name;
    input.value = this.getAttribute("value") ?? "on";
    input.checked = this.hasAttribute("checked");
    input.disabled = this.hasAttribute("disabled");
    input.required = required;
    const label = this.querySelector<HTMLLabelElement>(".blora-checkbox");
    if (label) {
      const text = this.getAttribute("label") ?? this.initialLabel ?? "";
      const last = label.lastChild;
      if (last?.nodeType === Node.TEXT_NODE) last.textContent = text;
    }
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>("[data-blora-generated]");
    if (!root) return;
    this.controller?.destroy();
    this.controller = createCheckboxController(root);
    const sync = (input: HTMLInputElement) => {
      if (!this.definitions) {
        this.reflecting = true;
        this.toggleAttribute("checked", input.checked);
        this.reflecting = false;
      }
      this.syncIndeterminate(root);
    };
    this.listen(root, "change", (event) => sync(event.target as HTMLInputElement));
    this.syncIndeterminate(root);
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }

  private createCheckbox(definition: CheckboxDefinition, name: string): HTMLLabelElement {
    const label = this.ownerDocument.createElement("label");
    label.className = "blora-checkbox";
    label.dataset.bloraGenerated = "";
    const input = this.ownerDocument.createElement("input");
    input.type = "checkbox";
    input.name = name;
    input.value = definition.value;
    input.checked = definition.checked;
    input.disabled = definition.disabled;
    input.required = this.hasAttribute("required");
    if (definition.checkAll) input.dataset.bloraCheckall = "";
    const box = this.ownerDocument.createElement("span");
    box.className = "blora-checkbox__box";
    box.setAttribute("aria-hidden", "true");
    label.append(input, box, this.ownerDocument.createTextNode(definition.label));
    return label;
  }

  private captureLiveState(): void {
    if (!this.definitions) return;
    const inputs = Array.from(this.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
    this.definitions = this.definitions.map((definition, index) => ({
      ...definition,
      checked: inputs[index]?.checked ?? definition.checked,
    }));
  }

  private syncIndeterminate(root: HTMLElement): void {
    root.querySelectorAll<HTMLInputElement>("input[data-blora-checkall]").forEach((input) => {
      input
        .closest<HTMLElement>(".blora-checkbox")
        ?.toggleAttribute("data-indeterminate", input.indeterminate);
    });
  }
}

export function defineBloraCheckbox(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_CHECKBOX_TAG)) return;
  registry.define(BLORA_CHECKBOX_TAG, BloraCheckbox);
}
