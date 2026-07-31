/**
 * Blora Design 2.0 - OTP controller
 * Auto-advance, backspace, paste, mode filtering, uppercase.
 */
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
      if (idx < inputs.length - 1) inputs[idx + 1].focus();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const input = e.target as HTMLInputElement;
    const idx = inputs.indexOf(input);

    if (e.key === "Backspace" && !input.value && idx > 0) {
      e.preventDefault();
      inputs[idx - 1].focus();
      inputs[idx - 1].value = "";
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      inputs[idx - 1].focus();
    } else if (e.key === "ArrowRight" && idx < inputs.length - 1) {
      e.preventDefault();
      inputs[idx + 1].focus();
    }
  };

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text") ?? "";
    const chars = text.split("").map(filter).filter(Boolean);
    const idx = inputs.indexOf(e.target as HTMLInputElement);

    chars.forEach((ch, i) => {
      if (idx + i < inputs.length) {
        inputs[idx + i].value = ch;
      }
    });

    const lastFilled = Math.min(idx + chars.length, inputs.length - 1);
    inputs[lastFilled].focus();
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
