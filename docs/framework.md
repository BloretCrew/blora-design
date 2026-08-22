# Blora Design · UI 框架文档

> ⚠️ **2.0 说明（2026-08）— 请先读这里**  
> 本文 **§「安装（历史 1.x…）」及以下** 大量内容是 **1.x** 的 `blora.css` + `blora.js` + 全局 `Blora.*` 罗列。  
> **禁止**把那些段落当作 2.0 推荐 API 或复制进新项目。  
> **2.0 唯一推荐入口**：[`guide.md`](./guide.md)、[`migration/v1-to-v2.md`](./migration/v1-to-v2.md)、`packages/blora-design/contracts/*.contract.json`、Storybook、包 `src/index.ts` 导出。  
> **进度 / 未完成项**：[`refactor/remaining-work.md`](./refactor/remaining-work.md)。  
> **视觉令牌** → [`standards.md`](./standards.md)。**1.x 冻结** → 仓库外归档 `D:\MyFiles\Documents\projects\blora-design\legacy\`。

---

## 2.0 快速入口（现行 · 推荐）

```bash
pnpm add @bloret-crew/blora-design
```

```js
import "@bloret-crew/blora-design/tokens.css";
import "@bloret-crew/blora-design/foundations.css";
import { createTableController, message, defineBloraSelect } from "@bloret-crew/blora-design";

defineBloraSelect();
// 按钮：.blora-button[data-variant="primary"]
// 表格：.blora-table-wrap + createTableController(wrap)
```

完整约定与示例见 [`guide.md`](./guide.md)。下方章节保留供 **1.x 行为对照 / 迁移检索**，新功能请勿再按 `Blora.init` 模型扩展。

---

## 安装（历史 1.x 叙述 · 仅迁移对照）

Blora Design **1.x** 曾以整包 `blora.css` + `blora.js` 分发。**2.0** 为 monorepo ESM + 按组件 CSS + Composite CE；仅 Table / Form 等开放数据能力保留 headless API（见上节与 guide）。

```bash
# 2.0（推荐）
pnpm add @bloret-crew/blora-design

# 1.x 行为对照请使用仓库外归档 legacy/v1/（D:\MyFiles\Documents\projects\blora-design\legacy\），不要在新项目复制全局 Blora 单例模式
```

**作用域约定（2.0）**

- Token 与 foundations 挂到应用根；组件 class 使用 `blora-*`。  
- 结构敏感组件使用注册后的 Custom Element；只有 contract 标记为 headless 的能力显式创建 controller。
- 换肤 / 明暗：theming 包或 token 主题 CSS，而非依赖 `Blora.applyPalette` 全局对象（1.x）。

**仓库结构（历史描述起点）**

```
blora-design/
├── blora.css / blora.js / blora.d.ts
├── locales/           # zh-CN / en 语言包（可选 CDN 分包）
├── index.html         # 组件全集展示（视觉最终参照）
├── LICENSE · NOTICE   # Apache-2.0
└── docs/
    ├── guide.md       # 使用 + 迁移（推荐入口）
    ├── standards.md   # 设计规范
    └── framework.md   # 本文档
```

**JS 初始化**

```html
<script>
  // 默认 DOMContentLoaded 后 autoInit；
  // 动态插入组件后：
  Blora.init(document.getElementById('my-mount'));
</script>
```

嵌入已有应用时，可把动态浮层挂到指定容器，并为不同应用设置独立的明暗模式与配色存储键：

```js
Blora.configure({
  portalRoot: '#app-overlays',
  colorModeStorageKey: 'my-app-color-mode',
  paletteStorageKey: 'my-app-palette'
});
Blora.init(document.getElementById('my-mount'));
```

为避免刷新时配色或明暗模式闪烁，可在框架 CSS 之前放置同步启动脚本。它只恢复根节点属性，完整组件仍由 `blora.js` 初始化：

```html
<script>
  (() => {
    const root = document.documentElement;
    const config = window.BloraConfig || {};
    try {
      let palette = localStorage.getItem(config.paletteStorageKey || 'blora-palette') || 'coral';
      const modeKey = config.colorModeStorageKey || config.storageKey || 'blora-color-mode';
      const storedMode = localStorage.getItem(modeKey);
      const mode = ['system', 'light', 'dark'].includes(storedMode) ? storedMode : 'system';
      root.dataset.bloraColorPreference = mode;
      if (palette !== 'coral') root.dataset.bloraPalette = palette;
      if (mode === 'dark' || (mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)) root.classList.add('blora-dark');
    } catch (error) {}
  })();
</script>
<link rel="stylesheet" href="blora.css">
```

**全局 API（节选）**

```js
Blora.init(root);                    // 幂等；动态子树可重复调用
Blora.configure({ /* size, locale, portalRoot, validateOn, … */ });
Blora.getConfig();

Blora.message / notify / confirm（1.x 另有 toast，2.0 已移除）
Blora.openModal / closeModal / openDrawer / closeDrawer
Blora.applyPalette('indigo');        // coral（默认）| dusk | indigo | lotus | graphite | mono | circuit | …
Blora.applyColorMode('system');      // system | light | dark
Blora.getPalette(); Blora.getColorMode(); Blora.palettes;

