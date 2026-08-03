/**
 * Mentions: suggestion list next to the typed @ (caret), with viewport flip / clamp.
 * Menu is portaled to document.body so Storybook transforms cannot trap fixed coords.
 *
 * Options may be plain strings or rich objects (avatar + name + secondary tag),
 * composed with `.blora-avatar` / muted meta — no extra packages required.
 */
export interface MentionsController {
  destroy(): void;
}

/** Rich option for @ menus (avatar + label + optional secondary tag). */
export interface MentionOption {
  /** Inserted after @ (required). */
  value: string;
  /** Primary display name; defaults to value. */
  label?: string;
  /** Initials or short text inside `.blora-avatar` when no image. */
  initials?: string;
  /** Image URL for avatar (preferred over initials). */
  avatar?: string;
  /** Avatar color variant: primary | neutral | info | success | contrast */
  avatarVariant?: "primary" | "neutral" | "info" | "success" | "contrast";
  /** Secondary line / trailing tag (role, org, note…). */
  tag?: string;
  /** Extra search tokens (not shown). */
  keywords?: string;
}

const DEFAULT_USERS: MentionOption[] = [
  { value: "alice", label: "alice" },
  { value: "bob", label: "bob" },
  { value: "carol", label: "carol" },
  { value: "dave", label: "dave" },
];
const OWNER_ATTR = "data-blora-mentions-owner";
let ownerSeq = 0;

function parseOptions(raw: string): MentionOption[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((o): MentionOption | null => {
        if (typeof o === "string") {
          return { value: o, label: o };
        }
        if (o && typeof o === "object") {
          const rec = o as Record<string, unknown>;
          const value = String(rec.value ?? rec.name ?? rec.id ?? rec.label ?? "").trim();
          if (!value) return null;
          const opt: MentionOption = {
            value,
            label: String(rec.label ?? rec.name ?? value),
          };
          if (rec.initials != null) opt.initials = String(rec.initials);
          if (rec.avatar != null) opt.avatar = String(rec.avatar);
          if (
            rec.avatarVariant === "primary" ||
            rec.avatarVariant === "neutral" ||
            rec.avatarVariant === "info" ||
            rec.avatarVariant === "success" ||
            rec.avatarVariant === "contrast"
          ) {
            opt.avatarVariant = rec.avatarVariant;
          }
          if (rec.tag != null) opt.tag = String(rec.tag);
          else if (rec.description != null) opt.tag = String(rec.description);
          if (rec.keywords != null) opt.keywords = String(rec.keywords);
          return opt;
        }
        return null;
      })
      .filter((o): o is MentionOption => !!o);
  } catch {
    return [];
  }
}

function optionSearchText(o: MentionOption): string {
  return [o.value, o.label, o.tag, o.keywords, o.initials].filter(Boolean).join(" ");
}

function defaultInitials(o: MentionOption): string {
  if (o.initials) return o.initials.slice(0, 2);
  const src = (o.label || o.value).trim();
  if (!src) return "?";
  /* ASCII: first 2 alnum chars; CJK: first 1–2 chars */
  if (/^[\w.-]+$/.test(src)) return src.slice(0, 2).toUpperCase();
  return src.slice(0, 2);
}

/** Remove orphan portaled menus (Storybook remounts / navigation leave them on body). */
function purgeOrphanMenus(doc: Document, keepOwner?: string): void {
  doc.querySelectorAll<HTMLElement>(`.blora-mentions__menu[${OWNER_ATTR}]`).forEach((el) => {
    const id = el.getAttribute(OWNER_ATTR);
    if (keepOwner && id === keepOwner) return;
    const ownerAlive = id && doc.querySelector(`[data-blora-mentions-id="${CSS.escape(id)}"]`);
    if (!ownerAlive) el.remove();
  });
}

