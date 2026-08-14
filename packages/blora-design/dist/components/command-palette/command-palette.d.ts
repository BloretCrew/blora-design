/**
 * Blora Design 2.0 - Command Palette controller
 * Filter items, keyboard nav, adaptive ⌘/Ctrl shortcuts.
 */
import { BloraElement } from "../../core/blora-element.js";
export declare const BLORA_COMMAND_TAG = "blora-command";
export interface CommandPaletteController {
    destroy(): void;
}
export declare function createCommandPaletteController(root: HTMLElement): CommandPaletteController;
/** Composite CE that owns the command search and official result item tree. */
export declare class BloraCommand extends BloraElement {
    private controller;
    private searchController;
    private definitions;
    static get observedAttributes(): string[];
    attributeChangedCallback(): void;
    protected render(): void;
    protected sync(): void;
    protected bindEvents(): void;
    protected onDisconnect(): void;
}
export declare function defineBloraCommand(registry?: CustomElementRegistry): void;
//# sourceMappingURL=command-palette.d.ts.map