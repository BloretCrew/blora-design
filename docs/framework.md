# Blora Design 2.0 · 框架说明

2.0 是 token + Composite Custom Element 的 ESM 包，不是 1.x 的 `blora.css` + `blora.js` + 全局 `Blora.init()`。

日常用法看 [`guide.md`](./guide.md)，1.x 对照看 [`migration/v1-to-v2.md`](./migration/v1-to-v2.md)。交互真值在 `examples/showcase-v2/`。契约在 `packages/blora-design/contracts/`。进度在 [`refactor/remaining-work.md`](./refactor/remaining-work.md)。

---

## 包

```bash
pnpm add @bloret-crew/blora-design
```

| 入口 | 作用 |
|------|------|
| `@bloret-crew/blora-design` | 无副作用 API：`t`、`setLocale`、CE 定义函数、table/form 等 headless |
| `@bloret-crew/blora-design/auto` | 注册默认 Composite CE 面 |
| `@bloret-crew/blora-design/blora.css` | token + foundations + 组件 CSS 的 `@import` 壳 |
| `@bloret-crew/blora-design/blora.global.js` | CDN / IIFE，`globalThis.Blora` |

Add-on（按需）：`markdown`、`thread`、`qrcode`、`effects`、`layout`、`theming`。包名一律 `@bloret-crew/blora-design-*`。

---

## 结构约定

1. **展示型**用原生 HTML + `blora-*` class（Button、Tag、Card）。
2. **结构敏感**用 Composite CE（Select、Dialog、Drawer、Tabs、Datepicker…）。CE 在 light DOM 里生成官方 BEM 树，再绑内部 controller。
3. **开放数据**仍走 headless：`createTableController`、`createFormController`。业务拥有表格/表单 DOM。
4. 不要手写已迁 CE 的内部节点树。不要用 `innerHTML` 灌用户内容。

形态决策见 ADR-015（`docs/refactor/decisions.md`）。表单关联（`ElementInternals`）已在 Select、Switch、Checkbox、Number Input 上启用；其它 light-DOM 表单控件仍通过内部原生 `input` 参与提交。

---

## 浮层

Dialog、Command、Tour、Drawer、图片预览走 `OverlayController`：模态栈、Escape、焦点陷阱（含 shadow 与 slot）、滚动锁。

Dialog / Command / Tour / Drawer 打开时进入 **popover 顶层**，离开动画结束后再 `hidePopover`。Drawer 的 popover 挂在内部 `.blora-drawer` 上（主机是 `display: contents`）。

---

## 语言

组件自己生成的 chrome 走 `t(key)`，目录在 `src/locales/`（`en`、`zh-CN`）。

- `import "@bloret-crew/blora-design/auto"` 会读 `html lang`（`zh*` → `zh-CN`，否则 `en`）。
- `setLocale("en")` 会派发 `blora-locale-change`；已挂载的 CE 会 `sync()` 刷新文案，不必卸掉重挂。
- 页面正文、业务 placeholder 仍由站点自己翻。

```js
import { setLocale, t, registerLocale } from "@bloret-crew/blora-design";
setLocale("en");
t("common.close"); // "Close"
```

---

## 主题

`@bloret-crew/blora-design-theming`：`<blora-palette-picker>`、`<blora-color-scheme-toggle>`，以及 `applyTheme` / `applyColorScheme`。七套主题：coral、indigo、lotus、graphite、mono、circuit、dusk。令牌规范见 [`standards.md`](./standards.md)。

---

## 图标

UI 操作/状态/导航图标一律 `createBloraIcon()`。缺图标先扩图标表，不用 Emoji 或 `×` `›` 冒充。完整 Lucide 集：`@bloret-crew/blora-design/icons-full`。

---

## Add-on

| 包 | 公共面 |
|----|--------|
| layout | `<blora-sidebar-layout>`、`<blora-affix>`、`<blora-anchor>`；`initSmoothScroll` |
| markdown | `<blora-markdown>` + `renderMarkdown()`（默认转义 HTML） |
| qrcode | `<blora-qrcode>` + `buildQRMatrix()` / `renderQRCode()`（byte 模式，版本 1–40） |
| effects | 7 个动效 CE + `textFx` / 快捷键 service |
| thread | `<blora-thread-comment>`、`<blora-thread-composer>` |
| theming | 色板 CE + 主题 service |

---

## 1.x 对照（不要当 2.0 复制）

| 1.x | 2.0 |
|-----|-----|
| `blora.css` + `blora.js` | ESM 包 + 按组件 CSS |
| `Blora.init()` | `auto` 或按需 `defineBlora*` |
| `Blora.toast` | `message` |
| `blora-btn--primary` | `.blora-button[data-variant=primary]` |
| 运行时 compat | **没有**。对照源在仓库外 `legacy/v1/` |

完整映射表：[`migration/v1-to-v2.md`](./migration/v1-to-v2.md)。
