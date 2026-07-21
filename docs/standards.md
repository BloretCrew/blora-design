# Blora Design · UI 设计规范

> Blora Design 是一套令牌驱动的 Web UI 设计规范。本文是设计者与工程师共同的唯一信源（Single Source of Truth）。

---

## 一 · 设计原则

Blora 将视觉令牌分为三个基础层：**背景与表面、内容、交互与状态**。组件只消费语义令牌，不依赖具体颜色名称。

### 1.1 三层模型 · Three-Layer Model

| 层 | 职责 | 在界面中的体现 |
|----|------|----------------|
| **背景与表面** | 建立页面层级 | 页面背景使用 `--blora-background`，容器按 `--blora-surface-1..3` 递进 |
| **内容** | 承载文本与结构 | 文本和边框按强度使用 `--blora-text-*` 与 `--blora-border-subtle` |
| **交互与状态** | 表达操作和反馈 | 主操作使用 `--blora-primary`，成功、警告、危险和信息使用对应功能色 |

具体色值由配色系统映射；组件结构、交互和可访问性不随配色变化。

### 1.2 六原则 · The Six Principles

1. **空间有序** — 组件内边距默认 ≥ 16px，分组间距默认 ≥ 32px，并统一取自间距令牌。
2. **节制用色** — 画面约 90% 为底色与文字色，主色 ≤ 5%，余者为状态语义。
3. **曲率连续** — 基础圆角从 6px 到 36px 平滑递进，表单控件优先使用胶囊曲率。
4. **动效克制** — 缓动以 `cubic-bezier(.25,.8,.25,1)` 为主，常规时长 160–420ms，避免无意义位移。
5. **字体统一** — 标题与正文共享现代无衬线骨架，代码使用等宽字体，各司其职。
6. **默认可访问** — 所有交互元素 ≥ 40×40，对比度满足 WCAG AA，支持键盘与 reduced-motion。

---

## 二 · 色彩系统

色板分三层：**背景与表面、文本与边框、功能色**。功能色只表达交互层级与状态，不承担装饰。

### 2.1 背景与表面 · Background & Surfaces

| Token | Hex | 用途 |
|------|-----|------|
| `--blora-background` | `#F7F6F8` | 页面底色 |
| `--blora-surface-1` | `#FFFFFF` | 卡面/输入框 |
| `--blora-surface-2` | `#F0EEF2` | 次级面 — hover/分组 |
| `--blora-surface-3` | `#E4E1E7` | 三级面 — 禁用/轨道 |

### 2.2 文本与边框 · Text & Border

文字色自深至浅逐级递进，覆盖从主标题到禁用文本的全部层级：

| 层级 | Token | Hex | 用途 |
|------|-------|-----|------|
| Strong | `--blora-text-strong` | `#1D1B20` | 品牌、大标题和高强调数字 |
| Foreground | `--blora-foreground` | `#2C2930` | 标题和默认高强调文本 |
| Emphasis | `--blora-text-emphasis` | `#4B4750` | 强调正文 |
| Muted | `--blora-text-muted` | `#716C76` | 正文和辅助说明 |
| Subtle | `--blora-text-subtle` | `#9A949F` | 非关键说明（不用于小号正文） |
| Disabled | `--blora-text-disabled` | `#B7B1BB` | 禁用和占位文本 |
| Border | `--blora-border-subtle` | `#D6D1D9` | 边框和分隔线 |

高强调文本用于建立层级，不应用作大面积填充。

### 2.3 功能色 · Functional Accents

| Token | Hex | 语义 |
|------|-----|------|
| `--blora-primary` | `#675F78` | **唯一主强调色** |
| `--blora-primary-hover` | `#514A61` | 主色 hover/press |
| `--blora-danger` | `#995F68` | 危险与错误 |
| `--blora-accent-neutral` | `#6D6977` | 中性强调 |
| `--blora-info` | `#586A83` | 信息 |
| `--blora-success` | `#5D746C` | 成功 |
| `--blora-support` | `#70807C` | 辅助数据系列 |
| `--blora-warning` | `#806C4F` | 警告 |
| `--blora-accent-secondary` | `#7E6B7A` | 次强调/数据系列 |

