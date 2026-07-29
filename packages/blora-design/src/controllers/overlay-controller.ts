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

export const defaultOverlayOptions: OverlayOptions = {
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
  options: OverlayOptions;
  previousFocus: Element | null;
  scrollLockCount: number;
}

const stack: StackEntry[] = [];
let scrollLockCount = 0;

function lockScroll(): void {
  scrollLockCount++;
  if (scrollLockCount === 1) {
    document.body.style.overflow = "hidden";
  }
}

function unlockScroll(): void {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = "";
  }
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
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

function trapTabKey(e: KeyboardEvent, overlay: HTMLElement): void {
  if (e.key !== "Tab") return;

  const focusable = getFocusableElements(overlay);
  if (focusable.length === 0) return;

  const first = focusable[0]!;
  const last = focusable[focusable.length - 1]!;
  const active = document.activeElement;

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

    const previousFocus = document.activeElement;

    this.entry = {
      overlay: this.overlay,
      options: this.options,
      previousFocus,
      scrollLockCount: 0,
    };

    stack.push(this.entry);

    if (this.options.lockScroll) {
      lockScroll();
      this.entry.scrollLockCount = 1;
    }

    // Focus management
    if (this.options.trapFocus || this.options.restoreFocus) {
      // Move focus into the overlay
      requestAnimationFrame(() => {
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

    const index = stack.indexOf(this.entry);
    if (index >= 0) {
      stack.splice(index, 1);
    }

    if (this.entry.scrollLockCount > 0) {
      unlockScroll();
    }

    document.removeEventListener("keydown", this.onKeyDown);
    this.overlay.removeEventListener("pointerdown", this.onPointerDown);

    // Restore focus
    if (this.options.restoreFocus && this.entry.previousFocus instanceof HTMLElement) {
      const focusTarget = this.entry.previousFocus;
      requestAnimationFrame(() => {
        focusTarget.dispatchEvent(new Event("focus"));
        focusTarget.focus();
      });
    }

    this.entry = null;
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this.entry) return;

    // Only handle if this is the topmost overlay
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
