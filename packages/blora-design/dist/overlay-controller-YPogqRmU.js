var d = Object.defineProperty;
var f = (e, t, n) => t in e ? d(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var i = (e, t, n) => f(e, typeof t != "symbol" ? t + "" : t, n);
const p = typeof HTMLElement < "u" ? HTMLElement : class {
};
class k extends p {
  constructor() {
    super(...arguments);
    i(this, "abortController", new AbortController());
    i(this, "_isConnected", !1);
    i(this, "_connectScheduled", !1);
    i(this, "_mounted", !1);
  }
  get isConnectedInternal() {
    return this._isConnected;
  }
  get hasMounted() {
    return this._mounted;
  }
  connectedCallback() {
    var n;
    if (!this._isConnected) {
      if (((n = this.ownerDocument) == null ? void 0 : n.readyState) === "loading") {
        if (this._connectScheduled) return;
        this._connectScheduled = !0, setTimeout(() => {
          this._connectScheduled = !1, this.isConnected && !this._isConnected && this.connectNow();
        }, 0);
        return;
      }
      this.connectNow();
    }
  }
  connectNow() {
    this._isConnected = !0, this.abortController = new AbortController(), this.upgradeProperties(), this._mounted ? this.sync() : (this.render(), this._mounted = !0), this.bindEvents();
  }
  disconnectedCallback() {
    this.abortController.abort(), this._isConnected = !1, this.onDisconnect();
  }
  listen(n, o, s, r = {}) {
    n.addEventListener(o, s, {
      ...r,
      signal: this.abortController.signal
    });
  }
  emit(n, o, s = {}) {
    return this.dispatchEvent(
      new CustomEvent(n, {
        detail: o,
        bubbles: !0,
        composed: !0,
        ...s
      })
    );
  }
  /** Patch the existing official tree after reconnect or a non-structural attribute change. */
  sync() {
  }
  onDisconnect() {
  }
  /** Re-attach listeners/controllers without rebuilding the official tree. */
  rebind() {
    this.onDisconnect(), this.abortController.abort(), this.abortController = new AbortController(), this.bindEvents();
  }
  upgradeProperties() {
  }
}
const y = {
  modal: !0,
  closeOnEscape: !0,
  closeOnOutsidePointer: !0,
  restoreFocus: !0,
  trapFocus: !0,
  lockScroll: !0
}, u = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap();
function b(e) {
  const t = (c.get(e) ?? 0) + 1;
  c.set(e, t), e.documentElement.setAttribute("data-blora-modal-open", "");
}
function v(e) {
  const t = Math.max(0, (c.get(e) ?? 0) - 1);
  t === 0 ? (c.delete(e), e.documentElement.removeAttribute("data-blora-modal-open")) : c.set(e, t);
}
function a(e) {
  let t = u.get(e);
  return t || (t = [], u.set(e, t)), t;
}
function m(e) {
  const t = (l.get(e) ?? 0) + 1;
  l.set(e, t), t === 1 && (e.body.style.overflow = "hidden");
}
function w(e) {
  const t = Math.max(0, (l.get(e) ?? 0) - 1);
  t === 0 ? (l.delete(e), e.body.style.overflow = "") : l.set(e, t);
}
function h(e) {
  const t = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    "[contenteditable]"
  ].join(", ");
  return Array.from(e.querySelectorAll(t)).filter(
    (n) => n.offsetParent !== null || n === e.ownerDocument.activeElement
  );
}
function E(e, t) {
  if (e.key !== "Tab") return;
  const n = h(t);
  if (n.length === 0) return;
  const o = n[0], s = n[n.length - 1], r = t.ownerDocument.activeElement;
  e.shiftKey ? (r === o || !t.contains(r)) && (e.preventDefault(), s.focus()) : (r === s || !t.contains(r)) && (e.preventDefault(), o.focus());
}
class g {
  constructor(t, n = {}) {
    i(this, "entry", null);
    i(this, "overlay");
    i(this, "options");
    i(this, "onKeyDown", (t) => {
      if (!this.entry) return;
      const n = a(this.entry.document);
      n[n.length - 1] === this.entry && (t.key === "Escape" && this.options.closeOnEscape && (t.preventDefault(), t.stopPropagation(), this.overlay.dispatchEvent(
        new CustomEvent("blora-close-request", { bubbles: !0, composed: !0 })
      )), this.options.trapFocus && E(t, this.overlay));
    });
    i(this, "onPointerDown", (t) => {
      t.target === this.overlay && this.overlay.dispatchEvent(
        new CustomEvent("blora-close-request", { bubbles: !0, composed: !0 })
      );
    });
    this.overlay = t, this.options = { ...y, ...n };
  }
  open() {
    var o;
    if (this.entry) return;
    const t = this.overlay.ownerDocument, n = t.activeElement;
    this.entry = {
      overlay: this.overlay,
      document: t,
      options: this.options,
      previousFocus: n,
      scrollLockCount: 0
    }, a(t).push(this.entry), this.options.modal && b(t), this.options.lockScroll && (m(t), this.entry.scrollLockCount = 1), (this.options.trapFocus || this.options.restoreFocus) && ((o = t.defaultView) == null || o.requestAnimationFrame(() => {
      const s = h(this.overlay);
      s.length > 0 ? s[0].focus() : (this.overlay.setAttribute("tabindex", "-1"), this.overlay.focus());
    })), (this.options.closeOnEscape || this.options.trapFocus) && t.addEventListener("keydown", this.onKeyDown), this.options.closeOnOutsidePointer && this.overlay.addEventListener("pointerdown", this.onPointerDown);
  }
  close() {
    var o;
    if (!this.entry) return;
    const t = a(this.entry.document), n = t.indexOf(this.entry);
    if (n >= 0 && t.splice(n, 1), this.entry.scrollLockCount > 0 && w(this.entry.document), this.options.modal && v(this.entry.document), this.entry.document.removeEventListener("keydown", this.onKeyDown), this.overlay.removeEventListener("pointerdown", this.onPointerDown), this.options.restoreFocus && this.entry.previousFocus instanceof HTMLElement) {
      const s = this.entry.previousFocus;
      (o = this.entry.document.defaultView) == null || o.requestAnimationFrame(() => {
        s.dispatchEvent(new Event("focus")), s.focus();
      });
    }
    this.entry = null;
  }
  destroy() {
    this.close();
  }
}
export {
  k as B,
  g as O
};
