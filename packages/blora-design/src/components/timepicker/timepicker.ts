/**
 * Blora Design 2.0 - Timepicker controller
 * Baseline: v1 initTimePicker + custom wheel panel.
 */

import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_TIMEPICKER_TAG = "blora-timepicker";

export interface TimepickerController {
  destroy(): void;
}

export function createTimepickerController(root: HTMLElement): TimepickerController {
  const input = root.querySelector<HTMLInputElement>("input");
  const btn = root.querySelector<HTMLButtonElement>(
    ".blora-timepicker__btn, .blora-datepicker__btn",
  );
  if (!input) return { destroy: () => {} };

  // 原生 type=time：浏览器约束输入与分段编辑（选区为系统 Highlight，无法可靠主题化）
  if (input.type !== "time") {
    input.type = "time";
  }

  let curH = 14;
  let curM = 30;
  let ignoreDocClick = false;
  let panel = root.querySelector<HTMLElement>(".blora-timepicker__panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.className = "blora-timepicker__panel";
    root.appendChild(panel);
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const fmtT = () => pad(curH) + ":" + pad(curM);
  /** How many full value cycles are rendered for infinite scroll */
  const COPIES = 5;
  const MID = Math.floor(COPIES / 2);
  const ITEM_H = 36; // keep in sync with CSS --blora-tp-item

  type WheelClean = () => void;
  const wheelCleans: WheelClean[] = [];

  const syncFromInput = () => {
    if (input.value) {
      const parts = input.value.split(":");
      if (parts.length >= 2) {
        curH = Math.min(23, Math.max(0, Number(parts[0]) || 0));
        curM = Math.min(59, Math.max(0, Number(parts[1]) || 0));
      }
    }
  };

  const paintSelected = (scroll: HTMLElement, value: number) => {
    scroll.querySelectorAll(".blora-timepicker__item").forEach((node) => {
      const el = node as HTMLElement;
      const v = Number(el.dataset.val);
      el.toggleAttribute("data-selected", v === value);
    });
  };

  const scrollToValue = (scroll: HTMLElement, value: number, max: number, smooth = false) => {
    // With padding-block, scrollTop = index * ITEM_H centers that item
    const index = MID * max + (((value % max) + max) % max);
    const top = index * ITEM_H;
    if (smooth) scroll.scrollTo({ top, behavior: "smooth" });
    else scroll.scrollTop = top;
    paintSelected(scroll, ((value % max) + max) % max);
  };

  const valueFromScroll = (scroll: HTMLElement, max: number) => {
    const raw = Math.round(scroll.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(raw, COPIES * max - 1));
    return ((clamped % max) + max) % max;
  };

  const wireWheel = (
    scroll: HTMLElement,
    max: number,
    get: () => number,
    set: (v: number) => void,
  ) => {
    let ticking = false;
    let settling: ReturnType<typeof setTimeout> | null = null;
    let jumping = false;

    const normalize = () => {
      const copyH = max * ITEM_H;
      if (copyH <= 0) return;
      // Keep scroll in the middle copies so looping feels infinite
      if (scroll.scrollTop < copyH * 1.1) {
        jumping = true;
        scroll.scrollTop += copyH;
        jumping = false;
      } else if (scroll.scrollTop > copyH * (COPIES - 2.1)) {
        jumping = true;
        scroll.scrollTop -= copyH;
        jumping = false;
      }
    };

    const settle = () => {
      if (jumping) return;
      normalize();
      const v = valueFromScroll(scroll, max);
      set(v);
      // Snap to nearest item center within current copy band
      const curCopy = Math.floor((scroll.scrollTop + ITEM_H / 2) / (max * ITEM_H));
      const copy = Math.min(COPIES - 1, Math.max(0, curCopy));
      const target = (copy * max + v) * ITEM_H;
      if (Math.abs(scroll.scrollTop - target) > 0.5) {
        jumping = true;
        scroll.scrollTop = target;
        jumping = false;
      }
      paintSelected(scroll, v);
    };

    const onScroll = () => {
      if (jumping) return;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          if (jumping) return;
          normalize();
          const v = valueFromScroll(scroll, max);
          set(v);
          paintSelected(scroll, v);
        });
      }
      if (settling) clearTimeout(settling);
      settling = setTimeout(settle, 90);
    };

    const onClick = (e: MouseEvent) => {
      // Ignore click that ends a drag
      if (dragMoved) {
        dragMoved = false;
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const item = (e.target as HTMLElement).closest<HTMLElement>(".blora-timepicker__item");
      if (!item || !scroll.contains(item)) return;
      e.stopPropagation();
      const v = Number(item.dataset.val);
      set(v);
      const curCopy = Math.floor((scroll.scrollTop + ITEM_H / 2) / (max * ITEM_H));
      const copy = Math.min(COPIES - 1, Math.max(0, curCopy));
      const top = (copy * max + v) * ITEM_H;
      scroll.scrollTo({ top, behavior: "smooth" });
      paintSelected(scroll, v);
    };

    // Mouse / touch drag to scroll the wheel
    let dragging = false;
    let dragMoved = false;
    let dragStartY = 0;
    let dragStartScroll = 0;
    let dragPointerId = -1;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      dragMoved = false;
      dragStartY = e.clientY;
      dragStartScroll = scroll.scrollTop;
      dragPointerId = e.pointerId;
      scroll.setPointerCapture?.(e.pointerId);
      scroll.classList.add("is-dragging");
      // Disable snap while dragging for smooth follow
      scroll.style.scrollSnapType = "none";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragPointerId) return;
      const dy = e.clientY - dragStartY;
      if (Math.abs(dy) > 3) dragMoved = true;
      // Drag finger up → content moves up → scrollTop increases
      scroll.scrollTop = dragStartScroll - dy;
      e.preventDefault();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragPointerId) return;
      dragging = false;
      dragPointerId = -1;
      try {
        scroll.releasePointerCapture?.(e.pointerId);
      } catch {
        /* ignore */
      }
      scroll.classList.remove("is-dragging");
      scroll.style.scrollSnapType = "";
      settle();
    };

    scroll.addEventListener("scroll", onScroll, { passive: true });
    scroll.addEventListener("click", onClick);
    scroll.addEventListener("pointerdown", onPointerDown);
    scroll.addEventListener("pointermove", onPointerMove);
    scroll.addEventListener("pointerup", onPointerUp);
    scroll.addEventListener("pointercancel", onPointerUp);
    scrollToValue(scroll, get(), max, false);

    wheelCleans.push(() => {
      scroll.removeEventListener("scroll", onScroll);
      scroll.removeEventListener("click", onClick);
      scroll.removeEventListener("pointerdown", onPointerDown);
      scroll.removeEventListener("pointermove", onPointerMove);
      scroll.removeEventListener("pointerup", onPointerUp);
      scroll.removeEventListener("pointercancel", onPointerUp);
      if (settling) clearTimeout(settling);
    });
  };

  const fillWheel = (scroll: HTMLElement, max: number, kind: "h" | "m") => {
    scroll.replaceChildren();
    for (let c = 0; c < COPIES; c++) {
      for (let i = 0; i < max; i++) {
        const item = document.createElement("div");
        item.className = "blora-timepicker__item";
        item.dataset.val = String(i);
        item.dataset.kind = kind;
        item.textContent = pad(i);
        scroll.appendChild(item);
      }
    }
  };

  const render = () => {
    // tear down previous wheel listeners
    while (wheelCleans.length) wheelCleans.pop()?.();

    panel!.replaceChildren();

    const wheel = document.createElement("div");
    wheel.className = "blora-timepicker__wheel";

    const highlight = document.createElement("div");
    highlight.className = "blora-timepicker__highlight";
    highlight.setAttribute("aria-hidden", "true");

    const cols = document.createElement("div");
    cols.className = "blora-timepicker__cols";

    const hScroll = document.createElement("div");
    hScroll.className = "blora-timepicker__scroll";
    hScroll.setAttribute("data-scroll", "h");
    hScroll.setAttribute("role", "listbox");
    hScroll.setAttribute("aria-label", t("timepicker.hour"));
    fillWheel(hScroll, 24, "h");

    const sep = document.createElement("span");
    sep.className = "blora-timepicker__sep";
    sep.textContent = ":";
    sep.setAttribute("aria-hidden", "true");

    const mScroll = document.createElement("div");
    mScroll.className = "blora-timepicker__scroll";
    mScroll.setAttribute("data-scroll", "m");
    mScroll.setAttribute("role", "listbox");
    mScroll.setAttribute("aria-label", t("timepicker.minute"));
    fillWheel(mScroll, 60, "m");

    cols.append(hScroll, sep, mScroll);
    wheel.append(highlight, cols);
    panel!.appendChild(wheel);

    const foot = document.createElement("div");
    foot.className = "blora-datepicker__foot";
    const nowBtn = document.createElement("button");
    nowBtn.type = "button";
    nowBtn.className = "blora-button";
    nowBtn.setAttribute("data-variant", "ghost");
    nowBtn.setAttribute("data-size", "sm");
    nowBtn.setAttribute("data-now", "");
    nowBtn.textContent = t("common.now");
    const okBtn = document.createElement("button");
    okBtn.type = "button";
    okBtn.className = "blora-button";
    okBtn.setAttribute("data-variant", "ghost");
    okBtn.setAttribute("data-size", "sm");
    okBtn.setAttribute("data-confirm", "");
    okBtn.textContent = t("common.confirm");
    foot.append(nowBtn, okBtn);
    panel!.appendChild(foot);

    requestAnimationFrame(() => {
      wireWheel(
        hScroll,
        24,
        () => curH,
        (v) => {
          curH = v;
        },
      );
      wireWheel(
        mScroll,
        60,
        () => curM,
        (v) => {
          curM = v;
        },
      );
    });
  };

  const open = () => {
    syncFromInput();
    panel!.setAttribute("data-open", "");
    root.style.zIndex = "var(--blora-z-dropdown)";
    render();
  };
  const close = () => {
    panel!.removeAttribute("data-open");
    root.style.zIndex = "";
    while (wheelCleans.length) wheelCleans.pop()?.();
  };
  const update = () => {
    input.value = fmtT();
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const onBtn = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (panel!.hasAttribute("data-open")) {
      close();
    } else {
      ignoreDocClick = true;
      open();
      queueMicrotask(() => {
        ignoreDocClick = false;
      });
    }
  };
  const onDoc = (e: MouseEvent) => {
    if (!panel!.hasAttribute("data-open") || ignoreDocClick) return;
    const t = e.target as Node | null;
    if (t && !t.isConnected) return;
    if (t && root.contains(t)) return;
    close();
  };
  const onPanel = (e: MouseEvent) => {
    e.stopPropagation();
    const t = e.target as HTMLElement;
    if (t.closest("[data-now]")) {
      const d = new Date();
      curH = d.getHours();
      curM = d.getMinutes();
      update();
      close();
      return;
    }
    if (t.closest("[data-confirm]")) {
      update();
      close();
    }
  };

  btn?.addEventListener("click", onBtn);
  panel.addEventListener("click", onPanel);
  document.addEventListener("click", onDoc);

  return {
    destroy() {
      btn?.removeEventListener("click", onBtn);
      panel!.removeEventListener("click", onPanel);
      document.removeEventListener("click", onDoc);
      while (wheelCleans.length) wheelCleans.pop()?.();
    },
  };
}

