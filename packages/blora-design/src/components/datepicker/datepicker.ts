/**
 * Blora Design 2.0 - Datepicker / Timepicker controllers
 * v1 parity: native type=date / type=time field (segmented locale UI)
 * + custom Blora panel opened by the trailing icon button.
 */
export interface DatepickerController {
  destroy(): void;
}

const MONTHS = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];
const DOW = ["日", "一", "二", "三", "四", "五", "六"];

const setChevron = (el: HTMLElement, dir: "prev" | "next") => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", dir === "prev" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6");
  svg.appendChild(path);
  el.replaceChildren(svg);
};

function fmt(d: Date): string {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

function parseYMD(v: string): Date | null {
  const p = v.split("-");
  if (p.length !== 3) return null;
  const d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function createDatepickerController(root: HTMLElement): DatepickerController {
  const input = root.querySelector<HTMLInputElement>("input");
  const btn = root.querySelector<HTMLButtonElement>(".blora-datepicker__btn");
  if (!input) return { destroy: () => {} };

  // v1 uses type=date — keep it so the browser shows 年/月/日 segments
  if (input.type !== "date") {
    input.type = "date";
  }

  const min = input.min;
  const max = input.max;
  let selected: Date | null = null;
  let viewYear = new Date().getFullYear();
  let viewMonth = new Date().getMonth();
  let viewMode: "days" | "months" | "years" = "days";
  const today = new Date();
  /** Ignore the document click that bubbles from the same gesture that opened us */
  let ignoreDocClick = false;

  let panel = root.querySelector<HTMLElement>(".blora-datepicker__panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.className = "blora-datepicker__panel";
    root.appendChild(panel);
  }

  const inRange = (d: Date) => {
    const s = fmt(d);
    if (min && s < min) return false;
    if (max && s > max) return false;
    return true;
  };

  const syncFromInput = () => {
    if (input.value) {
      const d = parseYMD(input.value);
      if (d) {
        selected = d;
        viewYear = d.getFullYear();
        viewMonth = d.getMonth();
        return;
      }
    }
    selected = null;
    if (!viewYear) {
      viewYear = today.getFullYear();
      viewMonth = today.getMonth();
    }
  };

  const el = (tag: string, cls?: string, text?: string) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const render = () => {
    panel!.replaceChildren();
    const head = el("div", "blora-datepicker__head");
    const prev = el("button", "blora-datepicker__nav");
    prev.setAttribute("type", "button");
    prev.setAttribute("data-nav", "prev");
    setChevron(prev, "prev");
    const next = el("button", "blora-datepicker__nav");
    next.setAttribute("type", "button");
    next.setAttribute("data-nav", "next");
    setChevron(next, "next");
    let titleText = "";
    let zoom: string | null = null;
    if (viewMode === "days") {
      titleText = `${viewYear}年 ${MONTHS[viewMonth]}`;
      zoom = "months";
    } else if (viewMode === "months") {
      titleText = `${viewYear}年`;
      zoom = "years";
    } else {
      const dec = Math.floor(viewYear / 10) * 10;
      titleText = `${dec}–${dec + 9}年`;
    }
    const title = el("span", "blora-datepicker__title", titleText);
    if (zoom) title.setAttribute("data-zoom", zoom);
    head.append(prev, title, next);
    panel!.appendChild(head);

    if (viewMode === "days") {
      const grid = el("div", "blora-datepicker__grid");
      DOW.forEach((d) => grid.appendChild(el("div", "blora-datepicker__dow", d)));
      const first = new Date(viewYear, viewMonth, 1);
      const startDay = first.getDay();
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
      for (let i = startDay - 1; i >= 0; i--) {
        const c = el("div", "blora-datepicker__cell", String(daysInPrev - i));
        c.setAttribute("data-other", "");
        grid.appendChild(c);
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(viewYear, viewMonth, day);
        const c = el("div", "blora-datepicker__cell", String(day));
        c.setAttribute("data-day", String(day));
        if (d.toDateString() === today.toDateString()) c.setAttribute("data-today", "");
        if (selected && d.toDateString() === selected.toDateString())
          c.setAttribute("data-selected", "");
        if (!inRange(d)) c.setAttribute("disabled", "");
        grid.appendChild(c);
      }
      const total = startDay + daysInMonth;
      const rem = (7 - (total % 7)) % 7;
      for (let i = 1; i <= rem; i++) {
        const c = el("div", "blora-datepicker__cell", String(i));
        c.setAttribute("data-other", "");
        grid.appendChild(c);
      }
      panel!.appendChild(grid);
    } else if (viewMode === "months") {
      const grid = el("div", "blora-datepicker__grid blora-datepicker__grid--months");
      MONTHS.forEach((name, m) => {
        const c = el("div", "blora-datepicker__cell blora-datepicker__cell--month", name);
        c.setAttribute("data-month", String(m));
        if (selected && viewYear === selected.getFullYear() && m === selected.getMonth())
          c.setAttribute("data-selected", "");
        if (viewYear === today.getFullYear() && m === today.getMonth())
          c.setAttribute("data-today", "");
        grid.appendChild(c);
      });
      panel!.appendChild(grid);
    } else {
      const dec = Math.floor(viewYear / 10) * 10;
      const grid = el("div", "blora-datepicker__grid blora-datepicker__grid--years");
      for (let y = dec - 1; y <= dec + 10; y++) {
        const c = el("div", "blora-datepicker__cell blora-datepicker__cell--year", String(y));
        c.setAttribute("data-year", String(y));
        if (y < dec || y > dec + 9) c.setAttribute("data-other", "");
        if (selected && y === selected.getFullYear()) c.setAttribute("data-selected", "");
        if (y === today.getFullYear()) c.setAttribute("data-today", "");
        grid.appendChild(c);
      }
      panel!.appendChild(grid);
    }

    const foot = el("div", "blora-datepicker__foot");
    const clearBtn = el("button", "blora-button");
    clearBtn.setAttribute("type", "button");
    clearBtn.setAttribute("data-variant", "ghost");
    clearBtn.setAttribute("data-size", "sm");
    clearBtn.setAttribute("data-clear", "");
    clearBtn.textContent = "清除";
    const todayBtn = el("button", "blora-button");
    todayBtn.setAttribute("type", "button");
    todayBtn.setAttribute("data-variant", "ghost");
    todayBtn.setAttribute("data-size", "sm");
    todayBtn.setAttribute("data-today", "");
    todayBtn.textContent = "今天";
    foot.append(clearBtn, todayBtn);
    panel!.appendChild(foot);
  };

  const open = () => {
    syncFromInput();
    viewMode = "days";
    panel!.setAttribute("data-open", "");
    root.style.zIndex = "var(--blora-z-dropdown)";
    render();
  };

  const close = () => {
    panel!.removeAttribute("data-open");
    root.style.zIndex = "";
  };

  const onBtn = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (panel!.hasAttribute("data-open")) {
      close();
    } else {
      ignoreDocClick = true;
      open();
      // Same-tick document click from this gesture must not close us
      queueMicrotask(() => {
        ignoreDocClick = false;
      });
    }
  };

  const onDoc = (e: MouseEvent) => {
    if (!panel!.hasAttribute("data-open") || ignoreDocClick) return;
    const t = e.target as Node | null;
    // After re-render, the original target may be detached → contains() is false
    if (t && !t.isConnected) return;
    if (t && root.contains(t)) return;
    close();
  };

  const onPanel = (e: MouseEvent) => {
    // Keep the click inside the floating panel from closing via document
    e.stopPropagation();
    const t = e.target as HTMLElement;
    const nav = t.closest<HTMLElement>("[data-nav]");
    if (nav) {
      const dir = nav.dataset.nav === "prev" ? -1 : 1;
      if (viewMode === "days") {
        viewMonth += dir;
        if (viewMonth < 0) {
          viewMonth = 11;
          viewYear--;
        } else if (viewMonth > 11) {
          viewMonth = 0;
          viewYear++;
        }
      } else if (viewMode === "months") viewYear += dir;
      else viewYear += dir * 10;
      render();
      return;
    }
    const zoom = t.closest<HTMLElement>("[data-zoom]");
    if (zoom) {
      if (zoom.dataset.zoom === "months") viewMode = "months";
      else if (zoom.dataset.zoom === "years") viewMode = "years";
      render();
      return;
    }
    if (t.closest("[data-today]")) {
      selected = new Date();
      viewYear = selected.getFullYear();
      viewMonth = selected.getMonth();
      viewMode = "days";
      input.value = fmt(selected);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      close();
      return;
    }
    if (t.closest("[data-clear]")) {
      selected = null;
      input.value = "";
      input.dispatchEvent(new Event("change", { bubbles: true }));
      close();
      return;
    }
    const day = t.closest<HTMLElement>(".blora-datepicker__cell[data-day]");
    if (day && !day.hasAttribute("disabled") && !day.hasAttribute("data-other")) {
      selected = new Date(viewYear, viewMonth, Number(day.dataset.day));
      input.value = fmt(selected);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      close();
      return;
    }
    const month = t.closest<HTMLElement>("[data-month]");
    if (month) {
      viewMonth = Number(month.dataset.month);
      viewMode = "days";
      render();
      return;
    }
    const year = t.closest<HTMLElement>("[data-year]");
    if (year) {
      viewYear = Number(year.dataset.year);
      viewMode = "months";
      render();
    }
  };

  // Block native picker chrome on the field itself if browser tries showPicker
  const onInputClick = (e: MouseEvent) => {
    // Allow editing segments; only suppress showPicker when possible
    if (typeof input.showPicker === "function") {
      // Don't auto-open native; let user edit fields. No preventDefault needed for segment focus.
    }
    void e;
  };

  btn?.addEventListener("click", onBtn);
  panel.addEventListener("click", onPanel);
  document.addEventListener("click", onDoc);
  input.addEventListener("click", onInputClick);

  return {
    destroy() {
      btn?.removeEventListener("click", onBtn);
      panel!.removeEventListener("click", onPanel);
      document.removeEventListener("click", onDoc);
      input.removeEventListener("click", onInputClick);
    },
  };
}

export function createTimepickerController(root: HTMLElement): DatepickerController {
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
    const index = MID * max + ((value % max) + max) % max;
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
    hScroll.setAttribute("aria-label", "时");
    fillWheel(hScroll, 24, "h");

    const sep = document.createElement("span");
    sep.className = "blora-timepicker__sep";
    sep.textContent = ":";
    sep.setAttribute("aria-hidden", "true");

    const mScroll = document.createElement("div");
    mScroll.className = "blora-timepicker__scroll";
    mScroll.setAttribute("data-scroll", "m");
    mScroll.setAttribute("role", "listbox");
    mScroll.setAttribute("aria-label", "分");
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
    nowBtn.textContent = "此刻";
    const okBtn = document.createElement("button");
    okBtn.type = "button";
    okBtn.className = "blora-button";
    okBtn.setAttribute("data-variant", "ghost");
    okBtn.setAttribute("data-size", "sm");
    okBtn.setAttribute("data-confirm", "");
    okBtn.textContent = "确定";
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
