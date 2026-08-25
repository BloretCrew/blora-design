# Add-on Composite CE 审查

> 审查日期：2026-08-21  
> 原则：有稳定宿主、稳定内部结构和连接/断开资源的 UI 能力优先使用 Composite CE；纯计算、全局文档策略和必须增强任意既有 DOM 的能力保留 service/controller。

## 结论

| Add-on | 结论 | 推荐边界 | 优先级 |
| --- | --- | --- | --- |
| Thread | 已迁移 | `<blora-thread-comment>`、`<blora-thread-composer>`；Timeline 继续使用核心组件 | 已完成 |
| Theming | 当前混合形态正确 | Palette Picker、Color Scheme Toggle 保持 CE；主题读写保持 service | 无需迁移 |
| QR Code | 已迁移 | `<blora-qrcode>` + `buildQRMatrix()` / `renderQRCode()` 纯函数保留 | 已完成 |
| Effects | 已按能力拆分迁移 | 7 个 CE + `textFx()` 重播 service + 快捷键 service | 已完成 |
| Layout | 已迁 Affix / Anchor | Sidebar + Affix + Anchor（`sync-hash` 合并 ScrollSpy）；Smooth Scroll 保留 service | 已完成 |
| Markdown | 已迁宿主 | `<blora-markdown>` + `renderMarkdown()` 纯函数保留 | 已完成 |

## Thread

Thread 已从根 Headless controller 改为两个开放 Composite CE：

- `<blora-thread-comment>`：评论卡片、单条长内容折叠、可选反应状态。
- `<blora-thread-composer>`：开放工具栏、输入/预览容器、操作区和编辑/预览切换。

评论顺序、连线与节点继续由核心 `<blora-timeline>` 负责。作者、头像、徽章、工具按钮、提交和预览渲染继续由消费者负责。

## Theming

当前已经是合理的双层结构：

- UI：`<blora-palette-picker>`、`<blora-color-scheme-toggle>`。
- 全局服务：`applyTheme()`、`applyColorScheme()`、存储启动与读取。

不应建立仅用于包装全局状态的伪 Theme Provider。

## QR Code

已迁移为 `<blora-qrcode>`：连接时渲染，`value`、`size`、`label` 变化时重绘，`label` 写入 `role="img"` 与 `aria-label`。`buildQRMatrix()` 与 `renderQRCode()` 保留为纯函数/命令式入口，供 SSR 或自定义宿主使用。

编码器覆盖版本 1–40、L/M/Q/H（默认 M），自动选择 numeric / alphanumeric / byte / kanji 分段并以 DP 做位数最优打包；可选 ECI。超出版本 40 容量时抛 `QR_TOO_LONG`。

## Effects

已按能力拆分为 7 个 Composite CE：

- `<blora-text-fx>`：声明式文字动效；`textFx()` 保留为任意元素重播的命令式入口。
- `<blora-text-rotate>`：子元素自动成为轮换项。
- `<blora-countdown>`：自动生成四个单位，完成时派发 `blora:complete`。
- `<blora-count-up>`：进入视口后播放。
- `<blora-diff>`：消费者提供 `blora-diff-before` / `blora-diff-after` 两个 pane，CE 生成 divider 与 range。
- `<blora-hover-gallery>`：子元素自动包装为 item，CE 生成 track 与进度点。
- `<blora-watermark>`：生成 `aria-hidden` 平铺层。

快捷键平台识别与格式化保留 service（`initShortcutHints()`、`formatShortcut()`）。

## Layout

- Sidebar Layout、`<blora-affix>`、`<blora-anchor>` 已是 Composite CE。
- Anchor 的 `sync-hash` 承担原 ScrollSpy 写 hash 的职责。
- Smooth Scroll 仍是 Document 级 service。

## Markdown

`<blora-markdown>` 已交付。源来自 `source` 属性或子级 `script[type=text/markdown]`。默认转义 HTML；`allow-html` 才放行原文。`renderMarkdown()` 仍用于 SSR 和字符串处理。

## 推荐后续顺序

1. Theming 只补 contract 真值，不做结构重写。
2. RC 前在 Linux 补 Firefox / WebKit 实测附录。
