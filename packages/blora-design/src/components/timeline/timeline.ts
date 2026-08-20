import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_TIMELINE_TAG = "blora-timeline";

interface TimelineDefinition {
  description: string;
  time: string;
  title: string;
  variant: string;
  icon: string;
  /** Custom child nodes (arbitrary content such as a comment card). */
  nodes: Node[];
}

export class BloraTimeline extends BloraElement {
  private definitions: TimelineDefinition[] | null = null;

  protected render(): void {
    if (!this.definitions)
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-timeline-item")
        .map((item) => {
          const nodes = Array.from(item.childNodes).filter(
            (node) =>
              !(
                node.nodeType === Node.ELEMENT_NODE &&
                (node as HTMLElement).hasAttribute("data-blora-generated")
              ),
          );
          return {
            description: item.getAttribute("description") ?? "",
            time: item.getAttribute("time") ?? "",
            // Only fall back to textContent for plain text items; items carrying
            // custom child content render that in .blora-timeline__content instead.
            title:
              item.getAttribute("title") ?? (nodes.length ? "" : (item.textContent?.trim() ?? "")),
            variant: item.getAttribute("variant") ?? "",
            icon: item.getAttribute("icon") ?? "",
            nodes,
          };
        });
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
      if (definition.icon) {
        dot.classList.add("blora-timeline__dot--icon");
        dot.append(createBloraIcon(definition.icon, 14, this.ownerDocument));
      } else if (definition.variant) {
        dot.dataset.variant = definition.variant;
      }
      item.appendChild(dot);

      const time = this.ownerDocument.createElement("div");
      time.className = "blora-timeline__time";
      time.textContent = definition.time;
      item.appendChild(time);

      if (definition.title) {
        const title = this.ownerDocument.createElement("div");
        title.className = "blora-timeline__title";
        title.textContent = definition.title;
        item.appendChild(title);
      }

      if (definition.description) {
        const description = this.ownerDocument.createElement("div");
        description.className = "blora-timeline__desc";
        description.textContent = definition.description;
        item.appendChild(description);
      }

      if (definition.nodes.length) {
        for (const node of definition.nodes) node.parentNode?.removeChild(node);
        const content = this.ownerDocument.createElement("div");
        content.className = "blora-timeline__content";
        content.append(...definition.nodes);
        item.appendChild(content);
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
