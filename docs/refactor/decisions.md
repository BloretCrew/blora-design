# 重构决策记录

> 临时决策记录，最终沉淀为 ADR（Architecture Decision Record）。

## ADR-001: 截图策略调整

**日期**：2026-07-29  
**状态**：已采纳

### 背景

规格 Phase 0 要求对展示页全部组件生成逐组件、逐状态截图。执行 AI（Grok）具备多模态视觉能力，可以查看截图，但截图的主要价值在于后续 Phase 1 的 Playwright 视觉回归 harness。

### 决策

Phase 0 只生成全页 light + dark 模式截图作为视觉基线参考。逐组件逐状态的精细截图推迟到 Phase 1 建立 Playwright 视觉回归 harness 后执行。

Phase 0 的重点精力放在从 CSS/JS/d.ts 源码提取结构化清单（`v1-css-inventory.json`、`v1-js-inventory.json`），这些是迁移时最常引用的机器可读事实来源。

### 理由

- CSS 源码本身是视觉规格的 ground truth，提取结构化数据比截图更有长期价值。
- 逐状态截图需要 Playwright 框架支撑（hover、focus、active 等状态），手写脚本效率低。
- Phase 0 的核心目标是"不丢失参照"，结构化清单 + 全页截图已满足此目标。

---

## ADR-002: 保留 1.x 源码副本而非移动

**日期**：2026-07-29  
**状态**：已采纳

### 背景

规格第 0.1 条要求"禁止一次性删除 1.x 实现"，旧实现要保留到 2.0 Release Candidate。

### 决策

将 `blora.css`、`blora.js`、`blora.d.ts`、`bloret-mini.svg`、`locales/` 复制到 `legacy/v1/`，同时保留根目录原始文件。`legacy/showcase-v1.html` 引用 `legacy/v1/` 下的副本，确保冻结的展示页不受 2.0 开发影响。

### 理由

- 根目录的原始文件在 Phase 1 建立 workspace 后会被重组，但 `legacy/v1/` 中的冻结副本始终可用。
- 展示页副本 (`legacy/showcase-v1.html`) 引用 `legacy/v1/` 副本，与根目录解耦。

---

## 待决策

- [ ] Phase 1 的包管理器配置（pnpm workspace 结构、包名 `@bloret-crew/blora-design`）
- [ ] Storybook vs 自建 Story 系统
- [ ] 视觉回归测试框架（Playwright snapshot vs 第三方工具）
