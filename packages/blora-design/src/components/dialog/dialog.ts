/**
 * Blora Design 2.0 - Dialog Web Component
 * Spec §12: Overlay system, §12.4: Dialog acceptance criteria
 */
import { BloraElement } from "../../core/blora-element.js";
import { OverlayController, type OverlayOptions } from "../../controllers/overlay-controller.js";

import dialogStyles from "./dialog.css?inline";

export const BLORA_DIALOG_TAG = "blora-dialog";

export interface BloraDialogOpenDetail {
  source: string;
  reason: string;
}

export interface BloraDialogCloseDetail {
  source: string;
  reason: string;
  returnValue?: unknown;
}

export class BloraDialog extends BloraElement {
  private overlay: OverlayController | null = null;
  private closeAnimationTimer: ReturnType<typeof setTimeout> | null = null;

  static get observedAttributes(): string[] {
    return ["open", "size", "close-on-escape", "close-on-outside-click"];
  }

  attributeChangedCallback(name: string, _old: string, value: string): void {
    if (name === "open" && this.isConnectedInternal) {
      if (value !== null) {
        this.show();
      } else {
        this.close();
      }
    }
  }

  protected render(): void {
    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = dialogStyles;
    shadow.appendChild(style);

    const backdrop = document.createElement("div");
    backdrop.className = "blora-dialog__backdrop";
    backdrop.setAttribute("part", "backdrop");

    const mask = document.createElement("div");
    mask.className = "blora-dialog__mask";

    const panel = document.createElement("div");
    panel.className = "blora-dialog__panel";
    panel.setAttribute("part", "panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");

    // Header slot
    const header = document.createElement("div");
    header.className = "blora-dialog__header";
    header.setAttribute("part", "header");

    const title = document.createElement("slot");
    title.name = "header";
    const titleSpan = document.createElement("h2");
    titleSpan.className = "blora-dialog__title";
    titleSpan.setAttribute("part", "title");
    const titleSlot = document.createElement("slot");
    titleSlot.name = "title";
    titleSpan.appendChild(titleSlot);
    header.appendChild(titleSpan);

    const closeButton = document.createElement("button");
    closeButton.className = "blora-dialog__close-button";
    closeButton.setAttribute("part", "close-button");
    closeButton.setAttribute("aria-label", "Close dialog");
    closeButton.type = "button";
    // SVG close icon matching v1 visual baseline
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M18 6L6 18M6 6l12 12");
    svg.appendChild(path);
    closeButton.appendChild(svg);
    header.appendChild(closeButton);

    // Body
    const body = document.createElement("div");
    body.className = "blora-dialog__body";
    body.setAttribute("part", "body");
    const defaultSlot = document.createElement("slot");
    body.appendChild(defaultSlot);

    // Footer
    const footer = document.createElement("div");
    footer.className = "blora-dialog__footer";
    footer.setAttribute("part", "footer");
    const footerSlot = document.createElement("slot");
    footerSlot.name = "footer";
    footer.appendChild(footerSlot);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);
    backdrop.appendChild(mask);
    backdrop.appendChild(panel);
    shadow.appendChild(backdrop);

    // Store references
    this._shadow = shadow;
    this._panel = panel;
    this._backdrop = backdrop;
    this._closeButton = closeButton;
  }

  private _shadow: ShadowRoot | null = null;
  private _panel: HTMLElement | null = null;
  private _backdrop: HTMLElement | null = null;
  private _closeButton: HTMLButtonElement | null = null;

  protected bindEvents(): void {
    if (!this._closeButton) return;

    this.listen(this._closeButton, "click", () => {
      this.close("close-button");
    });

    // Listen for outside click on backdrop (not panel)
    if (this._backdrop) {
      this.listen(this._backdrop, "pointerdown", (e: Event) => {
        if (
          e.target === this._backdrop ||
          (e.target as HTMLElement)?.classList?.contains("blora-dialog__mask")
        ) {
          this.close("outside-click");
        }
      });
    }

    this.listen(this, "blora-close-request", () => {
      this.close("outside-click");
    });
  }

  show(): void {
    if (this.hasAttribute("open")) return;

    const beforeOpen = this.emit<BloraDialogOpenDetail>(
      "blora-before-open",
      {
        source: "api",
        reason: "show",
      },
      { cancelable: true },
    );

    if (!beforeOpen) return;

    this.setAttribute("open", "");

    const options: Partial<OverlayOptions> = {
      modal: true,
      closeOnEscape: this.getAttribute("close-on-escape") !== "false",
      closeOnOutsidePointer: this.getAttribute("close-on-outside-click") !== "false",
      restoreFocus: true,
      trapFocus: true,
      lockScroll: true,
    };

    if (this._panel) {
      this.overlay = new OverlayController(this._panel, options);
      this.overlay.open();

      // Set aria-labelledby if title slot has content
      const titleSlot = this._shadow?.querySelector<HTMLSlotElement>('slot[name="title"]');
      if (titleSlot) {
        const assigned = titleSlot.assignedElements();
        if (assigned.length > 0 && assigned[0]!.id) {
          this._panel.setAttribute("aria-labelledby", assigned[0]!.id);
        }
      }
    }

    this.emit<BloraDialogOpenDetail>("blora-open", {
      source: "api",
      reason: "show",
    });
  }

  close(reason: string = "api"): void {
    if (!this.hasAttribute("open")) return;

    const beforeClose = this.emit<BloraDialogCloseDetail>(
      "blora-before-close",
      {
        source: "api",
        reason,
      },
      { cancelable: true },
    );

    if (!beforeClose) return;

    // Release overlay immediately (scroll lock, focus, listeners)
    this.overlay?.close();
    this.overlay = null;

    // Start closing animation
    this.setAttribute("data-closing", "");

    const animationDuration = 260;

    this.closeAnimationTimer = setTimeout(() => {
      this.removeAttribute("open");
      this.removeAttribute("data-closing");
      this.closeAnimationTimer = null;

      this.emit<BloraDialogCloseDetail>("blora-close", {
        source: "api",
        reason,
      });
    }, animationDuration);
  }

  protected onDisconnect(): void {
    if (this.closeAnimationTimer) {
      clearTimeout(this.closeAnimationTimer);
      this.closeAnimationTimer = null;
    }
    this.overlay?.destroy();
    this.overlay = null;
  }
}

export function defineBloraDialog(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_DIALOG_TAG)) return;
  registry.define(BLORA_DIALOG_TAG, BloraDialog);
}
