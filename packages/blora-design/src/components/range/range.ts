/**
 * Blora Design 2.0 - Range controller (dual-thumb range slider)
 * Makes two custom thumb divs draggable along a track.
 */
export interface RangeController {
  destroy(): void;
}

export function createRangeController(root: HTMLElement): RangeController {
  const track = root.querySelector<HTMLElement>(".blora-range__track");
  const fill = root.querySelector<HTMLElement>(".blora-range__fill");
  const thumbs = Array.from(root.querySelectorAll<HTMLElement>(".blora-range__thumb"));
  const valueDisplay = root.querySelector<HTMLElement>(".blora-range__value");

  if (!track || thumbs.length < 2) return { destroy: () => {} };

  const min = Number(root.dataset.min ?? 0);
  const max = Number(root.dataset.max ?? 100);

  const valueToPct = (v: number) => ((v - min) / (max - min)) * 100;

  const update = () => {
    const vals = thumbs.map((t) => Number(t.dataset.val ?? min));
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const loPct = valueToPct(lo);
    const hiPct = valueToPct(hi);
    thumbs.forEach((t) => {
      const v = Number(t.dataset.val ?? min);
      t.style.left = `${valueToPct(v)}%`;
    });
    if (fill) {
      fill.style.left = `${loPct}%`;
      fill.style.width = `${hiPct - loPct}%`;
    }
    if (valueDisplay) valueDisplay.textContent = `${lo} – ${hi}`;
  };

  const cleanupFns: (() => void)[] = [];

  thumbs.forEach((thumb) => {
    let dragging = false;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      thumb.setPointerCapture(e.pointerId);
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const rect = track.getBoundingClientRect();
      let pct = ((e.clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      const val = Math.round(min + (pct / 100) * (max - min));

      // Prevent thumbs from crossing
      const idx = thumbs.indexOf(thumb);
      const otherVal = Number(thumbs[1 - idx]!.dataset.val ?? min);
      if (idx === 0 && val > otherVal) return;
      if (idx === 1 && val < otherVal) return;

      thumb.dataset.val = String(val);
      update();
    };

    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      try {
        thumb.releasePointerCapture(e.pointerId);
      } catch {
        // noop
      }
    };

    thumb.addEventListener("pointerdown", onPointerDown);
    thumb.addEventListener("pointermove", onPointerMove);
    thumb.addEventListener("pointerup", onPointerUp);

    cleanupFns.push(() => {
      thumb.removeEventListener("pointerdown", onPointerDown);
      thumb.removeEventListener("pointermove", onPointerMove);
      thumb.removeEventListener("pointerup", onPointerUp);
    });
  });

  update();

  return {
    destroy() {
      cleanupFns.forEach((fn) => fn());
    },
  };
}
