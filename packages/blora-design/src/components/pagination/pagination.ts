/**
 * Pagination: keyboard/click active page + prev/next.
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon, type BloraIconName } from "../../core/icons.js";

export const BLORA_PAGINATION_TAG = "blora-pagination";
export interface PaginationController {
  destroy(): void;
}

export type PaginationItem = number | "ellipsis";

export interface PaginationWindow {
  windowed: boolean;
  items: PaginationItem[];
  inner: number[];
  offset: number;
  windowSize: number;
  showStartEllipsis: boolean;
  showEndEllipsis: boolean;
}

/** Visible numeric buttons plus ellipses; used by the sliding middle track. */
export function paginationWindow(page: number, total: number, maxVisible = 7): PaginationWindow {
  const pageCount = Math.max(1, Math.floor(total));
  const current = Math.max(1, Math.min(pageCount, Math.floor(page)));
  const visible = Math.max(5, Math.floor(maxVisible));
  const all = Array.from({ length: pageCount }, (_, index) => index + 1);

  if (pageCount <= visible) {
    return {
      windowed: false,
      items: all,
      inner: all,
      offset: 0,
      windowSize: all.length,
      showStartEllipsis: false,
      showEndEllipsis: false,
    };
  }

  const baseWindow = Math.max(1, visible - 2);
  const trackLen = pageCount - 2;
  const neighbor = Math.floor((baseWindow - 1) / 2);
  const maxFirst = Math.max(2, pageCount - 1 - baseWindow + 1);
  let first = Math.min(Math.max(2, current - neighbor), maxFirst);
  const last = first + baseWindow - 1;

  // An ellipsis that would hide only the page next to 1 / last is a gap, not a skip.
  // Grow the window by 1 and drop that ellipsis so the row width stays constant.
  const showStartEllipsis = first > 3;
  const showEndEllipsis = last < pageCount - 2;

  if (!showStartEllipsis && !showEndEllipsis) {
    return {
      windowed: false,
      items: all,
      inner: all,
      offset: 0,
      windowSize: all.length,
      showStartEllipsis: false,
      showEndEllipsis: false,
    };
  }

  let windowSize = baseWindow;
  let offset = first - 2;
  if (!showStartEllipsis) {
    windowSize += 1;
    offset = 0;
    first = 2;
  }
  if (!showEndEllipsis) {
    windowSize += 1;
    offset = Math.max(0, trackLen - windowSize);
    first = 2 + offset;
  }

  const inner = Array.from({ length: windowSize }, (_, index) => first + index).filter(
    (item) => item > 1 && item < pageCount,
  );
  const items: PaginationItem[] = [1];
  if (showStartEllipsis) items.push("ellipsis");
  items.push(...inner);
  if (showEndEllipsis) items.push("ellipsis");
  items.push(pageCount);

  return {
    windowed: true,
    items,
    inner,
    offset,
    windowSize,
    showStartEllipsis,
    showEndEllipsis,
  };
}

