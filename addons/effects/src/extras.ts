/**
 * Effects add-on extras (migrated from core / v1).
 * text-rotate, countdown, countup, image-diff, hover-gallery, watermark, shortcuts
 */

export interface Destroyable {
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
      item.classList.toggle("is-active", index === 0);
      item.toggleAttribute("data-active", index === 0);
      item.setAttribute("aria-hidden", String(index !== 0));
    });
    return { destroy: () => {} };
  }

  const win = root.ownerDocument.defaultView!;
  const duration = Math.max(1200, Number(root.dataset.interval) || 3200);
  let active = Math.max(
    0,
    items.findIndex(
      (item) => item.classList.contains("is-active") || item.hasAttribute("data-active"),
    ),
  );
  let timer: number | null = null;

  const setActive = (index: number) => {
    active = ((index % items.length) + items.length) % items.length;
    items.forEach((item, i) => {
      const on = i === active;
      item.classList.toggle("is-active", on);
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
    for (let i = 0; i < items.length; i++) {
      progress.appendChild(doc.createElement("span"));
    }
    root.appendChild(progress);
  }
  const indicators = Array.from(progress.querySelectorAll("span"));
  const last = items.length - 1;
  let active = Math.max(
    0,
    items.findIndex((item) => item.classList.contains("is-active")),
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
      item.classList.toggle("is-active", i === active);
      item.setAttribute("aria-hidden", String(i !== active));
    });
    indicators.forEach((item, i) => item.classList.toggle("is-active", i === active));
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
