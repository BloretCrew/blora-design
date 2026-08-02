/**
 * Checkbox group: data-blora-checkall master toggle (v1 initCheckbox).
 */
export interface CheckboxController {
  destroy(): void;
}

export function createCheckboxController(root: HTMLElement): CheckboxController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const master = root.querySelector<HTMLInputElement>(
    "[data-blora-checkall], .blora-checkbox__input[data-blora-checkall]",
  );
  if (!master) return { destroy: () => {} };

  const items = () =>
    Array.from(
      root.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]:not([data-blora-checkall])',
      ),
    );

  const syncMaster = () => {
    const list = items();
    const checked = list.filter((i) => i.checked).length;
    master.checked = list.length > 0 && checked === list.length;
    master.indeterminate = checked > 0 && checked < list.length;
  };

  const onMaster = () => {
    items().forEach((i) => {
      if (!i.disabled) i.checked = master.checked;
    });
    master.indeterminate = false;
  };

  master.addEventListener("change", onMaster);
  items().forEach((i) => i.addEventListener("change", syncMaster));
  syncMaster();

  return {
    destroy() {
      master.removeEventListener("change", onMaster);
    },
  };
}
