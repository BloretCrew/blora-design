declare namespace Blora {
  type Root = Document | DocumentFragment | Element;
  type ElementTarget = string | Element;

  interface Options {
    autoInit?: boolean;
    portalRoot?: string | Element | null;
    storageKey?: string;
    themeStorageKey?: string;
    paletteStorageKey?: string;
  }

  interface ToastOptions {
    message?: string;
    type?: "info" | "success" | "warning" | "danger";
    duration?: number;
  }

  interface ThemePreset {
    readonly name: string;
    readonly description: string;
    readonly defaultPalette: string;
    readonly traits: readonly string[];
  }

  interface PalettePreset {
    readonly name: string;
    readonly description: string;
    readonly colors: readonly string[];
  }

  interface ApplyThemeOptions {
    persist?: boolean;
    emit?: boolean;
    applyDefaultPalette?: boolean;
  }

  interface Locale {
    months: readonly string[];
    dow: readonly string[];
    year: string;
    today: string;
    clear: string;
    now: string;
    confirm: string;
    hour: string;
    minute: string;
  }

  interface API {
    readonly version: string;
    readonly locale: Locale;
    readonly themes: Readonly<Record<string, ThemePreset>>;
    readonly palettes: Readonly<Record<string, PalettePreset>>;
    configure(options?: Options): Options;
    setOptions(options?: Options): Options;
    init(root?: Root, options?: Options): void;
    applyTheme(name: string, target?: Element, options?: ApplyThemeOptions): boolean;
    getTheme(target?: Element): string;
    applyPalette(name: string, target?: Element, options?: ApplyThemeOptions): boolean;
    getPalette(target?: Element): string;
    toast(options: string | ToastOptions): void;
    openModal(target: ElementTarget): void;
    closeModal(target: ElementTarget): void;
    openDrawer(target: ElementTarget): void;
    closeDrawer(target: ElementTarget): void;
  }
}

declare const Blora: Blora.API;

export = Blora;
export as namespace Blora;
