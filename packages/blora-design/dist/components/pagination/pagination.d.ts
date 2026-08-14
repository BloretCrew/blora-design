/**
 * Pagination: keyboard/click active page + prev/next.
 */
import { BloraElement } from "../../core/blora-element.js";
export declare const BLORA_PAGINATION_TAG = "blora-pagination";
export interface PaginationController {
    destroy(): void;
}
export type PaginationItem = number | "ellipsis";
/** Mirrors the v1 pagination window: boundaries plus a centred range around the current page. */
export declare function buildPaginationItems(page: number, total: number, maxVisible?: number): PaginationItem[];
export declare function createPaginationController(root: HTMLElement): PaginationController;
/** Pagination CE that generates accessible page and navigation buttons. */
export declare class BloraPagination extends BloraElement {
    private controller;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string): void;
    get page(): number;
    set page(page: number);
    protected render(): void;
    protected bindEvents(): void;
    protected onDisconnect(): void;
    private createNav;
}
export declare function defineBloraPagination(registry?: CustomElementRegistry): void;
//# sourceMappingURL=pagination.d.ts.map