import { describe, it, expect } from "vitest";
import QRCode from "qrcode";
import {
  renderQRCode,
  buildQRMatrix,
  createQRCodeController,
  initQRCode,
  BLORA_QRCODE_TAG,
  BloraQRCode,
  type QrEcLevel,
} from "../src/index.js";

describe("QRCode add-on", () => {
  it("buildQRMatrix returns a 2D boolean array", () => {
    const matrix = buildQRMatrix("hello");
    expect(matrix).toBeInstanceOf(Array);
    expect(matrix.length).toBeGreaterThan(0);
    expect(matrix[0]).toBeInstanceOf(Array);
    expect(typeof matrix[0]![0]).toBe("boolean");
  });

  it("buildQRMatrix size follows 21 + 4*(version-1)", () => {
    const matrix = buildQRMatrix("test");
    expect(matrix.length).toBe(matrix[0]!.length);
    expect((matrix.length - 21) % 4).toBe(0);
    expect(matrix.length).toBeGreaterThanOrEqual(21);
  });

  it("buildQRMatrix has finder patterns at corners", () => {
    const matrix = buildQRMatrix("test");
    const size = matrix.length;
    expect(matrix[0]![0]).toBe(true);
    expect(matrix[6]![6]).toBe(true);
    expect(matrix[0]![size - 7]).toBe(true);
    expect(matrix[size - 7]![0]).toBe(true);
  });

  it("buildQRMatrix produces different output for different text", () => {
    const m1 = buildQRMatrix("hello");
    const m2 = buildQRMatrix("world");
    // Matrices should differ (very unlikely to be identical)
    let diff = false;
    for (let r = 0; r < m1.length; r++) {
      for (let c = 0; c < m1[r]!.length; c++) {
        if (m1[r]![c] !== m2[r]![c]) {
          diff = true;
          break;
        }
      }
    }
    expect(diff).toBe(true);
  });

  it("renderQRCode creates a canvas in the container", () => {
    const container = document.createElement("div");
    renderQRCode(container, "test", { size: 100 });

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
    expect(canvas?.width).toBeGreaterThan(0);
    expect(canvas?.height).toBeGreaterThan(0);
  });

  it("renderQRCode adds blora-qrcode class", () => {
    const container = document.createElement("div");
    renderQRCode(container, "test", 100);
    expect(container.classList.contains("blora-qrcode")).toBe(true);
  });

  it("renderQRCode sets --blora-qr-size CSS variable", () => {
    const container = document.createElement("div");
    renderQRCode(container, "test", { size: 200 });
    expect(container.style.getPropertyValue("--blora-qr-size")).toBe("200px");
  });

  it("renderQRCode reuses existing canvas", () => {
    const container = document.createElement("div");
    renderQRCode(container, "first", { size: 100 });
    const canvas1 = container.querySelector("canvas");

    renderQRCode(container, "second", { size: 100 });
    const canvas2 = container.querySelector("canvas");

    expect(canvas1).toBe(canvas2);
    expect(container.querySelectorAll("canvas").length).toBe(1);
  });

  it("renderQRCode handles empty text", () => {
    const container = document.createElement("div");
    expect(() => renderQRCode(container, "", { size: 100 })).not.toThrow();
    expect(container.querySelector("canvas")).toBeTruthy();
  });

  it("renderQRCode encodes payloads longer than the old 80-byte cap", () => {
    const longText = "a".repeat(200);
    const container = document.createElement("div");
    expect(() => renderQRCode(container, longText, { size: 100 })).not.toThrow();
    expect(container.hasAttribute("data-invalid")).toBe(false);
    expect(container.querySelector("canvas")?.width).toBeGreaterThan(0);
  });

  it("buildQRMatrix throws only when the payload exceeds version 40", () => {
    expect(() => buildQRMatrix("a".repeat(4000))).toThrow(/QR_TOO_LONG/);
  });

  it("createQRCodeController renders from data-text", () => {
    const el = document.createElement("div");
    el.className = "blora-qrcode";
    el.setAttribute("data-text", "hello-qr");
    const ctrl = createQRCodeController(el, { size: 80 });
    expect(el.querySelector("canvas")).toBeTruthy();
    ctrl.destroy();
  });

  it("initQRCode finds nodes", () => {
    document.body.innerHTML = `<div data-blora-qrcode data-text="x"></div>`;
    const off = initQRCode(document, { size: 64 });
    expect(document.querySelector("canvas")).toBeTruthy();
    off();
  });

  it("blora-qrcode renders a canvas from value and syncs the label", () => {
    const el = document.createElement(BLORA_QRCODE_TAG) as BloraQRCode;
    el.setAttribute("value", "https://example.com");
    el.setAttribute("size", "120");
    el.setAttribute("label", "示例二维码");
    document.body.append(el);

    expect(el.classList.contains("blora-qrcode")).toBe(true);
    const canvas = el.querySelector("canvas");
    expect(canvas).toBeTruthy();
    expect(el.style.getPropertyValue("--blora-qr-size")).toBe("120px");
    expect(el.getAttribute("role")).toBe("img");
    expect(el.getAttribute("aria-label")).toBe("示例二维码");

    el.removeAttribute("label");
    expect(el.hasAttribute("role")).toBe(false);
  });

  it("blora-qrcode re-renders when value changes and reuses the canvas", () => {
    const el = document.createElement(BLORA_QRCODE_TAG) as BloraQRCode;
    el.setAttribute("value", "first");
    document.body.append(el);
    const canvas = el.querySelector("canvas")!;
    el.value = "second";
    expect(el.querySelector("canvas")).toBe(canvas);
  });
});

