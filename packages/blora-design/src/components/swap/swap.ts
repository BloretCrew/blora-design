import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";
import { createBloraIcon, type BloraIconName } from "../../core/icons.js";

export const BLORA_SWAP_TAG = "blora-swap";

export class BloraSwap extends BloraElement {
  private reflecting = false;
  static get observedAttributes(): string[] {
    return ["name", "checked", "disabled", "on-label", "off-label", "on-icon", "off-icon"];
  }
  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }
  get checked(): boolean {
    return this.querySelector<HTMLInputElement>("input")?.checked ?? false;
  }
  set checked(checked: boolean) {
    this.toggleAttribute("checked", checked);
  }
  override focus(options?: FocusOptions): void {
    this.querySelector<HTMLInputElement>("input")?.focus(options);
  }
  protected render(): void {
    const doc = this.ownerDocument;
    const label = doc.createElement("label");
    label.className = "blora-swap";
    label.dataset.bloraGenerated = "";
    const input = doc.createElement("input");
    input.type = "checkbox";
    input.name = this.getAttribute("name") ?? "";
    input.checked = this.hasAttribute("checked");
    input.disabled = this.hasAttribute("disabled");
    const visual = doc.createElement("span");
    visual.className = "blora-swap__visual";
    visual.setAttribute("aria-hidden", "true");
    const on = this.hasAttribute("checked");
    const iconName = (this.getAttribute(on ? "on-icon" : "off-icon") ??
      (on ? "sun" : "moon")) as BloraIconName;
    visual.appendChild(createBloraIcon(iconName, 18, doc));
    const text = doc.createElement("span");
    text.className = "blora-swap__label";
    text.textContent =
      this.getAttribute(on ? "on-label" : "off-label") ?? (on ? t("swap.on") : t("swap.off"));
    label.append(input, visual, text);
    this.replaceChildren(label);
  }
  protected override sync(): void {
    const input = this.querySelector<HTMLInputElement>("input");
    if (!input) return;
    input.name = this.getAttribute("name") ?? "";
    input.checked = this.hasAttribute("checked");
    input.disabled = this.hasAttribute("disabled");
    const on = input.checked;
    const visual = this.querySelector<HTMLElement>(".blora-swap__visual");
    if (visual) {
      visual.replaceChildren(
        createBloraIcon(
          (this.getAttribute(on ? "on-icon" : "off-icon") ??
            (on ? "sun" : "moon")) as BloraIconName,
          18,
          this.ownerDocument,
        ),
      );
    }
    const text = this.querySelector<HTMLElement>(".blora-swap__label");
    if (text) {
      text.textContent =
        this.getAttribute(on ? "on-label" : "off-label") ?? (on ? t("swap.on") : t("swap.off"));
    }
  }

  protected bindEvents(): void {
    const input = this.querySelector<HTMLInputElement>("input");
    if (!input) return;
    this.listen(input, "change", () => {
      this.reflecting = true;
      this.toggleAttribute("checked", input.checked);
      this.reflecting = false;
      this.sync();
      this.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }
}
export function defineBloraSwap(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_SWAP_TAG)) return;
  registry.define(BLORA_SWAP_TAG, BloraSwap);
}
