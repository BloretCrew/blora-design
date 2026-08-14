function A(o) {
  const s = o.slice(0, 60);
  try {
    return p(s);
  } catch {
    return x(o);
  }
}
function p(o) {
  const s = [];
  for (let t = 0; t < o.length; t++) {
    const n = o.charCodeAt(t);
    n < 128 ? s.push(n) : n < 2048 ? s.push(192 | n >> 6, 128 | n & 63) : s.push(224 | n >> 12, 128 | n >> 6 & 63, 128 | n & 63);
  }
  const e = 29, l = Array.from(
    { length: e },
    () => Array(e).fill(null)
  ), r = (t, n) => {
    for (let c = -1; c <= 7; c++)
      for (let f = -1; f <= 7; f++) {
        const b = n + c, m = t + f;
        if (b < 0 || m < 0 || b >= e || m >= e) continue;
        const g = c === -1 || f === -1 || c === 7 || f === 7 || c >= 0 && c <= 6 && f >= 0 && f <= 6 && (c === 0 || c === 6 || f === 0 || f === 6 || c >= 2 && c <= 4 && f >= 2 && f <= 4);
        l[b][m] = g;
      }
  };
  r(0, 0), r(e - 7, 0), r(0, e - 7);
  for (let t = 8; t < e - 8; t++)
    l[6][t] == null && (l[6][t] = t % 2 === 0), l[t][6] == null && (l[t][6] = t % 2 === 0);
  let a = 0;
  const i = [];
  i.push(0, 1, 0, 0);
  const h = s.length;
  for (let t = 7; t >= 0; t--) i.push(h >> t & 1);
  for (s.forEach((t) => {
    for (let n = 7; n >= 0; n--) i.push(t >> n & 1);
  }); i.length % 8; ) i.push(0);
  let d = -1, u = e - 1;
  for (; u > 0; ) {
    u === 6 && u--;
    for (let t = 0; t < e; t++) {
      const n = d < 0 ? e - 1 - t : t;
      for (let c = 0; c < 2; c++) {
        const f = u - c;
        if (l[n][f] != null) continue;
        const b = a < i.length ? i[a++] : 0, m = (n + f) % 2 === 0;
        l[n][f] = m ? !b : !!b;
      }
    }
    d = -d, u -= 2;
  }
  const y = Array.from({ length: e }, () => Array(e).fill(!1));
  for (let t = 0; t < e; t++)
    for (let n = 0; n < e; n++)
      y[t][n] = l[t][n] ?? !1;
  return y;
}
function x(o) {
  const e = Array.from({ length: 25 }, () => Array(25).fill(!1));
  for (let r = 0; r < 25; r++)
    e[0][r] = !0, e[24][r] = !0, e[r][0] = !0, e[r][24] = !0;
  let l = 0;
  for (let r = 0; r < o.length; r++)
    l = l * 33 + o.charCodeAt(r) >>> 0;
  for (let r = 2; r < 23; r++)
    for (let a = 2; a < 23; a++)
      l = l * 1103515245 + 12345 >>> 0, e[r][a] = (l & 7) < 3;
  return e;
}
function q(o, s, e) {
  if (typeof document > "u") return;
  const l = typeof e == "number" ? e : (e == null ? void 0 : e.size) ?? 148;
  o.style.setProperty("--blora-qr-size", `${l}px`), o.classList.add("blora-qrcode");
  let r = o.querySelector("canvas");
  r || (r = document.createElement("canvas"), o.appendChild(r));
  const a = A(String(s || "")), i = a.length, h = Math.floor(l / (i + 2)), d = h * (i + 2);
  r.width = d, r.height = d;
  const u = r.getContext("2d");
  if (u) {
    u.fillStyle = "#ffffff", u.fillRect(0, 0, d, d), u.fillStyle = "#111111";
    for (let y = 0; y < i; y++)
      for (let t = 0; t < i; t++)
        a[y][t] && u.fillRect((t + 1) * h, (y + 1) * h, h, h);
  }
}
function C(o, s) {
  const e = () => {
    var r;
    return o.getAttribute("data-text") || o.getAttribute("data-blora-qrcode") || ((r = o.textContent) == null ? void 0 : r.trim()) || "";
  }, l = (r) => {
    q(o, r ?? e(), s);
  };
  return (o.hasAttribute("data-blora-qrcode") || o.hasAttribute("data-text") || o.classList.contains("blora-qrcode")) && l(), {
    render: l,
    destroy() {
    }
  };
}
function R(o = document, s) {
  if (typeof document > "u") return () => {
  };
  const e = [];
  return o.querySelectorAll("[data-blora-qrcode], .blora-qrcode[data-text]").forEach((l) => {
    e.push(C(l, s));
  }), () => e.forEach((l) => l.destroy());
}
export {
  A as buildQRMatrix,
  C as createQRCodeController,
  R as initQRCode,
  q as renderQRCode
};
