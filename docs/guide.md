# Blora Design 2.0 · 使用与迁移指南

> **面向 2.0（当前 `2.0.0-alpha`）**。推荐写法是：简单组件使用原生 HTML + CSS，结构敏感的复合控件只使用 **Composite Custom Element**；`createXxxController` 仅用于尚未迁为 CE 的 Table / Form 等 headless 能力。不是 1.x 的全局 `Blora.init()` / `Blora.toast`（2.0 已改为 `message`）单体 API。
> 设计令牌见 [`standards.md`](./standards.md)。组件契约见 `packages/blora-design/contracts/*.contract.json`。交互示例见 **Storybook**。  
> 1.x 冻结参考：`legacy/showcase-v1.html`、`legacy/v1/`（仅迁移对照，**不是** 2.0 推荐入口）。

---

## 目录

1. [安装与页面骨架](#1-安装与页面骨架)
2. [全局约定](#2-全局约定)
3. [常用组件写法](#3-常用组件写法)
4. [Add-on 包](#4-add-on-包)
5. [从 1.x / 其他库迁移](#5-从-1x--其他库迁移)
6. [验收清单](#6-验收清单)

---

## 1. 安装与页面骨架

### 1.1 包

```bash
pnpm add @bloret-crew/blora-design
# 可选 add-on
pnpm add @bloret-crew/blora-design-markdown @bloret-crew/blora-design-theming
```

### 1.2 样式

按需引入 token + foundations + 组件 CSS（也可使用汇总入口 `blora.css`）：

```js
import "@bloret-crew/blora-design/tokens.css";
import "@bloret-crew/blora-design/tokens.dark.css"; // 暗色语义
import "@bloret-crew/blora-design/tokens.themes.css"; // 多主题
import "@bloret-crew/blora-design/foundations.css";
import "@bloret-crew/blora-design/components/button.css";
import "@bloret-crew/blora-design/components/table.css";
// …按组件继续 import
```

### 1.3 逻辑（ESM，无全局 `Blora` 单例）

```js
import "@bloret-crew/blora-design/auto";
import {
  VERSION,
  setButtonLoading,
  createTableController,
  createFormController,
  message,
  notify,
  openImagePreview,
} from "@bloret-crew/blora-design";

console.log(VERSION); // 例如 2.0.0-alpha.1
```

### 1.4 最小页面

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- 由打包器注入 tokens + foundations + 组件 CSS -->
  </head>
  <body>
    <main class="blora-container blora-stack">
      <button type="button" class="blora-button" data-variant="primary">确定</button>
      <blora-search placeholder="搜索项目…"></blora-search>
      <blora-range values="25,70"></blora-range>
    </main>
  </body>
</html>
```

- **2.0 不依赖** 页面加载后自动 `Blora.init(document)`。  
- 结构敏感的复合控件直接使用 `auto` 注册后的标签；无需手写其内部 BEM 树。
- Table / Form 等尚未迁为 CE 的开放数据 DOM，才在挂载后调用 **`createXxxController(root)`**。
- 嵌入宿主站点时，把样式与控制器限制在你的挂载子树即可。

### 1.5 明暗与主题（theming add-on）

```js
import { applyColorScheme, applyTheme } from "@bloret-crew/blora-design-theming";

applyColorScheme("dark"); // light | dark | system（以包 API 为准）
applyTheme("ocean"); // 多主题名见 theming 包 / Storybook
```

也可用 `data-blora-color-scheme` / 主题相关 data 属性（见 theming Story）。

---

## 2. 全局约定

1. **class 前缀** `blora-*`。  
2. **变体 / 尺寸** 优先 **`data-variant` / `data-size`**，不要用 1.x 的 `blora-btn--primary` 当作 2.0 主写法（兼容层另见 §5）。  
3. **按钮** 使用 `.blora-button`（不是 `.blora-btn`）。  
4. **行为**：结构敏感控件优先使用 Composite CE；controller 仅用于 contract 明确的 advanced/compat 路径。不要假设存在全局 `Blora.table.*`。
5. **浮层** 注意 stacking / portal（Mentions、部分菜单会挂到 `document.body`）。  
6. **颜色 / 间距 / 圆角 / 阴影** 用 token（`--blora-*`），组件 CSS 内不写死业务色。  
7. **用户内容** 不要用 `innerHTML` 直接塞不可信字符串。  
8. **图标** 内联 SVG + `currentColor`；勿依赖 emoji 当唯一图标。

### 2.1 架构选择（2.0）

| 形态 | 何时用 | 示例 |
|------|--------|------|
| **原生 HTML + CSS** | 展示型、无复杂状态 | Alert、Tag、List、Card |
| **Composite Custom Element** | 内部 class 树复杂、容易拼错 | Range、Date/Time、Search、Transfer、Accordion、Command、Segmented、Tabs、Select、Dialog |
| **Headless controller（advanced/compat）** | 业务必须拥有开放数据 DOM | Table、Tree、Form、Drawer |

ADR-015 已用 Composite CE 取代 ADR-013 的默认 headless 推荐。结构封装不等于一次性全员 FA-WC；表单关联能力仍按组件 contract 分阶段补强。

---

## 3. 常用组件写法

下列为 **2.0 推荐**；细节以 Storybook 与 contract 为准。

### 3.1 按钮

```html
<button type="button" class="blora-button" data-variant="primary">主按钮</button>
<button type="button" class="blora-button" data-variant="secondary">次要</button>
<button type="button" class="blora-button" data-variant="outline">描边</button>
<button type="button" class="blora-button" data-variant="ghost">幽灵</button>
<button type="button" class="blora-button" data-variant="danger">危险</button>
<button type="button" class="blora-button" data-variant="primary" data-size="sm">小</button>
```

```js
import { setButtonLoading } from "@bloret-crew/blora-design";
setButtonLoading(btn, true);
```

### 3.2 表单字段

```html
<blora-field
  label="用户名"
  name="username"
  hint="辅助说明"
  limit="20"
  required
></blora-field>

<blora-checkbox name="agree" label="同意条款" required></blora-checkbox>
```

### 3.3 Select（Web Component）

```html
<blora-select name="plan"></blora-select>
```

```js
import { defineBloraSelect } from "@bloret-crew/blora-design";
defineBloraSelect();
```

具体属性 / 选项 API 以 Select contract 与 Storybook 为准（支持原生 form 关联路径）。

### 3.4 结构敏感的 Composite CE

```html
<blora-range min="0" max="100" values="25,70"></blora-range>
<blora-datepicker name="date"></blora-datepicker>
<blora-search name="query" placeholder="搜索…"></blora-search>
<blora-tabs><blora-tab label="概览" selected>内容</blora-tab></blora-tabs>
```

面板内容需要自行铺满背景时使用 `<blora-tabs flush>`；普通文字面板仍保留默认的顶部间距。

Range、Datepicker、Timepicker、Search、Transfer、Accordion/Collapse、Command、Segmented、Tabs 等组件的内部 BEM 树均由 CE 生成。主包不再导出这些已迁组件的旧 controller，消费侧不得手写内部树。

#### Sidebar Navigation

侧栏布局仍由 `@bloret-crew/blora-design-layout` 提供；其中的分组导航统一使用核心包的 Composite CE，不要再混用 Navbar link 或 Anchor link：

```html
<blora-sidebar-nav label="组件导航" value="accordion">
  <blora-sidebar-nav-group label="数据展示">
    <blora-sidebar-nav-link
      label="Accordion"
      href="#accordion"
      value="accordion"
    ></blora-sidebar-nav-link>
    <blora-sidebar-nav-link
      label="Collapse"
      href="#collapse"
      value="collapse"
    ></blora-sidebar-nav-link>
  </blora-sidebar-nav-group>
</blora-sidebar-nav>
```

`value` / `select(value)` 控制当前项；用户点击链接时派发 `blora-change`。当前项只高亮文字，浅色背景仅用于 hover。按需 CSS 入口为 `@bloret-crew/blora-design/components/sidebar-nav.css`。

### 3.5 表单校验

```html
<form id="demo-form" class="blora-form blora-stack">
  <label class="blora-field">
    <span class="blora-field__label">邮箱</span>
    <input class="blora-input" name="email" type="email" required />
  </label>
  <button type="submit" class="blora-button" data-variant="primary">提交</button>
</form>
```

```js
import { createFormController, getFormValues } from "@bloret-crew/blora-design";

const form = document.getElementById("demo-form");
const ctrl = createFormController(form);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!ctrl.validate()) return;
  console.log(getFormValues(form));
});
```

### 3.6 表格（内置排序 / 分页 / 列设置 / 虚拟滚动 / 行选）

**不要**让业务手写选择列 checkbox；使用 `data-blora-selectable`，由 `createTableController` 注入 Blora checkbox 与批量条。

```html
<div class="blora-table-wrap" data-blora-selectable data-page-size="10">
  <table class="blora-table" id="members">
    <thead>
      <tr>
        <th data-sort data-col-key="name">成员</th>
        <th data-sort data-col-key="dept">部门</th>
      </tr>
    </thead>
    <tbody>
      <tr data-row-key="u1">
        <td>张三</td>
        <td>技术部</td>
      </tr>
    </tbody>
  </table>
</div>
```

```js
import { createTableController } from "@bloret-crew/blora-design";

const wrap = document.querySelector(".blora-table-wrap");
const table = createTableController(wrap);

// 列设置：wrap 上 data-blora-cols（可选 data-blora-cols-key 持久化）
// 虚拟滚动：data-blora-virtual + setRows(...)
// 行选：data-blora-selectable → getSelectedRows() / clearSelection()
// 事件：table 上 blora-table-select
```

| 能力 | 标记 / API |
|------|------------|
| 排序 | `th[data-sort]`，三态 none → asc → desc |
| 本地分页 | `data-page-size` / `setPage` |
| 列显示与顺序 | `data-blora-cols` |
| 虚拟滚动 | `data-blora-virtual`、`data-virtual-axis`、`setRows` |
| 行选择 | `data-blora-selectable`（内置，非业务拼装） |

### 3.7 反馈

产品面按 **Ant 味** 只有两套：

| | Message | Notification |
|--|---------|----------------|
| 形态 | 轻量胶囊（顶部居中弹出，或页面内静态） | 带标题/描述的卡片（四角 placement） |
| API | `message()` / `message.success()` … | `notify({ title, description, placement })` |
| CSS | `.blora-message` | `.blora-notification` |

```js
import { message, notify } from "@bloret-crew/blora-design";

message("已保存");
message.success("成功");
message.error("失败"); // Ant 别名 → danger
notify({ title: "通知", description: "详情", placement: "top-right" });
```

Dialog / Drawer：

```html
<blora-dialog>…</blora-dialog>
<blora-drawer>…</blora-drawer>
```

### 3.8 图片预览 / 回到顶部

```js
import { openImagePreview, initBackTop } from "@bloret-crew/blora-design";

openImagePreview({ src: "/a.png", alt: "图" });
initBackTop(); // 自动管理 <blora-backtop>
```

### 3.9 Tree Select / Tree

```html
<blora-tree><!-- blora-tree-node definitions --></blora-tree>
<blora-tree-select><!-- blora-tree-select-option definitions --></blora-tree-select>
<blora-collapse><!-- blora-collapse-item definitions --></blora-collapse>
```

Calendar / Cascader / Tree 等结构敏感组件均已进入 **Composite CE 唯一公共消费面**。边角行为以 contract 与单测为准。

---

## 4. Add-on 包

| 包 | 用途 |
|----|------|
| `@bloret-crew/blora-design-thread` | 论坛帖 / 楼中楼 |
| `@bloret-crew/blora-design-markdown` | `renderMarkdown` / `initMarkdown` |
| `@bloret-crew/blora-design-qrcode` | 二维码 |
| `@bloret-crew/blora-design-effects` | 文字特效、倒计时、diff 等 |
| `@bloret-crew/blora-design-layout` | Sidebar / Affix / Anchor / 平滑滚动 |
| `@bloret-crew/blora-design-theming` | 主题与明暗 |

```js
import { renderMarkdown, initMarkdown } from "@bloret-crew/blora-design-markdown";
import { renderQRCode } from "@bloret-crew/blora-design-qrcode";
import "@bloret-crew/blora-design-layout";
import "@bloret-crew/blora-design-theming";
```

```html
<blora-sidebar-layout toggle-label="菜单" sticky>
  <blora-sidebar-layout-sidebar>
    <blora-sidebar-nav><!-- groups + links --></blora-sidebar-nav>
  </blora-sidebar-layout-sidebar>
  <blora-sidebar-layout-content>页面内容</blora-sidebar-layout-content>
</blora-sidebar-layout>

<blora-palette-picker></blora-palette-picker>
<blora-color-scheme-toggle></blora-color-scheme-toggle>
```

Sidebar Layout 与 Palette Picker 已迁为 Composite CE；不要再手写其 `blora-*__*` 内部树或直接挂载旧 controller。

Markdown 为零依赖子集（标题、列表、代码块等）；**不要**把不可信 HTML 当 Markdown 源直接当安全 HTML 用。

---

## 5. 从 1.x / 其他库迁移

### 5.1 1.x → 2.0 心智

| 1.x | 2.0 |
|-----|-----|
| `blora.css` + `blora.js` + `Blora.init()` | ESM 入口 + 按组件 CSS + Composite CE；仅无 CE 的 advanced 能力使用 controller |
| `Blora.toast` / `Blora.table.*` | 具名导出 `message` / `createTableController`（无 toast API） |
| `.blora-btn.blora-btn--primary` | `.blora-button[data-variant="primary"]` |
| 全局自动扫描 `data-blora-*` | `./auto` 注册 Composite CE |

### 5.2 没有 1.x 运行时兼容层

2.0 **不提供** `compat/v1`。请直接写 2.0 class、token 和 Composite CE。  
**冻结副本** `legacy/v1/`、`legacy/showcase-v1.html` 只作视觉与行为基线，不是可调用 API。

### 5.3 从 Bootstrap 等迁移

1. `btn btn-primary` → `blora-button` + `data-variant="primary"`。  
2. `form-control` → `blora-input` + `blora-field`。  
3. 自研 modal → `blora-dialog` / Drawer controller。  
4. 表格选择列 → `data-blora-selectable`，勿混系统原生蓝框 checkbox。  
5. 避免同一表单混用两套 UI 组件库的控件皮肤。

### 5.4 框架（React / Vue 等）

Blora Design **不要求** React/Vue 运行时。ADR-015 下优先直接渲染标准 Custom Element；只有 Table 等开放数据 DOM 使用 controller。接入要点：

- 框架只负责数据与事件；  
- 复合控件渲染 `<blora-*>` 标签与声明式子项，不复制内部 BEM 树；
- advanced controller 在组件生命周期里初始化，卸载时 `destroy()`（避免重复初始化 / 泄漏）；
- 浮层类（Mentions、部分菜单、Message / Notification 容器）会挂到 `document.body`，交给框架卸载即可。

**React advanced 示例（Table 开放 DOM）**：

```tsx
import { useEffect, useRef } from "react";
import { createTableController } from "@bloret-crew/blora-design";
import "@bloret-crew/blora-design/tokens.css";
import "@bloret-crew/blora-design/foundations.css";
import "@bloret-crew/blora-design/components/table.css";

export function Members() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctrl = createTableController(ref.current);
    return () => ctrl.destroy();
  }, []);
  return (
    <div className="blora-table-wrap" data-blora-selectable ref={ref}>
      <table className="blora-table">
        <thead><tr><th data-sort data-col-key="name">成员</th></tr></thead>
        <tbody>
          <tr data-row-key="u1"><td>张三</td></tr>
        </tbody>
      </table>
    </div>
  );
}
```

**Vue 示例**（`<script setup>`）：

```vue
<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import { createTableController } from "@bloret-crew/blora-design";
import "@bloret-crew/blora-design/tokens.css";
import "@bloret-crew/blora-design/foundations.css";
import "@bloret-crew/blora-design/components/table.css";

