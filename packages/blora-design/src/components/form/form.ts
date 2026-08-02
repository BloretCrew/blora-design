/**
 * Form validation (v1 initForms primary path): novalidate + field required/pattern/custom.
 */
export interface FormValidateResult {
  valid: boolean;
  errors: Array<{ name: string; message: string; field: HTMLElement }>;
  values: Record<string, string | boolean | string[]>;
}

export interface FormController {
  validate(): FormValidateResult;
  getValues(): Record<string, string | boolean | string[]>;
  clearErrors(): void;
  destroy(): void;
}

function fieldsOf(form: HTMLFormElement): HTMLElement[] {
  return Array.from(form.querySelectorAll<HTMLElement>(".blora-field, [data-blora-field]"));
}

function controlOf(
  field: HTMLElement,
): HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null {
  return field.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    "input:not([type=hidden]):not([type=submit]):not([type=button]), textarea, select",
  );
}

function errorSlot(field: HTMLElement): HTMLElement | null {
  return field.querySelector<HTMLElement>(".blora-field__error, [data-blora-error]");
}

function setFieldError(field: HTMLElement, message: string | null): void {
  if (message) {
    field.setAttribute("data-state", "invalid");
    field.classList.add("is-error");
    const slot = errorSlot(field);
    if (slot) {
      slot.hidden = false;
      slot.textContent = message;
    }
  } else {
    field.removeAttribute("data-state");
    field.classList.remove("is-error");
    const slot = errorSlot(field);
    if (slot) {
      slot.hidden = true;
      slot.textContent = "";
    }
  }
}

function messageFor(control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): string {
  if (control.validity.valueMissing) {
    return control.getAttribute("data-blora-required-message") || "此字段为必填项";
  }
  if (control.validity.typeMismatch || control.validity.patternMismatch) {
    return control.getAttribute("data-blora-pattern-message") || "格式不正确";
  }
  if (control.validity.tooShort) {
    return `至少 ${control.getAttribute("minlength")} 个字符`;
  }
  if (control.validity.tooLong) {
    return `最多 ${control.getAttribute("maxlength")} 个字符`;
  }
  return control.validationMessage || "无效输入";
}

export function getFormValues(form: HTMLFormElement): Record<string, string | boolean | string[]> {
  const values: Record<string, string | boolean | string[]> = {};
  const fd = new FormData(form);
  fd.forEach((v, k) => {
    const existing = values[k];
    const str = String(v);
    if (existing === undefined) values[k] = str;
    else if (Array.isArray(existing)) existing.push(str);
    else values[k] = [existing as string, str];
  });
  /* checkboxes without FormData name still via fields */
  form.querySelectorAll<HTMLInputElement>('input[type="checkbox"][name]').forEach((cb) => {
    if (!fd.has(cb.name)) values[cb.name] = cb.checked;
  });
  return values;
}

export function createFormController(form: HTMLFormElement): FormController {
  if (typeof document === "undefined") {
    return {
      validate: () => ({ valid: true, errors: [], values: {} }),
      getValues: () => ({}),
      clearErrors: () => {},
      destroy: () => {},
    };
  }

  form.classList.add("blora-form");
  if (!form.hasAttribute("data-blora-native-validate")) {
    form.setAttribute("novalidate", "");
  }

  const clearErrors = () => {
    fieldsOf(form).forEach((f) => setFieldError(f, null));
  };

  const validate = (): FormValidateResult => {
    const errors: FormValidateResult["errors"] = [];
    fieldsOf(form).forEach((field) => {
      const control = controlOf(field);
      if (!control || control.disabled) {
        setFieldError(field, null);
        return;
      }
      const custom = field.getAttribute("data-blora-validate");
      let ok = control.checkValidity();
      let msg = "";
      if (custom === "email" && control.value) {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value);
        if (!ok) msg = control.getAttribute("data-blora-pattern-message") || "请输入有效邮箱";
      }
      if (!ok) {
        msg = msg || messageFor(control);
        setFieldError(field, msg);
        errors.push({ name: control.name || "", message: msg, field });
      } else {
        setFieldError(field, null);
        field.setAttribute("data-state", "valid");
      }
    });
    const values = getFormValues(form);
    return { valid: errors.length === 0, errors, values };
  };

  const onInvalid = (e: Event) => {
    if (form.hasAttribute("data-blora-native-validate")) return;
    e.preventDefault();
  };

  const onSubmit = (e: Event) => {
    const result = validate();
    if (!result.valid) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    form.dispatchEvent(
      new CustomEvent("blora-form-submit", {
        bubbles: true,
        detail: { values: result.values, form },
      }),
    );
    if (!form.hasAttribute("data-blora-native-submit")) {
      e.preventDefault();
    }
  };

  const triggers = String(form.getAttribute("data-blora-validate-on") || "submit")
    .split(/[\s,]+/)
    .filter(Boolean);

  const onBlur = (e: Event) => {
    if (!triggers.includes("blur")) return;
    const field = (e.target as HTMLElement).closest<HTMLElement>(
      ".blora-field, [data-blora-field]",
    );
    if (!field || !form.contains(field)) return;
    const control = controlOf(field);
    if (!control) return;
    if (!control.checkValidity()) setFieldError(field, messageFor(control));
    else setFieldError(field, null);
  };

  form.addEventListener("invalid", onInvalid, true);
  form.addEventListener("submit", onSubmit);
  if (triggers.includes("blur")) form.addEventListener("focusout", onBlur);

  return {
    validate,
    getValues: () => getFormValues(form),
    clearErrors,
    destroy() {
      form.removeEventListener("invalid", onInvalid, true);
      form.removeEventListener("submit", onSubmit);
      form.removeEventListener("focusout", onBlur);
    },
  };
}
