/**
 * Table controller: sort, local pagination, column settings, virtual scroll (v1 primary paths).
 */
export interface TableColConfig {
  key: string;
  label: string;
  visible: boolean;
  index: number;
}

export type TableRowData = Array<string | number | null | undefined> | Record<string, unknown>;

export interface TableController {
  setPage(page: number): void;
  getPage(): number;
  getPageCount(): number;
  /** Virtual mode: replace row data source and re-render window */
  setRows(data: TableRowData[], keys?: string[]): void;
  getColumnConfig(): TableColConfig[];
  setColumnVisible(key: string, visible: boolean): void;
  resetColumns(): void;
  /** Rows with checked row-select (visible only) */
  getSelectedRows(): HTMLTableRowElement[];
  clearSelection(): void;
  destroy(): void;
}

export interface TableControllerOptions {
  pageSize?: number;
  /** Enable column panel when host has data-blora-cols (default true if attr present) */
  columns?: boolean;
  /** Enable row selection column (default true if host has data-blora-selectable) */
  selectable?: boolean;
}

type InternalTable = HTMLTableElement & {
  _bloraRowData?: TableRowData[];
  _bloraRowKeys?: string[];
  _bloraBulk?: HTMLElement | null;
  _bloraSelectedKeys?: Set<string>;
};

function makeBloraCheckbox(
  doc: Document,
  opts: { checked?: boolean; attrs?: string; className?: string; label?: string },
): HTMLLabelElement {
  const label = doc.createElement("label");
  label.className = ["blora-checkbox", opts.className || ""].filter(Boolean).join(" ");
  const input = doc.createElement("input");
  input.type = "checkbox";
  if (opts.checked) input.checked = true;
  if (opts.attrs) {
    /* simple attr parse: key="value" pairs */
    for (const m of opts.attrs.matchAll(/([^\s=]+)(?:="([^"]*)")?/g)) {
      const k = m[1];
      const v = m[2];
      if (!k || k === "type") continue;
      if (v === undefined) input.setAttribute(k, "");
      else input.setAttribute(k, v);
    }
  }
  const box = doc.createElement("span");
  box.className = "blora-checkbox__box";
  label.append(input, box);
  if (opts.label) {
    const t = doc.createElement("span");
    t.textContent = opts.label;
    label.appendChild(t);
  }
  return label;
}

function ensureSortUi(th: HTMLElement): void {
  if (th.querySelector(".blora-table__sort")) return;
  th.style.cursor = "pointer";
  th.style.userSelect = "none";
  const label = th.textContent?.trim() || "";
  th.textContent = "";
  const text = document.createElement("span");
  text.textContent = label;
  const icon = document.createElement("span");
  icon.className = "blora-table__sort";
  icon.setAttribute("aria-hidden", "true");
  th.append(text, icon);
}

function storageKey(host: HTMLElement, table: HTMLTableElement): string {
  return (
    host.getAttribute("data-blora-cols-key") ||
    `blora-table-cols:${table.id || host.id || "default"}`
  );
}

function defaultColsConfig(table: HTMLTableElement): TableColConfig[] {
  const ths = Array.from(table.querySelectorAll("thead th")).filter(
    (th) => !th.hasAttribute("data-blora-select-col"),
  );
  return ths.map((th, i) => ({
    key: th.getAttribute("data-blora-sort") || th.getAttribute("data-col-key") || String(i),
    label: (th.textContent || "").replace(/\s*[⇅▲▼]\s*$/, "").trim() || String(i + 1),
    visible: th.getAttribute("data-col-hidden") !== "true",
    index: i,
  }));
}

