import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";

export const BLORA_SIDEBAR_NAV_TAG = "blora-sidebar-nav";

interface SidebarNavLinkDefinition {
  current: boolean;
  href: string;
  label: string;
  value: string;
}

interface SidebarNavGroupDefinition {
  label: string;
  links: SidebarNavLinkDefinition[];
}

export interface BloraSidebarNavChangeDetail {
  href: string;
  value: string;
}

/** Grouped sidebar navigation with one controlled current page. */
export class BloraSidebarNav extends BloraElement {
  private definitions: SidebarNavGroupDefinition[] | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["label", "value"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    if (name === "label") {
      this.querySelector(".blora-sidebar-nav")?.setAttribute(
        "aria-label",
        this.getAttribute("label") ?? t("sidebar.label"),
      );
      return;
    }
    this.syncCurrent();
  }

  get value(): string {
    return (
      this.getAttribute("value") ??
      this.querySelector<HTMLElement>('.blora-sidebar-nav__link[aria-current="page"]')?.dataset
        .value ??
      ""
    );
  }

  set value(value: string) {
    this.select(value);
  }

  select(value: string): void {
    if (value) this.setAttribute("value", value);
    else this.removeAttribute("value");
    if (this.isConnectedInternal) this.syncCurrent();
  }

  protected render(): void {
    if (!this.definitions) this.definitions = this.readDefinitions();

    const initialValue =
      this.getAttribute("value") ??
      this.definitions.flatMap((group) => group.links).find((link) => link.current)?.value ??
      "";
    if (initialValue && !this.hasAttribute("value")) {
      this.reflecting = true;
      this.setAttribute("value", initialValue);
      this.reflecting = false;
    }

    const nav = this.ownerDocument.createElement("nav");
    nav.className = "blora-sidebar-nav";
    nav.dataset.bloraGenerated = "";
    nav.setAttribute("aria-label", this.getAttribute("label") ?? t("sidebar.label"));

    for (const definition of this.definitions) {
      const group = this.ownerDocument.createElement("div");
      group.className = "blora-sidebar-nav__group";
      group.setAttribute("role", "group");
      if (definition.label) {
        group.setAttribute("aria-label", definition.label);
        const heading = this.ownerDocument.createElement("div");
        heading.className = "blora-sidebar-nav__group-label";
        heading.textContent = definition.label;
        heading.setAttribute("aria-hidden", "true");
        group.appendChild(heading);
      }
      for (const linkDefinition of definition.links) {
        const link = this.ownerDocument.createElement("a");
        link.className = "blora-sidebar-nav__link";
        link.href = linkDefinition.href;
        link.textContent = linkDefinition.label;
        link.dataset.value = linkDefinition.value;
        if (linkDefinition.value === initialValue) link.setAttribute("aria-current", "page");
        group.appendChild(link);
      }
      nav.appendChild(group);
    }

    this.replaceChildren(nav);
  }

  protected bindEvents(): void {
    const nav = this.querySelector<HTMLElement>(".blora-sidebar-nav");
    if (!nav) return;
    this.listen(nav, "click", (event) => {
      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>(".blora-sidebar-nav__link");
      if (!link || !nav.contains(link)) return;
      const value = link.dataset.value ?? "";
      this.select(value);
      this.emit<BloraSidebarNavChangeDetail>("blora-change", {
        href: link.getAttribute("href") ?? "",
        value,
      });
    });
  }

  private readDefinitions(): SidebarNavGroupDefinition[] {
    const groups: SidebarNavGroupDefinition[] = [];
    const directLinks: SidebarNavLinkDefinition[] = [];
    for (const child of Array.from(this.children)) {
      if (child.localName === "blora-sidebar-nav-group") {
        groups.push({
          label: child.getAttribute("label") ?? "",
          links: Array.from(child.children)
            .filter((item) => item.localName === "blora-sidebar-nav-link")
            .map((item, index) => this.readLink(item, index)),
        });
      } else if (child.localName === "blora-sidebar-nav-link") {
        directLinks.push(this.readLink(child, directLinks.length));
      }
    }
    if (directLinks.length) groups.unshift({ label: "", links: directLinks });
    return groups.filter((group) => group.links.length > 0);
  }

  private readLink(item: Element, index: number): SidebarNavLinkDefinition {
    const href = item.getAttribute("href") ?? "#";
    const label = item.getAttribute("label") ?? item.textContent?.trim() ?? "";
    const value = item.getAttribute("value") ?? (href.replace(/^#/, "") || `item-${index + 1}`);
    return { current: item.hasAttribute("current"), href, label, value };
  }

  private syncCurrent(): void {
    const value = this.getAttribute("value") ?? "";
    for (const link of this.querySelectorAll<HTMLElement>(".blora-sidebar-nav__link")) {
      if (value && link.dataset.value === value) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  }
}

export function defineBloraSidebarNav(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_SIDEBAR_NAV_TAG)) return;
  registry.define(BLORA_SIDEBAR_NAV_TAG, BloraSidebarNav);
}
