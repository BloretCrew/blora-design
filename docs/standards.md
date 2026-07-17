# Blora Design · UI 设计规范

> Blora Design 是一套令牌驱动的 Web UI 设计规范。本文是设计者与工程师共同的唯一信源（Single Source of Truth）。

---

## 一 · 设计哲学

Blora 把界面拆成三个色根：**底色、文字、主色**，并由此推导出三条根原则。

### 1.1 三根 · The Three Roots

| 根 | 含 | 在界面中的体现 |
|----|----|----------------|
| **底** | 沉稳之底 | 背景取暖白 `#F8F4EC`，纹理以肉眼几乎不可见的颗粒叠加 |
| **墨** | 结构之骨 | 文字与边框以多级灰度分层，替代纯黑纯灰 |
| **章** | 点睛之笔 | 唯一的强调色为印泥红 `#A0392E`（命名 `--blora-seal`），仅用于主操作与激活态 |

一句话：**底色为底，文字为骨，主色为眼。**

### 1.2 六原则 · The Six Principles

1. **间距优先** — 间距宁大勿挤。组件内边距 ≥ 16px，分组之间 ≥ 32px。
2. **节制用色** — 画面约 90% 为底色与文字色，主色 ≤ 5%，余者为状态语义。
3. **圆角温润** — 默认 8px，不锋利亦不过圆。容器 12–20px，按钮恒 8px。
4. **动效含蓄** — 缓动以 `cubic-bezier(.22,.61,.36,1)` 为主，时长 140–420ms，不弹跳过度。
5. **字体分明** — 标题用衬线、正文用无衬线、代码用等宽，各司其职。
6. **触手可及** — 所有交互元素 ≥ 40×40，对比度满足 WCAG AA，支持键盘与 reduced-motion。

---

## 二 · 色彩系统

色板分三层：**底色（背景）、文字（文本与边框）、彩（强调与状态）**。彩为宾，墨为主。

### 2.1 底 · Paper

| Token | Hex | 用途 |
|------|-----|------|
| `--blora-paper` | `#F8F4EC` | 页面底色 |
| `--blora-paper-warm` | `#F2ECDE` | 暖纸 · 营造温度 |
| `--blora-paper-cool` | `#F5F1E8` | 冷纸 · 中性 |
| `--blora-paper-deep` | `#E6DFCC` | 深纸 · 沉底 |
| `--blora-surface-1` | `#FBF8F0` | 卡面/输入框 |
| `--blora-surface-2` | `#F2EEE2` | 次级面 — hover/分组 |
| `--blora-surface-3` | `#E9E3D2` | 三级面 — 禁用/轨道 |

### 2.2 墨 · Ink（多级灰度）

文字色自深至浅逐级递进，覆盖从主标题到禁用文本的全部层级：

| 层级 | Token | Hex | 用途 |
|------|-------|-----|------|
| 焦 | `--blora-ink` | `#1C1A17` | 主标题/极强文本 |
| 浓 | `--blora-ink-deep` | `#2D2A24` | 标题 |
| 重 | `--blora-ink-mid` | `#4A453D` | 强调正文 |
| 淡 | `--blora-ink-light` | `#6B6358` | 正文 |
| 清 | `--blora-ink-mist` | `#9B9489` | 次要文本（仅装饰，不满足正文对比度） |
| 远山 | `--blora-ink-faint` | `#B8B0A2` | 禁用/占位 |
| 雾 | `--blora-ink-ghost` | `#D8D2C4` | 边框/分隔 |

**铁律：单屏画面中，最深墨色面积 ≤ 5%，淡墨为常态。**

### 2.3 彩 · Accents

| Token | Hex | 语义 |
|------|-----|------|
| `--blora-seal` | `#A0392E` | 印泥红 — **唯一主强调色** |
| `--blora-seal-deep` | `#7E2A22` | 深印 — hover/press |
| `--blora-cinnabar` | `#C44536` | 朱砂 — 高亮 |
| `--blora-tea` | `#8B6F47` | 茶色 — 次强调 |
| `--blora-indigo` | `#3D4A5C` | 黛青 — 信息 |
| `--blora-moss` | `#5A7B6B` | 山青 — 成功 |
| `--blora-bamboo` | `#7B9B7E` | 竹青 — 辅助成功 |
| `--blora-gold` | `#B89968` | 赭石 — 警告 |
| `--blora-ochre` | `#D4A574` | 黄土 — 装饰 |

