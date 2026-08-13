/**
 * Blora Design 2.0 - Range controller (dual-thumb)
 * Optional tooltip-on-drag via data-tooltip attribute (v1 default behavior).
 */
import { BloraElement } from "../../core/blora-element.js";

export const BLORA_RANGE_TAG = "blora-range";

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

/** Composite CE that owns the official dual-thumb light-DOM structure. */
export class BloraRange extends BloraElement {
  private controller: RangeController | null = null;

  static get observedAttributes(): string[] {
    return ["min", "max", "values", "tooltip"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal) return;
    this.sync();
  }

  get values(): [number, number] {
    const thumbs = this.querySelectorAll<HTMLElement>(".blora-range__thumb");
    return [Number(thumbs[0]?.dataset.val ?? 0), Number(thumbs[1]?.dataset.val ?? 100)];
  }

  set values(value: [number, number]) {
    this.setAttribute("values", value.join(","));
  }

  protected render(): void {
    const min = Number(this.getAttribute("min") ?? 0);
    const max = Number(this.getAttribute("max") ?? 100);
    const parsed = (this.getAttribute("values") ?? "20,75")
      .split(",")
      .slice(0, 2)
      .map((value) => Number(value.trim()));
    const low = Number.isFinite(parsed[0]) ? Math.max(min, Math.min(max, parsed[0]!)) : min;
    const high = Number.isFinite(parsed[1]) ? Math.max(low, Math.min(max, parsed[1]!)) : max;

    const root = document.createElement("div");
    root.className = "blora-range";
    root.dataset.bloraGenerated = "";
    root.dataset.min = String(min);
    root.dataset.max = String(max);
    if (this.getAttribute("tooltip") === "false") root.dataset.tooltip = "false";

    const track = document.createElement("div");
    track.className = "blora-range__track";
    const fill = document.createElement("div");
    fill.className = "blora-range__fill";
    track.appendChild(fill);

    const makeThumb = (value: number, label: string) => {
      const thumb = document.createElement("div");
      thumb.className = "blora-range__thumb";
      thumb.dataset.val = String(value);
      thumb.tabIndex = 0;
      thumb.setAttribute("role", "slider");
      thumb.setAttribute("aria-label", label);
      thumb.setAttribute("aria-valuemin", String(min));
      thumb.setAttribute("aria-valuemax", String(max));
      thumb.setAttribute("aria-valuenow", String(value));
      return thumb;
    };

    const value = document.createElement("span");
    value.className = "blora-range__value";
    value.textContent = `${low} – ${high}`;

    root.append(track, makeThumb(low, "最小值"), makeThumb(high, "最大值"), value);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-range");
    if (!root) return;
    const min = this.getAttribute("min");
    const max = this.getAttribute("max");
    if (min) root.dataset.min = min;
    if (max) root.dataset.max = max;
    if (this.getAttribute("tooltip") === "false") root.dataset.tooltip = "false";
    else delete root.dataset.tooltip;
    this.rebind();
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-range");
    this.controller?.destroy();
    this.controller = root ? createRangeController(root) : null;
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraRange(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_RANGE_TAG)) return;
  registry.define(BLORA_RANGE_TAG, BloraRange);
}
