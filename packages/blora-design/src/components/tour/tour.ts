/**
 * Blora Design 2.0 - Tour controller
 * Steps through highlighted elements with a tooltip.
 */
import { BloraElement } from "../../core/blora-element.js";

export const BLORA_TOUR_TAG = "blora-tour";

export interface TourController {
  destroy(): void;
  end(): void;
  next(): void;
  prev(): void;
  start(): void;
}

function cssLengthToPx(value: string, axis: number): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  if (trimmed.endsWith("%")) return (Number.parseFloat(trimmed) / 100) * axis;
  return Number.parseFloat(trimmed) || 0;
}

/** Highlight the lone visual child (tag, button, …), not the wrapping step box. */
function tourTarget(step: HTMLElement): HTMLElement {
  const kids = Array.from(step.children).filter(
    (node): node is HTMLElement => node instanceof HTMLElement,
  );
  return kids.length === 1 ? kids[0]! : step;
}

function tourPadPx(overlay: HTMLElement): number {
  const raw = getComputedStyle(overlay).getPropertyValue("--blora-tour-pad").trim();
  const pad = Number.parseFloat(raw);
  return Number.isFinite(pad) && pad >= 0 ? pad : 4;
}

function cornerRadius(value: string, axis: number, pad: number): number {
  return cssLengthToPx(value.trim().split(/\s+/)[0] ?? "0px", axis) + pad;
}

function clampCornerRadii(
  width: number,
  height: number,
  radii: { bl: number; br: number; tl: number; tr: number },
): { bl: number; br: number; tl: number; tr: number } {
  const factor = Math.min(
    1,
    width / Math.max(radii.tl + radii.tr, 0.001),
    width / Math.max(radii.bl + radii.br, 0.001),
    height / Math.max(radii.tl + radii.bl, 0.001),
    height / Math.max(radii.tr + radii.br, 0.001),
  );
  return {
    tl: radii.tl * factor,
    tr: radii.tr * factor,
    br: radii.br * factor,
    bl: radii.bl * factor,
  };
}

function roundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radii: { bl: number; br: number; tl: number; tr: number },
): string {
  const { bl, br, tl, tr } = clampCornerRadii(width, height, radii);
  return [
    `M ${x + tl} ${y}`,
    `H ${x + width - tr}`,
    `A ${tr} ${tr} 0 0 1 ${x + width} ${y + tr}`,
    `V ${y + height - br}`,
    `A ${br} ${br} 0 0 1 ${x + width - br} ${y + height}`,
    `H ${x + bl}`,
    `A ${bl} ${bl} 0 0 1 ${x} ${y + height - bl}`,
    `V ${y + tl}`,
    `A ${tl} ${tl} 0 0 1 ${x + tl} ${y}`,
    "Z",
  ].join(" ");
}

/** Full-viewport dimmer with a punched hole. Avoids a 9999px box-shadow that
 *  seams through the navbar's backdrop-filter as a vertical shadow line. */
function applyTourHoleMask(
  overlay: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  radii: { bl: number; br: number; tl: number; tr: number },
): void {
  const vw = Math.max(1, window.innerWidth);
  const vh = Math.max(1, window.innerHeight);
  const path = roundedRectPath(x, y, width, height, radii);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${vw}" height="${vh}"><rect width="100%" height="100%" fill="white"/><path d="${path}" fill="black"/></svg>`;
  const image = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  overlay.style.maskImage = image;
  overlay.style.webkitMaskImage = image;
  overlay.style.maskSize = "100% 100%";
  overlay.style.webkitMaskSize = "100% 100%";
  overlay.style.maskRepeat = "no-repeat";
  overlay.style.webkitMaskRepeat = "no-repeat";
}

function fitTourOverlay(overlay: HTMLElement, target: HTMLElement): { pad: number; rect: DOMRect } {
  const rect = target.getBoundingClientRect();
  const style = getComputedStyle(target);
  const pad = tourPadPx(overlay);
  const x = rect.left - pad;
  const y = rect.top - pad;
  const width = Math.max(0, rect.width + pad * 2);
  const height = Math.max(0, rect.height + pad * 2);
  overlay.style.inset = "0";
  overlay.style.width = "auto";
  overlay.style.height = "auto";
  overlay.style.borderRadius = "0";
  overlay.style.removeProperty("corner-shape");
  applyTourHoleMask(overlay, x, y, width, height, {
    tl: cornerRadius(style.borderTopLeftRadius, rect.width, pad),
    tr: cornerRadius(style.borderTopRightRadius, rect.width, pad),
    br: cornerRadius(style.borderBottomRightRadius, rect.width, pad),
    bl: cornerRadius(style.borderBottomLeftRadius, rect.width, pad),
  });
  return { pad, rect };
}

