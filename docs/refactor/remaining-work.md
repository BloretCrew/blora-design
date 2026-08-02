# 2.0 重构剩余工作总表（主跟踪文档）

> **用途**：从本文件起，直到整个 2.0 重构完成，**以本清单为唯一进度源**（`status.md` 只摘要并链接此处）。  
> **建立日期**：2026-08-02  
> **审计基线**：对照 `Blora-Design-2.0-Refactor-Spec.md` §25–26 / §31 与仓库自限收口（Phase 9 DoD 缩窄版）。  
> **本文件不替代** contract / Storybook；只跟踪阶段与诚实债。

---

## 0. 口径（两套「完成」）

| 口径 | 含义 | 当前 |
|------|------|------|
| **仓库自限** | 阶段目标可交付（功能迁移 + add-on 拆分 + 文档真值 + 单测 + typecheck） | Phase 0–9 ✅；Phase 10 ⬚ |
| **规格全书 DoD** | 每组件 §26 全勾 + §31 发布清单 | **未达到**；主体落在 Phase 10 |

**真实位置**：功能迁移与 add-on 拆分已按自限完成；可标 stable / 可发 `2.0.0` 的质量与发布面几乎全在 Phase 10。

---

## 1. Phase 0–9 进度快照（审计）

| 阶段 | 自限状态 | 说明 |
|------|----------|------|
| Phase 0 冻结与基线 | ✅ | `legacy/`、`visual-baseline.json`、公共面清单 |
| Phase 1 Workspace 与门禁 | ✅ | pnpm、TS、lint、test、CI、Storybook、publint |
| Phase 2 Token | ✅ | DTCG、主题、对比度门禁 |
| Phase 3 Foundations | ✅ | reset/base/layout/utilities、RTL、reduced-motion |
| Phase 4 试点 | ✅ | Button → Dialog → Select |
| Phase 5 表单与反馈 | ✅ | Field…Toast 等 |
| Phase 6 导航与浮层 | ✅ | Tabs…Drawer/Navbar |
| Phase 7 数据与内容 | ✅ | Card/Table/List…；table controller 后在 Phase 9 补齐高级路径 |
| Phase 8 兼容与 Codemod | ✅ | compat、codemod、migrate:check、fixtures |
| Phase 9 Add-ons | ✅ 自限 | 六包 + 核心 v1 缺口；**规格级 DoD 未勾满** |
| Phase 10 预发布 | ⬚ | Alpha → Beta → RC → Stable |

### Phase 9 已交付（自限）

- Add-ons：thread / markdown / qrcode / effects / layout / theming（API + Story + 单测）
- 核心缺口：TreeSelect、Form、BackTop、Image preview、notify 多 placement、Table（分页 / 列设置 / 虚拟 Y·X / **内置行选**）
- 文档：`guide.md` 2.0 主路径；`addon-core-gaps` / matrix / css-only-resolution；人眼 visual review 已确认
- **未**纳入 Phase 9 自限：全量 Playwright / axe / 视觉农场 → Phase 10

包版本现状：`@bloret-crew/blora-design` 与 add-on 均为 **`2.0.0-alpha.0`**（开发态，非正式 alpha 发布演练）。

---

## 2. Phase 9 尾巴 / 诚实债（P9-1…P9-8）

> 关闭定义：文档/ADR/指针正确，或明确 **deferred 到 Phase 10** 并写明原因。  
> **禁止**为关债而静默改产品视觉/交互；若必须改，记入 §4 供人眼核验。