Blora.validate / validateAsync / validateField / getValues / setValues / registerAsyncRule
Blora.table.sort / setPage / setRows / setLoading / getSelection / getState
Blora.select.setOptions
Blora.markdown / md / renderMarkdown
Blora.preview / tour / backTop / qrcode
Blora.t / setLocale / getLocale / locales / locale
Blora.cls / classPrefix / version   // "1.0.0"
```

完整迁移注意与「禁止半套原生」见 [`guide.md`](./guide.md)。类型定义见根目录 `blora.d.ts`。

---

## 设计令牌速查

所有令牌定义于 `:root`，可直接 `var(--blora-*)` 使用。

```css
:root {
  /* Background */ --blora-background, --blora-surface-1..3
  /* Content */ --blora-text-strong, --blora-foreground, --blora-text-emphasis, --blora-text-muted, --blora-text-subtle, --blora-text-disabled, --blora-border-subtle
  /* Functional colors */ --blora-primary, --blora-danger, --blora-accent-neutral, --blora-info, --blora-success, --blora-support, --blora-warning, --blora-accent-secondary
  /* Derived foregrounds */ --blora-on-accent, --blora-on-media, --blora-brand-glyph
  /* Typography */ --blora-font-heading, --blora-font-sans, --blora-font-mono
  /* Type scale */ --blora-text-xs .. --blora-text-5xl
  /* Spacing */ --blora-space-0 .. --blora-space-12
  /* Radius */ --blora-radius-xs .. --blora-radius-full
  /* Shadow */ --blora-shadow-1..4, --blora-shadow-inset, --blora-shadow-primary
  /* Motion */ --blora-easing-standard/soft/overshoot, --blora-duration-fast/base/slow/emphasis
  /* Z-index */ --blora-z-sticky/dropdown/drawer/modal/toast
}
```

**唯一视觉标准与配色**：Blora Design 只有一套字体、圆角、阴影、控件尺寸、动效和玻璃表面标准，直接定义在 `:root`，不需要主题属性或主题 API。`Blora.applyPalette('indigo')` 只会写入 `data-blora-palette` 并替换语义颜色，不改变组件形态；未设置属性时使用默认 **`coral`** 配色。

**暗色模式**：`<html class="blora-dark">` 即可，所有颜色 token 自动重映射，无需改组件。暗色模式可与任意配色组合。

视觉形态不随配色改变。Coral、Dusk、Indigo、Lotus、Graphite、Mono、Circuit 都只负责颜色映射，其中 **Coral 是默认配色**。

---

## 组件 API

### 1. 排版

| 类 | 说明 |
|----|------|
| `.blora-h1` .. `.blora-h4` | Blora Design 标题字体与字阶 |
| `.blora-text-lead` | 引导段 |
| `.blora-text-muted` / `.blora-text-faint` / `.blora-text-primary` | 文字色调 |
| `.blora-text-caps` | 大写小字标签 |
| `.blora-text-mono` | 等宽文本 |
| `.blora-quote` | 引文，可含 `<cite>` |
| `.blora-code` / `.blora-pre` | 行内代码 / 代码块 |
| `.blora-divider` | 分隔线，支持虚线和带文本变体 |

### 2. 布局

```html
<div class="blora-container">              <!-- 居中 1200 -->
<div class="blora-container blora-container--prose">  <!-- 760 -->
<div class="blora-container blora-container--wide">   <!-- 1440 -->

<div class="blora-stack">…</div>           <!-- 垂直堆叠 16px -->
<div class="blora-stack--sm">…</div>       <!-- 8px -->
<div class="blora-stack--lg">…</div>       <!-- 32px -->

<div class="blora-row">…</div>             <!-- 横排，自动换行 -->
<div class="blora-row blora-row--tight">…</div>
<div class="blora-row blora-row--between">…</div>
<div class="blora-row blora-row--center">…</div>

<div class="blora-grid blora-grid--2">…</div>   <!-- 2/3/4 列响应式 -->

<div class="blora-card">…</div>            <!-- 默认卡面 -->
<div class="blora-card blora-card--hover">…</div>
<div class="blora-card blora-card--inset">…</div>
<div class="blora-card blora-card--flat">…</div>
<!-- 子结构：.blora-card__title __body __foot；--relative 配 __badge -->

<div class="blora-panel">…</div>           <!-- 大面板 -->

<hr class="blora-divider">                 <!-- 分隔线 -->
<hr class="blora-divider blora-divider--dashed">
<div class="blora-divider blora-divider--text">章节标题</div>
```

### 3. 按钮

```html
<button class="blora-btn blora-btn--primary">确定</button>
<!-- 变体：--primary --secondary --danger --outline --ghost --text -->
<!-- 尺寸：--xs --sm (默认) --lg --xl -->
<!-- 图标：--icon（正方形）-->
<!-- 加载：添加 .is-loading；或 data-blora-loading="2000" 自动触发 -->
<!-- 组：.blora-btn-group 包裹多个 -->

<a class="blora-btn blora-btn--primary" href="#">链接按钮</a>
```

**FAB 浮动按钮**：JS 自动注入 `#blora-fab`，滚动 400px 后浮现。

### 4. 表单

