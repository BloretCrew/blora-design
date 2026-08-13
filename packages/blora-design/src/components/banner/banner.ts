import { BloraElement } from "../../core/blora-element.js";

export const BLORA_BANNER_TAG = "blora-banner";

interface BannerActionDefinition {
  label: string;
  value: string;
  variant: string;
}

export class BloraBanner extends BloraElement {
  private definitions: BannerActionDefinition[] | null = null;

  static get observedAttributes(): string[] {
    return ["title", "description"];
  }

  attributeChangedCallback(): void {
    if (this.isConnectedInternal) this.sync();
  }

  protected render(): void {
    if (!this.definitions)
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-banner-action")
        .map((item) => ({
          label: item.getAttribute("label") ?? item.textContent?.trim() ?? "",
          value: item.getAttribute("value") ?? "",
          variant: item.getAttribute("variant") ?? "outline",
        }));
    const root = this.ownerDocument.createElement("section");
    root.className = "blora-banner";
    root.dataset.bloraGenerated = "";
    const body = this.ownerDocument.createElement("div");
    body.className = "blora-banner__body";
    const title = this.ownerDocument.createElement("div");
    title.className = "blora-banner__title";
    title.textContent = this.getAttribute("title") ?? "";
    const description = this.ownerDocument.createElement("div");
    description.className = "blora-banner__desc";
    description.textContent = this.getAttribute("description") ?? "";
    body.append(title, description);
    const actions = this.ownerDocument.createElement("div");
    actions.className = "blora-banner__actions";
    this.definitions.forEach((definition) => {
      const button = this.ownerDocument.createElement("button");
      button.className = "blora-button";
      button.dataset.variant = definition.variant;
      button.dataset.size = "sm";
      button.dataset.value = definition.value;
      button.type = "button";
      button.textContent = definition.label;
      actions.appendChild(button);
    });
    root.append(body, actions);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const title = this.querySelector(".blora-banner__title");
    if (title) title.textContent = this.getAttribute("title") ?? "";
    const description = this.querySelector(".blora-banner__desc");
    if (description) description.textContent = this.getAttribute("description") ?? "";
  }

  protected bindEvents(): void {
    const actions = this.querySelector(".blora-banner__actions");
    if (!actions) return;
    this.listen(actions, "click", (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>("button");
      if (button) this.emit("blora-banner-action", { value: button.dataset.value ?? "" });
    });
  }
}

export function defineBloraBanner(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_BANNER_TAG)) return;
  registry.define(BLORA_BANNER_TAG, BloraBanner);
}
