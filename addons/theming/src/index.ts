/**
 * Blora Design 2.0 - Theming add-on (palette picker).
 * Applies `data-blora-theme` on documentElement (v2 token themes).
 * @packageDocumentation
 */

import { createBloraIcon } from "@bloret-crew/blora-design";

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
  indigo: {
    name: "Indigo",
    description: "冷灰基底与沉静蓝",
    colors: ["#F4F5F8", "#405D87", "#55756F", "#A74B52", "#AF8A55"],
  },
  lotus: {
    name: "Lotus",
    description: "柔和粉紫与低饱和绿",
    colors: ["#F8F4F6", "#9A466A", "#55786B", "#526078", "#B28A59"],
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

const SCHEME_KEY = "blora-color-scheme";

export type ColorScheme = "light" | "dark";

export function getColorScheme(el: HTMLElement = document.documentElement): ColorScheme {
  const v = el.getAttribute("data-blora-color-scheme");
  return v === "dark" ? "dark" : "light";
}

function clearMirroredScheme(doc: Document, scheme?: ColorScheme): void {
  const body = doc.body;
  if (body) {
    body.style.backgroundColor = "";
    body.style.color = "";
    body.removeAttribute("data-blora-color-scheme");
    if (scheme) body.style.colorScheme = scheme;
  }
  for (const node of doc.querySelectorAll<HTMLElement>(".blora-scope")) {
    node.removeAttribute("data-blora-color-scheme");
    if (scheme) node.style.colorScheme = scheme;
  }
}

/** Explicit light/dark. Always set attribute so OS prefers-color-scheme cannot fight Storybook. */
export function applyColorScheme(
  scheme: ColorScheme,
  el: HTMLElement = document.documentElement,
  options?: { persist?: boolean; emit?: boolean },
): void {
  if (typeof document === "undefined") return;
  const doc = el.ownerDocument ?? document;
  el.setAttribute("data-blora-color-scheme", scheme);
  el.style.colorScheme = scheme;
  /* Keep scheme on :root only. Stamping it on body re-applies the unthemed
     coral pack there and shadows data-blora-theme on html. */
  clearMirroredScheme(doc, scheme);
  if (options?.persist !== false) {
    try {
      localStorage.setItem(SCHEME_KEY, scheme);
    } catch {
      /* ignore */
    }
  }
  if (options?.emit !== false) {
    el.dispatchEvent(
      new CustomEvent("blora-color-scheme-change", {
        bubbles: true,
        detail: { scheme },
      }),
    );
  }
}

export function applyTheme(
  theme: string,
  el: HTMLElement = document.documentElement,
  options?: { persist?: boolean; emit?: boolean },
): void {
  if (typeof document === "undefined") return;
  const key = THEME_PRESETS[theme] ? theme : "coral";
  el.setAttribute("data-blora-theme", key);
  clearMirroredScheme(el.ownerDocument ?? document);
  /* Keep an explicit scheme so theme packs don't half-apply dark text on light canvas */
  if (!el.hasAttribute("data-blora-color-scheme")) {
    applyColorScheme("light", el, { persist: false, emit: false });
  }
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
  /* Prefer existing explicit scheme; otherwise light (avoid OS dark bleaching Storybook) */
  let scheme: ColorScheme = getColorScheme(el);
  try {
    const s = localStorage.getItem(SCHEME_KEY);
    if (!el.hasAttribute("data-blora-color-scheme") && (s === "dark" || s === "light")) {
      scheme = s;
    }
  } catch {
    /* ignore */
  }
  if (!el.hasAttribute("data-blora-color-scheme")) {
    applyColorScheme(scheme, el, { persist: false, emit: false });
  }
  applyTheme(saved, el, { persist: false, emit: false });
  return saved;
}

interface PalettePickerController {
  close(): void;
  destroy(): void;
  open(): void;
}

/** Build menu cards if empty; wire open/close and theme apply. */
function mountPalettePicker(root: HTMLElement): PalettePickerController {
  if (typeof document === "undefined")
    return { close: () => {}, destroy: () => {}, open: () => {} };
  const doc = root.ownerDocument;
  const trigger = root.querySelector<HTMLElement>(
    "[data-blora-palette-trigger], .blora-palette-picker__trigger",
  );
  let menu = root.querySelector<HTMLElement>(".blora-palette-picker__menu");
  if (!trigger) return { close: () => {}, destroy: () => {}, open: () => {} };

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
    const head = doc.createElement("div");
    head.className = "blora-palette-picker__head";
    const title = doc.createElement("span");
    title.className = "blora-palette-picker__title";
    title.textContent = "主题配色";
    const hint = doc.createElement("span");
    hint.className = "blora-palette-picker__hint";
    hint.textContent = "选择一套调色板";
    head.append(title, hint);
    const list = doc.createElement("div");
    list.className = "blora-palette-picker__list";
    for (const [key, preset] of Object.entries(THEME_PRESETS)) {
      const btn = doc.createElement("button");
      btn.className = "blora-palette-card";
      btn.type = "button";
      btn.setAttribute("role", "option");
      btn.setAttribute("data-blora-palette-option", key);
      const copy = doc.createElement("span");
      copy.className = "blora-palette-card__copy";
      const name = doc.createElement("span");
      name.className = "blora-palette-card__name";
      name.textContent = preset.name;
      const desc = doc.createElement("span");
      desc.className = "blora-palette-card__desc";
      desc.textContent = preset.description;
      copy.append(name, desc);
      const colors = doc.createElement("span");
      colors.className = "blora-palette-card__colors";
      colors.setAttribute("aria-hidden", "true");
      for (const color of preset.colors) {
        const swatch = doc.createElement("span");
        swatch.className = "blora-palette-card__color";
        swatch.style.background = color;
        colors.append(swatch);
      }
      btn.append(copy, colors);
      list.append(btn);
    }
    menu.replaceChildren(head, list);
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

  const clearMenuPlace = () => {
    menu.style.removeProperty("position");
    menu.style.removeProperty("top");
    menu.style.removeProperty("left");
    menu.style.removeProperty("right");
    menu.style.removeProperty("width");
    menu.style.removeProperty("max-width");
  };

  const placeMenu = () => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(max-width: 560px)").matches
    ) {
      clearMenuPlace();
      return;
    }
    const triggerRect = trigger.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;
    const pad = 16;
    const top = triggerRect.bottom + 8;
    const preferEnd = (triggerRect.left + triggerRect.right) / 2 > window.innerWidth / 2;
    const fitsStart = triggerRect.left + menuWidth <= window.innerWidth - pad;
    const fitsEnd = triggerRect.right - menuWidth >= pad;
    const alignEnd = preferEnd ? fitsEnd || !fitsStart : !fitsStart && fitsEnd;
    menu.style.position = "fixed";
    menu.style.top = `${Math.max(pad, top)}px`;
    if (alignEnd) {
      menu.style.left = "auto";
      menu.style.right = `${Math.max(pad, window.innerWidth - triggerRect.right)}px`;
    } else {
      menu.style.left = `${Math.max(pad, triggerRect.left)}px`;
      menu.style.right = "auto";
    }
  };

  const open = (focus = false) => {
    doc.querySelectorAll<HTMLElement>("[data-blora-palette-picker][data-open]").forEach((other) => {
      if (other === root) return;
      other.removeAttribute("data-open");
      other
        .querySelector("[data-blora-palette-trigger], .blora-palette-picker__trigger")
        ?.setAttribute("aria-expanded", "false");
      const otherMenu = other.querySelector<HTMLElement>(".blora-palette-picker__menu");
      if (!otherMenu) return;
      otherMenu.style.removeProperty("position");
      otherMenu.style.removeProperty("top");
      otherMenu.style.removeProperty("left");
      otherMenu.style.removeProperty("right");
      otherMenu.style.removeProperty("width");
      otherMenu.style.removeProperty("max-width");
    });
    root.setAttribute("data-open", "");
    trigger.setAttribute("aria-expanded", "true");
    placeMenu();
    if (focus) {
      const opts = options();
      (opts.find((o) => o.getAttribute("aria-selected") === "true") || opts[0])?.focus();
    }
  };

  let placeClearTimer = 0;
  const finishClosePlace = () => {
    window.clearTimeout(placeClearTimer);
    placeClearTimer = 0;
    if (!root.hasAttribute("data-open")) clearMenuPlace();
  };

  const close = (restore = false) => {
    root.removeAttribute("data-open");
    trigger.setAttribute("aria-expanded", "false");
    /* Keep position:fixed through the fade-out. Reverting to absolute while
       the menu is still visible makes clipped parents jump in height. */
    menu.addEventListener("transitionend", finishClosePlace, { once: true });
    window.clearTimeout(placeClearTimer);
    placeClearTimer = window.setTimeout(finishClosePlace, 320);
    if (restore) trigger.focus();
  };

  const onTrigger = (e: MouseEvent) => {
    e.stopPropagation();
    if (root.hasAttribute("data-open")) close();
    else open();
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
  const onReposition = () => {
    if (root.hasAttribute("data-open")) placeMenu();
  };

  trigger.addEventListener("click", onTrigger);
  trigger.addEventListener("keydown", onTriggerKey);
  menu.addEventListener("click", onMenuClick);
  menu.addEventListener("keydown", onMenuKey);
  doc.addEventListener("click", onDoc);
  doc.documentElement.addEventListener("blora-theme-change", onTheme);
  window.addEventListener("resize", onReposition);
  window.addEventListener("scroll", onReposition, true);
  sync();

  return {
    close: () => close(true),
    destroy() {
      window.clearTimeout(placeClearTimer);
      trigger.removeEventListener("click", onTrigger);
      trigger.removeEventListener("keydown", onTriggerKey);
      menu!.removeEventListener("click", onMenuClick);
      menu!.removeEventListener("keydown", onMenuKey);
      menu!.removeEventListener("transitionend", finishClosePlace);
      doc.removeEventListener("click", onDoc);
      doc.documentElement.removeEventListener("blora-theme-change", onTheme);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    },
    open: () => open(true),
  };
}

