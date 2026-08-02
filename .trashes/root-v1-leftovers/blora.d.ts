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
    /** 动态生成 class 前缀，默认 blora */
    classPrefix?: string;
    tableColsStorageKey?: string;
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
    setRows(target: ElementTarget, rows: unknown[], options?: { keys?: string[]; page?: number }): TableState | null;
    setLoading(target: ElementTarget, loading: boolean): TableState | null;
    getSelection(target: ElementTarget): Element[];
    clearSelection(target: ElementTarget): void;
    getState(target: ElementTarget): TableState | null;
    renderPagination(nav: Element): void;
  }

  interface SelectAPI {
    setOptions(target: ElementTarget, options: Array<string | { value?: string; label?: string; disabled?: boolean; selected?: boolean }>): Element | null;
  }

  interface API {
    readonly version: string;
    /** 当前语言的日期字段（与 setLocale 同步，可被业务只读使用） */
    readonly locale: Locale;
    readonly locales: string[];
    readonly palettes: Readonly<Record<string, PalettePreset>>;
    readonly table: TableAPI;
    readonly select: SelectAPI;
    /** 拼接 classPrefix：Blora.cls("table", "table--striped") */
    cls(...parts: string[]): string;
    classPrefix(): string;
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
    validateAsync(form: ElementTarget): Promise<FormValidationResult>;
    validateField(field: Element): FieldValidationResult;
    validateFieldAsync(field: Element): Promise<FieldValidationResult>;
    clearValidation(form: ElementTarget): void;
    getValues(form: ElementTarget): Record<string, unknown>;
    setValues(form: ElementTarget, values: Record<string, unknown>): Record<string, unknown>;
    registerAsyncRule(name: string, fn: (value: string, field: Element) => unknown): void;
    toast(options: string | ToastOptions): void;
    /** toast 别名 */
    message(options: string | ToastOptions): void;
    notify(options: string | NotifyOptions): { close: () => void; el: Element } | null;
    confirm(options?: ConfirmOptions): Promise<boolean>;
    preview(target: ElementTarget | Element[], options?: Record<string, unknown>): void;
    closePreview(): void;
    tour(options?: Record<string, unknown>): void;
    backTop(options?: { el?: ElementTarget; showAfter?: number; target?: string }): Element | null;
    qrcode(target: ElementTarget, options?: { text?: string; value?: string; size?: number }): void;
    openModal(target: ElementTarget): void;
    closeModal(target: ElementTarget): void;
    openDrawer(target: ElementTarget): void;
    closeDrawer(target: ElementTarget): void;
    /** 文字效果名：grow | shrink | shake | nod | explode | ripple | bloom | jitter */
    readonly textFxNames: readonly string[];
    /** 对任意文本节点播放文字效果 */
    textFx(target: ElementTarget, name?: string, options?: { play?: boolean; loop?: boolean }): Element | null;
    /** Markdown → HTML（字符串） */
    markdown(source: string, options?: { inline?: boolean }): string;
    md(source: string, options?: { inline?: boolean }): string;
    /** 把 Markdown 渲染进元素（data-blora-md） */
    renderMarkdown(el: ElementTarget, source?: string, options?: { inline?: boolean }): Element | null;
  }

  interface NotifyOptions {
    type?: "info" | "success" | "warning" | "danger";
    title?: string;
    description?: string;
    message?: string;
    duration?: number;
    placement?: string;
  }

  interface ConfirmOptions {
    title?: string;
    content?: string;
    message?: string;
    okText?: string;
    cancelText?: string;
    danger?: boolean;
    onOk?: () => void;
    onCancel?: () => void;
  }
}

declare const Blora: Blora.API;

export = Blora;
export as namespace Blora;
