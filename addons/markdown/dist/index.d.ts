/**
 * Blora Design 2.0 - Markdown rendering add-on.
 * Spec §9: Add-on package, not bundled into core.
 * Spec §17.6: API must require explicit security policy.
 * Visual baseline: legacy/v1/blora.js lines 5755-5900.
 * @packageDocumentation
 */
export interface MarkdownOptions {
    /**
     * Escape all HTML in source (default: true).
     * When true, all user input is escaped via escapeHTML before rendering.
     * Setting to false is DANGEROUS - only use with trusted input.
     */
    sanitize?: boolean;
    /**
     * Allow raw HTML tags in source (default: false).
     * When false, raw HTML is escaped and displayed as text.
     * When true, raw HTML passes through - DANGEROUS, user must explicitly opt in.
     */
    allowHtml?: boolean;
    /** Render inline-only (no block elements like headings, lists, etc.) */
    inline?: boolean;
}
/**
 * Render Markdown source to an HTML string.
 *
 * Security: By default, all HTML in the source is escaped.
 * To allow raw HTML, explicitly set `allowHtml: true` (DANGEROUS).
 *
 * @param source - Markdown source text
 * @param options - Security and rendering options
 * @returns HTML string
 */
export declare function renderMarkdown(source: string, options?: MarkdownOptions): string;
/**
 * Render Markdown source and set it as innerHTML on an element.
 *
 * Security: By default, all HTML in the source is escaped.
 * To allow raw HTML, explicitly set `allowHtml: true` (DANGEROUS).
 *
 * @param element - Target element to receive rendered HTML
 * @param source - Markdown source text
 * @param options - Security and rendering options
 */
export declare function renderMarkdownTo(element: HTMLElement, source: string, options?: MarkdownOptions): void;
export interface MarkdownController {
    render(source?: string): void;
    destroy(): void;
}
/**
 * Bind markdown source from element text/data-src (v1 initMarkdown primary path).
 */
export declare function createMarkdownController(element: HTMLElement, options?: MarkdownOptions): MarkdownController;
/** Initialize all [data-blora-markdown] nodes under root. */
export declare function initMarkdown(root?: ParentNode, options?: MarkdownOptions): () => void;
//# sourceMappingURL=index.d.ts.map