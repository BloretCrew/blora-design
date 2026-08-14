const b = "展开评论", A = "收起评论";
function m(e) {
  var l, n;
  const t = (l = e.ownerDocument) == null ? void 0 : l.defaultView;
  return !!((n = t == null ? void 0 : t.matchMedia) != null && n.call(t, "(prefers-reduced-motion: reduce)").matches);
}
function H(e) {
  return e.ownerDocument ?? document;
}
function x(e) {
  var t;
  return ((t = e.ownerDocument) == null ? void 0 : t.defaultView) ?? null;
}
function L(e, t) {
  let l = e.querySelector("[data-blora-thread-body], .blora-post__replies-body");
  return l || (l = H(e).createElement("div"), l.className = "blora-post__replies-body", l.setAttribute("data-blora-thread-body", ""), Array.from(e.children).forEach((o) => {
    o !== t && o instanceof HTMLElement && o.classList.contains("blora-post") && l.appendChild(o);
  }), t && t.parentElement === e ? e.insertBefore(l, t) : e.appendChild(l), l);
}
function E(e) {
  return e.querySelector("[data-blora-thread-toggle], .blora-post__collapse") ?? null;
}
function _(e, t) {
  return {
    expand: (e == null ? void 0 : e.getAttribute("data-label-expand")) || t.expandLabel,
    collapse: (e == null ? void 0 : e.getAttribute("data-label-collapse")) || t.collapseLabel
  };
}
function i(e, t, l) {
  e && (e.textContent = t ? l.collapse : l.expand, e.setAttribute("aria-expanded", String(t)));
}
function T(e, t) {
  if (typeof document > "u")
    return {
      toggle: () => {
      },
      expand: () => {
      },
      collapse: () => {
      },
      toggleReact: () => {
      },
      destroy: () => {
      }
    };
  const l = {
    expandLabel: (t == null ? void 0 : t.expandLabel) ?? b,
    collapseLabel: (t == null ? void 0 : t.collapseLabel) ?? A
  }, n = new AbortController(), { signal: o } = n;
  function d(a) {
    a.classList.toggle("is-active"), a.setAttribute("aria-pressed", String(a.classList.contains("is-active")));
  }
  function u(a) {
    var h;
    const s = E(a), r = L(a, s);
    if (!r) return;
    const c = _(s, l);
    if (a.classList.remove("is-collapsed"), m(e)) {
      r.style.maxHeight = "", i(s, !0, c);
      return;
    }
    r.style.maxHeight = "0px", r.offsetHeight, r.style.maxHeight = `${r.scrollHeight}px`, i(s, !0, c);
    const g = (y) => {
      y.propertyName && y.propertyName !== "max-height" || (a.classList.contains("is-collapsed") || (r.style.maxHeight = "none"), r.removeEventListener("transitionend", g));
    };
    r.addEventListener("transitionend", g, { signal: o }), (h = x(e)) == null || h.setTimeout(() => {
      a.classList.contains("is-collapsed") || (r.style.maxHeight = "none");
    }, 420);
  }
  function p(a) {
    const s = E(a), r = L(a, s);
    if (!r) return;
    const c = _(s, l);
    if (m(e)) {
      a.classList.add("is-collapsed"), r.style.maxHeight = "", i(s, !1, c);
      return;
    }
    r.style.maxHeight = `${r.scrollHeight}px`, r.offsetHeight, a.classList.add("is-collapsed"), r.style.maxHeight = "0px", i(s, !1, c);
  }
  function f(a) {
    a.classList.contains("is-collapsed") ? u(a) : p(a);
  }
  return e.querySelectorAll(
    "[data-blora-thread-toggle], .blora-post__collapse"
  ).forEach((a) => {
    a.addEventListener(
      "click",
      () => {
        const s = a.closest("[data-blora-thread-replies]") ?? a.closest(".blora-post__replies") ?? e.querySelector("[data-blora-thread-replies], .blora-post__replies");
        s && f(s);
      },
      { signal: o }
    );
  }), e.querySelectorAll("[data-blora-post-react]").forEach((a) => {
    a.addEventListener(
      "click",
      () => {
        d(a);
      },
      { signal: o }
    );
  }), {
    toggle: f,
    expand: u,
    collapse: p,
    toggleReact: d,
    destroy: () => {
      n.abort();
    }
  };
}
export {
  T as createThreadController
};