### 2.4 状态映射

| 状态 | 色 |
|------|----|
| 成功 success | `--blora-success` / `#5D746C` |
| 警告 warning | `--blora-warning` / `#806C4F` |
| 危险 danger  | `--blora-danger` / `#995F68` |
| 信息 info    | `--blora-info` / `#586A83` |

### 2.5 用色比例

> **90 / 5 / 5 法则**：底色与文字占 90%，主色占 ≤ 5%，状态色占 ≤ 5%。任何违反此比例的设计都需复审。

---

## 三 · 字体系统

### 3.1 字族

| 字族 | Token | 用途 |
|------|-------|------|
| 展示无衬线 | `--blora-font-heading` | 标题、品牌、数字大字 |
| UI 无衬线 | `--blora-font-sans` | 正文、按钮、表单、UI 文字 |
| 等宽 | `--blora-font-mono` | 代码、数据、技术标签 |

> 展示与 UI 字体统一采用 `Avenir / Avenir Next`，依次降级至 `Segoe UI / Noto Sans SC / sans-serif`；代码采用 `JetBrains Mono` 等宽栈。

### 3.2 字阶 · Type Scale

以 1.25 倍率递进（Major Third）：

| Token | size | 行高 | 用途 |
|-------|------|------|------|
| `--blora-text-xs`   | 12px | 1.6 | 辅助/标签 |
| `--blora-text-sm`   | 14px | 1.6 | 次要/按钮 |
| `--blora-text-base` | 16px | 1.6 | **正文基准** |
| `--blora-text-lg`   | 18px | 1.85 | 引文/小标题 |
| `--blora-text-xl`   | 22px | 1.4 | h4 |
| `--blora-text-2xl`  | 28px | 1.3 | h3 |
| `--blora-text-3xl`  | 36px | 1.25 | h2 |
| `--blora-text-4xl`  | 48px | 1.2 | h1 |
| `--blora-text-5xl`  | 64px | 1.1 | 英雄 |

### 3.3 字重与字距

- **字重**：默认 400，强调 500，标题 600，英雄 700。不使用 300。
- **字距**：标题与正文均为 `0`；仅全大写短标签可使用 `+0.18em`。

### 3.4 行高

- `--blora-leading-tight: 1.25` — 标题
- `--blora-leading-normal: 1.6` — 正文
- `--blora-leading-loose: 1.85` — 长文/引文

---

## 四 · 间距系统

Blora 采用 12 级非线性间距，组件与布局必须优先使用对应令牌：

| Token | rem | px | 典型用途 |
|-------|-----|----|----------|
| `--blora-space-0` | 0 | 0 | — |
| `--blora-space-1` | 0.25 | 4 | 图标内距/紧致间距 |
| `--blora-space-2` | 0.5 | 8 | 行内元素 |
| `--blora-space-3` | 0.75 | 12 | 小组件内距 |
| `--blora-space-4` | 1 | 16 | **默认组件内距** |
| `--blora-space-5` | 1.5 | 24 | 卡面内距/字段间距 |
| `--blora-space-6` | 2 | 32 | 分组之间 |
| `--blora-space-7` | 2.5 | 40 | 面板内距 |
| `--blora-space-8` | 3 | 48 | 区块之间 |
| `--blora-space-9` | 4 | 64 | 大段落 |
| `--blora-space-10` | 5 | 80 | 英雄区上下 |
| `--blora-space-11` | 6 | 96 | — |
| `--blora-space-12` | 8 | 128 | 顶层分隔 |

**使用规则**：相邻元素用 2/3/4；分组用 5/6；区块用 8/9。

---

## 五 · 圆角、边框、阴影

### 5.1 圆角 · Radius

| Token | 值 | 用途 |
|-------|----|------|
| `--blora-radius-xs` | 6px | 标签/小方块 |
| `--blora-radius-sm` | 10px | 紧凑控件 |
| `--blora-radius-md` | 14px | 卡面/常规容器 |
| `--blora-radius-lg` | 18px | 浮层/卡面 |
| `--blora-radius-xl` | 26px | 面板/模态 |
| `--blora-radius-2xl` | 36px | 大面板 |
| `--blora-radius-full` | 9999px | 胶囊/圆形 |

