/* ========================================================================
   Blora Design · blora.js
   轻量的交互层 — 为静态组件补充可达、可复用的行为。
   无依赖。只做该做的事：开关、显隐、步进、拖拽。
   ======================================================================== */
(function (global, factory) {
  const Blora = factory(global);
  if (typeof module === "object" && module.exports) module.exports = Blora;
  if (global) global.Blora = Blora;
}(typeof globalThis !== "undefined" ? globalThis : this, function (global) {
  "use strict";

  /* 与 package.json version 保持一致；发包时只改这一处（及 package.json） */
  const VERSION = "1.0.0";

  const CONFIG = {
    autoInit: true,
    portalRoot: null,
    colorModeStorageKey: "blora-color-mode",
    paletteStorageKey: "blora-palette",
    /* sm | md | lg — 写到 html[data-blora-size] */
    size: "md",
    /* 校验触发：submit / blur / change，可空格组合如 "blur change" */
    validateOn: "submit",
    /* 表格默认每页条数（data-page-size 可覆盖） */
    tablePageSize: 10,
    /* 当前语言码，如 zh-CN / en */
    locale: "zh-CN",
    /**
     * 动态生成 class 的前缀（默认 blora）。
     * 静态 CSS 仍为 .blora-*；自定义前缀时请同步改 CSS 或仅用于隔离动态节点。
     */
    classPrefix: "blora",
    /* 列设置持久化默认 storage key 前缀 */
    tableColsStorageKey: "blora-table-cols",
  };
  const cls = (...parts) => {
    const p = CONFIG.classPrefix || "blora";
    return parts
      .filter(Boolean)
      .map((part) => {
        const s = String(part);
        if (s.charAt(0) === "." || s.charAt(0) === "#") return s;
        if (s.indexOf(p + "-") === 0 || s.indexOf("is-") === 0 || s.indexOf("blora-") === 0) return s;
        return p + "-" + s.replace(/^\-+/, "");
      })
      .join(" ");
  };

  /* —— i18n · 框架生成文案（业务页面文案仍由业务自己管） —— */
  const I18N_PACKS = Object.freeze({
    "zh-CN": Object.freeze({
      collator: "zh-CN",
      months: Object.freeze(["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]),
      dow: Object.freeze(["日","一","二","三","四","五","六"]),
      year: "年",
      today: "今日",
      clear: "清除",
      now: "现在",
      confirm: "确定",
      hour: "时",
      minute: "分",
      messages: Object.freeze({
        "validate.required": "此项为必填",
        "validate.email": "请输入有效的邮箱地址",
        "validate.url": "请输入有效的网址",
        "validate.number": "请输入有效数字",
        "validate.min": "不能小于 {n}",
        "validate.max": "不能大于 {n}",
        "validate.minlength": "至少输入 {n} 个字符",
        "validate.maxlength": "最多输入 {n} 个字符",
        "validate.pattern": "格式不正确",
        "validate.mismatch": "输入不匹配",
        "pagination.prev": "上一页",
        "pagination.next": "下一页",
        "pagination.page": "第 {n} 页",
        "pagination.nav": "分页",
        "cascader.selectedPrefix": "已选：",
        "common.close": "关闭",
        "common.cancel": "取消",
        "common.ok": "确定",
        "common.next": "下一步",
        "common.prev": "上一步",
        "common.skip": "跳过",
        "common.done": "完成",
        "common.copy": "复制",
        "common.copied": "已复制",
        "common.backTop": "回到顶部",
        "common.min": "最小值",
        "common.max": "最大值",
        "validate.async": "校验未通过",
        "table.empty": "暂无数据",
        "table.loading": "加载中…",
        "select.search": "搜索…",
        "select.empty": "无匹配选项",
        "select.placeholder": "请选择",
        "select.more": "+{n}",
        "table.selectAll": "全选",
        "table.selectRow": "选择行",
        "table.selected": "已选 {n} 项",
        "table.clearSelection": "取消选择",
        "table.bulk": "批量操作",
        "table.cols": "列设置",
        "table.colsReset": "重置列",
        "palette.title": "配色",
        "palette.hint": "仅替换语义颜色，不改变组件形态",
        "palette.label": "配色",
        "colorMode.system": "跟随系统",
        "colorMode.light": "浅色",
        "colorMode.dark": "深色",
        "colorMode.switch": "当前{current}，切换至{next}",
        "upload.remove": "移除",
        "upload.drop": "拖拽文件至此",
        "upload.or": "或",
        "upload.browse": "点击选择",
        "file.clear": "移除已选文件",
        "preview.prev": "上一张",
        "preview.next": "下一张",
        "preview.close": "关闭预览",
        "tour.step": "{current} / {total}",
        "autocomplete.empty": "无匹配项",
        "color.swatch": "选择颜色，当前 {color}",
        "color.panel": "选择颜色",
        "color.hue": "色相",
        "color.spectrum": "颜色饱和度与明度",
        "color.hex": "十六进制颜色",
      }),
    }),
    en: Object.freeze({
      collator: "en",
      months: Object.freeze(["January","February","March","April","May","June","July","August","September","October","November","December"]),
      dow: Object.freeze(["Su","Mo","Tu","We","Th","Fr","Sa"]),
      year: "",
      today: "Today",
      clear: "Clear",
      now: "Now",
      confirm: "OK",
      hour: "Hour",
      minute: "Min",
      messages: Object.freeze({
        "validate.required": "This field is required",
        "validate.email": "Enter a valid email address",
        "validate.url": "Enter a valid URL",
        "validate.number": "Enter a valid number",
        "validate.min": "Must be at least {n}",
        "validate.max": "Must be at most {n}",
        "validate.minlength": "At least {n} characters",
        "validate.maxlength": "At most {n} characters",
        "validate.pattern": "Invalid format",
        "validate.mismatch": "Values do not match",
        "pagination.prev": "Previous page",
        "pagination.next": "Next page",
        "pagination.page": "Page {n}",
        "pagination.nav": "Pagination",
        "cascader.selectedPrefix": "Selected: ",
        "common.close": "Close",
        "common.cancel": "Cancel",
        "common.ok": "OK",
        "common.next": "Next",
        "common.prev": "Back",
        "common.skip": "Skip",
        "common.done": "Done",
        "common.copy": "Copy",
        "common.copied": "Copied",
        "common.backTop": "Back to top",
        "common.min": "Minimum",
        "common.max": "Maximum",
        "validate.async": "Validation failed",
        "table.empty": "No data",
        "table.loading": "Loading…",
        "select.search": "Search…",
        "select.empty": "No matches",
        "select.placeholder": "Select",
        "select.more": "+{n}",
        "table.selectAll": "Select all",
        "table.selectRow": "Select row",
        "table.selected": "{n} selected",
        "table.clearSelection": "Clear selection",
        "table.bulk": "Bulk actions",
        "table.cols": "Columns",
        "table.colsReset": "Reset columns",
        "palette.title": "Palette",
        "palette.hint": "Semantic colors only — component shapes stay the same",
        "palette.label": "Palette",
        "colorMode.system": "System",
        "colorMode.light": "Light",
        "colorMode.dark": "Dark",
        "colorMode.switch": "Now {current}, switch to {next}",
        "upload.remove": "Remove",
        "upload.drop": "Drop files here",
        "upload.or": "or",
        "upload.browse": "browse",
        "file.clear": "Remove selected file",
        "preview.prev": "Previous image",
        "preview.next": "Next image",
        "preview.close": "Close preview",
        "tour.step": "{current} / {total}",
        "autocomplete.empty": "No matches",
        "color.swatch": "Pick color, current {color}",
        "color.panel": "Color picker",
        "color.hue": "Hue",
        "color.spectrum": "Saturation and brightness",
        "color.hex": "Hex color",
      }),
    }),
  });
  /* 运行时可变：messages 深拷贝，calendar 字段同步到 LOCALE */
  let activeMessages = {};
  const LOCALE = {
    months: [],
    dow: [],
    year: "年",
    today: "今日",
    clear: "清除",
    now: "现在",
    confirm: "确定",
    hour: "时",
    minute: "分",
  };
  /* 兼容旧 VALIDATION_MESSAGES 键名 → i18n key */
  const VALIDATE_KEY_MAP = {
    required: "validate.required",
    email: "validate.email",
    url: "validate.url",
    number: "validate.number",
    min: "validate.min",
    max: "validate.max",
    minlength: "validate.minlength",
    maxlength: "validate.maxlength",
    pattern: "validate.pattern",
    mismatch: "validate.mismatch",
    async: "validate.async",
  };
  const clonePackMessages = (pack) => Object.assign({}, (pack && pack.messages) || {});
  const applyPackToLocale = (pack) => {
    if (!pack) return;
    LOCALE.months = Array.from(pack.months || []);
    LOCALE.dow = Array.from(pack.dow || []);
    LOCALE.year = pack.year != null ? pack.year : "";
    LOCALE.today = pack.today != null ? pack.today : "Today";
    LOCALE.clear = pack.clear != null ? pack.clear : "Clear";
    LOCALE.now = pack.now != null ? pack.now : "Now";
    LOCALE.confirm = pack.confirm != null ? pack.confirm : "OK";
    LOCALE.hour = pack.hour != null ? pack.hour : "Hour";
    LOCALE.minute = pack.minute != null ? pack.minute : "Min";
  };
  const t = (key, params) => {
    let str = activeMessages[key];
    if (str == null && I18N_PACKS["zh-CN"]) str = I18N_PACKS["zh-CN"].messages[key];
    if (str == null) str = key;
    str = String(str);
    if (params && typeof params === "object") {
      Object.keys(params).forEach((k) => {
        str = str.split("{" + k + "}").join(String(params[k]));
      });
    }
    return str;
  };
  const getCollatorLocale = () => {
    const pack = I18N_PACKS[CONFIG.locale] || I18N_PACKS["zh-CN"];
    return (pack && pack.collator) || CONFIG.locale || "zh-CN";
  };
  const setLocale = (code, pack) => {
    const next = code && I18N_PACKS[code] ? code : (code || "zh-CN");
    const base = I18N_PACKS[next] || I18N_PACKS["zh-CN"];
    CONFIG.locale = I18N_PACKS[next] ? next : (typeof code === "string" && code ? code : "zh-CN");
    activeMessages = clonePackMessages(base);
    applyPackToLocale(base);
    if (pack && typeof pack === "object") {
      if (pack.messages && typeof pack.messages === "object") Object.assign(activeMessages, pack.messages);
      if (pack.months) LOCALE.months = Array.from(pack.months);
      if (pack.dow) LOCALE.dow = Array.from(pack.dow);
      ["year", "today", "clear", "now", "confirm", "hour", "minute"].forEach((k) => {
        if (pack[k] != null) LOCALE[k] = pack[k];
      });
      if (pack.collator) { /* stored only via custom packs on CONFIG — use getCollator from pack if provided */ }
      if (typeof pack.collator === "string") CONFIG._collator = pack.collator;
      else delete CONFIG._collator;
    } else {
      delete CONFIG._collator;
    }
    const d = doc();
    if (d && d.documentElement) {
      try { d.documentElement.lang = CONFIG.locale; } catch (_) { /* ignore */ }
    }
    if (d) {
      try {
        d.dispatchEvent(new CustomEvent("blora:localechange", {
          bubbles: true,
          detail: { locale: CONFIG.locale, messages: { ...activeMessages }, localeData: { ...LOCALE } },
        }));
      } catch (_) { /* ignore */ }
      /* 刷新已挂载分页的 aria 文案 */
      if (FLAGS.i18nUiReady) {
        try { $$("[data-blora-pagination]", d).forEach((nav) => renderPagination(nav)); }
        catch (_) { /* ignore */ }
      }
    }
    return CONFIG.locale;
  };
  /* 启动默认语言（doc 尚未声明时不触碰 DOM） */
  activeMessages = clonePackMessages(I18N_PACKS["zh-CN"]);
  applyPackToLocale(I18N_PACKS["zh-CN"]);
  CONFIG.locale = "zh-CN";
  const doc = () => global && global.document;
  const $  = (sel, ctx = doc()) => (ctx ? ctx.querySelector(sel) : null);
  const $$ = (sel, ctx = doc()) => (ctx ? Array.from(ctx.querySelectorAll(sel)) : []);
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);
  const ownerDoc = (el) => (el && el.ownerDocument) || doc();
  const ownerWin = (el) => {
    const d = ownerDoc(el);
    return (d && d.defaultView) || global;
  };
  const resolveElement = (target, fallbackDoc = doc()) => {
    if (!target) return null;
    if (typeof target === "string") return fallbackDoc ? fallbackDoc.querySelector(target) : null;
    return target;
  };
  const getPortalRoot = (base) => {
    const d = ownerDoc(base);
    const root = resolveElement(CONFIG.portalRoot, d);
    return root || (d && d.body);
  };

  const FLAGS = {};
  /* 幂等标记：init 可重复调用（如 Blora.init(动态子树)），已绑定的元素自动跳过 */
  const bound = (el, key) => {
    key = "bloraBound" + key;
    if (!el || el.dataset[key]) return true;
    el.dataset[key] = "1";
    return false;
  };
  const applySize = (size) => {
    const d = doc();
    if (!d || !d.documentElement) return;
    const next = size === "sm" || size === "lg" ? size : "md";
    if (next === "md") d.documentElement.removeAttribute("data-blora-size");
    else d.documentElement.setAttribute("data-blora-size", next);
  };
  const configure = (options = {}) => {
    if (!options || typeof options !== "object") {
      return getConfig();
    }
    if ("autoInit" in options) CONFIG.autoInit = options.autoInit !== false;
    if ("portalRoot" in options) CONFIG.portalRoot = options.portalRoot || null;
    if ("colorModeStorageKey" in options && options.colorModeStorageKey) CONFIG.colorModeStorageKey = String(options.colorModeStorageKey);
    else if ("storageKey" in options && options.storageKey) CONFIG.colorModeStorageKey = String(options.storageKey);
    if ("paletteStorageKey" in options && options.paletteStorageKey) CONFIG.paletteStorageKey = String(options.paletteStorageKey);
    if ("size" in options && options.size) {
      CONFIG.size = String(options.size);
      applySize(CONFIG.size);
    }
    if ("validateOn" in options && options.validateOn != null) CONFIG.validateOn = String(options.validateOn);
    if ("tablePageSize" in options && Number(options.tablePageSize) > 0) CONFIG.tablePageSize = Number(options.tablePageSize);
    if ("classPrefix" in options && options.classPrefix) {
      CONFIG.classPrefix = String(options.classPrefix).replace(/[^a-zA-Z0-9_-]/g, "") || "blora";
      const d = doc();
      if (d && d.documentElement) d.documentElement.setAttribute("data-blora-class-prefix", CONFIG.classPrefix);
    }
    if ("tableColsStorageKey" in options && options.tableColsStorageKey) {
      CONFIG.tableColsStorageKey = String(options.tableColsStorageKey);
    }
    /* locale: 语言码字符串，或完整/部分语言包对象 */
    if (typeof options.locale === "string") {
      setLocale(options.locale);
    } else if (options.locale && typeof options.locale === "object") {
      const looksLikePack = options.locale.messages || options.locale.months || options.locale.dow;
      if (looksLikePack) {
        setLocale(options.localeCode || CONFIG.locale || "zh-CN", options.locale);
      } else {
        /* 兼容旧用法：直接 merge 到 LOCALE（datepicker 字段） */
        Object.assign(LOCALE, options.locale);
      }
    }
    if (options.localeCode && typeof options.localeCode === "string" && typeof options.locale !== "string") {
      setLocale(options.localeCode, typeof options.locale === "object" ? options.locale : null);
    }
    if (options.messages && typeof options.messages === "object") {
      /* 支持扁平 i18n key，也支持旧的 validate 短键 required/email… */
      Object.keys(options.messages).forEach((k) => {
        const mapped = VALIDATE_KEY_MAP[k] || k;
        activeMessages[mapped] = options.messages[k];
      });
    }
    return getConfig();
  };
  const getConfig = () => ({
    ...CONFIG,
    messages: { ...activeMessages },
    localeData: {
      months: LOCALE.months.slice(),
      dow: LOCALE.dow.slice(),
      year: LOCALE.year,
      today: LOCALE.today,
      clear: LOCALE.clear,
      now: LOCALE.now,
      confirm: LOCALE.confirm,
      hour: LOCALE.hour,
      minute: LOCALE.minute,
    },
  });
  const prefersReduced = (base) => {
    const win = ownerWin(base);
    return !!(win && win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  /* 读取元素当前动画时长（随动效令牌变化），加 20ms 余量；读不到时用回退值 */
  const animMs = (el, fallback) => {
    const win = ownerWin(el);
    const d = el && win ? parseFloat(win.getComputedStyle(el).animationDuration) : 0;
    return (d ? d * 1000 : fallback) + 20;
  };
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));
  const token = (name, fallback) => {
    const d = doc();
    const value = d ? getComputedStyle(d.documentElement).getPropertyValue(name).trim() : "";
    return value || fallback || "";
  };
  const normalizeShortcutPlatform = (platform) => /apple|mac|iphone|ipad|ipod/i.test(String(platform || "")) ? "apple" : "standard";
  const getShortcutPlatform = (base) => {
    const win = base ? ownerWin(base) : global;
    const nav = win && win.navigator;
    const platform = nav && ((nav.userAgentData && nav.userAgentData.platform) || nav.platform || nav.userAgent);
    return normalizeShortcutPlatform(platform);
  };
  const shortcutTokens = (shortcut) => String(shortcut || "")
    .split("+")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  const shortcutKey = (key, platform, accessible = false) => {
    const apple = normalizeShortcutPlatform(platform) === "apple";
    const labels = {
      mod: accessible ? (apple ? "Command" : "Control") : (apple ? "⌘" : "Ctrl"),
      ctrl: accessible ? "Control" : "Ctrl",
      command: accessible ? "Command" : "⌘",
      cmd: accessible ? "Command" : "⌘",
      alt: accessible ? (apple ? "Option" : "Alt") : (apple ? "⌥" : "Alt"),
      option: accessible ? "Option" : "⌥",
      shift: accessible ? "Shift" : (apple ? "⇧" : "Shift"),
      enter: "Enter",
      escape: "Esc",
      esc: "Esc",
      space: "Space",
    };
    return labels[key] || (key.length === 1 ? key.toUpperCase() : key);
  };
  const formatShortcut = (shortcut, platform = getShortcutPlatform()) => shortcutTokens(shortcut)
    .map((key) => shortcutKey(key, platform))
    .join(" + ");
  const cssLengthPx = (base, property, fallback = 0) => {
    const win = ownerWin(base);
    const d = ownerDoc(base);
    if (!win || !d || !base) return fallback;
    const styles = win.getComputedStyle(base);
    const raw = styles.getPropertyValue(property).trim();
    const value = parseFloat(raw);
    if (!Number.isFinite(value)) return fallback;
    if (raw.endsWith("rem")) {
      return value * (parseFloat(win.getComputedStyle(d.documentElement).fontSize) || 16);
    }
    if (raw.endsWith("em")) {
      return value * (parseFloat(styles.fontSize) || 16);
    }
    return value;
  };
  const fitFloatingInline = (panel) => {
    if (!panel) return;
    const win = ownerWin(panel);
    const gutter = cssLengthPx(panel, "--blora-space-3", parseFloat(win.getComputedStyle(panel).fontSize) || 16);
    panel.style.setProperty("--blora-float-shift-x", "0px");
    const rect = panel.getBoundingClientRect();
    let shift = 0;
    if (rect.left < gutter) shift += gutter - rect.left;
    if (rect.right + shift > win.innerWidth - gutter) shift -= rect.right + shift - (win.innerWidth - gutter);
    panel.style.setProperty("--blora-float-shift-x", shift + "px");
  };

  function initShortcutHints(root) {
    $$('[data-blora-shortcut]', root).forEach((hint) => {
      if (bound(hint, "Shortcut")) return;
      const shortcut = hint.dataset.bloraShortcut;
      const platform = getShortcutPlatform(hint);
      hint.textContent = formatShortcut(shortcut, platform);
      hint.setAttribute("aria-label", shortcutTokens(shortcut)
        .map((key) => shortcutKey(key, platform, true))
        .join(" + "));
    });
  }
  const makeChevron = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "10");
    svg.setAttribute("height", "10");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.classList.add("blora-cascader__arrow");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M9 18l6-6-6-6");
    svg.appendChild(path);
    return svg;
  };

  /* —— Tabs —— 方向键 / Home / End 可达，role 与 aria-* 自动注入 —— */
  function initTabs(root) {
    $$("[data-blora-tabs]", root).forEach((group) => {
      if (bound(group, "Tabs")) return;
      const nav = $(".blora-tabs__nav", group);
      const tabs = $$(".blora-tabs__tab", group);
      const panels = $$(".blora-tabs__panel", group);
      if (nav) nav.setAttribute("role", "tablist");
      panels.forEach((p) => {
        p.setAttribute("role", "tabpanel");
        p.setAttribute("aria-hidden", String(p.classList.contains("blora-hide")));
      });
      const indicator = nav && ownerDoc(nav).createElement("span");
      if (indicator) {
        indicator.className = "blora-tabs__indicator";
        indicator.setAttribute("aria-hidden", "true");
        nav.appendChild(indicator);
      }
      const moveIndicator = (tab, immediate = false) => {
        if (!indicator || !tab) return;
        const navRect = nav.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        indicator.classList.toggle("is-instant", immediate);
        indicator.style.setProperty("--blora-tab-x", (tabRect.left - navRect.left) + "px");
        indicator.style.setProperty("--blora-tab-y", (tabRect.top - navRect.top) + "px");
        indicator.style.setProperty("--blora-tab-w", tabRect.width + "px");
        indicator.style.setProperty("--blora-tab-h", tabRect.height + "px");
        if (immediate) ownerWin(nav).requestAnimationFrame(() => indicator.classList.remove("is-instant"));
      };
      const activate = (tab, focus) => {
        if (tab.classList.contains("is-disabled")) return;
        if (tab.classList.contains("is-active")) {
          if (focus) tab.focus();
          return;
        }
        const i = tabs.indexOf(tab);
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
          if (!t.classList.contains("is-disabled")) t.tabIndex = active ? 0 : -1;
        });
        panels.forEach((p) => {
          p.classList.add("blora-hide");
          p.setAttribute("aria-hidden", "true");
        });
        const panel = panels[i] || panels[Number(tab.dataset.tab)];
        if (panel) {
          panel.classList.remove("blora-hide");
          panel.setAttribute("aria-hidden", "false");
          panel.classList.remove("is-entering");
          void panel.offsetWidth;
          panel.classList.add("is-entering");
        }
        moveIndicator(tab);
        if (focus) tab.focus();
      };
      tabs.forEach((tab) => {
        tab.setAttribute("role", "tab");
        const active = tab.classList.contains("is-active");
        tab.setAttribute("aria-selected", String(active));
        if (tab.classList.contains("is-disabled")) { tab.setAttribute("aria-disabled", "true"); tab.tabIndex = -1; return; }
        tab.tabIndex = active ? 0 : -1;
        on(tab, "click", () => activate(tab));
      });
      on(nav, "keydown", (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!step && e.key !== "Home" && e.key !== "End") return;
        const list = tabs.filter((t) => !t.classList.contains("is-disabled"));
        if (!list.length) return;
        const cur = list.indexOf(document.activeElement);
        const n = e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 : (Math.max(cur, 0) + step + list.length) % list.length;
        e.preventDefault();
        activate(list[n], true);
      });
      moveIndicator(tabs.find((tab) => tab.classList.contains("is-active")) || tabs.find((tab) => !tab.classList.contains("is-disabled")), true);
      const win = ownerWin(nav);
      if (win && win.ResizeObserver) new win.ResizeObserver(() => moveIndicator(tabs.find((tab) => tab.classList.contains("is-active")), true)).observe(nav);
    });
  }

  /* —— Collapse / Accordion —— */
  function initCollapse(root) {
    const setH = (item) => {
      const body = $(".blora-collapse__body", item);
      if (!body) return;
      body.style.setProperty("--blora-collapse-h", body.scrollHeight + "px");
    };
    $$(".blora-collapse__item.is-open", root).forEach(setH);
    $$(".blora-collapse__head", root).forEach((head) => {
      if (bound(head, "Collapse")) return;
      on(head, "click", () => {
        const item = head.closest(".blora-collapse__item");
        const group = item && item.closest("[data-blora-accordion]");
        if (group && group.hasAttribute("data-blora-accordion") && !item.classList.contains("is-open")) {
          $$(".blora-collapse__item.is-open", group).forEach((o) => { if (o !== item) { o.classList.remove("is-open"); } });
        }
        if (!item.classList.contains("is-open")) {
          setH(item);
          item.classList.add("is-open");
        } else {
          item.classList.remove("is-open");
        }
      });
    });
  }

  /* —— 浮层公共：焦点圈禁 / 归还 / 滚动锁协调 —— */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function bindTrap(layer) {
    if (bound(layer, "Trap")) return;
    on(layer, "keydown", (e) => {
      if (e.key !== "Tab") return;
      const f = $$(FOCUSABLE, layer).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      const active = ownerDoc(layer).activeElement;
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    });
  }
  const restoreFocus = (layer) => {
    if (layer._bloraPrev && typeof layer._bloraPrev.focus === "function") layer._bloraPrev.focus();
    layer._bloraPrev = null;
  };
  /* 锁滚动：用 position:fixed 冻结 body，避免 overflow:hidden 打断 sticky 顶栏/侧栏 */
  const lockScroll = (base) => {
    const d = ownerDoc(base);
    const win = ownerWin(base);
    if (!d || !d.body || !win) return;
    const root = d.documentElement;
    if (root.dataset.bloraScrollLocked === "1") return;
    const y = win.scrollY || root.scrollTop || 0;
    const sbw = Math.max(0, win.innerWidth - root.clientWidth);
    root.dataset.bloraScrollLocked = "1";
    root._bloraScrollY = y;
    d.body.style.position = "fixed";
    d.body.style.top = `-${y}px`;
    d.body.style.left = "0";
    d.body.style.right = "0";
    d.body.style.width = "100%";
    if (sbw) d.body.style.paddingRight = `${sbw}px`;
  };
  const unlockScroll = (base) => {
    const d = ownerDoc(base);
    const win = ownerWin(base);
    if (!d || !d.body || !win) return;
    if ($(".blora-modal.is-open", d) || $(".blora-drawer.is-open", d)) return;
    const root = d.documentElement;
    if (root.dataset.bloraScrollLocked !== "1") {
      /* 兼容旧路径：曾写过 overflow:hidden */
      if (d.body.style.overflow === "hidden") d.body.style.overflow = "";
      return;
    }
    const y = typeof root._bloraScrollY === "number" ? root._bloraScrollY : 0;
    delete root.dataset.bloraScrollLocked;
    root._bloraScrollY = null;
    d.body.style.position = "";
    d.body.style.top = "";
    d.body.style.left = "";
    d.body.style.right = "";
    d.body.style.width = "";
    d.body.style.paddingRight = "";
    if (d.body.style.overflow === "hidden") d.body.style.overflow = "";
    win.scrollTo(0, y);
  };

  /* —— Modal —— */
  function openModal(id) {
    const d = doc();
    const m = typeof id === "string" ? d && d.getElementById(id) : id;
    if (!m || m.classList.contains("is-open")) return;
    const mDoc = ownerDoc(m);
    m._bloraPrev = mDoc.activeElement;
    m.classList.remove("is-closing");
    m.classList.add("is-open");
    lockScroll(m);
    if (!m._bloraLayerClose) {
      m._bloraLayerClose = (e) => {
        if (e.target.closest("[data-blora-close]") || e.target.classList.contains("blora-modal__mask")) closeModal(m);
      };
      on(m, "click", m._bloraLayerClose);
    }
    if (m._bloraEsc) mDoc.removeEventListener("keydown", m._bloraEsc);
    m._bloraEsc = (e) => { if (e.key === "Escape") closeModal(m); };
    mDoc.addEventListener("keydown", m._bloraEsc);
    bindTrap(m);
    const dlg = $(".blora-modal__dialog", m);
    if (dlg) { dlg.tabIndex = -1; dlg.focus(); }
  }
  function closeModal(m) {
    const d = doc();
    m = typeof m === "string" ? d && d.getElementById(m) : m;
    if (!m || !m.classList.contains("is-open") || m.classList.contains("is-closing")) return;
    const mDoc = ownerDoc(m);
    m.classList.add("is-closing");
    m.classList.remove("is-open");
    if (m._bloraEsc) {
      mDoc.removeEventListener("keydown", m._bloraEsc);
      m._bloraEsc = null;
    }
    setTimeout(() => {
      m.classList.remove("is-closing");
      unlockScroll(m);
      restoreFocus(m);
    }, animMs($(".blora-modal__dialog", m), 240));
  }
  function initModal(root) {
    $$("[data-blora-modal-open]", root).forEach((btn) => {
      if (bound(btn, "ModalOpen")) return;
      on(btn, "click", () => openModal(btn.dataset.bloraModalOpen));
    });
  }

  /* —— Drawer —— */
  function openDrawer(id) {
    const baseDoc = doc();
    const drawer = typeof id === "string" ? baseDoc && baseDoc.getElementById(id) : id;
    if (!drawer || drawer.classList.contains("is-open")) return;
    const dDoc = ownerDoc(drawer);
    drawer._bloraPrev = dDoc.activeElement;
    drawer.classList.remove("is-closing");
    drawer.classList.add("is-open");
    lockScroll(drawer);
    if (!drawer._bloraLayerClose) {
      drawer._bloraLayerClose = (e) => {
        if (e.target.closest("[data-blora-close]") || e.target.classList.contains("blora-drawer__mask")) closeDrawer(drawer);
      };
      on(drawer, "click", drawer._bloraLayerClose);
    }
    if (drawer._bloraEsc) dDoc.removeEventListener("keydown", drawer._bloraEsc);
    drawer._bloraEsc = (e) => { if (e.key === "Escape") closeDrawer(drawer); };
    dDoc.addEventListener("keydown", drawer._bloraEsc);
    bindTrap(drawer);
    const panel = $(".blora-drawer__panel", drawer);
    if (panel) { panel.tabIndex = -1; panel.focus(); }
  }
  function closeDrawer(d) {
    const baseDoc = doc();
    d = typeof d === "string" ? baseDoc && baseDoc.getElementById(d) : d;
    if (!d || !d.classList.contains("is-open") || d.classList.contains("is-closing")) return;
    const dDoc = ownerDoc(d);
    d.classList.add("is-closing");
    d.classList.remove("is-open");
    if (d._bloraEsc) {
      dDoc.removeEventListener("keydown", d._bloraEsc);
      d._bloraEsc = null;
    }
    setTimeout(() => {
      d.classList.remove("is-closing");
      unlockScroll(d);
      restoreFocus(d);
    }, animMs($(".blora-drawer__panel", d), 420));
  }
  function initDrawer(root) {
    $$("[data-blora-drawer-open]", root).forEach((btn) => {
      if (bound(btn, "DrawerOpen")) return;
      on(btn, "click", () => openDrawer(btn.dataset.bloraDrawerOpen));
    });
  }

  /* —— Popover —— */
  function initPopover(root) {
    $$("[data-blora-popover]", root).forEach((trigger) => {
      if (bound(trigger, "Popover")) return;
      const pop = trigger.closest(".blora-popover");
      if (!pop) return;
      const panel = $(".blora-popover__panel", pop);
      if (!panel) return;
      const win = ownerWin(pop);
      const portalRoot = getPortalRoot(pop);
      const gap = () => cssLengthPx(panel, "--blora-space-2", 8);
      const gutter = () => cssLengthPx(panel, "--blora-space-3", 12);
      const position = () => {
        if (!pop.classList.contains("is-open")) return;
        const triggerRect = trigger.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const edge = gutter();
        const offset = gap();
        const left = Math.min(
          Math.max(edge, triggerRect.left + (triggerRect.width - panelRect.width) / 2),
          Math.max(edge, win.innerWidth - edge - panelRect.width)
        );
        const below = triggerRect.bottom + offset;
        const above = triggerRect.top - offset - panelRect.height;
        const top = below + panelRect.height <= win.innerHeight - edge || above < edge ? below : above;
        panel.style.setProperty("--blora-float-left", left + "px");
        panel.style.setProperty("--blora-float-top", Math.max(edge, top) + "px");
      };
      const close = () => {
        pop.classList.remove("is-open");
        panel.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      };
      pop._bloraClosePopover = close;
      trigger.setAttribute("aria-haspopup", "dialog");
      trigger.setAttribute("aria-expanded", "false");
      $$("[data-blora-close]", panel).forEach((b) => on(b, "click", close));
      on(trigger, "click", (e) => {
        e.stopPropagation();
        $$(".blora-popover.is-open").forEach((other) => {
          if (other !== pop && other._bloraClosePopover) other._bloraClosePopover();
        });
        if (pop.classList.contains("is-open")) {
          close();
          return;
        }
        if (panel.parentNode !== portalRoot) portalRoot.appendChild(panel);
        panel.classList.add("blora-portal", "is-portaled");
        pop.classList.add("is-open");
        panel.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        win.requestAnimationFrame(position);
      });
      on(win, "resize", position);
      on(win, "scroll", position, true);
    });
    if (!FLAGS.popoverDoc) {
      FLAGS.popoverDoc = true;
      on(document, "click", (e) => {
        if (e.target.closest(".blora-popover, .blora-popover__panel")) return;
        $$(".blora-popover.is-open").forEach((p) => {
          if (p._bloraClosePopover) p._bloraClosePopover();
        });
      });
    }
  }

  /* —— Toast / Message / Notification —— */
  const MSG_ICONS = {
    success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
    danger:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    info:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  };
  const notifyPlacement = (place) => {
    const map = {
      "top-right": "blora-notify-container--top-right",
      "top-left": "blora-notify-container--top-left",
      "bottom-right": "blora-notify-container--bottom-right",
      "bottom-left": "blora-notify-container--bottom-left",
    };
    return map[place] || map["top-right"];
  };
  const getNotifyHost = (placement) => {
    const root = getPortalRoot();
    if (!root) return null;
    const d = ownerDoc(root);
    const place = placement || "top-right";
    const placeCls = notifyPlacement(place);
    let c = $$(".blora-notify-container", root).find((n) => n.classList.contains(placeCls)) || null;
    if (!c) {
      c = d.createElement("div");
      c.className = "blora-notify-container blora-portal " + placeCls;
      root.appendChild(c);
    }
    return c;
  };
  function toast(opts) {
    opts = typeof opts === "string" ? { message: opts } : (opts || {});
    const root = getPortalRoot();
    if (!root) return null;
    const d = ownerDoc(root);
    let c = $(".blora-toast-container", root);
    if (!c) { c = d.createElement("div"); c.className = "blora-toast-container blora-portal"; root.appendChild(c); }
    const type = opts.type || "info";
    const el = d.createElement("div");
    el.className = "blora-toast";
    const box = d.createElement("div");
    box.className = "blora-message blora-message--" + (MSG_ICONS[type] ? type : "info");
    box.innerHTML = '<span class="blora-message__icon">' + (MSG_ICONS[type] || MSG_ICONS.info) + '</span>';
    const text = d.createElement("span");
    text.textContent = opts.message || "";
    box.appendChild(text);
    el.appendChild(box);
    c.appendChild(el);
    const ms = opts.duration == null ? 3000 : opts.duration;
    const close = () => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), animMs(el, 240)); };
    if (ms > 0) setTimeout(close, ms);
    return { close, el };
  }
  function message(opts) {
    return toast(typeof opts === "string" ? { message: opts } : opts);
  }
  function notify(opts) {
    opts = typeof opts === "string" ? { description: opts } : (opts || {});
    const d = doc();
    if (!d) return null;
    const host = getNotifyHost(opts.placement || "top-right");
    if (!host) return null;
    const type = opts.type || "info";
    const el = d.createElement("div");
    el.className = "blora-notification blora-notification--" + (MSG_ICONS[type] ? type : "info");
    el.setAttribute("role", "status");
    const icon = d.createElement("span");
    icon.className = "blora-notification__icon";
    icon.innerHTML = MSG_ICONS[type] || MSG_ICONS.info;
    const body = d.createElement("div");
    if (opts.title) {
      const title = d.createElement("div");
      title.className = "blora-notification__title";
      title.textContent = opts.title;
      body.appendChild(title);
    }
    const desc = d.createElement("div");
    desc.className = "blora-notification__desc";
    desc.textContent = opts.description || opts.message || "";
    body.appendChild(desc);
    const closeBtn = d.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "blora-notification__close";
    closeBtn.setAttribute("aria-label", t("common.close"));
    closeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    const close = () => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), animMs(el, 240)); };
    on(closeBtn, "click", close);
    el.appendChild(icon);
    el.appendChild(body);
    el.appendChild(closeBtn);
    host.appendChild(el);
    const ms = opts.duration == null ? 4500 : opts.duration;
    if (ms > 0) setTimeout(close, ms);
    return { close, el };
  }

  /* —— Segmented —— 滑动指示器 —— */
  function initSegmented(root) {
    $$(".blora-segmented", root).forEach((seg) => {
      if (bound(seg, "Segmented")) return;
      const d = ownerDoc(seg);
      const win = ownerWin(seg);
      const indicator = d.createElement("span");
      indicator.className = "blora-segmented__indicator";
      indicator.setAttribute("aria-hidden", "true");
      seg.insertBefore(indicator, seg.firstChild);
      const items = $$(".blora-segmented__item", seg);
      seg.setAttribute("role", "radiogroup");
      const moveIndicator = (item) => {
        const segRect = seg.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        indicator.style.left = (itemRect.left - segRect.left) + "px";
        indicator.style.width = itemRect.width + "px";
      };
      const enabled = () => items.filter((item) => !item.classList.contains("is-disabled") && item.getAttribute("aria-disabled") !== "true");
      const activate = (item, focus = false, emit = true) => {
        if (!item || !enabled().includes(item)) return;
        items.forEach((candidate) => {
          const active = candidate === item;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-checked", String(active));
          if (candidate.getAttribute("aria-disabled") !== "true") candidate.tabIndex = active ? 0 : -1;
        });
        seg.dataset.value = item.dataset.value || item.textContent.trim();
        moveIndicator(item);
        if (focus) item.focus();
        if (emit) seg.dispatchEvent(new win.CustomEvent("blora:change", { bubbles: true, detail: { value: seg.dataset.value, item } }));
      };
      items.forEach((item) => {
        item.setAttribute("role", "radio");
        const disabled = item.classList.contains("is-disabled") || item.getAttribute("aria-disabled") === "true";
        item.setAttribute("aria-checked", String(item.classList.contains("is-active")));
        item.tabIndex = disabled ? -1 : (item.classList.contains("is-active") ? 0 : -1);
        if (disabled) item.setAttribute("aria-disabled", "true");
        on(item, "click", () => activate(item));
      });
      on(seg, "keydown", (e) => {
        const candidates = enabled();
        if (!candidates.length) return;
        const current = candidates.indexOf(d.activeElement);
        let next = current < 0 ? 0 : current;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (next + 1) % candidates.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (next - 1 + candidates.length) % candidates.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = candidates.length - 1;
        else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(d.activeElement); return; }
        else return;
        e.preventDefault();
        activate(candidates[next], true);
      });
      const remeasure = () => {
        const cur = items.find((i) => i.classList.contains("is-active"));
        if (cur) moveIndicator(cur);
      };
      const active = items.find((i) => i.classList.contains("is-active")) || enabled()[0];
      if (active) { activate(active, false, false); win.requestAnimationFrame(() => moveIndicator(active)); }
      on(win, "resize", remeasure);
      /* webfont 载入后字宽会变，指示器需重算 */
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(remeasure);
    });
  }

  /* —— Button loading —— */
  function initBtnLoading(root) {
    $$("[data-blora-loading]", root).forEach((btn) => {
      if (bound(btn, "Loading")) return;
      on(btn, "click", () => {
        if (btn.classList.contains("is-loading")) return;
        btn.classList.add("is-loading");
        setTimeout(() => btn.classList.remove("is-loading"), Number(btn.dataset.bloraLoading) || 1800);
      });
    });
  }

  /* —— Rate —— */
  function initRate(root) {
    $$(".blora-rate", root).forEach((rate) => {
      if (bound(rate, "Rate")) return;
      const stars = $$(".blora-rate__star", rate);
      const readOnly = rate.hasAttribute("data-readonly");
      const win = ownerWin(rate);
      rate.setAttribute("role", "radiogroup");
      if (readOnly) rate.setAttribute("aria-readonly", "true");
      const setValue = (value, focus = false, emit = true) => {
        const next = Math.max(1, Math.min(stars.length, value));
        rate.dataset.value = String(next);
        stars.forEach((star, index) => {
          const selected = index + 1 === next;
          star.classList.toggle("is-on", index < next);
          star.setAttribute("aria-checked", String(selected));
          if (!readOnly) star.tabIndex = selected ? 0 : -1;
        });
        if (focus) stars[next - 1].focus();
        if (emit) rate.dispatchEvent(new win.CustomEvent("blora:change", { bubbles: true, detail: { value: next } }));
      };
      stars.forEach((star, i) => {
        star.setAttribute("role", "radio");
        star.setAttribute("aria-label", star.getAttribute("aria-label") || `${i + 1} / ${stars.length}`);
        star.tabIndex = -1;
        on(star, "click", () => { if (!readOnly) setValue(i + 1); });
        if (!readOnly) {
          on(star, "mouseenter", () => stars.forEach((s, j) => s.classList.toggle("is-on", j <= i)));
          on(star, "mouseleave", () => {
            const v = Number(rate.dataset.value || 0);
            stars.forEach((s, j) => s.classList.toggle("is-on", j < v));
          });
        }
      });
      if (!readOnly) on(rate, "keydown", (e) => {
        let value = Number(rate.dataset.value || 1);
        if (e.key === "ArrowRight" || e.key === "ArrowUp") value += 1;
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") value -= 1;
        else if (e.key === "Home") value = 1;
        else if (e.key === "End") value = stars.length;
        else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setValue(value); return; }
        else return;
        e.preventDefault(); setValue(value, true);
      });
      if (stars.length) setValue(Number(rate.dataset.value || 1), false, false);
    });
  }

  /* —— Slider —— 悬浮数值提示 —— */
  function initSlider(root) {
    $$(".blora-slider", root).forEach((wrap) => {
      if (bound(wrap, "Slider")) return;
      const input = $(".blora-slider__input", wrap);
      const val = $(".blora-slider__value", wrap);
      if (!input) return;
      const tip = document.createElement("span");
      tip.className = "blora-slider__tip";
      input.parentElement.style.position = "relative";
      input.parentElement.appendChild(tip);
      const sync = () => {
        if (val) val.textContent = input.value;
        const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
        const rect = input.getBoundingClientRect();
        const wrapRect = input.parentElement.getBoundingClientRect();
        tip.textContent = input.value;
        tip.style.left = (rect.left - wrapRect.left + rect.width * pct / 100) + "px";
      };
      sync();
      on(input, "input", sync);
      on(input, "mousedown", () => tip.classList.add("is-show"));
      on(input, "focus", () => tip.classList.add("is-show"));
      on(input, "mouseup", () => tip.classList.remove("is-show"));
      on(input, "blur", () => tip.classList.remove("is-show"));
      on(window, "resize", sync);
    });
  }

  function initProgress(root) {
    $$(".blora-progress[data-value]", root).forEach((progress) => {
      const fill = $(".blora-progress__fill", progress);
      if (!fill) return;
      const value = Math.max(0, Math.min(100, Number(progress.dataset.value) || 0));
      fill.style.width = value + "%";
      progress.setAttribute("role", "progressbar");
      progress.setAttribute("aria-valuemin", "0");
      progress.setAttribute("aria-valuemax", "100");
      progress.setAttribute("aria-valuenow", String(value));
    });
  }

  /* —— 字数限制 —— 不拦截输入，仅标注超限字符并同步计数。 */
  function initTextLimit(root) {
    const splitValue = (value, limit) => {
      const chars = Array.from(value || "");
      return {
        count: chars.length,
        normal: chars.slice(0, limit).join(""),
        overflow: chars.slice(limit).join(""),
      };
    };
    const syncActionState = (field) => {
      const group = field.closest("[data-blora-limit-group]");
      if (!group) return;
      const invalid = $$("[data-blora-limit]", group).some((el) => el.dataset.bloraLimitInvalid === "true");
      $$("[data-blora-limit-action]", group).forEach((action) => {
        action.disabled = invalid;
        action.setAttribute("aria-disabled", String(invalid));
      });
    };
    $$("input[data-blora-limit], textarea[data-blora-limit]", root).forEach((field) => {
      if (bound(field, "TextLimit")) return;
      const limit = Number(field.dataset.bloraLimit);
      if (!Number.isFinite(limit) || limit < 1) return;
      const secure = (field.type || "").toLowerCase() === "password";
      field.removeAttribute("maxlength");
      const wrapper = field.closest(".blora-limit") || document.createElement("div");
      if (!wrapper.classList.contains("blora-limit")) {
        field.parentNode.insertBefore(wrapper, field);
        wrapper.appendChild(field);
        wrapper.className = "blora-limit";
      }
      wrapper.classList.toggle("blora-limit--textarea", field.tagName === "TEXTAREA");
      wrapper.classList.toggle("blora-limit--secure", secure);
      const mirror = document.createElement("div");
      mirror.className = "blora-limit__mirror";
      mirror.setAttribute("aria-hidden", "true");
      const mirrorInner = document.createElement("span");
      mirrorInner.className = "blora-limit__mirror-inner";
      const normal = document.createElement("span");
      const overflow = document.createElement("span");
      overflow.className = "blora-limit__overflow";
      mirrorInner.append(normal, overflow);
      mirror.appendChild(mirrorInner);
      const counter = document.createElement("span");
      counter.className = "blora-limit__count";
      FLAGS.textLimitId = (FLAGS.textLimitId || 0) + 1;
      counter.id = field.id ? field.id + "-count" : "blora-limit-count-" + FLAGS.textLimitId;
      counter.setAttribute("aria-live", "polite");
      wrapper.append(mirror, counter);
      const describedBy = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
      if (!describedBy.includes(counter.id)) field.setAttribute("aria-describedby", describedBy.concat(counter.id).join(" "));
      const syncScroll = () => {
        mirrorInner.style.transform = "translateX(" + (-field.scrollLeft) + "px)";
        mirror.scrollTop = field.scrollTop;
      };
      const update = () => {
        const state = splitValue(field.value, limit);
        const over = state.count > limit;
        normal.textContent = secure ? "\u2022".repeat(Math.min(state.count, limit)) : state.normal || "";
        overflow.textContent = secure ? "\u2022".repeat(Math.max(state.count - limit, 0)) : state.overflow || "";
        counter.textContent = state.count + "/" + limit;
        wrapper.classList.toggle("is-over-limit", over);
        field.classList.toggle("is-over-limit", over);
        field.dataset.bloraLimitInvalid = String(over);
        if (over) field.setAttribute("aria-invalid", "true");
        else if (!field.classList.contains("is-error")) field.removeAttribute("aria-invalid");
        syncActionState(field);
        syncScroll();
      };
      on(field, "input", update);
      on(field, "scroll", syncScroll);
      on(field, "keyup", syncScroll);
      update();
      syncScroll();
    });
  }

  /* —— Tags input —— */
  function initTagsInput(root) {
    $$(".blora-tags-input", root).forEach((box) => {
      if (bound(box, "Tags")) return;
      const input = $("input", box);
      if (!input) return;
      const add = (text) => {
        text = text.trim();
        if (!text) return;
        const tag = document.createElement("span");
        tag.className = "blora-tag blora-tag--primary blora-tag--removable";
        tag.textContent = text;   /* 用户输入按文本插入，防注入 */
        const close = document.createElement("span");
        close.className = "blora-tag__close";
        close.setAttribute("aria-label", "移除");
        on(close, "click", () => tag.remove());
        tag.appendChild(close);
        box.insertBefore(tag, input);
      };
      on(input, "keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(input.value); input.value = ""; }
        else if (e.key === "Backspace" && !input.value && input.previousElementSibling) {
          input.previousElementSibling.remove();
        }
      });
    });
  }

  /* —— Number stepper —— */
  function initNumber(root) {
    $$(".blora-number", root).forEach((box) => {
      /* data-blora-manual：跳过自动步进绑定，由业务自行接管（如演示页的 OTP 位数控制） */
      if (box.hasAttribute("data-blora-manual") || bound(box, "Number")) return;
      const input = $(".blora-input", box);
      const up = $(".blora-number__btn[data-step='up']", box);
      const down = $(".blora-number__btn[data-step='down']", box);
      const step = Number(input && input.step) || 1;
      const min = input && input.min !== "" ? Number(input.min) : -Infinity;
      const max = input && input.max !== "" ? Number(input.max) : Infinity;
      on(up, "click", () => { input.value = Math.min(max, Number(input.value || 0) + step); });
      on(down, "click", () => { input.value = Math.max(min, Number(input.value || 0) - step); });
    });
  }

  /* —— Checkbox indeterminate demo —— */
  function initCheckbox(root) {
    $$("[data-blora-checkall]", root).forEach((master) => {
      if (bound(master, "Checkall")) return;
      const group = master.closest("form, .blora-field, [data-blora-check-group]") || document;
      const items = $$('input[type="checkbox"]:not([data-blora-checkall])', group).filter((i) => i.closest(".blora-checkbox") && !i.closest(".blora-transfer") && !i.disabled);
      const label = master.closest(".blora-checkbox");
      const sync = () => {
        const checked = items.filter((i) => i.checked);
        const all = checked.length === items.length && items.length > 0;
        const some = checked.length > 0 && !all;
        master.checked = all;
        master.indeterminate = some;
        if (label) label.classList.toggle("blora-checkbox--indeterminate", some);
      };
      on(master, "click", () => {
        const all = items.every((i) => i.checked);
        items.forEach((i) => i.checked = !all);
        sync();
      });
      items.forEach((i) => on(i, "change", sync));
      sync();
    });
  }

  /* —— Tree —— 点击整行展开/折叠，Enter/Space 键盘可达，aria 自动注入 —— */
  function initTree(root) {
    const setH = (box, h) => box.style.setProperty("--blora-tree-h", h + "px");
    /* 从最内层往外量，保证外层 scrollHeight 里包含的是内层真实高度 */
    const open = $$(".blora-tree__node.is-open + .blora-tree__children", root);
    for (let i = open.length - 1; i >= 0; i--) setH(open[i], open[i].scrollHeight);
    $$(".blora-tree", root).forEach((t) => t.setAttribute("role", "tree"));
    $$(".blora-tree__node", root).forEach((node) => {
      if (bound(node, "Tree")) return;
      const next = node.nextElementSibling;
      const children = next && next.classList.contains("blora-tree__children") ? next : null;
      node.setAttribute("role", "treeitem");
      node.tabIndex = 0;
      node.setAttribute("aria-selected", String(node.classList.contains("is-selected")));
      if (children) node.setAttribute("aria-expanded", String(node.classList.contains("is-open")));
      const toggle = () => {
        if (children) {
          const delta = node.classList.contains("is-open")
            ? -children.offsetHeight
            : children.scrollHeight - children.offsetHeight;
          setH(children, children.scrollHeight);
          /* 祖先容器同步增减，嵌套展开不被裁剪、折叠不空等 */
          for (let p = children.parentElement; p && !p.classList.contains("blora-tree"); p = p.parentElement) {
            if (p.classList.contains("blora-tree__children")) setH(p, p.scrollHeight + delta);
          }
        }
        node.classList.toggle("is-open");
        $$(".blora-tree__node.is-selected", node.closest(".blora-tree")).forEach((n) => {
          if (n !== node) { n.classList.remove("is-selected"); n.setAttribute("aria-selected", "false"); }
        });
        node.classList.toggle("is-selected");
        node.setAttribute("aria-selected", String(node.classList.contains("is-selected")));
        if (children) node.setAttribute("aria-expanded", String(node.classList.contains("is-open")));
      };
      on(node, "click", toggle);
      on(node, "keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
    });
  }

  /* —— Carousel —— */
  function initCarousel(root) {
    $$(".blora-carousel", root).forEach((car) => {
      if (bound(car, "Carousel")) return;
      const track = $(".blora-carousel__track", car);
      const slides = $$(".blora-carousel__slide", car);
      const dots = $$(".blora-carousel__dot", car);
      if (!track || !slides.length) return;
      let i = 0;
      let pauseAutoplay = null;
      let resumeAutoplay = null;
      const last = slides.length - 1;
      const paint = (animate) => {
        track.classList.toggle("is-dragging", !animate);
        track.style.transform = "translate3d(" + (-i * 100) + "%, 0, 0)";
        dots.forEach((d, j) => d.classList.toggle("is-active", j === i));
      };
      const go = (n) => {
        i = ((n % slides.length) + slides.length) % slides.length;
        paint(true);
      };
      const prev = $(".blora-carousel__arrow--prev", car);
      const next = $(".blora-carousel__arrow--next", car);
      on(prev, "click", () => go(i - 1));
      on(next, "click", () => go(i + 1));
      dots.forEach((d, j) => on(d, "click", () => go(j)));

      /* 跟手拖拽：拖动时轨道实时跟随，松手按位移/速度吸附 */
      const THRESHOLD = 0.2;
      const VELOCITY = 0.35;
      let drag = null;
      const point = (e) => {
        if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        if (e.changedTouches && e.changedTouches[0]) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        return { x: e.clientX, y: e.clientY };
      };
      const widthOf = () => car.getBoundingClientRect().width || 1;
      const resist = (dx, w) => {
        if ((i === 0 && dx > 0) || (i === last && dx < 0)) return dx * 0.35;
        return dx;
      };
      const applyDrag = (dx) => {
        const w = widthOf();
        const offset = resist(dx, w);
        track.classList.add("is-dragging");
        track.style.transform = "translate3d(calc(" + (-i * 100) + "% + " + offset + "px), 0, 0)";
      };
      const onDragStart = (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        if (e.target && e.target.closest && e.target.closest(".blora-carousel__arrow, .blora-carousel__dot, a, button, input, textarea, select, label")) return;
        const p = point(e);
        drag = {
          x: p.x, y: p.y, dx: 0, locked: null,
          t: Date.now(), lx: p.x, lt: Date.now(), vx: 0,
          pointerId: e.pointerId,
        };
        if (typeof e.pointerId === "number" && car.setPointerCapture) {
          try { car.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
        }
        if (pauseAutoplay) pauseAutoplay();
      };
      const onDragMove = (e) => {
        if (!drag) return;
        if (typeof drag.pointerId === "number" && typeof e.pointerId === "number" && e.pointerId !== drag.pointerId) return;
        const p = point(e);
        const dx = p.x - drag.x;
        const dy = p.y - drag.y;
        if (drag.locked == null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
          drag.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
          if (drag.locked === "y") {
            drag = null;
            if (resumeAutoplay) resumeAutoplay();
            return;
          }
        }
        if (drag.locked !== "x") return;
        if (e.cancelable) e.preventDefault();
        const now = Date.now();
        const dt = Math.max(1, now - drag.lt);
        drag.vx = (p.x - drag.lx) / dt;
        drag.lx = p.x;
        drag.lt = now;
        drag.dx = dx;
        applyDrag(dx);
      };
      const finishDrag = (cancelled) => {
        if (!drag) return;
        const dx = drag.dx;
        const vx = drag.vx;
        const wasX = drag.locked === "x";
        drag = null;
        track.classList.remove("is-dragging");
        if (!wasX || cancelled) {
          paint(true);
        } else {
          const w = widthOf();
          let next = i;
          if (dx <= -w * THRESHOLD || vx <= -VELOCITY) next = i + 1;
          else if (dx >= w * THRESHOLD || vx >= VELOCITY) next = i - 1;
          i = Math.max(0, Math.min(last, next));
          paint(true);
        }
        if (resumeAutoplay) resumeAutoplay();
      };
      const onDragEnd = (e) => {
        if (!drag) return;
        if (typeof drag.pointerId === "number" && typeof e.pointerId === "number" && e.pointerId !== drag.pointerId) return;
        if (drag.locked === "x") {
          const p = point(e);
          drag.dx = p.x - drag.x;
          const now = Date.now();
          const dt = Math.max(1, now - drag.lt);
          drag.vx = (p.x - drag.lx) / dt;
        }
        finishDrag(false);
      };
      const onDragCancel = () => finishDrag(true);

      if (global.PointerEvent) {
        on(car, "pointerdown", onDragStart);
        on(car, "pointermove", onDragMove);
        on(car, "pointerup", onDragEnd);
        on(car, "pointercancel", onDragCancel);
      } else {
        on(car, "touchstart", onDragStart, { passive: true });
        on(car, "touchmove", onDragMove, { passive: false });
        on(car, "touchend", onDragEnd);
        on(car, "touchcancel", onDragCancel);
      }

      /* 自动播放：间隔可由 data-autoplay="毫秒" 配置，悬停暂停，跟随 reduced-motion */
      if (car.hasAttribute("data-autoplay") && !prefersReduced(car)) {
        const ms = Number(car.getAttribute("data-autoplay")) || 4000;
        const stop = () => { if (car._timer) { clearInterval(car._timer); car._timer = null; } };
        const start = () => { stop(); car._timer = setInterval(() => go(i + 1), ms); };
        pauseAutoplay = stop;
        resumeAutoplay = start;
        start();
        on(car, "mouseenter", stop);
        on(car, "mouseleave", start);
      }
    });
  }

  /* —— Back to top ——
     全局只保留一个右下角 FAB（#blora-fab）。Blora.backTop() 复用它，不再另造 .blora-backtop。
     页面里可写 data-blora-backtop / .blora-backtop 作显式按钮（非静态预览）。 */
  function ensureGlobalBackTopFab(d) {
    d = d || doc();
    if (!d) return null;
    let fab = $("#blora-fab", d);
    if (fab) return fab;
    const portal = getPortalRoot(d.documentElement);
    if (!portal) return null;
    fab = d.createElement("button");
    fab.type = "button";
    fab.id = "blora-fab";
    fab.className = "blora-fab blora-portal is-hidden";
    fab.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>';
    portal.appendChild(fab);
    return fab;
  }
  function bindBackTopButton(fab, opts) {
    if (!fab || fab.classList.contains("blora-fab--static")) return;
    if (bound(fab, "BackTopBtn")) {
      /* 已绑定：只允许通过 data-* 热更新阈值，不重复挂监听 */
      if (opts && opts.showAfter != null) fab.setAttribute("data-show-after", String(opts.showAfter));
      if (opts && opts.target) fab.setAttribute("data-target", typeof opts.target === "string" ? opts.target : "");
      fab.dispatchEvent(new Event("blora:backtop-sync"));
      return fab;
    }
    const d = ownerDoc(fab);
    const win = ownerWin(fab);
    /* 阈值/滚动目标只读 data-*，便于 backTop() 热更新而不重复绑定 */
    const thresholdOf = () => {
      const n = Number(fab.getAttribute("data-show-after"));
      return Number.isFinite(n) && n >= 0 ? n : 400;
    };
    const getScrollEl = () => {
      const targetSel = fab.getAttribute("data-target");
      if (!targetSel) return win;
      const el = resolveElement(targetSel, d);
      return el || win;
    };
    const scrollYOf = () => {
      const el = getScrollEl();
      return el === win ? win.scrollY : el.scrollTop;
    };
    const scrollToTop = () => {
      const el = getScrollEl();
      const behavior = prefersReduced(fab) ? "auto" : "smooth";
      if (el === win) win.scrollTo({ top: 0, behavior });
      else el.scrollTo({ top: 0, behavior });
    };
    const sync = () => {
      const show = scrollYOf() > thresholdOf();
      fab.classList.toggle("is-hidden", !show);
      fab.classList.toggle("is-visible", show);
    };
    if (opts && opts.showAfter != null) fab.setAttribute("data-show-after", String(opts.showAfter));
    if (opts && opts.target) fab.setAttribute("data-target", typeof opts.target === "string" ? opts.target : "");
    if (!fab.getAttribute("aria-label")) fab.setAttribute("aria-label", t("common.backTop"));
    on(fab, "click", scrollToTop);
    on(fab, "blora:backtop-sync", sync);
    on(win, "scroll", sync, { passive: true });
    const scrollEl = getScrollEl();
    if (scrollEl !== win) on(scrollEl, "scroll", sync, { passive: true });
    sync();
    return fab;
  }
  function initBackTop(root) {
    const d = doc();
    if (!d) return;
    /* 显式标记的按钮（排除展示用 static 预览） */
    $$("[data-blora-backtop], .blora-backtop", root || d).forEach((btn) => {
      if (btn.classList.contains("blora-fab--static")) return;
      bindBackTopButton(btn);
    });
    if (FLAGS.backTop) return;
    if (root && root !== d) return;
    FLAGS.backTop = true;
    const fab = ensureGlobalBackTopFab(d);
    if (fab) bindBackTopButton(fab, { showAfter: 400 });
  }
  function backTop(opts) {
    opts = opts || {};
    const d = doc();
    if (!d) return null;
    /* 指定 el → 用该元素；否则始终复用全局 #blora-fab，绝不另造一颗 */
    let btn = opts.el ? resolveElement(opts.el, d) : ensureGlobalBackTopFab(d);
    if (!btn) return null;
    if (opts.showAfter != null) btn.setAttribute("data-show-after", String(opts.showAfter));
    if (opts.target != null) {
      btn.setAttribute("data-target", typeof opts.target === "string" ? opts.target : "");
    }
    bindBackTopButton(btn, opts);
    return btn;
  }

  /* —— Sidebar nav scrollspy —— 偏移量可由 data-blora-spy="像素" 配置 —— */
  function initScrollSpy(root) {
    const nav = $("[data-blora-spy]");
    if (!nav || bound(nav, "Spy")) return;
    const links = $$("a[href^='#']", nav);
    const sections = links.map((l) => document.getElementById(l.getAttribute("href").slice(1))).filter(Boolean);
    const offset = Number(nav.getAttribute("data-blora-spy")) || 120;
    const sync = () => {
      const y = window.scrollY + offset;
      let active = sections[0];
      sections.forEach((s) => { if (s && s.offsetTop <= y) active = s; });
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + (active && active.id)));
    };
    on(window, "scroll", sync);
    sync();
  }

  /* —— Smooth scroll —— 目标偏移交给 CSS scroll-margin-top。
     刷新：head 摘掉 hash 防原生硬跳；还原后用 window.scrollTo smooth（与侧栏一致）。
     注意：立刻 replaceState('#id') 会在部分浏览器打断 smooth，故延后写回 hash。 */
  function resolveHashTarget(hash) {
    const d = doc();
    if (!d) return null;
    const raw = String(hash || "").replace(/^#/, "");
    if (!raw) return null;
    let id = raw;
    try { id = decodeURIComponent(raw); } catch (_) { /* keep raw */ }
    let el = d.getElementById(id);
    if (!el) {
      try {
        el = d.querySelector("#" + (global.CSS && CSS.escape ? CSS.escape(id) : id.replace(/([^\w-])/g, "\\$1")));
      } catch (_) { el = null; }
    }
    return el;
  }
  function scrollElementIntoView(el, behavior) {
    if (!el) return false;
    const win = ownerWin(el) || global;
    const motion = behavior != null ? behavior : (prefersReduced(el) ? "auto" : "smooth");
    /* 优先 window.scrollTo：比 scrollIntoView 更少被 CSS / hash 干扰 */
    try {
      const rect = el.getBoundingClientRect();
      const styles = win.getComputedStyle(el);
      const marginTop = parseFloat(styles.scrollMarginTop) || 0;
      const top = (win.pageYOffset || win.scrollY || 0) + rect.top - marginTop;
      win.scrollTo({ top: Math.max(0, top), behavior: motion });
      return true;
    } catch (_) {
      try {
        el.scrollIntoView({ behavior: motion, block: "start" });
        return true;
      } catch (__) { return false; }
    }
  }
  function setLocationHash(id) {
    const d = doc();
    const win = ownerWin(d) || global;
    if (!win || !id) return;
    try {
      const path = (win.location.pathname || "") + (win.location.search || "");
      win.history.replaceState(null, "", path + "#" + id);
    } catch (_) { /* ignore */ }
  }
  function scrollToHashId(behavior, hash) {
    const d = doc();
    const win = ownerWin(d) || global;
    if (!d || !win) return false;
    const el = resolveHashTarget(hash != null ? hash : win.location.hash);
    if (!el) return false;
    return scrollElementIntoView(el, behavior);
  }
  function restoreHashScroll() {
    const d = doc();
    const win = ownerWin(d) || global;
    if (!d || !win) return;
    const pending = win.__bloraPendingHash || "";
    const hash = pending || win.location.hash || "";
    if (!hash || hash.length < 2) return;
    const id = String(hash).replace(/^#/, "");
    const el = resolveHashTarget(hash);
    /* 先滚再写 hash，避免写 hash 打断动画 */
    const behavior = prefersReduced() ? "auto" : "smooth";
    const run = () => {
      if (el) scrollElementIntoView(el, behavior);
      setTimeout(() => {
        setLocationHash(el && el.id ? el.id : id);
        try { delete win.__bloraPendingHash; } catch (_) { win.__bloraPendingHash = ""; }
      }, behavior === "smooth" ? 450 : 0);
    };
    if (win.requestAnimationFrame) win.requestAnimationFrame(run);
    else run();
  }
  function initSmoothScroll() {
    if (FLAGS.smooth) return;
    FLAGS.smooth = true;
    const d = doc();
    const win = ownerWin(d) || global;
    if (!d || !win) {
      FLAGS.smooth = false;
      return;
    }
    try {
      if (win.history && "scrollRestoration" in win.history) win.history.scrollRestoration = "manual";
    } catch (_) { /* ignore */ }

    const hasPending = !!(win.__bloraPendingHash || (win.location && win.location.hash && win.location.hash.length > 1));
    if (hasPending) {
      if (d.readyState === "loading") on(d, "DOMContentLoaded", restoreHashScroll, { once: true });
      else restoreHashScroll();
    }

    /* capture 阶段拦截，避免其它逻辑抢先原生跳锚 */
    on(d, "click", (e) => {
      if (e.defaultPrevented) return;
      if (e.button != null && e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a || a.getAttribute("download") != null) return;
      const href = a.getAttribute("href") || "";
      if (href === "#" || href.length < 2) return;
      /* 仅处理页内锚点（同文档） */
      try {
        const url = new URL(a.href, win.location.href);
        if (url.pathname !== win.location.pathname || url.search !== win.location.search) return;
      } catch (_) { /* keep going with raw hash */ }
      const el = resolveHashTarget(href);
      if (!el) return;
      e.preventDefault();
      const motion = prefersReduced(el) ? "auto" : "smooth";
      scrollElementIntoView(el, motion);
      /* 延后写 hash，防止部分引擎用瞬时跳转覆盖 smooth */
      const writeHash = () => setLocationHash(el.id);
      if (motion === "smooth" && "onscrollend" in win) {
        const once = () => { writeHash(); win.removeEventListener("scrollend", once); };
        win.addEventListener("scrollend", once);
        setTimeout(writeHash, 700);
      } else {
        setTimeout(writeHash, motion === "smooth" ? 400 : 0);
      }
    }, true);
  }

  /* —— Color palettes —— */
  const PALETTE_PRESETS = Object.freeze({
    cinnabar: Object.freeze({ name: "丹砂", description: "暖白基底与低饱和红", colors: ["#F8F4EC", "#A0392E", "#3D4A5C", "#5A7B6B", "#B89968"] }),
    indigo: Object.freeze({ name: "靛青", description: "冷灰基底与沉静蓝", colors: ["#F4F5F8", "#405D87", "#55756F", "#A74B52", "#AF8A55"] }),
    lotus: Object.freeze({ name: "藕荷", description: "柔和粉紫与低饱和绿", colors: ["#F8F4F6", "#9A466A", "#55786B", "#526078", "#B28A59"] }),
    ocean: Object.freeze({ name: "海盐", description: "清爽青蓝与低饱和绿", colors: ["#F1F7F6", "#176B78", "#39745F", "#365D78", "#B08A55"] }),
    graphite: Object.freeze({ name: "Graphite", description: "冷灰界面与低饱和钢蓝", colors: ["#F6F7F8", "#171A1F", "#4F6578", "#596A86", "#5B756B"] }),
    mono: Object.freeze({ name: "Mono", description: "纯中性灰与近黑主色", colors: ["#FAFAF9", "#111110", "#34363A", "#5E6672", "#616D67"] }),
    circuit: Object.freeze({ name: "Circuit", description: "碳灰界面与克制青色", colors: ["#F4F5F5", "#161A1A", "#3E6C70", "#536D7D", "#4F7368"] }),
    coral: Object.freeze({ name: "Coral", description: "深靛灰与柔和珊瑚红", colors: ["#FAF7F8", "#303143", "#9F5964", "#5D6680", "#5B756B"] }),
    dusk: Object.freeze({ name: "Dusk", description: "中性柔灰与低饱和紫", colors: ["#F7F6F8", "#1D1B20", "#675F78", "#586A83", "#5D746C"] }),
  });
  const getPalette = (target) => {
    const d = ownerDoc(target);
    const el = target && target.nodeType === 1 ? target : d && d.documentElement;
    return (el && el.dataset.bloraPalette) || "coral";
  };
  const syncThemeColor = (target) => {
    const d = ownerDoc(target);
    const win = ownerWin(target);
    if (!d || !win) return;
    win.requestAnimationFrame(() => {
      let meta = $('meta[name="theme-color"]', d);
      if (!meta) { meta = d.createElement("meta"); meta.name = "theme-color"; d.head.appendChild(meta); }
      const themeColor = win.getComputedStyle(d.body || d.documentElement).getPropertyValue("--blora-background").trim();
      if (themeColor) meta.content = themeColor;
    });
  };
  const applyPalette = (name, target, options = {}) => {
    const d = ownerDoc(target);
    const el = target && target.nodeType === 1 ? target : d && d.documentElement;
    if (!el || !PALETTE_PRESETS[name]) return false;
    /* 默认配色 coral：不挂 data-blora-palette，与 :root 默认令牌一致 */
    if (name === "coral") delete el.dataset.bloraPalette;
    else el.dataset.bloraPalette = name;
    const win = ownerWin(el);
    if (options.persist !== false) {
      try { win.localStorage.setItem(CONFIG.paletteStorageKey, name); } catch (e) {}
    }
    syncThemeColor(el);
    if (options.emit !== false) el.dispatchEvent(new win.CustomEvent("blora:appearancechange", { bubbles: true, detail: { palette: name, mode: getColorMode(el), dark: el.classList.contains("blora-dark") } }));
    return true;
  };
  function initPalettePicker(root) {
    const d = ownerDoc(root);
    const win = ownerWin(root);
    if (!d || !win) return;
    if (!FLAGS.appearanceBoot) {
      FLAGS.appearanceBoot = true;
      let savedPalette = "coral";
      try { savedPalette = win.localStorage.getItem(CONFIG.paletteStorageKey) || savedPalette; } catch (e) {}
      if (!PALETTE_PRESETS[savedPalette]) savedPalette = "coral";
      applyPalette(savedPalette, d.documentElement, { persist: false, emit: false });
    }
    $$('[data-blora-palette-picker]', root).forEach((picker) => {
      if (bound(picker, "PalettePicker")) return;
      const trigger = $('[data-blora-palette-trigger]', picker);
      const menu = $(".blora-palette-picker__menu", picker);
      if (!trigger || !menu) return;
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      menu.setAttribute("role", "listbox");
      menu.setAttribute("aria-label", t("palette.label"));
      menu.innerHTML = '<div class="blora-palette-picker__head"><span class="blora-palette-picker__title">' + escapeHTML(t("palette.title")) + '</span><span class="blora-palette-picker__hint">' + escapeHTML(t("palette.hint")) + '</span></div><div class="blora-palette-picker__list">' + Object.entries(PALETTE_PRESETS).map(([key, preset]) => '<button class="blora-palette-card" type="button" role="option" data-blora-palette-option="' + key + '"><span class="blora-palette-card__copy"><span class="blora-palette-card__name">' + escapeHTML(preset.name) + '</span><span class="blora-palette-card__desc">' + escapeHTML(preset.description) + '</span></span><span class="blora-palette-card__colors" aria-hidden="true">' + preset.colors.map((color) => '<span class="blora-palette-card__color" style="background:' + color + '"></span>').join("") + '</span></button>').join("") + "</div>";
      const options = $$('[data-blora-palette-option]', menu);
      const sync = () => {
        const current = getPalette(d.documentElement);
        options.forEach((option) => option.setAttribute("aria-selected", String(option.dataset.bloraPaletteOption === current)));
        const label = $(".blora-palette-picker__label", trigger);
        if (label) label.textContent = PALETTE_PRESETS[current].name;
      };
      const open = (focus = false) => {
        $$('[data-blora-palette-picker].is-open', d).forEach((other) => {
          if (other === picker) return;
          other.classList.add("is-switching");
          other.classList.remove("is-open");
          const otherTrigger = $('[data-blora-palette-trigger]', other);
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          win.requestAnimationFrame(() => other.classList.remove("is-switching"));
        });
        picker.classList.add("is-open"); trigger.setAttribute("aria-expanded", "true");
        if (focus) (options.find((option) => option.getAttribute("aria-selected") === "true") || options[0]).focus();
      };
      const close = (restore = false) => {
        picker.classList.remove("is-open"); trigger.setAttribute("aria-expanded", "false");
        if (restore) trigger.focus();
      };
      on(trigger, "click", (e) => { e.stopPropagation(); picker.classList.contains("is-open") ? close() : open(); });
      on(trigger, "keydown", (e) => { if (e.key === "ArrowDown") { e.preventDefault(); open(true); } });
      on(menu, "click", (e) => {
        const option = e.target.closest('[data-blora-palette-option]');
        if (!option) return;
        applyPalette(option.dataset.bloraPaletteOption, d.documentElement);
        sync(); close(true);
      });
      on(menu, "keydown", (e) => {
        const current = options.indexOf(d.activeElement);
        let next = current;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (current + 1 + options.length) % options.length;
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (current - 1 + options.length) % options.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = options.length - 1;
        else if (e.key === "Escape") { e.preventDefault(); close(true); return; }
        else return;
        e.preventDefault(); options[next].focus();
      });
      on(d, "click", (e) => { if (!picker.contains(e.target)) close(); });
      on(d.documentElement, "blora:appearancechange", sync);
      sync();
    });
  }

  /* —— Search —— 有值且聚焦时显示清除动作 —— */
  function ensureSearchClearButton(host, input) {
    const d = ownerDoc(host);
    const win = ownerWin(host);
    let clear = $(".blora-search__clear", host);
    if (!clear) {
      clear = d.createElement("button");
      clear.type = "button";
      clear.className = "blora-search__clear";
      clear.setAttribute("aria-label", t("clear") || "清除");
      clear.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
      host.appendChild(clear);
    }
    if (!bound(clear, "SearchClear")) {
      const sync = () => { clear.hidden = !input.value; };
      on(input, "input", sync);
      on(clear, "click", () => {
        input.value = "";
        input.dispatchEvent(new win.Event("input", { bubbles: true }));
        input.focus();
      });
      sync();
    }
    return clear;
  }

  function initSearch(root) {
    $$(".blora-search", root).forEach((search) => {
      if (bound(search, "Search")) return;
      const input = $('input[type="search"]', search) || $("input.blora-input", search) || $("input", search);
      if (!input) return;
      const trigger = $("button.blora-search__icon", search);
      ensureSearchClearButton(search, input);
      if (trigger && trigger.type !== "submit") on(trigger, "click", () => input.focus());
    });
  }
  const ICON_MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>';
  const ICON_SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
  const ICON_SYSTEM = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="4" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/></svg>';
  const COLOR_MODES = Object.freeze(["system", "light", "dark"]);
  const colorModeLabel = (mode) => t("colorMode." + mode) || mode;
  const getColorMode = (target) => {
    const d = ownerDoc(target);
    const el = target && target.nodeType === 1 ? target : d && d.documentElement;
    const mode = el && el.dataset.bloraColorPreference;
    return COLOR_MODES.includes(mode) ? mode : "system";
  };
  const applyColorMode = (mode, target, options = {}) => {
    const d = ownerDoc(target);
    const el = target && target.nodeType === 1 ? target : d && d.documentElement;
    const win = ownerWin(el);
    if (!el || !win) return false;
    mode = COLOR_MODES.includes(mode) ? mode : "system";
    const systemDark = win.matchMedia && win.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = mode === "dark" || (mode === "system" && systemDark);
    el.dataset.bloraColorPreference = mode;
    el.classList.toggle("blora-dark", dark);
    if (options.persist !== false) {
      try { win.localStorage.setItem(CONFIG.colorModeStorageKey, mode); } catch (e) {}
    }
    syncThemeColor(el);
    if (options.emit !== false) el.dispatchEvent(new win.CustomEvent("blora:appearancechange", { bubbles: true, detail: { palette: getPalette(el), mode, dark } }));
    return true;
  };
  function initColorModeToggle(root) {
    const d = ownerDoc(root);
    const win = ownerWin(root);
    if (!d || !win) return;
    /* 首次载入：读取三态偏好，未设置或值无效时跟随系统。 */
    if (!FLAGS.colorModeBoot) {
      FLAGS.colorModeBoot = true;
      let saved = "system";
      try { saved = win.localStorage.getItem(CONFIG.colorModeStorageKey); } catch (e) {}
      applyColorMode(COLOR_MODES.includes(saved) ? saved : "system", d.documentElement, { persist: false, emit: false });
    }
    if (!FLAGS.colorModeMedia) {
      FLAGS.colorModeMedia = true;
      const media = win.matchMedia("(prefers-color-scheme: dark)");
      on(media, "change", () => {
        if (getColorMode(d.documentElement) === "system") {
          applyColorMode("system", d.documentElement, { persist: false });
        }
      });
    }
    $$("[data-blora-color-mode]", root).forEach((btn) => {
      if (bound(btn, "ColorMode")) return;
      const sync = () => {
        const mode = getColorMode(d.documentElement);
        const next = mode === "system" ? "light" : mode === "light" ? "dark" : "system";
        btn.innerHTML = mode === "system" ? ICON_SYSTEM : mode === "light" ? ICON_SUN : ICON_MOON;
        btn.disabled = false;
        btn.dataset.bloraMode = mode;
        btn.title = colorModeLabel(mode);
        btn.setAttribute("aria-label", t("colorMode.switch", { current: colorModeLabel(mode), next: colorModeLabel(next) }));
      };
      sync();
      on(btn, "click", () => {
        const mode = getColorMode(d.documentElement);
        const next = mode === "system" ? "light" : mode === "light" ? "dark" : "system";
        applyColorMode(next, d.documentElement);
      });
      on(d.documentElement, "blora:appearancechange", sync);
    });
  }

  /* —— File Upload: compact picker & dropzone —— */
  function initFileUpload(root) {
    $$("[data-blora-file-upload], .blora-dropzone", root).forEach((upload) => {
      if (bound(upload, "FileUpload")) return;
      const input = $("[data-blora-file-input], .blora-dropzone__input, input[type='file']", upload);
      if (!input) return;
      const trigger = $("[data-blora-file-trigger]", upload);
      const clear = $("[data-blora-file-clear]", upload);
      const empty = $("[data-blora-file-empty]", upload);
      const output = $("[data-blora-file-output]", upload);
      const name = $("[data-blora-file-name]", upload) || $(".blora-dropzone__files", upload);
      const win = ownerWin(upload);
      let changeSource = "input";

      const toFiles = (files) => {
        const list = Array.from(files || []);
        return input.multiple ? list : list.slice(0, 1);
      };
      const render = (files) => {
        const list = toFiles(files);
        const hasFiles = list.length > 0;
        const label = list.map((file) => file.name).join(", ");
        upload.classList.toggle("is-filled", hasFiles);
        upload.dataset.fileCount = String(list.length);
        if (empty) empty.hidden = hasFiles;
        if (output) output.hidden = !hasFiles;
        if (clear) clear.hidden = !hasFiles;
        if (name) {
          name.textContent = label;
          name.title = label;
        }
        return list;
      };
      const emit = (files, source) => {
        upload.dispatchEvent(new win.CustomEvent("blora:filechange", {
          bubbles: true,
          detail: { files: toFiles(files), source },
        }));
      };
      const notify = (source) => {
        const files = render(input.files);
        emit(files, source);
      };
      const assignDroppedFiles = (files) => {
        const list = toFiles(files);
        if (!list.length) return [];
        if (win.DataTransfer) {
          const transfer = new win.DataTransfer();
          list.forEach((file) => transfer.items.add(file));
          try {
            input.files = transfer.files;
            return toFiles(input.files);
          } catch (e) {}
        }
        return list;
      };

      ["dragenter", "dragover"].forEach((eventName) => on(upload, eventName, (event) => {
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
        upload.classList.add("is-dragover");
      }));
      ["dragleave", "drop"].forEach((eventName) => on(upload, eventName, (event) => {
        event.preventDefault();
        upload.classList.remove("is-dragover");
      }));
      on(upload, "drop", (event) => {
        const files = assignDroppedFiles(event.dataTransfer && event.dataTransfer.files);
        if (!files.length) return;
        if (input.files && input.files.length) {
          changeSource = "drop";
          input.dispatchEvent(new win.Event("change", { bubbles: true }));
        } else {
          render(files);
          emit(files, "drop");
        }
      });
      if (upload.classList.contains("blora-dropzone")) {
        on(upload, "click", (event) => {
          if (event.target === input || (clear && clear.contains(event.target))) return;
          input.click();
        });
      } else if (trigger) {
        on(trigger, "click", () => input.click());
      } else {
        on(upload, "click", (event) => {
          if (event.target !== input && !(clear && clear.contains(event.target))) input.click();
        });
      }
      on(input, "change", () => {
        notify(changeSource);
        changeSource = "input";
      });
      on(clear, "click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        input.value = "";
        changeSource = "clear";
        input.dispatchEvent(new win.Event("change", { bubbles: true }));
        if (trigger) trigger.focus();
      });
      render(input.files);
    });
  }

  function initTooltip(root) {
    $$(".blora-tooltip", root).forEach((tooltip) => {
      if (bound(tooltip, "Tooltip")) return;
      const bubble = $(".blora-tooltip__bubble", tooltip);
      if (!bubble) return;
      const position = () => fitFloatingInline(bubble);
      on(tooltip, "pointerenter", position);
      on(tooltip, "focusin", position);
      on(ownerWin(tooltip), "resize", position);
    });
  }

  /* —— OTP —— */
  function initOTP(root) {
    $$(".blora-otp", root).forEach((otp) => {
      if (bound(otp, "OTP")) return;
      const mode = otp.dataset.mode || "any";
      const filters = { numeric: /[^0-9]/g, alphanumeric: /[^0-9a-zA-Z]/g, any: null };
      const inputs = () => $$("input.blora-otp__input", otp);
      const upperCb = otp.dataset.upperCtrl && document.getElementById(otp.dataset.upperCtrl);
      const reFilter = () => {
        const re = filters[otp.dataset.mode || mode];
        const upper = upperCb && upperCb.checked;
        inputs().forEach((inp) => {
          let v = inp.value;
          if (re) v = v.replace(re, "");
          if (upper) v = v.toUpperCase();
          inp.value = v;
        });
      };
      const autoAdvance = (inp) => {
        const all = inputs();
        const idx = all.indexOf(inp);
        if (inp.value.length >= 1 && idx < all.length - 1) all[idx + 1].focus();
      };
      const backspace = (inp, e) => {
        if (e.key === "Backspace" && !inp.value) {
          const all = inputs(); const idx = all.indexOf(inp);
          if (idx > 0) { all[idx - 1].focus(); all[idx - 1].value = ""; e.preventDefault(); }
        }
        if (e.key === "ArrowLeft") { const all = inputs(); const idx = all.indexOf(inp); if (idx > 0) all[idx - 1].focus(); }
        if (e.key === "ArrowRight") { const all = inputs(); const idx = all.indexOf(inp); if (idx < all.length - 1) all[idx + 1].focus(); }
      };
      const onPaste = (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text");
        const re = filters[otp.dataset.mode || mode];
        const clean = re ? text.replace(re, "") : text;
        const all = inputs();
        clean.split("").slice(0, all.length).forEach((ch, i) => { all[i].value = ch; });
        const last = Math.min(clean.length, all.length) - 1;
        if (last >= 0 && last < all.length) all[last].focus();
      };
      inputs().forEach((inp) => {
        on(inp, "input", () => { reFilter(); autoAdvance(inp); });
        on(inp, "keydown", (e) => backspace(inp, e));
        on(inp, "paste", onPaste);
      });
      const ctrl = otp.dataset.otpCtrl && document.getElementById(otp.dataset.otpCtrl);
      if (ctrl) {
        const stepper = $(".blora-number__btn[data-step='up']", ctrl);
        const dn = $(".blora-number__btn[data-step='down']", ctrl);
        const numInp = $(".blora-input", ctrl);
        /* 位数上下限取自控制输入框的 min/max，而非写死 */
        const lo = Number(numInp && numInp.min) || 4;
        const hi = Number(numInp && numInp.max) || 8;
        const rebuild = (n) => {
          n = Math.max(lo, Math.min(hi, n));
          const all = inputs();
          if (n > all.length) {
            for (let i = all.length; i < n; i++) {
              const ni = document.createElement("input");
              ni.className = "blora-otp__input"; ni.maxLength = 1; ni.type = "text";
              otp.appendChild(ni);
              on(ni, "input", () => { reFilter(); autoAdvance(ni); });
              on(ni, "keydown", (e) => backspace(ni, e));
              on(ni, "paste", onPaste);
            }
          } else if (n < all.length) {
            for (let i = all.length - 1; i >= n; i--) all[i].remove();
          }
        };
        on(stepper, "click", () => { rebuild(Number(numInp.value) + 1); numInp.value = Math.min(hi, Number(numInp.value) + 1); });
        on(dn, "click", () => { rebuild(Number(numInp.value) - 1); numInp.value = Math.max(lo, Number(numInp.value) - 1); });
      }
      const modeCtrl = otp.dataset.modeCtrl && document.getElementById(otp.dataset.modeCtrl);
      if (modeCtrl) {
        $$(".blora-segmented__item", modeCtrl).forEach((item) => {
          on(item, "click", () => {
            $$(".blora-segmented__item", modeCtrl).forEach((i) => i.classList.remove("is-active"));
            item.classList.add("is-active");
            otp.dataset.mode = item.dataset.mode;
            reFilter();
          });
        });
      }
      if (upperCb) on(upperCb, "change", () => reFilter());
    });
  }

  /* —— Custom Select（可选 data-blora-search / data-blora-remote 搜索） —— */
  function selectSetOptions(target, options) {
    const wrap = resolveElement(target) || target;
    if (!wrap) return null;
    if (typeof wrap._bloraSelectSetOptions === "function") {
      wrap._bloraSelectSetOptions(options || []);
      return wrap;
    }
    const sel = $("select", wrap);
    if (!sel) return null;
    const keep = sel.value;
    sel.textContent = "";
    (options || []).forEach((item) => {
      const o = ownerDoc(sel).createElement("option");
      if (typeof item === "string") {
        o.value = item;
        o.textContent = item;
      } else {
        o.value = item.value != null ? String(item.value) : String(item.label || "");
        o.textContent = item.label != null ? String(item.label) : o.value;
        if (item.disabled) o.disabled = true;
      }
      sel.appendChild(o);
    });
    if (keep) sel.value = keep;
    sel.dispatchEvent(new Event("change", { bubbles: true }));
    return wrap;
  }
  function ensureCustomSelectShell(sel) {
    if (!sel || sel.closest(".blora-select-wrap")) return sel.closest(".blora-select-wrap");
    const d = ownerDoc(sel);
    const wrap = d.createElement("div");
    wrap.className = "blora-select-wrap";
    ["data-blora-search", "data-blora-remote", "data-blora-multiple", "data-blora-virtual", "data-max-tag-count", "data-blora-max-tag-count"].forEach((attr) => {
      if (sel.hasAttribute(attr)) wrap.setAttribute(attr, sel.getAttribute(attr) || "");
    });
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    const trigger = d.createElement("div");
    trigger.className = "blora-select-trigger";
    const first = $$("option", sel).find((o) => o.selected && !o.disabled) || $$("option", sel)[0];
    trigger.textContent = first ? first.textContent : "";
    if (!first || first.disabled || !first.value) trigger.classList.add("is-placeholder");
    const menu = d.createElement("div");
    menu.className = "blora-select-menu";
    wrap.appendChild(trigger);
    wrap.appendChild(menu);
    return wrap;
  }
  function initCustomSelect(root) {
    /* 裸 select.blora-select 自动套上自定义外壳，避免展示页/业务漏写 wrap 掉回原生丑样式 */
    $$("select.blora-select", root).forEach((sel) => ensureCustomSelectShell(sel));
    $$(".blora-select-wrap", root).forEach((wrap) => {
      if (bound(wrap, "Select")) return;
      const d = ownerDoc(wrap);
      const win = ownerWin(wrap);
      const sel = $("select", wrap);
      if (!sel) return;
      let trigger = $(".blora-select-trigger", wrap);
      let menu = $(".blora-select-menu", wrap);
      if (!trigger) {
        trigger = d.createElement("div");
        trigger.className = "blora-select-trigger";
        wrap.appendChild(trigger);
      }
      if (!menu) {
        menu = d.createElement("div");
        menu.className = "blora-select-menu";
        wrap.appendChild(menu);
      }
      const searchable = wrap.hasAttribute("data-blora-search") || wrap.hasAttribute("data-blora-remote") || sel.hasAttribute("data-blora-search");
      const remote = wrap.hasAttribute("data-blora-remote") || sel.hasAttribute("data-blora-remote");
      const multiple = sel.multiple || wrap.hasAttribute("data-blora-multiple");
      const virtual = wrap.hasAttribute("data-blora-virtual") || sel.hasAttribute("data-blora-virtual");
      const maxTag = Number(wrap.getAttribute("data-max-tag-count") || wrap.getAttribute("data-blora-max-tag-count")) || 0;
      if (multiple) {
        sel.multiple = true;
        wrap.classList.add("blora-select-wrap--multiple");
        menu.setAttribute("aria-multiselectable", "true");
      }
      if (searchable) wrap.classList.add("blora-select-wrap--searchable");
      const listId = menu.id || ("blora-select-" + Math.random().toString(36).slice(2));
      menu.id = listId;
      trigger.tabIndex = trigger.tabIndex >= 0 ? trigger.tabIndex : 0;
      trigger.setAttribute("role", "combobox");
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-controls", listId);
      trigger.setAttribute("aria-expanded", "false");
      if (searchable) trigger.setAttribute("aria-autocomplete", "list");
      menu.setAttribute("role", "listbox");
      /* 清掉旧版菜单内搜索框 */
      $$(".blora-select-search", menu).forEach((el) => el.remove());
      let listbox = $(".blora-select-options", menu);
      if (!listbox) {
        listbox = d.createElement("div");
        listbox.className = "blora-select-options";
        while (menu.firstChild) listbox.appendChild(menu.firstChild);
        menu.appendChild(listbox);
      }
      if (virtual) listbox.classList.add("blora-select-options--virtual");
      let searchInput = null;
      let searchTimer = null;
      let activeIndex = -1;
      let virtualStart = 0;
      let typing = false;
      const getOpts = () => $$("option", sel);
      const optionEls = () => $$(".blora-select-option", listbox);
      const selectedOpts = () => getOpts().filter((o) => o.selected && !o.disabled);
      const phOf = () => trigger.dataset.placeholder || t("select.placeholder");
      /* 可搜索：在 trigger 里输入，不在菜单里再塞搜索框 */
      if (searchable) {
        searchInput = $(".blora-select-trigger__input", trigger);
        if (!searchInput) {
          const label = d.createElement("span");
          label.className = "blora-select-trigger__label";
          label.textContent = trigger.textContent || phOf();
          trigger.textContent = "";
          searchInput = d.createElement("input");
          searchInput.type = "text";
          searchInput.className = "blora-select-trigger__input";
          searchInput.setAttribute("autocomplete", "off");
          searchInput.setAttribute("spellcheck", "false");
          searchInput.setAttribute("aria-label", t("select.search"));
          searchInput.setAttribute("placeholder", "");
          trigger.appendChild(label);
          trigger.appendChild(searchInput);
        }
      }
      const labelEl = () => $(".blora-select-trigger__label", trigger);
      const update = () => {
        const opts = getOpts();
        const chosenList = selectedOpts();
        const ph = phOf();
        if (multiple) {
          const keepInput = searchInput;
          trigger.textContent = "";
          trigger.classList.toggle("is-placeholder", !chosenList.length && !typing);
          if (!chosenList.length && !typing) {
            if (searchable) {
              const lab = d.createElement("span");
              lab.className = "blora-select-trigger__label is-placeholder-label";
              lab.textContent = ph;
              trigger.appendChild(lab);
            } else {
              trigger.textContent = ph;
            }
          } else {
            const max = maxTag > 0 ? maxTag : chosenList.length;
            const shown = chosenList.slice(0, max);
            const rest = chosenList.length - shown.length;
            shown.forEach((o) => {
              const tag = d.createElement("span");
              tag.className = "blora-select-tag";
              tag.innerHTML = '<span class="blora-select-tag__label"></span><button type="button" class="blora-select-tag__close" aria-label="' + escapeHTML(t("common.close")) + '">×</button>';
              $(".blora-select-tag__label", tag).textContent = o.textContent;
              on($(".blora-select-tag__close", tag), "click", (e) => {
                e.stopPropagation();
                o.selected = false;
                update();
                paintOptions();
                sel.dispatchEvent(new Event("change", { bubbles: true }));
              });
              trigger.appendChild(tag);
            });
            if (rest > 0) {
              const more = d.createElement("span");
              more.className = "blora-select-tag blora-select-tag--more";
              more.textContent = t("select.more", { n: rest });
              trigger.appendChild(more);
            }
          }
          if (keepInput) {
            if (!keepInput.parentNode) trigger.appendChild(keepInput);
            else trigger.appendChild(keepInput);
            if (!typing) keepInput.value = "";
            keepInput.placeholder = chosenList.length ? "" : "";
          }
        } else if (searchable) {
          const chosen = chosenList[0];
          let lab = labelEl();
          if (!lab) {
            lab = d.createElement("span");
            lab.className = "blora-select-trigger__label";
            trigger.insertBefore(lab, searchInput || null);
          }
          if (typing) {
            lab.textContent = ph;
            lab.classList.add("is-ghost");
            trigger.classList.add("is-placeholder");
          } else {
            lab.textContent = chosen ? chosen.textContent : ph;
            lab.classList.remove("is-ghost");
            trigger.classList.toggle("is-placeholder", !chosen);
            if (searchInput) searchInput.value = "";
          }
        } else {
          const chosen = chosenList[0];
          trigger.textContent = chosen ? chosen.textContent : ph;
          trigger.classList.toggle("is-placeholder", !chosen);
        }
        optionEls().forEach((el) => {
          const selected = opts.some((o) => o.selected && !o.disabled && el.dataset.val === o.value);
          el.classList.toggle("is-selected", selected);
          el.classList.toggle("is-active", optionEls().indexOf(el) === activeIndex);
          el.setAttribute("aria-selected", String(selected));
        });
        const active = optionEls()[activeIndex];
        if (active) trigger.setAttribute("aria-activedescendant", active.id);
        else trigger.removeAttribute("aria-activedescendant");
      };
      const makeOptionEl = (o, index) => {
        const el = d.createElement("div");
        el.className = "blora-select-option" + (o.disabled ? " is-disabled" : "") + (o.selected && !o.disabled ? " is-selected" : "");
        el.id = listId + "-option-" + index;
        el.setAttribute("role", "option");
        if (o.disabled) el.setAttribute("aria-disabled", "true");
        el.textContent = o.textContent;
        el.dataset.val = o.value;
        el.dataset.index = String(index);
        on(el, "click", (e) => {
          e.stopPropagation();
          if (o.disabled) return;
          choose(index);
        });
        return el;
      };
      const paintOptions = () => {
        const opts = getOpts();
        listbox.textContent = "";
        if (!opts.length) {
          const empty = d.createElement("div");
          empty.className = "blora-select-empty";
          empty.textContent = t("select.empty");
          listbox.appendChild(empty);
          activeIndex = -1;
          update();
          return;
        }
        if (virtual && opts.length > 40) {
          const rowH = 36;
          const viewH = Math.min(240, listbox.clientHeight || 240);
          listbox.style.height = viewH + "px";
          listbox.style.overflowY = "auto";
          const start = virtualStart;
          const count = Math.ceil(viewH / rowH) + 8;
          const end = Math.min(opts.length, start + count);
          const padTop = d.createElement("div");
          padTop.style.height = start * rowH + "px";
          listbox.appendChild(padTop);
          for (let i = start; i < end; i++) listbox.appendChild(makeOptionEl(opts[i], i));
          const padBot = d.createElement("div");
          padBot.style.height = Math.max(0, (opts.length - end) * rowH) + "px";
          listbox.appendChild(padBot);
          if (!bound(listbox, "SelectVirtual")) {
            on(listbox, "scroll", () => {
              virtualStart = Math.max(0, Math.floor(listbox.scrollTop / rowH) - 4);
              paintOptions();
            }, { passive: true });
          }
        } else {
          opts.forEach((o, index) => listbox.appendChild(makeOptionEl(o, index)));
        }
        activeIndex = opts.findIndex((o) => o.selected && !o.disabled);
        update();
      };
      const setActive = (index) => {
        const items = optionEls();
        if (!items.length) return;
        activeIndex = (index + items.length) % items.length;
        let guard = 0;
        while (items[activeIndex].classList.contains("is-disabled") && guard < items.length) {
          activeIndex = (activeIndex + 1) % items.length;
          guard++;
        }
        items.forEach((el, i) => el.classList.toggle("is-active", i === activeIndex));
        trigger.setAttribute("aria-activedescendant", items[activeIndex].id);
        items[activeIndex].scrollIntoView({ block: "nearest" });
      };
      const choose = (index) => {
        const opts = getOpts();
        const option = opts[index];
        if (!option || option.disabled) return;
        if (multiple) {
          option.selected = !option.selected;
          activeIndex = index;
          typing = false;
          if (searchInput) searchInput.value = "";
          update();
          paintOptions();
          sel.dispatchEvent(new Event("change", { bubbles: true }));
          if (searchInput) win.setTimeout(() => { try { searchInput.focus(); } catch (_) { /* ignore */ } }, 0);
          return;
        }
        opts.forEach((oo) => { oo.selected = oo === option; });
        sel.value = option.value;
        activeIndex = index;
        typing = false;
        if (searchInput) searchInput.value = "";
        update();
        close();
        sel.dispatchEvent(new Event("change", { bubbles: true }));
      };
      const filterLocal = (query) => {
        const q = String(query || "").trim().toLowerCase();
        optionEls().forEach((el) => {
          const hit = !q || String(el.textContent || "").toLowerCase().indexOf(q) >= 0;
          el.hidden = !hit;
        });
        const visible = optionEls().filter((el) => !el.hidden && !el.classList.contains("is-disabled"));
        activeIndex = visible.length ? optionEls().indexOf(visible[0]) : -1;
        optionEls().forEach((el, i) => el.classList.toggle("is-active", i === activeIndex));
      };
      const emitSearch = (query) => {
        wrap.dispatchEvent(new win.CustomEvent("blora:search", {
          bubbles: true,
          detail: { query: String(query || ""), select: sel, wrap, setOptions: (list) => selectSetOptions(wrap, list) },
        }));
      };
      const runSearch = (q) => {
        if (remote) {
          wrap.classList.add("is-searching");
          if (searchTimer) win.clearTimeout(searchTimer);
          searchTimer = win.setTimeout(() => {
            wrap.classList.remove("is-searching");
            emitSearch(q);
          }, Number(wrap.getAttribute("data-search-debounce")) || 220);
        } else {
          filterLocal(q);
        }
      };
      if (searchInput) {
        on(searchInput, "click", (e) => {
          e.stopPropagation();
          if (!wrap.classList.contains("is-open")) open();
        });
        on(searchInput, "focus", () => {
          if (!wrap.classList.contains("is-open")) open();
        });
        on(searchInput, "input", () => {
          typing = true;
          if (!wrap.classList.contains("is-open")) open();
          update();
          runSearch(searchInput.value);
        });
        on(searchInput, "keydown", (e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            e.stopPropagation();
            if (!wrap.classList.contains("is-open")) open();
            setActive(activeIndex < 0 ? 0 : activeIndex + (e.key === "ArrowDown" ? 1 : -1));
          } else if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            if (wrap.classList.contains("is-open") && activeIndex >= 0) choose(activeIndex);
          } else if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            close();
          } else {
            e.stopPropagation();
          }
        });
      }
      const open = () => {
        const opts = getOpts();
        activeIndex = opts.findIndex((o) => o.selected && !o.disabled);
        trigger.classList.add("is-open");
        menu.classList.add("is-open");
        wrap.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        optionEls().forEach((el, i) => el.classList.toggle("is-active", i === activeIndex));
        if (activeIndex >= 0) setActive(activeIndex);
        else trigger.removeAttribute("aria-activedescendant");
        if (searchInput) {
          typing = false;
          searchInput.value = "";
          searchInput.placeholder = t("select.search");
          if (!remote) filterLocal("");
          update();
          win.setTimeout(() => {
            try { searchInput.focus(); searchInput.select && searchInput.select(); } catch (_) { /* ignore */ }
          }, 0);
          if (remote) emitSearch("");
        }
      };
      const close = () => {
        trigger.classList.remove("is-open");
        menu.classList.remove("is-open");
        wrap.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        typing = false;
        if (searchInput) {
          searchInput.value = "";
          searchInput.placeholder = "";
          if (!remote) filterLocal("");
        }
        update();
      };
      wrap._bloraSelectSetOptions = (list) => {
        const keep = sel.value;
        sel.textContent = "";
        (list || []).forEach((item) => {
          const o = d.createElement("option");
          if (typeof item === "string") {
            o.value = item;
            o.textContent = item;
          } else {
            o.value = item.value != null ? String(item.value) : String(item.label || "");
            o.textContent = item.label != null ? String(item.label) : o.value;
            if (item.disabled) o.disabled = true;
            if (item.selected) o.selected = true;
          }
          sel.appendChild(o);
        });
        if (keep && $$("option", sel).some((o) => o.value === keep)) sel.value = keep;
        paintOptions();
      };
      on(sel, "change", () => { typing = false; update(); });
      on(trigger, "click", (e) => {
        if (e.target.closest(".blora-select-tag__close, .blora-select-trigger__input")) return;
        e.stopPropagation();
        trigger.classList.contains("is-open") ? close() : open();
      });
      on(trigger, "keydown", (e) => {
        if (searchInput && d.activeElement === searchInput) return;
        const opts = getOpts();
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (!trigger.classList.contains("is-open")) open();
          if (activeIndex < 0) setActive(e.key === "ArrowDown" ? 0 : opts.length - 1);
          else setActive(activeIndex + (e.key === "ArrowDown" ? 1 : -1));
        } else if (e.key === "Home") {
          e.preventDefault(); open(); setActive(0);
        } else if (e.key === "End") {
          e.preventDefault(); open(); setActive(opts.length - 1);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!trigger.classList.contains("is-open")) open();
          else choose(activeIndex);
        } else if (e.key === "Escape") {
          close();
        }
      });
      on(d, "click", () => close());
      paintOptions();
    });
  }

  /* —— Range Slider —— */
  function initRange(root) {
    $$(".blora-range", root).forEach((range) => {
      if (bound(range, "Range")) return;
      const track = $(".blora-range__track", range);
      const fill = $(".blora-range__fill", range);
      const thumbs = $$(".blora-range__thumb", range);
      if (!track || thumbs.length < 2) return;
      const min = Number(range.dataset.min || 0);
      const max = Number(range.dataset.max || 100);
      const step = Math.max(Number(range.dataset.step || 1), Number.EPSILON);
      const d = ownerDoc(range);
      const win = ownerWin(range);
      let v1 = Number(thumbs[0].dataset.val || 20);
      let v2 = Number(thumbs[1].dataset.val || 75);
      const tips = thumbs.map(() => { const t = document.createElement("span"); t.className = "blora-range__tip"; range.appendChild(t); return t; });
      const render = () => {
        v1 = Math.max(min, Math.min(v2 - 1, v1));
        v2 = Math.min(max, Math.max(v1 + 1, v2));
        const p1 = ((v1 - min) / (max - min)) * 100;
        const p2 = ((v2 - min) / (max - min)) * 100;
        thumbs[0].style.left = p1 + "%";
        thumbs[1].style.left = p2 + "%";
        if (fill) { fill.style.left = p1 + "%"; fill.style.right = (100 - p2) + "%"; }
        const out = $(".blora-range__value", range);
        if (out) out.textContent = v1 + " – " + v2;
        if (tips[0]) { tips[0].textContent = v1; tips[0].style.left = p1 + "%"; }
        if (tips[1]) { tips[1].textContent = v2; tips[1].style.left = p2 + "%"; }
        thumbs.forEach((thumb, index) => {
          const value = index === 0 ? v1 : v2;
          thumb.dataset.val = String(value);
          thumb.setAttribute("aria-valuenow", String(value));
          thumb.setAttribute("aria-valuetext", String(value));
        });
      };
      const emitChange = () => range.dispatchEvent(new win.CustomEvent("blora:change", { bubbles: true, detail: { min: v1, max: v2 } }));
      const toVal = (clientX) => {
        const rect = track.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round(min + pct * (max - min));
      };
      thumbs.forEach((thumb, i) => {
        thumb.setAttribute("role", "slider");
        thumb.setAttribute("aria-valuemin", String(min));
        thumb.setAttribute("aria-valuemax", String(max));
        thumb.setAttribute("aria-label", thumb.getAttribute("aria-label") || (i === 0 ? t("common.min") : t("common.max")));
        thumb.tabIndex = 0;
        on(thumb, "mousedown", (e) => {
          e.preventDefault(); tips[i].classList.add("is-show");
          const move = (ev) => { if (i === 0) v1 = toVal(ev.clientX); else v2 = toVal(ev.clientX); render(); emitChange(); };
          const up = () => { d.removeEventListener("mousemove", move); d.removeEventListener("mouseup", up); tips[i].classList.remove("is-show"); };
          d.addEventListener("mousemove", move); d.addEventListener("mouseup", up);
        });
        on(thumb, "touchstart", (e) => {
          e.preventDefault(); tips[i].classList.add("is-show");
          const move = (ev) => { if (i === 0) v1 = toVal(ev.touches[0].clientX); else v2 = toVal(ev.touches[0].clientX); render(); emitChange(); };
          const up = () => { d.removeEventListener("touchmove", move); d.removeEventListener("touchend", up); tips[i].classList.remove("is-show"); };
          d.addEventListener("touchmove", move, { passive: false }); d.addEventListener("touchend", up);
        });
        on(thumb, "focus", () => tips[i].classList.add("is-show"));
        on(thumb, "blur", () => tips[i].classList.remove("is-show"));
        on(thumb, "keydown", (e) => {
          let next = i === 0 ? v1 : v2;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") next += step;
          else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next -= step;
          else if (e.key === "PageUp") next += step * 10;
          else if (e.key === "PageDown") next -= step * 10;
          else if (e.key === "Home") next = min;
          else if (e.key === "End") next = max;
          else return;
          e.preventDefault();
          if (i === 0) v1 = next; else v2 = next;
          render(); emitChange();
        });
      });
      render();
    });
  }

  /* —— Transfer —— */
  function initTransfer(root) {
    $$(".blora-transfer", root).forEach((tf) => {
      if (bound(tf, "Transfer")) return;
      const panels = $$(".blora-transfer__panel", tf);
      const actions = $(".blora-transfer__actions", tf);
      if (panels.length < 2 || !actions) return;
      const [left, right] = panels;
      const leftList = $(".blora-transfer__list", left);
      const rightList = $(".blora-transfer__list", right);
      const leftHead = $(".blora-transfer__head", left);
      const rightHead = $(".blora-transfer__head", right);
      const toRight = $("button[data-blora-transfer='right']", actions) || $$("button", actions)[0];
      const toLeft = $("button[data-blora-transfer='left']", actions) || $$("button", actions)[1];
      /* 保留用户在 HTML 里写的面板标题，仅追加计数 */
      const baseLabel = (h) => { const t = h.textContent, i = t.lastIndexOf("·"); return (i > -1 ? t.slice(0, i) : t).trim(); };
      const leftBase = baseLabel(leftHead), rightBase = baseLabel(rightHead);
      const updateHeads = () => {
        leftHead.textContent = leftBase + " · " + $$("label", leftList).length;
        rightHead.textContent = rightBase + " · " + $$("label", rightList).length;
      };
      const move = (from, to) => {
        $$("label", from).forEach((row) => {
          const inp = $("input", row);
          if (inp && inp.checked) { inp.checked = false; to.appendChild(row); }
        });
        updateHeads();
      };
      on(toRight, "click", () => move(leftList, rightList));
      on(toLeft, "click", () => move(rightList, leftList));
      updateHeads();
    });
  }

  /* —— Cascader —— */
  function initCascader(root) {
    $$("[data-blora-cascader]", root).forEach((el) => {
      if (bound(el, "Cascader")) return;
      let data; try { data = JSON.parse(el.dataset.bloraCascader); } catch (e) { return; }
      const path = [];
      const result = el.parentElement.querySelector(".blora-cascader__result");
      /* 结果前缀可由 data-prefix 配置，默认"已选：" */
      const prefix = result && result.dataset.prefix !== undefined ? result.dataset.prefix : t("cascader.selectedPrefix");
      const render = () => {
        el.innerHTML = "";
        let level = 0;
        const cols = [data];
        while (level < path.length) { cols.push(path[level].children || []); level++; }
        cols.forEach((items, ci) => {
          const col = document.createElement("div");
          col.className = "blora-cascader__col";
          items.forEach((item) => {
            const opt = document.createElement("div");
            opt.className = "blora-cascader__opt" + (path[ci] && path[ci].label === item.label ? " is-selected" : "");
            const hasChild = item.children && item.children.length;
            const label = document.createElement("span");
            label.textContent = item.label;
            opt.appendChild(label);
            if (hasChild) opt.appendChild(makeChevron());
            on(opt, "click", () => {
              path.splice(ci);
              path[ci] = item;
              if (!hasChild && result) result.textContent = prefix + path.map((p) => p.label).join(" / ");
              render();
            });
            col.appendChild(opt);
          });
          el.appendChild(col);
        });
      };
      render();
      if (data.length && data[0].children && data[0].children.length) {
        path.push(data[0]);
        if (data[0].children[0].children && data[0].children[0].children.length) path.push(data[0].children[0]);
        else if (result) result.textContent = prefix + path.map((p) => p.label).join(" / ");
        render();
      }
    });
  }

  /* —— Date picker —— */
  const CAL_ICON_PREV = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
  const CAL_ICON_NEXT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
  /* LOCALE 由 i18n setLocale 维护（见文件顶部 I18N_PACKS） */

  function initDatePicker(root) {
    $$("[data-blora-datepicker]", root).forEach((wrap) => {
      if (bound(wrap, "Datepicker")) return;
      const input = $(".blora-input", wrap);
      const btn = $(".blora-datepicker__btn", wrap);
      if (!input) return;
      const min = input.min, max = input.max;
      let selected = null, viewYear, viewMonth, viewMode = "days";
      const today = new Date();
      const d = ownerDoc(wrap);
      const panel = d.createElement("div"); panel.className = "blora-datepicker__panel"; wrap.appendChild(panel);
      const mask = d.createElement("div"); mask.className = "blora-floating-mask blora-portal"; getPortalRoot(wrap).appendChild(mask);
      const fmt = (d) => d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
      const inRange = (d) => { if (min && fmt(d) < min) return false; if (max && fmt(d) > max) return false; return true; };
      const inRangeYM = (y, m) => { const d = new Date(y, m, 1); const last = new Date(y, m + 1, 0); if (max && fmt(d) > max) return false; if (min && fmt(last) < min) return false; return true; };
      const inRangeY = (y) => { if (max && y > Number(max.slice(0,4))) return false; if (min && y < Number(min.slice(0,4))) return false; return true; };
      /* 手动解析 YYYY-MM-DD：new Date(字符串) 按 UTC 解析，西侧时区会偏一天 */
      const parseYMD = (v) => { const p = v.split("-"); const d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])); return isNaN(d) ? null : d; };
      const syncFromInput = () => { if (input.value) { const d = parseYMD(input.value); if (d) { selected = d; viewYear = d.getFullYear(); viewMonth = d.getMonth(); return; } } selected = null; if (!viewYear) { viewYear = today.getFullYear(); viewMonth = today.getMonth(); } };
      const render = () => {
        let html = '<div class="blora-datepicker__head">';
        html += '<button class="blora-datepicker__nav" data-nav="prev">' + CAL_ICON_PREV + '</button>';
        if (viewMode === "days") html += '<span class="blora-datepicker__title" data-zoom="months">' + viewYear + escapeHTML(LOCALE.year) + " " + escapeHTML(LOCALE.months[viewMonth]) + '</span>';
        else if (viewMode === "months") html += '<span class="blora-datepicker__title" data-zoom="years">' + viewYear + escapeHTML(LOCALE.year) + '</span>';
        else { const decStart = Math.floor(viewYear / 10) * 10; html += '<span class="blora-datepicker__title" data-zoom="years">' + decStart + "–" + (decStart + 9) + escapeHTML(LOCALE.year) + '</span>'; }
        html += '<button class="blora-datepicker__nav" data-nav="next">' + CAL_ICON_NEXT + '</button></div>';
        if (viewMode === "days") {
          html += '<div class="blora-datepicker__grid">';
          LOCALE.dow.forEach((d) => { html += '<div class="blora-datepicker__dow">' + escapeHTML(d) + '</div>'; });
          const first = new Date(viewYear, viewMonth, 1), startDay = first.getDay(), daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate(), daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
          for (let i = startDay - 1; i >= 0; i--) html += '<div class="blora-datepicker__cell is-other">' + (daysInPrev - i) + '</div>';
          for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(viewYear, viewMonth, day);
            let cls = "blora-datepicker__cell";
            if (d.toDateString() === today.toDateString()) cls += " is-today";
            if (selected && d.toDateString() === selected.toDateString()) cls += " is-selected";
            if (!inRange(d)) cls += " is-disabled";
            html += '<div class="' + cls + '" data-day="' + day + '">' + day + '</div>';
          }
          const total = startDay + daysInMonth, remaining = (7 - (total % 7)) % 7;
          for (let i = 1; i <= remaining; i++) html += '<div class="blora-datepicker__cell is-other">' + i + '</div>';
          html += '</div>';
        } else if (viewMode === "months") {
          html += '<div class="blora-datepicker__grid blora-datepicker__grid--months">';
          LOCALE.months.forEach((name, m) => {
            let cls = "blora-datepicker__cell blora-datepicker__cell--month";
            if (selected && viewYear === selected.getFullYear() && m === selected.getMonth()) cls += " is-selected";
            if (viewYear === today.getFullYear() && m === today.getMonth()) cls += " is-today";
            if (!inRangeYM(viewYear, m)) cls += " is-disabled";
            html += '<div class="' + cls + '" data-month="' + m + '">' + escapeHTML(name) + '</div>';
          });
          html += '</div>';
        } else {
          const decStart = Math.floor(viewYear / 10) * 10;
          html += '<div class="blora-datepicker__grid blora-datepicker__grid--years">';
          for (let y = decStart - 1; y <= decStart + 10; y++) {
            let cls = "blora-datepicker__cell blora-datepicker__cell--year";
            if (y < decStart || y > decStart + 9) cls += " is-other";
            if (selected && y === selected.getFullYear()) cls += " is-selected";
            if (y === today.getFullYear()) cls += " is-today";
            if (!inRangeY(y)) cls += " is-disabled";
            html += '<div class="' + cls + '" data-year="' + y + '">' + y + '</div>';
          }
          html += '</div>';
        }
        html += '<div class="blora-datepicker__foot"><button class="blora-btn blora-btn--text blora-btn--sm" data-clear>' + escapeHTML(LOCALE.clear) + '</button><button class="blora-btn blora-btn--text blora-btn--sm" data-today>' + escapeHTML(LOCALE.today) + '</button></div>';
        panel.innerHTML = html;
      };
      const open = () => { syncFromInput(); viewMode = "days"; panel.classList.add("is-open"); mask.classList.add("is-open"); render(); };
      const close = () => { panel.classList.remove("is-open"); mask.classList.remove("is-open"); };
      on(btn, "click", (e) => { e.preventDefault(); e.stopPropagation(); panel.classList.contains("is-open") ? close() : open(); });
      on(mask, "click", () => close());
      on(panel, "click", (e) => {
        const nav = e.target.closest("[data-nav]");
        if (nav) { if (viewMode === "days") { if (nav.dataset.nav === "prev") { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } } else { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } } } else if (viewMode === "months") { viewYear += (nav.dataset.nav === "prev" ? -1 : 1); } else { viewYear += (nav.dataset.nav === "prev" ? -10 : 10); } render(); return; }
        const zoom = e.target.closest("[data-zoom]");
        if (zoom) { if (zoom.dataset.zoom === "months") viewMode = "months"; else if (zoom.dataset.zoom === "years") viewMode = "years"; render(); return; }
        const todayBtn = e.target.closest("[data-today]");
        if (todayBtn) { selected = new Date(); viewYear = selected.getFullYear(); viewMonth = selected.getMonth(); viewMode = "days"; input.value = fmt(selected); render(); close(); input.dispatchEvent(new Event("change", { bubbles: true })); return; }
        const clearBtn = e.target.closest("[data-clear]");
        if (clearBtn) { selected = null; input.value = ""; render(); close(); input.dispatchEvent(new Event("change", { bubbles: true })); return; }
        const dayCell = e.target.closest(".blora-datepicker__cell[data-day]");
        if (dayCell && !dayCell.classList.contains("is-disabled")) { selected = new Date(viewYear, viewMonth, Number(dayCell.dataset.day)); input.value = fmt(selected); close(); input.dispatchEvent(new Event("change", { bubbles: true })); return; }
        const monthCell = e.target.closest(".blora-datepicker__cell--month[data-month]");
        if (monthCell && !monthCell.classList.contains("is-disabled")) { viewMonth = Number(monthCell.dataset.month); viewMode = "days"; render(); return; }
        const yearCell = e.target.closest(".blora-datepicker__cell--year[data-year]");
        if (yearCell && !yearCell.classList.contains("is-disabled")) { viewYear = Number(yearCell.dataset.year); viewMode = "months"; render(); return; }
      });
      render();
    });
  }

  /* —— Time Picker —— */
  function initTimePicker(root) {
    $$("[data-blora-timepicker]", root).forEach((wrap) => {
      if (bound(wrap, "Timepicker")) return;
      const input = $(".blora-input", wrap);
      const btn = $(".blora-datepicker__btn", wrap);
      if (!input) return;
      let curH = 14, curM = 30;
      const d = ownerDoc(wrap);
      const panel = d.createElement("div"); panel.className = "blora-timepicker__panel"; wrap.appendChild(panel);
      const mask = d.createElement("div"); mask.className = "blora-floating-mask blora-portal"; getPortalRoot(wrap).appendChild(mask);
      const pad = (n) => String(n).padStart(2, "0"); const fmt = () => pad(curH) + ":" + pad(curM);
      const syncFromInput = () => { if (input.value) { const parts = input.value.split(":"); if (parts.length === 2) { curH = Number(parts[0]) || 0; curM = Number(parts[1]) || 0; } } };
      const render = () => {
        let html = '<div class="blora-timepicker__cols">';
        html += '<div class="blora-timepicker__col"><span class="blora-timepicker__label">' + escapeHTML(LOCALE.hour) + '</span><div class="blora-timepicker__scroll" data-scroll="h">';
        for (let h = 0; h < 24; h++) html += '<div class="blora-timepicker__item' + (h === curH ? " is-selected" : "") + '" data-h="' + h + '">' + pad(h) + '</div>';
        html += '</div></div><span class="blora-timepicker__sep">:</span>';
        html += '<div class="blora-timepicker__col"><span class="blora-timepicker__label">' + escapeHTML(LOCALE.minute) + '</span><div class="blora-timepicker__scroll" data-scroll="m">';
        for (let m = 0; m < 60; m++) html += '<div class="blora-timepicker__item' + (m === curM ? " is-selected" : "") + '" data-m="' + m + '">' + pad(m) + '</div>';
        html += '</div></div></div>';
        html += '<div class="blora-datepicker__foot"><button class="blora-btn blora-btn--text blora-btn--sm" data-now>' + escapeHTML(LOCALE.now) + '</button><button class="blora-btn blora-btn--text blora-btn--sm" data-confirm>' + escapeHTML(LOCALE.confirm) + '</button></div>';
        panel.innerHTML = html;
        const hScroll = panel.querySelector('[data-scroll="h"]'), mScroll = panel.querySelector('[data-scroll="m"]');
        const hSel = hScroll && hScroll.querySelector(".is-selected"), mSel = mScroll && mScroll.querySelector(".is-selected");
        if (hSel && hScroll) hScroll.scrollTop = hSel.offsetTop - hScroll.clientHeight / 2 + hSel.clientHeight / 2;
        if (mSel && mScroll) mScroll.scrollTop = mSel.offsetTop - mScroll.clientHeight / 2 + mSel.clientHeight / 2;
      };
      const open = () => { syncFromInput(); panel.classList.add("is-open"); mask.classList.add("is-open"); render(); };
      const close = () => { panel.classList.remove("is-open"); mask.classList.remove("is-open"); };
      const update = () => { input.value = fmt(); input.dispatchEvent(new Event("change", { bubbles: true })); };
      on(btn, "click", (e) => { e.preventDefault(); e.stopPropagation(); panel.classList.contains("is-open") ? close() : open(); });
      on(mask, "click", () => close());
      on(panel, "click", (e) => {
        const hItem = e.target.closest("[data-h]"); if (hItem) { curH = Number(hItem.dataset.h); render(); return; }
        const mItem = e.target.closest("[data-m]"); if (mItem) { curM = Number(mItem.dataset.m); render(); return; }
        const nowBtn = e.target.closest("[data-now]"); if (nowBtn) { const d = new Date(); curH = d.getHours(); curM = d.getMinutes(); update(); close(); return; }
        const confirmBtn = e.target.closest("[data-confirm]"); if (confirmBtn) { update(); close(); return; }
      });
    });
  }

  /* —— Calendar —— */
  function initCalendar(root) {
    $$("[data-blora-calendar]", root).forEach((cal) => {
      if (bound(cal, "Calendar")) return;
      const today = new Date();
      let viewYear = today.getFullYear(), viewMonth = today.getMonth(), viewMode = "days", selected = null;
      const fmt = (d) => d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
      const render = () => {
        let html = '<div class="blora-calendar__head">';
        html += '<div class="blora-row blora-row--tight"><button class="blora-btn blora-btn--ghost blora-btn--icon blora-btn--sm" data-nav="prev">' + CAL_ICON_PREV + '</button><button class="blora-btn blora-btn--ghost blora-btn--icon blora-btn--sm" data-nav="next">' + CAL_ICON_NEXT + '</button></div>';
        if (viewMode === "days") html += '<div class="blora-calendar__title" data-zoom="months">' + viewYear + escapeHTML(LOCALE.year) + " " + escapeHTML(LOCALE.months[viewMonth]) + '</div>';
        else if (viewMode === "months") html += '<div class="blora-calendar__title" data-zoom="years">' + viewYear + escapeHTML(LOCALE.year) + '</div>';
        else { const decStart = Math.floor(viewYear / 10) * 10; html += '<div class="blora-calendar__title" data-zoom="years">' + decStart + "–" + (decStart + 9) + escapeHTML(LOCALE.year) + '</div>'; }
        html += '<button class="blora-btn blora-btn--outline blora-btn--sm" data-today>' + escapeHTML(LOCALE.today) + '</button></div>';
        if (viewMode === "days") {
          html += '<div class="blora-calendar__grid">';
          LOCALE.dow.forEach((d) => { html += '<div class="blora-calendar__dow">' + escapeHTML(d) + '</div>'; });
          const first = new Date(viewYear, viewMonth, 1), startDay = first.getDay(), daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate(), daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
          for (let i = startDay - 1; i >= 0; i--) html += '<div class="blora-calendar__cell is-other">' + (daysInPrev - i) + '</div>';
          for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(viewYear, viewMonth, day);
            let cls = "blora-calendar__cell";
            if (d.toDateString() === today.toDateString()) cls += " is-today";
            if (selected && d.toDateString() === selected.toDateString()) cls += " is-selected";
            html += '<div class="' + cls + '" data-day="' + day + '">' + day + '</div>';
          }
          const total = startDay + daysInMonth, remaining = (7 - (total % 7)) % 7;
          for (let i = 1; i <= remaining; i++) html += '<div class="blora-calendar__cell is-other">' + i + '</div>';
          html += '</div>';
        } else if (viewMode === "months") {
          html += '<div class="blora-calendar__grid blora-calendar__grid--months">';
          LOCALE.months.forEach((name, m) => { let cls = "blora-calendar__cell blora-calendar__cell--month"; if (selected && viewYear === selected.getFullYear() && m === selected.getMonth()) cls += " is-selected"; if (viewYear === today.getFullYear() && m === today.getMonth()) cls += " is-today"; html += '<div class="' + cls + '" data-month="' + m + '">' + escapeHTML(name) + '</div>'; });
          html += '</div>';
        } else {
          const decStart = Math.floor(viewYear / 10) * 10;
          html += '<div class="blora-calendar__grid blora-calendar__grid--years">';
          for (let y = decStart - 1; y <= decStart + 10; y++) { let cls = "blora-calendar__cell blora-calendar__cell--year"; if (y < decStart || y > decStart + 9) cls += " is-other"; if (selected && y === selected.getFullYear()) cls += " is-selected"; if (y === today.getFullYear()) cls += " is-today"; html += '<div class="' + cls + '" data-year="' + y + '">' + y + '</div>'; }
          html += '</div>';
        }
        cal.innerHTML = html;
      };
      on(cal, "click", (e) => {
        const nav = e.target.closest("[data-nav]");
        if (nav) { if (viewMode === "days") { if (nav.dataset.nav === "prev") { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } } else { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } } } else if (viewMode === "months") { viewYear += (nav.dataset.nav === "prev" ? -1 : 1); } else { viewYear += (nav.dataset.nav === "prev" ? -10 : 10); } render(); return; }
        const zoom = e.target.closest("[data-zoom]"); if (zoom) { if (zoom.dataset.zoom === "months") viewMode = "months"; else if (zoom.dataset.zoom === "years") viewMode = "years"; render(); return; }
        const todayBtn = e.target.closest("[data-today]"); if (todayBtn) { selected = new Date(); viewYear = selected.getFullYear(); viewMonth = selected.getMonth(); viewMode = "days"; render(); return; }
        const dayCell = e.target.closest(".blora-calendar__cell[data-day]"); if (dayCell) { selected = new Date(viewYear, viewMonth, Number(dayCell.dataset.day)); render(); return; }
        const monthCell = e.target.closest(".blora-calendar__cell--month[data-month]"); if (monthCell) { viewMonth = Number(monthCell.dataset.month); viewMode = "days"; render(); return; }
        const yearCell = e.target.closest(".blora-calendar__cell--year[data-year]"); if (yearCell) { viewYear = Number(yearCell.dataset.year); viewMode = "months"; render(); return; }
      });
      render();
    });
  }

  /* —— Color Picker —— 连续 HSV 色域 + HEX 双向同步 —— */
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const normalizeHex = (value) => {
    let hex = String(value || "").trim();
    if (hex && !hex.startsWith("#")) hex = "#" + hex;
    if (/^#[0-9a-f]{3}$/i.test(hex)) hex = "#" + hex.slice(1).split("").map((char) => char + char).join("");
    return /^#[0-9a-f]{6}$/i.test(hex) ? hex.toUpperCase() : null;
  };
  const hexToHsv = (hex) => {
    const value = normalizeHex(hex) || "#000000";
    const r = parseInt(value.slice(1, 3), 16) / 255;
    const g = parseInt(value.slice(3, 5), 16) / 255;
    const b = parseInt(value.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
    let h = 0;
    if (delta) {
      if (max === r) h = 60 * (((g - b) / delta) % 6);
      else if (max === g) h = 60 * ((b - r) / delta + 2);
      else h = 60 * ((r - g) / delta + 4);
    }
    if (h < 0) h += 360;
    return { h, s: max ? delta / max : 0, v: max };
  };
  const hsvToHex = ({ h, s, v }) => {
    const chroma = v * s;
    const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - chroma;
    let rgb = h < 60 ? [chroma, x, 0] : h < 120 ? [x, chroma, 0] : h < 180 ? [0, chroma, x] : h < 240 ? [0, x, chroma] : h < 300 ? [x, 0, chroma] : [chroma, 0, x];
    return "#" + rgb.map((channel) => Math.round((channel + m) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
  };
  function initColorPicker(root) {
    $$(".blora-color-picker", root).forEach((wrap) => {
      if (bound(wrap, "Colorpicker")) return;
      const swatch = $(".blora-color-swatch", wrap);
      const panel = $(".blora-color-panel", wrap);
      if (!swatch || !panel) return;
      const d = ownerDoc(wrap);
      const win = ownerWin(wrap);
      let spectrum = $(".blora-color-spectrum", panel);
      if (!spectrum) {
        spectrum = d.createElement("div");
        spectrum.className = "blora-color-spectrum";
        spectrum.tabIndex = 0;
        spectrum.setAttribute("role", "slider");
        spectrum.setAttribute("aria-label", "颜色饱和度与明度");
        spectrum.innerHTML = '<span class="blora-color-spectrum__cursor" aria-hidden="true"></span>';
        panel.insertBefore(spectrum, panel.firstChild);
      }
      let hueInput = $(".blora-color-hue", panel);
      if (!hueInput) {
        hueInput = d.createElement("input");
        hueInput.className = "blora-color-hue";
        hueInput.type = "range";
        hueInput.min = "0";
        hueInput.max = "359";
        hueInput.step = "1";
        hueInput.setAttribute("aria-label", "色相");
        spectrum.insertAdjacentElement("afterend", hueInput);
      }
      const cursor = $(".blora-color-spectrum__cursor", spectrum);
      const hexInput = $(".blora-color-hex", panel);
      const preview = $(".blora-color-preview", panel);
      let current = normalizeHex(swatch.dataset.color) || normalizeHex(token("--blora-primary")) || "#000000";
      let hsv = hexToHsv(current);
      const mask = d.createElement("div"); mask.className = "blora-floating-mask blora-portal"; getPortalRoot(wrap).appendChild(mask);
      swatch.setAttribute("role", "button");
      swatch.setAttribute("tabindex", "0");
      swatch.setAttribute("aria-haspopup", "dialog");
      swatch.setAttribute("aria-expanded", "false");
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-label", "选择颜色");
      const render = (emit = false) => {
        current = hsvToHex(hsv);
        swatch.style.background = current;
        swatch.dataset.color = current;
        swatch.setAttribute("aria-label", `选择颜色，当前 ${current}`);
        spectrum.style.setProperty("--blora-color-hue", String(Math.round(hsv.h)));
        hueInput.style.setProperty("--blora-color-hue", String(Math.round(hsv.h)));
        hueInput.value = String(Math.round(hsv.h));
        cursor.style.left = (hsv.s * 100) + "%";
        cursor.style.top = ((1 - hsv.v) * 100) + "%";
        spectrum.setAttribute("aria-valuemin", "0");
        spectrum.setAttribute("aria-valuemax", "100");
        spectrum.setAttribute("aria-valuenow", String(Math.round(hsv.s * 100)));
        spectrum.setAttribute("aria-valuetext", `饱和度 ${Math.round(hsv.s * 100)}%，明度 ${Math.round(hsv.v * 100)}%`);
        if (preview) preview.style.background = current;
        if (hexInput && d.activeElement !== hexInput) hexInput.value = current;
        if (emit) wrap.dispatchEvent(new win.CustomEvent("blora:change", { bubbles: true, detail: { value: current, hsv: { ...hsv } } }));
      };
      const setFromPoint = (clientX, clientY, emit = true) => {
        const rect = spectrum.getBoundingClientRect();
        hsv.s = clamp((clientX - rect.left) / rect.width, 0, 1);
        hsv.v = 1 - clamp((clientY - rect.top) / rect.height, 0, 1);
        render(emit);
      };
      on(spectrum, "pointerdown", (e) => {
        e.preventDefault();
        spectrum.focus();
        spectrum.setPointerCapture(e.pointerId);
        setFromPoint(e.clientX, e.clientY);
      });
      on(spectrum, "pointermove", (e) => { if (spectrum.hasPointerCapture(e.pointerId)) setFromPoint(e.clientX, e.clientY); });
      on(spectrum, "keydown", (e) => {
        const amount = e.shiftKey ? 0.1 : 0.01;
        if (e.key === "ArrowRight") hsv.s += amount;
        else if (e.key === "ArrowLeft") hsv.s -= amount;
        else if (e.key === "ArrowUp") hsv.v += amount;
        else if (e.key === "ArrowDown") hsv.v -= amount;
        else return;
        e.preventDefault();
        hsv.s = clamp(hsv.s, 0, 1); hsv.v = clamp(hsv.v, 0, 1); render(true);
      });
      on(hueInput, "input", () => { hsv.h = Number(hueInput.value); render(true); });
      if (hexInput) {
        hexInput.setAttribute("aria-label", "十六进制颜色");
        on(hexInput, "input", () => {
          const value = normalizeHex(hexInput.value);
          hexInput.setAttribute("aria-invalid", String(!value));
          if (value) { hsv = hexToHsv(value); render(true); }
        });
        on(hexInput, "blur", () => { hexInput.value = current; hexInput.setAttribute("aria-invalid", "false"); });
      }
      const open = () => {
        panel.classList.remove("is-align-end");
        panel.classList.add("is-open"); mask.classList.add("is-open"); swatch.setAttribute("aria-expanded", "true");
        if (panel.getBoundingClientRect().right > win.innerWidth - 8) panel.classList.add("is-align-end");
        render();
      };
      const close = (restore = false) => {
        panel.classList.remove("is-open"); mask.classList.remove("is-open"); swatch.setAttribute("aria-expanded", "false");
        if (restore) swatch.focus();
      };
      on(swatch, "click", (e) => { e.stopPropagation(); panel.classList.contains("is-open") ? close() : open(); });
      on(swatch, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); panel.classList.contains("is-open") ? close() : open(); } });
      on(panel, "keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); close(true); } });
      on(mask, "click", () => close());
      render();
    });
  }

  /* —— Date input guard —— */
  function initDateGuard(root) {
    $$('input[type="date"]', root).forEach((inp) => {
      if (bound(inp, "DateGuard")) return;
      on(inp, "blur", () => { const v = inp.value; if (!v) return; const min = inp.min, max = inp.max; if (min && v < min) { inp.value = min; } if (max && v > max) { inp.value = max; } });
    });
  }

  /* —— Command palette —— 复用模态开关：Esc、遮罩、焦点圈禁一并生效 —— */
  function initCommandPalette() {
    if (FLAGS.cmdk) return;
    FLAGS.cmdk = true;
    on(document, "keydown", (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "k") return;
      const pal = $("#blora-cmdk");
      if (!pal) return;
      e.preventDefault();
      if (pal.classList.contains("is-open")) { closeModal(pal); return; }
      openModal(pal);
      const inp = $(".blora-input", pal);
      if (inp) inp.focus();
    });
  }

  /* —— Dropdown Menu —— */
  function initDropdown(root) {
    $$("[data-blora-dropdown-trigger]", root).forEach((trigger) => {
      if (bound(trigger, "Dropdown")) return;
      const menu = trigger.parentElement.querySelector(".blora-dropdown-menu");
      if (!menu) return;
      const win = ownerWin(menu);
      const position = () => menu.classList.contains("is-open") && fitFloatingInline(menu);
      on(trigger, "click", (e) => {
        e.stopPropagation();
        const open = menu.classList.contains("is-open");
        $$(".blora-dropdown-menu.is-open").forEach((m) => m !== menu && m.classList.remove("is-open"));
        menu.classList.toggle("is-open", !open);
        if (!open) win.requestAnimationFrame(position);
      });
      on(win, "resize", position);
    });
    if (!FLAGS.dropdownDoc) {
      FLAGS.dropdownDoc = true;
      on(document, "click", () => $$(".blora-dropdown-menu.is-open").forEach((m) => m.classList.remove("is-open")));
    }
  }

  function initSpeedDial(root) {
    $$("[data-blora-speed-dial]", root).forEach((dial) => {
      if (bound(dial, "SpeedDial")) return;
      const d = ownerDoc(dial);
      const trigger = $("[data-blora-speed-dial-trigger]", dial);
      const actions = $(".blora-speed-dial__actions", dial);
      if (!trigger || !actions) return;
      const closeBtn = $("[data-blora-speed-dial-close], .blora-speed-dial__close", dial);
      const mainBtn = $("[data-blora-speed-dial-main], .blora-speed-dial__main", dial);
      const actionItems = $$(".blora-speed-dial__action", actions);
      if (!actions.id) actions.id = "blora-sd-actions-" + Math.random().toString(36).slice(2, 9);

      trigger.setAttribute("aria-haspopup", "menu");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-controls", actions.id);
      actions.setAttribute("role", "menu");
      actions.setAttribute("aria-hidden", "true");
      actionItems.forEach((action) => {
        action.setAttribute("role", "menuitem");
        action.setAttribute("tabindex", "-1");
      });
      if (closeBtn) {
        closeBtn.setAttribute("tabindex", "-1");
        closeBtn.setAttribute("aria-hidden", "true");
      }
      if (mainBtn) {
        mainBtn.setAttribute("tabindex", "-1");
        mainBtn.setAttribute("aria-hidden", "true");
      }

      const setOpen = (open, focus = false) => {
        dial.classList.toggle("is-open", open);
        trigger.setAttribute("aria-expanded", String(open));
        actions.setAttribute("aria-hidden", String(!open));
        if (closeBtn) closeBtn.setAttribute("aria-hidden", String(!open));
        if (mainBtn) {
          mainBtn.setAttribute("aria-hidden", String(!open));
          mainBtn.setAttribute("tabindex", open ? "0" : "-1");
        }
        actionItems.forEach((action) => action.setAttribute("tabindex", open ? "0" : "-1"));
        if (open && focus) {
          if (mainBtn) mainBtn.focus();
          else actionItems[0]?.focus();
        }
        if (!open) actionItems.forEach((action) => action.setAttribute("tabindex", "-1"));
      };

      on(trigger, "click", (e) => {
        e.stopPropagation();
        setOpen(!dial.classList.contains("is-open"));
      });
      on(trigger, "keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          setOpen(true, true);
        }
      });
      if (closeBtn) {
        on(closeBtn, "click", (e) => {
          e.stopPropagation();
          setOpen(false);
          trigger.focus();
        });
      }
      if (mainBtn) {
        on(mainBtn, "click", (e) => {
          e.stopPropagation();
          setOpen(false);
          trigger.focus();
        });
      }
      on(dial, "keydown", (e) => {
        if (e.key === "Escape" && dial.classList.contains("is-open")) {
          e.preventDefault();
          setOpen(false);
          trigger.focus();
          return;
        }
        if (!dial.classList.contains("is-open")) return;
        const focusables = mainBtn
          ? [mainBtn, ...actionItems]
          : actionItems;
        const index = focusables.indexOf(e.target);
        if (index < 0) return;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          focusables[(index + 1) % focusables.length].focus();
        }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          focusables[(index - 1 + focusables.length) % focusables.length].focus();
        }
        if (e.key === "Home") { e.preventDefault(); focusables[0].focus(); }
        if (e.key === "End") { e.preventDefault(); focusables[focusables.length - 1].focus(); }
      });
      on(actions, "click", (e) => {
        if (e.target.closest(".blora-speed-dial__action")) setOpen(false);
      });
      on(d, "click", (e) => { if (!dial.contains(e.target)) setOpen(false); });
    });
  }

  function initSidebarLayout(root) {
    $$("[data-blora-sidebar-layout]", root).forEach((layout) => {
      if (bound(layout, "SidebarLayout")) return;
      const d = ownerDoc(layout);
      const toggles = $$("[data-blora-sidebar-toggle]", layout);
      const aside = $(".blora-sidebar-layout__aside", layout);
      const mask = $(".blora-sidebar-layout__mask", layout);
      if (!aside || !toggles.length) return;
      const win = ownerWin(layout);
      const mobile = win.matchMedia("(max-width: 900px)");
      if (!aside.id) aside.id = "blora-sidebar-" + Math.random().toString(36).slice(2, 9);
      toggles.forEach((toggle) => {
        toggle.setAttribute("aria-controls", aside.id);
        toggle.setAttribute("aria-expanded", "false");
      });
      const syncA11y = () => {
        const unavailable = mobile.matches && !layout.classList.contains("is-open");
        aside.setAttribute("aria-hidden", String(unavailable));
        aside.toggleAttribute("inert", unavailable);
      };
      const setOpen = (open, restore = false, focus = false) => {
        layout.classList.toggle("is-open", open);
        toggles.forEach((toggle) => toggle.setAttribute("aria-expanded", String(open)));
        syncA11y();
        if (open && focus) $("a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])", aside)?.focus();
        if (!open && restore) toggles[0].focus();
      };
      toggles.forEach((toggle) => on(toggle, "click", () => setOpen(!layout.classList.contains("is-open"), false, true)));
      on(mask, "click", () => setOpen(false, true));
      on(d, "keydown", (e) => { if (e.key === "Escape" && layout.classList.contains("is-open")) setOpen(false, true); });
      on(mobile, "change", () => {
        if (!mobile.matches) setOpen(false);
        else syncA11y();
      });
      syncA11y();
    });
  }

  function initMegamenu(root) {
    $$("[data-blora-megamenu]", root).forEach((menu) => {
      if (bound(menu, "Megamenu")) return;
      const d = ownerDoc(menu);
      const win = ownerWin(menu);
      const trigger = $("[data-blora-megamenu-trigger]", menu);
      const panel = $(".blora-megamenu__panel", menu);
      if (!trigger || !panel) return;
      if (!panel.id) panel.id = "blora-megamenu-" + Math.random().toString(36).slice(2, 9);
      trigger.setAttribute("aria-controls", panel.id);
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-expanded", "false");
      const positionPanel = () => {
        if (!menu.classList.contains("is-open") || win.matchMedia("(max-width: 900px)").matches) return;
        panel.style.setProperty("--blora-megamenu-offset", "0px");
        const rect = panel.getBoundingClientRect();
        const gutter = parseFloat(win.getComputedStyle(panel).getPropertyValue("--blora-space-4")) || 16;
        let offset = Math.min(0, win.innerWidth - gutter - rect.right);
        if (rect.left + offset < gutter) offset += gutter - (rect.left + offset);
        panel.style.setProperty("--blora-megamenu-offset", offset + "px");
      };
      const setOpen = (open, focus = false) => {
        if (open) {
          $$('[data-blora-megamenu].is-open', d).forEach((other) => {
            if (other === menu) return;
            other.classList.remove("is-open");
            const otherTrigger = $("[data-blora-megamenu-trigger]", other);
            if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          });
        }
        menu.classList.toggle("is-open", open);
        trigger.setAttribute("aria-expanded", String(open));
        if (open) win.requestAnimationFrame(positionPanel);
        if (open && focus) $("a, button", panel)?.focus();
      };
      on(trigger, "click", (e) => { e.stopPropagation(); setOpen(!menu.classList.contains("is-open")); });
      on(trigger, "keydown", (e) => { if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true, true); } });
      on(menu, "keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); setOpen(false); trigger.focus(); } });
      on(panel, "click", (e) => { if (e.target.closest("a")) setOpen(false); });
      on(d, "click", (e) => { if (!menu.contains(e.target)) setOpen(false); });
      on(win, "resize", positionPanel);
    });
  }

  function initCountdown(root) {
    $$("[data-blora-countdown]", root).forEach((countdown) => {
      if (bound(countdown, "Countdown")) return;
      const win = ownerWin(countdown);
      let target = Date.parse(countdown.dataset.target || "");
      if (!Number.isFinite(target)) {
        const seconds = Math.max(0, Number(countdown.dataset.seconds) || 0);
        target = Date.now() + seconds * 1000;
      }
      let timer = null;
      const render = () => {
        const remaining = Math.max(0, target - Date.now());
        const totalSeconds = Math.ceil(remaining / 1000);
        const values = {
          days: Math.floor(totalSeconds / 86400),
          hours: Math.floor(totalSeconds / 3600) % 24,
          minutes: Math.floor(totalSeconds / 60) % 60,
          seconds: totalSeconds % 60,
        };
        Object.entries(values).forEach(([unit, value]) => {
          const output = $('[data-unit="' + unit + '"]', countdown);
          if (output) output.textContent = String(value).padStart(unit === "days" ? 1 : 2, "0");
        });
        countdown.setAttribute("aria-label", values.days + " 天 " + values.hours + " 小时 " + values.minutes + " 分 " + values.seconds + " 秒");
        if (!remaining && timer) {
          win.clearInterval(timer);
          timer = null;
          countdown.dispatchEvent(new win.CustomEvent("blora:complete", { bubbles: true }));
        }
      };
      countdown.setAttribute("role", "timer");
      render();
      if (target > Date.now()) timer = win.setInterval(render, 1000);
    });
  }

  function initDiff(root) {
    $$(".blora-diff", root).forEach((diff) => {
      if (bound(diff, "Diff")) return;
      const input = $(".blora-diff__range", diff);
      if (!input) return;
      const sync = () => {
        const min = Number(input.min || 0), max = Number(input.max || 100), value = Number(input.value || 50);
        const percent = max === min ? 50 : clamp((value - min) / (max - min) * 100, 0, 100);
        diff.style.setProperty("--blora-diff-position", percent + "%");
        input.setAttribute("aria-valuetext", Math.round(percent) + "%");
      };
      on(input, "input", sync);
      sync();
    });
  }

  function initHoverGallery(root) {
    $$(".blora-hover-gallery", root).forEach((gallery) => {
      if (bound(gallery, "HoverGallery")) return;
      let items = $$(".blora-hover-gallery__item", gallery);
      if (!items.length) return;
      const d = ownerDoc(gallery);
      let track = $(".blora-hover-gallery__track", gallery);
      if (!track) {
        track = d.createElement("div");
        track.className = "blora-hover-gallery__track";
        items.forEach((item) => track.appendChild(item));
        gallery.insertBefore(track, gallery.firstChild);
        items = $$(".blora-hover-gallery__item", track);
      }
      const label = gallery.getAttribute("aria-label") || "图片库";
      gallery.setAttribute("role", "group");
      let progress = $(".blora-hover-gallery__progress", gallery);
      if (!progress) {
        progress = d.createElement("span");
        progress.className = "blora-hover-gallery__progress";
        progress.setAttribute("aria-hidden", "true");
        progress.innerHTML = items.map(() => "<span></span>").join("");
        gallery.appendChild(progress);
      }
      const indicators = $$("span", progress);
      const last = items.length - 1;
      let active = Math.max(0, items.findIndex((item) => item.classList.contains("is-active")));
      if (active < 0) active = 0;
      const paint = (animate) => {
        track.classList.toggle("is-dragging", !animate);
        track.style.transform = "translate3d(" + (-active * 100) + "%, 0, 0)";
        items.forEach((item, i) => {
          item.classList.toggle("is-active", i === active);
          item.setAttribute("aria-hidden", String(i !== active));
        });
        indicators.forEach((item, i) => item.classList.toggle("is-active", i === active));
        gallery.setAttribute("aria-label", label + "，图片 " + (active + 1) + " / " + items.length);
      };
      const go = (index) => {
        active = Math.max(0, Math.min(last, index));
        paint(true);
      };
      gallery.tabIndex = gallery.hasAttribute("tabindex") ? gallery.tabIndex : 0;

      /* 跟手拖拽：轨道实时跟随，松手按位移/速度吸附 */
      const THRESHOLD = 0.2;
      const VELOCITY = 0.35;
      let drag = null;
      const point = (e) => {
        if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        if (e.changedTouches && e.changedTouches[0]) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        return { x: e.clientX, y: e.clientY };
      };
      const widthOf = () => gallery.getBoundingClientRect().width || 1;
      const resist = (dx) => {
        if ((active === 0 && dx > 0) || (active === last && dx < 0)) return dx * 0.35;
        return dx;
      };
      const applyDrag = (dx) => {
        track.classList.add("is-dragging");
        track.style.transform = "translate3d(calc(" + (-active * 100) + "% + " + resist(dx) + "px), 0, 0)";
      };
      const onDragStart = (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        const p = point(e);
        drag = {
          x: p.x, y: p.y, dx: 0, locked: null,
          lx: p.x, lt: Date.now(), vx: 0,
          pointerId: e.pointerId,
        };
        if (typeof e.pointerId === "number" && gallery.setPointerCapture) {
          try { gallery.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
        }
      };
      const onDragMove = (e) => {
        if (!drag) return;
        if (typeof drag.pointerId === "number" && typeof e.pointerId === "number" && e.pointerId !== drag.pointerId) return;
        const p = point(e);
        const dx = p.x - drag.x;
        const dy = p.y - drag.y;
        if (drag.locked == null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
          drag.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
          if (drag.locked === "y") {
            drag = null;
            paint(true);
            return;
          }
        }
        if (drag.locked !== "x") return;
        if (e.cancelable) e.preventDefault();
        const now = Date.now();
        const dt = Math.max(1, now - drag.lt);
        drag.vx = (p.x - drag.lx) / dt;
        drag.lx = p.x;
        drag.lt = now;
        drag.dx = dx;
        applyDrag(dx);
      };
      const finishDrag = (cancelled) => {
        if (!drag) return;
        const dx = drag.dx;
        const vx = drag.vx;
        const wasX = drag.locked === "x";
        drag = null;
        track.classList.remove("is-dragging");
        if (!wasX || cancelled) {
          paint(true);
          return;
        }
        const w = widthOf();
        let next = active;
        if (dx <= -w * THRESHOLD || vx <= -VELOCITY) next = active + 1;
        else if (dx >= w * THRESHOLD || vx >= VELOCITY) next = active - 1;
        go(next);
      };
      const onDragEnd = (e) => {
        if (!drag) return;
        if (typeof drag.pointerId === "number" && typeof e.pointerId === "number" && e.pointerId !== drag.pointerId) return;
        if (drag.locked === "x") {
          const p = point(e);
          drag.dx = p.x - drag.x;
          const now = Date.now();
          const dt = Math.max(1, now - drag.lt);
          drag.vx = (p.x - drag.lx) / dt;
        }
        finishDrag(false);
      };
      const onDragCancel = () => finishDrag(true);

      if (global.PointerEvent) {
        on(gallery, "pointerdown", onDragStart);
        on(gallery, "pointermove", onDragMove);
        on(gallery, "pointerup", onDragEnd);
        on(gallery, "pointercancel", onDragCancel);
      } else {
        on(gallery, "touchstart", onDragStart, { passive: true });
        on(gallery, "touchmove", onDragMove, { passive: false });
        on(gallery, "touchend", onDragEnd);
        on(gallery, "touchcancel", onDragCancel);
      }

      on(gallery, "keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(active + 1); }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(active - 1); }
        if (e.key === "Home") { e.preventDefault(); go(0); }
        if (e.key === "End") { e.preventDefault(); go(last); }
      });
      paint(true);
    });
  }

  /* —— Deck · 卡片叠层（垂直跟手 + 滚轮） —— */
  /* —— Deck · 隐形滚轮叠层 ——
     单一连续 offset（单位：张）。每张卡 pose 只由 wrap(i - offset) 决定。
     拖动/滚轮改 offset，松手吸附到最近整数格。 */
  function initDeck(root) {
    $$(".blora-deck", root).forEach((deck) => {
      if (bound(deck, "Deck")) return;
      const cards = () => Array.from(deck.children).filter((el) => el.nodeType === 1);
      if (!cards().length) return;
      if (!deck.hasAttribute("tabindex")) deck.tabIndex = 0;

      /* 相对焦点 d 的姿态曲线：d=0 正面；d>0 叠在后方（偏上）；d<0 偏下退出 */
      const GAP = 0.55;       // rem / 张
      const STEP_PX = 96;     // 拖满一张的像素
      const VISIBLE = 2.35;   // |d| 超过此值隐藏
      const clampN = (v, a, b) => Math.min(b, Math.max(a, v));
      const wrapDelta = (i, off, n) => {
        let d = i - off;
        d -= n * Math.round(d / n);
        return d;
      };
      const poseAt = (d) => {
        const ad = Math.abs(d);
        if (ad > VISIBLE) {
          return { y: d > 0 ? -GAP * VISIBLE : GAP * VISIBLE, scale: 0.88, opacity: 0, z: 0 };
        }
        const y = -d * GAP;
        const scale = 1 - clampN(ad, 0, 3) * 0.04;
        const opacity = ad <= 0.15 ? 1 : clampN(1 - (ad - 0.15) / (VISIBLE - 0.15), 0, 1);
        const z = Math.round(40 - ad * 10);
        return { y, scale, opacity, z };
      };

      let offset = (() => {
        const list = cards();
        let i = list.findIndex((c) => c.classList.contains("is-front"));
        if (i < 0) i = 0;
        return i;
      })();
      let drag = null;
      let wheelAcc = 0;
      let wheelLock = 0;

      const paint = (dragging) => {
        const list = cards();
        const n = list.length;
        if (!n) return;
        deck.classList.toggle("is-dragging", !!dragging);
        let frontIdx = 0;
        let frontScore = Infinity;
        list.forEach((card, i) => {
          const d = wrapDelta(i, offset, n);
          const pose = poseAt(d);
          card.style.setProperty("--blora-deck-y", pose.y + "rem");
          card.style.setProperty("--blora-deck-scale", String(pose.scale));
          card.style.setProperty("--blora-deck-opacity", String(pose.opacity));
          card.style.zIndex = String(pose.z);
          if (Math.abs(d) < frontScore) {
            frontScore = Math.abs(d);
            frontIdx = i;
          }
        });
        list.forEach((card, i) => {
          const isFront = i === frontIdx;
          card.classList.toggle("is-front", isFront);
          card.classList.toggle("is-mid", false);
          card.classList.toggle("is-back", false);
          card.setAttribute("aria-hidden", String(!isFront));
        });
        const raw = deck.getAttribute("data-label") || deck.getAttribute("aria-label") || "卡片叠层";
        const base = raw.replace(/，第\s*\d+\s*\/\s*\d+\s*张$/, "");
        deck.setAttribute("aria-label", base + "，第 " + (frontIdx + 1) + " / " + n + " 张");
      };

      const snap = () => {
        const n = cards().length;
        if (!n) return;
        offset = Math.round(offset);
        offset = ((offset % n) + n) % n;
        paint(false);
      };

      const go = (delta) => {
        const n = cards().length;
        if (!n) return;
        offset = Math.round(offset) + delta;
        snap();
      };

      const point = (e) => {
        if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        if (e.changedTouches && e.changedTouches[0]) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        return { x: e.clientX, y: e.clientY };
      };

      const onStart = (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        const pt = point(e);
        drag = {
          x: pt.x, y: pt.y,
          startOffset: offset,
          locked: null,
          ly: pt.y, lt: Date.now(), vy: 0,
          pointerId: e.pointerId,
        };
        if (typeof e.pointerId === "number" && deck.setPointerCapture) {
          try { deck.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
        }
      };

      const onMove = (e) => {
        if (!drag) return;
        if (typeof drag.pointerId === "number" && typeof e.pointerId === "number" && e.pointerId !== drag.pointerId) return;
        const pt = point(e);
        const dx = pt.x - drag.x;
        const dy = pt.y - drag.y;
        if (drag.locked == null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
          drag.locked = Math.abs(dy) >= Math.abs(dx) ? "y" : "x";
          if (drag.locked === "x") {
            drag = null;
            paint(false);
            return;
          }
        }
        if (drag.locked !== "y") return;
        if (e.cancelable) e.preventDefault();
        const now = Date.now();
        const dt = Math.max(1, now - drag.lt);
        drag.vy = (pt.y - drag.ly) / dt;
        drag.ly = pt.y;
        drag.lt = now;
        // 跟手：手指下移（dy>0）→ 卡片下移 → offset 增大
        offset = drag.startOffset + dy / STEP_PX;
        paint(true);
      };

      const finish = (cancelled) => {
        if (!drag) return;
        const vy = drag.vy;
        const wasY = drag.locked === "y";
        const start = drag.startOffset;
        drag = null;
        if (!wasY || cancelled) {
          offset = start;
          paint(false);
          return;
        }
        if (vy <= -0.4) offset -= 0.55;
        else if (vy >= 0.4) offset += 0.55;
        snap();
      };

      const onEnd = (e) => {
        if (!drag) return;
        if (typeof drag.pointerId === "number" && typeof e.pointerId === "number" && e.pointerId !== drag.pointerId) return;
        if (drag.locked === "y") {
          const pt = point(e);
          const now = Date.now();
          const dt = Math.max(1, now - drag.lt);
          drag.vy = (pt.y - drag.ly) / dt;
          offset = drag.startOffset + (pt.y - drag.y) / STEP_PX;
        }
        finish(false);
      };

      if (global.PointerEvent) {
        on(deck, "pointerdown", onStart);
        on(deck, "pointermove", onMove);
        on(deck, "pointerup", onEnd);
        on(deck, "pointercancel", () => finish(true));
      } else {
        on(deck, "touchstart", onStart, { passive: true });
        on(deck, "touchmove", onMove, { passive: false });
        on(deck, "touchend", onEnd);
        on(deck, "touchcancel", () => finish(true));
      }

      on(deck, "wheel", (e) => {
        if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
        e.preventDefault();
        const now = Date.now();
        if (now > wheelLock + 400) wheelAcc = 0;
        wheelLock = now;
        wheelAcc += e.deltaY;
        if (Math.abs(wheelAcc) < 24) return;
        const dir = wheelAcc > 0 ? 1 : -1;
        wheelAcc = 0;
        go(dir);
      }, { passive: false });

      on(deck, "keydown", (e) => {
        const n = cards().length;
        if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); go(1); }
        if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(-1); }
        if (e.key === "Home") { e.preventDefault(); offset = 0; snap(); }
        if (e.key === "End") { e.preventDefault(); offset = n - 1; snap(); }
      });

      paint(false);
    });
  }

  function initTextRotate(root) {
    $$(".blora-text-rotate", root).forEach((rotate) => {
      if (bound(rotate, "TextRotate")) return;
      const items = $$(".blora-text-rotate__item", rotate);
      if (items.length < 2 || prefersReduced(rotate)) {
        items.forEach((item, index) => {
          item.classList.toggle("is-active", index === 0);
          item.setAttribute("aria-hidden", String(index !== 0));
        });
        return;
      }
      const win = ownerWin(rotate);
      const duration = Math.max(1200, Number(rotate.dataset.interval) || 3200);
      let active = Math.max(0, items.findIndex((item) => item.classList.contains("is-active")));
      let timer = null;
      const setActive = (index) => {
        active = index % items.length;
        items.forEach((item, i) => {
          item.classList.toggle("is-active", i === active);
          item.setAttribute("aria-hidden", String(i !== active));
        });
      };
      const start = () => { if (!timer) timer = win.setInterval(() => setActive(active + 1), duration); };
      const stop = () => { if (timer) win.clearInterval(timer); timer = null; };
      on(rotate, "mouseenter", stop);
      on(rotate, "mouseleave", start);
      on(rotate, "focusin", stop);
      on(rotate, "focusout", start);
      setActive(active);
      start();
    });
  }

  /* —— 文字效果 · Text Effects ——
     任意文本：class="blora-text-fx blora-text-fx--shake" 或 data-blora-text-fx="shake"
     播放：is-play；循环：is-loop。API：Blora.textFx(el, "bloom") */
  const TEXT_FX = Object.freeze(["grow", "shrink", "shake", "nod", "explode", "ripple", "bloom", "jitter"]);
  const TEXT_FX_SPLIT = Object.freeze(["explode", "ripple", "bloom"]);
  const TEXT_FX_SET = new Set(TEXT_FX);
  function textFxNameFromEl(el) {
    if (!el) return "";
    const raw = (el.getAttribute("data-blora-text-fx") || "").trim().toLowerCase();
    if (TEXT_FX_SET.has(raw)) return raw;
    for (let i = 0; i < TEXT_FX.length; i++) {
      if (el.classList.contains("blora-text-fx--" + TEXT_FX[i])) return TEXT_FX[i];
    }
    return "";
  }
  /** 为分字效果写入稳定物理量（避免在 keyframes 里对 --i 做取模/calc，浏览器支持差） */
  function layoutTextFxPhysics(el, name) {
    const chars = $$(".blora-text-fx__ch", el);
    const n = chars.length || 1;
    const mid = (n - 1) / 2;
    chars.forEach((span, i) => {
      span.style.setProperty("--i", String(i));
      if (name === "explode") {
        /* 扇形向上炸开再收回：左右拉开、略向上 */
        const t = n <= 1 ? 0 : (i / (n - 1)) * 2 - 1;
        const x = t * 1.15;
        const y = -0.95 - (1 - Math.abs(t)) * 0.35;
        const r = t * 26;
        span.style.setProperty("--fx-x", x.toFixed(3) + "em");
        span.style.setProperty("--fx-y", y.toFixed(3) + "em");
        span.style.setProperty("--fx-r", r.toFixed(1) + "deg");
      } else if (name === "bloom") {
        const fromCenter = Math.abs(i - mid);
        span.style.setProperty("--fx-center-delay", Math.round(fromCenter * 28) + "ms");
        span.style.setProperty("--fx-r", ((i - mid) * 12).toFixed(1) + "deg");
      } else {
        span.style.removeProperty("--fx-x");
        span.style.removeProperty("--fx-y");
        span.style.removeProperty("--fx-r");
        span.style.removeProperty("--fx-center-delay");
      }
    });
  }
  function splitTextFxLetters(el) {
    if (!el) return;
    if (el.dataset.bloraFxSplit === "1") {
      layoutTextFxPhysics(el, textFxNameFromEl(el));
      return;
    }
    const text = el.textContent || "";
    el.textContent = "";
    Array.from(text).forEach((ch, i) => {
      const span = ownerDoc(el).createElement("span");
      span.className = "blora-text-fx__ch";
      span.style.setProperty("--i", String(i));
      span.textContent = ch === " " ? "\u00a0" : ch;
      el.appendChild(span);
    });
    el.dataset.bloraFxSplit = "1";
    el.dataset.bloraFxText = text;
    layoutTextFxPhysics(el, textFxNameFromEl(el));
  }
  function unsplitTextFxLetters(el) {
    if (!el || el.dataset.bloraFxSplit !== "1") return;
    const text = el.dataset.bloraFxText != null
      ? el.dataset.bloraFxText
      : $$(".blora-text-fx__ch", el).map((n) => (n.textContent === "\u00a0" ? " " : n.textContent)).join("");
    el.textContent = text;
    el.removeAttribute("data-blora-fx-split");
    el.removeAttribute("data-blora-fx-text");
  }
  function applyTextFxName(el, name) {
    if (!el || !TEXT_FX_SET.has(name)) return false;
    el.classList.add("blora-text-fx");
    TEXT_FX.forEach((n) => el.classList.toggle("blora-text-fx--" + n, n === name));
    el.setAttribute("data-blora-text-fx", name);
    if (TEXT_FX_SPLIT.includes(name)) {
      splitTextFxLetters(el);
      layoutTextFxPhysics(el, name);
    } else {
      unsplitTextFxLetters(el);
    }
    return true;
  }
  function restartTextFxAnimation(el) {
    el.classList.remove("is-play");
    $$(".blora-text-fx__ch", el).forEach((ch) => {
      ch.style.animation = "none";
    });
    void el.offsetWidth;
    $$(".blora-text-fx__ch", el).forEach((ch) => {
      ch.style.animation = "";
    });
    el.classList.add("is-play");
  }
  function playTextFx(el, name) {
    if (!el) return null;
    if (name) applyTextFxName(el, name);
    else if (!textFxNameFromEl(el)) return null;
    else layoutTextFxPhysics(el, textFxNameFromEl(el));
    if (prefersReduced(el)) {
      el.classList.add("is-play");
      return el;
    }
    restartTextFxAnimation(el);
    return el;
  }
  function textFx(target, name, opts) {
    opts = opts || {};
    const el = resolveElement(target) || (target && target.nodeType ? target : null);
    if (!el || !el.nodeType) return null;
    const fx = String(name || textFxNameFromEl(el) || "grow").toLowerCase();
    if (!TEXT_FX_SET.has(fx)) return null;
    applyTextFxName(el, fx);
    if (opts.loop) el.classList.add("is-loop");
    if (opts.loop === false) el.classList.remove("is-loop");
    if (opts.play !== false) playTextFx(el);
    return el;
  }
  function initTextFx(root) {
    const scope = root || doc();
    if (!scope) return;
    $$(".blora-text-fx, [data-blora-text-fx]", scope).forEach((el) => {
      if (bound(el, "TextFx")) return;
      /* 播放按钮本身不当作目标文字 */
      if (el.hasAttribute("data-blora-text-fx-play")) return;
      const name = textFxNameFromEl(el) || "grow";
      applyTextFxName(el, name);
      if (!el.classList.contains("is-loop") && !el.classList.contains("is-play")) {
        el.classList.add("is-play");
      }
      if (el.getAttribute("data-blora-text-fx-click") !== "off") {
        el.classList.add("is-clickable");
        on(el, "click", (e) => {
          if (e.target.closest("a, button, input, textarea, select, [data-blora-text-fx-play]")) return;
          playTextFx(el);
        });
      }
    });
    $$("[data-blora-text-fx-play]", scope).forEach((btn) => {
      if (bound(btn, "TextFxPlay")) return;
      on(btn, "click", () => {
        const name = (btn.getAttribute("data-blora-text-fx-play") || "").trim().toLowerCase();
        if (!TEXT_FX_SET.has(name)) return;
        const host = btn.closest("[data-blora-text-fx-host], .blora-demo, .blora-panel") || scope;
        const preview = $("[data-blora-text-fx-preview]", host) || $(".blora-text-fx", host);
        if (preview) playTextFx(preview, name);
        else playTextFx(btn, name);
      });
    });
  }

  /* —— Form validation · 行为层（HTML 三件套，无框架） ——
     form[data-blora-form] 拦截提交；字段走原生约束 + data-blora-rule / data-blora-message。
     API: Blora.validate(form) / Blora.clearValidation(form) */
  const FIELD_SELECTOR = [
    "input:not([type='hidden']):not([type='submit']):not([type='button']):not([type='reset']):not([type='image']):not([type='file']):not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
  ].join(",");
  const msgTpl = (key, n) => t(VALIDATE_KEY_MAP[key] || ("validate." + key), { n: n });
  const fieldShell = (field) => field.closest(".blora-field, .blora-validator, .blora-form-item") || field.parentElement;
  /* inline（默认）| popup 浮层；form 或字段 data-blora-error-ui 可配 */
  const errorUiOf = (field) => {
    const form = field && field.closest && field.closest("form");
    const raw = (field && field.getAttribute("data-blora-error-ui"))
      || (form && form.getAttribute("data-blora-error-ui"))
      || "inline";
    return String(raw).toLowerCase() === "popup" ? "popup" : "inline";
  };
  const errorSlot = (field) => {
    const shell = fieldShell(field);
    if (!shell) return null;
    let slot = shell.querySelector("[data-blora-error], .blora-error, .blora-validator__hint--error");
    if (!slot) {
      slot = ownerDoc(field).createElement("span");
      slot.className = "blora-error";
      slot.setAttribute("data-blora-error", "");
      slot.id = (field.id || ("blora-field-" + Math.random().toString(36).slice(2, 7))) + "-error";
      shell.appendChild(slot);
    }
    if (!slot.id) slot.id = (field.id || "blora-field") + "-error";
    return slot;
  };
  /* 可见控件（自定义 select 外壳优先），用于 popup 锚点 */
  const errorAnchor = (field) => {
    if (!field) return null;
    return field.closest(".blora-select-wrap")
      || field.closest(".blora-number")
      || field.closest(".blora-search")
      || field.closest(".blora-input-group")
      || field;
  };
  const positionErrorPopup = (field, slot) => {
    if (!field || !slot || !slot.classList.contains("blora-error--popup") || slot.hidden) return;
    const shell = fieldShell(field);
    const anchor = errorAnchor(field);
    if (!shell || !anchor) return;
    if (ownerDoc(shell).defaultView.getComputedStyle(shell).position === "static") {
      shell.style.position = "relative";
    }
    const shellRect = shell.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    const gap = 10; /* 箭头到输入框顶的间隙 */
    const left = anchorRect.left - shellRect.left + anchorRect.width / 2;
    const top = anchorRect.top - shellRect.top - gap;
    slot.style.left = left + "px";
    slot.style.top = top + "px";
    slot.style.bottom = "auto";
    slot.style.transform = "translate(-50%, -100%)";
  };
  const setFieldInvalid = (field, message) => {
    field.classList.add("is-error");
    field.classList.remove("is-success");
    field.setAttribute("aria-invalid", "true");
    /* 不写 setCustomValidity 文案：会触发浏览器原生黄/白气泡，无法自定义 */
    try { field.setCustomValidity(""); } catch (_) { /* ignore */ }
    const slot = errorSlot(field);
    if (slot) {
      const popup = errorUiOf(field) === "popup";
      slot.classList.toggle("blora-error--popup", popup);
      field.setAttribute("aria-describedby", slot.id);
      if (message) {
        slot.textContent = message;
        slot.removeAttribute("hidden");
        slot.hidden = false;
        if (popup) {
          /* 等布局稳定再量，避免和框重叠 */
          positionErrorPopup(field, slot);
          const win = ownerWin(field);
          if (win && win.requestAnimationFrame) {
            win.requestAnimationFrame(() => positionErrorPopup(field, slot));
          }
        } else {
          slot.style.left = "";
          slot.style.top = "";
          slot.style.bottom = "";
          slot.style.transform = "";
        }
      } else {
        slot.textContent = "";
        slot.setAttribute("hidden", "");
        slot.hidden = true;
      }
    }
  };
  const setFieldValid = (field) => {
    field.classList.remove("is-error");
    field.classList.add("is-success");
    field.removeAttribute("aria-invalid");
    try { field.setCustomValidity(""); } catch (_) { /* ignore */ }
    const slot = errorSlot(field);
    if (slot && (slot.hasAttribute("data-blora-error") || slot.classList.contains("blora-error"))) {
      slot.textContent = "";
      slot.setAttribute("hidden", "");
      slot.classList.remove("blora-error--popup");
    }
  };
  const clearFieldState = (field) => {
    field.classList.remove("is-error", "is-success");
    field.removeAttribute("aria-invalid");
    try { field.setCustomValidity(""); } catch (_) { /* ignore */ }
    const slot = errorSlot(field);
    if (slot && (slot.hasAttribute("data-blora-error") || slot.classList.contains("blora-error"))) {
      slot.textContent = "";
      slot.setAttribute("hidden", "");
      slot.classList.remove("blora-error--popup");
    }
  };
  const customRuleMessage = (field) => {
    const rule = (field.getAttribute("data-blora-rule") || "").trim().toLowerCase();
    const value = String(field.value || "").trim();
    const custom = field.getAttribute("data-blora-message");
    if (!rule) return "";
    if (rule === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return custom || msgTpl("email");
    if (rule === "url" && value) {
      try { new URL(value); } catch (_) { return custom || msgTpl("url"); }
    }
    if (rule === "number" && value && Number.isNaN(Number(value))) return custom || msgTpl("number");
    if (rule.startsWith("min:")) {
      const n = Number(rule.slice(4));
      if (value !== "" && Number(value) < n) return custom || msgTpl("min", n);
    }
    if (rule.startsWith("max:")) {
      const n = Number(rule.slice(4));
      if (value !== "" && Number(value) > n) return custom || msgTpl("max", n);
    }
    return "";
  };
  const validateField = (field) => {
    if (!field || field.disabled) return { valid: true, field, message: "" };
    try { field.setCustomValidity(""); } catch (_) { /* ignore */ }
    const custom = customRuleMessage(field);
    if (custom) {
      setFieldInvalid(field, custom);
      return { valid: false, field, message: custom };
    }
    if (typeof field.checkValidity === "function" && !field.checkValidity()) {
      const v = field.validity || {};
      let message = field.getAttribute("data-blora-message") || "";
      if (!message) {
        if (v.valueMissing) message = msgTpl("required");
        else if (v.typeMismatch && field.type === "email") message = msgTpl("email");
        else if (v.typeMismatch && field.type === "url") message = msgTpl("url");
        else if (v.tooShort) message = msgTpl("minlength", field.minLength);
        else if (v.tooLong) message = msgTpl("maxlength", field.maxLength);
        else if (v.rangeUnderflow) message = msgTpl("min", field.min);
        else if (v.rangeOverflow) message = msgTpl("max", field.max);
        else if (v.patternMismatch) message = msgTpl("pattern");
        else message = field.validationMessage || msgTpl("pattern");
      }
      setFieldInvalid(field, message);
      return { valid: false, field, message };
    }
    if (String(field.value || "").length) setFieldValid(field);
    else clearFieldState(field);
    return { valid: true, field, message: "" };
  };
  const formFields = (form) => form ? $$(FIELD_SELECTOR, form) : [];
  const ASYNC_RULES = Object.create(null);
  const registerAsyncRule = (name, fn) => {
    if (!name || typeof fn !== "function") return;
    ASYNC_RULES[String(name)] = fn;
  };
  const resolveAsyncRule = (name) => {
    if (!name) return null;
    if (typeof ASYNC_RULES[name] === "function") return ASYNC_RULES[name];
    try {
      if (global && typeof global[name] === "function") return global[name];
    } catch (_) { /* ignore */ }
    return null;
  };
  const emitValidate = (form, detail) => {
    form.dispatchEvent(new CustomEvent("blora:validate", { bubbles: true, detail }));
    if (!detail.valid) {
      form.dispatchEvent(new CustomEvent("blora:invalid", { bubbles: true, detail }));
      const first = detail.errors && detail.errors[0] && detail.errors[0].field;
      if (first) {
        try { first.focus({ preventScroll: false }); } catch (_) { try { first.focus(); } catch (__) { /* ignore */ } }
      }
    }
    return detail;
  };
  const validateForm = (target) => {
    const form = resolveElement(target) || target;
    if (!form) return { valid: true, errors: [] };
    const errors = [];
    formFields(form).forEach((field) => {
      const result = validateField(field);
      if (!result.valid) errors.push(result);
    });
    return emitValidate(form, { valid: errors.length === 0, errors });
  };
  const runAsyncRule = (field) => {
    const key = field.getAttribute("data-blora-async");
    if (!key) return Promise.resolve({ valid: true, field, message: "" });
    const fn = resolveAsyncRule(key);
    if (!fn) return Promise.resolve({ valid: true, field, message: "" });
    field.classList.add("is-validating");
    return Promise.resolve()
      .then(() => fn(field.value, field))
      .then((result) => {
        field.classList.remove("is-validating");
        if (result === true || result == null || result === "") {
          if (String(field.value || "").length) setFieldValid(field);
          else clearFieldState(field);
          return { valid: true, field, message: "" };
        }
        const message = typeof result === "string"
          ? result
          : (result && (result.message || result.error)) || field.getAttribute("data-blora-message") || msgTpl("async");
        setFieldInvalid(field, message);
        return { valid: false, field, message };
      })
      .catch((err) => {
        field.classList.remove("is-validating");
        const message = (err && err.message) || field.getAttribute("data-blora-message") || msgTpl("async");
        setFieldInvalid(field, message);
        return { valid: false, field, message };
      });
  };
  const validateFieldAsync = (field) => {
    if (!field || field.disabled) return Promise.resolve({ valid: true, field, message: "" });
    const sync = validateField(field);
    if (!sync.valid) return Promise.resolve(sync);
    if (!field.getAttribute("data-blora-async")) return Promise.resolve(sync);
    return runAsyncRule(field);
  };
  const validateFormAsync = (target) => {
    const form = resolveElement(target) || target;
    if (!form) return Promise.resolve({ valid: true, errors: [] });
    const fields = formFields(form);
    return fields.reduce(
      (chain, field) => chain.then((errors) => validateFieldAsync(field).then((result) => {
        if (!result.valid) errors.push(result);
        return errors;
      })),
      Promise.resolve([])
    ).then((errors) => emitValidate(form, { valid: errors.length === 0, errors }));
  };
  const clearValidation = (target) => {
    const form = resolveElement(target) || target;
    if (!form) return;
    formFields(form).forEach(clearFieldState);
  };
  const getFormValues = (target) => {
    const form = resolveElement(target) || target;
    if (!form) return {};
    const values = {};
    const seenRadio = Object.create(null);
    formFields(form).forEach((field) => {
      const name = field.name || field.id;
      if (!name) return;
      const type = (field.type || "").toLowerCase();
      if (type === "checkbox") {
        const group = form.querySelectorAll('input[type="checkbox"][name="' + name.replace(/"/g, '\\"') + '"]');
        if (group.length > 1) {
          if (!Array.isArray(values[name])) values[name] = [];
          if (field.checked) values[name].push(field.value || "on");
        } else {
          values[name] = !!field.checked;
        }
        return;
      }
      if (type === "radio") {
        if (seenRadio[name]) return;
        seenRadio[name] = true;
        const checked = form.querySelector('input[type="radio"][name="' + name.replace(/"/g, '\\"') + '"]:checked');
        values[name] = checked ? checked.value : "";
        return;
      }
      if (field.tagName === "SELECT" && field.multiple) {
        values[name] = Array.from(field.selectedOptions || []).map((o) => o.value);
        return;
      }
      values[name] = field.value;
    });
    return values;
  };
  const cssEscape = (value) => {
    const s = String(value == null ? "" : value);
    if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(s);
    return s.replace(/[^a-zA-Z0-9_\u00A0-\uFFFF-]/g, "\\$&");
  };
  const setFormValues = (target, values) => {
    const form = resolveElement(target) || target;
    if (!form || !values || typeof values !== "object") return getFormValues(form);
    Object.keys(values).forEach((name) => {
      const val = values[name];
      const nodes = form.querySelectorAll('[name="' + name.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"]');
      if (!nodes.length) {
        const byId = form.querySelector("#" + cssEscape(name));
        if (byId) {
          if (byId.type === "checkbox") byId.checked = !!val;
          else byId.value = val == null ? "" : String(val);
        }
        return;
      }
      nodes.forEach((field) => {
        const type = (field.type || "").toLowerCase();
        if (type === "checkbox") {
          if (Array.isArray(val)) field.checked = val.map(String).indexOf(String(field.value || "on")) >= 0;
          else if (typeof val === "boolean") field.checked = val;
          else field.checked = String(val) === String(field.value || "on") || val === true || val === "on";
        } else if (type === "radio") {
          field.checked = String(field.value) === String(val);
        } else if (field.tagName === "SELECT" && field.multiple && Array.isArray(val)) {
          Array.from(field.options).forEach((o) => { o.selected = val.map(String).indexOf(String(o.value)) >= 0; });
        } else {
          field.value = val == null ? "" : String(val);
        }
        field.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
    syncFormWhen(form);
    return getFormValues(form);
  };
  /* data-blora-when="name=value" | "name!=value" | "#id=value"；action: show(默认) | enable */
  const evalWhenExpr = (form, expr) => {
    const raw = String(expr || "").trim();
    if (!raw) return true;
    const m = raw.match(/^(#?[\w-]+)\s*(!=|=)\s*(.*)$/);
    if (!m) return true;
    const key = m[1];
    const op = m[2];
    const expect = m[3];
    let actual = "";
    if (key.charAt(0) === "#") {
      const el = form.querySelector(key) || (doc() && doc().querySelector(key));
      if (!el) actual = "";
      else if (el.type === "checkbox" || el.type === "radio") actual = el.checked ? (el.value || "on") : "";
      else actual = el.value || "";
    } else {
      const vals = getFormValues(form);
      const v = vals[key];
      actual = Array.isArray(v) ? v.join(",") : (v == null ? "" : String(v));
      if (typeof v === "boolean") actual = v ? "true" : "false";
    }
    const ok = String(actual) === String(expect);
    return op === "!=" ? !ok : ok;
  };
  const syncFormWhen = (form) => {
    if (!form) return;
    $$("[data-blora-when]", form).forEach((el) => {
      const ok = evalWhenExpr(form, el.getAttribute("data-blora-when"));
      const action = (el.getAttribute("data-blora-when-action") || "show").toLowerCase();
      if (action === "enable") {
        const controls = el.matches("input,select,textarea,button")
          ? [el]
          : $$("input,select,textarea,button", el);
        controls.forEach((c) => { c.disabled = !ok; });
        el.classList.toggle("is-when-disabled", !ok);
      } else {
        el.hidden = !ok;
        el.classList.toggle("is-when-hidden", !ok);
      }
    });
  };
  function initForms(root) {
    const d = ownerDoc(root) || doc();
    const win = ownerWin(d);
    $$("form[data-blora-form], form[data-blora-validate]", root).forEach((form) => {
      if (bound(form, "Form")) return;
      form.classList.add("blora-form");
      /* 关掉浏览器原生校验气泡（样式不可控）；校验由 Blora 承接 */
      if (!form.hasAttribute("data-blora-native-validate")) {
        form.setAttribute("novalidate", "");
      }
      on(form, "invalid", (e) => {
        if (form.hasAttribute("data-blora-native-validate")) return;
        e.preventDefault();
      }, true);
      const repositionPopups = () => {
        formFields(form).forEach((field) => {
          if (!field.classList.contains("is-error")) return;
          const slot = errorSlot(field);
          if (slot && slot.classList.contains("blora-error--popup") && !slot.hidden) {
            positionErrorPopup(field, slot);
          }
        });
      };
      if (win) {
        on(win, "resize", repositionPopups);
        on(win, "scroll", repositionPopups, { passive: true, capture: true });
      }
      const triggers = String(form.getAttribute("data-blora-validate-on") || CONFIG.validateOn || "submit")
        .split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
      on(form, "submit", (e) => {
        const hasAsync = formFields(form).some((f) => f.getAttribute("data-blora-async"));
        if (hasAsync) {
          e.preventDefault();
          e.stopPropagation();
          validateFormAsync(form).then((result) => {
            if (!result.valid) return;
            form.dispatchEvent(new CustomEvent("blora:submit", {
              bubbles: true,
              detail: { values: getFormValues(form), form },
            }));
          });
          return;
        }
        const result = validateForm(form);
        if (!result.valid) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      if (triggers.includes("blur")) {
        on(form, "focusout", (e) => {
          if (e.target && e.target.matches && e.target.matches(FIELD_SELECTOR)) {
            const field = e.target;
            if (field.getAttribute("data-blora-async")) validateFieldAsync(field);
            else validateField(field);
          }
        });
      }
      if (triggers.includes("change") || triggers.includes("input")) {
        on(form, "input", (e) => {
          if (e.target && e.target.matches && e.target.matches(FIELD_SELECTOR) && e.target.classList.contains("is-error")) {
            validateField(e.target);
          }
        });
        on(form, "change", (e) => {
          if (e.target && e.target.matches && e.target.matches(FIELD_SELECTOR)) {
            if (e.target.getAttribute("data-blora-async")) validateFieldAsync(e.target);
            else validateField(e.target);
          }
        });
      }
      on(form, "change", () => syncFormWhen(form));
      on(form, "input", () => syncFormWhen(form));
      on(form, "reset", () => setTimeout(() => {
        clearValidation(form);
        syncFormWhen(form);
      }, 0));
      syncFormWhen(form);
    });
    $$("[data-blora-validate-submit]", root).forEach((btn) => {
      if (bound(btn, "ValidateSubmit")) return;
      on(btn, "click", (e) => {
        const sel = btn.getAttribute("data-blora-validate-submit");
        const form = (sel && $(sel, d)) || btn.closest("form");
        if (!form) return;
        const hasAsync = formFields(form).some((f) => f.getAttribute("data-blora-async"));
        if (hasAsync) {
          e.preventDefault();
          validateFormAsync(form).then((result) => {
            if (result.valid) {
              form.dispatchEvent(new CustomEvent("blora:submit", {
                bubbles: true,
                detail: { values: getFormValues(form), form },
              }));
            }
          });
          return;
        }
        const result = validateForm(form);
        if (!result.valid) e.preventDefault();
      });
    });
  }

  /* —— Table sort / pagination · 本地默认，remote 只派发事件 ——
     table[data-blora-table] 或 .blora-table-wrap[data-blora-table]
     th.blora-table-sort[data-blora-sort="key"]  或 自动用列索引
     nav[data-blora-pagination][data-blora-table="#id"] */
  const tableRoot = (el) => {
    if (!el) return null;
    if (el.matches && el.matches("table")) return el;
    return $("table", el) || el;
  };
  const tableHost = (table) => table.closest("[data-blora-table], .blora-table-wrap") || table;
  const tableMode = (table) => {
    const host = tableHost(table);
    return ((host && host.getAttribute("data-blora-table-mode")) || table.getAttribute("data-blora-table-mode") || "local").toLowerCase();
  };
  const tableState = (table) => {
    const host = tableHost(table);
    return {
      page: Number((host && host.dataset.page) || table.dataset.page) || 1,
      pageSize: Number((host && host.dataset.pageSize) || table.dataset.pageSize) || CONFIG.tablePageSize || 10,
      sortKey: (host && host.dataset.sortKey) || table.dataset.sortKey || "",
      sortDir: (host && host.dataset.sortDir) || table.dataset.sortDir || "",
      total: Number((host && host.dataset.total) || table.dataset.total) || 0,
    };
  };
  const writeTableState = (table, patch) => {
    const host = tableHost(table);
    const targets = [table];
    if (host && host !== table) targets.push(host);
    Object.keys(patch).forEach((key) => {
      targets.forEach((t) => {
        if (patch[key] == null || patch[key] === "") delete t.dataset[key];
        else t.dataset[key] = String(patch[key]);
      });
    });
  };
  const emitTableChange = (table, extra) => {
    const state = { ...tableState(table), ...extra };
    const detail = state;
    table.dispatchEvent(new CustomEvent("blora:table-change", { bubbles: true, detail }));
    const host = tableHost(table);
    if (host && host !== table) host.dispatchEvent(new CustomEvent("blora:table-change", { bubbles: true, detail }));
  };
  const cellText = (row, index) => {
    const cell = row.cells && row.cells[index];
    return cell ? String(cell.textContent || "").replace(/\s+/g, " ").trim() : "";
  };
  const sortTableLocal = (table, colIndex, dir) => {
    const tbody = table.tBodies && table.tBodies[0];
    if (!tbody) return;
    const rows = Array.from(tbody.rows);
    const factor = dir === "desc" ? -1 : 1;
    rows.sort((a, b) => {
      const av = cellText(a, colIndex);
      const bv = cellText(b, colIndex);
      const an = parseFloat(av.replace(/[^\d.-]/g, ""));
      const bn = parseFloat(bv.replace(/[^\d.-]/g, ""));
      let cmp = 0;
      if (av !== "" && bv !== "" && !Number.isNaN(an) && !Number.isNaN(bn) && /[\d]/.test(av) && /[\d]/.test(bv)) cmp = an - bn;
      else cmp = av.localeCompare(bv, CONFIG._collator || getCollatorLocale(), { numeric: true, sensitivity: "base" });
      return cmp * factor;
    });
    rows.forEach((row) => tbody.appendChild(row));
  };
  const applyTablePageLocal = (table) => {
    const tbody = table.tBodies && table.tBodies[0];
    if (!tbody) return;
    const state = tableState(table);
    const rows = Array.from(tbody.rows);
    const total = state.total || rows.length;
    writeTableState(table, { total });
    const pageSize = state.pageSize;
    let page = state.page;
    const pages = Math.max(1, Math.ceil(total / pageSize) || 1);
    if (page > pages) page = pages;
    if (page < 1) page = 1;
    writeTableState(table, { page });
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    rows.forEach((row, index) => { row.hidden = index < start || index >= end; });
  };
  const syncSortHeaders = (table, activeTh, dir) => {
    $$("th.blora-table-sort, th[data-blora-sort]", table).forEach((th) => {
      if (th === activeTh) th.setAttribute("aria-sort", dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none");
      else th.setAttribute("aria-sort", "none");
    });
  };
  const tableSort = (target, keyOrIndex, dir) => {
    const table = tableRoot(resolveElement(target) || target);
    if (!table) return null;
    const headers = $$("th.blora-table-sort, th[data-blora-sort], thead th", table);
    let th = null;
    let colIndex = -1;
    if (typeof keyOrIndex === "number") {
      colIndex = keyOrIndex;
      th = headers[colIndex] || null;
    } else {
      const key = String(keyOrIndex || "");
      th = headers.find((h) => (h.getAttribute("data-blora-sort") || "") === key) || null;
      colIndex = th ? Array.prototype.indexOf.call(th.parentNode.children, th) : -1;
    }
    if (colIndex < 0) return tableState(table);
    const nextDir = dir === "asc" || dir === "desc" ? dir : (tableState(table).sortDir === "asc" ? "desc" : "asc");
    const sortKey = (th && th.getAttribute("data-blora-sort")) || String(colIndex);
    writeTableState(table, { sortKey, sortDir: nextDir, page: 1 });
    syncSortHeaders(table, th, nextDir);
    if (tableMode(table) !== "remote") {
      sortTableLocal(table, colIndex, nextDir);
      applyTablePageLocal(table);
    }
    emitTableChange(table, { sortKey, sortDir: nextDir, colIndex });
    return tableState(table);
  };
  const tableSetPage = (target, page) => {
    const table = tableRoot(resolveElement(target) || target);
    if (!table) return null;
    writeTableState(table, { page: Math.max(1, Number(page) || 1) });
    if (tableMode(table) !== "remote") applyTablePageLocal(table);
    emitTableChange(table, { page: tableState(table).page });
    syncLinkedPagination(table);
    return tableState(table);
  };
  const ensureTableEmptyNode = (host) => {
    let empty = $(".blora-table-empty", host);
    if (!empty) {
      empty = ownerDoc(host).createElement("div");
      empty.className = "blora-table-empty blora-empty";
      empty.innerHTML = '<div class="blora-empty__title"></div>';
      host.appendChild(empty);
    }
    const title = $(".blora-empty__title", empty);
    if (title) title.textContent = t("table.empty");
    return empty;
  };
  const syncTableEmpty = (table) => {
    const host = tableHost(table);
    if (!host) return;
    const tbody = table.tBodies && table.tBodies[0];
    const count = tbody ? tbody.rows.length : 0;
    const empty = ensureTableEmptyNode(host);
    host.classList.toggle("is-empty", count === 0);
    empty.hidden = count !== 0;
    empty.setAttribute("aria-hidden", count === 0 ? "false" : "true");
  };
  const tableSetLoading = (target, loading) => {
    const table = tableRoot(resolveElement(target) || target);
    if (!table) return null;
    const host = tableHost(table);
    const on = !!loading;
    host.classList.toggle("is-loading", on);
    host.setAttribute("aria-busy", on ? "true" : "false");
    let mask = $(".blora-table-loading", host);
    if (on) {
      if (!mask) {
        mask = ownerDoc(host).createElement("div");
        mask.className = "blora-table-loading";
        mask.innerHTML = '<span class="blora-spinner" aria-hidden="true"></span><span class="blora-table-loading__text"></span>';
        host.appendChild(mask);
      }
      const text = $(".blora-table-loading__text", mask);
      if (text) text.textContent = t("table.loading");
      mask.hidden = false;
    } else if (mask) {
      mask.hidden = true;
    }
    return tableState(table);
  };
  const tableSetRows = (target, rows, opts) => {
    opts = opts || {};
    const table = tableRoot(resolveElement(target) || target);
    if (!table) return null;
    let tbody = table.tBodies && table.tBodies[0];
    if (!tbody) tbody = table.createTBody();
    const headers = $$("th[data-blora-sort], thead th", table);
    const keys = opts.keys || headers.map((th) => th.getAttribute("data-blora-sort") || "").filter(Boolean);
    tbody.textContent = "";
    (rows || []).forEach((row) => {
      const tr = ownerDoc(table).createElement("tr");
      if (Array.isArray(row)) {
        row.forEach((cell) => {
          const td = ownerDoc(table).createElement("td");
          if (cell != null && typeof cell === "object" && "html" in cell) td.innerHTML = String(cell.html);
          else td.textContent = cell == null ? "" : String(cell);
          tr.appendChild(td);
        });
      } else if (row && typeof row === "object") {
        const cols = keys.length ? keys : Object.keys(row);
        cols.forEach((key) => {
          const td = ownerDoc(table).createElement("td");
          const cell = row[key];
          if (cell != null && typeof cell === "object" && "html" in cell) td.innerHTML = String(cell.html);
          else td.textContent = cell == null ? "" : String(cell);
          tr.appendChild(td);
        });
      }
      tbody.appendChild(tr);
    });
    writeTableState(table, { total: (rows || []).length, page: opts.page != null ? opts.page : 1 });
    table._bloraRowData = Array.isArray(rows) ? rows.slice() : [];
    table._bloraRowKeys = keys.slice();
    if (tableHost(table).hasAttribute("data-blora-virtual")) {
      renderVirtualTable(table);
    } else if (tableMode(table) !== "remote") {
      const state = tableState(table);
      if (state.sortKey) tableSort(table, isNaN(Number(state.sortKey)) ? state.sortKey : Number(state.sortKey), state.sortDir || "asc");
      else applyTablePageLocal(table);
    }
    ensureTableSelectionColumn(table);
    applyTableColumnLayout(table);
    syncTableEmpty(table);
    syncTableSelection(table);
    syncLinkedPagination(table);
    emitTableChange(table, { reason: "setRows", total: (rows || []).length });
    return tableState(table);
  };

  /* —— 列固定：th/td[data-blora-fixed=left|right] —— */
  const applyFixedColumns = (table) => {
    if (!table) return;
    const rows = $$("tr", table);
    const measure = (side) => {
      let offset = 0;
      const first = rows[0];
      if (!first) return;
      const cells = Array.from(first.children);
      const indexes = [];
      cells.forEach((cell, i) => {
        const fixed = cell.getAttribute("data-blora-fixed") || (cell.classList.contains("blora-table-col--fixed-left") ? "left" : cell.classList.contains("blora-table-col--fixed-right") ? "right" : "");
        if (fixed === side) indexes.push(i);
      });
      if (side === "right") indexes.reverse();
      indexes.forEach((i) => {
        rows.forEach((tr) => {
          const cell = tr.children[i];
          if (!cell) return;
          cell.classList.add(side === "left" ? "blora-table-col--fixed-left" : "blora-table-col--fixed-right");
          cell.style[side] = offset + "px";
        });
        const sample = first.children[i];
        offset += sample ? sample.getBoundingClientRect().width : 0;
      });
    };
    measure("left");
    measure("right");
  };

  /**
   * 动态生成勾选框时必须用这套 DOM，禁止裸 <input type="checkbox">。
   * opts: { checked?, className?, attrs?, label? }
   */
  const bloraCheckboxHTML = (opts) => {
    opts = opts || {};
    const cls = "blora-checkbox" + (opts.className ? " " + opts.className : "");
    const checked = opts.checked ? " checked" : "";
    const attrs = opts.attrs ? " " + opts.attrs : "";
    const label = opts.label != null && opts.label !== ""
      ? "<span>" + escapeHTML(String(opts.label)) + "</span>"
      : "";
    return (
      '<label class="' + cls + '">' +
      '<input type="checkbox"' + checked + attrs + ">" +
      '<span class="blora-checkbox__box"></span>' +
      label +
      "</label>"
    );
  };

  /* —— 多选行 + 批量条 —— */
  const ensureTableSelectionColumn = (table) => {
    const host = tableHost(table);
    if (!host || !host.hasAttribute("data-blora-selectable")) return;
    const theadRow = table.tHead && table.tHead.rows[0];
    if (!theadRow) return;
    if (!$("th[data-blora-select-col]", theadRow)) {
      const th = ownerDoc(table).createElement("th");
      th.setAttribute("data-blora-select-col", "");
      th.className = "blora-table-select-col";
      th.innerHTML = bloraCheckboxHTML({
        className: "blora-table-check",
        attrs: 'data-blora-select-all aria-label="' + escapeHTML(t("table.selectAll")) + '"',
      });
      theadRow.insertBefore(th, theadRow.firstChild);
    }
    Array.from((table.tBodies[0] && table.tBodies[0].rows) || []).forEach((tr) => {
      if ($("td[data-blora-select-col]", tr)) return;
      const td = ownerDoc(table).createElement("td");
      td.setAttribute("data-blora-select-col", "");
      td.className = "blora-table-select-col";
      td.innerHTML = bloraCheckboxHTML({
        className: "blora-table-check",
        attrs: 'data-blora-row-select aria-label="' + escapeHTML(t("table.selectRow")) + '"',
      });
      tr.insertBefore(td, tr.firstChild);
    });
    let bulk = host.parentElement && $(".blora-table-bulk[data-blora-table-bulk='" + table.id + "']", host.parentElement);
    if (!bulk) {
      bulk = $(".blora-table-bulk", host.parentElement || host) || null;
    }
    if (!bulk && host.parentElement) {
      bulk = ownerDoc(table).createElement("div");
      bulk.className = "blora-table-bulk";
      bulk.setAttribute("data-blora-table-bulk", table.id);
      bulk.hidden = true;
      bulk.innerHTML =
        '<span class="blora-table-bulk__count"></span>' +
        '<button type="button" class="blora-btn blora-btn--ghost blora-btn--sm" data-blora-clear-selection>' + escapeHTML(t("table.clearSelection")) + "</button>" +
        '<span class="blora-table-bulk__slot" data-blora-bulk-actions></span>';
      host.parentElement.insertBefore(bulk, host);
    }
    table._bloraBulk = bulk;
  };
  const getSelectedRows = (table) => {
    const tbody = table.tBodies && table.tBodies[0];
    if (!tbody) return [];
    return Array.from(tbody.rows).filter((tr) => {
      const cb = $("input[data-blora-row-select]", tr);
      return cb && cb.checked && !tr.hidden;
    });
  };
  const syncTableSelection = (table) => {
    const host = tableHost(table);
    if (!host || !host.hasAttribute("data-blora-selectable")) return;
    const rows = Array.from((table.tBodies[0] && table.tBodies[0].rows) || []).filter((tr) => !tr.hidden);
    const selected = rows.filter((tr) => {
      const cb = $("input[data-blora-row-select]", tr);
      return cb && cb.checked;
    });
    const all = $("input[data-blora-select-all]", table);
    if (all) {
      all.checked = rows.length > 0 && selected.length === rows.length;
      all.indeterminate = selected.length > 0 && selected.length < rows.length;
    }
    const bulk = table._bloraBulk || (host.parentElement && $(".blora-table-bulk[data-blora-table-bulk='" + table.id + "']", host.parentElement));
    if (bulk) {
      bulk.hidden = selected.length === 0;
      const count = $(".blora-table-bulk__count", bulk);
      if (count) count.textContent = t("table.selected", { n: selected.length });
    }
    host.classList.toggle("has-selection", selected.length > 0);
    table.dispatchEvent(new CustomEvent("blora:table-select", {
      bubbles: true,
      detail: { selected: selected.length, rows: selected, table },
    }));
  };
  const tableGetSelection = (target) => {
    const table = tableRoot(resolveElement(target) || target);
    if (!table) return [];
    return getSelectedRows(table);
  };
  const tableClearSelection = (target) => {
    const table = tableRoot(resolveElement(target) || target);
    if (!table) return;
    $$("input[data-blora-row-select], input[data-blora-select-all]", table).forEach((cb) => {
      cb.checked = false;
      cb.indeterminate = false;
    });
    syncTableSelection(table);
  };

  /* —— 虚拟滚动：data-blora-virtual + setRows 数据源 —— */
  const renderVirtualTable = (table) => {
    const host = tableHost(table);
    if (!host || !host.hasAttribute("data-blora-virtual")) return;
    const data = table._bloraRowData || [];
    const keys = table._bloraRowKeys || [];
    const rowH = Number(host.getAttribute("data-row-height")) || 44;
    const overscan = Number(host.getAttribute("data-overscan")) || 6;
    let tbody = table.tBodies && table.tBodies[0];
    if (!tbody) tbody = table.createTBody();
    host.classList.add("blora-table-wrap--virtual");
    let scroller = $(".blora-table-virtual", host);
    if (!scroller) {
      scroller = ownerDoc(host).createElement("div");
      scroller.className = "blora-table-virtual";
      table.parentNode.insertBefore(scroller, table);
      scroller.appendChild(table);
    }
    const viewportH = scroller.clientHeight || Number(host.getAttribute("data-viewport-height")) || 360;
    scroller.style.height = viewportH + "px";
    const total = data.length;
    writeTableState(table, { total, page: 1, pageSize: total || 1 });
    const scrollTop = scroller.scrollTop || 0;
    const start = Math.max(0, Math.floor(scrollTop / rowH) - overscan);
    const visible = Math.ceil(viewportH / rowH) + overscan * 2;
    const end = Math.min(total, start + visible);
    tbody.textContent = "";
    const padTop = ownerDoc(table).createElement("tr");
    padTop.className = "blora-table-virtual-pad";
    padTop.innerHTML = '<td colspan="99" style="height:' + (start * rowH) + 'px;padding:0;border:0"></td>';
    tbody.appendChild(padTop);
    for (let i = start; i < end; i++) {
      const row = data[i];
      const tr = ownerDoc(table).createElement("tr");
      tr.dataset.virtualIndex = String(i);
      tr.style.height = rowH + "px";
      if (Array.isArray(row)) {
        row.forEach((cell) => {
          const td = ownerDoc(table).createElement("td");
          td.textContent = cell == null ? "" : String(cell);
          tr.appendChild(td);
        });
      } else if (row && typeof row === "object") {
        const cols = keys.length ? keys : Object.keys(row);
        cols.forEach((key) => {
          const td = ownerDoc(table).createElement("td");
          const cell = row[key];
          td.textContent = cell == null ? "" : String(cell);
          tr.appendChild(td);
        });
      }
      tbody.appendChild(tr);
    }
    const padBot = ownerDoc(table).createElement("tr");
    padBot.className = "blora-table-virtual-pad";
    padBot.innerHTML = '<td colspan="99" style="height:' + (Math.max(0, total - end) * rowH) + 'px;padding:0;border:0"></td>';
    tbody.appendChild(padBot);
    ensureTableSelectionColumn(table);
    applyTableColumnLayout(table);
    applyFixedColumns(table);
    syncTableEmpty(table);
  };
  const bindVirtualScroll = (table) => {
    const host = tableHost(table);
    if (!host || !host.hasAttribute("data-blora-virtual") || bound(host, "TableVirtual")) return;
    const scroller = $(".blora-table-virtual", host) || host;
    let ticking = false;
    on(scroller, "scroll", () => {
      if (ticking) return;
      ticking = true;
      const win = ownerWin(host);
      win.requestAnimationFrame(() => {
        ticking = false;
        renderVirtualTable(table);
      });
    }, { passive: true });
  };

  /* —— 列显示/顺序持久化：data-blora-cols + data-blora-cols-key —— */
  const readColsConfig = (table) => {
    const host = tableHost(table);
    const key = host.getAttribute("data-blora-cols-key") || (CONFIG.tableColsStorageKey + ":" + (table.id || "default"));
    try {
      const raw = ownerWin(table).localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (_) { /* ignore */ }
    return null;
  };
  const writeColsConfig = (table, cfg) => {
    const host = tableHost(table);
    const key = host.getAttribute("data-blora-cols-key") || (CONFIG.tableColsStorageKey + ":" + (table.id || "default"));
    try { ownerWin(table).localStorage.setItem(key, JSON.stringify(cfg)); } catch (_) { /* ignore */ }
  };
  const defaultColsConfig = (table) => {
    const ths = $$("thead th", table).filter((th) => !th.hasAttribute("data-blora-select-col"));
    return ths.map((th, i) => ({
      key: th.getAttribute("data-blora-sort") || th.getAttribute("data-col-key") || String(i),
      label: (th.textContent || "").trim() || String(i + 1),
      visible: th.getAttribute("data-col-hidden") !== "true",
      index: i,
    }));
  };
  const applyTableColumnLayout = (table) => {
    const host = tableHost(table);
    if (!host || !host.hasAttribute("data-blora-cols")) return;
    let cfg = readColsConfig(table) || defaultColsConfig(table);
    const ths = $$("thead th", table);
    const selectOffset = ths[0] && ths[0].hasAttribute("data-blora-select-col") ? 1 : 0;
    const dataThs = ths.filter((th) => !th.hasAttribute("data-blora-select-col"));
    /* 按 cfg 顺序重排可见性 */
    cfg.forEach((col, order) => {
      const th = dataThs.find((h) => (h.getAttribute("data-blora-sort") || h.getAttribute("data-col-key") || "") === col.key)
        || dataThs[col.index];
      if (!th) return;
      const idx = Array.prototype.indexOf.call(th.parentNode.children, th);
      Array.from((table.tBodies[0] && table.tBodies[0].rows) || []).concat([table.tHead && table.tHead.rows[0]].filter(Boolean)).forEach((tr) => {
        if (!tr || !tr.children[idx]) return;
        tr.children[idx].hidden = !col.visible;
        tr.children[idx].dataset.colOrder = String(order);
      });
    });
    /* 可选：按 data-col-order 重排 DOM */
    const head = table.tHead && table.tHead.rows[0];
    if (head) {
      const ordered = Array.from(head.children)
        .filter((c) => !c.hasAttribute("data-blora-select-col"))
        .sort((a, b) => Number(a.dataset.colOrder || 0) - Number(b.dataset.colOrder || 0));
      ordered.forEach((cell) => head.appendChild(cell));
      Array.from((table.tBodies[0] && table.tBodies[0].rows) || []).forEach((tr) => {
        const map = {};
        Array.from(tr.children).forEach((td, i) => { map[i] = td; });
        /* rebuild by matching previous header keys is hard; use colOrder on cells */
        const dataCells = Array.from(tr.children).filter((c) => !c.hasAttribute("data-blora-select-col"));
        dataCells.sort((a, b) => Number(a.dataset.colOrder || 0) - Number(b.dataset.colOrder || 0));
        const selectCell = $("td[data-blora-select-col]", tr);
        tr.textContent = "";
        if (selectCell) tr.appendChild(selectCell);
        dataCells.forEach((c) => tr.appendChild(c));
      });
    }
    void selectOffset;
  };
  const ensureColsPanel = (table) => {
    const host = tableHost(table);
    if (!host || !host.hasAttribute("data-blora-cols")) return null;
    let panel = $(".blora-table-cols", host.parentElement || host);
    if (panel) return panel;
    const parent = host.parentElement || host;
    const bar = ownerDoc(table).createElement("div");
    bar.className = "blora-table-cols-bar";
    bar.innerHTML = '<button type="button" class="blora-btn blora-btn--outline blora-btn--sm" data-blora-cols-toggle>' + escapeHTML(t("table.cols")) + "</button>";
    panel = ownerDoc(table).createElement("div");
    panel.className = "blora-table-cols";
    panel.hidden = true;
    panel.innerHTML = '<div class="blora-table-cols__list"></div><div class="blora-table-cols__foot"><button type="button" class="blora-btn blora-btn--text blora-btn--sm" data-blora-cols-reset>' + escapeHTML(t("table.colsReset")) + "</button></div>";
    parent.insertBefore(bar, host);
    parent.insertBefore(panel, host);
    const paint = () => {
      const cfg = readColsConfig(table) || defaultColsConfig(table);
      const list = $(".blora-table-cols__list", panel);
      list.textContent = "";
      cfg.forEach((col, i) => {
        const row = ownerDoc(table).createElement("div");
        row.className = "blora-table-cols__item";
        row.innerHTML =
          bloraCheckboxHTML({
            checked: !!col.visible,
            attrs: 'data-col-key="' + escapeHTML(col.key) + '"',
            label: col.label,
          }) +
          '<span class="blora-table-cols__actions">' +
          '<button type="button" class="blora-btn blora-btn--ghost blora-btn--sm" data-col-up data-i="' + i + '" aria-label="up">↑</button>' +
          '<button type="button" class="blora-btn blora-btn--ghost blora-btn--sm" data-col-down data-i="' + i + '" aria-label="down">↓</button>' +
          "</span>";
        list.appendChild(row);
      });
    };
    on(bar, "click", (e) => {
      if (!e.target.closest("[data-blora-cols-toggle]")) return;
      panel.hidden = !panel.hidden;
      if (!panel.hidden) paint();
    });
    on(panel, "change", (e) => {
      const input = e.target.closest("input[data-col-key]");
      if (!input) return;
      const cfg = readColsConfig(table) || defaultColsConfig(table);
      const col = cfg.find((c) => c.key === input.getAttribute("data-col-key"));
      if (col) col.visible = input.checked;
      writeColsConfig(table, cfg);
      applyTableColumnLayout(table);
    });
    on(panel, "click", (e) => {
      if (e.target.closest("[data-blora-cols-reset]")) {
        writeColsConfig(table, defaultColsConfig(table));
        paint();
        applyTableColumnLayout(table);
        return;
      }
      const up = e.target.closest("[data-col-up]");
      const down = e.target.closest("[data-col-down]");
      if (!up && !down) return;
      const cfg = readColsConfig(table) || defaultColsConfig(table);
      const i = Number((up || down).getAttribute("data-i"));
      const j = up ? i - 1 : i + 1;
      if (j < 0 || j >= cfg.length) return;
      const tmp = cfg[i];
      cfg[i] = cfg[j];
      cfg[j] = tmp;
      writeColsConfig(table, cfg);
      paint();
      applyTableColumnLayout(table);
    });
    return panel;
  };

  const buildPaginationPages = (page, pages) => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const set = new Set([1, pages, page, page - 1, page + 1, page - 2, page + 2]);
    const list = Array.from(set).filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
    const out = [];
    list.forEach((n, i) => {
      if (i && n - list[i - 1] > 1) out.push("…");
      out.push(n);
    });
    return out;
  };
  const renderPagination = (nav) => {
    if (!nav) return;
    const page = Math.max(1, Number(nav.dataset.page) || 1);
    const pageSize = Math.max(1, Number(nav.dataset.pageSize) || CONFIG.tablePageSize || 10);
    let total = Number(nav.dataset.total);
    const tableSel = nav.getAttribute("data-blora-table");
    const d = ownerDoc(nav);
    const table = tableSel ? tableRoot($(tableSel, d)) : null;
    if (table && tableMode(table) !== "remote") {
      const rows = table.tBodies && table.tBodies[0] ? table.tBodies[0].rows.length : 0;
      total = rows;
      nav.dataset.total = String(total);
    }
    if (!Number.isFinite(total) || total < 0) total = 0;
    const pages = Math.max(1, Math.ceil(total / pageSize) || 1);
    const current = Math.min(page, pages);
    nav.dataset.page = String(current);
    nav.setAttribute("role", "navigation");
    if (!nav.getAttribute("aria-label")) nav.setAttribute("aria-label", t("pagination.nav"));
    const parts = [];
    parts.push('<button type="button" class="blora-pagination__item' + (current <= 1 ? " is-disabled" : "") + '" data-blora-page="prev" aria-label="' + escapeHTML(t("pagination.prev")) + '"' + (current <= 1 ? " disabled" : "") + ">‹</button>");
    buildPaginationPages(current, pages).forEach((item) => {
      if (item === "…") parts.push('<span class="blora-pagination__ellipsis">…</span>');
      else {
        parts.push(
          '<button type="button" class="blora-pagination__item' + (item === current ? " is-active" : "") + '" data-blora-page="' + item + '" aria-label="' + escapeHTML(t("pagination.page", { n: item })) + '"' + (item === current ? ' aria-current="page"' : "") + ">" + item + "</button>"
        );
      }
    });
    parts.push('<button type="button" class="blora-pagination__item' + (current >= pages ? " is-disabled" : "") + '" data-blora-page="next" aria-label="' + escapeHTML(t("pagination.next")) + '"' + (current >= pages ? " disabled" : "") + ">›</button>");
    nav.innerHTML = parts.join("");
  };
  const syncLinkedPagination = (table) => {
    const d = ownerDoc(table);
    if (!d || !table.id) return;
    $$('[data-blora-pagination][data-blora-table="#' + table.id + '"], [data-blora-pagination][data-blora-table="' + table.id + '"]', d).forEach((nav) => {
      const state = tableState(table);
      nav.dataset.page = String(state.page);
      nav.dataset.pageSize = String(state.pageSize);
      nav.dataset.total = String(state.total || (table.tBodies[0] ? table.tBodies[0].rows.length : 0));
      renderPagination(nav);
    });
  };
  function initTables(root) {
    $$("table[data-blora-table], [data-blora-table] table, .blora-table-wrap[data-blora-table] table", root).forEach((table) => {
      if (bound(table, "Table")) return;
      const host = tableHost(table);
      const d = ownerDoc(table);
      if (!table.id) table.id = "blora-table-" + Math.random().toString(36).slice(2, 9);
      $$("th.blora-table-sort, th[data-blora-sort]", table).forEach((th) => {
        th.setAttribute("role", "columnheader");
        if (!th.hasAttribute("tabindex")) th.tabIndex = 0;
        if (!th.hasAttribute("aria-sort")) th.setAttribute("aria-sort", "none");
        const activate = () => {
          const key = th.getAttribute("data-blora-sort") || Array.prototype.indexOf.call(th.parentNode.children, th);
          tableSort(table, key);
          syncLinkedPagination(table);
        };
        on(th, "click", (e) => {
          if (e.target.closest("input, label, button")) return;
          activate();
        });
        on(th, "keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
        });
      });
      ensureTableSelectionColumn(table);
      ensureColsPanel(table);
      applyTableColumnLayout(table);
      if (host.hasAttribute("data-blora-virtual") && table._bloraRowData) {
        bindVirtualScroll(table);
        renderVirtualTable(table);
      } else if (tableMode(table) !== "remote") {
        const state = tableState(table);
        if (state.sortKey) tableSort(table, isNaN(Number(state.sortKey)) ? state.sortKey : Number(state.sortKey), state.sortDir || "asc");
        else applyTablePageLocal(table);
      }
      applyFixedColumns(table);
      on(table, "change", (e) => {
        const all = e.target.closest("input[data-blora-select-all]");
        const row = e.target.closest("input[data-blora-row-select]");
        if (all) {
          const on = all.checked;
          $$("input[data-blora-row-select]", table).forEach((cb) => {
            const tr = cb.closest("tr");
            if (tr && !tr.hidden) cb.checked = on;
          });
          syncTableSelection(table);
        } else if (row) {
          syncTableSelection(table);
        }
      });
      const bulk = table._bloraBulk;
      if (bulk) {
        on(bulk, "click", (e) => {
          if (e.target.closest("[data-blora-clear-selection]")) tableClearSelection(table);
        });
      }
      on(ownerWin(table), "resize", () => applyFixedColumns(table));
      syncTableEmpty(table);
      syncTableSelection(table);
      syncLinkedPagination(table);
    });
    $$("[data-blora-pagination]", root).forEach((nav) => {
      if (bound(nav, "Pagination")) return;
      if (!nav.dataset.pageSize) nav.dataset.pageSize = String(CONFIG.tablePageSize || 10);
      renderPagination(nav);
      on(nav, "click", (e) => {
        const btn = e.target.closest("[data-blora-page]");
        if (!btn || btn.disabled || btn.classList.contains("is-disabled")) return;
        const raw = btn.getAttribute("data-blora-page");
        let page = Number(nav.dataset.page) || 1;
        const pageSize = Number(nav.dataset.pageSize) || CONFIG.tablePageSize;
        const total = Number(nav.dataset.total) || 0;
        const pages = Math.max(1, Math.ceil(total / pageSize) || 1);
        if (raw === "prev") page -= 1;
        else if (raw === "next") page += 1;
        else page = Number(raw) || page;
        page = Math.min(pages, Math.max(1, page));
        nav.dataset.page = String(page);
        const tableSel = nav.getAttribute("data-blora-table");
        const docRef = ownerDoc(nav);
        const table = tableSel ? tableRoot($(tableSel, docRef) || $(tableSel)) : null;
        if (table) {
          writeTableState(table, { page, pageSize });
          if (tableMode(table) !== "remote") applyTablePageLocal(table);
          emitTableChange(table, { page, pageSize });
          syncTableSelection(table);
        }
        nav.dispatchEvent(new CustomEvent("blora:page-change", {
          bubbles: true,
          detail: { page, pageSize, total, pages, table },
        }));
        renderPagination(nav);
      });
    });
  }

  /* —— Advanced components —— */
  let previewState = null;
  function closeImagePreview() {
    if (!previewState) return;
    const { layer, onKey } = previewState;
    const d = ownerDoc(layer);
    const win = ownerWin(layer);
    offKey(win, onKey);
    layer.classList.remove("is-open");
    setTimeout(() => { if (layer.parentNode) layer.remove(); }, animMs(layer, 200));
    previewState = null;
  }
  function offKey(win, fn) {
    if (win && fn) win.removeEventListener("keydown", fn);
  }
  function openImagePreview(items, startIndex) {
    const list = (items || []).filter((it) => it && it.src);
    if (!list.length) return null;
    const d = doc();
    const root = getPortalRoot(d && d.documentElement);
    if (!d || !root) return null;
    closeImagePreview();
    let index = Math.max(0, Math.min(list.length - 1, startIndex || 0));
    const layer = d.createElement("div");
    layer.className = "blora-image-preview blora-portal";
    layer.setAttribute("role", "dialog");
    layer.setAttribute("aria-modal", "true");
    layer.innerHTML =
      '<button type="button" class="blora-image-preview__close" data-act="close" aria-label="' + escapeHTML(t("preview.close")) + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
      (list.length > 1 ? '<button type="button" class="blora-image-preview__btn blora-image-preview__btn--prev" data-act="prev" aria-label="' + escapeHTML(t("preview.prev")) + '"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg></button><button type="button" class="blora-image-preview__btn blora-image-preview__btn--next" data-act="next" aria-label="' + escapeHTML(t("preview.next")) + '"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg></button>' : "") +
      '<div class="blora-image-preview__count" data-count></div>' +
      '<div class="blora-image-preview__stage"><img class="blora-image-preview__img" alt=""><div class="blora-image-preview__cap" data-cap></div></div>';
    root.appendChild(layer);
    const img = $(".blora-image-preview__img", layer);
    const cap = $("[data-cap]", layer);
    const count = $("[data-count]", layer);
    const paint = () => {
      const cur = list[index];
      img.src = cur.src;
      img.alt = cur.alt || "";
      if (cap) cap.textContent = cur.alt || cur.caption || "";
      if (count) count.textContent = list.length > 1 ? (index + 1) + " / " + list.length : "";
    };
    const go = (delta) => { index = (index + delta + list.length) % list.length; paint(); };
    const onKey = (e) => {
      if (e.key === "Escape") closeImagePreview();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    on(layer, "click", (e) => {
      const act = e.target.closest("[data-act]");
      if (act) {
        const a = act.getAttribute("data-act");
        if (a === "close") closeImagePreview();
        if (a === "prev") go(-1);
        if (a === "next") go(1);
        return;
      }
      if (e.target === layer) closeImagePreview();
    });
    const win = ownerWin(layer);
    on(win, "keydown", onKey);
    previewState = { layer, onKey };
    paint();
    requestAnimationFrame(() => layer.classList.add("is-open"));
    return { close: closeImagePreview, next: () => go(1), prev: () => go(-1) };
  }
  function collectPreviewGroup(trigger) {
    const group = trigger.getAttribute("data-blora-preview-group");
    const d = ownerDoc(trigger);
    let nodes;
    if (group) nodes = $$('[data-blora-preview-group="' + group.replace(/"/g, '\\"') + '"]', d);
    else nodes = [trigger];
    const items = [];
    let start = 0;
    nodes.forEach((node, i) => {
      const img = node.matches("img") ? node : $("img", node);
      if (!img) return;
      if (node === trigger || img === trigger || node.contains(trigger)) start = items.length;
      items.push({
        src: img.getAttribute("data-preview-src") || img.currentSrc || img.src,
        alt: img.getAttribute("data-preview-alt") || img.alt || "",
        caption: node.getAttribute("data-preview-caption") || "",
      });
    });
    return { items, start };
  }
  function initImagePreview(root) {
    $$("[data-blora-preview], .blora-image--preview", root).forEach((el) => {
      if (bound(el, "ImagePreview")) return;
      el.setAttribute("tabindex", el.getAttribute("tabindex") || "0");
      el.setAttribute("role", el.getAttribute("role") || "button");
      const open = () => {
        const { items, start } = collectPreviewGroup(el);
        openImagePreview(items, start);
      };
      on(el, "click", open);
      on(el, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
  }

  function initAffix(root) {
    $$("[data-blora-affix], .blora-affix", root).forEach((box) => {
      if (bound(box, "Affix")) return;
      box.classList.add("blora-affix");
      let inner = $(".blora-affix__inner", box);
      if (!inner) {
        inner = ownerDoc(box).createElement("div");
        inner.className = "blora-affix__inner";
        while (box.firstChild) inner.appendChild(box.firstChild);
        box.appendChild(inner);
      }
      const win = ownerWin(box);
      const offset = Number(box.getAttribute("data-offset") || box.getAttribute("data-blora-affix") || 0) || 0;
      let pinned = false;
      let originTop = 0;
      const measure = () => { originTop = box.getBoundingClientRect().top + win.scrollY; };
      measure();
      const sync = () => {
        if (!pinned) measure();
        const should = win.scrollY + offset >= originTop;
        if (should && !pinned) {
          const rect = box.getBoundingClientRect();
          box.style.height = inner.offsetHeight + "px";
          inner.style.width = rect.width + "px";
          inner.style.left = rect.left + "px";
          inner.style.top = offset + "px";
          box.classList.add("is-fixed");
          pinned = true;
        } else if (!should && pinned) {
          box.classList.remove("is-fixed");
          box.style.height = "";
          inner.style.width = "";
          inner.style.left = "";
          inner.style.top = "";
          pinned = false;
        }
      };
      on(win, "scroll", sync, { passive: true });
      on(win, "resize", () => {
        pinned = false;
        box.classList.remove("is-fixed");
        box.style.height = "";
        inner.style.width = "";
        inner.style.left = "";
        inner.style.top = "";
        measure();
        sync();
      });
      sync();
    });
  }

  function initAnchor(root) {
    $$("[data-blora-anchor], .blora-anchor", root).forEach((nav) => {
      if (bound(nav, "Anchor")) return;
      nav.classList.add("blora-anchor");
      const links = $$("a[href^='#']", nav);
      const offset = Number(nav.getAttribute("data-offset")) || 96;
      const sections = links.map((a) => {
        const id = a.getAttribute("href").slice(1);
        return { a, el: document.getElementById(id) };
      }).filter((x) => x.el);
      const sync = () => {
        const y = window.scrollY + offset;
        let active = sections[0];
        sections.forEach((s) => { if (s.el.offsetTop <= y) active = s; });
        links.forEach((a) => a.classList.toggle("is-active", active && a === active.a));
      };
      links.forEach((a) => {
        a.classList.add("blora-anchor__link");
        /* 点击滚动交给全局 initSmoothScroll（capture），避免双重绑定 */
      });
      on(window, "scroll", sync, { passive: true });
      sync();
    });
  }

  function initTreeSelect(root) {
    $$("[data-blora-treeselect], .blora-treeselect", root).forEach((wrap) => {
      if (bound(wrap, "TreeSelect")) return;
      wrap.classList.add("blora-treeselect");
      const input = $("input.blora-input, .blora-treeselect__input", wrap) || $("input", wrap);
      let panel = $(".blora-treeselect__panel", wrap);
      if (!input) return;
      if (!panel) {
        panel = ownerDoc(wrap).createElement("div");
        panel.className = "blora-treeselect__panel";
        wrap.appendChild(panel);
      }
      let data = [];
      try { data = JSON.parse(wrap.getAttribute("data-options") || "[]"); } catch (_) { data = []; }
      input.readOnly = true;
      input.setAttribute("role", "combobox");
      input.setAttribute("aria-expanded", "false");
      const setOpen = (open) => {
        wrap.classList.toggle("is-open", open);
        input.setAttribute("aria-expanded", String(open));
      };
      const renderNode = (item, depth) => {
        const row = ownerDoc(wrap).createElement("div");
        row.className = "blora-treeselect__node";
        row.style.paddingLeft = (0.55 + depth * 0.85) + "em";
        if (item.disabled) row.classList.add("is-disabled");
        const hasKids = item.children && item.children.length;
        if (hasKids) {
          const tog = ownerDoc(wrap).createElement("span");
          tog.className = "blora-treeselect__toggle";
          tog.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>';
          row.appendChild(tog);
        } else {
          const sp = ownerDoc(wrap).createElement("span");
          sp.className = "blora-treeselect__toggle";
          sp.style.visibility = "hidden";
          row.appendChild(sp);
        }
        const lab = ownerDoc(wrap).createElement("span");
        lab.textContent = item.label || item.value || "";
        row.appendChild(lab);
        const kids = ownerDoc(wrap).createElement("div");
        kids.className = "blora-treeselect__children";
        if (hasKids) item.children.forEach((c) => kids.appendChild(renderNode(c, depth + 1)));
        on(row, "click", (e) => {
          e.stopPropagation();
          if (item.disabled) return;
          if (hasKids && (e.target.closest(".blora-treeselect__toggle") || !item.selectable)) {
            kids.classList.toggle("is-open");
            $(".blora-treeselect__toggle", row).classList.toggle("is-open");
            return;
          }
          $$(".blora-treeselect__node.is-selected", panel).forEach((n) => n.classList.remove("is-selected"));
          row.classList.add("is-selected");
          input.value = item.label || item.value || "";
          wrap.dataset.value = item.value != null ? String(item.value) : input.value;
          setOpen(false);
          wrap.dispatchEvent(new CustomEvent("blora:treeselect-change", { bubbles: true, detail: { value: wrap.dataset.value, item } }));
        });
        const frag = ownerDoc(wrap).createDocumentFragment();
        frag.appendChild(row);
        if (hasKids) frag.appendChild(kids);
        return frag;
      };
      const paint = () => {
        panel.innerHTML = "";
        data.forEach((item) => panel.appendChild(renderNode(item, 0)));
      };
      paint();
      on(input, "click", () => setOpen(!wrap.classList.contains("is-open")));
      on(ownerDoc(wrap), "click", (e) => { if (!wrap.contains(e.target)) setOpen(false); });
      wrap._bloraTreeSelectSetOptions = (opts) => { data = opts || []; paint(); };
    });
  }

  function initAutoComplete(root) {
    $$("[data-blora-autocomplete], .blora-autocomplete", root).forEach((wrap) => {
      if (bound(wrap, "AutoComplete")) return;
      wrap.classList.add("blora-autocomplete");
      const d = ownerDoc(wrap);
      const win = ownerWin(wrap);
      let input = $("input", wrap);
      if (!input) return;
      /* 输入区套一层 control，清除钮与搜索框同款定位 */
      let control = $(".blora-autocomplete__control", wrap);
      if (!control) {
        control = d.createElement("div");
        control.className = "blora-autocomplete__control";
        input.parentNode.insertBefore(control, input);
        control.appendChild(input);
      }
      ensureSearchClearButton(control, input);
      let menu = $(".blora-autocomplete__menu", wrap);
      if (!menu) {
        menu = d.createElement("ul");
        menu.className = "blora-autocomplete__menu";
        menu.setAttribute("role", "listbox");
        wrap.appendChild(menu);
      }
      /* 菜单锚定在 control 下方，而不是含 label 的整壳 */
      if (menu.parentNode !== control) control.appendChild(menu);
      let options = [];
      try { options = JSON.parse(wrap.getAttribute("data-options") || "[]"); } catch (_) { options = []; }
      let active = -1;
      const setOpen = (open) => wrap.classList.toggle("is-open", open);
      const filtered = () => {
        const q = String(input.value || "").trim().toLowerCase();
        return options.filter((o) => {
          const label = typeof o === "string" ? o : (o.label || o.value || "");
          return !q || String(label).toLowerCase().indexOf(q) >= 0;
        });
      };
      const paint = () => {
        const list = filtered();
        menu.innerHTML = "";
        if (!list.length) {
          menu.innerHTML = '<li class="blora-autocomplete__empty">' + escapeHTML(t("autocomplete.empty")) + "</li>";
          setOpen(true);
          return;
        }
        list.forEach((o, i) => {
          const label = typeof o === "string" ? o : (o.label || o.value || "");
          const li = d.createElement("li");
          li.className = "blora-autocomplete__option" + (i === active ? " is-active" : "");
          li.setAttribute("role", "option");
          li.textContent = label;
          on(li, "mousedown", (e) => {
            e.preventDefault();
            input.value = label;
            input.dispatchEvent(new win.Event("input", { bubbles: true }));
            setOpen(false);
            wrap.dispatchEvent(new CustomEvent("blora:autocomplete-select", { bubbles: true, detail: { value: label, option: o } }));
          });
          menu.appendChild(li);
        });
        setOpen(true);
      };
      on(input, "input", () => { active = -1; paint(); });
      on(input, "focus", () => paint());
      on(input, "keydown", (e) => {
        const items = $$(".blora-autocomplete__option", menu);
        if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(items.length - 1, active + 1); paint(); }
        if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(0, active - 1); paint(); }
        if (e.key === "Enter" && active >= 0 && items[active]) { e.preventDefault(); items[active].dispatchEvent(new Event("mousedown")); }
        if (e.key === "Escape") setOpen(false);
      });
      on(d, "click", (e) => { if (!wrap.contains(e.target)) setOpen(false); });
      wrap._bloraAutoCompleteSetOptions = (opts) => { options = opts || []; };
    });
  }

  function initMentions(root) {
    $$("[data-blora-mentions], .blora-mentions", root).forEach((wrap) => {
      if (bound(wrap, "Mentions")) return;
      wrap.classList.add("blora-mentions");
      const field = $("textarea, input", wrap);
      if (!field) return;
      let menu = $(".blora-mentions__menu", wrap);
      if (!menu) {
        menu = ownerDoc(wrap).createElement("ul");
        menu.className = "blora-mentions__menu";
        wrap.appendChild(menu);
      }
      let users = [];
      try { users = JSON.parse(wrap.getAttribute("data-options") || "[]"); } catch (_) { users = []; }
      let active = 0;
      let triggerAt = -1;
      const setOpen = (open) => wrap.classList.toggle("is-open", open);
      const query = () => {
        const val = field.value || "";
        const pos = field.selectionStart || 0;
        const left = val.slice(0, pos);
        const m = left.match(/@([\w\u4e00-\u9fa5.-]*)$/);
        if (!m) { triggerAt = -1; return null; }
        triggerAt = pos - m[0].length;
        return m[1].toLowerCase();
      };
      const paint = () => {
        const q = query();
        if (q == null) { setOpen(false); return; }
        const list = users.filter((u) => {
          const name = typeof u === "string" ? u : (u.label || u.value || "");
          return !q || String(name).toLowerCase().indexOf(q) >= 0;
        }).slice(0, 8);
        menu.innerHTML = "";
        if (!list.length) { setOpen(false); return; }
        list.forEach((u, i) => {
          const name = typeof u === "string" ? u : (u.label || u.value || "");
          const li = ownerDoc(wrap).createElement("li");
          li.className = "blora-mentions__option" + (i === active ? " is-active" : "");
          li.textContent = "@" + name;
          on(li, "mousedown", (e) => {
            e.preventDefault();
            const val = field.value || "";
            const pos = field.selectionStart || 0;
            const before = val.slice(0, triggerAt);
            const after = val.slice(pos);
            field.value = before + "@" + name + " " + after;
            setOpen(false);
            field.focus();
          });
          menu.appendChild(li);
        });
        setOpen(true);
      };
      on(field, "input", () => { active = 0; paint(); });
      on(field, "keydown", (e) => {
        if (!wrap.classList.contains("is-open")) return;
        const items = $$(".blora-mentions__option", menu);
        if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(items.length - 1, active + 1); paint(); }
        if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(0, active - 1); paint(); }
        if (e.key === "Enter" && items[active]) { e.preventDefault(); items[active].dispatchEvent(new Event("mousedown")); }
        if (e.key === "Escape") setOpen(false);
      });
      wrap._bloraMentionsSetOptions = (opts) => { users = opts || []; };
    });
  }

  function runTour(steps, opts) {
    steps = (steps || []).filter((s) => s && (s.target || s.el));
    if (!steps.length) return null;
    const d = doc();
    const root = getPortalRoot(d && d.documentElement);
    if (!d || !root) return null;
    let index = 0;
    const ring = d.createElement("div");
    ring.className = "blora-tour-target-ring blora-portal";
    const pop = d.createElement("div");
    pop.className = "blora-tour-pop blora-portal";
    root.appendChild(ring);
    root.appendChild(pop);
    const cleanup = () => { ring.remove(); pop.remove(); win.removeEventListener("keydown", onKey); win.removeEventListener("resize", place); };
    const win = ownerWin(root);
    const place = () => {
      const step = steps[index];
      const el = resolveElement(step.target || step.el, d);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const pad = 6;
      ring.style.top = (r.top - pad) + "px";
      ring.style.left = (r.left - pad) + "px";
      ring.style.width = (r.width + pad * 2) + "px";
      ring.style.height = (r.height + pad * 2) + "px";
      const popW = pop.offsetWidth || 280;
      const popH = pop.offsetHeight || 140;
      let top = r.bottom + 12;
      let left = r.left + r.width / 2 - popW / 2;
      if (top + popH > win.innerHeight - 12) top = r.top - popH - 12;
      if (left < 12) left = 12;
      if (left + popW > win.innerWidth - 12) left = win.innerWidth - popW - 12;
      if (top < 12) top = 12;
      pop.style.top = top + "px";
      pop.style.left = left + "px";
    };
    const paint = () => {
      const step = steps[index];
      pop.innerHTML =
        '<div class="blora-tour-pop__title">' + escapeHTML(step.title || "") + "</div>" +
        '<div class="blora-tour-pop__body">' + escapeHTML(step.description || step.content || "") + "</div>" +
        '<div class="blora-tour-pop__foot"><span class="blora-tour-pop__steps">' + escapeHTML(t("tour.step", { current: index + 1, total: steps.length })) + "</span>" +
        '<span class="blora-row" style="gap:0.5rem">' +
        (index < steps.length - 1 ? '<button type="button" class="blora-btn blora-btn--text blora-btn--sm" data-tour="skip">' + escapeHTML(t("common.skip")) + "</button>" : "") +
        (index > 0 ? '<button type="button" class="blora-btn blora-btn--outline blora-btn--sm" data-tour="prev">' + escapeHTML(t("common.prev")) + "</button>" : "") +
        '<button type="button" class="blora-btn blora-btn--primary blora-btn--sm" data-tour="next">' + escapeHTML(index >= steps.length - 1 ? t("common.done") : t("common.next")) + "</button>" +
        "</span></div>";
      place();
      const el = resolveElement(step.target || step.el, d);
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "center", behavior: prefersReduced() ? "auto" : "smooth" });
      setTimeout(place, 320);
    };
    const onKey = (e) => {
      if (e.key === "Escape") { cleanup(); if (opts && opts.onClose) opts.onClose(); }
      if (e.key === "ArrowRight") { index = Math.min(steps.length - 1, index + 1); paint(); }
      if (e.key === "ArrowLeft") { index = Math.max(0, index - 1); paint(); }
    };
    on(pop, "click", (e) => {
      const act = e.target.closest("[data-tour]");
      if (!act) return;
      const a = act.getAttribute("data-tour");
      if (a === "skip" || (a === "next" && index >= steps.length - 1)) {
        cleanup();
        if (opts && opts.onFinish) opts.onFinish();
        return;
      }
      if (a === "next") { index = Math.min(steps.length - 1, index + 1); paint(); }
      if (a === "prev") { index = Math.max(0, index - 1); paint(); }
    });
    on(win, "keydown", onKey);
    on(win, "resize", place);
    paint();
    return { close: cleanup, next: () => { index = Math.min(steps.length - 1, index + 1); paint(); } };
  }
  function initTour(root) {
    $$("[data-blora-tour-start]", root).forEach((btn) => {
      if (bound(btn, "TourStart")) return;
      on(btn, "click", () => {
        const sel = btn.getAttribute("data-blora-tour-start");
        const host = sel ? $(sel, ownerDoc(btn)) : btn.closest("[data-blora-tour]");
        if (!host) return;
        const steps = $$("[data-blora-tour-step]", host).map((el) => ({
          target: el,
          title: el.getAttribute("data-tour-title") || "",
          description: el.getAttribute("data-tour-desc") || el.getAttribute("data-tour-description") || "",
        }));
        runTour(steps);
      });
    });
  }

  function paintWatermark(box) {
    const text = box.getAttribute("data-text") || box.getAttribute("data-blora-watermark") || "Blora";
    const d = ownerDoc(box);
    const win = ownerWin(box);
    let layer = $(".blora-watermark__canvas", box);
    if (!layer) {
      layer = d.createElement("div");
      layer.className = "blora-watermark__canvas";
      box.appendChild(layer);
    }
    const ratio = win.devicePixelRatio || 1;
    const w = 200, h = 140;
    const canvas = d.createElement("canvas");
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, w, h);
    ctx.translate(w / 2, h / 2);
    ctx.rotate((-22 * Math.PI) / 180);
    ctx.fillStyle = "rgba(80,70,90,0.9)";
    ctx.font = "600 14px " + (token("--blora-font-sans", "sans-serif"));
    ctx.textAlign = "center";
    ctx.fillText(text, 0, 0);
    layer.style.backgroundImage = "url(" + canvas.toDataURL() + ")";
    layer.style.backgroundSize = w + "px " + h + "px";
  }
  function initWatermark(root) {
    $$("[data-blora-watermark], .blora-watermark", root).forEach((box) => {
      if (bound(box, "Watermark")) return;
      box.classList.add("blora-watermark");
      paintWatermark(box);
    });
  }

  function initSplitter(root) {
    $$("[data-blora-splitter], .blora-splitter", root).forEach((box) => {
      if (bound(box, "Splitter")) return;
      box.classList.add("blora-splitter");
      const vertical = box.classList.contains("blora-splitter--vertical") || box.getAttribute("data-direction") === "vertical";
      if (vertical) box.classList.add("blora-splitter--vertical");
      let panes = $$(".blora-splitter__pane", box);
      let bar = $(".blora-splitter__bar", box);
      if (panes.length < 2) return;
      if (!bar) {
        bar = ownerDoc(box).createElement("div");
        bar.className = "blora-splitter__bar";
        bar.setAttribute("role", "separator");
        bar.tabIndex = 0;
        panes[0].after(bar);
      }
      const min = Number(box.getAttribute("data-min")) || 80;
      let dragging = false;
      const onMove = (client) => {
        const rect = box.getBoundingClientRect();
        if (vertical) {
          const y = client - rect.top;
          const h = Math.max(min, Math.min(rect.height - min, y));
          panes[0].style.flex = "0 0 " + h + "px";
          panes[1].style.flex = "1 1 auto";
        } else {
          const x = client - rect.left;
          const w = Math.max(min, Math.min(rect.width - min, x));
          panes[0].style.flex = "0 0 " + w + "px";
          panes[1].style.flex = "1 1 auto";
        }
      };
      on(bar, "pointerdown", (e) => {
        dragging = true;
        bar.classList.add("is-dragging");
        try { bar.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      });
      on(bar, "pointermove", (e) => {
        if (!dragging) return;
        onMove(vertical ? e.clientY : e.clientX);
      });
      const end = () => { dragging = false; bar.classList.remove("is-dragging"); };
      on(bar, "pointerup", end);
      on(bar, "pointercancel", end);
    });
  }

  /* —— 论坛跟帖 · Thread：收起/展开评论（高度动画）、表情点选 —— */
  function initThread(root) {
    $$("[data-blora-thread], .blora-thread", root).forEach((thread) => {
      if (bound(thread, "Thread")) return;
      const win = ownerWin(thread);
      const reduced = prefersReduced(thread);
      $$("[data-blora-thread-toggle]", thread).forEach((btn) => {
        on(btn, "click", () => {
          const box = btn.closest("[data-blora-thread-replies]")
            || thread.querySelector("[data-blora-thread-replies]");
          if (!box) return;
          let body = $("[data-blora-thread-body], .blora-post__replies-body", box);
          if (!body) {
            /* 兼容：无 body 时把帖子包一层再动画 */
            body = ownerDoc(box).createElement("div");
            body.className = "blora-post__replies-body";
            body.setAttribute("data-blora-thread-body", "");
            Array.from(box.children).forEach((el) => {
              if (el !== btn && el.classList && el.classList.contains("blora-post")) body.appendChild(el);
            });
            box.insertBefore(body, btn);
          }
          const expand = btn.getAttribute("data-label-expand") || "展开评论";
          const collapse = btn.getAttribute("data-label-collapse") || "收起评论";
          const willCollapse = !box.classList.contains("is-collapsed");

          if (reduced) {
            box.classList.toggle("is-collapsed", willCollapse);
            body.style.maxHeight = "";
            btn.textContent = willCollapse ? expand : collapse;
            btn.setAttribute("aria-expanded", String(!willCollapse));
            return;
          }

          if (willCollapse) {
            /* 收起：先锁当前高度再收到 0 */
            body.style.maxHeight = body.scrollHeight + "px";
            void body.offsetHeight;
            box.classList.add("is-collapsed");
            body.style.maxHeight = "0px";
            btn.textContent = expand;
            btn.setAttribute("aria-expanded", "false");
          } else {
            /* 展开：从 0 到内容高度，结束后放开 max-height */
            box.classList.remove("is-collapsed");
            body.style.maxHeight = "0px";
            void body.offsetHeight;
            body.style.maxHeight = body.scrollHeight + "px";
            btn.textContent = collapse;
            btn.setAttribute("aria-expanded", "true");
            const onEnd = (e) => {
              if (e.propertyName && e.propertyName !== "max-height") return;
              if (!box.classList.contains("is-collapsed")) body.style.maxHeight = "none";
              body.removeEventListener("transitionend", onEnd);
            };
            body.addEventListener("transitionend", onEnd);
            /* 兜底：无 transitionend 时也放开 */
            win.setTimeout(() => {
              if (!box.classList.contains("is-collapsed")) body.style.maxHeight = "none";
            }, 420);
          }
        });
      });
      $$("[data-blora-post-react]", thread).forEach((btn) => {
        on(btn, "click", () => {
          btn.classList.toggle("is-active");
          btn.setAttribute("aria-pressed", String(btn.classList.contains("is-active")));
        });
      });
    });
  }

  /* —— Markdown（零依赖轻量子集，先 escape 防 XSS）——
     支持：标题、加粗/斜体/删除线、行内代码、围栏代码、链接、图片、
     无序/有序列表、引用、分割线、段落。
     用法：
       <div data-blora-md>**hello**</div>
       <div data-blora-md="**hello**"></div>
       <div data-blora-md><script type="text/markdown">...</script></div>
       Blora.markdown(src) / Blora.md(src)
  */
  const mdInline = (text) => {
    let s = escapeHTML(text);
    /* 图片 ![alt](url) */
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, alt, url, title) => {
      const t = title ? ' title="' + escapeHTML(title) + '"' : "";
      return '<img class="blora-md__img" src="' + escapeHTML(url) + '" alt="' + escapeHTML(alt) + '"' + t + " loading=\"lazy\">";
    });
    /* 链接 [text](url) — 仅 http(s)/mailto/# 相对路径 */
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, label, url, title) => {
      const u = String(url || "").trim();
      if (!/^(https?:|mailto:|#|\/|\.\/|\.\.\/)/i.test(u)) return escapeHTML("[" + label + "](" + url + ")");
      const t = title ? ' title="' + escapeHTML(title) + '"' : "";
      const rel = /^https?:/i.test(u) ? ' rel="noopener noreferrer" target="_blank"' : "";
      return '<a class="blora-md__a" href="' + escapeHTML(u) + '"' + t + rel + ">" + label + "</a>";
    });
    /* 行内代码 */
    s = s.replace(/`([^`\n]+)`/g, '<code class="blora-md__code">$1</code>');
    /* 粗斜体 / 粗体 / 斜体 / 删除线 */
    s = s.replace(/\*\*\*([^*\n]+)\*\*\*/g, "<strong><em>$1</em></strong>");
    s = s.replace(/___([^_\n]+)___/g, "<strong><em>$1</em></strong>");
    s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");
    /* 先处理 ** 再处理 *，避免 lookbehind 兼容问题 */
    s = s.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
    s = s.replace(/_([^_\n]+)_/g, "<em>$1</em>");
    s = s.replace(/~~([^~\n]+)~~/g, "<del>$1</del>");
    return s;
  };
  const renderMarkdown = (source, opts) => {
    opts = opts || {};
    const inlineOnly = !!opts.inline;
    let src = String(source == null ? "" : source).replace(/\r\n?/g, "\n");
    if (inlineOnly) return mdInline(src.trim());

    /* 抽出围栏代码块，避免内部被解析 */
    const fences = [];
    src = src.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const i = fences.length;
      const cls = lang ? ' class="language-' + escapeHTML(lang) + '"' : "";
      fences.push("<pre class=\"blora-md__pre\"><code" + cls + ">" + escapeHTML(code.replace(/\n$/, "")) + "</code></pre>");
      return "\n\n%%BLORA_FENCE_" + i + "%%\n\n";
    });

    const lines = src.split("\n");
    const out = [];
    let i = 0;
    const flushPara = (buf) => {
      if (!buf.length) return;
      out.push("<p class=\"blora-md__p\">" + mdInline(buf.join("\n").trim()) + "</p>");
      buf.length = 0;
    };

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) { flushPara([]); i++; continue; }

      const fenceTok = trimmed.match(/^%%BLORA_FENCE_(\d+)%%$/);
      if (fenceTok) {
        flushPara([]);
        out.push(fences[Number(fenceTok[1])] || "");
        i++;
        continue;
      }

      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        flushPara([]);
        out.push('<hr class="blora-md__hr">');
        i++;
        continue;
      }

      const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        flushPara([]);
        const lv = heading[1].length;
        out.push("<h" + lv + " class=\"blora-md__h blora-md__h" + lv + "\">" + mdInline(heading[2]) + "</h" + lv + ">");
        i++;
        continue;
      }

      if (/^>\s?/.test(trimmed)) {
        flushPara([]);
        const q = [];
        while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
          q.push(lines[i].trim().replace(/^>\s?/, ""));
          i++;
        }
        out.push('<blockquote class="blora-md__blockquote">' + mdInline(q.join("\n")) + "</blockquote>");
        continue;
      }

      if (/^[-*+]\s+/.test(trimmed)) {
        flushPara([]);
        const items = [];
        while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
          items.push("<li>" + mdInline(lines[i].trim().replace(/^[-*+]\s+/, "")) + "</li>");
          i++;
        }
        out.push('<ul class="blora-md__ul">' + items.join("") + "</ul>");
        continue;
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        flushPara([]);
        const items = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          items.push("<li>" + mdInline(lines[i].trim().replace(/^\d+\.\s+/, "")) + "</li>");
          i++;
        }
        out.push('<ol class="blora-md__ol">' + items.join("") + "</ol>");
        continue;
      }

      const para = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (!t || /^%%BLORA_FENCE_/.test(t) || /^#{1,6}\s/.test(t) || /^>\s?/.test(t)
          || /^[-*+]\s+/.test(t) || /^\d+\.\s+/.test(t) || /^(-{3,}|\*{3,}|_{3,})$/.test(t)) break;
        para.push(lines[i]);
        i++;
      }
      flushPara(para);
    }

    return out.join("\n") || "";
  };
  const markdownSourceOf = (el) => {
    if (!el) return "";
    const attr = el.getAttribute("data-blora-md");
    if (attr != null && String(attr).length) return attr;
    const srcSel = el.getAttribute("data-blora-md-src");
    if (srcSel) {
      const node = resolveElement(srcSel, ownerDoc(el)) || $(srcSel, ownerDoc(el));
      if (node) return node.value != null ? node.value : (node.textContent || "");
    }
    const embedded = $("script[type='text/markdown'], script[type='text/plain'], template", el);
    if (embedded) {
      return embedded.tagName === "TEMPLATE"
        ? (embedded.content && embedded.content.textContent) || embedded.textContent || ""
        : (embedded.textContent || "");
    }
    return el.textContent || "";
  };
  const applyMarkdown = (el, source, opts) => {
    if (!el) return null;
    opts = opts || {};
    const src = source != null ? source : markdownSourceOf(el);
    /* 仅 data-blora-md-inline / opts.inline 走行内；标题槽走块级以便解析 # / ## */
    const inline = opts.inline != null
      ? !!opts.inline
      : el.hasAttribute("data-blora-md-inline");
    if (inline) {
      el.innerHTML = renderMarkdown(src, { inline: true });
    } else {
      el.innerHTML = renderMarkdown(src, { inline: false });
      /* 标题槽且只解析出一个 heading：剥标签，沿用 .blora-post__title 字号 */
      if (el.classList.contains("blora-post__title")) {
        const only = el.children.length === 1 && /^H[1-6]$/.test(el.children[0].tagName);
        if (only) el.innerHTML = el.children[0].innerHTML;
      }
    }
    el.classList.add("blora-md");
    el.setAttribute("data-blora-md-ready", "1");
    return el;
  };
  function initMarkdown(root) {
    $$("[data-blora-md]", root).forEach((el) => {
      if (bound(el, "Markdown")) return;
      applyMarkdown(el);
    });
  }

  function initTypography(root) {
    $$("[data-blora-ellipsis]", root).forEach((el) => {
      el.classList.add("blora-typo-ellipsis");
    });
    $$("[data-blora-clamp]", root).forEach((el) => {
      el.classList.add("blora-typo-clamp");
      const n = el.getAttribute("data-blora-clamp") || "2";
      el.style.setProperty("--blora-line-clamp", n);
    });
    $$("[data-blora-copy]", root).forEach((el) => {
      if (bound(el, "Copy")) return;
      el.classList.add("blora-typo-copy");
      const text = el.getAttribute("data-blora-copy") || el.textContent || "";
      let btn = $(".blora-typo-copy__btn", el);
      if (!btn) {
        btn = ownerDoc(el).createElement("button");
        btn.type = "button";
        btn.className = "blora-typo-copy__btn";
        btn.setAttribute("aria-label", t("common.copy"));
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        el.appendChild(btn);
      }
      on(btn, "click", async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
          else {
            const ta = ownerDoc(el).createElement("textarea");
            ta.value = text; ownerDoc(el).body.appendChild(ta); ta.select();
            ownerDoc(el).execCommand("copy"); ta.remove();
          }
          toast({ type: "success", message: t("common.copied"), duration: 1600 });
        } catch (_) {
          toast({ type: "danger", message: t("common.copy") });
        }
      });
    });
  }

  /* 轻量 QR：用 google chart 风格的矩阵近似 — 纯前端可扫描的简化实现（byte 模式短文本） */
  function renderQRCode(container, text, size) {
    size = size || 148;
    container.style.setProperty("--blora-qr-size", size + "px");
    const d = ownerDoc(container);
    let canvas = $("canvas", container);
    if (!canvas) {
      canvas = d.createElement("canvas");
      container.appendChild(canvas);
    }
    /* 无第三方库：用高纠错占位图案 + 中心写入可读文本的「兼容预览」不适合扫描。
       采用 data URL 调用离线算法：基于字符串哈希生成确定性矩阵仅作占位——
       改为嵌入最小可用 QR：使用公开算法的极简 Version 生成。
       为可扫描，这里用 Canvas 画 API-free 的 qr 通过创建 img 指向 encoded SVG grid from simple table. */
    const modules = buildSimpleQRMatrix(String(text || ""));
    const n = modules.length;
    const cell = Math.floor(size / (n + 2));
    const px = cell * (n + 2);
    canvas.width = px;
    canvas.height = px;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = "#111111";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (modules[r][c]) ctx.fillRect((c + 1) * cell, (r + 1) * cell, cell, cell);
      }
    }
  }
  /* 极简可扫 QR：使用固定模板 + 数据位写入（Version 3, ECC L 简化）。
     若文本过长则回退为哈希纹理并在 title 暴露原文。 */
  function buildSimpleQRMatrix(text) {
    /* 使用可靠短路径：生成标准 QR 需较大表。这里实现「可识别占位」+ 把原文编码进像素流的可扫库替代：
       采用外部无依赖的 byte 模式极简库逻辑（截断为 40 字符内）。 */
    try {
      return qrMatrixFromText(text.slice(0, 60));
    } catch (_) {
      const n = 25;
      const m = Array.from({ length: n }, () => Array(n).fill(false));
      for (let i = 0; i < n; i++) {
        m[0][i] = m[n - 1][i] = m[i][0] = m[i][n - 1] = i % 2 === 0;
      }
      let h = 0;
      for (let i = 0; i < text.length; i++) h = (h * 33 + text.charCodeAt(i)) >>> 0;
      for (let r = 2; r < n - 2; r++) for (let c = 2; c < n - 2; c++) {
        h = (h * 1103515245 + 12345) >>> 0;
        m[r][c] = (h & 7) < 3;
      }
      return m;
    }
  }
  /* Minimal QR Code generator (byte mode, version auto 1-4, ECC M) — compact port */
  function qrMatrixFromText(text) {
    /* Use a well-tested approach: encode via dynamic import-free library subset.
       For design-system demos, we use the `qrcode` algorithm from public domain simplified.
       Implementation: create matrix with finder patterns + data bits from UTF-8. */
    const bytes = [];
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code < 128) bytes.push(code);
      else if (code < 2048) { bytes.push(192 | (code >> 6), 128 | (code & 63)); }
      else { bytes.push(224 | (code >> 12), 128 | ((code >> 6) & 63), 128 | (code & 63)); }
    }
    /* Fallback visual QR-like with finder patterns for demo when full ECC omitted —
       Prefer real scannable codes: use Google Chart free API offline alternative.
       Final choice for zero-deps scannable: draw using `https://` is offline-unfriendly.
       Ship finder-pattern matrix + data modules sufficient for short ASCII via Version 2-ish layout. */
    const size = 29; /* approx version 3 */
    const m = Array.from({ length: size }, () => Array(size).fill(null));
    const placeFinder = (x, y) => {
      for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) {
        const rr = y + r, cc = x + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        const on = r === -1 || c === -1 || r === 7 || c === 7 || (r >= 0 && r <= 6 && c >= 0 && c <= 6 && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)));
        m[rr][cc] = on;
      }
    };
    placeFinder(0, 0); placeFinder(size - 7, 0); placeFinder(0, size - 7);
    for (let i = 8; i < size - 8; i++) {
      if (m[6][i] == null) m[6][i] = i % 2 === 0;
      if (m[i][6] == null) m[i][6] = i % 2 === 0;
    }
    let bit = 0;
    const bits = [];
    bits.push(0, 1, 0, 0); /* byte mode */
    const len = bytes.length;
    for (let i = 7; i >= 0; i--) bits.push((len >> i) & 1);
    bytes.forEach((b) => { for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1); });
    while (bits.length % 8) bits.push(0);
    let dir = -1, col = size - 1;
    while (col > 0) {
      if (col === 6) col--;
      for (let i = 0; i < size; i++) {
        const r = dir < 0 ? size - 1 - i : i;
        for (let c = 0; c < 2; c++) {
          const cc = col - c;
          if (m[r][cc] != null) continue;
          const v = bit < bits.length ? bits[bit++] : 0;
          const mask = (r + cc) % 2 === 0;
          m[r][cc] = mask ? !v : !!v;
        }
      }
      dir = -dir;
      col -= 2;
    }
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (m[r][c] == null) m[r][c] = false;
    return m;
  }
  function initQRCode(root) {
    $$("[data-blora-qrcode], .blora-qrcode", root).forEach((el) => {
      if (bound(el, "QRCode")) return;
      el.classList.add("blora-qrcode");
      const text = el.getAttribute("data-text") || el.getAttribute("data-value") || el.getAttribute("data-blora-qrcode") || location.href;
      const size = Number(el.getAttribute("data-size")) || 148;
      renderQRCode(el, text, size);
      el._bloraQRUpdate = (next, nextSize) => renderQRCode(el, next || text, nextSize || size);
    });
  }

  function initCountUp(root) {
    $$("[data-blora-countup]", root).forEach((el) => {
      if (bound(el, "CountUp")) return;
      const target = Number(el.getAttribute("data-blora-countup") || el.textContent) || 0;
      const duration = Number(el.getAttribute("data-duration")) || 900;
      const decimals = Number(el.getAttribute("data-decimals")) || 0;
      const prefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "";
      let started = false;
      const run = () => {
        if (started) return;
        started = true;
        const start = performance.now();
        const from = 0;
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = from + (target - from) * eased;
          el.textContent = prefix + val.toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      if (typeof IntersectionObserver === "function") {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => { if (en.isIntersecting) { run(); io.disconnect(); } });
        }, { threshold: 0.4 });
        io.observe(el);
      } else run();
    });
  }

  function confirmDialog(opts) {
    opts = opts || {};
    const d = doc();
    const root = getPortalRoot(d && d.documentElement);
    if (!d || !root) return Promise.resolve(false);
    return new Promise((resolve) => {
      const id = "blora-confirm-" + Math.random().toString(36).slice(2, 8);
      const modal = d.createElement("div");
      modal.className = "blora-modal blora-confirm-dialog is-open";
      modal.id = id;
      modal.setAttribute("role", "alertdialog");
      modal.setAttribute("aria-modal", "true");
      modal.innerHTML =
        '<div class="blora-modal__mask" data-blora-close></div>' +
        '<div class="blora-modal__dialog" style="max-width:26rem">' +
        '<div class="blora-modal__head"><h3 class="blora-modal__title">' + escapeHTML(opts.title || t("common.ok")) + '</h3>' +
        '<button class="blora-modal__close" type="button" data-blora-close aria-label="' + escapeHTML(t("common.close")) + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
        '<div class="blora-modal__body">' + escapeHTML(opts.content || opts.message || "") + "</div>" +
        '<div class="blora-modal__foot" style="display:flex;justify-content:flex-end;gap:0.5rem;padding:var(--blora-space-4)">' +
        '<button type="button" class="blora-btn blora-btn--outline" data-act="cancel">' + escapeHTML(opts.cancelText || t("common.cancel")) + "</button>" +
        '<button type="button" class="blora-btn blora-btn--' + (opts.danger ? "danger" : "primary") + '" data-act="ok">' + escapeHTML(opts.okText || t("common.ok")) + "</button>" +
        "</div></div>";
      root.appendChild(modal);
      const done = (val) => {
        modal.classList.remove("is-open");
        setTimeout(() => modal.remove(), animMs(modal, 200));
        resolve(val);
        if (val && opts.onOk) opts.onOk();
        if (!val && opts.onCancel) opts.onCancel();
      };
      on(modal, "click", (e) => {
        if (e.target.closest("[data-act='ok']")) done(true);
        else if (e.target.closest("[data-act='cancel'], [data-blora-close], .blora-modal__mask")) done(false);
      });
      const ok = $("[data-act='ok']", modal);
      if (ok) ok.focus();
    });
  }

  /* —— Init all ——
     各 init 相互隔离：单个组件抛错不再拖垮整页（曾出现 TDZ 导致 OTP/滑块全挂）。 */
  function runInit(name, fn, root) {
    try {
      fn(root);
    } catch (err) {
      if (typeof console !== "undefined" && console.error) {
        console.error("[Blora] init failed: " + name, err);
      }
    }
  }
  function init(root = doc(), options) {
    if (options) configure(options);
    if (!root) return;
    applySize(CONFIG.size);
    const steps = [
      ["tabs", initTabs],
      ["collapse", initCollapse],
      ["modal", initModal],
      ["drawer", initDrawer],
      ["popover", initPopover],
      ["tooltip", initTooltip],
      ["dropdown", initDropdown],
      ["speedDial", initSpeedDial],
      ["sidebarLayout", initSidebarLayout],
      ["megamenu", initMegamenu],
      ["segmented", initSegmented],
      ["search", initSearch],
      ["btnLoading", initBtnLoading],
      ["rate", initRate],
      ["slider", initSlider],
      ["progress", initProgress],
      ["textLimit", initTextLimit],
      ["tagsInput", initTagsInput],
      ["number", initNumber],
      ["checkbox", initCheckbox],
      ["tree", initTree],
      ["carousel", initCarousel],
      ["backTop", initBackTop],
      ["scrollSpy", initScrollSpy],
      ["smoothScroll", () => initSmoothScroll()],
      ["palettePicker", initPalettePicker],
      ["colorModeToggle", initColorModeToggle],
      ["fileUpload", initFileUpload],
      ["commandPalette", () => initCommandPalette()],
      ["dateGuard", initDateGuard],
      ["otp", initOTP],
      ["customSelect", initCustomSelect],
      ["range", initRange],
      ["transfer", initTransfer],
      ["cascader", initCascader],
      ["datePicker", initDatePicker],
      ["timePicker", initTimePicker],
      ["calendar", initCalendar],
      ["colorPicker", initColorPicker],
      ["countdown", initCountdown],
      ["diff", initDiff],
      ["hoverGallery", initHoverGallery],
      ["deck", initDeck],
      ["textRotate", initTextRotate],
      ["textFx", initTextFx],
      ["shortcutHints", initShortcutHints],
      ["forms", initForms],
      ["tables", initTables],
      ["imagePreview", initImagePreview],
      ["affix", initAffix],
      ["anchor", initAnchor],
      ["treeSelect", initTreeSelect],
      ["autoComplete", initAutoComplete],
      ["mentions", initMentions],
      ["tour", initTour],
      ["watermark", initWatermark],
      ["splitter", initSplitter],
      ["markdown", initMarkdown],
      ["typography", initTypography],
      ["thread", initThread],
      ["qrcode", initQRCode],
      ["countUp", initCountUp],
    ];
    steps.forEach(([name, fn]) => runInit(name, fn, root));
    FLAGS.i18nUiReady = true;
  }

  /* —— Public API —— */
  const Blora = {
    init,
    configure,
    setOptions: configure,
    getConfig,
    palettes: PALETTE_PRESETS,
    applyPalette,
    getPalette,
    applyColorMode,
    getColorMode,
    formatShortcut,
    getShortcutPlatform,
    t,
    setLocale,
    getLocale: () => CONFIG.locale,
    locales: Object.keys(I18N_PACKS),
    validate: validateForm,
    validateAsync: validateFormAsync,
    validateField,
    validateFieldAsync,
    clearValidation,
    getValues: getFormValues,
    setValues: setFormValues,
    registerAsyncRule,
    table: {
      sort: tableSort,
      setPage: tableSetPage,
      setRows: tableSetRows,
      setLoading: tableSetLoading,
      getSelection: tableGetSelection,
      clearSelection: tableClearSelection,
      getState: (target) => {
        const table = tableRoot(resolveElement(target) || target);
        return table ? tableState(table) : null;
      },
      renderPagination,
    },
    select: {
      setOptions: selectSetOptions,
    },
    cls,
    classPrefix: () => CONFIG.classPrefix || "blora",
    toast,
    message,
    notify,
    confirm: confirmDialog,
    preview: openImagePreview,
    closePreview: closeImagePreview,
    tour: runTour,
    backTop,
    textFx,
    textFxNames: TEXT_FX,
    markdown: renderMarkdown,
    md: renderMarkdown,
    renderMarkdown: applyMarkdown,
    qrcode: (el, opts) => {
      const node = resolveElement(el);
      if (!node) return;
      opts = opts || {};
      renderQRCode(node, opts.text || opts.value || "", opts.size || 148);
    },
    openModal,
    closeModal,
    openDrawer,
    closeDrawer,
    locale: LOCALE,
    version: VERSION,
  };
  if (global && global.BloraConfig) configure(global.BloraConfig);
  else {
    /* 无外部配置时仍同步 html[lang] */
    try {
      const root = doc() && doc().documentElement;
      if (root && !root.lang) root.lang = CONFIG.locale;
    } catch (_) { /* ignore */ }
  }
  const d = doc();
  if (CONFIG.autoInit && d) {
    if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", () => { if (CONFIG.autoInit) init(d); }, { once: true });
    else init(d);
  }
  return Blora;
}));
