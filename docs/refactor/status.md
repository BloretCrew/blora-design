# 重构状态

> Blora Design 2.0 重构进度跟踪。每个阶段完成后更新此文件。

## 当前阶段

**Phase 10：Stable 发布** - ✅ **`2.0.0` 已发布，完成最终验收**（stable-core API 已冻结）

> **主跟踪文档**：[`remaining-work.md`](./remaining-work.md)  
> 顺序：**Preflight → Alpha → Beta → RC → Stable**。当前已完成 Stable 发布。

Showcase v2 已完成 87/87 核心组件目录：正式 API/CE 示例、单视图懒挂载、同源 Preview/HTML，以及 manifest、桌面/移动浏览器和代表性视觉门禁。2.0.0 Stable 已完成最终验收。

## 阶段进度

| 阶段 | 状态 | 说明 |
|---|---|---|
| Phase 0：冻结与基线 | ✅ 完成 | 冻结 1.x 行为事实、捕获公共 API、生成视觉基线 |
| Phase 1：Workspace 与门禁 | ✅ 完成 | pnpm workspace、TS strict、lint、test、CI、Showcase、publint |
| Phase 2：Token | ✅ 完成 | DTCG 三层 token、确定性生成器、7 套主题、v1 映射、对比度门禁 |
| Phase 3：Foundations | ✅ 完成 | reset、base、layout、utilities、@layer、RTL、reduced-motion |
| Phase 4：三个试点组件 | ✅ 完成 | Button -> Dialog -> Select |
| Phase 5：核心表单和反馈 | ✅ 完成 | Field/Input/Checkbox/Radio/Switch/Tag/Alert/Badge/Progress/Spinner/Skeleton/Message |
| Phase 6：导航与浮层 | ✅ 完成 | Tabs/Breadcrumb/Pagination/Dropdown/Tooltip/Popover/Drawer/Navbar/Sidebar Navigation |
| Phase 7：数据与内容基础 | ✅ 完成 | Card/Table/List/Accordion/Timeline/Empty/Result/Avatar |
| Phase 8：迁移工具 | ✅ 完成 | Token/class 映射、codemod、migrate:check、fixtures；早期 runtime compat 后续已撤销 |
| Phase 9：Add-ons | ✅ 完成 | 六包 API + Showcase 示例 + 单测；核心 v1 缺口补齐（见 addon-core-gaps.md） |
| Phase 10：预发布 | ✅ Stable 完成 | `2.0.0` 已发布；Firefox/WebKit 87/87、真实 Safari 人工抽测、GitHub Actions、npm/CDN/CSP/SSR/rollback、Stable clean consumer/CDN/CSP/SSR 证据已记录；1.x 不维护、不兼容 |

## Phase 9 收口摘要（2026-08-02）

### Add-on 包

| 包 | API | Story | 单测 |
|----|-----|-------|------|
| thread | `<blora-thread-comment>` / `<blora-thread-composer>` | Data display/Thread | ✅ |
| markdown | `renderMarkdown` / `createMarkdownController` / `initMarkdown` | Data display/Markdown | ✅ |
| qrcode | `<blora-qrcode>` + `renderQRCode` / `buildQRMatrix` service | Data display/QR Code | ✅ |
| effects | 7 个 Composite CE（text-fx/rotate/countdown/count-up/diff/hover-gallery/watermark）+ `textFx` / 快捷键 service | Data display/* | ✅ |
| layout | sidebar/affix/anchor/smooth-scroll | Layout/* | ✅ |
| theming | palette + `applyColorScheme` | Actions/Theme Controller | ✅ |

### 核心 v1 缺口补齐

- Tree Select：`<blora-tree-select>` Composite CE
- Form validate：`createFormController` / `getFormValues`
- BackTop：`<blora-backtop>` / `initBackTop`
- Image preview：`openImagePreview` + image controller preview wiring
- Notification multi-placement：`notify({ placement })`
- Table：`createTableController` — 分页、列设置、虚拟滚动（Y/X）、**内置行选**（`data-blora-selectable`）

### 文档

- `addon-core-gaps.md` / `component-matrix.md` / `css-only-resolution.md` — 与代码对齐
- `pending-visual-review.md` — 本轮 CSS 变更清单；**人眼已确认（2026-08-02）**
- `docs/guide.md` — 已改为 **2.0 主路径**（去掉 1.x `Blora.*` 推荐口吻）
- `docs/framework.md` — 顶部标明 2.0 入口；正文历史 1.x 仅迁移对照

### DoD 本阶段范围

- ✅ 文档真值 + 真实单元测试 + typecheck（Phase 9 自限）
- ⬚ 全量 Playwright / axe / 视觉回归农场 → **Phase 10**

### 收口后仍属 Phase 10 的项

- 浏览器交互 / a11y / 视觉全矩阵
- Alpha → Beta 版本与 contract 稳定性政策
- 逐组件 1.x 迁移说明（compat 底座已在 Phase 8）

## 历史阶段详情

Phase 0–8 详细勾选见 git 历史中的本文件旧版本；当前以阶段进度表为准。
