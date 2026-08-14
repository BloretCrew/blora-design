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
export declare const THEME_PRESETS: Record<string, ThemePreset>;
export declare function getTheme(el?: HTMLElement): string;
export type ColorScheme = "light" | "dark";
export declare function getColorScheme(el?: HTMLElement): ColorScheme;
/** Explicit light/dark. Always set attribute so OS prefers-color-scheme cannot fight Storybook. */
export declare function applyColorScheme(scheme: ColorScheme, el?: HTMLElement, options?: {
    persist?: boolean;
    emit?: boolean;
}): void;
export declare function applyTheme(theme: string, el?: HTMLElement, options?: {
    persist?: boolean;
    emit?: boolean;
}): void;
export declare function bootThemeFromStorage(el?: HTMLElement): string;
export declare const BLORA_PALETTE_PICKER_TAG = "blora-palette-picker";
export declare const BLORA_COLOR_SCHEME_TOGGLE_TAG = "blora-color-scheme-toggle";
declare const ThemingBase: typeof HTMLElement;
/** Self-rendering theme palette picker. */
export declare class BloraPalettePicker extends ThemingBase {
    private controller;
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(): void;
    open(): void;
    close(): void;
    private render;
}
/** Self-rendering light/dark scheme button. */
export declare class BloraColorSchemeToggle extends ThemingBase {
    private readonly sync;
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(): void;
    private render;
}
export declare function defineBloraThemingElements(registry?: CustomElementRegistry): void;
export {};
//# sourceMappingURL=index.d.ts.map