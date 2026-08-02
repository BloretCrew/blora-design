/**
 * Segmented control with sliding indicator (v1 initSegmented).
 */
export interface SegmentedController {
  destroy(): void;
}

export function createSegmentedController(root: HTMLElement): SegmentedController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const win = root.ownerDocument.defaultView!;
  let indicator = root.querySelector<HTMLElement>(".blora-segmented__indicator");
  if (!indicator) {
    indicator = root.ownerDocument.createElement("span");
    indicator.className = "blora-segmented__indicator";
    indicator.setAttribute("aria-hidden", "true");
    root.insertBefore(indicator, root.firstChild);
  }
  const items = Array.from(root.querySelectorAll<HTMLElement>(".blora-segmented__item"));
  root.setAttribute("role", "radiogroup");

  const moveIndicator = (item: HTMLElement) => {
    const segRect = root.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    indicator!.style.left = `${itemRect.left - segRect.left}px`;
    indicator!.style.width = `${itemRect.width}px`;
  };

  const enabled = () =>
    items.filter(
      (item) =>
        !item.classList.contains("is-disabled") && item.getAttribute("aria-disabled") !== "true",
    );

  const activate = (item: HTMLElement, focus = false, emit = true) => {
    if (!item || !enabled().includes(item)) return;
    items.forEach((candidate) => {
      const active = candidate === item;
      candidate.classList.toggle("is-active", active);
      candidate.toggleAttribute("data-active", active);
      candidate.setAttribute("aria-checked", String(active));
      if (candidate.getAttribute("aria-disabled") !== "true") {
        candidate.tabIndex = active ? 0 : -1;
      }
    });
    root.dataset.value = item.dataset.value || item.textContent?.trim() || "";
    moveIndicator(item);
    if (focus) item.focus();
    if (emit) {
      root.dispatchEvent(
        new CustomEvent("blora-change", {
          bubbles: true,
          detail: { value: root.dataset.value, item },
        }),
      );
    }
  };

  items.forEach((item) => {
    item.setAttribute("role", "radio");
    const disabled =
      item.classList.contains("is-disabled") || item.getAttribute("aria-disabled") === "true";
    item.setAttribute(
      "aria-checked",
      String(item.classList.contains("is-active") || item.hasAttribute("data-active")),
    );
    item.tabIndex = disabled
      ? -1
      : item.classList.contains("is-active") || item.hasAttribute("data-active")
        ? 0
        : -1;
    item.addEventListener("click", () => activate(item));
  });

  const onKey = (e: KeyboardEvent) => {
    const candidates = enabled();
    if (!candidates.length) return;
    const doc = root.ownerDocument;
    const current = candidates.indexOf(doc.activeElement as HTMLElement);
    let next = current < 0 ? 0 : current;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (next + 1) % candidates.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (next - 1 + candidates.length) % candidates.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = candidates.length - 1;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate(doc.activeElement as HTMLElement);
      return;
    } else return;
    e.preventDefault();
    activate(candidates[next]!, true);
  };

  root.addEventListener("keydown", onKey);
  const onResize = () => {
    const cur = items.find(
      (i) => i.classList.contains("is-active") || i.hasAttribute("data-active"),
    );
    if (cur) moveIndicator(cur);
  };
  win.addEventListener("resize", onResize);

  const active =
    items.find((i) => i.classList.contains("is-active") || i.hasAttribute("data-active")) ||
    enabled()[0];
  if (active) {
    activate(active, false, false);
    win.requestAnimationFrame(() => moveIndicator(active));
  }

  return {
    destroy() {
      root.removeEventListener("keydown", onKey);
      win.removeEventListener("resize", onResize);
    },
  };
}