```html
<div class="blora-field">
  <label class="blora-label blora-label--req" for="x">标签</label>
  <input class="blora-input" id="x" type="text" placeholder="…">
  <span class="blora-hint">提示</span>
  <span class="blora-error">错误</span>
</div>

<textarea class="blora-textarea"></textarea>
<select class="blora-select">…</select>

<!-- 字数限制：不使用 maxlength 硬截断；超限字符会标注，计数器自动显示 -->
<div class="blora-field" data-blora-limit-group>
  <label class="blora-label" for="name">项目名称</label>
  <input class="blora-input" id="name" data-blora-limit="20" aria-describedby="name-hint">
  <span class="blora-hint" id="name-hint">最长 20 个字符。</span>
  <button class="blora-btn blora-btn--primary" type="button" data-blora-limit-action>下一步</button>
</div>

<!-- 密码框自动进入安全模式：超限部分以圆点标注，不渲染明文镜像 -->
<input class="blora-input" type="password" data-blora-limit="12">

<!-- 前后缀 -->
<div class="blora-input-group">
  <span class="blora-addon">¥</span>
  <input class="blora-input">
  <span class="blora-addon">.00</span>
</div>

<!-- 搜索；在 form 中使用 type="submit" 获得原生提交语义 -->
<form class="blora-search" role="search">
  <button class="blora-search__icon" type="submit" aria-label="搜索"><svg…></svg></button>
  <input class="blora-input" type="search">
</form>
<!-- 有值且组件聚焦时，JS 自动显示清除按钮；清空后派发原生 input 事件并保持输入焦点 -->

<!-- 数字步进；加 data-blora-manual 可跳过自动绑定，由业务自行接管 -->
<div class="blora-number">
  <input class="blora-input" type="number" value="5" min="0" max="99">
  <div class="blora-number__ctrl">
    <button class="blora-number__btn" data-step="up">▾</button>
    <button class="blora-number__btn" data-step="down">▴</button>
  </div>
</div>

<!-- 复选 / 单选 / 开关 -->
<label class="blora-checkbox"><input type="checkbox" checked><span class="blora-checkbox__box"></span>已选</label>
<label class="blora-radio"><input type="radio" name="x"><span class="blora-radio__dot"></span>选项一</label>
<label class="blora-switch"><input type="checkbox" checked><span class="blora-switch__track"></span>开关</label>
<!-- 开关尺寸：--sm / 默认 / --lg -->
<!-- 半选：.blora-checkbox--indeterminate；全选联动：data-blora-checkall，作用域为最近的 form / .blora-field / [data-blora-check-group] -->

<!-- 滑块 -->
<div class="blora-slider">
  <input class="blora-slider__input" type="range" min="0" max="100" value="42">
  <span class="blora-slider__value">42</span>
</div>

<!-- 双滑块范围 -->
<div class="blora-range">
  <div class="blora-range__track"><div class="blora-range__fill"></div></div>
  <div class="blora-range__thumb" data-val="20"></div>
  <div class="blora-range__thumb" data-val="75"></div>
</div>

<!-- 评分 -->
<div class="blora-rate" data-value="4">
  <span class="blora-rate__star is-on">★</span> ×5
</div>
<!-- 只读：data-readonly -->

<!-- 分段 -->
<div class="blora-segmented">
  <span class="blora-segmented__item is-active">日</span>
  <span class="blora-segmented__item">周</span>
</div>

<!-- 标签输入（自动 JS） -->
<div class="blora-tags-input">
  <span class="blora-tag blora-tag--primary blora-tag--removable">重要<span class="blora-tag__close">×</span></span>
  <input type="text" placeholder="回车添加">
</div>

<!-- OTP -->
<div class="blora-otp">
  <input class="blora-otp__input" maxlength="1"> ×6
</div>

<!-- 颜色（连续全色域 + 手动 Hex） -->
<div class="blora-color-picker">
  <div class="blora-color-swatch"></div>
  <div class="blora-color-panel">
    <div class="blora-color-custom">
      <span class="blora-color-preview"></span>
      <input class="blora-input blora-color-hex" type="text" placeholder="#RRGGBB">
    </div>
  </div>
</div>

<!-- 上传 -->
<div class="blora-dropzone">
  <div class="blora-dropzone__icon"><svg…></svg></div>
  <div><strong>拖拽文件至此</strong> 或 <span class="blora-text-primary">点击选择</span></div>
  <div class="blora-hint blora-dropzone__files">支持 PNG/JPG ≤ 8MB</div>
</div>
```

面板中的连续色域与色相滑条由 JS 自动注入；支持鼠标、触控、方向键和 HEX 双向同步。颜色变化时，根元素会派发 `blora:change`，颜色值位于 `event.detail.value`。

**校验态**：在 input 上加 `.is-error`；字段下用 `.blora-error`。

### 5. 选择器

```html
<!-- 日期（面板由 JS 注入；需 data-blora-datepicker） -->
<div class="blora-datepicker" data-blora-datepicker>
  <input class="blora-input" type="date">
  <button class="blora-datepicker__btn" type="button" aria-label="选择日期"><svg…></svg></button>
</div>

<!-- 级联 -->
<div class="blora-cascader">
  <div class="blora-cascader__col">
    <div class="blora-cascader__opt is-selected">分区<span>›</span></div>
  </div>
  <!-- 多列 -->
</div>

<!-- 穿梭框：面板标题写在 __head 里即可，JS 会保留标题并自动追加 " · 数量" -->
<div class="blora-transfer">
  <div class="blora-transfer__panel">
    <div class="blora-transfer__head">候选</div>
    <div class="blora-transfer__list">
      <label class="blora-transfer__row"><input type="checkbox"><span>项</span></label>
    </div>
  </div>
  <div class="blora-transfer__actions">
    <button class="blora-btn blora-btn--outline blora-btn--icon">›</button>
    <button class="blora-btn blora-btn--outline blora-btn--icon">‹</button>
  </div>
  <div class="blora-transfer__panel">…</div>
</div>
```

### 6. 标签与徽章

Badge 回答「现在怎样」：数量、红点、New、成功/警告，实心、不可关。
Tag 回答「这是什么」：分类、主题、可关掉的词，浅底描边。不要用 `solid` Tag 冒充 Badge。

```html
<span class="blora-tag">默认</span>
<!-- 色：primary / neutral / info / success / warning -->
<!-- 可移除：.blora-tag--removable + .blora-tag__close -->

<span class="blora-badge">9</span>
<span class="blora-badge" data-variant="dot"></span>
<span class="blora-badge" data-variant="circle">新</span>
<span class="blora-badge" data-variant="pill">推荐</span>
<!-- 色：neutral / success / info / warning / danger -->

<!-- 卡面右上角徽章 -->
<article class="blora-card" data-positioned data-with-badge>
  <span class="blora-badge blora-card__badge" data-variant="pill">推荐</span>
  …
</article>

<span class="blora-dot"></span>
<!-- 色：--primary --success --warning；动效：--pulse -->

<span class="blora-avatar blora-avatar--primary">A</span>
<!-- 尺寸：--xs --sm (默认) --lg --xl -->
<!-- 色：--primary --neutral --info --success --contrast -->
<!-- 形：--square -->
<!-- 组：.blora-avatar-group -->
<!-- 带徽章：.blora-avatar-wrap 内嵌 .blora-badge -->
```

### 7. 进度与加载

```html
<div class="blora-progress" data-value="62">
  <div class="blora-progress__label"><span>处理中</span><span>62%</span></div>
  <div class="blora-progress__bar"><div class="blora-progress__fill"></div></div>
</div>
<!-- fill 色：--neutral --success --info；条纹：--striped -->

<!-- 环形 -->
<div class="blora-progress--circular">
  <svg width="72" height="72" viewBox="0 0 72 72">
    <circle class="track" cx="36" cy="36" r="30"></circle>
    <circle class="fill" cx="36" cy="36" r="30"
            stroke-dasharray="188.5" stroke-dashoffset="56.5"></circle>
  </svg>
  <span class="blora-progress__value">70%</span>
</div>

<span class="blora-spinner"></span>           <!-- 尺寸：--sm --lg -->

<span class="blora-skeleton blora-skeleton--text"></span>
<!-- 变体：--title --circle --block -->
```

