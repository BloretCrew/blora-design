import { BloraElement } from "../../core/blora-element.js";

export const BLORA_BREADCRUMB_TAG = "blora-breadcrumb";

interface BreadcrumbDefinition {
  current: boolean;
  href: string;
  label: string;
}

export class BloraBreadcrumb extends BloraElement {
  private definitions: BreadcrumbDefinition[] | null = null;

  protected render(): void {
    if (!this.definitions)
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-breadcrumb-item")
        .map((item) => ({
          current: item.hasAttribute("current"),
          href: item.getAttribute("href") ?? "#",
          label: item.getAttribute("label") ?? item.textContent?.trim() ?? "",
        }));
    const root = this.ownerDocument.createElement("nav");
    root.className = "blora-breadcrumb";
    root.dataset.bloraGenerated = "";
    root.setAttribute("aria-label", "面包屑");
    this.definitions.forEach((definition, index) => {
      if (index) {
        const separator = this.ownerDocument.createElement("span");
        separator.className = "blora-breadcrumb__sep";
        separator.setAttribute("aria-hidden", "true");
        separator.textContent = "/";
        root.appendChild(separator);
      }
      if (definition.current || index === this.definitions!.length - 1) {
        const current = this.ownerDocument.createElement("span");
        current.className = "blora-breadcrumb__current";
        current.setAttribute("aria-current", "page");
        current.textContent = definition.label;
        root.appendChild(current);
      } else {
        const link = this.ownerDocument.createElement("a");
        link.href = definition.href;
        link.textContent = definition.label;
        root.appendChild(link);
      }
    });
    this.replaceChildren(root);
  }

  protected bindEvents(): void {}
}

export function defineBloraBreadcrumb(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_BREADCRUMB_TAG)) return;
  registry.define(BLORA_BREADCRUMB_TAG, BloraBreadcrumb);
}