/** Composite CE that generates the supported time field and wheel trigger. */
export class BloraTimepicker extends BloraElement {
  private controller: TimepickerController | null = null;

  static get observedAttributes(): string[] {
    return ["value", "placeholder", "name", "disabled", "required", "step"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal) return;
    this.sync();
  }

  get value(): string {
    return this.querySelector<HTMLInputElement>(".blora-input")?.value ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  focus(options?: FocusOptions): void {
    this.querySelector<HTMLInputElement>(".blora-input")?.focus(options);
  }

  protected render(): void {
    const root = document.createElement("div");
    root.className = "blora-timepicker";
    root.dataset.bloraTimepicker = "";
    root.dataset.bloraGenerated = "";

    const input = document.createElement("input");
    input.className = "blora-input";
    input.type = "time";
    input.value = this.getAttribute("value") ?? "";
    input.placeholder = this.getAttribute("placeholder") ?? "HH:MM";
    input.disabled = this.hasAttribute("disabled");
    input.required = this.hasAttribute("required");
    if (this.hasAttribute("name")) input.name = this.getAttribute("name") ?? "";
    if (this.hasAttribute("step")) input.step = this.getAttribute("step") ?? "60";

    const button = document.createElement("button");
    button.className = "blora-timepicker__btn";
    button.type = "button";
    button.tabIndex = -1;
    button.disabled = input.disabled;
    button.setAttribute("aria-label", t("timepicker.pick"));
    button.appendChild(createBloraIcon("clock"));

    root.append(input, button);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const input = this.querySelector<HTMLInputElement>(".blora-input");
    if (!input) return;
    if (document.activeElement !== input) input.value = this.getAttribute("value") ?? input.value;
    input.placeholder = this.getAttribute("placeholder") ?? "HH:MM";
    input.disabled = this.hasAttribute("disabled");
    input.required = this.hasAttribute("required");
    if (this.hasAttribute("name")) input.name = this.getAttribute("name") ?? "";
    if (this.hasAttribute("step")) input.step = this.getAttribute("step") ?? "60";
    const button = this.querySelector<HTMLButtonElement>(".blora-timepicker__btn");
    if (button) button.disabled = input.disabled;
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-timepicker");
    this.controller?.destroy();
    this.controller = root ? createTimepickerController(root) : null;
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraTimepicker(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_TIMEPICKER_TAG)) return;
  registry.define(BLORA_TIMEPICKER_TAG, BloraTimepicker);
}
