/**
 * Tree controller — expand/collapse with measured content height (symmetric open/close).
 * No hard-coded max-height caps.
 */
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
