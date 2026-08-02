/**
 * Blora Design 2.0 - Megamenu controller
 * Stays in core (product decision). Baseline: v1 initMegamenu.
 */

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
      doc
        .querySelectorAll<HTMLElement>(
          "[data-blora-megamenu][data-open], .blora-megamenu[data-open]",
        )
        .forEach((other) => {
          if (other === root) return;
          other.removeAttribute("data-open");
          other.classList.remove("is-open");
          const ot = other.querySelector<HTMLElement>(
            "[data-blora-megamenu-trigger], .blora-megamenu__trigger",
          );
          ot?.setAttribute("aria-expanded", "false");
        });
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
