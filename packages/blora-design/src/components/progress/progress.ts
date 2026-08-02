/**
 * Progress: set value via data-value or API.
 */
export interface ProgressController {
  setValue(n: number): void;
  destroy(): void;
}

export function createProgressController(root: HTMLElement): ProgressController {
  const bar =
    root.querySelector<HTMLElement>(".blora-progress__bar, .blora-progress__fill") || root;
  const label = root.querySelector<HTMLElement>(".blora-progress__label, [data-progress-label]");

  const setValue = (n: number) => {
    const v = Math.max(0, Math.min(100, n));
    root.setAttribute("aria-valuenow", String(v));
    root.dataset.value = String(v);
    bar.style.width = `${v}%`;
    if (label) label.textContent = `${Math.round(v)}%`;
  };

  const initial = Number(root.dataset.value || root.getAttribute("aria-valuenow") || 0);
  if (!Number.isNaN(initial)) setValue(initial);

  return {
    setValue,
    destroy() {},
  };
}