| ID | 项 | 处置 | 状态 |
|----|-----|------|------|
| **P9-1** | 根 `README.md` 仍写 1.0.0 / `blora.js` / `blora-btn--*` | 改为 2.0-alpha 推荐用法（ESM、`.blora-button`、controller） | ✅ 已关闭 |
| **P9-2** | `docs/framework.md` 正文大量 1.x | 顶部 2.0 入口已有；历史节标题强化「仅迁移对照」；**全文重写 deferred**（Phase 10 文档产品化） | ✅ 已关闭（降权足够） |
| **P9-3** | `llms.txt` 指向不存在的 `docs/migration/v1-to-v2.md` | 新增最小 stub；llms 链到有效路径 | ✅ 已关闭 |
| **P9-4** | 包名 / 形态 vs 规格表示例偏差 | 见 §2.1 诚实说明；实现名以 monorepo 为准 | ✅ 已关闭（文档） |
| **P9-5** | 规格偏 FA WC，实现多为 headless controller | ADR-009 固化默认架构 | ✅ 已关闭（文档） |
| **P9-6** | add-on 无 Playwright / visual 农场；qrcode jsdom canvas 噪音 | **Deferred → Phase 10** 质量农场；非诚实债阻塞 | ✅ 已处置（deferred） |
| **P9-7** | 全量 `pnpm verify` 未作 Phase 9 硬门 | 本收口以 typecheck + unit 为证；全量 verify **Deferred → Phase 10 / CI**（见 §5） | ✅ 已处置（deferred + 证据） |
| **P9-8** | 2.0 核心 i18n / locales 对等缺失 | **Deferred → Phase 10**（规格若仍要求再立项）；1.x 见 `legacy/v1/locales` | ✅ 已处置（deferred） |

### 2.1 包名与实现形态诚实说明（P9-4）

| 规格示例 / 早期表 | 仓库实现 | 说明 |
|-------------------|----------|------|
| `@bloret-crew/blora-markdown` 等 | `@bloret-crew/blora-design-markdown` 等 | 统一 `blora-design-*` 前缀；**以 package.json 为准** |
| Table 行为「beta controller」 | `createTableController` + contract **stable**（主路径） | 高级路径已交付；**全量 browser DoD 仍属 Phase 10** |
| 大量 `<blora-tabs>` / FA WC | 多数为 `div` + `createXxxController`；Select/Dialog 为 CE | 见 **ADR-009** |

### 2.2 相关文件

- 迁移 stub：`docs/migration/v1-to-v2.md`
- 架构 ADR：`docs/refactor/decisions.md` → ADR-009
- 人眼 / 行为 delta：`docs/refactor/pending-visual-review.md` § Phase-9 honesty closeout

---

## 3. Phase 10 开放清单（做到 Stable 前均对照本表）

> 全部默认 **⬚ 未开始**。完成一项时改为 ✅ 并注日期/PR。  
> 勿在未更新本表时声称 Phase 10 完成。

### 3.1 Alpha

- [ ] 正式定义并发布 **`2.0.0-alpha.x`**（非仅 package 字段写 alpha）
- [ ] 根/包 README 与 npm 说明一致（持续）
- [ ] 至少 1 个 **纯 HTML** 可运行 example（`examples/` 或等价）
- [ ] （可选）React / Vue 消费示例或适配器 beta 占位
- [ ] 收集外部反馈通道（Issue 模板 / 文档说明）
- [ ] CI 本分支 / 主分支 **required jobs 绿** 有记录

### 3.2 包与消费面（规格 §6 / §31）

- [ ] `exports`：`./auto`（注册 stable CE）
- [ ] 稳定组件 **JS 子路径**（如 `./button`、`./select`）按规格补齐策略
- [ ] `./compat/v1` 明确导出与体积独立统计
- [ ] **CDN / IIFE global bundle**（若仍要求三种消费）
- [ ] `npm pack` / pack:test 与 provenance 策略
- [ ] Tree-shaking / sideEffects 审计

### 3.3 清单与 AI 契约

- [ ] `custom-elements.json` 生成与导出
- [ ] `component-manifest.json` 生成与导出
- [ ] `llms.txt` 与组件索引对齐（随 stable 集更新）
- [ ] API snapshot 流水线
- [ ] **CHANGELOG**（changeset 发版叙事）
- [ ] 完整 `docs/migration/v1-to-v2.md`（超 stub：class/data/event 全表 + 步骤）

### 3.4 组件 DoD 农场（§26）— 至少 stable 宣传集