export function createTourController(root: HTMLElement): TourController {
  const doc = root.ownerDocument;
  const startBtn = root.querySelector<HTMLElement>("[data-tour-start]");
  const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-tour-step]"));
  if (steps.length === 0)
    return { destroy: () => {}, end: () => {}, next: () => {}, prev: () => {}, start: () => {} };

  let current = -1;
  let overlay: HTMLElement | null = null;
  let tooltip: HTMLElement | null = null;

  const createOverlay = () => {
    overlay = doc.createElement("div");
    overlay.className = "blora-tour__overlay";
    doc.body.appendChild(overlay);

    tooltip = doc.createElement("div");
    tooltip.className = "blora-tour__tooltip";
    const title = doc.createElement("div");
    title.className = "blora-tour__title";
    const desc = doc.createElement("div");
    desc.className = "blora-tour__desc";
    const footer = doc.createElement("div");
    footer.className = "blora-tour__footer";
    const counter = doc.createElement("span");
    counter.className = "blora-tour__counter";
    const buttons = doc.createElement("div");
    buttons.className = "blora-tour__buttons";
    const button = (className: string, text: string, variant: string) => {
      const el = doc.createElement("button");
      el.className = `blora-button ${className}`;
      el.dataset.variant = variant;
      el.dataset.size = "sm";
      el.type = "button";
      el.textContent = text;
      return el;
    };
    buttons.append(
      button("blora-tour__skip", "跳过", "outline"),
      button("blora-tour__prev", "上一步", "outline"),
      button("blora-tour__next", "下一步", "primary"),
    );
    footer.append(counter, buttons);
    tooltip.append(title, desc, footer);
    doc.body.appendChild(tooltip);

    tooltip.querySelector(".blora-tour__skip")!.addEventListener("click", end);
    tooltip.querySelector(".blora-tour__prev")!.addEventListener("click", () => goTo(current - 1));
    tooltip.querySelector(".blora-tour__next")!.addEventListener("click", () => {
      if (current < steps.length - 1) goTo(current + 1);
      else end();
    });
  };

  const placeOverlay = () => {
    if (!overlay || !tooltip || current < 0) return;
    const step = steps[current]!;
    const { pad, rect } = fitTourOverlay(overlay, tourTarget(step));
    tooltip.style.top = `${rect.bottom + pad + 12}px`;
    tooltip.style.left = `${Math.max(8, rect.left - pad)}px`;
  };

  const onReposition = () => placeOverlay();

  const goTo = (idx: number) => {
    current = Math.max(0, Math.min(idx, steps.length - 1));
    const step = steps[current]!;

    tooltip!.querySelector(".blora-tour__title")!.textContent = step.dataset.tourTitle ?? "";
    tooltip!.querySelector(".blora-tour__desc")!.textContent = step.dataset.tourDesc ?? "";
    tooltip!.querySelector(".blora-tour__counter")!.textContent =
      `${current + 1} / ${steps.length}`;

    const nextBtn = tooltip!.querySelector<HTMLElement>(".blora-tour__next")!;
    nextBtn.textContent = current < steps.length - 1 ? "下一步" : "完成";
    tooltip!.querySelector<HTMLElement>(".blora-tour__prev")!.style.visibility =
      current > 0 ? "visible" : "hidden";

    tooltip!.setAttribute("data-open", "");
    placeOverlay();
    root.dispatchEvent(
      new CustomEvent("blora-tour-change", {
        bubbles: true,
        detail: { index: current, total: steps.length },
      }),
    );
  };

  const start = () => {
    end();
    createOverlay();
    doc.documentElement.setAttribute("data-blora-tour-open", "");
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    goTo(0);
  };

  const end = () => {
    const wasOpen = current >= 0;
    window.removeEventListener("resize", onReposition);
    window.removeEventListener("scroll", onReposition, true);
    doc.documentElement.removeAttribute("data-blora-tour-open");
    overlay?.remove();
    tooltip?.remove();
    overlay = null;
    tooltip = null;
    current = -1;
    if (wasOpen) root.dispatchEvent(new CustomEvent("blora-tour-end", { bubbles: true }));
  };

  startBtn?.addEventListener("click", start);

  return {
    destroy() {
      end();
      startBtn?.removeEventListener("click", start);
    },
    end,
    next: () => (current < steps.length - 1 ? goTo(current + 1) : end()),
    prev: () => goTo(current - 1),
    start,
  };
}

interface TourStepDefinition {
  description: string;
  nodes: Node[];
  title: string;
}

/** Tour CE that consumes declarative highlighted steps and owns the start control. */
export class BloraTour extends BloraElement {
  private controller: TourController | null = null;
  private definitions: TourStepDefinition[] | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["label", "open"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  start(): void {
    this.controller?.start();
  }

  end(): void {
    this.controller?.end();
  }

  next(): void {
    this.controller?.next();
  }

  prev(): void {
    this.controller?.prev();
  }

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-tour-step")
        .map((item) => ({
          description: item.getAttribute("description") ?? "",
          nodes: Array.from(item.childNodes).map((node) => node.cloneNode(true)),
          title: item.getAttribute("title") ?? "",
        }));
    }
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-tour";
    root.dataset.bloraGenerated = "";
    const start = this.ownerDocument.createElement("button");
    start.className = "blora-button";
    start.dataset.variant = "primary";
    start.dataset.tourStart = "";
    start.type = "button";
    start.textContent = this.getAttribute("label") ?? "开始漫游";
    root.appendChild(start);
    const steps = this.ownerDocument.createElement("div");
    steps.className = "blora-tour__steps";
    this.definitions.forEach((definition) => {
      const step = this.ownerDocument.createElement("div");
      step.dataset.tourStep = "";
      step.dataset.tourTitle = definition.title;
      step.dataset.tourDesc = definition.description;
      step.append(...definition.nodes.map((node) => node.cloneNode(true)));
      steps.appendChild(step);
    });
    root.appendChild(steps);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const start = this.querySelector<HTMLButtonElement>("[data-tour-start]");
    if (start) start.textContent = this.getAttribute("label") ?? "开始漫游";
    if (this.hasAttribute("open")) this.controller?.start();
    else this.controller?.end();
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-tour");
    if (!root) return;
    this.controller?.destroy();
    this.controller = createTourController(root);
    this.listen(root, "blora-tour-change", () => {
      this.reflecting = true;
      this.setAttribute("open", "");
      this.reflecting = false;
    });
    this.listen(root, "blora-tour-end", () => {
      this.reflecting = true;
      this.removeAttribute("open");
      this.reflecting = false;
    });
    if (this.hasAttribute("open")) this.controller.start();
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraTour(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_TOUR_TAG)) return;
  registry.define(BLORA_TOUR_TAG, BloraTour);
}
