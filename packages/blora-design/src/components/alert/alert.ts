import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";
import { createBloraIcon } from "../../core/icons.js";
import { createStatusIcon, type StatusIconVariant } from "../../core/status-icon.js";

export const BLORA_ALERT_TAG = "blora-alert";

export class BloraAlert extends BloraElement {
  static get observedAttributes(): string[] {
    return ["variant", "title", "description", "dismissible"];
  }

  attributeChangedCallback(): void {
    if (this.isConnectedInternal) this.sync();
  }

  close(): void {
    this.emit("blora-alert-close", undefined);
    this.remove();
  }

  protected render(): void {
    const variant = (this.getAttribute("variant") ?? "info") as StatusIconVariant;
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-alert";
    root.dataset.variant = variant;
    root.dataset.bloraGenerated = "";
    root.setAttribute("role", variant === "danger" || variant === "error" ? "alert" : "status");
    const icon = this.ownerDocument.createElement("span");
    icon.className = "blora-alert__icon";
    icon.appendChild(createStatusIcon(this.ownerDocument, variant, 20));
    const body = this.ownerDocument.createElement("div");
    body.className = "blora-alert__body";
    const title = this.ownerDocument.createElement("div");
    title.className = "blora-alert__title";
    title.textContent = this.getAttribute("title") ?? "";
    const description = this.ownerDocument.createElement("div");
    description.className = "blora-alert__desc";
    description.textContent = this.getAttribute("description") ?? "";
    body.append(title, description);
    root.append(icon, body);
    if (this.hasAttribute("dismissible")) {
      const close = this.ownerDocument.createElement("button");
      close.className = "blora-alert__close";
      close.type = "button";
      close.setAttribute("aria-label", t("common.close"));
      close.appendChild(createBloraIcon("close", 16, this.ownerDocument));
      root.appendChild(close);
    }
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-alert");
    if (!root) return;
    const variant = (this.getAttribute("variant") ?? "info") as StatusIconVariant;
    root.dataset.variant = variant;
    root.setAttribute("role", variant === "danger" || variant === "error" ? "alert" : "status");
    const icon = root.querySelector(".blora-alert__icon");
    if (icon) icon.replaceChildren(createStatusIcon(this.ownerDocument, variant, 20));
    const title = root.querySelector(".blora-alert__title");
    if (title) title.textContent = this.getAttribute("title") ?? "";
    const description = root.querySelector(".blora-alert__desc");
    if (description) description.textContent = this.getAttribute("description") ?? "";
    const close = root.querySelector<HTMLButtonElement>(".blora-alert__close");
    if (this.hasAttribute("dismissible") && !close) {
      this.render();
      this.rebind();
    } else if (!this.hasAttribute("dismissible") && close) {
      close.remove();
    }
  }

  protected bindEvents(): void {
    const close = this.querySelector(".blora-alert__close");
    if (close) this.listen(close, "click", () => this.close());
  }
}

export function defineBloraAlert(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_ALERT_TAG)) return;
  registry.define(BLORA_ALERT_TAG, BloraAlert);
}
