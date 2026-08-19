/**
 * Tree Select: combobox with hierarchical options (v1 initTreeSelect primary path).
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_TREE_SELECT_TAG = "blora-tree-select";

export interface TreeSelectController {
  open(): void;
  close(): void;
  getValue(): string;
  setValue(value: string, label?: string): void;
  destroy(): void;
}

export interface TreeSelectOption {
  label?: string;
  value?: string;
  disabled?: boolean;
  selectable?: boolean;
  children?: TreeSelectOption[];
}

function parseOptions(raw: string): TreeSelectOption[] {
  try {
    const data = JSON.parse(raw || "[]") as unknown;
    return Array.isArray(data) ? (data as TreeSelectOption[]) : [];
  } catch {
    return [];
  }
}

export function createTreeSelectController(root: HTMLElement): TreeSelectController {
  if (typeof document === "undefined") {
    return {
      open: () => {},
      close: () => {},
      getValue: () => "",
      setValue: () => {},
      destroy: () => {},
    };
  }
  root.classList.add("blora-treeselect");
  const doc = root.ownerDocument;
  const input = root.querySelector<HTMLInputElement>(
    "input.blora-input, .blora-treeselect__input, input",
  );
  if (!input) {
    return {
      open: () => {},
      close: () => {},
      getValue: () => "",
      setValue: () => {},
      destroy: () => {},
    };
  }

  let panel = root.querySelector<HTMLElement>(".blora-treeselect__panel");
  if (!panel) {
    panel = doc.createElement("div");
    panel.className = "blora-treeselect__panel";
    panel.setAttribute("role", "listbox");
    root.appendChild(panel);
  }
  const panelEl = panel;

  const options = parseOptions(root.getAttribute("data-options") || root.dataset.options || "[]");

  input.readOnly = true;
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-haspopup", "listbox");

  let value = root.getAttribute("data-value") || "";
  let label = input.value || "";

  const setOpen = (open: boolean) => {
    root.toggleAttribute("data-open", open);
    input.setAttribute("aria-expanded", String(open));
  };

  const selectLeaf = (item: TreeSelectOption) => {
    if (item.disabled) return;
    value = String(item.value ?? item.label ?? "");
    label = String(item.label ?? item.value ?? "");
    input.value = label;
    root.setAttribute("data-value", value);
    setOpen(false);
    root.dispatchEvent(
      new CustomEvent("blora-treeselect-change", {
        bubbles: true,
        detail: { value, label, item },
      }),
    );
  };

  const renderNode = (item: TreeSelectOption, depth: number): HTMLElement => {
    const row = doc.createElement("div");
    row.className = "blora-treeselect__node";
    row.dataset.depth = String(depth);
    row.toggleAttribute("data-disabled", !!item.disabled);
    const hasKids = !!(item.children && item.children.length);

    const tog = doc.createElement("span");
    tog.className = "blora-treeselect__toggle";
    tog.setAttribute("aria-hidden", "true");
    if (hasKids) {
      tog.appendChild(createBloraIcon("chevron-right", 12, doc));
    } else {
      tog.style.visibility = "hidden";
    }
    row.appendChild(tog);

    const lab = doc.createElement("span");
    lab.textContent = item.label || item.value || "";
    row.appendChild(lab);

    const kids = doc.createElement("div");
    kids.className = "blora-treeselect__children";
    if (hasKids) {
      item.children!.forEach((c) => kids.appendChild(renderNode(c, depth + 1)));
    }

    const wrap = doc.createElement("div");
    wrap.appendChild(row);
    if (hasKids) wrap.appendChild(kids);

    row.addEventListener("click", (e) => {
      e.stopPropagation();
      if (item.disabled) return;
      const onToggle = (e.target as HTMLElement).closest(".blora-treeselect__toggle");
      if (hasKids && (onToggle || item.selectable === false)) {
        const open = !kids.hasAttribute("data-open");
        kids.toggleAttribute("data-open", open);
        tog.toggleAttribute("data-open", open);
        return;
      }
      if (hasKids && item.selectable !== true) {
        const open = !kids.hasAttribute("data-open");
        kids.toggleAttribute("data-open", open);
        tog.toggleAttribute("data-open", open);
        return;
      }
      selectLeaf(item);
    });

    return wrap;
  };

  const render = () => {
    panelEl.replaceChildren(...options.map((o) => renderNode(o, 0)));
  };
  render();

  const onInputClick = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(!root.hasAttribute("data-open"));
  };
  const onDoc = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) setOpen(false);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown" && !root.hasAttribute("data-open")) {
      e.preventDefault();
      setOpen(true);
    }
  };

  input.addEventListener("click", onInputClick);
  input.addEventListener("keydown", onKey);
  doc.addEventListener("click", onDoc);

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    getValue: () => value,
    setValue(v: string, lab?: string) {
      value = v;
      label = lab ?? v;
      input.value = label;
      root.setAttribute("data-value", value);
    },
    destroy() {
      input.removeEventListener("click", onInputClick);
      input.removeEventListener("keydown", onKey);
      doc.removeEventListener("click", onDoc);
      setOpen(false);
    },
  };
}

function directOptionText(element: Element): string {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent ?? "")
    .join("")
    .trim();
}

function treeSelectDefinitions(elements: Element[]): TreeSelectOption[] {
  return elements
    .filter((item) => item.localName === "blora-tree-select-option")
    .map((item) => {
      const label = item.getAttribute("label") ?? directOptionText(item);
      const selectable = item.getAttribute("selectable");
      const option: TreeSelectOption = {
        label,
        value: item.getAttribute("value") ?? label,
        disabled: item.hasAttribute("disabled"),
      };
      if (selectable !== null) option.selectable = selectable !== "false";
      const children = treeSelectDefinitions(Array.from(item.children));
      if (children.length) option.children = children;
      return option;
    })
    .filter((item) => item.label);
}

/** Tree Select CE that owns the combobox and hierarchical option panel. */
export class BloraTreeSelect extends BloraElement {
  private controller: TreeSelectController | null = null;
  private options: TreeSelectOption[] | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["options", "label", "placeholder", "value", "disabled"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get value(): string {
    return this.controller?.getValue() ?? this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  open(): void {
    if (!this.hasAttribute("disabled")) this.controller?.open();
  }

  close(): void {
    this.controller?.close();
  }

  protected render(): void {
    if (!this.options) this.options = treeSelectDefinitions(Array.from(this.children));
    const attributeOptions = this.getAttribute("options") ?? this.getAttribute("data-options");
    let options = this.options;
    if (attributeOptions) options = parseOptions(attributeOptions);
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-treeselect";
    root.dataset.bloraGenerated = "";
    root.dataset.options = JSON.stringify(options);
    const value = this.getAttribute("value") ?? "";
    if (value) root.dataset.value = value;
    const labelText = this.getAttribute("label");
    if (labelText) {
      const label = this.ownerDocument.createElement("label");
      label.className = "blora-label";
      label.textContent = labelText;
      root.appendChild(label);
    }
    const input = this.ownerDocument.createElement("input");
    input.className = "blora-input blora-treeselect__input";
    input.type = "text";
    input.placeholder = this.getAttribute("placeholder") ?? "";
    input.value = value;
    input.disabled = this.hasAttribute("disabled");
    const panel = this.ownerDocument.createElement("div");
    panel.className = "blora-treeselect__panel";
    panel.setAttribute("role", "listbox");
    root.append(input, panel);
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
    const root = this.querySelector<HTMLElement>(".blora-treeselect");
    if (!root || this.hasAttribute("disabled")) return;
    this.controller = createTreeSelectController(root);
    this.listen(root, "blora-treeselect-change", (event) => {
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

export function defineBloraTreeSelect(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_TREE_SELECT_TAG)) return;
  registry.define(BLORA_TREE_SELECT_TAG, BloraTreeSelect);
}
