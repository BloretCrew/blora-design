import { B as W, O as z } from "./overlay-controller-YPogqRmU.js";
import { c as g } from "./dialog-DUwFWfCH.js";
import { B as j, a as X, d as J, i as Q } from "./dialog-DUwFWfCH.js";
import { a5 as L } from "./timeline-CLciJ66l.js";
import { a6 as aa, a7 as ea, a8 as ta, a9 as ra, aa as na, ab as oa, ac as sa, ad as ia, ae as la, af as da, ag as ca, ah as ua, ai as Ba, aj as Aa, ak as fa, al as ba, am as _a, an as pa, ao as Ta, ap as ma, aq as Ra, ar as Oa, as as La, at as Ea, au as Ca, av as ga, aw as va, ax as Ga, ay as Sa, az as ha, aA as ya, aB as Na, aC as Ia, aD as Pa, aE as Da, aF as Ma, aG as wa, aH as ka, aI as xa, aJ as Ua, aK as Fa, aL as Va, aM as qa, aN as Ka, aO as $a, aP as Ha, aQ as Wa, aR as za, aS as Ya, aT as ja, aU as Xa, aV as Ja, aW as Qa, aX as Za, aY as ae, aZ as ee, a_ as te, a$ as re, b0 as ne, b1 as oe, b2 as se, b3 as ie, b4 as le, b5 as de, b6 as ce, b7 as ue, b8 as Be, b9 as Ae, ba as fe, bb as be, bc as _e, bd as pe, be as Te, bf as me, bg as Re, bh as Oe, bi as Le, bj as Ee, bk as Ce, bl as ge, bm as ve, bn as Ge, bo as Se, bp as he, bq as ye, br as Ne, bs as Ie, bt as Pe, bu as De, bv as Me, bw as we, bx as ke, by as xe, bz as Ue, bA as Fe, bB as Ve, bC as qe, bD as Ke, bE as $e, bF as He, bG as We, bH as ze, bI as Ye, bJ as je, bK as Xe, bL as Je, bM as Qe, bN as Ze, bO as at, bP as et, bQ as tt, bR as rt, bS as nt, bT as ot, bU as st, bV as it, bW as lt, bX as dt, bY as ct, d as ut, V as Bt, H as At, A as ft, W as bt, X as _t, M as pt, N as Tt, J as mt, Y as Rt, Z as Ot, s as Lt, a as Et, G as Ct, b as gt, _ as vt, B as Gt, c as St, O as ht, Q as yt, z as Nt, y as It, $ as Pt, t as Dt, P as Mt, R as wt, I as kt, a0 as xt, a1 as Ut, D as Ft, q as Vt, F as qt, x as Kt, w as $t, C as Ht, m as Wt, e as zt, p as Yt, a3 as jt, f as Xt, g as Jt, a2 as Qt, o as Zt, S as ar, T as er, k as tr, l as rr, E as nr, n as or, h as sr, r as ir, a4 as lr, i as dr, v as cr, U as ur, j as Br, K as Ar, L as fr, u as br, bZ as _r, b_ as pr } from "./timeline-CLciJ66l.js";
import { BLORA_SELECT_TAG as mr, BloraSelect as Rr, defineBloraSelect as Or } from "./components/select/index.js";
import { createTableController as Er } from "./components/table/index.js";
import { setButtonLoading as gr } from "./components/button/index.js";
const _ = "blora-message-container";
function v(a) {
  return a === "error" || a === "danger" ? "danger" : a === "success" || a === "warning" || a === "info" ? a : "info";
}
function G(a) {
  let e = a.querySelector(`.${_}`);
  return e || (e = a.createElement("div"), e.className = `${_} blora-portal`, e.setAttribute("data-blora-message-root", ""), (a.body || a.documentElement).appendChild(e)), e;
}
function S(a, e, t) {
  const r = a.createElement("span");
  r.className = "blora-message__icon", r.setAttribute("aria-hidden", "true"), r.appendChild(L(a, t, 16)), e.appendChild(r);
}
function h(a, e = document) {
  const t = typeof a == "string" ? { content: a } : a || {}, r = v(t.type), n = e.createElement("span");
  n.className = "blora-message", n.setAttribute("data-variant", r), n.setAttribute("role", "status"), S(e, n, r);
  const o = e.createElement("span");
  return o.className = "blora-message__content", o.textContent = (t.content ?? t.message ?? "").trim(), n.appendChild(o), n;
}
function f(a) {
  if (typeof document > "u") return null;
  const e = document, t = G(e), r = h(a, e);
  t.appendChild(r);
  let n = !1;
  const o = () => {
    n || (n = !0, r.classList.add("is-leaving"), window.setTimeout(() => {
      r.remove(), t.childElementCount === 0 && t.remove();
    }, 200));
  }, i = a.duration == null ? 3e3 : a.duration;
  return i > 0 && window.setTimeout(o, i), { close: o, el: r };
}
function y(a) {
  return f(typeof a == "string" ? { content: a } : a || {});
}
function A(a) {
  return (e, t) => {
    const r = { content: e, type: a };
    return t !== void 0 && (r.duration = t), f(r);
  };
}
const x = Object.assign(y, {
  open: (a) => f(a || {}),
  success: A("success"),
  info: A("info"),
  warning: A("warning"),
  danger: A("danger"),
  error: A("danger")
});
function p(a) {
  return Array.from(a.querySelectorAll(".blora-field, [data-blora-field]"));
}
function T(a) {
  return a.querySelector(
    "input:not([type=hidden]):not([type=submit]):not([type=button]), textarea, select"
  );
}
function m(a) {
  return a.querySelector(".blora-field__error, [data-blora-error]");
}
function u(a, e) {
  if (e) {
    a.setAttribute("data-state", "invalid"), a.classList.add("is-error");
    const t = m(a);
    t && (t.hidden = !1, t.textContent = e);
  } else {
    a.removeAttribute("data-state"), a.classList.remove("is-error");
    const t = m(a);
    t && (t.hidden = !0, t.textContent = "");
  }
}
function R(a) {
  return a.validity.valueMissing ? a.getAttribute("data-blora-required-message") || "此字段为必填项" : a.validity.typeMismatch || a.validity.patternMismatch ? a.getAttribute("data-blora-pattern-message") || "格式不正确" : a.validity.tooShort ? `至少 ${a.getAttribute("minlength")} 个字符` : a.validity.tooLong ? `最多 ${a.getAttribute("maxlength")} 个字符` : a.validationMessage || "无效输入";
}
function O(a) {
  const e = {}, t = new FormData(a);
  return t.forEach((r, n) => {
    const o = e[n], i = String(r);
    o === void 0 ? e[n] = i : Array.isArray(o) ? o.push(i) : e[n] = [o, i];
  }), a.querySelectorAll('input[type="checkbox"][name]').forEach((r) => {
    t.has(r.name) || (e[r.name] = r.checked);
  }), e;
}
function U(a) {
  if (typeof document > "u")
    return {
      validate: () => ({ valid: !0, errors: [], values: {} }),
      getValues: () => ({}),
      clearErrors: () => {
      },
      destroy: () => {
      }
    };
  a.classList.add("blora-form"), a.hasAttribute("data-blora-native-validate") || a.setAttribute("novalidate", "");
  const e = () => {
    p(a).forEach((s) => u(s, null));
  }, t = () => {
    const s = [];
    p(a).forEach((d) => {
      const c = T(d);
      if (!c || c.disabled) {
        u(d, null);
        return;
      }
      const C = d.getAttribute("data-blora-validate");
      let b = c.checkValidity(), B = "";
      C === "email" && c.value && (b = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.value), b || (B = c.getAttribute("data-blora-pattern-message") || "请输入有效邮箱")), b ? (u(d, null), d.setAttribute("data-state", "valid")) : (B = B || R(c), u(d, B), s.push({ name: c.name || "", message: B, field: d }));
    });
    const l = O(a);
    return { valid: s.length === 0, errors: s, values: l };
  }, r = (s) => {
    a.hasAttribute("data-blora-native-validate") || s.preventDefault();
  }, n = (s) => {
    const l = t();
    if (!l.valid) {
      s.preventDefault(), s.stopPropagation();
      return;
    }
    a.dispatchEvent(
      new CustomEvent("blora-form-submit", {
        bubbles: !0,
        detail: { values: l.values, form: a }
      })
    ), a.hasAttribute("data-blora-native-submit") || s.preventDefault();
  }, o = String(a.getAttribute("data-blora-validate-on") || "submit").split(/[\s,]+/).filter(Boolean), i = (s) => {
    if (!o.includes("blur")) return;
    const l = s.target.closest(
      ".blora-field, [data-blora-field]"
    );
    if (!l || !a.contains(l)) return;
    const d = T(l);
    d && (d.checkValidity() ? u(l, null) : u(l, R(d)));
  };
  return a.addEventListener("invalid", r, !0), a.addEventListener("submit", n), o.includes("blur") && a.addEventListener("focusout", i), {
    validate: t,
    getValues: () => O(a),
    clearErrors: e,
    destroy() {
      a.removeEventListener("invalid", r, !0), a.removeEventListener("submit", n), a.removeEventListener("focusout", i);
    }
  };
}
const E = {
  "top-right": "blora-notify-container--top-right",
  "top-left": "blora-notify-container--top-left",
  "bottom-right": "blora-notify-container--bottom-right",
  "bottom-left": "blora-notify-container--bottom-left"
};
function N(a) {
  return a === "error" || a === "danger" ? "danger" : a === "success" || a === "warning" || a === "info" ? a : "info";
}
function I(a, e) {
  const t = E[e];
  let r = a.querySelector(`.blora-notify-container.${t}`);
  return r || (r = a.createElement("div"), r.className = `blora-notify-container ${t} blora-portal`, r.setAttribute("data-placement", e), (a.body || a.documentElement).appendChild(r)), r;
}
function P(a, e, t) {
  const r = a.createElement("span");
  r.className = "blora-notification__icon", r.setAttribute("aria-hidden", "true"), r.appendChild(L(a, t, 22)), e.appendChild(r);
}
function D(a, e) {
  const t = a.createElement("button");
  return t.type = "button", t.className = "blora-notification__close", t.setAttribute("aria-label", "关闭"), t.appendChild(g("close", 16, a)), e.appendChild(t), t;
}
function M(a, e = document) {
  const t = typeof a == "string" ? { title: a } : a || {}, r = N(t.type), n = e.createElement("div");
  n.className = "blora-notification", n.setAttribute("data-variant", r), n.setAttribute("role", "status"), P(e, n, r);
  const o = e.createElement("div");
  o.className = "blora-notification__body";
  const i = e.createElement("div");
  if (i.className = "blora-notification__title", i.textContent = t.title || t.description || "", o.appendChild(i), t.description && t.title) {
    const s = e.createElement("div");
    s.className = "blora-notification__desc", s.textContent = t.description, o.appendChild(s);
  }
  return n.appendChild(o), D(e, n), n;
}
function F(a) {
  var l;
  if (typeof document > "u") return null;
  const e = typeof a == "string" ? { title: a } : a || {}, t = e.placement && E[e.placement] ? e.placement : "top-right", r = document, n = I(r, t), o = M(e, r), i = () => {
    o.classList.add("is-leaving"), setTimeout(() => o.remove(), 220);
  };
  (l = o.querySelector(".blora-notification__close")) == null || l.addEventListener("click", i), n.appendChild(o);
  const s = e.duration == null ? 4500 : e.duration;
  return s > 0 && setTimeout(i, s), { close: i, el: o };
}
function V(a) {
  const e = a.querySelector(".blora-notification__close, [data-blora-close]");
  if (!e) return { destroy: () => {
  } };
  const t = () => {
    a.classList.add("is-leaving"), a.dispatchEvent(new CustomEvent("blora-notification-close", { bubbles: !0 })), setTimeout(() => a.remove(), 220);
  };
  return e.addEventListener("click", t), {
    destroy() {
      e.removeEventListener("click", t);
    }
  };
}
const q = "2.0.0-alpha.1";
function K() {
  return typeof window < "u" && typeof document < "u";
}
export {
  aa as BACKTOP_ARROW_SVG,
  ea as BLORA_ACCORDION_TAG,
  ta as BLORA_ALERT_TAG,
  ra as BLORA_AUTOCOMPLETE_TAG,
  na as BLORA_BACKTOP_TAG,
  oa as BLORA_BANNER_TAG,
  sa as BLORA_BREADCRUMB_TAG,
  ia as BLORA_CALENDAR_TAG,
  la as BLORA_CAROUSEL_TAG,
  da as BLORA_CASCADER_TAG,
  ca as BLORA_CHART_CONTAINER_TAG,
  ua as BLORA_CHAT_TAG,
  Ba as BLORA_CHECKBOX_TAG,
  Aa as BLORA_COLLAPSE_TAG,
  fa as BLORA_COLOR_PICKER_TAG,
  ba as BLORA_COMMAND_TAG,
  _a as BLORA_COMMENT_TAG,
  pa as BLORA_COPY_TAG,
  Ta as BLORA_DATEPICKER_TAG,
  ma as BLORA_DECK_TAG,
  j as BLORA_DIALOG_TAG,
  Ra as BLORA_DOCK_TAG,
  Oa as BLORA_DRAWER_TAG,
  La as BLORA_DROPDOWN_TAG,
  Ea as BLORA_EMPTY_TAG,
  Ca as BLORA_FIELD_TAG,
  ga as BLORA_IMAGE_TAG,
  va as BLORA_MEGAMENU_TAG,
  Ga as BLORA_MENTIONS_TAG,
  Sa as BLORA_MOCKUP_TAG,
  ha as BLORA_NAVBAR_TAG,
  ya as BLORA_NUMBER_INPUT_TAG,
  Na as BLORA_OTP_TAG,
  Ia as BLORA_PAGINATION_TAG,
  Pa as BLORA_POPCONFIRM_TAG,
  Da as BLORA_POPOVER_TAG,
  Ma as BLORA_PROGRESS_TAG,
  wa as BLORA_RADIO_TAG,
  ka as BLORA_RANGE_TAG,
  xa as BLORA_RATE_TAG,
  Ua as BLORA_RESULT_TAG,
  Fa as BLORA_SEARCH_TAG,
  Va as BLORA_SEGMENTED_TAG,
  mr as BLORA_SELECT_TAG,
  qa as BLORA_SIDEBAR_NAV_TAG,
  Ka as BLORA_SLIDER_TAG,
  $a as BLORA_SPEED_DIAL_TAG,
  Ha as BLORA_SPLITTER_TAG,
  Wa as BLORA_STATISTIC_TAG,
  za as BLORA_STEPS_TAG,
  Ya as BLORA_SWAP_TAG,
  ja as BLORA_SWITCH_TAG,
  Xa as BLORA_TABS_TAG,
  Ja as BLORA_TAGS_INPUT_TAG,
  Qa as BLORA_TIMELINE_TAG,
  Za as BLORA_TIMEPICKER_TAG,
  ae as BLORA_TOOLTIP_TAG,
  ee as BLORA_TOUR_TAG,
  te as BLORA_TRANSFER_TAG,
  re as BLORA_TREE_SELECT_TAG,
  ne as BLORA_TREE_TAG,
  oe as BLORA_UPLOAD_TAG,
  se as BloraAccordion,
  ie as BloraAlert,
  le as BloraAutocomplete,
  de as BloraBacktop,
  ce as BloraBanner,
  ue as BloraBreadcrumb,
  Be as BloraCalendar,
  Ae as BloraCarousel,
  fe as BloraCascader,
  be as BloraChartContainer,
  _e as BloraChat,
  pe as BloraCheckbox,
  Te as BloraCollapse,
  me as BloraColorPicker,
  Re as BloraCommand,
  Oe as BloraComment,
  Le as BloraCopy,
  Ee as BloraDatepicker,
  Ce as BloraDeck,
  X as BloraDialog,
  ge as BloraDock,
  ve as BloraDrawer,
  Ge as BloraDropdown,
  W as BloraElement,
  Se as BloraEmpty,
  he as BloraField,
  ye as BloraImage,
  Ne as BloraMegamenu,
  Ie as BloraMentions,
  Pe as BloraMockup,
  De as BloraNavbar,
  Me as BloraNumberInput,
  we as BloraOtp,
  ke as BloraPagination,
  xe as BloraPopconfirm,
  Ue as BloraPopover,
  Fe as BloraProgress,
  Ve as BloraRadio,
  qe as BloraRange,
  Ke as BloraRate,
  $e as BloraResult,
  He as BloraSearch,
  We as BloraSegmented,
  Rr as BloraSelect,
  ze as BloraSidebarNav,
  Ye as BloraSlider,
  je as BloraSpeedDial,
  Xe as BloraSplitter,
  Je as BloraStatistic,
  Qe as BloraSteps,
  Ze as BloraSwap,
  at as BloraSwitch,
  et as BloraTabs,
  tt as BloraTagsInput,
  rt as BloraTimeline,
  nt as BloraTimepicker,
  ot as BloraTooltip,
  st as BloraTour,
  it as BloraTransfer,
  lt as BloraTree,
  dt as BloraTreeSelect,
  ct as BloraUpload,
  z as OverlayController,
  q as VERSION,
  g as createBloraIcon,
  U as createFormController,
  h as createMessageElement,
  V as createNotificationController,
  M as createNotificationElement,
  Er as createTableController,
  ut as defineBloraAccordion,
  Bt as defineBloraAlert,
  At as defineBloraAutocomplete,
  ft as defineBloraBacktop,
  bt as defineBloraBanner,
  _t as defineBloraBreadcrumb,
  pt as defineBloraCalendar,
  Tt as defineBloraCarousel,
  mt as defineBloraCascader,
  Rt as defineBloraChartContainer,
  Ot as defineBloraChat,
  Lt as defineBloraCheckbox,
  Et as defineBloraCollapse,
  Ct as defineBloraColorPicker,
  gt as defineBloraCommand,
  vt as defineBloraComment,
  Gt as defineBloraCopy,
  St as defineBloraDatepicker,
  ht as defineBloraDeck,
  J as defineBloraDialog,
  yt as defineBloraDock,
  Nt as defineBloraDrawer,
  It as defineBloraDropdown,
  Pt as defineBloraEmpty,
  Dt as defineBloraField,
  Mt as defineBloraImage,
  wt as defineBloraMegamenu,
  kt as defineBloraMentions,
  xt as defineBloraMockup,
  Ut as defineBloraNavbar,
  Ft as defineBloraNumberInput,
  Vt as defineBloraOtp,
  qt as defineBloraPagination,
  Kt as defineBloraPopconfirm,
  $t as defineBloraPopover,
  Ht as defineBloraProgress,
  Wt as defineBloraRadio,
  zt as defineBloraRange,
  Yt as defineBloraRate,
  jt as defineBloraResult,
  Xt as defineBloraSearch,
  Jt as defineBloraSegmented,
  Or as defineBloraSelect,
  Qt as defineBloraSidebarNav,
  Zt as defineBloraSlider,
  ar as defineBloraSpeedDial,
  er as defineBloraSplitter,
  tr as defineBloraStatistic,
  rr as defineBloraSteps,
  nr as defineBloraSwap,
  or as defineBloraSwitch,
  sr as defineBloraTabs,
  ir as defineBloraTagsInput,
  lr as defineBloraTimeline,
  dr as defineBloraTimepicker,
  cr as defineBloraTooltip,
  ur as defineBloraTour,
  Br as defineBloraTransfer,
  Ar as defineBloraTree,
  fr as defineBloraTreeSelect,
  br as defineBloraUpload,
  O as getFormValues,
  _r as initBackTop,
  Q as isBloraIconName,
  K as isBrowser,
  x as message,
  F as notify,
  pr as openImagePreview,
  gr as setButtonLoading
};
