/**
 * Blora Design 2.0 - Dock controller only.
 * Megamenu → components/megamenu; Speed Dial → components/speed-dial.
 */

export interface DockController {
  destroy(): void;
}

/**
 * Dock: active state + sliding indicator (segmented-style).
 */
export function createDockController(root: HTMLElement): DockController {
  const items = Array.from(root.querySelectorAll<HTMLElement>(".blora-dock__item"));
  if (!items.length) return { destroy: () => {} };

  let indicator = root.querySelector<HTMLElement>(".blora-dock__indicator");
  if (!indicator) {
    indicator = document.createElement("span");
    indicator.className = "blora-dock__indicator";
    indicator.setAttribute("aria-hidden", "true");
    root.insertBefore(indicator, root.firstChild);
  }

  const moveIndicator = (item: HTMLElement | null) => {
    if (!item || !indicator) {
      indicator!.style.opacity = "0";
      return;
    }
    const rootRect = root.getBoundingClientRect();
    const r = item.getBoundingClientRect();
    const left = r.left - rootRect.left + root.scrollLeft;
    indicator.style.opacity = "1";
    indicator.style.width = `${r.width}px`;
    indicator.style.height = `${r.height}px`;
    indicator.style.transform = `translate(${left}px, ${r.top - rootRect.top}px)`;
  };

  const setActive = (item: HTMLElement) => {
    items.forEach((it) => it.removeAttribute("data-active"));
    item.setAttribute("data-active", "");
    moveIndicator(item);
  };

  const onClick = (e: MouseEvent) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>(".blora-dock__item");
    if (!item || !root.contains(item)) return;
    e.preventDefault();
    setActive(item);
  };

  const active = items.find((it) => it.hasAttribute("data-active")) ?? items[0];
  // Measure after layout (Storybook/fonts) so indicator is correct without a click
  if (active) {
    setActive(active);
    requestAnimationFrame(() => {
      moveIndicator(active);
      requestAnimationFrame(() => moveIndicator(active));
    });
  }

  root.addEventListener("click", onClick);
  const onResize = () => {
    const cur = items.find((it) => it.hasAttribute("data-active"));
    if (cur) moveIndicator(cur);
  };
  window.addEventListener("resize", onResize);
  // Fonts can change item width after first paint
  void document.fonts?.ready?.then?.(onResize);

  return {
    destroy() {
      root.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    },
  };
}