/** Local Shift-JIS code map for the reference lib's kanji mode (mirrors the encoder's lazy TextDecoder build). */
const sjisByChar = new Map<string, number>();
{
  const dec = new TextDecoder("shift-jis");
  const bytes = new Uint8Array(2);
  for (let row = 0x81; row <= 0xeb; row++) {
    if (row > 0x9f && row < 0xe0) continue;
    const colMax = row === 0xeb ? 0xbf : 0xfc;
    for (let col = 0x40; col <= colMax; col++) {
      if (col === 0x7f) continue;
      bytes[0] = row;
      bytes[1] = col;
      const s = dec.decode(bytes);
      if (s.length === 1 && s.codePointAt(0) !== 0xfffd && !sjisByChar.has(s))
        sjisByChar.set(s, (row << 8) | col);
    }
  }
}

// node-qrcode passes the CHARACTER (string) at runtime despite its typed declaration.
const refSjis = ((arg: string | number): number => {
  const ch = typeof arg === "string" ? arg : String.fromCodePoint(arg);
  const code = sjisByChar.get(ch);
  if (code === undefined) throw new Error(`no SJIS mapping for ${JSON.stringify(ch)}`);
  return code;
}) as unknown as (codePoint: number) => number;

describe("QRCode encoder parity with reference implementation", () => {
  function expectSameMatrix(text: string, level: QrEcLevel, kanji = false): void {
    const ref = QRCode.create(text, {
      errorCorrectionLevel: level,
      ...(kanji ? { toSJISFunc: refSjis } : {}),
    });
    const size = ref.modules.size;
    const data = ref.modules.data;
    const expected = Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => Boolean(data[r * size + c])),
    );
    expect(buildQRMatrix(text, level)).toEqual(expected);
  }

  it("numeric payloads match the reference at every level", () => {
    for (const level of ["L", "M", "Q", "H"] as const) {
      expectSameMatrix("01234567", level);
      expectSameMatrix("12345678901234567890", level);
    }
  });

  it("alphanumeric payloads match the reference at every level", () => {
    for (const level of ["L", "M", "Q", "H"] as const) {
      expectSameMatrix("HELLO WORLD", level);
      expectSameMatrix("BLORA DESIGN 2.0 / $%*+-.", level);
    }
  });

  it("byte payloads match the reference", () => {
    for (const level of ["L", "M", "Q", "H"] as const)
      expectSameMatrix("bloradesigncomponents", level, true);
  });

  it("mixed byte payloads pick the same version as the reference", () => {
    for (const [text, level] of [
      ["https://blora.design/components", "L"],
      ["https://blora.design/components", "M"],
      ["https://blora.design/components", "Q"],
      ["https://blora.design/components", "H"],
      ["Grüße aus München mit ümlauten und scharfem S", "Q"],
      ["Grüße aus München — ümlauts & 中文 mixed run", "Q"],
    ] as const) {
      const ref = QRCode.create(text as string, {
        errorCorrectionLevel: level as never,
        toSJISFunc: refSjis,
      });
      expect(buildQRMatrix(text as string, level as never).length).toBe(ref.modules.size);
    }
  });

  it("kanji payloads match the reference", () => {
    expectSameMatrix("こんにちは世界", "M", true);
    expectSameMatrix("名古屋駅まで約4km", "Q", true);
  });

  it("CJK mixed payloads stay at most as large as the reference", () => {
    const text = "Grüße aus München — ümlauts & 中文 mixed run";
    const ours = buildQRMatrix(text, "Q");
    const ref = QRCode.create(text, { errorCorrectionLevel: "Q", toSJISFunc: refSjis });
    expect(ours.length).toBeLessThanOrEqual(ref.modules.size);
  });

  it("mixed content picks compact segments (digits beat byte-mode size)", () => {
    const digits = buildQRMatrix("12345678901234567890");
    const letters = buildQRMatrix("abcdefghijklmnopqrst");
    expect(digits.length).toBe(21);
    expect(letters.length).toBe(25);
  });

  it("ECI option changes the matrix and rejects invalid assignments", () => {
    const plain = buildQRMatrix("test");
    const withEci = buildQRMatrix("test", "M", { eci: 26 });
    expect(withEci).not.toEqual(plain);
    expect(withEci.length).toBe(plain.length);
    expect(() => buildQRMatrix("test", "M", { eci: -1 })).toThrow(/QR_BAD_ECI/);
    expect(() => buildQRMatrix("test", "M", { eci: 1.5 })).toThrow(/QR_BAD_ECI/);
  });
});