- [ ] 每目标组件：unit（已有抽样 → 扩覆盖）
- [ ] Playwright **交互**主路径矩阵
- [ ] 键盘 / 焦点断言
- [ ] axe a11y（`test:a11y` 真跑 + 无 serious/critical）
- [ ] **visual** 回归项目 + 审核流（非仅 legacy 全页基线）
- [ ] RTL / 320px / reduced-motion 组件级抽样→矩阵
- [ ] form submit/reset（适用组件）
- [ ] connect/disconnect / 泄漏抽测
- [ ] contract status 与「可宣传 stable」对齐（当前约 42 stable / 34 beta — 需治理）

### 3.5 Beta

- [ ] **stable core API 冻结**决议（破坏性变更政策）
- [ ] 仅修缺陷的节奏；beta 组件不进入默认宣传
- [ ] 完整迁移文档用户向发布
- [ ] 体积预算扩展（CSS/JS 策略，非仅 tokens/foundations）

### 3.6 RC

- [ ] 冻结新增组件
- [ ] 全浏览器回归记录
- [ ] 人工 a11y 抽测记录
- [ ] npm 安装演练 + CDN 演练 + 回滚方案
- [ ] CSP / SSR import 专项证明

### 3.7 Stable `2.0.0`

- [ ] 发 `2.0.0`；docs 与 tag 对齐
- [ ] dist-tag：`latest` / `legacy`（1.x）策略成文
- [ ] 1.x 安全修复策略
- [ ] §31 发布清单全部勾选

### 3.8 明确非本阶段偷渡（保持打开直到有主）

- [ ] 2.0 **i18n / locales** 运行时（P9-8）
- [ ] add-on 独立 Playwright / visual（P9-6）
- [ ] 全量 `pnpm verify` 作为发布硬门（P9-7）
- [ ] FA WC 全面化（**不默认**；见 ADR-009）
- [ ] 删除 `legacy/v1` 或拆除 compat（**禁止**过早）

---

## 4. 产品视觉 / 功能 delta（本诚实债收口）

| 日期 | 变更 | Story / 路径 | 需人眼？ |
|------|------|--------------|----------|
| 2026-08-02 | **无**。Phase 9 诚实债收口仅文档/ADR/llms/README/migration stub | — | **否** |

若后续为修死链或假声明而改 `packages/**/src` 且影响渲染或交互，必须在此表追加行，并更新 `pending-visual-review.md`。

---

## 5. 验证证据（诚实债收口）

| 检查 | 命令 | 结果 | 证据 |
|------|------|------|------|
| typecheck | `pnpm --filter @bloret-crew/blora-design run typecheck` | ✅ exit 0（2026-08-02） | implementer scratch `phase9-honesty-typecheck.log` |
| unit | `pnpm --filter @bloret-crew/blora-design exec vitest run` | ✅ 91 tests passed（含 `docs-honesty.test.ts`） | implementer scratch `phase9-honesty-unit.log` |
| full `pnpm verify` | — | **未作为本收口硬门**；Deferred → Phase 10 / CI（时间与浏览器矩阵成本） | **不宣称全绿** |

---

## 6. 相关链接

| 文档 | 角色 |
|------|------|
| [`status.md`](./status.md) | 阶段摘要 → 链到本文件 |
| [`component-matrix.md`](./component-matrix.md) | 组件迁移状态 |
| [`addon-core-gaps.md`](./addon-core-gaps.md) | Phase 9 缺口对照 |
| [`decisions.md`](./decisions.md) | ADR（含 ADR-009） |
| [`pending-visual-review.md`](./pending-visual-review.md) | 视觉签收 |
| [`docs/guide.md`](../guide.md) | **2.0 推荐用法** |
| [`docs/migration/v1-to-v2.md`](../migration/v1-to-v2.md) | 迁移入口（stub → 后扩） |
| `Blora-Design-2.0-Refactor-Spec.md` | 完整规格 |

---

## 7. 变更日志（本文件）

| 日期 | 摘要 |
|------|------|
| 2026-08-02 | 初版：审计快照 + P9 诚实债关闭表 + Phase 10 全开清单 |
| 2026-08-02 | P9-1…P9-8 全部关闭或 deferred；typecheck + unit 证据写入 §5 |
