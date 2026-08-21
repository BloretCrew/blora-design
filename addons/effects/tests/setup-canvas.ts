/**
 * jsdom does not implement canvas 2d; stub getContext so watermark tests stay quiet.
 */
import { beforeAll } from "vitest";

beforeAll(() => {
  if (typeof HTMLCanvasElement === "undefined") return;
  HTMLCanvasElement.prototype.toDataURL = () => "data:image/png;base64,stub";
  (HTMLCanvasElement.prototype as unknown as { getContext: unknown }).getContext = function (
    this: HTMLCanvasElement,
    type: string,
  ) {
    if (type !== "2d") return null;
    const noop = () => undefined;
    return {
      canvas: this,
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      font: "",
      textAlign: "",
      textBaseline: "",
      fillRect: noop,
      clearRect: noop,
      strokeRect: noop,
      beginPath: noop,
      moveTo: noop,
      lineTo: noop,
      stroke: noop,
      fill: noop,
      fillText: noop,
      save: noop,
      restore: noop,
      scale: noop,
      rotate: noop,
      translate: noop,
      setTransform: noop,
      drawImage: noop,
      getImageData: () => ({ data: new Uint8ClampedArray(4) }),
      putImageData: noop,
      createImageData: () => ({ data: new Uint8ClampedArray(4) }),
      measureText: () => ({ width: 0 }),
    } as unknown as CanvasRenderingContext2D;
  };
});
