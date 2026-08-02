/**
 * Table: sortable headers with direction indicators.
 */
export interface TableController {
  destroy(): void;
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

export function createTableController(root: HTMLElement): TableController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const table = root.matches("table") ? root : root.querySelector("table");
  if (!table) return { destroy: () => {} };
  const tbody = table.querySelector("tbody");
  if (!tbody) return { destroy: () => {} };

  const heads = Array.from(
    table.querySelectorAll<HTMLElement>("th[data-sort], th[data-blora-sort]"),
  );
  heads.forEach(ensureSortUi);

  const onSort = (e: MouseEvent) => {
    const th = (e.target as HTMLElement).closest<HTMLElement>("th[data-sort], th[data-blora-sort]");
    if (!th || !table.contains(th)) return;
    ensureSortUi(th);
    const col = Array.from(th.parentElement!.children).indexOf(th);
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const asc = th.dataset.sortDir !== "asc";
    th.dataset.sortDir = asc ? "asc" : "desc";
    table.querySelectorAll<HTMLElement>("th[data-sort], th[data-blora-sort]").forEach((h) => {
      if (h !== th) {
        delete h.dataset.sortDir;
        h.removeAttribute("aria-sort");
      }
    });
    th.setAttribute("aria-sort", asc ? "ascending" : "descending");
    rows.sort((a, b) => {
      const av = a.children[col]?.textContent?.trim() || "";
      const bv = b.children[col]?.textContent?.trim() || "";
      const an = Number(av);
      const bn = Number(bv);
      if (!Number.isNaN(an) && !Number.isNaN(bn)) return asc ? an - bn : bn - an;
      return asc ? av.localeCompare(bv, "zh") : bv.localeCompare(av, "zh");
    });
    rows.forEach((r) => tbody.appendChild(r));
  };

  table.addEventListener("click", onSort);
  return {
    destroy() {
      table.removeEventListener("click", onSort);
    },
  };
}
