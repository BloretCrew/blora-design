/**
 * Blora Design 2.0 - Datepicker controller
 * v1 parity: native type=date field (segmented locale UI)
 * + custom Blora panel opened by the trailing icon button.
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_DATEPICKER_TAG = "blora-datepicker";

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
  el.replaceChildren(
    createBloraIcon(dir === "prev" ? "chevron-left" : "chevron-right", 14, el.ownerDocument),
  );
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

/** Composite CE that generates the supported date field and calendar trigger. */
export class BloraDatepicker extends BloraElement {
  private controller: DatepickerController | null = null;

  static get observedAttributes(): string[] {
    return ["value", "min", "max", "placeholder", "name", "disabled", "required"];
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
    root.className = "blora-datepicker";
    root.dataset.bloraDatepicker = "";
    root.dataset.bloraGenerated = "";

    const input = document.createElement("input");
    input.className = "blora-input";
    input.type = "date";
    input.value = this.getAttribute("value") ?? "";
    input.min = this.getAttribute("min") ?? "1900-01-01";
    input.max = this.getAttribute("max") ?? "2099-12-31";
    input.placeholder = this.getAttribute("placeholder") ?? "YYYY-MM-DD";
    input.disabled = this.hasAttribute("disabled");
    input.required = this.hasAttribute("required");
    if (this.hasAttribute("name")) input.name = this.getAttribute("name") ?? "";

    const button = document.createElement("button");
    button.className = "blora-datepicker__btn";
    button.type = "button";
    button.tabIndex = -1;
    button.disabled = input.disabled;
    button.setAttribute("aria-label", "选择日期");
    button.appendChild(createBloraIcon("calendar"));

    root.append(input, button);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const input = this.querySelector<HTMLInputElement>(".blora-input");
    if (!input) return;
    if (document.activeElement !== input) input.value = this.getAttribute("value") ?? input.value;
    input.min = this.getAttribute("min") ?? "1900-01-01";
    input.max = this.getAttribute("max") ?? "2099-12-31";
    input.placeholder = this.getAttribute("placeholder") ?? "YYYY-MM-DD";
    input.disabled = this.hasAttribute("disabled");
    input.required = this.hasAttribute("required");
    if (this.hasAttribute("name")) input.name = this.getAttribute("name") ?? "";
    const button = this.querySelector<HTMLButtonElement>(".blora-datepicker__btn");
    if (button) button.disabled = input.disabled;
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-datepicker");
    this.controller?.destroy();
    this.controller = root ? createDatepickerController(root) : null;
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraDatepicker(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_DATEPICKER_TAG)) return;
  registry.define(BLORA_DATEPICKER_TAG, BloraDatepicker);
}
