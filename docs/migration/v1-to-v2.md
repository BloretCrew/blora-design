# Blora Design 1.x → 2.0 迁移指南

本指南帮助你将项目从 Blora Design 1.x 迁移到 2.0。  
**2.0 新项目推荐入口**：[`docs/guide.md`](../guide.md)。进度：[`docs/refactor/remaining-work.md`](../refactor/remaining-work.md)。  
Token 全表：[`token-map-v1-v2.csv`](./token-map-v1-v2.csv)。

## 1. 升级前检查

```bash
# monorepo / 工作区
pnpm --filter @bloret-crew/blora-design run migrate:check -- ./src
```

校验器会扫描你的代码，报告需要迁移的 1.x 模式（以包内 `scripts/migrate-check.mjs` 为准；**不是**独立 npm 包 `@bloret-crew/blora-codemod`）。

## 2. 安装方式

```bash
pnpm add @bloret-crew/blora-design@alpha
# 钉死版本：@2.0.0-alpha.1
```

### 2.1 2.0 包入口（摘要）

| 入口                                                | 用途                                                                       |
| --------------------------------------------------- | -------------------------------------------------------------------------- |
| `@bloret-crew/blora-design`                         | 主 ESM（无 side-effect）；`createXxxController` / `toast` / `defineBlora*` |
| `@bloret-crew/blora-design/auto`                    | **有副作用**：注册稳定 CE（`blora-select`、`blora-dialog`）                |
| `@bloret-crew/blora-design/button` 等               | JS 子路径（button / select / dialog / table / toast）                      |
| `@bloret-crew/blora-design/components/*.css`        | 按需样式                                                                   |
| `@bloret-crew/blora-design/compat/v1`               | 1.x class/token 兼容                                                       |
| `@bloret-crew/blora-design/blora.global.js`         | CDN / IIFE 全局 `Blora`（经典 script）                                     |
| `@bloret-crew/blora-design/custom-elements.json`    | CEM                                                                        |
| `@bloret-crew/blora-design/component-manifest.json` | 组件清单                                                                   |

## 3. CSS 入口变化

### 1.x

```html
<link rel="stylesheet" href="blora.css" />
```

### 2.0

```html
<link rel="stylesheet" href="@bloret-crew/blora-design/blora.css" />
```

或通过 JS 导入：

```js
import "@bloret-crew/blora-design/blora.css";
```

## 4. 全局 API 变化

### 1.x

```js
Blora.init();
Blora.configure({ classPrefix: "my-" });
```

### 2.0

```js
import { defineBloraDialog, defineBloraSelect } from "@bloret-crew/blora-design";

defineBloraDialog();
defineBloraSelect();
```

2.0 不再有全局 `Blora` 对象。组件按需导入和注册。

## 5. Token 映射

所有 1.x CSS 变量已重命名为 2.0 语义化命名。完整映射见 [`token-map-v1-v2.csv`](./token-map-v1-v2.csv)。

主要变化：

| 1.x                  | 2.0                                    |
| -------------------- | -------------------------------------- |
| `--blora-background` | `--blora-color-surface-canvas`         |
| `--blora-surface-1`  | `--blora-color-surface-default`        |
| `--blora-foreground` | `--blora-color-text-secondary`         |
| `--blora-primary`    | `--blora-color-action-primary-default` |
| `--blora-ease`       | `--blora-easing-standard`              |
| `--blora-dur-fast`   | `--blora-duration-fast`                |

如需渐进迁移，加载 compat 层：

```html
<link rel="stylesheet" href=".../blora.css" /> <link rel="stylesheet" href=".../compat/v1.css" />
```

## 6. Class 映射

### Button {#button}

| 1.x                     | 2.0                                     |
| ----------------------- | --------------------------------------- |
| `.blora-btn`            | `.blora-button`                         |
| `.blora-btn--primary`   | `.blora-button[data-variant="primary"]` |
| `.blora-btn--sm`        | `.blora-button[data-size="sm"]`         |
| `.blora-btn.is-loading` | `.blora-button[data-loading]`           |

### Card {#card}

| 1.x                       | 2.0                                 |
| ------------------------- | ----------------------------------- |
| `.blora-card--hover`      | `.blora-card[data-variant="hover"]` |
| `.blora-card--flat`       | `.blora-card[data-variant="flat"]`  |
| `.blora-card--inset`      | `.blora-card[data-variant="inset"]` |
| `.blora-card--relative`   | `.blora-card[data-positioned]`      |
| `.blora-card--with-badge` | `.blora-card[data-with-badge]`      |

### Accordion {#accordion}

| 1.x                             | 2.0                                 |
| ------------------------------- | ----------------------------------- |
| `.blora-collapse`               | `.blora-accordion`                  |
| `.blora-collapse__item`         | `.blora-accordion__item`            |
| `.blora-collapse__item.is-open` | `.blora-accordion__item[data-open]` |
| `.blora-collapse__head`         | `.blora-accordion__head`            |
| `.blora-collapse__body`         | `.blora-accordion__body`            |
| `.blora-collapse__content`      | `.blora-accordion__content`         |

