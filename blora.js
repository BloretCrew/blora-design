/* ========================================================================
   Blora Design · blora.js
   轻量的交互层 — 让静态的"水墨"活起来。
   无依赖。只做该做的事：开关、显隐、步进、拖拽。
   ======================================================================== */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);

  const FLAGS = {};
  /* 幂等标记：init 可重复调用（如 Blora.init(动态子树)），已绑定的元素自动跳过 */
  const bound = (el, key) => {
    key = "bloraBound" + key;
    if (!el || el.dataset[key]) return true;
    el.dataset[key] = "1";
    return false;
  };
  const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* 读取元素当前动画时长（随动效令牌变化），加 20ms 余量；读不到时用回退值 */
  const animMs = (el, fallback) => {
    const d = el ? parseFloat(getComputedStyle(el).animationDuration) : 0;
    return (d ? d * 1000 : fallback) + 20;
  };

  /* —— Tabs —— 方向键 / Home / End 可达，role 与 aria-* 自动注入 —— */
  function initTabs(root) {
    $$("[data-blora-tabs]", root).forEach((group) => {
      if (bound(group, "Tabs")) return;
      const nav = $(".blora-tabs__nav", group);
      const tabs = $$(".blora-tabs__tab", group);
      const panels = $$(".blora-tabs__panel", group);
      if (nav) nav.setAttribute("role", "tablist");
      panels.forEach((p) => p.setAttribute("role", "tabpanel"));
      const activate = (tab, focus) => {
        if (tab.classList.contains("is-disabled")) return;
        const i = tabs.indexOf(tab);
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
          if (!t.classList.contains("is-disabled")) t.tabIndex = active ? 0 : -1;
        });
        panels.forEach((p) => p.classList.add("blora-hide"));
        const panel = panels[i] || panels[Number(tab.dataset.tab)];
        if (panel) panel.classList.remove("blora-hide");
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
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  const restoreFocus = (layer) => {
    if (layer._bloraPrev && typeof layer._bloraPrev.focus === "function") layer._bloraPrev.focus();
    layer._bloraPrev = null;
  };
  const unlockScroll = () => {
    if (!$(".blora-modal.is-open") && !$(".blora-drawer.is-open")) document.body.style.overflow = "";
  };

  /* —— Modal —— */
  function openModal(id) {
    const m = typeof id === "string" ? document.getElementById(id) : id;
    if (!m || m.classList.contains("is-open")) return;
    m._bloraPrev = document.activeElement;
    m.classList.remove("is-closing");
    m.classList.add("is-open");
    document.body.style.overflow = "hidden";
    $$("[data-blora-close]", m).forEach((b) => on(b, "click", () => closeModal(m), { once: true }));
    on($(".blora-modal__mask", m), "click", () => closeModal(m), { once: true });
    on(document, "keydown", function esc(e) {
      if (e.key === "Escape") { closeModal(m); document.removeEventListener("keydown", esc); }
    });
    bindTrap(m);
    const dlg = $(".blora-modal__dialog", m);
    if (dlg) { dlg.tabIndex = -1; dlg.focus(); }
  }
  function closeModal(m) {
    m = typeof m === "string" ? document.getElementById(m) : m;
    if (!m || !m.classList.contains("is-open") || m.classList.contains("is-closing")) return;
    m.classList.add("is-closing");
    m.classList.remove("is-open");
    setTimeout(() => {
      m.classList.remove("is-closing");
      unlockScroll();
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
    const d = typeof id === "string" ? document.getElementById(id) : id;
    if (!d || d.classList.contains("is-open")) return;
    d._bloraPrev = document.activeElement;
    d.classList.remove("is-closing");
    d.classList.add("is-open");
    document.body.style.overflow = "hidden";
    $$("[data-blora-close]", d).forEach((b) => on(b, "click", () => closeDrawer(d), { once: true }));
    on($(".blora-drawer__mask", d), "click", () => closeDrawer(d), { once: true });
    on(document, "keydown", function esc(e) {
      if (e.key === "Escape") { closeDrawer(d); document.removeEventListener("keydown", esc); }
    });
    bindTrap(d);
    const panel = $(".blora-drawer__panel", d);
    if (panel) { panel.tabIndex = -1; panel.focus(); }
  }
  function closeDrawer(d) {
    d = typeof d === "string" ? document.getElementById(d) : d;
    if (!d || !d.classList.contains("is-open") || d.classList.contains("is-closing")) return;
    d.classList.add("is-closing");
    d.classList.remove("is-open");
    setTimeout(() => {
      d.classList.remove("is-closing");
      unlockScroll();
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
      on(trigger, "click", (e) => {
        e.stopPropagation();
        $$(".blora-popover.is-open").forEach((o) => o !== pop && o.classList.remove("is-open"));
        pop.classList.toggle("is-open");
      });
      $$("[data-blora-close]", pop).forEach((b) => on(b, "click", () => pop.classList.remove("is-open")));
    });
    if (!FLAGS.popoverDoc) {
      FLAGS.popoverDoc = true;
      on(document, "click", (e) => {
        if (!e.target.closest(".blora-popover")) $$(".blora-popover.is-open").forEach((p) => p.classList.remove("is-open"));
      });
    }
  }

  /* —— Toast —— */
  function toast(opts) {
    opts = typeof opts === "string" ? { message: opts } : (opts || {});
    let c = $(".blora-toast-container");
    if (!c) { c = document.createElement("div"); c.className = "blora-toast-container"; document.body.appendChild(c); }
    const type = opts.type || "info";
    const icons = {
      success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
      warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
      danger:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
      info:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    };
    const el = document.createElement("div");
    el.className = "blora-toast";
    const box = document.createElement("div");
    box.className = "blora-message blora-message--" + (icons[type] ? type : "info");
    box.innerHTML = '<span class="blora-message__icon">' + (icons[type] || icons.info) + '</span>';
    const text = document.createElement("span");
    text.textContent = opts.message || "";   /* 外部内容一律按文本插入，防注入 */
    box.appendChild(text);
    el.appendChild(box);
    c.appendChild(el);
    const ms = opts.duration || 3000;
    setTimeout(() => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), animMs(el, 240)); }, ms);
  }

  /* —— Segmented —— 滑动指示器 —— */
  function initSegmented(root) {
    $$(".blora-segmented", root).forEach((seg) => {
      if (bound(seg, "Segmented")) return;
      const indicator = document.createElement("span");
      indicator.className = "blora-segmented__indicator";
      seg.insertBefore(indicator, seg.firstChild);
      const items = $$(".blora-segmented__item", seg);
      const moveIndicator = (item) => {
        const segRect = seg.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        indicator.style.left = (itemRect.left - segRect.left) + "px";
        indicator.style.width = itemRect.width + "px";
      };
      items.forEach((item) => {
        on(item, "click", () => {
          items.forEach((i) => i.classList.remove("is-active"));
          item.classList.add("is-active");
          moveIndicator(item);
        });
      });
      const remeasure = () => {
        const cur = items.find((i) => i.classList.contains("is-active"));
        if (cur) moveIndicator(cur);
      };
      const active = items.find((i) => i.classList.contains("is-active")) || items[0];
      if (active) requestAnimationFrame(() => moveIndicator(active));
      on(window, "resize", remeasure);
      /* webfont 载入后字宽会变，指示器需重算 */
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
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
      stars.forEach((star, i) => {
        on(star, "click", () => {
          if (readOnly) return;
          stars.forEach((s, j) => s.classList.toggle("is-on", j <= i));
          rate.dataset.value = String(i + 1);
        });
        if (!readOnly) {
          on(star, "mouseenter", () => stars.forEach((s, j) => s.classList.toggle("is-on", j <= i)));
          on(star, "mouseleave", () => {
            const v = Number(rate.dataset.value || 0);
            stars.forEach((s, j) => s.classList.toggle("is-on", j < v));
          });
        }
      });
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
        tag.className = "blora-tag blora-tag--seal blora-tag--removable";
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
        if (label) label.classList.toggle("blora-checkbox--indeterminate", all || some);
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
      let i = 0;
      const go = (n) => {
        i = (n + slides.length) % slides.length;
        track.style.transform = "translateX(-" + (i * 100) + "%)";
        dots.forEach((d, j) => d.classList.toggle("is-active", j === i));
      };
      const prev = $(".blora-carousel__arrow--prev", car);
      const next = $(".blora-carousel__arrow--next", car);
      on(prev, "click", () => go(i - 1));
      on(next, "click", () => go(i + 1));
      dots.forEach((d, j) => on(d, "click", () => go(j)));
      /* 自动播放：间隔可由 data-autoplay="毫秒" 配置，悬停暂停，跟随 reduced-motion */
      if (car.hasAttribute("data-autoplay") && !prefersReduced()) {
        const ms = Number(car.getAttribute("data-autoplay")) || 4000;
        const stop = () => { if (car._timer) { clearInterval(car._timer); car._timer = null; } };
        const start = () => { stop(); car._timer = setInterval(() => go(i + 1), ms); };
        start();
        on(car, "mouseenter", stop);
        on(car, "mouseleave", start);
      }
    });
  }

  /* —— Back to top —— */
  function initBackTop() {
    if (FLAGS.backTop) return;
    FLAGS.backTop = true;
    let fab = $("#blora-fab");
    if (!fab) {
      fab = document.createElement("button");
      fab.id = "blora-fab";
      fab.className = "blora-fab is-hidden";
      fab.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>';
      fab.setAttribute("aria-label", "回到顶部");
      document.body.appendChild(fab);
    }
    const sync = () => fab.classList.toggle("is-hidden", window.scrollY <= 400);
    on(fab, "click", () => window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" }));
    on(window, "scroll", sync);
    sync();
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

  /* —— Smooth scroll —— 目标偏移交给 CSS scroll-margin-top，框架不写死页头高度 —— */
  function initSmoothScroll() {
    if (FLAGS.smooth) return;
    FLAGS.smooth = true;
    on(document, "click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const el = document.getElementById(a.getAttribute("href").slice(1));
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", "#" + el.id);
    });
  }

  /* —— Theme toggle —— */
  const ICON_MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>';
  const ICON_SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
  function initThemeToggle(root) {
    /* 首次载入：读取持久化选择，未设置时跟随系统 prefers-color-scheme */
    if (!FLAGS.themeBoot) {
      FLAGS.themeBoot = true;
      let saved = null;
      try { saved = localStorage.getItem("blora-theme"); } catch (e) {}
      if (saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("blora-dark");
      }
    }
    $$("[data-blora-theme]", root).forEach((btn) => {
      if (bound(btn, "Theme")) return;
      const sync = () => {
        const dark = document.documentElement.classList.contains("blora-dark");
        btn.innerHTML = dark ? ICON_SUN : ICON_MOON;
        btn.setAttribute("aria-label", dark ? "切换至浅色" : "切换至暗色");
      };
      sync();
      on(btn, "click", () => {
        const dark = document.documentElement.classList.toggle("blora-dark");
        try { localStorage.setItem("blora-theme", dark ? "dark" : "light"); } catch (e) {}
        sync();
      });
    });
  }

  /* —— Dropzone —— */
  function initDropzone(root) {
    $$(".blora-dropzone", root).forEach((dz) => {
      if (bound(dz, "Dropzone")) return;
      const fileInput = $(".blora-dropzone__input", dz);
      ["dragenter", "dragover"].forEach((ev) => on(dz, ev, (e) => { e.preventDefault(); dz.classList.add("is-dragover"); }));
      ["dragleave", "drop"].forEach((ev) => on(dz, ev, (e) => { e.preventDefault(); dz.classList.remove("is-dragover"); }));
      on(dz, "click", () => { if (fileInput) fileInput.click(); });
      const showFiles = (files) => {
        const out = $(".blora-dropzone__files", dz);
        if (out && files && files.length) out.textContent = Array.from(files).map((f) => f.name).join(", ");
      };
      on(dz, "drop", (e) => { showFiles(e.dataTransfer && e.dataTransfer.files); });
      if (fileInput) on(fileInput, "change", () => showFiles(fileInput.files));
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

  /* —— Custom Select —— */
  function initCustomSelect(root) {
    $$(".blora-select-wrap", root).forEach((wrap) => {
      if (bound(wrap, "Select")) return;
      const sel = $("select", wrap);
      if (!sel) return;
      const trigger = $(".blora-select-trigger", wrap);
      const menu = $(".blora-select-menu", wrap);
      if (!trigger || !menu) return;
      const opts = $$("option", sel);
      const placeholder = trigger.dataset.placeholder || "请选择";
      const update = () => {
        const chosen = opts.find((o) => o.selected && !o.disabled);
        trigger.textContent = chosen ? chosen.textContent : (opts[0] && opts[0].disabled ? opts[0].textContent : placeholder);
        trigger.classList.toggle("is-placeholder", !chosen);
        $$(".blora-select-option", menu).forEach((el) => el.classList.toggle("is-selected", el.dataset.val === (chosen ? chosen.value : "")));
      };
      opts.forEach((o) => {
        const el = document.createElement("div");
        el.className = "blora-select-option" + (o.disabled ? " is-disabled" : "") + (o.selected && !o.disabled ? " is-selected" : "");
        el.textContent = o.textContent; el.dataset.val = o.value;
        on(el, "click", (e) => {
          e.stopPropagation();
          if (o.disabled) return;
          opts.forEach((oo) => oo.selected = oo === o);
          sel.value = o.value;
          update();
          close();
          sel.dispatchEvent(new Event("change", { bubbles: true }));
        });
        menu.appendChild(el);
      });
      const open = () => { trigger.classList.add("is-open"); menu.classList.add("is-open"); };
      const close = () => { trigger.classList.remove("is-open"); menu.classList.remove("is-open"); };
      on(trigger, "click", (e) => { e.stopPropagation(); trigger.classList.contains("is-open") ? close() : open(); });
      on(document, "click", () => close());
      update();
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
      };
      const toVal = (clientX) => {
        const rect = track.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round(min + pct * (max - min));
      };
      thumbs.forEach((thumb, i) => {
        on(thumb, "mousedown", (e) => {
          e.preventDefault(); tips[i].classList.add("is-show");
          const move = (ev) => { if (i === 0) v1 = toVal(ev.clientX); else v2 = toVal(ev.clientX); render(); };
          const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); tips[i].classList.remove("is-show"); };
          document.addEventListener("mousemove", move); document.addEventListener("mouseup", up);
        });
        on(thumb, "touchstart", (e) => {
          e.preventDefault(); tips[i].classList.add("is-show");
          const move = (ev) => { if (i === 0) v1 = toVal(ev.touches[0].clientX); else v2 = toVal(ev.touches[0].clientX); render(); };
          const up = () => { document.removeEventListener("touchmove", move); document.removeEventListener("touchend", up); tips[i].classList.remove("is-show"); };
          document.addEventListener("touchmove", move); document.addEventListener("touchend", up);
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
      const prefix = result && result.dataset.prefix !== undefined ? result.dataset.prefix : "已选：";
      const arrow = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.5;margin-left:auto;padding-left:0.3em;"><path d="M9 18l6-6-6-6"/></svg>';
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
            opt.innerHTML = "<span>" + item.label + "</span>" + (hasChild ? arrow : "");
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
  /* 日历/选择器文案集中于此，可经 Blora.locale 整体覆写做本地化 */
  const LOCALE = {
    months: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
    dow: ["日","一","二","三","四","五","六"],
    year: "年", today: "今日", clear: "清除", now: "现在", confirm: "确定", hour: "时", minute: "分",
  };

  function initDatePicker(root) {
    $$("[data-blora-datepicker]", root).forEach((wrap) => {
      if (bound(wrap, "Datepicker")) return;
      const input = $(".blora-input", wrap);
      const btn = $(".blora-datepicker__btn", wrap);
      if (!input) return;
      const min = input.min, max = input.max;
      let selected = null, viewYear, viewMonth, viewMode = "days";
      const today = new Date();
      const panel = document.createElement("div"); panel.className = "blora-datepicker__panel"; wrap.appendChild(panel);
      const mask = document.createElement("div"); mask.style.cssText = "position:fixed;inset:0;z-index:calc(var(--blora-z-dropdown, 1000) - 1);display:none;"; document.body.appendChild(mask);
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
        if (viewMode === "days") html += '<span class="blora-datepicker__title" data-zoom="months">' + viewYear + LOCALE.year + " " + LOCALE.months[viewMonth] + '</span>';
        else if (viewMode === "months") html += '<span class="blora-datepicker__title" data-zoom="years">' + viewYear + LOCALE.year + '</span>';
        else { const decStart = Math.floor(viewYear / 10) * 10; html += '<span class="blora-datepicker__title" data-zoom="years">' + decStart + "–" + (decStart + 9) + LOCALE.year + '</span>'; }
        html += '<button class="blora-datepicker__nav" data-nav="next">' + CAL_ICON_NEXT + '</button></div>';
        if (viewMode === "days") {
          html += '<div class="blora-datepicker__grid">';
          LOCALE.dow.forEach((d) => { html += '<div class="blora-datepicker__dow">' + d + '</div>'; });
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
            html += '<div class="' + cls + '" data-month="' + m + '">' + name + '</div>';
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
        html += '<div class="blora-datepicker__foot"><button class="blora-btn blora-btn--text blora-btn--sm" data-clear>' + LOCALE.clear + '</button><button class="blora-btn blora-btn--text blora-btn--sm" data-today>' + LOCALE.today + '</button></div>';
        panel.innerHTML = html;
      };
      const open = () => { syncFromInput(); viewMode = "days"; panel.classList.add("is-open"); mask.style.display = "block"; render(); };
      const close = () => { panel.classList.remove("is-open"); mask.style.display = "none"; };
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
      const panel = document.createElement("div"); panel.className = "blora-timepicker__panel"; wrap.appendChild(panel);
      const mask = document.createElement("div"); mask.style.cssText = "position:fixed;inset:0;z-index:calc(var(--blora-z-dropdown, 1000) - 1);display:none;"; document.body.appendChild(mask);
      const pad = (n) => String(n).padStart(2, "0"); const fmt = () => pad(curH) + ":" + pad(curM);
      const syncFromInput = () => { if (input.value) { const parts = input.value.split(":"); if (parts.length === 2) { curH = Number(parts[0]) || 0; curM = Number(parts[1]) || 0; } } };
      const render = () => {
        let html = '<div class="blora-timepicker__cols">';
        html += '<div class="blora-timepicker__col"><span class="blora-timepicker__label">' + LOCALE.hour + '</span><div class="blora-timepicker__scroll" data-scroll="h">';
        for (let h = 0; h < 24; h++) html += '<div class="blora-timepicker__item' + (h === curH ? " is-selected" : "") + '" data-h="' + h + '">' + pad(h) + '</div>';
        html += '</div></div><span class="blora-timepicker__sep">:</span>';
        html += '<div class="blora-timepicker__col"><span class="blora-timepicker__label">' + LOCALE.minute + '</span><div class="blora-timepicker__scroll" data-scroll="m">';
        for (let m = 0; m < 60; m++) html += '<div class="blora-timepicker__item' + (m === curM ? " is-selected" : "") + '" data-m="' + m + '">' + pad(m) + '</div>';
        html += '</div></div></div>';
        html += '<div class="blora-datepicker__foot"><button class="blora-btn blora-btn--text blora-btn--sm" data-now>' + LOCALE.now + '</button><button class="blora-btn blora-btn--text blora-btn--sm" data-confirm>' + LOCALE.confirm + '</button></div>';
        panel.innerHTML = html;
        const hScroll = panel.querySelector('[data-scroll="h"]'), mScroll = panel.querySelector('[data-scroll="m"]');
        const hSel = hScroll && hScroll.querySelector(".is-selected"), mSel = mScroll && mScroll.querySelector(".is-selected");
        if (hSel && hScroll) hScroll.scrollTop = hSel.offsetTop - hScroll.clientHeight / 2 + hSel.clientHeight / 2;
        if (mSel && mScroll) mScroll.scrollTop = mSel.offsetTop - mScroll.clientHeight / 2 + mSel.clientHeight / 2;
      };
      const open = () => { syncFromInput(); panel.classList.add("is-open"); mask.style.display = "block"; render(); };
      const close = () => { panel.classList.remove("is-open"); mask.style.display = "none"; };
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
        if (viewMode === "days") html += '<div class="blora-calendar__title" data-zoom="months">' + viewYear + LOCALE.year + " " + LOCALE.months[viewMonth] + '</div>';
        else if (viewMode === "months") html += '<div class="blora-calendar__title" data-zoom="years">' + viewYear + LOCALE.year + '</div>';
        else { const decStart = Math.floor(viewYear / 10) * 10; html += '<div class="blora-calendar__title" data-zoom="years">' + decStart + "–" + (decStart + 9) + LOCALE.year + '</div>'; }
        html += '<button class="blora-btn blora-btn--outline blora-btn--sm" data-today>' + LOCALE.today + '</button></div>';
        if (viewMode === "days") {
          html += '<div class="blora-calendar__grid">';
          LOCALE.dow.forEach((d) => { html += '<div class="blora-calendar__dow">' + d + '</div>'; });
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
          LOCALE.months.forEach((name, m) => { let cls = "blora-calendar__cell blora-calendar__cell--month"; if (selected && viewYear === selected.getFullYear() && m === selected.getMonth()) cls += " is-selected"; if (viewYear === today.getFullYear() && m === today.getMonth()) cls += " is-today"; html += '<div class="' + cls + '" data-month="' + m + '">' + name + '</div>'; });
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

  /* —— Color Picker —— */
  const BLORA_PALETTE = ["#A0392E","#C44536","#7E2A22","#C25D52","#8B6F47","#B59B78","#D4A574","#B89968","#3D4A5C","#6B7889","#5A7B6B","#8AA89A","#7B9B7E","#1C1A17","#4A453D","#9B9489","#D8D2C4","#F8F4EC","#FBF8F0","#E9E3D2","#F2ECDE","#E6DFCC","#F5F1E8","#B8B0A2"];
  function initColorPicker(root) {
    $$(".blora-color-picker", root).forEach((wrap) => {
      if (bound(wrap, "Colorpicker")) return;
      const swatch = $(".blora-color-swatch", wrap);
      const panel = $(".blora-color-panel", wrap);
      if (!swatch || !panel) return;
      const hexInput = $(".blora-color-hex", panel);
      const preview = $(".blora-color-preview", panel);
      let current = swatch.dataset.color || "#A0392E";
      const mask = document.createElement("div"); mask.style.cssText = "position:fixed;inset:0;z-index:calc(var(--blora-z-dropdown, 1000) - 1);display:none;"; document.body.appendChild(mask);
      const update = (color) => {
        current = color; swatch.style.background = color;
        if (preview) preview.style.background = color;
        if (hexInput) hexInput.value = color.toUpperCase();
        $$(".blora-color-cell", panel).forEach((c) => c.classList.toggle("is-selected", c.dataset.color.toUpperCase() === color.toUpperCase()));
        swatch.dataset.color = color;
      };
      const grid = $(".blora-color-grid", panel);
      if (grid) { BLORA_PALETTE.forEach((color) => { const cell = document.createElement("div"); cell.className = "blora-color-cell"; cell.style.background = color; cell.dataset.color = color; on(cell, "click", () => { update(color); }); grid.appendChild(cell); }); }
      if (hexInput) { on(hexInput, "input", () => { let v = hexInput.value.trim(); if (v && !v.startsWith("#")) v = "#" + v; if (/^#[0-9a-fA-F]{6}$/.test(v)) update(v); }); }
      const open = () => { panel.classList.add("is-open"); mask.style.display = "block"; update(current); };
      const close = () => { panel.classList.remove("is-open"); mask.style.display = "none"; };
      on(swatch, "click", (e) => { e.stopPropagation(); panel.classList.contains("is-open") ? close() : open(); });
      on(mask, "click", () => close());
      update(current);
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
      on(trigger, "click", (e) => { e.stopPropagation(); const open = menu.classList.contains("is-open"); $$(".blora-dropdown-menu.is-open").forEach((m) => m !== menu && m.classList.remove("is-open")); menu.classList.toggle("is-open", !open); });
    });
    if (!FLAGS.dropdownDoc) {
      FLAGS.dropdownDoc = true;
      on(document, "click", () => $$(".blora-dropdown-menu.is-open").forEach((m) => m.classList.remove("is-open")));
    }
  }

  /* —— Init all —— */
  function init(root = document) {
    initTabs(root);
    initCollapse(root);
    initModal(root);
    initDrawer(root);
    initPopover(root);
    initDropdown(root);
    initSegmented(root);
    initBtnLoading(root);
    initRate(root);
    initSlider(root);
    initTagsInput(root);
    initNumber(root);
    initCheckbox(root);
    initTree(root);
    initCarousel(root);
    initBackTop();
    initScrollSpy(root);
    initSmoothScroll();
    initThemeToggle(root);
    initDropzone(root);
    initCommandPalette();
    initDateGuard(root);
    initOTP(root);
    initCustomSelect(root);
    initRange(root);
    initTransfer(root);
    initCascader(root);
    initDatePicker(root);
    initTimePicker(root);
    initCalendar(root);
    initColorPicker(root);
  }

  /* —— Public API —— */
  const Blora = { init, toast, openModal, closeModal, openDrawer, closeDrawer, locale: LOCALE, version: "1.0.0" };
  window.Blora = Blora;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init());
  else init();
})();
