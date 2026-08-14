var Be = Object.defineProperty;
var Ie = (n, l, t) => l in n ? Be(n, l, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[l] = t;
var y = (n, l, t) => Ie(n, typeof l != "symbol" ? l + "" : l, t);
import { B as T } from "./overlay-controller-YPogqRmU.js";
import { c as O } from "./dialog-DUwFWfCH.js";
const ct = "blora-collapse";
let Oe = 0;
const rt = ".blora-collapse__item, .blora-accordion__item", nt = ".blora-collapse__head, .blora-accordion__head", Re = ".blora-collapse__body, .blora-accordion__body";
function j(n) {
  return n.hasAttribute("data-open") || n.classList.contains("is-open");
}
function ot(n) {
  return n.querySelector(Re);
}
function at(n) {
  const l = n.firstElementChild, t = n.scrollHeight, e = l ? Math.max(l.scrollHeight, l.offsetHeight, l.getBoundingClientRect().height) : 0;
  return Math.ceil(Math.max(t, e, 1));
}
function lt(n, l) {
  n.style.setProperty("--blora-collapse-h", `${l}px`);
}
function Pe(n) {
  n.style.maxHeight = "";
}
function $e(n) {
  const l = ot(n), t = n.querySelector(nt);
  if (!l) return;
  const e = at(l);
  lt(l, e), n.setAttribute("data-open", ""), n.classList.add("is-open"), t == null || t.setAttribute("aria-expanded", "true"), l.setAttribute("aria-hidden", "false");
  const r = (a) => {
    a.propertyName === "max-height" && (l.removeEventListener("transitionend", r), j(n) && (l.style.maxHeight = "none"));
  };
  l.addEventListener("transitionend", r);
}
function ut(n) {
  const l = ot(n), t = n.querySelector(nt);
  if (!l) return;
  const e = l.style.maxHeight === "none" || !l.style.maxHeight ? at(l) : l.scrollHeight || at(l);
  lt(l, e), l.style.maxHeight = `${e}px`, l.offsetHeight, n.removeAttribute("data-open"), n.classList.remove("is-open"), t == null || t.setAttribute("aria-expanded", "false"), l.setAttribute("aria-hidden", "true"), requestAnimationFrame(() => {
    l.style.maxHeight = "";
  });
}
function Ce(n) {
  if (typeof document > "u") return { destroy: () => {
  } };
  n.querySelectorAll(rt).forEach((t) => {
    const e = ot(t);
    if (e)
      if (j(t)) {
        const r = at(e);
        lt(e, r), e.style.maxHeight = "none", e.setAttribute("aria-hidden", "false");
      } else
        e.style.removeProperty("--blora-collapse-h"), Pe(e), e.setAttribute("aria-hidden", "true");
  });
  const l = (t) => {
    const e = t.target.closest(nt);
    if (!e || !n.contains(e)) return;
    const r = e.closest(rt);
    if (!r) return;
    const a = r.closest("[data-blora-accordion]") || (n.hasAttribute("data-blora-accordion") || n.classList.contains("blora-accordion") ? n : null), i = j(r);
    a && !i && a.querySelectorAll(rt).forEach((s) => {
      s !== r && j(s) && ut(s);
    }), i ? ut(r) : $e(r);
  };
  return n.addEventListener("click", l), n.querySelectorAll(nt).forEach((t) => {
    const e = t.closest(rt);
    t.setAttribute("aria-expanded", String(!!e && j(e)));
  }), {
    destroy() {
      n.removeEventListener("click", l);
    }
  };
}
class Ge extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "instanceId", ++Oe);
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((e) => e.localName === "blora-collapse-item").map((e) => ({
      content: Array.from(e.childNodes),
      disabled: e.hasAttribute("disabled"),
      heading: e.getAttribute("heading") ?? e.getAttribute("label") ?? "",
      open: e.hasAttribute("open")
    })));
    const t = document.createElement("div");
    t.className = "blora-collapse", t.dataset.bloraGenerated = "";
    for (const [e, r] of this.definitions.entries()) {
      const a = document.createElement("div");
      a.className = "blora-collapse__item", r.open && (a.dataset.open = "");
      const i = document.createElement("button");
      i.className = "blora-collapse__head", i.type = "button", i.disabled = r.disabled, i.id = `blora-collapse-head-${this.instanceId}-${e}`, i.setAttribute("aria-expanded", String(r.open));
      const s = document.createElement("span");
      s.textContent = r.heading;
      const o = document.createElement("span");
      o.className = "blora-collapse__icon", o.appendChild(O("chevron-right", 14)), i.append(s, o);
      const c = document.createElement("div");
      c.className = "blora-collapse__body", c.id = `blora-collapse-panel-${this.instanceId}-${e}`, c.setAttribute("role", "region"), c.setAttribute("aria-labelledby", i.id), c.setAttribute("aria-hidden", String(!r.open)), i.setAttribute("aria-controls", c.id);
      const u = document.createElement("div");
      u.className = "blora-collapse__content", u.append(...r.content), c.appendChild(u), a.append(i, c), t.appendChild(a);
    }
    this.replaceChildren(t);
  }
  bindEvents() {
    const t = this.querySelector(".blora-collapse");
    t && (this.controller = Ce(t));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function ea(n = customElements) {
  !n || n.get(ct) || n.define(ct, Ge);
}
const dt = "blora-accordion";
let He = 0;
class ze extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "instanceId", ++He);
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((e) => e.localName === "blora-accordion-item").map((e) => ({
      content: Array.from(e.childNodes),
      disabled: e.hasAttribute("disabled"),
      heading: e.getAttribute("heading") ?? e.getAttribute("label") ?? "",
      open: e.hasAttribute("open")
    })));
    const t = document.createElement("div");
    t.className = "blora-accordion", t.dataset.bloraAccordion = "", t.dataset.bloraGenerated = "";
    for (const [e, r] of this.definitions.entries()) {
      const a = document.createElement("div");
      a.className = "blora-accordion__item", r.open && (a.dataset.open = "");
      const i = document.createElement("button");
      i.className = "blora-accordion__head", i.type = "button", i.disabled = r.disabled, i.id = `blora-accordion-head-${this.instanceId}-${e}`, i.setAttribute("aria-expanded", String(r.open));
      const s = document.createElement("span");
      s.textContent = r.heading;
      const o = document.createElement("span");
      o.className = "blora-accordion__icon", o.appendChild(O("chevron-right", 14)), i.append(s, o);
      const c = document.createElement("div");
      c.className = "blora-accordion__body", c.id = `blora-accordion-panel-${this.instanceId}-${e}`, c.setAttribute("role", "region"), c.setAttribute("aria-labelledby", i.id), c.setAttribute("aria-hidden", String(!r.open)), i.setAttribute("aria-controls", c.id);
      const u = document.createElement("div");
      u.className = "blora-accordion__content", u.append(...r.content), c.appendChild(u), a.append(i, c), t.appendChild(a);
    }
    this.replaceChildren(t);
  }
  bindEvents() {
    const t = this.querySelector(".blora-accordion");
    t && (this.controller = Ce(t));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function ra(n = customElements) {
  !n || n.get(dt) || n.define(dt, ze);
}
const bt = "blora-search";
function we(n) {
  const l = n.querySelector("input"), t = n.querySelector(".blora-search__clear");
  if (!l) return { destroy: () => {
  } };
  const e = () => {
    t && (t.hidden = l.value.length === 0);
  }, r = () => e(), a = (i) => {
    i.preventDefault(), l.value = "", e(), l.focus();
  };
  return l.addEventListener("input", r), t == null || t.addEventListener("click", a), e(), {
    destroy() {
      l.removeEventListener("input", r), t == null || t.removeEventListener("click", a);
    }
  };
}
class Fe extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
  }
  static get observedAttributes() {
    return ["value", "placeholder", "name", "disabled", "required", "label"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  get value() {
    var t;
    return ((t = this.querySelector(".blora-input")) == null ? void 0 : t.value) ?? "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  focus(t) {
    var e;
    (e = this.querySelector(".blora-input")) == null || e.focus(t);
  }
  render() {
    const t = document.createElement("div");
    t.className = "blora-search", t.dataset.bloraGenerated = "";
    const e = document.createElement("button");
    e.className = "blora-search__icon", e.type = "button", e.setAttribute("aria-label", this.getAttribute("label") ?? "搜索"), e.appendChild(O("search"));
    const r = document.createElement("input");
    r.className = "blora-input", r.type = "search", r.value = this.getAttribute("value") ?? "", r.placeholder = this.getAttribute("placeholder") ?? "搜索…", r.disabled = this.hasAttribute("disabled"), r.required = this.hasAttribute("required"), this.hasAttribute("name") && (r.name = this.getAttribute("name") ?? "");
    const a = document.createElement("button");
    a.className = "blora-search__clear", a.type = "button", a.hidden = r.value.length === 0, a.disabled = r.disabled, a.setAttribute("aria-label", "清除"), a.appendChild(O("close")), t.append(e, r, a), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-input");
    if (!t) return;
    document.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value), t.placeholder = this.getAttribute("placeholder") ?? "搜索…", t.disabled = this.hasAttribute("disabled"), t.required = this.hasAttribute("required"), this.hasAttribute("name") && (t.name = this.getAttribute("name") ?? "");
    const e = this.querySelector(".blora-search__clear");
    e && (e.hidden = t.value.length === 0, e.disabled = t.disabled);
    const r = this.querySelector(".blora-search__icon");
    r && r.setAttribute("aria-label", this.getAttribute("label") ?? "搜索");
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-search");
    (e = this.controller) == null || e.destroy(), this.controller = t ? we(t) : null;
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function na(n = customElements) {
  !n || n.get(bt) || n.define(bt, Fe);
}
const ht = "blora-command";
function Ve() {
  if (typeof navigator < "u") {
    const n = navigator.platform || "", l = navigator.userAgent || "";
    if (/Mac|iPhone|iPad|iPod/i.test(n) || /Mac OS X/i.test(l)) return "⌘";
  }
  return "Ctrl+";
}
function Ye(n) {
  const l = n.querySelector("input"), t = n.querySelector(".blora-cmdk-results, .blora-command__results") || n, e = () => Array.from(t.querySelectorAll(".blora-cmdk-item, .blora-command__item")), r = Ve();
  n.querySelectorAll("kbd[data-keys], .blora-command__kbd, .blora-cmdk-kbd").forEach((c) => {
    const u = c.dataset.keys || c.textContent || "";
    c.textContent = u.replace(/^(⌘|Ctrl\+?|ctrl\+?)/, r === "⌘" ? "⌘" : "Ctrl+"), c.dataset.keys || (c.dataset.keys = u);
  });
  let a = 0;
  const i = () => {
    e().filter((u) => u.style.display !== "none").forEach((u, d) => {
      u.toggleAttribute("data-active", d === a), u.classList.toggle("is-active", d === a);
    });
  }, s = () => {
    const c = ((l == null ? void 0 : l.value) || "").trim().toLowerCase();
    e().forEach((u, d) => {
      const b = (u.textContent || "").toLowerCase(), p = !c || b.includes(c);
      u.style.display = p ? "" : "none";
    }), a = 0, i();
  }, o = (c) => {
    var d;
    const u = e().filter((b) => b.style.display !== "none");
    u.length && (c.key === "ArrowDown" ? (c.preventDefault(), a = Math.min(u.length - 1, a + 1), i()) : c.key === "ArrowUp" ? (c.preventDefault(), a = Math.max(0, a - 1), i()) : c.key === "Enter" && (c.preventDefault(), (d = u[a]) == null || d.click()));
  };
  return e().forEach((c) => {
    c.addEventListener("mouseenter", () => {
      a = e().filter((d) => d.style.display !== "none").indexOf(c), i();
    }), c.addEventListener("click", () => {
      var u;
      n.dispatchEvent(
        new CustomEvent("blora:command", {
          bubbles: !0,
          detail: { label: (u = c.textContent) == null ? void 0 : u.trim() }
        })
      );
    });
  }), l == null || l.addEventListener("input", s), l == null || l.addEventListener("keydown", o), i(), {
    destroy() {
      l == null || l.removeEventListener("input", s), l == null || l.removeEventListener("keydown", o);
    }
  };
}
const We = /* @__PURE__ */ new Set(["document", "folder", "search", "settings"]);
class Ue extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "searchController", null);
    y(this, "definitions", null);
  }
  static get observedAttributes() {
    return ["placeholder"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((c) => c.localName === "blora-command-item").map((c) => {
      var b;
      const u = c.getAttribute("icon") ?? "document", d = c.getAttribute("label") ?? ((b = c.textContent) == null ? void 0 : b.trim()) ?? "";
      return {
        disabled: c.hasAttribute("disabled"),
        icon: We.has(u) ? u : "document",
        label: d,
        shortcut: c.getAttribute("shortcut") ?? "",
        value: c.getAttribute("value") ?? d
      };
    }));
    const t = document.createElement("div");
    t.className = "blora-command", t.dataset.bloraGenerated = "";
    const e = document.createElement("div");
    e.className = "blora-command__search";
    const r = document.createElement("div");
    r.className = "blora-search";
    const a = document.createElement("span");
    a.className = "blora-search__icon", a.setAttribute("aria-hidden", "true"), a.appendChild(O("search"));
    const i = document.createElement("input");
    i.className = "blora-input", i.type = "search", i.placeholder = this.getAttribute("placeholder") ?? "输入命令或搜索...";
    const s = document.createElement("button");
    s.className = "blora-search__clear", s.type = "button", s.hidden = !0, s.setAttribute("aria-label", "清除"), s.appendChild(O("close")), r.append(a, i, s), e.appendChild(r);
    const o = document.createElement("div");
    o.className = "blora-cmdk-results blora-command__results", this.definitions.forEach((c, u) => {
      const d = document.createElement("div");
      d.className = "blora-cmdk-item blora-command__item", d.dataset.value = c.value, u === 0 && (d.dataset.active = ""), c.disabled && (d.dataset.disabled = "", d.setAttribute("aria-disabled", "true"));
      const b = document.createElement("span");
      b.appendChild(O(c.icon));
      const p = document.createElement("span");
      if (p.className = "blora-text-sm", p.textContent = c.label, d.append(b, p), c.shortcut) {
        const h = document.createElement("kbd");
        h.className = "blora-command__kbd", h.dataset.keys = c.shortcut, h.textContent = c.shortcut, d.appendChild(h);
      }
      o.appendChild(d);
    }), t.append(e, o), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-search .blora-input, .blora-input");
    t && (t.placeholder = this.getAttribute("placeholder") ?? t.placeholder);
  }
  bindEvents() {
    var r, a;
    const t = this.querySelector(".blora-command"), e = t == null ? void 0 : t.querySelector(".blora-search");
    t && ((r = this.controller) == null || r.destroy(), (a = this.searchController) == null || a.destroy(), this.controller = Ye(t), e && (this.searchController = we(e)));
  }
  onDisconnect() {
    var t, e;
    (t = this.controller) == null || t.destroy(), (e = this.searchController) == null || e.destroy(), this.controller = null, this.searchController = null;
  }
}
function aa(n = customElements) {
  !n || n.get(ht) || n.define(ht, Ue);
}
const pt = "blora-datepicker", mt = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月"
], Ke = ["日", "一", "二", "三", "四", "五", "六"], ft = (n, l) => {
  n.replaceChildren(
    O(l === "prev" ? "chevron-left" : "chevron-right", 14, n.ownerDocument)
  );
};
function st(n) {
  return n.getFullYear() + "-" + String(n.getMonth() + 1).padStart(2, "0") + "-" + String(n.getDate()).padStart(2, "0");
}
function Xe(n) {
  const l = n.split("-");
  if (l.length !== 3) return null;
  const t = new Date(Number(l[0]), Number(l[1]) - 1, Number(l[2]));
  return Number.isNaN(t.getTime()) ? null : t;
}
function Qe(n) {
  const l = n.querySelector("input"), t = n.querySelector(".blora-datepicker__btn");
  if (!l) return { destroy: () => {
  } };
  l.type !== "date" && (l.type = "date");
  const e = l.min, r = l.max;
  let a = null, i = (/* @__PURE__ */ new Date()).getFullYear(), s = (/* @__PURE__ */ new Date()).getMonth(), o = "days";
  const c = /* @__PURE__ */ new Date();
  let u = !1, d = n.querySelector(".blora-datepicker__panel");
  d || (d = document.createElement("div"), d.className = "blora-datepicker__panel", n.appendChild(d));
  const b = (x) => {
    const A = st(x);
    return !(e && A < e || r && A > r);
  }, p = () => {
    if (l.value) {
      const x = Xe(l.value);
      if (x) {
        a = x, i = x.getFullYear(), s = x.getMonth();
        return;
      }
    }
    a = null, i || (i = c.getFullYear(), s = c.getMonth());
  }, h = (x, A, L) => {
    const M = document.createElement(x);
    return A && (M.className = A), L != null && (M.textContent = L), M;
  }, m = () => {
    d.replaceChildren();
    const x = h("div", "blora-datepicker__head"), A = h("button", "blora-datepicker__nav");
    A.setAttribute("type", "button"), A.setAttribute("data-nav", "prev"), ft(A, "prev");
    const L = h("button", "blora-datepicker__nav");
    L.setAttribute("type", "button"), L.setAttribute("data-nav", "next"), ft(L, "next");
    let M = "", f = null;
    if (o === "days")
      M = `${i}年 ${mt[s]}`, f = "months";
    else if (o === "months")
      M = `${i}年`, f = "years";
    else {
      const q = Math.floor(i / 10) * 10;
      M = `${q}–${q + 9}年`;
    }
    const _ = h("span", "blora-datepicker__title", M);
    if (f && _.setAttribute("data-zoom", f), x.append(A, _, L), d.appendChild(x), o === "days") {
      const q = h("div", "blora-datepicker__grid");
      Ke.forEach(($) => q.appendChild(h("div", "blora-datepicker__dow", $)));
      const B = new Date(i, s, 1).getDay(), R = new Date(i, s + 1, 0).getDate(), P = new Date(i, s, 0).getDate();
      for (let $ = B - 1; $ >= 0; $--) {
        const H = h("div", "blora-datepicker__cell", String(P - $));
        H.setAttribute("data-other", ""), q.appendChild(H);
      }
      for (let $ = 1; $ <= R; $++) {
        const H = new Date(i, s, $), z = h("div", "blora-datepicker__cell", String($));
        z.setAttribute("data-day", String($)), H.toDateString() === c.toDateString() && z.setAttribute("data-today", ""), a && H.toDateString() === a.toDateString() && z.setAttribute("data-selected", ""), b(H) || z.setAttribute("disabled", ""), q.appendChild(z);
      }
      const V = (7 - (B + R) % 7) % 7;
      for (let $ = 1; $ <= V; $++) {
        const H = h("div", "blora-datepicker__cell", String($));
        H.setAttribute("data-other", ""), q.appendChild(H);
      }
      d.appendChild(q);
    } else if (o === "months") {
      const q = h("div", "blora-datepicker__grid blora-datepicker__grid--months");
      mt.forEach((I, B) => {
        const R = h("div", "blora-datepicker__cell blora-datepicker__cell--month", I);
        R.setAttribute("data-month", String(B)), a && i === a.getFullYear() && B === a.getMonth() && R.setAttribute("data-selected", ""), i === c.getFullYear() && B === c.getMonth() && R.setAttribute("data-today", ""), q.appendChild(R);
      }), d.appendChild(q);
    } else {
      const q = Math.floor(i / 10) * 10, I = h("div", "blora-datepicker__grid blora-datepicker__grid--years");
      for (let B = q - 1; B <= q + 10; B++) {
        const R = h("div", "blora-datepicker__cell blora-datepicker__cell--year", String(B));
        R.setAttribute("data-year", String(B)), (B < q || B > q + 9) && R.setAttribute("data-other", ""), a && B === a.getFullYear() && R.setAttribute("data-selected", ""), B === c.getFullYear() && R.setAttribute("data-today", ""), I.appendChild(R);
      }
      d.appendChild(I);
    }
    const E = h("div", "blora-datepicker__foot"), k = h("button", "blora-button");
    k.setAttribute("type", "button"), k.setAttribute("data-variant", "ghost"), k.setAttribute("data-size", "sm"), k.setAttribute("data-clear", ""), k.textContent = "清除";
    const S = h("button", "blora-button");
    S.setAttribute("type", "button"), S.setAttribute("data-variant", "ghost"), S.setAttribute("data-size", "sm"), S.setAttribute("data-today", ""), S.textContent = "今天", E.append(k, S), d.appendChild(E);
  }, C = () => {
    p(), o = "days", d.setAttribute("data-open", ""), n.style.zIndex = "var(--blora-z-dropdown)", m();
  }, v = () => {
    d.removeAttribute("data-open"), n.style.zIndex = "";
  }, g = (x) => {
    x.preventDefault(), x.stopPropagation(), d.hasAttribute("data-open") ? v() : (u = !0, C(), queueMicrotask(() => {
      u = !1;
    }));
  }, N = (x) => {
    if (!d.hasAttribute("data-open") || u) return;
    const A = x.target;
    A && !A.isConnected || A && n.contains(A) || v();
  }, D = (x) => {
    x.stopPropagation();
    const A = x.target, L = A.closest("[data-nav]");
    if (L) {
      const k = L.dataset.nav === "prev" ? -1 : 1;
      o === "days" ? (s += k, s < 0 ? (s = 11, i--) : s > 11 && (s = 0, i++)) : o === "months" ? i += k : i += k * 10, m();
      return;
    }
    const M = A.closest("[data-zoom]");
    if (M) {
      M.dataset.zoom === "months" ? o = "months" : M.dataset.zoom === "years" && (o = "years"), m();
      return;
    }
    if (A.closest("[data-today]")) {
      a = /* @__PURE__ */ new Date(), i = a.getFullYear(), s = a.getMonth(), o = "days", l.value = st(a), l.dispatchEvent(new Event("change", { bubbles: !0 })), v();
      return;
    }
    if (A.closest("[data-clear]")) {
      a = null, l.value = "", l.dispatchEvent(new Event("change", { bubbles: !0 })), v();
      return;
    }
    const f = A.closest(".blora-datepicker__cell[data-day]");
    if (f && !f.hasAttribute("disabled") && !f.hasAttribute("data-other")) {
      a = new Date(i, s, Number(f.dataset.day)), l.value = st(a), l.dispatchEvent(new Event("change", { bubbles: !0 })), v();
      return;
    }
    const _ = A.closest("[data-month]");
    if (_) {
      s = Number(_.dataset.month), o = "days", m();
      return;
    }
    const E = A.closest("[data-year]");
    E && (i = Number(E.dataset.year), o = "months", m());
  }, w = (x) => {
    l.showPicker;
  };
  return t == null || t.addEventListener("click", g), d.addEventListener("click", D), document.addEventListener("click", N), l.addEventListener("click", w), {
    destroy() {
      t == null || t.removeEventListener("click", g), d.removeEventListener("click", D), document.removeEventListener("click", N), l.removeEventListener("click", w);
    }
  };
}
class je extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
  }
  static get observedAttributes() {
    return ["value", "min", "max", "placeholder", "name", "disabled", "required"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  get value() {
    var t;
    return ((t = this.querySelector(".blora-input")) == null ? void 0 : t.value) ?? "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  focus(t) {
    var e;
    (e = this.querySelector(".blora-input")) == null || e.focus(t);
  }
  render() {
    const t = document.createElement("div");
    t.className = "blora-datepicker", t.dataset.bloraDatepicker = "", t.dataset.bloraGenerated = "";
    const e = document.createElement("input");
    e.className = "blora-input", e.type = "date", e.value = this.getAttribute("value") ?? "", e.min = this.getAttribute("min") ?? "1900-01-01", e.max = this.getAttribute("max") ?? "2099-12-31", e.placeholder = this.getAttribute("placeholder") ?? "YYYY-MM-DD", e.disabled = this.hasAttribute("disabled"), e.required = this.hasAttribute("required"), this.hasAttribute("name") && (e.name = this.getAttribute("name") ?? "");
    const r = document.createElement("button");
    r.className = "blora-datepicker__btn", r.type = "button", r.tabIndex = -1, r.disabled = e.disabled, r.setAttribute("aria-label", "选择日期"), r.appendChild(O("calendar")), t.append(e, r), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-input");
    if (!t) return;
    document.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value), t.min = this.getAttribute("min") ?? "1900-01-01", t.max = this.getAttribute("max") ?? "2099-12-31", t.placeholder = this.getAttribute("placeholder") ?? "YYYY-MM-DD", t.disabled = this.hasAttribute("disabled"), t.required = this.hasAttribute("required"), this.hasAttribute("name") && (t.name = this.getAttribute("name") ?? "");
    const e = this.querySelector(".blora-datepicker__btn");
    e && (e.disabled = t.disabled);
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-datepicker");
    (e = this.controller) == null || e.destroy(), this.controller = t ? Qe(t) : null;
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function ia(n = customElements) {
  !n || n.get(pt) || n.define(pt, je);
}
const vt = "blora-range";
function Je(n) {
  const l = n.querySelector(".blora-range__track"), t = n.querySelector(".blora-range__fill"), e = Array.from(n.querySelectorAll(".blora-range__thumb")), r = n.querySelector(".blora-range__value");
  if (!l || e.length < 2) return { destroy: () => {
  } };
  const a = Number(n.dataset.min ?? 0), i = Number(n.dataset.max ?? 100), o = n.dataset.tooltip !== "false" ? e.map(() => {
    const b = document.createElement("span");
    return b.className = "blora-range__tip", b.setAttribute("aria-hidden", "true"), n.appendChild(b), b;
  }) : [], c = (b) => (b - a) / (i - a) * 100, u = () => {
    const b = e.map((v) => Number(v.dataset.val ?? a)), p = Math.min(...b), h = Math.max(...b), m = c(p), C = c(h);
    e.forEach((v, g) => {
      const N = Number(v.dataset.val ?? a);
      v.style.left = `${c(N)}%`, o[g] && (o[g].textContent = String(N), o[g].style.left = `${c(N)}%`);
    }), t && (t.style.left = `${m}%`, t.style.width = `${C - m}%`), r && (r.textContent = `${p} – ${h}`);
  }, d = [];
  return e.forEach((b, p) => {
    let h = !1;
    const m = (D) => {
      h = !0, b.setPointerCapture(D.pointerId), o[p] && o[p].setAttribute("data-show", ""), D.preventDefault();
    }, C = (D) => {
      if (!h) return;
      const w = l.getBoundingClientRect();
      let x = (D.clientX - w.left) / w.width * 100;
      x = Math.max(0, Math.min(100, x));
      const A = Math.round(a + x / 100 * (i - a)), L = e.indexOf(b), M = Number(e[1 - L].dataset.val ?? a);
      L === 0 && A > M || L === 1 && A < M || (b.dataset.val = String(A), u());
    }, v = (D) => {
      h = !1, o[p] && o[p].removeAttribute("data-show");
      try {
        b.releasePointerCapture(D.pointerId);
      } catch {
      }
    }, g = () => {
      var D;
      return (D = o[p]) == null ? void 0 : D.setAttribute("data-show", "");
    }, N = () => {
      var D;
      return (D = o[p]) == null ? void 0 : D.removeAttribute("data-show");
    };
    b.addEventListener("pointerdown", m), b.addEventListener("pointermove", C), b.addEventListener("pointerup", v), b.addEventListener("focus", g), b.addEventListener("blur", N), d.push(() => {
      b.removeEventListener("pointerdown", m), b.removeEventListener("pointermove", C), b.removeEventListener("pointerup", v), b.removeEventListener("focus", g), b.removeEventListener("blur", N);
    });
  }), u(), {
    destroy() {
      d.forEach((b) => b()), o.forEach((b) => b.remove());
    }
  };
}
class Ze extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
  }
  static get observedAttributes() {
    return ["min", "max", "values", "tooltip"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  get values() {
    var e, r;
    const t = this.querySelectorAll(".blora-range__thumb");
    return [Number(((e = t[0]) == null ? void 0 : e.dataset.val) ?? 0), Number(((r = t[1]) == null ? void 0 : r.dataset.val) ?? 100)];
  }
  set values(t) {
    this.setAttribute("values", t.join(","));
  }
  render() {
    const t = Number(this.getAttribute("min") ?? 0), e = Number(this.getAttribute("max") ?? 100), r = (this.getAttribute("values") ?? "20,75").split(",").slice(0, 2).map((b) => Number(b.trim())), a = Number.isFinite(r[0]) ? Math.max(t, Math.min(e, r[0])) : t, i = Number.isFinite(r[1]) ? Math.max(a, Math.min(e, r[1])) : e, s = document.createElement("div");
    s.className = "blora-range", s.dataset.bloraGenerated = "", s.dataset.min = String(t), s.dataset.max = String(e), this.getAttribute("tooltip") === "false" && (s.dataset.tooltip = "false");
    const o = document.createElement("div");
    o.className = "blora-range__track";
    const c = document.createElement("div");
    c.className = "blora-range__fill", o.appendChild(c);
    const u = (b, p) => {
      const h = document.createElement("div");
      return h.className = "blora-range__thumb", h.dataset.val = String(b), h.tabIndex = 0, h.setAttribute("role", "slider"), h.setAttribute("aria-label", p), h.setAttribute("aria-valuemin", String(t)), h.setAttribute("aria-valuemax", String(e)), h.setAttribute("aria-valuenow", String(b)), h;
    }, d = document.createElement("span");
    d.className = "blora-range__value", d.textContent = `${a} – ${i}`, s.append(o, u(a, "最小值"), u(i, "最大值"), d), this.replaceChildren(s);
  }
  sync() {
    const t = this.querySelector(".blora-range");
    if (!t) return;
    const e = this.getAttribute("min"), r = this.getAttribute("max");
    e && (t.dataset.min = e), r && (t.dataset.max = r), this.getAttribute("tooltip") === "false" ? t.dataset.tooltip = "false" : delete t.dataset.tooltip, this.rebind();
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-range");
    (e = this.controller) == null || e.destroy(), this.controller = t ? Je(t) : null;
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function sa(n = customElements) {
  !n || n.get(vt) || n.define(vt, Ze);
}
const gt = "blora-segmented";
function tr(n) {
  if (typeof document > "u") return { destroy: () => {
  } };
  const l = n.ownerDocument.defaultView;
  let t = n.querySelector(".blora-segmented__indicator");
  t || (t = n.ownerDocument.createElement("span"), t.className = "blora-segmented__indicator", t.setAttribute("aria-hidden", "true"), n.insertBefore(t, n.firstChild));
  const e = Array.from(n.querySelectorAll(".blora-segmented__item"));
  n.setAttribute("role", "radiogroup");
  const r = (u) => {
    const d = n.getBoundingClientRect(), b = u.getBoundingClientRect();
    t.style.left = `${b.left - d.left}px`, t.style.width = `${b.width}px`;
  }, a = () => e.filter(
    (u) => !u.classList.contains("is-disabled") && u.getAttribute("aria-disabled") !== "true"
  ), i = (u, d = !1, b = !0) => {
    var p;
    !u || !a().includes(u) || (e.forEach((h) => {
      const m = h === u;
      h.classList.toggle("is-active", m), h.toggleAttribute("data-active", m), h.setAttribute("aria-checked", String(m)), h.getAttribute("aria-disabled") !== "true" && (h.tabIndex = m ? 0 : -1);
    }), n.dataset.value = u.dataset.value || ((p = u.textContent) == null ? void 0 : p.trim()) || "", r(u), d && u.focus(), b && n.dispatchEvent(
      new CustomEvent("blora-change", {
        bubbles: !0,
        detail: { value: n.dataset.value, item: u }
      })
    ));
  };
  e.forEach((u) => {
    u.setAttribute("role", "radio");
    const d = u.classList.contains("is-disabled") || u.getAttribute("aria-disabled") === "true";
    u.setAttribute(
      "aria-checked",
      String(u.classList.contains("is-active") || u.hasAttribute("data-active"))
    ), u.tabIndex = d ? -1 : u.classList.contains("is-active") || u.hasAttribute("data-active") ? 0 : -1, u.addEventListener("click", () => i(u));
  });
  const s = (u) => {
    const d = a();
    if (!d.length) return;
    const b = n.ownerDocument, p = d.indexOf(b.activeElement);
    let h = p < 0 ? 0 : p;
    if (u.key === "ArrowRight" || u.key === "ArrowDown") h = (h + 1) % d.length;
    else if (u.key === "ArrowLeft" || u.key === "ArrowUp")
      h = (h - 1 + d.length) % d.length;
    else if (u.key === "Home") h = 0;
    else if (u.key === "End") h = d.length - 1;
    else if (u.key === "Enter" || u.key === " ") {
      u.preventDefault(), i(b.activeElement);
      return;
    } else return;
    u.preventDefault(), i(d[h], !0);
  };
  n.addEventListener("keydown", s);
  const o = () => {
    const u = e.find(
      (d) => d.classList.contains("is-active") || d.hasAttribute("data-active")
    );
    u && r(u);
  };
  l.addEventListener("resize", o);
  const c = e.find((u) => u.classList.contains("is-active") || u.hasAttribute("data-active")) || a()[0];
  return c && (i(c, !1, !1), l.requestAnimationFrame(() => r(c))), {
    destroy() {
      n.removeEventListener("keydown", s), l.removeEventListener("resize", o);
    }
  };
}
class er extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
  }
  static get observedAttributes() {
    return ["value", "disabled"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  get value() {
    var t;
    return ((t = this.querySelector(".blora-segmented")) == null ? void 0 : t.dataset.value) ?? "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  render() {
    var a, i;
    this.definitions || (this.definitions = Array.from(this.children).filter((s) => s.localName === "blora-segment").map((s) => {
      var c;
      const o = s.getAttribute("label") ?? ((c = s.textContent) == null ? void 0 : c.trim()) ?? "";
      return {
        disabled: s.hasAttribute("disabled"),
        label: o,
        selected: s.hasAttribute("selected"),
        value: s.getAttribute("value") ?? o
      };
    }));
    const t = this.getAttribute("value") ?? ((a = this.definitions.find((s) => s.selected)) == null ? void 0 : a.value) ?? ((i = this.definitions.find((s) => !s.disabled)) == null ? void 0 : i.value), e = document.createElement("div");
    e.className = "blora-segmented", e.dataset.bloraGenerated = "";
    const r = document.createElement("span");
    r.className = "blora-segmented__indicator", r.setAttribute("aria-hidden", "true"), e.appendChild(r);
    for (const s of this.definitions) {
      const o = document.createElement("button");
      o.type = "button", o.className = "blora-segmented__item", o.dataset.value = s.value, o.textContent = s.label, o.disabled = s.disabled || this.hasAttribute("disabled"), o.disabled && o.setAttribute("aria-disabled", "true"), s.value === t && (o.classList.add("is-active"), o.dataset.active = ""), e.appendChild(o);
    }
    this.replaceChildren(e);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-segmented");
    t && (this.controller = tr(t));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function oa(n = customElements) {
  !n || n.get(gt) || n.define(gt, er);
}
const At = "blora-tabs", rr = /* @__PURE__ */ new Set(["ArrowLeft", "ArrowRight", "Home", "End"]), nr = /* @__PURE__ */ new Set(["ArrowUp", "ArrowDown", "Home", "End"]);
let ar = 0;
function yt(n) {
  const l = new AbortController(), { signal: t } = l, e = n.querySelector(".blora-tabs__nav");
  if (!e)
    return { select: () => {
    }, destroy: () => {
    } };
  const r = e, a = Array.from(r.querySelectorAll(".blora-tabs__tab")), i = Array.from(n.querySelectorAll(".blora-tabs__panel")), s = typeof window < "u" ? window : void 0, o = (s == null ? void 0 : s.document.createElement("span")) ?? null;
  o && (o.className = "blora-tabs__indicator", o.setAttribute("aria-hidden", "true"), r.appendChild(o)), n.setAttribute("data-tabs-enhanced", "");
  const u = n.getAttribute("data-orientation") === "vertical" ? nr : rr;
  r.setAttribute("role", "tablist"), a.forEach((v, g) => {
    v.setAttribute("role", "tab");
    const N = v.getAttribute("aria-selected") === "true";
    if (v.hasAttribute("disabled") || v.getAttribute("aria-disabled") === "true" ? (v.setAttribute("aria-disabled", "true"), v.tabIndex = -1) : v.tabIndex = N ? 0 : -1, i[g]) {
      const D = v.id || `blora-tabs-tab-${g}`, w = i[g].id || `blora-tabs-panel-${g}`;
      v.id || (v.id = D), i[g].id || (i[g].id = w), v.setAttribute("aria-controls", w), i[g].setAttribute("role", "tabpanel"), i[g].setAttribute("aria-labelledby", D);
    }
  });
  function d(v, g) {
    if (!o || !v) return;
    g ? o.setAttribute("data-instant", "") : o.removeAttribute("data-instant");
    const N = r.getBoundingClientRect(), D = v.getBoundingClientRect();
    o.style.setProperty("--blora-tab-x", `${D.left - N.left}px`), o.style.setProperty("--blora-tab-y", `${D.top - N.top}px`), o.style.setProperty("--blora-tab-w", `${D.width}px`), o.style.setProperty("--blora-tab-h", `${D.height}px`), g && s && s.requestAnimationFrame(() => {
      o.removeAttribute("data-instant");
    });
  }
  function b(v, g) {
    const N = a.indexOf(v);
    N !== -1 && (v.hasAttribute("disabled") || v.getAttribute("aria-disabled") === "true" || (a.forEach((D, w) => {
      const x = w === N;
      D.setAttribute("aria-selected", String(x)), !D.hasAttribute("disabled") && D.getAttribute("aria-disabled") !== "true" && (D.tabIndex = x ? 0 : -1);
    }), i.forEach((D, w) => {
      const x = w === N;
      D.style.display = x ? "" : "none", D.setAttribute("aria-hidden", String(!x)), x && (D.removeAttribute("data-entering"), D.offsetWidth, D.setAttribute("data-entering", ""));
    }), d(v, !1), g && v.focus()));
  }
  function p() {
    const v = a.find((g) => g.getAttribute("aria-selected") === "true");
    return v || a.find(
      (g) => !g.hasAttribute("disabled") && g.getAttribute("aria-disabled") !== "true"
    );
  }
  r.addEventListener(
    "click",
    (v) => {
      const N = v.target.closest(".blora-tabs__tab");
      !N || !r.contains(N) || b(N, !1);
    },
    { signal: t }
  ), r.addEventListener(
    "keydown",
    (v) => {
      if (!u.has(v.key)) return;
      const g = a.filter(
        (w) => !w.hasAttribute("disabled") && w.getAttribute("aria-disabled") !== "true"
      );
      if (g.length === 0) return;
      const N = g.indexOf(document.activeElement);
      let D;
      if (v.key === "Home")
        D = 0;
      else if (v.key === "End")
        D = g.length - 1;
      else {
        const w = v.key === "ArrowRight" || v.key === "ArrowDown" ? 1 : -1;
        D = (Math.max(N, 0) + w + g.length) % g.length;
      }
      v.preventDefault(), b(g[D], !0);
    },
    { signal: t }
  ), d(p(), !0);
  const h = p(), m = h ? a.indexOf(h) : 0;
  i.forEach((v, g) => {
    const N = g === m;
    v.style.display = N ? "" : "none", v.setAttribute("aria-hidden", String(!N));
  });
  let C;
  return s && typeof ResizeObserver < "u" && (C = new s.ResizeObserver(() => {
    const v = a.find((g) => g.getAttribute("aria-selected") === "true");
    d(v, !0);
  }), C.observe(r)), {
    select(v, g = !1) {
      const N = a[v];
      N && b(N, g);
    },
    destroy() {
      l.abort(), C == null || C.disconnect(), o == null || o.remove(), n.removeAttribute("data-tabs-enhanced");
    }
  };
}
class ir extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "reflecting", !1);
    y(this, "instanceId", ++ar);
  }
  static get observedAttributes() {
    return ["flush", "value", "variant", "orientation"];
  }
  attributeChangedCallback(t) {
    if (this.isConnectedInternal) {
      if (t === "value") {
        this.reflecting || this.activateFromValue();
        return;
      }
      this.sync();
    }
  }
  select(t, e = !1) {
    var r;
    (r = this.controller) == null || r.select(t, e), this.reflectValueFromIndex(t);
  }
  render() {
    var a, i;
    if (this.definitions || (this.definitions = this.readDefinitions()), !this.definitions.length && this.querySelector(".blora-tabs")) return;
    const t = this.getAttribute("value") ?? ((a = this.definitions.find((s) => s.selected)) == null ? void 0 : a.value) ?? ((i = this.definitions.find((s) => !s.disabled)) == null ? void 0 : i.value), e = document.createElement("div");
    e.className = "blora-tabs", e.dataset.bloraGenerated = "";
    const r = document.createElement("div");
    r.className = "blora-tabs__nav", e.appendChild(r), this.definitions.forEach((s, o) => {
      const c = document.createElement("button");
      c.className = "blora-tabs__tab", c.type = "button", c.id = `blora-tabs-tab-${this.instanceId}-${o}`, c.dataset.value = s.value, c.disabled = s.disabled, c.textContent = s.label, c.setAttribute("aria-selected", String(s.value === t)), r.appendChild(c);
    }), this.definitions.forEach((s, o) => {
      const c = document.createElement("div");
      c.className = "blora-tabs__panel", c.id = `blora-tabs-panel-${this.instanceId}-${o}`, c.append(...s.content), e.appendChild(c);
    }), this.replaceChildren(e), this.syncChrome(e);
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-tabs");
    t && ((e = this.controller) == null || e.destroy(), this.controller = yt(t), this.listen(t, "click", (r) => {
      var i;
      const a = (i = r.target) == null ? void 0 : i.closest(".blora-tabs__tab");
      !a || !t.contains(a) || a.disabled || this.reflectValue(a.dataset.value ?? "");
    }));
  }
  sync() {
    var e;
    const t = this.querySelector(".blora-tabs");
    t && (this.syncChrome(t), (e = this.controller) == null || e.destroy(), this.controller = yt(t));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
  readDefinitions() {
    const t = Array.from(this.children).filter((a) => a.localName === "blora-tab");
    if (t.length)
      return t.map((a) => {
        const i = a.getAttribute("label") ?? "";
        return {
          content: Array.from(a.childNodes),
          disabled: a.hasAttribute("disabled"),
          label: i,
          selected: a.hasAttribute("selected"),
          value: a.getAttribute("value") ?? i
        };
      });
    const e = Array.from(this.querySelectorAll(".blora-tabs__tab")), r = Array.from(this.querySelectorAll(".blora-tabs__panel"));
    return e.map((a, i) => {
      var s;
      return {
        content: Array.from(((s = r[i]) == null ? void 0 : s.childNodes) ?? []),
        disabled: a.disabled,
        label: a.textContent ?? "",
        selected: a.getAttribute("aria-selected") === "true",
        value: a.dataset.value ?? a.textContent ?? ""
      };
    });
  }
  syncChrome(t) {
    const e = this.getAttribute("variant"), r = this.getAttribute("orientation");
    e ? t.dataset.variant = e : delete t.dataset.variant, r ? t.dataset.orientation = r : delete t.dataset.orientation, t.toggleAttribute("data-flush", this.hasAttribute("flush"));
  }
  activateFromValue() {
    var a;
    const t = this.getAttribute("value") ?? "", r = Array.from(this.querySelectorAll(".blora-tabs__tab")).findIndex((i) => (i.dataset.value ?? "") === t);
    r >= 0 && ((a = this.controller) == null || a.select(r));
  }
  reflectValueFromIndex(t) {
    const e = this.querySelectorAll(".blora-tabs__tab")[t];
    e && this.reflectValue(e.dataset.value ?? "");
  }
  reflectValue(t) {
    (this.getAttribute("value") ?? "") !== t && (this.reflecting = !0, t ? this.setAttribute("value", t) : this.removeAttribute("value"), this.reflecting = !1, this.emit("blora-change", { value: t }));
  }
}
function la(n = customElements) {
  !n || n.get(At) || n.define(At, ir);
}
const _t = "blora-timepicker";
function sr(n) {
  const l = n.querySelector("input"), t = n.querySelector(
    ".blora-timepicker__btn, .blora-datepicker__btn"
  );
  if (!l) return { destroy: () => {
  } };
  l.type !== "time" && (l.type = "time");
  let e = 14, r = 30, a = !1, i = n.querySelector(".blora-timepicker__panel");
  i || (i = document.createElement("div"), i.className = "blora-timepicker__panel", n.appendChild(i));
  const s = (f) => String(f).padStart(2, "0"), o = () => s(e) + ":" + s(r), c = 5, u = Math.floor(c / 2), d = 36, b = [], p = () => {
    if (l.value) {
      const f = l.value.split(":");
      f.length >= 2 && (e = Math.min(23, Math.max(0, Number(f[0]) || 0)), r = Math.min(59, Math.max(0, Number(f[1]) || 0)));
    }
  }, h = (f, _) => {
    f.querySelectorAll(".blora-timepicker__item").forEach((E) => {
      const k = E, S = Number(k.dataset.val);
      k.toggleAttribute("data-selected", S === _);
    });
  }, m = (f, _, E, k = !1) => {
    const q = (u * E + (_ % E + E) % E) * d;
    k ? f.scrollTo({ top: q, behavior: "smooth" }) : f.scrollTop = q, h(f, (_ % E + E) % E);
  }, C = (f, _) => {
    const E = Math.round(f.scrollTop / d);
    return (Math.max(0, Math.min(E, c * _ - 1)) % _ + _) % _;
  }, v = (f, _, E, k) => {
    let S = !1, q = null, I = !1;
    const B = () => {
      const G = _ * d;
      G <= 0 || (f.scrollTop < G * 1.1 ? (I = !0, f.scrollTop += G, I = !1) : f.scrollTop > G * (c - 2.1) && (I = !0, f.scrollTop -= G, I = !1));
    }, R = () => {
      if (I) return;
      B();
      const G = C(f, _);
      k(G);
      const F = Math.floor((f.scrollTop + d / 2) / (_ * d)), et = (Math.min(c - 1, Math.max(0, F)) * _ + G) * d;
      Math.abs(f.scrollTop - et) > 0.5 && (I = !0, f.scrollTop = et, I = !1), h(f, G);
    }, P = () => {
      I || (S || (S = !0, requestAnimationFrame(() => {
        if (S = !1, I) return;
        B();
        const G = C(f, _);
        k(G), h(f, G);
      })), q && clearTimeout(q), q = setTimeout(R, 90));
    }, Y = (G) => {
      if ($) {
        $ = !1, G.preventDefault(), G.stopPropagation();
        return;
      }
      const F = G.target.closest(".blora-timepicker__item");
      if (!F || !f.contains(F)) return;
      G.stopPropagation();
      const tt = Number(F.dataset.val);
      k(tt);
      const et = Math.floor((f.scrollTop + d / 2) / (_ * d)), Me = (Math.min(c - 1, Math.max(0, et)) * _ + tt) * d;
      f.scrollTo({ top: Me, behavior: "smooth" }), h(f, tt);
    };
    let V = !1, $ = !1, H = 0, z = 0, W = -1;
    const U = (G) => {
      var F;
      G.pointerType === "mouse" && G.button !== 0 || (V = !0, $ = !1, H = G.clientY, z = f.scrollTop, W = G.pointerId, (F = f.setPointerCapture) == null || F.call(f, G.pointerId), f.classList.add("is-dragging"), f.style.scrollSnapType = "none");
    }, X = (G) => {
      if (!V || G.pointerId !== W) return;
      const F = G.clientY - H;
      Math.abs(F) > 3 && ($ = !0), f.scrollTop = z - F, G.preventDefault();
    }, Z = (G) => {
      var F;
      if (!(!V || G.pointerId !== W)) {
        V = !1, W = -1;
        try {
          (F = f.releasePointerCapture) == null || F.call(f, G.pointerId);
        } catch {
        }
        f.classList.remove("is-dragging"), f.style.scrollSnapType = "", R();
      }
    };
    f.addEventListener("scroll", P, { passive: !0 }), f.addEventListener("click", Y), f.addEventListener("pointerdown", U), f.addEventListener("pointermove", X), f.addEventListener("pointerup", Z), f.addEventListener("pointercancel", Z), m(f, E(), _, !1), b.push(() => {
      f.removeEventListener("scroll", P), f.removeEventListener("click", Y), f.removeEventListener("pointerdown", U), f.removeEventListener("pointermove", X), f.removeEventListener("pointerup", Z), f.removeEventListener("pointercancel", Z), q && clearTimeout(q);
    });
  }, g = (f, _, E) => {
    f.replaceChildren();
    for (let k = 0; k < c; k++)
      for (let S = 0; S < _; S++) {
        const q = document.createElement("div");
        q.className = "blora-timepicker__item", q.dataset.val = String(S), q.dataset.kind = E, q.textContent = s(S), f.appendChild(q);
      }
  }, N = () => {
    var P;
    for (; b.length; ) (P = b.pop()) == null || P();
    i.replaceChildren();
    const f = document.createElement("div");
    f.className = "blora-timepicker__wheel";
    const _ = document.createElement("div");
    _.className = "blora-timepicker__highlight", _.setAttribute("aria-hidden", "true");
    const E = document.createElement("div");
    E.className = "blora-timepicker__cols";
    const k = document.createElement("div");
    k.className = "blora-timepicker__scroll", k.setAttribute("data-scroll", "h"), k.setAttribute("role", "listbox"), k.setAttribute("aria-label", "时"), g(k, 24, "h");
    const S = document.createElement("span");
    S.className = "blora-timepicker__sep", S.textContent = ":", S.setAttribute("aria-hidden", "true");
    const q = document.createElement("div");
    q.className = "blora-timepicker__scroll", q.setAttribute("data-scroll", "m"), q.setAttribute("role", "listbox"), q.setAttribute("aria-label", "分"), g(q, 60, "m"), E.append(k, S, q), f.append(_, E), i.appendChild(f);
    const I = document.createElement("div");
    I.className = "blora-datepicker__foot";
    const B = document.createElement("button");
    B.type = "button", B.className = "blora-button", B.setAttribute("data-variant", "ghost"), B.setAttribute("data-size", "sm"), B.setAttribute("data-now", ""), B.textContent = "此刻";
    const R = document.createElement("button");
    R.type = "button", R.className = "blora-button", R.setAttribute("data-variant", "ghost"), R.setAttribute("data-size", "sm"), R.setAttribute("data-confirm", ""), R.textContent = "确定", I.append(B, R), i.appendChild(I), requestAnimationFrame(() => {
      v(
        k,
        24,
        () => e,
        (Y) => {
          e = Y;
        }
      ), v(
        q,
        60,
        () => r,
        (Y) => {
          r = Y;
        }
      );
    });
  }, D = () => {
    p(), i.setAttribute("data-open", ""), n.style.zIndex = "var(--blora-z-dropdown)", N();
  }, w = () => {
    var f;
    for (i.removeAttribute("data-open"), n.style.zIndex = ""; b.length; ) (f = b.pop()) == null || f();
  }, x = () => {
    l.value = o(), l.dispatchEvent(new Event("change", { bubbles: !0 }));
  }, A = (f) => {
    f.preventDefault(), f.stopPropagation(), i.hasAttribute("data-open") ? w() : (a = !0, D(), queueMicrotask(() => {
      a = !1;
    }));
  }, L = (f) => {
    if (!i.hasAttribute("data-open") || a) return;
    const _ = f.target;
    _ && !_.isConnected || _ && n.contains(_) || w();
  }, M = (f) => {
    f.stopPropagation();
    const _ = f.target;
    if (_.closest("[data-now]")) {
      const E = /* @__PURE__ */ new Date();
      e = E.getHours(), r = E.getMinutes(), x(), w();
      return;
    }
    _.closest("[data-confirm]") && (x(), w());
  };
  return t == null || t.addEventListener("click", A), i.addEventListener("click", M), document.addEventListener("click", L), {
    destroy() {
      var f;
      for (t == null || t.removeEventListener("click", A), i.removeEventListener("click", M), document.removeEventListener("click", L); b.length; ) (f = b.pop()) == null || f();
    }
  };
}
class or extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
  }
  static get observedAttributes() {
    return ["value", "placeholder", "name", "disabled", "required", "step"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  get value() {
    var t;
    return ((t = this.querySelector(".blora-input")) == null ? void 0 : t.value) ?? "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  focus(t) {
    var e;
    (e = this.querySelector(".blora-input")) == null || e.focus(t);
  }
  render() {
    const t = document.createElement("div");
    t.className = "blora-timepicker", t.dataset.bloraTimepicker = "", t.dataset.bloraGenerated = "";
    const e = document.createElement("input");
    e.className = "blora-input", e.type = "time", e.value = this.getAttribute("value") ?? "", e.placeholder = this.getAttribute("placeholder") ?? "HH:MM", e.disabled = this.hasAttribute("disabled"), e.required = this.hasAttribute("required"), this.hasAttribute("name") && (e.name = this.getAttribute("name") ?? ""), this.hasAttribute("step") && (e.step = this.getAttribute("step") ?? "60");
    const r = document.createElement("button");
    r.className = "blora-timepicker__btn", r.type = "button", r.tabIndex = -1, r.disabled = e.disabled, r.setAttribute("aria-label", "选择时间"), r.appendChild(O("clock")), t.append(e, r), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-input");
    if (!t) return;
    document.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value), t.placeholder = this.getAttribute("placeholder") ?? "HH:MM", t.disabled = this.hasAttribute("disabled"), t.required = this.hasAttribute("required"), this.hasAttribute("name") && (t.name = this.getAttribute("name") ?? ""), this.hasAttribute("step") && (t.step = this.getAttribute("step") ?? "60");
    const e = this.querySelector(".blora-timepicker__btn");
    e && (e.disabled = t.disabled);
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-timepicker");
    (e = this.controller) == null || e.destroy(), this.controller = t ? sr(t) : null;
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function ca(n = customElements) {
  !n || n.get(_t) || n.define(_t, or);
}
const Et = "blora-transfer";
function lr(n) {
  const l = n.querySelectorAll(".blora-transfer__panel"), t = n.querySelectorAll(".blora-transfer__action, [data-transfer]");
  if (l.length < 2 || t.length === 0) return { destroy: () => {
  } };
  const e = l[0], r = l[1], a = e.querySelector(".blora-transfer__list"), i = r.querySelector(".blora-transfer__list"), s = () => {
    const u = e.querySelector(".blora-transfer__head"), d = r.querySelector(".blora-transfer__head");
    if (u) {
      const b = (a == null ? void 0 : a.querySelectorAll(".blora-transfer__row").length) ?? 0;
      u.textContent = `候选 · ${b}`;
    }
    if (d) {
      const b = (i == null ? void 0 : i.querySelectorAll(".blora-transfer__row").length) ?? 0;
      d.textContent = `已选 · ${b}`;
    }
  }, o = (u) => {
    u === "right" || u === "to-right" ? Array.from(
      (a == null ? void 0 : a.querySelectorAll(".blora-transfer__row input:checked")) ?? []
    ).forEach((b) => {
      const p = b.closest(".blora-transfer__row");
      p && i && (b.checked = !1, i.appendChild(p));
    }) : Array.from(
      (i == null ? void 0 : i.querySelectorAll(".blora-transfer__row input:checked")) ?? []
    ).forEach((b) => {
      const p = b.closest(".blora-transfer__row");
      p && a && (b.checked = !1, a.appendChild(p));
    }), s();
  }, c = (u) => {
    const d = u.target.closest("[data-transfer]");
    d && (u.preventDefault(), o(d.dataset.transfer ?? "right"));
  };
  return n.addEventListener("click", c), {
    destroy() {
      n.removeEventListener("click", c);
    }
  };
}
class cr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
  }
  static get observedAttributes() {
    return ["source-label", "target-label", "disabled"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  get selectedValues() {
    var e;
    const t = this.querySelectorAll(".blora-transfer__panel");
    return Array.from(((e = t[1]) == null ? void 0 : e.querySelectorAll("input[data-value]")) ?? []).map(
      (r) => r.dataset.value ?? r.value
    );
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.querySelectorAll("blora-transfer-item")).map(
      (c) => {
        var u, d;
        return {
          checked: c.hasAttribute("checked"),
          disabled: c.hasAttribute("disabled"),
          label: c.getAttribute("label") ?? ((u = c.textContent) == null ? void 0 : u.trim()) ?? "",
          target: c.hasAttribute("target"),
          value: c.getAttribute("value") ?? ((d = c.textContent) == null ? void 0 : d.trim()) ?? ""
        };
      }
    ));
    const t = this.definitions.filter((c) => !c.target), e = this.definitions.filter((c) => c.target), r = document.createElement("div");
    r.className = "blora-transfer", r.dataset.bloraGenerated = "";
    const a = (c, u) => {
      const d = document.createElement("div");
      d.className = "blora-transfer__panel";
      const b = document.createElement("div");
      b.className = "blora-transfer__head", b.textContent = `${c} · ${u.length}`;
      const p = document.createElement("div");
      p.className = "blora-transfer__list";
      for (const h of u) {
        const m = document.createElement("label");
        m.className = "blora-transfer__row";
        const C = document.createElement("input");
        C.type = "checkbox", C.value = h.value, C.dataset.value = h.value, C.checked = h.checked, C.disabled = h.disabled || this.hasAttribute("disabled");
        const v = document.createElement("span");
        v.className = "blora-transfer__check";
        const g = document.createElement("span");
        g.textContent = h.label, m.append(C, v, g), p.appendChild(m);
      }
      return d.append(b, p), d;
    }, i = document.createElement("div");
    i.className = "blora-transfer__actions";
    const s = document.createElement("button");
    s.className = "blora-button", s.dataset.variant = "outline", s.dataset.size = "icon", s.dataset.transfer = "right", s.type = "button", s.disabled = this.hasAttribute("disabled"), s.setAttribute("aria-label", "右移"), s.appendChild(O("chevron-right", 18, this.ownerDocument));
    const o = document.createElement("button");
    o.className = "blora-button", o.dataset.variant = "outline", o.dataset.size = "icon", o.dataset.transfer = "left", o.type = "button", o.disabled = this.hasAttribute("disabled"), o.setAttribute("aria-label", "左移"), o.appendChild(O("chevron-left", 18, this.ownerDocument)), i.append(s, o), r.append(
      a(this.getAttribute("source-label") ?? "候选", t),
      i,
      a(this.getAttribute("target-label") ?? "已选", e)
    ), this.replaceChildren(r);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-transfer");
    t && (this.controller = lr(t));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function ua(n = customElements) {
  !n || n.get(Et) || n.define(Et, cr);
}
const Ct = "blora-statistic";
class ur extends T {
  constructor() {
    super(...arguments);
    y(this, "initialValue", null);
  }
  static get observedAttributes() {
    return ["label", "value", "suffix", "trend", "direction"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  get value() {
    return this.getAttribute("value") ?? "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  render() {
    var o;
    this.initialValue === null && (this.initialValue = ((o = this.textContent) == null ? void 0 : o.trim()) ?? "");
    const t = this.ownerDocument, e = t.createElement("div");
    e.className = "blora-stat", e.dataset.bloraGenerated = "";
    const r = this.getAttribute("label");
    if (r) {
      const c = t.createElement("div");
      c.className = "blora-stat__label", c.textContent = r, e.appendChild(c);
    }
    const a = t.createElement("div");
    a.className = "blora-stat__value", a.textContent = this.getAttribute("value") ?? this.initialValue;
    const i = this.getAttribute("suffix");
    if (i) {
      const c = t.createElement("span");
      c.className = "blora-stat__suffix", c.textContent = i, a.appendChild(c);
    }
    e.appendChild(a);
    const s = this.getAttribute("trend");
    if (s) {
      const c = t.createElement("div");
      c.className = "blora-stat__trend", c.textContent = s;
      const u = this.getAttribute("direction");
      (u === "up" || u === "down") && (c.dataset.direction = u), e.appendChild(c);
    }
    this.replaceChildren(e);
  }
  sync() {
    const t = this.querySelector(".blora-stat");
    if (!t) {
      this.render();
      return;
    }
    const e = this.getAttribute("label");
    let r = t.querySelector(".blora-stat__label");
    e ? (r || (r = this.ownerDocument.createElement("div"), r.className = "blora-stat__label", t.prepend(r)), r.textContent = e) : r == null || r.remove();
    const a = t.querySelector(".blora-stat__value");
    if (a) {
      const o = this.getAttribute("suffix");
      if (a.textContent = this.getAttribute("value") ?? this.initialValue ?? "", o) {
        const c = this.ownerDocument.createElement("span");
        c.className = "blora-stat__suffix", c.textContent = o, a.appendChild(c);
      }
    }
    const i = this.getAttribute("trend");
    let s = t.querySelector(".blora-stat__trend");
    if (i) {
      s || (s = this.ownerDocument.createElement("div"), s.className = "blora-stat__trend", t.appendChild(s)), s.textContent = i;
      const o = this.getAttribute("direction");
      o === "up" || o === "down" ? s.dataset.direction = o : delete s.dataset.direction;
    } else
      s == null || s.remove();
  }
  bindEvents() {
  }
}
function da(n = customElements) {
  !n || n.get(Ct) || n.define(Ct, ur);
}
const wt = "blora-steps";
function dr(n) {
  if (typeof document > "u")
    return { setCurrent: () => {
    }, getCurrent: () => 0, destroy: () => {
    } };
  n.classList.add("blora-steps");
  const l = () => Array.from(n.querySelectorAll(".blora-step, [data-blora-step]")), t = () => {
    const i = l().findIndex(
      (s) => s.hasAttribute("data-current") || s.getAttribute("data-state") === "active" || s.getAttribute("data-status") === "process"
    );
    return i >= 0 ? i : 0;
  }, e = (a) => {
    l().forEach((s, o) => {
      s.removeAttribute("data-current"), s.removeAttribute("data-status"), o < a ? s.setAttribute("data-state", "done") : o === a ? (s.setAttribute("data-state", "active"), s.setAttribute("data-current", "")) : s.setAttribute("data-state", "pending"), o === a ? s.setAttribute("aria-current", "step") : s.removeAttribute("aria-current");
    }), n.dispatchEvent(new CustomEvent("blora-steps-change", { bubbles: !0, detail: { index: a } }));
  }, r = (a) => {
    if (n.getAttribute("data-clickable") === "false") return;
    const i = a.target.closest(".blora-step, [data-blora-step]");
    if (!i || !n.contains(i)) return;
    const o = l().indexOf(i);
    o >= 0 && e(o);
  };
  return n.addEventListener("click", r), e(t()), {
    setCurrent: e,
    getCurrent: t,
    destroy() {
      n.removeEventListener("click", r);
    }
  };
}
class br extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
  }
  static get observedAttributes() {
    return ["current", "clickable"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  get current() {
    var t;
    return ((t = this.controller) == null ? void 0 : t.getCurrent()) ?? Number(this.getAttribute("current") ?? 0);
  }
  set current(t) {
    this.setAttribute("current", String(t));
  }
  setCurrent(t) {
    this.current = t;
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((i) => i.localName === "blora-step").map((i) => {
      var c;
      const s = i.getAttribute("state"), o = s === "pending" || s === "active" || s === "done" ? s : null;
      return {
        description: i.getAttribute("description") ?? "",
        icon: i.getAttribute("icon") ?? "",
        state: o,
        title: i.getAttribute("title") ?? ((c = i.textContent) == null ? void 0 : c.trim()) ?? ""
      };
    }));
    const t = this.getAttribute("current"), e = this.definitions.findIndex((i) => i.state === "active"), r = t === null ? Math.max(0, e) : Number(t), a = this.ownerDocument.createElement("div");
    a.className = "blora-steps", a.dataset.bloraGenerated = "", a.dataset.clickable = String(this.getAttribute("clickable") !== "false"), this.definitions.forEach((i, s) => {
      const o = this.ownerDocument.createElement("div");
      o.className = "blora-step";
      const c = this.ownerDocument.createElement("div");
      c.className = "blora-step__head";
      const u = this.ownerDocument.createElement("span");
      u.className = "blora-step__icon", s < r && !i.icon ? u.appendChild(O("check", 16, this.ownerDocument)) : u.textContent = i.icon || String(s + 1);
      const d = this.ownerDocument.createElement("div");
      d.className = "blora-step__line", d.setAttribute("aria-hidden", "true"), c.append(u, d);
      const b = this.ownerDocument.createElement("div");
      if (b.className = "blora-step__title", b.textContent = i.title, o.append(c, b), i.description) {
        const p = this.ownerDocument.createElement("div");
        p.className = "blora-step__desc", p.textContent = i.description, o.appendChild(p);
      }
      s < r ? o.dataset.state = "done" : s === r ? o.dataset.state = "active" : o.dataset.state = "pending", a.appendChild(o);
    }), this.replaceChildren(a);
  }
  sync() {
    var r;
    const t = Number(this.getAttribute("current") ?? 0);
    (r = this.controller) == null || r.setCurrent(t);
    const e = this.querySelector(".blora-steps");
    e && (e.dataset.clickable = String(this.getAttribute("clickable") !== "false"));
  }
  bindEvents() {
    const t = this.querySelector(".blora-steps");
    t && (this.controller = dr(t), this.listen(t, "blora-steps-change", (e) => {
      const r = e.detail.index;
      this.getAttribute("current") !== String(r) && this.setAttribute("current", String(r));
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function ba(n = customElements) {
  !n || n.get(wt) || n.define(wt, br);
}
const xt = "blora-radio";
class hr extends T {
  constructor() {
    super(...arguments);
    y(this, "initialLabel", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["name", "value", "checked", "disabled", "required", "label"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get checked() {
    var t;
    return ((t = this.querySelector('input[type="radio"]')) == null ? void 0 : t.checked) ?? !1;
  }
  set checked(t) {
    this.toggleAttribute("checked", t);
  }
  get value() {
    return this.getAttribute("value") ?? "on";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  focus(t) {
    var e;
    (e = this.querySelector('input[type="radio"]')) == null || e.focus(t);
  }
  render() {
    var i;
    this.initialLabel === null && (this.initialLabel = ((i = this.textContent) == null ? void 0 : i.trim()) ?? "");
    const t = this.ownerDocument, e = t.createElement("label");
    e.className = "blora-radio", e.dataset.bloraGenerated = "";
    const r = t.createElement("input");
    r.type = "radio", r.name = this.getAttribute("name") ?? "", r.value = this.value, r.checked = this.hasAttribute("checked"), r.disabled = this.hasAttribute("disabled"), r.required = this.hasAttribute("required");
    const a = t.createElement("span");
    a.className = "blora-radio__dot", a.setAttribute("aria-hidden", "true"), e.append(r, a, t.createTextNode(this.getAttribute("label") ?? this.initialLabel)), this.replaceChildren(e);
  }
  sync() {
    const t = this.querySelector('input[type="radio"]');
    if (!t) return;
    t.name = this.getAttribute("name") ?? "", t.value = this.value, t.checked = this.hasAttribute("checked"), t.disabled = this.hasAttribute("disabled"), t.required = this.hasAttribute("required");
    const e = this.querySelector(".blora-radio");
    if (e) {
      const r = e.lastChild;
      (r == null ? void 0 : r.nodeType) === Node.TEXT_NODE && (r.textContent = this.getAttribute("label") ?? this.initialLabel ?? "");
    }
  }
  bindEvents() {
    const t = this.querySelector('input[type="radio"]');
    t && this.listen(t, "change", () => {
      if (t.checked && t.name)
        for (const e of this.ownerDocument.querySelectorAll(
          'blora-radio input[type="radio"]'
        )) {
          if (e === t || e.name !== t.name || e.form !== t.form) continue;
          const r = e.closest("blora-radio");
          r != null && r.hasAttribute("checked") && r.removeAttribute("checked");
        }
      this.reflecting = !0, this.toggleAttribute("checked", t.checked), this.reflecting = !1;
    });
  }
}
function ha(n = customElements) {
  !n || n.get(xt) || n.define(xt, hr);
}
const kt = "blora-switch";
class pr extends T {
  constructor() {
    super(...arguments);
    y(this, "initialLabel", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["name", "value", "checked", "disabled", "required", "label", "size"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get checked() {
    var t;
    return ((t = this.querySelector('input[type="checkbox"]')) == null ? void 0 : t.checked) ?? !1;
  }
  set checked(t) {
    this.toggleAttribute("checked", t);
  }
  get value() {
    return this.getAttribute("value") ?? "on";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  focus(t) {
    var e;
    (e = this.querySelector('input[type="checkbox"]')) == null || e.focus(t);
  }
  render() {
    var s;
    this.initialLabel === null && (this.initialLabel = ((s = this.textContent) == null ? void 0 : s.trim()) ?? "");
    const t = this.ownerDocument, e = t.createElement("label");
    e.className = "blora-switch", e.dataset.bloraGenerated = "";
    const r = this.getAttribute("size");
    (r === "sm" || r === "lg") && (e.dataset.size = r);
    const a = t.createElement("input");
    a.type = "checkbox", a.name = this.getAttribute("name") ?? "", a.value = this.value, a.checked = this.hasAttribute("checked"), a.disabled = this.hasAttribute("disabled"), a.required = this.hasAttribute("required");
    const i = t.createElement("span");
    i.className = "blora-switch__track", i.setAttribute("aria-hidden", "true"), e.append(a, i, t.createTextNode(this.getAttribute("label") ?? this.initialLabel)), this.replaceChildren(e);
  }
  sync() {
    const t = this.querySelector('input[type="checkbox"]'), e = this.querySelector(".blora-switch");
    if (!t || !e) return;
    const r = this.getAttribute("size");
    r === "sm" || r === "lg" ? e.dataset.size = r : delete e.dataset.size, t.name = this.getAttribute("name") ?? "", t.value = this.value, t.checked = this.hasAttribute("checked"), t.disabled = this.hasAttribute("disabled"), t.required = this.hasAttribute("required");
    const a = e.lastChild;
    (a == null ? void 0 : a.nodeType) === Node.TEXT_NODE && (a.textContent = this.getAttribute("label") ?? this.initialLabel ?? "");
  }
  bindEvents() {
    const t = this.querySelector('input[type="checkbox"]');
    t && this.listen(t, "change", () => {
      this.reflecting = !0, this.toggleAttribute("checked", t.checked), this.reflecting = !1;
    });
  }
}
function pa(n = customElements) {
  !n || n.get(kt) || n.define(kt, pr);
}
const St = "blora-slider";
function mr(n) {
  const l = n.querySelector(".blora-slider__input, input[type='range']"), t = n.querySelector(".blora-slider__value");
  if (!l) return { destroy: () => {
  } };
  const e = n.hasAttribute("data-tooltip") || n.dataset.tooltip === "true";
  let r = null;
  e && (r = n.querySelector(".blora-slider__tip"), r || (r = document.createElement("span"), r.className = "blora-slider__tip", r.setAttribute("aria-hidden", "true"), n.appendChild(r)));
  const a = () => {
    const o = Number(l.value), c = Number(l.min) || 0, u = Number(l.max) || 100, d = (o - c) / (u - c) * 100;
    n.style.setProperty("--blora-slider-fill", `${d}%`), t && (t.textContent = String(o)), r && (r.textContent = String(o), r.style.left = `${d}%`);
  }, i = () => {
    r && r.setAttribute("data-show", "");
  }, s = () => {
    r && r.removeAttribute("data-show");
  };
  return l.addEventListener("input", a), e && (l.addEventListener("pointerdown", i), l.addEventListener("pointerup", s), l.addEventListener("focus", i), l.addEventListener("blur", s)), a(), {
    destroy() {
      l.removeEventListener("input", a), e && (l.removeEventListener("pointerdown", i), l.removeEventListener("pointerup", s), l.removeEventListener("focus", i), l.removeEventListener("blur", s));
    }
  };
}
class fr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["min", "max", "step", "value", "name", "disabled", "tooltip", "hide-value"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get value() {
    var t;
    return Number(((t = this.querySelector('input[type="range"]')) == null ? void 0 : t.value) ?? 0);
  }
  set value(t) {
    this.setAttribute("value", String(t));
  }
  focus(t) {
    var e;
    (e = this.querySelector('input[type="range"]')) == null || e.focus(t);
  }
  render() {
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-slider", t.dataset.bloraGenerated = "", this.hasAttribute("tooltip") && (t.dataset.tooltip = "true");
    const e = this.ownerDocument.createElement("input");
    if (e.className = "blora-slider__input", e.type = "range", e.min = this.getAttribute("min") ?? "0", e.max = this.getAttribute("max") ?? "100", e.step = this.getAttribute("step") ?? "1", e.value = this.getAttribute("value") ?? e.min, e.name = this.getAttribute("name") ?? "", e.disabled = this.hasAttribute("disabled"), t.appendChild(e), !this.hasAttribute("hide-value")) {
      const r = this.ownerDocument.createElement("output");
      r.className = "blora-slider__value", r.textContent = e.value, t.appendChild(r);
    }
    this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-slider"), e = t == null ? void 0 : t.querySelector('input[type="range"]');
    if (!t || !e) return;
    const r = this.hasAttribute("hide-value"), a = t.querySelector("output");
    if (r !== !a) {
      this.render(), this.rebind();
      return;
    }
    this.hasAttribute("tooltip") ? t.dataset.tooltip = "true" : delete t.dataset.tooltip, e.min = this.getAttribute("min") ?? "0", e.max = this.getAttribute("max") ?? "100", e.step = this.getAttribute("step") ?? "1", document.activeElement !== e && (e.value = this.getAttribute("value") ?? e.value), e.name = this.getAttribute("name") ?? "", e.disabled = this.hasAttribute("disabled"), a && (a.textContent = e.value);
  }
  bindEvents() {
    var r;
    const t = this.querySelector(".blora-slider"), e = t == null ? void 0 : t.querySelector('input[type="range"]');
    !t || !e || ((r = this.controller) == null || r.destroy(), this.controller = mr(t), this.listen(e, "input", () => {
      this.reflecting = !0, this.setAttribute("value", e.value), this.reflecting = !1;
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function ma(n = customElements) {
  !n || n.get(St) || n.define(St, fr);
}
const Nt = "blora-rate";
function vr(n) {
  const l = Array.from(n.querySelectorAll(".blora-rate__star"));
  if (l.length === 0) return { destroy: () => {
  } };
  const t = n.hasAttribute("data-readonly");
  let e = Number(n.dataset.value ?? 0);
  const r = (c) => {
    const u = c ?? e;
    l.forEach((d, b) => {
      b < u ? d.setAttribute("data-active", "") : d.removeAttribute("data-active");
    });
  };
  if (t)
    return r(null), { destroy: () => {
    } };
  const a = (c) => {
    const u = c.target;
    if (!(u instanceof Element)) return null;
    const d = u.closest(".blora-rate__star");
    return d && l.includes(d) ? d : null;
  }, i = (c) => {
    const u = a(c);
    u && r(l.indexOf(u) + 1);
  }, s = () => r(null), o = (c) => {
    const u = a(c);
    u && (e = l.indexOf(u) + 1, n.dataset.value = String(e), r(null));
  };
  return n.addEventListener("mouseover", i), n.addEventListener("mouseleave", s), n.addEventListener("click", o), r(null), {
    destroy() {
      n.removeEventListener("mouseover", i), n.removeEventListener("mouseleave", s), n.removeEventListener("click", o);
    }
  };
}
class gr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["value", "max", "readonly", "label"];
  }
  attributeChangedCallback(t) {
    if (!(!this.isConnectedInternal || this.reflecting)) {
      if (t === "max") {
        this.render(), this.rebind();
        return;
      }
      this.sync();
    }
  }
  get value() {
    var t;
    return Number(((t = this.querySelector(".blora-rate")) == null ? void 0 : t.dataset.value) ?? 0);
  }
  set value(t) {
    this.setAttribute("value", String(t));
  }
  render() {
    const t = Math.max(1, Number(this.getAttribute("max") ?? 5)), e = Math.min(t, Math.max(0, Number(this.getAttribute("value") ?? 0))), r = this.ownerDocument.createElement("div");
    r.className = "blora-rate", r.dataset.bloraGenerated = "", r.dataset.value = String(e), r.setAttribute("role", "radiogroup"), r.setAttribute("aria-label", this.getAttribute("label") ?? "Rating"), this.hasAttribute("readonly") && (r.dataset.readonly = "");
    for (let a = 1; a <= t; a += 1) {
      const i = this.ownerDocument.createElement("span");
      i.className = "blora-rate__star", i.appendChild(O("star", 20, this.ownerDocument)), i.dataset.value = String(a), i.setAttribute("role", "radio"), i.setAttribute("aria-checked", String(a === e)), i.setAttribute("aria-label", `${a} of ${t}`), i.tabIndex = this.hasAttribute("readonly") ? -1 : a === Math.max(1, e) ? 0 : -1, a <= e && (i.dataset.active = ""), r.appendChild(i);
    }
    this.replaceChildren(r);
  }
  sync() {
    const t = this.querySelector(".blora-rate");
    if (!t) return;
    const e = Math.max(1, Number(this.getAttribute("max") ?? 5)), r = Math.min(e, Math.max(0, Number(this.getAttribute("value") ?? 0)));
    t.dataset.value = String(r), t.setAttribute("aria-label", this.getAttribute("label") ?? "Rating"), t.toggleAttribute("data-readonly", this.hasAttribute("readonly")), t.querySelectorAll(".blora-rate__star").forEach((a, i) => {
      const s = i + 1;
      a.setAttribute("aria-checked", String(s === r)), a.tabIndex = this.hasAttribute("readonly") ? -1 : s === Math.max(1, r) ? 0 : -1, a.toggleAttribute("data-active", s <= r);
    });
  }
  bindEvents() {
    var r;
    const t = this.querySelector(".blora-rate");
    if (!t) return;
    (r = this.controller) == null || r.destroy(), this.controller = vr(t);
    const e = (a) => {
      if (this.hasAttribute("readonly")) return;
      a.click();
      const i = t.dataset.value ?? "0";
      this.reflecting = !0, this.setAttribute("value", i), this.reflecting = !1, t.querySelectorAll(".blora-rate__star").forEach((s) => {
        const o = s === a;
        s.setAttribute("aria-checked", String(o)), s.tabIndex = o ? 0 : -1;
      }), this.emit("blora-change", { value: Number(i) });
    };
    this.listen(t, "click", (a) => {
      const i = a.target.closest(".blora-rate__star");
      if (!i || !t.contains(i)) return;
      const s = t.dataset.value ?? "0";
      this.reflecting = !0, this.setAttribute("value", s), this.reflecting = !1, t.querySelectorAll(".blora-rate__star").forEach((o) => {
        const c = o === i;
        o.setAttribute("aria-checked", String(c)), o.tabIndex = c ? 0 : -1;
      }), this.emit("blora-change", { value: Number(s) });
    }), this.listen(t, "keydown", (a) => {
      const i = a, s = i.target.closest(".blora-rate__star");
      !s || i.key !== "Enter" && i.key !== " " || (i.preventDefault(), e(s));
    });
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function fa(n = customElements) {
  !n || n.get(Nt) || n.define(Nt, gr);
}
const Dt = "blora-otp";
function Ar(n) {
  const l = Array.from(n.querySelectorAll(".blora-otp__input"));
  if (l.length === 0) return { destroy: () => {
  } };
  const t = n.dataset.mode ?? "any", e = n.hasAttribute("data-uppercase"), r = (o) => (e && (o = o.toUpperCase()), t === "numeric" ? /[0-9]/.test(o) ? o : "" : t === "alphanumeric" ? /[a-zA-Z0-9]/.test(o) ? o : "" : o), a = (o) => {
    const c = o.target, u = r(c.value);
    if (c.value = u.slice(-1), c.value) {
      const d = l.indexOf(c);
      d < l.length - 1 && l[d + 1].focus();
    }
  }, i = (o) => {
    const c = o.target, u = l.indexOf(c);
    o.key === "Backspace" && !c.value && u > 0 ? (o.preventDefault(), l[u - 1].focus(), l[u - 1].value = "") : o.key === "ArrowLeft" && u > 0 ? (o.preventDefault(), l[u - 1].focus()) : o.key === "ArrowRight" && u < l.length - 1 && (o.preventDefault(), l[u + 1].focus());
  }, s = (o) => {
    var p;
    o.preventDefault();
    const u = (((p = o.clipboardData) == null ? void 0 : p.getData("text")) ?? "").split("").map(r).filter(Boolean), d = l.indexOf(o.target);
    u.forEach((h, m) => {
      d + m < l.length && (l[d + m].value = h);
    });
    const b = Math.min(d + u.length, l.length - 1);
    l[b].focus();
  };
  return l.forEach((o) => {
    o.addEventListener("input", a), o.addEventListener("keydown", i), o.addEventListener("paste", s);
  }), {
    destroy() {
      l.forEach((o) => {
        o.removeEventListener("input", a), o.removeEventListener("keydown", i), o.removeEventListener("paste", s);
      });
    }
  };
}
class yr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["length", "mode", "uppercase", "value", "disabled", "label"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get value() {
    return Array.from(this.querySelectorAll(".blora-otp__input")).map((t) => t.value).join("");
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  focus(t) {
    var e;
    (e = this.querySelector(".blora-otp__input")) == null || e.focus(t);
  }
  render() {
    const t = Math.max(1, Number(this.getAttribute("length") ?? 6)), e = Array.from(this.getAttribute("value") ?? ""), r = this.ownerDocument.createElement("div");
    r.className = "blora-otp", r.dataset.bloraGenerated = "", r.dataset.mode = this.getAttribute("mode") ?? "numeric", r.setAttribute("role", "group"), r.setAttribute("aria-label", this.getAttribute("label") ?? "One-time password"), this.hasAttribute("uppercase") && (r.dataset.uppercase = "");
    for (let a = 0; a < t; a += 1) {
      const i = this.ownerDocument.createElement("input");
      i.className = "blora-otp__input", i.type = "text", i.maxLength = 1, i.inputMode = r.dataset.mode === "numeric" ? "numeric" : "text", i.autocomplete = a === 0 ? "one-time-code" : "off", i.disabled = this.hasAttribute("disabled"), i.value = e[a] ?? "", i.setAttribute("aria-label", `Character ${a + 1} of ${t}`), r.appendChild(i);
    }
    this.replaceChildren(r);
  }
  sync() {
    const t = this.querySelector(".blora-otp"), e = [...this.querySelectorAll(".blora-otp__input")], r = Math.max(1, Number(this.getAttribute("length") ?? 6));
    if (!t || e.length !== r) {
      this.render(), this.rebind();
      return;
    }
    t.dataset.mode = this.getAttribute("mode") ?? "numeric", t.toggleAttribute("data-uppercase", this.hasAttribute("uppercase")), t.setAttribute("aria-label", this.getAttribute("label") ?? "One-time password");
    const a = Array.from(this.getAttribute("value") ?? "");
    e.forEach((i, s) => {
      i.disabled = this.hasAttribute("disabled"), this.ownerDocument.activeElement !== i && (i.value = a[s] ?? "");
    });
  }
  bindEvents() {
    const t = this.querySelector(".blora-otp");
    t && (this.controller = Ar(t), this.listen(t, "input", () => {
      this.reflecting = !0, this.setAttribute("value", this.value), this.reflecting = !1, this.emit("blora-change", {
        value: this.value,
        complete: this.value.length === t.children.length
      });
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function va(n = customElements) {
  !n || n.get(Dt) || n.define(Dt, yr);
}
const Lt = "blora-tags-input";
function _r(n) {
  const l = n.ownerDocument, t = n.querySelector("input");
  if (!t) return { destroy: () => {
  } };
  const e = (i) => {
    const s = i.trim();
    if (!s) return;
    const o = l.createElement("span");
    o.className = "blora-tag", o.setAttribute("data-variant", "primary"), o.appendChild(l.createTextNode(s));
    const c = l.createElement("button");
    c.type = "button", c.className = "blora-tag__close", c.setAttribute("aria-label", "移除"), o.appendChild(c), n.insertBefore(o, t), t.value = "";
  }, r = (i) => {
    var o;
    const s = i.target.closest(".blora-tag__close");
    s && n.contains(s) && ((o = s.closest(".blora-tag")) == null || o.remove());
  }, a = (i) => {
    if (i.key === "Enter" || i.key === ",")
      i.preventDefault(), e(t.value);
    else if (i.key === "Backspace" && !t.value) {
      const s = t.previousElementSibling;
      s != null && s.classList.contains("blora-tag") && s.remove();
    }
  };
  return t.addEventListener("keydown", a), n.addEventListener("click", r), {
    destroy() {
      t.removeEventListener("keydown", a), n.removeEventListener("click", r);
    }
  };
}
class Er extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["values", "placeholder", "disabled", "label"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get values() {
    return Array.from(
      this.querySelectorAll(".blora-tag"),
      (t) => {
        var e;
        return (((e = t.firstChild) == null ? void 0 : e.textContent) ?? "").trim();
      }
    ).filter(Boolean);
  }
  set values(t) {
    this.setAttribute("values", t.join(","));
  }
  focus(t) {
    var e;
    (e = this.querySelector("input")) == null || e.focus(t);
  }
  render() {
    const t = (this.getAttribute("values") ?? "").split(",").map((a) => a.trim()).filter(Boolean), e = this.ownerDocument.createElement("div");
    e.className = "blora-tags-input", e.dataset.bloraGenerated = "", e.setAttribute("role", "group"), e.setAttribute("aria-label", this.getAttribute("label") ?? "Tags");
    for (const a of t) {
      const i = this.ownerDocument.createElement("span");
      i.className = "blora-tag", i.dataset.variant = "primary", i.appendChild(this.ownerDocument.createTextNode(a));
      const s = this.ownerDocument.createElement("button");
      s.type = "button", s.className = "blora-tag__close", s.setAttribute("aria-label", `Remove ${a}`), s.disabled = this.hasAttribute("disabled"), i.appendChild(s), e.appendChild(i);
    }
    const r = this.ownerDocument.createElement("input");
    r.type = "text", r.placeholder = this.getAttribute("placeholder") ?? "", r.disabled = this.hasAttribute("disabled"), e.appendChild(r), this.replaceChildren(e);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-tags-input");
    if (!t) return;
    this.controller = _r(t);
    const e = () => {
      const r = this.values;
      this.reflecting = !0, this.setAttribute("values", r.join(",")), this.reflecting = !1, this.emit("blora-change", { values: r });
    };
    this.listen(t, "keydown", (r) => {
      const a = r;
      (a.key === "Enter" || a.key === "," || a.key === "Backspace") && queueMicrotask(e);
    }), this.listen(t, "click", (r) => {
      r.target.closest(".blora-tag__close") && queueMicrotask(e);
    });
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function ga(n = customElements) {
  !n || n.get(Lt) || n.define(Lt, Er);
}
const qt = "blora-checkbox";
function Cr(n) {
  const l = n.querySelector(
    "[data-blora-checkall], .blora-checkbox__input[data-blora-checkall]"
  );
  if (!l) return { destroy: () => {
  } };
  const t = () => Array.from(
    n.querySelectorAll('input[type="checkbox"]:not([data-blora-checkall])')
  ), e = () => {
    const i = t(), s = i.filter((o) => o.checked).length;
    l.checked = i.length > 0 && s === i.length, l.indeterminate = s > 0 && s < i.length;
  }, r = () => {
    t().forEach((i) => {
      i.disabled || (i.checked = l.checked);
    }), l.indeterminate = !1;
  }, a = (i) => {
    i.target !== l && e();
  };
  return l.addEventListener("change", r), n.addEventListener("change", a), e(), {
    destroy() {
      l.removeEventListener("change", r), n.removeEventListener("change", a);
    }
  };
}
class wr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "initialLabel", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["name", "value", "checked", "disabled", "required", "label"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get checked() {
    var t;
    return ((t = this.querySelector('input[type="checkbox"]')) == null ? void 0 : t.checked) ?? !1;
  }
  set checked(t) {
    this.toggleAttribute("checked", t);
  }
  get values() {
    return Array.from(
      this.querySelectorAll(
        'input[type="checkbox"]:checked:not([data-blora-checkall])'
      ),
      (t) => t.value
    );
  }
  focus(t) {
    var e;
    (e = this.querySelector('input[type="checkbox"]')) == null || e.focus(t);
  }
  render() {
    var t;
    if (this.initialLabel === null && (this.initialLabel = ((t = this.textContent) == null ? void 0 : t.trim()) ?? ""), !this.definitions) {
      const e = Array.from(this.children).filter(
        (r) => r.localName === "blora-checkbox-option"
      );
      e.length && (this.definitions = e.map((r) => {
        var a, i;
        return {
          checked: r.hasAttribute("checked"),
          checkAll: r.hasAttribute("check-all"),
          disabled: r.hasAttribute("disabled"),
          label: r.getAttribute("label") ?? ((a = r.textContent) == null ? void 0 : a.trim()) ?? "",
          value: r.getAttribute("value") ?? ((i = r.textContent) == null ? void 0 : i.trim()) ?? "on"
        };
      }));
    }
    if (this.definitions) {
      const e = this.ownerDocument.createElement("div");
      e.className = "blora-stack", e.dataset.bloraGenerated = "", e.setAttribute("role", "group"), this.getAttribute("label") && e.setAttribute("aria-label", this.getAttribute("label")), this.definitions.forEach(
        (r) => e.appendChild(this.createCheckbox(r, this.getAttribute("name") ?? ""))
      ), this.replaceChildren(e), this.dataset.group = "";
      return;
    }
    this.removeAttribute("data-group"), this.replaceChildren(
      this.createCheckbox(
        {
          checked: this.hasAttribute("checked"),
          checkAll: !1,
          disabled: this.hasAttribute("disabled"),
          label: this.getAttribute("label") ?? this.initialLabel,
          value: this.getAttribute("value") ?? "on"
        },
        this.getAttribute("name") ?? ""
      )
    );
  }
  sync() {
    this.captureLiveState();
    const t = Array.from(this.querySelectorAll('input[type="checkbox"]'));
    if (!t.length) return;
    const e = this.getAttribute("name") ?? "", r = this.hasAttribute("required");
    if (this.definitions) {
      t.forEach((o, c) => {
        const u = this.definitions[c];
        u && (o.name = e, o.required = r, o.disabled = u.disabled);
      });
      const s = this.querySelector("[role='group']");
      s && (this.getAttribute("label") ? s.setAttribute("aria-label", this.getAttribute("label")) : s.removeAttribute("aria-label"));
      return;
    }
    const a = t[0];
    a.name = e, a.value = this.getAttribute("value") ?? "on", a.checked = this.hasAttribute("checked"), a.disabled = this.hasAttribute("disabled"), a.required = r;
    const i = this.querySelector(".blora-checkbox");
    if (i) {
      const s = this.getAttribute("label") ?? this.initialLabel ?? "", o = i.lastChild;
      (o == null ? void 0 : o.nodeType) === Node.TEXT_NODE && (o.textContent = s);
    }
  }
  bindEvents() {
    var r;
    const t = this.querySelector("[data-blora-generated]");
    if (!t) return;
    (r = this.controller) == null || r.destroy(), this.controller = Cr(t);
    const e = (a) => {
      this.definitions || (this.reflecting = !0, this.toggleAttribute("checked", a.checked), this.reflecting = !1), this.syncIndeterminate(t);
    };
    this.listen(t, "change", (a) => e(a.target)), this.syncIndeterminate(t);
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
  createCheckbox(t, e) {
    const r = this.ownerDocument.createElement("label");
    r.className = "blora-checkbox", r.dataset.bloraGenerated = "";
    const a = this.ownerDocument.createElement("input");
    a.type = "checkbox", a.name = e, a.value = t.value, a.checked = t.checked, a.disabled = t.disabled, a.required = this.hasAttribute("required"), t.checkAll && (a.dataset.bloraCheckall = "");
    const i = this.ownerDocument.createElement("span");
    return i.className = "blora-checkbox__box", i.setAttribute("aria-hidden", "true"), r.append(a, i, this.ownerDocument.createTextNode(t.label)), r;
  }
  captureLiveState() {
    if (!this.definitions) return;
    const t = Array.from(this.querySelectorAll('input[type="checkbox"]'));
    this.definitions = this.definitions.map((e, r) => {
      var a;
      return {
        ...e,
        checked: ((a = t[r]) == null ? void 0 : a.checked) ?? e.checked
      };
    });
  }
  syncIndeterminate(t) {
    t.querySelectorAll("input[data-blora-checkall]").forEach((e) => {
      var r;
      (r = e.closest(".blora-checkbox")) == null || r.toggleAttribute("data-indeterminate", e.indeterminate);
    });
  }
}
function Aa(n = customElements) {
  !n || n.get(qt) || n.define(qt, wr);
}
const Tt = "blora-field";
let xr = 0;
function kr(n) {
  const l = n.querySelectorAll(
    "[data-limit], [data-blora-limit]"
  ), t = [], e = (r, a) => {
    const i = Array.from(r || "");
    return {
      count: i.length,
      normal: i.slice(0, a).join(""),
      overflow: i.slice(a).join("")
    };
  };
  return l.forEach((r) => {
    var p;
    const a = Number(r.dataset.limit ?? r.dataset.bloraLimit ?? 0);
    if (!Number.isFinite(a) || a < 1) return;
    r.removeAttribute("maxlength");
    let i = r.closest(".blora-limit");
    i || (i = document.createElement("div"), i.className = "blora-limit", (p = r.parentNode) == null || p.insertBefore(i, r), i.appendChild(r)), i.classList.toggle("blora-limit--textarea", r.tagName === "TEXTAREA");
    let s = i.querySelector(".blora-limit__mirror"), o, c, u;
    if (s)
      o = s.querySelector(
        ".blora-limit__mirror-inner > span:not(.blora-limit__overflow)"
      ), c = s.querySelector(".blora-limit__overflow"), u = i.querySelector(".blora-limit__count");
    else {
      s = document.createElement("div"), s.className = "blora-limit__mirror", s.setAttribute("aria-hidden", "true");
      const h = document.createElement("span");
      h.className = "blora-limit__mirror-inner", o = document.createElement("span"), c = document.createElement("span"), c.className = "blora-limit__overflow", h.append(o, c), s.appendChild(h), u = document.createElement("span"), u.className = "blora-limit__count", u.setAttribute("aria-live", "polite"), i.append(s, u);
    }
    const d = () => {
      const h = s.querySelector(".blora-limit__mirror-inner");
      h && (h.style.transform = `translateX(${-r.scrollLeft}px)`), s.scrollTop = r.scrollTop;
    }, b = () => {
      const h = e(r.value, a), m = h.count > a;
      o.textContent = h.normal || "", c.textContent = h.overflow || "", u.textContent = `${h.count}/${a}`, m ? i.setAttribute("data-over-limit", "") : i.removeAttribute("data-over-limit"), m ? r.setAttribute("aria-invalid", "true") : r.removeAttribute("aria-invalid"), d();
    };
    r.addEventListener("input", b), r.addEventListener("scroll", d), b(), t.push(() => {
      r.removeEventListener("input", b), r.removeEventListener("scroll", d);
    });
  }), {
    destroy() {
      t.forEach((r) => r());
    }
  };
}
class Sr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "reflecting", !1);
    y(this, "controlId", `blora-field-${++xr}`);
  }
  static get observedAttributes() {
    return [
      "label",
      "name",
      "type",
      "value",
      "placeholder",
      "hint",
      "error",
      "state",
      "limit",
      "minlength",
      "maxlength",
      "pattern",
      "validate",
      "textarea",
      "required",
      "disabled",
      "readonly",
      "layout"
    ];
  }
  attributeChangedCallback() {
    var a;
    if (!this.isConnectedInternal || this.reflecting) return;
    const t = this.querySelector("input, textarea"), e = this.hasAttribute("textarea"), r = t instanceof HTMLTextAreaElement;
    if (t && e !== r) {
      const i = t.value;
      (a = this.controller) == null || a.destroy(), this.render();
      const s = this.querySelector("input, textarea");
      s && i && (s.value = i), this.bindEvents();
      return;
    }
    this.sync();
  }
  get value() {
    var t;
    return ((t = this.querySelector("input, textarea")) == null ? void 0 : t.value) ?? "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  focus(t) {
    var e;
    (e = this.querySelector("input, textarea")) == null || e.focus(t);
  }
  render() {
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-field", t.dataset.bloraGenerated = "";
    const e = this.getAttribute("state") ?? (this.hasAttribute("error") ? "invalid" : null);
    (e === "invalid" || e === "valid") && (t.dataset.state = e);
    const r = this.getAttribute("layout");
    r === "horizontal" && (t.dataset.layout = r);
    const a = this.getAttribute("validate");
    a && (t.dataset.bloraValidate = a);
    const i = this.id ? `${this.id}-control` : this.controlId, s = this.getAttribute("label");
    if (s) {
      const C = this.ownerDocument.createElement("label");
      C.className = "blora-field__label", C.htmlFor = i, C.textContent = s, this.hasAttribute("required") && (C.dataset.required = ""), t.appendChild(C);
    }
    const o = this.hasAttribute("textarea") ? this.ownerDocument.createElement("textarea") : this.ownerDocument.createElement("input");
    o.id = i, o.className = this.hasAttribute("textarea") ? "blora-textarea" : "blora-input", o instanceof HTMLInputElement && (o.type = this.getAttribute("type") ?? "text"), o.name = this.getAttribute("name") ?? "", o.value = this.getAttribute("value") ?? "", o.placeholder = this.getAttribute("placeholder") ?? "", o.required = this.hasAttribute("required"), o.disabled = this.hasAttribute("disabled"), o.readOnly = this.hasAttribute("readonly");
    const c = this.getAttribute("limit");
    c && (o.dataset.limit = c);
    const u = this.getAttribute("minlength");
    u && (o.minLength = Number(u));
    const d = this.getAttribute("maxlength");
    d && (o.maxLength = Number(d));
    const b = this.getAttribute("pattern");
    b && o instanceof HTMLInputElement && (o.pattern = b), t.appendChild(o);
    const p = this.getAttribute("hint");
    if (p) {
      const C = this.ownerDocument.createElement("span");
      C.className = "blora-field__help", C.textContent = p, t.appendChild(C);
    }
    const h = this.getAttribute("error") ?? "", m = this.ownerDocument.createElement("span");
    m.className = "blora-field__error", h ? m.textContent = h : m.hidden = !0, t.appendChild(m), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-field"), e = t == null ? void 0 : t.querySelector("input, textarea");
    if (!t || !e) return;
    const r = this.getAttribute("state") ?? (this.hasAttribute("error") ? "invalid" : null);
    r === "invalid" || r === "valid" ? t.dataset.state = r : delete t.dataset.state;
    const a = this.getAttribute("layout");
    a === "horizontal" ? t.dataset.layout = a : delete t.dataset.layout;
    const i = this.getAttribute("validate");
    i ? t.dataset.bloraValidate = i : delete t.dataset.bloraValidate;
    const s = t.querySelector(".blora-field__label");
    s && (s.textContent = this.getAttribute("label") ?? "", s.toggleAttribute("data-required", this.hasAttribute("required"))), e instanceof HTMLInputElement && (e.type = this.getAttribute("type") ?? "text"), e.name = this.getAttribute("name") ?? "", document.activeElement !== e && (e.value = this.getAttribute("value") ?? e.value), e.placeholder = this.getAttribute("placeholder") ?? "", e.required = this.hasAttribute("required"), e.disabled = this.hasAttribute("disabled"), e.readOnly = this.hasAttribute("readonly");
    const o = this.getAttribute("limit");
    o ? e.dataset.limit = o : delete e.dataset.limit;
    const c = this.getAttribute("minlength");
    c ? e.minLength = Number(c) : e.removeAttribute("minlength");
    const u = this.getAttribute("maxlength");
    u ? e.maxLength = Number(u) : e.removeAttribute("maxlength");
    const d = this.getAttribute("pattern");
    d && e instanceof HTMLInputElement ? e.pattern = d : e instanceof HTMLInputElement && e.removeAttribute("pattern");
    const b = this.getAttribute("hint") ?? "";
    let p = t.querySelector(".blora-field__help");
    if (b) {
      if (!p) {
        p = this.ownerDocument.createElement("span"), p.className = "blora-field__help";
        const m = t.querySelector(".blora-field__error");
        m ? t.insertBefore(p, m) : t.appendChild(p);
      }
      p.textContent = b;
    } else
      p == null || p.remove();
    const h = t.querySelector(".blora-field__error");
    if (h) {
      const m = this.getAttribute("error") ?? "";
      h.textContent = m, h.hidden = !m;
    }
  }
  bindEvents() {
    var r;
    const t = this.querySelector(".blora-field"), e = t == null ? void 0 : t.querySelector("input, textarea");
    !t || !e || ((r = this.controller) == null || r.destroy(), this.controller = kr(t), this.listen(e, "input", () => {
      this.reflecting = !0, this.setAttribute("value", e.value), this.reflecting = !1;
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function ya(n = customElements) {
  !n || n.get(Tt) || n.define(Tt, Sr);
}
const Mt = "blora-upload";
function Nr(n) {
  const l = n.querySelector(
    ".blora-dropzone, .blora-file-picker, .blora-upload__zone"
  );
  if (!l) return { destroy: () => {
  } };
  let t = n.querySelector('input[type="file"]');
  t || (t = document.createElement("input"), t.type = "file", t.multiple = !0, t.hidden = !0, t.setAttribute("aria-hidden", "true"), n.appendChild(t));
  let e = n.querySelector(".blora-upload__list, .blora-stack");
  e || (e = document.createElement("div"), e.className = "blora-upload__list", e.style.marginTop = "var(--blora-space-3)", n.appendChild(e));
  const r = (d) => {
    !d || !d.length || !e || Array.from(d).forEach((b) => {
      const p = document.createElement("div");
      p.className = "blora-upload__row";
      const h = document.createElement("span");
      h.className = "blora-upload__name", h.textContent = b.name;
      const m = document.createElement("span");
      m.className = "blora-upload__size", m.textContent = b.size > 1024 * 1024 ? (b.size / (1024 * 1024)).toFixed(1) + " MB" : Math.round(b.size / 1024) + " KB", p.append(h, m), e.appendChild(p);
    });
  }, a = () => t.click(), i = () => r(t.files), s = (d) => {
    (d.key === "Enter" || d.key === " ") && (d.preventDefault(), a());
  };
  l.addEventListener("click", a), l.addEventListener("keydown", s), l.hasAttribute("tabindex") || (l.tabIndex = 0), l.getAttribute("role") || l.setAttribute("role", "button"), t.addEventListener("change", i);
  const o = (d) => {
    d.preventDefault(), l.setAttribute("data-dragover", "");
  }, c = () => l.removeAttribute("data-dragover"), u = (d) => {
    var b;
    d.preventDefault(), l.removeAttribute("data-dragover"), r(((b = d.dataTransfer) == null ? void 0 : b.files) ?? null);
  };
  return l.addEventListener("dragover", o), l.addEventListener("dragleave", c), l.addEventListener("drop", u), {
    destroy() {
      l.removeEventListener("click", a), l.removeEventListener("keydown", s), t.removeEventListener("change", i), l.removeEventListener("dragover", o), l.removeEventListener("dragleave", c), l.removeEventListener("drop", u);
    }
  };
}
class Dr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
  }
  static get observedAttributes() {
    return ["prompt", "hint", "accept", "multiple", "name", "disabled", "variant"];
  }
  attributeChangedCallback(t) {
    var e;
    if (this.isConnectedInternal) {
      if (t === "variant") {
        (e = this.controller) == null || e.destroy(), this.render(), this.bindEvents();
        return;
      }
      this.sync();
    }
  }
  get files() {
    var t;
    return ((t = this.querySelector('input[type="file"]')) == null ? void 0 : t.files) ?? null;
  }
  focus(t) {
    var e;
    (e = this.querySelector(".blora-dropzone, .blora-file-picker")) == null || e.focus(t);
  }
  open() {
    var t;
    this.hasAttribute("disabled") || (t = this.querySelector('input[type="file"]')) == null || t.click();
  }
  render() {
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-upload", t.dataset.bloraGenerated = "";
    const e = this.getAttribute("variant") === "compact", r = this.hasAttribute("disabled"), a = this.ownerDocument.createElement(e ? "button" : "div");
    a.className = e ? "blora-file-picker" : "blora-dropzone", e && (a.type = "button", a.disabled = r), a.tabIndex = r ? -1 : 0, a.setAttribute("role", "button"), a.setAttribute("aria-disabled", String(r));
    const i = this.ownerDocument.createElement("div");
    i.className = "blora-dropzone__icon";
    const s = O("upload", 40);
    s.setAttribute("stroke-width", "1.5"), i.appendChild(s);
    const o = this.ownerDocument.createElement("div");
    o.className = "blora-upload__content";
    const c = this.ownerDocument.createElement("strong");
    c.textContent = this.getAttribute("prompt") ?? "拖拽文件至此";
    const u = this.ownerDocument.createElement("span");
    u.textContent = " 或 点击选择", o.append(c, u);
    const d = this.ownerDocument.createElement("div");
    if (d.className = "blora-upload__hint", d.textContent = this.getAttribute("hint") ?? "选择或拖放文件", e) {
      const h = this.ownerDocument.createElement("span");
      h.className = "blora-file-picker__label", h.textContent = this.getAttribute("prompt") ?? "选择文件", a.append(i, h), a.setAttribute("aria-label", h.textContent);
    } else
      a.append(i, o, d);
    const b = this.ownerDocument.createElement("input");
    b.className = "blora-dropzone__input", b.type = "file", b.name = this.getAttribute("name") ?? "", b.accept = this.getAttribute("accept") ?? "", b.multiple = this.hasAttribute("multiple"), b.disabled = r;
    const p = this.ownerDocument.createElement("div");
    p.className = "blora-upload__list", t.append(a, b, p), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-upload");
    if (!t) return;
    const e = this.getAttribute("variant") === "compact", r = this.hasAttribute("disabled"), a = t.querySelector('input[type="file"]');
    a && (a.name = this.getAttribute("name") ?? "", a.accept = this.getAttribute("accept") ?? "", a.multiple = this.hasAttribute("multiple"), a.disabled = r);
    const i = this.getAttribute("prompt") ?? (e ? "选择文件" : "拖拽文件至此"), s = this.getAttribute("hint") ?? "选择或拖放文件", o = t.querySelector(".blora-upload__content strong");
    o && (o.textContent = this.getAttribute("prompt") ?? "拖拽文件至此");
    const c = t.querySelector(".blora-upload__hint");
    c && (c.textContent = s);
    const u = t.querySelector(".blora-file-picker__label");
    u && (u.textContent = i);
    const d = t.querySelector(".blora-dropzone, .blora-file-picker");
    d && (d.tabIndex = r ? -1 : 0, d.setAttribute("aria-disabled", String(r)), d instanceof HTMLButtonElement && (d.disabled = r), u && d.setAttribute("aria-label", u.textContent ?? i));
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-upload");
    (e = this.controller) == null || e.destroy(), this.controller = null, t && !this.hasAttribute("disabled") && (this.controller = Nr(t));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function _a(n = customElements) {
  !n || n.get(Mt) || n.define(Mt, Dr);
}
const Bt = "blora-tooltip";
function Lr(n) {
  if (typeof document > "u") return { destroy: () => {
  } };
  const l = n.querySelector(".blora-tooltip__bubble");
  if (!l) return { destroy: () => {
  } };
  const t = n.ownerDocument.defaultView, e = () => {
    l.style.setProperty("--blora-float-shift-x", "0px");
    const r = l.getBoundingClientRect(), a = 12;
    let i = 0;
    r.left < a && (i += a - r.left), r.right + i > t.innerWidth - a && (i -= r.right + i - (t.innerWidth - a)), l.style.setProperty("--blora-float-shift-x", `${i}px`);
  };
  return n.addEventListener("pointerenter", e), n.addEventListener("focusin", e), t.addEventListener("resize", e), {
    destroy() {
      n.removeEventListener("pointerenter", e), n.removeEventListener("focusin", e), t.removeEventListener("resize", e);
    }
  };
}
class qr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "triggerNodes", null);
  }
  static get observedAttributes() {
    return ["text", "trigger", "placement", "disabled"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  focus(t) {
    var e;
    (e = this.querySelector(".blora-tooltip")) == null || e.focus(t);
  }
  render() {
    if (!this.triggerNodes) {
      const a = this.querySelector(".blora-tooltip");
      this.triggerNodes = a ? Array.from(a.childNodes).filter(
        (i) => !(i instanceof HTMLElement) || !i.classList.contains("blora-tooltip__bubble")
      ) : Array.from(this.childNodes);
    }
    const t = this.ownerDocument.createElement("span");
    t.className = "blora-tooltip", t.dataset.bloraGenerated = "", t.tabIndex = this.hasAttribute("disabled") ? -1 : 0;
    const e = this.getAttribute("trigger");
    e ? t.appendChild(this.ownerDocument.createTextNode(e)) : t.append(...this.triggerNodes);
    const r = this.ownerDocument.createElement("span");
    r.className = "blora-tooltip__bubble", r.setAttribute("role", "tooltip"), r.textContent = this.getAttribute("text") ?? "", t.appendChild(r), this.replaceChildren(t), this.sync();
  }
  sync() {
    const t = this.querySelector(".blora-tooltip");
    if (!t) return;
    t.tabIndex = this.hasAttribute("disabled") ? -1 : 0;
    const e = this.getAttribute("placement");
    e ? t.dataset.placement = e : delete t.dataset.placement;
    const r = t.querySelector(".blora-tooltip__bubble");
    r && (r.textContent = this.getAttribute("text") ?? "");
    const a = this.getAttribute("trigger");
    if (a) {
      const i = t.firstChild;
      (i == null ? void 0 : i.nodeType) === Node.TEXT_NODE && (i.textContent = a);
    }
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-tooltip");
    (e = this.controller) == null || e.destroy(), this.controller = t && !this.hasAttribute("disabled") ? Lr(t) : null;
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Ea(n = customElements) {
  !n || n.get(Bt) || n.define(Bt, qr);
}
const It = "blora-popover";
function Tr(n, l) {
  if (typeof document > "u")
    return { open: () => {
    }, close: () => {
    }, destroy: () => {
    } };
  const t = n.querySelector("[data-blora-popover], .blora-popover__trigger") || n.querySelector("button"), e = n.querySelector(".blora-popover__panel");
  if (!t || !e)
    return { open: () => {
    }, close: () => {
    }, destroy: () => {
    } };
  const r = n.ownerDocument, a = (u) => {
    u ? (n.setAttribute("data-open", ""), n.classList.add("is-open"), e.classList.add("is-open")) : (n.removeAttribute("data-open"), n.classList.remove("is-open"), e.classList.remove("is-open")), t.setAttribute("aria-expanded", String(u)), l == null || l(u);
  }, i = (u) => {
    u.stopPropagation(), a(!n.hasAttribute("data-open"));
  }, s = (u) => {
    !n.contains(u.target) && !e.contains(u.target) && a(!1);
  }, o = (u) => {
    u.key === "Escape" && a(!1);
  }, c = () => a(!1);
  return t.setAttribute("aria-haspopup", "dialog"), t.setAttribute("aria-expanded", "false"), t.addEventListener("click", i), r.addEventListener("click", s), r.addEventListener("keydown", o), e.querySelectorAll("[data-blora-close]").forEach((u) => u.addEventListener("click", c)), a(n.hasAttribute("data-open")), {
    open: () => a(!0),
    close: () => a(!1),
    destroy() {
      t.removeEventListener("click", i), r.removeEventListener("click", s), r.removeEventListener("keydown", o), e.querySelectorAll("[data-blora-close]").forEach((u) => u.removeEventListener("click", c));
    }
  };
}
class Mr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "reflecting", !1);
    y(this, "contentNodes", null);
  }
  static get observedAttributes() {
    return ["trigger", "content", "close-label", "open", "disabled"];
  }
  attributeChangedCallback(t) {
    var e, r;
    if (!(!this.isConnectedInternal || this.reflecting)) {
      if (t === "open") {
        this.hasAttribute("open") ? (e = this.controller) == null || e.open() : (r = this.controller) == null || r.close();
        return;
      }
      this.sync();
    }
  }
  open() {
    this.setAttribute("open", "");
  }
  close() {
    this.removeAttribute("open");
  }
  render() {
    if (!this.contentNodes) {
      const s = this.querySelector(".blora-popover__content"), o = s ? Array.from(s.childNodes) : Array.from(this.childNodes).filter(
        (c) => {
          var u;
          return c.nodeType === Node.ELEMENT_NODE || (((u = c.textContent) == null ? void 0 : u.trim().length) ?? 0) > 0;
        }
      );
      this.contentNodes = o.length ? o : null;
    }
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-popover", t.dataset.bloraGenerated = "", this.hasAttribute("open") && (t.dataset.open = "");
    const e = this.ownerDocument.createElement("button");
    e.type = "button", e.className = "blora-button blora-popover__trigger", e.dataset.variant = "outline", e.dataset.bloraPopover = "", e.disabled = this.hasAttribute("disabled"), e.textContent = this.getAttribute("trigger") ?? "Open Popover";
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-popover__panel", r.setAttribute("role", "dialog");
    const a = this.ownerDocument.createElement("div");
    a.className = "blora-popover__content", this.contentNodes ? a.append(...this.contentNodes) : a.textContent = this.getAttribute("content") ?? "";
    const i = this.ownerDocument.createElement("button");
    i.type = "button", i.className = "blora-button", i.dataset.size = "sm", i.dataset.bloraClose = "", i.textContent = this.getAttribute("close-label") ?? "Close", r.append(a, i), t.append(e, r), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-popover");
    if (!t) return;
    const e = t.querySelector(".blora-popover__trigger");
    e && (e.textContent = this.getAttribute("trigger") ?? "Open Popover", e.disabled = this.hasAttribute("disabled"));
    const r = t.querySelector(".blora-popover__content");
    r && !this.contentNodes && (r.textContent = this.getAttribute("content") ?? "");
    const a = t.querySelector("[data-blora-close]");
    a && (a.textContent = this.getAttribute("close-label") ?? "Close");
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-popover");
    (e = this.controller) == null || e.destroy(), this.controller = t ? Tr(t, (r) => {
      this.reflecting = !0, this.toggleAttribute("open", r), this.reflecting = !1;
    }) : null;
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Ca(n = customElements) {
  !n || n.get(It) || n.define(It, Mr);
}
const Ot = "blora-popconfirm";
function Br(n) {
  if (typeof document > "u") return { destroy: () => {
  } };
  const l = n.querySelector(
    "[data-blora-popconfirm-trigger], .blora-popconfirm__trigger"
  ) || n.querySelector("button"), t = n.querySelector(".blora-popconfirm__panel");
  if (!l || !t) return { destroy: () => {
  } };
  const e = (s) => {
    s ? (n.setAttribute("data-open", ""), n.classList.add("is-open")) : (n.removeAttribute("data-open"), n.classList.remove("is-open"));
  }, r = (s) => {
    s.stopPropagation(), e(!n.hasAttribute("data-open"));
  }, a = (s) => {
    const o = s.target;
    o.closest("[data-confirm], [data-blora-confirm]") && (n.dispatchEvent(new CustomEvent("blora-confirm", { bubbles: !0 })), e(!1)), o.closest("[data-cancel], [data-blora-cancel], [data-blora-close]") && e(!1);
  }, i = (s) => {
    n.contains(s.target) || e(!1);
  };
  return l.addEventListener("click", r), t.addEventListener("click", a), n.ownerDocument.addEventListener("click", i), {
    destroy() {
      l.removeEventListener("click", r), t.removeEventListener("click", a), n.ownerDocument.removeEventListener("click", i);
    }
  };
}
class Ir extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
  }
  static get observedAttributes() {
    return ["trigger", "message", "confirm-label", "cancel-label", "open", "disabled"];
  }
  attributeChangedCallback(t) {
    if (this.isConnectedInternal) {
      if (t === "open") {
        this.hasAttribute("open") ? this.open() : this.close();
        return;
      }
      this.sync();
    }
  }
  open() {
    var t;
    (t = this.querySelector(".blora-popconfirm")) == null || t.setAttribute("data-open", "");
  }
  close() {
    var t;
    (t = this.querySelector(".blora-popconfirm")) == null || t.removeAttribute("data-open");
  }
  render() {
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-popconfirm", t.dataset.bloraGenerated = "", this.hasAttribute("open") && (t.dataset.open = "");
    const e = this.ownerDocument.createElement("button");
    e.type = "button", e.className = "blora-button blora-popconfirm__trigger", e.dataset.variant = "danger", e.dataset.bloraPopconfirmTrigger = "", e.disabled = this.hasAttribute("disabled"), e.textContent = this.getAttribute("trigger") ?? "Delete";
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-popconfirm__panel", r.setAttribute("role", "alertdialog");
    const a = this.ownerDocument.createElement("p");
    a.className = "blora-popconfirm__title", a.textContent = this.getAttribute("message") ?? "Are you sure?";
    const i = this.ownerDocument.createElement("div");
    i.className = "blora-popconfirm__actions";
    const s = this.ownerDocument.createElement("button");
    s.type = "button", s.className = "blora-button", s.dataset.size = "sm", s.dataset.variant = "ghost", s.dataset.cancel = "", s.textContent = this.getAttribute("cancel-label") ?? "Cancel";
    const o = this.ownerDocument.createElement("button");
    o.type = "button", o.className = "blora-button", o.dataset.size = "sm", o.dataset.variant = "danger", o.dataset.confirm = "", o.textContent = this.getAttribute("confirm-label") ?? "Confirm", i.append(s, o), r.append(a, i), t.append(e, r), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-popconfirm__trigger");
    t && (t.textContent = this.getAttribute("trigger") ?? "Delete", t.disabled = this.hasAttribute("disabled"));
    const e = this.querySelector(".blora-popconfirm__title");
    e && (e.textContent = this.getAttribute("message") ?? "Are you sure?");
    const r = this.querySelector("[data-cancel]");
    r && (r.textContent = this.getAttribute("cancel-label") ?? "Cancel");
    const a = this.querySelector("[data-confirm]");
    a && (a.textContent = this.getAttribute("confirm-label") ?? "Confirm");
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-popconfirm");
    (e = this.controller) == null || e.destroy(), this.controller = t ? Br(t) : null;
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function wa(n = customElements) {
  !n || n.get(Ot) || n.define(Ot, Ir);
}
const Rt = "blora-dropdown";
function Or(n) {
  const l = new AbortController(), { signal: t } = l, e = n.querySelector("[data-dropdown-trigger]"), r = n.querySelector(".blora-dropdown__menu");
  if (!e || !r)
    return {
      open: () => {
      },
      close: () => {
      },
      toggle: () => {
      },
      destroy: () => {
      }
    };
  const a = e, i = r;
  a.setAttribute("aria-haspopup", "menu"), a.id || (a.id = `blora-dropdown-trigger-${Math.random().toString(36).slice(2, 9)}`), i.setAttribute("role", "menu"), i.setAttribute("aria-labelledby", a.id);
  function s() {
    return n.hasAttribute("data-open");
  }
  function o() {
    a.setAttribute("aria-expanded", String(s())), i.setAttribute("aria-hidden", String(!s()));
  }
  function c() {
    n.setAttribute("data-open", ""), o();
  }
  function u() {
    n.removeAttribute("data-open"), o();
  }
  function d() {
    s() ? u() : c();
  }
  return a.addEventListener(
    "click",
    (b) => {
      b.stopPropagation(), d();
    },
    { signal: t }
  ), i.addEventListener(
    "click",
    (b) => {
      b.target.closest(".blora-dropdown__item") && u();
    },
    { signal: t }
  ), n.addEventListener(
    "keydown",
    (b) => {
      b.key === "Escape" && s() && (b.stopPropagation(), u(), a.focus());
    },
    { signal: t }
  ), document.addEventListener(
    "click",
    () => {
      s() && u();
    },
    { signal: t }
  ), o(), { open: c, close: u, toggle: d, destroy: () => l.abort() };
}
class Rr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
  }
  static get observedAttributes() {
    return ["label", "open", "disabled"];
  }
  attributeChangedCallback(t) {
    var e, r;
    if (this.isConnectedInternal) {
      if (t === "open") {
        this.hasAttribute("open") ? (e = this.controller) == null || e.open() : (r = this.controller) == null || r.close();
        return;
      }
      this.sync();
    }
  }
  open() {
    var t;
    (t = this.controller) == null || t.open();
  }
  close() {
    var t;
    (t = this.controller) == null || t.close();
  }
  toggle() {
    var t;
    (t = this.controller) == null || t.toggle();
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((i) => i.localName === "blora-dropdown-item").map((i) => {
      var s, o;
      return {
        disabled: i.hasAttribute("disabled"),
        href: i.getAttribute("href"),
        label: i.getAttribute("label") ?? ((s = i.textContent) == null ? void 0 : s.trim()) ?? "",
        separator: i.hasAttribute("separator"),
        value: i.getAttribute("value") ?? ((o = i.textContent) == null ? void 0 : o.trim()) ?? ""
      };
    }));
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-dropdown", t.dataset.bloraGenerated = "", this.hasAttribute("open") && (t.dataset.open = "");
    const e = this.ownerDocument.createElement("button");
    e.type = "button", e.className = "blora-button", e.dataset.variant = "outline", e.dataset.dropdownTrigger = "", e.disabled = this.hasAttribute("disabled");
    const r = this.ownerDocument.createElement("span");
    r.className = "blora-dropdown__label", r.textContent = this.getAttribute("label") ?? "Menu", e.append(r, O("chevron-down", 16, this.ownerDocument));
    const a = this.ownerDocument.createElement("div");
    a.className = "blora-dropdown__menu";
    for (const i of this.definitions) {
      if (i.separator) {
        const o = this.ownerDocument.createElement("div");
        o.className = "blora-dropdown__sep", o.setAttribute("role", "separator"), a.appendChild(o);
      }
      const s = i.href ? this.ownerDocument.createElement("a") : this.ownerDocument.createElement("button");
      s.className = "blora-dropdown__item", s.dataset.value = i.value, s.textContent = i.label, s instanceof HTMLAnchorElement ? s.href = i.href : s.type = "button", i.disabled && (s.setAttribute("aria-disabled", "true"), s instanceof HTMLButtonElement && (s.disabled = !0)), a.appendChild(s);
    }
    t.append(e, a), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector("[data-dropdown-trigger]");
    if (!t) return;
    t.disabled = this.hasAttribute("disabled");
    const e = t.querySelector(".blora-dropdown__label");
    e && (e.textContent = this.getAttribute("label") ?? "Menu");
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-dropdown");
    t && ((e = this.controller) == null || e.destroy(), this.controller = Or(t), this.listen(t, "click", (r) => {
      const a = r.target.closest(".blora-dropdown__item");
      a && a.getAttribute("aria-disabled") !== "true" && this.emit("blora-select", { value: a.dataset.value ?? "" });
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function xa(n = customElements) {
  !n || n.get(Rt) || n.define(Rt, Rr);
}
const Pt = "blora-drawer";
function Pr(n) {
  if (typeof document > "u")
    return { open: () => {
    }, close: () => {
    }, destroy: () => {
    } };
  const l = n.ownerDocument, t = n.querySelector(".blora-drawer__panel"), e = n.querySelector(".blora-drawer__mask");
  let r = !1, a = 0;
  const i = () => {
    n.classList.remove("is-leaving"), e == null || e.classList.remove("is-leaving"), t == null || t.classList.remove("is-leaving");
  }, s = (u) => {
    if (u) {
      a && (window.clearTimeout(a), a = 0), r = !1, i(), n.setAttribute("data-open", ""), n.setAttribute("open", ""), n.classList.add("is-open"), t == null || t.setAttribute("tabindex", "-1"), t == null || t.focus({ preventScroll: !0 });
      return;
    }
    if (r || !n.hasAttribute("data-open") && !n.classList.contains("is-open") && !n.hasAttribute("open"))
      return;
    r = !0, n.classList.add("is-leaving"), e == null || e.classList.add("is-leaving"), t == null || t.classList.add("is-leaving");
    const d = () => {
      r && (n.removeAttribute("data-open"), n.removeAttribute("open"), n.classList.remove("is-open"), i(), r = !1, a && (window.clearTimeout(a), a = 0), t == null || t.removeEventListener("animationend", b));
    }, b = (p) => {
      p.target !== t && p.target !== e || d();
    };
    t == null || t.addEventListener("animationend", b), a = window.setTimeout(d, 400);
  }, o = (u) => {
    const d = u.target;
    (d.closest("[data-blora-close]") || d.classList.contains("blora-drawer__mask")) && s(!1);
  }, c = (u) => {
    u.key === "Escape" && (n.hasAttribute("data-open") || n.classList.contains("is-open") || n.hasAttribute("open")) && s(!1);
  };
  return n.addEventListener("click", o), l.addEventListener("keydown", c), {
    open: () => s(!0),
    close: () => s(!1),
    destroy() {
      n.removeEventListener("click", o), l.removeEventListener("keydown", c);
    }
  };
}
class $r extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "contentNodes", null);
  }
  static get observedAttributes() {
    return ["title", "position", "open", "close-label"];
  }
  attributeChangedCallback(t) {
    var e, r;
    if (this.isConnectedInternal) {
      if (t === "open") {
        this.hasAttribute("open") ? (e = this.controller) == null || e.open() : (r = this.controller) == null || r.close();
        return;
      }
      this.sync();
    }
  }
  open() {
    var t;
    (t = this.controller) == null || t.open();
  }
  close() {
    var t;
    (t = this.controller) == null || t.close();
  }
  render() {
    if (!this.contentNodes) {
      const u = this.querySelector(".blora-drawer__body");
      this.contentNodes = Array.from(u ? u.childNodes : this.childNodes);
    }
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-drawer", t.dataset.bloraGenerated = "", t.dataset.position = this.getAttribute("position") ?? "right", this.hasAttribute("open") && (t.dataset.open = "", t.setAttribute("open", ""), t.classList.add("is-open"));
    const e = this.ownerDocument.createElement("div");
    e.className = "blora-drawer__mask";
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-drawer__panel", r.setAttribute("role", "dialog"), r.setAttribute("aria-modal", "true");
    const a = this.ownerDocument.createElement("div");
    a.className = "blora-drawer__header";
    const i = this.ownerDocument.createElement("h3");
    i.className = "blora-drawer__title", i.textContent = this.getAttribute("title") ?? "Drawer";
    const s = this.ownerDocument.createElement("button");
    s.type = "button", s.className = "blora-drawer__close", s.dataset.bloraClose = "", s.setAttribute("aria-label", this.getAttribute("close-label") ?? "Close"), s.appendChild(O("close", 18, this.ownerDocument)), a.append(i, s);
    const o = this.ownerDocument.createElement("div");
    o.className = "blora-drawer__body";
    const c = this.ownerDocument.createElement("div");
    c.className = "blora-drawer__content", c.append(...this.contentNodes), o.appendChild(c), r.append(a, o), t.append(e, r), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-drawer");
    if (!t) return;
    t.dataset.position = this.getAttribute("position") ?? "right";
    const e = t.querySelector(".blora-drawer__title");
    e && (e.textContent = this.getAttribute("title") ?? "Drawer");
    const r = t.querySelector(".blora-drawer__close");
    r && r.setAttribute("aria-label", this.getAttribute("close-label") ?? "Close");
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-drawer");
    (e = this.controller) == null || e.destroy(), this.controller = t ? Pr(t) : null;
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function ka(n = customElements) {
  !n || n.get(Pt) || n.define(Pt, $r);
}
const $t = "blora-backtop", Sa = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>';
function Gr(n) {
  if (n.querySelector("svg")) return;
  const l = O("arrow-up", 22, n.ownerDocument);
  l.setAttribute("stroke-width", "2.5"), (n.childNodes.length > 0 && Array.from(n.childNodes).every(
    (e) => e.nodeType === Node.TEXT_NODE || e.nodeType === Node.COMMENT_NODE
  ) || n.childNodes.length === 0) && Array.from(n.childNodes).forEach((e) => {
    e.nodeType === Node.TEXT_NODE && e.remove();
  }), n.appendChild(l);
}
function xe(n, l) {
  if (typeof document > "u" || typeof window > "u")
    return { show: () => {
    }, hide: () => {
    }, destroy: () => {
    } };
  n.classList.add("blora-backtop"), Gr(n), n.getAttribute("aria-label") || n.setAttribute("aria-label", "回到顶部");
  const t = Number(
    n.getAttribute("data-show-after") || n.getAttribute("data-blora-backtop") || ""
  ), e = Number.isFinite(t) && t > 0 ? t : 400, r = n.getAttribute("data-target");
  let a = window;
  if (r) {
    const b = document.querySelector(r);
    b && (a = b);
  }
  const i = () => a === window ? window.scrollY || document.documentElement.scrollTop || 0 : a.scrollTop, s = () => {
    n.classList.add("is-visible"), n.classList.remove("is-hidden"), n.removeAttribute("data-hidden");
  }, o = () => {
    n.classList.remove("is-visible"), n.classList.add("is-hidden"), n.setAttribute("data-hidden", "");
  }, c = () => {
    i() >= e ? s() : o();
  }, u = (b) => {
    b.preventDefault(), a === window ? window.scrollTo({ top: 0, behavior: "smooth" }) : a.scrollTo({ top: 0, behavior: "smooth" });
  };
  o(), c();
  const d = a === window ? window : a;
  return d.addEventListener("scroll", c, { passive: !0 }), n.addEventListener("click", u), {
    show: s,
    hide: o,
    destroy() {
      d.removeEventListener("scroll", c), n.removeEventListener("click", u);
    }
  };
}
function Na(n = document) {
  if (typeof document > "u") return () => {
  };
  const l = [];
  return n.querySelectorAll("[data-blora-backtop], .blora-backtop").forEach((t) => {
    t.classList.contains("blora-fab--static") || l.push(xe(t));
  }), () => l.forEach((t) => t.destroy());
}
class Hr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
  }
  static get observedAttributes() {
    return ["show-after", "target", "label"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  show() {
    var t;
    (t = this.controller) == null || t.show();
  }
  hide() {
    var t;
    (t = this.controller) == null || t.hide();
  }
  render() {
    const t = this.ownerDocument.createElement("button");
    t.type = "button", t.className = "blora-backtop", t.dataset.bloraGenerated = "", t.setAttribute("aria-label", this.getAttribute("label") ?? "回到顶部");
    const e = this.getAttribute("show-after");
    e && (t.dataset.showAfter = e);
    const r = this.getAttribute("target");
    r && (t.dataset.target = r), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-backtop");
    if (!t) return;
    t.setAttribute("aria-label", this.getAttribute("label") ?? "回到顶部");
    const e = this.getAttribute("show-after");
    e ? t.dataset.showAfter = e : delete t.dataset.showAfter;
    const r = this.getAttribute("target");
    r ? t.dataset.target = r : delete t.dataset.target, this.rebind();
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-backtop");
    (e = this.controller) == null || e.destroy(), this.controller = t ? xe(t) : null;
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Da(n = customElements) {
  !n || n.get($t) || n.define($t, Hr);
}
const Gt = "blora-copy";
function zr(n) {
  const l = n.ownerDocument, t = l.defaultView, e = n.querySelector(
    ".blora-copy__btn, .blora-typo-copy__btn, [data-copy]"
  );
  if (!e) return { destroy: () => {
  } };
  let r = [], a = null;
  const i = () => O("check", 14, l), s = async (o) => {
    var u;
    o.preventDefault(), o.stopPropagation();
    const c = n.getAttribute("data-blora-copy") || n.dataset.copyText || e.dataset.copyText || ((u = n.textContent) == null ? void 0 : u.trim()) || "";
    try {
      await (t == null ? void 0 : t.navigator.clipboard.writeText(c));
    } catch {
      const d = l.createElement("textarea");
      d.value = c, l.body.appendChild(d), d.select();
      try {
        l.execCommand("copy");
      } catch {
      }
      d.remove();
    }
    r = Array.from(e.childNodes), e.replaceChildren(i()), n.setAttribute("data-copied", ""), a && clearTimeout(a), a = setTimeout(() => {
      e.replaceChildren(...r), n.removeAttribute("data-copied");
    }, 1500);
  };
  return e.addEventListener("click", s), {
    destroy() {
      e.removeEventListener("click", s), a && clearTimeout(a);
    }
  };
}
class Fr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "initialText", null);
  }
  static get observedAttributes() {
    return ["text", "label"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  copy() {
    var t;
    (t = this.querySelector(".blora-copy__btn")) == null || t.click();
  }
  render() {
    var i;
    this.initialText === null && (this.initialText = ((i = this.textContent) == null ? void 0 : i.trim()) ?? "");
    const t = this.getAttribute("text") ?? this.initialText, e = this.ownerDocument.createElement("span");
    e.className = "blora-copy blora-typo-copy", e.dataset.bloraGenerated = "", e.dataset.bloraCopy = t;
    const r = this.ownerDocument.createElement("code");
    r.className = "blora-code", r.textContent = t;
    const a = this.ownerDocument.createElement("button");
    a.type = "button", a.className = "blora-copy__btn blora-typo-copy__btn", a.setAttribute("aria-label", this.getAttribute("label") ?? "复制"), a.appendChild(O("copy", 14, this.ownerDocument)), e.append(r, a), this.replaceChildren(e);
  }
  sync() {
    const t = this.querySelector(".blora-copy");
    if (!t) return;
    const e = this.getAttribute("text") ?? this.initialText ?? "";
    t.dataset.bloraCopy = e;
    const r = t.querySelector("code");
    r && (r.textContent = e);
    const a = t.querySelector(".blora-copy__btn");
    a && a.setAttribute("aria-label", this.getAttribute("label") ?? "复制");
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-copy");
    (e = this.controller) == null || e.destroy(), this.controller = t ? zr(t) : null;
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function La(n = customElements) {
  !n || n.get(Gt) || n.define(Gt, Fr);
}
const Ht = "blora-progress";
function Vr(n) {
  const l = n.querySelector(".blora-progress__fill") ?? n.querySelector(".blora-progress__ring-fill") ?? n.querySelector(".blora-progress__bar") ?? n, t = n.querySelector("[data-progress-label]") ?? n.querySelector(".blora-progress__label"), e = (a) => {
    const i = Math.max(0, Math.min(100, a));
    n.setAttribute("aria-valuenow", String(i)), n.dataset.value = String(i), l.classList.contains("blora-progress__ring-fill") ? l.style.strokeDashoffset = String(100 - i) : l.style.width = `${i}%`, t && (t.textContent = `${Math.round(i)}%`);
  }, r = Number(n.dataset.value || n.getAttribute("aria-valuenow") || 0);
  return Number.isNaN(r) || e(r), {
    setValue: e,
    destroy() {
    }
  };
}
class Yr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
  }
  static get observedAttributes() {
    return ["value", "label", "variant", "shape"];
  }
  attributeChangedCallback(t) {
    if (this.isConnectedInternal) {
      if (t === "shape") {
        this.render(), this.rebind();
        return;
      }
      this.sync();
    }
  }
  get value() {
    var t;
    return Number(((t = this.querySelector(".blora-progress")) == null ? void 0 : t.dataset.value) ?? 0);
  }
  set value(t) {
    this.setAttribute("value", String(t));
  }
  setValue(t) {
    this.value = t;
  }
  render() {
    const t = Math.max(0, Math.min(100, Number(this.getAttribute("value") ?? 0))), e = this.ownerDocument.createElement("div");
    e.className = "blora-progress", e.dataset.bloraGenerated = "", e.dataset.value = String(t), e.setAttribute("role", "progressbar"), e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(t));
    const r = this.getAttribute("shape") ?? "linear";
    if (e.dataset.shape = r, e.setAttribute("aria-label", this.getAttribute("label") ?? "Progress"), r === "circular") {
      e.classList.add("blora-progress--circular");
      const d = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
      d.setAttribute("class", "blora-progress__ring"), d.setAttribute("viewBox", "0 0 36 36"), d.setAttribute("aria-hidden", "true");
      const b = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "circle");
      b.setAttribute("class", "blora-progress__ring-track"), b.setAttribute("cx", "18"), b.setAttribute("cy", "18"), b.setAttribute("r", "15.5");
      const p = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "circle");
      p.setAttribute("class", "blora-progress__ring-fill"), p.setAttribute("cx", "18"), p.setAttribute("cy", "18"), p.setAttribute("r", "15.5"), p.style.strokeDashoffset = String(100 - t);
      const h = this.getAttribute("variant");
      h && (p.dataset.variant = h), d.append(b, p);
      const m = this.ownerDocument.createElement("span");
      m.className = "blora-progress__circular-label", m.dataset.progressLabel = "", m.textContent = `${Math.round(t)}%`, e.append(d, m), this.replaceChildren(e);
      return;
    }
    const a = this.ownerDocument.createElement("div");
    a.className = "blora-progress__label";
    const i = this.ownerDocument.createElement("span");
    i.textContent = this.getAttribute("label") ?? "Progress";
    const s = this.ownerDocument.createElement("span");
    s.dataset.progressLabel = "", s.textContent = `${Math.round(t)}%`, a.append(i, s);
    const o = this.ownerDocument.createElement("div");
    o.className = "blora-progress__bar";
    const c = this.ownerDocument.createElement("div");
    c.className = "blora-progress__fill";
    const u = this.getAttribute("variant");
    u && (c.dataset.variant = u), o.appendChild(c), e.append(a, o), this.replaceChildren(e);
  }
  sync() {
    var s;
    const t = this.querySelector(".blora-progress");
    if (!t) return;
    const e = Math.max(0, Math.min(100, Number(this.getAttribute("value") ?? 0)));
    t.setAttribute("aria-label", this.getAttribute("label") ?? "Progress");
    const r = this.getAttribute("variant"), a = t.querySelector(".blora-progress__fill") ?? t.querySelector(".blora-progress__ring-fill");
    a && (r ? a.dataset.variant = r : delete a.dataset.variant);
    const i = t.querySelector(".blora-progress__label span:not([data-progress-label])");
    i && (i.textContent = this.getAttribute("label") ?? "Progress"), (s = this.controller) == null || s.setValue(e);
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-progress");
    (e = this.controller) == null || e.destroy(), this.controller = t ? Vr(t) : null;
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function qa(n = customElements) {
  !n || n.get(Ht) || n.define(Ht, Yr);
}
const zt = "blora-number-input";
class Wr extends T {
  constructor() {
    super(...arguments);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["name", "value", "min", "max", "step", "label", "disabled"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get value() {
    var t;
    return Number(
      ((t = this.querySelector("input")) == null ? void 0 : t.value) ?? this.getAttribute("value") ?? 0
    );
  }
  set value(t) {
    this.setAttribute("value", String(t));
  }
  focus(t) {
    var e;
    (e = this.querySelector("input")) == null || e.focus(t);
  }
  render() {
    const t = this.ownerDocument, e = t.createElement("div");
    e.className = "blora-number-input", e.dataset.bloraGenerated = "";
    const r = `blora-number-input-${Math.random().toString(36).slice(2, 9)}`, a = this.getAttribute("label");
    if (a) {
      const d = t.createElement("label");
      d.className = "blora-number-input__label", d.htmlFor = r, d.textContent = a, e.appendChild(d);
    }
    const i = t.createElement("div");
    i.className = "blora-number-input__control";
    const s = t.createElement("input");
    s.id = r, s.className = "blora-input blora-number-input__field", s.type = "number", s.name = this.getAttribute("name") ?? "", s.value = this.getAttribute("value") ?? "0";
    for (const d of ["min", "max", "step"]) {
      const b = this.getAttribute(d);
      b !== null && s.setAttribute(d, b);
    }
    s.disabled = this.hasAttribute("disabled");
    const o = t.createElement("div");
    o.className = "blora-number-input__actions";
    const c = this.makeButton("减少", "minus", -1), u = this.makeButton("增加", "plus", 1);
    o.append(c, u), i.append(s, o), e.appendChild(i), this.replaceChildren(e);
  }
  makeButton(t, e, r) {
    const a = this.ownerDocument.createElement("button");
    return a.type = "button", a.className = "blora-number-input__button", a.dataset.direction = String(r), a.disabled = this.hasAttribute("disabled"), a.setAttribute("aria-label", t), a.appendChild(O(e, 14, this.ownerDocument)), a;
  }
  sync() {
    const t = this.querySelector("input");
    if (!t) return;
    t.name = this.getAttribute("name") ?? "", document.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value);
    for (const r of ["min", "max", "step"]) {
      const a = this.getAttribute(r);
      a !== null ? t.setAttribute(r, a) : t.removeAttribute(r);
    }
    t.disabled = this.hasAttribute("disabled");
    const e = this.querySelector(".blora-number-input__label");
    e && (e.textContent = this.getAttribute("label") ?? ""), this.querySelectorAll(".blora-number-input__button").forEach((r) => {
      r.disabled = this.hasAttribute("disabled");
    });
  }
  bindEvents() {
    const t = this.querySelector("input");
    t && (this.listen(t, "change", () => this.reflectValue(t)), this.querySelectorAll(".blora-number-input__button").forEach((e) => {
      this.listen(e, "click", () => {
        Number(e.dataset.direction) > 0 ? t.stepUp() : t.stepDown(), this.reflectValue(t);
      });
    }));
  }
  reflectValue(t) {
    this.reflecting = !0, this.setAttribute("value", t.value), this.reflecting = !1, this.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
}
function Ta(n = customElements) {
  !n || n.get(zt) || n.define(zt, Wr);
}
const Ft = "blora-swap";
class Ur extends T {
  constructor() {
    super(...arguments);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["name", "checked", "disabled", "on-label", "off-label", "on-icon", "off-icon"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get checked() {
    var t;
    return ((t = this.querySelector("input")) == null ? void 0 : t.checked) ?? !1;
  }
  set checked(t) {
    this.toggleAttribute("checked", t);
  }
  focus(t) {
    var e;
    (e = this.querySelector("input")) == null || e.focus(t);
  }
  render() {
    const t = this.ownerDocument, e = t.createElement("label");
    e.className = "blora-swap", e.dataset.bloraGenerated = "";
    const r = t.createElement("input");
    r.type = "checkbox", r.name = this.getAttribute("name") ?? "", r.checked = this.hasAttribute("checked"), r.disabled = this.hasAttribute("disabled");
    const a = t.createElement("span");
    a.className = "blora-swap__visual", a.setAttribute("aria-hidden", "true");
    const i = this.hasAttribute("checked"), s = this.getAttribute(i ? "on-icon" : "off-icon") ?? (i ? "sun" : "moon");
    a.appendChild(O(s, 18, t));
    const o = t.createElement("span");
    o.className = "blora-swap__label", o.textContent = this.getAttribute(i ? "on-label" : "off-label") ?? (i ? "已开启" : "已关闭"), e.append(r, a, o), this.replaceChildren(e);
  }
  sync() {
    const t = this.querySelector("input");
    if (!t) return;
    t.name = this.getAttribute("name") ?? "", t.checked = this.hasAttribute("checked"), t.disabled = this.hasAttribute("disabled");
    const e = t.checked, r = this.querySelector(".blora-swap__visual");
    r && r.replaceChildren(
      O(
        this.getAttribute(e ? "on-icon" : "off-icon") ?? (e ? "sun" : "moon"),
        18,
        this.ownerDocument
      )
    );
    const a = this.querySelector(".blora-swap__label");
    a && (a.textContent = this.getAttribute(e ? "on-label" : "off-label") ?? (e ? "已开启" : "已关闭"));
  }
  bindEvents() {
    const t = this.querySelector("input");
    t && this.listen(t, "change", () => {
      this.reflecting = !0, this.toggleAttribute("checked", t.checked), this.reflecting = !1, this.sync(), this.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
  }
}
function Ma(n = customElements) {
  !n || n.get(Ft) || n.define(Ft, Ur);
}
const Vt = "blora-pagination";
function Kr(n, l, t = 7) {
  const e = Math.max(1, Math.floor(l)), r = Math.max(1, Math.min(e, Math.floor(n))), a = Math.max(5, Math.floor(t));
  if (e <= a) return Array.from({ length: e }, (u, d) => d + 1);
  const i = Math.max(1, Math.floor((a - 3) / 2)), s = /* @__PURE__ */ new Set([1, e, r]);
  for (let u = 1; u <= i; u += 1)
    s.add(r - u), s.add(r + u);
  let o = Array.from(s).filter((u) => u >= 1 && u <= e).sort((u, d) => u - d);
  for (; o.length < a; ) {
    const u = o[1] ?? 1, d = o.at(-2) ?? e;
    if (u > 2) s.add(u - 1);
    else if (d < e - 1) s.add(d + 1);
    else break;
    o = Array.from(s).filter((b) => b >= 1 && b <= e).sort((b, p) => b - p);
  }
  const c = [];
  return o.slice(0, a).forEach((u, d, b) => {
    d > 0 && u - b[d - 1] > 1 && c.push("ellipsis"), c.push(u);
  }), c;
}
function Xr(n) {
  if (typeof document > "u") return { destroy: () => {
  } };
  const l = () => Array.from(
    n.querySelectorAll(
      ".blora-pagination__item:not(.blora-pagination__nav):not(.blora-pagination__ellipsis)"
    )
  ).filter((a) => a.tagName === "BUTTON"), t = (a) => {
    l().forEach((i) => {
      i.removeAttribute("aria-current"), i.classList.remove("is-active");
    }), a.setAttribute("aria-current", "page"), a.classList.add("is-active"), n.dispatchEvent(
      new CustomEvent("blora-change", {
        bubbles: !0,
        detail: { page: Number(a.dataset.page ?? a.textContent) }
      })
    ), e();
  }, e = () => {
    var u, d;
    const a = Number(((u = n.querySelector('[aria-current="page"]')) == null ? void 0 : u.dataset.page) ?? 1), i = Number(n.dataset.total ?? ((d = l().at(-1)) == null ? void 0 : d.dataset.page) ?? 1), s = n.querySelector(
      '.blora-pagination__nav[aria-label*="上一"], .blora-pagination__nav:first-of-type'
    ), o = n.querySelectorAll(".blora-pagination__nav"), c = o[o.length - 1];
    s && (s.disabled = a <= 1), c && c !== s && (c.disabled = a >= i);
  }, r = (a) => {
    var h;
    const i = a.target, s = i.closest(
      ".blora-pagination__item:not(.blora-pagination__nav)"
    );
    if (s && n.contains(s) && s.tagName === "BUTTON") {
      t(s);
      return;
    }
    const o = i.closest(".blora-pagination__nav");
    if (!o || !n.contains(o)) return;
    const c = Number(((h = n.querySelector('[aria-current="page"]')) == null ? void 0 : h.dataset.page) ?? 1), u = Number(n.dataset.total ?? 1), d = (o.getAttribute("aria-label") || "").toLowerCase(), p = d.includes("上") || d.includes("prev") || o === n.querySelector(".blora-pagination__nav") ? c - 1 : c + 1;
    p < 1 || p > u || n.dispatchEvent(new CustomEvent("blora-change", { bubbles: !0, detail: { page: p } }));
  };
  return n.addEventListener("click", r), e(), {
    destroy() {
      n.removeEventListener("click", r);
    }
  };
}
class Qr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
  }
  static get observedAttributes() {
    return ["page", "total", "max-visible", "label", "disabled"];
  }
  attributeChangedCallback(t) {
    if (this.isConnectedInternal) {
      if (t === "disabled") {
        this.querySelectorAll("button").forEach((e) => {
          e.disabled = this.hasAttribute("disabled");
        });
        return;
      }
      this.render(), this.rebind();
    }
  }
  get page() {
    var t;
    return Number(
      ((t = this.querySelector('[aria-current="page"]')) == null ? void 0 : t.textContent) ?? this.getAttribute("page") ?? 1
    );
  }
  set page(t) {
    this.setAttribute("page", String(t));
  }
  render() {
    const t = Math.max(1, Number(this.getAttribute("total") ?? 1)), e = Math.max(1, Math.min(t, Number(this.getAttribute("page") ?? 1))), r = this.ownerDocument.createElement("nav");
    r.className = "blora-pagination", r.dataset.bloraGenerated = "", r.dataset.total = String(t), r.setAttribute("aria-label", this.getAttribute("label") ?? "Pagination"), r.appendChild(this.createNav("上一页", "chevron-left"));
    const a = Number(this.getAttribute("max-visible") ?? 7);
    for (const i of Kr(e, t, a)) {
      if (i === "ellipsis") {
        const o = this.ownerDocument.createElement("span");
        o.className = "blora-pagination__ellipsis", o.setAttribute("aria-hidden", "true"), o.textContent = "…", r.appendChild(o);
        continue;
      }
      const s = this.ownerDocument.createElement("button");
      s.type = "button", s.className = "blora-pagination__item", s.textContent = String(i), s.dataset.page = String(i), s.setAttribute("aria-label", `第 ${i} 页`), s.disabled = this.hasAttribute("disabled"), i === e && s.setAttribute("aria-current", "page"), r.appendChild(s);
    }
    r.appendChild(this.createNav("下一页", "chevron-right")), this.replaceChildren(r);
  }
  bindEvents() {
    const t = this.querySelector(".blora-pagination");
    t && (this.controller = Xr(t), this.listen(t, "blora-change", (e) => {
      const r = e.detail.page;
      this.setAttribute("page", String(r));
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
  createNav(t, e) {
    const r = this.ownerDocument.createElement("button");
    return r.type = "button", r.className = "blora-pagination__item blora-pagination__nav", r.setAttribute("aria-label", t), r.disabled = this.hasAttribute("disabled"), r.appendChild(O(e, 18, this.ownerDocument)), r;
  }
}
function Ba(n = customElements) {
  !n || n.get(Vt) || n.define(Vt, Qr);
}
const Yt = "blora-color-picker", Wt = (n, l, t) => Math.max(l, Math.min(t, n)), J = (n) => {
  let l = String(n || "").trim();
  return l && !l.startsWith("#") && (l = "#" + l), /^#[0-9a-f]{3}$/i.test(l) && (l = "#" + l.slice(1).split("").map((t) => t + t).join("")), /^#[0-9a-f]{6}$/i.test(l) ? l.toUpperCase() : null;
}, Ut = (n) => {
  const l = J(n) || "#000000", t = parseInt(l.slice(1, 3), 16) / 255, e = parseInt(l.slice(3, 5), 16) / 255, r = parseInt(l.slice(5, 7), 16) / 255, a = Math.max(t, e, r), i = Math.min(t, e, r), s = a - i;
  let o = 0;
  return s && (a === t ? o = 60 * ((e - r) / s % 6) : a === e ? o = 60 * ((r - t) / s + 2) : o = 60 * ((t - e) / s + 4)), o < 0 && (o += 360), { h: o, s: a ? s / a : 0, v: a };
}, jr = ({ h: n, s: l, v: t }) => {
  const e = t * l, r = e * (1 - Math.abs(n / 60 % 2 - 1)), a = t - e;
  return "#" + (n < 60 ? [e, r, 0] : n < 120 ? [r, e, 0] : n < 180 ? [0, e, r] : n < 240 ? [0, r, e] : n < 300 ? [r, 0, e] : [e, 0, r]).map(
    (s) => Math.round((s + a) * 255).toString(16).padStart(2, "0")
  ).join("").toUpperCase();
};
function Jr(n) {
  const l = n.querySelector(".blora-color-swatch");
  let t = n.querySelector(".blora-color-panel");
  if (!l) return { destroy: () => {
  } };
  t || (t = document.createElement("div"), t.className = "blora-color-panel", n.appendChild(t));
  let e = t.querySelector(".blora-color-spectrum");
  if (!e) {
    e = document.createElement("div"), e.className = "blora-color-spectrum", e.tabIndex = 0, e.setAttribute("role", "slider"), e.setAttribute("aria-label", "颜色饱和度与明度");
    const A = document.createElement("span");
    A.className = "blora-color-spectrum__cursor", A.setAttribute("aria-hidden", "true"), e.appendChild(A), t.insertBefore(e, t.firstChild);
  }
  const r = e.querySelector(".blora-color-spectrum__cursor");
  let a = t.querySelector(".blora-color-hue");
  a || (a = document.createElement("input"), a.className = "blora-color-hue", a.type = "range", a.min = "0", a.max = "359", a.step = "1", a.setAttribute("aria-label", "色相"), e.insertAdjacentElement("afterend", a));
  let i = t.querySelector(".blora-color-hex");
  if (!i) {
    const A = document.createElement("div");
    A.className = "blora-color-custom";
    const L = document.createElement("span");
    L.className = "blora-color-preview", i = document.createElement("input"), i.className = "blora-input blora-color-hex", i.type = "text", i.placeholder = "#RRGGBB", A.append(L, i), t.appendChild(A);
  }
  const s = t.querySelector(".blora-color-preview");
  let o = J(l.dataset.color || "") || J(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--blora-color-action-primary-default"
    )
  ) || "#3B82F6", c = Ut(o);
  const u = "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)", d = () => {
    const A = Math.round(c.h);
    e.style.background = `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${A} 100% 50%)`, a.style.background = u;
  }, b = (A = !1) => {
    o = jr(c), l.style.background = o, l.dataset.color = o, l.setAttribute("aria-label", `选择颜色，当前 ${o}`), d(), a.value = String(Math.round(c.h)), r.style.left = c.s * 100 + "%", r.style.top = (1 - c.v) * 100 + "%", s && (s.style.background = o), i && document.activeElement !== i && (i.value = o), A && n.dispatchEvent(
      new CustomEvent("blora:change", {
        bubbles: !0,
        detail: { value: o, hsv: { ...c } }
      })
    );
  }, p = (A, L, M = !0) => {
    const f = e.getBoundingClientRect();
    c.s = Wt((A - f.left) / f.width, 0, 1), c.v = 1 - Wt((L - f.top) / f.height, 0, 1), b(M);
  }, h = (A) => {
    A.preventDefault(), e.focus(), e.setPointerCapture(A.pointerId), p(A.clientX, A.clientY);
  }, m = (A) => {
    e.hasPointerCapture(A.pointerId) && p(A.clientX, A.clientY);
  }, C = () => {
    c.h = Number(a.value), b(!0);
  }, v = () => {
    const A = J(i.value);
    i.setAttribute("aria-invalid", String(!A)), A && (c = Ut(A), b(!0));
  }, g = () => {
    t.removeAttribute("data-align-end"), t.setAttribute("data-open", ""), l.setAttribute("aria-expanded", "true"), t.getBoundingClientRect().right > window.innerWidth - 8 && t.setAttribute("data-align-end", ""), b();
  }, N = () => {
    t.removeAttribute("data-open"), l.setAttribute("aria-expanded", "false");
  }, D = (A) => {
    A.stopPropagation(), t.hasAttribute("data-open") ? N() : g();
  }, w = (A) => {
    n.contains(A.target) || N();
  }, x = (A) => {
    A.key === "Escape" && N();
  };
  return l.setAttribute("role", "button"), l.tabIndex = 0, l.setAttribute("aria-haspopup", "dialog"), l.setAttribute("aria-expanded", "false"), e.addEventListener("pointerdown", h), e.addEventListener("pointermove", m), a.addEventListener("input", C), i.addEventListener("input", v), l.addEventListener("click", D), document.addEventListener("click", w), document.addEventListener("keydown", x), b(), {
    destroy() {
      e.removeEventListener("pointerdown", h), e.removeEventListener("pointermove", m), a.removeEventListener("input", C), i.removeEventListener("input", v), l.removeEventListener("click", D), document.removeEventListener("click", w), document.removeEventListener("keydown", x);
    }
  };
}
class Zr extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["value", "label", "disabled"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get value() {
    var t;
    return ((t = this.querySelector(".blora-color-swatch")) == null ? void 0 : t.dataset.color) ?? "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  open() {
    var t;
    this.hasAttribute("disabled") || (t = this.querySelector(".blora-color-swatch")) == null || t.click();
  }
  close() {
    const t = this.querySelector(".blora-color-panel"), e = this.querySelector(".blora-color-swatch");
    t == null || t.removeAttribute("data-open"), e == null || e.setAttribute("aria-expanded", "false");
  }
  render() {
    const t = J(this.getAttribute("value") ?? "") ?? "#3B82F6", e = this.ownerDocument.createElement("div");
    e.className = "blora-color-picker", e.dataset.bloraGenerated = "";
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-color-swatch", r.dataset.color = t, r.style.background = t, r.setAttribute("aria-label", this.getAttribute("label") ?? `选择颜色，当前 ${t}`), this.hasAttribute("disabled") && r.setAttribute("aria-disabled", "true");
    const a = this.ownerDocument.createElement("div");
    a.className = "blora-color-panel", a.setAttribute("role", "dialog");
    const i = this.ownerDocument.createElement("div");
    i.className = "blora-color-spectrum", i.tabIndex = 0, i.setAttribute("role", "slider"), i.setAttribute("aria-label", "颜色饱和度与明度");
    const s = this.ownerDocument.createElement("span");
    s.className = "blora-color-spectrum__cursor", s.setAttribute("aria-hidden", "true"), i.appendChild(s);
    const o = this.ownerDocument.createElement("input");
    o.className = "blora-color-hue", o.type = "range", o.min = "0", o.max = "359", o.step = "1", o.setAttribute("aria-label", "色相");
    const c = this.ownerDocument.createElement("div");
    c.className = "blora-color-custom";
    const u = this.ownerDocument.createElement("span");
    u.className = "blora-color-preview", u.style.background = t;
    const d = this.ownerDocument.createElement("input");
    d.className = "blora-input blora-color-hex", d.type = "text", d.value = t, d.placeholder = "#RRGGBB", c.append(u, d), a.append(i, o, c), e.append(r, a), this.replaceChildren(e);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-color-picker");
    !t || this.hasAttribute("disabled") || (this.controller = Jr(t), this.listen(t, "blora:change", (e) => {
      const r = e.detail.value;
      this.reflecting = !0, this.setAttribute("value", r), this.reflecting = !1;
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Ia(n = customElements) {
  !n || n.get(Yt) || n.define(Yt, Zr);
}
const Kt = "blora-autocomplete";
function tn(n) {
  const l = n.ownerDocument, t = n.querySelector("input");
  if (!t) return { destroy: () => {
  } };
  const e = n.dataset.options ?? "[]";
  let r = [];
  try {
    r = JSON.parse(e);
  } catch {
    r = [];
  }
  let a = n.querySelector(".blora-autocomplete__menu");
  a || (a = l.createElement("div"), a.className = "blora-autocomplete__menu", n.appendChild(a));
  const i = a;
  let s = -1;
  const o = (h) => {
    const m = h ? r.filter((C) => C.toLowerCase().includes(h.toLowerCase())) : r;
    if (m.length === 0 || !h) {
      i.removeAttribute("data-open"), i.replaceChildren();
      return;
    }
    i.setAttribute("data-open", ""), i.replaceChildren(
      ...m.map((C, v) => {
        const g = l.createElement("div");
        return g.className = "blora-autocomplete__option", g.dataset.idx = String(v), g.setAttribute("role", "option"), g.textContent = C, g;
      })
    ), s = -1;
  }, c = (h) => {
    t.value = h, i.removeAttribute("data-open"), i.replaceChildren(), n.dispatchEvent(
      new CustomEvent("blora-autocomplete-change", {
        bubbles: !0,
        detail: { value: h }
      })
    );
  }, u = () => o(t.value), d = (h) => {
    if (!i.hasAttribute("data-open")) return;
    const m = Array.from(i.querySelectorAll(".blora-autocomplete__option"));
    if (h.key === "ArrowDown")
      h.preventDefault(), s = Math.min(s + 1, m.length - 1), m.forEach((C, v) => C.toggleAttribute("data-active", v === s));
    else if (h.key === "ArrowUp")
      h.preventDefault(), s = Math.max(s - 1, 0), m.forEach((C, v) => C.toggleAttribute("data-active", v === s));
    else if (h.key === "Enter") {
      h.preventDefault();
      const C = m[s];
      C && c(C.textContent ?? "");
    } else h.key === "Escape" && i.removeAttribute("data-open");
  }, b = (h) => {
    const m = h.target.closest(".blora-autocomplete__option");
    m && c(m.textContent ?? "");
  }, p = (h) => {
    n.contains(h.target) || i.removeAttribute("data-open");
  };
  return t.addEventListener("input", u), t.addEventListener("keydown", d), a.addEventListener("click", b), l.addEventListener("click", p), {
    destroy() {
      t.removeEventListener("input", u), t.removeEventListener("keydown", d), i.removeEventListener("click", b), l.removeEventListener("click", p);
    }
  };
}
class en extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["options", "label", "placeholder", "value", "disabled"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get value() {
    var t;
    return ((t = this.querySelector("input")) == null ? void 0 : t.value) ?? this.getAttribute("value") ?? "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((c) => c.localName === "blora-autocomplete-option").map((c) => {
      var u, d;
      return {
        disabled: c.hasAttribute("disabled"),
        label: c.getAttribute("label") ?? ((u = c.textContent) == null ? void 0 : u.trim()) ?? "",
        value: c.getAttribute("value") ?? ((d = c.textContent) == null ? void 0 : d.trim()) ?? ""
      };
    }).filter((c) => c.value && !c.disabled));
    const t = this.getAttribute("options") ?? this.getAttribute("data-options");
    let e = this.definitions.map((c) => c.label || c.value);
    if (t)
      try {
        const c = JSON.parse(t);
        Array.isArray(c) && (e = c.map(String));
      } catch {
        e = [];
      }
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-autocomplete", r.dataset.bloraGenerated = "", r.dataset.options = JSON.stringify(e);
    const a = this.getAttribute("label");
    if (a) {
      const c = this.ownerDocument.createElement("label");
      c.className = "blora-label", c.textContent = a, r.appendChild(c);
    }
    const i = this.ownerDocument.createElement("div");
    i.className = "blora-autocomplete__control";
    const s = this.ownerDocument.createElement("input");
    s.className = "blora-input", s.type = "search", s.autocomplete = "off", s.placeholder = this.getAttribute("placeholder") ?? "", s.value = this.getAttribute("value") ?? "", s.disabled = this.hasAttribute("disabled"), s.setAttribute("role", "combobox"), s.setAttribute("aria-autocomplete", "list");
    const o = this.ownerDocument.createElement("div");
    o.className = "blora-autocomplete__menu", o.setAttribute("role", "listbox"), i.append(s, o), r.appendChild(i), this.replaceChildren(r);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-autocomplete");
    !t || this.hasAttribute("disabled") || (this.controller = tn(t), this.listen(t, "blora-autocomplete-change", (e) => {
      const r = e.detail.value;
      this.reflecting = !0, this.setAttribute("value", r), this.reflecting = !1;
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Oa(n = customElements) {
  !n || n.get(Kt) || n.define(Kt, en);
}
const Xt = "blora-mentions", rn = [
  { value: "alice", label: "alice" },
  { value: "bob", label: "bob" },
  { value: "carol", label: "carol" },
  { value: "dave", label: "dave" }
], K = "data-blora-mentions-owner";
let nn = 0;
function ke(n) {
  try {
    const l = JSON.parse(n);
    return Array.isArray(l) ? l.map((t) => {
      if (typeof t == "string")
        return { value: t, label: t };
      if (t && typeof t == "object") {
        const e = t, r = String(e.value ?? e.name ?? e.id ?? e.label ?? "").trim();
        if (!r) return null;
        const a = {
          value: r,
          label: String(e.label ?? e.name ?? r)
        };
        return e.initials != null && (a.initials = String(e.initials)), e.avatar != null && (a.avatar = String(e.avatar)), (e.avatarVariant === "primary" || e.avatarVariant === "neutral" || e.avatarVariant === "info" || e.avatarVariant === "success" || e.avatarVariant === "contrast") && (a.avatarVariant = e.avatarVariant), e.tag != null ? a.tag = String(e.tag) : e.description != null && (a.tag = String(e.description)), e.keywords != null && (a.keywords = String(e.keywords)), a;
      }
      return null;
    }).filter((t) => !!t) : [];
  } catch {
    return [];
  }
}
function an(n) {
  return [n.value, n.label, n.tag, n.keywords, n.initials].filter(Boolean).join(" ");
}
function sn(n) {
  if (n.initials) return n.initials.slice(0, 2);
  const l = (n.label || n.value).trim();
  return l ? /^[\w.-]+$/.test(l) ? l.slice(0, 2).toUpperCase() : l.slice(0, 2) : "?";
}
function on(n, l) {
  n.querySelectorAll(`.blora-mentions__menu[${K}]`).forEach((t) => {
    const e = t.getAttribute(K);
    if (l && e === l) return;
    e && n.querySelector(`[data-blora-mentions-id="${CSS.escape(e)}"]`) || t.remove();
  });
}
function ln(n) {
  const l = n.querySelector("textarea, input");
  if (!l) return { destroy: () => {
  } };
  const t = n.ownerDocument, e = n.getAttribute("data-options") || n.dataset.options || l.getAttribute("data-options") || "[]";
  let r = ke(e);
  r.length === 0 && (r = rn.map((f) => ({ ...f })));
  let a = n.getAttribute("data-blora-mentions-id");
  a || (a = `mn-${++nn}-${Date.now().toString(36)}`, n.setAttribute("data-blora-mentions-id", a)), n.setAttribute(K, a);
  const i = n.__bloraMentionsDestroy;
  if (typeof i == "function")
    try {
      i();
    } catch {
    }
  t.querySelectorAll(`.blora-mentions__menu[${K}="${a}"]`).forEach((f) => f.remove()), on(t, a);
  let s = n.querySelector(".blora-mentions__menu") || t.querySelector(`.blora-mentions__menu[${K}="${a}"]`);
  s || (s = t.createElement("ul"), s.className = "blora-mentions__menu", s.setAttribute("role", "listbox"));
  const o = s;
  o.setAttribute(K, a), o.setAttribute("aria-hidden", "true"), o.style.position = "fixed", o.style.left = "-9999px", o.style.top = "-9999px", o.removeAttribute("data-open"), o.parentElement !== t.body && t.body.appendChild(o);
  let c = 0, u = -1, d = !1;
  const b = (f) => {
    d || (f ? (n.setAttribute("data-open", ""), o.setAttribute("aria-hidden", "false")) : (n.removeAttribute("data-open"), o.removeAttribute("data-open"), o.setAttribute("aria-hidden", "true"), o.removeAttribute("data-placement"), o.style.left = "-9999px", o.style.top = "-9999px", o.style.maxHeight = "", o.style.minWidth = "", o.style.visibility = ""));
  }, p = () => {
    const f = l.getBoundingClientRect(), _ = getComputedStyle(l), E = Number.parseFloat(_.fontSize) || 14, k = (() => {
      const U = _.lineHeight;
      if (!U || U === "normal") return E * 1.4;
      const X = Number.parseFloat(U);
      return Number.isFinite(X) ? X : E * 1.4;
    })(), S = Number.parseFloat(_.paddingLeft) || 0, q = Number.parseFloat(_.paddingTop) || 0, I = Number.parseFloat(_.borderLeftWidth) || 0, B = Number.parseFloat(_.borderTopWidth) || 0;
    if (u < 0)
      return {
        x: f.left + S + I,
        y: f.top + q + B,
        lineH: k
      };
    const R = t.createElement("div");
    R.setAttribute("aria-hidden", "true");
    const P = R.style;
    P.position = "fixed", P.left = `${f.left}px`, P.top = `${f.top}px`, P.visibility = "hidden", P.pointerEvents = "none", P.zIndex = "-1", P.whiteSpace = "pre-wrap", P.wordWrap = "break-word", P.overflowWrap = "break-word", P.overflow = "hidden", P.boxSizing = "border-box", P.width = `${l.clientWidth}px`, P.height = `${l.clientHeight}px`, P.font = _.font, P.fontSize = _.fontSize, P.fontFamily = _.fontFamily, P.fontWeight = _.fontWeight, P.letterSpacing = _.letterSpacing, P.lineHeight = _.lineHeight, P.padding = _.padding, P.borderStyle = _.borderStyle, P.borderWidth = _.borderWidth, P.borderColor = "transparent", P.textAlign = _.textAlign, P.direction = _.direction;
    const Y = l.value.slice(0, Math.max(0, u)), V = t.createTextNode(Y), $ = t.createElement("span");
    $.textContent = "​", R.appendChild(V), R.appendChild($), t.body.appendChild(R), R.scrollTop = l.scrollTop, R.scrollLeft = l.scrollLeft;
    const H = $.getBoundingClientRect();
    t.body.removeChild(R);
    let z = H.left, W = H.top;
    return (!Number.isFinite(z) || z < f.left - 2 || z > f.right + 2) && (z = f.left + S + I), (!Number.isFinite(W) || W < f.top - 2 || W > f.bottom + 2) && (W = f.top + q + B), { x: z, y: W, lineH: k };
  }, h = () => {
    if (d || !t.contains(n)) {
      b(!1);
      return;
    }
    const f = 6, _ = 8, { x: E, y: k, lineH: S } = p();
    o.style.position = "fixed", o.style.right = "auto", o.style.bottom = "auto", o.style.margin = "0", o.style.zIndex = "var(--blora-z-dropdown)", o.style.visibility = "hidden", o.setAttribute("data-open", "");
    const q = Math.min(Math.max(o.offsetWidth || 160, 160), window.innerWidth - _ * 2), I = o.offsetHeight || 120, B = Math.min(I, window.innerHeight * 0.4, 240), R = window.innerHeight - (k + S) - _, P = k - _, Y = Math.min(B, 100), V = R >= Y || R >= P;
    let $ = V ? k + S + f : k - f - B;
    $ < _ && ($ = _), $ + B > window.innerHeight - _ && ($ = Math.max(_, window.innerHeight - _ - B));
    let H = E;
    H + q > window.innerWidth - _ && (H = window.innerWidth - _ - q), H < _ && (H = _), o.dataset.placement = V ? "below" : "above", o.style.left = `${Math.round(H)}px`, o.style.top = `${Math.round($)}px`;
    const z = o.classList.contains("blora-mentions__menu--rich");
    o.style.minWidth = z ? "16rem" : "10rem", o.style.width = "max-content", o.style.maxWidth = z ? `${Math.min(384, window.innerWidth - _ * 2)}px` : `${Math.min(320, window.innerWidth - _ * 2)}px`, o.style.maxHeight = `${Math.round(
      Math.max(80, V ? Math.min(B, R) : Math.min(B, P))
    )}px`, o.style.visibility = "visible";
  }, m = (f, _) => {
    const E = t.createElement("li");
    E.className = "blora-mentions__option", _ && E.setAttribute("data-active", ""), E.setAttribute("role", "option"), E.dataset.name = f.value;
    const k = t.createElement("span");
    if (k.className = "blora-avatar", k.setAttribute("data-size", "sm"), k.setAttribute("data-variant", f.avatarVariant || "info"), k.setAttribute("aria-hidden", "true"), f.avatar) {
      const I = t.createElement("img");
      I.src = f.avatar, I.alt = "", k.appendChild(I);
    } else
      k.textContent = sn(f);
    const S = t.createElement("span");
    S.className = "blora-mentions__meta";
    const q = t.createElement("span");
    if (q.className = "blora-mentions__name", q.textContent = f.label || f.value, S.appendChild(q), E.append(k, S), f.tag) {
      const I = t.createElement("span");
      I.className = "blora-tag blora-mentions__tag", I.setAttribute("data-variant", "neutral"), I.textContent = f.tag, E.append(I);
    }
    return E;
  }, C = (f) => {
    if (d) return;
    const _ = f.toLowerCase(), E = r.filter((S) => !_ || an(S).toLowerCase().includes(_)).slice(0, 8);
    if (E.length === 0) {
      b(!1), o.replaceChildren();
      return;
    }
    c = Math.min(c, E.length - 1);
    const k = E.some((S) => S.avatar || S.initials || S.tag || S.label !== S.value);
    o.classList.toggle("blora-mentions__menu--rich", k), o.replaceChildren(...E.map((S, q) => m(S, q === c))), b(!0), requestAnimationFrame(() => {
      h(), requestAnimationFrame(() => h());
    });
  }, v = (f) => {
    const _ = l.selectionStart ?? l.value.length, E = l.value.substring(0, u), k = l.value.substring(_);
    l.value = `${E}@${f} ${k}`;
    const S = E.length + f.length + 2;
    l.setSelectionRange(S, S), l.focus(), b(!1), l.dispatchEvent(new Event("input", { bubbles: !0 }));
  }, g = () => {
    if (d || !t.contains(n)) {
      b(!1);
      return;
    }
    const f = l.selectionStart ?? 0, E = l.value.substring(0, f).match(/@([\w\u4e00-\u9fa5.-]*)$/);
    if (!E) {
      u = -1, b(!1);
      return;
    }
    u = f - E[0].length;
    const k = E[1] || "";
    c = 0, C(k);
  }, N = () => g(), D = (f) => {
    var k;
    const _ = f;
    if (!n.hasAttribute("data-open")) return;
    const E = o.querySelectorAll(".blora-mentions__option");
    if (E.length)
      if (_.key === "ArrowDown")
        _.preventDefault(), c = (c + 1) % E.length, E.forEach((S, q) => S.toggleAttribute("data-active", q === c));
      else if (_.key === "ArrowUp")
        _.preventDefault(), c = (c - 1 + E.length) % E.length, E.forEach((S, q) => S.toggleAttribute("data-active", q === c));
      else if (_.key === "Enter" || _.key === "Tab") {
        _.preventDefault();
        const S = (k = E[c]) == null ? void 0 : k.dataset.name;
        S && v(S);
      } else _.key === "Escape" && (_.preventDefault(), b(!1));
  }, w = (f) => {
    const _ = f.target.closest(".blora-mentions__option");
    _ != null && _.dataset.name && v(_.dataset.name);
  }, x = () => {
    n.hasAttribute("data-open") && h();
  }, A = (f) => {
    const _ = f;
    (_.key === "ArrowLeft" || _.key === "ArrowRight" || _.key === "Home" || _.key === "End") && g();
  }, L = () => {
    d || (d = !0, l.removeEventListener("input", N), l.removeEventListener("keydown", D), l.removeEventListener("click", g), l.removeEventListener("keyup", A), o.removeEventListener("click", w), window.removeEventListener("scroll", x, !0), window.removeEventListener("resize", x), n.removeAttribute("data-open"), o.remove(), n.__bloraMentionsDestroy === L && delete n.__bloraMentionsDestroy, M.disconnect());
  }, M = new MutationObserver(() => {
    t.contains(n) || L();
  });
  return M.observe(t.body, { childList: !0, subtree: !0 }), l.addEventListener("input", N), l.addEventListener("keydown", D), l.addEventListener("click", g), l.addEventListener("keyup", A), o.addEventListener("click", w), window.addEventListener("scroll", x, !0), window.addEventListener("resize", x), n.__bloraMentionsDestroy = L, { destroy: L };
}
class cn extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "options", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["options", "label", "placeholder", "rows", "value", "disabled"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get value() {
    var t;
    return ((t = this.querySelector("textarea")) == null ? void 0 : t.value) ?? this.getAttribute("value") ?? "";
  }
  set value(t) {
    const e = this.querySelector("textarea");
    e && (e.value = t), this.reflecting = !0, this.setAttribute("value", t), this.reflecting = !1;
  }
  focus() {
    var t;
    (t = this.querySelector("textarea")) == null || t.focus();
  }
  render() {
    this.options || (this.options = Array.from(this.children).filter((s) => s.localName === "blora-mention").map((s) => {
      var m, C;
      const o = s.getAttribute("value") ?? ((m = s.textContent) == null ? void 0 : m.trim()) ?? "", c = {
        value: o,
        label: s.getAttribute("label") ?? ((C = s.textContent) == null ? void 0 : C.trim()) ?? o
      }, u = s.getAttribute("initials"), d = s.getAttribute("avatar"), b = s.getAttribute(
        "avatar-variant"
      ), p = s.getAttribute("tag"), h = s.getAttribute("keywords");
      return u !== null && (c.initials = u), d !== null && (c.avatar = d), b && (c.avatarVariant = b), p !== null && (c.tag = p), h !== null && (c.keywords = h), c;
    }).filter((s) => s.value));
    const t = this.getAttribute("options") ?? this.getAttribute("data-options");
    let e = this.options;
    if (t) {
      const s = ke(t);
      e = s.length ? s : [];
    }
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-mentions", r.dataset.bloraGenerated = "", r.dataset.options = JSON.stringify(e);
    const a = this.getAttribute("label");
    if (a) {
      const s = this.ownerDocument.createElement("label");
      s.className = "blora-label", s.textContent = a, r.appendChild(s);
    }
    const i = this.ownerDocument.createElement("textarea");
    i.className = "blora-textarea", i.rows = Math.max(1, Number(this.getAttribute("rows") ?? 4) || 4), i.placeholder = this.getAttribute("placeholder") ?? "", i.value = this.getAttribute("value") ?? "", i.disabled = this.hasAttribute("disabled"), r.appendChild(i), this.replaceChildren(r);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-mentions"), e = t == null ? void 0 : t.querySelector("textarea");
    !t || !e || this.hasAttribute("disabled") || (this.controller = ln(t), this.listen(e, "input", () => {
      this.reflecting = !0, this.setAttribute("value", e.value), this.reflecting = !1;
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Ra(n = customElements) {
  !n || n.get(Xt) || n.define(Xt, cn);
}
const Qt = "blora-cascader";
function un(n) {
  const l = n.ownerDocument, t = n.dataset.options ?? n.dataset.bloraCascader ?? "[]";
  let e = [];
  try {
    e = JSON.parse(t);
  } catch {
    e = [];
  }
  let r = n.querySelector(".blora-cascader__trigger"), a = n.querySelector(".blora-cascader__panel");
  const i = n.querySelector(".blora-cascader__result");
  r || (r = l.createElement("button"), r.className = "blora-cascader__trigger blora-input", r.type = "button", r.textContent = "请选择", n.prepend(r)), a || (a = l.createElement("div"), a.className = "blora-cascader__panel", n.appendChild(a));
  const s = [], o = (C) => {
    a.replaceChildren(
      ...C.map((v, g) => {
        const N = l.createElement("div");
        return N.className = "blora-cascader__column", v.forEach((D) => {
          const w = s[g] === D.label, x = D.children && D.children.length > 0, A = l.createElement("div");
          if (A.className = "blora-cascader__option", w && A.classList.add("blora-cascader__option--active"), A.dataset.col = String(g), A.dataset.label = D.label, A.textContent = D.label, x) {
            const L = l.createElement("span");
            L.className = "blora-cascader__arrow", L.appendChild(O("chevron-right", 14, l)), A.appendChild(L);
          }
          N.appendChild(A);
        }), N;
      })
    );
  }, c = () => {
    r.textContent = s.length ? s.join(" / ") : "请选择", i && (i.textContent = `已选：${s.join(" / ")}`);
  }, u = () => {
    a.setAttribute("data-open", ""), s.length = 0, o([e]), c();
  }, d = () => {
    a.removeAttribute("data-open");
  }, b = () => a.hasAttribute("data-open"), p = (C) => {
    C.stopPropagation(), b() ? d() : u();
  }, h = (C) => {
    C.stopPropagation();
    const v = C.target.closest(".blora-cascader__option");
    if (!v) return;
    const g = Number(v.dataset.col), N = v.dataset.label;
    s[g] = N, s.length = g + 1;
    let D = e;
    for (let w = 0; w <= g; w++) {
      const x = D.find((A) => A.label === s[w]);
      if (!x) return;
      if (w === g) {
        if (x.children && x.children.length > 0) {
          const A = [];
          let L = e;
          for (let M = 0; M <= g; M++) {
            const f = L.find((_) => _.label === s[M]);
            if (!f) break;
            A.push(L), L = f.children ?? [];
          }
          A.push(x.children), o(A);
        } else
          c(), d(), n.dispatchEvent(
            new CustomEvent("blora-cascader-change", {
              bubbles: !0,
              detail: { value: s.join(" / "), path: [...s] }
            })
          );
        return;
      }
      D = x.children ?? [];
    }
  }, m = () => d();
  return r.addEventListener("click", p), a.addEventListener("click", h), l.addEventListener("click", m), {
    destroy() {
      r.removeEventListener("click", p), a.removeEventListener("click", h), l.removeEventListener("click", m);
    }
  };
}
function Se(n) {
  return n.filter((l) => l.localName === "blora-cascader-option").map((l) => {
    var t;
    return {
      label: l.getAttribute("label") ?? ((t = l.textContent) == null ? void 0 : t.trim()) ?? "",
      children: Se(Array.from(l.children))
    };
  }).filter((l) => l.label).map((l) => {
    var t;
    return (t = l.children) != null && t.length ? l : { label: l.label };
  });
}
class dn extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "options", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["options", "placeholder", "value", "disabled", "show-result"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get value() {
    return this.getAttribute("value") ?? "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  open() {
    var t;
    this.hasAttribute("disabled") || (t = this.querySelector(".blora-cascader__trigger")) == null || t.click();
  }
  close() {
    var t;
    (t = this.querySelector(".blora-cascader__panel")) == null || t.removeAttribute("data-open");
  }
  render() {
    this.options || (this.options = Se(Array.from(this.children)));
    const t = this.getAttribute("options") ?? this.getAttribute("data-options");
    let e = this.options;
    if (t)
      try {
        const s = JSON.parse(t);
        e = Array.isArray(s) ? s : [];
      } catch {
        e = [];
      }
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-cascader", r.dataset.bloraGenerated = "", r.dataset.options = JSON.stringify(e);
    const a = this.ownerDocument.createElement("button");
    a.className = "blora-cascader__trigger blora-input", a.type = "button", a.disabled = this.hasAttribute("disabled"), a.textContent = this.getAttribute("value") || this.getAttribute("placeholder") || "请选择";
    const i = this.ownerDocument.createElement("div");
    if (i.className = "blora-cascader__panel", i.setAttribute("role", "listbox"), r.append(a, i), this.hasAttribute("show-result")) {
      const s = this.ownerDocument.createElement("output");
      s.className = "blora-cascader__result", this.value && (s.textContent = `已选：${this.value}`), r.appendChild(s);
    }
    this.replaceChildren(r);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-cascader");
    !t || this.hasAttribute("disabled") || (this.controller = un(t), this.listen(t, "blora-cascader-change", (e) => {
      const r = e.detail.value;
      this.reflecting = !0, this.setAttribute("value", r), this.reflecting = !1;
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Pa(n = customElements) {
  !n || n.get(Qt) || n.define(Qt, dn);
}
const jt = "blora-tree";
function bn(n) {
  if (typeof document > "u") return { destroy: () => {
  } };
  n.setAttribute("role", "tree");
  const l = (s) => {
    const o = s.style.maxHeight, c = s.style.overflow;
    s.style.maxHeight = "none", s.style.overflow = "visible";
    const u = Math.ceil(Math.max(s.scrollHeight, s.getBoundingClientRect().height, 1));
    return s.style.maxHeight = o, s.style.overflow = c, u;
  }, t = (s, o) => {
    const c = l(o);
    o.style.maxHeight = "0px", s.setAttribute("data-open", ""), s.setAttribute("aria-expanded", "true"), o.offsetHeight, o.style.maxHeight = `${c}px`, o.style.setProperty("--blora-tree-h", `${c}px`);
    const u = (d) => {
      d.propertyName === "max-height" && (o.removeEventListener("transitionend", u), s.hasAttribute("data-open") && (o.style.maxHeight = "none"));
    };
    o.addEventListener("transitionend", u);
  }, e = (s, o) => {
    const c = o.style.maxHeight && o.style.maxHeight !== "none" ? o.scrollHeight : l(o);
    o.style.maxHeight = `${Math.max(c, 1)}px`, o.style.setProperty("--blora-tree-h", `${Math.max(c, 1)}px`), o.offsetHeight, s.removeAttribute("data-open"), s.setAttribute("aria-expanded", "false"), o.style.maxHeight = "0px";
  }, r = (s) => {
    let o = s.parentElement;
    for (; o && o !== n; ) {
      if (o.classList.contains("blora-tree__children")) {
        const c = o.previousElementSibling;
        if (c instanceof HTMLElement && c.hasAttribute("data-open")) {
          const u = l(o);
          o.style.setProperty("--blora-tree-h", `${u}px`), o.style.maxHeight !== "none" && o.style.maxHeight !== "" && (o.style.maxHeight = `${u}px`);
        }
      }
      o = o.parentElement;
    }
  }, a = (s) => {
    var d, b;
    const o = s.target.closest(".blora-tree__node");
    if (!o || !n.contains(o)) return;
    const c = o.nextElementSibling, u = c instanceof HTMLElement && c.classList.contains("blora-tree__children") ? c : null;
    u && (!o.hasAttribute("data-open") ? t(o, u) : e(o, u), requestAnimationFrame(() => r(u))), n.querySelectorAll(".blora-tree__node[data-selected]").forEach((p) => {
      p !== o && (p.removeAttribute("data-selected"), p.setAttribute("aria-selected", "false"));
    }), o.hasAttribute("data-selected") ? (o.removeAttribute("data-selected"), o.setAttribute("aria-selected", "false")) : (o.setAttribute("data-selected", ""), o.setAttribute("aria-selected", "true")), n.dispatchEvent(
      new CustomEvent("blora-tree-change", {
        bubbles: !0,
        detail: {
          value: o.dataset.value ?? ((d = o.textContent) == null ? void 0 : d.trim()) ?? "",
          label: o.dataset.label ?? ((b = o.textContent) == null ? void 0 : b.trim()) ?? "",
          selected: o.hasAttribute("data-selected")
        }
      })
    );
  }, i = (s) => {
    if (s.key !== "Enter" && s.key !== " ") return;
    const o = s.target.closest(".blora-tree__node");
    !o || !n.contains(o) || (s.preventDefault(), o.click());
  };
  return n.querySelectorAll(".blora-tree__node").forEach((s) => {
    s.setAttribute("role", "treeitem"), s.hasAttribute("tabindex") || (s.tabIndex = 0);
    const o = s.nextElementSibling;
    if (o != null && o.classList.contains("blora-tree__children")) {
      const c = s.hasAttribute("data-open");
      if (s.setAttribute("aria-expanded", String(c)), c) {
        const u = o;
        u.style.maxHeight = "none", u.style.setProperty("--blora-tree-h", `${l(u)}px`);
      }
    }
  }), n.addEventListener("click", a), n.addEventListener("keydown", i), {
    destroy() {
      n.removeEventListener("click", a), n.removeEventListener("keydown", i);
    }
  };
}
function hn(n) {
  return Array.from(n.childNodes).filter((l) => l.nodeType === Node.TEXT_NODE).map((l) => l.textContent ?? "").join("").trim();
}
function Ne(n) {
  return n.filter((l) => l.localName === "blora-tree-node").map((l) => {
    const t = l.getAttribute("label") ?? hn(l);
    return {
      children: Ne(Array.from(l.children)),
      label: t,
      open: l.hasAttribute("open"),
      selected: l.hasAttribute("selected"),
      value: l.getAttribute("value") ?? t
    };
  }).filter((l) => l.label);
}
function pn(n, l) {
  l.appendChild(O("chevron-right", 12, n));
}
class mn extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["value"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get value() {
    return this.getAttribute("value") ?? "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  render() {
    this.definitions || (this.definitions = Ne(Array.from(this.children)));
    const t = this.getAttribute("value"), e = this.ownerDocument.createElement("div");
    e.className = "blora-tree", e.dataset.bloraGenerated = "";
    const r = (a, i) => {
      i.forEach((s) => {
        const o = this.ownerDocument.createElement("div");
        o.className = "blora-tree__node", o.dataset.value = s.value, o.dataset.label = s.label, s.open && (o.dataset.open = ""), (s.selected || t === s.value) && (o.dataset.selected = "");
        const c = this.ownerDocument.createElement("span");
        c.className = "blora-tree__toggle", s.children.length ? pn(this.ownerDocument, c) : c.setAttribute("aria-hidden", "true");
        const u = this.ownerDocument.createElement("span");
        if (u.textContent = s.label, o.append(c, u), a.appendChild(o), s.children.length) {
          const d = this.ownerDocument.createElement("div");
          d.className = "blora-tree__children", r(d, s.children), a.appendChild(d);
        }
      });
    };
    r(e, this.definitions), this.replaceChildren(e);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-tree");
    t && (this.controller = bn(t), this.listen(t, "blora-tree-change", (e) => {
      const r = e.detail;
      this.reflecting = !0, r.selected ? this.setAttribute("value", r.value) : this.removeAttribute("value"), this.reflecting = !1;
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function $a(n = customElements) {
  !n || n.get(jt) || n.define(jt, mn);
}
const Jt = "blora-tree-select";
function De(n) {
  try {
    const l = JSON.parse(n || "[]");
    return Array.isArray(l) ? l : [];
  } catch {
    return [];
  }
}
function fn(n) {
  if (typeof document > "u")
    return {
      open: () => {
      },
      close: () => {
      },
      getValue: () => "",
      setValue: () => {
      },
      destroy: () => {
      }
    };
  n.classList.add("blora-treeselect");
  const l = n.ownerDocument, t = n.querySelector(
    "input.blora-input, .blora-treeselect__input, input"
  );
  if (!t)
    return {
      open: () => {
      },
      close: () => {
      },
      getValue: () => "",
      setValue: () => {
      },
      destroy: () => {
      }
    };
  let e = n.querySelector(".blora-treeselect__panel");
  e || (e = l.createElement("div"), e.className = "blora-treeselect__panel", e.setAttribute("role", "listbox"), n.appendChild(e));
  const r = e, a = De(n.getAttribute("data-options") || n.dataset.options || "[]");
  t.readOnly = !0, t.setAttribute("role", "combobox"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-haspopup", "listbox");
  let i = n.getAttribute("data-value") || "", s = t.value || "";
  const o = (m) => {
    n.classList.toggle("is-open", m), n.toggleAttribute("data-open", m), t.setAttribute("aria-expanded", String(m));
  }, c = (m) => {
    m.disabled || (i = String(m.value ?? m.label ?? ""), s = String(m.label ?? m.value ?? ""), t.value = s, n.setAttribute("data-value", i), o(!1), n.dispatchEvent(
      new CustomEvent("blora-treeselect-change", {
        bubbles: !0,
        detail: { value: i, label: s, item: m }
      })
    ));
  }, u = (m, C) => {
    const v = l.createElement("div");
    v.className = "blora-treeselect__node", v.dataset.depth = String(C), m.disabled && v.classList.add("is-disabled");
    const g = !!(m.children && m.children.length), N = l.createElement("span");
    N.className = "blora-treeselect__toggle", N.setAttribute("aria-hidden", "true"), g ? N.appendChild(O("chevron-right", 12, l)) : N.style.visibility = "hidden", v.appendChild(N);
    const D = l.createElement("span");
    D.textContent = m.label || m.value || "", v.appendChild(D);
    const w = l.createElement("div");
    w.className = "blora-treeselect__children", g && m.children.forEach((A) => w.appendChild(u(A, C + 1)));
    const x = l.createElement("div");
    return x.appendChild(v), g && x.appendChild(w), v.addEventListener("click", (A) => {
      if (A.stopPropagation(), m.disabled) return;
      const L = A.target.closest(".blora-treeselect__toggle");
      if (g && (L || m.selectable === !1)) {
        w.classList.toggle("is-open"), N.classList.toggle("is-open");
        return;
      }
      if (g && m.selectable !== !0) {
        w.classList.toggle("is-open"), N.classList.toggle("is-open");
        return;
      }
      c(m);
    }), x;
  };
  (() => {
    r.replaceChildren(...a.map((m) => u(m, 0)));
  })();
  const b = (m) => {
    m.stopPropagation(), o(!n.classList.contains("is-open"));
  }, p = (m) => {
    n.contains(m.target) || o(!1);
  }, h = (m) => {
    m.key === "Escape" && o(!1), m.key === "ArrowDown" && !n.classList.contains("is-open") && (m.preventDefault(), o(!0));
  };
  return t.addEventListener("click", b), t.addEventListener("keydown", h), l.addEventListener("click", p), {
    open: () => o(!0),
    close: () => o(!1),
    getValue: () => i,
    setValue(m, C) {
      i = m, s = C ?? m, t.value = s, n.setAttribute("data-value", i);
    },
    destroy() {
      t.removeEventListener("click", b), t.removeEventListener("keydown", h), l.removeEventListener("click", p), o(!1);
    }
  };
}
function vn(n) {
  return Array.from(n.childNodes).filter((l) => l.nodeType === Node.TEXT_NODE).map((l) => l.textContent ?? "").join("").trim();
}
function Le(n) {
  return n.filter((l) => l.localName === "blora-tree-select-option").map((l) => {
    const t = l.getAttribute("label") ?? vn(l), e = l.getAttribute("selectable"), r = {
      label: t,
      value: l.getAttribute("value") ?? t,
      disabled: l.hasAttribute("disabled")
    };
    e !== null && (r.selectable = e !== "false");
    const a = Le(Array.from(l.children));
    return a.length && (r.children = a), r;
  }).filter((l) => l.label);
}
class gn extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "options", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["options", "label", "placeholder", "value", "disabled"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get value() {
    var t;
    return ((t = this.controller) == null ? void 0 : t.getValue()) ?? this.getAttribute("value") ?? "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  open() {
    var t;
    this.hasAttribute("disabled") || (t = this.controller) == null || t.open();
  }
  close() {
    var t;
    (t = this.controller) == null || t.close();
  }
  render() {
    this.options || (this.options = Le(Array.from(this.children)));
    const t = this.getAttribute("options") ?? this.getAttribute("data-options");
    let e = this.options;
    t && (e = De(t));
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-treeselect", r.dataset.bloraGenerated = "", r.dataset.options = JSON.stringify(e);
    const a = this.getAttribute("value") ?? "";
    a && (r.dataset.value = a);
    const i = this.getAttribute("label");
    if (i) {
      const c = this.ownerDocument.createElement("label");
      c.className = "blora-label", c.textContent = i, r.appendChild(c);
    }
    const s = this.ownerDocument.createElement("input");
    s.className = "blora-input blora-treeselect__input", s.type = "text", s.placeholder = this.getAttribute("placeholder") ?? "", s.value = a, s.disabled = this.hasAttribute("disabled");
    const o = this.ownerDocument.createElement("div");
    o.className = "blora-treeselect__panel", o.setAttribute("role", "listbox"), r.append(s, o), this.replaceChildren(r);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-treeselect");
    !t || this.hasAttribute("disabled") || (this.controller = fn(t), this.listen(t, "blora-treeselect-change", (e) => {
      const r = e.detail.value;
      this.reflecting = !0, this.setAttribute("value", r), this.reflecting = !1;
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Ga(n = customElements) {
  !n || n.get(Jt) || n.define(Jt, gn);
}
const Zt = "blora-calendar", te = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月"
], An = ["日", "一", "二", "三", "四", "五", "六"], ee = (n, l) => {
  n.replaceChildren(
    O(l === "prev" ? "chevron-left" : "chevron-right", 14, n.ownerDocument)
  );
};
function yn(n) {
  const l = n.ownerDocument, t = /* @__PURE__ */ new Date(), e = n.getAttribute("data-value"), r = e ? /* @__PURE__ */ new Date(`${e}T00:00:00`) : null, a = r && !Number.isNaN(r.getTime()) ? r : null;
  let i = (a == null ? void 0 : a.getFullYear()) ?? t.getFullYear(), s = (a == null ? void 0 : a.getMonth()) ?? t.getMonth(), o = "days", c = a ?? new Date(t.getFullYear(), t.getMonth(), t.getDate());
  const u = (h, m, C) => {
    const v = l.createElement(h);
    return m && (v.className = m), C != null && (v.textContent = C), v;
  }, d = () => {
    n.replaceChildren();
    const h = u("div", "blora-calendar__head"), m = u("div", "blora-calendar__navs"), C = u("button", "blora-calendar__nav");
    C.setAttribute("type", "button"), C.setAttribute("data-nav", "prev"), C.setAttribute("aria-label", "上一个"), ee(C, "prev");
    const v = u("button", "blora-calendar__nav");
    v.setAttribute("type", "button"), v.setAttribute("data-nav", "next"), v.setAttribute("aria-label", "下一个"), ee(v, "next"), m.append(C, v);
    let g = "", N = null;
    if (o === "days")
      g = `${i}年${te[s]}`, N = "months";
    else if (o === "months")
      g = `${i}年`, N = "years";
    else {
      const x = Math.floor(i / 10) * 10;
      g = `${x}–${x + 9}年`;
    }
    const D = u("div", "blora-calendar__title", g);
    N && D.setAttribute("data-zoom", N);
    const w = u("button", "blora-button blora-calendar__today");
    if (w.setAttribute("type", "button"), w.setAttribute("data-variant", "outline"), w.setAttribute("data-size", "sm"), w.setAttribute("data-today", ""), w.textContent = "今天", h.append(m, D, w), n.appendChild(h), o === "days") {
      const x = u("div", "blora-calendar__grid");
      An.forEach((k) => x.appendChild(u("div", "blora-calendar__dow", k)));
      const L = new Date(i, s, 1).getDay(), M = new Date(i, s + 1, 0).getDate(), f = new Date(i, s, 0).getDate();
      for (let k = L - 1; k >= 0; k--) {
        const S = u("div", "blora-calendar__cell", String(f - k));
        S.setAttribute("data-other", ""), x.appendChild(S);
      }
      for (let k = 1; k <= M; k++) {
        const S = new Date(i, s, k), q = u("div", "blora-calendar__cell", String(k));
        q.setAttribute("data-day", String(k)), S.toDateString() === t.toDateString() && q.setAttribute("data-today", ""), c && S.toDateString() === c.toDateString() && q.setAttribute("data-selected", ""), x.appendChild(q);
      }
      const E = (7 - (L + M) % 7) % 7;
      for (let k = 1; k <= E; k++) {
        const S = u("div", "blora-calendar__cell", String(k));
        S.setAttribute("data-other", ""), x.appendChild(S);
      }
      n.appendChild(x);
    } else if (o === "months") {
      const x = u("div", "blora-calendar__grid blora-calendar__grid--months");
      te.forEach((A, L) => {
        const M = u("div", "blora-calendar__cell blora-calendar__cell--month", A);
        M.setAttribute("data-month", String(L)), c && i === c.getFullYear() && L === c.getMonth() && M.setAttribute("data-selected", ""), i === t.getFullYear() && L === t.getMonth() && M.setAttribute("data-today", ""), x.appendChild(M);
      }), n.appendChild(x);
    } else {
      const x = Math.floor(i / 10) * 10, A = u("div", "blora-calendar__grid blora-calendar__grid--years");
      for (let L = x - 1; L <= x + 10; L++) {
        const M = u("div", "blora-calendar__cell blora-calendar__cell--year", String(L));
        M.setAttribute("data-year", String(L)), (L < x || L > x + 9) && M.setAttribute("data-other", ""), c && L === c.getFullYear() && M.setAttribute("data-selected", ""), L === t.getFullYear() && M.setAttribute("data-today", ""), A.appendChild(M);
      }
      n.appendChild(A);
    }
  }, b = (h) => {
    const m = h.target, C = m.closest("[data-nav]");
    if (C) {
      const w = C.dataset.nav === "prev" ? -1 : 1;
      o === "days" ? (s += w, s < 0 ? (s = 11, i--) : s > 11 && (s = 0, i++)) : o === "months" ? i += w : i += w * 10, d();
      return;
    }
    const v = m.closest("[data-zoom]");
    if (v) {
      v.dataset.zoom === "months" ? o = "months" : v.dataset.zoom === "years" && (o = "years"), d();
      return;
    }
    if (m.closest("button[data-today], .blora-calendar__head [data-today]")) {
      c = /* @__PURE__ */ new Date(), i = c.getFullYear(), s = c.getMonth(), o = "days", d(), p();
      return;
    }
    const g = m.closest(".blora-calendar__cell[data-day]");
    if (g) {
      c = new Date(i, s, Number(g.dataset.day)), d(), p();
      return;
    }
    const N = m.closest(".blora-calendar__cell--month[data-month]");
    if (N) {
      s = Number(N.dataset.month), o = "days", d();
      return;
    }
    const D = m.closest(".blora-calendar__cell--year[data-year]");
    D && (i = Number(D.dataset.year), o = "months", d());
  }, p = () => {
    if (!c) return;
    const h = `${c.getFullYear()}-${String(c.getMonth() + 1).padStart(2, "0")}-${String(c.getDate()).padStart(2, "0")}`;
    n.dispatchEvent(
      new CustomEvent("blora-calendar-change", {
        bubbles: !0,
        detail: { value: h, date: new Date(c) }
      })
    );
  };
  return n.addEventListener("click", b), d(), {
    destroy() {
      n.removeEventListener("click", b);
    }
  };
}
class _n extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["value"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get value() {
    return this.getAttribute("value") ?? "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  render() {
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-calendar", t.dataset.bloraGenerated = "";
    const e = this.getAttribute("value");
    e && (t.dataset.value = e), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-calendar");
    if (!t) return;
    const e = this.getAttribute("value");
    e ? t.dataset.value = e : delete t.dataset.value, this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-calendar");
    t && (this.controller = yn(t), this.listen(t, "blora-calendar-change", (e) => {
      const r = e.detail.value;
      this.reflecting = !0, this.setAttribute("value", r), this.reflecting = !1;
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Ha(n = customElements) {
  !n || n.get(Zt) || n.define(Zt, _n);
}
const re = "blora-carousel";
function En(n) {
  const l = n.querySelector(".blora-carousel__track"), t = Array.from(n.querySelectorAll(".blora-carousel__slide")), e = Array.from(n.querySelectorAll(".blora-carousel__dot")), r = n.querySelector(".blora-carousel__arrow--prev"), a = n.querySelector(".blora-carousel__arrow--next");
  if (!l || t.length === 0)
    return { destroy: () => {
    }, next: () => {
    }, prev: () => {
    }, goTo: () => {
    } };
  let i = 0, s = null;
  const o = n.hasAttribute("data-autoplay"), c = t.length - 1, u = 0.2, d = 0.35;
  let b = null;
  const p = (E) => {
    l.classList.toggle("is-dragging", !1), l.toggleAttribute("data-dragging", !1), l.style.transform = `translate3d(${-i * 100}%, 0, 0)`, e.forEach((k, S) => {
      S === i ? k.setAttribute("data-active", "") : k.removeAttribute("data-active");
    });
  }, h = (E) => {
    i = (E % t.length + t.length) % t.length, p(), n.dispatchEvent(
      new CustomEvent("blora-carousel-change", { bubbles: !0, detail: { index: i } })
    );
  }, m = () => h(i + 1), C = () => h(i - 1), v = () => {
    o && (g(), s = setInterval(m, 3500));
  }, g = () => {
    s && (clearInterval(s), s = null);
  }, N = () => n.getBoundingClientRect().width || 1, D = (E) => i === 0 && E > 0 || i === c && E < 0 ? E * 0.35 : E, w = (E) => {
    const k = D(E);
    l.classList.add("is-dragging"), l.setAttribute("data-dragging", ""), l.style.transform = `translate3d(calc(${-i * 100}% + ${k}px), 0, 0)`;
  }, x = (E) => {
    var S;
    if (E.pointerType === "mouse" && E.button !== 0) return;
    const k = E.target;
    if (!((S = k.closest) != null && S.call(
      k,
      ".blora-carousel__arrow, .blora-carousel__dot, a, button, input, textarea, select, label"
    ))) {
      b = {
        x: E.clientX,
        y: E.clientY,
        dx: 0,
        locked: null,
        lx: E.clientX,
        lt: Date.now(),
        vx: 0,
        pointerId: E.pointerId
      };
      try {
        n.setPointerCapture(E.pointerId);
      } catch {
      }
      g();
    }
  }, A = (E) => {
    if (!b || E.pointerId !== b.pointerId) return;
    const k = E.clientX - b.x, S = E.clientY - b.y;
    if (b.locked == null && (Math.abs(k) > 6 || Math.abs(S) > 6) && (b.locked = Math.abs(k) > Math.abs(S) ? "x" : "y", b.locked === "y")) {
      b = null, o && v();
      return;
    }
    if (b.locked !== "x") return;
    E.cancelable && E.preventDefault();
    const q = Date.now(), I = Math.max(1, q - b.lt);
    b.vx = (E.clientX - b.lx) / I, b.lx = E.clientX, b.lt = q, b.dx = k, w(k);
  }, L = (E) => {
    if (!b) return;
    const k = b.dx, S = b.vx, q = b.locked === "x";
    if (b = null, l.classList.remove("is-dragging"), l.removeAttribute("data-dragging"), !q || E)
      p();
    else {
      const I = N();
      let B = i;
      k <= -I * u || S <= -d ? B = i + 1 : (k >= I * u || S >= d) && (B = i - 1), i = Math.max(0, Math.min(c, B)), p();
    }
    o && v();
  }, M = (E) => {
    if (!(!b || E.pointerId !== b.pointerId)) {
      if (b.locked === "x") {
        b.dx = E.clientX - b.x;
        const k = Date.now(), S = Math.max(1, k - b.lt);
        b.vx = (E.clientX - b.lx) / S;
      }
      L(!1);
    }
  }, f = () => L(!0);
  r == null || r.addEventListener("click", C), a == null || a.addEventListener("click", m);
  const _ = e.map((E, k) => {
    const S = () => h(k);
    return E.addEventListener("click", S), { dot: E, fn: S };
  });
  return n.addEventListener("pointerdown", x), n.addEventListener("pointermove", A), n.addEventListener("pointerup", M), n.addEventListener("pointercancel", f), n.style.touchAction = "pan-y", o && (n.addEventListener("mouseenter", g), n.addEventListener("mouseleave", v), v()), h(0), {
    destroy() {
      g(), r == null || r.removeEventListener("click", C), a == null || a.removeEventListener("click", m), _.forEach(({ dot: E, fn: k }) => E.removeEventListener("click", k)), n.removeEventListener("pointerdown", x), n.removeEventListener("pointermove", A), n.removeEventListener("pointerup", M), n.removeEventListener("pointercancel", f), n.removeEventListener("mouseenter", g), n.removeEventListener("mouseleave", v);
    },
    next: m,
    prev: C,
    goTo: h
  };
}
function ne(n, l) {
  const t = n.createElement("button");
  return t.className = `blora-carousel__arrow blora-carousel__arrow--${l}`, t.type = "button", t.setAttribute("aria-label", l === "prev" ? "上一张" : "下一张"), t.appendChild(
    O(l === "prev" ? "chevron-left" : "chevron-right", 18, n)
  ), t;
}
class Cn extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["current", "autoplay", "label"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get current() {
    return Number(this.getAttribute("current") ?? 0);
  }
  set current(t) {
    this.setAttribute("current", String(t));
  }
  next() {
    var t;
    (t = this.controller) == null || t.next();
  }
  prev() {
    var t;
    (t = this.controller) == null || t.prev();
  }
  goTo(t) {
    var e;
    (e = this.controller) == null || e.goTo(t);
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((a) => a.localName === "blora-carousel-slide").map((a) => ({
      label: a.getAttribute("label") ?? "",
      nodes: Array.from(a.childNodes).map((i) => i.cloneNode(!0))
    })));
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-carousel", t.dataset.bloraGenerated = "", t.setAttribute("role", "region"), t.setAttribute("aria-label", this.getAttribute("label") ?? "轮播图"), this.hasAttribute("autoplay") && (t.dataset.autoplay = "");
    const e = this.ownerDocument.createElement("div");
    e.className = "blora-carousel__track", this.definitions.forEach((a, i) => {
      const s = this.ownerDocument.createElement("div");
      s.className = "blora-carousel__slide", s.setAttribute("role", "group"), s.setAttribute(
        "aria-label",
        a.label || `${i + 1} / ${this.definitions.length}`
      ), s.append(...a.nodes.map((o) => o.cloneNode(!0))), e.appendChild(s);
    });
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-carousel__dots", this.definitions.forEach((a, i) => {
      const s = this.ownerDocument.createElement("button");
      s.className = "blora-carousel__dot", s.type = "button", s.setAttribute("aria-label", `转到第 ${i + 1} 张`), r.appendChild(s);
    }), t.append(
      e,
      ne(this.ownerDocument, "prev"),
      ne(this.ownerDocument, "next"),
      r
    ), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-carousel");
    if (!t) return;
    this.controller = En(t);
    const e = Number(this.getAttribute("current") ?? 0);
    e && this.controller.goTo(e), this.listen(t, "blora-carousel-change", (r) => {
      const a = r.detail.index;
      this.reflecting = !0, this.setAttribute("current", String(a)), this.reflecting = !1;
    });
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function za(n = customElements) {
  !n || n.get(re) || n.define(re, Cn);
}
const ae = "blora-deck";
function wn(n) {
  const l = () => Array.from(n.children).filter((w) => w.nodeType === 1);
  if (!l().length)
    return {
      destroy: () => {
      },
      next: () => {
      },
      prev: () => {
      },
      goTo: () => {
      },
      getCurrent: () => 0
    };
  n.hasAttribute("tabindex") || (n.tabIndex = 0);
  const t = 0.72, e = 96, r = 2.35, a = (w, x, A) => Math.min(A, Math.max(x, w)), i = (w, x, A) => {
    let L = w - x;
    return L -= A * Math.round(L / A), L;
  }, s = (w) => {
    const x = Math.abs(w);
    if (x > r)
      return { y: w > 0 ? -t * r : t * r, scale: 0.88, opacity: 0, z: 0 };
    const A = -w * t, L = 1 - a(x, 0, 3) * 0.04, M = x <= 0.15 ? 1 : Math.max(0.28, a(1 - (x - 0.15) / (r - 0.15), 0, 1)), f = Math.round(40 - x * 10);
    return { y: A, scale: L, opacity: M, z: f };
  };
  let o = (() => {
    let x = l().findIndex((A) => A.classList.contains("is-front") || A.hasAttribute("data-front"));
    return x < 0 && (x = 0), x;
  })(), c = null, u = 0, d = 0;
  const b = (w) => {
    const x = l(), A = x.length;
    if (!A) return;
    n.toggleAttribute("data-dragging", w);
    let L = 0, M = 1 / 0;
    x.forEach((f, _) => {
      const E = i(_, o, A), k = s(E);
      f.style.setProperty("--blora-deck-y", k.y + "rem"), f.style.setProperty("--blora-deck-scale", String(k.scale)), f.style.setProperty("--blora-deck-opacity", String(k.opacity)), f.style.zIndex = String(k.z), Math.abs(E) < M && (M = Math.abs(E), L = _);
    }), x.forEach((f, _) => {
      const E = _ === L;
      f.toggleAttribute("data-front", E), f.setAttribute("aria-hidden", String(!E));
    });
  }, p = () => {
    const w = l().length;
    w && (o = Math.round(o), o = (o % w + w) % w, b(!1), n.dispatchEvent(
      new CustomEvent("blora-deck-change", { bubbles: !0, detail: { index: o } })
    ));
  }, h = (w) => {
    l().length && (o = Math.round(o) + w, p());
  }, m = (w) => {
    o = w, p();
  }, C = (w) => {
    if (!(w.pointerType === "mouse" && w.button !== 0)) {
      c = {
        y: w.clientY,
        startOffset: o,
        locked: null,
        ly: w.clientY,
        lt: Date.now(),
        vy: 0,
        pointerId: w.pointerId
      };
      try {
        n.setPointerCapture(w.pointerId);
      } catch {
      }
    }
  }, v = (w) => {
    if (!c || w.pointerId !== c.pointerId) return;
    const x = w.clientY - c.y;
    if (c.locked == null && (Math.abs(x) > 6 || Math.abs(w.movementX) > 6) && (c.locked = Math.abs(x) >= Math.abs(w.movementX) ? "y" : "x", c.locked === "x")) {
      c = null;
      return;
    }
    if (c.locked !== "y") return;
    w.preventDefault();
    const A = Date.now(), L = Math.max(1, A - c.lt);
    c.vy = (w.clientY - c.ly) / L, c.ly = w.clientY, c.lt = A, o = c.startOffset + x / e, b(!0);
  }, g = (w) => {
    if (!c || w.pointerId !== c.pointerId) return;
    const x = c.locked === "y", A = c.vy, L = c.startOffset;
    if (c = null, !x) {
      o = L, b(!1);
      return;
    }
    A <= -0.4 ? o -= 0.55 : A >= 0.4 && (o += 0.55), p();
  }, N = (w) => {
    w.preventDefault();
    const x = Date.now();
    x < d || (u += w.deltaY, Math.abs(u) > 40 && (h(u > 0 ? 1 : -1), u = 0, d = x + 280));
  }, D = (w) => {
    w.key === "ArrowDown" || w.key === "PageDown" ? (w.preventDefault(), h(1)) : (w.key === "ArrowUp" || w.key === "PageUp") && (w.preventDefault(), h(-1));
  };
  return n.addEventListener("pointerdown", C), n.addEventListener("pointermove", v), n.addEventListener("pointerup", g), n.addEventListener("pointercancel", g), n.addEventListener("wheel", N, { passive: !1 }), n.addEventListener("keydown", D), b(!1), {
    destroy() {
      n.removeEventListener("pointerdown", C), n.removeEventListener("pointermove", v), n.removeEventListener("pointerup", g), n.removeEventListener("pointercancel", g), n.removeEventListener("wheel", N), n.removeEventListener("keydown", D);
    },
    next: () => h(1),
    prev: () => h(-1),
    goTo: m,
    getCurrent: () => Math.round(o)
  };
}
class xn extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["current", "label"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get current() {
    var t;
    return ((t = this.controller) == null ? void 0 : t.getCurrent()) ?? Number(this.getAttribute("current") ?? 0);
  }
  set current(t) {
    this.setAttribute("current", String(t));
  }
  next() {
    var t;
    (t = this.controller) == null || t.next();
  }
  prev() {
    var t;
    (t = this.controller) == null || t.prev();
  }
  goTo(t) {
    var e;
    (e = this.controller) == null || e.goTo(t);
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((r) => r.localName === "blora-deck-card").map((r) => ({
      front: r.hasAttribute("front"),
      nodes: Array.from(r.childNodes).map((a) => a.cloneNode(!0)),
      variant: r.getAttribute("variant") ?? "flat"
    })));
    const t = Number(this.getAttribute("current") ?? 0), e = this.ownerDocument.createElement("div");
    e.className = "blora-deck", e.dataset.bloraGenerated = "", e.tabIndex = 0, e.setAttribute("aria-label", this.getAttribute("label") ?? "卡片叠层"), this.definitions.forEach((r, a) => {
      const i = this.ownerDocument.createElement("article");
      i.className = "blora-card", i.dataset.variant = r.variant, (r.front || a === t) && (i.dataset.front = ""), i.append(...r.nodes.map((s) => s.cloneNode(!0))), e.appendChild(i);
    }), this.replaceChildren(e);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-deck");
    if (!t) return;
    this.controller = wn(t);
    const e = Number(this.getAttribute("current") ?? 0);
    e && this.controller.goTo(e), this.listen(t, "blora-deck-change", (r) => {
      const a = r.detail.index;
      this.reflecting = !0, this.setAttribute("current", String(a)), this.reflecting = !1;
    });
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Fa(n = customElements) {
  !n || n.get(ae) || n.define(ae, xn);
}
const ie = "blora-image";
function qe(n) {
  const l = n.getAttribute("data-preview-group") || n.getAttribute("data-blora-preview-group"), t = l ? n.ownerDocument.querySelectorAll(
    `[data-preview-group="${l}"], [data-blora-preview-group="${l}"]`
  ) : [n], e = [];
  let r = 0;
  return Array.from(t).forEach((a, i) => {
    const s = a.matches("img") ? a : a.querySelector("img"), o = a.getAttribute("data-preview-src") || a.getAttribute("href") || (s == null ? void 0 : s.currentSrc) || (s == null ? void 0 : s.src) || "";
    o && ((a === n || a.contains(n) || n.contains(a)) && (r = e.length), e.push({
      src: o,
      alt: (s == null ? void 0 : s.alt) || "",
      caption: a.getAttribute("data-caption") || (s == null ? void 0 : s.alt) || ""
    }));
  }), !e.length && n instanceof HTMLImageElement && e.push({ src: n.src, alt: n.alt, caption: n.alt }), { items: e, start: r };
}
function Te(n, l = 0) {
  if (typeof document > "u" || !n.length) return null;
  const t = document, e = n.map((g) => typeof g == "string" ? { src: g } : g);
  let r = Math.max(0, Math.min(l, e.length - 1));
  const a = t.createElement("div");
  a.className = "blora-image-preview is-open", a.setAttribute("role", "dialog"), a.setAttribute("aria-modal", "true");
  const i = t.createElement("div");
  i.className = "blora-image-preview__stage";
  const s = t.createElement("img");
  s.className = "blora-image-preview__img", s.alt = "";
  const o = t.createElement("div");
  o.className = "blora-image-preview__cap";
  const c = t.createElement("div");
  c.className = "blora-image-preview__count";
  const u = t.createElement("button");
  u.type = "button", u.className = "blora-image-preview__close", u.setAttribute("aria-label", "关闭"), u.appendChild(O("close", 18));
  const d = t.createElement("button");
  d.type = "button", d.className = "blora-image-preview__btn blora-image-preview__btn--prev", d.setAttribute("aria-label", "上一张"), d.appendChild(O("chevron-left", 20));
  const b = t.createElement("button");
  b.type = "button", b.className = "blora-image-preview__btn blora-image-preview__btn--next", b.setAttribute("aria-label", "下一张"), b.appendChild(O("chevron-right", 20)), i.append(s, o), a.append(c, u, d, b, i), t.body.appendChild(a);
  const p = () => {
    const g = e[r];
    s.src = g.src, s.alt = g.alt || "", o.textContent = g.caption || "", c.textContent = e.length > 1 ? `${r + 1} / ${e.length}` : "", d.hidden = e.length < 2, b.hidden = e.length < 2;
  }, h = () => {
    a.classList.remove("is-open"), a.remove(), t.removeEventListener("keydown", v);
  }, m = () => {
    r = (r + 1) % e.length, p();
  }, C = () => {
    r = (r - 1 + e.length) % e.length, p();
  }, v = (g) => {
    g.key === "Escape" && h(), g.key === "ArrowRight" && m(), g.key === "ArrowLeft" && C();
  };
  return u.addEventListener("click", h), d.addEventListener("click", (g) => {
    g.stopPropagation(), C();
  }), b.addEventListener("click", (g) => {
    g.stopPropagation(), m();
  }), a.addEventListener("click", (g) => {
    g.target === a && h();
  }), t.addEventListener("keydown", v), p(), { close: h, next: m, prev: C, el: a };
}
function kn(n) {
  if (typeof document > "u") return { destroy: () => {
  } };
  const l = [], t = (a) => {
    const i = a.querySelector("img");
    if (!i) return;
    const s = () => a.removeAttribute("data-loading");
    if (i.complete && i.naturalWidth > 0) {
      s();
      return;
    }
    a.setAttribute("data-loading", ""), i.addEventListener("load", s), i.addEventListener("error", s), l.push(() => {
      i.removeEventListener("load", s), i.removeEventListener("error", s);
    });
  }, e = (a) => {
    if (!a.hasAttribute("data-blora-preview") && !a.classList.contains("blora-image--preview") && a.getAttribute("data-variant") !== "preview")
      return;
    a.setAttribute("tabindex", a.getAttribute("tabindex") || "0"), a.setAttribute("role", a.getAttribute("role") || "button");
    const i = () => {
      const { items: c, start: u } = qe(a);
      Te(c, u);
    }, s = () => i(), o = (c) => {
      (c.key === "Enter" || c.key === " ") && (c.preventDefault(), i());
    };
    a.addEventListener("click", s), a.addEventListener("keydown", o), l.push(() => {
      a.removeEventListener("click", s), a.removeEventListener("keydown", o);
    });
  }, r = n.matches(".blora-image") ? [n] : Array.from(n.querySelectorAll(".blora-image, [data-blora-preview]"));
  return r.forEach((a) => {
    (a.classList.contains("blora-image") || a.matches(".blora-image")) && t(a), e(a);
  }), r.length || n.querySelectorAll("img").forEach((a) => {
    const i = a.closest(".blora-image");
    i && (t(i), e(i));
  }), {
    destroy() {
      l.forEach((a) => a());
    }
  };
}
class Sn extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "previewHandle", null);
  }
  static get observedAttributes() {
    return ["src", "alt", "caption", "variant", "filter", "preview", "preview-group"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  open() {
    const t = this.querySelector(".blora-image");
    if (!t) return;
    const { items: e, start: r } = qe(t);
    this.previewHandle = Te(e, r);
  }
  close() {
    var t;
    (t = this.previewHandle) == null || t.close(), this.previewHandle = null;
  }
  render() {
    const t = this.ownerDocument.createElement("figure");
    t.className = "blora-image", t.dataset.bloraGenerated = "", t.dataset.variant = this.getAttribute("variant") ?? "default", t.dataset.filter = this.getAttribute("filter") ?? "none", (this.hasAttribute("preview") || t.dataset.variant === "preview") && (t.dataset.bloraPreview = "");
    const e = this.getAttribute("preview-group");
    e && (t.dataset.previewGroup = e);
    const r = this.ownerDocument.createElement("img");
    r.src = this.getAttribute("src") ?? "", r.alt = this.getAttribute("alt") ?? "", r.decoding = "async", t.appendChild(r);
    const a = this.getAttribute("caption");
    if (a) {
      const i = this.ownerDocument.createElement("figcaption");
      i.className = "blora-image__cap", i.textContent = a, t.dataset.caption = a, t.appendChild(i);
    }
    this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-image"), e = t == null ? void 0 : t.querySelector("img");
    if (!t || !e) return;
    t.dataset.variant = this.getAttribute("variant") ?? "default", t.dataset.filter = this.getAttribute("filter") ?? "none", t.toggleAttribute(
      "data-blora-preview",
      this.hasAttribute("preview") || t.dataset.variant === "preview"
    );
    const r = this.getAttribute("preview-group");
    r ? t.dataset.previewGroup = r : delete t.dataset.previewGroup, e.src = this.getAttribute("src") ?? "", e.alt = this.getAttribute("alt") ?? "";
    const a = this.getAttribute("caption");
    let i = t.querySelector("figcaption");
    a ? (i || (i = this.ownerDocument.createElement("figcaption"), i.className = "blora-image__cap", t.appendChild(i)), i.textContent = a, t.dataset.caption = a) : (i == null || i.remove(), delete t.dataset.caption);
  }
  bindEvents() {
    const t = this.querySelector(".blora-image");
    t && (this.controller = kn(t));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null, this.close();
  }
}
function Va(n = customElements) {
  !n || n.get(ie) || n.define(ie, Sn);
}
const se = "blora-dock";
function Nn(n) {
  var u, d, b;
  const l = n.ownerDocument, t = l.defaultView, e = Array.from(n.querySelectorAll(".blora-dock__item"));
  if (!e.length || !t) return { destroy: () => {
  }, getCurrent: () => 0, select: () => {
  } };
  let r = n.querySelector(".blora-dock__indicator");
  r || (r = l.createElement("span"), r.className = "blora-dock__indicator", r.setAttribute("aria-hidden", "true"), n.insertBefore(r, n.firstChild));
  const a = (p) => {
    if (!p || !r) {
      r.style.opacity = "0";
      return;
    }
    const h = n.getBoundingClientRect(), m = p.getBoundingClientRect(), C = m.left - h.left + n.scrollLeft;
    r.style.opacity = "1", r.style.width = `${m.width}px`, r.style.height = `${m.height}px`, r.style.transform = `translate(${C}px, ${m.top - h.top}px)`;
  }, i = (p) => {
    e.forEach((h) => h.removeAttribute("data-active")), p.setAttribute("data-active", ""), a(p), n.dispatchEvent(
      new CustomEvent("blora-dock-change", {
        bubbles: !0,
        detail: { index: e.indexOf(p), value: p.dataset.value ?? "" }
      })
    );
  }, s = (p) => {
    const h = p.target.closest(".blora-dock__item");
    !h || !n.contains(h) || (p.preventDefault(), i(h));
  }, o = e.find((p) => p.hasAttribute("data-active")) ?? e[0];
  o && (i(o), requestAnimationFrame(() => {
    a(o), requestAnimationFrame(() => a(o));
  })), n.addEventListener("click", s);
  const c = () => {
    const p = e.find((h) => h.hasAttribute("data-active"));
    p && a(p);
  };
  return t.addEventListener("resize", c), (b = (d = (u = l.fonts) == null ? void 0 : u.ready) == null ? void 0 : d.then) == null || b.call(d, c), {
    destroy() {
      n.removeEventListener("click", s), t.removeEventListener("resize", c);
    },
    getCurrent: () => e.findIndex((p) => p.hasAttribute("data-active")),
    select(p) {
      const h = e[p];
      h && i(h);
    }
  };
}
class Dn extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["current", "label", "static"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get current() {
    var t;
    return ((t = this.controller) == null ? void 0 : t.getCurrent()) ?? Number(this.getAttribute("current") ?? 0);
  }
  set current(t) {
    this.setAttribute("current", String(t));
  }
  select(t) {
    var e;
    (e = this.controller) == null || e.select(t);
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((r) => r.localName === "blora-dock-item").map((r) => ({
      active: r.hasAttribute("active"),
      href: r.getAttribute("href") ?? "#",
      icon: r.getAttribute("icon"),
      nodes: Array.from(r.childNodes).map((a) => a.cloneNode(!0)),
      value: r.getAttribute("value") ?? ""
    })));
    const t = Number(this.getAttribute("current") ?? 0), e = this.ownerDocument.createElement("nav");
    e.className = "blora-dock", this.hasAttribute("static") && e.classList.add("blora-dock--static"), e.dataset.bloraGenerated = "", e.setAttribute("aria-label", this.getAttribute("label") ?? "底部导航"), this.definitions.forEach((r, a) => {
      const i = this.ownerDocument.createElement("a");
      if (i.className = "blora-dock__item", i.href = r.href, i.dataset.value = r.value, (r.active || a === t) && (i.dataset.active = ""), r.icon) {
        const s = O(r.icon, 20, this.ownerDocument);
        s.childElementCount && i.appendChild(s);
      }
      i.append(...r.nodes.map((s) => s.cloneNode(!0))), e.appendChild(i);
    }), this.replaceChildren(e);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-dock");
    t && (this.controller = Nn(t), this.listen(t, "blora-dock-change", (e) => {
      const r = e.detail.index;
      this.reflecting = !0, this.setAttribute("current", String(r)), this.reflecting = !1;
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Ya(n = customElements) {
  !n || n.get(se) || n.define(se, Dn);
}
const oe = "blora-megamenu";
function Ln(n) {
  if (typeof document > "u")
    return { open: () => {
    }, close: () => {
    }, destroy: () => {
    } };
  const l = n.ownerDocument, t = l.defaultView, e = n.querySelector("[data-blora-megamenu-trigger], .blora-megamenu__trigger") || n.querySelector("button"), r = n.querySelector(".blora-megamenu__panel");
  if (!e || !r || !t)
    return { open: () => {
    }, close: () => {
    }, destroy: () => {
    } };
  r.id || (r.id = `blora-megamenu-${Math.random().toString(36).slice(2, 9)}`), e.setAttribute("aria-controls", r.id), e.setAttribute("aria-haspopup", "true"), e.setAttribute("aria-expanded", "false");
  const a = () => {
    if (!n.hasAttribute("data-open") || typeof t.matchMedia == "function" && t.matchMedia("(max-width: 900px)").matches)
      return;
    r.style.setProperty("--blora-megamenu-offset", "0px");
    const b = r.getBoundingClientRect(), p = parseFloat(t.getComputedStyle(r).getPropertyValue("--blora-space-4")) || 16;
    let h = Math.min(0, t.innerWidth - p - b.right);
    b.left + h < p && (h += p - (b.left + h)), r.style.setProperty("--blora-megamenu-offset", `${h}px`);
  }, i = (b, p = !1) => {
    var h;
    b ? (l.querySelectorAll(
      "[data-blora-megamenu][data-open], .blora-megamenu[data-open]"
    ).forEach((m) => {
      if (m === n) return;
      m.removeAttribute("data-open"), m.classList.remove("is-open");
      const C = m.querySelector(
        "[data-blora-megamenu-trigger], .blora-megamenu__trigger"
      );
      C == null || C.setAttribute("aria-expanded", "false");
    }), n.setAttribute("data-open", ""), n.classList.add("is-open")) : (n.removeAttribute("data-open"), n.classList.remove("is-open")), e.setAttribute("aria-expanded", String(b)), n.dispatchEvent(
      new CustomEvent("blora-megamenu-toggle", { bubbles: !0, detail: { open: b } })
    ), b && t.requestAnimationFrame(a), b && p && ((h = r.querySelector("a, button")) == null || h.focus());
  }, s = (b) => {
    b.stopPropagation(), i(!n.hasAttribute("data-open"));
  }, o = (b) => {
    b.key === "ArrowDown" && (b.preventDefault(), i(!0, !0));
  }, c = (b) => {
    b.key === "Escape" && (b.preventDefault(), i(!1), e.focus());
  }, u = (b) => {
    b.target.closest("a") && i(!1);
  }, d = (b) => {
    n.contains(b.target) || i(!1);
  };
  return e.addEventListener("click", s), e.addEventListener("keydown", o), n.addEventListener("keydown", c), r.addEventListener("click", u), l.addEventListener("click", d), t.addEventListener("resize", a), {
    open: () => i(!0),
    close: () => i(!1),
    destroy() {
      e.removeEventListener("click", s), e.removeEventListener("keydown", o), n.removeEventListener("keydown", c), r.removeEventListener("click", u), l.removeEventListener("click", d), t.removeEventListener("resize", a);
    }
  };
}
class qn extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["label", "open"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  open() {
    var t;
    (t = this.controller) == null || t.open();
  }
  close() {
    var t;
    (t = this.controller) == null || t.close();
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((i) => i.localName === "blora-megamenu-section").map((i) => ({
      nodes: Array.from(i.childNodes).map((s) => s.cloneNode(!0)),
      title: i.getAttribute("title") ?? ""
    })));
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-megamenu", t.dataset.bloraGenerated = "", t.dataset.bloraMegamenu = "";
    const e = this.ownerDocument.createElement("button");
    e.className = "blora-button blora-megamenu__trigger", e.type = "button", e.dataset.variant = "outline", e.dataset.bloraMegamenuTrigger = "", e.textContent = this.getAttribute("label") ?? "浏览产品";
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-megamenu__panel";
    const a = this.ownerDocument.createElement("div");
    a.className = "blora-megamenu__grid", this.definitions.forEach((i) => {
      const s = this.ownerDocument.createElement("div"), o = this.ownerDocument.createElement("div");
      o.className = "blora-megamenu__title", o.textContent = i.title, s.appendChild(o), i.nodes.forEach((c) => {
        const u = c.cloneNode(!0);
        u instanceof this.ownerDocument.defaultView.HTMLAnchorElement && u.classList.add("blora-megamenu__link"), s.appendChild(u);
      }), a.appendChild(s);
    }), r.appendChild(a), t.append(e, r), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-megamenu");
    t && (this.controller = Ln(t), this.listen(t, "blora-megamenu-toggle", (e) => {
      const r = e.detail.open;
      this.reflecting = !0, this.toggleAttribute("open", r), this.reflecting = !1;
    }), this.hasAttribute("open") && this.controller.open());
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Wa(n = customElements) {
  !n || n.get(oe) || n.define(oe, qn);
}
const le = "blora-speed-dial";
function Q(n, l, t) {
  const e = O(l ?? t, 18, n);
  return e.childElementCount ? e : O(t, 18, n);
}
function Tn(n) {
  if (typeof document > "u")
    return { open: () => {
    }, close: () => {
    }, destroy: () => {
    } };
  const l = n.ownerDocument, t = n.querySelector(
    "[data-blora-speed-dial-trigger], .blora-speed-dial__trigger"
  ), e = n.querySelector(".blora-speed-dial__actions"), r = n.querySelector(
    "[data-blora-speed-dial-close], .blora-speed-dial__close"
  ), a = n.querySelector(
    "[data-blora-speed-dial-main], .blora-speed-dial__main"
  );
  if (!t || !e)
    return { open: () => {
    }, close: () => {
    }, destroy: () => {
    } };
  const i = Array.from(
    e.querySelectorAll(".blora-speed-dial__action")
  );
  e.id || (e.id = `blora-sd-actions-${Math.random().toString(36).slice(2, 9)}`), t.setAttribute("aria-haspopup", "menu"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", e.id), e.setAttribute("role", "menu"), e.setAttribute("aria-hidden", "true"), i.forEach((h) => {
    h.setAttribute("role", "menuitem"), h.setAttribute("tabindex", "-1");
  }), r == null || r.setAttribute("tabindex", "-1"), r == null || r.setAttribute("aria-hidden", "true"), a == null || a.setAttribute("tabindex", "-1"), a == null || a.setAttribute("aria-hidden", "true");
  const s = (h, m = !1) => {
    var C;
    h ? (n.setAttribute("data-open", ""), n.classList.add("is-open")) : (n.removeAttribute("data-open"), n.classList.remove("is-open")), t.setAttribute("aria-expanded", String(h)), e.setAttribute("aria-hidden", String(!h)), r == null || r.setAttribute("aria-hidden", String(!h)), a && (a.setAttribute("aria-hidden", String(!h)), a.setAttribute("tabindex", h ? "0" : "-1")), i.forEach((v) => v.setAttribute("tabindex", h ? "0" : "-1")), h && m && ((C = a ?? i[0]) == null || C.focus()), h || i.forEach((v) => v.setAttribute("tabindex", "-1")), n.dispatchEvent(
      new CustomEvent("blora-speed-dial-toggle", { bubbles: !0, detail: { open: h } })
    );
  }, o = (h) => {
    h.stopPropagation(), s(!n.hasAttribute("data-open"));
  }, c = (h) => {
    (h.key === "ArrowDown" || h.key === "ArrowUp" || h.key === "ArrowLeft" || h.key === "ArrowRight") && (h.preventDefault(), s(!0, !0));
  }, u = (h) => {
    var v, g, N, D;
    if (h.key === "Escape" && n.hasAttribute("data-open")) {
      h.preventDefault(), s(!1), t.focus();
      return;
    }
    if (!n.hasAttribute("data-open")) return;
    const m = a ? [a, ...i] : i, C = m.indexOf(h.target);
    C < 0 || ((h.key === "ArrowDown" || h.key === "ArrowRight") && (h.preventDefault(), (v = m[(C + 1) % m.length]) == null || v.focus()), (h.key === "ArrowUp" || h.key === "ArrowLeft") && (h.preventDefault(), (g = m[(C - 1 + m.length) % m.length]) == null || g.focus()), h.key === "Home" && (h.preventDefault(), (N = m[0]) == null || N.focus()), h.key === "End" && (h.preventDefault(), (D = m[m.length - 1]) == null || D.focus()));
  }, d = (h) => {
    const m = h.target.closest(".blora-speed-dial__action");
    m && (n.dispatchEvent(
      new CustomEvent("blora-speed-dial-select", {
        bubbles: !0,
        detail: { value: m.dataset.value ?? "" }
      })
    ), s(!1));
  }, b = (h) => {
    n.contains(h.target) || s(!1);
  }, p = (h) => {
    h.stopPropagation(), s(!1), t.focus();
  };
  return t.addEventListener("click", o), t.addEventListener("keydown", c), n.addEventListener("keydown", u), e.addEventListener("click", d), r == null || r.addEventListener("click", p), a == null || a.addEventListener("click", p), l.addEventListener("click", b), {
    open: () => s(!0),
    close: () => s(!1),
    destroy() {
      t.removeEventListener("click", o), t.removeEventListener("keydown", c), n.removeEventListener("keydown", u), e.removeEventListener("click", d), r == null || r.removeEventListener("click", p), a == null || a.removeEventListener("click", p), l.removeEventListener("click", b);
    }
  };
}
class Mn extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return [
      "label",
      "mode",
      "action-appearance",
      "open",
      "close-button",
      "main-label",
      "main-icon"
    ];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  open() {
    var t;
    (t = this.controller) == null || t.open();
  }
  close() {
    var t;
    (t = this.controller) == null || t.close();
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((o) => o.localName === "blora-speed-dial-action").map((o) => {
      var c;
      return {
        icon: o.getAttribute("icon"),
        label: o.getAttribute("label") ?? ((c = o.textContent) == null ? void 0 : c.trim()) ?? "",
        nodes: Array.from(o.childNodes).map((u) => u.cloneNode(!0)),
        variant: o.getAttribute("variant") ?? "secondary",
        value: o.getAttribute("value") ?? ""
      };
    }));
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-speed-dial";
    const e = this.getAttribute("mode");
    (e === "left" || e === "flower") && t.classList.add(`blora-speed-dial--${e}`), t.dataset.bloraGenerated = "", t.dataset.bloraSpeedDial = "";
    const r = this.ownerDocument.createElement("button");
    if (r.className = "blora-button blora-speed-dial__trigger", r.dataset.size = "icon", r.dataset.variant = "primary", r.dataset.bloraSpeedDialTrigger = "", r.type = "button", r.setAttribute("aria-label", this.getAttribute("label") ?? "操作"), r.appendChild(Q(this.ownerDocument, "plus", "plus")), t.appendChild(r), this.hasAttribute("close-button")) {
      const o = this.ownerDocument.createElement("button");
      o.className = "blora-button blora-speed-dial__close", o.dataset.size = "icon", o.dataset.variant = "danger", o.dataset.bloraSpeedDialClose = "", o.type = "button", o.setAttribute("aria-label", "关闭"), o.appendChild(Q(this.ownerDocument, "close", "close")), t.appendChild(o);
    }
    const a = this.getAttribute("main-label");
    if (a) {
      const o = this.ownerDocument.createElement("button");
      o.className = "blora-button blora-speed-dial__main", o.dataset.size = "icon", o.dataset.variant = "secondary", o.dataset.bloraSpeedDialMain = "", o.type = "button", o.setAttribute("aria-label", a), o.appendChild(Q(this.ownerDocument, this.getAttribute("main-icon"), "plus")), t.appendChild(o);
    }
    const i = this.ownerDocument.createElement("div");
    i.className = "blora-speed-dial__actions";
    const s = this.getAttribute("action-appearance") ?? "icon";
    this.definitions.forEach((o) => {
      const c = this.ownerDocument.createElement("button");
      if (c.className = "blora-button blora-speed-dial__action", c.dataset.size = s === "button" ? "sm" : "icon", c.dataset.variant = o.variant, c.dataset.value = o.value, c.type = "button", c.setAttribute("aria-label", o.label), c.title = o.label, s === "button" ? c.textContent = o.label : o.icon ? c.appendChild(Q(this.ownerDocument, o.icon, "document")) : o.nodes.length ? c.append(...o.nodes.map((u) => u.cloneNode(!0))) : c.appendChild(Q(this.ownerDocument, null, "document")), s === "label") {
        const u = this.ownerDocument.createElement("div");
        u.className = "blora-speed-dial__item";
        const d = this.ownerDocument.createElement("span");
        d.className = "blora-speed-dial__label", d.textContent = o.label, u.append(d, c), i.appendChild(u);
      } else i.appendChild(c);
    }), t.appendChild(i), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector("input, textarea");
    t && (t.disabled = this.hasAttribute("disabled"), this.hasAttribute("placeholder") && (t.placeholder = this.getAttribute("placeholder") ?? ""), this.hasAttribute("value") && this.ownerDocument.activeElement !== t && (t.value = this.getAttribute("value") ?? t.value)), this.rebind();
  }
  bindEvents() {
    const t = this.querySelector(".blora-speed-dial");
    t && (this.controller = Tn(t), this.listen(t, "blora-speed-dial-toggle", (e) => {
      const r = e.detail.open;
      this.reflecting = !0, this.toggleAttribute("open", r), this.reflecting = !1;
    }), this.hasAttribute("open") && this.controller.open());
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Ua(n = customElements) {
  !n || n.get(le) || n.define(le, Mn);
}
const ce = "blora-splitter";
function Bn(n) {
  const l = n.ownerDocument, t = Array.from(n.querySelectorAll(".blora-splitter__pane"));
  if (t.length < 2) return { destroy: () => {
  }, getPosition: () => 50, setPosition: () => {
  } };
  let e = n.querySelector(".blora-splitter__handle");
  if (!e) {
    e = l.createElement("div"), e.className = "blora-splitter__handle";
    const b = l.createElement("span");
    b.className = "blora-splitter__grip", e.appendChild(b), n.insertBefore(e, t[1]);
  }
  const r = Number(n.dataset.min ?? 50);
  let a = !1, i = Number(n.dataset.position ?? 50);
  e.tabIndex = 0, e.setAttribute("role", "separator"), e.setAttribute("aria-orientation", "vertical");
  const s = (b, p = !1) => {
    const h = n.getBoundingClientRect(), m = h.width > 0 ? r / h.width * 100 : 0;
    i = Math.max(m, Math.min(100 - m, b)), t[0].style.flex = `0 0 ${i}%`, t[1].style.flex = "1 1 0%", e.setAttribute("aria-valuenow", String(Math.round(i))), p && n.dispatchEvent(
      new CustomEvent("blora-splitter-change", {
        bubbles: !0,
        detail: { position: i }
      })
    );
  }, o = (b) => {
    a = !0, e.setPointerCapture(b.pointerId), b.preventDefault();
  }, c = (b) => {
    if (!a) return;
    const p = n.getBoundingClientRect(), h = (b.clientX - p.left) / p.width * 100;
    s(h, !0);
  }, u = (b) => {
    b.key !== "ArrowLeft" && b.key !== "ArrowRight" || (b.preventDefault(), s(i + (b.key === "ArrowRight" ? 2 : -2), !0));
  }, d = (b) => {
    a = !1;
    try {
      e.releasePointerCapture(b.pointerId);
    } catch {
    }
  };
  return e.addEventListener("pointerdown", o), e.addEventListener("pointermove", c), e.addEventListener("pointerup", d), e.addEventListener("keydown", u), s(i), {
    destroy() {
      e.removeEventListener("pointerdown", o), e.removeEventListener("pointermove", c), e.removeEventListener("pointerup", d), e.removeEventListener("keydown", u);
    },
    getPosition: () => i,
    setPosition: (b) => s(b, !0)
  };
}
class In extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["position", "min"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  get position() {
    var t;
    return ((t = this.controller) == null ? void 0 : t.getPosition()) ?? Number(this.getAttribute("position") ?? 50);
  }
  set position(t) {
    this.setAttribute("position", String(t));
  }
  setPosition(t) {
    var e;
    (e = this.controller) == null || e.setPosition(t);
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((e) => e.localName === "blora-splitter-pane").slice(0, 2).map((e) => ({
      nodes: Array.from(e.childNodes).map((r) => r.cloneNode(!0)),
      style: e.getAttribute("style") ?? ""
    })));
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-splitter", t.dataset.bloraGenerated = "", t.dataset.min = this.getAttribute("min") ?? "50", t.dataset.position = this.getAttribute("position") ?? "50", this.definitions.forEach((e) => {
      const r = this.ownerDocument.createElement("div");
      r.className = "blora-splitter__pane", r.style.cssText = e.style, r.append(...e.nodes.map((a) => a.cloneNode(!0))), t.appendChild(r);
    }), this.replaceChildren(t);
  }
  sync() {
    var a;
    const t = this.querySelector(".blora-splitter");
    if (!t) return;
    const e = this.getAttribute("min");
    e && (t.dataset.min = e);
    const r = this.getAttribute("position");
    r && (t.dataset.position = r, (a = this.controller) == null || a.setPosition(Number(r)));
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-splitter");
    t && ((e = this.controller) == null || e.destroy(), this.controller = Bn(t), this.listen(t, "blora-splitter-change", (r) => {
      const a = r.detail.position;
      this.reflecting = !0, this.setAttribute("position", String(a)), this.reflecting = !1;
    }));
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Ka(n = customElements) {
  !n || n.get(ce) || n.define(ce, In);
}
const ue = "blora-tour";
function On(n) {
  const l = n.ownerDocument, t = n.querySelector("[data-tour-start]"), e = Array.from(n.querySelectorAll("[data-tour-step]"));
  if (e.length === 0)
    return { destroy: () => {
    }, end: () => {
    }, next: () => {
    }, prev: () => {
    }, start: () => {
    } };
  let r = -1, a = null, i = null;
  const s = () => {
    a = l.createElement("div"), a.className = "blora-tour__overlay", l.body.appendChild(a), i = l.createElement("div"), i.className = "blora-tour__tooltip";
    const d = l.createElement("div");
    d.className = "blora-tour__title";
    const b = l.createElement("div");
    b.className = "blora-tour__desc";
    const p = l.createElement("div");
    p.className = "blora-tour__footer";
    const h = l.createElement("span");
    h.className = "blora-tour__counter";
    const m = l.createElement("div");
    m.className = "blora-tour__buttons";
    const C = (v, g) => {
      const N = l.createElement("button");
      return N.className = v, N.type = "button", N.textContent = g, N;
    };
    m.append(
      C("blora-tour__skip", "跳过"),
      C("blora-tour__prev", "上一步"),
      C("blora-tour__next", "下一步")
    ), p.append(h, m), i.append(d, b, p), l.body.appendChild(i), i.querySelector(".blora-tour__skip").addEventListener("click", u), i.querySelector(".blora-tour__prev").addEventListener("click", () => o(r - 1)), i.querySelector(".blora-tour__next").addEventListener("click", () => {
      r < e.length - 1 ? o(r + 1) : u();
    });
  }, o = (d) => {
    r = Math.max(0, Math.min(d, e.length - 1));
    const b = e[r], p = b.getBoundingClientRect();
    a.style.position = "fixed", a.style.boxShadow = "0 0 0 9999px color-mix(in srgb, var(--blora-color-text-primary) 45%, transparent)", a.style.borderRadius = "var(--blora-radius-sm)", a.style.top = `${p.top - 4}px`, a.style.left = `${p.left - 4}px`, a.style.width = `${p.width + 8}px`, a.style.height = `${p.height + 8}px`, a.style.zIndex = "var(--blora-z-toast)", i.querySelector(".blora-tour__title").textContent = b.dataset.tourTitle ?? "", i.querySelector(".blora-tour__desc").textContent = b.dataset.tourDesc ?? "", i.querySelector(".blora-tour__counter").textContent = `${r + 1} / ${e.length}`;
    const h = i.querySelector(".blora-tour__next");
    h.textContent = r < e.length - 1 ? "下一步" : "完成", i.querySelector(".blora-tour__prev").style.visibility = r > 0 ? "visible" : "hidden", i.style.position = "fixed", i.style.top = `${p.bottom + 12}px`, i.style.left = `${p.left}px`, i.style.zIndex = "var(--blora-z-toast)", i.setAttribute("data-open", ""), n.dispatchEvent(
      new CustomEvent("blora-tour-change", {
        bubbles: !0,
        detail: { index: r, total: e.length }
      })
    );
  }, c = () => {
    u(), s(), o(0);
  }, u = () => {
    const d = r >= 0;
    a == null || a.remove(), i == null || i.remove(), a = null, i = null, r = -1, d && n.dispatchEvent(new CustomEvent("blora-tour-end", { bubbles: !0 }));
  };
  return t == null || t.addEventListener("click", c), {
    destroy() {
      u(), t == null || t.removeEventListener("click", c);
    },
    end: u,
    next: () => r < e.length - 1 ? o(r + 1) : u(),
    prev: () => o(r - 1),
    start: c
  };
}
class Rn extends T {
  constructor() {
    super(...arguments);
    y(this, "controller", null);
    y(this, "definitions", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["label", "open"];
  }
  attributeChangedCallback() {
    !this.isConnectedInternal || this.reflecting || this.sync();
  }
  start() {
    var t;
    (t = this.controller) == null || t.start();
  }
  end() {
    var t;
    (t = this.controller) == null || t.end();
  }
  next() {
    var t;
    (t = this.controller) == null || t.next();
  }
  prev() {
    var t;
    (t = this.controller) == null || t.prev();
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((a) => a.localName === "blora-tour-step").map((a) => ({
      description: a.getAttribute("description") ?? "",
      nodes: Array.from(a.childNodes).map((i) => i.cloneNode(!0)),
      title: a.getAttribute("title") ?? ""
    })));
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-tour", t.dataset.bloraGenerated = "";
    const e = this.ownerDocument.createElement("button");
    e.className = "blora-button", e.dataset.variant = "primary", e.dataset.tourStart = "", e.type = "button", e.textContent = this.getAttribute("label") ?? "开始漫游", t.appendChild(e);
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-tour__steps", this.definitions.forEach((a) => {
      const i = this.ownerDocument.createElement("div");
      i.dataset.tourStep = "", i.dataset.tourTitle = a.title, i.dataset.tourDesc = a.description, i.append(...a.nodes.map((s) => s.cloneNode(!0))), r.appendChild(i);
    }), t.appendChild(r), this.replaceChildren(t);
  }
  sync() {
    var e, r;
    const t = this.querySelector("[data-tour-start]");
    t && (t.textContent = this.getAttribute("label") ?? "开始漫游"), this.hasAttribute("open") ? (e = this.controller) == null || e.start() : (r = this.controller) == null || r.end();
  }
  bindEvents() {
    var e;
    const t = this.querySelector(".blora-tour");
    t && ((e = this.controller) == null || e.destroy(), this.controller = On(t), this.listen(t, "blora-tour-change", () => {
      this.reflecting = !0, this.setAttribute("open", ""), this.reflecting = !1;
    }), this.listen(t, "blora-tour-end", () => {
      this.reflecting = !0, this.removeAttribute("open"), this.reflecting = !1;
    }), this.hasAttribute("open") && this.controller.start());
  }
  onDisconnect() {
    var t;
    (t = this.controller) == null || t.destroy(), this.controller = null;
  }
}
function Xa(n = customElements) {
  !n || n.get(ue) || n.define(ue, Rn);
}
const Pn = {
  success: "check",
  danger: "close",
  error: "close",
  warning: "circle-alert",
  info: "info"
};
function it(n, l, t) {
  return O(Pn[l] ?? "info", t, n);
}
const de = "blora-alert";
class $n extends T {
  static get observedAttributes() {
    return ["variant", "title", "description", "dismissible"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  close() {
    this.emit("blora-alert-close", void 0), this.remove();
  }
  render() {
    const l = this.getAttribute("variant") ?? "info", t = this.ownerDocument.createElement("div");
    t.className = "blora-alert", t.dataset.variant = l, t.dataset.bloraGenerated = "", t.setAttribute("role", l === "danger" || l === "error" ? "alert" : "status");
    const e = this.ownerDocument.createElement("span");
    e.className = "blora-alert__icon", e.appendChild(it(this.ownerDocument, l, 20));
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-alert__body";
    const a = this.ownerDocument.createElement("div");
    a.className = "blora-alert__title", a.textContent = this.getAttribute("title") ?? "";
    const i = this.ownerDocument.createElement("div");
    if (i.className = "blora-alert__desc", i.textContent = this.getAttribute("description") ?? "", r.append(a, i), t.append(e, r), this.hasAttribute("dismissible")) {
      const s = this.ownerDocument.createElement("button");
      s.className = "blora-alert__close", s.type = "button", s.setAttribute("aria-label", "关闭"), s.appendChild(O("close", 16, this.ownerDocument)), t.appendChild(s);
    }
    this.replaceChildren(t);
  }
  sync() {
    const l = this.querySelector(".blora-alert");
    if (!l) return;
    const t = this.getAttribute("variant") ?? "info";
    l.dataset.variant = t, l.setAttribute("role", t === "danger" || t === "error" ? "alert" : "status");
    const e = l.querySelector(".blora-alert__icon");
    e && e.replaceChildren(it(this.ownerDocument, t, 20));
    const r = l.querySelector(".blora-alert__title");
    r && (r.textContent = this.getAttribute("title") ?? "");
    const a = l.querySelector(".blora-alert__desc");
    a && (a.textContent = this.getAttribute("description") ?? "");
    const i = l.querySelector(".blora-alert__close");
    this.hasAttribute("dismissible") && !i ? (this.render(), this.rebind()) : !this.hasAttribute("dismissible") && i && i.remove();
  }
  bindEvents() {
    const l = this.querySelector(".blora-alert__close");
    l && this.listen(l, "click", () => this.close());
  }
}
function Qa(n = customElements) {
  !n || n.get(de) || n.define(de, $n);
}
const be = "blora-banner";
class Gn extends T {
  constructor() {
    super(...arguments);
    y(this, "definitions", null);
  }
  static get observedAttributes() {
    return ["title", "description"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((s) => s.localName === "blora-banner-action").map((s) => {
      var o;
      return {
        label: s.getAttribute("label") ?? ((o = s.textContent) == null ? void 0 : o.trim()) ?? "",
        value: s.getAttribute("value") ?? "",
        variant: s.getAttribute("variant") ?? "outline"
      };
    }));
    const t = this.ownerDocument.createElement("section");
    t.className = "blora-banner", t.dataset.bloraGenerated = "";
    const e = this.ownerDocument.createElement("div");
    e.className = "blora-banner__body";
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-banner__title", r.textContent = this.getAttribute("title") ?? "";
    const a = this.ownerDocument.createElement("div");
    a.className = "blora-banner__desc", a.textContent = this.getAttribute("description") ?? "", e.append(r, a);
    const i = this.ownerDocument.createElement("div");
    i.className = "blora-banner__actions", this.definitions.forEach((s) => {
      const o = this.ownerDocument.createElement("button");
      o.className = "blora-button", o.dataset.variant = s.variant, o.dataset.size = "sm", o.dataset.value = s.value, o.type = "button", o.textContent = s.label, i.appendChild(o);
    }), t.append(e, i), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-banner__title");
    t && (t.textContent = this.getAttribute("title") ?? "");
    const e = this.querySelector(".blora-banner__desc");
    e && (e.textContent = this.getAttribute("description") ?? "");
  }
  bindEvents() {
    const t = this.querySelector(".blora-banner__actions");
    t && this.listen(t, "click", (e) => {
      const r = e.target.closest("button");
      r && this.emit("blora-banner-action", { value: r.dataset.value ?? "" });
    });
  }
}
function ja(n = customElements) {
  !n || n.get(be) || n.define(be, Gn);
}
const he = "blora-breadcrumb";
class Hn extends T {
  constructor() {
    super(...arguments);
    y(this, "definitions", null);
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((e) => e.localName === "blora-breadcrumb-item").map((e) => {
      var r;
      return {
        current: e.hasAttribute("current"),
        href: e.getAttribute("href") ?? "#",
        label: e.getAttribute("label") ?? ((r = e.textContent) == null ? void 0 : r.trim()) ?? ""
      };
    }));
    const t = this.ownerDocument.createElement("nav");
    t.className = "blora-breadcrumb", t.dataset.bloraGenerated = "", t.setAttribute("aria-label", "面包屑"), this.definitions.forEach((e, r) => {
      if (r) {
        const a = this.ownerDocument.createElement("span");
        a.className = "blora-breadcrumb__sep", a.setAttribute("aria-hidden", "true"), a.textContent = "/", t.appendChild(a);
      }
      if (e.current || r === this.definitions.length - 1) {
        const a = this.ownerDocument.createElement("span");
        a.className = "blora-breadcrumb__current", a.setAttribute("aria-current", "page"), a.textContent = e.label, t.appendChild(a);
      } else {
        const a = this.ownerDocument.createElement("a");
        a.href = e.href, a.textContent = e.label, t.appendChild(a);
      }
    }), this.replaceChildren(t);
  }
  bindEvents() {
  }
}
function Ja(n = customElements) {
  !n || n.get(he) || n.define(he, Hn);
}
const pe = "blora-chart-container";
class zn extends T {
  constructor() {
    super(...arguments);
    y(this, "content", null);
  }
  static get observedAttributes() {
    return ["title", "subtitle", "trend", "trend-variant"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  render() {
    this.content || (this.content = Array.from(this.childNodes).map((c) => c.cloneNode(!0)));
    const t = this.ownerDocument.createElement("section");
    t.className = "blora-chart", t.dataset.bloraGenerated = "";
    const e = this.ownerDocument.createElement("div");
    e.className = "blora-chart__header";
    const r = this.ownerDocument.createElement("div"), a = this.ownerDocument.createElement("div");
    a.className = "blora-chart__title", a.textContent = this.getAttribute("title") ?? "";
    const i = this.ownerDocument.createElement("div");
    i.className = "blora-text-xs blora-text-subtle", i.textContent = this.getAttribute("subtitle") ?? "", r.append(a, i), e.appendChild(r);
    const s = this.getAttribute("trend");
    if (s) {
      const c = this.ownerDocument.createElement("span");
      c.className = "blora-tag", c.dataset.variant = this.getAttribute("trend-variant") ?? "success", c.textContent = s, e.appendChild(c);
    }
    const o = this.ownerDocument.createElement("div");
    o.className = "blora-chart__body", o.append(...this.content.map((c) => c.cloneNode(!0))), t.append(e, o), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-chart__title");
    t && (t.textContent = this.getAttribute("title") ?? "");
    const e = this.querySelector(".blora-text-xs");
    e && (e.textContent = this.getAttribute("subtitle") ?? "");
    const r = this.getAttribute("trend");
    let a = this.querySelector(".blora-tag");
    if (r) {
      if (!a) {
        this.render();
        return;
      }
      a.textContent = r, a.dataset.variant = this.getAttribute("trend-variant") ?? "success";
    } else
      a == null || a.remove();
  }
  bindEvents() {
  }
}
function Za(n = customElements) {
  !n || n.get(pe) || n.define(pe, zn);
}
const me = "blora-chat";
class Fn extends T {
  static get observedAttributes() {
    return ["author", "time", "avatar", "message", "side", "avatar-variant"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  render() {
    const l = this.ownerDocument.createElement("article");
    l.className = "blora-chat", this.getAttribute("side") === "end" && l.classList.add("blora-chat--end"), l.dataset.bloraGenerated = "";
    const t = this.ownerDocument.createElement("span");
    t.className = "blora-avatar blora-chat__avatar", t.dataset.size = "sm", t.dataset.variant = this.getAttribute("avatar-variant") ?? "info", t.textContent = this.getAttribute("avatar") ?? (this.getAttribute("author") ?? "?").slice(0, 1);
    const e = this.ownerDocument.createElement("div");
    e.className = "blora-chat__content";
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-chat__meta";
    const a = this.ownerDocument.createElement("span");
    a.textContent = this.getAttribute("author") ?? "";
    const i = this.ownerDocument.createElement("time");
    i.textContent = this.getAttribute("time") ?? "", r.append(a, i);
    const s = this.ownerDocument.createElement("div");
    s.className = "blora-chat__bubble", s.textContent = this.getAttribute("message") ?? "", e.append(r, s), l.append(t, e), this.replaceChildren(l);
  }
  sync() {
    const l = this.querySelector(".blora-chat");
    if (!l) return;
    l.classList.toggle("blora-chat--end", this.getAttribute("side") === "end");
    const t = l.querySelector(".blora-avatar");
    t && (t.dataset.variant = this.getAttribute("avatar-variant") ?? "info", t.textContent = this.getAttribute("avatar") ?? (this.getAttribute("author") ?? "?").slice(0, 1));
    const e = l.querySelector(".blora-chat__meta span");
    e && (e.textContent = this.getAttribute("author") ?? "");
    const r = l.querySelector("time");
    r && (r.textContent = this.getAttribute("time") ?? "");
    const a = l.querySelector(".blora-chat__bubble");
    a && (a.textContent = this.getAttribute("message") ?? "");
  }
  bindEvents() {
  }
}
function ti(n = customElements) {
  !n || n.get(me) || n.define(me, Fn);
}
const fe = "blora-comment";
class Vn extends T {
  static get observedAttributes() {
    return ["author", "time", "avatar", "content", "likes"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  render() {
    const l = this.ownerDocument.createElement("article");
    l.className = "blora-comment", l.dataset.bloraGenerated = "";
    const t = this.ownerDocument.createElement("span");
    t.className = "blora-avatar", t.dataset.size = "sm", t.dataset.variant = "primary", t.textContent = this.getAttribute("avatar") ?? (this.getAttribute("author") ?? "?").slice(0, 1);
    const e = this.ownerDocument.createElement("div");
    e.className = "blora-comment__main";
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-comment__head";
    const a = this.ownerDocument.createElement("span");
    a.className = "blora-comment__author", a.textContent = this.getAttribute("author") ?? "";
    const i = this.ownerDocument.createElement("span");
    i.className = "blora-comment__time", i.textContent = this.getAttribute("time") ?? "", r.append(a, i);
    const s = this.ownerDocument.createElement("div");
    s.className = "blora-comment__body", s.textContent = this.getAttribute("content") ?? "";
    const o = this.ownerDocument.createElement("div");
    o.className = "blora-comment__actions";
    const c = (u, d) => {
      const b = this.ownerDocument.createElement("button");
      return b.type = "button", b.dataset.value = u, b.textContent = d, b;
    };
    o.append(c("reply", "回复"), c("like", this.getAttribute("likes") ?? "赞")), e.append(r, s, o), l.append(t, e), this.replaceChildren(l);
  }
  sync() {
    const l = this.querySelector(".blora-comment__author");
    l && (l.textContent = this.getAttribute("author") ?? "");
    const t = this.querySelector(".blora-comment__time");
    t && (t.textContent = this.getAttribute("time") ?? "");
    const e = this.querySelector(".blora-comment__body");
    e && (e.textContent = this.getAttribute("content") ?? "");
    const r = this.querySelector(".blora-avatar");
    r && (r.textContent = this.getAttribute("avatar") ?? (this.getAttribute("author") ?? "?").slice(0, 1));
    const a = this.querySelector('[data-value="like"]');
    a && (a.textContent = this.getAttribute("likes") ?? "赞");
  }
  bindEvents() {
    const l = this.querySelector(".blora-comment__actions");
    l && this.listen(l, "click", (t) => {
      const e = t.target.closest("button");
      e && this.emit("blora-comment-action", { value: e.dataset.value ?? "" });
    });
  }
}
function ei(n = customElements) {
  !n || n.get(fe) || n.define(fe, Vn);
}
const ve = "blora-empty";
class Yn extends T {
  static get observedAttributes() {
    return ["title", "description", "action-label"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  render() {
    const l = this.ownerDocument.createElement("div");
    l.className = "blora-empty", l.dataset.bloraGenerated = "", l.setAttribute("role", "status");
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-empty__icon";
    const e = O("inbox", 60, this.ownerDocument);
    e.setAttribute("stroke-width", "1.25"), t.appendChild(e);
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-empty__title", r.textContent = this.getAttribute("title") ?? "暂无数据";
    const a = this.ownerDocument.createElement("div");
    a.className = "blora-empty__desc", a.textContent = this.getAttribute("description") ?? "", l.append(t, r, a);
    const i = this.getAttribute("action-label");
    if (i) {
      const s = this.ownerDocument.createElement("button");
      s.className = "blora-button", s.dataset.variant = "primary", s.dataset.size = "sm", s.type = "button", s.textContent = i, s.dataset.emptyAction = "", l.appendChild(s);
    }
    this.replaceChildren(l);
  }
  sync() {
    const l = this.querySelector(".blora-empty__title");
    l && (l.textContent = this.getAttribute("title") ?? "暂无数据");
    const t = this.querySelector(".blora-empty__desc");
    t && (t.textContent = this.getAttribute("description") ?? "");
    const e = this.getAttribute("action-label"), r = this.querySelector("[data-empty-action]");
    e && r ? r.textContent = e : e && !r ? (this.render(), this.rebind()) : !e && r && r.remove();
  }
  bindEvents() {
    const l = this.querySelector("[data-empty-action]");
    l && this.listen(l, "click", () => this.emit("blora-empty-action", void 0));
  }
}
function ri(n = customElements) {
  !n || n.get(ve) || n.define(ve, Yn);
}
const ge = "blora-mockup";
class Wn extends T {
  constructor() {
    super(...arguments);
    y(this, "content", null);
  }
  static get observedAttributes() {
    return ["variant", "address", "title", "label"];
  }
  attributeChangedCallback(t) {
    if (this.isConnectedInternal) {
      if (t === "variant") {
        this.render();
        return;
      }
      this.sync();
    }
  }
  render() {
    this.content || (this.content = Array.from(this.childNodes).map((r) => r.cloneNode(!0)));
    const t = this.getAttribute("variant") ?? "browser", e = this.ownerDocument.createElement("section");
    if (e.className = `blora-mockup blora-mockup--${t}`, e.dataset.bloraGenerated = "", e.setAttribute("aria-label", this.getAttribute("label") ?? `${t} mockup`), t === "code")
      this.content.forEach((r) => {
        var a;
        if (r instanceof Element && r.localName === "blora-mockup-line") {
          const i = this.ownerDocument.createElement("pre");
          i.className = "blora-mockup__line";
          const s = r.getAttribute("tone");
          ["danger", "highlight", "info", "muted", "success", "warning"].includes(s ?? "") && i.classList.add(`blora-mockup__line--${s}`);
          const o = r.getAttribute("prefix");
          o != null && (i.dataset.prefix = o), i.append(...Array.from(r.childNodes).map((c) => c.cloneNode(!0))), e.appendChild(i);
          return;
        }
        (r.nodeType !== Node.TEXT_NODE || (a = r.textContent) != null && a.trim()) && e.appendChild(r.cloneNode(!0));
      });
    else if (t === "phone") {
      const r = this.ownerDocument.createElement("div");
      r.className = "blora-mockup__camera", r.setAttribute("aria-hidden", "true");
      const a = this.ownerDocument.createElement("div");
      a.className = "blora-mockup__display";
      const i = this.ownerDocument.createElement("div");
      i.className = "blora-mockup__display-body", i.append(...this.content.map((s) => s.cloneNode(!0))), a.appendChild(i), e.append(r, a);
    } else {
      const r = this.ownerDocument.createElement("div");
      r.className = "blora-mockup__toolbar";
      const a = this.ownerDocument.createElement("span");
      a.className = "blora-mockup__dots", a.setAttribute("aria-hidden", "true"), a.appendChild(this.ownerDocument.createElement("span")), r.appendChild(a);
      const i = this.ownerDocument.createElement(t === "browser" ? "div" : "span");
      i.className = t === "browser" ? "blora-mockup__address" : "blora-mockup__title", i.textContent = t === "browser" ? this.getAttribute("address") ?? "about:blank" : this.getAttribute("title") ?? "Window", r.appendChild(i);
      const s = this.ownerDocument.createElement("div");
      s.className = "blora-mockup__body", s.append(...this.content.map((o) => o.cloneNode(!0))), e.append(r, s);
    }
    this.replaceChildren(e);
  }
  sync() {
    const t = this.querySelector(".blora-mockup");
    if (!t) return;
    t.setAttribute(
      "aria-label",
      this.getAttribute("label") ?? `${this.getAttribute("variant") ?? "browser"} mockup`
    );
    const e = t.querySelector(".blora-mockup__address");
    e && (e.textContent = this.getAttribute("address") ?? "about:blank");
    const r = t.querySelector(".blora-mockup__title");
    r && (r.textContent = this.getAttribute("title") ?? "Window");
  }
  bindEvents() {
  }
}
function ni(n = customElements) {
  !n || n.get(ge) || n.define(ge, Wn);
}
const Ae = "blora-navbar";
class Un extends T {
  constructor() {
    super(...arguments);
    y(this, "definitions", null);
  }
  static get observedAttributes() {
    return ["brand-href", "title", "variant"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter(
      (d) => d.localName === "blora-navbar-link" || d.localName === "blora-navbar-action" || d.localName === "blora-navbar-tool"
    ).map((d) => {
      var b;
      return {
        current: d.hasAttribute("current"),
        href: d.getAttribute("href") ?? "#",
        kind: d.localName === "blora-navbar-action" ? "action" : d.localName === "blora-navbar-tool" ? "tool" : "link",
        label: d.getAttribute("label") ?? ((b = d.textContent) == null ? void 0 : b.trim()) ?? "",
        nodes: Array.from(d.childNodes),
        variant: d.getAttribute("variant") ?? "outline"
      };
    }));
    const t = this.ownerDocument.createElement("nav");
    t.className = "blora-navbar", t.dataset.variant = this.getAttribute("variant") ?? "floating", t.dataset.bloraGenerated = "";
    const e = this.getAttribute("brand-href"), r = this.ownerDocument.createElement(e ? "a" : "div");
    r.className = "blora-navbar__brand", r instanceof HTMLAnchorElement && e && (r.href = e);
    const a = this.ownerDocument.createElement("span");
    a.className = "blora-brand-mark";
    const i = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
    i.setAttribute("width", "20"), i.setAttribute("height", "20"), i.setAttribute("viewBox", "0 0 28 28"), i.setAttribute("fill", "currentColor"), i.setAttribute("aria-hidden", "true");
    for (const d of [
      "M5.564827499008331,11.30073113250122L8.613244389008331,9.55578903250122L7.719039689008332,7.993611832501221L4.670622762008331,9.73855403250122Q3.7145057890083315,10.285843332501221,3.714505549008331,11.38751893250122L3.714505909008331,21.189404032501223Q3.714505909008331,22.29107703250122,4.670622762008331,22.838368032501222L13.24553848900833,27.74672703250122Q14.189421489008332,28.28701603250122,15.133306589008331,27.746726032501222L23.70821758900833,22.838368032501222Q24.664333589008333,22.29107903250122,24.664333589008333,21.189403032501218L24.664333589008333,11.38751893250122Q24.664333589008333,10.285842932501222,23.708221589008332,9.73855403250122L15.144333589008331,4.836507112501221Q14.17949278900833,4.28422363250122,13.225343489008331,4.854777572501221L12.235854489008332,5.44646401250122L13.159642089008331,6.991331832501221L14.149129689008332,6.399646032501221Q14.19934828900833,6.369617032501221,14.250129489008332,6.398684332501221L22.81401458900833,11.30073023250122Q22.864333589008332,11.32953453250122,22.864333589008332,11.38751893250122L22.864333589008332,21.189403032501218Q22.864333589008332,21.24738603250122,22.814012589008332,21.27619003250122L14.23909738900833,26.18455203250122Q14.18942048900833,26.212988032501222,14.139742689008331,26.18455003250122L5.564828579008331,21.27619103250122Q5.514505799008331,21.24738603250122,5.514505799008331,21.189404032501223L5.514505449008332,11.38751893250122Q5.514505449008332,11.329536432501222,5.564827499008331,11.30073113250122Z",
      "M13.676674393811036,9.8286476L13.676419693811035,2.5857831Q13.676392093811035,1.76404774,12.958911393811036,1.3634555L11.142991493811035,0.34957015999999996Q10.464049593811035,-0.02950469999999994,9.783433893811035,0.34655654L7.945791753811035,1.36191076Q7.222857173811035,1.76135367,7.222857173811035,2.5873014000000003L7.222857173811035,19.634758Q7.222857173811035,20.456587,7.940433573811035,20.85717L13.577110793811034,24.003897Q14.267833193811036,24.3895,14.954539293811035,23.996788L20.450968093811035,20.853519Q21.155953093811036,20.450346,21.155953093811036,19.638218L21.155953093811036,13.368428Q21.155953093811036,12.541971,20.432357093811035,12.142673L15.606700893811034,9.4797554Q14.896982193811034,9.0881147,14.203994293811036,9.5086489L13.676674393811036,9.8286476ZM11.876428093811036,2.8206283L10.459485793811035,2.0295045L9.022857013811034,2.8232863L9.022857013811034,19.39995L14.257165393811036,22.322048L19.355953093811035,19.406179L19.355953093811035,13.604559L14.939816993811036,11.167625L14.003004993811036,11.736121Q13.303271793811035,12.160748,12.589999693811034,11.759276Q11.876728293811034,11.357804,11.876699493811035,10.5393085L11.876428093811036,2.8206283Z",
      "M11.361768030889893,4.572254157627869L13.073605530889893,3.6714597976278687L12.235387530889893,2.0785409176278686L10.461767930889893,3.0118460176278687L8.688148500889893,2.0785409176278686L7.849930760889893,3.6714597976278687L9.561768330889892,4.572254157627869L9.561768330889892,13.981741357627868Q9.561768330889892,14.793980357627868,10.267906530889892,15.196923357627869L13.397947330889892,16.98302035762787L13.397947330889892,23.35577235762787L15.197947030889893,23.35577235762787L15.197947030889893,16.97939035762787L20.706725630889892,13.791639357627869L19.805188630889894,12.233682957627869L14.294810730889893,15.422357357627869L11.361768030889893,13.748672357627868L11.361768030889893,4.572254157627869Z"
    ]) {
      const b = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
      b.setAttribute("d", d), b.setAttribute("fill-rule", "evenodd"), i.appendChild(b);
    }
    a.appendChild(i);
    const s = this.ownerDocument.createElement("span");
    s.className = "blora-navbar__title", s.textContent = this.getAttribute("title") ?? "Blora Design", r.append(a, s);
    const o = this.ownerDocument.createElement("div");
    o.className = "blora-navbar__menu";
    const c = this.ownerDocument.createElement("div");
    c.className = "blora-navbar__actions";
    const u = this.ownerDocument.createElement("div");
    u.className = "blora-navbar__tools", this.definitions.forEach((d) => {
      if (d.kind === "tool") {
        u.append(...d.nodes);
        return;
      }
      const b = this.ownerDocument.createElement("a");
      b.href = d.href, b.textContent = d.label, d.kind === "link" ? (b.className = "blora-navbar__link", d.current && b.setAttribute("aria-current", "page"), o.appendChild(b)) : (b.className = `blora-button blora-navbar__${d.variant === "primary" ? "cta" : "secondary"}`, b.dataset.variant = d.variant, b.dataset.size = "sm", c.appendChild(b));
    }), u.childNodes.length > 0 && c.prepend(u), t.append(r, o, c), this.replaceChildren(t);
  }
  sync() {
    const t = this.querySelector(".blora-navbar");
    if (!t) return;
    const e = this.getAttribute("brand-href"), r = t.querySelector(".blora-navbar__brand");
    if (e && !(r instanceof HTMLAnchorElement)) {
      this.render();
      return;
    }
    r instanceof HTMLAnchorElement && e && (r.href = e);
    const a = t.querySelector(".blora-navbar__title");
    a && (a.textContent = this.getAttribute("title") ?? "Blora Design"), t.dataset.variant = this.getAttribute("variant") ?? "floating";
  }
  bindEvents() {
  }
}
function ai(n = customElements) {
  !n || n.get(Ae) || n.define(Ae, Un);
}
const ye = "blora-sidebar-nav";
class Kn extends T {
  constructor() {
    super(...arguments);
    y(this, "definitions", null);
    y(this, "reflecting", !1);
  }
  static get observedAttributes() {
    return ["label", "value"];
  }
  attributeChangedCallback(t) {
    var e;
    if (!(!this.isConnectedInternal || this.reflecting)) {
      if (t === "label") {
        (e = this.querySelector(".blora-sidebar-nav")) == null || e.setAttribute(
          "aria-label",
          this.getAttribute("label") ?? "Sidebar navigation"
        );
        return;
      }
      this.syncCurrent();
    }
  }
  get value() {
    var t;
    return this.getAttribute("value") ?? ((t = this.querySelector('.blora-sidebar-nav__link[aria-current="page"]')) == null ? void 0 : t.dataset.value) ?? "";
  }
  set value(t) {
    this.select(t);
  }
  select(t) {
    t ? this.setAttribute("value", t) : this.removeAttribute("value"), this.isConnectedInternal && this.syncCurrent();
  }
  render() {
    var r;
    this.definitions || (this.definitions = this.readDefinitions());
    const t = this.getAttribute("value") ?? ((r = this.definitions.flatMap((a) => a.links).find((a) => a.current)) == null ? void 0 : r.value) ?? "";
    t && !this.hasAttribute("value") && (this.reflecting = !0, this.setAttribute("value", t), this.reflecting = !1);
    const e = this.ownerDocument.createElement("nav");
    e.className = "blora-sidebar-nav", e.dataset.bloraGenerated = "", e.setAttribute("aria-label", this.getAttribute("label") ?? "Sidebar navigation");
    for (const a of this.definitions) {
      const i = this.ownerDocument.createElement("div");
      if (i.className = "blora-sidebar-nav__group", i.setAttribute("role", "group"), a.label) {
        i.setAttribute("aria-label", a.label);
        const s = this.ownerDocument.createElement("div");
        s.className = "blora-sidebar-nav__group-label", s.textContent = a.label, s.setAttribute("aria-hidden", "true"), i.appendChild(s);
      }
      for (const s of a.links) {
        const o = this.ownerDocument.createElement("a");
        o.className = "blora-sidebar-nav__link", o.href = s.href, o.textContent = s.label, o.dataset.value = s.value, s.value === t && o.setAttribute("aria-current", "page"), i.appendChild(o);
      }
      e.appendChild(i);
    }
    this.replaceChildren(e);
  }
  bindEvents() {
    const t = this.querySelector(".blora-sidebar-nav");
    t && this.listen(t, "click", (e) => {
      const r = e.target, a = r == null ? void 0 : r.closest(".blora-sidebar-nav__link");
      if (!a || !t.contains(a)) return;
      const i = a.dataset.value ?? "";
      this.select(i), this.emit("blora-change", {
        href: a.getAttribute("href") ?? "",
        value: i
      });
    });
  }
  readDefinitions() {
    const t = [], e = [];
    for (const r of Array.from(this.children))
      r.localName === "blora-sidebar-nav-group" ? t.push({
        label: r.getAttribute("label") ?? "",
        links: Array.from(r.children).filter((a) => a.localName === "blora-sidebar-nav-link").map((a, i) => this.readLink(a, i))
      }) : r.localName === "blora-sidebar-nav-link" && e.push(this.readLink(r, e.length));
    return e.length && t.unshift({ label: "", links: e }), t.filter((r) => r.links.length > 0);
  }
  readLink(t, e) {
    var s;
    const r = t.getAttribute("href") ?? "#", a = t.getAttribute("label") ?? ((s = t.textContent) == null ? void 0 : s.trim()) ?? "", i = t.getAttribute("value") ?? (r.replace(/^#/, "") || `item-${e + 1}`);
    return { current: t.hasAttribute("current"), href: r, label: a, value: i };
  }
  syncCurrent() {
    const t = this.getAttribute("value") ?? "";
    for (const e of this.querySelectorAll(".blora-sidebar-nav__link"))
      t && e.dataset.value === t ? e.setAttribute("aria-current", "page") : e.removeAttribute("aria-current");
  }
}
function ii(n = customElements) {
  !n || n.get(ye) || n.define(ye, Kn);
}
const _e = "blora-result";
class Xn extends T {
  static get observedAttributes() {
    return ["variant", "title", "description"];
  }
  attributeChangedCallback() {
    this.isConnectedInternal && this.sync();
  }
  render() {
    const l = this.getAttribute("variant") ?? "info", t = this.ownerDocument.createElement("div");
    t.className = "blora-result", t.dataset.variant = l, t.dataset.bloraGenerated = "", t.setAttribute("role", "status");
    const e = this.ownerDocument.createElement("div");
    e.className = "blora-result__icon", e.appendChild(it(this.ownerDocument, l, 48));
    const r = this.ownerDocument.createElement("div");
    r.className = "blora-result__title", r.textContent = this.getAttribute("title") ?? "";
    const a = this.ownerDocument.createElement("div");
    a.className = "blora-result__desc", a.textContent = this.getAttribute("description") ?? "", t.append(e, r, a), this.replaceChildren(t);
  }
  sync() {
    const l = this.querySelector(".blora-result");
    if (!l) return;
    const t = this.getAttribute("variant") ?? "info";
    l.dataset.variant = t;
    const e = l.querySelector(".blora-result__icon");
    e && e.replaceChildren(it(this.ownerDocument, t, 48));
    const r = l.querySelector(".blora-result__title");
    r && (r.textContent = this.getAttribute("title") ?? "");
    const a = l.querySelector(".blora-result__desc");
    a && (a.textContent = this.getAttribute("description") ?? "");
  }
  bindEvents() {
  }
}
function si(n = customElements) {
  !n || n.get(_e) || n.define(_e, Xn);
}
const Ee = "blora-timeline";
class Qn extends T {
  constructor() {
    super(...arguments);
    y(this, "definitions", null);
  }
  render() {
    this.definitions || (this.definitions = Array.from(this.children).filter((e) => e.localName === "blora-timeline-item").map((e) => {
      var r;
      return {
        description: e.getAttribute("description") ?? "",
        time: e.getAttribute("time") ?? "",
        title: e.getAttribute("title") ?? ((r = e.textContent) == null ? void 0 : r.trim()) ?? "",
        variant: e.getAttribute("variant") ?? ""
      };
    }));
    const t = this.ownerDocument.createElement("div");
    t.className = "blora-timeline", t.dataset.bloraGenerated = "", t.setAttribute("role", "list"), this.definitions.forEach((e) => {
      const r = this.ownerDocument.createElement("div");
      r.className = "blora-timeline__item", r.setAttribute("role", "listitem");
      const a = this.ownerDocument.createElement("div");
      a.className = "blora-timeline__dot", e.variant && (a.dataset.variant = e.variant);
      const i = this.ownerDocument.createElement("div");
      i.className = "blora-timeline__time", i.textContent = e.time;
      const s = this.ownerDocument.createElement("div");
      if (s.className = "blora-timeline__title", s.textContent = e.title, r.append(a, i, s), e.description) {
        const o = this.ownerDocument.createElement("div");
        o.className = "blora-timeline__desc", o.textContent = e.description, r.appendChild(o);
      }
      t.appendChild(r);
    }), this.replaceChildren(t);
  }
  bindEvents() {
  }
}
function oi(n = customElements) {
  !n || n.get(Ee) || n.define(Ee, Qn);
}
export {
  ri as $,
  Da as A,
  La as B,
  qa as C,
  Ta as D,
  Ma as E,
  Ba as F,
  Ia as G,
  Oa as H,
  Ra as I,
  Pa as J,
  $a as K,
  Ga as L,
  Ha as M,
  za as N,
  Fa as O,
  Va as P,
  Ya as Q,
  Wa as R,
  Ua as S,
  Ka as T,
  Xa as U,
  Qa as V,
  ja as W,
  Ja as X,
  Za as Y,
  ti as Z,
  ei as _,
  ea as a,
  Jt as a$,
  ni as a0,
  ai as a1,
  ii as a2,
  si as a3,
  oi as a4,
  it as a5,
  Sa as a6,
  dt as a7,
  de as a8,
  Kt as a9,
  zt as aA,
  Dt as aB,
  Vt as aC,
  Ot as aD,
  It as aE,
  Ht as aF,
  xt as aG,
  vt as aH,
  Nt as aI,
  _e as aJ,
  bt as aK,
  gt as aL,
  ye as aM,
  St as aN,
  le as aO,
  ce as aP,
  Ct as aQ,
  wt as aR,
  Ft as aS,
  kt as aT,
  At as aU,
  Lt as aV,
  Ee as aW,
  _t as aX,
  Bt as aY,
  ue as aZ,
  Et as a_,
  $t as aa,
  be as ab,
  he as ac,
  Zt as ad,
  re as ae,
  Qt as af,
  pe as ag,
  me as ah,
  qt as ai,
  ct as aj,
  Yt as ak,
  ht as al,
  fe as am,
  Gt as an,
  pt as ao,
  ae as ap,
  se as aq,
  Pt as ar,
  Rt as as,
  ve as at,
  Tt as au,
  ie as av,
  oe as aw,
  Xt as ax,
  ge as ay,
  Ae as az,
  aa as b,
  jt as b0,
  Mt as b1,
  ze as b2,
  $n as b3,
  en as b4,
  Hr as b5,
  Gn as b6,
  Hn as b7,
  _n as b8,
  Cn as b9,
  Yr as bA,
  hr as bB,
  Ze as bC,
  gr as bD,
  Xn as bE,
  Fe as bF,
  er as bG,
  Kn as bH,
  fr as bI,
  Mn as bJ,
  In as bK,
  ur as bL,
  br as bM,
  Ur as bN,
  pr as bO,
  ir as bP,
  Er as bQ,
  Qn as bR,
  or as bS,
  qr as bT,
  Rn as bU,
  cr as bV,
  mn as bW,
  gn as bX,
  Dr as bY,
  Na as bZ,
  Te as b_,
  dn as ba,
  zn as bb,
  Fn as bc,
  wr as bd,
  Ge as be,
  Zr as bf,
  Ue as bg,
  Vn as bh,
  Fr as bi,
  je as bj,
  xn as bk,
  Dn as bl,
  $r as bm,
  Rr as bn,
  Yn as bo,
  Sr as bp,
  Sn as bq,
  qn as br,
  cn as bs,
  Wn as bt,
  Un as bu,
  Wr as bv,
  yr as bw,
  Qr as bx,
  Ir as by,
  Mr as bz,
  ia as c,
  ra as d,
  sa as e,
  na as f,
  oa as g,
  la as h,
  ca as i,
  ua as j,
  da as k,
  ba as l,
  ha as m,
  pa as n,
  ma as o,
  fa as p,
  va as q,
  ga as r,
  Aa as s,
  ya as t,
  _a as u,
  Ea as v,
  Ca as w,
  wa as x,
  xa as y,
  ka as z
};
