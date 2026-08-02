/**
 * Blora Design 2.0 - Theming add-on (palette picker).
 * Applies `data-blora-theme` on documentElement (v2 token themes).
 * @packageDocumentation
 */

export interface ThemePreset {
  name: string;
  description: string;
  /** Swatch colors for the card UI only */
  colors: string[];
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  coral: {
    name: "Coral",
    description: "深靛灰与柔和珊瑚红",
    colors: ["#FAF7F8", "#303143", "#9F5964", "#5D6680", "#5B756B"],
  },
  cinnabar: {
    name: "丹砂",
    description: "暖白基底与低饱和红",
    colors: ["#F8F4EC", "#A0392E", "#3D4A5C", "#5A7B6B", "#B89968"],
  },
  indigo: {
    name: "靛青",
    description: "冷灰基底与沉静蓝",
    colors: ["#F4F5F8", "#405D87", "#55756F", "#A74B52", "#AF8A55"],
  },
  lotus: {
    name: "藕荷",
    description: "柔和粉紫与低饱和绿",
    colors: ["#F8F4F6", "#9A466A", "#55786B", "#526078", "#B28A59"],
  },
  ocean: {
    name: "海盐",
    description: "清爽青蓝与低饱和绿",
    colors: ["#F1F7F6", "#176B78", "#39745F", "#365D78", "#B08A55"],
  },
  graphite: {
    name: "Graphite",
    description: "冷灰界面与低饱和钢蓝",
    colors: ["#F6F7F8", "#171A1F", "#4F6578", "#596A86", "#5B756B"],
  },
  mono: {
    name: "Mono",
    description: "纯中性灰与近黑主色",
    colors: ["#FAFAF9", "#111110", "#34363A", "#5E6672", "#616D67"],
  },
  circuit: {
    name: "Circuit",
    description: "碳灰界面与克制青色",
    colors: ["#F4F5F5", "#161A1A", "#3E6C70", "#536D7D", "#4F7368"],
  },
  dusk: {
    name: "Dusk",
    description: "暮色灰紫",
    colors: ["#F6F4F8", "#3A3548", "#7A6B8A", "#5A6B7A", "#8A7A6A"],
  },
};

const STORAGE_KEY = "blora-theme";

export function getTheme(el: HTMLElement = document.documentElement): string {
  return el.getAttribute("data-blora-theme") || "coral";
}

export function applyTheme(
  theme: string,
  el: HTMLElement = document.documentElement,
  options?: { persist?: boolean; emit?: boolean },
): void {
  if (typeof document === "undefined") return;
  const key = THEME_PRESETS[theme] ? theme : "coral";
  el.setAttribute("data-blora-theme", key);
  if (options?.persist !== false) {
    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {
      /* ignore */
    }
  }
  if (options?.emit !== false) {
    el.dispatchEvent(
      new CustomEvent("blora-theme-change", { bubbles: true, detail: { theme: key } }),
    );
  }
}

export function bootThemeFromStorage(el: HTMLElement = document.documentElement): string {
  let saved = "coral";
  try {
    saved = localStorage.getItem(STORAGE_KEY) || saved;
  } catch {
    /* ignore */
  }
  if (!THEME_PRESETS[saved]) saved = "coral";
  applyTheme(saved, el, { persist: false, emit: false });
  return saved;
}

export interface PalettePickerController {
  destroy(): void;
}

