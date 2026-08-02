/**
 * Blora Design 2.0 - Layout add-on.
 * Sidebar layout, affix, anchor, scroll-spy, smooth-scroll.
 * Spec §9: not bundled into core.
 * @packageDocumentation
 */

export interface Destroyable {
  destroy(): void;
}

/* —— Sidebar Layout —— */
export interface SidebarLayoutController extends Destroyable {
  open(): void;
  close(): void;
}

export function createSidebarLayoutController(root: HTMLElement): SidebarLayoutController {
  if (typeof document === "undefined") {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }
  const doc = root.ownerDocument;
  const win = doc.defaultView!;
  const toggles = Array.from(
    root.querySelectorAll<HTMLElement>("[data-blora-sidebar-toggle], .blora-sidebar-layout__toggle"),
  );
  const aside = root.querySelector<HTMLElement>(".blora-sidebar-layout__aside");
  const mask = root.querySelector<HTMLElement>(".blora-sidebar-layout__mask");
  if (!aside || !toggles.length) {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }

  const mobile =
    typeof win.matchMedia === "function"
      ? win.matchMedia("(max-width: 900px)")
      : ({
          matches: false,
          addEventListener: () => {},
          removeEventListener: () => {},
        } as unknown as MediaQueryList);
  if (!aside.id) aside.id = `blora-sidebar-${Math.random().toString(36).slice(2, 9)}`;
  toggles.forEach((toggle) => {
    toggle.setAttribute("aria-controls", aside.id);
    toggle.setAttribute("aria-expanded", "false");
  });

  const syncA11y = () => {
    const unavailable =
      mobile.matches && !root.classList.contains("is-open") && !root.hasAttribute("data-open");
    aside.setAttribute("aria-hidden", String(unavailable));
    if (unavailable) aside.setAttribute("inert", "");
    else aside.removeAttribute("inert");
  };

  const setOpen = (open: boolean, restore = false, focus = false) => {
    root.classList.toggle("is-open", open);
    if (open) root.setAttribute("data-open", "");
    else root.removeAttribute("data-open");
    toggles.forEach((toggle) => toggle.setAttribute("aria-expanded", String(open)));
    syncA11y();
    if (open && focus) {
      aside
        .querySelector<HTMLElement>("a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])")
        ?.focus();
    }
    if (!open && restore) toggles[0]?.focus();
  };

  const onToggle = () => setOpen(!root.classList.contains("is-open"), false, true);
  const onMask = () => setOpen(false, true);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && root.classList.contains("is-open")) setOpen(false, true);
  };
  const onMobile = () => {
    if (!mobile.matches) setOpen(false);
    else syncA11y();
  };

  toggles.forEach((t) => t.addEventListener("click", onToggle));
  mask?.addEventListener("click", onMask);
  doc.addEventListener("keydown", onKey);
  mobile.addEventListener("change", onMobile);
  syncA11y();

  return {
    open: () => setOpen(true, false, true),
    close: () => setOpen(false, true),
    destroy() {
      toggles.forEach((t) => t.removeEventListener("click", onToggle));
      mask?.removeEventListener("click", onMask);
      doc.removeEventListener("keydown", onKey);
      mobile.removeEventListener("change", onMobile);
    },
  };
}

/* —— Affix —— */
export interface AffixController extends Destroyable {}

export function createAffixController(root: HTMLElement): AffixController {
  if (typeof document === "undefined") return { destroy: () => {} };
  root.classList.add("blora-affix");
  const win = root.ownerDocument.defaultView!;
  let inner = root.querySelector<HTMLElement>(".blora-affix__inner");
  if (!inner) {
    inner = root.ownerDocument.createElement("div");
    inner.className = "blora-affix__inner";
    while (root.firstChild) inner.appendChild(root.firstChild);
    root.appendChild(inner);
  }
  const offset =
    Number(root.getAttribute("data-offset") || root.getAttribute("data-blora-affix") || 0) || 0;
  let pinned = false;
  let originTop = 0;

  const measure = () => {
    originTop = root.getBoundingClientRect().top + win.scrollY;
  };
  measure();

  const sync = () => {
    if (!pinned) measure();
    const should = win.scrollY + offset >= originTop;
    if (should && !pinned) {
      const rect = root.getBoundingClientRect();
      root.style.height = `${inner!.offsetHeight}px`;
      inner!.style.width = `${rect.width}px`;
      inner!.style.left = `${rect.left}px`;
      inner!.style.top = `${offset}px`;
      root.classList.add("is-fixed");
      root.setAttribute("data-fixed", "");
      pinned = true;
    } else if (!should && pinned) {
      root.classList.remove("is-fixed");
      root.removeAttribute("data-fixed");
      root.style.height = "";
      inner!.style.width = "";
      inner!.style.left = "";
      inner!.style.top = "";
      pinned = false;
    }
  };

  const onResize = () => {
    pinned = false;
    root.classList.remove("is-fixed");
    root.removeAttribute("data-fixed");
    root.style.height = "";
    inner!.style.width = "";
    inner!.style.left = "";
    inner!.style.top = "";
    measure();
    sync();
  };

  win.addEventListener("scroll", sync, { passive: true });
  win.addEventListener("resize", onResize);
  sync();

  return {
    destroy() {
      win.removeEventListener("scroll", sync);
      win.removeEventListener("resize", onResize);
    },
  };
}

/* —— Anchor —— */
export interface AnchorController extends Destroyable {}

