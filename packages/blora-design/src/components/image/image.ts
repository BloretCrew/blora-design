/**
 * Image: skeleton loading + optional lightbox preview (v1 initImagePreview).
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_IMAGE_TAG = "blora-image";

export interface ImageController {
  destroy(): void;
}

export interface ImagePreviewHandle {
  close(): void;
  next(): void;
  prev(): void;
  el: HTMLElement;
}

export interface ImagePreviewItem {
  src: string;
  alt?: string;
  caption?: string;
}

function collectGroup(el: HTMLElement): { items: ImagePreviewItem[]; start: number } {
  const group =
    el.getAttribute("data-preview-group") || el.getAttribute("data-blora-preview-group");
  const root = group
    ? el.ownerDocument.querySelectorAll<HTMLElement>(
        `[data-preview-group="${group}"], [data-blora-preview-group="${group}"]`,
      )
    : [el];
  const items: ImagePreviewItem[] = [];
  let start = 0;
  Array.from(root).forEach((node, i) => {
    const img = node.matches("img")
      ? (node as HTMLImageElement)
      : node.querySelector<HTMLImageElement>("img");
    const src =
      node.getAttribute("data-preview-src") ||
      node.getAttribute("href") ||
      img?.currentSrc ||
      img?.src ||
      "";
    if (!src) return;
    if (node === el || node.contains(el) || el.contains(node)) start = items.length;
    items.push({
      src,
      alt: img?.alt || "",
      caption: node.getAttribute("data-caption") || img?.alt || "",
    });
    void i;
  });
  if (!items.length && el instanceof HTMLImageElement) {
    items.push({ src: el.src, alt: el.alt, caption: el.alt });
  }
  return { items, start };
}

export function openImagePreview(
  items: ImagePreviewItem[] | string[],
  start = 0,
): ImagePreviewHandle | null {
  if (typeof document === "undefined" || !items.length) return null;
  const doc = document;
  const list: ImagePreviewItem[] = items.map((it) => (typeof it === "string" ? { src: it } : it));
  let index = Math.max(0, Math.min(start, list.length - 1));

  const overlay = doc.createElement("div");
  overlay.className = "blora-image-preview is-open";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  const stage = doc.createElement("div");
  stage.className = "blora-image-preview__stage";

  const img = doc.createElement("img");
  img.className = "blora-image-preview__img";
  img.alt = "";

  const cap = doc.createElement("div");
  cap.className = "blora-image-preview__cap";

  const count = doc.createElement("div");
  count.className = "blora-image-preview__count";

  const closeBtn = doc.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "blora-image-preview__close";
  closeBtn.setAttribute("aria-label", "关闭");
  closeBtn.appendChild(createBloraIcon("close", 18));

  const prevBtn = doc.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "blora-image-preview__btn blora-image-preview__btn--prev";
  prevBtn.setAttribute("aria-label", "上一张");
  prevBtn.appendChild(createBloraIcon("chevron-left", 20));

  const nextBtn = doc.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "blora-image-preview__btn blora-image-preview__btn--next";
  nextBtn.setAttribute("aria-label", "下一张");
  nextBtn.appendChild(createBloraIcon("chevron-right", 20));

  stage.append(img, cap);
  overlay.append(count, closeBtn, prevBtn, nextBtn, stage);
  doc.body.appendChild(overlay);

  const render = () => {
    const item = list[index]!;
    img.src = item.src;
    img.alt = item.alt || "";
    cap.textContent = item.caption || "";
    count.textContent = list.length > 1 ? `${index + 1} / ${list.length}` : "";
    prevBtn.hidden = list.length < 2;
    nextBtn.hidden = list.length < 2;
  };

  const close = () => {
    overlay.classList.remove("is-open");
    overlay.remove();
    doc.removeEventListener("keydown", onKey);
  };
  const next = () => {
    index = (index + 1) % list.length;
    render();
  };
  const prev = () => {
    index = (index - 1 + list.length) % list.length;
    render();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  doc.addEventListener("keydown", onKey);
  render();

  return { close, next, prev, el: overlay };
}

export function createImageController(root: HTMLElement): ImageController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const cleanups: Array<() => void> = [];

  const wireLoading = (figure: HTMLElement) => {
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

  const wirePreview = (el: HTMLElement) => {
    if (
      !el.hasAttribute("data-blora-preview") &&
      !el.classList.contains("blora-image--preview") &&
      el.getAttribute("data-variant") !== "preview"
    ) {
      return;
    }
    el.setAttribute("tabindex", el.getAttribute("tabindex") || "0");
    el.setAttribute("role", el.getAttribute("role") || "button");
    const open = () => {
      const { items, start } = collectGroup(el);
      openImagePreview(items, start);
    };
    const onClick = () => open();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    };
    el.addEventListener("click", onClick);
    el.addEventListener("keydown", onKey);
    cleanups.push(() => {
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onKey);
    });
  };

  const targets = root.matches(".blora-image")
    ? [root]
    : Array.from(root.querySelectorAll<HTMLElement>(".blora-image, [data-blora-preview]"));

  targets.forEach((t) => {
    if (t.classList.contains("blora-image") || t.matches(".blora-image")) wireLoading(t);
    wirePreview(t);
  });

  if (!targets.length) {
    root.querySelectorAll("img").forEach((img) => {
      const figure = img.closest(".blora-image") as HTMLElement | null;
      if (figure) {
        wireLoading(figure);
        wirePreview(figure);
      }
    });
  }

  return {
    destroy() {
      cleanups.forEach((fn) => fn());
    },
  };
}

/** Image CE that owns figure, image, caption, loading and preview structure. */
export class BloraImage extends BloraElement {
  private controller: ImageController | null = null;
  private previewHandle: ImagePreviewHandle | null = null;

