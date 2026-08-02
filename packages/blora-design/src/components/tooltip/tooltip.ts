/**
 * Tooltip: reposition bubble (v1 fitFloatingInline simplified).
 */
export interface TooltipController {
  destroy(): void;
}

export function createTooltipController(root: HTMLElement): TooltipController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const bubble = root.querySelector<HTMLElement>(".blora-tooltip__bubble");
  if (!bubble) return { destroy: () => {} };
  const win = root.ownerDocument.defaultView!;

  const position = () => {
    bubble.style.setProperty("--blora-float-shift-x", "0px");
    const rect = bubble.getBoundingClientRect();
    const gutter = 12;
    let shift = 0;
    if (rect.left < gutter) shift += gutter - rect.left;
    if (rect.right + shift > win.innerWidth - gutter) {
      shift -= rect.right + shift - (win.innerWidth - gutter);
    }
    bubble.style.setProperty("--blora-float-shift-x", `${shift}px`);
  };

  root.addEventListener("pointerenter", position);
  root.addEventListener("focusin", position);
  win.addEventListener("resize", position);

  return {
    destroy() {
      root.removeEventListener("pointerenter", position);
      root.removeEventListener("focusin", position);
      win.removeEventListener("resize", position);
    },
  };
}
