/**
 * Collapse / accordion (v1 initCollapse parity).
 * Uses data-open (2.0) with is-open alias.
 */
export interface CollapseController {
  destroy(): void;
}

export function createCollapseController(root: HTMLElement): CollapseController {
  if (typeof document === "undefined") return { destroy: () => {} };

  const setH = (item: HTMLElement) => {
    const body = item.querySelector<HTMLElement>(".blora-collapse__body");
    if (!body) return;
    body.style.setProperty("--blora-collapse-h", `${body.scrollHeight}px`);
  };

  root.querySelectorAll<HTMLElement>(".blora-collapse__item[data-open], .blora-collapse__item.is-open").forEach(setH);

  const onClick = (e: MouseEvent) => {
    const head = (e.target as HTMLElement).closest<HTMLElement>(".blora-collapse__head");
    if (!head || !root.contains(head)) return;
    const item = head.closest<HTMLElement>(".blora-collapse__item");
    if (!item) return;
    const group =
      item.closest<HTMLElement>("[data-blora-accordion]") ||
      (root.hasAttribute("data-blora-accordion") ? root : null);
    const isOpen = item.hasAttribute("data-open") || item.classList.contains("is-open");
    if (group && !isOpen) {
      group.querySelectorAll<HTMLElement>(".blora-collapse__item[data-open], .blora-collapse__item.is-open").forEach((o) => {
        if (o === item) return;
        o.removeAttribute("data-open");
        o.classList.remove("is-open");
      });
    }
    if (!isOpen) {
      setH(item);
      item.setAttribute("data-open", "");
      item.classList.add("is-open");
      head.setAttribute("aria-expanded", "true");
    } else {
      item.removeAttribute("data-open");
      item.classList.remove("is-open");
      head.setAttribute("aria-expanded", "false");
    }
  };

  root.addEventListener("click", onClick);
  root.querySelectorAll<HTMLElement>(".blora-collapse__head").forEach((h) => {
    const item = h.closest(".blora-collapse__item");
    const open = item?.hasAttribute("data-open") || item?.classList.contains("is-open");
    h.setAttribute("aria-expanded", String(!!open));
  });

  return {
    destroy() {
      root.removeEventListener("click", onClick);
    },
  };
}
