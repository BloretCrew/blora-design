function s(e, t, l = {}) {
  const { label: a, disable: d = !0 } = l;
  if (t)
    e.setAttribute("aria-busy", "true"), e.setAttribute("data-loading", ""), d && (e.disabled = !0), a !== void 0 && (e.dataset.loadingLabel === void 0 && (e.dataset.loadingLabel = e.textContent ?? ""), e.textContent = a);
  else if (e.removeAttribute("aria-busy"), e.removeAttribute("data-loading"), d && (e.disabled = !1), a !== void 0 || e.dataset.loadingLabel !== void 0) {
    const i = e.dataset.loadingLabel;
    i !== void 0 && (e.textContent = i, delete e.dataset.loadingLabel);
  }
}
export {
  s as setButtonLoading
};
