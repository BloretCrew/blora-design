declare namespace Blora {
  type Root = Document | DocumentFragment | Element;
  type ElementTarget = string | Element;
  type ColorMode = "system" | "light" | "dark";
  type ControlSize = "sm" | "md" | "lg";
  type SortDir = "asc" | "desc" | "";

  interface LocaleData {
    months: string[];
    dow: string[];
    year: string;
    today: string;
    clear: string;
    now: string;
    confirm: string;
    hour: string;
    minute: string;
  }

  /** 可扩展语言包：内置 zh-CN / en，可自定义任意 code */
  interface LocalePack extends Partial<LocaleData> {
    collator?: string;
    messages?: Record<string, string>;
  }

  interface Options {
    autoInit?: boolean;
    portalRoot?: string | Element | null;
    colorModeStorageKey?: string;
    paletteStorageKey?: string;
    size?: ControlSize;
    validateOn?: string;
    tablePageSize?: number;
    /**
     * 语言码字符串（如 "en" / "zh-CN"），
     * 或 LocalePack / 旧版 datepicker 字段对象。
     */
    locale?: string | LocalePack | Partial<LocaleData>;
    /** 与 locale 包配合的语言码（当 locale 为包对象时） */
    localeCode?: string;
    /**
     * 覆盖文案：支持 i18n key（validate.required）
     * 或旧短键（required / email / …）
     */
    messages?: Record<string, string>;
  }

  interface Config {
    autoInit: boolean;
    portalRoot: string | Element | null;
    colorModeStorageKey: string;
    paletteStorageKey: string;
    size: ControlSize | string;
    validateOn: string;
    tablePageSize: number;
    locale: string;
    messages: Record<string, string>;
    localeData: LocaleData;
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

  interface ApplyColorModeOptions {
    persist?: boolean;
    emit?: boolean;
  }

  interface Locale {
    months: string[];
    dow: string[];
    year: string;
    today: string;
    clear: string;
    now: string;
    confirm: string;
    hour: string;
    minute: string;
  }

  interface FieldValidationResult {
    valid: boolean;
    field: Element;
    message: string;
  }

  interface FormValidationResult {
    valid: boolean;
    errors: FieldValidationResult[];
  }

  interface TableState {
    page: number;
    pageSize: number;
    sortKey: string;
    sortDir: SortDir | string;
    total: number;
  }

  interface TableAPI {
    sort(target: ElementTarget, keyOrIndex: string | number, dir?: SortDir): TableState | null;
    setPage(target: ElementTarget, page: number): TableState | null;
    getState(target: ElementTarget): TableState | null;
    renderPagination(nav: Element): void;
  }

  interface API {
    readonly version: string;
    /** 当前语言的日期字段（与 setLocale 同步，可被业务只读使用） */
    readonly locale: Locale;
    readonly locales: string[];
    readonly palettes: Readonly<Record<string, PalettePreset>>;
    readonly table: TableAPI;
    configure(options?: Options): Config;
    setOptions(options?: Options): Config;
    getConfig(): Config;
    init(root?: Root, options?: Options): void;
    applyPalette(name: string, target?: Element, options?: ApplyPaletteOptions): boolean;
    getPalette(target?: Element): string;
    applyColorMode(mode: ColorMode, target?: Element, options?: ApplyColorModeOptions): boolean;
    getColorMode(target?: Element): ColorMode;
    formatShortcut(shortcut: string, platform?: string): string;
    getShortcutPlatform(base?: Element): string;
    /** 翻译框架文案 key，如 t("validate.required")、t("pagination.page", { n: 2 }) */
    t(key: string, params?: Record<string, string | number>): string;
    /** 切换语言：内置 "zh-CN" | "en"，或任意 code + 自定义 pack */
    setLocale(code: string, pack?: LocalePack): string;
    getLocale(): string;
    validate(form: ElementTarget): FormValidationResult;
    validateField(field: Element): FieldValidationResult;
    clearValidation(form: ElementTarget): void;
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
