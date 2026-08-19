/**
 * OverlayController - unified overlay management.
 * Spec §12.1-12.2: portal, z-index, outside click, Escape,
 * focus return, focus trap, scroll lock, overlay stack.
 */

export interface OverlayOptions {
  modal: boolean;
  closeOnEscape: boolean;
  closeOnOutsidePointer: boolean;
  restoreFocus: boolean;
  trapFocus: boolean;
  lockScroll: boolean;
}

const defaultOverlayOptions: OverlayOptions = {
  modal: true,
  closeOnEscape: true,
  closeOnOutsidePointer: true,
  restoreFocus: true,
  trapFocus: true,
  lockScroll: true,
};

// --- Overlay Stack (Spec §12.2) ---

interface StackEntry {
  overlay: HTMLElement;
  document: Document;
  options: OverlayOptions;
  previousFocus: Element | null;
  scrollLockCount: number;
}

interface ScrollLockSnapshot {
  y: number;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  paddingRight: string;
  overflow: string;
}

const stacks = new WeakMap<Document, StackEntry[]>();
const scrollLockCounts = new WeakMap<Document, number>();
const scrollLockSnapshots = new WeakMap<Document, ScrollLockSnapshot>();
const modalCounts = new WeakMap<Document, number>();

function markModalOpen(document: Document): void {
  const count = (modalCounts.get(document) ?? 0) + 1;
  modalCounts.set(document, count);
  document.documentElement.setAttribute("data-blora-modal-open", "");
}

function markModalClosed(document: Document): void {
  const count = Math.max(0, (modalCounts.get(document) ?? 0) - 1);
  if (count === 0) {
    modalCounts.delete(document);
    document.documentElement.removeAttribute("data-blora-modal-open");
  } else {
    modalCounts.set(document, count);
  }
}

function getStack(document: Document): StackEntry[] {
  let stack = stacks.get(document);
  if (!stack) {
    stack = [];
    stacks.set(document, stack);
  }
  return stack;
}

