# 重构状态

> Blora Design 2.0 重构进度跟踪。每个阶段完成后更新此文件。

## 当前阶段

**Phase 0：冻结与基线** - ✅ 完成（待提交）

## 阶段进度

| 阶段 | 状态 | 说明 |
|---|---|---|
| Phase 0：冻结与基线 | ✅ 完成 | 冻结 1.x 行为事实、捕获公共 API、生成视觉基线 |
| Phase 1：Workspace 与门禁 | ⬚ 未开始 | pnpm workspace、TS strict、lint、test、CI |
| Phase 2：Token | ⬚ 未开始 | DTCG 三层 token、生成器、v1 映射 |
| Phase 3：Foundations | ⬚ 未开始 | 可选 reset、排版、focus、布局、@layer |
| Phase 4：三个试点组件 | ⬚ 未开始 | Button -> Dialog -> Select |
| Phase 5：核心表单和反馈 | ⬚ 未开始 | Field/Input/Checkbox/Radio/Switch/Tag/Alert/Progress/Spinner/Skeleton/Toast |
| Phase 6：导航与浮层 | ⬚ 未开始 | Tabs/Breadcrumb/Pagination/Dropdown/Tooltip/Popover/Drawer/Navbar |
| Phase 7：数据与内容基础 | ⬚ 未开始 | Card/Table/List/Accordion/Timeline/Empty/Result/Avatar/Badge |
| Phase 8：兼容层与 Codemod | ⬚ 未开始 | Token/class 映射、event 别名、codemod、migrate:check |
| Phase 9：Add-ons | ⬚ 未开始 | Markdown/Thread/QRCode/Effects 拆出 |
| Phase 10：预发布 | ⬚ 未开始 | Alpha -> Beta -> RC -> Stable |

## Phase 0 详细进度

### 已完成

- [x] 记录基准 commit `a148715d06ee9551cbee262ffae6ad377b564df6` 为 2.0 唯一视觉来源
- [x] 创建 `v1-maintenance` 分支
- [x] 将 `index.html` 复制到 `legacy/showcase-v1.html`（修正资源路径）
- [x] 将 `blora.css`、`blora.js`、`blora.d.ts`、`bloret-mini.svg`、`locales/` 复制到 `legacy/v1/`
- [x] 生成展示页 light + dark 模式截图
- [x] 创建 `docs/refactor/visual-baseline.json`（基准 commit、viewport、截图路径）
- [x] 创建 `AGENTS.md`（含视觉基线禁令）
- [x] 提取 `v1-css-inventory.json` + `v1-css-inventory.md`（CSS class、token、data attribute 清单）
- [x] 提取 `v1-js-inventory.md`（JS API、初始化器、事件、data attribute 清单）
- [x] 创建 `v1-public-surface.json`（整合清单）
- [x] 创建 `component-matrix.md`（每个组件的迁移状态）
- [x] 创建 `decisions.md`（ADR-001 截图策略、ADR-002 保留副本）
- [x] 创建 `known-differences.md`（差异记录模板）

### 待完成

- [ ] 提交 Phase 0

## 阻塞项

无。

## 关键决策

见 `decisions.md`。
