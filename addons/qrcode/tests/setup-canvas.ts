/**
 * jsdom does not implement canvas 2d; stub getContext so renderQRCode tests stay quiet.
 */
import { beforeAll } from "vitest";

beforeAll(() => {
  if (typeof HTMLCanvasElement === "undefined") return;
  HTMLCanvasElement.prototype.getContext = function getContext(type: string) {
    if (type !== "2d") return null;
    const noop = () => undefined;
    return {
      canvas: this,
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      fillRect: noop,
      clearRect: noop,
      strokeRect: noop,
      beginPath: noop,
      moveTo: noop,
      lineTo: noop,
      stroke: noop,
      fill: noop,
      save: noop,
      restore: noop,
      scale: noop,
      translate: noop,
      drawImage: noop,
      getImageData: () => ({ data: new Uint8ClampedArray(4) }),
      putImageData: noop,
      createImageData: () => ({ data: new Uint8ClampedArray(4) }),
      setTransform: noop,
      measureText: () => ({ width: 0 }),
    } as unknown as CanvasRenderingContext2D;
  };
});
