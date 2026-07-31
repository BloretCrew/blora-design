/**
 * Blora Design 2.0 - Color Picker controller
 * Swatch selection + hex input sync.
 */
export interface ColorPickerController {
  destroy(): void;
}

export function createColorPickerController(root: HTMLElement): ColorPickerController {
  const swatches = root.querySelectorAll<HTMLElement>(".blora-color-swatch > span, .blora-color-picker__swatch");
  const preview = root.querySelector<HTMLElement>(".blora-color-preview");
  const hexInput = root.querySelector<HTMLInputElement>(".blora-color-hex");

  const setColor = (color: string) => {
    if (preview) preview.style.background = color;
    if (hexInput) hexInput.value = color;
  };

  const onSwatchClick = (e: MouseEvent) => {
    const swatch = e.target as HTMLElement;
    const color = swatch.dataset.color ?? swatch.style.background ?? "";
    if (color) setColor(color);
  };

  const onHexInput = () => {
    const val = hexInput?.value.trim() ?? "";
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      if (preview) preview.style.background = val;
    }
  };

  swatches.forEach((s) => s.addEventListener("click", onSwatchClick));
  hexInput?.addEventListener("input", onHexInput);

  return {
    destroy() {
      swatches.forEach((s) => s.removeEventListener("click", onSwatchClick));
      hexInput?.removeEventListener("input", onHexInput);
    },
  };
}

/**
 * Blora Design 2.0 - Text Rotate controller
 * Cycles [data-active] through items at an interval.
 */
export interface TextRotateController {
  destroy(): void;
}

export function createTextRotateController(root: HTMLElement): TextRotateController {
  const items = Array.from(root.querySelectorAll<HTMLElement>(".blora-text-rotate__item"));
  if (items.length === 0) return { destroy: () => {} };

  const interval = Number(root.dataset.interval ?? 2200);
  let current = 0;

  const show = (idx: number) => {
    items.forEach((item, i) => {
      if (i === idx) item.setAttribute("data-active", "");
      else item.removeAttribute("data-active");
    });
  };

  show(0);
  const timer = setInterval(() => {
    current = (current + 1) % items.length;
    show(current);
  }, interval);

  return {
    destroy() {
      clearInterval(timer);
    },
  };
}

/**
 * Blora Design 2.0 - Copy controller
 * Copies text and briefly swaps icon to checkmark.
 */
export interface CopyController {
  destroy(): void;
}

export function createCopyController(root: HTMLElement): CopyController {
  const btn = root.querySelector<HTMLElement>(".blora-copy__btn, [data-copy]");
  if (!btn) return { destroy: () => {} };

  const originalHTML = btn.innerHTML;
  let restoreTimer: ReturnType<typeof setTimeout> | null = null;

  const checkmarkSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;

  const onClick = async () => {
    const text = root.dataset.copyText ?? btn.dataset.copyText ?? root.textContent?.trim() ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        // noop
      }
      ta.remove();
    }

    btn.innerHTML = checkmarkSVG;
    if (restoreTimer) clearTimeout(restoreTimer);
    restoreTimer = setTimeout(() => {
      btn.innerHTML = originalHTML;
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

/**
 * Blora Design 2.0 - Transfer controller
 * Moves checked items between source and target panels.
 */
export interface TransferController {
  destroy(): void;
}

export function createTransferController(root: HTMLElement): TransferController {
  const panels = root.querySelectorAll<HTMLElement>(".blora-transfer__panel");
  const buttons = root.querySelectorAll<HTMLElement>(".blora-transfer__action, [data-transfer]");
  if (panels.length < 2 || buttons.length === 0) return { destroy: () => {} };

  const sourcePanel = panels[0];
  const targetPanel = panels[1];
  const sourceList = sourcePanel.querySelector<HTMLElement>(".blora-transfer__list");
  const targetList = targetPanel.querySelector<HTMLElement>(".blora-transfer__list");

  const updateHeads = () => {
    const sourceHead = sourcePanel.querySelector(".blora-transfer__head");
    const targetHead = targetPanel.querySelector(".blora-transfer__head");
    if (sourceHead) {
      const count = sourceList?.querySelectorAll(".blora-transfer__row").length ?? 0;
      sourceHead.textContent = `候选 · ${count}`;
    }
    if (targetHead) {
      const count = targetList?.querySelectorAll(".blora-transfer__row").length ?? 0;
      targetHead.textContent = `已选 · ${count}`;
    }
  };

  const move = (direction: string) => {
    if (direction === "right" || direction === "to-right") {
      const checked = Array.from(
        sourceList?.querySelectorAll<HTMLInputElement>(".blora-transfer__row input:checked") ?? [],
      );
      checked.forEach((input) => {
        const row = input.closest(".blora-transfer__row");
        if (row && targetList) {
          input.checked = false;
          targetList.appendChild(row);
        }
      });
    } else {
      const checked = Array.from(
        targetList?.querySelectorAll<HTMLInputElement>(".blora-transfer__row input:checked") ?? [],
      );
      checked.forEach((input) => {
        const row = input.closest(".blora-transfer__row");
        if (row && sourceList) {
          input.checked = false;
          sourceList.appendChild(row);
        }
      });
    }
    updateHeads();
  };

  const onClick = (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-transfer]");
    if (!btn) return;
    e.preventDefault();
    move(btn.dataset.transfer ?? "right");
  };

  root.addEventListener("click", onClick);

  return {
    destroy() {
      root.removeEventListener("click", onClick);
    },
  };
}

/**
 * Blora Design 2.0 - Field controller
 * Char-count with over-limit red highlighting.
 */
export interface FieldController {
  destroy(): void;
}

export function createFieldController(root: HTMLElement): FieldController {
  const inputs = root.querySelectorAll<HTMLInputElement>("[data-limit]");
  const cleanupFns: (() => void)[] = [];

  inputs.forEach((input) => {
    const limit = Number(input.dataset.limit ?? 0);
    if (!limit) return;

    const field = input.closest<HTMLElement>(".blora-field");
    if (!field) return;

    // Find or create a counter element
    let counter = field.querySelector<HTMLElement>(".blora-field__counter");
    if (!counter) {
      counter = document.createElement("span");
      counter.className = "blora-field__counter blora-hint";
      field.appendChild(counter);
    }

    const update = () => {
      const len = input.value.length;
      counter!.textContent = `${len} / ${limit}`;
      if (len > limit) counter!.setAttribute("data-over-limit", "");
      else counter!.removeAttribute("data-over-limit");
    };

    input.addEventListener("input", update);
    update();

    cleanupFns.push(() => input.removeEventListener("input", update));
  });

  return {
    destroy() {
      cleanupFns.forEach((fn) => fn());
    },
  };
}