表单控件默认使用 `--blora-control-radius: var(--blora-radius-full)`；局部组件按层级选用上表曲率。

### 5.2 边框 · Border

- 默认边框：`1px solid var(--blora-border-subtle)`
- 强调边框：`1px solid var(--blora-text-subtle)`
- 主色边框：`1px solid var(--blora-primary)`
- 虚线分隔：`border-top: 1px dashed var(--blora-text-subtle)`

### 5.3 阴影 · Shadow

四级 + 两特殊。所有阴影保持低不透明度，形成柔和的现代层级。

| Token | 用途 |
|-------|------|
| `--blora-shadow-1` | 1px 浮起 — 列表项 |
| `--blora-shadow-2` | 卡面默认 |
| `--blora-shadow-3` | 浮层（popover/dropdown） |
| `--blora-shadow-4` | 模态/抽屉 |
| `--blora-shadow-inset` | 内凹 — 嵌套容器 |
| `--blora-shadow-primary` | 主色光晕 — 主按钮/标识 |

---

## 六 · 表面与媒体

### 6.1 表面纹理 · Surface Texture

`--blora-background-texture` 与 `--blora-background-overlay` 默认均为 `none`，Blora 基础表面保持纯净。产品可以覆盖这两个令牌增加低对比纹理，但禁止在单个组件内部硬编码装饰背景。

### 6.2 分隔线 · Divider

`.blora-divider` 提供默认、虚线和带文本三种结构化分隔方式。颜色、间距和边框均从语义令牌派生。

### 6.3 图片色调 · Image Tone

- `.blora-image-muted` — 降低饱和度并轻微收敛对比度：`saturate(.6) contrast(.96)`
- `.blora-image-monochrome` — 完全灰度并保留结构对比：`grayscale(1) contrast(1.02)`

---

## 七 · 动效

### 7.1 缓动 · Easing

| Token | 曲线 | 用途 |
|-------|------|------|
| `--blora-ease` | `cubic-bezier(.25,.8,.25,1)` | **默认** — 柔和快速收束 |
| `--blora-ease-soft` | `cubic-bezier(.4,0,.2,1)` | 柔和 |
| `--blora-ease-overshoot` | `cubic-bezier(.34,1.56,.64,1)` | 微弹 — 仅 FAB/Toast |

### 7.2 时长 · Duration

| Token | 时长 | 用途 |
|-------|------|------|
| `--blora-dur-fast` | 160ms | 颜色/边框/hover |
| `--blora-dur-base` | 260ms | 位移/显隐默认 |
| `--blora-dur-slow` | 420ms | 抽屉/折叠 |
| `--blora-dur-emphasis` | 700ms | 需要额外关注的强调动画 |

### 7.3 组件动效

- **FAB 浮起** FAB hover 时 `scale(1.12)`，主色按钮的悬停浮起。
- **状态点呼吸** `.blora-dot--pulse` — 在线状态的 2s 呼吸。

### 7.4 reduced-motion

一切动画在 `prefers-reduced-motion: reduce` 下降级至 0.01ms。**强制要求**。

---

## 八 · 图标规范

- **风格**：线性、`stroke-width: 2`、圆端圆角（`stroke-linecap: round`）。
- **尺寸**：默认 22px，按钮内 16–18px，导航 20px。
- **颜色**：继承 `currentColor`，hover/active 状态按组件规则使用主色。
- **引入方式**：推荐内联 SVG，或自建图标字体。不绑定第三方库。

---

## 九 · 可访问性 · Accessibility

### 9.1 对比度

所有正文与背景对比度 ≥ **4.5:1**（WCAG AA）；大字 ≥ 3:1。已验证：
- `text-emphasis #4B4750` / `background #F7F6F8` ≈ 8.42:1 ✓
- `text-muted #716C76` / `background` ≈ 4.74:1 ✓
- `primary #675F78` / `background` ≈ 5.59:1 ✓
- `text-subtle #9A949F` / `background` ≈ 2.74:1 — **仅用于非文本装饰或大号辅助内容**

### 9.2 焦点

`:focus-visible` 一律 `outline: 2px solid var(--blora-primary); outline-offset: 2px;` 不移除。

