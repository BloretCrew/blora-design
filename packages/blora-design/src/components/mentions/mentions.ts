/**
 * Mentions: suggestion list near the @ caret with viewport flip.
 */
export interface MentionsController {
  destroy(): void;
}

const DEFAULT_USERS = ["alice", "bob", "carol", "dave"];

export function createMentionsController(root: HTMLElement): MentionsController {
  const field = root.querySelector<HTMLTextAreaElement | HTMLInputElement>("textarea, input");
  if (!field) return { destroy: () => {} };

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
      menuEl.style.minWidth = "";
    }
  };

  /** Mirror field text to locate the @ caret in viewport coordinates. */
  const measureCaret = (): { x: number; y: number; lineH: number } => {
    const fieldRect = field.getBoundingClientRect();
    const cs = getComputedStyle(field);
    const lineH = Number.parseFloat(cs.lineHeight) || Number.parseFloat(cs.fontSize) * 1.4 || 20;
    const padL = Number.parseFloat(cs.paddingLeft) || 0;
    const padT = Number.parseFloat(cs.paddingTop) || 0;
    const borderL = Number.parseFloat(cs.borderLeftWidth) || 0;
    const borderT = Number.parseFloat(cs.borderTopWidth) || 0;

    if (mentionStart < 0) {
      return {
        x: fieldRect.left + padL + borderL,
        y: fieldRect.top + padT + borderT,
        lineH,
      };
    }

    const mirror = document.createElement("div");
    mirror.setAttribute("aria-hidden", "true");
    const style = mirror.style;
    style.position = "fixed";
    style.left = `${fieldRect.left}px`;
    style.top = `${fieldRect.top}px`;
    style.visibility = "hidden";
    style.pointerEvents = "none";
    style.whiteSpace = "pre-wrap";
    style.wordWrap = "break-word";
    style.overflowWrap = "break-word";
    style.overflow = "hidden";
    style.boxSizing = cs.boxSizing;
    style.width = `${field.clientWidth}px`;
    style.height = `${field.clientHeight}px`;
    style.font = cs.font;
    style.fontSize = cs.fontSize;
    style.fontFamily = cs.fontFamily;
    style.fontWeight = cs.fontWeight;
    style.letterSpacing = cs.letterSpacing;
    style.lineHeight = cs.lineHeight;
    style.padding = cs.padding;
    style.border = cs.border;
    style.borderColor = "transparent";

    // Text before caret (mentionStart points at @)
    const before = field.value.slice(0, Math.max(0, mentionStart));
    const textNode = document.createTextNode(before);
    const marker = document.createElement("span");
    marker.textContent = "\u200b"; // zero-width at caret / @ start
    mirror.appendChild(textNode);
    mirror.appendChild(marker);
    document.body.appendChild(mirror);

    // Align mirror scroll with field
    mirror.scrollTop = field.scrollTop;
    mirror.scrollLeft = field.scrollLeft;

    const mRect = marker.getBoundingClientRect();
    document.body.removeChild(mirror);

    return {
      x: mRect.left,
      y: mRect.top,
      lineH,
    };
  };

  /**
   * Place menu next to the typed @ (caret), with flip when near viewport edges.
   */
  const positionNearAt = () => {
    const gap = 4;
    const pad = 8;
    const { x: caretX, y: caretY, lineH } = measureCaret();

    menuEl.style.position = "fixed";
    menuEl.style.right = "auto";
    menuEl.style.bottom = "auto";
    menuEl.style.zIndex = "var(--blora-z-dropdown)";

    const menuW = Math.min(menuEl.offsetWidth || 180, window.innerWidth - pad * 2);
    const menuH = Math.min(menuEl.offsetHeight || 160, window.innerHeight * 0.4);

    const spaceBelow = window.innerHeight - (caretY + lineH) - pad;
    const spaceAbove = caretY - pad;
    const placeBelow = spaceBelow >= Math.min(menuH, 100) || spaceBelow >= spaceAbove;

    let top = placeBelow ? caretY + lineH + gap : caretY - gap - menuH;
    if (top < pad) top = pad;
    if (top + menuH > window.innerHeight - pad) {
      top = Math.max(pad, window.innerHeight - pad - menuH);
    }
    menuEl.dataset.placement = placeBelow ? "below" : "above";

    let left = caretX;
    if (left + menuW > window.innerWidth - pad) left = window.innerWidth - pad - menuW;
    if (left < pad) left = pad;

    menuEl.style.left = `${Math.round(left)}px`;
    menuEl.style.top = `${Math.round(top)}px`;
    menuEl.style.minWidth = "10rem";
    menuEl.style.maxHeight = `${Math.round(
      Math.max(80, Math.min(menuH, placeBelow ? spaceBelow : spaceAbove) || 160),
    )}px`;
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

    activeIndex = Math.min(activeIndex, filtered.length - 1);
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
    requestAnimationFrame(() => {
      positionNearAt();
      // Second frame: measure after layout
      requestAnimationFrame(() => positionNearAt());
    });
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
    const m = text.match(/@([\w\u4e00-\u9fa5.-]*)$/);
    if (!m) {
      mentionStart = -1;
      setOpen(false);
      return;
    }
    mentionStart = pos - m[0].length;
    const query = m[1] || "";
    activeIndex = 0;
    render(query);
  };

  const onInput = () => checkMention();
  const onKeydown = (e: KeyboardEvent) => {
    if (!root.hasAttribute("data-open")) return;
    const items = menuEl.querySelectorAll<HTMLElement>(".blora-mentions__option");
    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      items.forEach((li, i) => li.toggleAttribute("data-active", i === activeIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      items.forEach((li, i) => li.toggleAttribute("data-active", i === activeIndex));
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const name = items[activeIndex]?.dataset.name;
      if (name) insertMention(name);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };
  const onMenuClick = (e: MouseEvent) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>(".blora-mentions__option");
    if (li?.dataset.name) insertMention(li.dataset.name);
  };
  const onScroll = () => {
    if (root.hasAttribute("data-open")) positionNearAt();
  };

  field.addEventListener("input", onInput);
  field.addEventListener("keydown", onKeydown);
  field.addEventListener("click", checkMention);
  field.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") checkMention();
  });
  menuEl.addEventListener("click", onMenuClick);
  window.addEventListener("scroll", onScroll, true);
  window.addEventListener("resize", onScroll);

  return {
    destroy() {
      field.removeEventListener("input", onInput);
      field.removeEventListener("keydown", onKeydown);
      field.removeEventListener("click", checkMention);
      menuEl.removeEventListener("click", onMenuClick);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    },
  };
}
