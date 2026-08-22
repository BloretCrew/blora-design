/**
 * Drawer open/close with enter/leave animations.
 */
import { OverlayController } from "../../controllers/overlay-controller.js";
import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";
import { createBloraIcon } from "../../core/icons.js";
import { whenMotionDone } from "../../core/motion.js";

export const BLORA_DRAWER_TAG = "blora-drawer";
export interface DrawerController {
  open(): void;
  close(): void;
  destroy(): void;
}

function promoteDrawerLayer(root: HTMLElement): void {
  if (typeof root.showPopover !== "function") return;
  root.setAttribute("popover", "manual");
  if (root.matches(":popover-open")) return;
  try {
    root.showPopover();
  } catch {
    /* UA without popover top-layer */
  }
}

function dismissDrawerLayer(root: HTMLElement): void {
  if (typeof root.hidePopover === "function") {
    try {
      root.hidePopover();
    } catch {
      /* already closed */
    }
  }
  if (root.getAttribute("popover") === "manual") root.removeAttribute("popover");
}

export function createDrawerController(root: HTMLElement, host?: HTMLElement): DrawerController {
  if (typeof document === "undefined") {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }
  const surface = host ?? (root.closest("blora-drawer") as HTMLElement | null) ?? root;
  const panel = root.querySelector<HTMLElement>(".blora-drawer__panel");
  let syncing = false;
  let overlay: OverlayController | null = null;
  let cancelMotion: (() => void) | null = null;

  const onRequest = () => setOpen(false);

  const setOpen = (open: boolean) => {
    if (syncing) return;
    syncing = true;
    try {
      if (open) {
        cancelMotion?.();
        cancelMotion = null;
        root.setAttribute("data-open", "");
        root.setAttribute("open", "");
        if (surface !== root) {
          surface.setAttribute("data-open", "");
          surface.setAttribute("open", "");
        }
        panel?.setAttribute("tabindex", "-1");
        overlay?.close();
        overlay = new OverlayController(root, {
          modal: true,
          closeOnEscape: true,
          closeOnOutsidePointer: false,
          restoreFocus: true,
          trapFocus: true,
          lockScroll: true,
        });
        overlay.open();
        root.addEventListener("blora-close-request", onRequest);
        promoteDrawerLayer(root);
        return;
      }
      root.removeAttribute("data-open");
      root.removeAttribute("open");
      if (surface !== root) {
        surface.removeAttribute("data-open");
        surface.removeAttribute("open");
      }
      root.removeEventListener("blora-close-request", onRequest);
      const stack = overlay;
      overlay = null;
      cancelMotion?.();
      cancelMotion = whenMotionDone(root, () => {
        cancelMotion = null;
        stack?.close();
        dismissDrawerLayer(root);
      });
    } finally {
      syncing = false;
    }
  };

  const onClick = (e: MouseEvent) => {
    const node = e.target as HTMLElement;
    if (node.closest("[data-blora-close]") || node.classList.contains("blora-drawer__mask")) {
      setOpen(false);
    }
  };

  root.addEventListener("click", onClick);

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    destroy() {
      root.removeEventListener("click", onClick);
      root.removeEventListener("blora-close-request", onRequest);
      overlay?.destroy();
      overlay = null;
      cancelMotion?.();
      dismissDrawerLayer(root);
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
      /* Prefer an existing controller if the host already bound one */
      const any = drawer as HTMLElement & { __ctrl?: { open: () => void } };
      if (any.__ctrl?.open) any.__ctrl.open();
      else {
        drawer.setAttribute("data-open", "");
        drawer.setAttribute("open", "");
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
  private relocating = false;
  private home: { parent: Node; next: ChildNode | null } | null = null;

  static get observedAttributes(): string[] {
    return ["title", "position", "open", "close-label"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal) return;
    if (name === "open") {
      if (this.hasAttribute("open")) {
        this.portalToBody();
        this.controller?.open();
      } else {
        this.controller?.close();
        const layer = this.querySelector<HTMLElement>(".blora-drawer") ?? this;
        whenMotionDone(layer, () => this.restoreHome());
      }
      return;
    }
    this.sync();
  }

  open(): void {
    this.setAttribute("open", "");
    this.setAttribute("data-open", "");
  }

  close(): void {
    this.removeAttribute("open");
    this.removeAttribute("data-open");
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
    title.textContent = this.getAttribute("title") ?? t("drawer.title");
    const close = this.ownerDocument.createElement("button");
    close.type = "button";
    close.className = "blora-drawer__close";
    close.dataset.bloraClose = "";
    close.setAttribute("aria-label", this.getAttribute("close-label") ?? t("common.close"));
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
    if (title) title.textContent = this.getAttribute("title") ?? t("drawer.title");
    const close = root.querySelector<HTMLElement>(".blora-drawer__close");
    if (close)
      close.setAttribute("aria-label", this.getAttribute("close-label") ?? t("common.close"));
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-drawer");
    this.controller?.destroy();
    this.controller = root ? createDrawerController(root, this) : null;
  }

  disconnectedCallback(): void {
    if (this.relocating) return;
    super.disconnectedCallback();
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
    this.restoreHome();
  }

  private portalToBody(): void {
    const doc = this.ownerDocument;
    if (!this.parentNode || this.parentElement === doc.body) return;
    this.home = { parent: this.parentNode, next: this.nextSibling };
    this.relocating = true;
    doc.body.append(this);
    this.relocating = false;
  }

  private restoreHome(): void {
    if (!this.home) return;
    const { parent, next } = this.home;
    this.home = null;
    if (!parent.isConnected) return;
    this.relocating = true;
    if (next && next.parentNode === parent) parent.insertBefore(this, next);
    else parent.appendChild(this);
    this.relocating = false;
  }
}

export function defineBloraDrawer(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_DRAWER_TAG)) return;
  registry.define(BLORA_DRAWER_TAG, BloraDrawer);
}
