/**
 * Blora Design 2.0 - Layout add-on.
 * Sidebar layout, affix, anchor, scroll-spy, smooth-scroll.
 * Spec §9: not bundled into core.
 * @packageDocumentation
 */

import { createBloraIcon } from "@bloret-crew/blora-design";

export interface Destroyable {
  destroy(): void;
}

/* —— Sidebar Layout —— */
export interface SidebarLayoutController extends Destroyable {
  open(): void;
  close(): void;
}

/** Matches CSS drawer breakpoint (component width, not viewport). */
const SIDEBAR_DRAWER_MAX = 900;

function mountSidebarLayout(root: HTMLElement): SidebarLayoutController {
  if (typeof document === "undefined") {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }
  const doc = root.ownerDocument;
  const win = doc.defaultView!;
  const toggles = Array.from(
    root.querySelectorAll<HTMLElement>(
      "[data-blora-sidebar-toggle], .blora-sidebar-layout__toggle",
    ),
  );
  const aside = root.querySelector<HTMLElement>(".blora-sidebar-layout__aside");
  if (!aside || !toggles.length) {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }

  /* Ensure mask exists so close-on-backdrop always works */
  let mask = root.querySelector<HTMLElement>(".blora-sidebar-layout__mask");
  if (!mask) {
    mask = doc.createElement("div");
    mask.className = "blora-sidebar-layout__mask";
    mask.setAttribute("aria-hidden", "true");
    root.insertBefore(mask, aside);
  }

  if (!aside.id) aside.id = `blora-sidebar-${Math.random().toString(36).slice(2, 9)}`;
  toggles.forEach((toggle) => {
    toggle.setAttribute("aria-controls", aside.id);
    toggle.setAttribute("aria-expanded", "false");
  });

  let drawerMode = false;

  const isDrawerWidth = () => {
    const w = root.getBoundingClientRect().width || root.clientWidth || win.innerWidth;
    return w <= SIDEBAR_DRAWER_MAX;
  };

  const syncA11y = () => {
    const unavailable =
      drawerMode && !root.classList.contains("is-open") && !root.hasAttribute("data-open");
    aside.setAttribute("aria-hidden", String(unavailable));
    if (unavailable) aside.setAttribute("inert", "");
    else aside.removeAttribute("inert");
    mask!.setAttribute("aria-hidden", String(!root.classList.contains("is-open")));
  };

  const setOpen = (open: boolean, restore = false, focus = false) => {
    /* Ignore open in desktop two-column mode */
    if (open && !drawerMode) return;
    root.classList.toggle("is-open", open);
    if (open) root.setAttribute("data-open", "");
    else root.removeAttribute("data-open");
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", String(open));
      if (toggle.classList.contains("blora-fab")) {
        const icon = createBloraIcon(open ? "close" : "menu", 22, doc);
        const prev = toggle.querySelector("svg");
        if (prev) prev.replaceWith(icon);
        else toggle.replaceChildren(icon);
      }
    });
    syncA11y();
    if (open && focus) {
      aside
        .querySelector<HTMLElement>(
          "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])",
        )
        ?.focus();
    }
    if (!open && restore) toggles[0]?.focus();
  };

  const syncDrawerMode = () => {
    const next = isDrawerWidth();
    if (next === drawerMode) {
      syncA11y();
      return;
    }
    drawerMode = next;
    root.classList.toggle("blora-sidebar-layout--drawer", drawerMode);
    if (drawerMode) root.setAttribute("data-drawer", "");
    else root.removeAttribute("data-drawer");
    /* Leaving drawer mode always closes overlay */
    if (!drawerMode) setOpen(false, false);
    else syncA11y();
  };

  const onToggle = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (!drawerMode) return;
    setOpen(!root.classList.contains("is-open"), false, true);
  };
  const onMask = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false, true);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && root.classList.contains("is-open")) {
      e.preventDefault();
      setOpen(false, true);
    }
  };
  /* Mobile UX: choosing a nav item closes the drawer */
  const onAsideClick = (e: Event) => {
    if (!drawerMode || !root.classList.contains("is-open")) return;
    const t = e.target as Element | null;
    if (t?.closest?.("a[href], button:not([data-blora-sidebar-toggle])")) {
      setOpen(false, true);
    }
  };

  const EDGE = 1;
  const syncEdgeFade = () => {
    const max = Math.max(0, aside.scrollHeight - aside.clientHeight);
    const canScroll = max > EDGE;
    aside.toggleAttribute("data-overflow-start", canScroll && aside.scrollTop > EDGE);
    aside.toggleAttribute("data-overflow-end", canScroll && aside.scrollTop < max - EDGE);
  };

  const onLayoutChange = () => {
    syncDrawerMode();
    syncEdgeFade();
  };

  let ro: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(onLayoutChange);
    ro.observe(root);
    ro.observe(aside);
  } else {
    win.addEventListener("resize", onLayoutChange);
  }

  toggles.forEach((t) => t.addEventListener("click", onToggle));
  mask.addEventListener("click", onMask);
  aside.addEventListener("click", onAsideClick);
  aside.addEventListener("scroll", syncEdgeFade, { passive: true });
  doc.addEventListener("keydown", onKey);
  syncDrawerMode();
  syncEdgeFade();
  /* Hydration often connects while the host is `hidden`; resync after layout. */
  requestAnimationFrame(onLayoutChange);

  return {
    open: () => setOpen(true, false, true),
    close: () => setOpen(false, true),
    destroy() {
      toggles.forEach((t) => t.removeEventListener("click", onToggle));
      mask!.removeEventListener("click", onMask);
      aside.removeEventListener("click", onAsideClick);
      aside.removeEventListener("scroll", syncEdgeFade);
      doc.removeEventListener("keydown", onKey);
      ro?.disconnect();
      win.removeEventListener("resize", onLayoutChange);
      aside.removeAttribute("data-overflow-start");
      aside.removeAttribute("data-overflow-end");
      root.classList.remove("is-open", "blora-sidebar-layout--drawer");
      root.removeAttribute("data-open");
      root.removeAttribute("data-drawer");
    },
  };
}

