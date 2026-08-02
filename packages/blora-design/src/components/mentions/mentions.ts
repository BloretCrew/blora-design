/**
 * Blora Design 2.0 - Mentions controller
 * Shows suggestion dropdown when user types @ in a textarea/input.
 */
export interface MentionsController {
  destroy(): void;
}

const DEFAULT_USERS = ["alice", "bob", "carol", "dave"];

export function createMentionsController(root: HTMLElement): MentionsController {
  const field = root.querySelector<HTMLTextAreaElement | HTMLInputElement>("textarea, input");
  if (!field) return { destroy: () => {} };

  // Lit may put options on attribute; also accept JSON on data-options
  const raw =
    root.getAttribute("data-options") ||
    root.dataset.options ||
    field.getAttribute("data-options") ||
    "[]";
  let options: string[] = [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      options = parsed.map((o) =>
        typeof o === "string"
          ? o
          : String(
              (o as { label?: string; value?: string }).label ||
                (o as { value?: string }).value ||
                "",
            ),
      );
    }
  } catch {
    options = [];
  }
  if (options.length === 0) options = [...DEFAULT_USERS];

  let menu = root.querySelector<HTMLElement>(".blora-mentions__menu");
  if (!menu) {
    menu = document.createElement("ul");
    menu.className = "blora-mentions__menu";
    menu.setAttribute("role", "listbox");
    root.appendChild(menu);
  }
  const menuEl = menu;

  let activeIndex = 0;
  let mentionStart = -1;

  const setOpen = (open: boolean) => {
    if (open) {
      root.setAttribute("data-open", "");
      menuEl.setAttribute("data-open", "");
    } else {
      root.removeAttribute("data-open");
      menuEl.removeAttribute("data-open");
      menuEl.removeAttribute("data-placement");
      menuEl.style.left = "";
      menuEl.style.top = "";
      menuEl.style.maxHeight = "";
    }
  };

  const render = (query: string) => {
    const filtered = options
      .filter((o) => !query || o.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);

    if (filtered.length === 0) {
      setOpen(false);
      menuEl.replaceChildren();
      return;
    }

    menuEl.replaceChildren(
      ...filtered.map((opt, i) => {
        const li = document.createElement("li");
        li.className = "blora-mentions__option";
        if (i === activeIndex) li.setAttribute("data-active", "");
        li.setAttribute("role", "option");
        li.dataset.name = opt;
        li.textContent = `@${opt}`;
        return li;
      }),
    );
    setOpen(true);
    // After visible, measure & flip so Storybook / viewport never clips the menu
    requestAnimationFrame(() => positionNearAt());
  };

  /**
   * Place menu near the field (and caret when measurable).
   * Prefer below the textarea; flip above if not enough room. Clamp to viewport.
   */
  const positionNearAt = () => {
    const gap = 6;
    const pad = 8;
    const fieldRect = field.getBoundingClientRect();
    const cs = getComputedStyle(field);

    // Approximate caret X inside the field for horizontal nudge
    let caretOffsetX = 12;
    if (mentionStart >= 0) {
      try {
        const mirror = document.createElement("div");
        mirror.setAttribute("aria-hidden", "true");
        mirror.style.cssText =
          "position:absolute;visibility:hidden;white-space:pre-wrap;word-wrap:break-word;top:0;left:-9999px;";
        mirror.style.width = `${field.clientWidth}px`;
        mirror.style.font = cs.font;
        mirror.style.padding = cs.padding;
        mirror.style.border = cs.border;
        mirror.style.boxSizing = cs.boxSizing;
        mirror.textContent = field.value.slice(0, Math.max(0, mentionStart));
        const marker = document.createElement("span");
        marker.textContent = "@";
        mirror.appendChild(marker);
        document.body.appendChild(mirror);
        caretOffsetX = Math.min(
          Math.max(0, marker.offsetLeft - field.scrollLeft),
          field.clientWidth - 24,
        );
        document.body.removeChild(mirror);
      } catch {
        caretOffsetX = 12;
      }
    }

    menuEl.style.position = "fixed";
    menuEl.style.right = "auto";
    menuEl.style.bottom = "auto";
    menuEl.style.zIndex = "var(--blora-z-dropdown)";

    const menuW = Math.min(
      Math.max(menuEl.offsetWidth || 180, Math.min(fieldRect.width, 220)),
      window.innerWidth - pad * 2,
    );
    const menuH = Math.min(menuEl.offsetHeight || 160, window.innerHeight * 0.45);

    const spaceBelow = window.innerHeight - fieldRect.bottom - pad;
    const spaceAbove = fieldRect.top - pad;
    const placeBelow = spaceBelow >= Math.min(menuH, 120) || spaceBelow >= spaceAbove;

    let top = placeBelow
      ? fieldRect.bottom + gap
      : Math.max(pad, fieldRect.top - gap - menuH);
    if (placeBelow && top + menuH > window.innerHeight - pad) {
      top = Math.max(pad, window.innerHeight - pad - menuH);
    }
    menuEl.dataset.placement = placeBelow ? "below" : "above";

    let left = fieldRect.left + caretOffsetX;
    // Keep menu visually attached to the field band
    left = Math.min(left, fieldRect.right - 120);
    left = Math.max(fieldRect.left, left);
    if (left + menuW > window.innerWidth - pad) left = window.innerWidth - pad - menuW;
    if (left < pad) left = pad;

    menuEl.style.left = `${Math.round(left)}px`;
    menuEl.style.top = `${Math.round(top)}px`;
    menuEl.style.minWidth = `${Math.min(fieldRect.width, 220)}px`;
    menuEl.style.maxHeight = `${Math.round(Math.min(menuH, placeBelow ? spaceBelow : spaceAbove) || 160)}px`;
  };

  const insertMention = (name: string) => {
    const pos = field.selectionStart ?? field.value.length;
    const before = field.value.substring(0, mentionStart);
    const after = field.value.substring(pos);
    field.value = `${before}@${name} ${after}`;
    const next = before.length + name.length + 2;
    field.setSelectionRange(next, next);
    field.focus();
    setOpen(false);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const checkMention = () => {
    const pos = field.selectionStart ?? 0;
    const text = field.value.substring(0, pos);
    // Match @query at end (letters, CJK, . - _)
    const m = text.match(/@([\w\u4e00-\u9fa5.-]*)$/);
    if (!m) {
      mentionStart = -1;
      setOpen(false);
      return;
    }
    mentionStart = pos - m[0].length;
    activeIndex = 0;
    render(m[1] || "");
  };

  const onInput = () => checkMention();
  const onKeyUp = () => checkMention();

  const onKeyDown = (e: KeyboardEvent) => {
    if (!root.hasAttribute("data-open")) return;
    const opts = Array.from(menuEl.querySelectorAll<HTMLElement>(".blora-mentions__option"));
    if (!opts.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(opts.length - 1, activeIndex + 1);
      opts.forEach((o, i) => o.toggleAttribute("data-active", i === activeIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(0, activeIndex - 1);
      opts.forEach((o, i) => o.toggleAttribute("data-active", i === activeIndex));
    } else if (e.key === "Enter" || e.key === "Tab") {
      const opt = opts[activeIndex];
      if (opt) {
        e.preventDefault();
        insertMention(opt.dataset.name || opt.textContent?.replace(/^@/, "") || "");
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onMenuClick = (e: MouseEvent) => {
    const opt = (e.target as HTMLElement).closest<HTMLElement>(".blora-mentions__option");
    if (!opt) return;
    e.preventDefault();
    insertMention(opt.dataset.name || opt.textContent?.replace(/^@/, "") || "");
  };

  // mousedown preventDefault keeps focus in field
  const onMenuDown = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(".blora-mentions__option")) e.preventDefault();
  };

  const onDocClick = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) setOpen(false);
  };

  field.addEventListener("input", onInput);
  field.addEventListener("keyup", onKeyUp as EventListener);
  field.addEventListener("keydown", onKeyDown as EventListener);
  menuEl.addEventListener("click", onMenuClick);
  menuEl.addEventListener("mousedown", onMenuDown);
  document.addEventListener("click", onDocClick);

  return {
    destroy() {
      field.removeEventListener("input", onInput);
      field.removeEventListener("keyup", onKeyUp as EventListener);
      field.removeEventListener("keydown", onKeyDown as EventListener);
      menuEl.removeEventListener("click", onMenuClick);
      menuEl.removeEventListener("mousedown", onMenuDown);
      document.removeEventListener("click", onDocClick);
    },
  };
}
