/**
 * Blora Design 2.0 - Dock / Megamenu / Speed Dial controllers
 * Megamenu + Speed Dial stay in core (product decision 2026-08).
 * Behaviour baseline: legacy/v1/blora.js initMegamenu / initSpeedDial.
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
  if (active) setActive(active);

  root.addEventListener("click", onClick);
  const onResize = () => {
    const cur = items.find((it) => it.hasAttribute("data-active"));
    if (cur) moveIndicator(cur);
  };
  window.addEventListener("resize", onResize);

  return {
    destroy() {
      root.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    },
  };
}

export interface MegamenuController {
  open(): void;
  close(): void;
  destroy(): void;
}

/** v1 initMegamenu parity: data-open, panel fit, Escape, exclusive open. */
export function createMegamenuController(root: HTMLElement): MegamenuController {
  if (typeof document === "undefined") {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }

  const doc = root.ownerDocument;
  const win = doc.defaultView;
  const trigger =
    root.querySelector<HTMLElement>("[data-blora-megamenu-trigger], .blora-megamenu__trigger") ||
    root.querySelector<HTMLElement>("button");
  const panel = root.querySelector<HTMLElement>(".blora-megamenu__panel");
  if (!trigger || !panel || !win) {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }

  if (!panel.id) {
    panel.id = `blora-megamenu-${Math.random().toString(36).slice(2, 9)}`;
  }
  trigger.setAttribute("aria-controls", panel.id);
  trigger.setAttribute("aria-haspopup", "true");
  trigger.setAttribute("aria-expanded", "false");

  const positionPanel = () => {
    if (!root.hasAttribute("data-open")) return;
    if (win.matchMedia("(max-width: 900px)").matches) return;
    panel.style.setProperty("--blora-megamenu-offset", "0px");
    const rect = panel.getBoundingClientRect();
    const gutter =
      parseFloat(win.getComputedStyle(panel).getPropertyValue("--blora-space-4")) || 16;
    let offset = Math.min(0, win.innerWidth - gutter - rect.right);
    if (rect.left + offset < gutter) offset += gutter - (rect.left + offset);
    panel.style.setProperty("--blora-megamenu-offset", `${offset}px`);
  };

  const setOpen = (open: boolean, focus = false) => {
    if (open) {
      doc.querySelectorAll<HTMLElement>("[data-blora-megamenu][data-open], .blora-megamenu[data-open]").forEach(
        (other) => {
          if (other === root) return;
          other.removeAttribute("data-open");
          other.classList.remove("is-open");
          const ot = other.querySelector<HTMLElement>("[data-blora-megamenu-trigger], .blora-megamenu__trigger");
          ot?.setAttribute("aria-expanded", "false");
        },
      );
      root.setAttribute("data-open", "");
      root.classList.add("is-open");
    } else {
      root.removeAttribute("data-open");
      root.classList.remove("is-open");
    }
    trigger.setAttribute("aria-expanded", String(open));
    if (open) win.requestAnimationFrame(positionPanel);
    if (open && focus) {
      panel.querySelector<HTMLElement>("a, button")?.focus();
    }
  };

  const onTriggerClick = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(!root.hasAttribute("data-open"));
  };

  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true, true);
    }
  };

  const onMenuKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      trigger.focus();
    }
  };

  const onPanelClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  };

  const onDocClick = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) setOpen(false);
  };

  trigger.addEventListener("click", onTriggerClick);
  trigger.addEventListener("keydown", onTriggerKey);
  root.addEventListener("keydown", onMenuKey);
  panel.addEventListener("click", onPanelClick);
  doc.addEventListener("click", onDocClick);
  win.addEventListener("resize", positionPanel);

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    destroy() {
      trigger.removeEventListener("click", onTriggerClick);
      trigger.removeEventListener("keydown", onTriggerKey);
      root.removeEventListener("keydown", onMenuKey);
      panel.removeEventListener("click", onPanelClick);
      doc.removeEventListener("click", onDocClick);
      win.removeEventListener("resize", positionPanel);
    },
  };
}

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
