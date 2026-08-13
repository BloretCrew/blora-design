/**
 * Tree controller — expand/collapse with measured content height (symmetric open/close).
 * No hard-coded max-height caps.
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_TREE_TAG = "blora-tree";

export interface TreeController {
  destroy(): void;
}

export function createTreeController(root: HTMLElement): TreeController {
  if (typeof document === "undefined") return { destroy: () => {} };
  root.setAttribute("role", "tree");

  const measure = (box: HTMLElement): number => {
    const prevMax = box.style.maxHeight;
    const prevOverflow = box.style.overflow;
    box.style.maxHeight = "none";
    box.style.overflow = "visible";
    const h = Math.ceil(Math.max(box.scrollHeight, box.getBoundingClientRect().height, 1));
    box.style.maxHeight = prevMax;
    box.style.overflow = prevOverflow;
    return h;
  };

  const openBranch = (node: HTMLElement, children: HTMLElement) => {
    /* Expand: 0 → content px (same duration as collapse) */
    const h = measure(children);
    children.style.maxHeight = "0px";
    node.setAttribute("data-open", "");
    node.setAttribute("aria-expanded", "true");
    void children.offsetHeight;
    children.style.maxHeight = `${h}px`;
    children.style.setProperty("--blora-tree-h", `${h}px`);

    const onEnd = (ev: TransitionEvent) => {
      if (ev.propertyName !== "max-height") return;
      children.removeEventListener("transitionend", onEnd);
      if (node.hasAttribute("data-open")) {
        children.style.maxHeight = "none";
      }
    };
    children.addEventListener("transitionend", onEnd);
  };

  const closeBranch = (node: HTMLElement, children: HTMLElement) => {
    /* Collapse: lock current height → 0 */
    const h =
      children.style.maxHeight && children.style.maxHeight !== "none"
        ? children.scrollHeight
        : measure(children);
    children.style.maxHeight = `${Math.max(h, 1)}px`;
    children.style.setProperty("--blora-tree-h", `${Math.max(h, 1)}px`);
    void children.offsetHeight;
    node.removeAttribute("data-open");
    node.setAttribute("aria-expanded", "false");
    children.style.maxHeight = "0px";
  };

  /** After a toggle, remeasure open ancestors so parent clips stay content-sized */
  const remeasureOpenAncestors = (from: HTMLElement) => {
    let p: HTMLElement | null = from.parentElement;
    while (p && p !== root) {
      if (p.classList.contains("blora-tree__children")) {
        const prev = p.previousElementSibling;
        if (prev instanceof HTMLElement && prev.hasAttribute("data-open")) {
          const h = measure(p);
          p.style.setProperty("--blora-tree-h", `${h}px`);
          if (p.style.maxHeight !== "none" && p.style.maxHeight !== "") {
            p.style.maxHeight = `${h}px`;
          }
        }
      }
      p = p.parentElement;
    }
  };

  const onClick = (e: MouseEvent) => {
    const node = (e.target as HTMLElement).closest<HTMLElement>(".blora-tree__node");
    if (!node || !root.contains(node)) return;

    const next = node.nextElementSibling;
    const children =
      next instanceof HTMLElement && next.classList.contains("blora-tree__children") ? next : null;

    if (children) {
      const willOpen = !node.hasAttribute("data-open");
      if (willOpen) openBranch(node, children);
      else closeBranch(node, children);
      requestAnimationFrame(() => remeasureOpenAncestors(children));
    }

    root.querySelectorAll(".blora-tree__node[data-selected]").forEach((n) => {
      if (n !== node) {
        n.removeAttribute("data-selected");
        n.setAttribute("aria-selected", "false");
      }
    });
    if (node.hasAttribute("data-selected")) {
      node.removeAttribute("data-selected");
      node.setAttribute("aria-selected", "false");
    } else {
      node.setAttribute("data-selected", "");
      node.setAttribute("aria-selected", "true");
    }
    root.dispatchEvent(
      new CustomEvent("blora-tree-change", {
        bubbles: true,
        detail: {
          value: node.dataset.value ?? node.textContent?.trim() ?? "",
          label: node.dataset.label ?? node.textContent?.trim() ?? "",
          selected: node.hasAttribute("data-selected"),
        },
      }),
    );
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const node = (e.target as HTMLElement).closest<HTMLElement>(".blora-tree__node");
    if (!node || !root.contains(node)) return;
    e.preventDefault();
    node.click();
  };

  root.querySelectorAll<HTMLElement>(".blora-tree__node").forEach((node) => {
    node.setAttribute("role", "treeitem");
    if (!node.hasAttribute("tabindex")) node.tabIndex = 0;
    const next = node.nextElementSibling;
    if (next?.classList.contains("blora-tree__children")) {
      const open = node.hasAttribute("data-open");
      node.setAttribute("aria-expanded", String(open));
      if (open) {
        const box = next as HTMLElement;
        box.style.maxHeight = "none";
        box.style.setProperty("--blora-tree-h", `${measure(box)}px`);
      }
    }
  });

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKey);

  return {
    destroy() {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey);
    },
  };
}