export const BLORA_PALETTE_PICKER_TAG = "blora-palette-picker";
export const BLORA_COLOR_SCHEME_TOGGLE_TAG = "blora-color-scheme-toggle";

const ThemingBase: typeof HTMLElement =
  typeof HTMLElement !== "undefined" ? HTMLElement : (class {} as typeof HTMLElement);

/** Self-rendering theme palette picker. */
export class BloraPalettePicker extends ThemingBase {
  private controller: PalettePickerController | null = null;

  static get observedAttributes(): string[] {
    return ["button-variant", "size"];
  }

  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    this.controller?.destroy();
    this.controller = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  open(): void {
    this.controller?.open();
  }

  close(): void {
    this.controller?.close();
  }

  private render(): void {
    this.controller?.destroy();
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-palette-picker";
    root.dataset.bloraGenerated = "";
    const trigger = this.ownerDocument.createElement("button");
    trigger.type = "button";
    trigger.className = "blora-button blora-palette-picker__trigger";
    trigger.dataset.variant = this.getAttribute("button-variant") ?? "outline";
    trigger.dataset.size = this.getAttribute("size") ?? "sm";
    trigger.dataset.bloraPaletteTrigger = "";
    trigger.appendChild(createBloraIcon("palette", 18, this.ownerDocument));
    const label = this.ownerDocument.createElement("span");
    label.className = "blora-palette-picker__label";
    label.textContent =
      THEME_PRESETS[getTheme(this.ownerDocument.documentElement)]?.name ?? "Coral";
    trigger.appendChild(label);
    const menu = this.ownerDocument.createElement("div");
    menu.className = "blora-palette-picker__menu";
    root.append(trigger, menu);
    this.replaceChildren(root);
    this.controller = mountPalettePicker(root);
  }
}

