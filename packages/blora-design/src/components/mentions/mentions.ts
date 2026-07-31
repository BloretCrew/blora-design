/**
 * Blora Design 2.0 - Mentions controller
 * Shows suggestion dropdown when user types @ in a textarea.
 */
export interface MentionsController {
  destroy(): void;
}

export function createMentionsController(root: HTMLElement): MentionsController {
  const textarea = root.querySelector<HTMLTextAreaElement>("textarea");
  if (!textarea) return { destroy: () => {} };

  const raw = root.dataset.options ?? "[]";
  let options: string[] = [];
  try {
    options = JSON.parse(raw);
  } catch {
    options = [];
  }

  let menu = root.querySelector<HTMLElement>(".blora-mentions__menu");
  if (!menu) {
    menu = document.createElement("div");
    menu.className = "blora-mentions__menu";
    root.appendChild(menu);
  }

  let activeIndex = -1;
  let mentionStart = -1;

  const render = (query: string, rect: DOMRect) => {
    const filtered = query
      ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
      : options;

    if (filtered.length === 0) {
      menu!.removeAttribute("data-open");
      menu!.innerHTML = "";
      return;
    }

    menu!.setAttribute("data-open", "");
    menu!.style.position = "fixed";
    menu!.style.left = `${rect.left}px`;
    menu!.style.top = `${rect.bottom + 4}px`;
    menu!.innerHTML = filtered
      .map(
        (opt, i) =>
          `<div class="blora-mentions__option" data-idx="${i}" role="option">@${opt}</div>`,
      )
      .join("");
    activeIndex = -1;
  };

  const insertMention = (name: string) => {
    const before = textarea.value.substring(0, mentionStart);
    const after = textarea.value.substring(textarea.selectionStart);
    textarea.value = `${before}@${name} ${after}`;
    const pos = before.length + name.length + 2;
    textarea.setSelectionRange(pos, pos);
    textarea.focus();
    menu!.removeAttribute("data-open");
  };

  const checkMention = () => {
    const pos = textarea.selectionStart;
    const text = textarea.value.substring(0, pos);
    const atIdx = text.lastIndexOf("@");
    if (atIdx === -1) {
      menu!.removeAttribute("data-open");
      return;
    }

    // Check @ is at start or preceded by whitespace
    if (atIdx > 0 && !/\s/.test(text[atIdx - 1])) {
      menu!.removeAttribute("data-open");
      return;
    }

    mentionStart = atIdx;
    const query = text.substring(atIdx + 1);

    // Don't trigger if there's a space in the query
    if (query.includes(" ")) {
      menu!.removeAttribute("data-open");
      return;
    }

    const rect = textarea.getBoundingClientRect();
    render(query, rect);
  };

  const onInput = () => checkMention();

  const onKeyDown = (e: KeyboardEvent) => {
    if (!menu!.hasAttribute("data-open")) return;
    const opts = Array.from(menu!.querySelectorAll<HTMLElement>(".blora-mentions__option"));

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
      if (activeIndex >= 0 && opts[activeIndex]) {
        const name = opts[activeIndex].textContent?.replace("@", "") ?? "";
        insertMention(name);
      }
    } else if (e.key === "Escape") {
      menu!.removeAttribute("data-open");
    }
  };

  const onClick = (e: MouseEvent) => {
    const opt = (e.target as HTMLElement).closest(".blora-mentions__option");
    if (opt) {
      const name = opt.textContent?.replace("@", "") ?? "";
      insertMention(name);
    }
  };

  const onDocClick = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) menu!.removeAttribute("data-open");
  };

  textarea.addEventListener("input", onInput);
  textarea.addEventListener("keydown", onKeyDown);
  menu.addEventListener("click", onClick);
  document.addEventListener("click", onDocClick);

  return {
    destroy() {
      textarea.removeEventListener("input", onInput);
      textarea.removeEventListener("keydown", onKeyDown);
      menu!.removeEventListener("click", onClick);
      document.removeEventListener("click", onDocClick);
    },
  };
}
