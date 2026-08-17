import { describe, it, expect } from "vitest";
import { renderQRCode, buildQRMatrix, createQRCodeController, initQRCode } from "../src/index.js";

describe("QRCode add-on", () => {
  it("buildQRMatrix returns a 2D boolean array", () => {
    const matrix = buildQRMatrix("hello");
    expect(matrix).toBeInstanceOf(Array);
    expect(matrix.length).toBeGreaterThan(0);
    expect(matrix[0]).toBeInstanceOf(Array);
    expect(typeof matrix[0]![0]).toBe("boolean");
  });

  it("buildQRMatrix has correct size for QR version 3", () => {
    const matrix = buildQRMatrix("test");
    expect(matrix.length).toBe(29);
    expect(matrix[0]!.length).toBe(29);
  });

  it("buildQRMatrix has finder patterns at corners", () => {
    const matrix = buildQRMatrix("test");
    // Top-left finder pattern: 7x7 block starting at (0,0)
    // Top-left corner of finder should be solid
    expect(matrix[0]![0]).toBe(true);
    expect(matrix[6]![6]).toBe(true);
    // Top-right finder pattern: starts at (size-7, 0)
    expect(matrix[0]![22]).toBe(true);
    // Bottom-left finder pattern: starts at (0, size-7)
    expect(matrix[22]![0]).toBe(true);
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

  it("renderQRCode handles long text by truncating", () => {
    const longText = "a".repeat(200);
    const container = document.createElement("div");
    expect(() => renderQRCode(container, longText, { size: 100 })).not.toThrow();
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
});
