/**
 * Blora Design 2.0 - Dock controller
 * Sets active state on dock item click.
 */
export interface DockController {
  destroy(): void;
}

export function createDockController(root: HTMLElement): DockController {
  const items = root.querySelectorAll<HTMLElement>(".blora-dock__item");

  const onClick = (e: MouseEvent) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>(".blora-dock__item");
    if (!item) return;
    e.preventDefault();
    items.forEach((it) => it.removeAttribute("data-active"));
    item.setAttribute("data-active", "");
  };

  root.addEventListener("click", onClick);

  return {
    destroy() {
      root.removeEventListener("click", onClick);
    },
  };
}

/**
 * Blora Design 2.0 - Megamenu controller
 * Toggles panel open/closed on trigger click.
 */
export interface MegamenuController {
  destroy(): void;
}

export function createMegamenuController(root: HTMLElement): MegamenuController {
  const trigger = root.querySelector<HTMLElement>(".blora-megamenu__trigger");
  const panel = root.querySelector<HTMLElement>(".blora-megamenu__panel");
  if (!trigger || !panel) return { destroy: () => {} };

  const toggle = (e: MouseEvent) => {
    e.stopPropagation();
    if (panel!.hasAttribute("data-open")) panel!.removeAttribute("data-open");
    else panel!.setAttribute("data-open", "");
  };

  const close = () => panel!.removeAttribute("data-open");

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  trigger.addEventListener("click", toggle);
  document.addEventListener("click", close);
  document.addEventListener("keydown", onKey);

  return {
    destroy() {
      trigger.removeEventListener("click", toggle);
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    },
  };
}

/**
 * Blora Design 2.0 - Speed Dial controller
 * Expands/collapses action buttons on trigger click.
 */
export interface SpeedDialController {
  destroy(): void;
}

export function createSpeedDialController(root: HTMLElement): SpeedDialController {
  const trigger = root.querySelector<HTMLElement>(".blora-speed-dial__trigger");
  const closeBtn = root.querySelector<HTMLElement>(".blora-speed-dial__close");
  if (!trigger) return { destroy: () => {} };

  const toggle = (e: MouseEvent) => {
    e.stopPropagation();
    if (root.hasAttribute("data-open")) root.removeAttribute("data-open");
    else root.setAttribute("data-open", "");
  };

  const close = () => root.removeAttribute("data-open");

  const onAction = (e: MouseEvent) => {
    const action = (e.target as HTMLElement).closest(".blora-speed-dial__action");
    if (action) close();
  };

  const onDocClick = () => close();

  trigger.addEventListener("click", toggle);
  closeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    close();
  });
  root.addEventListener("click", onAction);
  document.addEventListener("click", onDocClick);

  return {
    destroy() {
      trigger.removeEventListener("click", toggle);
      root.removeEventListener("click", onAction);
      document.removeEventListener("click", onDocClick);
    },
  };
}
