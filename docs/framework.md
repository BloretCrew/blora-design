# Blora Design · UI 框架文档

> 本文档面向工程师。涵盖安装、令牌、所有组件 API 与用法、JS 行为。
> 设计规范见 [`standards.md`](./standards.md)。

---

## 安装

Blora 是 **零依赖** 框架：纯 CSS（约 1400 行）+ 原生 JS（未压缩约 40KB），不绑构建工具。

```bash
# 1) npm / pnpm（推荐用于团队 Web 应用）
npm install @bloret/blora-design

# 2) 直接拷贝（适合静态站）
cp blora.css  your-project/
cp blora.js   your-project/

# 3) 或 CDN（发布后）
# <link rel="stylesheet" href="https://cdn.blora.design/1.0/blora.css">
# <script src="https://cdn.blora.design/1.0/blora.js"></script>
```

```html
<link rel="stylesheet" href="blora.css">
<!-- 可选：引入 UI 与等宽字体 -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="blora.js"></script>
```

**作用域约定**

- 完整页面：给 `<body>` 添加 `class="blora-page blora-scope"`，启用页面底色、字体、基础元素 reset 与组件样式。
- 嵌入已有应用：只给 Blora 局部容器添加 `.blora-scope`，避免影响宿主应用的全局标题、链接、按钮和背景。
- 单独使用组件类时，组件读取 `:root` 中的设计令牌；换肤优先覆写 `--blora-*`。

**框架结构**

```
blora-design-2/
├── blora.css      # 框架本体 · 1400+ 行 · 全部样式与令牌
├── blora.js       # 交互层 · 约 1000 行 · 无依赖
├── index.html     # 组件全集展示
└── docs/
    ├── standards.md   # 设计规范
    └── framework.md   # 本文档
```

**JS 初始化**

```html
<script>
  // 自动在 DOMContentLoaded 后初始化；
  // 若动态插入组件，手动调用：
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
      let palette = localStorage.getItem(config.paletteStorageKey || 'blora-palette') || 'dusk';
      const modeKey = config.colorModeStorageKey || config.storageKey || 'blora-color-mode';
      const storedMode = localStorage.getItem(modeKey);
      const mode = ['system', 'light', 'dark'].includes(storedMode) ? storedMode : 'system';
      root.dataset.bloraColorPreference = mode;
      if (palette !== 'dusk') root.dataset.bloraPalette = palette;
      if (mode === 'dark' || (mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)) root.classList.add('blora-dark');
    } catch (error) {}
  })();
</script>
<link rel="stylesheet" href="blora.css">
```

**全局 API**

```js
Blora.toast({ type: 'success', message: '操作已完成', duration: 3000 });
Blora.openModal('modal-id');
Blora.closeModal('modal-id');
Blora.openDrawer('drawer-id');
Blora.closeDrawer('drawer-id');
Blora.init(root);     // 重新扫描并绑定（幂等：已绑定的元素自动跳过，可放心对动态子树重复调用）
Blora.configure({ portalRoot, colorModeStorageKey, paletteStorageKey, autoInit });
Blora.applyPalette('ocean'); // cinnabar | indigo | lotus | ocean | graphite | mono | circuit | coral | dusk
Blora.getPalette();          // 当前配色名称
Blora.palettes;              // 配色元数据
Blora.applyColorMode('system'); // system | light | dark
Blora.getColorMode();           // 当前模式偏好，不等同于当前有效明暗状态
Blora.locale;         // 日历/选择器文案（months / dow / today / clear…），可整体覆写做本地化
Blora.version;        // "1.0.0"
```

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
  /* Motion */ --blora-ease, --blora-ease-soft, --blora-ease-overshoot, --blora-dur-fast/base/slow/emphasis
  /* Z-index */ --blora-z-sticky/dropdown/drawer/modal/toast
}
```

**唯一视觉标准与配色**：Blora 只有一套字体、圆角、阴影、控件尺寸、动效和玻璃表面标准，直接定义在 `:root`，不需要主题属性或主题 API。`Blora.applyPalette('ocean')` 只会写入 `data-blora-palette="ocean"` 并替换语义颜色，不改变组件形态；未设置属性时使用默认 `dusk` 配色。

**暗色模式**：`<html class="blora-dark">` 即可，所有颜色 token 自动重映射，无需改组件。暗色模式可与任意配色组合。

视觉形态不随配色改变。丹砂、靛青、藕荷、海盐、Graphite、Mono、Circuit、Coral 与 Dusk 都只负责颜色映射，其中 Dusk 是默认配色。

---

## 组件 API

### 1. 排版

| 类 | 说明 |
|----|------|
| `.blora-h1` .. `.blora-h4` | Blora 标题字体与字阶 |
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

```html
<span class="blora-tag">默认</span>
<!-- 色：--primary --neutral --info --success --warning --solid -->
<!-- 可移除：--removable + .blora-tag__close -->