/** Mirrors the v1 pagination window: boundaries plus a centred range around the current page. */
export function buildPaginationItems(page: number, total: number, maxVisible = 7): PaginationItem[] {
  const pageCount = Math.max(1, Math.floor(total));
  const current = Math.max(1, Math.min(pageCount, Math.floor(page)));
  const visible = Math.max(5, Math.floor(maxVisible));
  if (pageCount <= visible) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const neighbours = Math.max(1, Math.floor((visible - 3) / 2));
  const pages = new Set<number>([1, pageCount, current]);
  for (let offset = 1; offset <= neighbours; offset += 1) {
    pages.add(current - offset);
    pages.add(current + offset);
  }

  let ordered = Array.from(pages)
    .filter((item) => item >= 1 && item <= pageCount)
    .sort((a, b) => a - b);
  while (ordered.length < visible) {
    const first = ordered[1] ?? 1;
    const last = ordered.at(-2) ?? pageCount;
    if (first > 2) pages.add(first - 1);
    else if (last < pageCount - 1) pages.add(last + 1);
    else break;
    ordered = Array.from(pages)
      .filter((item) => item >= 1 && item <= pageCount)
      .sort((a, b) => a - b);
  }

  const result: PaginationItem[] = [];
  ordered.slice(0, visible).forEach((item, index, list) => {
    if (index > 0 && item - list[index - 1]! > 1) result.push("ellipsis");
    result.push(item);
  });
  return result;
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
        detail: { page: Number(btn.dataset.page ?? btn.textContent) },
      }),
    );
    syncNav();
  };

  const syncNav = () => {
    const current = Number(root.querySelector<HTMLButtonElement>('[aria-current="page"]')?.dataset.page ?? 1);
    const total = Number(root.dataset.total ?? items().at(-1)?.dataset.page ?? 1);
    const prev = root.querySelector<HTMLButtonElement>(
      '.blora-pagination__nav[aria-label*="上一"], .blora-pagination__nav:first-of-type',
    );
    const next = root.querySelectorAll<HTMLButtonElement>(".blora-pagination__nav");
    const nextBtn = next[next.length - 1];
    if (prev) prev.disabled = current <= 1;
    if (nextBtn && nextBtn !== prev) nextBtn.disabled = current >= total;
  };

  const onClick = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    const pageBtn = t.closest<HTMLButtonElement>(
      ".blora-pagination__item:not(.blora-pagination__nav)",
    );
    if (pageBtn && root.contains(pageBtn) && pageBtn.tagName === "BUTTON") {
      setPage(pageBtn);
      return;
    }
    const nav = t.closest<HTMLButtonElement>(".blora-pagination__nav");
    if (!nav || !root.contains(nav)) return;
    const current = Number(root.querySelector<HTMLButtonElement>('[aria-current="page"]')?.dataset.page ?? 1);
    const total = Number(root.dataset.total ?? 1);
    const label = (nav.getAttribute("aria-label") || "").toLowerCase();
    const isPrev =
      label.includes("上") ||
      label.includes("prev") ||
      nav === root.querySelector(".blora-pagination__nav");
    const target = isPrev ? current - 1 : current + 1;
    if (target < 1 || target > total) return;
    root.dispatchEvent(new CustomEvent("blora-change", { bubbles: true, detail: { page: target } }));
  };

  root.addEventListener("click", onClick);
  syncNav();
  return {
    destroy() {
      root.removeEventListener("click", onClick);
    },
  };
}

