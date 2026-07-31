/**
 * Blora Design 2.0 - Splitter controller
 * Draggable divider to resize two panes.
 */
export interface SplitterController {
  destroy(): void;
}

export function createSplitterController(root: HTMLElement): SplitterController {
  const panes = Array.from(root.querySelectorAll<HTMLElement>(".blora-splitter__pane"));
  if (panes.length < 2) return { destroy: () => {} };

  // Insert a handle between panes if not present
  let handle = root.querySelector<HTMLElement>(".blora-splitter__handle");
  if (!handle) {
    handle = document.createElement("div");
    handle.className = "blora-splitter__handle";
    handle.innerHTML = '<span class="blora-splitter__grip"></span>';
    root.insertBefore(handle, panes[1]!);
  }

  const min = Number(root.dataset.min ?? 50);
  let dragging = false;

  const onDown = (e: PointerEvent) => {
    dragging = true;
    handle!.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const rect = root.getBoundingClientRect();
    let pct = ((e.clientX - rect.left) / rect.width) * 100;

    const minPct = (min / rect.width) * 100;
    pct = Math.max(minPct, Math.min(100 - minPct, pct));

    panes[0]!.style.flex = `0 0 ${pct}%`;
    panes[1]!.style.flex = "1 1 0%";
  };

  const onUp = (e: PointerEvent) => {
    dragging = false;
    try {
      handle!.releasePointerCapture(e.pointerId);
    } catch {
      // noop
    }
  };

  handle.addEventListener("pointerdown", onDown);
  handle.addEventListener("pointermove", onMove);
  handle.addEventListener("pointerup", onUp);

  return {
    destroy() {
      handle!.removeEventListener("pointerdown", onDown);
      handle!.removeEventListener("pointermove", onMove);
      handle!.removeEventListener("pointerup", onUp);
    },
  };
}