### 8. 导航

Navbar 默认使用悬浮胶囊形态；裸 `.blora-navbar`、`.blora-navbar--floating` 与 `data-variant="floating"` 等价。需要全宽贴顶时使用 `.blora-navbar--full` 或 `data-variant="full"`。可覆盖 `--blora-navbar-inset`、`--blora-navbar-max-width`、`--blora-navbar-radius` 与 `--blora-navbar-padding`。悬浮形态默认使用相同的横纵内边距，使顶栏、品牌圆标和胶囊按钮的嵌套曲率保持平行。

```html
<nav class="blora-navbar">
  <div class="blora-navbar__brand">…</div>
  <div class="blora-navbar__menu">
    <a class="blora-navbar__link is-active" href="#">链接</a>
  </div>
</nav>

<!-- 默认悬浮：以下写法等价 -->
<nav class="blora-navbar blora-navbar--floating">…</nav>
<nav class="blora-navbar" data-variant="floating">…</nav>

<!-- 全宽贴顶 -->
<nav class="blora-navbar blora-navbar--full">…</nav>
<nav class="blora-navbar" data-variant="full">…</nav>

<!-- Tabs（需 data-blora-tabs）-->
<div class="blora-tabs" data-blora-tabs>
  <div class="blora-tabs__nav">
    <span class="blora-tabs__tab is-active">概览</span>
    <span class="blora-tabs__tab">详情</span>
  </div>
  <div class="blora-tabs__panel">…</div>
  <div class="blora-tabs__panel blora-hide">…</div>
</div>
<!-- 变体：--pills --vert -->

<nav class="blora-breadcrumb">
  <a href="#">首页</a><span class="blora-breadcrumb__sep">/</span>
  <span class="blora-breadcrumb__current">当前</span>
</nav>

<div class="blora-pagination">
  <span class="blora-pagination__item is-disabled">‹</span>
  <span class="blora-pagination__item is-active">1</span>
  <span class="blora-pagination__item">2</span>
  <span class="blora-pagination__ellipsis">…</span>
  <span class="blora-pagination__item">›</span>
</div>

<div class="blora-steps">
  <div class="blora-step is-done">
    <div class="blora-step__head"><div class="blora-step__icon">✓</div><div class="blora-step__line"></div></div>
    <div class="blora-step__title">提交</div>
    <div class="blora-step__desc">校验资料</div>
  </div>
  <!-- 状态：is-done is-active -->
</div>

<nav class="blora-menu">
  <div class="blora-menu__group-label">分组</div>
  <div class="blora-menu__item is-active"><span class="blora-menu__icon">◈</span><span>项</span></div>
</nav>

<!-- 下拉菜单（需 JS）-->
<div class="blora-dropdown">
  <button class="blora-btn" data-blora-dropdown-trigger>菜单 ▾</button>
  <div class="blora-dropdown-menu">
    <div class="blora-dropdown-menu__item">项</div>
    <div class="blora-dropdown-menu__sep"></div>
  </div>
</div>
```

Tabs 初始化后会自动注入滑动指示器；内容面板切换时只做渐显，不产生方向位移。下划线、Pills 和纵向布局共用同一套状态逻辑，重复点击当前项不会重新触发动画，键盘方向键、Home/End 与 `prefers-reduced-motion` 均自动适配。

### 9. 数据展示

```html
<div class="blora-table-wrap">
  <table class="blora-table blora-table--striped">
    <thead><tr><th>列</th></tr></thead>
    <tbody><tr><td>值</td></tr></tbody>
  </table>
</div>

<div class="blora-list blora-list--hover">
  <div class="blora-list__item">
    <span class="blora-avatar">A</span>
    <div class="blora-list__meta">
      <div class="blora-list__title">项目名称</div>
      <div class="blora-list__desc">负责人 · 部门 · 日期</div>
    </div>
  </div>
</div>

<div class="blora-collapse" data-blora-accordion>      <!-- accordion 单展开 -->
  <div class="blora-collapse__item is-open">
    <div class="blora-collapse__head">题 <span class="blora-collapse__icon">›</span></div>
    <div class="blora-collapse__body"><div class="blora-collapse__content">内容</div></div>
  </div>
</div>

<div class="blora-timeline">
  <div class="blora-timeline__item">
    <div class="blora-timeline__dot blora-timeline__dot--primary"></div>
    <div class="blora-timeline__time">10:24</div>
    <div class="blora-timeline__title">事件</div>
    <div class="blora-timeline__desc">描述</div>
  </div>
</div>

<div class="blora-tree">
  <div class="blora-tree__node is-open is-selected">
    <span class="blora-tree__toggle">›</span><span>分组</span>
  </div>
  <div class="blora-tree__children">…</div>
</div>

<div class="blora-stat">
  <span class="blora-stat__label">项目总数</span>
  <span class="blora-stat__value">1,248</span>
  <span class="blora-stat__trend blora-stat__trend--up">↑ 12.4%</span>
  <!-- 趋势：--up（success）--down（danger）-->
  <!-- 后缀：.blora-stat__suffix -->
</div>

<table class="blora-descriptions">
  <tbody><tr><th>键</th><td>值</td></tr></tbody>
</table>

<!-- 轮播（需 JS，可 data-autoplay）-->
<div class="blora-carousel" data-autoplay>
  <div class="blora-carousel__track">
    <div class="blora-carousel__slide">…</div>
  </div>
  <button class="blora-carousel__arrow blora-carousel__arrow--prev">‹</button>
  <button class="blora-carousel__arrow blora-carousel__arrow--next">›</button>
  <div class="blora-carousel__dots">
    <span class="blora-carousel__dot is-active"></span>
  </div>
</div>

<span class="blora-image blora-image--hover">
  <img src="…" class="blora-image-muted">
  <span class="blora-image__cap">图片说明</span>
</span>
<!-- 变体：--frame（边框）--hover（放大）-->

<div class="blora-diff">
  <div class="blora-diff__item"><img src="after.jpg" alt="调整后"></div>
  <div class="blora-diff__item blora-diff__item--before"><img src="before.jpg" alt="调整前"></div>
  <span class="blora-diff__divider"></span>
  <input class="blora-diff__range" type="range" min="0" max="100" value="50" aria-label="比较位置">
</div>
<!-- 两侧不限于图片：任意子节点（文案、卡片、组件）都会铺满对应面板。比例令牌 --blora-diff-ratio -->

<div class="blora-hover-gallery" aria-label="产品图库">
  <img class="blora-hover-gallery__item is-active" src="front.jpg" alt="产品正面">
  <img class="blora-hover-gallery__item" src="side.jpg" alt="产品侧面">
</div>
<!-- Gallery 支持方向键与 Home/End；Diff 保留原生 range 交互 -->
<!-- 比例令牌：--blora-gallery-ratio / --blora-diff-ratio -->

<div class="blora-empty">
  <div class="blora-empty__icon"><svg…></svg></div>
  <div class="blora-empty__title">暂无数据</div>
  <div class="blora-empty__desc">列表为空</div>
</div>

<div class="blora-result blora-result--success">
  <div class="blora-result__icon">✓</div>
  <div class="blora-result__title">已成</div>
  <div class="blora-result__desc">描述</div>
</div>
<!-- 变体：--success --warning --error --info -->

<div class="blora-calendar">
  <div class="blora-calendar__head">
    <div class="blora-calendar__title">2026 年 6 月</div>
  </div>
  <div class="blora-calendar__grid">
    <div class="blora-calendar__dow">日</div> ×7
    <div class="blora-calendar__cell is-today is-selected">30</div>
    <!-- 状态：is-other is-today is-selected；带点：内嵌 .blora-dot -->
  </div>
</div>
```

