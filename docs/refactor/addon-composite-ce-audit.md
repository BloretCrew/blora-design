# Add-on Composite CE 审查

> 审查日期：2026-08-21  
> 原则：有稳定宿主、稳定内部结构和连接/断开资源的 UI 能力优先使用 Composite CE；纯计算、全局文档策略和必须增强任意既有 DOM 的能力保留 service/controller。

## 结论

| Add-on | 结论 | 推荐边界 | 优先级 |
| --- | --- | --- | --- |
| Thread | 已迁移 | `<blora-thread-comment>`、`<blora-thread-composer>`；Timeline 继续使用核心组件 | 已完成 |
| Theming | 当前混合形态正确 | Palette Picker、Color Scheme Toggle 保持 CE；主题读写保持 service | 无需迁移 |
| QR Code | UI 适合 CE，算法保留纯函数 | `<blora-qrcode>` + `buildQRMatrix()` | P1，编码正确性前置 |
| Effects | 不能整体改成单一 CE，应按能力拆分 | Diff、Hover Gallery、Countdown、Rotate、CountUp、Watermark 优先；Text FX 可保留命令式重播 | P1 |
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

Canvas 宿主与重绘生命周期非常适合 `<blora-qrcode>`，但当前矩阵实现是 beta 简化算法。迁移前必须先证明二维码编码、容量、纠错和扫描正确性。`buildQRMatrix()` 仍应保留纯函数入口。

## Effects

Effects 包包含多种不同能力，不能统一包装成一个元素：

- 强 CE 候选：Image Diff、Hover Gallery、Countdown、Text Rotate。
- 适合 CE：CountUp、Watermark。
- CE + service 双层：Text FX，声明式宿主管理字符拆分和生命周期，命令式 API 用于任意元素重播。
- 保留 service：快捷键平台识别与格式化。

迁移前先补齐 effects contract，目前 contract 未完整登记实际公开能力。

## Layout

- Sidebar Layout 已经是 Composite CE，保持现状。
- Affix 有明确宿主和滚动监听生命周期，可迁为 `<blora-affix>`。
- Anchor 与 ScrollSpy 行为重叠，应先合并公共设计，再决定使用一个带 `sync-hash` 的 CE，避免两个重复组件。
- Smooth Scroll 是 Document 级策略，没有稳定单一宿主，必须保持 service。

## Markdown

`renderMarkdown()` 是可用于 SSR、预览和字符串处理的纯函数，不能被 CE 取代。可新增 `<blora-markdown>` 作为安全默认的声明式宿主，但必须先收紧并记录 raw HTML、安全策略和 source 生命周期。

## 推荐后续顺序

1. QR Code 编码正确性审查，之后迁 `<blora-qrcode>`。
2. Effects：Diff、Hover Gallery、Countdown、Rotate。
3. Effects：CountUp、Watermark、Text FX。
4. Layout：Affix，并统一设计 Anchor/ScrollSpy。
5. Markdown：安全 contract 完成后增加便利 CE。
6. Theming 不做结构重写，只补 contract 真值。
