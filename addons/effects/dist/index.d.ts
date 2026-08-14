/**
 * Blora Design 2.0 - Effects add-on.
 * Spec §9: Add-on package, not bundled into core.
 * Includes textFx + text-rotate / countdown / countup / diff / hover-gallery /
 * watermark / shortcut hints (migrated from core 2026-08).
 * @packageDocumentation
 */
export { createTextRotateController, createCountdownController, createCountUpController, createImageDiffController, createHoverGalleryController, createWatermarkController, initShortcutHints, formatShortcut, getShortcutPlatform, type TextRotateController, type CountdownController, type CountUpController, type ImageDiffController, type HoverGalleryController, type WatermarkController, } from "./extras.js";
export type TextFxName = "grow" | "shrink" | "shake" | "nod" | "jitter" | "explode" | "ripple" | "bloom";
export interface TextFxOptions {
    /** Loop the animation (default: false) */
    loop?: boolean;
    /** Make the element clickable (default: false) */
    clickable?: boolean;
}
/**
 * Apply a text effect to a target element.
 *
 * @param target - The element to apply the effect to
 * @param name - Effect name (grow, shrink, shake, nod, jitter, explode, ripple, bloom)
 * @param options - Loop and clickable options
 * @returns The element if successful, null otherwise
 */
export declare function textFx(target: HTMLElement, name?: TextFxName, options?: TextFxOptions): HTMLElement | null;
//# sourceMappingURL=index.d.ts.map