export const BLORA_SIDEBAR_LAYOUT_TAG = "blora-sidebar-layout";

const LayoutBase: typeof HTMLElement =
  typeof HTMLElement !== "undefined" ? HTMLElement : (class {} as typeof HTMLElement);

interface SidebarLayoutDefinitions {
  contentId: string;
  contentNodes: Node[];
  sidebarId: string;
  sidebarLabel: string;
  sidebarNodes: Node[];
}

/** Responsive sidebar shell that owns its toggle, mask, aside and content tree. */
export class BloraSidebarLayout extends LayoutBase {
  private controller: SidebarLayoutController | null = null;
  private definitions: SidebarLayoutDefinitions | null = null;
  private observer: MutationObserver | null = null;
  private connectScheduled = false;

  static get observedAttributes(): string[] {
    return ["compact", "label", "sticky", "toggle-label", "variant"];
  }

  connectedCallback(): void {
    if (this.ownerDocument?.readyState === "loading") {
      if (this.connectScheduled) return;
      this.connectScheduled = true;
      setTimeout(() => {
        this.connectScheduled = false;
        if (this.isConnected) this.mount();
      }, 0);
      return;
    }
    this.mount();
  }

  disconnectedCallback(): void {
    this.controller?.destroy();
    this.controller = null;
    this.observer?.disconnect();
    this.observer = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected && this.definitions) this.mount();
  }

  open(): void {
    this.controller?.open();
  }

  close(): void {
    this.controller?.close();
  }

  private captureDefinitions(): SidebarLayoutDefinitions {
    const sidebar = Array.from(this.children).find(
      (child) => child.localName === "blora-sidebar-layout-sidebar",
    );
    const content = Array.from(this.children).find(
      (child) => child.localName === "blora-sidebar-layout-content",
    );
    return {
      contentId: content?.id ?? "",
      contentNodes: Array.from(content?.childNodes ?? []),
      sidebarId: sidebar?.id ?? "",
      sidebarLabel: sidebar?.getAttribute("label") ?? this.getAttribute("label") ?? "Sidebar",
      sidebarNodes: Array.from(sidebar?.childNodes ?? []),
    };
  }

  private mount(): void {
    this.controller?.destroy();
    this.observer?.disconnect();
    if (!this.definitions) this.definitions = this.captureDefinitions();
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-sidebar-layout";
    root.dataset.bloraGenerated = "";
    root.dataset.initializing = "";
    root.dataset.variant = this.getAttribute("variant") ?? "default";
    if (this.hasAttribute("compact")) root.classList.add("blora-sidebar-layout--compact");
    if (this.hasAttribute("sticky")) root.dataset.sticky = "";

    const toggleLabel = this.getAttribute("toggle-label") ?? "Menu";
    const toggle = this.ownerDocument.createElement("button");
    toggle.type = "button";
    toggle.dataset.bloraSidebarToggle = "";
    if ((this.getAttribute("variant") ?? "default") === "seamless") {
      toggle.className = "blora-fab blora-sidebar-layout__toggle";
      toggle.dataset.variant = "surface";
      toggle.setAttribute("aria-label", toggleLabel);
      toggle.appendChild(createBloraIcon("menu", 22, this.ownerDocument));
    } else {
      toggle.className = "blora-button blora-sidebar-layout__toggle";
      toggle.dataset.variant = "outline";
      toggle.dataset.size = "sm";
      toggle.textContent = toggleLabel;
    }

    const mask = this.ownerDocument.createElement("div");
    mask.className = "blora-sidebar-layout__mask";
    mask.setAttribute("aria-hidden", "true");

    const aside = this.ownerDocument.createElement("aside");
    aside.className = "blora-sidebar-layout__aside";
    aside.setAttribute("aria-label", this.definitions.sidebarLabel);
    if (this.definitions.sidebarId) aside.id = this.definitions.sidebarId;
    aside.append(...this.definitions.sidebarNodes);

    const content = this.ownerDocument.createElement("main");
    content.className = "blora-sidebar-layout__content";
    if (this.definitions.contentId) content.id = this.definitions.contentId;
    content.append(...this.definitions.contentNodes);
    root.append(toggle, mask, aside, content);
    this.replaceChildren(root);
    this.controller = mountSidebarLayout(root);
    requestAnimationFrame(() => root.removeAttribute("data-initializing"));

    const syncState = () => {
      for (const name of ["data-drawer", "data-open"] as const) {
        this.toggleAttribute(name, root.hasAttribute(name));
      }
    };
    syncState();
    this.observer = new MutationObserver(syncState);
    this.observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-drawer", "data-open"],
    });
  }
}

