/**
 * Blora Design 2.0 - Dialog Web Component
 * Spec §12: Overlay system, §12.4: Dialog acceptance criteria
 */
import { BloraElement } from "../../core/blora-element.js";
export declare const BLORA_DIALOG_TAG = "blora-dialog";
export interface BloraDialogOpenDetail {
    source: string;
    reason: string;
}
export interface BloraDialogCloseDetail {
    source: string;
    reason: string;
    returnValue?: unknown;
}
export declare class BloraDialog extends BloraElement {
    private overlay;
    private closeAnimationTimer;
    private visible;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, _old: string, value: string): void;
    protected render(): void;
    private _shadow;
    private _panel;
    private _backdrop;
    private _closeButton;
    private _footer;
    private _footerSlot;
    private _backdropInTopLayer;
    protected bindEvents(): void;
    private syncFooterVisibility;
    /** `close-on-outside-click="false"` (string) must not close; bare attr still true. */
    private allowsOutsideClickClose;
    show(): void;
    close(reason?: string): void;
    protected onDisconnect(): void;
}
export declare function defineBloraDialog(registry?: CustomElementRegistry): void;
//# sourceMappingURL=dialog.d.ts.map