/**
 * Tree Select: combobox with hierarchical options (v1 initTreeSelect primary path).
 */
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
    return { open: () => {}, close: () => {}, getValue: () => "", setValue: () => {}, destroy: () => {} };
  }
  root.classList.add("blora-treeselect");
  const doc = root.ownerDocument;
  const input =
    root.querySelector<HTMLInputElement>("input.blora-input, .blora-treeselect__input, input");
  if (!input) {
    return { open: () => {}, close: () => {}, getValue: () => "", setValue: () => {}, destroy: () => {} };
  }

  let panel = root.querySelector<HTMLElement>(".blora-treeselect__panel");
  if (!panel) {
    panel = doc.createElement("div");
    panel.className = "blora-treeselect__panel";
    panel.setAttribute("role", "listbox");
    root.appendChild(panel);
  }
  const panelEl = panel;

  const options = parseOptions(
    root.getAttribute("data-options") || root.dataset.options || "[]",
  );

  input.readOnly = true;
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-haspopup", "listbox");

  let value = root.getAttribute("data-value") || "";
  let label = input.value || "";

  const setOpen = (open: boolean) => {
    root.classList.toggle("is-open", open);
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
    row.style.paddingInlineStart = `${0.55 + depth * 0.85}em`;
    if (item.disabled) row.classList.add("is-disabled");
    const hasKids = !!(item.children && item.children.length);

    const tog = doc.createElement("span");
    tog.className = "blora-treeselect__toggle";
    tog.setAttribute("aria-hidden", "true");
    if (hasKids) {
      /* Same chevron SVG as Tree story (lucide-style) */
      const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "12");
      svg.setAttribute("height", "12");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2.5");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      const path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M9 18l6-6-6-6");
      svg.appendChild(path);
      tog.appendChild(svg);
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
        kids.classList.toggle("is-open");
        tog.classList.toggle("is-open");
        return;
      }
      if (hasKids && item.selectable !== true) {
        kids.classList.toggle("is-open");
        tog.classList.toggle("is-open");
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
    setOpen(!root.classList.contains("is-open"));
  };
  const onDoc = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) setOpen(false);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown" && !root.classList.contains("is-open")) {
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
