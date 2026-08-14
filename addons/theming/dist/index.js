var I = Object.defineProperty;
var R = (r, t, e) => t in r ? I(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var _ = (r, t, e) => R(r, typeof t != "symbol" ? t + "" : t, e);
const p = {
  coral: {
    name: "Coral",
    description: "深靛灰与柔和珊瑚红",
    colors: ["#FAF7F8", "#303143", "#9F5964", "#5D6680", "#5B756B"]
  },
  cinnabar: {
    name: "Cinnabar",
    description: "暖白基底与低饱和红",
    colors: ["#F8F4EC", "#A0392E", "#3D4A5C", "#5A7B6B", "#B89968"]
  },
  indigo: {
    name: "Indigo",
    description: "冷灰基底与沉静蓝",
    colors: ["#F4F5F8", "#405D87", "#55756F", "#A74B52", "#AF8A55"]
  },
  lotus: {
    name: "Lotus",
    description: "柔和粉紫与低饱和绿",
    colors: ["#F8F4F6", "#9A466A", "#55786B", "#526078", "#B28A59"]
  },
  ocean: {
    name: "Ocean",
    description: "清爽青蓝与低饱和绿",
    colors: ["#F1F7F6", "#176B78", "#39745F", "#365D78", "#B08A55"]
  },
  graphite: {
    name: "Graphite",
    description: "冷灰界面与低饱和钢蓝",
    colors: ["#F6F7F8", "#171A1F", "#4F6578", "#596A86", "#5B756B"]
  },
  mono: {
    name: "Mono",
    description: "纯中性灰与近黑主色",
    colors: ["#FAFAF9", "#111110", "#34363A", "#5E6672", "#616D67"]
  },
  circuit: {
    name: "Circuit",
    description: "碳灰界面与克制青色",
    colors: ["#F4F5F5", "#161A1A", "#3E6C70", "#536D7D", "#4F7368"]
  },
  dusk: {
    name: "Dusk",
    description: "暮色灰紫",
    colors: ["#F6F4F8", "#3A3548", "#7A6B8A", "#5A6B7A", "#8A7A6A"]
  }
}, T = "blora-theme";
function x(r = document.documentElement) {
  return r.getAttribute("data-blora-theme") || "coral";
}
const M = "blora-color-scheme";
function N(r = document.documentElement) {
  return r.getAttribute("data-blora-color-scheme") === "dark" ? "dark" : "light";
}
function C(r, t = document.documentElement, e) {
  if (typeof document > "u") return;
  const n = t.ownerDocument ?? document;
  t.setAttribute("data-blora-color-scheme", r), t.style.colorScheme = r;
  const l = n.body;
  l && (l.style.backgroundColor = "", l.style.color = "", l.setAttribute("data-blora-color-scheme", r), l.style.colorScheme = r);
  for (const d of ["#storybook-root", ".sb-show-main", ".docs-story"])
    n.querySelectorAll(d).forEach((s) => {
      s.setAttribute("data-blora-color-scheme", r), s.style.colorScheme = r;
    });
  if ((e == null ? void 0 : e.persist) !== !1)
    try {
      localStorage.setItem(M, r);
    } catch {
    }
  (e == null ? void 0 : e.emit) !== !1 && t.dispatchEvent(
    new CustomEvent("blora-color-scheme-change", {
      bubbles: !0,
      detail: { scheme: r }
    })
  );
}
function O(r, t = document.documentElement, e) {
  if (typeof document > "u") return;
  const n = p[r] ? r : "coral";
  if (t.setAttribute("data-blora-theme", n), t.hasAttribute("data-blora-color-scheme") || C("light", t, { persist: !1, emit: !1 }), (e == null ? void 0 : e.persist) !== !1)
    try {
      localStorage.setItem(T, n);
    } catch {
    }
  (e == null ? void 0 : e.emit) !== !1 && t.dispatchEvent(
    new CustomEvent("blora-theme-change", { bubbles: !0, detail: { theme: n } })
  );
}
function z(r = document.documentElement) {
  let t = "coral";
  try {
    t = localStorage.getItem(T) || t;
  } catch {
  }
  p[t] || (t = "coral");
  let e = N(r);
  try {
    const n = localStorage.getItem(M);
    !r.hasAttribute("data-blora-color-scheme") && (n === "dark" || n === "light") && (e = n);
  } catch {
  }
  return r.hasAttribute("data-blora-color-scheme") || C(e, r, { persist: !1, emit: !1 }), O(t, r, { persist: !1, emit: !1 }), t;
}
function H(r) {
  if (typeof document > "u")
    return { close: () => {
    }, destroy: () => {
    }, open: () => {
    } };
  const t = r.ownerDocument, e = r.querySelector(
    "[data-blora-palette-trigger], .blora-palette-picker__trigger"
  );
  let n = r.querySelector(".blora-palette-picker__menu");
  if (!e) return { close: () => {
  }, destroy: () => {
  }, open: () => {
  } };
  if (n || (n = t.createElement("div"), n.className = "blora-palette-picker__menu", r.appendChild(n)), z(t.documentElement), e.setAttribute("aria-haspopup", "listbox"), e.setAttribute("aria-expanded", "false"), n.setAttribute("role", "listbox"), n.setAttribute("aria-label", "主题配色"), !n.querySelector("[data-blora-palette-option]")) {
    const o = t.createElement("div");
    o.className = "blora-palette-picker__head";
    const a = t.createElement("span");
    a.className = "blora-palette-picker__title", a.textContent = "主题配色";
    const c = t.createElement("span");
    c.className = "blora-palette-picker__hint", c.textContent = "选择一套调色板", o.append(a, c);
    const i = t.createElement("div");
    i.className = "blora-palette-picker__list";
    for (const [f, g] of Object.entries(p)) {
      const b = t.createElement("button");
      b.className = "blora-palette-card", b.type = "button", b.setAttribute("role", "option"), b.setAttribute("data-blora-palette-option", f);
      const E = t.createElement("span");
      E.className = "blora-palette-card__copy";
      const k = t.createElement("span");
      k.className = "blora-palette-card__name", k.textContent = g.name;
      const y = t.createElement("span");
      y.className = "blora-palette-card__desc", y.textContent = g.description, E.append(k, y);
      const A = t.createElement("span");
      A.className = "blora-palette-card__colors", A.setAttribute("aria-hidden", "true");
      for (const G of g.colors) {
        const v = t.createElement("span");
        v.className = "blora-palette-card__color", v.style.background = G, A.append(v);
      }
      b.append(E, A), i.append(b);
    }
    n.replaceChildren(o, i);
  }
  const l = () => Array.from(n.querySelectorAll("[data-blora-palette-option]")), d = () => {
    const o = x(t.documentElement);
    l().forEach(
      (c) => c.setAttribute(
        "aria-selected",
        String(c.getAttribute("data-blora-palette-option") === o)
      )
    );
    const a = e.querySelector(".blora-palette-picker__label");
    a && p[o] && (a.textContent = p[o].name);
  }, s = (o = !1) => {
    var a;
    if (t.querySelectorAll(
      "[data-blora-palette-picker].is-open, .blora-palette-picker.is-open"
    ).forEach((c) => {
      var i;
      c !== r && (c.classList.remove("is-open"), (i = c.querySelector("[data-blora-palette-trigger], .blora-palette-picker__trigger")) == null || i.setAttribute("aria-expanded", "false"));
    }), r.classList.add("is-open"), e.setAttribute("aria-expanded", "true"), o) {
      const c = l();
      (a = c.find((i) => i.getAttribute("aria-selected") === "true") || c[0]) == null || a.focus();
    }
  }, u = (o = !1) => {
    r.classList.remove("is-open"), e.setAttribute("aria-expanded", "false"), o && e.focus();
  }, h = (o) => {
    o.stopPropagation(), r.classList.contains("is-open") ? u() : s();
  }, m = (o) => {
    o.key === "ArrowDown" && (o.preventDefault(), s(!0));
  }, w = (o) => {
    const a = o.target.closest("[data-blora-palette-option]");
    a && (O(a.getAttribute("data-blora-palette-option") || "coral", t.documentElement), d(), u(!0));
  }, F = (o) => {
    var f;
    const a = l(), c = a.indexOf(t.activeElement);
    let i = c;
    if (o.key === "ArrowDown" || o.key === "ArrowRight")
      i = (c + 1 + a.length) % a.length;
    else if (o.key === "ArrowUp" || o.key === "ArrowLeft")
      i = (c - 1 + a.length) % a.length;
    else if (o.key === "Home") i = 0;
    else if (o.key === "End") i = a.length - 1;
    else if (o.key === "Escape") {
      o.preventDefault(), u(!0);
      return;
    } else return;
    o.preventDefault(), (f = a[i]) == null || f.focus();
  }, D = (o) => {
    r.contains(o.target) || u();
  }, L = () => d();
  return e.addEventListener("click", h), e.addEventListener("keydown", m), n.addEventListener("click", w), n.addEventListener("keydown", F), t.addEventListener("click", D), t.documentElement.addEventListener("blora-theme-change", L), d(), {
    close: () => u(!0),
    destroy() {
      e.removeEventListener("click", h), e.removeEventListener("keydown", m), n.removeEventListener("click", w), n.removeEventListener("keydown", F), t.removeEventListener("click", D), t.documentElement.removeEventListener("blora-theme-change", L);
    },
    open: () => s(!0)
  };
}
const S = "blora-palette-picker", B = "blora-color-scheme-toggle", P = typeof HTMLElement < "u" ? HTMLElement : class {
};
function q(r, t) {
  const e = r.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", t === "palette" ? "17" : "19"), e.setAttribute("height", t === "palette" ? "17" : "19"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none"), e.setAttribute("stroke", "currentColor"), e.setAttribute("stroke-width", "2"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-linejoin", "round"), e.setAttribute("aria-hidden", "true");
  const n = (d) => {
    const s = r.createElementNS("http://www.w3.org/2000/svg", "path");
    s.setAttribute("d", d), e.appendChild(s);
  }, l = (d, s, u, h = !1) => {
    const m = r.createElementNS("http://www.w3.org/2000/svg", "circle");
    m.setAttribute("cx", d), m.setAttribute("cy", s), m.setAttribute("r", u), h && m.setAttribute("fill", "currentColor"), e.appendChild(m);
  };
  return t === "moon" ? n("M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z") : t === "sun" ? (l("12", "12", "4"), n(
    "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M17.66 6.34l1.41-1.41"
  )) : (l("13.5", "6.5", ".5", !0), l("17.5", "10.5", ".5", !0), l("8.5", "7.5", ".5", !0), l("6.5", "12.5", ".5", !0), n("M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"), n("M19.5 15.5c-1.4 0-2.5 1.1-2.5 2.5 0 .7.3 1.3.7 1.8")), e;
}
class K extends P {
  constructor() {
    super(...arguments);
    _(this, "controller", null);
  }
  static get observedAttributes() {
    return ["button-variant", "size"];
  }
  connectedCallback() {
    this.render();
  }
  disconnectedCallback() {
    var e;
    (e = this.controller) == null || e.destroy(), this.controller = null;
  }
  attributeChangedCallback() {
    this.isConnected && this.render();
  }
  open() {
    var e;
    (e = this.controller) == null || e.open();
  }
  close() {
    var e;
    (e = this.controller) == null || e.close();
  }
  render() {
    var s, u;
    (s = this.controller) == null || s.destroy();
    const e = this.ownerDocument.createElement("div");
    e.className = "blora-palette-picker", e.dataset.bloraGenerated = "";
    const n = this.ownerDocument.createElement("button");
    n.type = "button", n.className = "blora-button blora-palette-picker__trigger", n.dataset.variant = this.getAttribute("button-variant") ?? "outline", n.dataset.size = this.getAttribute("size") ?? "sm", n.dataset.bloraPaletteTrigger = "", n.appendChild(q(this.ownerDocument, "palette"));
    const l = this.ownerDocument.createElement("span");
    l.className = "blora-palette-picker__label", l.textContent = ((u = p[x(this.ownerDocument.documentElement)]) == null ? void 0 : u.name) ?? "Coral", n.appendChild(l);
    const d = this.ownerDocument.createElement("div");
    d.className = "blora-palette-picker__menu", e.append(n, d), this.replaceChildren(e), this.controller = H(e);
  }
}
class j extends P {
  constructor() {
    super(...arguments);
    _(this, "sync", () => this.render());
  }
  static get observedAttributes() {
    return ["button-variant", "size"];
  }
  connectedCallback() {
    this.ownerDocument.documentElement.addEventListener("blora-color-scheme-change", this.sync), this.render();
  }
  disconnectedCallback() {
    this.ownerDocument.documentElement.removeEventListener("blora-color-scheme-change", this.sync);
  }
  attributeChangedCallback() {
    this.isConnected && this.render();
  }
  render() {
    const e = N(this.ownerDocument.documentElement), n = this.ownerDocument.createElement("button");
    n.type = "button", n.className = "blora-button blora-color-scheme-toggle__button", n.dataset.variant = this.getAttribute("button-variant") ?? "ghost", n.dataset.size = this.getAttribute("size") ?? "sm", n.setAttribute("aria-label", e === "dark" ? "切换为亮色主题" : "切换为暗色主题"), n.appendChild(q(this.ownerDocument, e === "dark" ? "sun" : "moon")), n.addEventListener("click", () => {
      C(e === "dark" ? "light" : "dark", this.ownerDocument.documentElement);
    }), this.replaceChildren(n);
  }
}
function Y(r = customElements) {
  r.get(S) || r.define(S, K), r.get(B) || r.define(B, j);
}
typeof customElements < "u" && Y(customElements);
export {
  B as BLORA_COLOR_SCHEME_TOGGLE_TAG,
  S as BLORA_PALETTE_PICKER_TAG,
  j as BloraColorSchemeToggle,
  K as BloraPalettePicker,
  p as THEME_PRESETS,
  C as applyColorScheme,
  O as applyTheme,
  z as bootThemeFromStorage,
  Y as defineBloraThemingElements,
  N as getColorScheme,
  x as getTheme
};