### 10. 反馈

```html
<div class="blora-alert blora-alert--info">
  <span class="blora-alert__icon">i</span>
  <div class="blora-alert__body">
    <div class="blora-alert__title">题</div>
    <div class="blora-alert__desc">述</div>
  </div>
  <span class="blora-alert__close">×</span>
</div>
<!-- 变体：--info --success --warning --danger --ghost -->

<div class="blora-banner">
  <div class="blora-banner__body">
    <div class="blora-banner__title">题</div>
    <div class="blora-banner__desc">述</div>
  </div>
  <div class="blora-banner__actions">…</div>
</div>

<span class="blora-message blora-message--success">
  <span class="blora-message__icon">✓</span>消息
</span>

<div class="blora-notification blora-notification--success">
  <span class="blora-notification__icon">✓</span>
  <div><div class="blora-notification__title">题</div><div class="blora-notification__desc">述</div></div>
  <span class="blora-notification__close">×</span>
</div>

<span class="blora-tooltip">
  <button class="blora-btn">悬停我</button>
  <span class="blora-tooltip__bubble">提示文字</span>
</span>

<div class="blora-popover">
  <button data-blora-popover>触发</button>
  <div class="blora-popover__panel">
    <div class="blora-popover__title">题</div>
    <div class="blora-popover__body">内容</div>
  </div>
</div>

<!-- Popconfirm：同 popover 结构，内嵌 .blora-popconfirm__title + 按钮 -->
```

### 11. 模态与抽屉

```html
<button data-blora-modal-open="my-modal">打开</button>

<div class="blora-modal" id="my-modal" role="dialog" aria-modal="true">
  <div class="blora-modal__mask" data-blora-close></div>
  <div class="blora-modal__dialog">
    <div class="blora-modal__head">
      <h3 class="blora-modal__title">确认操作</h3>
      <button class="blora-modal__close" data-blora-close>×</button>
    </div>
    <div class="blora-modal__body">…</div>
    <div class="blora-modal__foot">
      <button class="blora-btn blora-btn--text" data-blora-close>取消</button>
      <button class="blora-btn blora-btn--primary">确定</button>
    </div>
  </div>
</div>
<!-- 尺寸：默认 520 / --sm 400 / --lg 800 -->

<!-- 抽屉：方向 --right --left --top --bottom -->
<div class="blora-drawer blora-drawer--right" id="d1">
  <div class="blora-drawer__mask" data-blora-close></div>
  <div class="blora-drawer__panel">
    <div class="blora-drawer__head">…</div>
    <div class="blora-drawer__body">…</div>
    <div class="blora-drawer__foot">…</div>
  </div>
</div>
```

### 12. 命令面板

```html
<div class="blora-modal blora-modal--cmdk" id="blora-cmdk" role="dialog" aria-modal="true">
  <div class="blora-modal__mask" data-blora-close></div>
  <div class="blora-modal__dialog">
    <div class="blora-modal__head">
      <div class="blora-search">… <input class="blora-input" type="search"></div>
      <button class="blora-modal__close" data-blora-close>×</button>
    </div>
    <div class="blora-modal__body">
      <div class="blora-cmdk-results">
        <div class="blora-cmdk-item is-active"><span>✎</span><span>新建</span></div>
      </div>
    </div>
  </div>
</div>
```

**快捷键**：`Ctrl/⌘ + K` 唤起，`Esc` 关闭（由 blora.js 自动绑定）。

### 13. Message（2.0；取代 1.x Toast）

```js
import { message } from "@bloret-crew/blora-design";

message("一条消息");
message.success("操作已完成");
message({ content: "失败", type: "danger", duration: 3000 });
// type: info | success | warning | danger（error → danger）
```

容器 `.blora-message-container` 由 JS 自动注入（顶部居中）。
1.x 的 `Blora.toast` **不在 2.0 中保留**。

### 14. 动作与表单扩展

