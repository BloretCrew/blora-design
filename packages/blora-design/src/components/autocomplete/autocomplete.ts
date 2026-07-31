/**
 * Blora Design 2.0 - Autocomplete controller
 * Filters options from data-options and shows a dropdown.
 */
export interface AutocompleteController {
  destroy(): void;
}

export function createAutocompleteController(root: HTMLElement): AutocompleteController {
  const input = root.querySelector<HTMLInputElement>("input");
  if (!input) return { destroy: () => {} };

  const raw = root.dataset.options ?? "[]";
  let options: string[] = [];
  try {
    options = JSON.parse(raw);
  } catch {
    options = [];
  }

  let menu = root.querySelector<HTMLElement>(".blora-autocomplete__menu");
  if (!menu) {
    menu = document.createElement("div");
    menu.className = "blora-autocomplete__menu";
    root.appendChild(menu);
  }
  const menuEl: HTMLElement = menu;

  let activeIndex = -1;

  const render = (filter: string) => {
    const filtered = filter
      ? options.filter((o) => o.toLowerCase().includes(filter.toLowerCase()))
      : options;

    if (filtered.length === 0 || !filter) {
      menuEl.removeAttribute("data-open");
      menuEl.innerHTML = "";
      return;
    }

    menuEl.setAttribute("data-open", "");
    menuEl.replaceChildren(
      ...filtered.map((opt, i) => {
        const div = document.createElement("div");
        div.className = "blora-autocomplete__option";
        div.dataset.idx = String(i);
        div.setAttribute("role", "option");
        div.textContent = opt;
        return div;
      }),
    );
    activeIndex = -1;
  };

  const select = (val: string) => {
    input.value = val;
    menuEl.removeAttribute("data-open");
    menuEl.innerHTML = "";
  };

  const onInput = () => render(input.value);

  const onKeyDown = (e: KeyboardEvent) => {
    if (!menuEl.hasAttribute("data-open")) return;
    const opts = Array.from(menuEl.querySelectorAll<HTMLElement>(".blora-autocomplete__option"));

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, opts.length - 1);
      opts.forEach((o, i) => o.toggleAttribute("data-active", i === activeIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      opts.forEach((o, i) => o.toggleAttribute("data-active", i === activeIndex));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = opts[activeIndex];
      if (opt) select(opt.textContent ?? "");
    } else if (e.key === "Escape") {
      menuEl.removeAttribute("data-open");
    }
  };

  const onClick = (e: MouseEvent) => {
    const opt = (e.target as HTMLElement).closest(".blora-autocomplete__option");
    if (opt) select(opt.textContent ?? "");
  };

  const onDocClick = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) {
      menuEl.removeAttribute("data-open");
    }
  };

  input.addEventListener("input", onInput);
  input.addEventListener("keydown", onKeyDown);
  menu.addEventListener("click", onClick);
  document.addEventListener("click", onDocClick);

  return {
    destroy() {
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKeyDown);
      menuEl.removeEventListener("click", onClick);
      document.removeEventListener("click", onDocClick);
    },
  };
}
