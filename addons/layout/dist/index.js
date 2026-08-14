var k = Object.defineProperty;
var _ = (t, n, e) => n in t ? k(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[n] = e;
var g = (t, n, e) => _(t, typeof n != "symbol" ? n + "" : n, e);
function C(t) {
  if (typeof document > "u")
    return { open: () => {
    }, close: () => {
    }, destroy: () => {
    } };
  const n = t.ownerDocument, e = n.defaultView, s = Array.from(
    t.querySelectorAll(
      "[data-blora-sidebar-toggle], .blora-sidebar-layout__toggle"
    )
  ), i = t.querySelector(".blora-sidebar-layout__aside");
  if (!i || !s.length)
    return { open: () => {
    }, close: () => {
    }, destroy: () => {
    } };
  let o = t.querySelector(".blora-sidebar-layout__mask");
  o || (o = n.createElement("div"), o.className = "blora-sidebar-layout__mask", o.setAttribute("aria-hidden", "true"), t.insertBefore(o, i)), i.id || (i.id = `blora-sidebar-${Math.random().toString(36).slice(2, 9)}`), s.forEach((r) => {
    r.setAttribute("aria-controls", i.id), r.setAttribute("aria-expanded", "false");
  });
  let a = !1;
  const d = () => (t.getBoundingClientRect().width || t.clientWidth || e.innerWidth) <= 900, l = () => {
    const r = a && !t.classList.contains("is-open") && !t.hasAttribute("data-open");
    i.setAttribute("aria-hidden", String(r)), r ? i.setAttribute("inert", "") : i.removeAttribute("inert"), o.setAttribute("aria-hidden", String(!t.classList.contains("is-open")));
  }, c = (r, m = !1, A = !1) => {
    var E, L;
    r && !a || (t.classList.toggle("is-open", r), r ? t.setAttribute("data-open", "") : t.removeAttribute("data-open"), s.forEach((S) => S.setAttribute("aria-expanded", String(r))), l(), r && A && ((E = i.querySelector(
      "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
    )) == null || E.focus()), !r && m && ((L = s[0]) == null || L.focus()));
  }, u = () => {
    const r = d();
    if (r === a) {
      l();
      return;
    }
    a = r, t.classList.toggle("blora-sidebar-layout--drawer", a), a ? t.setAttribute("data-drawer", "") : t.removeAttribute("data-drawer"), a ? l() : c(!1, !1);
  }, f = (r) => {
    r.preventDefault(), r.stopPropagation(), a && c(!t.classList.contains("is-open"), !1, !0);
  }, b = (r) => {
    r.preventDefault(), r.stopPropagation(), c(!1, !0);
  }, p = (r) => {
    r.key === "Escape" && t.classList.contains("is-open") && (r.preventDefault(), c(!1, !0));
  }, y = (r) => {
    var A;
    if (!a || !t.classList.contains("is-open")) return;
    const m = r.target;
    (A = m == null ? void 0 : m.closest) != null && A.call(m, "a[href], button:not([data-blora-sidebar-toggle])") && c(!1, !0);
  };
  let h = null;
  return typeof ResizeObserver < "u" ? (h = new ResizeObserver(() => u()), h.observe(t)) : e.addEventListener("resize", u), s.forEach((r) => r.addEventListener("click", f)), o.addEventListener("click", b), i.addEventListener("click", y), n.addEventListener("keydown", p), u(), requestAnimationFrame(() => u()), {
    open: () => c(!0, !1, !0),
    close: () => c(!1, !0),
    destroy() {
      s.forEach((r) => r.removeEventListener("click", f)), o.removeEventListener("click", b), i.removeEventListener("click", y), n.removeEventListener("keydown", p), h == null || h.disconnect(), e.removeEventListener("resize", u), t.classList.remove("is-open", "blora-sidebar-layout--drawer"), t.removeAttribute("data-open"), t.removeAttribute("data-drawer");
    }
  };
}
const x = "blora-sidebar-layout", D = typeof HTMLElement < "u" ? HTMLElement : class {
};
class M extends D {
  constructor() {
    super(...arguments);
    g(this, "controller", null);
    g(this, "definitions", null);
    g(this, "observer", null);
    g(this, "connectScheduled", !1);
  }
  static get observedAttributes() {
    return ["compact", "label", "sticky", "toggle-label", "variant"];
  }
  connectedCallback() {
    var e;
    if (((e = this.ownerDocument) == null ? void 0 : e.readyState) === "loading") {
      if (this.connectScheduled) return;
      this.connectScheduled = !0, setTimeout(() => {
        this.connectScheduled = !1, this.isConnected && this.mount();
      }, 0);
      return;
    }
    this.mount();
  }
  disconnectedCallback() {
    var e, s;
    (e = this.controller) == null || e.destroy(), this.controller = null, (s = this.observer) == null || s.disconnect(), this.observer = null;
  }
  attributeChangedCallback() {
    this.isConnected && this.definitions && this.mount();
  }
  open() {
    var e;
    (e = this.controller) == null || e.open();
  }
  close() {
    var e;
    (e = this.controller) == null || e.close();
  }
  captureDefinitions() {
    const e = Array.from(this.children).find(
      (i) => i.localName === "blora-sidebar-layout-sidebar"
    ), s = Array.from(this.children).find(
      (i) => i.localName === "blora-sidebar-layout-content"
    );
    return {
      contentId: (s == null ? void 0 : s.id) ?? "",
      contentNodes: Array.from((s == null ? void 0 : s.childNodes) ?? []),
      sidebarId: (e == null ? void 0 : e.id) ?? "",
      sidebarLabel: (e == null ? void 0 : e.getAttribute("label")) ?? this.getAttribute("label") ?? "Sidebar",
      sidebarNodes: Array.from((e == null ? void 0 : e.childNodes) ?? [])
    };
  }
  mount() {
    var l, c;
    (l = this.controller) == null || l.destroy(), (c = this.observer) == null || c.disconnect(), this.definitions || (this.definitions = this.captureDefinitions());
    const e = this.ownerDocument.createElement("div");
    e.className = "blora-sidebar-layout", e.dataset.bloraGenerated = "", e.dataset.initializing = "", e.dataset.variant = this.getAttribute("variant") ?? "default", this.hasAttribute("compact") && e.classList.add("blora-sidebar-layout--compact"), this.hasAttribute("sticky") && (e.dataset.sticky = "");
    const s = this.ownerDocument.createElement("button");
    s.type = "button", s.className = "blora-button blora-sidebar-layout__toggle", s.dataset.variant = "outline", s.dataset.size = "sm", s.dataset.bloraSidebarToggle = "", s.textContent = this.getAttribute("toggle-label") ?? "Menu";
    const i = this.ownerDocument.createElement("div");
    i.className = "blora-sidebar-layout__mask", i.setAttribute("aria-hidden", "true");
    const o = this.ownerDocument.createElement("aside");
    o.className = "blora-sidebar-layout__aside", o.setAttribute("aria-label", this.definitions.sidebarLabel), this.definitions.sidebarId && (o.id = this.definitions.sidebarId), o.append(...this.definitions.sidebarNodes);
    const a = this.ownerDocument.createElement("main");
    a.className = "blora-sidebar-layout__content", this.definitions.contentId && (a.id = this.definitions.contentId), a.append(...this.definitions.contentNodes), e.append(s, i, o, a), this.replaceChildren(e), this.controller = C(e), requestAnimationFrame(() => e.removeAttribute("data-initializing"));
    const d = () => {
      for (const u of ["data-drawer", "data-open"])
        this.toggleAttribute(u, e.hasAttribute(u));
    };
    d(), this.observer = new MutationObserver(d), this.observer.observe(e, {
      attributes: !0,
      attributeFilter: ["data-drawer", "data-open"]
    });
  }
}
function R(t = customElements) {
  !t || t.get(x) || t.define(x, M);
}
typeof customElements < "u" && R(customElements);
function W(t) {
  if (typeof document > "u") return { destroy: () => {
  } };
  t.classList.add("blora-affix");
  const n = t.ownerDocument.defaultView;
  let e = t.querySelector(".blora-affix__inner");
  if (!e) {
    for (e = t.ownerDocument.createElement("div"), e.className = "blora-affix__inner"; t.firstChild; ) e.appendChild(t.firstChild);
    t.appendChild(e);
  }
  const s = Number(t.getAttribute("data-offset") || t.getAttribute("data-blora-affix") || 0) || 0;
  let i = !1, o = 0, a = 0, d = 0;
  const l = () => {
    var m;
    const h = t.getBoundingClientRect();
    o = h.top + n.scrollY;
    const r = ((m = t.parentElement) == null ? void 0 : m.getBoundingClientRect().width) ?? 0;
    a = Math.max(
      h.width,
      r,
      e.offsetWidth,
      e.scrollWidth,
      e.getBoundingClientRect().width,
      320
    ), d = h.left;
  };
  l();
  const c = () => {
    t.classList.remove("is-fixed"), t.removeAttribute("data-fixed"), t.style.height = "", t.style.width = "", t.style.removeProperty("--blora-affix-width"), e.style.width = "", e.style.minWidth = "", e.style.maxWidth = "", e.style.left = "", e.style.top = "", e.style.right = "";
  }, u = () => {
    l();
    const h = Math.max(e.offsetHeight, e.getBoundingClientRect().height, 44), r = Math.max(160, n.innerWidth - d - 12), m = Math.min(Math.max(a, 320), r);
    t.style.height = `${h}px`, t.style.width = "100%", t.style.setProperty("--blora-affix-width", `${m}px`), e.style.boxSizing = "border-box", e.style.width = `${m}px`, e.style.minWidth = `${Math.min(m, 320)}px`, e.style.maxWidth = "calc(100vw - 1.5rem)", e.style.whiteSpace = "nowrap", e.style.left = `${Math.max(8, d)}px`, e.style.top = `${s}px`, e.style.right = "auto", t.classList.add("is-fixed"), t.setAttribute("data-fixed", ""), i = !0;
  }, f = () => {
    i || l();
    const h = n.scrollY + s >= o;
    h && !i ? u() : !h && i ? (c(), i = !1) : h && i && (e.style.top = `${s}px`);
  }, b = () => {
    c(), i = !1, l(), f();
  };
  n.addEventListener("scroll", f, { passive: !0 }), n.addEventListener("resize", b);
  const p = [];
  let y = t.parentElement;
  for (; y; ) {
    const h = n.getComputedStyle(y);
    /(auto|scroll|overlay)/.test(h.overflowY + h.overflow) && (y.addEventListener("scroll", f, { passive: !0 }), p.push(y)), y = y.parentElement;
  }
  return requestAnimationFrame(() => {
    l(), f();
  }), f(), {
    destroy() {
      n.removeEventListener("scroll", f), n.removeEventListener("resize", b), p.forEach((h) => h.removeEventListener("scroll", f)), c();
    }
  };
}
function $(t) {
  if (typeof document > "u") return { destroy: () => {
  } };
  t.classList.add("blora-anchor");
  const n = t.ownerDocument.defaultView, e = Array.from(t.querySelectorAll("a[href^='#']")), s = Number(t.getAttribute("data-offset")) || 96, i = e.map((a) => {
    const d = (a.getAttribute("href") || "").slice(1);
    return { a, el: d ? t.ownerDocument.getElementById(d) : null };
  }).filter((a) => !!a.el), o = () => {
    const a = n.scrollY + s;
    let d = i[0];
    i.forEach((l) => {
      l.el.offsetTop <= a && (d = l);
    }), e.forEach((l) => l.classList.toggle("is-active", !!d && l === d.a));
  };
  return e.forEach((a) => a.classList.add("blora-anchor__link")), n.addEventListener("scroll", o, { passive: !0 }), o(), {
    destroy() {
      n.removeEventListener("scroll", o);
    }
  };
}
function z(t) {
  if (typeof document > "u") return { destroy: () => {
  } };
  const n = t.ownerDocument.defaultView, e = Array.from(t.querySelectorAll("a[href^='#']")), s = e.map((l) => {
    const c = (l.getAttribute("href") || "").slice(1);
    return c ? t.ownerDocument.getElementById(c) : null;
  }).filter((l) => !!l), i = Number(t.getAttribute("data-blora-spy")) || 120;
  let o = "";
  const a = (l) => {
    try {
      const c = (n.location.pathname || "") + (n.location.search || "");
      n.history.replaceState(null, "", `${c}#${l}`);
    } catch {
    }
  }, d = () => {
    const l = (n.pageYOffset || n.scrollY || 0) + i;
    let c = s[0];
    s.forEach((f) => {
      f.offsetTop <= l && (c = f);
    });
    const u = (c == null ? void 0 : c.id) || "";
    e.forEach((f) => f.classList.toggle("is-active", f.getAttribute("href") === `#${u}`)), u && u !== o && (o = u, String(n.location.hash || "").replace(/^#/, "") !== u && a(u));
  };
  return n.addEventListener("scroll", d, { passive: !0 }), d(), {
    destroy() {
      n.removeEventListener("scroll", d);
    }
  };
}
let w = !1, v = null;
function N(t, n) {
  const e = String(n || "").replace(/^#/, "");
  if (!e) return null;
  let s = e;
  try {
    s = decodeURIComponent(e);
  } catch {
  }
  return t.getElementById(s);
}
function B(t, n) {
  const e = t.ownerDocument.defaultView;
  if (!e) return !1;
  const s = n ?? (e.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
  try {
    const i = t.getBoundingClientRect(), o = e.getComputedStyle(t), a = parseFloat(o.scrollMarginTop) || 0, d = (e.pageYOffset || e.scrollY || 0) + i.top - a;
    return e.scrollTo({ top: Math.max(0, d), behavior: s }), !0;
  } catch {
    try {
      return t.scrollIntoView({ behavior: s, block: "start" }), !0;
    } catch {
      return !1;
    }
  }
}
function I(t, n) {
  try {
    const e = (t.location.pathname || "") + (t.location.search || "");
    t.history.replaceState(null, "", `${e}#${n}`);
  } catch {
  }
}
function q(t = document) {
  if (typeof document > "u") return () => {
  };
  if (w && v) return v;
  const n = t.defaultView;
  if (!n) return () => {
  };
  w = !0;
  try {
    "scrollRestoration" in n.history && (n.history.scrollRestoration = "manual");
  } catch {
  }
  const e = (s) => {
    var u, f;
    if (s.defaultPrevented || s.button != null && s.button !== 0 || s.metaKey || s.ctrlKey || s.shiftKey || s.altKey) return;
    const i = (f = (u = s.target) == null ? void 0 : u.closest) == null ? void 0 : f.call(
      u,
      'a[href^="#"]'
    );
    if (!i || i.getAttribute("download") != null) return;
    const o = i.getAttribute("href") || "";
    if (o === "#" || o.length < 2) return;
    try {
      const b = new URL(i.href, n.location.href);
      if (b.pathname !== n.location.pathname || b.search !== n.location.search) return;
    } catch {
    }
    const a = N(t, o);
    if (!a) return;
    s.preventDefault();
    const l = n.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    B(a, l);
    const c = () => I(n, a.id);
    if (l === "smooth" && "onscrollend" in n) {
      const b = () => {
        c(), n.removeEventListener("scrollend", b);
      };
      n.addEventListener("scrollend", b), setTimeout(c, 700);
    } else
      setTimeout(c, l === "smooth" ? 400 : 0);
  };
  return t.addEventListener("click", e, !0), v = () => {
    t.removeEventListener("click", e, !0), w = !1, v = null;
  }, v;
}
export {
  x as BLORA_SIDEBAR_LAYOUT_TAG,
  M as BloraSidebarLayout,
  W as createAffixController,
  $ as createAnchorController,
  z as createScrollSpyController,
  R as defineBloraSidebarLayout,
  q as initSmoothScroll
};
