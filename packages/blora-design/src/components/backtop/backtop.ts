/**
 * BackTop: show after scroll threshold; click scrolls to top (v1 initBackTop / backTop).
 * Icon: v1 lucide-style arrow-up SVG (same path as legacy ensureGlobalBackTopFab).
 */
export interface BackTopController {
  show(): void;
  hide(): void;
  destroy(): void;
}

export interface BackTopOptions {
  showAfter?: number;
  target?: HTMLElement | Window | null;
}

/** v1 FAB arrow-up path data (lucide-style). Exported for Story markup if needed. */
export const BACKTOP_ARROW_SVG =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>';

/**
 * Inject v1 stroke arrow without innerHTML — innerHTML ejects Lit ChildPart markers
 * when the button is rendered by Storybook/Lit templates.
 */
function ensureBackTopIcon(btn: HTMLElement): void {
  if (btn.querySelector("svg")) return;

  const doc = btn.ownerDocument;
  const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2.5");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");

  const p1 = doc.createElementNS("http://www.w3.org/2000/svg", "path");
  p1.setAttribute("d", "m5 12 7-7 7 7");
  const p2 = doc.createElementNS("http://www.w3.org/2000/svg", "path");
  p2.setAttribute("d", "M12 19V5");
  svg.append(p1, p2);

  /* Drop plain-text glyphs only; leave alone if author put custom nodes (no svg yet). */
  const onlyText =
    btn.childNodes.length > 0 &&
    Array.from(btn.childNodes).every(
      (n) => n.nodeType === Node.TEXT_NODE || n.nodeType === Node.COMMENT_NODE,
    );
  if (onlyText || btn.childNodes.length === 0) {
    /* Remove text nodes only — do not wipe Lit comment markers via innerHTML */
    Array.from(btn.childNodes).forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) n.remove();
    });
    btn.appendChild(svg);
  } else {
    btn.appendChild(svg);
  }
}

export function createBackTopController(
  btn: HTMLElement,
  options?: BackTopOptions,
): BackTopController {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return { show: () => {}, hide: () => {}, destroy: () => {} };
  }
  btn.classList.add("blora-backtop");
  ensureBackTopIcon(btn);
  if (!btn.getAttribute("aria-label")) btn.setAttribute("aria-label", "回到顶部");
  const attrAfter = Number(
    btn.getAttribute("data-show-after") || btn.getAttribute("data-blora-backtop") || "",
  );
  const showAfter =
    options?.showAfter ?? (Number.isFinite(attrAfter) && attrAfter > 0 ? attrAfter : 400);

  const targetAttr = btn.getAttribute("data-target");
  let scrollRoot: HTMLElement | Window = window;
  if (options?.target) scrollRoot = options.target;
  else if (targetAttr) {
    const el = document.querySelector<HTMLElement>(targetAttr);
    if (el) scrollRoot = el;
  }

  const getY = () => {
    if (scrollRoot === window) return window.scrollY || document.documentElement.scrollTop || 0;
    return (scrollRoot as HTMLElement).scrollTop;
  };

  const show = () => {
    btn.classList.add("is-visible");
    btn.classList.remove("is-hidden");
    btn.removeAttribute("data-hidden");
  };
  const hide = () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-hidden");
    btn.setAttribute("data-hidden", "");
  };

  const sync = () => {
    if (getY() >= showAfter) show();
    else hide();
  };

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    if (scrollRoot === window) window.scrollTo({ top: 0, behavior: "smooth" });
    else (scrollRoot as HTMLElement).scrollTo({ top: 0, behavior: "smooth" });
  };

  hide();
  sync();
  const scrollTarget: EventTarget = scrollRoot === window ? window : scrollRoot;
  scrollTarget.addEventListener("scroll", sync, { passive: true });
  btn.addEventListener("click", onClick);

  return {
    show,
    hide,
    destroy() {
      scrollTarget.removeEventListener("scroll", sync);
      btn.removeEventListener("click", onClick);
    },
  };
}

/** Bind all [data-blora-backtop] / .blora-backtop in scope. */
export function initBackTop(root: ParentNode = document): () => void {
  if (typeof document === "undefined") return () => {};
  const ctrls: BackTopController[] = [];
  root.querySelectorAll<HTMLElement>("[data-blora-backtop], .blora-backtop").forEach((btn) => {
    if (btn.classList.contains("blora-fab--static")) return;
    ctrls.push(createBackTopController(btn));
  });
  return () => ctrls.forEach((c) => c.destroy());
}
