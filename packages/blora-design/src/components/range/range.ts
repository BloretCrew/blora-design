/**
 * Blora Design 2.0 - Range controller (dual-thumb)
 * Optional tooltip-on-drag via data-tooltip attribute (v1 default behavior).
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
  // default true like v1; set data-tooltip="false" to disable
  const showTip = root.dataset.tooltip !== "false";

  const tips = showTip
    ? thumbs.map(() => {
        const t = document.createElement("span");
        t.className = "blora-range__tip";
        t.setAttribute("aria-hidden", "true");
        root.appendChild(t);
        return t;
      })
    : [];

  const valueToPct = (v: number) => ((v - min) / (max - min)) * 100;

  const update = () => {
    const vals = thumbs.map((t) => Number(t.dataset.val ?? min));
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const loPct = valueToPct(lo);
    const hiPct = valueToPct(hi);
    thumbs.forEach((t, i) => {
      const v = Number(t.dataset.val ?? min);
      t.style.left = `${valueToPct(v)}%`;
      if (tips[i]) {
        tips[i]!.textContent = String(v);
        tips[i]!.style.left = `${valueToPct(v)}%`;
      }
    });
    if (fill) {
      fill.style.left = `${loPct}%`;
      fill.style.width = `${hiPct - loPct}%`;
    }
    if (valueDisplay) valueDisplay.textContent = `${lo} – ${hi}`;
  };

  const cleanupFns: (() => void)[] = [];

  thumbs.forEach((thumb, i) => {
    let dragging = false;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      thumb.setPointerCapture(e.pointerId);
      if (tips[i]) tips[i]!.setAttribute("data-show", "");
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const rect = track.getBoundingClientRect();
      let pct = ((e.clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      const val = Math.round(min + (pct / 100) * (max - min));

      const idx = thumbs.indexOf(thumb);
      const otherVal = Number(thumbs[1 - idx]!.dataset.val ?? min);
      if (idx === 0 && val > otherVal) return;
      if (idx === 1 && val < otherVal) return;

      thumb.dataset.val = String(val);
      update();
    };

    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      if (tips[i]) tips[i]!.removeAttribute("data-show");
      try {
        thumb.releasePointerCapture(e.pointerId);
      } catch {
        // noop
      }
    };

    const onFocus = () => tips[i]?.setAttribute("data-show", "");
    const onBlur = () => tips[i]?.removeAttribute("data-show");

    thumb.addEventListener("pointerdown", onPointerDown);
    thumb.addEventListener("pointermove", onPointerMove);
    thumb.addEventListener("pointerup", onPointerUp);
    thumb.addEventListener("focus", onFocus);
    thumb.addEventListener("blur", onBlur);

    cleanupFns.push(() => {
      thumb.removeEventListener("pointerdown", onPointerDown);
      thumb.removeEventListener("pointermove", onPointerMove);
      thumb.removeEventListener("pointerup", onPointerUp);
      thumb.removeEventListener("focus", onFocus);
      thumb.removeEventListener("blur", onBlur);
    });
  });

  update();

  return {
    destroy() {
      cleanupFns.forEach((fn) => fn());
      tips.forEach((t) => t.remove());
    },
  };
}