### Table {#table}

| 1.x                            | 2.0                               |
| ------------------------------ | --------------------------------- |
| `.blora-table--striped`        | `.blora-table[data-striped]`      |
| `.blora-table-wrap.is-loading` | `.blora-table-wrap[data-loading]` |
| `.blora-table-wrap.is-empty`   | `.blora-table-wrap[data-empty]`   |

### List {#list}

| 1.x                  | 2.0                       |
| -------------------- | ------------------------- |
| `.blora-list--hover` | `.blora-list[data-hover]` |

### Avatar {#avatar}

| 1.x                      | 2.0                                     |
| ------------------------ | --------------------------------------- |
| `.blora-avatar--sm`      | `.blora-avatar[data-size="sm"]`         |
| `.blora-avatar--primary` | `.blora-avatar[data-variant="primary"]` |
| `.blora-avatar--square`  | `.blora-avatar[data-shape="square"]`    |
| `.blora-dot--primary`    | `.blora-dot[data-variant="primary"]`    |
| `.blora-dot--pulse`      | `.blora-dot[data-pulse]`                |

### Timeline {#timeline}

| 1.x                             | 2.0                                            |
| ------------------------------- | ---------------------------------------------- |
| `.blora-timeline__dot--primary` | `.blora-timeline__dot[data-variant="primary"]` |

### Result {#result}

| 1.x                      | 2.0                                     |
| ------------------------ | --------------------------------------- |
| `.blora-result--success` | `.blora-result[data-variant="success"]` |
| `.blora-result--error`   | `.blora-result[data-variant="error"]`   |

## 7. Data attribute 映射 {#tokens}

| 1.x                     | 2.0                       |
| ----------------------- | ------------------------- |
| `data-blora-palette`    | `data-blora-theme`        |
| `data-blora-size`       | `data-blora-density`      |
| `data-blora-color-mode` | `data-blora-color-scheme` |

## 8. Event 映射 {#events}

| 1.x                      | 2.0                         |
| ------------------------ | --------------------------- |
| `blora:appearancechange` | `blora-appearance-change`   |
| `blora:palettechange`    | `blora-theme-change`        |
| `blora:modetoggle`       | `blora-color-scheme-change` |

## 9. 自动 Codemod

```bash
pnpm --filter @bloret-crew/blora-design run migrate:check -- ./src
pnpm --filter @bloret-crew/blora-design run codemod -- ./src
```

Codemod 处理安全子集：class 重命名、modifier → data 属性等。复杂 DOM（Select / Table）只报告，不自动重写。

## 10. 无法自动迁移的内容

以下内容需要手动迁移：

- `Blora.init()` → 按需导入 `define*()` 函数
- `Blora.configure()` → 逐组件配置
- `Blora.validate()` → `createFormController` / 原生约束验证
- `Blora.toast()` → `import { toast, message } from "@bloret-crew/blora-design"`
- 复杂 DOM（Select / Table）→ Storybook + `createTableController` / `defineBloraSelect`

## 11. 常见错误

- **样式不生效**：确保加载了 `blora.css`，compat 层需要在 `blora.css` 之后加载。
- **Warning 刷屏**：`initV1Compatibility()` 每条规则每页只警告一次。使用 `{ silent: true }` 关闭。
- **`is-open` 不工作**：2.0 使用 `data-open` 属性代替 `.is-open` class。

## 12. 回滚方法

1. 保留 1.x CSS 和 JS 文件。
2. 移除 2.0 包导入。
3. 恢复 1.x `<link>` 和 `<script>` 标签。
4. Git revert 迁移提交。

## 用户向发布检查（Beta 文档基线）

发 beta 前确认：

1. `docs/guide.md` 为 2.0 推荐路径（非 1.x `Blora.*`）。  
2. 本文件入口表（§2.1）与 npm 包 `exports` 一致。  
3. `CHANGELOG.md` 记录破坏性/迁移注意。  
4. Issue 模板可用于反馈（`.github/ISSUE_TEMPLATE`）。  
5. 兼容：`import "@bloret-crew/blora-design/compat/v1"` + `compat/v1.css`。

## 兼容层 API {#api}

```js
import { initV1Compatibility } from "@bloret-crew/blora-design/compat/v1";

// 初始化（扫描 DOM + warning + MutationObserver）
const cleanup = initV1Compatibility();

// 静默模式
initV1Compatibility({ silent: true });

// 仅检测报告
import { getCompatReport } from "@bloret-crew/blora-design/compat/v1";
const report = getCompatReport();
```

## 无障碍 {#a11y}

2.0 要求所有 `<button>` 元素显式声明 `type` 属性。icon-only button 必须有 `aria-label`。

## 内部结构 {#internals}

2.0 组件的 `__` 前缀子元素 class（如 `.blora-card__title`）是公开 API。但 `__` 后再跟 `__` 的深层结构是内部的，不应直接依赖。不要直接访问 Web Component 的 `shadowRoot`。
