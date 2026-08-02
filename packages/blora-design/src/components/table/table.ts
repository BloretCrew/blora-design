/**
 * Table: sort headers + simple client pagination (v1 subset).
 */
export interface TableController {
  destroy(): void;
}

export function createTableController(root: HTMLElement): TableController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const table = root.matches("table") ? root : root.querySelector("table");
  if (!table) return { destroy: () => {} };
  const tbody = table.querySelector("tbody");
  if (!tbody) return { destroy: () => {} };

  const onSort = (e: MouseEvent) => {
    const th = (e.target as HTMLElement).closest<HTMLElement>("th[data-sort], th[data-blora-sort]");
    if (!th || !table.contains(th)) return;
    const col = Array.from(th.parentElement!.children).indexOf(th);
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const asc = th.dataset.sortDir !== "asc";
    th.dataset.sortDir = asc ? "asc" : "desc";
    table.querySelectorAll("th[data-sort-dir]").forEach((h) => {
      if (h !== th) delete (h as HTMLElement).dataset.sortDir;
    });
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
