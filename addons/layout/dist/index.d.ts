/**
 * Blora Design 2.0 - Layout add-on.
 * Sidebar layout, affix, anchor, scroll-spy, smooth-scroll.
 * Spec §9: not bundled into core.
 * @packageDocumentation
 */
export interface Destroyable {
    destroy(): void;
}
export interface SidebarLayoutController extends Destroyable {
    open(): void;
    close(): void;
}
export declare const BLORA_SIDEBAR_LAYOUT_TAG = "blora-sidebar-layout";
declare const LayoutBase: typeof HTMLElement;
/** Responsive sidebar shell that owns its toggle, mask, aside and content tree. */
export declare class BloraSidebarLayout extends LayoutBase {
    private controller;
    private definitions;
    private observer;
    private connectScheduled;
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(): void;
    open(): void;
    close(): void;
    private captureDefinitions;
    private mount;
}
export declare function defineBloraSidebarLayout(registry?: CustomElementRegistry): void;
export type AffixController = Destroyable;
export declare function createAffixController(root: HTMLElement): AffixController;
export type AnchorController = Destroyable;
export declare function createAnchorController(root: HTMLElement): AnchorController;
export type ScrollSpyController = Destroyable;
export declare function createScrollSpyController(root: HTMLElement): ScrollSpyController;
/** Install global smooth in-page anchor scrolling once. */
export declare function initSmoothScroll(doc?: Document): () => void;
export {};
//# sourceMappingURL=index.d.ts.map