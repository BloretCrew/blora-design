/**
 * Pagination: keyboard/click active page + prev/next.
 */
export interface PaginationController {
  destroy(): void;
}

export function createPaginationController(root: HTMLElement): PaginationController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const items = () =>
    Array.from(
      root.querySelectorAll<HTMLButtonElement>(
        ".blora-pagination__item:not(.blora-pagination__nav):not(.blora-pagination__ellipsis)",
      ),
    ).filter((b) => b.tagName === "BUTTON");

  const setPage = (btn: HTMLButtonElement) => {
    items().forEach((b) => {
      b.removeAttribute("aria-current");
      b.classList.remove("is-active");
    });
    btn.setAttribute("aria-current", "page");
    btn.classList.add("is-active");
    root.dispatchEvent(
      new CustomEvent("blora-change", {
        bubbles: true,
        detail: { page: Number(btn.textContent) || btn.dataset.page },
      }),
    );
    syncNav();
  };

  const syncNav = () => {
    const pages = items();
    const idx = pages.findIndex((b) => b.getAttribute("aria-current") === "page");
    const prev = root.querySelector<HTMLButtonElement>(
      '.blora-pagination__nav[aria-label*="上一"], .blora-pagination__nav:first-of-type',
    );
    const next = root.querySelectorAll<HTMLButtonElement>(".blora-pagination__nav");
    const nextBtn = next[next.length - 1];
    if (prev) prev.disabled = idx <= 0;
    if (nextBtn && nextBtn !== prev) nextBtn.disabled = idx < 0 || idx >= pages.length - 1;
  };

  const onClick = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    const pageBtn = t.closest<HTMLButtonElement>(".blora-pagination__item:not(.blora-pagination__nav)");
    if (pageBtn && root.contains(pageBtn) && pageBtn.tagName === "BUTTON") {
      setPage(pageBtn);
      return;
    }
    const nav = t.closest<HTMLButtonElement>(".blora-pagination__nav");
    if (!nav || !root.contains(nav)) return;
    const pages = items();
    const idx = pages.findIndex((b) => b.getAttribute("aria-current") === "page");
    const label = (nav.getAttribute("aria-label") || "").toLowerCase();
    const isPrev = label.includes("上") || label.includes("prev") || nav === root.querySelector(".blora-pagination__nav");
    if (isPrev && idx > 0) setPage(pages[idx - 1]!);
    else if (!isPrev && idx >= 0 && idx < pages.length - 1) setPage(pages[idx + 1]!);
  };

  root.addEventListener("click", onClick);
  syncNav();
  return {
    destroy() {
      root.removeEventListener("click", onClick);
    },
  };
}