### 2.4 状态映射

| 状态 | 色 |
|------|----|
| 成功 success | `--blora-moss` |
| 警告 warning | `--blora-gold` |
| 危险 danger  | `--blora-seal` |
| 信息 info    | `--blora-indigo` |

### 2.5 用色比例

> **90 / 5 / 5 法则**：纸墨占 90%，印泥占 ≤ 5%，其余色彩占 ≤ 5%。任何违反此比例的设计都需复审。

---

## 三 · 字体系统

### 3.1 三套字族

| 字族 | Token | 用途 |
|------|-------|------|
| 衬线 | `--blora-font-serif` | 标题、品牌、印章、数字大字 |
| 无衬线 | `--blora-font-sans` | 正文、按钮、表单、UI 文字 |
| 等宽 | `--blora-font-mono` | 代码、数据、技术标签 |
| 楷书 | `--blora-font-brush` | 装饰性题字，仅用于非交互文案 |

> 优先加载 `Noto Serif SC` / `Noto Sans SC` / `JetBrains Mono`；降级到系统宋体、苹方、微软雅黑。

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
- **字距**：标题 `-0.02em ~ -0.01em`（紧致）；正文 `0`；大写标签 `+0.18em`。

### 3.4 行高

- `--blora-leading-tight: 1.25` — 标题
- `--blora-leading-normal: 1.6` — 正文
- `--blora-leading-loose: 1.85` — 长文/引文

---

## 四 · 间距与留白

> 间距不是空白，是气的回旋。Blora 采用 12 级非线性间距：

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

**节奏律**：相邻元素用 2/3/4；分组用 5/6；区块用 8/9。

---

## 五 · 圆角、边框、阴影

### 5.1 圆角 · Radius

| Token | 值 | 用途 |
|-------|----|------|
| `--blora-radius-xs` | 2px | 标签/小方块 |
| `--blora-radius-sm` | 4px | 输入/小按钮 |
| `--blora-radius-md` | 8px | **按钮/输入默认** |
| `--blora-radius-lg` | 12px | 卡面 |
| `--blora-radius-xl` | 20px | 面板/模态 |
| `--blora-radius-2xl` | 32px | 大面板 |
| `--blora-radius-full` | 9999px | 胶囊/圆形 |

### 5.2 边框 · Border

- 默认边框：`1px solid var(--blora-ink-ghost)`
- 强调边框：`1px solid var(--blora-ink-mist)`
- 印泥边框：`1px solid var(--blora-seal)`
- 虚线分隔：`border-top: 1px dashed var(--blora-ink-mist)`

### 5.3 阴影 · Shadow

四级 + 两特殊。所有阴影低不透明度，呈"纸上浮起"而非"空中悬停"。

| Token | 用途 |
|-------|------|
| `--blora-shadow-1` | 1px 浮起 — 列表项 |
| `--blora-shadow-2` | 卡面默认 |
| `--blora-shadow-3` | 浮层（popover/dropdown） |
| `--blora-shadow-4` | 模态/抽屉 |
| `--blora-shadow-inset` | 内凹 — 嵌套容器 |
| `--blora-shadow-seal` | 主色光晕 — 主按钮/标识 |

---

## 六 · 纹理与装饰

### 6.1 纸纹 · Paper Grain

`--blora-grain` 由三层径向渐变叠加于 `body`：
- 茶色微点于左上
- 印泥微点于右下
- 黛青微点于底部

肉眼几乎不可见，仅作微妙的质感铺垫。**禁止在组件内部叠加纸纹**，仅 `body` 一处。

### 6.2 飞白分隔 · Brush Divider

`.blora-brush` — 自淡至浓再至淡的渐变线，中央落一主色圆点。用于章节之间的分隔。

### 6.3 墨晕 · Ink Wash

`.blora-ink-wash` / `.blora-seal-wash` — 径向渐变模拟的晕染效果。用于装饰性背景块。

### 6.4 图片灰度滤镜

