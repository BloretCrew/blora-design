/**
 * BackTop: show after scroll threshold; click scrolls to top (v1 initBackTop / backTop).
 * Icon: v1 lucide-style arrow-up SVG (same path as legacy ensureGlobalBackTopFab).
 */
import { BloraElement } from "../../core/blora-element.js";
export declare const BLORA_BACKTOP_TAG = "blora-backtop";
export interface BackTopController {
    show(): void;
    hide(): void;
    destroy(): void;
}
export interface BackTopOptions {
    showAfter?: number;
    target?: HTMLElement | Window | null;
}
/** v1 FAB arrow-up path data (lucide-style). Exported for Story markup if needed. */
export declare const BACKTOP_ARROW_SVG = "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m5 12 7-7 7 7\"/><path d=\"M12 19V5\"/></svg>";
export declare function createBackTopController(btn: HTMLElement, options?: BackTopOptions): BackTopController;
/** Bind all [data-blora-backtop] / .blora-backtop in scope. */
export declare function initBackTop(root?: ParentNode): () => void;
/** Back-to-top CE backed by the existing scroll controller. */
export declare class BloraBacktop extends BloraElement {
    private controller;
    static get observedAttributes(): string[];
    attributeChangedCallback(): void;
    show(): void;
    hide(): void;
    protected render(): void;
    protected sync(): void;
    protected bindEvents(): void;
    protected onDisconnect(): void;
}
export declare function defineBloraBacktop(registry?: CustomElementRegistry): void;
//# sourceMappingURL=backtop.d.ts.map