export function defineBloraSidebarLayout(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_SIDEBAR_LAYOUT_TAG)) return;
  registry.define(BLORA_SIDEBAR_LAYOUT_TAG, BloraSidebarLayout);
}

if (typeof customElements !== "undefined") defineBloraSidebarLayout(customElements);

/* —— Affix —— */
export type AffixController = Destroyable;

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
  let pinnedWidth = 0;
  let pinnedLeft = 0;

  const measureOrigin = () => {
    const rect = root.getBoundingClientRect();
    originTop = rect.top + win.scrollY;
    /* Capture in-flow geometry before pin so fixed bar never collapses */
    const parentW = root.parentElement?.getBoundingClientRect().width ?? 0;
    pinnedWidth = Math.max(
      rect.width,
      parentW,
      inner!.offsetWidth,
      inner!.scrollWidth,
      inner!.getBoundingClientRect().width,
      320,
    );
    pinnedLeft = rect.left;
  };
  measureOrigin();

  const clearPinStyles = () => {
    root.classList.remove("is-fixed");
    root.removeAttribute("data-fixed");
    root.style.height = "";
    root.style.width = "";
    root.style.removeProperty("--blora-affix-width");
    inner!.style.width = "";
    inner!.style.minWidth = "";
    inner!.style.maxWidth = "";
    inner!.style.left = "";
    inner!.style.top = "";
    inner!.style.right = "";
  };

  const applyPin = () => {
    measureOrigin();
    const h = Math.max(inner!.offsetHeight, inner!.getBoundingClientRect().height, 44);
    const maxW = Math.max(160, win.innerWidth - pinnedLeft - 12);
    const w = Math.min(Math.max(pinnedWidth, 320), maxW);
    root.style.height = `${h}px`;
    root.style.width = "100%";
    root.style.setProperty("--blora-affix-width", `${w}px`);
    inner!.style.boxSizing = "border-box";
    inner!.style.width = `${w}px`;
    inner!.style.minWidth = `${Math.min(w, 320)}px`;
    inner!.style.maxWidth = `calc(100vw - 1.5rem)`;
    inner!.style.whiteSpace = "nowrap";
    inner!.style.left = `${Math.max(8, pinnedLeft)}px`;
    inner!.style.top = `${offset}px`;
    inner!.style.right = "auto";
    root.classList.add("is-fixed");
    root.setAttribute("data-fixed", "");
    pinned = true;
  };

  const sync = () => {
    if (!pinned) measureOrigin();
    const should = win.scrollY + offset >= originTop;
    if (should && !pinned) {
      applyPin();
    } else if (!should && pinned) {
      clearPinStyles();
      pinned = false;
    } else if (should && pinned) {
      /* Keep left/width in sync on scroll containers */
      inner!.style.top = `${offset}px`;
    }
  };

  const onResize = () => {
    clearPinStyles();
    pinned = false;
    measureOrigin();
    sync();
  };

  win.addEventListener("scroll", sync, { passive: true });
  win.addEventListener("resize", onResize);
  /* Storybook / docs often scroll a nested scroller, not window */
  const scrollParents: EventTarget[] = [];
  let p: HTMLElement | null = root.parentElement;
  while (p) {
    const st = win.getComputedStyle(p);
    if (/(auto|scroll|overlay)/.test(st.overflowY + st.overflow)) {
      p.addEventListener("scroll", sync, { passive: true });
      scrollParents.push(p);
    }
    p = p.parentElement;
  }
  /* Initial layout after fonts/CSS */
  requestAnimationFrame(() => {
    measureOrigin();
    sync();
  });
  sync();

  return {
    destroy() {
      win.removeEventListener("scroll", sync);
      win.removeEventListener("resize", onResize);
      scrollParents.forEach((el) => el.removeEventListener("scroll", sync));
      clearPinStyles();
    },
  };
}

/* —— Anchor —— */
export type AnchorController = Destroyable;

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
export type ScrollSpyController = Destroyable;

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
    behavior ?? (win.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
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
    const a = (e.target as HTMLElement | null)?.closest?.(
      'a[href^="#"]',
    ) as HTMLAnchorElement | null;
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
