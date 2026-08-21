/**
 * Effects add-on extras (migrated from core / v1).
 * text-rotate, countdown, countup, image-diff, hover-gallery, watermark, shortcuts,
 * plus the composite custom elements that own their DOM lifecycles.
 */

interface Destroyable {
  destroy(): void;
}

function prefersReduced(el: HTMLElement): boolean {
  return !!el.ownerDocument?.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/* —— Text Rotate —— */
export type TextRotateController = Destroyable;

export function createTextRotateController(root: HTMLElement): TextRotateController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const items = Array.from(root.querySelectorAll<HTMLElement>(".blora-text-rotate__item"));
  if (items.length < 2 || prefersReduced(root)) {
    items.forEach((item, index) => {
      item.toggleAttribute("data-active", index === 0);
      item.setAttribute("aria-hidden", String(index !== 0));
    });
    return { destroy: () => {} };
  }

  const win = root.ownerDocument.defaultView!;
  const duration = Math.max(1200, Number(root.dataset.interval) || 3200);
  let active = Math.max(
    0,
    items.findIndex((item) => item.hasAttribute("data-active")),
  );
  let timer: number | null = null;

  const setActive = (index: number) => {
    active = ((index % items.length) + items.length) % items.length;
    items.forEach((item, i) => {
      const on = i === active;
      item.toggleAttribute("data-active", on);
      item.setAttribute("aria-hidden", String(!on));
    });
  };

  const start = () => {
    if (timer == null) timer = win.setInterval(() => setActive(active + 1), duration);
  };
  const stop = () => {
    if (timer != null) {
      win.clearInterval(timer);
      timer = null;
    }
  };

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);
  setActive(active);
  start();

  return {
    destroy() {
      stop();
      root.removeEventListener("mouseenter", stop);
      root.removeEventListener("mouseleave", start);
      root.removeEventListener("focusin", stop);
      root.removeEventListener("focusout", start);
    },
  };
}

/* —— Countdown —— */
export type CountdownController = Destroyable;

export function createCountdownController(root: HTMLElement): CountdownController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const win = root.ownerDocument.defaultView!;
  let target = Date.parse(root.dataset.target || "");
  if (!Number.isFinite(target)) {
    const seconds = Math.max(0, Number(root.dataset.seconds) || 0);
    target = Date.now() + seconds * 1000;
  }
  let timer: number | null = null;

  const render = () => {
    const remaining = Math.max(0, target - Date.now());
    const totalSeconds = Math.ceil(remaining / 1000);
    const values: Record<string, number> = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor(totalSeconds / 3600) % 24,
      minutes: Math.floor(totalSeconds / 60) % 60,
      seconds: totalSeconds % 60,
    };
    Object.entries(values).forEach(([unit, value]) => {
      const output = root.querySelector(`[data-unit="${unit}"]`);
      if (output) {
        output.textContent = String(value).padStart(unit === "days" ? 1 : 2, "0");
      }
    });
    root.setAttribute(
      "aria-label",
      `${values.days} 天 ${values.hours} 小时 ${values.minutes} 分 ${values.seconds} 秒`,
    );
    if (!remaining && timer != null) {
      win.clearInterval(timer);
      timer = null;
      root.dispatchEvent(new CustomEvent("blora:complete", { bubbles: true }));
    }
  };

  root.setAttribute("role", "timer");
  render();
  if (target > Date.now()) timer = win.setInterval(render, 1000);

  return {
    destroy() {
      if (timer != null) win.clearInterval(timer);
    },
  };
}

/* —— CountUp —— */
export type CountUpController = Destroyable;

export function createCountUpController(root: HTMLElement): CountUpController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const target = Number(root.getAttribute("data-blora-countup") || root.textContent) || 0;
  const duration = Number(root.getAttribute("data-duration")) || 900;
  const decimals = Number(root.getAttribute("data-decimals")) || 0;
  const prefix = root.getAttribute("data-prefix") || "";
  const suffix = root.getAttribute("data-suffix") || "";
  let started = false;
  let io: IntersectionObserver | null = null;

  const run = () => {
    if (started) return;
    started = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      root.textContent = prefix + val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (typeof IntersectionObserver === "function") {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            run();
            io?.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(root);
  } else {
    run();
  }

  return {
    destroy() {
      io?.disconnect();
    },
  };
}

/* —— Diff (images, text, or any component panes) —— */
export type ImageDiffController = Destroyable;

