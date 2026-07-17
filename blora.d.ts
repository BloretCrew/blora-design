declare namespace Blora {
  type Root = Document | DocumentFragment | Element;
  type ElementTarget = string | Element;

  interface Options {
    autoInit?: boolean;
    portalRoot?: string | Element | null;
    colorModeStorageKey?: string;
    paletteStorageKey?: string;
  }

  interface ToastOptions {
    message?: string;
    type?: "info" | "success" | "warning" | "danger";
    duration?: number;
  }

  interface PalettePreset {
    readonly name: string;
    readonly description: string;
    readonly colors: readonly string[];
  }

  interface ApplyPaletteOptions {
    persist?: boolean;
    emit?: boolean;
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
    readonly palettes: Readonly<Record<string, PalettePreset>>;
    configure(options?: Options): Options;
    setOptions(options?: Options): Options;
    init(root?: Root, options?: Options): void;
    applyPalette(name: string, target?: Element, options?: ApplyPaletteOptions): boolean;
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