function readColsConfig(host: HTMLElement, table: HTMLTableElement): TableColConfig[] | null {
  try {
    const raw = localStorage.getItem(storageKey(host, table));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TableColConfig[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeColsConfig(host: HTMLElement, table: HTMLTableElement, cfg: TableColConfig[]): void {
  try {
    localStorage.setItem(storageKey(host, table), JSON.stringify(cfg));
  } catch {
    /* ignore quota */
  }
}

export function createTableController(
  root: HTMLElement,
  options?: TableControllerOptions,
): TableController {
  const noop: TableController = {
    setPage: () => {},
    getPage: () => 1,
    getPageCount: () => 1,
    setRows: () => {},
    getColumnConfig: () => [],
    setColumnVisible: () => {},
    resetColumns: () => {},
    getSelectedRows: () => [],
    clearSelection: () => {},
    destroy: () => {},
  };
  if (typeof document === "undefined") return noop;

  const table = (
    root.matches("table") ? root : root.querySelector("table")
  ) as InternalTable | null;
  if (!table) return noop;
  let tbody = table.tBodies[0] || table.createTBody();
  const doc = table.ownerDocument;
  const host =
    (root.closest(".blora-table-wrap") as HTMLElement | null) ||
    (table.closest(".blora-table-wrap") as HTMLElement | null) ||
    root;

  if (!table.id) table.id = `blora-table-${Math.random().toString(36).slice(2, 9)}`;

  const pageSize =
    options?.pageSize ||
    Number(host.getAttribute("data-page-size") || table.getAttribute("data-page-size") || 0) ||
    0;
  const colsEnabled =
    options?.columns !== false &&
    (host.hasAttribute("data-blora-cols") || table.hasAttribute("data-blora-cols"));
  const virtualEnabled =
    host.hasAttribute("data-blora-virtual") || table.hasAttribute("data-blora-virtual");
  const selectable =
    options?.selectable === true ||
    (options?.selectable !== false &&
      (host.hasAttribute("data-blora-selectable") || table.hasAttribute("data-blora-selectable")));

  /** Persist selection across virtual re-renders by row key / virtual index */
  if (!table._bloraSelectedKeys) table._bloraSelectedKeys = new Set();
  const selectedKeys = table._bloraSelectedKeys;

  let page = 1;
  let colCfg: TableColConfig[] = readColsConfig(host, table) || defaultColsConfig(table);
  let scroller: HTMLElement | null = null;

  const heads = Array.from(
    table.querySelectorAll<HTMLElement>("th[data-sort], th[data-blora-sort]"),
  );
  heads.forEach(ensureSortUi);

  const snapshotDomRows = (): HTMLTableRowElement[] =>
    Array.from(tbody.querySelectorAll<HTMLTableRowElement>("tr:not(.blora-table-virtual-pad)"));
  let originalOrder = snapshotDomRows();

  const dataThs = (): HTMLTableCellElement[] =>
    Array.from(table.querySelectorAll<HTMLTableCellElement>("thead th")).filter(
      (th) => !th.hasAttribute("data-blora-select-col"),
    );

  const applyColumnLayout = () => {
    if (!colsEnabled) return;
    const ths = dataThs();
    const headRow = table.tHead?.rows[0];
    if (!headRow) return;

    /* Assign order + visibility on header cells */
    colCfg.forEach((col, order) => {
      const th =
        ths.find(
          (h) =>
            (h.getAttribute("data-blora-sort") || h.getAttribute("data-col-key") || "") === col.key,
        ) || ths[col.index];
      if (!th) return;
      th.dataset.colOrder = String(order);
      th.hidden = !col.visible;
      th.toggleAttribute("data-col-hidden", !col.visible);
    });

    /* Reorder header data cells by colOrder */
    const orderedHeads = Array.from(headRow.children)
      .filter((c): c is HTMLElement => !c.hasAttribute("data-blora-select-col"))
      .sort((a, b) => Number(a.dataset.colOrder || 0) - Number(b.dataset.colOrder || 0));
    orderedHeads.forEach((cell) => headRow.appendChild(cell));

    /* Body rows: hide + reorder cells to match header order */
    const headOrder = Array.from(headRow.children) as HTMLElement[];
    Array.from(tbody.rows).forEach((tr) => {
      if (tr.classList.contains("blora-table-virtual-pad")) return;
      const cells = Array.from(tr.children) as HTMLElement[];
      cells.forEach((td, i) => {
        if (!td.dataset.colIndex) td.dataset.colIndex = String(i);
      });
      const byIndex = new Map(cells.map((td) => [Number(td.dataset.colIndex), td]));
      const selectCell = cells.find((c) => c.hasAttribute("data-blora-select-col"));
      const rebuilt: HTMLElement[] = [];
      if (selectCell) rebuilt.push(selectCell);
      headOrder.forEach((th) => {
        if (th.hasAttribute("data-blora-select-col")) return;
        const key = th.getAttribute("data-blora-sort") || th.getAttribute("data-col-key");
        const cfgItem = colCfg.find((c) => c.key === key);
        const sourceIdx = cfgItem ? cfgItem.index : Number(th.dataset.colIndex || 0);
        const td = byIndex.get(sourceIdx);
        if (!td) return;
        td.hidden = th.hidden;
        td.dataset.colOrder = th.dataset.colOrder || "";
        rebuilt.push(td);
      });
      tr.replaceChildren(...rebuilt);
    });
  };

  /* Seed colIndex on initial headers */
  dataThs().forEach((th, i) => {
    th.dataset.colIndex = String(i);
  });
  snapshotDomRows().forEach((tr) => {
    Array.from(tr.cells).forEach((td, i) => {
      td.dataset.colIndex = String(i);
    });
  });

  const getPageCount = () => {
    if (virtualEnabled) {
      const n = table._bloraRowData?.length || 0;
      if (!pageSize) return 1;
      return Math.max(1, Math.ceil(n / pageSize));
    }
    if (!pageSize) return 1;
    return Math.max(1, Math.ceil(snapshotDomRows().length / pageSize));
  };

  const applyPage = () => {
    if (virtualEnabled) return; /* virtual owns row visibility */
    if (!pageSize) {
      snapshotDomRows().forEach((tr) => {
        tr.hidden = false;
      });
      applyColumnLayout();
      return;
    }
    const rows = snapshotDomRows();
    const total = getPageCount();
    if (page > total) page = total;
    if (page < 1) page = 1;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    rows.forEach((tr, i) => {
      tr.hidden = i < start || i >= end;
    });
    host.setAttribute("data-page", String(page));
    host.setAttribute("data-page-count", String(total));
    root.dispatchEvent(
      new CustomEvent("blora-table-page", {
        bubbles: true,
        detail: { page, pageSize, pageCount: total },
      }),
    );
    applyColumnLayout();
    if (selectable) {
      ensureSelectionColumn();
      syncTableSelection();
    }
  };

  const compareRows =
    (col: number, asc: boolean) => (a: HTMLTableRowElement, b: HTMLTableRowElement) => {
      const av = a.children[col]?.textContent?.trim() || "";
      const bv = b.children[col]?.textContent?.trim() || "";
      const an = Number(av);
      const bn = Number(bv);
      if (!Number.isNaN(an) && !Number.isNaN(bn) && av !== "" && bv !== "") {
        return asc ? an - bn : bn - an;
      }
      return asc ? av.localeCompare(bv, "zh") : bv.localeCompare(av, "zh");
    };

  const clearSortAttrs = (except?: HTMLElement) => {
    table.querySelectorAll<HTMLElement>("th[data-sort], th[data-blora-sort]").forEach((h) => {
      if (except && h === except) return;
      delete h.dataset.sortDir;
      h.removeAttribute("aria-sort");
    });
  };

  /* —— Row selection (data-blora-selectable) —— */
  const rowKeyOf = (tr: HTMLTableRowElement): string => {
    return (
      tr.getAttribute("data-row-key") ||
      tr.dataset.virtualIndex ||
      tr.getAttribute("data-id") ||
      Array.from(tr.cells)
        .filter((c) => !c.hasAttribute("data-blora-select-col"))
        .map((c) => c.textContent?.trim() || "")
        .join("|")
    );
  };

  const ensureSelectionColumn = () => {
    if (!selectable) return;
    const theadRow = table.tHead?.rows[0];
    if (!theadRow) return;
    if (!theadRow.querySelector("th[data-blora-select-col]")) {
      const th = doc.createElement("th");
      th.setAttribute("data-blora-select-col", "");
      th.className = "blora-table-select-col";
      th.appendChild(
        makeBloraCheckbox(doc, {
          className: "blora-table-check",
          attrs: 'data-blora-select-all aria-label="全选"',
        }),
      );
      theadRow.insertBefore(th, theadRow.firstChild);
    }
    Array.from(tbody.rows).forEach((tr) => {
      if (tr.classList.contains("blora-table-virtual-pad")) return;
      if (tr.querySelector("td[data-blora-select-col]")) return;
      const td = doc.createElement("td");
      td.setAttribute("data-blora-select-col", "");
      td.className = "blora-table-select-col";
      const key = rowKeyOf(tr);
      const cb = makeBloraCheckbox(doc, {
        className: "blora-table-check",
        checked: selectedKeys.has(key),
        attrs: `data-blora-row-select aria-label="选择行" data-row-key="${key.replace(/"/g, "")}"`,
      });
      td.appendChild(cb);
      tr.insertBefore(td, tr.firstChild);
    });

    let bulk =
      (host.parentElement &&
        host.parentElement.querySelector<HTMLElement>(
          `.blora-table-bulk[data-blora-table-bulk="${table.id}"]`,
        )) ||
      null;
    if (!bulk && host.parentElement) {
      bulk = doc.createElement("div");
      bulk.className = "blora-table-bulk";
      bulk.setAttribute("data-blora-table-bulk", table.id);
      bulk.hidden = true;
      const count = doc.createElement("span");
      count.className = "blora-table-bulk__count";
      const clearBtn = doc.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = "blora-button";
      clearBtn.setAttribute("data-variant", "ghost");
      clearBtn.setAttribute("data-size", "sm");
      clearBtn.setAttribute("data-blora-clear-selection", "");
      clearBtn.textContent = "清除选择";
      const slot = doc.createElement("span");
      slot.className = "blora-table-bulk__slot";
      slot.setAttribute("data-blora-bulk-actions", "");
      bulk.append(count, clearBtn, slot);
      host.parentElement.insertBefore(bulk, host);
    }
    table._bloraBulk = bulk;
  };

  const getSelectedRows = (): HTMLTableRowElement[] => {
    return Array.from(tbody.rows).filter((tr) => {
      if (tr.hidden || tr.classList.contains("blora-table-virtual-pad")) return false;
      const cb = tr.querySelector<HTMLInputElement>("input[data-blora-row-select]");
      return !!(cb && cb.checked);
    });
  };

  const syncTableSelection = () => {
    if (!selectable) return;
    const rows = Array.from(tbody.rows).filter(
      (tr) => !tr.hidden && !tr.classList.contains("blora-table-virtual-pad"),
    );
    const selected = rows.filter((tr) => {
      const cb = tr.querySelector<HTMLInputElement>("input[data-blora-row-select]");
      return !!(cb && cb.checked);
    });
    const all = table.querySelector<HTMLInputElement>("input[data-blora-select-all]");
    if (all) {
      all.checked = rows.length > 0 && selected.length === rows.length;
      all.indeterminate = selected.length > 0 && selected.length < rows.length;
      const allLabel = all.closest(".blora-checkbox");
      allLabel?.toggleAttribute("data-indeterminate", all.indeterminate);
    }
    const bulk = table._bloraBulk;
    if (bulk) {
      bulk.hidden = selected.length === 0;
      const count = bulk.querySelector(".blora-table-bulk__count");
      if (count) count.textContent = `已选 ${selected.length} 项`;
    }
    host.classList.toggle("has-selection", selected.length > 0);
    table.dispatchEvent(
      new CustomEvent("blora-table-select", {
        bubbles: true,
        detail: { selected: selected.length, rows: selected, table },
      }),
    );
  };

  const clearSelection = () => {
    selectedKeys.clear();
    table
      .querySelectorAll<HTMLInputElement>(
        "input[data-blora-row-select], input[data-blora-select-all]",
      )
      .forEach((cb) => {
        cb.checked = false;
        cb.indeterminate = false;
      });
    table.querySelectorAll(".blora-checkbox[data-indeterminate]").forEach((el) => {
      el.removeAttribute("data-indeterminate");
    });
    syncTableSelection();
  };

  const onSelectionChange = (e: Event) => {
    if (!selectable) return;
    const input = e.target as HTMLInputElement;
    if (!(input instanceof HTMLInputElement) || input.type !== "checkbox") return;
    if (!table.contains(input)) return;

    if (input.hasAttribute("data-blora-select-all")) {
      const on = input.checked;
      tbody.querySelectorAll<HTMLInputElement>("input[data-blora-row-select]").forEach((cb) => {
        const tr = cb.closest("tr");
        if (tr && !tr.hidden && !tr.classList.contains("blora-table-virtual-pad")) {
          cb.checked = on;
          const key = cb.getAttribute("data-row-key") || rowKeyOf(tr);
          if (on) selectedKeys.add(key);
          else selectedKeys.delete(key);
        }
      });
      syncTableSelection();
      return;
    }
    if (input.hasAttribute("data-blora-row-select")) {
      const tr = input.closest("tr");
      if (tr) {
        const key = input.getAttribute("data-row-key") || rowKeyOf(tr);
        if (input.checked) selectedKeys.add(key);
        else selectedKeys.delete(key);
      }
      syncTableSelection();
    }
  };

  const onBulkClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-blora-clear-selection]")) {
      clearSelection();
    }
  };

  /* —— Virtual scroll (Y rows + optional X columns when narrow / many cols) —— */
  const ensureScroller = (): HTMLElement => {
    if (scroller && scroller.isConnected) return scroller;
    host.classList.add("blora-table-wrap--virtual");
    let el = host.querySelector<HTMLElement>(".blora-table-virtual");
    if (!el) {
      el = doc.createElement("div");
      el.className = "blora-table-virtual";
      const parent = table.parentElement;
      if (parent) {
        parent.insertBefore(el, table);
        el.appendChild(table);
      } else {
        host.appendChild(el);
        el.appendChild(table);
      }
    }
    const vh = Number(host.getAttribute("data-viewport-height")) || el.clientHeight || 360;
    el.style.height = `${vh}px`;
    el.style.overflow = "auto";
    scroller = el;
    return el;
  };

  /** Full column meta for virtual X (keys + header labels) */
  const virtualColMeta = (): { key: string; label: string }[] => {
    const data = table._bloraRowData || [];
    const keys = table._bloraRowKeys;
    if (keys?.length) {
      return keys.map((k, i) => ({
        key: k,
        label:
          dataThs()
            [i]?.textContent?.replace(/\s*[⇅▲▼]\s*$/, "")
            .trim() || k,
      }));
    }
    const ths = dataThs();
    if (ths.length) {
      return ths.map((th, i) => ({
        key: th.getAttribute("data-col-key") || th.getAttribute("data-blora-sort") || String(i),
        label: th.textContent?.replace(/\s*[⇅▲▼]\s*$/, "").trim() || String(i + 1),
      }));
    }
    const sample = data[0];
    if (Array.isArray(sample)) {
      return sample.map((_, i) => ({ key: String(i), label: `Col ${i + 1}` }));
    }
    if (sample && typeof sample === "object") {
      return Object.keys(sample).map((k) => ({ key: k, label: k }));
    }
    return [{ key: "0", label: "Col" }];
  };

  const cellValue = (row: TableRowData | undefined, colIndex: number, key: string): string => {
    if (row == null) return "";
    if (Array.isArray(row)) {
      const cell = row[colIndex];
      return cell == null ? "" : String(cell);
    }
    const cell = (row as Record<string, unknown>)[key];
    return cell == null ? "" : String(cell);
  };

  const makePadCell = (widthPx: number, heightPx?: number): HTMLTableCellElement => {
    const td = doc.createElement("td");
    td.className = "blora-table-virtual-pad-cell";
    td.style.cssText = [
      `width:${widthPx}px`,
      `min-width:${widthPx}px`,
      `max-width:${widthPx}px`,
      "padding:0",
      "border:0",
      heightPx != null ? `height:${heightPx}px` : "",
    ]
      .filter(Boolean)
      .join(";");
    return td;
  };

  const renderVirtual = () => {
    if (!virtualEnabled) return;
    const data = table._bloraRowData || [];
    const rowH = Number(host.getAttribute("data-row-height")) || 44;
    const colW = Number(host.getAttribute("data-col-width")) || 120;
    const overscan = Number(host.getAttribute("data-overscan")) || 6;
    /* y | x | both — default both (auto-skips X when all columns fit) */
    const axis = (host.getAttribute("data-virtual-axis") || "both").toLowerCase();
    const wantY = axis === "y" || axis === "both";
    const wantX = axis === "x" || axis === "both";

    const scrollEl = ensureScroller();
    tbody = table.tBodies[0] || table.createTBody();
    const thead = table.tHead || table.createTHead();
    let headRow = thead.rows[0];
    if (!headRow) {
      headRow = thead.insertRow();
    }

    const viewportH =
      scrollEl.clientHeight || Number(host.getAttribute("data-viewport-height")) || 360;
    const viewportW =
      scrollEl.clientWidth ||
      Number(host.getAttribute("data-viewport-width")) ||
      host.clientWidth ||
      600;

    const totalRows = data.length;
    const cols = virtualColMeta();
    const totalCols = cols.length;

    /* —— Y window —— */
    let rowStart = 0;
    let rowEnd = totalRows;
    if (wantY && totalRows > 0) {
      const scrollTop = scrollEl.scrollTop || 0;
      rowStart = Math.max(0, Math.floor(scrollTop / rowH) - overscan);
      const visible = Math.ceil(viewportH / rowH) + overscan * 2;
      rowEnd = Math.min(totalRows, rowStart + visible);
    }

    /* —— X window: only when columns overflow viewport (narrow / many cols) —— */
    let colStart = 0;
    let colEnd = totalCols;
    const totalWidth = totalCols * colW;
    const doX = wantX && totalWidth > viewportW + 1;
    if (doX) {
      const scrollLeft = scrollEl.scrollLeft || 0;
      colStart = Math.max(0, Math.floor(scrollLeft / colW) - overscan);
      const visibleCols = Math.ceil(viewportW / colW) + overscan * 2;
      colEnd = Math.min(totalCols, colStart + visibleCols);
    }

    const padLeft = doX ? colStart * colW : 0;
    const padRight = doX ? Math.max(0, totalCols - colEnd) * colW : 0;
    const visibleColCount = Math.max(1, colEnd - colStart);
    /* vertical pad row colspan = select + left pad + visible cols + right pad */
    const padColSpan = (selectable ? 1 : 0) + (doX ? 2 : 0) + visibleColCount;

    /* Header: rebuild for horizontal window */
    const headFrag = doc.createDocumentFragment();
    if (selectable) {
      const thSel = doc.createElement("th");
      thSel.setAttribute("data-blora-select-col", "");
      thSel.className = "blora-table-select-col";
      thSel.appendChild(
        makeBloraCheckbox(doc, {
          className: "blora-table-check",
          attrs: 'data-blora-select-all aria-label="全选"',
        }),
      );
      headFrag.appendChild(thSel);
    }
    if (doX && padLeft > 0) {
      const thL = doc.createElement("th");
      thL.className = "blora-table-virtual-pad-cell";
      thL.style.cssText = `width:${padLeft}px;min-width:${padLeft}px;padding:0;border:0`;
      headFrag.appendChild(thL);
    }
    for (let c = colStart; c < colEnd; c++) {
      const meta = cols[c]!;
      const th = doc.createElement("th");
      th.dataset.colKey = meta.key;
      th.setAttribute("data-col-key", meta.key);
      th.dataset.colIndex = String(c);
      th.style.width = `${colW}px`;
      th.style.minWidth = `${colW}px`;
      th.textContent = meta.label;
      headFrag.appendChild(th);
    }
    if (doX && padRight > 0) {
      const thR = doc.createElement("th");
      thR.className = "blora-table-virtual-pad-cell";
      thR.style.cssText = `width:${padRight}px;min-width:${padRight}px;padding:0;border:0`;
      headFrag.appendChild(thR);
    }
    headRow.replaceChildren(headFrag);

    /* Body */
    const frag = doc.createDocumentFragment();
    if (wantY && rowStart > 0) {
      const padTop = doc.createElement("tr");
      padTop.className = "blora-table-virtual-pad";
      const tdTop = doc.createElement("td");
      tdTop.colSpan = padColSpan;
      tdTop.style.cssText = `height:${rowStart * rowH}px;padding:0;border:0`;
      padTop.appendChild(tdTop);
      frag.appendChild(padTop);
    }

    for (let i = rowStart; i < rowEnd; i++) {
      const row = data[i];
      const tr = doc.createElement("tr");
      tr.dataset.virtualIndex = String(i);
      tr.style.height = `${rowH}px`;
      if (selectable) {
        const td = doc.createElement("td");
        td.setAttribute("data-blora-select-col", "");
        td.className = "blora-table-select-col";
        const key = String(i);
        td.appendChild(
          makeBloraCheckbox(doc, {
            className: "blora-table-check",
            checked: selectedKeys.has(key),
            attrs: `data-blora-row-select aria-label="选择行" data-row-key="${key}"`,
          }),
        );
        tr.appendChild(td);
      }
      if (doX && padLeft > 0) tr.appendChild(makePadCell(padLeft));
      for (let c = colStart; c < colEnd; c++) {
        const meta = cols[c]!;
        const td = doc.createElement("td");
        td.dataset.colIndex = String(c);
        td.setAttribute("data-col-key", meta.key);
        td.style.width = `${colW}px`;
        td.style.minWidth = `${colW}px`;
        td.textContent = cellValue(row, c, meta.key);
        tr.appendChild(td);
      }
      if (doX && padRight > 0) tr.appendChild(makePadCell(padRight));
      frag.appendChild(tr);
    }

    if (wantY && rowEnd < totalRows) {
      const padBot = doc.createElement("tr");
      padBot.className = "blora-table-virtual-pad";
      const tdBot = doc.createElement("td");
      tdBot.colSpan = padColSpan;
      tdBot.style.cssText = `height:${Math.max(0, totalRows - rowEnd) * rowH}px;padding:0;border:0`;
      padBot.appendChild(tdBot);
      frag.appendChild(padBot);
    }

    tbody.replaceChildren(frag);

    /* Table min-width keeps horizontal scrollbar when X-virtual */
    if (doX) {
      table.style.minWidth = `${totalWidth}px`;
    } else {
      table.style.minWidth = "";
    }

    /* Column hide panel still applies to currently rendered cols */
    if (colsEnabled) applyColumnLayout();
    if (selectable) {
      ensureSelectionColumn();
      syncTableSelection();
    }

    host.setAttribute("data-virtual-total", String(totalRows));
    host.setAttribute("data-virtual-start", String(rowStart));
    host.setAttribute("data-virtual-end", String(rowEnd));
    host.setAttribute("data-virtual-col-start", String(colStart));
    host.setAttribute("data-virtual-col-end", String(colEnd));
    host.toggleAttribute("data-virtual-x", doX);
  };

  let virtualTicking = false;
  const onVirtualScroll = () => {
    if (virtualTicking) return;
    virtualTicking = true;
    requestAnimationFrame(() => {
      virtualTicking = false;
      renderVirtual();
    });
  };

  /* —— Column panel —— */
  let colsBar: HTMLElement | null = null;
  let colsPanel: HTMLElement | null = null;
  let dragKey = "";
  let colsWired = false;

  const paintColsPanel = () => {
    if (!colsPanel) return;
    const list = colsPanel.querySelector(".blora-table-cols__list");
    if (!list) return;
    list.replaceChildren();
    colCfg.forEach((col) => {
      const row = doc.createElement("div");
      row.className = "blora-table-cols__item";
      row.setAttribute("data-col-key", col.key);
      row.draggable = true;

      const grip = doc.createElement("span");
      grip.className = "blora-table-cols__grip";
      grip.setAttribute("aria-hidden", "true");
      grip.title = "拖动排序";
      const gsvg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
      gsvg.setAttribute("width", "14");
      gsvg.setAttribute("height", "14");
      gsvg.setAttribute("viewBox", "0 0 16 16");
      gsvg.setAttribute("fill", "currentColor");
      [
        [5, 4],
        [11, 4],
        [5, 8],
        [11, 8],
        [5, 12],
        [11, 12],
      ].forEach(([cx, cy]) => {
        const c = doc.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", String(cx));
        c.setAttribute("cy", String(cy));
        c.setAttribute("r", "1.2");
        gsvg.appendChild(c);
      });
      grip.appendChild(gsvg);

      /* v1 structure: .blora-checkbox > input + .blora-checkbox__box + text */
      const label = doc.createElement("label");
      label.className = "blora-checkbox blora-table-cols__check";
      const input = doc.createElement("input");
      input.type = "checkbox";
      input.checked = col.visible;
      input.setAttribute("data-col-key", col.key);
      const box = doc.createElement("span");
      box.className = "blora-checkbox__box";
      const text = doc.createElement("span");
      text.textContent = col.label;
      label.append(input, box, text);

      row.append(grip, label);
      list.appendChild(row);
    });
  };

  const ensureColsPanel = (): HTMLElement => {
    const parent = host.parentElement || host;
    colsBar = parent.querySelector(".blora-table-cols-bar");
    colsPanel = parent.querySelector(".blora-table-cols");
    if (!colsBar) {
      colsBar = doc.createElement("div");
      colsBar.className = "blora-table-cols-bar";
      const btn = doc.createElement("button");
      btn.type = "button";
      btn.className = "blora-button";
      btn.setAttribute("data-variant", "outline");
      btn.setAttribute("data-size", "sm");
      btn.setAttribute("data-blora-cols-toggle", "");
      btn.textContent = "列设置";
      colsBar.appendChild(btn);
      parent.insertBefore(colsBar, host);
    }
    if (!colsPanel) {
      colsPanel = doc.createElement("div");
      colsPanel.className = "blora-table-cols";
      colsPanel.hidden = true;
      const list = doc.createElement("div");
      list.className = "blora-table-cols__list";
      const foot = doc.createElement("div");
      foot.className = "blora-table-cols__foot";
      const reset = doc.createElement("button");
      reset.type = "button";
      reset.className = "blora-button";
      reset.setAttribute("data-variant", "ghost");
      reset.setAttribute("data-size", "sm");
      reset.setAttribute("data-blora-cols-reset", "");
      reset.textContent = "重置列";
      foot.appendChild(reset);
      colsPanel.append(list, foot);
      parent.insertBefore(colsPanel, host);
    }
    return colsPanel;
  };

  const onColsClick = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-blora-cols-toggle]")) {
      if (!colsPanel) return;
      colsPanel.hidden = !colsPanel.hidden;
      if (!colsPanel.hidden) paintColsPanel();
      return;
    }
    if (t.closest("[data-blora-cols-reset]")) {
      colCfg = defaultColsConfig(table);
      writeColsConfig(host, table, colCfg);
      paintColsPanel();
      applyColumnLayout();
      if (virtualEnabled) renderVirtual();
    }
  };

  const onColsChange = (e: Event) => {
    const input = (e.target as HTMLElement).closest<HTMLInputElement>("input[data-col-key]");
    if (!input || !colsPanel?.contains(input)) return;
    const key = input.getAttribute("data-col-key") || "";
    const col = colCfg.find((c) => c.key === key);
    if (!col) return;
    col.visible = input.checked;
    writeColsConfig(host, table, colCfg);
    applyColumnLayout();
    if (virtualEnabled) renderVirtual();
  };

  const onDragStart = (e: DragEvent) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>(".blora-table-cols__item");
    if (!item || !colsPanel?.contains(item)) return;
    /* Don't start drag from checkbox hit area (v1 parity) */
    if ((e.target as HTMLElement).closest("input, .blora-checkbox__box, label.blora-checkbox")) {
      e.preventDefault();
      return;
    }
    dragKey = item.getAttribute("data-col-key") || "";
    try {
      e.dataTransfer!.effectAllowed = "move";
      e.dataTransfer!.setData("text/plain", dragKey);
    } catch {
      /* ignore */
    }
    item.classList.add("is-dragging");
  };

  const onDragOver = (e: DragEvent) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>(".blora-table-cols__item");
    if (!item || !colsPanel?.contains(item)) return;
    e.preventDefault();
    colsPanel
      .querySelectorAll(".is-drag-over")
      .forEach((el) => el.classList.remove("is-drag-over"));
    item.classList.add("is-drag-over");
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const item = (e.target as HTMLElement).closest<HTMLElement>(".blora-table-cols__item");
    if (!item || !colsPanel?.contains(item) || !dragKey) return;
    const toKey = item.getAttribute("data-col-key") || "";
    const from = colCfg.findIndex((c) => c.key === dragKey);
    const to = colCfg.findIndex((c) => c.key === toKey);
    if (from < 0 || to < 0 || from === to) return;
    const [moved] = colCfg.splice(from, 1);
    if (!moved) return;
    colCfg.splice(to, 0, moved);
    colCfg.forEach((c, i) => {
      c.index = i;
    });
    writeColsConfig(host, table, colCfg);
    paintColsPanel();
    applyColumnLayout();
    if (virtualEnabled) renderVirtual();
  };

  const onDragEnd = () => {
    dragKey = "";
    colsPanel
      ?.querySelectorAll(".blora-table-cols__item")
      .forEach((el) => el.classList.remove("is-dragging", "is-drag-over"));
  };

  const onSort = (e: MouseEvent) => {
    if (virtualEnabled) return; /* sort virtual data via setRows order if needed later */
    const th = (e.target as HTMLElement).closest<HTMLElement>("th[data-sort], th[data-blora-sort]");
    if (!th || !table.contains(th)) return;
    ensureSortUi(th);
    const col = Array.from(th.parentElement!.children).indexOf(th);
    const cur = th.dataset.sortDir;
    let next: "asc" | "desc" | null;
    if (cur === "asc") next = "desc";
    else if (cur === "desc") next = null;
    else next = "asc";

    clearSortAttrs(next ? th : undefined);

    if (next === null) {
      delete th.dataset.sortDir;
      th.removeAttribute("aria-sort");
      originalOrder.forEach((r) => {
        if (document.contains(r)) tbody.appendChild(r);
      });
      page = 1;
      applyPage();
      return;
    }

    th.dataset.sortDir = next;
    th.setAttribute("aria-sort", next === "asc" ? "ascending" : "descending");
    const rows = snapshotDomRows();
    rows.sort(compareRows(col, next === "asc"));
    rows.forEach((r) => tbody.appendChild(r));
    page = 1;
    applyPage();
  };

  const onPagerClick = (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-table-page], [data-page]");
    if (!btn) return;
    const navSel = host.getAttribute("data-pagination");
    if (navSel) {
      const nav = document.querySelector(navSel);
      if (nav && !nav.contains(btn)) return;
    } else if (!host.contains(btn) && !table.contains(btn)) {
      return;
    }
    const raw = btn.getAttribute("data-table-page") || btn.getAttribute("data-page");
    if (raw === "prev") page = Math.max(1, page - 1);
    else if (raw === "next") page = Math.min(getPageCount(), page + 1);
    else if (raw) page = Number(raw) || page;
    applyPage();
  };

  /* Wire */
  table.addEventListener("click", onSort);
  document.addEventListener("click", onPagerClick);
  if (selectable) {
    table.addEventListener("change", onSelectionChange);
    document.addEventListener("click", onBulkClick);
    ensureSelectionColumn();
    syncTableSelection();
  }

  if (colsEnabled) {
    const panel = ensureColsPanel();
    document.addEventListener("click", onColsClick);
    panel.addEventListener("change", onColsChange);
    panel.addEventListener("dragstart", onDragStart);
    panel.addEventListener("dragover", onDragOver);
    panel.addEventListener("drop", onDrop);
    panel.addEventListener("dragend", onDragEnd);
    colsWired = true;
    applyColumnLayout();
  }

  if (virtualEnabled) {
    const scrollEl = ensureScroller();
    scrollEl.addEventListener("scroll", onVirtualScroll, { passive: true });
    if (!table._bloraRowData) {
      /* Seed from existing DOM rows */
      const rows = snapshotDomRows();
      table._bloraRowData = rows.map((tr) =>
        Array.from(tr.cells).map((td) => td.textContent?.trim() || ""),
      );
      originalOrder = [];
    }
    renderVirtual();
  } else {
    applyPage();
  }

  return {
    setPage(p: number) {
      page = p;
      applyPage();
    },
    getPage: () => page,
    getPageCount,
    setRows(data: TableRowData[], keys?: string[]) {
      table._bloraRowData = data.slice();
      if (keys) table._bloraRowKeys = keys.slice();
      else if (data[0] && !Array.isArray(data[0]) && typeof data[0] === "object") {
        table._bloraRowKeys = Object.keys(data[0] as object);
      }
      if (virtualEnabled) {
        if (scroller) scroller.scrollTop = 0;
        renderVirtual();
      } else {
        /* Non-virtual: rebuild tbody from data */
        tbody.replaceChildren();
        data.forEach((row) => {
          const tr = doc.createElement("tr");
          if (Array.isArray(row)) {
            row.forEach((cell, c) => {
              const td = doc.createElement("td");
              td.textContent = cell == null ? "" : String(cell);
              td.dataset.colIndex = String(c);
              tr.appendChild(td);
            });
          } else {
            const cols = table._bloraRowKeys || Object.keys(row as object);
            cols.forEach((key, c) => {
              const td = doc.createElement("td");
              const cell = (row as Record<string, unknown>)[key];
              td.textContent = cell == null ? "" : String(cell);
              td.dataset.colIndex = String(c);
              tr.appendChild(td);
            });
          }
          tbody.appendChild(tr);
        });
        originalOrder = snapshotDomRows();
        page = 1;
        applyPage();
      }
    },
    getColumnConfig: () => colCfg.map((c) => ({ ...c })),
    setColumnVisible(key: string, visible: boolean) {
      const col = colCfg.find((c) => c.key === key);
      if (!col) return;
      col.visible = visible;
      writeColsConfig(host, table, colCfg);
      paintColsPanel();
      applyColumnLayout();
      if (virtualEnabled) renderVirtual();
    },
    resetColumns() {
      colCfg = defaultColsConfig(table);
      writeColsConfig(host, table, colCfg);
      paintColsPanel();
      applyColumnLayout();
      if (virtualEnabled) renderVirtual();
    },
    getSelectedRows,
    clearSelection,
    destroy() {
      table.removeEventListener("click", onSort);
      document.removeEventListener("click", onPagerClick);
      document.removeEventListener("click", onColsClick);
      if (selectable) {
        table.removeEventListener("change", onSelectionChange);
        document.removeEventListener("click", onBulkClick);
      }
      if (colsWired && colsPanel) {
        colsPanel.removeEventListener("change", onColsChange);
        colsPanel.removeEventListener("dragstart", onDragStart);
        colsPanel.removeEventListener("dragover", onDragOver);
        colsPanel.removeEventListener("drop", onDrop);
        colsPanel.removeEventListener("dragend", onDragEnd);
      }
      scroller?.removeEventListener("scroll", onVirtualScroll);
    },
  };
}
