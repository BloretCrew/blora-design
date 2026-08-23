/**
 * Blora Design 2.0 - QR Code add-on.
 * Spec §9: Add-on package, not bundled into core.
 * Visual baseline: archived 1.x blora.js lines 5977-6090.
 * Composite CE: `<blora-qrcode>` owns the canvas; `buildQRMatrix()` and
 * `renderQRCode()` remain pure/imperative services.
 * @packageDocumentation
 */

import { encodeQRMatrix, type QrEcLevel } from "./encode.js";

export type { QrEcLevel };

export interface QRCodeOptions {
  /** Pixel size of the QR code (default: 148) */
  size?: number;
  /** Error correction level (default M). */
  ecLevel?: QrEcLevel;
  /** ECI assignment number written ahead of the first segment (e.g. 26 = UTF-8). */
  eci?: number;
}

/**
 * Build a QR code matrix from text. Segments pick numeric/alphanumeric/byte/kanji
 * automatically; versions 1–40.
 */
export function buildQRMatrix(
  text: string,
  ecLevel: QrEcLevel = "M",
  encodeOptions?: { eci?: number; mask?: number },
): boolean[][] {
  return encodeQRMatrix(String(text ?? ""), ecLevel, encodeOptions);
}

/**
 * Render a QR code into a container element using Canvas.
 *
 * @param container - The element to render into (will get `.blora-qrcode` class)
 * @param text - The text to encode
 * @param options - Size and other options
 */
export function renderQRCode(
  container: HTMLElement,
  text: string,
  options?: QRCodeOptions | number,
): void {
  if (typeof document === "undefined") return;

  const size = typeof options === "number" ? options : (options?.size ?? 148);
  container.style.setProperty("--blora-qr-size", `${size}px`);
  container.classList.add("blora-qrcode");

  let canvas = container.querySelector("canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    container.appendChild(canvas);
  }

  let modules: boolean[][];
  try {
    modules = buildQRMatrix(
      String(text || ""),
      typeof options === "number" ? "M" : (options?.ecLevel ?? "M"),
      typeof options === "number"
        ? undefined
        : options?.eci === undefined
          ? undefined
          : { eci: options.eci },
    );
    container.removeAttribute("data-invalid");
  } catch {
    container.setAttribute("data-invalid", "");
    canvas.width = 0;
    canvas.height = 0;
    return;
  }
  const n = modules.length;
  const cell = Math.floor(size / (n + 2));
  const px = cell * (n + 2);
  canvas.width = px;
  canvas.height = px;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    /* jsdom may lack canvas 2d — still leave a canvas node for structure */
    return;
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, px, px);
  ctx.fillStyle = "#111111";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (modules[r]![c]) {
        ctx.fillRect((c + 1) * cell, (r + 1) * cell, cell, cell);
      }
    }
  }
}

export interface QRCodeController {
  render(text?: string): void;
  destroy(): void;
}

/** Bind QR from data-text / textContent (v1 initQRCode primary path). */
export function createQRCodeController(
  container: HTMLElement,
  options?: QRCodeOptions | number,
): QRCodeController {
  const textOf = () =>
    container.getAttribute("data-text") ||
    container.getAttribute("data-blora-qrcode") ||
    container.textContent?.trim() ||
    "";

  const render = (text?: string) => {
    renderQRCode(container, text ?? textOf(), options);
  };

  if (
    container.hasAttribute("data-blora-qrcode") ||
    container.hasAttribute("data-text") ||
    container.classList.contains("blora-qrcode")
  ) {
    render();
  }

  return {
    render,
    destroy() {
      /* canvas left in place */
    },
  };
}

export function initQRCode(
  root: ParentNode = document,
  options?: QRCodeOptions | number,
): () => void {
  if (typeof document === "undefined") return () => {};
  const ctrls: QRCodeController[] = [];
  root
    .querySelectorAll<HTMLElement>("[data-blora-qrcode], .blora-qrcode[data-text]")
    .forEach((el) => {
      ctrls.push(createQRCodeController(el, options));
    });
  return () => ctrls.forEach((c) => c.destroy());
}

export const BLORA_QRCODE_TAG = "blora-qrcode";

const QrBase: typeof HTMLElement =
  typeof HTMLElement !== "undefined" ? HTMLElement : (class {} as typeof HTMLElement);

/**
 * Composite CE host for a rendered QR code canvas.
 * Consumers provide `value` (or default text content); the element owns the
 * canvas lifecycle and re-renders when attributes change.
 */
export class BloraQRCode extends QrBase {
  static get observedAttributes(): string[] {
    return ["value", "size", "label"];
  }

  private connectScheduled = false;

  connectedCallback(): void {
    this.classList.add("blora-qrcode");
    if (this.ownerDocument?.readyState === "loading") {
      if (this.connectScheduled) return;
      this.connectScheduled = true;
      setTimeout(() => {
        this.connectScheduled = false;
        if (this.isConnected) this.render();
      }, 0);
      return;
    }
    this.render();
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  /** Current encoded text: `value` attribute, else trimmed text content. */
  get value(): string {
    return this.getAttribute("value") || this.textContent?.trim() || "";
  }

  set value(text: string) {
    this.setAttribute("value", text);
  }

  render(): void {
    const size = Number(this.getAttribute("size")) || 148;
    renderQRCode(this, this.value, { size });
    const label = this.getAttribute("label");
    if (label) {
      this.setAttribute("role", "img");
      this.setAttribute("aria-label", label);
    } else {
      this.removeAttribute("role");
      this.removeAttribute("aria-label");
    }
  }
}

export function defineBloraQRCode(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_QRCODE_TAG)) return;
  registry.define(BLORA_QRCODE_TAG, BloraQRCode);
}

if (typeof customElements !== "undefined") defineBloraQRCode(customElements);
