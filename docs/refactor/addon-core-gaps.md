# Add-on / 核心拆分进度对照

> 最近更新：2026-08-02 — **Phase 9 收口完成**（含 Table 行选文档对齐）

## 决策

| 项 | 决策 |
|---|---|
| **Deck / Speed Dial / Mega Menu** | 留在核心包 |
| **Text Rotate / Countdown / …** | effects 包 |
| **Sidebar / Affix / Anchor / …** | layout 包 |
| **Palette / scheme** | theming 包 |

## 一、Add-on 包（Phase 9 ✅）

| 包 | 状态 | 说明 |
|---|---|---|
| `@bloret-crew/blora-design-thread` | ✅ | controller + Story + 单测 |
| `@bloret-crew/blora-design-markdown` | ✅ | render + DOM init + Story + 单测 |
| `@bloret-crew/blora-design-qrcode` | ✅ | canvas render + init + Story + 单测 |
| `@bloret-crew/blora-design-effects` | ✅ | textFx + extras controllers + Stories + 单测 |
| `@bloret-crew/blora-design-layout` | ✅ | sidebar/affix/anchor/smooth-scroll + Stories + 单测 |
| `@bloret-crew/blora-design-theming` | ✅ | palette + applyColorScheme + Story + 单测 |

## 二、曾列「偏薄 / 缺 v1 对等」— 已补

| 项 | API | 测试 |
|----|-----|------|
| Tree Select | `createTreeSelectController` | `tests/v1-gaps.test.ts` |
| Form validate | `createFormController` | 同上 |
| BackTop | `createBackTopController` | 同上 |
| Image preview | `openImagePreview` | 同上 |
| Notification 多位置 | `notify({ placement })` | 同上 |
| Table 分页 | `createTableController` + pageSize | 同上 |
| Table 列设置 | `data-blora-cols` + `setColumnVisible` / 拖拽排序 | 同上 |
| Table 虚拟滚动 | `data-blora-virtual` + `setRows`；`data-virtual-axis=y\|x\|both` | 同上 |
| Table **内置行选** | `data-blora-selectable` + `getSelectedRows` / `clearSelection` / `blora-table-select`（注入 `blora-checkbox`，业务不拼列） | 同上 |

## 三、CSS-only 决议

见 **`docs/refactor/css-only-resolution.md`**。

## 四、DoD

- Phase 9：文档真值 + 单测 + typecheck
- 全量 Playwright / axe / 视觉基线矩阵 → **Phase 10**

## 五、使用提示（2.0）

```ts
import {
  createTreeSelectController,
  createFormController,
  createTableController,
  notify,
  openImagePreview,
} from "@bloret-crew/blora-design";
import { renderMarkdown, initMarkdown } from "@bloret-crew/blora-design-markdown";
import { renderQRCode } from "@bloret-crew/blora-design-qrcode";
import { textFx, createCountdownController } from "@bloret-crew/blora-design-effects";
import { createSidebarLayoutController } from "@bloret-crew/blora-design-layout";
import { applyTheme, applyColorScheme } from "@bloret-crew/blora-design-theming";
```
