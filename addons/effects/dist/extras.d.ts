/**
 * Effects add-on extras (migrated from core / v1).
 * text-rotate, countdown, countup, image-diff, hover-gallery, watermark, shortcuts
 */
export interface Destroyable {
    destroy(): void;
}
export type TextRotateController = Destroyable;
export declare function createTextRotateController(root: HTMLElement): TextRotateController;
export type CountdownController = Destroyable;
export declare function createCountdownController(root: HTMLElement): CountdownController;
export type CountUpController = Destroyable;
export declare function createCountUpController(root: HTMLElement): CountUpController;
export type ImageDiffController = Destroyable;
export declare function createImageDiffController(root: HTMLElement): ImageDiffController;
export type HoverGalleryController = Destroyable;
export declare function createHoverGalleryController(root: HTMLElement): HoverGalleryController;
export type WatermarkController = Destroyable;
export declare function createWatermarkController(root: HTMLElement): WatermarkController;
export declare function getShortcutPlatform(base?: HTMLElement): "apple" | "other";
export declare function formatShortcut(shortcut: string, platform?: "other" | "apple"): string;
export declare function initShortcutHints(root?: ParentNode): void;
//# sourceMappingURL=extras.d.ts.map