/**
 * Image: skeleton loading until natural load.
 */
export interface ImageController {
  destroy(): void;
}

export function createImageController(root: HTMLElement): ImageController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const imgs = Array.from(root.querySelectorAll<HTMLImageElement>("img"));
  const targets = root.matches(".blora-image") ? [root] : Array.from(root.querySelectorAll(".blora-image"));

  const cleanups: Array<() => void> = [];

  const wire = (figure: HTMLElement) => {
    const img = figure.querySelector("img");
    if (!img) return;
    const done = () => figure.removeAttribute("data-loading");
    if (img.complete && img.naturalWidth > 0) {
      done();
      return;
    }
    figure.setAttribute("data-loading", "");
    img.addEventListener("load", done);
    img.addEventListener("error", done);
    cleanups.push(() => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
    });
  };

  if (root.matches(".blora-image")) wire(root);
  else targets.forEach((f) => wire(f as HTMLElement));

  // Also support passing a single figure root without children scan
  if (!targets.length && imgs.length) {
    imgs.forEach((img) => {
      const figure = img.closest(".blora-image") as HTMLElement | null;
      if (figure) wire(figure);
    });
  }

  return {
    destroy() {
      cleanups.forEach((fn) => fn());
    },
  };
}
