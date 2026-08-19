/**
 * Collapse / accordion controller.
 *
 * Open height = measured content (px), written to --blora-collapse-h.
 * Closed height = 0 via CSS. No hard-coded caps (400px etc.).
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_COLLAPSE_TAG = "blora-collapse";

let collapseInstanceId = 0;

export interface CollapseController {
  destroy(): void;
}

const ITEM_SEL = ".blora-collapse__item, .blora-accordion__item";
const HEAD_SEL = ".blora-collapse__head, .blora-accordion__head";
const BODY_SEL = ".blora-collapse__body, .blora-accordion__body";

function isOpen(item: HTMLElement): boolean {
  return item.hasAttribute("data-open");
}

function getBody(item: HTMLElement): HTMLElement | null {
  return item.querySelector<HTMLElement>(BODY_SEL);
}

/** Real content height in px (works even when max-height is currently 0). */
function measureContentHeight(body: HTMLElement): number {
  const content = body.firstElementChild as HTMLElement | null;
  /* scrollHeight on a max-height:0 box still reports full content in modern engines */
  const fromBody = body.scrollHeight;
  const fromContent = content
    ? Math.max(content.scrollHeight, content.offsetHeight, content.getBoundingClientRect().height)
    : 0;
  return Math.ceil(Math.max(fromBody, fromContent, 1));
}

function applyMeasuredHeight(body: HTMLElement, px: number): void {
  body.style.setProperty("--blora-collapse-h", `${px}px`);
}

function clearInlineHeight(body: HTMLElement): void {
  /* After open animation, allow free growth if content changes */
  body.style.maxHeight = "";
}

function openItem(item: HTMLElement): void {
  const body = getBody(item);
  const head = item.querySelector<HTMLElement>(HEAD_SEL);
  if (!body) return;

  const h = measureContentHeight(body);
  applyMeasuredHeight(body, h);

  item.setAttribute("data-open", "");
  head?.setAttribute("aria-expanded", "true");
  body.setAttribute("aria-hidden", "false");

  /* After transition, drop fixed max so dynamic content can grow */
  const onEnd = (ev: TransitionEvent) => {
    if (ev.propertyName !== "max-height") return;
    body.removeEventListener("transitionend", onEnd);
    if (isOpen(item)) {
      body.style.maxHeight = "none";
    }
  };
  body.addEventListener("transitionend", onEnd);
}

function closeItem(item: HTMLElement): void {
  const body = getBody(item);
  const head = item.querySelector<HTMLElement>(HEAD_SEL);
  if (!body) return;

  /* Lock current rendered height, then CSS takes it to 0 */
  const current =
    body.style.maxHeight === "none" || !body.style.maxHeight
      ? measureContentHeight(body)
      : body.scrollHeight || measureContentHeight(body);
  applyMeasuredHeight(body, current);
  body.style.maxHeight = `${current}px`;
  void body.offsetHeight; /* reflow so browser registers the start height */

  item.removeAttribute("data-open");
  head?.setAttribute("aria-expanded", "false");
  body.setAttribute("aria-hidden", "true");

  /* Next frame: clear inline maxHeight so CSS max-height:0 applies with transition */
  requestAnimationFrame(() => {
    body.style.maxHeight = "";
  });
}

export function createCollapseController(root: HTMLElement): CollapseController {
  if (typeof document === "undefined") return { destroy: () => {} };

  /* Pre-measure already-open panels so first paint is correct height */
  root.querySelectorAll<HTMLElement>(ITEM_SEL).forEach((item) => {
    const body = getBody(item);
    if (!body) return;
    if (isOpen(item)) {
      const h = measureContentHeight(body);
      applyMeasuredHeight(body, h);
      body.style.maxHeight = "none";
      body.setAttribute("aria-hidden", "false");
    } else {
      body.style.removeProperty("--blora-collapse-h");
      clearInlineHeight(body);
      body.setAttribute("aria-hidden", "true");
    }
  });

  const onClick = (e: MouseEvent) => {
    const head = (e.target as HTMLElement).closest<HTMLElement>(HEAD_SEL);
    if (!head || !root.contains(head)) return;
    const item = head.closest<HTMLElement>(ITEM_SEL);
    if (!item) return;

    const group =
      item.closest<HTMLElement>("[data-blora-accordion]") ||
      (root.hasAttribute("data-blora-accordion") || root.classList.contains("blora-accordion")
        ? root
        : null);

    const open = isOpen(item);

    if (group && !open) {
      group.querySelectorAll<HTMLElement>(ITEM_SEL).forEach((other) => {
        if (other !== item && isOpen(other)) closeItem(other);
      });
    }

    if (open) closeItem(item);
    else openItem(item);
  };

  root.addEventListener("click", onClick);
  root.querySelectorAll<HTMLElement>(HEAD_SEL).forEach((h) => {
    const item = h.closest<HTMLElement>(ITEM_SEL);
    h.setAttribute("aria-expanded", String(!!item && isOpen(item)));
  });

  return {
    destroy() {
      root.removeEventListener("click", onClick);
    },
  };
}

interface CollapseItemDefinition {
  content: Node[];
  disabled: boolean;
  heading: string;
  open: boolean;
}

/** Composite CE. Child `<blora-collapse-item>` definitions become official disclosure markup. */
export class BloraCollapse extends BloraElement {
  private controller: CollapseController | null = null;
  private definitions: CollapseItemDefinition[] | null = null;
  private readonly instanceId = ++collapseInstanceId;

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-collapse-item")
        .map((item) => ({
          content: Array.from(item.childNodes),
          disabled: item.hasAttribute("disabled"),
          heading: item.getAttribute("heading") ?? item.getAttribute("label") ?? "",
          open: item.hasAttribute("open"),
        }));
    }

    const root = document.createElement("div");
    root.className = "blora-collapse";
    root.dataset.bloraGenerated = "";
    for (const [index, definition] of this.definitions.entries()) {
      const item = document.createElement("div");
      item.className = "blora-collapse__item";
      if (definition.open) item.dataset.open = "";
      const head = document.createElement("button");
      head.className = "blora-collapse__head";
      head.type = "button";
      head.disabled = definition.disabled;
      head.id = `blora-collapse-head-${this.instanceId}-${index}`;
      head.setAttribute("aria-expanded", String(definition.open));
      const heading = document.createElement("span");
      heading.textContent = definition.heading;
      const icon = document.createElement("span");
      icon.className = "blora-collapse__icon";
      icon.appendChild(createBloraIcon("chevron-right", 14));
      head.append(heading, icon);
      const body = document.createElement("div");
      body.className = "blora-collapse__body";
      body.id = `blora-collapse-panel-${this.instanceId}-${index}`;
      body.setAttribute("role", "region");
      body.setAttribute("aria-labelledby", head.id);
      body.setAttribute("aria-hidden", String(!definition.open));
      head.setAttribute("aria-controls", body.id);
      const content = document.createElement("div");
      content.className = "blora-collapse__content";
      content.append(...definition.content);
      body.appendChild(content);
      item.append(head, body);
      root.appendChild(item);
    }
    this.replaceChildren(root);
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-collapse");
    if (root) this.controller = createCollapseController(root);
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraCollapse(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_COLLAPSE_TAG)) return;
  registry.define(BLORA_COLLAPSE_TAG, BloraCollapse);
}