```html
<!-- Swap：保留原生 checkbox 语义 -->
<label class="blora-swap" aria-label="切换收藏">
  <input type="checkbox">
  <span class="blora-swap__off">未收藏</span>
  <span class="blora-swap__on">已收藏</span>
</label>

<!-- Speed Dial / FAB：点击、Esc、方向键、Home/End；可配关闭钮或主操作 -->
<div class="blora-speed-dial" data-blora-speed-dial>
  <button class="blora-btn blora-btn--primary blora-btn--icon blora-speed-dial__trigger"
          type="button" data-blora-speed-dial-trigger aria-label="快捷操作">+</button>
  <!-- 可选：展开后替换触发器 —— 二选一 -->
  <!-- <button class="blora-btn blora-btn--danger blora-btn--icon blora-speed-dial__close" type="button" data-blora-speed-dial-close aria-label="关闭">×</button> -->
  <!-- <button class="blora-btn blora-btn--secondary blora-btn--icon blora-speed-dial__main" type="button" data-blora-speed-dial-main aria-label="主操作">↑</button> -->
  <div class="blora-speed-dial__actions">
    <!-- 纯图标 / 矩形文字 / 标签+图标 -->
    <button class="blora-btn blora-btn--secondary blora-btn--icon blora-speed-dial__action" type="button" aria-label="新建">…</button>
    <div class="blora-speed-dial__item">
      <span class="blora-speed-dial__label">上传</span>
      <button class="blora-btn blora-btn--secondary blora-btn--icon blora-speed-dial__action" type="button" aria-label="上传">…</button>
    </div>
  </div>
</div>
<!-- 布局：默认向上；--left 向左；--flower / --radial 扇形（最多 4 个动作） -->

<fieldset class="blora-fieldset">
  <legend class="blora-fieldset__legend">发布设置</legend>
  <p class="blora-fieldset__description">字段组说明</p>
  <label class="blora-validator">
    <span class="blora-label">邮箱</span>
    <input class="blora-input" type="email" required>
    <span class="blora-validator__hint blora-validator__hint--error">格式无效</span>
    <span class="blora-validator__hint blora-validator__hint--success">格式有效</span>
  </label>
  <input class="blora-file-input" type="file">
</fieldset>

<form class="blora-filter">
  <label class="blora-filter__item"><input type="radio" name="status" checked><span class="blora-filter__label">全部</span></label>
  <label class="blora-filter__item"><input type="radio" name="status"><span class="blora-filter__label">进行中</span></label>
  <button class="blora-filter__reset" type="reset">清除</button>
</form>
```

`Validator` 复用原生约束校验；业务主动校验时可使用 `.is-error` / `.is-success`。`File Input` 是单文件或系统文件选择入口，多文件拖拽仍使用 `.blora-dropzone`。

### 14.1 表单校验 API（行为层）

```html
<form class="blora-form" data-blora-form data-blora-error-ui="popup" data-blora-validate-on="submit blur">
  <div class="blora-field">
    <label class="blora-label blora-label--req">邮箱</label>
    <input class="blora-input" name="email" type="email" required data-blora-rule="email"
           data-blora-message="请输入有效邮箱">
    <!-- 非 popup 时可用：<span class="blora-error" data-blora-error hidden></span> -->
  </div>
  <!-- 联动：data-blora-when="plan=pro" data-blora-when-action="show|enable|…" -->
  <div data-blora-when="plan=pro" data-blora-when-action="show">…</div>
  <button class="blora-btn blora-btn--primary" type="submit">提交</button>
</form>
```

```js
Blora.validate("#my-form");              // { valid, errors: [{ field, message }] }
await Blora.validateAsync("#my-form");   // 含 data-blora-async 异步规则
Blora.validateField(inputEl);
Blora.clearValidation("#my-form");
Blora.getValues("#my-form");             // 按 name 聚合
Blora.setValues("#my-form", { email: "a@b.com" });
Blora.registerAsyncRule("uniqueUser", async (value, field) => {
  if (value === "admin") return "不可用";
  return true;
});
// 事件：blora:validate / blora:invalid
// data-blora-rule：email | url | number | min:n | max:n | …
// data-blora-async：异步规则名（需 registerAsyncRule）
// data-blora-error-ui="popup"：控件上方浮层（框架 novalidate，不用浏览器黄泡）
// data-blora-validate-on：submit | blur | change（可组合）
// 默认拦截原生 submit，成功派发 blora:submit；需要浏览器真提交时加 data-blora-native-submit
```

### 14.2 表格排序 / 分页 / 数据

```html
<div class="blora-table-wrap" id="t1" data-blora-table data-blora-selectable data-blora-cols
     data-blora-cols-key="my-table" data-page-size="10" data-page="1">
  <table class="blora-table blora-table--striped">
    <thead>
      <tr>
        <th class="blora-table-sort" data-blora-sort="name" data-blora-fixed="left">名称</th>
        <th class="blora-table-sort" data-blora-sort="status">状态</th>
      </tr>
    </thead>
    <tbody>…</tbody>
  </table>
</div>
<nav class="blora-pagination" data-blora-pagination data-blora-table="#t1" data-page-size="10"></nav>
```

```js
Blora.table.sort("#t1", "status", "asc");
Blora.table.setPage("#t1", 2);
Blora.table.setRows("#t1", [{ name: "张三", status: "ok" }], { keys: ["name", "status"] });
Blora.table.setLoading("#t1", true);
Blora.table.getSelection("#t1");
Blora.table.clearSelection("#t1");
Blora.table.getState("#t1"); // { page, pageSize, sortKey, sortDir, total }
// 默认 mode=local（DOM 内排序/隐藏行）
// data-blora-table-mode="remote" → 只派发 blora:table-change，由业务拉数
// data-blora-virtual：大数据虚拟行（配合 setRows）
// data-blora-selectable / data-blora-cols / data-blora-fixed
// 分页事件：blora:page-change
```

### 14.3 全局配置

```js
Blora.configure({
  size: "md",              // sm | md | lg → html[data-blora-size]
  validateOn: "submit",  // 默认校验触发
  tablePageSize: 10,
  portalRoot: "#app-overlays",
  locale: "en",            // 或 "zh-CN" / 自定义语言码
  messages: { "validate.required": "Required" },
});
Blora.getConfig();
```

### 14.4 i18n（框架生成文案）

Blora Design **只翻译组件自己生成的字符串**（校验提示、分页 aria、日期控件、级联前缀等）。页面正文仍由业务 i18n 方案负责。

**内置语言包**：`zh-CN`（默认）、`en`。

