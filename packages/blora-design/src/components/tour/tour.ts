/**
 * Blora Design 2.0 - Tour controller
 * Steps through highlighted elements with a tooltip.
 */
import { OverlayController } from "../../controllers/overlay-controller.js";
import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";
import { whenMotionDone } from "../../core/motion.js";

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

/** Size the ring to the padded target. The 9999px spread is the dimmer —
 *  a radius-matched cutout, no stroke. */
function fitTourOverlay(overlay: HTMLElement, target: HTMLElement): { pad: number; rect: DOMRect } {
  const rect = target.getBoundingClientRect();
  const style = getComputedStyle(target);
  const pad = tourPadPx(overlay);
  const x = rect.left - pad;
  const y = rect.top - pad;
  const width = Math.max(0, rect.width + pad * 2);
  const height = Math.max(0, rect.height + pad * 2);
  const radii = clampCornerRadii(width, height, {
    tl: cornerRadius(style.borderTopLeftRadius, rect.width, pad),
    tr: cornerRadius(style.borderTopRightRadius, rect.width, pad),
    br: cornerRadius(style.borderBottomRightRadius, rect.width, pad),
    bl: cornerRadius(style.borderBottomLeftRadius, rect.width, pad),
  });
  const ring = overlay.querySelector<HTMLElement>(".blora-tour__ring")!;
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  ring.style.width = `${width}px`;
  ring.style.height = `${height}px`;
  ring.style.borderRadius = `${radii.tl}px ${radii.tr}px ${radii.br}px ${radii.bl}px`;
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
  let stack: OverlayController | null = null;

  const createOverlay = () => {
    overlay = doc.createElement("div");
    overlay.className = "blora-tour__overlay";
    overlay.setAttribute("popover", "manual");
    const ring = doc.createElement("div");
    ring.className = "blora-tour__ring";
    overlay.appendChild(ring);

    tooltip = doc.createElement("div");
    tooltip.className = "blora-tour__tooltip";
    tooltip.setAttribute("role", "dialog");
    tooltip.setAttribute("aria-modal", "true");
    const title = doc.createElement("div");
    title.className = "blora-tour__title";
    title.id = "blora-tour-title";
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
      button("blora-tour__skip", t("common.skip"), "outline"),
      button("blora-tour__prev", t("common.prev"), "outline"),
      button("blora-tour__next", t("common.next"), "primary"),
    );
    footer.append(counter, buttons);
    tooltip.append(title, desc, footer);
    tooltip.setAttribute("aria-labelledby", title.id);
    overlay.appendChild(tooltip);
    doc.body.appendChild(overlay);
    try {
      overlay.showPopover?.();
    } catch {
      /* UA without popover */
    }

    tooltip.querySelector(".blora-tour__skip")!.addEventListener("click", end);
    tooltip.querySelector(".blora-tour__prev")!.addEventListener("click", () => goTo(current - 1));
    tooltip.querySelector(".blora-tour__next")!.addEventListener("click", () => {
      if (current < steps.length - 1) goTo(current + 1);
      else end();
    });
    overlay.addEventListener("blora-close-request", end);
  };

  const placeOverlay = () => {
    if (!overlay || !tooltip || current < 0) return;
    const step = steps[current]!;
    const target = tourTarget(step);
    const win = doc.defaultView;
    const reduced = win?.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (typeof target.scrollIntoView === "function") {
      target.scrollIntoView({
        block: "center",
        inline: "nearest",
        behavior: reduced ? "auto" : "smooth",
      });
    }
    const { pad, rect } = fitTourOverlay(overlay, target);
    const tipH = tooltip.offsetHeight || 140;
    const tipW = tooltip.offsetWidth || 280;
    const vh = win?.innerHeight ?? 800;
    const vw = win?.innerWidth ?? 1200;
    let top = rect.bottom + pad + 12;
    if (top + tipH > vh - 12) top = rect.top - pad - 12 - tipH;
    if (top < 12) top = 12;
    let left = Math.max(8, rect.left - pad);
    if (left + tipW > vw - 8) left = Math.max(8, vw - tipW - 8);
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  };

  const onReposition = () => placeOverlay();

  const goTo = (idx: number) => {
    current = Math.max(0, Math.min(idx, steps.length - 1));
    const step = steps[current]!;

    tooltip!.querySelector(".blora-tour__title")!.textContent = step.dataset.tourTitle ?? "";
    tooltip!.querySelector(".blora-tour__desc")!.textContent = step.dataset.tourDesc ?? "";
    tooltip!.querySelector(".blora-tour__counter")!.textContent = t("tour.step", {
      current: current + 1,
      total: steps.length,
    });

    const nextBtn = tooltip!.querySelector<HTMLElement>(".blora-tour__next")!;
    nextBtn.textContent = current < steps.length - 1 ? t("common.next") : t("common.done");
    tooltip!.querySelector<HTMLElement>(".blora-tour__prev")!.style.visibility =
      current > 0 ? "visible" : "hidden";

    placeOverlay();
    if (overlay?.hasAttribute("data-open")) tooltip!.setAttribute("data-open", "");
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
    if (overlay) {
      stack = new OverlayController(overlay, {
        modal: true,
        closeOnEscape: true,
        closeOnOutsidePointer: false,
        restoreFocus: true,
        trapFocus: true,
        lockScroll: true,
      });
      stack.open();
    }
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    goTo(0);
    overlay?.offsetWidth;
    tooltip?.offsetWidth;
    const win = doc.defaultView;
    const reveal = () => {
      overlay?.setAttribute("data-open", "");
      tooltip?.setAttribute("data-open", "");
    };
    if (win) win.requestAnimationFrame(reveal);
    else reveal();
  };

  const end = () => {
    const wasOpen = current >= 0;
    window.removeEventListener("resize", onReposition);
    window.removeEventListener("scroll", onReposition, true);
    doc.documentElement.removeAttribute("data-blora-tour-open");
    const overlayNode = overlay;
    const tooltipNode = tooltip;
    const stackNode = stack;
    overlay = null;
    tooltip = null;
    stack = null;
    current = -1;
    overlayNode?.removeAttribute("data-open");
    tooltipNode?.removeAttribute("data-open");
    const removeNodes = () => {
      stackNode?.close();
      try {
        overlayNode?.hidePopover?.();
      } catch {
        /* already closed */
      }
      overlayNode?.remove();
    };
    if (tooltipNode) whenMotionDone(tooltipNode, removeNodes);
    else removeNodes();
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
    start.textContent = this.getAttribute("label") ?? t("tour.start");
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
    if (start) start.textContent = this.getAttribute("label") ?? t("tour.start");
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
