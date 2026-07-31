/**
 * Blora Design 2.0 - Dropdown controller
 *
 * Spec §16.2: Dropdown with toggle, outside-click, and Escape close.
 * Ported from v1 initDropdown, adapted as a destroyable headless controller.
 *
 * The CSS-only base works without this controller (set `data-open` on the
 * root manually). The controller adds proper ARIA, outside-click, Escape,
 * and item-click-to-close behavior.
 */

export interface DropdownController {
  /** Open the dropdown. */
  open(): void;
  /** Close the dropdown. */
  close(): void;
  /** Toggle open/closed state. */
  toggle(): void;
  /** Destroy the controller, removing all listeners. */
  destroy(): void;
}

/**
 * Create a dropdown controller on a `.blora-dropdown` root element.
 *
 * Expected markup:
 * ```html
 * <div class="blora-dropdown">
 *   <button data-dropdown-trigger>Trigger</button>
 *   <div class="blora-dropdown__menu">...</div>
 * </div>
 * ```
 *
 * - Toggles `data-open` on the root element.
 * - Closes on outside click (document click).
 * - Closes on Escape key.
 * - Closes when a `.blora-dropdown__item` is clicked.
 * - Sets `aria-haspopup` and syncs `aria-expanded` on the trigger.
 * - Cleans up all listeners on `destroy()`.
 */
export function createDropdownController(root: HTMLElement): DropdownController {
  const abortController = new AbortController();
  const { signal } = abortController;

  const triggerEl = root.querySelector<HTMLElement>("[data-dropdown-trigger]");
  const menuEl = root.querySelector<HTMLElement>(".blora-dropdown__menu");

  if (!triggerEl || !menuEl) {
    return {
      open: () => {},
      close: () => {},
      toggle: () => {},
      destroy: () => {},
    };
  }
  const trigger: HTMLElement = triggerEl;
  const menu: HTMLElement = menuEl;

  // --- ARIA setup ---
  trigger.setAttribute("aria-haspopup", "menu");
  if (!trigger.id) {
    trigger.id = `blora-dropdown-trigger-${Math.random().toString(36).slice(2, 9)}`;
  }
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-labelledby", trigger.id);

  function isOpen(): boolean {
    return root.hasAttribute("data-open");
  }

  function syncAria(): void {
    trigger.setAttribute("aria-expanded", String(isOpen()));
    menu.setAttribute("aria-hidden", String(!isOpen()));
  }

  function open(): void {
    root.setAttribute("data-open", "");
    syncAria();
  }

  function close(): void {
    root.removeAttribute("data-open");
    syncAria();
  }

  function toggle(): void {
    if (isOpen()) {
      close();
    } else {
      open();
    }
  }

  // --- Trigger click: toggle ---
  trigger.addEventListener(
    "click",
    (event: Event) => {
      event.stopPropagation();
      toggle();
    },
    { signal },
  );

  // --- Item click: close ---
  menu.addEventListener(
    "click",
    (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".blora-dropdown__item")) {
        close();
      }
    },
    { signal },
  );

  // --- Escape: close ---
  root.addEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen()) {
        event.stopPropagation();
        close();
        trigger.focus();
      }
    },
    { signal },
  );

  // --- Outside click: close ---
  document.addEventListener(
    "click",
    () => {
      if (isOpen()) {
        close();
      }
    },
    { signal },
  );

  // --- Initial ARIA state ---
  syncAria();

  return { open, close, toggle, destroy: () => abortController.abort() };
}
