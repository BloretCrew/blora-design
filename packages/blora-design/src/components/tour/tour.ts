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
    const button = (className: string, text: string) => {
      const el = doc.createElement("button");
      el.className = className;
      el.type = "button";
      el.textContent = text;
      return el;
    };
    buttons.append(
      button("blora-tour__skip", "跳过"),
      button("blora-tour__prev", "上一步"),
      button("blora-tour__next", "下一步"),
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

  const goTo = (idx: number) => {
    current = Math.max(0, Math.min(idx, steps.length - 1));
    const step = steps[current]!;
    const rect = step.getBoundingClientRect();

    overlay!.style.position = "fixed";
    overlay!.style.boxShadow = `0 0 0 9999px color-mix(in srgb, var(--blora-color-text-primary) 45%, transparent)`;
    overlay!.style.borderRadius = "var(--blora-radius-sm)";
    overlay!.style.top = `${rect.top - 4}px`;
    overlay!.style.left = `${rect.left - 4}px`;
    overlay!.style.width = `${rect.width + 8}px`;
    overlay!.style.height = `${rect.height + 8}px`;
    overlay!.style.zIndex = "var(--blora-z-toast)";

    tooltip!.querySelector(".blora-tour__title")!.textContent = step.dataset.tourTitle ?? "";
    tooltip!.querySelector(".blora-tour__desc")!.textContent = step.dataset.tourDesc ?? "";
    tooltip!.querySelector(".blora-tour__counter")!.textContent =
      `${current + 1} / ${steps.length}`;

    const nextBtn = tooltip!.querySelector<HTMLElement>(".blora-tour__next")!;
    nextBtn.textContent = current < steps.length - 1 ? "下一步" : "完成";
    tooltip!.querySelector<HTMLElement>(".blora-tour__prev")!.style.visibility =
      current > 0 ? "visible" : "hidden";

    tooltip!.style.position = "fixed";
    tooltip!.style.top = `${rect.bottom + 12}px`;
    tooltip!.style.left = `${rect.left}px`;
    tooltip!.style.zIndex = "var(--blora-z-toast)";
    tooltip!.setAttribute("data-open", "");
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
    goTo(0);
  };

  const end = () => {
    const wasOpen = current >= 0;
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
