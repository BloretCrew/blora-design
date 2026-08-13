import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_EMPTY_TAG = "blora-empty";

export class BloraEmpty extends BloraElement {
  static get observedAttributes(): string[] {
    return ["title", "description", "action-label"];
  }

  attributeChangedCallback(): void {
    if (this.isConnectedInternal) this.sync();
  }

  protected render(): void {
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-empty";
    root.dataset.bloraGenerated = "";
    root.setAttribute("role", "status");
    const icon = this.ownerDocument.createElement("div");
    icon.className = "blora-empty__icon";
    const svg = createBloraIcon("inbox", 60, this.ownerDocument);
    svg.setAttribute("stroke-width", "1.25");
    icon.appendChild(svg);
    const title = this.ownerDocument.createElement("div");
    title.className = "blora-empty__title";
    title.textContent = this.getAttribute("title") ?? "暂无数据";
    const description = this.ownerDocument.createElement("div");
    description.className = "blora-empty__desc";
    description.textContent = this.getAttribute("description") ?? "";
    root.append(icon, title, description);
    const actionLabel = this.getAttribute("action-label");
    if (actionLabel) {
      const action = this.ownerDocument.createElement("button");
      action.className = "blora-button";
      action.dataset.variant = "primary";
      action.dataset.size = "sm";
      action.type = "button";
      action.textContent = actionLabel;
      action.dataset.emptyAction = "";
      root.appendChild(action);
    }
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const title = this.querySelector(".blora-empty__title");
    if (title) title.textContent = this.getAttribute("title") ?? "暂无数据";
    const description = this.querySelector(".blora-empty__desc");
    if (description) description.textContent = this.getAttribute("description") ?? "";
    const actionLabel = this.getAttribute("action-label");
    const action = this.querySelector<HTMLButtonElement>("[data-empty-action]");
    if (actionLabel && action) action.textContent = actionLabel;
    else if (actionLabel && !action) {
      this.render();
      this.rebind();
    } else if (!actionLabel && action) {
      action.remove();
    }
  }

  protected bindEvents(): void {
    const action = this.querySelector("[data-empty-action]");
    if (action) this.listen(action, "click", () => this.emit("blora-empty-action", undefined));
  }
}

export function defineBloraEmpty(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_EMPTY_TAG)) return;
  registry.define(BLORA_EMPTY_TAG, BloraEmpty);
}
