function P(t) {
  var e, n, a;
  return !!((a = (n = (e = t.ownerDocument) == null ? void 0 : e.defaultView) == null ? void 0 : n.matchMedia) != null && a.call(n, "(prefers-reduced-motion: reduce)").matches);
}
function B(t) {
  if (typeof document > "u") return { destroy: () => {
  } };
  const e = Array.from(t.querySelectorAll(".blora-text-rotate__item"));
  if (e.length < 2 || P(t))
    return e.forEach((s, d) => {
      s.classList.toggle("is-active", d === 0), s.toggleAttribute("data-active", d === 0), s.setAttribute("aria-hidden", String(d !== 0));
    }), { destroy: () => {
    } };
  const n = t.ownerDocument.defaultView, a = Math.max(1200, Number(t.dataset.interval) || 3200);
  let i = Math.max(
    0,
    e.findIndex(
      (s) => s.classList.contains("is-active") || s.hasAttribute("data-active")
    )
  ), c = null;
  const u = (s) => {
    i = (s % e.length + e.length) % e.length, e.forEach((d, h) => {
      const p = h === i;
      d.classList.toggle("is-active", p), d.toggleAttribute("data-active", p), d.setAttribute("aria-hidden", String(!p));
    });
  }, o = () => {
    c == null && (c = n.setInterval(() => u(i + 1), a));
  }, l = () => {
    c != null && (n.clearInterval(c), c = null);
  };
  return t.addEventListener("mouseenter", l), t.addEventListener("mouseleave", o), t.addEventListener("focusin", l), t.addEventListener("focusout", o), u(i), o(), {
    destroy() {
      l(), t.removeEventListener("mouseenter", l), t.removeEventListener("mouseleave", o), t.removeEventListener("focusin", l), t.removeEventListener("focusout", o);
    }
  };
}
function U(t) {
  if (typeof document > "u") return { destroy: () => {
  } };
  const e = t.ownerDocument.defaultView;
  let n = Date.parse(t.dataset.target || "");
  if (!Number.isFinite(n)) {
    const c = Math.max(0, Number(t.dataset.seconds) || 0);
    n = Date.now() + c * 1e3;
  }
  let a = null;
  const i = () => {
    const c = Math.max(0, n - Date.now()), u = Math.ceil(c / 1e3), o = {
      days: Math.floor(u / 86400),
      hours: Math.floor(u / 3600) % 24,
      minutes: Math.floor(u / 60) % 60,
      seconds: u % 60
    };
    Object.entries(o).forEach(([l, s]) => {
      const d = t.querySelector(`[data-unit="${l}"]`);
      d && (d.textContent = String(s).padStart(l === "days" ? 1 : 2, "0"));
    }), t.setAttribute(
      "aria-label",
      `${o.days} 天 ${o.hours} 小时 ${o.minutes} 分 ${o.seconds} 秒`
    ), !c && a != null && (e.clearInterval(a), a = null, t.dispatchEvent(new CustomEvent("blora:complete", { bubbles: !0 })));
  };
  return t.setAttribute("role", "timer"), i(), n > Date.now() && (a = e.setInterval(i, 1e3)), {
    destroy() {
      a != null && e.clearInterval(a);
    }
  };
}
function j(t) {
  if (typeof document > "u") return { destroy: () => {
  } };
  const e = Number(t.getAttribute("data-blora-countup") || t.textContent) || 0, n = Number(t.getAttribute("data-duration")) || 900, a = Number(t.getAttribute("data-decimals")) || 0, i = t.getAttribute("data-prefix") || "", c = t.getAttribute("data-suffix") || "";
  let u = !1, o = null;
  const l = () => {
    if (u) return;
    u = !0;
    const s = performance.now(), d = (h) => {
      const p = Math.min(1, (h - s) / n), m = 1 - Math.pow(1 - p, 3), y = e * m;
      t.textContent = i + y.toFixed(a) + c, p < 1 && requestAnimationFrame(d);
    };
    requestAnimationFrame(d);
  };
  return typeof IntersectionObserver == "function" ? (o = new IntersectionObserver(
    (s) => {
      s.forEach((d) => {
        d.isIntersecting && (l(), o == null || o.disconnect());
      });
    },
    { threshold: 0.4 }
  ), o.observe(t)) : l(), {
    destroy() {
      o == null || o.disconnect();
    }
  };
}
function W(t) {
  if (typeof document > "u") return { destroy: () => {
  } };
  const e = t.querySelector(".blora-diff__range, input[type='range']");
  if (!e) return { destroy: () => {
  } };
  const n = () => {
    const a = Number(e.min || 0), i = Number(e.max || 100), c = Number(e.value || 50), u = i === a ? 50 : Math.min(100, Math.max(0, (c - a) / (i - a) * 100));
    t.style.setProperty("--blora-diff-position", `${u}%`), e.setAttribute("aria-valuetext", `${Math.round(u)}%`);
  };
  return e.addEventListener("input", n), n(), {
    destroy() {
      e.removeEventListener("input", n);
    }
  };
}
function Y(t) {
  if (typeof document > "u") return { destroy: () => {
  } };
  const e = t.ownerDocument;
  let n = Array.from(t.querySelectorAll(".blora-hover-gallery__item"));
  if (!n.length) return { destroy: () => {
  } };
  let a = t.querySelector(".blora-hover-gallery__track");
  a || (a = e.createElement("div"), a.className = "blora-hover-gallery__track", n.forEach((r) => a.appendChild(r)), t.insertBefore(a, t.firstChild), n = Array.from(a.querySelectorAll(".blora-hover-gallery__item")));
  const i = t.getAttribute("aria-label") || "图片库";
  t.setAttribute("role", "group");
  let c = t.querySelector(".blora-hover-gallery__progress");
  if (!c) {
    c = e.createElement("span"), c.className = "blora-hover-gallery__progress", c.setAttribute("aria-hidden", "true");
    for (let r = 0; r < n.length; r++)
      c.appendChild(e.createElement("span"));
    t.appendChild(c);
  }
  const u = Array.from(c.querySelectorAll("span")), o = n.length - 1;
  let l = Math.max(
    0,
    n.findIndex((r) => r.classList.contains("is-active"))
  );
  l < 0 && (l = 0);
  let s = null;
  const d = 0.2, h = 0.35, p = (r) => {
    a.classList.toggle("is-dragging", !1), a.style.transform = `translate3d(${-l * 100}%, 0, 0)`, n.forEach((f, x) => {
      f.classList.toggle("is-active", x === l), f.setAttribute("aria-hidden", String(x !== l));
    }), u.forEach((f, x) => f.classList.toggle("is-active", x === l)), t.setAttribute("aria-label", `${i}，图片 ${l + 1} / ${n.length}`);
  }, m = (r) => {
    l = Math.max(0, Math.min(o, r)), p();
  };
  t.hasAttribute("tabindex") || (t.tabIndex = 0);
  const y = (r) => {
    if ("touches" in r && r.touches[0]) return { x: r.touches[0].clientX, y: r.touches[0].clientY };
    if ("changedTouches" in r && r.changedTouches[0])
      return { x: r.changedTouches[0].clientX, y: r.changedTouches[0].clientY };
    const f = r;
    return { x: f.clientX, y: f.clientY };
  }, E = (r) => l === 0 && r > 0 || l === o && r < 0 ? r * 0.35 : r, I = (r) => {
    a.classList.add("is-dragging"), a.style.transform = `translate3d(calc(${-l * 100}% + ${E(r)}px), 0, 0)`;
  }, M = (r) => {
    if (r.pointerType === "mouse" && r.button !== 0) return;
    const f = y(r);
    s = {
      x: f.x,
      y: f.y,
      dx: 0,
      locked: null,
      lx: f.x,
      lt: Date.now(),
      vx: 0,
      pointerId: r.pointerId
    };
    try {
      t.setPointerCapture(r.pointerId);
    } catch {
    }
  }, S = (r) => {
    if (!s || s.pointerId != null && r.pointerId !== s.pointerId) return;
    const f = y(r), x = f.x - s.x, b = f.y - s.y;
    if (s.locked == null && (Math.abs(x) > 6 || Math.abs(b) > 6) && (s.locked = Math.abs(x) > Math.abs(b) ? "x" : "y", s.locked === "y")) {
      s = null, p();
      return;
    }
    if (s.locked !== "x") return;
    r.cancelable && r.preventDefault();
    const v = Date.now(), g = Math.max(1, v - s.lt);
    s.vx = (f.x - s.lx) / g, s.lx = f.x, s.lt = v, s.dx = x, I(x);
  }, C = (r) => {
    if (!s) return;
    const { dx: f, vx: x, locked: b } = s;
    if (s = null, a.classList.remove("is-dragging"), b !== "x" || r) {
      p();
      return;
    }
    const v = t.getBoundingClientRect().width || 1;
    let g = l;
    f <= -v * d || x <= -h ? g = l + 1 : (f >= v * d || x >= h) && (g = l - 1), m(g);
  }, _ = (r) => {
    if (s && !(s.pointerId != null && r.pointerId !== s.pointerId)) {
      if (s.locked === "x") {
        const f = y(r);
        s.dx = f.x - s.x;
        const x = Date.now(), b = Math.max(1, x - s.lt);
        s.vx = (f.x - s.lx) / b;
      }
      C(!1);
    }
  }, k = (r) => {
    (r.key === "ArrowRight" || r.key === "ArrowDown") && (r.preventDefault(), m(l + 1)), (r.key === "ArrowLeft" || r.key === "ArrowUp") && (r.preventDefault(), m(l - 1)), r.key === "Home" && (r.preventDefault(), m(0)), r.key === "End" && (r.preventDefault(), m(o));
  };
  return t.addEventListener("pointerdown", M), t.addEventListener("pointermove", S), t.addEventListener("pointerup", _), t.addEventListener("pointercancel", () => C(!0)), t.addEventListener("keydown", k), p(), {
    destroy() {
      t.removeEventListener("pointerdown", M), t.removeEventListener("pointermove", S), t.removeEventListener("pointerup", _), t.removeEventListener("keydown", k);
    }
  };
}
function K(t) {
  if (typeof document > "u") return { destroy: () => {
  } };
  t.classList.add("blora-watermark");
  const e = t.getAttribute("data-text") || t.getAttribute("data-blora-watermark") || "Blora", n = t.ownerDocument, a = n.defaultView;
  let i = t.querySelector(".blora-watermark__canvas");
  i || (i = n.createElement("div"), i.className = "blora-watermark__canvas", i.setAttribute("aria-hidden", "true"), t.appendChild(i));
  const c = () => {
    const o = Math.min(a.devicePixelRatio || 1, 2), l = Math.max(t.clientWidth || 0, 120), s = Math.max(t.clientHeight || 0, 80), d = Math.round(Math.min(180, Math.max(100, l / 2.2))), h = Math.round(Math.min(130, Math.max(72, s / 2.2))), p = n.createElement("canvas");
    p.width = Math.max(1, Math.floor(d * o)), p.height = Math.max(1, Math.floor(h * o));
    const m = p.getContext("2d");
    if (!m) return;
    m.setTransform(o, 0, 0, o, 0, 0), m.clearRect(0, 0, d, h), m.translate(d / 2, h / 2), m.rotate(-22 * Math.PI / 180), m.fillStyle = "rgba(80,70,90,0.9)";
    const y = a.getComputedStyle(t).getPropertyValue("--blora-font-sans").trim() || "system-ui, sans-serif", E = Math.max(11, Math.min(15, Math.round(d * 0.09)));
    m.font = `600 ${E}px ${y}`, m.textAlign = "center", m.textBaseline = "middle", m.fillText(e, 0, 0), i.style.backgroundImage = `url(${p.toDataURL()})`, i.style.backgroundSize = `${d}px ${h}px`, i.style.backgroundRepeat = "repeat", i.style.backgroundPosition = "center center";
  };
  c();
  let u = null;
  if (typeof ResizeObserver < "u") {
    let o = 0;
    u = new ResizeObserver(() => {
      cancelAnimationFrame(o), o = requestAnimationFrame(c);
    }), u.observe(t);
  }
  return {
    destroy() {
      u == null || u.disconnect();
    }
  };
}
function q(t) {
  const e = String(t || "").toLowerCase();
  return e.includes("mac") || e.includes("iphone") || e.includes("ipad") || e.includes("ios") ? "apple" : "other";
}
function D(t) {
  var i, c;
  const e = ((i = t == null ? void 0 : t.ownerDocument) == null ? void 0 : i.defaultView) ?? (typeof window < "u" ? window : null), n = e == null ? void 0 : e.navigator, a = ((c = n == null ? void 0 : n.userAgentData) == null ? void 0 : c.platform) || (n == null ? void 0 : n.platform) || (n == null ? void 0 : n.userAgent) || "";
  return q(a);
}
function F(t) {
  return String(t || "").split("+").map((e) => e.trim().toLowerCase()).filter(Boolean);
}
function T(t, e, n = !1) {
  const a = e === "apple";
  return {
    mod: n ? a ? "Command" : "Control" : a ? "⌘" : "Ctrl",
    ctrl: n ? "Control" : "Ctrl",
    command: n ? "Command" : "⌘",
    cmd: n ? "Command" : "⌘",
    alt: n ? a ? "Option" : "Alt" : a ? "⌥" : "Alt",
    option: n ? "Option" : "⌥",
    shift: n ? "Shift" : a ? "⇧" : "Shift",
    enter: "Enter",
    escape: "Esc",
    esc: "Esc",
    space: "Space"
  }[t] || (t.length === 1 ? t.toUpperCase() : t);
}
function N(t, e = D()) {
  return F(t).map((n) => T(n, e)).join(" + ");
}
function G(t = document) {
  typeof document > "u" || t.querySelectorAll("[data-blora-shortcut]").forEach((e) => {
    const n = e.dataset.bloraShortcut || "", a = D(e);
    e.textContent = N(n, a), e.setAttribute(
      "aria-label",
      F(n).map((i) => T(i, a, !0)).join(" + ")
    );
  });
}
const L = [
  "grow",
  "shrink",
  "shake",
  "nod",
  "jitter",
  "explode",
  "ripple",
  "bloom"
], $ = new Set(L), R = ["explode", "ripple", "bloom"];
function A(t) {
  const e = (t.getAttribute("data-blora-text-fx") || "").trim().toLowerCase();
  if ($.has(e)) return e;
  for (const n of L)
    if (t.classList.contains(`blora-text-fx--${n}`)) return n;
  return "";
}
function O(t) {
  var n, a;
  const e = (n = t.ownerDocument) == null ? void 0 : n.defaultView;
  return !!((a = e == null ? void 0 : e.matchMedia) != null && a.call(e, "(prefers-reduced-motion: reduce)").matches);
}
function w(t, e) {
  const n = t.querySelectorAll(".blora-text-fx__ch"), a = n.length || 1, i = (a - 1) / 2;
  n.forEach((c, u) => {
    const o = c;
    if (o.style.setProperty("--i", String(u)), e === "explode") {
      const l = a <= 1 ? 0 : u / (a - 1) * 2 - 1, s = l * 1.15, d = -0.95 - (1 - Math.abs(l)) * 0.35, h = l * 26;
      o.style.setProperty("--fx-x", `${s.toFixed(3)}em`), o.style.setProperty("--fx-y", `${d.toFixed(3)}em`), o.style.setProperty("--fx-r", `${h.toFixed(1)}deg`);
    } else if (e === "bloom") {
      const l = Math.abs(u - i);
      o.style.setProperty("--fx-center-delay", `${Math.round(l * 28)}ms`), o.style.setProperty("--fx-r", `${((u - i) * 12).toFixed(1)}deg`);
    } else
      o.style.removeProperty("--fx-x"), o.style.removeProperty("--fx-y"), o.style.removeProperty("--fx-r"), o.style.removeProperty("--fx-center-delay");
  });
}
function X(t) {
  if (t.dataset.bloraFxSplit === "1") {
    w(t, A(t));
    return;
  }
  const e = t.textContent || "";
  t.textContent = "", Array.from(e).forEach((n, a) => {
    const i = document.createElement("span");
    i.className = "blora-text-fx__ch", i.style.setProperty("--i", String(a)), i.textContent = n === " " ? " " : n, t.appendChild(i);
  }), t.dataset.bloraFxSplit = "1", t.dataset.bloraFxText = e, w(t, A(t));
}
function V(t) {
  if (t.dataset.bloraFxSplit !== "1") return;
  const e = t.dataset.bloraFxText ?? "";
  t.textContent = e, t.removeAttribute("data-blora-fx-split"), t.removeAttribute("data-blora-fx-text");
}
function H(t, e) {
  if (!$.has(e)) return !1;
  t.classList.add("blora-text-fx");
  for (const n of L)
    t.classList.toggle(`blora-text-fx--${n}`, n === e);
  return t.setAttribute("data-blora-text-fx", e), R.includes(e) ? (X(t), w(t, e)) : V(t), !0;
}
function z(t) {
  t.classList.remove("is-play"), t.querySelectorAll(".blora-text-fx__ch").forEach((e) => {
    e.style.animation = "none";
  }), t.offsetWidth, t.querySelectorAll(".blora-text-fx__ch").forEach((e) => {
    e.style.animation = "";
  }), t.classList.add("is-play");
}
function J(t, e, n) {
  if (typeof document > "u" || !t) return null;
  if (e) {
    if (!H(t, e)) return null;
  } else {
    if (!A(t)) return null;
    w(t, A(t));
  }
  return n != null && n.loop ? t.classList.add("is-loop") : t.classList.remove("is-loop"), n != null && n.clickable ? t.classList.add("is-clickable") : t.classList.remove("is-clickable"), O(t) ? (t.classList.add("is-play"), t) : (z(t), t);
}
export {
  j as createCountUpController,
  U as createCountdownController,
  Y as createHoverGalleryController,
  W as createImageDiffController,
  B as createTextRotateController,
  K as createWatermarkController,
  N as formatShortcut,
  D as getShortcutPlatform,
  G as initShortcutHints,
  J as textFx
};
