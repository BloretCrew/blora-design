/**
 * Blora Design 2.0 - Tree controller
 * Toggles expand/collapse on nodes, selects leaf nodes.
 */
export interface TreeController {
  destroy(): void;
}

export function createTreeController(root: HTMLElement): TreeController {
  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const toggle = target.closest<HTMLElement>(".blora-tree__toggle");
    const node = target.closest<HTMLElement>(".blora-tree__node");

    if (toggle && node) {
      // Toggle expand/collapse
      if (node.hasAttribute("data-open")) node.removeAttribute("data-open");
      else node.setAttribute("data-open", "");
      e.stopPropagation();
      return;
    }

    if (node) {
      // Check if this is a leaf node (no toggle)
      const hasToggle = node.querySelector(".blora-tree__toggle");
      if (!hasToggle) {
        // Select this leaf, deselect others
        root.querySelectorAll(".blora-tree__node[data-selected]").forEach((n) =>
          n.removeAttribute("data-selected"),
        );
        node.setAttribute("data-selected", "");
      }
    }
  };

  root.addEventListener("click", onClick);

  return {
    destroy() {
      root.removeEventListener("click", onClick);
    },
  };
}
