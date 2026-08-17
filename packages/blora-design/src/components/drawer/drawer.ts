/**
 * Drawer open/close with enter/leave animations.
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_DRAWER_TAG = "blora-drawer";
export interface DrawerController {
  open(): void;
  close(): void;
  destroy(): void;
}

export function createDrawerController(root: HTMLElement, host?: HTMLElement): DrawerController {
  if (typeof document === "undefined") {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }
  const doc = root.ownerDocument;
  const surface = host ?? (root.closest("blora-drawer") as HTMLElement | null) ?? root;
  const panel = root.querySelector<HTMLElement>(".blora-drawer__panel");
  const mask = root.querySelector<HTMLElement>(".blora-drawer__mask");
  let closing = false;
  let closeTimer = 0;

  const clearLeaving = () => {
    root.classList.remove("is-leaving");
    mask?.classList.remove("is-leaving");
    panel?.classList.remove("is-leaving");
  };

  const setOpen = (open: boolean) => {
    if (open) {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = 0;
      }
      closing = false;
      clearLeaving();
      root.setAttribute("data-open", "");
      root.setAttribute("open", "");
      root.classList.add("is-open");
      panel?.setAttribute("tabindex", "-1");
      panel?.focus({ preventScroll: true });
      return;
    }
    if (closing) return;
    if (
      !root.hasAttribute("data-open") &&
      !root.classList.contains("is-open") &&
      !root.hasAttribute("open")
    ) {
      return;
    }
    closing = true;
    root.classList.add("is-leaving");
    mask?.classList.add("is-leaving");
    panel?.classList.add("is-leaving");

    const finish = () => {
      if (!closing) return;
      root.removeAttribute("data-open");
      root.removeAttribute("open");
      root.classList.remove("is-open");
      if (surface !== root) {
        surface.removeAttribute("data-open");
        surface.removeAttribute("open");
      }
      clearLeaving();
      closing = false;
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = 0;
      }
      panel?.removeEventListener("animationend", onEnd);
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target !== panel && e.target !== mask) return;
      finish();
    };
    panel?.addEventListener("animationend", onEnd);
    /* Fallback if animation disabled / reduced motion */
    closeTimer = window.setTimeout(finish, 400);
  };

  const onClick = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-blora-close]") || t.classList.contains("blora-drawer__mask")) {
      setOpen(false);
    }
  };
  const onKey = (e: KeyboardEvent) => {
    if (
      e.key === "Escape" &&
      (root.hasAttribute("data-open") ||
        root.classList.contains("is-open") ||
        root.hasAttribute("open"))
    ) {
      setOpen(false);
    }
  };

  root.addEventListener("click", onClick);
  doc.addEventListener("keydown", onKey);

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    destroy() {
      root.removeEventListener("click", onClick);
      doc.removeEventListener("keydown", onKey);
    },
  };
}

/** Bind buttons [data-blora-drawer-open="id"] to drawers by id. */
export function bindDrawerTriggers(root: ParentNode = document): () => void {
  if (typeof document === "undefined") return () => {};
  const handlers: Array<() => void> = [];
  root.querySelectorAll<HTMLElement>("[data-blora-drawer-open]").forEach((btn) => {
    const id = btn.getAttribute("data-blora-drawer-open");
    if (!id) return;
    const onClick = () => {
      const drawer = document.getElementById(id);
      if (!drawer) return;
      /* Prefer existing controller if story attached one */
      const any = drawer as HTMLElement & { __ctrl?: { open: () => void } };
      if (any.__ctrl?.open) any.__ctrl.open();
      else {
        drawer.setAttribute("data-open", "");
        drawer.setAttribute("open", "");
        drawer.classList.add("is-open");
      }
    };
    btn.addEventListener("click", onClick);
    handlers.push(() => btn.removeEventListener("click", onClick));
  });
  return () => handlers.forEach((h) => h());
}

/** Drawer CE that owns mask, panel, header and body structure. */
export class BloraDrawer extends BloraElement {
  private controller: DrawerController | null = null;
  private contentNodes: Node[] | null = null;

  static get observedAttributes(): string[] {
    return ["title", "position", "open", "close-label"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal) return;
    if (name === "open") {
      if (this.hasAttribute("open")) this.controller?.open();
      else this.controller?.close();
      return;
    }
    this.sync();
  }

  open(): void {
    this.setAttribute("open", "");
    this.setAttribute("data-open", "");
    this.controller?.open();
  }

  close(): void {
    this.controller?.close();
  }

  protected render(): void {
    if (!this.contentNodes) {
      const existing = this.querySelector(".blora-drawer__body");
      this.contentNodes = existing ? Array.from(existing.childNodes) : Array.from(this.childNodes);
    }
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-drawer";
    root.dataset.bloraGenerated = "";
    root.dataset.position = this.getAttribute("position") ?? "right";
    if (this.hasAttribute("open")) {
      root.dataset.open = "";
      root.setAttribute("open", "");
      root.classList.add("is-open");
    }
    const mask = this.ownerDocument.createElement("div");
    mask.className = "blora-drawer__mask";
    const panel = this.ownerDocument.createElement("div");
    panel.className = "blora-drawer__panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    const header = this.ownerDocument.createElement("div");
    header.className = "blora-drawer__header";
    const title = this.ownerDocument.createElement("h3");
    title.className = "blora-drawer__title";
    title.textContent = this.getAttribute("title") ?? "Drawer";
    const close = this.ownerDocument.createElement("button");
    close.type = "button";
    close.className = "blora-drawer__close";
    close.dataset.bloraClose = "";
    close.setAttribute("aria-label", this.getAttribute("close-label") ?? "Close");
    close.appendChild(createBloraIcon("close", 18, this.ownerDocument));
    header.append(title, close);
    const body = this.ownerDocument.createElement("div");
    body.className = "blora-drawer__body";
    const content = this.ownerDocument.createElement("div");
    content.className = "blora-drawer__content";
    content.append(...this.contentNodes);
    body.appendChild(content);
    panel.append(header, body);
    root.append(mask, panel);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-drawer");
    if (!root) return;
    root.dataset.position = this.getAttribute("position") ?? "right";
    const title = root.querySelector<HTMLElement>(".blora-drawer__title");
    if (title) title.textContent = this.getAttribute("title") ?? "Drawer";
    const close = root.querySelector<HTMLElement>(".blora-drawer__close");
    if (close) close.setAttribute("aria-label", this.getAttribute("close-label") ?? "Close");
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-drawer");
    this.controller?.destroy();
    this.controller = root ? createDrawerController(root, this) : null;
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraDrawer(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_DRAWER_TAG)) return;
  registry.define(BLORA_DRAWER_TAG, BloraDrawer);
}
