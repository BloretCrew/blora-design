/**
 * Blora Design 2.0 - Tags Input controller
 * Enter/comma adds tags; close button removes.
 */
import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";

export const BLORA_TAGS_INPUT_TAG = "blora-tags-input";
export interface TagsInputController {
  destroy(): void;
}

export function createTagsInputController(root: HTMLElement): TagsInputController {
  const doc = root.ownerDocument;
  const input = root.querySelector<HTMLInputElement>("input");
  if (!input) return { destroy: () => {} };

  const add = (text: string) => {
    const value = text.trim();
    if (!value) return;
    const tag = doc.createElement("span");
    tag.className = "blora-tag";
    tag.setAttribute("data-variant", "primary");
    tag.appendChild(doc.createTextNode(value));
    const close = doc.createElement("button");
    close.type = "button";
    close.className = "blora-tag__close";
    close.setAttribute("aria-label", t("tags.removeNamed", { label: value }));
    tag.appendChild(close);
    root.insertBefore(tag, input);
    input.value = "";
  };

  const onClick = (event: MouseEvent) => {
    const close = (event.target as Element).closest(".blora-tag__close");
    if (close && root.contains(close)) close.closest(".blora-tag")?.remove();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input.value);
    } else if (e.key === "Backspace" && !input.value) {
      const prev = input.previousElementSibling;
      if (prev?.classList.contains("blora-tag")) prev.remove();
    }
  };

  input.addEventListener("keydown", onKey);
  root.addEventListener("click", onClick);

  return {
    destroy() {
      input.removeEventListener("keydown", onKey);
      root.removeEventListener("click", onClick);
    },
  };
}

/** Tags input CE that owns tag and input markup. */
export class BloraTagsInput extends BloraElement {
  private controller: TagsInputController | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["values", "placeholder", "disabled", "label"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get values(): string[] {
    return Array.from(this.querySelectorAll<HTMLElement>(".blora-tag"), (tag) =>
      (tag.firstChild?.textContent ?? "").trim(),
    ).filter(Boolean);
  }

  set values(values: string[]) {
    this.setAttribute("values", values.join(","));
  }

  override focus(options?: FocusOptions): void {
    this.querySelector<HTMLInputElement>("input")?.focus(options);
  }

  protected render(): void {
    const values = (this.getAttribute("values") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-tags-input";
    root.dataset.bloraGenerated = "";
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", this.getAttribute("label") ?? t("tags.label"));
    for (const value of values) {
      const tag = this.ownerDocument.createElement("span");
      tag.className = "blora-tag";
      tag.dataset.variant = "primary";
      tag.appendChild(this.ownerDocument.createTextNode(value));
      const close = this.ownerDocument.createElement("button");
      close.type = "button";
      close.className = "blora-tag__close";
      close.setAttribute("aria-label", t("tags.removeNamed", { label: value }));
      close.disabled = this.hasAttribute("disabled");
      tag.appendChild(close);
      root.appendChild(tag);
    }
    const input = this.ownerDocument.createElement("input");
    input.type = "text";
    input.placeholder = this.getAttribute("placeholder") ?? "";
    input.disabled = this.hasAttribute("disabled");
    root.appendChild(input);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-tags-input");
    if (root) root.setAttribute("aria-label", this.getAttribute("label") ?? t("tags.label"));
    const field = this.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    if (field) {
      field.disabled = this.hasAttribute("disabled");
      if (this.hasAttribute("placeholder"))
        field.placeholder = this.getAttribute("placeholder") ?? "";
      if (this.hasAttribute("value") && this.ownerDocument.activeElement !== field) {
        field.value = this.getAttribute("value") ?? field.value;
      }
    }
    this.rebind();
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-tags-input");
    if (!root) return;
    this.controller = createTagsInputController(root);
    const sync = () => {
      const values = this.values;
      this.reflecting = true;
      this.setAttribute("values", values.join(","));
      this.reflecting = false;
      this.emit("blora-change", { values });
    };
    this.listen(root, "keydown", (event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (
        keyboardEvent.key === "Enter" ||
        keyboardEvent.key === "," ||
        keyboardEvent.key === "Backspace"
      ) {
        queueMicrotask(sync);
      }
    });
    this.listen(root, "click", (event) => {
      if ((event.target as HTMLElement).closest(".blora-tag__close")) queueMicrotask(sync);
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraTagsInput(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_TAGS_INPUT_TAG)) return;
  registry.define(BLORA_TAGS_INPUT_TAG, BloraTagsInput);
}
