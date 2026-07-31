/**
 * Blora Design 2.0 - Search controller
 * Wires up the clear button visibility and click-to-clear behavior.
 */
export interface SearchController {
  destroy(): void;
}

export function createSearchController(root: HTMLElement): SearchController {
  const input = root.querySelector<HTMLInputElement>("input");
  const clear = root.querySelector<HTMLButtonElement>(".blora-search__clear");

  if (!input) return { destroy: () => {} };

  const updateClear = () => {
    if (clear) clear.hidden = input.value.length === 0;
  };

  const onInput = () => updateClear();
  const onClear = (e: Event) => {
    e.preventDefault();
    input.value = "";
    updateClear();
    input.focus();
  };

  input.addEventListener("input", onInput);
  clear?.addEventListener("click", onClear);
  updateClear();

  return {
    destroy() {
      input.removeEventListener("input", onInput);
      clear?.removeEventListener("click", onClear);
    },
  };
}