export function createImageDiffController(root: HTMLElement): ImageDiffController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const input = root.querySelector<HTMLInputElement>(".blora-diff__range, input[type='range']");
  if (!input) return { destroy: () => {} };

  const sync = () => {
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const value = Number(input.value || 50);
    const percent =
      max === min ? 50 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    root.style.setProperty("--blora-diff-position", `${percent}%`);
    input.setAttribute("aria-valuetext", `${Math.round(percent)}%`);
  };

  input.addEventListener("input", sync);
  sync();
  return {
    destroy() {
      input.removeEventListener("input", sync);
    },
  };
}

/* —— Hover Gallery —— */
export type HoverGalleryController = Destroyable;

export function createHoverGalleryController(root: HTMLElement): HoverGalleryController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const doc = root.ownerDocument;
  let items = Array.from(root.querySelectorAll<HTMLElement>(".blora-hover-gallery__item"));
  if (!items.length) return { destroy: () => {} };

  let track = root.querySelector<HTMLElement>(".blora-hover-gallery__track");
  if (!track) {
    track = doc.createElement("div");
    track.className = "blora-hover-gallery__track";
    track.dataset.bloraGenerated = "";
    items.forEach((item) => track!.appendChild(item));
    root.insertBefore(track, root.firstChild);
    items = Array.from(track.querySelectorAll(".blora-hover-gallery__item"));
  }

  const label = root.getAttribute("aria-label") || "图片库";
  root.setAttribute("role", "group");
  let progress = root.querySelector<HTMLElement>(".blora-hover-gallery__progress");
  if (!progress) {
    progress = doc.createElement("span");
    progress.className = "blora-hover-gallery__progress";
    progress.setAttribute("aria-hidden", "true");
    progress.dataset.bloraGenerated = "";
    for (let i = 0; i < items.length; i++) {
      progress.appendChild(doc.createElement("span"));
    }
    root.appendChild(progress);
  }
  const indicators = Array.from(progress.querySelectorAll("span"));
  const last = items.length - 1;
  let active = Math.max(
    0,
    items.findIndex((item) => item.hasAttribute("data-active")),
  );
  if (active < 0) active = 0;

  type Drag = {
    x: number;
    y: number;
    dx: number;
    locked: "x" | "y" | null;
    lx: number;
    lt: number;
    vx: number;
    pointerId?: number;
  };
  let drag: Drag | null = null;
  const THRESHOLD = 0.2;
  const VELOCITY = 0.35;

  const paint = (animate: boolean) => {
    track!.classList.toggle("is-dragging", !animate);
    track!.style.transform = `translate3d(${-active * 100}%, 0, 0)`;
    items.forEach((item, i) => {
      item.toggleAttribute("data-active", i === active);
      item.setAttribute("aria-hidden", String(i !== active));
    });
    indicators.forEach((item, i) => item.toggleAttribute("data-active", i === active));
    root.setAttribute("aria-label", `${label}，图片 ${active + 1} / ${items.length}`);
  };

  const go = (index: number) => {
    active = Math.max(0, Math.min(last, index));
    paint(true);
  };

  if (!root.hasAttribute("tabindex")) root.tabIndex = 0;

  const point = (e: PointerEvent | TouchEvent | MouseEvent) => {
    if ("touches" in e && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if ("changedTouches" in e && e.changedTouches[0])
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const me = e as MouseEvent;
    return { x: me.clientX, y: me.clientY };
  };

  const resist = (dx: number) => {
    if ((active === 0 && dx > 0) || (active === last && dx < 0)) return dx * 0.35;
    return dx;
  };

  const applyDrag = (dx: number) => {
    track!.classList.add("is-dragging");
    track!.style.transform = `translate3d(calc(${-active * 100}% + ${resist(dx)}px), 0, 0)`;
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const p = point(e);
    drag = {
      x: p.x,
      y: p.y,
      dx: 0,
      locked: null,
      lx: p.x,
      lt: Date.now(),
      vx: 0,
      pointerId: e.pointerId,
    };
    try {
      root.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!drag) return;
    if (drag.pointerId != null && e.pointerId !== drag.pointerId) return;
    const p = point(e);
    const dx = p.x - drag.x;
    const dy = p.y - drag.y;
    if (drag.locked == null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      drag.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (drag.locked === "y") {
        drag = null;
        paint(true);
        return;
      }
    }
    if (drag.locked !== "x") return;
    if (e.cancelable) e.preventDefault();
    const now = Date.now();
    const dt = Math.max(1, now - drag.lt);
    drag.vx = (p.x - drag.lx) / dt;
    drag.lx = p.x;
    drag.lt = now;
    drag.dx = dx;
    applyDrag(dx);
  };

  const finishDrag = (cancelled: boolean) => {
    if (!drag) return;
    const { dx, vx, locked } = drag;
    drag = null;
    track!.classList.remove("is-dragging");
    if (locked !== "x" || cancelled) {
      paint(true);
      return;
    }
    const w = root.getBoundingClientRect().width || 1;
    let next = active;
    if (dx <= -w * THRESHOLD || vx <= -VELOCITY) next = active + 1;
    else if (dx >= w * THRESHOLD || vx >= VELOCITY) next = active - 1;
    go(next);
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!drag) return;
    if (drag.pointerId != null && e.pointerId !== drag.pointerId) return;
    if (drag.locked === "x") {
      const p = point(e);
      drag.dx = p.x - drag.x;
      const now = Date.now();
      const dt = Math.max(1, now - drag.lt);
      drag.vx = (p.x - drag.lx) / dt;
    }
    finishDrag(false);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      go(active + 1);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(active - 1);
    }
    if (e.key === "Home") {
      e.preventDefault();
      go(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      go(last);
    }
  };

  root.addEventListener("pointerdown", onPointerDown);
  root.addEventListener("pointermove", onPointerMove);
  root.addEventListener("pointerup", onPointerUp);
  root.addEventListener("pointercancel", () => finishDrag(true));
  root.addEventListener("keydown", onKey);
  paint(true);

  return {
    destroy() {
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("keydown", onKey);
    },
  };
}

