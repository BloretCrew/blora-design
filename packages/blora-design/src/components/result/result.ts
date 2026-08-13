import { BloraElement } from "../../core/blora-element.js";
import { createStatusIcon, type StatusIconVariant } from "../../core/status-icon.js";

export const BLORA_RESULT_TAG = "blora-result";

export class BloraResult extends BloraElement {
  static get observedAttributes(): string[] {
    return ["variant", "title", "description"];
  }

  attributeChangedCallback(): void {
    if (this.isConnectedInternal) this.sync();
  }

  protected render(): void {
    const variant = (this.getAttribute("variant") ?? "info") as StatusIconVariant;
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-result";
    root.dataset.variant = variant;
    root.dataset.bloraGenerated = "";
    root.setAttribute("role", "status");
    const icon = this.ownerDocument.createElement("div");
    icon.className = "blora-result__icon";
    icon.appendChild(createStatusIcon(this.ownerDocument, variant, 48));
    const title = this.ownerDocument.createElement("div");
    title.className = "blora-result__title";
    title.textContent = this.getAttribute("title") ?? "";
    const description = this.ownerDocument.createElement("div");
    description.className = "blora-result__desc";
    description.textContent = this.getAttribute("description") ?? "";
    root.append(icon, title, description);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-result");
    if (!root) return;
    const variant = (this.getAttribute("variant") ?? "info") as StatusIconVariant;
    root.dataset.variant = variant;
    const icon = root.querySelector(".blora-result__icon");
    if (icon) icon.replaceChildren(createStatusIcon(this.ownerDocument, variant, 48));
    const title = root.querySelector(".blora-result__title");
    if (title) title.textContent = this.getAttribute("title") ?? "";
    const description = root.querySelector(".blora-result__desc");
    if (description) description.textContent = this.getAttribute("description") ?? "";
  }

  protected bindEvents(): void {}
}

export function defineBloraResult(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_RESULT_TAG)) return;
  registry.define(BLORA_RESULT_TAG, BloraResult);
}
