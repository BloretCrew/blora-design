/**
 * Drawer open/close (v1 openDrawer/closeDrawer simplified, data-open + is-open).
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

  const setOpen = (open: boolean) => {
    if (open) {
      root.setAttribute("data-open", "");
      root.setAttribute("open", "");
      root.classList.add("is-open");
      panel?.setAttribute("tabindex", "-1");
      panel?.focus();
    } else {
      root.removeAttribute("data-open");
      root.removeAttribute("open");
      root.classList.remove("is-open");
    }
  };

  const onClick = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-blora-close]") || t.classList.contains("blora-drawer__mask")) {
      setOpen(false);
    }
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && (root.hasAttribute("data-open") || root.classList.contains("is-open") || root.hasAttribute("open"))) {
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
      drawer.setAttribute("data-open", "");
      drawer.setAttribute("open", "");
      drawer.classList.add("is-open");
    };
    btn.addEventListener("click", onClick);
    handlers.push(() => btn.removeEventListener("click", onClick));
  });
  return () => handlers.forEach((h) => h());
}