interface TreeDefinition {
  children: TreeDefinition[];
  label: string;
  open: boolean;
  selected: boolean;
  value: string;
}

function directText(element: Element): string {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent ?? "")
    .join("")
    .trim();
}

function treeDefinitions(elements: Element[]): TreeDefinition[] {
  return elements
    .filter((item) => item.localName === "blora-tree-node")
    .map((item) => {
      const label = item.getAttribute("label") ?? directText(item);
      return {
        children: treeDefinitions(Array.from(item.children)),
        label,
        open: item.hasAttribute("open"),
        selected: item.hasAttribute("selected"),
        value: item.getAttribute("value") ?? label,
      };
    })
    .filter((item) => item.label);
}

function appendChevron(doc: Document, target: HTMLElement): void {
  target.appendChild(createBloraIcon("chevron-right", 12, doc));
}

/** Tree CE that consumes nested `<blora-tree-node>` definitions. */
export class BloraTree extends BloraElement {
  private controller: TreeController | null = null;
  private definitions: TreeDefinition[] | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["value"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get value(): string {
    return this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  protected render(): void {
    if (!this.definitions) this.definitions = treeDefinitions(Array.from(this.children));
    const selectedValue = this.getAttribute("value");
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-tree";
    root.dataset.bloraGenerated = "";

    const appendNodes = (target: HTMLElement, definitions: TreeDefinition[]) => {
      definitions.forEach((definition) => {
        const node = this.ownerDocument.createElement("div");
        node.className = "blora-tree__node";
        node.dataset.value = definition.value;
        node.dataset.label = definition.label;
        if (definition.open) node.dataset.open = "";
        if (definition.selected || selectedValue === definition.value) node.dataset.selected = "";
        const toggle = this.ownerDocument.createElement("span");
        toggle.className = "blora-tree__toggle";
        if (definition.children.length) appendChevron(this.ownerDocument, toggle);
        else toggle.setAttribute("aria-hidden", "true");
        const label = this.ownerDocument.createElement("span");
        label.textContent = definition.label;
        node.append(toggle, label);
        target.appendChild(node);
        if (definition.children.length) {
          const children = this.ownerDocument.createElement("div");
          children.className = "blora-tree__children";
          appendNodes(children, definition.children);
          target.appendChild(children);
        }
      });
    };
    appendNodes(root, this.definitions);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const field = this.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    if (field) {
      field.disabled = this.hasAttribute("disabled");
      if (this.hasAttribute("placeholder")) field.placeholder = this.getAttribute("placeholder") ?? "";
      if (this.hasAttribute("value") && this.ownerDocument.activeElement !== field) {
        field.value = this.getAttribute("value") ?? field.value;
      }
    }
    this.rebind();
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-tree");
    if (!root) return;
    this.controller = createTreeController(root);
    this.listen(root, "blora-tree-change", (event) => {
      const detail = (event as CustomEvent<{ value: string; selected: boolean }>).detail;
      this.reflecting = true;
      if (detail.selected) this.setAttribute("value", detail.value);
      else this.removeAttribute("value");
      this.reflecting = false;
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraTree(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_TREE_TAG)) return;
  registry.define(BLORA_TREE_TAG, BloraTree);
}
