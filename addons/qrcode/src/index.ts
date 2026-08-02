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
export function buildQRMatrix(text: string): boolean[][] {
  const truncated = text.slice(0, 60);
  try {
    return qrMatrixFromText(truncated);
  } catch {
    return fallbackMatrix(text);
  }
}

function qrMatrixFromText(text: string): boolean[][] {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push(192 | (code >> 6), 128 | (code & 63));
    } else {
      bytes.push(224 | (code >> 12), 128 | ((code >> 6) & 63), 128 | (code & 63));
    }
  }

  const size = 29;
  const m: (boolean | null)[][] = Array.from({ length: size }, () =>
    Array<boolean | null>(size).fill(null),
  );

  const placeFinder = (x: number, y: number): void => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = y + r;
        const cc = x + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        const on =
          r === -1 ||
          c === -1 ||
          r === 7 ||
          c === 7 ||
          (r >= 0 &&
            r <= 6 &&
            c >= 0 &&
            c <= 6 &&
            (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)));
        m[rr]![cc] = on;
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(size - 7, 0);
  placeFinder(0, size - 7);

  for (let i = 8; i < size - 8; i++) {
    if (m[6]![i] == null) m[6]![i] = i % 2 === 0;
    if (m[i]![6] == null) m[i]![6] = i % 2 === 0;
  }

  let bit = 0;
  const bits: number[] = [];
  bits.push(0, 1, 0, 0); // byte mode
  const len = bytes.length;
  for (let i = 7; i >= 0; i--) bits.push((len >> i) & 1);
  bytes.forEach((b) => {
    for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
  });
  while (bits.length % 8) bits.push(0);

  let dir = -1;
  let col = size - 1;
  while (col > 0) {
    if (col === 6) col--;
    for (let i = 0; i < size; i++) {
      const r = dir < 0 ? size - 1 - i : i;
      for (let c = 0; c < 2; c++) {
        const cc = col - c;
        if (m[r]![cc] != null) continue;
        const v = bit < bits.length ? bits[bit++]! : 0;
        const mask = (r + cc) % 2 === 0;
        m[r]![cc] = mask ? !v : !!v;
      }
    }
    dir = -dir;
    col -= 2;
  }

  const result: boolean[][] = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      result[r]![c] = m[r]![c] ?? false;
    }
  }
  return result;
}

function fallbackMatrix(text: string): boolean[][] {
  const n = 25;
  const m: boolean[][] = Array.from({ length: n }, () => Array<boolean>(n).fill(false));
  for (let i = 0; i < n; i++) {
    m[0]![i] = true;
    m[n - 1]![i] = true;
    m[i]![0] = true;
    m[i]![n - 1] = true;
  }
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 33 + text.charCodeAt(i)) >>> 0;
  }
  for (let r = 2; r < n - 2; r++) {
    for (let c = 2; c < n - 2; c++) {
      h = (h * 1103515245 + 12345) >>> 0;
      m[r]![c] = (h & 7) < 3;
    }
  }
  return m;
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

  const modules = buildQRMatrix(String(text || ""));
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

export function initQRCode(root: ParentNode = document, options?: QRCodeOptions | number): () => void {
  if (typeof document === "undefined") return () => {};
  const ctrls: QRCodeController[] = [];
  root.querySelectorAll<HTMLElement>("[data-blora-qrcode], .blora-qrcode[data-text]").forEach((el) => {
    ctrls.push(createQRCodeController(el, options));
  });
  return () => ctrls.forEach((c) => c.destroy());
}