<span class="blora-badge">9</span>
<span class="blora-badge blora-badge--dot"></span>
<span class="blora-badge blora-badge--circle">新</span>
<span class="blora-badge blora-badge--pill">推荐</span>
<!-- 色：--neutral --success --info -->

<!-- 按钮徽章 -->
<span class="blora-indicator">
  <button class="blora-btn" type="button">通知</button>
  <span class="blora-badge blora-indicator__item">3</span>
</span>

<!-- 卡面右上角徽章 -->
<article class="blora-card blora-card--relative blora-card--with-badge">
  <span class="blora-badge blora-badge--pill blora-card__badge">推荐</span>
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

### 13. Toast

```js
Blora.toast('一条消息');
Blora.toast({ type: 'success', message: '操作已完成', duration: 3000 });
// type: info | success | warning | danger
```

容器 `.blora-toast-container` 由 JS 自动注入。

### 14. 动作与表单扩展

```html
<!-- Swap：保留原生 checkbox 语义 -->
<label class="blora-swap" aria-label="切换收藏">
  <input type="checkbox">
  <span class="blora-swap__off">未收藏</span>
  <span class="blora-swap__on">已收藏</span>
</label>

<!-- Speed Dial：支持点击、Esc、方向键、Home/End -->
<div class="blora-speed-dial" data-blora-speed-dial>
  <button class="blora-btn blora-btn--primary blora-btn--icon blora-speed-dial__trigger"
          type="button" data-blora-speed-dial-trigger aria-label="快捷操作">+</button>
  <div class="blora-speed-dial__actions">
    <button class="blora-btn blora-speed-dial__action" type="button">新建</button>
    <button class="blora-btn blora-speed-dial__action" type="button">上传</button>
  </div>
</div>
<!-- 布局：默认向上；--left 向左；--radial 径向 -->

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

<!-- 卡片叠层：需 JS；支持上下拖动跟手与滚轮切换 -->
<div class="blora-deck blora-deck--sm" tabindex="0" aria-label="卡片叠层">
  <article class="blora-card">后层</article>
  <article class="blora-card">中层</article>
  <article class="blora-card">当前层</article>
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

### 17. 可选效果与 Mockup

```html
<span class="blora-text-rotate" data-interval="3200">
  <span class="blora-text-rotate__item is-active">清晰界面</span>
  <span class="blora-text-rotate__item">一致体验</span>
</span>

<div class="blora-mockup blora-browser-mockup">…</div>
<div class="blora-mockup blora-code-mockup">…</div>
<div class="blora-mockup blora-window-mockup">…</div>
<div class="blora-phone-mockup">
  <div class="blora-phone-mockup__screen">
    <span class="blora-phone-mockup__camera"></span>
    <div class="blora-phone-mockup__body">…</div>
  </div>
</div>
```

Text Rotate 属于可选强调效果，不作为运营后台和高频工作流的默认装饰，并服从 `prefers-reduced-motion`。Mockup 只用于呈现真实产品或代码内容，不替代业务页面的正式容器。

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

Blora 不内置图表库。提供语义色供 ECharts / Chart.js 取用：

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

- **1.0.0** — 完整组件集、12 级间距、语义设计令牌、三态明暗模式与命令面板。

---

> 组件随取随用，按需裁剪。
