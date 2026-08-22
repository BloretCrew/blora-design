/**
 * Blora Design 2.0 - Copy controller (clipboard only).
 * Text-rotate lives in @bloret-crew/blora-design-effects — not here.
 */
import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_COPY_TAG = "blora-copy";

export interface CopyController {
  destroy(): void;
}

export function createCopyController(root: HTMLElement): CopyController {
  const doc = root.ownerDocument;
  const view = doc.defaultView;
  const btn = root.querySelector<HTMLElement>(
    ".blora-copy__btn, .blora-typo-copy__btn, [data-copy]",
  );
  if (!btn) return { destroy: () => {} };

  let originalNodes: Node[] = [];
  let restoreTimer: ReturnType<typeof setTimeout> | null = null;

  const createCheckmark = (): SVGElement => createBloraIcon("check", 14, doc);

  const onClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text =
      root.getAttribute("data-blora-copy") ||
      root.dataset.copyText ||
      btn.dataset.copyText ||
      root.textContent?.trim() ||
      "";
    let copied = false;
    try {
      await view?.navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      const ta = doc.createElement("textarea");
      ta.value = text;
      doc.body.appendChild(ta);
      ta.select();
      try {
        copied = doc.execCommand("copy");
      } catch {
        copied = false;
      }
      ta.remove();
    }
    if (!copied) return;

    originalNodes = Array.from(btn.childNodes);
    btn.replaceChildren(createCheckmark());
    root.setAttribute("data-copied", "");
    if (restoreTimer) clearTimeout(restoreTimer);
    restoreTimer = setTimeout(() => {
      btn.replaceChildren(...originalNodes);
      root.removeAttribute("data-copied");
    }, 1500);
  };

  btn.addEventListener("click", onClick);

  return {
    destroy() {
      btn.removeEventListener("click", onClick);
      if (restoreTimer) clearTimeout(restoreTimer);
    },
  };
}

/** Copy-to-clipboard CE that owns code and action markup. */
export class BloraCopy extends BloraElement {
  private controller: CopyController | null = null;
  private initialText: string | null = null;

  static get observedAttributes(): string[] {
    return ["text", "label"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal) return;
    this.sync();
  }

  copy(): void {
    this.querySelector<HTMLButtonElement>(".blora-copy__btn")?.click();
  }

  protected render(): void {
    if (this.initialText === null) this.initialText = this.textContent?.trim() ?? "";
    const text = this.getAttribute("text") ?? this.initialText;
    const root = this.ownerDocument.createElement("span");
    root.className = "blora-copy blora-typo-copy";
    root.dataset.bloraGenerated = "";
    root.dataset.bloraCopy = text;
    const code = this.ownerDocument.createElement("code");
    code.className = "blora-code";
    code.textContent = text;
    const button = this.ownerDocument.createElement("button");
    button.type = "button";
    button.className = "blora-copy__btn blora-typo-copy__btn";
    button.setAttribute("aria-label", this.getAttribute("label") ?? t("common.copy"));
    button.appendChild(createBloraIcon("copy", 14, this.ownerDocument));
    root.append(code, button);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-copy");
    if (!root) return;
    const text = this.getAttribute("text") ?? this.initialText ?? "";
    root.dataset.bloraCopy = text;
    const code = root.querySelector("code");
    if (code) code.textContent = text;
    const button = root.querySelector<HTMLButtonElement>(".blora-copy__btn");
    if (button) button.setAttribute("aria-label", this.getAttribute("label") ?? t("common.copy"));
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-copy");
    this.controller?.destroy();
    this.controller = root ? createCopyController(root) : null;
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraCopy(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_COPY_TAG)) return;
  registry.define(BLORA_COPY_TAG, BloraCopy);
}