const wrap = ref(null);
let ctrl = null;
onMounted(() => { ctrl = createTableController(wrap.value); });
onBeforeUnmount(() => ctrl?.destroy());
</script>

<template>
  <div class="blora-table-wrap" data-blora-selectable ref="wrap">
    <table class="blora-table">
      <thead><tr><th data-sort data-col-key="name">成员</th></tr></thead>
      <tbody><tr data-row-key="u1"><td>张三</td></tr></tbody>
    </table>
  </div>
</template>
```

相同 advanced 模式适用于任意框架（Svelte `onMount`、Angular `ngAfterViewInit` + `OnDestroy` 等）。Composite CE 不需要这层手工 controller 生命周期；导入 `@bloret-crew/blora-design/auto` 后直接渲染标签即可。

---

## 6. 验收清单

- [ ] 引入的是 **2.0 包导出**，不是照抄 1.x `Blora.*` 全局 API 文档。  
- [ ] 按钮 / 变体使用 `.blora-button` + `data-*`。  
- [ ] Composite CE 已由 `@bloret-crew/blora-design/auto` 注册，且没有复制内部 BEM 树。
- [ ] 仅 Table / Form 等 contract 明确标为 headless 的能力手工初始化 controller，并在卸载时 `destroy()`。
- [ ] 表格行选使用 **内置** `data-blora-selectable`。  
- [ ] 动态插入的 checkbox 使用完整 `label.blora-checkbox` 结构。  
- [ ] 颜色与间距走 token；暗色下可读。  
- [ ] 对照 Storybook 与（如需要）`legacy/showcase-v1.html` 视觉基线。  
- [ ] 公开 API 变更已看过对应 `*.contract.json`。

---

## 相关文档

| 文档 | 内容 |
|------|------|
| [`docs/refactor/status.md`](./refactor/status.md) | 重构阶段进度 |
| [`docs/refactor/component-matrix.md`](./refactor/component-matrix.md) | 组件迁移矩阵 |
| [`docs/refactor/css-only-resolution.md`](./refactor/css-only-resolution.md) | 有意 CSS-only vs controller |
| [`docs/ai/migration-rules.md`](./ai/migration-rules.md) | 1.x class 映射（迁移） |
| `legacy/` | 1.x 冻结源与视觉基线 |

历史 **1.x 详表**（`Blora.*` 单体 API 罗列）已不再作为 2.0 推荐参考；若需对照旧行为，请看 `legacy/v1/` 与 refactor 清单，而不是把旧 `guide` 段落当现行 API。
