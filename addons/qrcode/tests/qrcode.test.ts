import { describe, it, expect } from "vitest";
import {
  renderQRCode,
  buildQRMatrix,
  createQRCodeController,
  initQRCode,
  BLORA_QRCODE_TAG,
  BloraQRCode,
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