/** Self-rendering light/dark scheme button. */
export class BloraColorSchemeToggle extends ThemingBase {
  private readonly sync = () => this.render();

  static get observedAttributes(): string[] {
    return ["button-variant", "size"];
  }

  connectedCallback(): void {
    this.ownerDocument.documentElement.addEventListener("blora-color-scheme-change", this.sync);
    this.render();
  }

  disconnectedCallback(): void {
    this.ownerDocument.documentElement.removeEventListener("blora-color-scheme-change", this.sync);
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  private render(): void {
    const scheme = getColorScheme(this.ownerDocument.documentElement);
    const button = this.ownerDocument.createElement("button");
    button.type = "button";
    button.className = "blora-button blora-color-scheme-toggle__button";
    button.dataset.variant = this.getAttribute("button-variant") ?? "ghost";
    button.dataset.size = this.getAttribute("size") ?? "sm";
    button.setAttribute("aria-label", scheme === "dark" ? "切换为亮色主题" : "切换为暗色主题");
    button.appendChild(createBloraIcon(scheme === "dark" ? "sun" : "moon", 18, this.ownerDocument));
    button.addEventListener("click", () => {
      applyColorScheme(scheme === "dark" ? "light" : "dark", this.ownerDocument.documentElement);
    });
    this.replaceChildren(button);
  }
}

export function defineBloraThemingElements(registry: CustomElementRegistry = customElements): void {
  if (!registry.get(BLORA_PALETTE_PICKER_TAG)) {
    registry.define(BLORA_PALETTE_PICKER_TAG, BloraPalettePicker);
  }
  if (!registry.get(BLORA_COLOR_SCHEME_TOGGLE_TAG)) {
    registry.define(BLORA_COLOR_SCHEME_TOGGLE_TAG, BloraColorSchemeToggle);
  }
}

if (typeof customElements !== "undefined") defineBloraThemingElements(customElements);
