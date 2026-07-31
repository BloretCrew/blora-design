/**
 * Blora Design 2.0 - Cascader controller
 * Multi-level selection dropdown with nested options.
 */
export interface CascaderController {
  destroy(): void;
}

interface CascaderNode {
  label: string;
  children?: CascaderNode[];
}

export function createCascaderController(root: HTMLElement): CascaderController {
  const raw = root.dataset.options ?? root.dataset.bloraCascader ?? "[]";
  let tree: CascaderNode[] = [];
  try {
    tree = JSON.parse(raw);
  } catch {
    tree = [];
  }

  let trigger = root.querySelector<HTMLButtonElement>(".blora-cascader__trigger");
  let panel = root.querySelector<HTMLElement>(".blora-cascader__panel");
  const result = root.querySelector<HTMLElement>(".blora-cascader__result");

  if (!trigger) {
    trigger = document.createElement("button");
    trigger.className = "blora-cascader__trigger blora-input";
    trigger.type = "button";
    trigger.textContent = "请选择";
    root.prepend(trigger);
  }

  if (!panel) {
    panel = document.createElement("div");
    panel.className = "blora-cascader__panel";
    root.appendChild(panel);
  }

  const selectedPath: string[] = [];

  const renderPanel = (levels: CascaderNode[][]) => {
    panel!.replaceChildren(
      ...levels.map((col, colIdx) => {
        const column = document.createElement("div");
        column.className = "blora-cascader__column";
        col.forEach((node) => {
          const isSelected = selectedPath[colIdx] === node.label;
          const hasChildren = node.children && node.children.length > 0;
          const div = document.createElement("div");
          div.className = "blora-cascader__option";
          if (isSelected) div.classList.add("blora-cascader__option--active");
          div.dataset.col = String(colIdx);
          div.dataset.label = node.label;
          div.textContent = node.label;
          if (hasChildren) {
            const arrow = document.createElement("span");
            arrow.className = "blora-cascader__arrow";
            arrow.textContent = "›";
            div.appendChild(arrow);
          }
          column.appendChild(div);
        });
        return column;
      }),
    );
  };

  const updatePath = () => {
    trigger!.textContent = selectedPath.length ? selectedPath.join(" / ") : "请选择";
    if (result) result.textContent = `已选：${selectedPath.join(" / ")}`;
  };

  const open = () => {
    panel!.setAttribute("data-open", "");
    selectedPath.length = 0;
    renderPanel([tree]);
    updatePath();
  };

  const close = () => {
    panel!.removeAttribute("data-open");
  };

  const isOpen = () => panel!.hasAttribute("data-open");

  const onTrigger = (e: MouseEvent) => {
    e.stopPropagation();
    if (isOpen()) close();
    else open();
  };

  const onPanelClick = (e: MouseEvent) => {
    e.stopPropagation();
    const opt = (e.target as HTMLElement).closest<HTMLElement>(".blora-cascader__option");
    if (!opt) return;

    const col = Number(opt.dataset.col);
    const label = opt.dataset.label!;
    selectedPath[col] = label;
    selectedPath.length = col + 1;

    // Navigate to next level
    let currentLevel = tree;
    for (let i = 0; i <= col; i++) {
      const found = currentLevel.find((n) => n.label === selectedPath[i]);
      if (!found) return;
      if (i === col) {
        if (found.children && found.children.length > 0) {
          const levels: CascaderNode[][] = [];
          let level = tree;
          for (let j = 0; j <= col; j++) {
            const f = level.find((n) => n.label === selectedPath[j]);
            if (!f) break;
            levels.push(level);
            level = f.children ?? [];
          }
          levels.push(found.children);
          renderPanel(levels);
        } else {
          // Leaf node - commit selection
          updatePath();
          close();
        }
        return;
      }
      currentLevel = found.children ?? [];
    }
  };

  const onDocClick = () => close();

  trigger.addEventListener("click", onTrigger);
  panel.addEventListener("click", onPanelClick);
  document.addEventListener("click", onDocClick);

  return {
    destroy() {
      trigger!.removeEventListener("click", onTrigger);
      panel!.removeEventListener("click", onPanelClick);
      document.removeEventListener("click", onDocClick);
    },
  };
}
