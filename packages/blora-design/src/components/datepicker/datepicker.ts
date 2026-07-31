/**
 * Blora Design 2.0 - Datepicker controller
 * Opens native date picker on button click.
 */
export interface DatepickerController {
  destroy(): void;
}

export function createDatepickerController(root: HTMLElement): DatepickerController {
  const input = root.querySelector<HTMLInputElement>("input");
  const btn = root.querySelector<HTMLButtonElement>(".blora-datepicker__btn");

  if (!input || !btn) return { destroy: () => {} };

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        input.focus();
      }
    } else {
      input.focus();
    }
  };

  btn.addEventListener("click", onClick);

  return {
    destroy() {
      btn.removeEventListener("click", onClick);
    },
  };
}

/**
 * Blora Design 2.0 - Timepicker controller
 * Opens native time picker on button click.
 */
export function createTimepickerController(root: HTMLElement): DatepickerController {
  const input = root.querySelector<HTMLInputElement>("input");
  const btn = root.querySelector<HTMLButtonElement>(
    ".blora-timepicker__btn, .blora-datepicker__btn",
  );

  if (!input || !btn) return { destroy: () => {} };

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        input.focus();
      }
    } else {
      input.focus();
    }
  };

  btn.addEventListener("click", onClick);

  return {
    destroy() {
      btn.removeEventListener("click", onClick);
    },
  };
}
