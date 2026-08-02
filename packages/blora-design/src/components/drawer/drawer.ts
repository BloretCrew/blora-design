/**
 * Drawer open/close with enter/leave animations.
 */
export interface DrawerController {
  open(): void;
  close(): void;
  destroy(): void;
}

export function createDrawerController(root: HTMLElement): DrawerController {
  if (typeof document === "undefined") {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }
  const doc = root.ownerDocument;
  const panel = root.querySelector<HTMLElement>(".blora-drawer__panel");
  const mask = root.querySelector<HTMLElement>(".blora-drawer__mask");
  let closing = false;
  let closeTimer = 0;

  const clearLeaving = () => {
    root.classList.remove("is-leaving");
    mask?.classList.remove("is-leaving");
    panel?.classList.remove("is-leaving");
  };

  const setOpen = (open: boolean) => {
    if (open) {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = 0;
      }
      closing = false;
      clearLeaving();
      root.setAttribute("data-open", "");
      root.setAttribute("open", "");
      root.classList.add("is-open");
      panel?.setAttribute("tabindex", "-1");
      panel?.focus({ preventScroll: true });
      return;
    }
    if (closing) return;
    if (
      !root.hasAttribute("data-open") &&
      !root.classList.contains("is-open") &&
      !root.hasAttribute("open")
    ) {
      return;
    }
    closing = true;
    root.classList.add("is-leaving");
    mask?.classList.add("is-leaving");
    panel?.classList.add("is-leaving");

    const finish = () => {
      if (!closing) return;
      root.removeAttribute("data-open");
      root.removeAttribute("open");
      root.classList.remove("is-open");
      clearLeaving();
      closing = false;
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = 0;
      }
      panel?.removeEventListener("animationend", onEnd);
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target !== panel && e.target !== mask) return;
      finish();
    };
    panel?.addEventListener("animationend", onEnd);
    /* Fallback if animation disabled / reduced motion */
    closeTimer = window.setTimeout(finish, 400);
  };

  const onClick = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-blora-close]") || t.classList.contains("blora-drawer__mask")) {
      setOpen(false);
    }
  };
  const onKey = (e: KeyboardEvent) => {
    if (
      e.key === "Escape" &&
      (root.hasAttribute("data-open") ||
        root.classList.contains("is-open") ||
        root.hasAttribute("open"))
    ) {
      setOpen(false);
    }
  };

  root.addEventListener("click", onClick);
  doc.addEventListener("keydown", onKey);

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    destroy() {
      root.removeEventListener("click", onClick);
      doc.removeEventListener("keydown", onKey);
    },
  };
}

/** Bind buttons [data-blora-drawer-open="id"] to drawers by id. */
export function bindDrawerTriggers(root: ParentNode = document): () => void {
  if (typeof document === "undefined") return () => {};
  const handlers: Array<() => void> = [];
  root.querySelectorAll<HTMLElement>("[data-blora-drawer-open]").forEach((btn) => {
    const id = btn.getAttribute("data-blora-drawer-open");
    if (!id) return;
    const onClick = () => {
      const drawer = document.getElementById(id);
      if (!drawer) return;
      /* Prefer existing controller if story attached one */
      const any = drawer as HTMLElement & { __ctrl?: { open: () => void } };
      if (any.__ctrl?.open) any.__ctrl.open();
      else {
        drawer.setAttribute("data-open", "");
        drawer.setAttribute("open", "");
        drawer.classList.add("is-open");
      }
    };
    btn.addEventListener("click", onClick);
    handlers.push(() => btn.removeEventListener("click", onClick));
  });
  return () => handlers.forEach((h) => h());
}
