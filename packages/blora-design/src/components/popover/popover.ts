/**
 * Popover toggle (v1 simplified, no portal required).
 */
export interface PopoverController {
  open(): void;
  close(): void;
  destroy(): void;
}

export function createPopoverController(root: HTMLElement): PopoverController {
  if (typeof document === "undefined") {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }
  const trigger =
    root.querySelector<HTMLElement>("[data-blora-popover], .blora-popover__trigger") ||
    root.querySelector<HTMLElement>("button");
  const panel = root.querySelector<HTMLElement>(".blora-popover__panel");
  if (!trigger || !panel) {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }

  const doc = root.ownerDocument;
  const setOpen = (open: boolean) => {
    if (open) {
      root.setAttribute("data-open", "");
      root.classList.add("is-open");
      panel.classList.add("is-open");
    } else {
      root.removeAttribute("data-open");
      root.classList.remove("is-open");
      panel.classList.remove("is-open");
    }
    trigger.setAttribute("aria-expanded", String(open));
  };

  const onTrigger = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(!root.hasAttribute("data-open"));
  };
  const onDoc = (e: MouseEvent) => {
    if (!root.contains(e.target as Node) && !panel.contains(e.target as Node)) setOpen(false);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };
  const onClose = () => setOpen(false);

  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-expanded", "false");
  trigger.addEventListener("click", onTrigger);
  doc.addEventListener("click", onDoc);
  doc.addEventListener("keydown", onKey);
  panel.querySelectorAll("[data-blora-close]").forEach((b) => b.addEventListener("click", onClose));

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    destroy() {
      trigger.removeEventListener("click", onTrigger);
      doc.removeEventListener("click", onDoc);
      doc.removeEventListener("keydown", onKey);
    },
  };
}
