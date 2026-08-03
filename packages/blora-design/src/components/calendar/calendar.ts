/**
 * Blora Design 2.0 - Calendar controller
 * Month/year navigation, day selection, zoom levels (days → months → years).
 */
export interface CalendarController {
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

export function createCalendarController(root: HTMLElement): CalendarController {
  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let viewMode: "days" | "months" | "years" = "days";
  /* Default selection = today (v1 showcase / expected UX) */
  let selected: Date | null = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const el = (tag: string, cls?: string, text?: string): HTMLElement => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };

  const render = () => {
    root.replaceChildren();
    const head = el("div", "blora-calendar__head");
    const navRow = el("div", "blora-calendar__navs");
    const prev = el("button", "blora-calendar__nav");
    prev.setAttribute("type", "button");
    prev.setAttribute("data-nav", "prev");
    prev.setAttribute("aria-label", "上一个");
    setChevron(prev, "prev");
    const next = el("button", "blora-calendar__nav");
    next.setAttribute("type", "button");
    next.setAttribute("data-nav", "next");
    next.setAttribute("aria-label", "下一个");
    setChevron(next, "next");
    navRow.append(prev, next);

    let titleText = "";
    let zoom: string | null = null;
    if (viewMode === "days") {
      /* No space — avoids "2026年 8 / 月" wrap on narrow hosts */
      titleText = `${viewYear}年${MONTHS[viewMonth]}`;
      zoom = "months";
    } else if (viewMode === "months") {
      titleText = `${viewYear}年`;
      zoom = "years";
    } else {
      const decStart = Math.floor(viewYear / 10) * 10;
      titleText = `${decStart}–${decStart + 9}年`;
    }
    const title = el("div", "blora-calendar__title", titleText);
    if (zoom) title.setAttribute("data-zoom", zoom);

    const todayBtn = el("button", "blora-button blora-calendar__today");
    todayBtn.setAttribute("type", "button");
    todayBtn.setAttribute("data-variant", "outline");
    todayBtn.setAttribute("data-size", "sm");
    todayBtn.setAttribute("data-today", "");
    todayBtn.textContent = "今天";

    head.append(navRow, title, todayBtn);
    root.appendChild(head);

    if (viewMode === "days") {
      const grid = el("div", "blora-calendar__grid");
      DOW.forEach((d) => grid.appendChild(el("div", "blora-calendar__dow", d)));
      const first = new Date(viewYear, viewMonth, 1);
      const startDay = first.getDay();
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
      for (let i = startDay - 1; i >= 0; i--) {
        const cell = el("div", "blora-calendar__cell", String(daysInPrev - i));
        cell.setAttribute("data-other", "");
        grid.appendChild(cell);
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(viewYear, viewMonth, day);
        const cell = el("div", "blora-calendar__cell", String(day));
        cell.setAttribute("data-day", String(day));
        if (d.toDateString() === today.toDateString()) cell.setAttribute("data-today", "");
        if (selected && d.toDateString() === selected.toDateString())
          cell.setAttribute("data-selected", "");
        grid.appendChild(cell);
      }
      const total = startDay + daysInMonth;
      const remaining = (7 - (total % 7)) % 7;
      for (let i = 1; i <= remaining; i++) {
        const cell = el("div", "blora-calendar__cell", String(i));
        cell.setAttribute("data-other", "");
        grid.appendChild(cell);
      }
      root.appendChild(grid);
    } else if (viewMode === "months") {
      const grid = el("div", "blora-calendar__grid blora-calendar__grid--months");
      MONTHS.forEach((name, m) => {
        const cell = el("div", "blora-calendar__cell blora-calendar__cell--month", name);
        cell.setAttribute("data-month", String(m));
        if (selected && viewYear === selected.getFullYear() && m === selected.getMonth())
          cell.setAttribute("data-selected", "");
        if (viewYear === today.getFullYear() && m === today.getMonth())
          cell.setAttribute("data-today", "");
        grid.appendChild(cell);
      });
      root.appendChild(grid);
    } else {
      const decStart = Math.floor(viewYear / 10) * 10;
      const grid = el("div", "blora-calendar__grid blora-calendar__grid--years");
      for (let y = decStart - 1; y <= decStart + 10; y++) {
        const cell = el("div", "blora-calendar__cell blora-calendar__cell--year", String(y));
        cell.setAttribute("data-year", String(y));
        if (y < decStart || y > decStart + 9) cell.setAttribute("data-other", "");
        if (selected && y === selected.getFullYear()) cell.setAttribute("data-selected", "");
        if (y === today.getFullYear()) cell.setAttribute("data-today", "");
        grid.appendChild(cell);
      }
      root.appendChild(grid);
    }
  };

  const onClick = (e: MouseEvent) => {
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
    /* Only the header "今天" button — day cells also use data-today for styling */
    if (t.closest("button[data-today], .blora-calendar__head [data-today]")) {
      selected = new Date();
      viewYear = selected.getFullYear();
      viewMonth = selected.getMonth();
      viewMode = "days";
      render();
      return;
    }
    const dayCell = t.closest<HTMLElement>(".blora-calendar__cell[data-day]");
    if (dayCell) {
      selected = new Date(viewYear, viewMonth, Number(dayCell.dataset.day));
      render();
      return;
    }
    const monthCell = t.closest<HTMLElement>(".blora-calendar__cell--month[data-month]");
    if (monthCell) {
      viewMonth = Number(monthCell.dataset.month);
      viewMode = "days";
      render();
      return;
    }
    const yearCell = t.closest<HTMLElement>(".blora-calendar__cell--year[data-year]");
    if (yearCell) {
      viewYear = Number(yearCell.dataset.year);
      viewMode = "months";
      render();
    }
  };

  root.addEventListener("click", onClick);
  render();

  return {
    destroy() {
      root.removeEventListener("click", onClick);
    },
  };
}
