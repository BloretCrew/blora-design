/**
 * Collapse / accordion controller.
 *
 * Open height = measured content (px), written to --blora-collapse-h.
 * Closed height = 0 via CSS. No hard-coded caps (400px etc.).
 */
export interface CollapseController {
  destroy(): void;
}

const ITEM_SEL = ".blora-collapse__item, .blora-accordion__item";
const HEAD_SEL = ".blora-collapse__head, .blora-accordion__head";
const BODY_SEL = ".blora-collapse__body, .blora-accordion__body";

function isOpen(item: HTMLElement): boolean {
  return item.hasAttribute("data-open") || item.classList.contains("is-open");
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
  item.classList.add("is-open");
  head?.setAttribute("aria-expanded", "true");

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
  item.classList.remove("is-open");
  head?.setAttribute("aria-expanded", "false");

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
    } else {
      body.style.removeProperty("--blora-collapse-h");
      clearInlineHeight(body);
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
