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
| Layout | 当前混合方向正确 | Sidebar 已是 CE；Affix 可迁；Anchor/ScrollSpy 需合并设计；Smooth Scroll 保留 service | P2 |
| Markdown | 纯渲染器必须保留 service | 可增加安全默认的 `<blora-markdown>` 便利宿主，`renderMarkdown()` 保留 | P2 |

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

注意：当前矩阵实现仍是 beta 简化编码器（固定版本、输入截断），生产级扫描场景需自行验证，正式发布前应替换为完整编码器或引入成熟实现。

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

- Sidebar Layout 已经是 Composite CE，保持现状。
- Affix 有明确宿主和滚动监听生命周期，可迁为 `<blora-affix>`。
- Anchor 与 ScrollSpy 行为重叠，应先合并公共设计，再决定使用一个带 `sync-hash` 的 CE，避免两个重复组件。
- Smooth Scroll 是 Document 级策略，没有稳定单一宿主，必须保持 service。

## Markdown

`renderMarkdown()` 是可用于 SSR、预览和字符串处理的纯函数，不能被 CE 取代。可新增 `<blora-markdown>` 作为安全默认的声明式宿主，但必须先收紧并记录 raw HTML、安全策略和 source 生命周期。

## 推荐后续顺序

1. Layout：Affix，并统一设计 Anchor/ScrollSpy。
2. Markdown：安全 contract 完成后增加便利 CE。
3. Theming 不做结构重写，只补 contract 真值。
4. QR Code 编码正确性在正式发布前收口。