```js
// 切换内置语言
Blora.setLocale("en");

// 任意语言扩展：提供完整或部分 pack
Blora.setLocale("ja-JP", {
  collator: "ja",
  months: ["1月","2月",/* … */],
  dow: ["日","月","火","水","木","金","土"],
  year: "年",
  today: "今日",
  clear: "クリア",
  now: "現在",
  confirm: "OK",
  hour: "時",
  minute: "分",
  messages: {
    "validate.required": "必須項目です",
    "validate.email": "有効なメールアドレスを入力してください",
    "pagination.prev": "前へ",
    "pagination.next": "次へ",
    "pagination.page": "{n} ページ",
    "pagination.nav": "ページネーション",
    "cascader.selectedPrefix": "選択：",
  },
});

// 读取
Blora.t("validate.required");
Blora.t("pagination.page", { n: 3 });
Blora.getLocale();     // "ja-JP"
Blora.locales;         // ["zh-CN", "en"] 内置列表

// 语言变更事件（业务可监听后重绘自有 UI）
document.addEventListener("blora:localechange", (e) => {
  console.log(e.detail.locale, e.detail.messages);
});
```

**常用 key**

| Key | 用途 |
|-----|------|
| `validate.required` / `email` / `url` / `number` / `min` / `max` / `minlength` / `maxlength` / `pattern` | 表单校验 |
| `pagination.prev` / `next` / `page` / `nav` | 分页 |
| `cascader.selectedPrefix` | 级联已选前缀 |

兼容：`configure({ messages: { required: "…" } })` 仍支持旧短键。

### 15. 导航与页面布局

```html
<!-- 桌面侧栏，900px 以下自动转为遮罩侧栏 -->
<div class="blora-sidebar-layout" data-blora-sidebar-layout>
  <button class="blora-btn blora-sidebar-layout__toggle" type="button" data-blora-sidebar-toggle>打开侧栏</button>
  <div class="blora-sidebar-layout__mask"></div>
  <aside class="blora-sidebar-layout__aside">…</aside>
  <main class="blora-sidebar-layout__content">…</main>
</div>
<!-- 紧凑预览：添加 --compact -->

<div class="blora-megamenu" data-blora-megamenu>
  <button class="blora-btn" type="button" data-blora-megamenu-trigger>产品</button>
  <div class="blora-megamenu__panel">
    <div class="blora-megamenu__grid">…</div>
  </div>
</div>

<nav class="blora-dock" aria-label="主要导航">
  <a class="blora-dock__item is-active" href="/">首页</a>
  <a class="blora-dock__item" href="/search">搜索</a>
</nav>
<!-- 文档或局部演示使用 .blora-dock--static -->

<section class="blora-hero blora-hero--surface blora-hero--center">
  <div class="blora-hero__content">…</div>
</section>

<footer class="blora-footer">
  <div class="blora-footer__inner">…</div>
  <div class="blora-footer__bottom">…</div>
</footer>

<!-- 卡片叠层：需 JS；隐形滚轮模型——连续 offset + 吸附，支持拖动/滚轮/方向键 -->
<div class="blora-deck blora-deck--sm" tabindex="0" aria-label="卡片叠层">
  <article class="blora-card">卡片 A</article>
  <article class="blora-card">卡片 B</article>
  <article class="blora-card">卡片 C</article>
</div>
```

Sidebar 在窄屏关闭时会使用 `inert` 移出焦点序列；打开后焦点进入侧栏，遮罩和 `Esc` 均可关闭。Megamenu 支持点击、`ArrowDown` 与 `Esc`，并可与 Sidebar 组合使用。

### 16. 聊天与倒计时

```html
<kbd class="blora-kbd">Ctrl</kbd> + <kbd class="blora-kbd">K</kbd>

<div class="blora-chat blora-chat--end">
  <span class="blora-avatar blora-chat__avatar">B</span>
  <div class="blora-chat__content">
    <div class="blora-chat__meta"><span>Blora</span><time>10:26</time></div>
    <div class="blora-chat__bubble">消息内容</div>
  </div>
</div>

<div class="blora-countdown" data-blora-countdown data-target="2026-12-31T23:59:59+08:00">
  <span class="blora-countdown__unit"><strong class="blora-countdown__value" data-unit="days">0</strong><span class="blora-countdown__label">天</span></span>
  <span class="blora-countdown__unit"><strong class="blora-countdown__value" data-unit="hours">00</strong><span class="blora-countdown__label">时</span></span>
</div>
<!-- 相对时长可改用 data-seconds；结束时派发 blora:complete -->

```

### 17. Text Rotate 与 Mockup

```html
<span class="blora-text-rotate" data-interval="3200">
  <span class="blora-text-rotate__item is-active">清晰界面</span>
  <span class="blora-text-rotate__item">一致体验</span>
</span>

<!-- Browser -->
<div class="blora-mockup blora-mockup--browser">
  <div class="blora-mockup__toolbar">
    <span class="blora-mockup__dots" aria-hidden="true"><span></span></span>
    <div class="blora-mockup__address">https://example.com</div>
  </div>
  <div class="blora-mockup__body">…</div>
</div>

<!-- Code -->
<div class="blora-mockup blora-mockup--code">
  <pre class="blora-mockup__line" data-prefix="$"><code>npm i @bloret-crew/blora-design</code></pre>
  <pre class="blora-mockup__line blora-mockup__line--success" data-prefix=">"><code>Done!</code></pre>
</div>

<!-- Window -->
<div class="blora-mockup blora-mockup--window">
  <div class="blora-mockup__toolbar">
    <span class="blora-mockup__dots" aria-hidden="true"><span></span></span>
    <span class="blora-mockup__title">Preferences</span>
  </div>
  <div class="blora-mockup__body">…</div>
</div>

<!-- Phone：daisyUI 比例（462∶978、5px 边框、6px 内边、灵动岛 28%×3.7%） -->
<div class="blora-mockup blora-mockup--phone">
  <div class="blora-mockup__camera" aria-hidden="true"></div>
  <div class="blora-mockup__display">
    <div class="blora-mockup__display-body">…</div>
  </div>
</div>
<!-- 边框色：--phone-accent / --phone-silver；宽度：--blora-phone-max -->
```

旧类名 `blora-browser-mockup` / `blora-code-mockup` / `blora-window-mockup` / `blora-phone-mockup` 仍可作为别名。

Text Rotate 为可选强调效果，服从 `prefers-reduced-motion`。Mockup 只承载真实内容预览，不替代业务容器。

### 18. Markdown · Thread · 进阶选择器 · 反馈增强

**Markdown**（零依赖子集：先转义再解析）

