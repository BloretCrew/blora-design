/**
 * Blora Design 2.0 - Cascader controller
 * Multi-level selection dropdown with nested options.
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_CASCADER_TAG = "blora-cascader";

export interface CascaderController {
  destroy(): void;
}

export interface CascaderNode {
  label: string;
  children?: CascaderNode[];
}

export function createCascaderController(root: HTMLElement): CascaderController {
  const doc = root.ownerDocument;
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
    trigger = doc.createElement("button");
    trigger.className = "blora-cascader__trigger blora-input";
    trigger.type = "button";
    trigger.textContent = "请选择";
    root.prepend(trigger);
  }

  if (!panel) {
    panel = doc.createElement("div");
    panel.className = "blora-cascader__panel";
    root.appendChild(panel);
  }

  const selectedPath: string[] = [];

  const renderPanel = (levels: CascaderNode[][]) => {
    panel!.replaceChildren(
      ...levels.map((col, colIdx) => {
        const column = doc.createElement("div");
        column.className = "blora-cascader__column";
        col.forEach((node) => {
          const isSelected = selectedPath[colIdx] === node.label;
          const hasChildren = node.children && node.children.length > 0;
          const div = doc.createElement("div");
          div.className = "blora-cascader__option";
          if (isSelected) div.classList.add("blora-cascader__option--active");
          div.dataset.col = String(colIdx);
          div.dataset.label = node.label;
          div.textContent = node.label;
          if (hasChildren) {
            const arrow = doc.createElement("span");
            arrow.className = "blora-cascader__arrow";
            arrow.appendChild(createBloraIcon("chevron-right", 14, doc));
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
          root.dispatchEvent(
            new CustomEvent("blora-cascader-change", {
              bubbles: true,
              detail: { value: selectedPath.join(" / "), path: [...selectedPath] },
            }),
          );
        }
        return;
      }
      currentLevel = found.children ?? [];
    }
  };

  const onDocClick = () => close();

  trigger.addEventListener("click", onTrigger);
  panel.addEventListener("click", onPanelClick);
  doc.addEventListener("click", onDocClick);

  return {
    destroy() {
      trigger!.removeEventListener("click", onTrigger);
      panel!.removeEventListener("click", onPanelClick);
      doc.removeEventListener("click", onDocClick);
    },
  };
}

function cascaderDefinitions(elements: Element[]): CascaderNode[] {
  return elements
    .filter((item) => item.localName === "blora-cascader-option")
    .map((item) => ({
      label: item.getAttribute("label") ?? item.textContent?.trim() ?? "",
      children: cascaderDefinitions(Array.from(item.children)),
    }))
    .filter((item) => item.label)
    .map((item) => (item.children?.length ? item : { label: item.label }));
}

/** Cascader CE that owns its trigger, columns and selection result. */
export class BloraCascader extends BloraElement {
  private controller: CascaderController | null = null;
  private options: CascaderNode[] | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["options", "placeholder", "value", "disabled", "show-result"];
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

  open(): void {
    if (!this.hasAttribute("disabled"))
      this.querySelector<HTMLButtonElement>(".blora-cascader__trigger")?.click();
  }

  close(): void {
    this.querySelector<HTMLElement>(".blora-cascader__panel")?.removeAttribute("data-open");
  }

  protected render(): void {
    if (!this.options) this.options = cascaderDefinitions(Array.from(this.children));
    const attributeOptions = this.getAttribute("options") ?? this.getAttribute("data-options");
    let options = this.options;
    if (attributeOptions) {
      try {
        const parsed = JSON.parse(attributeOptions) as unknown;
        options = Array.isArray(parsed) ? (parsed as CascaderNode[]) : [];
      } catch {
        options = [];
      }
    }
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-cascader";
    root.dataset.bloraGenerated = "";
    root.dataset.options = JSON.stringify(options);
    const trigger = this.ownerDocument.createElement("button");
    trigger.className = "blora-cascader__trigger blora-input";
    trigger.type = "button";
    trigger.disabled = this.hasAttribute("disabled");
    trigger.textContent =
      this.getAttribute("value") || this.getAttribute("placeholder") || "请选择";
    const panel = this.ownerDocument.createElement("div");
    panel.className = "blora-cascader__panel";
    panel.setAttribute("role", "listbox");
    root.append(trigger, panel);
    if (this.hasAttribute("show-result")) {
      const result = this.ownerDocument.createElement("output");
      result.className = "blora-cascader__result";
      if (this.value) result.textContent = `已选：${this.value}`;
      root.appendChild(result);
    }
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const field = this.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    if (field) {
      field.disabled = this.hasAttribute("disabled");
      if (this.hasAttribute("placeholder"))
        field.placeholder = this.getAttribute("placeholder") ?? "";
      if (this.hasAttribute("value") && this.ownerDocument.activeElement !== field) {
        field.value = this.getAttribute("value") ?? field.value;
      }
    }
    this.rebind();
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-cascader");
    if (!root || this.hasAttribute("disabled")) return;
    this.controller = createCascaderController(root);
    this.listen(root, "blora-cascader-change", (event) => {
      const value = (event as CustomEvent<{ value: string }>).detail.value;
      this.reflecting = true;
      this.setAttribute("value", value);
      this.reflecting = false;
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraCascader(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_CASCADER_TAG)) return;
  registry.define(BLORA_CASCADER_TAG, BloraCascader);
}
