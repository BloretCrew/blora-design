import { BloraElement } from "../../core/blora-element.js";

export const BLORA_TIMELINE_TAG = "blora-timeline";

interface TimelineDefinition {
  description: string;
  time: string;
  title: string;
  variant: string;
}

export class BloraTimeline extends BloraElement {
  private definitions: TimelineDefinition[] | null = null;

  protected render(): void {
    if (!this.definitions)
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-timeline-item")
        .map((item) => ({
          description: item.getAttribute("description") ?? "",
          time: item.getAttribute("time") ?? "",
          title: item.getAttribute("title") ?? item.textContent?.trim() ?? "",
          variant: item.getAttribute("variant") ?? "",
        }));
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-timeline";
    root.dataset.bloraGenerated = "";
    root.setAttribute("role", "list");
    this.definitions.forEach((definition) => {
      const item = this.ownerDocument.createElement("div");
      item.className = "blora-timeline__item";
      item.setAttribute("role", "listitem");
      const dot = this.ownerDocument.createElement("div");
      dot.className = "blora-timeline__dot";
      if (definition.variant) dot.dataset.variant = definition.variant;
      const time = this.ownerDocument.createElement("div");
      time.className = "blora-timeline__time";
      time.textContent = definition.time;
      const title = this.ownerDocument.createElement("div");
      title.className = "blora-timeline__title";
      title.textContent = definition.title;
      item.append(dot, time, title);
      if (definition.description) {
        const description = this.ownerDocument.createElement("div");
        description.className = "blora-timeline__desc";
        description.textContent = definition.description;
        item.appendChild(description);
      }
      root.appendChild(item);
    });
    this.replaceChildren(root);
  }

  protected bindEvents(): void {}
}

export function defineBloraTimeline(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_TIMELINE_TAG)) return;
  registry.define(BLORA_TIMELINE_TAG, BloraTimeline);
}