function lockScroll(document: Document): void {
  const count = (scrollLockCounts.get(document) ?? 0) + 1;
  scrollLockCounts.set(document, count);
  if (count !== 1) return;

  const body = document.body;
  const root = document.documentElement;
  if (!body) return;

  const win = document.defaultView;
  const y = win ? win.scrollY || root.scrollTop || 0 : root.scrollTop || 0;
  const sbw = win ? Math.max(0, win.innerWidth - root.clientWidth) : 0;

  scrollLockSnapshots.set(document, {
    y,
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    paddingRight: body.style.paddingRight,
    overflow: body.style.overflow,
  });

  /* Freeze the page in place. `overflow: hidden` makes `body` the sticky
     containing block, so a scrolled navbar jumps out of the viewport.
     1.x uses the same position:fixed snapshot for that reason. */
  root.dataset.bloraScrollLocked = "1";
  body.style.position = "fixed";
  body.style.top = `-${y}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "visible";
  if (sbw) body.style.paddingRight = `${sbw}px`;
}

function unlockScroll(document: Document): void {
  const count = Math.max(0, (scrollLockCounts.get(document) ?? 0) - 1);
  if (count > 0) {
    scrollLockCounts.set(document, count);
    return;
  }

  scrollLockCounts.delete(document);
  const snapshot = scrollLockSnapshots.get(document);
  scrollLockSnapshots.delete(document);

  const body = document.body;
  const root = document.documentElement;
  delete root.dataset.bloraScrollLocked;

  if (body && snapshot) {
    body.style.position = snapshot.position;
    body.style.top = snapshot.top;
    body.style.left = snapshot.left;
    body.style.right = snapshot.right;
    body.style.width = snapshot.width;
    body.style.paddingRight = snapshot.paddingRight;
    body.style.overflow = snapshot.overflow;
  } else if (body) {
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.paddingRight = "";
    if (body.style.overflow === "hidden" || body.style.overflow === "visible") {
      body.style.overflow = "";
    }
  }

  restoreWindowScroll(document, snapshot?.y ?? 0);
}

function restoreWindowScroll(document: Document, y: number): void {
  const win = document.defaultView;
  if (!win || win.navigator.userAgent.includes("jsdom")) {
    document.documentElement.scrollTop = y;
    return;
  }
  win.scrollTo(0, y);
}

function getFocusableElements(root: HTMLElement): HTMLElement[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    "[contenteditable]",
  ].join(", ");

  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => el.offsetParent !== null || el === root.ownerDocument.activeElement,
  );
}

function trapTabKey(e: KeyboardEvent, overlay: HTMLElement): void {
  if (e.key !== "Tab") return;

  const focusable = getFocusableElements(overlay);
  if (focusable.length === 0) return;

  const first = focusable[0]!;
  const last = focusable[focusable.length - 1]!;
  const active = overlay.ownerDocument.activeElement;

  if (e.shiftKey) {
    if (active === first || !overlay.contains(active)) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (active === last || !overlay.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  }
}

export class OverlayController {
  private entry: StackEntry | null = null;
  private readonly overlay: HTMLElement;
  private readonly options: OverlayOptions;

  constructor(overlay: HTMLElement, options: Partial<OverlayOptions> = {}) {
    this.overlay = overlay;
    this.options = { ...defaultOverlayOptions, ...options };
  }

  open(): void {
    if (this.entry) return;

    const document = this.overlay.ownerDocument;
    const previousFocus = document.activeElement;

    this.entry = {
      overlay: this.overlay,
      document,
      options: this.options,
      previousFocus,
      scrollLockCount: 0,
    };

    getStack(document).push(this.entry);

    if (this.options.modal) {
      markModalOpen(document);
    }

    if (this.options.lockScroll) {
      lockScroll(document);
      this.entry.scrollLockCount = 1;
    }

    // Focus management
    if (this.options.trapFocus || this.options.restoreFocus) {
      // Move focus into the overlay
      document.defaultView?.requestAnimationFrame(() => {
        const focusable = getFocusableElements(this.overlay);
        if (focusable.length > 0) {
          focusable[0]!.focus();
        } else {
          this.overlay.setAttribute("tabindex", "-1");
          this.overlay.focus();
        }
      });
    }

    // Keyboard listener
    if (this.options.closeOnEscape || this.options.trapFocus) {
      document.addEventListener("keydown", this.onKeyDown);
    }

    // Outside click listener
    if (this.options.closeOnOutsidePointer) {
      this.overlay.addEventListener("pointerdown", this.onPointerDown);
    }
  }

  close(): void {
    if (!this.entry) return;

    const stack = getStack(this.entry.document);
    const index = stack.indexOf(this.entry);
    if (index >= 0) {
      stack.splice(index, 1);
    }

    if (this.entry.scrollLockCount > 0) {
      unlockScroll(this.entry.document);
    }

    if (this.options.modal) {
      markModalClosed(this.entry.document);
    }

    this.entry.document.removeEventListener("keydown", this.onKeyDown);
    this.overlay.removeEventListener("pointerdown", this.onPointerDown);

    // Restore focus
    if (this.options.restoreFocus && this.entry.previousFocus instanceof HTMLElement) {
      const focusTarget = this.entry.previousFocus;
      this.entry.document.defaultView?.requestAnimationFrame(() => {
        focusTarget.dispatchEvent(new Event("focus"));
        focusTarget.focus();
      });
    }

    this.entry = null;
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this.entry) return;

    // Only handle if this is the topmost overlay
    const stack = getStack(this.entry.document);
    const topEntry = stack[stack.length - 1];
    if (topEntry !== this.entry) return;

    if (e.key === "Escape" && this.options.closeOnEscape) {
      e.preventDefault();
      e.stopPropagation();
      // Dispatch on the host element (not the shadow-internal panel)
      // so the dialog's blora-close-request listener on `this` works.
      this.overlay.dispatchEvent(
        new CustomEvent("blora-close-request", { bubbles: true, composed: true }),
      );
    }

    if (this.options.trapFocus) {
      trapTabKey(e, this.overlay);
    }
  };

  private onPointerDown = (e: PointerEvent): void => {
    if (e.target === this.overlay) {
      this.overlay.dispatchEvent(
        new CustomEvent("blora-close-request", { bubbles: true, composed: true }),
      );
    }
  };

  destroy(): void {
    this.close();
  }
}
