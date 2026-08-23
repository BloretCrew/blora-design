/**
 * Blora Design 2.0 - OTP controller
 * Auto-advance, backspace, paste, mode filtering, uppercase.
 */
import { BloraElement } from "../../core/blora-element.js";
import { attachFormInternals, setHostFormValue } from "../../core/form-associated.js";
import { t } from "../../core/i18n.js";

export const BLORA_OTP_TAG = "blora-otp";
export interface OtpController {
  destroy(): void;
}

export function createOtpController(root: HTMLElement): OtpController {
  const inputs = Array.from(root.querySelectorAll<HTMLInputElement>(".blora-otp__input"));
  if (inputs.length === 0) return { destroy: () => {} };

  const mode = root.dataset.mode ?? "any";
  const uppercase = root.hasAttribute("data-uppercase");

  const filter = (ch: string): string => {
    if (uppercase) ch = ch.toUpperCase();
    if (mode === "numeric") return /[0-9]/.test(ch) ? ch : "";
    if (mode === "alphanumeric") return /[a-zA-Z0-9]/.test(ch) ? ch : "";
    return ch;
  };

  const onInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const filtered = filter(input.value);
    input.value = filtered.slice(-1);

    if (input.value) {
      const idx = inputs.indexOf(input);
      if (idx < inputs.length - 1) inputs[idx + 1]!.focus();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const input = e.target as HTMLInputElement;
    const idx = inputs.indexOf(input);

    if (e.key === "Backspace" && !input.value && idx > 0) {
      e.preventDefault();
      inputs[idx - 1]!.focus();
      inputs[idx - 1]!.value = "";
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      inputs[idx - 1]!.focus();
    } else if (e.key === "ArrowRight" && idx < inputs.length - 1) {
      e.preventDefault();
      inputs[idx + 1]!.focus();
    }
  };

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text") ?? "";
    const chars = text.split("").map(filter).filter(Boolean);
    const idx = inputs.indexOf(e.target as HTMLInputElement);

    chars.forEach((ch, i) => {
      if (idx + i < inputs.length) {
        inputs[idx + i]!.value = ch;
      }
    });

    const lastFilled = Math.min(idx + chars.length, inputs.length - 1);
    inputs[lastFilled]!.focus();
  };

  inputs.forEach((input) => {
    input.addEventListener("input", onInput);
    input.addEventListener("keydown", onKeyDown);
    input.addEventListener("paste", onPaste);
  });

  return {
    destroy() {
      inputs.forEach((input) => {
        input.removeEventListener("input", onInput);
        input.removeEventListener("keydown", onKeyDown);
        input.removeEventListener("paste", onPaste);
      });
    },
  };
}

/** One-time-password CE with generated native text inputs. */
export class BloraOtp extends BloraElement {
  static formAssociated = true;

  private controller: OtpController | null = null;
  private reflecting = false;
  private internals: ElementInternals | null = null;

  /** Submitted as the joined digits via ElementInternals; empty code submits nothing. */
  private syncFormValue(): void {
    const joined = this.value;
    setHostFormValue(this.internals, joined === "" ? null : joined);
  }

  static get observedAttributes(): string[] {
    return ["length", "mode", "uppercase", "value", "disabled", "label"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get value(): string {
    return Array.from(this.querySelectorAll<HTMLInputElement>(".blora-otp__input"))
      .map((input) => input.value)
      .join("");
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  override focus(options?: FocusOptions): void {
    this.querySelector<HTMLInputElement>(".blora-otp__input")?.focus(options);
  }

  protected render(): void {
    this.internals ??= attachFormInternals(this);
    const length = Math.max(1, Number(this.getAttribute("length") ?? 6));
    const value = Array.from(this.getAttribute("value") ?? "");
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-otp";
    root.dataset.bloraGenerated = "";
    root.dataset.mode = this.getAttribute("mode") ?? "numeric";
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", this.getAttribute("label") ?? t("otp.label"));
    if (this.hasAttribute("uppercase")) root.dataset.uppercase = "";
    for (let index = 0; index < length; index += 1) {
      const input = this.ownerDocument.createElement("input");
      input.className = "blora-otp__input";
      input.type = "text";
      input.maxLength = 1;
      input.inputMode = root.dataset.mode === "numeric" ? "numeric" : "text";
      input.autocomplete = index === 0 ? "one-time-code" : "off";
      input.disabled = this.hasAttribute("disabled");
      input.value = value[index] ?? "";
      input.setAttribute("aria-label", t("otp.char", { n: index + 1, total: length }));
      root.appendChild(input);
    }
    this.replaceChildren(root);
    this.syncFormValue();
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-otp");
    const inputs = [...this.querySelectorAll<HTMLInputElement>(".blora-otp__input")];
    const length = Math.max(1, Number(this.getAttribute("length") ?? 6));
    if (!root || inputs.length !== length) {
      this.render();
      this.rebind();
      return;
    }
    root.dataset.mode = this.getAttribute("mode") ?? "numeric";
    root.toggleAttribute("data-uppercase", this.hasAttribute("uppercase"));
    root.setAttribute("aria-label", this.getAttribute("label") ?? t("otp.label"));
    const chars = Array.from(this.getAttribute("value") ?? "");
    inputs.forEach((input, index) => {
      input.disabled = this.hasAttribute("disabled");
      if (this.ownerDocument.activeElement !== input) input.value = chars[index] ?? "";
    });
    this.syncFormValue();
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-otp");
    if (!root) return;
    this.controller = createOtpController(root);
    this.listen(root, "input", () => {
      this.reflecting = true;
      this.setAttribute("value", this.value);
      this.reflecting = false;
      this.emit("blora-change", {
        value: this.value,
        complete: this.value.length === root.children.length,
      });
      this.syncFormValue();
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraOtp(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_OTP_TAG)) return;
  registry.define(BLORA_OTP_TAG, BloraOtp);
}