function escapeHTML(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Build menu cards if empty; wire open/close and theme apply. */
export function createPalettePickerController(root: HTMLElement): PalettePickerController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const doc = root.ownerDocument;
  const trigger = root.querySelector<HTMLElement>(
    "[data-blora-palette-trigger], .blora-palette-picker__trigger",
  );
  let menu = root.querySelector<HTMLElement>(".blora-palette-picker__menu");
  if (!trigger) return { destroy: () => {} };

  if (!menu) {
    menu = doc.createElement("div");
    menu.className = "blora-palette-picker__menu";
    root.appendChild(menu);
  }

  bootThemeFromStorage(doc.documentElement);

  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  menu.setAttribute("role", "listbox");
  menu.setAttribute("aria-label", "主题配色");

  if (!menu.querySelector("[data-blora-palette-option]")) {
    menu.innerHTML =
      `<div class="blora-palette-picker__head">` +
      `<span class="blora-palette-picker__title">主题配色</span>` +
      `<span class="blora-palette-picker__hint">选择一套调色板</span>` +
      `</div><div class="blora-palette-picker__list">` +
      Object.entries(THEME_PRESETS)
        .map(
          ([key, preset]) =>
            `<button class="blora-palette-card" type="button" role="option" data-blora-palette-option="${key}">` +
            `<span class="blora-palette-card__copy">` +
            `<span class="blora-palette-card__name">${escapeHTML(preset.name)}</span>` +
            `<span class="blora-palette-card__desc">${escapeHTML(preset.description)}</span>` +
            `</span><span class="blora-palette-card__colors" aria-hidden="true">` +
            preset.colors
              .map(
                (color) =>
                  `<span class="blora-palette-card__color" style="background:${color}"></span>`,
              )
              .join("") +
            `</span></button>`,
        )
        .join("") +
      `</div>`;
  }

  const options = () =>
    Array.from(menu!.querySelectorAll<HTMLElement>("[data-blora-palette-option]"));

  const sync = () => {
    const current = getTheme(doc.documentElement);
    options().forEach((option) =>
      option.setAttribute(
        "aria-selected",
        String(option.getAttribute("data-blora-palette-option") === current),
      ),
    );
    const label = trigger.querySelector(".blora-palette-picker__label");
    if (label && THEME_PRESETS[current]) label.textContent = THEME_PRESETS[current]!.name;
  };

  const open = (focus = false) => {
    doc.querySelectorAll<HTMLElement>("[data-blora-palette-picker].is-open, .blora-palette-picker.is-open").forEach(
      (other) => {
        if (other === root) return;
        other.classList.remove("is-open");
        other
          .querySelector("[data-blora-palette-trigger], .blora-palette-picker__trigger")
          ?.setAttribute("aria-expanded", "false");
      },
    );
    root.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    if (focus) {
      const opts = options();
      (opts.find((o) => o.getAttribute("aria-selected") === "true") || opts[0])?.focus();
    }
  };

  const close = (restore = false) => {
    root.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    if (restore) trigger.focus();
  };

  const onTrigger = (e: MouseEvent) => {
    e.stopPropagation();
    root.classList.contains("is-open") ? close() : open();
  };
  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      open(true);
    }
  };
  const onMenuClick = (e: MouseEvent) => {
    const option = (e.target as HTMLElement).closest<HTMLElement>("[data-blora-palette-option]");
    if (!option) return;
    applyTheme(option.getAttribute("data-blora-palette-option") || "coral", doc.documentElement);
    sync();
    close(true);
  };
  const onMenuKey = (e: KeyboardEvent) => {
    const opts = options();
    const current = opts.indexOf(doc.activeElement as HTMLElement);
    let next = current;
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      next = (current + 1 + opts.length) % opts.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      next = (current - 1 + opts.length) % opts.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = opts.length - 1;
    else if (e.key === "Escape") {
      e.preventDefault();
      close(true);
      return;
    } else return;
    e.preventDefault();
    opts[next]?.focus();
  };
  const onDoc = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) close();
  };
  const onTheme = () => sync();

  trigger.addEventListener("click", onTrigger);
  trigger.addEventListener("keydown", onTriggerKey);
  menu.addEventListener("click", onMenuClick);
  menu.addEventListener("keydown", onMenuKey);
  doc.addEventListener("click", onDoc);
  doc.documentElement.addEventListener("blora-theme-change", onTheme);
  sync();

  return {
    destroy() {
      trigger.removeEventListener("click", onTrigger);
      trigger.removeEventListener("keydown", onTriggerKey);
      menu!.removeEventListener("click", onMenuClick);
      menu!.removeEventListener("keydown", onMenuKey);
      doc.removeEventListener("click", onDoc);
      doc.documentElement.removeEventListener("blora-theme-change", onTheme);
    },
  };
}