  static get observedAttributes(): string[] {
    return ["src", "alt", "caption", "variant", "filter", "preview", "preview-group"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal) return;
    this.sync();
  }

  open(): void {
    const figure = this.querySelector<HTMLElement>(".blora-image");
    if (!figure) return;
    const { items, start } = collectGroup(figure);
    this.previewHandle = openImagePreview(items, start);
  }

  close(): void {
    this.previewHandle?.close();
    this.previewHandle = null;
  }

  protected render(): void {
    const figure = this.ownerDocument.createElement("figure");
    figure.className = "blora-image";
    figure.dataset.bloraGenerated = "";
    figure.dataset.variant = this.getAttribute("variant") ?? "default";
    figure.dataset.filter = this.getAttribute("filter") ?? "none";
    if (this.hasAttribute("preview") || figure.dataset.variant === "preview")
      figure.dataset.bloraPreview = "";
    const group = this.getAttribute("preview-group");
    if (group) figure.dataset.previewGroup = group;
    const img = this.ownerDocument.createElement("img");
    img.src = this.getAttribute("src") ?? "";
    img.alt = this.getAttribute("alt") ?? "";
    img.decoding = "async";
    figure.appendChild(img);
    const captionText = this.getAttribute("caption");
    if (captionText) {
      const caption = this.ownerDocument.createElement("figcaption");
      caption.className = "blora-image__cap";
      caption.textContent = captionText;
      figure.dataset.caption = captionText;
      figure.appendChild(caption);
    }
    this.replaceChildren(figure);
  }

  protected override sync(): void {
    const figure = this.querySelector<HTMLElement>(".blora-image");
    const img = figure?.querySelector("img");
    if (!figure || !img) return;
    figure.dataset.variant = this.getAttribute("variant") ?? "default";
    figure.dataset.filter = this.getAttribute("filter") ?? "none";
    figure.toggleAttribute(
      "data-blora-preview",
      this.hasAttribute("preview") || figure.dataset.variant === "preview",
    );
    const group = this.getAttribute("preview-group");
    if (group) figure.dataset.previewGroup = group;
    else delete figure.dataset.previewGroup;
    img.src = this.getAttribute("src") ?? "";
    img.alt = this.getAttribute("alt") ?? "";
    const captionText = this.getAttribute("caption");
    let caption = figure.querySelector("figcaption");
    if (captionText) {
      if (!caption) {
        caption = this.ownerDocument.createElement("figcaption");
        caption.className = "blora-image__cap";
        figure.appendChild(caption);
      }
      caption.textContent = captionText;
      figure.dataset.caption = captionText;
    } else {
      caption?.remove();
      delete figure.dataset.caption;
    }
  }

  protected bindEvents(): void {
    const figure = this.querySelector<HTMLElement>(".blora-image");
    if (figure) this.controller = createImageController(figure);
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
    this.close();
  }
}

export function defineBloraImage(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_IMAGE_TAG)) return;
  registry.define(BLORA_IMAGE_TAG, BloraImage);
}
