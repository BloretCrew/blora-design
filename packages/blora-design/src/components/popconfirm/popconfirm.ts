/**
 * Popconfirm: confirm before action.
 */
export interface PopconfirmController {
  destroy(): void;
}

export function createPopconfirmController(root: HTMLElement): PopconfirmController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const trigger =
    root.querySelector<HTMLElement>(
      "[data-blora-popconfirm-trigger], .blora-popconfirm__trigger",
    ) || root.querySelector<HTMLElement>("button");
  const panel = root.querySelector<HTMLElement>(".blora-popconfirm__panel");
  if (!trigger || !panel) return { destroy: () => {} };

  const setOpen = (open: boolean) => {
    if (open) {
      root.setAttribute("data-open", "");
      root.classList.add("is-open");
    } else {
      root.removeAttribute("data-open");
      root.classList.remove("is-open");
    }
  };

  const onTrigger = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(!root.hasAttribute("data-open"));
  };
  const onPanel = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-confirm], [data-blora-confirm]")) {
      root.dispatchEvent(new CustomEvent("blora-confirm", { bubbles: true }));
      setOpen(false);
    }
    if (t.closest("[data-cancel], [data-blora-cancel], [data-blora-close]")) setOpen(false);
  };
  const onDoc = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) setOpen(false);
  };

  trigger.addEventListener("click", onTrigger);
  panel.addEventListener("click", onPanel);
  root.ownerDocument.addEventListener("click", onDoc);

  return {
    destroy() {
      trigger.removeEventListener("click", onTrigger);
      panel.removeEventListener("click", onPanel);
      root.ownerDocument.removeEventListener("click", onDoc);
    },
  };
}
