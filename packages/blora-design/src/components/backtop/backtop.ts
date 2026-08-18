/**
 * BackTop: show after scroll threshold; click scrolls to top (v1 initBackTop / backTop).
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_BACKTOP_TAG = "blora-backtop";
export interface BackTopController {
  show(): void;
  hide(): void;
  destroy(): void;
}

export interface BackTopOptions {
  showAfter?: number;
  target?: HTMLElement | Window | null;
}

/**
 * Inject the official arrow icon without innerHTML — innerHTML ejects Lit
 * ChildPart markers when the button is rendered by Storybook / Lit templates.
 */
function ensureBackTopIcon(btn: HTMLElement): void {
  if (btn.querySelector("svg")) return;

  const svg = createBloraIcon("arrow-up", 22, btn.ownerDocument);
  svg.setAttribute("stroke-width", "2.5");

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

/** Back-to-top CE backed by the existing scroll controller. */
export class BloraBacktop extends BloraElement {
  private controller: BackTopController | null = null;

  static get observedAttributes(): string[] {
    return ["show-after", "target", "label"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal) return;
    this.sync();
  }

  show(): void {
    this.controller?.show();
  }

  hide(): void {
    this.controller?.hide();
  }

  protected render(): void {
    const button = this.ownerDocument.createElement("button");
    button.type = "button";
    button.className = "blora-backtop";
    button.dataset.bloraGenerated = "";
    button.setAttribute("aria-label", this.getAttribute("label") ?? "回到顶部");
    const showAfter = this.getAttribute("show-after");
    if (showAfter) button.dataset.showAfter = showAfter;
    const target = this.getAttribute("target");
    if (target) button.dataset.target = target;
    this.replaceChildren(button);
  }

  protected override sync(): void {
    const button = this.querySelector<HTMLElement>(".blora-backtop");
    if (!button) return;
    button.setAttribute("aria-label", this.getAttribute("label") ?? "回到顶部");
    const showAfter = this.getAttribute("show-after");
    if (showAfter) button.dataset.showAfter = showAfter;
    else delete button.dataset.showAfter;
    const target = this.getAttribute("target");
    if (target) button.dataset.target = target;
    else delete button.dataset.target;
    this.rebind();
  }

  protected bindEvents(): void {
    const button = this.querySelector<HTMLElement>(".blora-backtop");
    this.controller?.destroy();
    this.controller = button ? createBackTopController(button) : null;
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraBacktop(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_BACKTOP_TAG)) return;
  registry.define(BLORA_BACKTOP_TAG, BloraBacktop);
}
