const d = [
  // -- Button modifiers (must come before base) --
  {
    v1Class: "blora-btn--primary",
    v2Class: "blora-button",
    v2Attr: { name: "data-variant", value: "primary" },
    removeV1: !0,
    docAnchor: "button"
  },
  {
    v1Class: "blora-btn--secondary",
    v2Class: "blora-button",
    v2Attr: { name: "data-variant", value: "secondary" },
    removeV1: !0,
    docAnchor: "button"
  },
  {
    v1Class: "blora-btn--danger",
    v2Class: "blora-button",
    v2Attr: { name: "data-variant", value: "danger" },
    removeV1: !0,
    docAnchor: "button"
  },
  {
    v1Class: "blora-btn--ghost",
    v2Class: "blora-button",
    v2Attr: { name: "data-variant", value: "ghost" },
    removeV1: !0,
    docAnchor: "button"
  },
  {
    v1Class: "blora-btn--outline",
    v2Class: "blora-button",
    v2Attr: { name: "data-variant", value: "outline" },
    removeV1: !0,
    docAnchor: "button"
  },
  {
    v1Class: "blora-btn--text",
    v2Class: "blora-button",
    v2Attr: { name: "data-variant", value: "text" },
    removeV1: !0,
    docAnchor: "button"
  },
  {
    v1Class: "blora-btn--xs",
    v2Class: "blora-button",
    v2Attr: { name: "data-size", value: "xs" },
    removeV1: !0,
    docAnchor: "button"
  },
  {
    v1Class: "blora-btn--sm",
    v2Class: "blora-button",
    v2Attr: { name: "data-size", value: "sm" },
    removeV1: !0,
    docAnchor: "button"
  },
  {
    v1Class: "blora-btn--lg",
    v2Class: "blora-button",
    v2Attr: { name: "data-size", value: "lg" },
    removeV1: !0,
    docAnchor: "button"
  },
  {
    v1Class: "blora-btn--xl",
    v2Class: "blora-button",
    v2Attr: { name: "data-size", value: "xl" },
    removeV1: !0,
    docAnchor: "button"
  },
  {
    v1Class: "blora-btn--icon",
    v2Class: "blora-button",
    v2Attr: { name: "data-size", value: "icon" },
    removeV1: !0,
    docAnchor: "button"
  },
  // Button base
  {
    v1Class: "blora-btn",
    v2Class: "blora-button",
    v2Attr: null,
    removeV1: !0,
    docAnchor: "button"
  },
  // -- Card modifiers --
  {
    v1Class: "blora-card--hover",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "hover" },
    removeV1: !0,
    docAnchor: "card"
  },
  {
    v1Class: "blora-card--flat",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "flat" },
    removeV1: !0,
    docAnchor: "card"
  },
  {
    v1Class: "blora-card--inset",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "inset" },
    removeV1: !0,
    docAnchor: "card"
  },
  {
    v1Class: "blora-card--relative",
    v2Class: null,
    v2Attr: { name: "data-positioned", value: "" },
    removeV1: !0,
    docAnchor: "card"
  },
  {
    v1Class: "blora-card--with-badge",
    v2Class: null,
    v2Attr: { name: "data-with-badge", value: "" },
    removeV1: !0,
    docAnchor: "card"
  },
  // -- Table modifiers --
  {
    v1Class: "blora-table--striped",
    v2Class: null,
    v2Attr: { name: "data-striped", value: "" },
    removeV1: !0,
    docAnchor: "table"
  },
  // -- List modifiers --
  {
    v1Class: "blora-list--hover",
    v2Class: null,
    v2Attr: { name: "data-hover", value: "" },
    removeV1: !0,
    docAnchor: "list"
  },
  // -- Collapse -> Accordion (class rename) --
  {
    v1Class: "blora-collapse__content",
    v2Class: "blora-accordion__content",
    v2Attr: null,
    removeV1: !0,
    docAnchor: "accordion"
  },
  {
    v1Class: "blora-collapse__body",
    v2Class: "blora-accordion__body",
    v2Attr: null,
    removeV1: !0,
    docAnchor: "accordion"
  },
  {
    v1Class: "blora-collapse__icon",
    v2Class: "blora-accordion__icon",
    v2Attr: null,
    removeV1: !0,
    docAnchor: "accordion"
  },
  {
    v1Class: "blora-collapse__head",
    v2Class: "blora-accordion__head",
    v2Attr: null,
    removeV1: !0,
    docAnchor: "accordion"
  },
  {
    v1Class: "blora-collapse__item",
    v2Class: "blora-accordion__item",
    v2Attr: null,
    removeV1: !0,
    docAnchor: "accordion"
  },
  {
    v1Class: "blora-collapse",
    v2Class: "blora-accordion",
    v2Attr: null,
    removeV1: !0,
    docAnchor: "accordion"
  },
  // -- Avatar modifiers --
  {
    v1Class: "blora-avatar--xs",
    v2Class: null,
    v2Attr: { name: "data-size", value: "xs" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  {
    v1Class: "blora-avatar--sm",
    v2Class: null,
    v2Attr: { name: "data-size", value: "sm" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  {
    v1Class: "blora-avatar--lg",
    v2Class: null,
    v2Attr: { name: "data-size", value: "lg" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  {
    v1Class: "blora-avatar--xl",
    v2Class: null,
    v2Attr: { name: "data-size", value: "xl" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  {
    v1Class: "blora-avatar--primary",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "primary" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  {
    v1Class: "blora-avatar--neutral",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "neutral" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  {
    v1Class: "blora-avatar--info",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "info" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  {
    v1Class: "blora-avatar--success",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "success" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  {
    v1Class: "blora-avatar--contrast",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "contrast" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  {
    v1Class: "blora-avatar--square",
    v2Class: null,
    v2Attr: { name: "data-shape", value: "square" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  // -- Timeline dot modifiers --
  {
    v1Class: "blora-timeline__dot--primary",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "primary" },
    removeV1: !0,
    docAnchor: "timeline"
  },
  {
    v1Class: "blora-timeline__dot--success",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "success" },
    removeV1: !0,
    docAnchor: "timeline"
  },
  // -- Result modifiers --
  {
    v1Class: "blora-result--success",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "success" },
    removeV1: !0,
    docAnchor: "result"
  },
  {
    v1Class: "blora-result--warning",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "warning" },
    removeV1: !0,
    docAnchor: "result"
  },
  {
    v1Class: "blora-result--error",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "error" },
    removeV1: !0,
    docAnchor: "result"
  },
  {
    v1Class: "blora-result--info",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "info" },
    removeV1: !0,
    docAnchor: "result"
  },
  // -- Status dot modifiers --
  {
    v1Class: "blora-dot--primary",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "primary" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  {
    v1Class: "blora-dot--success",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "success" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  {
    v1Class: "blora-dot--warning",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "warning" },
    removeV1: !0,
    docAnchor: "avatar"
  },
  {
    v1Class: "blora-dot--pulse",
    v2Class: null,
    v2Attr: { name: "data-pulse", value: "" },
    removeV1: !0,
    docAnchor: "avatar"
  }
], h = [
  {
    contextClass: "blora-btn",
    v1State: "is-loading",
    v2Attr: { name: "data-loading", value: "" },
    docAnchor: "button"
  },
  {
    contextClass: "blora-fab",
    v1State: "is-hidden",
    v2Attr: { name: "data-hidden", value: "" },
    docAnchor: "button"
  },
  {
    contextClass: "blora-collapse__item",
    v1State: "is-open",
    v2Attr: { name: "data-open", value: "" },
    docAnchor: "accordion"
  },
  {
    contextClass: "blora-table-wrap",
    v1State: "is-loading",
    v2Attr: { name: "data-loading", value: "" },
    docAnchor: "table"
  },
  {
    contextClass: "blora-table-wrap",
    v1State: "is-empty",
    v2Attr: { name: "data-empty", value: "" },
    docAnchor: "table"
  }
], C = [
  { v1Attr: "data-blora-palette", v2Attr: "data-blora-theme", docAnchor: "tokens" },
  { v1Attr: "data-blora-size", v2Attr: "data-blora-density", docAnchor: "tokens" },
  { v1Attr: "data-blora-color-mode", v2Attr: "data-blora-color-scheme", docAnchor: "tokens" }
], f = [
  { v1Event: "blora:appearancechange", v2Event: "blora-appearance-change", docAnchor: "events" },
  { v1Event: "blora:palettechange", v2Event: "blora-theme-change", docAnchor: "events" },
  { v1Event: "blora:modetoggle", v2Event: "blora-color-scheme-change", docAnchor: "events" }
], i = "/docs/migration/v1-to-v2", b = /* @__PURE__ */ new Set();
function u(t, o, r) {
  if (b.has(t)) return;
  b.add(t);
  const a = `${i}#${r}`;
  console.warn(`[Blora compat] ${o}
  See: ${a}`);
}
function A(t, o) {
  let r = 0;
  for (const a of d) {
    if (!t.classList.contains(a.v1Class)) continue;
    const s = `class:${a.v1Class}`;
    if (!o) {
      const e = a.v2Class ?? a.v1Class, n = a.v2Attr ? `[${a.v2Attr.name}${a.v2Attr.value ? `="${a.v2Attr.value}"` : ""}]` : "";
      u(
        s,
        `.${a.v1Class} is deprecated. Use .${e}${n}.`,
        a.docAnchor
      );
    }
    a.v2Class && a.v2Class !== a.v1Class && t.classList.add(a.v2Class), a.v2Attr && (a.v2Attr.value ? t.setAttribute(a.v2Attr.name, a.v2Attr.value) : t.setAttribute(a.v2Attr.name, "")), a.removeV1 && t.classList.remove(a.v1Class), r++;
  }
  for (const a of h) {
    if (!t.classList.contains(a.v1State) || !(t.classList.contains(a.contextClass) || d.some(
      (n) => n.v1Class === a.contextClass && n.v2Class && t.classList.contains(n.v2Class)
    ))) continue;
    const e = `state:${a.contextClass}.${a.v1State}`;
    o || u(
      e,
      `.${a.v1State} on .${a.contextClass} is deprecated. Use ${a.v2Attr.name}="${a.v2Attr.value}".`,
      a.docAnchor
    ), t.setAttribute(a.v2Attr.name, a.v2Attr.value), t.classList.remove(a.v1State), r++;
  }
  for (const a of C) {
    if (!t.hasAttribute(a.v1Attr)) continue;
    const s = `attr:${a.v1Attr}`;
    o || u(s, `${a.v1Attr} is deprecated. Use ${a.v2Attr}.`, a.docAnchor);
    const e = t.getAttribute(a.v1Attr);
    t.setAttribute(a.v2Attr, e ?? ""), t.removeAttribute(a.v1Attr), r++;
  }
  return r;
}
function m(t, o) {
  let r = 0;
  const a = t.querySelectorAll("*");
  for (const s of a)
    r += A(s, o);
  return t instanceof Element && (r += A(t, o)), r;
}
function p(t) {
  for (const o of f)
    t.addEventListener(
      o.v1Event,
      (r) => {
        var s;
        const a = new CustomEvent(o.v2Event, {
          bubbles: r.bubbles,
          cancelable: r.cancelable,
          detail: r.detail
        });
        (s = r.target) == null || s.dispatchEvent(a);
      },
      { signal: l.signal }
    );
}
let l;
function g(t = {}) {
  const { silent: o = !1, observe: r = !0 } = t;
  if (typeof document > "u")
    return () => {
    };
  const a = t.root ?? document.documentElement;
  l = new AbortController();
  const s = m(a, o);
  !o && s > 0 && console.warn(
    `[Blora compat] Applied ${s} migration(s). Run the codemod to fix these automatically: npx @bloret-crew/blora-codemod .`
  ), p(a);
  let e = null;
  return r && typeof MutationObserver < "u" && (e = new MutationObserver((n) => {
    for (const v of n)
      for (const c of v.addedNodes)
        c.nodeType === Node.ELEMENT_NODE && (A(c, o), m(c, o));
  }), e.observe(a, { childList: !0, subtree: !0 })), () => {
    l == null || l.abort(), e == null || e.disconnect();
  };
}
function V(t) {
  const o = t ?? (typeof document < "u" ? document.documentElement : null);
  if (!o)
    return { total: 0, findings: [] };
  const r = [], a = o.querySelectorAll("*");
  for (const s of a) {
    for (const e of d) {
      if (!s.classList.contains(e.v1Class)) continue;
      const n = e.v2Class ?? e.v1Class, v = e.v2Attr ? `[${e.v2Attr.name}${e.v2Attr.value ? `="${e.v2Attr.value}"` : ""}]` : "";
      r.push({
        ruleId: `class:${e.v1Class}`,
        element: s.tagName.toLowerCase() + ` .${e.v1Class}`,
        suggestion: `.${n}${v}`,
        docLink: `${i}#${e.docAnchor}`,
        autoFixable: !0
      });
    }
    for (const e of C)
      s.hasAttribute(e.v1Attr) && r.push({
        ruleId: `attr:${e.v1Attr}`,
        element: s.tagName.toLowerCase() + ` [${e.v1Attr}]`,
        suggestion: `[${e.v2Attr}]`,
        docLink: `${i}#${e.docAnchor}`,
        autoFixable: !0
      });
  }
  return { total: r.length, findings: r };
}
export {
  d as CLASS_MIGRATIONS,
  C as DATA_ATTR_MIGRATIONS,
  f as EVENT_MIGRATIONS,
  h as STATE_MIGRATIONS,
  V as getCompatReport,
  g as initV1Compatibility
};