### 9.3 触摸目标

可点击元素 ≥ 40×40px。移动端建议 ≥ 44×44。

### 9.4 键盘

- 模态 / 抽屉 / 命令面板：`Esc` 关闭；打开时焦点移入浮层、关闭后归还；`Tab` 圈禁于浮层内
- 命令面板 `Ctrl/⌘ + K` 唤起
- 标签页：方向键 / Home / End 切换；树：`Enter` / `Space` 展开与选中（`role` 与 `aria-*` 由 blora.js 自动注入）
- 复选 / 单选 / 开关 / 滑块以原生 input 为底，天然键盘可达
- 自定义下拉已支持方向键、Home/End、Enter/Space 与 Esc；分页、分段、评分、范围滑块的完整键盘化仍在路线图中，正式项目请暂以原生控件兜底

### 9.5 动效降级

见 7.4。

---

## 十 · 暗色模式

Blora 支持浅色、深色和跟随系统三种模式。业务层优先使用 `Blora.applyColorMode('light' | 'dark' | 'system')`；`system` 根据 `prefers-color-scheme` 实时更新，框架内部通过 `<html class="blora-dark">` 表示当前有效暗色状态。Token 自动重映射：

- 背景 → 深紫灰 `#151317`
- 文字色 → 冷白 `#F5F2F6`
- 主色 → 提亮低饱和紫 `#A9A1BA`

**不另写组件样式**，所有组件通过 token 自动适配。

---

## 十一 · 内容与文案

Blora 的文案风格应克制、清晰、直接。

- **标题**：简洁直白，避免堆砌修饰。
- **正文**：使用现代白话，优先表达任务、状态与下一步操作。
- **按钮**：动词 + 宾语，2–4 字为佳。"保存""新建"优于文学化的表达。
- **空状态**：用"暂无数据"等通用表达即可，配合辅助操作的清晰指引。
- **错误**：陈述事实 + 给出下一步，不指责用户。

---

## 十二 · 设计交付清单

设计稿交付前，逐项核对：

- [ ] 色板仅取自 token，无自定义色
- [ ] 主色面积 ≤ 5%
- [ ] 字体仅取自展示、UI 与等宽字族令牌，字阶仅取自 token
- [ ] 间距取自 12 级，无任意值
- [ ] 圆角取自 token，表单控件遵循统一胶囊曲率
- [ ] 阴影 ≤ shadow-4，无重投影
- [ ] 动效时长在 token 范围内
- [ ] 焦点态、禁用态、hover 态、error 态四态齐全
- [ ] 暗色模式可读
- [ ] 移动端 ≥ 320px 不破版

---

## 十三 · 组件选择与组合

### 13.1 优先使用原生语义

- 输入、选择、文件、开关、Swap、Filter 与 Diff 应保留原生 `input`，自定义视觉不能替换键盘和表单语义。
- Fieldset 必须使用 `<fieldset>` / `<legend>`，Kbd 使用 `<kbd>`，Footer、Hero、Sidebar 优先采用对应语义元素。
- 无原生语义的展开组件由 `blora.js` 同步 `aria-expanded`、焦点与 Esc 行为；业务不重复绑定同一状态。

### 13.2 组件组合边界

- Sidebar Layout 负责应用级页面结构；Drawer 负责临时任务面板，两者不可因外观相似而互换。
- Megamenu 用于多分组全局导航；普通操作集合继续使用 Dropdown。
- Dock 适合 3–5 个高频一级入口；桌面信息密集型应用优先 Navbar 或 Sidebar。
- 搜索提交动作使用 `button.blora-search__icon` 与原生 `form[role="search"]`；输入框聚焦时图标通过 `:focus-within` 跟随主题色。
- Deck 只表现有明确前后顺序的同类对象，不用于隐藏大量可操作内容。

### 13.3 可选视觉效果

- Text Rotate 只用于短句轮换，间隔不低于 1200ms；关键信息必须始终静态可见。
- Browser、Code、Phone、Window Mockup 必须承载真实内容预览，不作为空洞装饰。
- 所有效果必须通过语义令牌取色，并在 `prefers-reduced-motion: reduce` 下静止。

---

> 语义清晰、默认可用、按需扩展。
