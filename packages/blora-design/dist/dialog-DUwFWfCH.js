var k = Object.defineProperty;
var y = (r, i, e) => i in r ? k(r, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[i] = e;
var l = (r, i, e) => y(r, typeof i != "symbol" ? i + "" : i, e);
import { B as x, O as M } from "./overlay-controller-YPogqRmU.js";
const f = "http://www.w3.org/2000/svg";
function a(r, i, e) {
  const o = r.createElementNS(f, i);
  for (const [t, n] of Object.entries(e)) o.setAttribute(t, n);
  return o;
}
function w(r, i = 16, e = document) {
  const o = e.createElementNS(f, "svg");
  o.setAttribute("width", String(i)), o.setAttribute("height", String(i)), o.setAttribute("viewBox", "0 0 24 24"), o.setAttribute("fill", "none"), o.setAttribute("stroke", "currentColor"), o.setAttribute("stroke-width", "2"), o.setAttribute("stroke-linecap", "round"), o.setAttribute("stroke-linejoin", "round"), o.setAttribute("aria-hidden", "true");
  const t = [];
  switch (r) {
    case "arrow-up":
      t.push(a(e, "path", { d: "M12 19V5M5 12l7-7 7 7" }));
      break;
    case "calendar":
      t.push(
        a(e, "rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }),
        a(e, "path", { d: "M16 2v4M8 2v4M3 10h18" })
      );
      break;
    case "camera":
      t.push(
        a(e, "path", {
          d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        }),
        a(e, "circle", { cx: "12", cy: "13", r: "4" })
      );
      break;
    case "chart":
      t.push(
        a(e, "path", { d: "M3 3v18h18" }),
        a(e, "path", { d: "M7 16v-3M12 16V8M17 16V5" })
      );
      break;
    case "check":
      t.push(a(e, "path", { d: "M20 6 9 17l-5-5" }));
      break;
    case "chevron-down":
      t.push(a(e, "path", { d: "m6 9 6 6 6-6" }));
      break;
    case "chevron-left":
      t.push(a(e, "path", { d: "m15 18-6-6 6-6" }));
      break;
    case "chevron-right":
      t.push(a(e, "path", { d: "m9 18 6-6-6-6" }));
      break;
    case "circle-alert":
      t.push(
        a(e, "circle", { cx: "12", cy: "12", r: "10" }),
        a(e, "path", { d: "M12 8v4M12 16h.01" })
      );
      break;
    case "clock":
      t.push(
        a(e, "circle", { cx: "12", cy: "12", r: "10" }),
        a(e, "path", { d: "M12 6v6l4 2" })
      );
      break;
    case "close":
      t.push(a(e, "path", { d: "M18 6 6 18M6 6l12 12" }));
      break;
    case "copy":
      t.push(
        a(e, "rect", { x: "9", y: "9", width: "13", height: "13", rx: "2" }),
        a(e, "path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
      );
      break;
    case "document":
      t.push(
        a(e, "path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
        a(e, "path", { d: "M14 2v6h6" })
      );
      break;
    case "document-add":
      t.push(
        a(e, "path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
        a(e, "path", { d: "M14 2v6h6M12 18v-6M9 15h6" })
      );
      break;
    case "ellipsis":
      t.push(
        a(e, "circle", { cx: "5", cy: "12", r: "1" }),
        a(e, "circle", { cx: "12", cy: "12", r: "1" }),
        a(e, "circle", { cx: "19", cy: "12", r: "1" })
      );
      break;
    case "eye":
      t.push(
        a(e, "path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" }),
        a(e, "circle", { cx: "12", cy: "12", r: "3" })
      );
      break;
    case "folder":
      t.push(
        a(e, "path", {
          d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
        })
      );
      break;
    case "home":
      t.push(
        a(e, "path", { d: "m3 11 9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
        a(e, "path", { d: "M9 22V12h6v10" })
      );
      break;
    case "image":
      t.push(
        a(e, "rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
        a(e, "circle", { cx: "9", cy: "9", r: "2" }),
        a(e, "path", { d: "m21 15-3.5-3.5a2 2 0 0 0-2.8 0L6 20" })
      );
      break;
    case "inbox":
      t.push(
        a(e, "path", {
          d: "M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
        })
      );
      break;
    case "info":
      t.push(
        a(e, "circle", { cx: "12", cy: "12", r: "10" }),
        a(e, "path", { d: "M12 16v-4M12 8h.01" })
      );
      break;
    case "mail":
      t.push(
        a(e, "rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }),
        a(e, "path", { d: "m3 7 9 6 9-6" })
      );
      break;
    case "message":
      t.push(
        a(e, "path", {
          d: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"
        })
      );
      break;
    case "mic":
      t.push(
        a(e, "path", {
          d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"
        })
      );
      break;
    case "minus":
      t.push(a(e, "path", { d: "M5 12h14" }));
      break;
    case "moon":
      t.push(a(e, "path", { d: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" }));
      break;
    case "pencil":
      t.push(
        a(e, "path", { d: "M12 20h9" }),
        a(e, "path", { d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" })
      );
      break;
    case "phone":
      t.push(
        a(e, "path", {
          d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"
        })
      );
      break;
    case "plus":
      t.push(a(e, "path", { d: "M12 5v14M5 12h14" }));
      break;
    case "search":
      t.push(
        a(e, "circle", { cx: "11", cy: "11", r: "7" }),
        a(e, "path", { d: "m21 21-4.34-4.34" })
      );
      break;
    case "settings":
      t.push(
        a(e, "path", {
          d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
        }),
        a(e, "circle", { cx: "12", cy: "12", r: "3" })
      );
      break;
    case "share":
      t.push(
        a(e, "circle", { cx: "18", cy: "5", r: "3" }),
        a(e, "circle", { cx: "6", cy: "12", r: "3" }),
        a(e, "circle", { cx: "18", cy: "19", r: "3" }),
        a(e, "path", { d: "m8.6 10.5 6.8-4M8.6 13.5l6.8 4" })
      );
      break;
    case "smile":
      t.push(
        a(e, "circle", { cx: "12", cy: "12", r: "10" }),
        a(e, "path", { d: "M8 14s1.5 2 4 2 4-2 4-2" }),
        a(e, "path", { d: "M9 9h.01M15 9h.01" })
      );
      break;
    case "star":
      t.push(
        a(e, "path", {
          d: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1z"
        })
      );
      break;
    case "sun":
      t.push(
        a(e, "circle", { cx: "12", cy: "12", r: "4" }),
        a(e, "path", {
          d: "M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"
        })
      );
      break;
    case "trash":
      t.push(a(e, "path", { d: "M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6" }));
      break;
    case "upload":
      t.push(
        a(e, "path", { d: "M12 3v12m5-7-5-5-5 5" }),
        a(e, "path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" })
      );
      break;
    case "user":
      t.push(
        a(e, "circle", { cx: "12", cy: "8", r: "5" }),
        a(e, "path", { d: "M20 21a8 8 0 0 0-16 0" })
      );
      break;
  }
  return o.append(...t), o;
}
const A = /* @__PURE__ */ new Set([
  "arrow-up",
  "calendar",
  "camera",
  "chart",
  "check",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "circle-alert",
  "clock",
  "close",
  "copy",
  "document",
  "document-add",
  "ellipsis",
  "eye",
  "folder",
  "home",
  "image",
  "inbox",
  "info",
  "mail",
  "message",
  "mic",
  "minus",
  "moon",
  "pencil",
  "phone",
  "plus",
  "search",
  "settings",
  "share",
  "smile",
  "star",
  "sun",
  "trash",
  "upload",
  "user"
]);
function N(r) {
  return A.has(r);
}
const C = ':host{display:none}:host([open]){display:block;position:fixed;top:0;right:0;bottom:0;left:0;z-index:var(--blora-z-modal)}.blora-dialog__backdrop{position:fixed;top:0;right:0;bottom:0;left:0;width:auto;height:auto;margin:0;padding:max(var(--blora-space-5),env(safe-area-inset-top,0px)) max(var(--blora-space-5),env(safe-area-inset-inline-end,0px)) max(var(--blora-space-5),env(safe-area-inset-bottom,0px)) max(var(--blora-space-5),env(safe-area-inset-inline-start,0px));border:0;background:transparent;z-index:var(--blora-z-modal);display:flex;align-items:center;justify-content:center;box-sizing:border-box}.blora-dialog__mask{position:absolute;top:0;right:0;bottom:0;left:0;background:var(--blora-color-overlay-modal);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);animation:blora-dialog-fade-in var(--blora-duration-base) var(--blora-easing-standard)}.blora-dialog__panel{position:relative;min-width:0;background:var(--blora-color-surface-default);border-radius:var(--blora-radius-xl);box-shadow:var(--blora-shadow-4);max-width:var(--blora-dialog-max-width, 520px);width:100%;max-height:calc(100dvh - 2 * var(--blora-space-5));overflow-y:auto;overscroll-behavior:contain;animation:blora-dialog-pop-in var(--blora-duration-base) var(--blora-easing-overshoot)}:host([size="sm"]) .blora-dialog__panel{--blora-dialog-max-width: 400px}:host([size="lg"]) .blora-dialog__panel{--blora-dialog-max-width: 800px}.blora-dialog__header{position:relative;display:flex;align-items:center;justify-content:space-between;padding:var(--blora-space-5) var(--blora-space-6)}.blora-dialog__header:after{position:absolute;inset-inline:var(--blora-space-6);inset-block-end:0;border-block-end:var(--blora-border-subtle);content:"";pointer-events:none}.blora-dialog__title{font-family:var(--blora-font-heading);font-size:var(--blora-text-xl);color:var(--blora-color-text-primary);margin:0}.blora-dialog__close-button{color:var(--blora-color-text-subtle);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:.3em;border-radius:var(--blora-radius-sm);border:none;background:none;transition:all var(--blora-duration-fast) var(--blora-easing-standard)}.blora-dialog__close-button:hover{color:var(--blora-color-text-primary);background:var(--blora-color-surface-raised)}.blora-dialog__body{padding:var(--blora-space-6);color:var(--blora-color-text-emphasis);font-size:var(--blora-text-sm)}.blora-dialog__footer{position:relative;padding:var(--blora-space-4) var(--blora-space-6);display:flex;justify-content:flex-end;gap:var(--blora-space-2)}.blora-dialog__footer[hidden]{display:none}.blora-dialog__footer:before{position:absolute;inset-inline:var(--blora-space-6);inset-block-start:0;border-block-start:var(--blora-border-subtle);content:"";pointer-events:none}:host([data-closing]) .blora-dialog__mask{animation:blora-dialog-fade-out var(--blora-duration-base) var(--blora-easing-standard) forwards}:host([data-closing]) .blora-dialog__panel{animation:blora-dialog-pop-out var(--blora-duration-base) var(--blora-easing-standard) forwards}@media(max-width:560px){.blora-dialog__backdrop{align-items:center;justify-content:center;padding:max(var(--blora-space-4),env(safe-area-inset-top,0px)) max(var(--blora-space-3),env(safe-area-inset-inline-end,0px)) max(var(--blora-space-4),env(safe-area-inset-bottom,0px)) max(var(--blora-space-3),env(safe-area-inset-inline-start,0px))}.blora-dialog__panel{max-height:min(calc(100dvh - 2 * var(--blora-space-5)),90dvh);border-radius:var(--blora-radius-xl);margin-inline:auto}.blora-dialog__header,.blora-dialog__body{padding:var(--blora-space-4)}.blora-dialog__footer{padding:var(--blora-space-3) var(--blora-space-4);flex-wrap:wrap}.blora-dialog__footer .blora-button{flex:1 1 auto;width:auto;min-width:0;max-width:100%}}@keyframes blora-dialog-fade-in{0%{opacity:0}to{opacity:1}}@keyframes blora-dialog-fade-out{0%{opacity:1}to{opacity:0}}@keyframes blora-dialog-pop-in{0%{opacity:0;transform:scale(.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}@keyframes blora-dialog-pop-out{0%{opacity:1;transform:scale(1) translateY(0)}to{opacity:0;transform:scale(.94) translateY(8px)}}@media(prefers-reduced-motion:reduce){.blora-dialog__mask,.blora-dialog__panel{animation-duration:.01ms!important}}', v = "blora-dialog";
class E extends x {
  constructor() {
    super(...arguments);
    l(this, "overlay", null);
    l(this, "closeAnimationTimer", null);
    l(this, "visible", !1);
    l(this, "_shadow", null);
    l(this, "_panel", null);
    l(this, "_backdrop", null);
    l(this, "_closeButton", null);
    l(this, "_footer", null);
    l(this, "_footerSlot", null);
    l(this, "_backdropInTopLayer", !1);
  }
  static get observedAttributes() {
    return ["open", "size", "close-on-escape", "close-on-outside-click"];
  }
  attributeChangedCallback(e, o, t) {
    e === "open" && this.isConnectedInternal && (t !== null ? this.show() : this.close());
  }
  render() {
    if (this.shadowRoot) return;
    const e = this.attachShadow({ mode: "open" }), o = document.createElement("style");
    o.textContent = C, e.appendChild(o);
    const t = document.createElement("div");
    t.className = "blora-dialog__backdrop", t.setAttribute("part", "backdrop"), t.setAttribute("popover", "manual");
    const n = document.createElement("div");
    n.className = "blora-dialog__mask";
    const s = document.createElement("div");
    s.className = "blora-dialog__panel", s.setAttribute("part", "panel"), s.setAttribute("role", "dialog"), s.setAttribute("aria-modal", "true");
    const h = document.createElement("div");
    h.className = "blora-dialog__header", h.setAttribute("part", "header");
    const g = document.createElement("slot");
    g.name = "header";
    const d = document.createElement("h2");
    d.className = "blora-dialog__title", d.setAttribute("part", "title");
    const m = document.createElement("slot");
    m.name = "title", d.appendChild(m), h.appendChild(d);
    const c = document.createElement("button");
    c.className = "blora-dialog__close-button", c.setAttribute("part", "close-button"), c.setAttribute("aria-label", "Close dialog"), c.type = "button", c.appendChild(w("close", 18, this.ownerDocument)), h.appendChild(c);
    const b = document.createElement("div");
    b.className = "blora-dialog__body", b.setAttribute("part", "body");
    const _ = document.createElement("slot");
    b.appendChild(_);
    const p = document.createElement("div");
    p.className = "blora-dialog__footer", p.setAttribute("part", "footer");
    const u = document.createElement("slot");
    u.name = "footer", p.appendChild(u), s.appendChild(h), s.appendChild(b), s.appendChild(p), t.appendChild(n), t.appendChild(s), e.appendChild(t), this._shadow = e, this._panel = s, this._backdrop = t, this._closeButton = c, this._footer = p, this._footerSlot = u;
  }
  bindEvents() {
    this._closeButton && (this.syncFooterVisibility(), this._footerSlot && this.listen(this._footerSlot, "slotchange", () => this.syncFooterVisibility()), this.listen(this._closeButton, "click", () => {
      this.close("close-button");
    }), this._backdrop && this.listen(this._backdrop, "pointerdown", (e) => {
      var o, t;
      this.allowsOutsideClickClose() && (e.target === this._backdrop || (t = (o = e.target) == null ? void 0 : o.classList) != null && t.contains("blora-dialog__mask")) && this.close("outside-click");
    }), this.listen(this, "blora-close-request", () => {
      this.close("request");
    }), this.hasAttribute("open") && (this.visible = !1, this.show()));
  }
  syncFooterVisibility() {
    if (!this._footer || !this._footerSlot) return;
    const e = this._footerSlot.assignedNodes({ flatten: !0 }).some(
      (o) => {
        var t;
        return o.nodeType === Node.ELEMENT_NODE || (((t = o.textContent) == null ? void 0 : t.trim().length) ?? 0) > 0;
      }
    );
    this._footer.hidden = !e;
  }
  /** `close-on-outside-click="false"` (string) must not close; bare attr still true. */
  allowsOutsideClickClose() {
    return this.getAttribute("close-on-outside-click") !== "false";
  }
  show() {
    var t;
    if (this.visible || !this.emit(
      "blora-before-open",
      {
        source: "api",
        reason: "show"
      },
      { cancelable: !0 }
    )) return;
    this.visible = !0, this.setAttribute("open", ""), this._backdrop && typeof this._backdrop.showPopover == "function" && (this._backdrop.showPopover(), this._backdropInTopLayer = !0);
    const o = {
      modal: !0,
      closeOnEscape: this.getAttribute("close-on-escape") !== "false",
      closeOnOutsidePointer: this.getAttribute("close-on-outside-click") !== "false",
      restoreFocus: !0,
      trapFocus: !0,
      lockScroll: !0
    };
    if (this._panel) {
      this.overlay = new M(this._panel, o), this.overlay.open();
      const n = (t = this._shadow) == null ? void 0 : t.querySelector('slot[name="title"]');
      if (n) {
        const s = n.assignedElements();
        s.length > 0 && s[0].id && this._panel.setAttribute("aria-labelledby", s[0].id);
      }
    }
    this.emit("blora-open", {
      source: "api",
      reason: "show"
    });
  }
  close(e = "api") {
    var n;
    if (!this.visible || !this.emit(
      "blora-before-close",
      {
        source: "api",
        reason: e
      },
      { cancelable: !0 }
    )) return;
    this.visible = !1, (n = this.overlay) == null || n.close(), this.overlay = null, this.setAttribute("data-closing", "");
    const t = 260;
    this.closeAnimationTimer = setTimeout(() => {
      var s;
      this._backdropInTopLayer && typeof ((s = this._backdrop) == null ? void 0 : s.hidePopover) == "function" && (this._backdrop.hidePopover(), this._backdropInTopLayer = !1), this.removeAttribute("open"), this.removeAttribute("data-closing"), this.closeAnimationTimer = null, this.emit("blora-close", {
        source: "api",
        reason: e
      });
    }, t);
  }
  onDisconnect() {
    var e, o;
    this.closeAnimationTimer && (clearTimeout(this.closeAnimationTimer), this.closeAnimationTimer = null), (e = this.overlay) == null || e.destroy(), this.overlay = null, this._backdropInTopLayer && typeof ((o = this._backdrop) == null ? void 0 : o.hidePopover) == "function" && (this._backdrop.hidePopover(), this._backdropInTopLayer = !1);
  }
}
function V(r = customElements) {
  !r || r.get(v) || r.define(v, E);
}
export {
  v as B,
  E as a,
  w as c,
  V as d,
  N as i
};