/* —— Watermark —— */
export type WatermarkController = Destroyable;

export function createWatermarkController(root: HTMLElement): WatermarkController {
  if (typeof document === "undefined") return { destroy: () => {} };
  root.classList.add("blora-watermark");
  const text =
    root.getAttribute("data-text") || root.getAttribute("data-blora-watermark") || "Blora";
  const doc = root.ownerDocument;
  const win = doc.defaultView!;
  let layer = root.querySelector<HTMLElement>(".blora-watermark__canvas");
  if (!layer) {
    layer = doc.createElement("div");
    layer.className = "blora-watermark__canvas";
    layer.setAttribute("aria-hidden", "true");
    root.appendChild(layer);
  }

  const paint = () => {
    const ratio = Math.min(win.devicePixelRatio || 1, 2);
    /* Tile size scales with host so small canvases still show multiple stamps */
    const hostW = Math.max(root.clientWidth || 0, 120);
    const hostH = Math.max(root.clientHeight || 0, 80);
    const w = Math.round(Math.min(180, Math.max(100, hostW / 2.2)));
    const h = Math.round(Math.min(130, Math.max(72, hostH / 2.2)));
    const canvas = doc.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(w * ratio));
    canvas.height = Math.max(1, Math.floor(h * ratio));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.translate(w / 2, h / 2);
    ctx.rotate((-22 * Math.PI) / 180);
    ctx.fillStyle = "rgba(80,70,90,0.9)";
    const fontFamily =
      win.getComputedStyle(root).getPropertyValue("--blora-font-sans").trim() ||
      "system-ui, sans-serif";
    const fontSize = Math.max(11, Math.min(15, Math.round(w * 0.09)));
    ctx.font = `600 ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 0);
    layer!.style.backgroundImage = `url(${canvas.toDataURL()})`;
    layer!.style.backgroundSize = `${w}px ${h}px`;
    layer!.style.backgroundRepeat = "repeat";
    layer!.style.backgroundPosition = "center center";
  };

  paint();
  let ro: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined") {
    let raf = 0;
    ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    });
    ro.observe(root);
  }

  return {
    destroy() {
      ro?.disconnect();
    },
  };
}

/* —— Shortcut Hints —— */
function normalizeShortcutPlatform(platform: string | undefined): "apple" | "other" {
  const p = String(platform || "").toLowerCase();
  if (p.includes("mac") || p.includes("iphone") || p.includes("ipad") || p.includes("ios")) {
    return "apple";
  }
  return "other";
}

export function getShortcutPlatform(base?: HTMLElement): "apple" | "other" {
  const win = base?.ownerDocument?.defaultView ?? (typeof window !== "undefined" ? window : null);
  const nav = win?.navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav?.userAgentData?.platform || nav?.platform || nav?.userAgent || "";
  return normalizeShortcutPlatform(platform);
}

function shortcutTokens(shortcut: string): string[] {
  return String(shortcut || "")
    .split("+")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

function shortcutKey(key: string, platform: "apple" | "other", accessible = false): string {
  const apple = platform === "apple";
  const labels: Record<string, string> = {
    mod: accessible ? (apple ? "Command" : "Control") : apple ? "⌘" : "Ctrl",
    ctrl: accessible ? "Control" : "Ctrl",
    command: accessible ? "Command" : "⌘",
    cmd: accessible ? "Command" : "⌘",
    alt: accessible ? (apple ? "Option" : "Alt") : apple ? "⌥" : "Alt",
    option: accessible ? "Option" : "⌥",
    shift: accessible ? "Shift" : apple ? "⇧" : "Shift",
    enter: "Enter",
    escape: "Esc",
    esc: "Esc",
    space: "Space",
  };
  return labels[key] || (key.length === 1 ? key.toUpperCase() : key);
}

export function formatShortcut(shortcut: string, platform = getShortcutPlatform()): string {
  return shortcutTokens(shortcut)
    .map((key) => shortcutKey(key, platform))
    .join(" + ");
}

export function initShortcutHints(root: ParentNode = document): void {
  if (typeof document === "undefined") return;
  root.querySelectorAll<HTMLElement>("[data-blora-shortcut]").forEach((hint) => {
    const shortcut = hint.dataset.bloraShortcut || "";
    const platform = getShortcutPlatform(hint);
    hint.textContent = formatShortcut(shortcut, platform);
    hint.setAttribute(
      "aria-label",
      shortcutTokens(shortcut)
        .map((key) => shortcutKey(key, platform, true))
        .join(" + "),
    );
  });
}

/* —— Text FX (moved from index so the CE host can reuse it) —— */

export type TextFxName =
  "big" | "small" | "shake" | "nod" | "disperse" | "ripple" | "bloom" | "jitter";

export interface TextFxOptions {
  /** Loop the animation (default: false) */
  loop?: boolean;
  /** Make the element clickable (default: false) */
  clickable?: boolean;
}

const TEXT_FX: TextFxName[] = [
  "big",
  "small",
  "shake",
  "nod",
  "disperse",
  "ripple",
  "bloom",
  "jitter",
];

const TEXT_FX_SET = new Set<string>(TEXT_FX);

const TEXT_FX_SPLIT: TextFxName[] = ["shake", "disperse", "ripple", "bloom", "jitter"];

function textFxNameFromEl(el: HTMLElement): string {
  const raw = (el.getAttribute("data-blora-text-fx") || "").trim().toLowerCase();
  if (TEXT_FX_SET.has(raw)) return raw;
  for (const fx of TEXT_FX) {
    if (el.classList.contains(`blora-text-fx--${fx}`)) return fx;
  }
  return "";
}

function layoutTextFxPhysics(el: HTMLElement, name: string): void {
  const chars = el.querySelectorAll(".blora-text-fx__ch");
  const n = chars.length || 1;

  chars.forEach((span, i) => {
    const charSpan = span as HTMLElement;
    const ratio = n <= 1 ? 0.5 : i / (n - 1);
    charSpan.style.setProperty("--i", String(i));
    charSpan.style.setProperty("--fx-ratio", ratio.toFixed(3));

    if (name === "disperse") {
      const angle = (ratio - 0.5) * 1.6 + (Math.random() - 0.5) * 0.5;
      const dist = 1.4 + Math.random() * 1.1;
      const x = Math.sin(angle) * dist;
      const y = -Math.cos(angle) * dist - Math.random() * 0.5;
      const r = (Math.random() - 0.5) * 50;
      charSpan.style.setProperty("--fx-x", `${x.toFixed(2)}em`);
      charSpan.style.setProperty("--fx-y", `${y.toFixed(2)}em`);
      charSpan.style.setProperty("--fx-r", `${r.toFixed(1)}deg`);
    } else {
      charSpan.style.removeProperty("--fx-x");
      charSpan.style.removeProperty("--fx-y");
      charSpan.style.removeProperty("--fx-r");
      charSpan.style.removeProperty("--fx-center-delay");
    }
  });
}

function handleTextFxCopy(this: HTMLElement, event: ClipboardEvent): void {
  const selection = this.ownerDocument.getSelection();
  if (!selection || selection.isCollapsed || !event.clipboardData) return;
  const chars = Array.from(this.querySelectorAll<HTMLElement>(".blora-text-fx__ch"));
  if (!chars.length) return;
  const range = selection.rangeCount ? selection.getRangeAt(0) : null;
  if (!range) return;
  const selected = chars.filter((span) => range.intersectsNode(span));
  if (!selected.length) return;
  const plain = selected.map((span) => span.textContent?.replace(/\u00a0/g, " ") ?? "").join("");
  if (!plain) return;
  event.preventDefault();
  event.clipboardData.setData("text/plain", plain);
}

function charSpanAtPoint(el: HTMLElement, x: number, y: number): HTMLElement | null {
  const doc = el.ownerDocument;
  const fromRange = (
    doc as Document & { caretRangeFromPoint?: (x: number, y: number) => Range | null }
  ).caretRangeFromPoint?.(x, y);
  if (fromRange?.startContainer?.nodeType === Node.TEXT_NODE) {
    return (
      (fromRange.startContainer.parentElement as HTMLElement | null)?.closest(
        ".blora-text-fx__ch",
      ) ?? null
    );
  }
  const fromPos = (
    doc as Document & {
      caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null;
    }
  ).caretPositionFromPoint?.(x, y);
  if (fromPos?.offsetNode?.nodeType === Node.TEXT_NODE) {
    return (
      (fromPos.offsetNode.parentElement as HTMLElement | null)?.closest(".blora-text-fx__ch") ??
      null
    );
  }
  return null;
}

function selectTextFxForEvent(el: HTMLElement, event: MouseEvent): void {
  /* Split chars are independent inline-block boxes, so the browser's native
     word/triple-click selection does not apply. Restore it: double click
     selects the word (contiguous non-space chars), triple click the line.
     Runs on mouseup (detail>=2) so the browser's per-char selection is
     prevented before it sticks, and again on dblclick as a fallback. */
  if (event.detail < 2) return;
  event.preventDefault();
  const doc = el.ownerDocument;
  const selection = doc.getSelection();
  if (!selection) return;

  const range = doc.createRange();
  const chars = Array.from(el.querySelectorAll<HTMLElement>(".blora-text-fx__ch"));
  if (event.detail >= 3 || !chars.length) {
    range.selectNodeContents(el);
  } else {
    /* Animated chars move under the cursor, so the click target may be the
       container or a gap. Fall back to the char nearest the click point, then
       to the whole line — never leave the browser's single-char selection. */
    const target = event.target as HTMLElement;
    const clicked =
      target.closest<HTMLElement>(".blora-text-fx__ch") ??
      charSpanAtPoint(el, event.clientX, event.clientY);
    const idx = clicked ? chars.indexOf(clicked) : -1;
    if (idx < 0) {
      range.selectNodeContents(el);
    } else {
      const isSpace = (span: HTMLElement) =>
        span.textContent === "\u00a0" || span.textContent?.trim() === "";
      let start = idx;
      let end = idx;
      while (start > 0 && !isSpace(chars[start - 1]!)) start--;
      while (end < chars.length - 1 && !isSpace(chars[end + 1]!)) end++;
      if (isSpace(chars[idx]!)) {
        range.selectNode(chars[idx]!);
      } else {
        range.setStartBefore(chars[start]!);
        range.setEndAfter(chars[end]!);
      }
    }
  }
  selection.removeAllRanges();
  selection.addRange(range);
}

function handleTextFxMouseUp(this: HTMLElement, event: MouseEvent): void {
  selectTextFxForEvent(this, event);
}

function handleTextFxDblClick(this: HTMLElement, event: MouseEvent): void {
  selectTextFxForEvent(this, event);
}

function splitTextFxLetters(el: HTMLElement): void {
  if (el.dataset.bloraFxSplit === "1") {
    layoutTextFxPhysics(el, textFxNameFromEl(el));
    return;
  }

  const text = el.textContent || "";
  el.textContent = "";

  Array.from(text).forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "blora-text-fx__ch";
    span.style.setProperty("--i", String(i));
    span.textContent = ch === " " ? "\u00a0" : ch;
    el.appendChild(span);
  });

  el.dataset.bloraFxSplit = "1";
  el.dataset.bloraFxText = text;
  el.addEventListener("copy", handleTextFxCopy);
  el.addEventListener("mouseup", handleTextFxMouseUp);
  el.addEventListener("dblclick", handleTextFxDblClick);
  layoutTextFxPhysics(el, textFxNameFromEl(el));
}

function unsplitTextFxLetters(el: HTMLElement): void {
  if (el.dataset.bloraFxSplit !== "1") return;

  const text = el.dataset.bloraFxText ?? "";
  el.textContent = text;
  el.removeAttribute("data-blora-fx-split");
  el.removeAttribute("data-blora-fx-text");
  el.removeEventListener("copy", handleTextFxCopy);
  el.removeEventListener("mouseup", handleTextFxMouseUp);
  el.removeEventListener("dblclick", handleTextFxDblClick);
}

function applyTextFxName(el: HTMLElement, name: TextFxName): boolean {
  if (!TEXT_FX_SET.has(name)) return false;

  el.classList.add("blora-text-fx");

  for (const fx of TEXT_FX) {
    el.classList.remove(`blora-text-fx--${fx}`);
  }
  el.classList.add(`blora-text-fx--${name}`);

  el.setAttribute("data-blora-text-fx", name);

  if (TEXT_FX_SPLIT.includes(name)) {
    splitTextFxLetters(el);
    layoutTextFxPhysics(el, name);
  } else {
    unsplitTextFxLetters(el);
  }

  return true;
}

function restartTextFxAnimation(el: HTMLElement): void {
  el.classList.remove("is-play");
  el.querySelectorAll(".blora-text-fx__ch").forEach((ch) => {
    (ch as HTMLElement).style.animation = "none";
  });
  // Force reflow
  void el.offsetWidth;
  el.querySelectorAll(".blora-text-fx__ch").forEach((ch) => {
    (ch as HTMLElement).style.animation = "";
  });
  el.classList.add("is-play");
}

/**
 * Apply a text effect to a target element.
 *
 * @param target - The element to apply the effect to
 * @param name - Effect name (big, small, shake, nod, disperse, ripple, bloom, jitter)
 * @param options - Loop and clickable options
 * @returns The element if successful, null otherwise
 */
export function textFx(
  target: HTMLElement,
  name?: TextFxName,
  options?: TextFxOptions,
): HTMLElement | null {
  if (typeof document === "undefined") return null;
  if (!target) return null;

  if (name) {
    if (!applyTextFxName(target, name)) return null;
  } else {
    if (!textFxNameFromEl(target)) return null;
    layoutTextFxPhysics(target, textFxNameFromEl(target));
  }

  if (options?.loop) {
    target.classList.add("is-loop");
  } else {
    target.classList.remove("is-loop");
  }

  if (options?.clickable) {
    target.classList.add("is-clickable");
  } else {
    target.classList.remove("is-clickable");
  }

  if (prefersReduced(target)) {
    target.classList.add("is-play");
    return target;
  }

  restartTextFxAnimation(target);
  return target;
}

/* —— Composite custom elements —— */

const EffectsBase: typeof HTMLElement =
  typeof HTMLElement !== "undefined" ? HTMLElement : (class {} as typeof HTMLElement);

/** Declarative text effect host; content stays consumer-owned. */
export class BloraTextFx extends EffectsBase {
  static get observedAttributes(): string[] {
    return ["effect", "loop", "clickable"];
  }

  private connectScheduled = false;

  connectedCallback(): void {
    if (this.ownerDocument?.readyState === "loading") {
      if (this.connectScheduled) return;
      this.connectScheduled = true;
      setTimeout(() => {
        this.connectScheduled = false;
        if (this.isConnected) this.apply();
      }, 0);
      return;
    }
    this.apply();
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.apply();
  }

  get effect(): string {
    return this.getAttribute("effect") || "";
  }

  set effect(name: string) {
    this.setAttribute("effect", name);
  }

  apply(): void {
    const name = (this.effect || "").trim().toLowerCase() as TextFxName | string;
    if (!name) return;
    textFx(this, name as TextFxName, {
      clickable: this.hasAttribute("clickable"),
      loop: this.hasAttribute("loop"),
    });
  }
}

/** Rotating text items; children stay consumer-authored. */
export class BloraTextRotate extends EffectsBase {
  private controller: TextRotateController | null = null;

  static get observedAttributes(): string[] {
    return ["interval"];
  }

  connectedCallback(): void {
    this.classList.add("blora-text-rotate");
    if (!this.hasAttribute("aria-live")) this.setAttribute("aria-live", "polite");
    this.mount();
  }

  disconnectedCallback(): void {
    this.controller?.destroy();
    this.controller = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.mount();
  }

  private mount(): void {
    this.controller?.destroy();
    const interval = this.getAttribute("interval");
    if (interval != null) this.dataset.interval = interval;
    else delete this.dataset.interval;
    for (const node of Array.from(this.childNodes)) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).hasAttribute("data-blora-generated")
      ) {
        continue;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        (node as HTMLElement).classList.add("blora-text-rotate__item");
      }
    }
    this.controller = createTextRotateController(this);
  }
}

/** Countdown with generated day/hour/minute/second units. */
export class BloraCountdown extends EffectsBase {
  private controller: CountdownController | null = null;

  static get observedAttributes(): string[] {
    return ["target", "seconds", "label"];
  }

  connectedCallback(): void {
    this.classList.add("blora-countdown");
    this.syncDataset();
    this.render();
    this.controller = createCountdownController(this);
  }

  disconnectedCallback(): void {
    this.controller?.destroy();
    this.controller = null;
  }

  attributeChangedCallback(): void {
    if (!this.isConnected) return;
    this.syncDataset();
    this.render();
    this.controller?.destroy();
    this.controller = createCountdownController(this);
  }

  /* The controller reads data-target / data-seconds; translate the public
     attributes so `<blora-countdown seconds="…">` drives the timer. */
  private syncDataset(): void {
    const target = this.getAttribute("target");
    const seconds = this.getAttribute("seconds");
    if (target != null) this.dataset.target = target;
    else delete this.dataset.target;
    if (seconds != null) this.dataset.seconds = seconds;
    else delete this.dataset.seconds;
  }

  protected renderUnits(): { unit: string; label: string }[] {
    const labels = (this.getAttribute("label") || "天,时,分,秒").split(",");
    return [
      { unit: "days", label: labels[0] || "天" },
      { unit: "hours", label: labels[1] || "时" },
      { unit: "minutes", label: labels[2] || "分" },
      { unit: "seconds", label: labels[3] || "秒" },
    ];
  }

  render(): void {
    const doc = this.ownerDocument;
    const units = this.renderUnits();
    for (const { unit, label } of units) {
      const element = this.querySelector<HTMLElement>(`[data-unit="${unit}"]`);
      if (element) continue;
      const wrap = doc.createElement("span");
      wrap.className = "blora-countdown__unit";
      wrap.dataset.bloraGenerated = "";
      const value = doc.createElement("strong");
      value.className = "blora-countdown__value";
      value.dataset.unit = unit;
      value.textContent = "--";
      const text = doc.createElement("span");
      text.className = "blora-countdown__label";
      text.textContent = label;
      wrap.append(value, text);
      this.append(wrap);
    }
  }
}

/** Count-up number that animates when scrolled into view. */
export class BloraCountUp extends EffectsBase {
  private controller: CountUpController | null = null;

  static get observedAttributes(): string[] {
    return ["value", "duration", "decimals", "prefix", "suffix"];
  }

  connectedCallback(): void {
    this.sync();
    this.controller = createCountUpController(this);
  }

  disconnectedCallback(): void {
    this.controller?.destroy();
    this.controller = null;
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnected) return;
    if (name === "value") this.textContent = this.getAttribute("value") || "0";
    if (name !== "value") this.syncDataset();
  }

  get value(): number {
    return Number(this.getAttribute("value")) || 0;
  }

  set value(next: number) {
    this.setAttribute("value", String(next));
  }

  /* The controller reads data-duration / data-decimals / data-prefix /
     data-suffix; translate the public attributes. */
  private syncDataset(): void {
    for (const attr of ["duration", "decimals", "prefix", "suffix"] as const) {
      const raw = this.getAttribute(attr);
      if (raw != null) this.dataset[attr] = raw;
      else delete this.dataset[attr];
    }
  }

  private sync(): void {
    this.syncDataset();
    if (!this.hasAttribute("value")) {
      this.setAttribute("value", this.textContent?.trim() || "0");
    } else {
      this.textContent = this.getAttribute("value") || "0";
    }
  }
}

/** Before/after comparison; consumers provide two panes, CE owns the range. */
export class BloraDiff extends EffectsBase {
  private controller: ImageDiffController | null = null;

  static get observedAttributes(): string[] {
    return ["value", "label"];
  }

  connectedCallback(): void {
    this.classList.add("blora-diff");
    this.render();
    this.controller = createImageDiffController(this);
  }

  disconnectedCallback(): void {
    this.controller?.destroy();
    this.controller = null;
  }

  attributeChangedCallback(): void {
    if (!this.isConnected) return;
    const input = this.querySelector<HTMLInputElement>(".blora-diff__range");
    if (input && this.hasAttribute("value")) input.value = this.getAttribute("value") || "50";
    if (input && this.getAttribute("label")) {
      input.setAttribute("aria-label", this.getAttribute("label") || "");
    }
    this.controller?.destroy();
    this.controller = createImageDiffController(this);
  }

  get value(): number {
    const input = this.querySelector<HTMLInputElement>(".blora-diff__range");
    return Number(input?.value ?? this.getAttribute("value") ?? 50);
  }

  set value(next: number) {
    this.setAttribute("value", String(next));
  }

  render(): void {
    const doc = this.ownerDocument;
    const panes = Array.from(this.children).filter(
      (child) =>
        child.localName === "blora-diff-before" ||
        child.localName === "blora-diff-after" ||
        child.hasAttribute("slot"),
    );
    if (panes.length >= 2) {
      const before = doc.createElement("div");
      before.className = "blora-diff__item blora-diff__item--before";
      before.dataset.bloraGenerated = "";
      const after = doc.createElement("div");
      after.className = "blora-diff__item";
      after.dataset.bloraGenerated = "";
      for (const pane of panes) {
        const target = pane.localName === "blora-diff-before" ? before : after;
        while (pane.firstChild) target.appendChild(pane.firstChild);
        pane.remove();
      }
      this.replaceChildren(...(panes.length ? [] : []), before, after);
    }

    if (!this.querySelector(".blora-diff__divider")) {
      const divider = doc.createElement("div");
      divider.className = "blora-diff__divider";
      divider.setAttribute("aria-hidden", "true");
      divider.dataset.bloraGenerated = "";
      this.append(divider);
    }
    if (!this.querySelector(".blora-diff__range")) {
      const input = doc.createElement("input");
      input.type = "range";
      input.min = "0";
      input.max = "100";
      input.value = this.getAttribute("value") || "50";
      input.className = "blora-diff__range";
      input.dataset.bloraGenerated = "";
      input.setAttribute("aria-label", this.getAttribute("label") || "对比位置");
      this.append(input);
    }
  }
}

/** Pointer/keyboard gallery; items stay consumer content. */
export class BloraHoverGallery extends EffectsBase {
  private controller: HoverGalleryController | null = null;

  connectedCallback(): void {
    this.classList.add("blora-hover-gallery");
    this.mount();
  }

  disconnectedCallback(): void {
    this.controller?.destroy();
    this.controller = null;
  }

  private mount(): void {
    this.controller?.destroy();
    for (const node of Array.from(this.children)) {
      if ((node as HTMLElement).hasAttribute("data-blora-generated")) continue;
      if (node.classList.contains("blora-hover-gallery__item")) continue;
      const item = this.ownerDocument.createElement("div");
      item.className = "blora-hover-gallery__item";
      item.dataset.bloraGenerated = "";
      while (node.firstChild) item.appendChild(node.firstChild);
      node.replaceWith(item);
    }
    this.controller = createHoverGalleryController(this);
  }
}

/** Tiled watermark overlay over consumer content. */
export class BloraWatermark extends EffectsBase {
  private controller: WatermarkController | null = null;

  static get observedAttributes(): string[] {
    return ["text"];
  }

  connectedCallback(): void {
    this.mount();
  }

  disconnectedCallback(): void {
    this.controller?.destroy();
    this.controller = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.mount();
  }

  get text(): string {
    return this.getAttribute("text") || "Blora";
  }

  set text(value: string) {
    this.setAttribute("text", value);
  }

  private mount(): void {
    this.controller?.destroy();
    this.setAttribute("data-text", this.text);
    this.controller = createWatermarkController(this);
  }
}

export const BLORA_TEXT_FX_TAG = "blora-text-fx";
export const BLORA_TEXT_ROTATE_TAG = "blora-text-rotate";
export const BLORA_COUNTDOWN_TAG = "blora-countdown";
export const BLORA_COUNT_UP_TAG = "blora-count-up";
export const BLORA_DIFF_TAG = "blora-diff";
export const BLORA_HOVER_GALLERY_TAG = "blora-hover-gallery";
export const BLORA_WATERMARK_TAG = "blora-watermark";

export function defineBloraEffectsElements(registry: CustomElementRegistry = customElements): void {
  if (!registry || typeof registry.define !== "function") return;
  const definitions: [string, CustomElementConstructor][] = [
    [BLORA_TEXT_FX_TAG, BloraTextFx],
    [BLORA_TEXT_ROTATE_TAG, BloraTextRotate],
    [BLORA_COUNTDOWN_TAG, BloraCountdown],
    [BLORA_COUNT_UP_TAG, BloraCountUp],
    [BLORA_DIFF_TAG, BloraDiff],
    [BLORA_HOVER_GALLERY_TAG, BloraHoverGallery],
    [BLORA_WATERMARK_TAG, BloraWatermark],
  ];
  for (const [tag, ctor] of definitions) {
    if (!registry.get(tag)) registry.define(tag, ctor);
  }
}

if (typeof customElements !== "undefined") defineBloraEffectsElements(customElements);