- `.blora-inkify` — 轻度：`grayscale(.4) sepia(.18)`
- `.blora-inkify-strong` — 重度：`grayscale(.85) sepia(.3)`

---

## 七 · 动效

### 7.1 缓动 · Easing

| Token | 曲线 | 用途 |
|-------|------|------|
| `--blora-ease` | `cubic-bezier(.22,.61,.36,1)` | **默认** — 含蓄出入 |
| `--blora-ease-soft` | `cubic-bezier(.4,0,.2,1)` | 柔和 |
| `--blora-ease-overshoot` | `cubic-bezier(.34,1.56,.64,1)` | 微弹 — 仅 FAB/Toast |

### 7.2 时长 · Duration

| Token | 时长 | 用途 |
|-------|------|------|
| `--blora-dur-fast` | 140ms | 颜色/边框/hover |
| `--blora-dur-base` | 240ms | 位移/显隐默认 |
| `--blora-dur-slow` | 420ms | 抽屉/折叠 |
| `--blora-dur-ink` | 700ms | 长叙事动画 |

### 7.3 标志动效

- **圆点加载** `.blora-ink-loading` / `.blora-dot-loading` — 四个圆点依次跳动，最后一个为主色。
- **FAB 浮起** FAB hover 时 `scale(1.12)`，主色按钮的悬停浮起。
- **状态点呼吸** `.blora-dot--pulse` — 在线状态的 2s 呼吸。

### 7.4 reduced-motion

一切动画在 `prefers-reduced-motion: reduce` 下降级至 0.01ms。**强制要求**。

---

## 八 · 图标规范

- **风格**：线性、`stroke-width: 2`、圆端圆角（`stroke-linecap: round`）。
- **尺寸**：默认 22px，按钮内 16–18px，导航 20px。
- **颜色**：继承 `currentColor`，默认墨色，hover/active 转印泥。
- **引入方式**：推荐内联 SVG，或自建图标字体。不绑定第三方库。

---

## 九 · 可访问性 · Accessibility

### 9.1 对比度

所有正文与背景对比度 ≥ **4.5:1**（WCAG AA）；大字 ≥ 3:1。已验证：
- `ink-mid #4A453D` / `paper #F8F4EC` ≈ 8.9:1 ✓
- `ink-light #6B6358` / `paper` ≈ 5.6:1 ✓
- `seal #A0392E` / `paper` ≈ 6.4:1 ✓
- `ink-mist #9B9489` / `paper` ≈ 3.0:1 — **仅用于非文本装饰**

### 9.2 焦点

`:focus-visible` 一律 `outline: 2px solid var(--blora-seal); outline-offset: 2px;` 不移除。

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

加 `.blora-dark` 于 `<html>` 即可。Token 自动重映射：

- 底色 → 深夜色 `#1B1916`
- 文字色 → 月白 `#F0EBDE`
- 主色（`--blora-seal`）保持，必要时提高对比边

**不另写组件样式**，所有组件通过 token 自动适配。

---

## 十一 · 内容与文案

Blora 的文案风格与视觉一致——克制、清晰、不卖弄。

- **标题**：简洁直白，避免堆砌修饰。
- **正文**：现代白话，表达清楚为先。古风表达仅用于装饰性引文（`.blora-quote`）。
- **按钮**：动词 + 宾语，2–4 字为佳。"保存""新建"优于文学化的表达。
- **空状态**：用"暂无数据"等通用表达即可，配合辅助操作的清晰指引。
- **错误**：陈述事实 + 给出下一步，不指责用户。

---

## 十二 · 设计交付清单

设计稿交付前，逐项核对：

- [ ] 色板仅取自 token，无自定义色
- [ ] 主色面积 ≤ 5%
- [ ] 字体仅用三族，字阶仅取自 token
- [ ] 间距取自 12 级，无任意值
- [ ] 圆角取自 token，按钮恒 8px
- [ ] 阴影 ≤ shadow-4，无重投影
- [ ] 动效时长在 token 范围内
- [ ] 焦点态、禁用态、hover 态、error 态四态齐全
- [ ] 暗色模式可读
- [ ] 移动端 ≥ 320px 不破版

---

> 主色克制，全局皆亮。