```html
<div data-blora-md>
  <script type="text/markdown">
## 标题
段落 **加粗** 与 `code`。
  </script>
</div>
```

```js
Blora.markdown("**hi**", { inline: true });
Blora.renderMarkdown("#el", "## 标题\n正文"); // 别名 Blora.md
```

**论坛评论流 Thread**（核心 Timeline + Thread 评论卡片）

```html
<div class="blora-thread">
  <blora-timeline>
    <blora-timeline-item icon="thumbs-up" time="· 6个月前">
      <b class="blora-text-primary">Detrital</b> 点赞了帖子
    </blora-timeline-item>
    <blora-timeline-item icon="message" content-layout="block">
      <blora-thread-comment collapse-height="158">
        <div slot="head">…头像 / 作者 / 时间 / 操作…</div>
        <div slot="quote">## 被回复的内容</div>
        <p>长评论正文…</p>
        <div slot="reactions">…表情统计与添加按钮…</div>
      </blora-thread-comment>
    </blora-timeline-item>
  </blora-timeline>

  <blora-thread-composer>
    <div slot="toolbar">…消费者自定义工具按钮…</div>
    <textarea placeholder="撰写评论"></textarea>
    <div slot="preview">…消费者提供的预览…</div>
    <div slot="actions">…发表评论 / 定时发送…</div>
  </blora-thread-composer>
</div>
```

`<blora-thread-comment>` 会测量自己的正文；只有超过阈值时才默认折叠，并自动生成底部渐隐与浮动展开按钮。`<blora-thread-composer>` 只负责开放式撰写布局和编辑 / 预览切换。短评论没有折叠控件；轻量、非时间线评论仍可使用 `<blora-comment>`。

```html
<blora-comment>
  <span slot="avatar" class="blora-avatar" data-size="sm">R</span>
  <span slot="author">Rhedar</span>
  <time slot="meta">刚刚</time>
  正文里可以放标签、图片或其他组件。
  <button slot="actions" type="button" class="blora-button" data-size="xs" data-variant="outline">回复</button>
  <button slot="actions" type="button" class="blora-button" data-size="xs" data-variant="outline" data-icon="thumbs-up" aria-label="赞">12</button>
</blora-comment>
```

**TreeSelect / AutoComplete / Mentions / Select 增强**

```html
<div class="blora-treeselect" data-blora-treeselect data-options='[…]'>
  <input class="blora-input" readonly placeholder="选择">
</div>
<div class="blora-autocomplete" data-blora-autocomplete data-options='["A","B"]'>
  <input class="blora-input">
</div>
<div class="blora-mentions" data-blora-mentions data-options='["alice"]'>
  <textarea class="blora-textarea"></textarea>
</div>
<select class="blora-select" data-blora-search data-blora-remote multiple data-max-tag-count="2">…</select>
```

```js
Blora.select.setOptions(sel, [{ value: "a", label: "A" }]);
// data-blora-remote 时监听 blora:search 后 setOptions
```

**Notify / Confirm / Preview / Tour / 其它**

```js
Blora.notify({ type: "info", title: "标题", description: "详情" });
const ok = await Blora.confirm({ title: "删除？", danger: true });
Blora.preview(imgEl); // 或 data-blora-preview
Blora.tour({ /* 或 DOM：data-blora-tour + data-blora-tour-step */ });
Blora.backTop({ showAfter: 400 });
Blora.qrcode(el, { text: "https://example.com", size: 132 });
// 可选文字动效：Blora.textFx(el, "bloom") — 展示页默认不强调
```

进阶布局：`data-blora-affix`、`data-blora-splitter`、`data-blora-watermark`、`data-blora-anchor`、`.blora-masonry`、`.blora-skeleton*`、`data-blora-countup` — 见展示页「进阶组件」与 `guide.md`。

---

## 配色与明暗模式

```html
<div class="blora-palette-picker" data-blora-palette-picker>
  <button class="blora-btn blora-palette-picker__trigger" data-blora-palette-trigger>
    <span class="blora-palette-picker__label">Dusk</span>
  </button>
  <div class="blora-palette-picker__menu"></div>
</div>

<!-- 单击依次切换：跟随系统 → 浅色 → 深色 → 跟随系统 -->
<button data-blora-color-mode aria-label="当前跟随系统，切换至浅色"></button>
```

配色卡片根据 `Blora.palettes` 自动生成，并持久化到 `paletteStorageKey`。`data-blora-color-mode` 在 `system / light / dark` 三态之间循环，选择持久化到 `colorModeStorageKey`；`system` 会监听 `prefers-color-scheme` 并实时更新有效明暗状态。二者都会触发 `blora:appearancechange`，事件 `detail` 包含当前 `palette`、模式偏好 `mode` 与有效状态 `dark`。

---

## 图表集成

Blora Design 不内置图表库。提供语义色供 ECharts / Chart.js 取用：

```js
const palette = [
  '--blora-primary', '--blora-info', '--blora-success', '--blora-warning', '--blora-accent-secondary',
].map(v => v.startsWith('--') ? getComputedStyle(document.documentElement).getPropertyValue(v).trim() : v);
```

容器建议包裹 `.blora-card`，高度 ≥ 200px。

---

## 浏览器支持

- Chrome / Edge 111+ · Firefox 113+ · Safari 16.2+
- iOS 16.2+ / Android Chrome 111+
- 使用 `backdrop-filter`、CSS 变量、`color-mix()`、flex `gap` — 现代浏览器必需

---

## 自定义

覆写令牌即可全局换肤：

```css
:root {
  --blora-primary: #2E5C8A;   /* 改主强调为青蓝 */
  --blora-background: #FAFAFB;  /* 更亮的页面背景 */
}
```

**不建议**修改组件内部样式；优先通过令牌定制。

---

## 版本

- **1.0.0** — 完整组件集、语义令牌与多配色/暗色、Form/Table/Select 行为层、i18n、Thread/Markdown、进阶组件；许可 Apache-2.0。

以 `package.json` / `Blora.version` 为准。变更说明见仓库 Git 历史与 GitHub Releases（若有）。

---

> 上手与迁移优先读 [`guide.md`](./guide.md)。组件随取随用，按需裁剪；展示页 `index.html` 为结构与视觉的最终参照。
