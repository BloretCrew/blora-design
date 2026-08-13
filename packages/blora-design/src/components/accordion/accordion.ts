/** Composite accordion Custom Element; controller remains available for advanced markup. */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";
import { createCollapseController, type CollapseController } from "../collapse/collapse.js";

export const BLORA_ACCORDION_TAG = "blora-accordion";

let accordionInstanceId = 0;

interface AccordionItemDefinition {
  content: Node[];
  disabled: boolean;
  heading: string;
  open: boolean;
}

export class BloraAccordion extends BloraElement {
  private controller: CollapseController | null = null;
  private definitions: AccordionItemDefinition[] | null = null;
  private readonly instanceId = ++accordionInstanceId;

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-accordion-item")
        .map((item) => ({
          content: Array.from(item.childNodes),
          disabled: item.hasAttribute("disabled"),
          heading: item.getAttribute("heading") ?? item.getAttribute("label") ?? "",
          open: item.hasAttribute("open"),
        }));
    }

    const root = document.createElement("div");
    root.className = "blora-accordion";
    root.dataset.bloraAccordion = "";
    root.dataset.bloraGenerated = "";

    for (const [index, definition] of this.definitions.entries()) {
      const item = document.createElement("div");
      item.className = "blora-accordion__item";
      if (definition.open) item.dataset.open = "";
      const head = document.createElement("button");
      head.className = "blora-accordion__head";
      head.type = "button";
      head.disabled = definition.disabled;
      head.id = `blora-accordion-head-${this.instanceId}-${index}`;
      head.setAttribute("aria-expanded", String(definition.open));
      const heading = document.createElement("span");
      heading.textContent = definition.heading;
      const icon = document.createElement("span");
      icon.className = "blora-accordion__icon";
      icon.appendChild(createBloraIcon("chevron-right", 14));
      head.append(heading, icon);
      const body = document.createElement("div");
      body.className = "blora-accordion__body";
      body.id = `blora-accordion-panel-${this.instanceId}-${index}`;
      body.setAttribute("role", "region");
      body.setAttribute("aria-labelledby", head.id);
      body.setAttribute("aria-hidden", String(!definition.open));
      head.setAttribute("aria-controls", body.id);
      const content = document.createElement("div");
      content.className = "blora-accordion__content";
      content.append(...definition.content);
      body.appendChild(content);
      item.append(head, body);
      root.appendChild(item);
    }

    this.replaceChildren(root);
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-accordion");
    if (root) this.controller = createCollapseController(root);
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraAccordion(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_ACCORDION_TAG)) return;
  registry.define(BLORA_ACCORDION_TAG, BloraAccordion);
}