/** Pagination CE that generates accessible page and navigation buttons. */
export class BloraPagination extends BloraElement {
  private controller: PaginationController | null = null;
  static get observedAttributes(): string[] {
    return ["page", "total", "max-visible", "label", "disabled"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal) return;
    if (name === "disabled") {
      this.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
        button.disabled = this.hasAttribute("disabled");
      });
      return;
    }
    if ((name === "page" || name === "label") && this.querySelector(".blora-pagination")) {
      this.sync();
      return;
    }
    this.render();
    this.rebind();
  }

  get page(): number {
    return Number(
      this.querySelector<HTMLButtonElement>('[aria-current="page"]')?.textContent ??
        this.getAttribute("page") ??
        1,
    );
  }

  set page(page: number) {
    this.setAttribute("page", String(page));
  }

  protected render(): void {
    const total = Math.max(1, Number(this.getAttribute("total") ?? 1));
    const current = Math.max(1, Math.min(total, Number(this.getAttribute("page") ?? 1)));
    const window = paginationWindow(current, total, Number(this.getAttribute("max-visible") ?? 7));
    const root = this.ownerDocument.createElement("nav");
    root.className = "blora-pagination";
    root.dataset.bloraGenerated = "";
    root.dataset.total = String(total);
    root.setAttribute("aria-label", this.getAttribute("label") ?? "Pagination");
    root.appendChild(this.createNav("上一页", "chevron-left"));
    if (window.windowed) {
      root.appendChild(this.createPageButton(1, current));
      root.appendChild(this.createEllipsis("start"));
      const viewport = this.ownerDocument.createElement("div");
      viewport.className = "blora-pagination__window";
      const track = this.ownerDocument.createElement("div");
      track.className = "blora-pagination__track";
      for (let page = 2; page <= total - 1; page += 1) {
        track.appendChild(this.createPageButton(page, current));
      }
      viewport.appendChild(track);
      root.appendChild(viewport);
      root.appendChild(this.createEllipsis("end"));
      root.appendChild(this.createPageButton(total, current));
    } else {
      for (const item of window.items) {
        if (item !== "ellipsis") root.appendChild(this.createPageButton(item, current));
      }
    }
    root.appendChild(this.createNav("下一页", "chevron-right"));
    this.replaceChildren(root);
    this.applyWindow(root, window, current, total);
    requestAnimationFrame(() => root.classList.add("is-animated"));
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-pagination");
    if (!root) return;
    const total = Math.max(1, Number(this.getAttribute("total") ?? 1));
    const current = Math.max(1, Math.min(total, Number(this.getAttribute("page") ?? 1)));
    const window = paginationWindow(current, total, Number(this.getAttribute("max-visible") ?? 7));
    if (window.windowed !== Boolean(root.querySelector(".blora-pagination__track"))) {
      this.render();
      this.rebind();
      return;
    }
    this.applyWindow(root, window, current, total);
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-pagination");
    if (!root) return;
    this.controller = createPaginationController(root);
    this.listen(root, "blora-change", (event) => {
      const page = (event as CustomEvent<{ page: number }>).detail.page;
      this.setAttribute("page", String(page));
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }

  private applyWindow(
    root: HTMLElement,
    window: PaginationWindow,
    current: number,
    total: number,
  ): void {
    root.dataset.total = String(total);
    root.setAttribute("aria-label", this.getAttribute("label") ?? "Pagination");
    root.style.setProperty("--blora-pagination-window", String(window.windowSize));
    root.style.setProperty("--blora-pagination-offset", String(window.offset));
    root.querySelector('[data-edge="start"]')?.classList.toggle("is-inactive", !window.showStartEllipsis);
    root.querySelector('[data-edge="end"]')?.classList.toggle("is-inactive", !window.showEndEllipsis);
    root.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((button) => {
      const page = Number(button.dataset.page);
      const visible = !window.windowed || page === 1 || page === total || window.inner.includes(page);
      if (page === current) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
      button.classList.toggle("is-active", page === current);
      button.tabIndex = visible ? 0 : -1;
      if (visible) button.removeAttribute("aria-hidden");
      else button.setAttribute("aria-hidden", "true");
    });
    const prev = root.querySelector<HTMLButtonElement>('.blora-pagination__nav[aria-label="上一页"]');
    const next = root.querySelector<HTMLButtonElement>('.blora-pagination__nav[aria-label="下一页"]');
    if (prev) prev.disabled = this.hasAttribute("disabled") || current <= 1;
    if (next) next.disabled = this.hasAttribute("disabled") || current >= total;
  }

  private createPageButton(page: number, current: number): HTMLButtonElement {
    const button = this.ownerDocument.createElement("button");
    button.type = "button";
    button.className = "blora-pagination__item";
    button.textContent = String(page);
    button.dataset.page = String(page);
    button.setAttribute("aria-label", `第 ${page} 页`);
    button.disabled = this.hasAttribute("disabled");
    if (page === current) button.setAttribute("aria-current", "page");
    return button;
  }

  private createEllipsis(edge: "start" | "end"): HTMLSpanElement {
    const ellipsis = this.ownerDocument.createElement("span");
    ellipsis.className = "blora-pagination__ellipsis";
    ellipsis.dataset.edge = edge;
    ellipsis.setAttribute("aria-hidden", "true");
    ellipsis.textContent = "…";
    return ellipsis;
  }

  private createNav(label: string, iconName: BloraIconName): HTMLButtonElement {
    const button = this.ownerDocument.createElement("button");
    button.type = "button";
    button.className = "blora-pagination__item blora-pagination__nav";
    button.setAttribute("aria-label", label);
    button.disabled = this.hasAttribute("disabled");
    button.appendChild(createBloraIcon(iconName, 18, this.ownerDocument));
    return button;
  }
}

export function defineBloraPagination(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_PAGINATION_TAG)) return;
  registry.define(BLORA_PAGINATION_TAG, BloraPagination);
}
