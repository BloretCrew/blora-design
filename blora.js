/* ========================================================================
   Blora Design · blora.js
   轻量的交互层 — 让静态的"水墨"活起来。
   无依赖、约 6KB。只做该做的事：开关、显隐、步进、拖拽。
   ======================================================================== */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);

  /* —— Tabs —— */
  function initTabs(root) {
    $$("[data-blora-tabs]", root).forEach((group) => {
      const tabs = $$(".blora-tabs__tab", group);
      const panels = $$(".blora-tabs__panel", group);
      tabs.forEach((tab, i) => {
        if (tab.classList.contains("is-disabled")) return;
        on(tab, "click", () => {
          tabs.forEach((t) => t.classList.remove("is-active"));
          panels.forEach((p) => p.classList.add("blora-hide"));
          tab.classList.add("is-active");
          const panel = panels[i] || panels[Number(tab.dataset.tab)];
          if (panel) panel.classList.remove("blora-hide");
        });
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

  /* —— Modal —— */
  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add("is-open");
    document.body.style.overflow = "hidden";
    $$("[data-blora-close]", m).forEach((b) => on(b, "click", () => closeModal(m), { once: true }));
    on($(".blora-modal__mask", m), "click", () => closeModal(m), { once: true });
    on(document, "keydown", function esc(e) {
      if (e.key === "Escape") { closeModal(m); document.removeEventListener("keydown", esc); }
    });
  }
  function closeModal(m) {
    m = typeof m === "string" ? document.getElementById(m) : m;
    if (!m) return;
    m.classList.remove("is-open");
    if (!$(".blora-modal.is-open")) document.body.style.overflow = "";
  }
  function initModal(root) {
    $$("[data-blora-modal-open]", root).forEach((btn) => {
      on(btn, "click", () => openModal(btn.dataset.bloraModalOpen));
    });
  }

  /* —— Drawer —— */
  function openDrawer(id) {
    const d = document.getElementById(id);
    if (!d) return;
    d.classList.add("is-open");
    document.body.style.overflow = "hidden";
    $$("[data-blora-close]", d).forEach((b) => on(b, "click", () => closeDrawer(d), { once: true }));
    on($(".blora-drawer__mask", d), "click", () => closeDrawer(d), { once: true });
  }
  function closeDrawer(d) {
    d = typeof d === "string" ? document.getElementById(d) : d;
    if (!d) return;
    d.classList.remove("is-open");
    if (!$(".blora-drawer.is-open")) document.body.style.overflow = "";
  }
  function initDrawer(root) {
    $$("[data-blora-drawer-open]", root).forEach((btn) => {
      on(btn, "click", () => openDrawer(btn.dataset.bloraDrawerOpen));
    });
  }

  /* —— Popover —— */
  function initPopover(root) {
    $$("[data-blora-popover]", root).forEach((trigger) => {
      const pop = trigger.closest(".blora-popover");
      if (!pop) return;
      on(trigger, "click", (e) => {
        e.stopPropagation();
        $$(".blora-popover.is-open").forEach((o) => o !== pop && o.classList.remove("is-open"));
        pop.classList.toggle("is-open");
      });
    });
    on(document, "click", (e) => {
      if (!e.target.closest(".blora-popover")) $$(".blora-popover.is-open").forEach((p) => p.classList.remove("is-open"));
    });
  }

  /* —— Dropdown Menu —— */
  function initDropdown(root) {
    $$("[data-blora-dropdown-trigger]", root).forEach((trigger) => {
      const menu = trigger.parentElement.querySelector(".blora-dropdown-menu");
      if (!menu) return;
      on(trigger, "click", (e) => {
        e.stopPropagation();
        const open = menu.classList.contains("is-open");
        $$(".blora-dropdown-menu.is-open").forEach((m) => m !== menu && m.classList.remove("is-open"));
        menu.classList.toggle("is-open", !open);
      });
    });
    on(document, "click", () => $$(".blora-dropdown-menu.is-open").forEach((m) => m.classList.remove("is-open")));
  }

  /* —— Toast —— */
  function toast(opts) {
    opts = typeof opts === "string" ? { message: opts } : (opts || {});
    let c = $(".blora-toast-container");
    if (!c) { c = document.createElement("div"); c.className = "blora-toast-container"; document.body.appendChild(c); }
    const type = opts.type || "info";
    const icons = {
      success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
      warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>',
      danger:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
      info:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    };
    const el = document.createElement("div");
    el.className = "blora-toast";
    el.innerHTML = `<div class="blora-message blora-message--${type}"><span class="blora-message__icon">${icons[type] || "i"}</span><span>${opts.message || ""}</span></div>`;
    c.appendChild(el);
    const ms = opts.duration || 3000;
    setTimeout(() => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), 240); }, ms);
  }

  /* —— Segmented —— */
  function initSegmented(root) {
    $$(".blora-segmented", root).forEach((seg) => {
      $$(".blora-segmented__item", seg).forEach((item) => {
        on(item, "click", () => {
          $$(".blora-segmented__item", seg).forEach((i) => i.classList.remove("is-active"));
          item.classList.add("is-active");
        });
      });
    });
  }

  /* —— Button loading demo —— */
  function initBtnLoading(root) {
    $$("[data-blora-loading]", root).forEach((btn) => {
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

  /* —— Slider value sync —— */
  function initSlider(root) {
    $$(".blora-slider", root).forEach((wrap) => {
      const input = $(".blora-slider__input", wrap);
      const val = $(".blora-slider__value", wrap);
      if (!input || !val) return;
      const sync = () => { val.textContent = input.value; };
      sync();
      on(input, "input", sync);
    });
  }

  /* —— Tags input —— */
  function initTagsInput(root) {
    $$(".blora-tags-input", root).forEach((box) => {
      const input = $("input", box);
      if (!input) return;
      const add = (text) => {
        text = text.trim();
        if (!text) return;
        const tag = document.createElement("span");
        tag.className = "blora-tag blora-tag--seal blora-tag--removable";
        tag.innerHTML = `${text}<span class="blora-tag__close" aria-label="移除"></span>`;
        tag.querySelector(".blora-tag__close").addEventListener("click", () => tag.remove());
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
      if (box.id === "otp-ctrl") return;
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

  /* —— Switch (just visual via CSS, no JS needed) but sync aria —— */
  /* Checkbox indeterminate demo */
  function initCheckbox(root) {
    $$("[data-blora-checkall]", root).forEach((master) => {
      const group = master.closest("form, .blora-field, [data-blora-check-group], .blora-demo") || document;
      const items = $$('input[type="checkbox"]:not([data-blora-checkall])', group).filter((i) => i.closest(".blora-checkbox") && !i.closest(".blora-transfer") && !i.disabled);
      const label = master.closest(".blora-checkbox");
      const sync = () => {
        const checked = items.filter((i) => i.checked);
        const all = checked.length === items.length && items.length > 0;
        const some = checked.length > 0 && !all;
        master.checked = all;
        master.indeterminate = some;
        /* 半选与全选均显示正方形（indeterminate 样式），仅空态显示空框 */
        if (label) label.classList.toggle("blora-checkbox--indeterminate", all || some);
      };
      on(master, "click", () => {
        /* 全选态点击则取消全选；非全选态点击则全选（禁用项不动） */
        const all = items.every((i) => i.checked);
        items.forEach((i) => i.checked = !all);
        sync();
      });
      items.forEach((i) => on(i, "change", sync));
      sync();
    });
  }

  /* —— OTP 验证码 —— 自动跳框、退格回退、粘贴、可调长度与字符类型 —— */
  function initOTP(root) {
    $$(".blora-otp", root).forEach((otp) => {
      const mode = otp.dataset.mode || "any"; /* numeric | alphanumeric | any */
      const filters = {
        numeric: /[^0-9]/g,
        alphanumeric: /[^0-9a-zA-Z]/g,
        any: null,
      };
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
        if (inp.value.length >= 1) {
          if (idx < all.length - 1) all[idx + 1].focus();
        }
      };
      const backspace = (inp, e) => {
        if (e.key === "Backspace" && !inp.value) {
          const all = inputs();
          const idx = all.indexOf(inp);
          if (idx > 0) { all[idx - 1].focus(); all[idx - 1].value = ""; e.preventDefault(); }
        }
        if (e.key === "ArrowLeft") {
          const all = inputs(); const idx = all.indexOf(inp);
          if (idx > 0) all[idx - 1].focus();
        }
        if (e.key === "ArrowRight") {
          const all = inputs(); const idx = all.indexOf(inp);
          if (idx < all.length - 1) all[idx + 1].focus();
        }
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
      /* —— 外部调节长度 —— */
      const ctrl = otp.dataset.otpCtrl && document.getElementById(otp.dataset.otpCtrl);
      if (ctrl) {
        const stepper = $(".blora-number__btn[data-step='up']", ctrl);
        const dn = $(".blora-number__btn[data-step='down']", ctrl);
        const numInp = $(".blora-input", ctrl);
        const rebuild = (n) => {
          n = Math.max(4, Math.min(8, n));
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
        on(stepper, "click", () => { rebuild(Number(numInp.value) + 1); numInp.value = Math.min(8, Number(numInp.value) + 1); });
        on(dn, "click", () => { rebuild(Number(numInp.value) - 1); numInp.value = Math.max(4, Number(numInp.value) - 1); });
      }
      /* —— 字符类型切换 —— */
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
      /* —— 自动大写开关 —— */
      if (upperCb) {
        on(upperCb, "change", () => reFilter());
      }
    });
  }

  /* —— 自定义下拉 · Custom Select —— */
  function initCustomSelect(root) {
    $$(".blora-select-wrap", root).forEach((wrap) => {
      const sel = $("select", wrap);
      if (!sel) return;
      const trigger = $(".blora-select-trigger", wrap);
      const menu = $(".blora-select-menu", wrap);
      if (!trigger || !menu) return;
      const opts = $$("option", sel);
      const update = () => {
        const chosen = opts.find((o) => o.selected && !o.disabled);
        trigger.textContent = chosen ? chosen.textContent : (opts[0] && opts[0].disabled ? opts[0].textContent : "请选择");
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

  /* —— 级联选择 · Cascader —— 点击节点展开下一列，叶子节点更新结果 —— */
  function initCascader(root) {
    $$("[data-blora-cascader]", root).forEach((el) => {
      let data;
      try { data = JSON.parse(el.dataset.bloraCascader); } catch (e) { return; }
      const path = []; /* [{label, children?}] */
      const result = el.parentElement.querySelector(".blora-cascader__result");
      const arrow = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.5;margin-left:auto;padding-left:0.3em;"><path d="M9 18l6-6-6-6"/></svg>';
      const render = () => {
        el.innerHTML = "";
        /* 第一列：顶级 */
        let level = 0;
        const cols = [data];
        while (level < path.length) {
          cols.push(path[level].children || []);
          level++;
        }
        cols.forEach((items, ci) => {
          const col = document.createElement("div");
          col.className = "blora-cascader__col";
          items.forEach((item) => {
            const opt = document.createElement("div");
            opt.className = "blora-cascader__opt" + (path[ci] && path[ci].label === item.label ? " is-selected" : "");
            const hasChild = item.children && item.children.length;
            opt.innerHTML = "<span>" + item.label + "</span>" + (hasChild ? arrow : "");
            on(opt, "click", () => {
              /* 截断到当前列 */
              path.splice(ci);
              path[ci] = item;
              if (!hasChild) {
                /* 叶子：更新结果 */
                if (result) result.textContent = "已选：" + path.map((p) => p.label).join(" / ");
              }
              render();
            });
            col.appendChild(opt);
          });
          el.appendChild(col);
        });
      };
      render();
      /* 默认选第一条路径 */
      if (data.length && data[0].children && data[0].children.length) {
        path.push(data[0]);
        if (data[0].children[0].children && data[0].children[0].children.length) {
          path.push(data[0].children[0]);
        } else {
          if (result) result.textContent = "已选：" + path.map((p) => p.label).join(" / ");
        }
        render();
      }
    });
  }

  /* —— 范围滑块 · Range Slider (双滑块拖动) —— */
  function initRange(root) {
    $$(".blora-range", root).forEach((range) => {
      const track = $(".blora-range__track", range);
      const fill = $(".blora-range__fill", range);
      const thumbs = $$(".blora-range__thumb", range);
      if (!track || thumbs.length < 2) return;
      const min = Number(range.dataset.min || 0);
      const max = Number(range.dataset.max || 100);
      let v1 = Number(thumbs[0].dataset.val || 20);
      let v2 = Number(thumbs[1].dataset.val || 75);
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
      };
      const toVal = (clientX) => {
        const rect = track.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round(min + pct * (max - min));
      };
      thumbs.forEach((thumb, i) => {
        on(thumb, "mousedown", (e) => {
          e.preventDefault();
          const move = (ev) => {
            const v = toVal(ev.clientX);
            if (i === 0) v1 = v; else v2 = v;
            render();
          };
          const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
          document.addEventListener("mousemove", move);
          document.addEventListener("mouseup", up);
        });
        on(thumb, "touchstart", (e) => {
          e.preventDefault();
          const move = (ev) => {
            const v = toVal(ev.touches[0].clientX);
            if (i === 0) v1 = v; else v2 = v;
            render();
          };
          const up = () => { document.removeEventListener("touchmove", move); document.removeEventListener("touchend", up); };
          document.addEventListener("touchmove", move);
          document.addEventListener("touchend", up);
        });
      });
      render();
    });
  }

  /* —— 穿梭框 · Transfer —— */
  function initTransfer(root) {
    $$(".blora-transfer", root).forEach((tf) => {
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
      const updateHeads = () => {
        const lc = $$("label", leftList).length;
        const rc = $$("label", rightList).length;
        leftHead.textContent = "候选 · " + lc;
        rightHead.textContent = "已选 · " + rc;
      };
      const move = (from, to, head) => {
        $$("label", from).forEach((row) => {
          const inp = $("input", row);
          if (inp && inp.checked) {
            inp.checked = false;
            to.appendChild(row);
          }
        });
        updateHeads();
      };
      on(toRight, "click", () => move(leftList, rightList));
      on(toLeft, "click", () => move(rightList, leftList));
      updateHeads();
    });
  }

  /* —— Tree —— */
  function initTree(root) {
    $$(".blora-tree__toggle", root).forEach((toggle) => {
      on(toggle, "click", (e) => {
        e.stopPropagation();
        const node = toggle.closest(".blora-tree__node");
        if (node) node.classList.toggle("is-open");
      });
    });
    $$(".blora-tree__node", root).forEach((node) => {
      on(node, "click", (e) => {
        if (e.target.closest(".blora-tree__toggle")) return;
        $$(".blora-tree__node.is-selected", node.closest(".blora-tree")).forEach((n) => n !== node && n.classList.remove("is-selected"));
        node.classList.toggle("is-selected");
      });
    });
  }

  /* —— Carousel —— */
  function initCarousel(root) {
    $$(".blora-carousel", root).forEach((car) => {
      const track = $(".blora-carousel__track", car);
      const slides = $$(".blora-carousel__slide", car);
      const dots = $$(".blora-carousel__dot", car);
      let i = 0;
      const go = (n) => {
        i = (n + slides.length) % slides.length;
        track.style.transform = `translateX(-${i * 100}%)`;
        dots.forEach((d, j) => d.classList.toggle("is-active", j === i));
      };
      const prev = $(".blora-carousel__arrow--prev", car);
      const next = $(".blora-carousel__arrow--next", car);
      on(prev, "click", () => go(i - 1));
      on(next, "click", () => go(i + 1));
      dots.forEach((d, j) => on(d, "click", () => go(j)));
      if (car.hasAttribute("data-autoplay")) car._timer = setInterval(() => go(i + 1), 4000);
    });
  }

  /* —— Stepper / Steps demo —— */
  /* (Static states used in showcase; no JS needed unless interactive.) */

  /* —— Back to top —— */
  function initBackTop() {
    let fab = $("#blora-fab");
    if (!fab) {
      fab = document.createElement("button");
      fab.id = "blora-fab";
      fab.className = "blora-fab";
      fab.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
      fab.setAttribute("aria-label", "回到顶部");
      document.body.appendChild(fab);
    }
    on(fab, "click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    on(window, "scroll", () => { fab.style.opacity = window.scrollY > 400 ? "1" : "0"; fab.style.pointerEvents = window.scrollY > 400 ? "auto" : "none"; });
  }

  /* —— Date input 防御 —— 仅在 blur 时校验范围，输入过程不干预 —— */
  function initDateGuard(root) {
    $$('input[type="date"]', root).forEach((inp) => {
      on(inp, "blur", () => {
        const v = inp.value;
        if (!v) return;
        const min = inp.min, max = inp.max;
        if (min && v < min) { inp.value = min; }
        if (max && v > max) { inp.value = max; }
      });
    });
  }

  /* —— 日期选择器 · Date Picker —— 自建日历面板 —— */
  const CAL_ICON_PREV = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
  const CAL_ICON_NEXT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
  const CAL_MONTHS = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
  const CAL_DOW = ["日","一","二","三","四","五","六"];

  function initDatePicker(root) {
    $$("[data-blora-datepicker]", root).forEach((wrap) => {
      const input = $(".blora-input", wrap);
      const btn = $(".blora-datepicker__btn", wrap);
      if (!input) return;
      const min = input.min;
      const max = input.max;
      let selected = null;
      let viewYear, viewMonth;
      let viewMode = "days"; /* days | months | years */
      const today = new Date();

      const panel = document.createElement("div");
      panel.className = "blora-datepicker__panel";
      wrap.appendChild(panel);

      const fmt = (d) => d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
      const inRange = (d) => {
        if (min && fmt(d) < min) return false;
        if (max && fmt(d) > max) return false;
        return true;
      };
      const inRangeYM = (y, m) => {
        const d = new Date(y, m, 1);
        const last = new Date(y, m + 1, 0);
        if (max && fmt(d) > max) return false;
        if (min && fmt(last) < min) return false;
        return true;
      };
      const inRangeY = (y) => {
        if (max && y > Number(max.slice(0,4))) return false;
        if (min && y < Number(min.slice(0,4))) return false;
        return true;
      };
      const syncFromInput = () => {
        if (input.value) {
          const d = new Date(input.value);
          if (!isNaN(d)) { selected = d; viewYear = d.getFullYear(); viewMonth = d.getMonth(); return; }
        }
        selected = null;
        if (!viewYear) { viewYear = today.getFullYear(); viewMonth = today.getMonth(); }
      };

      const render = () => {
        let html = '<div class="blora-datepicker__head">';
        html += '<button class="blora-datepicker__nav" data-nav="prev">' + CAL_ICON_PREV + '</button>';
        if (viewMode === "days") {
          html += '<span class="blora-datepicker__title" data-zoom="months">' + viewYear + "年 " + CAL_MONTHS[viewMonth] + '</span>';
        } else if (viewMode === "months") {
          html += '<span class="blora-datepicker__title" data-zoom="years">' + viewYear + "年" + '</span>';
        } else {
          const decStart = Math.floor(viewYear / 10) * 10;
          html += '<span class="blora-datepicker__title" data-zoom="years">' + decStart + "–" + (decStart + 9) + "年" + '</span>';
        }
        html += '<button class="blora-datepicker__nav" data-nav="next">' + CAL_ICON_NEXT + '</button>';
        html += '</div>';

        if (viewMode === "days") {
          html += '<div class="blora-datepicker__grid">';
          CAL_DOW.forEach((d) => { html += '<div class="blora-datepicker__dow">' + d + '</div>'; });
          const first = new Date(viewYear, viewMonth, 1);
          const startDay = first.getDay();
          const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
          const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
          for (let i = startDay - 1; i >= 0; i--) {
            html += '<div class="blora-datepicker__cell is-other">' + (daysInPrev - i) + '</div>';
          }
          for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(viewYear, viewMonth, day);
            const isToday = d.toDateString() === today.toDateString();
            const isSel = selected && d.toDateString() === selected.toDateString();
            const disabled = !inRange(d);
            let cls = "blora-datepicker__cell";
            if (isToday) cls += " is-today";
            if (isSel) cls += " is-selected";
            if (disabled) cls += " is-disabled";
            html += '<div class="' + cls + '" data-day="' + day + '">' + day + '</div>';
          }
          const total = startDay + daysInMonth;
          const remaining = (7 - (total % 7)) % 7;
          for (let i = 1; i <= remaining; i++) {
            html += '<div class="blora-datepicker__cell is-other">' + i + '</div>';
          }
          html += '</div>';
        } else if (viewMode === "months") {
          html += '<div class="blora-datepicker__grid blora-datepicker__grid--months">';
          CAL_MONTHS.forEach((name, m) => {
            const isSel = selected && viewYear === selected.getFullYear() && m === selected.getMonth();
            const isTodayM = viewYear === today.getFullYear() && m === today.getMonth();
            const disabled = !inRangeYM(viewYear, m);
            let cls = "blora-datepicker__cell blora-datepicker__cell--month";
            if (isSel) cls += " is-selected";
            if (isTodayM) cls += " is-today";
            if (disabled) cls += " is-disabled";
            html += '<div class="' + cls + '" data-month="' + m + '">' + name + '</div>';
          });
          html += '</div>';
        } else {
          const decStart = Math.floor(viewYear / 10) * 10;
          html += '<div class="blora-datepicker__grid blora-datepicker__grid--years">';
          for (let y = decStart - 1; y <= decStart + 10; y++) {
            const isSel = selected && y === selected.getFullYear();
            const isTodayY = y === today.getFullYear();
            const disabled = !inRangeY(y);
            let cls = "blora-datepicker__cell blora-datepicker__cell--year";
            if (y < decStart || y > decStart + 9) cls += " is-other";
            if (isSel) cls += " is-selected";
            if (isTodayY) cls += " is-today";
            if (disabled) cls += " is-disabled";
            html += '<div class="' + cls + '" data-year="' + y + '">' + y + '</div>';
          }
          html += '</div>';
        }

        html += '<div class="blora-datepicker__foot"><button class="blora-btn blora-btn--text blora-btn--sm" data-clear>清除</button><button class="blora-btn blora-btn--text blora-btn--sm" data-today>今日</button></div>';
        panel.innerHTML = html;
      };

      const open = () => { syncFromInput(); viewMode = "days"; panel.classList.add("is-open"); render(); };
      const close = () => { panel.classList.remove("is-open"); };

      on(btn, "click", (e) => { e.preventDefault(); e.stopPropagation(); panel.classList.contains("is-open") ? close() : open(); });
      on(document, "click", (e) => { if (!e.target.closest(wrap)) close(); });

      on(panel, "click", (e) => {
        const nav = e.target.closest("[data-nav]");
        if (nav) {
          if (viewMode === "days") {
            if (nav.dataset.nav === "prev") { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } }
            else { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } }
          } else if (viewMode === "months") {
            viewYear += (nav.dataset.nav === "prev" ? -1 : 1);
          } else {
            viewYear += (nav.dataset.nav === "prev" ? -10 : 10);
          }
          render();
          return;
        }
        const zoom = e.target.closest("[data-zoom]");
        if (zoom) {
          if (zoom.dataset.zoom === "months") viewMode = "months";
          else if (zoom.dataset.zoom === "years") viewMode = "years";
          render();
          return;
        }
        const todayBtn = e.target.closest("[data-today]");
        if (todayBtn) {
          selected = new Date();
          viewYear = selected.getFullYear(); viewMonth = selected.getMonth();
          viewMode = "days";
          input.value = fmt(selected);
          render();
          close();
          input.dispatchEvent(new Event("change", { bubbles: true }));
          return;
        }
        const clearBtn = e.target.closest("[data-clear]");
        if (clearBtn) {
          selected = null; input.value = ""; render(); close();
          input.dispatchEvent(new Event("change", { bubbles: true }));
          return;
        }
        const dayCell = e.target.closest(".blora-datepicker__cell[data-day]");
        if (dayCell && !dayCell.classList.contains("is-disabled")) {
          const day = Number(dayCell.dataset.day);
          selected = new Date(viewYear, viewMonth, day);
          input.value = fmt(selected);
          close();
          input.dispatchEvent(new Event("change", { bubbles: true }));
          return;
        }
        const monthCell = e.target.closest(".blora-datepicker__cell--month[data-month]");
        if (monthCell && !monthCell.classList.contains("is-disabled")) {
          viewMonth = Number(monthCell.dataset.month);
          viewMode = "days";
          render();
          return;
        }
        const yearCell = e.target.closest(".blora-datepicker__cell--year[data-year]");
        if (yearCell && !yearCell.classList.contains("is-disabled")) {
          viewYear = Number(yearCell.dataset.year);
          viewMode = "months";
          render();
          return;
        }
      });

      render();
    });
  }

  /* —— 时间选择器 · Time Picker —— 自建时/分面板 —— */
  function initTimePicker(root) {
    $$("[data-blora-timepicker]", root).forEach((wrap) => {
      const input = $(".blora-input", wrap);
      const btn = $(".blora-datepicker__btn", wrap);
      if (!input) return;
      let curH = 14, curM = 30;

      const panel = document.createElement("div");
      panel.className = "blora-timepicker__panel";
      wrap.appendChild(panel);

      const pad = (n) => String(n).padStart(2, "0");
      const fmt = () => pad(curH) + ":" + pad(curM);
      const syncFromInput = () => {
        if (input.value) {
          const parts = input.value.split(":");
          if (parts.length === 2) { curH = Number(parts[0]) || 0; curM = Number(parts[1]) || 0; }
        }
      };

      const render = () => {
        let html = '<div class="blora-timepicker__cols">';
        html += '<div class="blora-timepicker__col"><span class="blora-timepicker__label">时</span><div class="blora-timepicker__scroll" data-scroll="h">';
        for (let h = 0; h < 24; h++) {
          html += '<div class="blora-timepicker__item' + (h === curH ? " is-selected" : "") + '" data-h="' + h + '">' + pad(h) + '</div>';
        }
        html += '</div></div>';
        html += '<span class="blora-timepicker__sep">:</span>';
        html += '<div class="blora-timepicker__col"><span class="blora-timepicker__label">分</span><div class="blora-timepicker__scroll" data-scroll="m">';
        for (let m = 0; m < 60; m++) {
          html += '<div class="blora-timepicker__item' + (m === curM ? " is-selected" : "") + '" data-m="' + m + '">' + pad(m) + '</div>';
        }
        html += '</div></div></div>';
        html += '<div class="blora-datepicker__foot"><button class="blora-btn blora-btn--text blora-btn--sm" data-now>现在</button><button class="blora-btn blora-btn--text blora-btn--sm" data-confirm>确定</button></div>';
        panel.innerHTML = html;
        const hScroll = panel.querySelector('[data-scroll="h"]');
        const mScroll = panel.querySelector('[data-scroll="m"]');
        const hSel = hScroll && hScroll.querySelector(".is-selected");
        const mSel = mScroll && mScroll.querySelector(".is-selected");
        if (hSel && hScroll) hScroll.scrollTop = hSel.offsetTop - hScroll.clientHeight / 2 + hSel.clientHeight / 2;
        if (mSel && mScroll) mScroll.scrollTop = mSel.offsetTop - mScroll.clientHeight / 2 + mSel.clientHeight / 2;
      };

      const open = () => { syncFromInput(); panel.classList.add("is-open"); render(); };
      const close = () => { panel.classList.remove("is-open"); };
      const update = () => { input.value = fmt(); input.dispatchEvent(new Event("change", { bubbles: true })); };

      on(btn, "click", (e) => { e.preventDefault(); e.stopPropagation(); panel.classList.contains("is-open") ? close() : open(); });
      on(document, "click", (e) => { if (!e.target.closest(wrap)) close(); });

      on(panel, "click", (e) => {
        const hItem = e.target.closest("[data-h]");
        if (hItem) { curH = Number(hItem.dataset.h); render(); return; }
        const mItem = e.target.closest("[data-m]");
        if (mItem) { curM = Number(mItem.dataset.m); render(); return; }
        const nowBtn = e.target.closest("[data-now]");
        if (nowBtn) {
          const d = new Date(); curH = d.getHours(); curM = d.getMinutes();
          update(); close(); return;
        }
        const confirmBtn = e.target.closest("[data-confirm]");
        if (confirmBtn) { update(); close(); return; }
      });
    });
  }

  /* —— 日历 · Calendar —— 标题点击切换视图（日→月→年），与日期选择器统一 —— */
  function initCalendar(root) {
    $$("[data-blora-calendar]", root).forEach((cal) => {
      const today = new Date();
      let viewYear = today.getFullYear();
      let viewMonth = today.getMonth();
      let viewMode = "days";
      let selected = null;
      /* 演示用的标记点 */
      const dots = {};
      const dotKey = (y, m, d) => y + "-" + m + "-" + d;
      dots[dotKey(today.getFullYear(), today.getMonth(), 3)] = "seal";
      dots[dotKey(today.getFullYear(), today.getMonth(), 9)] = "moss";
      dots[dotKey(today.getFullYear(), today.getMonth(), 15)] = "seal";
      dots[dotKey(today.getFullYear(), today.getMonth(), 22)] = "moss";

      const fmt = (d) => d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");

      const render = () => {
        let html = '<div class="blora-calendar__head">';
        html += '<div class="blora-row blora-row--tight">';
        html += '<button class="blora-btn blora-btn--ghost blora-btn--icon blora-btn--sm" data-nav="prev">' + CAL_ICON_PREV + '</button>';
        html += '<button class="blora-btn blora-btn--ghost blora-btn--icon blora-btn--sm" data-nav="next">' + CAL_ICON_NEXT + '</button>';
        html += '</div>';
        if (viewMode === "days") {
          html += '<div class="blora-calendar__title" data-zoom="months">' + viewYear + "年 " + CAL_MONTHS[viewMonth] + '</div>';
        } else if (viewMode === "months") {
          html += '<div class="blora-calendar__title" data-zoom="years">' + viewYear + "年" + '</div>';
        } else {
          const decStart = Math.floor(viewYear / 10) * 10;
          html += '<div class="blora-calendar__title" data-zoom="years">' + decStart + "–" + (decStart + 9) + "年" + '</div>';
        }
        html += '<button class="blora-btn blora-btn--outline blora-btn--sm" data-today>今日</button>';
        html += '</div>';

        if (viewMode === "days") {
          html += '<div class="blora-calendar__grid">';
          CAL_DOW.forEach((d) => { html += '<div class="blora-calendar__dow">' + d + '</div>'; });
          const first = new Date(viewYear, viewMonth, 1);
          const startDay = first.getDay();
          const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
          const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
          for (let i = startDay - 1; i >= 0; i--) {
            html += '<div class="blora-calendar__cell is-other">' + (daysInPrev - i) + '</div>';
          }
          for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(viewYear, viewMonth, day);
            const isToday = d.toDateString() === today.toDateString();
            const isSel = selected && d.toDateString() === selected.toDateString();
            const dotColor = dots[dotKey(viewYear, viewMonth, day)];
            let cls = "blora-calendar__cell";
            if (isToday) cls += " is-today";
            if (isSel) cls += " is-selected";
            let inner = String(day);
            if (dotColor) inner += '<span class="blora-dot blora-dot--' + dotColor + '"></span>';
            html += '<div class="' + cls + '" data-day="' + day + '">' + inner + '</div>';
          }
          const total = startDay + daysInMonth;
          const remaining = (7 - (total % 7)) % 7;
          for (let i = 1; i <= remaining; i++) {
            html += '<div class="blora-calendar__cell is-other">' + i + '</div>';
          }
          html += '</div>';
        } else if (viewMode === "months") {
          html += '<div class="blora-calendar__grid blora-calendar__grid--months">';
          CAL_MONTHS.forEach((name, m) => {
            const isSel = selected && viewYear === selected.getFullYear() && m === selected.getMonth();
            const isTodayM = viewYear === today.getFullYear() && m === today.getMonth();
            let cls = "blora-calendar__cell blora-calendar__cell--month";
            if (isSel) cls += " is-selected";
            if (isTodayM) cls += " is-today";
            html += '<div class="' + cls + '" data-month="' + m + '">' + name + '</div>';
          });
          html += '</div>';
        } else {
          const decStart = Math.floor(viewYear / 10) * 10;
          html += '<div class="blora-calendar__grid blora-calendar__grid--years">';
          for (let y = decStart - 1; y <= decStart + 10; y++) {
            const isSel = selected && y === selected.getFullYear();
            const isTodayY = y === today.getFullYear();
            let cls = "blora-calendar__cell blora-calendar__cell--year";
            if (y < decStart || y > decStart + 9) cls += " is-other";
            if (isSel) cls += " is-selected";
            if (isTodayY) cls += " is-today";
            html += '<div class="' + cls + '" data-year="' + y + '">' + y + '</div>';
          }
          html += '</div>';
        }
        cal.innerHTML = html;
      };

      on(cal, "click", (e) => {
        const nav = e.target.closest("[data-nav]");
        if (nav) {
          if (viewMode === "days") {
            if (nav.dataset.nav === "prev") { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } }
            else { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } }
          } else if (viewMode === "months") {
            viewYear += (nav.dataset.nav === "prev" ? -1 : 1);
          } else {
            viewYear += (nav.dataset.nav === "prev" ? -10 : 10);
          }
          render();
          return;
        }
        const zoom = e.target.closest("[data-zoom]");
        if (zoom) {
          if (zoom.dataset.zoom === "months") viewMode = "months";
          else if (zoom.dataset.zoom === "years") viewMode = "years";
          render();
          return;
        }
        const todayBtn = e.target.closest("[data-today]");
        if (todayBtn) {
          selected = new Date();
          viewYear = selected.getFullYear(); viewMonth = selected.getMonth();
          viewMode = "days";
          render();
          return;
        }
        const dayCell = e.target.closest(".blora-calendar__cell[data-day]");
        if (dayCell) {
          const day = Number(dayCell.dataset.day);
          selected = new Date(viewYear, viewMonth, day);
          render();
          return;
        }
        const monthCell = e.target.closest(".blora-calendar__cell--month[data-month]");
        if (monthCell) {
          viewMonth = Number(monthCell.dataset.month);
          viewMode = "days";
          render();
          return;
        }
        const yearCell = e.target.closest(".blora-calendar__cell--year[data-year]");
        if (yearCell) {
          viewYear = Number(yearCell.dataset.year);
          viewMode = "months";
          render();
          return;
        }
      });

      render();
    });
  }

  /* —— Sidebar nav scrollspy —— */
  function initScrollSpy(root) {
    const nav = $("[data-blora-spy]");
    if (!nav) return;
    const links = $$("a[href^='#']", nav);
    const sections = links.map((l) => document.getElementById(l.getAttribute("href").slice(1))).filter(Boolean);
    on(window, "scroll", () => {
      const y = window.scrollY + 120;
      let active = sections[0];
      sections.forEach((s) => { if (s && s.offsetTop <= y) active = s; });
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + (active && active.id)));
    });
  }

  /* —— Smooth scroll for in-page anchors —— */
  function initSmoothScroll() {
    on(document, "click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", "#" + id);
    });
  }

  /* —— Theme toggle (夜墨) —— 切换日/夜图标 —— */
  const ICON_MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const ICON_SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  function initThemeToggle(root) {
    $$("[data-blora-theme]", root).forEach((btn) => {
      const sync = () => {
        const dark = document.documentElement.classList.contains("blora-dark");
        btn.innerHTML = dark ? ICON_SUN : ICON_MOON;
        btn.setAttribute("aria-label", dark ? "切换至浅色" : "切换至暗色");
      };
      sync();
      on(btn, "click", () => {
        document.documentElement.classList.toggle("blora-dark");
        sync();
      });
    });
  }

  /* —— Dropzone (dragover visual) —— */
  function initDropzone(root) {
    $$(".blora-dropzone", root).forEach((dz) => {
      ["dragenter", "dragover"].forEach((ev) => on(dz, ev, (e) => { e.preventDefault(); dz.classList.add("is-dragover"); }));
      ["dragleave", "drop"].forEach((ev) => on(dz, ev, (e) => { e.preventDefault(); dz.classList.remove("is-dragover"); }));
      on(dz, "drop", (e) => {
        const files = e.dataTransfer && e.dataTransfer.files;
        const out = $(".blora-dropzone__files", dz);
        if (out && files && files.length) out.textContent = Array.from(files).map((f) => f.name).join(", ");
      });
    });
  }

  /* —— Command palette (Ctrl+K) —— */
  function initCommandPalette() {
    let pal = $("#blora-cmdk");
    if (!pal) return;
    on(document, "keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        pal.classList.add("is-open");
        const inp = $(".blora-input", pal);
        inp && inp.focus();
      }
      if (e.key === "Escape") pal.classList.remove("is-open");
    });
    $$("[data-blora-close]", pal).forEach((b) => on(b, "click", () => pal.classList.remove("is-open")));
    on($(".blora-modal__mask", pal), "click", () => pal.classList.remove("is-open"));
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
  }

  /* —— Public API —— */
  const Blora = {
    init,
    toast,
    openModal,
    closeModal,
    openDrawer,
    closeDrawer,
    version: "1.0.0",
  };
  window.Blora = Blora;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init());
  } else {
    init();
  }
})();
