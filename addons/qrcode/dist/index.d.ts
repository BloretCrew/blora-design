/**
 * Blora Design 2.0 - QR Code add-on.
 * Spec §9: Add-on package, not bundled into core.
 * Visual baseline: legacy/v1/blora.js lines 5977-6090.
 * @packageDocumentation
 */
export interface QRCodeOptions {
    /** Pixel size of the QR code (default: 148) */
    size?: number;
}
/**
 * Build a QR code matrix from text.
 * Simplified implementation (beta quality) - uses finder patterns + data bits.
 * @internal
 */
export declare function buildQRMatrix(text: string): boolean[][];
/**
 * Render a QR code into a container element using Canvas.
 *
 * @param container - The element to render into (will get `.blora-qrcode` class)
 * @param text - The text to encode
 * @param options - Size and other options
 */
export declare function renderQRCode(container: HTMLElement, text: string, options?: QRCodeOptions | number): void;
export interface QRCodeController {
    render(text?: string): void;
    destroy(): void;
}
/** Bind QR from data-text / textContent (v1 initQRCode primary path). */
export declare function createQRCodeController(container: HTMLElement, options?: QRCodeOptions | number): QRCodeController;
export declare function initQRCode(root?: ParentNode, options?: QRCodeOptions | number): () => void;
//# sourceMappingURL=index.d.ts.map