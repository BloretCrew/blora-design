/**
 * Blora Design 2.0 - Speed Dial controller
 * Stays in core (product decision). Baseline: v1 initSpeedDial.
 */

export interface SpeedDialController {
  open(): void;
  close(): void;
  destroy(): void;
}

/** v1 initSpeedDial parity: menu roles, keyboard, outside close. */
export function createSpeedDialController(root: HTMLElement): SpeedDialController {
  if (typeof document === "undefined") {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }

  const doc = root.ownerDocument;
  const trigger = root.querySelector<HTMLElement>(
    "[data-blora-speed-dial-trigger], .blora-speed-dial__trigger",
  );
  const actions = root.querySelector<HTMLElement>(".blora-speed-dial__actions");
  const closeBtn = root.querySelector<HTMLElement>(
    "[data-blora-speed-dial-close], .blora-speed-dial__close",
  );
  const mainBtn = root.querySelector<HTMLElement>(
    "[data-blora-speed-dial-main], .blora-speed-dial__main",
  );
  if (!trigger || !actions) {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }

  const actionItems = Array.from(
    actions.querySelectorAll<HTMLElement>(".blora-speed-dial__action"),
  );

  if (!actions.id) {
    actions.id = `blora-sd-actions-${Math.random().toString(36).slice(2, 9)}`;
  }

  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", actions.id);
  actions.setAttribute("role", "menu");
  actions.setAttribute("aria-hidden", "true");
  actionItems.forEach((action) => {
    action.setAttribute("role", "menuitem");
    action.setAttribute("tabindex", "-1");
  });
  closeBtn?.setAttribute("tabindex", "-1");
  closeBtn?.setAttribute("aria-hidden", "true");
  mainBtn?.setAttribute("tabindex", "-1");
  mainBtn?.setAttribute("aria-hidden", "true");

  const setOpen = (open: boolean, focus = false) => {
    if (open) {
      root.setAttribute("data-open", "");
      root.classList.add("is-open");
    } else {
      root.removeAttribute("data-open");
      root.classList.remove("is-open");
    }
    trigger.setAttribute("aria-expanded", String(open));
    actions.setAttribute("aria-hidden", String(!open));
    closeBtn?.setAttribute("aria-hidden", String(!open));
    if (mainBtn) {
      mainBtn.setAttribute("aria-hidden", String(!open));
      mainBtn.setAttribute("tabindex", open ? "0" : "-1");
    }
    actionItems.forEach((action) => action.setAttribute("tabindex", open ? "0" : "-1"));
    if (open && focus) {
      (mainBtn ?? actionItems[0])?.focus();
    }
    if (!open) {
      actionItems.forEach((action) => action.setAttribute("tabindex", "-1"));
    }
  };

  const onTriggerClick = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(!root.hasAttribute("data-open"));
  };

  const onTriggerKey = (e: KeyboardEvent) => {
    if (
      e.key === "ArrowDown" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      e.preventDefault();
      setOpen(true, true);
    }
  };

  const onDialKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && root.hasAttribute("data-open")) {
      e.preventDefault();
      setOpen(false);
      trigger.focus();
      return;
    }
    if (!root.hasAttribute("data-open")) return;
    const focusables = mainBtn ? [mainBtn, ...actionItems] : actionItems;
    const index = focusables.indexOf(e.target as HTMLElement);
    if (index < 0) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      focusables[(index + 1) % focusables.length]?.focus();
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      focusables[(index - 1 + focusables.length) % focusables.length]?.focus();
    }
    if (e.key === "Home") {
      e.preventDefault();
      focusables[0]?.focus();
    }
    if (e.key === "End") {
      e.preventDefault();
      focusables[focusables.length - 1]?.focus();
    }
  };

  const onActionsClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(".blora-speed-dial__action")) setOpen(false);
  };

  const onDocClick = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) setOpen(false);
  };

  const onClose = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    trigger.focus();
  };

  trigger.addEventListener("click", onTriggerClick);
  trigger.addEventListener("keydown", onTriggerKey);
  root.addEventListener("keydown", onDialKey);
  actions.addEventListener("click", onActionsClick);
  closeBtn?.addEventListener("click", onClose);
  mainBtn?.addEventListener("click", onClose);
  doc.addEventListener("click", onDocClick);

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    destroy() {
      trigger.removeEventListener("click", onTriggerClick);
      trigger.removeEventListener("keydown", onTriggerKey);
      root.removeEventListener("keydown", onDialKey);
      actions.removeEventListener("click", onActionsClick);
      closeBtn?.removeEventListener("click", onClose);
      mainBtn?.removeEventListener("click", onClose);
      doc.removeEventListener("click", onDocClick);
    },
  };
}
