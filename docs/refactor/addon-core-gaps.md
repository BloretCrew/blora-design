# Add-on / 核心拆分进度对照

> 对照文档目标与仓库现状。决策与实现进度写在这里，避免 `component-matrix.md` 过时。
>
> 最近更新：2026-08-02

## 决策

| 项 | 决策 |
|---|---|
| **Deck** | **留在核心包**（已有 controller） |
| **Speed Dial** | **留在核心包**（补全行为） |
| **Mega Menu** | **留在核心包**（补全行为） |
| 其余文档标为 Add-on 的组件 | **迁出核心** → effects / layout / theming 包 |

## 一、已有 Add-on 包

| 包 | 状态 | 说明 |
|---|---|---|
| `@bloret-crew/blora-design-thread` | 🔄 较完整 | CSS + controller + Story + 单测；欠 DoD（Playwright / 视觉基线） |
| `@bloret-crew/blora-design-markdown` | 🔄 半成品 | API 有；欠 Story、DOM init、与 Thread 联调 |
| `@bloret-crew/blora-design-qrcode` | 🔄 半成品 | API beta；欠 Story / v1 对等验证 |
| `@bloret-crew/blora-design-effects` | 🔄 扩包中 | 原仅 textFx；现含 text-rotate / countdown / countup / diff / hover-gallery / watermark / shortcuts |
| `@bloret-crew/blora-design-layout` | 🔄 新建 | sidebar / affix / anchor / scroll-spy / smooth-scroll |
| `@bloret-crew/blora-design-theming` | 🔄 新建 | palette picker（`data-blora-theme`） |

## 二、文档要求拆 Add-on：去向与状态

### 留在核心（本轮只补行为）

| 组件 | 去向 | 行为状态 |
|---|---|---|
| Deck | 核心 | ✅ controller 已有 |
| Speed Dial | 核心 | ✅ 补全 open/键盘/a11y（v1 对齐） |
| Mega Menu | 核心 | ✅ 补全 open/定位/键盘/互斥（v1 对齐） |

### 迁入 `@bloret-crew/blora-design-effects`

| 组件 | 状态 |
|---|---|
| Text FX | ✅ 原有 `textFx` |
| Text Rotate | ✅ 迁入 + controller |
| Countdown | ✅ 迁入 + controller |
| CountUp | ✅ 迁入 + controller |
| Image Diff | ✅ 迁入 + controller + CSS |
| Hover Gallery | ✅ 迁入 + controller + CSS |
| Watermark | ✅ 迁入 + controller |
| Shortcut Hints | ✅ 迁入 + `formatShortcut` |

### 迁入 `@bloret-crew/blora-design-layout`

| 组件 | 状态 |
|---|---|
| Sidebar Layout | ✅ 迁入 + controller |
| Affix | ✅ 迁入 + controller |
| Anchor | ✅ 迁入 + controller |
| Scroll Spy | ✅ 迁入 + controller |
| Smooth Scroll | ✅ 迁入 `initSmoothScroll` |

### 迁入 `@bloret-crew/blora-design-theming`

| 组件 | 状态 |
|---|---|
| Palette Picker | ✅ 迁入；应用 `data-blora-theme` + localStorage |

## 三、核心包其它债（非本轮「第二节」范围）

仍可能只有 CSS / 行为不齐（不完全列表）：

- 浮层：Tooltip、Popover、Drawer、Pagination 等
- 数据：Table API、Transfer、Tree Select
- 反馈：Toast / Message / Notification 服务
- Form validate、BackTop、Image preview 等

## 四、DoD / 文档债

- 几乎所有组件未勾满 matrix DoD（Playwright、axe、视觉回归、RTL…）
- `component-matrix.md` 与真实进度不同步；**以本文 + `status.md` 为准做对照**
- Phase 10 预发布未开始

## 五、使用提示

```ts
// 核心（Deck / Speed Dial / Megamenu）
import { createDeckController, createSpeedDialController, createMegamenuController } from "@bloret-crew/blora-design";

// Effects
import { textFx, createCountdownController, createTextRotateController } from "@bloret-crew/blora-design-effects";
import "@bloret-crew/blora-design-effects/effects.css";

// Layout
import { createSidebarLayoutController, initSmoothScroll } from "@bloret-crew/blora-design-layout";
import "@bloret-crew/blora-design-layout/layout.css";

// Theming
import { createPalettePickerController, applyTheme } from "@bloret-crew/blora-design-theming";
import "@bloret-crew/blora-design-theming/theming.css";
```
