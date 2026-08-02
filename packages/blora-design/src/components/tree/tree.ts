/**
 * Blora Design 2.0 - Tree controller
 * Whole-row click expands/collapses (v1 parity); selects the clicked node.
 */
export interface TreeController {
  destroy(): void;
}

export function createTreeController(root: HTMLElement): TreeController {
  const setH = (box: HTMLElement, h: number) => {
    if (h > 0) box.style.setProperty("--blora-tree-h", `${h}px`);
    else box.style.removeProperty("--blora-tree-h");
  };

  /**
   * Measure open children from innermost out.
   * Temporarily clear max-height so scrollHeight is real content height
   * (max-height:0 makes scrollHeight 0 and would bake --blora-tree-h:0).
   */
  const measureOpen = () => {
    const open = Array.from(
      root.querySelectorAll<HTMLElement>(".blora-tree__node[data-open] + .blora-tree__children"),
    );
    // Temporarily expand for measurement
    open.forEach((box) => {
      box.style.maxHeight = "none";
      box.style.opacity = "1";
      box.style.overflow = "visible";
    });
    for (let i = open.length - 1; i >= 0; i--) {
      const box = open[i]!;
      setH(box, box.scrollHeight);
    }
    open.forEach((box) => {
      box.style.maxHeight = "";
      box.style.opacity = "";
      box.style.overflow = "";
    });
  };

  root.setAttribute("role", "tree");

  const onClick = (e: MouseEvent) => {
    const node = (e.target as HTMLElement).closest<HTMLElement>(".blora-tree__node");
    if (!node || !root.contains(node)) return;

    const next = node.nextElementSibling;
    const children =
      next instanceof HTMLElement && next.classList.contains("blora-tree__children") ? next : null;

    if (children) {
      const willOpen = !node.hasAttribute("data-open");
      if (willOpen) {
        // Measure with full content visible
        children.style.maxHeight = "none";
        const h = children.scrollHeight;
        children.style.maxHeight = "";
        setH(children, h);
        for (
          let p: HTMLElement | null = children.parentElement;
          p && !p.classList.contains("blora-tree");
          p = p.parentElement
        ) {
          if (p.classList.contains("blora-tree__children")) {
            p.style.maxHeight = "none";
            const ph = p.scrollHeight + h;
            p.style.maxHeight = "";
            setH(p, ph);
          }
        }
        node.setAttribute("data-open", "");
      } else {
        const delta = children.offsetHeight;
        node.removeAttribute("data-open");
        for (
          let p: HTMLElement | null = children.parentElement;
          p && !p.classList.contains("blora-tree");
          p = p.parentElement
        ) {
          if (p.classList.contains("blora-tree__children")) {
            const current = Number.parseFloat(p.style.getPropertyValue("--blora-tree-h")) || 0;
            setH(p, Math.max(0, current - delta || p.scrollHeight - delta));
          }
        }
      }
      // Re-measure all open branches after toggle settles
      requestAnimationFrame(() => measureOpen());
      node.setAttribute("aria-expanded", String(node.hasAttribute("data-open")));
    }

    // Selection: one selected node (v1 toggles selected on the clicked row)
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
      node.setAttribute("aria-expanded", String(node.hasAttribute("data-open")));
    }
  });

  // Measure after layout (Lit/story ref may fire before paint)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => measureOpen());
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
