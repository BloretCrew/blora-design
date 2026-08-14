function et(h, u) {
  const m = h.createElement("label");
  m.className = ["blora-checkbox", u.className || ""].filter(Boolean).join(" ");
  const r = h.createElement("input");
  if (r.type = "checkbox", u.checked && (r.checked = !0), u.attrs)
    for (const s of u.attrs.matchAll(/([^\s=]+)(?:="([^"]*)")?/g)) {
      const c = s[1], w = s[2];
      !c || c === "type" || (w === void 0 ? r.setAttribute(c, "") : r.setAttribute(c, w));
    }
  const y = h.createElement("span");
  if (y.className = "blora-checkbox__box", m.append(r, y), u.label) {
    const s = h.createElement("span");
    s.textContent = u.label, m.appendChild(s);
  }
  return m;
}
function St(h) {
  var y;
  if (h.querySelector(".blora-table__sort")) return;
  h.style.cursor = "pointer", h.style.userSelect = "none";
  const u = ((y = h.textContent) == null ? void 0 : y.trim()) || "";
  h.textContent = "";
  const m = document.createElement("span");
  m.textContent = u;
  const r = document.createElement("span");
  r.className = "blora-table__sort", r.setAttribute("aria-hidden", "true"), h.append(m, r);
}
function Nt(h, u) {
  return h.getAttribute("data-blora-cols-key") || `blora-table-cols:${u.id || h.id || "default"}`;
}
function ct(h) {
  return Array.from(h.querySelectorAll("thead th")).filter(
    (m) => !m.hasAttribute("data-blora-select-col")
  ).map((m, r) => ({
    key: m.getAttribute("data-blora-sort") || m.getAttribute("data-col-key") || String(r),
    label: (m.textContent || "").replace(/\s*[⇅▲▼]\s*$/, "").trim() || String(r + 1),
    visible: m.getAttribute("data-col-hidden") !== "true",
    index: r
  }));
}
function Mt(h, u) {
  try {
    const m = localStorage.getItem(Nt(h, u));
    if (!m) return null;
    const r = JSON.parse(m);
    return Array.isArray(r) ? r : null;
  } catch {
    return null;
  }
}
function Q(h, u, m) {
  try {
    localStorage.setItem(Nt(h, u), JSON.stringify(m));
  } catch {
  }
}
function Tt(h, u) {
  const m = {
    setPage: () => {
    },
    getPage: () => 1,
    getPageCount: () => 1,
    setRows: () => {
    },
    getColumnConfig: () => [],
    setColumnVisible: () => {
    },
    resetColumns: () => {
    },
    getSelectedRows: () => [],
    clearSelection: () => {
    },
    destroy: () => {
    }
  };
  if (typeof document > "u") return m;
  const r = h.matches("table") ? h : h.querySelector("table");
  if (!r) return m;
  let y = r.tBodies[0] || r.createTBody();
  const s = r.ownerDocument, c = h.closest(".blora-table-wrap") || r.closest(".blora-table-wrap") || h;
  r.id || (r.id = `blora-table-${Math.random().toString(36).slice(2, 9)}`);
  const w = (u == null ? void 0 : u.pageSize) || Number(c.getAttribute("data-page-size") || r.getAttribute("data-page-size") || 0) || 0, at = (u == null ? void 0 : u.columns) !== !1 && (c.hasAttribute("data-blora-cols") || r.hasAttribute("data-blora-cols")), S = c.hasAttribute("data-blora-virtual") || r.hasAttribute("data-blora-virtual"), N = (u == null ? void 0 : u.selectable) === !0 || (u == null ? void 0 : u.selectable) !== !1 && (c.hasAttribute("data-blora-selectable") || r.hasAttribute("data-blora-selectable"));
  r._bloraSelectedKeys || (r._bloraSelectedKeys = /* @__PURE__ */ new Set());
  const T = r._bloraSelectedKeys;
  let A = 1, v = Mt(c, r) || ct(r), $ = null;
  Array.from(
    r.querySelectorAll("th[data-sort], th[data-blora-sort]")
  ).forEach(St);
  const B = () => Array.from(y.querySelectorAll("tr:not(.blora-table-virtual-pad)"));
  let rt = B();
  const Z = () => Array.from(r.querySelectorAll("thead th")).filter(
    (e) => !e.hasAttribute("data-blora-select-col")
  ), q = () => {
    var a;
    if (!at) return;
    const e = Z(), t = (a = r.tHead) == null ? void 0 : a.rows[0];
    if (!t) return;
    v.forEach((o, i) => {
      const f = e.find(
        (g) => (g.getAttribute("data-blora-sort") || g.getAttribute("data-col-key") || "") === o.key
      ) || e[o.index];
      f && (f.dataset.colOrder = String(i), f.hidden = !o.visible, f.toggleAttribute("data-col-hidden", !o.visible));
    }), Array.from(t.children).filter((o) => !o.hasAttribute("data-blora-select-col")).sort((o, i) => Number(o.dataset.colOrder || 0) - Number(i.dataset.colOrder || 0)).forEach((o) => t.appendChild(o));
    const l = Array.from(t.children);
    Array.from(y.rows).forEach((o) => {
      if (o.classList.contains("blora-table-virtual-pad")) return;
      const i = Array.from(o.children);
      i.forEach((p, k) => {
        p.dataset.colIndex || (p.dataset.colIndex = String(k));
      });
      const f = new Map(i.map((p) => [Number(p.dataset.colIndex), p])), g = i.find((p) => p.hasAttribute("data-blora-select-col")), x = [];
      g && x.push(g), l.forEach((p) => {
        if (p.hasAttribute("data-blora-select-col")) return;
        const k = p.getAttribute("data-blora-sort") || p.getAttribute("data-col-key"), R = v.find((I) => I.key === k), J = R ? R.index : Number(p.dataset.colIndex || 0), D = f.get(J);
        D && (D.hidden = p.hidden, D.dataset.colOrder = p.dataset.colOrder || "", x.push(D));
      }), o.replaceChildren(...x);
    });
  };
  Z().forEach((e, t) => {
    e.dataset.colIndex = String(t);
  }), B().forEach((e) => {
    Array.from(e.cells).forEach((t, n) => {
      t.dataset.colIndex = String(n);
    });
  });
  const lt = () => {
    var e;
    if (S) {
      const t = ((e = r._bloraRowData) == null ? void 0 : e.length) || 0;
      return w ? Math.max(1, Math.ceil(t / w)) : 1;
    }
    return w ? Math.max(1, Math.ceil(B().length / w)) : 1;
  }, K = () => {
    if (S) return;
    if (!w) {
      B().forEach((a) => {
        a.hidden = !1;
      }), q();
      return;
    }
    const e = B(), t = lt();
    A > t && (A = t), A < 1 && (A = 1);
    const n = (A - 1) * w, l = n + w;
    e.forEach((a, o) => {
      a.hidden = o < n || o >= l;
    }), c.setAttribute("data-page", String(A)), c.setAttribute("data-page-count", String(t)), h.dispatchEvent(
      new CustomEvent("blora-table-page", {
        bubbles: !0,
        detail: { page: A, pageSize: w, pageCount: t }
      })
    ), q(), N && ot();
  }, _t = (e, t) => (n, l) => {
    var g, x, p, k;
    const a = ((x = (g = n.children[e]) == null ? void 0 : g.textContent) == null ? void 0 : x.trim()) || "", o = ((k = (p = l.children[e]) == null ? void 0 : p.textContent) == null ? void 0 : k.trim()) || "", i = Number(a), f = Number(o);
    return !Number.isNaN(i) && !Number.isNaN(f) && a !== "" && o !== "" ? t ? i - f : f - i : t ? a.localeCompare(o, "zh") : o.localeCompare(a, "zh");
  }, Lt = (e) => {
    r.querySelectorAll("th[data-sort], th[data-blora-sort]").forEach((t) => {
      e && t === e || (delete t.dataset.sortDir, t.removeAttribute("aria-sort"));
    });
  }, nt = (e) => e.getAttribute("data-row-key") || e.dataset.virtualIndex || e.getAttribute("data-id") || Array.from(e.cells).filter((t) => !t.hasAttribute("data-blora-select-col")).map((t) => {
    var n;
    return ((n = t.textContent) == null ? void 0 : n.trim()) || "";
  }).join("|"), ot = () => {
    var n;
    if (!N) return;
    const e = (n = r.tHead) == null ? void 0 : n.rows[0];
    if (!e) return;
    if (!e.querySelector("th[data-blora-select-col]")) {
      const l = s.createElement("th");
      l.setAttribute("data-blora-select-col", ""), l.className = "blora-table-select-col", l.appendChild(
        et(s, {
          className: "blora-table-check",
          attrs: 'data-blora-select-all aria-label="全选"'
        })
      ), e.insertBefore(l, e.firstChild);
    }
    Array.from(y.rows).forEach((l) => {
      if (l.classList.contains("blora-table-virtual-pad") || l.querySelector("td[data-blora-select-col]")) return;
      const a = s.createElement("td");
      a.setAttribute("data-blora-select-col", ""), a.className = "blora-table-select-col";
      const o = nt(l), i = et(s, {
        className: "blora-table-check",
        checked: T.has(o),
        attrs: `data-blora-row-select aria-label="选择行" data-row-key="${o.replace(/"/g, "")}"`
      });
      a.appendChild(i), l.insertBefore(a, l.firstChild);
    });
    let t = c.parentElement && c.parentElement.querySelector(
      `.blora-table-bulk[data-blora-table-bulk="${r.id}"]`
    ) || null;
    if (!t && c.parentElement) {
      t = s.createElement("div"), t.className = "blora-table-bulk", t.setAttribute("data-blora-table-bulk", r.id), t.hidden = !0;
      const l = s.createElement("span");
      l.className = "blora-table-bulk__count";
      const a = s.createElement("button");
      a.type = "button", a.className = "blora-button", a.setAttribute("data-variant", "ghost"), a.setAttribute("data-size", "sm"), a.setAttribute("data-blora-clear-selection", ""), a.textContent = "清除选择";
      const o = s.createElement("span");
      o.className = "blora-table-bulk__slot", o.setAttribute("data-blora-bulk-actions", ""), t.append(l, a, o), c.parentElement.insertBefore(t, c);
    }
    r._bloraBulk = t;
  }, $t = () => Array.from(y.rows).filter((e) => {
    if (e.hidden || e.classList.contains("blora-table-virtual-pad")) return !1;
    const t = e.querySelector("input[data-blora-row-select]");
    return !!(t && t.checked);
  }), j = () => {
    if (!N) return;
    const e = Array.from(y.rows).filter(
      (a) => !a.hidden && !a.classList.contains("blora-table-virtual-pad")
    ), t = e.filter((a) => {
      const o = a.querySelector("input[data-blora-row-select]");
      return !!(o && o.checked);
    }), n = r.querySelector("input[data-blora-select-all]");
    if (n) {
      n.checked = e.length > 0 && t.length === e.length, n.indeterminate = t.length > 0 && t.length < e.length;
      const a = n.closest(".blora-checkbox");
      a == null || a.toggleAttribute("data-indeterminate", n.indeterminate);
    }
    const l = r._bloraBulk;
    if (l) {
      l.hidden = t.length === 0;
      const a = l.querySelector(".blora-table-bulk__count");
      a && (a.textContent = `已选 ${t.length} 项`);
    }
    c.classList.toggle("has-selection", t.length > 0), r.dispatchEvent(
      new CustomEvent("blora-table-select", {
        bubbles: !0,
        detail: { selected: t.length, rows: t, table: r }
      })
    );
  }, it = () => {
    T.clear(), r.querySelectorAll(
      "input[data-blora-row-select], input[data-blora-select-all]"
    ).forEach((e) => {
      e.checked = !1, e.indeterminate = !1;
    }), r.querySelectorAll(".blora-checkbox[data-indeterminate]").forEach((e) => {
      e.removeAttribute("data-indeterminate");
    }), j();
  }, dt = (e) => {
    if (!N) return;
    const t = e.target;
    if (!(!(t instanceof HTMLInputElement) || t.type !== "checkbox") && r.contains(t)) {
      if (t.hasAttribute("data-blora-select-all")) {
        const n = t.checked;
        y.querySelectorAll("input[data-blora-row-select]").forEach((l) => {
          const a = l.closest("tr");
          if (a && !a.hidden && !a.classList.contains("blora-table-virtual-pad")) {
            l.checked = n;
            const o = l.getAttribute("data-row-key") || nt(a);
            n ? T.add(o) : T.delete(o);
          }
        }), j();
        return;
      }
      if (t.hasAttribute("data-blora-row-select")) {
        const n = t.closest("tr");
        if (n) {
          const l = t.getAttribute("data-row-key") || nt(n);
          t.checked ? T.add(l) : T.delete(l);
        }
        j();
      }
    }
  }, bt = (e) => {
    e.target.closest("[data-blora-clear-selection]") && it();
  }, ut = () => {
    if ($ && $.isConnected) return $;
    c.classList.add("blora-table-wrap--virtual");
    let e = c.querySelector(".blora-table-virtual");
    if (!e) {
      e = s.createElement("div"), e.className = "blora-table-virtual";
      const n = r.parentElement;
      n ? (n.insertBefore(e, r), e.appendChild(r)) : (c.appendChild(e), e.appendChild(r));
    }
    const t = Number(c.getAttribute("data-viewport-height")) || e.clientHeight || 360;
    return e.style.height = `${t}px`, e.style.overflow = "auto", $ = e, e;
  }, qt = () => {
    const e = r._bloraRowData || [], t = r._bloraRowKeys;
    if (t != null && t.length)
      return t.map((a, o) => {
        var g;
        const i = Z()[o], f = ((g = i == null ? void 0 : i.textContent) == null ? void 0 : g.replace(/\s*[⇅▲▼]\s*$/, "").trim()) || a;
        return { key: a, label: f };
      });
    const n = Z();
    if (n.length)
      return n.map((a, o) => {
        var i;
        return {
          key: a.getAttribute("data-col-key") || a.getAttribute("data-blora-sort") || String(o),
          label: ((i = a.textContent) == null ? void 0 : i.replace(/\s*[⇅▲▼]\s*$/, "").trim()) || String(o + 1)
        };
      });
    const l = e[0];
    return Array.isArray(l) ? l.map((a, o) => ({ key: String(o), label: `Col ${o + 1}` })) : l && typeof l == "object" ? Object.keys(l).map((a) => ({ key: a, label: a })) : [{ key: "0", label: "Col" }];
  }, Rt = (e, t, n) => {
    if (e == null) return "";
    if (Array.isArray(e)) {
      const a = e[t];
      return a == null ? "" : String(a);
    }
    const l = e[n];
    return l == null ? "" : String(l);
  }, ht = (e, t) => {
    const n = s.createElement("td");
    return n.className = "blora-table-virtual-pad-cell", n.style.cssText = [
      `width:${e}px`,
      `min-width:${e}px`,
      `max-width:${e}px`,
      "padding:0",
      "border:0",
      ""
    ].filter(Boolean).join(";"), n;
  }, M = () => {
    if (!S) return;
    const e = r._bloraRowData || [], t = Number(c.getAttribute("data-row-height")) || 44, n = Number(c.getAttribute("data-col-width")) || 120, l = Number(c.getAttribute("data-overscan")) || 6, a = (c.getAttribute("data-virtual-axis") || "both").toLowerCase(), o = a === "y" || a === "both", i = a === "x" || a === "both", f = ut();
    y = r.tBodies[0] || r.createTBody();
    const g = r.tHead || r.createTHead();
    let x = g.rows[0];
    x || (x = g.insertRow());
    const p = f.clientHeight || Number(c.getAttribute("data-viewport-height")) || 360, k = f.clientWidth || Number(c.getAttribute("data-viewport-width")) || c.clientWidth || 600, R = e.length, J = qt(), D = J.length;
    let I = 0, X = R;
    if (o && R > 0) {
      const b = f.scrollTop || 0;
      I = Math.max(0, Math.floor(b / t) - l);
      const E = Math.ceil(p / t) + l * 2;
      X = Math.min(R, I + E);
    }
    let O = 0, W = D;
    const xt = D * n, _ = i && xt > k + 1;
    if (_) {
      const b = f.scrollLeft || 0;
      O = Math.max(0, Math.floor(b / n) - l);
      const E = Math.ceil(k / n) + l * 2;
      W = Math.min(D, O + E);
    }
    const P = _ ? O * n : 0, U = _ ? Math.max(0, D - W) * n : 0, Bt = Math.max(1, W - O), wt = (N ? 1 : 0) + (_ ? 2 : 0) + Bt, Y = s.createDocumentFragment();
    if (N) {
      const b = s.createElement("th");
      b.setAttribute("data-blora-select-col", ""), b.className = "blora-table-select-col", b.appendChild(
        et(s, {
          className: "blora-table-check",
          attrs: 'data-blora-select-all aria-label="全选"'
        })
      ), Y.appendChild(b);
    }
    if (_ && P > 0) {
      const b = s.createElement("th");
      b.className = "blora-table-virtual-pad-cell", b.style.cssText = `width:${P}px;min-width:${P}px;padding:0;border:0`, Y.appendChild(b);
    }
    for (let b = O; b < W; b++) {
      const E = J[b], C = s.createElement("th");
      C.dataset.colKey = E.key, C.setAttribute("data-col-key", E.key), C.dataset.colIndex = String(b), C.style.width = `${n}px`, C.style.minWidth = `${n}px`, C.textContent = E.label, Y.appendChild(C);
    }
    if (_ && U > 0) {
      const b = s.createElement("th");
      b.className = "blora-table-virtual-pad-cell", b.style.cssText = `width:${U}px;min-width:${U}px;padding:0;border:0`, Y.appendChild(b);
    }
    x.replaceChildren(Y);
    const tt = s.createDocumentFragment();
    if (o && I > 0) {
      const b = s.createElement("tr");
      b.className = "blora-table-virtual-pad";
      const E = s.createElement("td");
      E.colSpan = wt, E.style.cssText = `height:${I * t}px;padding:0;border:0`, b.appendChild(E), tt.appendChild(b);
    }
    for (let b = I; b < X; b++) {
      const E = e[b], C = s.createElement("tr");
      if (C.dataset.virtualIndex = String(b), C.style.height = `${t}px`, N) {
        const L = s.createElement("td");
        L.setAttribute("data-blora-select-col", ""), L.className = "blora-table-select-col";
        const G = String(b);
        L.appendChild(
          et(s, {
            className: "blora-table-check",
            checked: T.has(G),
            attrs: `data-blora-row-select aria-label="选择行" data-row-key="${G}"`
          })
        ), C.appendChild(L);
      }
      _ && P > 0 && C.appendChild(ht(P));
      for (let L = O; L < W; L++) {
        const G = J[L], z = s.createElement("td");
        z.dataset.colIndex = String(L), z.setAttribute("data-col-key", G.key), z.style.width = `${n}px`, z.style.minWidth = `${n}px`, z.textContent = Rt(E, L, G.key), C.appendChild(z);
      }
      _ && U > 0 && C.appendChild(ht(U)), tt.appendChild(C);
    }
    if (o && X < R) {
      const b = s.createElement("tr");
      b.className = "blora-table-virtual-pad";
      const E = s.createElement("td");
      E.colSpan = wt, E.style.cssText = `height:${Math.max(0, R - X) * t}px;padding:0;border:0`, b.appendChild(E), tt.appendChild(b);
    }
    y.replaceChildren(tt), _ ? r.style.minWidth = `${xt}px` : r.style.minWidth = "", at && q(), N && (ot(), j()), c.setAttribute("data-virtual-total", String(R)), c.setAttribute("data-virtual-start", String(I)), c.setAttribute("data-virtual-end", String(X)), c.setAttribute("data-virtual-col-start", String(O)), c.setAttribute("data-virtual-col-end", String(W)), c.toggleAttribute("data-virtual-x", _);
  };
  let st = !1;
  const ft = () => {
    st || (st = !0, requestAnimationFrame(() => {
      st = !1, M();
    }));
  };
  let H = null, d = null, V = "", mt = !1;
  const F = () => {
    if (!d) return;
    const e = d.querySelector(".blora-table-cols__list");
    e && (e.replaceChildren(), v.forEach((t) => {
      const n = s.createElement("div");
      n.className = "blora-table-cols__item", n.setAttribute("data-col-key", t.key), n.draggable = !0;
      const l = s.createElement("span");
      l.className = "blora-table-cols__grip", l.setAttribute("aria-hidden", "true"), l.title = "拖动排序";
      const a = s.createElementNS("http://www.w3.org/2000/svg", "svg");
      a.setAttribute("width", "14"), a.setAttribute("height", "14"), a.setAttribute("viewBox", "0 0 16 16"), a.setAttribute("fill", "currentColor"), [
        [5, 4],
        [11, 4],
        [5, 8],
        [11, 8],
        [5, 12],
        [11, 12]
      ].forEach(([x, p]) => {
        const k = s.createElementNS("http://www.w3.org/2000/svg", "circle");
        k.setAttribute("cx", String(x)), k.setAttribute("cy", String(p)), k.setAttribute("r", "1.2"), a.appendChild(k);
      }), l.appendChild(a);
      const o = s.createElement("label");
      o.className = "blora-checkbox blora-table-cols__check";
      const i = s.createElement("input");
      i.type = "checkbox", i.checked = t.visible, i.setAttribute("data-col-key", t.key);
      const f = s.createElement("span");
      f.className = "blora-checkbox__box";
      const g = s.createElement("span");
      g.textContent = t.label, o.append(i, f, g), n.append(l, o), e.appendChild(n);
    }));
  }, Dt = () => {
    const e = c.parentElement || c;
    if (H = e.querySelector(".blora-table-cols-bar"), d = e.querySelector(".blora-table-cols"), !H) {
      H = s.createElement("div"), H.className = "blora-table-cols-bar";
      const t = s.createElement("button");
      t.type = "button", t.className = "blora-button", t.setAttribute("data-variant", "outline"), t.setAttribute("data-size", "sm"), t.setAttribute("data-blora-cols-toggle", ""), t.textContent = "列设置", H.appendChild(t), e.insertBefore(H, c);
    }
    if (!d) {
      d = s.createElement("div"), d.className = "blora-table-cols", d.hidden = !0;
      const t = s.createElement("div");
      t.className = "blora-table-cols__list";
      const n = s.createElement("div");
      n.className = "blora-table-cols__foot";
      const l = s.createElement("button");
      l.type = "button", l.className = "blora-button", l.setAttribute("data-variant", "ghost"), l.setAttribute("data-size", "sm"), l.setAttribute("data-blora-cols-reset", ""), l.textContent = "重置列", n.appendChild(l), d.append(t, n), e.insertBefore(d, c);
    }
    return d;
  }, pt = (e) => {
    const t = e.target;
    if (t.closest("[data-blora-cols-toggle]")) {
      if (!d) return;
      d.hidden = !d.hidden, d.hidden || F();
      return;
    }
    t.closest("[data-blora-cols-reset]") && (v = ct(r), Q(c, r, v), F(), q(), S && M());
  }, gt = (e) => {
    const t = e.target.closest("input[data-col-key]");
    if (!t || !(d != null && d.contains(t))) return;
    const n = t.getAttribute("data-col-key") || "", l = v.find((a) => a.key === n);
    l && (l.visible = t.checked, Q(c, r, v), q(), S && M());
  }, yt = (e) => {
    const t = e.target.closest(".blora-table-cols__item");
    if (!(!t || !(d != null && d.contains(t)))) {
      if (e.target.closest("input, .blora-checkbox__box, label.blora-checkbox")) {
        e.preventDefault();
        return;
      }
      V = t.getAttribute("data-col-key") || "";
      try {
        e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", V);
      } catch {
      }
      t.classList.add("is-dragging");
    }
  }, At = (e) => {
    const t = e.target.closest(".blora-table-cols__item");
    !t || !(d != null && d.contains(t)) || (e.preventDefault(), d.querySelectorAll(".is-drag-over").forEach((n) => n.classList.remove("is-drag-over")), t.classList.add("is-drag-over"));
  }, vt = (e) => {
    e.preventDefault();
    const t = e.target.closest(".blora-table-cols__item");
    if (!t || !(d != null && d.contains(t)) || !V) return;
    const n = t.getAttribute("data-col-key") || "", l = v.findIndex((i) => i.key === V), a = v.findIndex((i) => i.key === n);
    if (l < 0 || a < 0 || l === a) return;
    const [o] = v.splice(l, 1);
    o && (v.splice(a, 0, o), v.forEach((i, f) => {
      i.index = f;
    }), Q(c, r, v), F(), q(), S && M());
  }, Et = () => {
    V = "", d == null || d.querySelectorAll(".blora-table-cols__item").forEach((e) => e.classList.remove("is-dragging", "is-drag-over"));
  }, Ct = (e) => {
    if (S) return;
    const t = e.target.closest("th[data-sort], th[data-blora-sort]");
    if (!t || !r.contains(t)) return;
    St(t);
    const n = Array.from(t.parentElement.children).indexOf(t), l = t.dataset.sortDir;
    let a;
    if (l === "asc" ? a = "desc" : l === "desc" ? a = null : a = "asc", Lt(a ? t : void 0), a === null) {
      delete t.dataset.sortDir, t.removeAttribute("aria-sort"), rt.forEach((i) => {
        document.contains(i) && y.appendChild(i);
      }), A = 1, K();
      return;
    }
    t.dataset.sortDir = a, t.setAttribute("aria-sort", a === "asc" ? "ascending" : "descending");
    const o = B();
    o.sort(_t(n, a === "asc")), o.forEach((i) => y.appendChild(i)), A = 1, K();
  }, kt = (e) => {
    const t = e.target.closest("[data-table-page], [data-page]");
    if (!t) return;
    const n = c.getAttribute("data-pagination");
    if (n) {
      const a = document.querySelector(n);
      if (a && !a.contains(t)) return;
    } else if (!c.contains(t) && !r.contains(t))
      return;
    const l = t.getAttribute("data-table-page") || t.getAttribute("data-page");
    l === "prev" ? A = Math.max(1, A - 1) : l === "next" ? A = Math.min(lt(), A + 1) : l && (A = Number(l) || A), K();
  };
  if (r.addEventListener("click", Ct), document.addEventListener("click", kt), N && (r.addEventListener("change", dt), document.addEventListener("click", bt), ot(), j()), at) {
    const e = Dt();
    document.addEventListener("click", pt), e.addEventListener("change", gt), e.addEventListener("dragstart", yt), e.addEventListener("dragover", At), e.addEventListener("drop", vt), e.addEventListener("dragend", Et), mt = !0, q();
  }
  if (S) {
    if (ut().addEventListener("scroll", ft, { passive: !0 }), !r._bloraRowData) {
      const t = B();
      r._bloraRowData = t.map(
        (n) => Array.from(n.cells).map((l) => {
          var a;
          return ((a = l.textContent) == null ? void 0 : a.trim()) || "";
        })
      ), rt = [];
    }
    M();
  } else
    K();
  return {
    setPage(e) {
      A = e, K();
    },
    getPage: () => A,
    getPageCount: lt,
    setRows(e, t) {
      r._bloraRowData = e.slice(), t ? r._bloraRowKeys = t.slice() : e[0] && !Array.isArray(e[0]) && typeof e[0] == "object" && (r._bloraRowKeys = Object.keys(e[0])), S ? ($ && ($.scrollTop = 0), M()) : (y.replaceChildren(), e.forEach((n) => {
        const l = s.createElement("tr");
        Array.isArray(n) ? n.forEach((a, o) => {
          const i = s.createElement("td");
          i.textContent = a == null ? "" : String(a), i.dataset.colIndex = String(o), l.appendChild(i);
        }) : (r._bloraRowKeys || Object.keys(n)).forEach((o, i) => {
          const f = s.createElement("td"), g = n[o];
          f.textContent = g == null ? "" : String(g), f.dataset.colIndex = String(i), l.appendChild(f);
        }), y.appendChild(l);
      }), rt = B(), A = 1, K());
    },
    getColumnConfig: () => v.map((e) => ({ ...e })),
    setColumnVisible(e, t) {
      const n = v.find((l) => l.key === e);
      n && (n.visible = t, Q(c, r, v), F(), q(), S && M());
    },
    resetColumns() {
      v = ct(r), Q(c, r, v), F(), q(), S && M();
    },
    getSelectedRows: $t,
    clearSelection: it,
    destroy() {
      r.removeEventListener("click", Ct), document.removeEventListener("click", kt), document.removeEventListener("click", pt), N && (r.removeEventListener("change", dt), document.removeEventListener("click", bt)), mt && d && (d.removeEventListener("change", gt), d.removeEventListener("dragstart", yt), d.removeEventListener("dragover", At), d.removeEventListener("drop", vt), d.removeEventListener("dragend", Et)), $ == null || $.removeEventListener("scroll", ft);
    }
  };
}
export {
  Tt as createTableController
};
