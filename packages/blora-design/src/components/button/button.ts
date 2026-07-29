/**
 * Blora Design 2.0 - Button helpers
 *
 * Spec §17.1: CSS does not depend on this helper.
 * The helper is optional convenience for loading state management.
 */

export interface ButtonLoadingOptions {
  /** Accessible label during loading (e.g. "保存中"). */
  label?: string;
  /** Whether to also set `disabled` during loading. Default: true. */
  disable?: boolean;
}

/**
 * Toggle a button's loading state.
 *
 * - Sets `aria-busy` and `data-loading` on the button.
 * - When `disable` is true (default), also sets `disabled` to prevent
 *   accidental submit during async operations.
 * - When `label` is provided, temporarily swaps the button's text content
 *   and restores the original on `false`.
 */
export function setButtonLoading(
  button: HTMLButtonElement,
  loading: boolean,
  options: ButtonLoadingOptions = {},
): void {
  const { label, disable = true } = options;

  if (loading) {
    button.setAttribute("aria-busy", "true");
    button.setAttribute("data-loading", "");

    if (disable) {
      button.disabled = true;
    }

    if (label !== undefined) {
      const original = button.dataset.loadingLabel;
      if (original === undefined) {
        button.dataset.loadingLabel = button.textContent ?? "";
      }
      button.textContent = label;
    }
  } else {
    button.removeAttribute("aria-busy");
    button.removeAttribute("data-loading");

    if (disable) {
      button.disabled = false;
    }

    if (label !== undefined || button.dataset.loadingLabel !== undefined) {
      const original = button.dataset.loadingLabel;
      if (original !== undefined) {
        button.textContent = original;
        delete button.dataset.loadingLabel;
      }
    }
  }
}