export function createAnchorController(root: HTMLElement): AnchorController {
  if (typeof document === "undefined") return { destroy: () => {} };
  root.classList.add("blora-anchor");
  const win = root.ownerDocument.defaultView!;
  const links = Array.from(root.querySelectorAll<HTMLAnchorElement>("a[href^='#']"));
  const offset = Number(root.getAttribute("data-offset")) || 96;
  const sections = links
    .map((a) => {
      const id = (a.getAttribute("href") || "").slice(1);
      return { a, el: id ? root.ownerDocument.getElementById(id) : null };
    })
    .filter((x): x is { a: HTMLAnchorElement; el: HTMLElement } => !!x.el);

  const sync = () => {
    const y = win.scrollY + offset;
    let active = sections[0];
    sections.forEach((s) => {
      if (s.el.offsetTop <= y) active = s;
    });
    links.forEach((a) => a.classList.toggle("is-active", !!active && a === active.a));
  };

  links.forEach((a) => a.classList.add("blora-anchor__link"));
  win.addEventListener("scroll", sync, { passive: true });
  sync();
  return {
    destroy() {
      win.removeEventListener("scroll", sync);
    },
  };
}

/* —— Scroll Spy —— */
export interface ScrollSpyController extends Destroyable {}

export function createScrollSpyController(root: HTMLElement): ScrollSpyController {
  if (typeof document === "undefined") return { destroy: () => {} };
  const win = root.ownerDocument.defaultView!;
  const links = Array.from(root.querySelectorAll<HTMLAnchorElement>("a[href^='#']"));
  const sections = links
    .map((l) => {
      const id = (l.getAttribute("href") || "").slice(1);
      return id ? root.ownerDocument.getElementById(id) : null;
    })
    .filter((s): s is HTMLElement => !!s);
  const offset = Number(root.getAttribute("data-blora-spy")) || 120;
  let lastId = "";

  const setLocationHash = (id: string) => {
    try {
      const path = (win.location.pathname || "") + (win.location.search || "");
      win.history.replaceState(null, "", `${path}#${id}`);
    } catch {
      /* ignore */
    }
  };

  const sync = () => {
    const y = (win.pageYOffset || win.scrollY || 0) + offset;
    let active: HTMLElement | undefined = sections[0];
    sections.forEach((s) => {
      if (s.offsetTop <= y) active = s;
    });
    const id = active?.id || "";
    links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${id}`));
    if (id && id !== lastId) {
      lastId = id;
      const cur = String(win.location.hash || "").replace(/^#/, "");
      if (cur !== id) setLocationHash(id);
    }
  };

  win.addEventListener("scroll", sync, { passive: true });
  sync();
  return {
    destroy() {
      win.removeEventListener("scroll", sync);
    },
  };
}

/* —— Smooth Scroll —— */
let smoothInstalled = false;
let smoothCleanup: (() => void) | null = null;

function resolveHashTarget(doc: Document, hash: string): HTMLElement | null {
  const raw = String(hash || "").replace(/^#/, "");
  if (!raw) return null;
  let id = raw;
  try {
    id = decodeURIComponent(raw);
  } catch {
    /* keep */
  }
  return doc.getElementById(id);
}

function scrollElementIntoView(el: HTMLElement, behavior?: ScrollBehavior): boolean {
  const win = el.ownerDocument.defaultView;
  if (!win) return false;
  const motion =
    behavior ??
    (win.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
  try {
    const rect = el.getBoundingClientRect();
    const styles = win.getComputedStyle(el);
    const marginTop = parseFloat(styles.scrollMarginTop) || 0;
    const top = (win.pageYOffset || win.scrollY || 0) + rect.top - marginTop;
    win.scrollTo({ top: Math.max(0, top), behavior: motion });
    return true;
  } catch {
    try {
      el.scrollIntoView({ behavior: motion, block: "start" });
      return true;
    } catch {
      return false;
    }
  }
}

function setLocationHash(win: Window, id: string): void {
  try {
    const path = (win.location.pathname || "") + (win.location.search || "");
    win.history.replaceState(null, "", `${path}#${id}`);
  } catch {
    /* ignore */
  }
}

/** Install global smooth in-page anchor scrolling once. */
export function initSmoothScroll(doc: Document = document): () => void {
  if (typeof document === "undefined") return () => {};
  if (smoothInstalled && smoothCleanup) return smoothCleanup;
  const win = doc.defaultView;
  if (!win) return () => {};
  smoothInstalled = true;

  try {
    if ("scrollRestoration" in win.history) win.history.scrollRestoration = "manual";
  } catch {
    /* ignore */
  }

  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented) return;
    if (e.button != null && e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a || a.getAttribute("download") != null) return;
    const href = a.getAttribute("href") || "";
    if (href === "#" || href.length < 2) return;
    try {
      const url = new URL(a.href, win.location.href);
      if (url.pathname !== win.location.pathname || url.search !== win.location.search) return;
    } catch {
      /* keep */
    }
    const el = resolveHashTarget(doc, href);
    if (!el) return;
    e.preventDefault();
    const reduced = win.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motion: ScrollBehavior = reduced ? "auto" : "smooth";
    scrollElementIntoView(el, motion);
    const writeHash = () => setLocationHash(win, el.id);
    if (motion === "smooth" && "onscrollend" in win) {
      const once = () => {
        writeHash();
        win.removeEventListener("scrollend", once);
      };
      win.addEventListener("scrollend", once);
      setTimeout(writeHash, 700);
    } else {
      setTimeout(writeHash, motion === "smooth" ? 400 : 0);
    }
  };

  doc.addEventListener("click", onClick, true);
  smoothCleanup = () => {
    doc.removeEventListener("click", onClick, true);
    smoothInstalled = false;
    smoothCleanup = null;
  };
  return smoothCleanup;
}
