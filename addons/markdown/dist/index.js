function _(n) {
  return n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function $(n, s) {
  let e = s ? n : _(n);
  return e = e.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (t, l, i, d) => {
      const p = d ? ` title="${_(d)}"` : "";
      return `<img class="blora-md__img" src="${_(i)}" alt="${_(l)}"${p} loading="lazy">`;
    }
  ), e = e.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (t, l, i, d) => {
      const p = String(i || "").trim();
      if (!/^(https?:|mailto:|#|\/|\.\/|\.\.\/)/i.test(p))
        return _(`[${l}](${i})`);
      const a = d ? ` title="${_(d)}"` : "", o = /^https?:/i.test(p) ? ' rel="noopener noreferrer" target="_blank"' : "";
      return `A${_(p)}"${a}${o}B${l}C`;
    }
  ), e = e.replace(/`([^`\n]+)`/g, (t, l) => `CS${l}CE`), e = e.replace(/\*\*\*([^*\n]+)\*\*\*/g, "<strong><em>$1</em></strong>"), e = e.replace(/___([^_\n]+)___/g, "<strong><em>$1</em></strong>"), e = e.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>"), e = e.replace(/__([^_\n]+)__/g, "<strong>$1</strong>"), e = e.replace(/\*([^*\n]+)\*/g, "<em>$1</em>"), e = e.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, "$1<em>$2</em>"), e = e.replace(/~~([^~\n]+)~~/g, "<del>$1</del>"), e = e.replace(/\uE000CS\uE000/g, '<code class="blora-md__code">'), e = e.replace(/\uE000CE\uE000/g, "</code>"), e = e.replace(/\uE000A\uE000/g, '<a class="blora-md__a" href="'), e = e.replace(/\uE000B\uE000/g, '">'), e = e.replace(/\uE000C\uE000/g, "</a>"), e;
}
function w(n, s) {
  const e = (s == null ? void 0 : s.sanitize) ?? !0, t = (s == null ? void 0 : s.allowHtml) ?? !1, l = (s == null ? void 0 : s.inline) ?? !1, i = String(n ?? "").replace(/\r\n?/g, `
`);
  if (l)
    return $(i.trim(), t);
  const d = [], a = i.replace(
    /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,
    (h, u, f) => {
      const b = d.length, c = u ? ` class="language-${_(u)}"` : "", E = e || !t ? _(f.replace(/\n$/, "")) : f.replace(/\n$/, "");
      return d.push(`<pre class="blora-md__pre"><code${c}>${E}</code></pre>`), `

%%BLORA_FENCE_${b}%%

`;
    }
  ).split(`
`), o = [];
  let r = 0;
  const g = (h) => {
    h.length && (o.push(`<p class="blora-md__p">${$(h.join(`
`).trim(), t)}</p>`), h.length = 0);
  }, m = [];
  for (; r < a.length; ) {
    const h = a[r], u = h.trim();
    if (!u) {
      g(m), r++;
      continue;
    }
    const f = u.match(/^%%BLORA_FENCE_(\d+)%%$/);
    if (f) {
      g(m), o.push(d[Number(f[1])] ?? ""), r++;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(u)) {
      g(m), o.push('<hr class="blora-md__hr">'), r++;
      continue;
    }
    const b = u.match(/^(#{1,6})\s+(.+)$/);
    if (b) {
      g(m);
      const c = b[1].length;
      o.push(
        `<h${c} class="blora-md__h blora-md__h${c}">${$(b[2], t)}</h${c}>`
      ), r++;
      continue;
    }
    if (/^>\s?/.test(u)) {
      g(m);
      const c = [];
      for (; r < a.length && /^>\s?/.test(a[r].trim()); )
        c.push(a[r].trim().replace(/^>\s?/, "")), r++;
      o.push(
        `<blockquote class="blora-md__blockquote">${$(c.join(`
`), t)}</blockquote>`
      );
      continue;
    }
    if (/^[-*+]\s+/.test(u)) {
      g(m);
      const c = [];
      for (; r < a.length && /^[-*+]\s+/.test(a[r].trim()); )
        c.push(`<li>${$(a[r].trim().replace(/^[-*+]\s+/, ""), t)}</li>`), r++;
      o.push(`<ul class="blora-md__ul">${c.join("")}</ul>`);
      continue;
    }
    if (/^\d+\.\s+/.test(u)) {
      g(m);
      const c = [];
      for (; r < a.length && /^\d+\.\s+/.test(a[r].trim()); )
        c.push(`<li>${$(a[r].trim().replace(/^\d+\.\s+/, ""), t)}</li>`), r++;
      o.push(`<ol class="blora-md__ol">${c.join("")}</ol>`);
      continue;
    }
    m.push(h), r++;
  }
  return g(m), o.join(`
`);
}
function k(n, s, e) {
  if (typeof document > "u") return;
  const t = w(s, e);
  n.innerHTML = t;
}
function C(n, s) {
  const e = () => n.getAttribute("data-source") || n.getAttribute("data-blora-markdown") || n.textContent || "", t = (l) => {
    const i = l ?? e();
    n.classList.add("blora-md"), k(n, i, s);
  };
  return (n.hasAttribute("data-blora-markdown") || n.hasAttribute("data-source")) && t(), {
    render: t,
    destroy() {
    }
  };
}
function A(n = document, s) {
  if (typeof document > "u") return () => {
  };
  const e = [];
  return n.querySelectorAll("[data-blora-markdown], .blora-md[data-source]").forEach((t) => {
    e.push(C(t, s));
  }), () => e.forEach((t) => t.destroy());
}
export {
  C as createMarkdownController,
  A as initMarkdown,
  w as renderMarkdown,
  k as renderMarkdownTo
};
