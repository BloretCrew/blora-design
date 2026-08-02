# Blora Design 2.0 · 使用与迁移指南

> **面向 2.0（当前 `2.0.0-alpha`）**。推荐写法是 **CSS class + headless `createXxxController` / 少量 Web Component**，**不是** 1.x 的全局 `Blora.init()` / `Blora.toast` 单体 API。  
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
import {
  VERSION,
  setButtonLoading,
  createTableController,
  createFormController,
  toast,
  notify,
  openImagePreview,
  defineBloraSelect,
  defineBloraDialog,
} from "@bloret-crew/blora-design";

defineBloraSelect();
defineBloraDialog();
// 或：import "@bloret-crew/blora-design/auto";
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
    </main>
  </body>
</html>
```

- **2.0 不依赖** 页面加载后自动 `Blora.init(document)`。  
- 需要行为的根节点：挂好 markup 后调用对应 **`createXxxController(root)`**（或使用已 `define` 的自定义元素）。  
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
4. **行为** 由 **controller** 或 **Web Component** 绑定；不要假设存在全局 `Blora.table.*`。  
5. **浮层** 注意 stacking / portal（Mentions、部分菜单会挂到 `document.body`）。  
6. **颜色 / 间距 / 圆角 / 阴影** 用 token（`--blora-*`），组件 CSS 内不写死业务色。  
7. **用户内容** 不要用 `innerHTML` 直接塞不可信字符串。  
8. **图标** 内联 SVG + `currentColor`；勿依赖 emoji 当唯一图标。

### 2.1 架构选择（2.0）

| 形态 | 何时用 | 示例 |
|------|--------|------|
| **原生 HTML + CSS** | 展示型、无复杂状态 | Alert、Tag、List、Card |
| **Headless controller** | 复合交互、增强原生表 | Table、Tree、Form、Drawer |
| **Web Component** | 高度封装且需自定义元素边界 | `<blora-select>`、`<blora-dialog>` |

早期「全部 form-associated WC」**不是**当前 2.0 默认交付；Select/Dialog 等少数组件已是 CE。

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
<label class="blora-field">
  <span class="blora-field__label">用户名</span>
  <input class="blora-input" name="username" type="text" />
  <span class="blora-field__help">辅助说明</span>
</label>

<label class="blora-checkbox">
  <input type="checkbox" name="agree" />
  <span class="blora-checkbox__box"></span>
  <span>同意条款</span>
</label>
```

字数限制等用 `createFieldController`（见 Field Story / contract）。

### 3.3 Select（Web Component）

```html
<blora-select name="plan"></blora-select>
```

```js
import { defineBloraSelect } from "@bloret-crew/blora-design";
defineBloraSelect();
```

具体属性 / 选项 API 以 Select contract 与 Storybook 为准（支持原生 form 关联路径）。

### 3.4 表单校验

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

### 3.5 表格（内置排序 / 分页 / 列设置 / 虚拟滚动 / 行选）

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

### 3.6 反馈

```js
import { toast, message, notify } from "@bloret-crew/blora-design";

toast("已保存");
message.success("成功");
notify({ title: "通知", description: "详情", placement: "top-right" });
```

Dialog / Drawer：

```js
import { defineBloraDialog, createDrawerController } from "@bloret-crew/blora-design";
defineBloraDialog();
// <blora-dialog>…</blora-dialog>
// Drawer：markup + createDrawerController(root)
```

### 3.7 图片预览 / 回到顶部

```js
import { openImagePreview, createBackTopController, initBackTop } from "@bloret-crew/blora-design";

openImagePreview({ src: "/a.png", alt: "图" });
// 或 image 节点 data-blora-preview + createImageController

initBackTop(); // 或 createBackTopController(buttonEl, options)
```

### 3.8 Tree Select / Tree / Collapse 等

```js
import {
  createTreeSelectController,
  createTreeController,
  createCollapseController,
} from "@bloret-crew/blora-design";
// markup 见对应 Storybook 与 contract
```

Calendar / Cascader / Transfer 等为 **headless 子集**：保证主路径可用，并非每个 1.x 边角行为都已对齐；以 contract 与单测为准。

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
import { createSidebarLayoutController } from "@bloret-crew/blora-design-layout";
```

Markdown 为零依赖子集（标题、列表、代码块等）；**不要**把不可信 HTML 当 Markdown 源直接当安全 HTML 用。

---

## 5. 从 1.x / 其他库迁移

### 5.1 1.x → 2.0 心智

| 1.x | 2.0 |
|-----|-----|
| `blora.css` + `blora.js` + `Blora.init()` | ESM 入口 + 按组件 CSS + `createXxxController` / `defineBlora*` |
| `Blora.toast` / `Blora.table.*` | 具名导出 `toast` / `createTableController` |
| `.blora-btn.blora-btn--primary` | `.blora-button[data-variant="primary"]` |
| 全局自动扫描 `data-blora-*` | 显式初始化控制器（兼容层可辅助，见下） |

### 5.2 兼容层（有意保留，不是「残留未删」）

- 包内 `compat/v1`：class / token 映射、`initV1Compatibility`、告警。  
- 工具：`migrate:check`、codemod（见 monorepo scripts / Phase 8 文档）。  
- **冻结副本** `legacy/v1/`、`legacy/showcase-v1.html`：视觉与行为基线，**不要删除**。  

新代码请直接写 2.0；旧页面可阶段性挂兼容层再逐步替换。

### 5.3 从 Bootstrap 等迁移

1. `btn btn-primary` → `blora-button` + `data-variant="primary"`。  
2. `form-control` → `blora-input` + `blora-field`。  
3. 自研 modal → `blora-dialog` / Drawer controller。  
4. 表格选择列 → `data-blora-selectable`，勿混系统原生蓝框 checkbox。  
5. 避免同一表单混用两套 UI 组件库的控件皮肤。

### 5.4 框架（React / Vue 等）

Blora Design **不提供** 官方 JSX 封装为唯一路径。常见做法：

- 框架只负责数据与事件；  
- 渲染 **2.0 DOM 结构**；  
- `mounted` / `onMounted` 里 `createXxxController(el)`，卸载时 `destroy()`；  
- 或封装一层很薄的 framework wrapper（业务自建即可）。

---

## 6. 验收清单

- [ ] 引入的是 **2.0 包导出**，不是照抄 1.x `Blora.*` 全局 API 文档。  
- [ ] 按钮 / 变体使用 `.blora-button` + `data-*`。  
- [ ] 需要交互的根节点已 `createXxxController` 或 CE `define`。  
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