export function createMentionsController(root: HTMLElement): MentionsController {
  const field = root.querySelector<HTMLTextAreaElement | HTMLInputElement>("textarea, input");
  if (!field) return { destroy: () => {} };

  const doc = root.ownerDocument;
  const raw =
    root.getAttribute("data-options") ||
    root.dataset.options ||
    field.getAttribute("data-options") ||
    "[]";
  let options = parseOptions(raw);
  if (options.length === 0) options = DEFAULT_USERS.map((o) => ({ ...o }));

  /* Stable owner id on root — reuse so remounts replace the same portal menu */
  let ownerId = root.getAttribute("data-blora-mentions-id");
  if (!ownerId) {
    ownerId = `mn-${++ownerSeq}-${Date.now().toString(36)}`;
    root.setAttribute("data-blora-mentions-id", ownerId);
  }
  root.setAttribute(OWNER_ATTR, ownerId);

  /* Destroy any previous controller attached to this root */
  const prev = (root as unknown as { __bloraMentionsDestroy?: () => void }).__bloraMentionsDestroy;
  if (typeof prev === "function") {
    try {
      prev();
    } catch {
      /* ignore */
    }
  }

  /* Remove existing portal menus for this owner + other orphans */
  doc
    .querySelectorAll<HTMLElement>(`.blora-mentions__menu[${OWNER_ATTR}="${ownerId}"]`)
    .forEach((el) => el.remove());
  purgeOrphanMenus(doc, ownerId);

  /* Prefer a menu still under root (pre-portal markup); otherwise create */
  let menu =
    root.querySelector<HTMLElement>(".blora-mentions__menu") ||
    doc.querySelector<HTMLElement>(`.blora-mentions__menu[${OWNER_ATTR}="${ownerId}"]`);
  if (!menu) {
    menu = doc.createElement("ul");
    menu.className = "blora-mentions__menu";
    menu.setAttribute("role", "listbox");
  }
  const menuEl = menu;
  menuEl.setAttribute(OWNER_ATTR, ownerId);
  menuEl.setAttribute("aria-hidden", "true");
  /* Never show at 0,0 before first position */
  menuEl.style.position = "fixed";
  menuEl.style.left = "-9999px";
  menuEl.style.top = "-9999px";
  menuEl.removeAttribute("data-open");
  if (menuEl.parentElement !== doc.body) {
    doc.body.appendChild(menuEl);
  }

  let activeIndex = 0;
  let mentionStart = -1;
  let destroyed = false;

  const setOpen = (open: boolean) => {
    if (destroyed) return;
    if (open) {
      root.setAttribute("data-open", "");
      /* data-open applied only after positionNearAt places the menu */
      menuEl.setAttribute("aria-hidden", "false");
    } else {
      root.removeAttribute("data-open");
      menuEl.removeAttribute("data-open");
      menuEl.setAttribute("aria-hidden", "true");
      menuEl.removeAttribute("data-placement");
      menuEl.style.left = "-9999px";
      menuEl.style.top = "-9999px";
      menuEl.style.maxHeight = "";
      menuEl.style.minWidth = "";
      menuEl.style.visibility = "";
    }
  };

  const measureCaret = (): { x: number; y: number; lineH: number } => {
    const fieldRect = field.getBoundingClientRect();
    const cs = getComputedStyle(field);
    const fontSize = Number.parseFloat(cs.fontSize) || 14;
    const lineH = (() => {
      const lh = cs.lineHeight;
      if (!lh || lh === "normal") return fontSize * 1.4;
      const n = Number.parseFloat(lh);
      return Number.isFinite(n) ? n : fontSize * 1.4;
    })();
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

    const mirror = doc.createElement("div");
    mirror.setAttribute("aria-hidden", "true");
    const style = mirror.style;
    style.position = "fixed";
    style.left = `${fieldRect.left}px`;
    style.top = `${fieldRect.top}px`;
    style.visibility = "hidden";
    style.pointerEvents = "none";
    style.zIndex = "-1";
    style.whiteSpace = "pre-wrap";
    style.wordWrap = "break-word";
    style.overflowWrap = "break-word";
    style.overflow = "hidden";
    style.boxSizing = "border-box";
    style.width = `${field.clientWidth}px`;
    style.height = `${field.clientHeight}px`;
    style.font = cs.font;
    style.fontSize = cs.fontSize;
    style.fontFamily = cs.fontFamily;
    style.fontWeight = cs.fontWeight;
    style.letterSpacing = cs.letterSpacing;
    style.lineHeight = cs.lineHeight;
    style.padding = cs.padding;
    style.borderStyle = cs.borderStyle;
    style.borderWidth = cs.borderWidth;
    style.borderColor = "transparent";
    style.textAlign = cs.textAlign;
    style.direction = cs.direction;

    const before = field.value.slice(0, Math.max(0, mentionStart));
    const textNode = doc.createTextNode(before);
    const marker = doc.createElement("span");
    marker.textContent = "\u200b";
    mirror.appendChild(textNode);
    mirror.appendChild(marker);
    doc.body.appendChild(mirror);
    mirror.scrollTop = field.scrollTop;
    mirror.scrollLeft = field.scrollLeft;

    const mRect = marker.getBoundingClientRect();
    doc.body.removeChild(mirror);

    let x = mRect.left;
    let y = mRect.top;
    if (!Number.isFinite(x) || x < fieldRect.left - 2 || x > fieldRect.right + 2) {
      x = fieldRect.left + padL + borderL;
    }
    if (!Number.isFinite(y) || y < fieldRect.top - 2 || y > fieldRect.bottom + 2) {
      y = fieldRect.top + padT + borderT;
    }

    return { x, y, lineH };
  };

  const positionNearAt = () => {
    if (destroyed || !doc.contains(root)) {
      setOpen(false);
      return;
    }
    const gap = 6;
    const pad = 8;
    const { x: caretX, y: caretY, lineH } = measureCaret();

    menuEl.style.position = "fixed";
    menuEl.style.right = "auto";
    menuEl.style.bottom = "auto";
    menuEl.style.margin = "0";
    menuEl.style.zIndex = "var(--blora-z-dropdown)";
    /* Measure while off-screen / invisible */
    menuEl.style.visibility = "hidden";
    menuEl.setAttribute("data-open", "");

    const menuW = Math.min(Math.max(menuEl.offsetWidth || 160, 160), window.innerWidth - pad * 2);
    const naturalH = menuEl.offsetHeight || 120;
    const menuH = Math.min(naturalH, window.innerHeight * 0.4, 240);

    const spaceBelow = window.innerHeight - (caretY + lineH) - pad;
    const spaceAbove = caretY - pad;
    const need = Math.min(menuH, 100);
    const placeBelow = spaceBelow >= need || spaceBelow >= spaceAbove;

    let top = placeBelow ? caretY + lineH + gap : caretY - gap - menuH;
    if (top < pad) top = pad;
    if (top + menuH > window.innerHeight - pad) {
      top = Math.max(pad, window.innerHeight - pad - menuH);
    }

    let left = caretX;
    if (left + menuW > window.innerWidth - pad) {
      left = window.innerWidth - pad - menuW;
    }
    if (left < pad) left = pad;

    menuEl.dataset.placement = placeBelow ? "below" : "above";
    menuEl.style.left = `${Math.round(left)}px`;
    menuEl.style.top = `${Math.round(top)}px`;
    const rich = menuEl.classList.contains("blora-mentions__menu--rich");
    /* Width follows content so short names aren't force-ellipsized */
    menuEl.style.minWidth = rich ? "16rem" : "10rem";
    menuEl.style.width = "max-content";
    menuEl.style.maxWidth = rich
      ? `${Math.min(24 * 16, window.innerWidth - pad * 2)}px`
      : `${Math.min(20 * 16, window.innerWidth - pad * 2)}px`;
    menuEl.style.maxHeight = `${Math.round(
      Math.max(80, placeBelow ? Math.min(menuH, spaceBelow) : Math.min(menuH, spaceAbove)),
    )}px`;
    menuEl.style.visibility = "visible";
  };

  const buildOptionEl = (opt: MentionOption, active: boolean): HTMLElement => {
    const li = doc.createElement("li");
    li.className = "blora-mentions__option";
    if (active) li.setAttribute("data-active", "");
    li.setAttribute("role", "option");
    li.dataset.name = opt.value;

    const avatar = doc.createElement("span");
    avatar.className = "blora-avatar";
    avatar.setAttribute("data-size", "sm");
    avatar.setAttribute("data-variant", opt.avatarVariant || "info");
    avatar.setAttribute("aria-hidden", "true");
    if (opt.avatar) {
      const img = doc.createElement("img");
      img.src = opt.avatar;
      img.alt = "";
      avatar.appendChild(img);
    } else {
      avatar.textContent = defaultInitials(opt);
    }

    const meta = doc.createElement("span");
    meta.className = "blora-mentions__meta";

    const name = doc.createElement("span");
    name.className = "blora-mentions__name";
    name.textContent = opt.label || opt.value;

    meta.appendChild(name);

    li.append(avatar, meta);

    if (opt.tag) {
      /* Use framework .blora-tag (bordered pill), right-aligned in the row */
      const tag = doc.createElement("span");
      tag.className = "blora-tag blora-mentions__tag";
      tag.setAttribute("data-variant", "neutral");
      tag.textContent = opt.tag;
      li.append(tag);
    }

    return li;
  };

  const render = (query: string) => {
    if (destroyed) return;
    const q = query.toLowerCase();
    const filtered = options
      .filter((o) => !q || optionSearchText(o).toLowerCase().includes(q))
      .slice(0, 8);

    if (filtered.length === 0) {
      setOpen(false);
      menuEl.replaceChildren();
      return;
    }

    activeIndex = Math.min(activeIndex, filtered.length - 1);
    const rich = filtered.some((o) => o.avatar || o.initials || o.tag || o.label !== o.value);
    menuEl.classList.toggle("blora-mentions__menu--rich", rich);
    menuEl.replaceChildren(...filtered.map((opt, i) => buildOptionEl(opt, i === activeIndex)));
    setOpen(true);
    requestAnimationFrame(() => {
      positionNearAt();
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
    if (destroyed || !doc.contains(root)) {
      setOpen(false);
      return;
    }
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
  const onKeydown = (ev: Event) => {
    const e = ev as KeyboardEvent;
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
  const onMenuClick = (ev: Event) => {
    const li = (ev.target as HTMLElement).closest<HTMLElement>(".blora-mentions__option");
    if (li?.dataset.name) insertMention(li.dataset.name);
  };
  const onScroll = () => {
    if (root.hasAttribute("data-open")) positionNearAt();
  };
  const onKeyup = (ev: Event) => {
    const e = ev as KeyboardEvent;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
      checkMention();
    }
  };

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    field.removeEventListener("input", onInput);
    field.removeEventListener("keydown", onKeydown);
    field.removeEventListener("click", checkMention);
    field.removeEventListener("keyup", onKeyup);
    menuEl.removeEventListener("click", onMenuClick);
    window.removeEventListener("scroll", onScroll, true);
    window.removeEventListener("resize", onScroll);
    root.removeAttribute("data-open");
    menuEl.remove();
    if (
      (root as unknown as { __bloraMentionsDestroy?: () => void }).__bloraMentionsDestroy ===
      destroy
    ) {
      delete (root as unknown as { __bloraMentionsDestroy?: () => void }).__bloraMentionsDestroy;
    }
    disconnectObserver.disconnect();
  };

  /* Auto-destroy when Storybook unmounts the story host */
  const disconnectObserver = new MutationObserver(() => {
    if (!doc.contains(root)) destroy();
  });
  disconnectObserver.observe(doc.body, { childList: true, subtree: true });

  field.addEventListener("input", onInput);
  field.addEventListener("keydown", onKeydown);
  field.addEventListener("click", checkMention);
  field.addEventListener("keyup", onKeyup);
  menuEl.addEventListener("click", onMenuClick);
  window.addEventListener("scroll", onScroll, true);
  window.addEventListener("resize", onScroll);

  (root as unknown as { __bloraMentionsDestroy?: () => void }).__bloraMentionsDestroy = destroy;

  return { destroy };
}
