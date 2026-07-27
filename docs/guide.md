# Blora Design · 使用与迁移指南

> 面向要把页面做到与官方展示页（`index.html`）**同一套气质** 的工程师。  
> 产品全称 **Blora Design**；**Blora** 为品牌名（全局 JS 对象与 class 前缀仍用 `Blora` / `blora-*`）。  
> 本文假设你已通过 **npm / CDN / 本地拷贝** 拿到 `blora.css` + `blora.js`（及可选 `locales/`）。  
> 设计哲学细节见 [`standards.md`](./standards.md)；底层 API 长文见 [`framework.md`](./framework.md)。

---

## 目录

1. [导入与页面骨架](#1-导入与页面骨架)
2. [视觉设计基线与风格](#2-视觉设计基线与风格)
3. [全局约定（必读）](#3-全局约定必读)
4. [注意事项：禁止「半套原生」](#4-注意事项禁止半套原生)
5. [组件与功能用法](#5-组件与功能用法)
6. [JS API 速查](#6-js-api-速查)
7. [迁移指引](#7-迁移指引)
8. [验收清单：是否「够高雅」](#8-验收清单是否够高雅)

---

## 1. 导入与页面骨架

### 1.1 CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@bloret/blora-design@1/blora.css">
<script src="https://cdn.jsdelivr.net/npm/@bloret/blora-design@1/blora.js"></script>
```

钉死版本：把 `@1` 换成 `@1.0.0`。语言包：

```html
<script src="https://cdn.jsdelivr.net/npm/@bloret/blora-design@1/locales/en.js"></script>
<script>Blora.setLocale("en", BloraLocales.en);</script>
```

### 1.2 npm

```bash
npm i @bloret/blora-design
```

```js
import "@bloret/blora-design/blora.css";
import Blora from "@bloret/blora-design";
// 或 require("@bloret/blora-design")
```

CSS 也可：`@bloret/blora-design/style.css`（同 `blora.css`）。

### 1.3 最小合法页面

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- 可选：CSS 前恢复配色/明暗，避免闪烁（见 README） -->
  <link rel="stylesheet" href="…/blora.css">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body class="blora-page blora-scope">
  <main class="blora-container blora-stack">
    <!-- 内容 -->
  </main>
  <script src="…/blora.js"></script>
</body>
</html>
```

| class | 含义 |
|-------|------|
| `blora-page` | 页面底色、默认字体、基础 reset（完整页用） |
| `blora-scope` | 在作用域内启用组件样式；**嵌入已有站点时只挂局部根节点** |
| `blora-container` | 内容最大宽 + 水平内边距 |
| `blora-stack` / `blora-row` | 纵向/横向节奏间距 |
| `blora-grid` + `--2`/`--3`/`--4` | 响应式栅格 |

脚本加载后 **自动 `Blora.init(document)`**。动态插入的子树请再调：

```js
Blora.init(document.getElementById("mount"));
```

幂等：已绑定节点会跳过，可重复调用。

### 1.4 配置（可选）

在加载 `blora.js` **之前**：

```html
<script>
  window.BloraConfig = {
    autoInit: true,
    locale: "zh-CN",
    size: "md",                 // sm | md | lg → html[data-blora-size]
    validateOn: "submit",
    portalRoot: "#overlays",    // Modal/Drawer/Toast 挂载点
    colorModeStorageKey: "blora-color-mode",
    paletteStorageKey: "blora-palette"
  };
</script>
<script src="blora.js"></script>
```

或运行时：

```js
Blora.configure({ size: "sm", locale: "en" });
Blora.setLocale("en"); // 内置 en / zh-CN，可传自定义 pack
```

---

## 2. 视觉设计基线与风格

展示页的气质可以概括为：

| 维度 | 基线 |
|------|------|
| **气质** | 沉稳、克制、偏编辑器/工具产品；不花哨、不高饱和 |
| **色彩** | 三层模型：背景表面 / 文本边框 / 功能色；默认配色 `dusk`（藕紫灰主色） |
| **比例** | **90 / 5 / 5**：底与字约 90%，主色 ≤5%，状态色 ≤5% |
| **字体** | 现代无衬线（展示页 Noto Sans SC）+ 等宽代码；标题与正文同一骨架，靠字号/字重分层 |
| **圆角** | 连续曲率：控件偏胶囊，卡片/面板大圆角（`--blora-radius-*`） |
| **阴影** | 柔和分层 `--blora-shadow-1…4`，浮层略抬起，不做生硬大投影 |
| **动效** | 160–420ms，`cubic-bezier(.25,.8,.25,1)`；尊重 `prefers-reduced-motion` |
| **触控** | 可点区域建议 ≥ 40×40；对比度按 WCAG AA 心智设计 |

### 2.1 该用的令牌（示例）

```css
/* 推荐：覆写语义令牌，而不是改每个组件 */
:root {
  /* 一般不需要改；换肤用 Blora.applyPalette 或 data-blora-palette */
}
.my-panel {
  background: var(--blora-surface-1);
  color: var(--blora-foreground);
  border: var(--blora-border);
  border-radius: var(--blora-radius-lg);
  padding: var(--blora-space-5);
  box-shadow: var(--blora-shadow-2);
}
```

常用令牌族：

- 表面：`--blora-background`、`--blora-surface-1…3`
- 文字：`--blora-text-strong` … `--blora-text-disabled`、`--blora-foreground`
- 功能：`--blora-primary`、`--blora-success` / `warning` / `danger` / `info`
- 字号：`--blora-text-xs` … `--blora-text-5xl`
- 间距：`--blora-space-0` … `--blora-space-12`（4px 起步）
- 圆角 / 阴影 / 动效 / z-index：见 `standards.md`

### 2.2 配色与明暗

```html
<!-- 展示页同款：配色选择器 + 明暗切换 -->
<div data-blora-palette-picker>
  <button type="button" data-blora-palette-trigger class="blora-btn blora-btn--ghost">配色</button>
</div>
<button type="button" class="blora-btn blora-btn--ghost" data-blora-color-mode aria-label="切换明暗">🌓</button>
```

```js
Blora.applyPalette("ocean");          // dusk | ocean | indigo | lotus | cinnabar | graphite | mono | circuit | coral …
Blora.applyColorMode("dark");         // system | light | dark
```

暗色：`html` 上 `class="blora-dark"`（由 API 管理即可）。

### 2.3 排版 class（替代浏览器默认 h1/p 乱象）

在 `blora-page` / `blora-scope` 内，标题与正文已有统一样式。也可显式：

| class | 用途 |
|-------|------|
| `blora-h1` … `blora-h4` | 标题层级 |
| `blora-text-lead` | 导语 |
| `blora-text-muted` / `blora-text-subtle` | 次要说明 |
| `blora-code` / `blora-pre` | 行内码 / 代码块 |
| `blora-blockquote` | 引用 |
| `blora-typo-ellipsis` / `data-blora-clamp="2"` | 省略 |

**不要**在页面里再引入另一套 Bootstrap 排版或随意 `font-family: Arial` 覆盖 body。

---

## 3. 全局约定（必读）

1. **class 前缀**一律 `blora-`；状态用 `is-open` / `is-active` / `is-error` 等。  
2. **行为属性**用 `data-blora-*`（如 `data-blora-form`、`data-blora-tabs`）。  
3. **按钮**始终 `type="button"`（除非真正提交表单用 `type="submit"`）。  
4. **图标**用内联 SVG（`currentColor`），无强制图标字体依赖。  
5. **浮层**（Modal/Drawer）建议放在 `body` 末尾；可用 `portalRoot` 指定容器。  
6. **动态内容**插入后调用 `Blora.init(subtree)`。  
7. **版本**：`Blora.version` 应与 npm 包一致，排障时先看版本号。

---

## 4. 注意事项：禁止「半套原生」

> 目标：用户页面应与展示页一样**统一、克制、完整**，而不是「Blora Design 按钮 + 浏览器原生 select + 临时 div 弹窗」。

### 4.1 必须用 Blora Design、不要直接裸用浏览器控件样式

| 场景 | ❌ 不要 | ✅ 使用 |
|------|--------|--------|
| 文本框 | 无 class 的 `<input>` | `class="blora-input"` |
| 多行 | 裸 `<textarea>` | `class="blora-textarea"` |
| 下拉 | 依赖系统皮肤的裸 `<select>` | `class="blora-select"`（JS 会包一层自定义触发器） |
| 多选下拉 | 原生 `multiple` 列表框观感 | `blora-select` + `multiple` 或 `data-blora-multiple` |
| 勾选/单选 | 系统方框 | `label.blora-checkbox` / `blora-radio` 结构 |
| 开关 | 自写 checkbox | `label.blora-switch` |
| 按钮 | 默认灰色 button / 链接扮按钮 | `blora-btn` + 变体 |
| 文件选择 | 原生文件按钮长相 | `blora-file-picker` / `blora-dropzone` |
| 日期时间 | 完全依赖系统 date 弹层且无统一壳 | `blora-input` + `data-blora-datepicker` / `timepicker` 包装 |
| 数字步进 | 浏览器 number 小箭头 | `blora-number` 或 OTP 结构 |
| 提示 | `alert()` / `confirm()` | `Blora.toast` / `message` / `notify` / `confirm` |
| 对话框 | 自写 fixed 灰罩 | `blora-modal` / `blora-drawer` |
| 表格 | 无样式 table 或 Excel 风 | `blora-table` + `data-blora-table` |
| 分页 | 自写 a 标签 | `blora-pagination` + `data-blora-pagination` |
| 标签页 | 自写 show/hide | `data-blora-tabs` |
| 校验气泡 | 浏览器默认英文气泡 | `data-blora-form` + `data-blora-error-ui="popup"`（框架会 `novalidate`） |
| 回到顶部 | 自写 FAB | 全局 FAB / `data-blora-backtop` |
| 图片灯箱 | 新窗口打开 | `data-blora-preview` / `Blora.preview` |

### 4.2 允许保留的「原生」

- 语义标签：`form`、`button`、`input` **类型**（text/email/password…）——但必须挂 Blora Design 的 class（`blora-*`）。  
- 无障碍：`aria-*`、`role`、`label for`。  
- 业务逻辑：fetch、路由、WebSocket——与 UI 壳分离。

### 4.3 常见翻车

1. **只链了 CSS 没链 JS** → Select/Modal/Tabs 像半成品。  
2. **只链了 JS 没 body class** → 页面底色、字体、链接不像展示页。  
3. **和 Bootstrap/Tailwind 组件类混用** → 圆角、高度、主色打架。可并存工具类，但**控件壳只用 Blora Design**。  
4. **自定义校验还用 `setCustomValidity` 弹出浏览器气泡** → 与 Blora Design 的 popup 叠两套。  
5. **弹层写在滚动容器内部** → 被 `overflow` 裁切；放到 body / portal。  
6. **硬编码颜色** → 暗色模式与换肤失效。

---

## 5. 组件与功能用法

下列均为展示页同款写法。复制结构即可；细节以 `index.html` 为准。

### 5.1 按钮

```html
<button type="button" class="blora-btn blora-btn--primary">主按钮</button>
<button type="button" class="blora-btn blora-btn--secondary">次要</button>
<button type="button" class="blora-btn blora-btn--outline">描边</button>
<button type="button" class="blora-btn blora-btn--ghost">幽灵</button>
<button type="button" class="blora-btn blora-btn--danger">危险</button>
<button type="button" class="blora-btn blora-btn--primary blora-btn--sm">小</button>
<button type="button" class="blora-btn blora-btn--primary blora-btn--lg">大</button>
<button type="button" class="blora-btn blora-btn--primary" data-blora-loading>加载中可点</button>
<div class="blora-btn-group">…</div>
<button type="button" class="blora-btn blora-btn--primary blora-btn--icon" aria-label="更多">…</button>
```

### 5.2 表单控件

```html
<label class="blora-field">
  <span class="blora-label">用户名</span>
  <input class="blora-input" name="username" type="text" placeholder="请输入" data-blora-limit="20">
  <span class="blora-hint">辅助说明</span>
</label>

<textarea class="blora-textarea" name="bio" rows="4"></textarea>

<!-- Select：务必 blora-select；多选 / 搜索 -->
<select class="blora-select" name="plan">
  <option value="free">免费</option>
  <option value="pro">专业</option>
</select>
<select class="blora-select" name="tags" multiple data-blora-search data-max-tag-count="2">
  <option>设计</option><option>开发</option><option>运营</option>
</select>

<label class="blora-checkbox">
  <input type="checkbox" name="agree"><span class="blora-checkbox__box"></span><span>同意条款</span>
</label>
<label class="blora-radio">
  <input type="radio" name="sex" value="a"><span class="blora-radio__dot"></span><span>选项 A</span>
</label>
<label class="blora-switch">
  <input type="checkbox" name="notify"><span class="blora-switch__track"></span><span>开启通知</span>
</label>
```

**字数限制**：`data-blora-limit="N"`；组禁用提交：`data-blora-limit-group` + `data-blora-limit-action`。

**数字 / OTP**：

```html
<div class="blora-number">
  <button type="button" data-blora-number="dec">−</button>
  <input class="blora-input" type="number" value="1">
  <button type="button" data-blora-number="inc">+</button>
</div>
<div class="blora-otp" data-blora-otp data-length="6"><!-- 由 JS 生成格 -->
  <input class="blora-otp__input" maxlength="6" inputmode="numeric" autocomplete="one-time-code">
</div>
```

**滑块 / 评分 / 分段**：

```html
<input class="blora-slider" type="range" min="0" max="100" value="40">
<div class="blora-rate" data-blora-rate data-value="3"></div>
<div class="blora-segmented" data-blora-segmented>
  <button type="button" class="is-active">日</button>
  <button type="button">周</button>
  <button type="button">月</button>
</div>
```

**标签输入 / 文件**：

```html
<div class="blora-tags-input" data-blora-tags>
  <span class="blora-tag">已有</span>
  <input class="blora-input" placeholder="回车添加">
</div>
<div class="blora-file-picker" data-blora-file-upload>
  <input type="file" class="blora-file-picker__input" data-blora-file-input>
  <button type="button" class="blora-btn blora-btn--outline" data-blora-file-trigger>选择文件</button>
  <span data-blora-file-name></span>
</div>
```

### 5.3 表单校验与值

```html
<form class="blora-form blora-stack" data-blora-form data-blora-error-ui="popup" data-blora-validate-on="submit blur">
  <label class="blora-field">
    <span class="blora-label">邮箱</span>
    <input class="blora-input" name="email" type="email" required data-blora-rule="email"
           data-blora-message="请输入有效邮箱">
  </label>
  <!-- 联动：当 plan=pro 时显示 -->
  <div data-blora-when="plan=pro" data-blora-when-action="show">
    <input class="blora-input" name="seats" type="number" min="1">
  </div>
  <button type="submit" class="blora-btn blora-btn--primary">提交</button>
</form>
```

```js
Blora.registerAsyncRule("demoUsername", async (value) => {
  if (value === "admin") return "该用户名不可用";
  return true;
});
const r = Blora.validate("#form");
// await Blora.validateAsync("#form");
const values = Blora.getValues("#form");
Blora.setValues("#form", { email: "a@b.com" });
Blora.clearValidation("#form");
```

| `data-blora-error-ui` | 行为 |
|------------------------|------|
| `popup`（推荐） | 控件上方浮层错误，**不是**浏览器黄气泡 |
| 默认/其他 | 字段下 `.blora-validator` 文案 |

### 5.4 高级选择器

**Cascader**

```html
<div class="blora-cascader" data-blora-cascader='[{"label":"华东","value":"e","children":[{"label":"上海","value":"sh"}]}]'>
  <input class="blora-input" readonly placeholder="请选择">
</div>
```

**Date / Time / Calendar**

```html
<div data-blora-datepicker>
  <input class="blora-input" type="date" placeholder="YYYY-MM-DD">
</div>
<div data-blora-timepicker>
  <input class="blora-input" type="time" value="14:30">
</div>
<div class="blora-calendar" data-blora-calendar></div>
```

**Color**

```html
<div class="blora-color-picker" data-blora-colorpicker>
  <input type="color" value="#675F78">
</div>
```

**Transfer**

```html
<div class="blora-transfer">
  <div class="blora-transfer__panel">…候选 checkbox 行…</div>
  <div class="blora-transfer__actions">
    <button type="button" class="blora-btn blora-btn--outline" data-blora-transfer="right">›</button>
    <button type="button" class="blora-btn blora-btn--outline" data-blora-transfer="left">‹</button>
  </div>
  <div class="blora-transfer__panel">…已选…</div>
</div>
```

**TreeSelect / AutoComplete / Mentions**

```html
<div class="blora-treeselect" data-blora-treeselect data-options='[{"label":"华东","value":"e","children":[{"label":"上海","value":"sh"}]}]'>
  <input class="blora-input" placeholder="选择地区" readonly>
</div>
<div class="blora-autocomplete" data-blora-autocomplete data-options='["Button","Modal","Table"]'>
  <input class="blora-input" placeholder="搜索…">
</div>
<div class="blora-mentions" data-blora-mentions data-options='["alice","bob"]'>
  <textarea class="blora-textarea" placeholder="输入 @ 提及"></textarea>
</div>
```

```js
Blora.select.setOptions("#my-select", [
  { value: "a", label: "选项 A" },
  { value: "b", label: "选项 B", disabled: true }
]);
// 远程搜索：select 上 data-blora-remote，监听 blora:search 后 setOptions
```

### 5.5 标签、徽章、头像

```html
<span class="blora-tag">默认</span>
<span class="blora-tag blora-tag--primary">主色</span>
<span class="blora-tag blora-tag--success">成功</span>
<span class="blora-badge">12</span>
<span class="blora-avatar blora-avatar--primary">张</span>
<span class="blora-avatar"><img src="…" alt=""></span>
<span class="blora-status-dot blora-status-dot--success"></span>
```

### 5.6 进度与加载

```html
<div class="blora-progress" data-blora-progress data-value="60"><div class="blora-progress__bar"></div></div>
<div class="blora-skeleton blora-skeleton--title"></div>
<div class="blora-skeleton-card">…</div>
<span class="blora-spinner" aria-hidden="true"></span>
```

### 5.7 导航

```html
<!-- Tabs -->
<div data-blora-tabs>
  <div class="blora-tabs" role="tablist">
    <button type="button" class="blora-tabs__tab is-active" data-tab="a">A</button>
    <button type="button" class="blora-tabs__tab" data-tab="b">B</button>
  </div>
  <div class="blora-tabs__panel is-active" data-panel="a">…</div>
  <div class="blora-tabs__panel" data-panel="b">…</div>
</div>

<nav class="blora-breadcrumb"><a href="#">首页</a><span>/</span><span>当前</span></nav>
<nav class="blora-pagination" data-blora-pagination data-page="1" data-page-size="10" data-total="100"></nav>

<div class="blora-steps">…</div>
<nav class="blora-menu">…</nav>

<div class="blora-dropdown">
  <button type="button" class="blora-btn" data-blora-dropdown-trigger>菜单</button>
  <div class="blora-dropdown__menu">…</div>
</div>
```

Navbar / Megamenu / Sidebar / Dock / Speed Dial：结构以展示页 `#nav`、`#layout` 为准，关键属性：

- `data-blora-megamenu` + `data-blora-megamenu-trigger`
- `data-blora-sidebar-layout` + `data-blora-sidebar-toggle`
- `data-blora-speed-dial` + trigger/main/close

命令面板：页面内准备 `#blora-cmdk`（或文档约定结构），快捷键由框架绑定。

### 5.8 表格

```html
<div class="blora-table-wrap" data-blora-table data-blora-selectable data-blora-cols
     data-blora-cols-key="my-table" data-page-size="10" data-page="1">
  <table class="blora-table blora-table--striped">
    <thead>
      <tr>
        <th class="blora-table-sort" data-blora-sort="name" data-blora-fixed="left">名称</th>
        <th class="blora-table-sort" data-blora-sort="score">分数</th>
      </tr>
    </thead>
    <tbody>…</tbody>
  </table>
</div>
<nav class="blora-pagination" data-blora-pagination data-blora-table="#wrap-or-table"></nav>
```

```js
Blora.table.setRows("#wrap", [
  { name: "张三", score: 5 },
  { name: "李四", score: 4 }
], { keys: ["name", "score"] });
Blora.table.setLoading("#wrap", true);
Blora.table.sort("#wrap", "score", "desc");
Blora.table.setPage("#wrap", 2);
Blora.table.getSelection("#wrap");
// 远程：data-blora-table-mode="remote"，监听 blora:table-change / blora:page-change 自行拉数
```

### 5.9 列表 / 折叠 / 时间轴 / 树

```html
<div class="blora-list blora-list--hover">
  <div class="blora-list__item">
    <span class="blora-avatar blora-avatar--sm">A</span>
    <div class="blora-list__meta">
      <div class="blora-list__title">标题</div>
      <div class="blora-list__desc">说明</div>
    </div>
    <span class="blora-tag">标签</span>
  </div>
</div>

<div class="blora-collapse" data-blora-accordion>
  <div class="blora-collapse__item is-open">
    <div class="blora-collapse__head">标题<span class="blora-collapse__icon">…</span></div>
    <div class="blora-collapse__body"><div class="blora-collapse__content">内容</div></div>
  </div>
</div>

<div class="blora-timeline">…</div>
<div class="blora-tree">…</div>
```

### 5.10 媒体与数据装饰

- **Carousel**：`.blora-carousel` + 轨道/指示器（见展示页）  
- **Diff**：`.blora-diff` + range  
- **Hover Gallery**：`.blora-hover-gallery`  
- **Deck**：`.blora-deck` 卡片叠层  
- **Stat / CountUp**：

```html
<div class="blora-stat">
  <div class="blora-stat__label">访问</div>
  <div class="blora-stat__value" data-blora-countup="12840" data-duration="1200">0</div>
</div>
```

- **QRCode**：`<div class="blora-qrcode" data-blora-qrcode data-text="https://example.com" data-size="132"></div>`  
- **Countdown**：`data-blora-countdown` + 截止时间属性（见 framework）  
- **图片预览**：缩略图 `data-blora-preview` 或 `Blora.preview(el)`

### 5.11 反馈

```html
<div class="blora-alert blora-alert--success">已保存</div>
<div class="blora-alert blora-alert--warning">注意</div>
<div class="blora-empty">空状态文案</div>
<div class="blora-result blora-result--success">…</div>
```

```js
Blora.toast({ type: "success", message: "操作成功", duration: 3000 });
Blora.message("简写 toast");
Blora.notify({ type: "info", title: "标题", description: "详情", duration: 4000 });
const ok = await Blora.confirm({ title: "删除？", content: "不可恢复", danger: true });
```

**Tooltip / Popover**

```html
<button type="button" class="blora-btn" data-blora-tooltip="说明文字">悬停</button>
<button type="button" class="blora-btn" data-blora-popover data-content="浮层内容">点击</button>
```

### 5.12 Modal / Drawer

```html
<button type="button" class="blora-btn" data-blora-modal-open="modal-demo">打开</button>

<div class="blora-modal" id="modal-demo" role="dialog" aria-modal="true">
  <div class="blora-modal__mask" data-blora-close></div>
  <div class="blora-modal__dialog">
    <header class="blora-modal__head">
      <h3 class="blora-modal__title">标题</h3>
      <button type="button" class="blora-modal__close" data-blora-close aria-label="关闭">×</button>
    </header>
    <div class="blora-modal__body">…</div>
    <footer class="blora-modal__foot">
      <button type="button" class="blora-btn blora-btn--outline" data-blora-close>取消</button>
      <button type="button" class="blora-btn blora-btn--primary">确定</button>
    </footer>
  </div>
</div>
```

```js
Blora.openModal("modal-demo");
Blora.closeModal("modal-demo");
Blora.openDrawer("drawer-right");
// Drawer：.blora-drawer--right|left|top|bottom + data-blora-drawer-open
```

### 5.13 布局增强

```html
<div class="blora-affix" data-blora-affix data-offset="88">吸顶内容</div>
<div class="blora-splitter" data-blora-splitter data-min="100">
  <div class="blora-splitter__pane">左</div>
  <div class="blora-splitter__pane">右</div>
</div>
<div class="blora-masonry" style="--blora-masonry-cols:3">…</div>
<div class="blora-watermark" data-blora-watermark data-text="Confidential">内容</div>
<nav class="blora-anchor" data-blora-anchor data-offset="96">
  <a href="#sec-a">A</a><a href="#sec-b">B</a>
</nav>
```

Tour：

```html
<div data-blora-tour id="tour-host">
  <button type="button" data-blora-tour-start="#tour-host">开始</button>
  <span data-blora-tour-step data-tour-title="一步" data-tour-desc="说明">…</span>
</div>
```

```js
Blora.tour({ /* 或依赖 DOM 标记 */ });
Blora.backTop({ showAfter: 400 });
```

### 5.14 Markdown

```html
<!-- 块级：script 包裹源文，避免 HTML 转义问题 -->
<div class="blora-md" data-blora-md>
  <script type="text/markdown">
## 标题
段落 **加粗** 与 `code`。
  </script>
</div>
<!-- 或 API -->
```

```js
const html = Blora.markdown("**hi**", { inline: true });
Blora.renderMarkdown("#el", "## 标题\n正文");
// 别名：Blora.md
```

支持子集：标题、段落、粗斜体、行内码、链接、列表、引用、代码块等（先转义再解析，防 XSS 心智：仍勿渲染不信任的原始 HTML）。

### 5.15 评论与论坛跟帖 Thread

**轻量评论**

```html
<div class="blora-comment">
  <span class="blora-avatar blora-avatar--sm">张</span>
  <div class="blora-comment__main">
    <div class="blora-comment__head">
      <span class="blora-comment__author">张三</span>
      <span class="blora-comment__time">2 小时前</span>
    </div>
    <div class="blora-comment__body">内容</div>
    <div class="blora-comment__actions">
      <button type="button">回复</button>
    </div>
  </div>
</div>
```

**论坛跟帖（展示页 Thread）**

```html
<div class="blora-thread" data-blora-thread>
  <article class="blora-post">
    <header class="blora-post__head">…头像作者楼层…</header>
    <div class="blora-post__title" data-blora-md>## 标题</div>
    <div class="blora-post__body" data-blora-md>
      <script type="text/markdown">正文 Markdown</script>
    </div>
    <div class="blora-post__tools">…可选工具条…</div>
    <!-- 可选反应：data-blora-react 等，见展示页 -->
    <div class="blora-post__replies">…嵌套 blora-post…</div>
  </article>
</div>
```

发帖区可用现有件拼：`blora-textarea` + 工具按钮 + Mentions + `Blora.markdown` 预览 + Form 提交——不必等专用 Composer 组件。

### 5.16 其他

| 能力 | 标记 / API |
|------|------------|
| 快捷键展示 | `data-blora-shortcut="mod+k"` → 自动 ⌘/Ctrl |
| 文字轮播 | `.blora-text-rotate` + items |
| 文字动效（可选） | `.blora-text-fx--shake` 或 `Blora.textFx(el, "bloom")`（展示页默认不强调） |
| 搜索框壳 | `.blora-search` 结构 |
| 复制 | 展示页 `data-blora-copy`（业务可自写，非核心 API） |
| i18n | `Blora.t("validate.required")`、`setLocale`、`locales/*.js` |
| class 前缀 | `Blora.cls("btn", "btn--primary")`；静态 CSS 仍为 `.blora-*` |

---

## 6. JS API 速查

```js
Blora.version
Blora.init(root?)
Blora.configure(options) / setOptions / getConfig()

Blora.applyPalette(name) / getPalette() / palettes
Blora.applyColorMode("system"|"light"|"dark") / getColorMode()

Blora.t(key, params?) / setLocale(code, pack?) / getLocale() / locales / locale

Blora.validate / validateAsync / validateField / validateFieldAsync
Blora.clearValidation / getValues / setValues / registerAsyncRule

Blora.table.sort / setPage / setRows / setLoading / getSelection / clearSelection / getState / renderPagination
Blora.select.setOptions

Blora.toast / message / notify / confirm
Blora.openModal / closeModal / openDrawer / closeDrawer
Blora.preview / closePreview / tour / backTop / qrcode
Blora.markdown / md / renderMarkdown
Blora.textFx / textFxNames
Blora.cls / classPrefix / formatShortcut / getShortcutPlatform
```

类型定义：`blora.d.ts`。

---

## 7. 迁移指引

### 7.1 总策略

```text
1. 先挂 blora.css + blora.js + body 作用域（整页皮肤）
2. 全局替换原生控件 class → Blora Design 控件
3. 反馈与浮层改为 toast/modal/drawer
4. 表格/表单接 data-blora-* 行为
5. 对照 index.html 逐区块视觉验收
6. 业务逻辑（路由/API）保持不动，只换壳
```

**不要**同一页长期保留两套 UI 框架控件。工具类 CSS 可以留，**组件皮肤不能双开**。

### 7.2 从「裸 HTML / 浏览器默认」迁移

| 旧写法 | 新写法 |
|--------|--------|
| `<input>` | `class="blora-input"` + `.blora-field` |
| `<select>` | `class="blora-select"` |
| `<button>` | `class="blora-btn blora-btn--…"` |
| `alert/confirm` | `Blora.toast` / `Blora.confirm` |
| 自写 modal | `blora-modal` |
| 无样式 table | `blora-table` + wrap |
| 系统校验气泡 | `data-blora-form` + popup |

### 7.3 从 Bootstrap / 类似类库迁移

1. 去掉 `btn btn-primary` → `blora-btn blora-btn--primary`。  
2. 去掉 `form-control` → `blora-input`。  
3. 去掉 Bootstrap Modal JS → Blora Design 的 modal 标记。  
4. Grid：可用 `blora-grid blora-grid--3` 或继续用自己的 layout，但颜色与控件必须用 Blora Design。  
5. 删除冲突的 reboot/normalize，或保证 Blora Design 样式在后且在 `blora-scope` 内生效。

### 7.4 从 Ant Design / Element 等 React/Vue 库迁移

Blora Design **没有** JSX 组件。迁移方式是 **输出同等 DOM 结构**：

- 用你们现有框架只负责数据与事件；  
- `render` 结果必须是 Blora Design 的 class/`data-blora-*`；  
- `mounted` / `updated` 后 `Blora.init(el)`；  
- 不要 `import { Button } from 'antd'` 与 Blora Design 控件混在同一表单。

### 7.5 论坛 / BBS / 内容站（如站点壳改造）

| 页面 | Blora Design 拼法 |
|------|------------|
| 帖子列表 | `blora-list` / Card + `blora-pagination` + Tag |
| 帖子详情 | `blora-thread` + `data-blora-md` + Comment |
| 发帖/回复 | Textarea + Mentions + 工具按钮 + Form 校验 + Markdown 预览 |
| 设置 | `blora-form` + Switch/Select/Tabs |
| 管理表 | `data-blora-table` 全家桶 |
| 导航壳 | Navbar + Sidebar + Dropdown |
| 实时聊天/直播/AI | **业务模块**；UI 仍用 Card/List/输入条 |

原则：**壳 100% Blora Design，业务逻辑外置。** 缺的「开箱大组件」用现有件拼，而不是退回原生控件。

### 7.6 迁移顺序建议（降低翻车）

1. **布局与导航**（先像展示页）  
2. **按钮与表单**（用户感知最强）  
3. **反馈浮层**（去掉 alert）  
4. **表格与数据**  
5. **内容 Markdown / Thread**  
6. 删掉旧 CSS 中与控件冲突的部分  

每步打开展示页对照：圆角、高度、主色、暗色是否一致。

### 7.7 嵌入已有大型应用

```html
<div id="blora-app" class="blora-scope">
  <!-- 仅此子树使用 Blora Design -->
</div>
```

```js
Blora.configure({
  portalRoot: "#blora-app", // 或 document.body 专用层
  colorModeStorageKey: "myapp-blora-mode",
  paletteStorageKey: "myapp-blora-palette"
});
Blora.init(document.getElementById("blora-app"));
```

若宿主已有全局 reset 冲突，避免给 `body` 挂 `blora-page`；用 `blora-scope` 把 Blora Design 局部化。

---

## 8. 验收清单：是否「够高雅」

发布前用展示页做对照，勾选：

- [ ] 已引入 **CSS + JS**，且 `Blora.version` 可打印  
- [ ] 根节点具备 `blora-page` 和/或 `blora-scope`  
- [ ] 已加载与展示页接近的 **中文字体**（或可接受的令牌字体栈）  
- [ ] **没有**未包 class 的裸 input/select/button 出现在主流程  
- [ ] 错误提示走 Blora Design（popup 或 validator），**无**浏览器默认校验黄泡  
- [ ] 对话框/抽屉/轻提示全部为 Blora Design，无 `alert`  
- [ ] 主色与间距来自令牌；暗色模式可切换且不「花斑」  
- [ ] 表格/分页/表单交互与展示页同类 demo 行为一致  
- [ ] 动态插入区域调用了 `Blora.init`  
- [ ] 未同时大面积使用另一套 UI 组件库的控件皮肤  

全部勾选后，观感应与 `index.html` 同属一个设计系统。

---

## 延伸阅读

- [`standards.md`](./standards.md) — 设计规范（视觉 / 令牌）  
- [`framework.md`](./framework.md) — class 与 JS API 详表  
- 仓库根目录 [`README.md`](../README.md) — 安装与版本策略  
- 展示页 `index.html` — **视觉与结构的最终参照**

---

*Blora Design · Apache-2.0 · BloretCrew / RhedarLiu*
