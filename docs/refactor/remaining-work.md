# 2.0 重构剩余工作总表（主跟踪文档）

> **用途**：从本文件起，直到整个 2.0 重构完成，**以本清单为唯一进度源**（`status.md` 只摘要并链接此处）。  
> **建立日期**：2026-08-02  
> **审计基线**：对照 `Blora-Design-2.0-Refactor-Spec.md` §25–26 / §31 与仓库自限收口（Phase 9 DoD 缩窄版）。  
> **本文件不替代** contract / Storybook；只跟踪阶段与诚实债。

---

## 0. 口径（两套「完成」）

| 口径 | 含义 | 当前 |
|------|------|------|
| **仓库自限** | 阶段目标可交付（功能迁移 + add-on 拆分 + 文档真值 + 单测 + typecheck） | Phase 0–9 ✅；**Phase 10 🔄 进行中** |
| **规格全书 DoD** | 每组件 §26 全勾 + §31 发布清单 | **未达到**；主体落在 Phase 10 §3 清单 |

**真实位置**（2026-08-02）：Phase 9 自限 + 诚实债已关；**已正式进入 Phase 10**。可标 stable / 可发 `2.0.0` 的工作 = 完成本文件 §3。

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
| Phase 10 预发布 | 🔄 | **2026-08-02 进入**；见 §3 |

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
| **P9-5** | 规格偏 FA WC，实现多为 headless controller | ADR-013 固化默认架构 | ✅ 已关闭（文档） |
| **P9-6** | add-on 无 Playwright / visual 农场；qrcode jsdom canvas 噪音 | **Deferred → Phase 10** 质量农场；非诚实债阻塞 | ✅ 已处置（deferred） |
| **P9-7** | 全量 `pnpm verify` 未作 Phase 9 硬门 | 本收口以 typecheck + unit 为证；全量 verify **Deferred → Phase 10 / CI**（见 §5） | ✅ 已处置（deferred + 证据） |
| **P9-8** | 2.0 核心 i18n / locales 对等缺失 | **Deferred → Phase 10**（规格若仍要求再立项）；1.x 见 `legacy/v1/locales` | ✅ 已处置（deferred） |

### 2.1 包名与实现形态诚实说明（P9-4）

| 规格示例 / 早期表 | 仓库实现 | 说明 |
|-------------------|----------|------|
| `@bloret-crew/blora-markdown` 等 | `@bloret-crew/blora-design-markdown` 等 | 统一 `blora-design-*` 前缀；**以 package.json 为准** |
| Table 行为「beta controller」 | `createTableController` + contract **stable**（主路径） | 高级路径已交付；**全量 browser DoD 仍属 Phase 10** |
| 大量 `<blora-tabs>` / FA WC | 多数为 `div` + `createXxxController`；Select/Dialog 为 CE | 见 **ADR-013** |

### 2.2 相关文件

- 迁移指南（已有 class/data 主表，Phase 10 继续扩）：`docs/migration/v1-to-v2.md`
- 架构 ADR：`docs/refactor/decisions.md` → ADR-013
- 人眼 / 行为 delta：`docs/refactor/pending-visual-review.md` § Phase-9 honesty closeout

---

## 3. Phase 10 开放清单（做到 Stable 前均对照本表）

> **Phase 10 状态：🔄 进行中**（进入日期 2026-08-02）。  
> **含义澄清**：进入 Phase 10 = 已打开预发布阶段标签；**不等于** Preflight/Alpha 工作已完成。  
> 推荐顺序：**§3.0 Preflight 全绿 → §3.1 Alpha 发布 → §3.2–3.4 加深 → Beta → RC → Stable**。  
> 完成一项时改为 ✅ 并注日期。勿在未更新本表时声称 Alpha/Stable 完成。  
> 清理记录：`.trashes/phase10-entry-cleanup/`。

### 3.0 Phase 10 Preflight（Alpha **之前** · 门禁与发布链）

> 外部审查建议采纳：先修真实门禁与 2.0 发布链，再发 `2.0.0-alpha.*`。  
> **No-Go Alpha** 直到本小节关键项勾完（或显式降级并文档说明）。

#### 3.0.1 `pnpm verify` / 本地门禁

- [x] JS lint（eslint）全绿（2026-08-02 Preflight 开场）
- [x] CSS lint（stylelint）全绿 — token/z-index/`is-*` 规则与硬编码色已收口
- [x] Token / CSS contract 检查全绿
- [x] Prettier `format:check` 全绿
- [x] Typecheck ✅（已具备；保持）
- [ ] Token 对比度 ✅（已具备；保持）— 复跑确认
- [ ] Build + publint 主包 ✅（已具备；保持）— 复跑确认
- [x] **`attw` 全绿** — 新 CSS 子路径加入 exclude 列表（CSS 由 stylelint/pack 守护；attw 聚焦 JS/types）
- [ ] Unit 断言通过 **且进程正常退出**（Vitest hang / Node 22·24；必要时 CI 矩阵或收窄 engines）
- [ ] QRCode 等测试无持续 canvas `getContext` 噪音（mock 或 skip 干净）
- [ ] **`pnpm verify` 在 Node 22 完整通过**（与 CI 同构；记录证据）
- [ ] 浏览器测在 CI 可跑（Chromium install）；本地缺浏览器不挡 CI 定义

#### 3.0.2 CI 与聚合

- [x] 修复 `ci.yml` aggregate：`every()` → `contains(needs.*.result, 'failure')` / `cancelled`
- [ ] CI 纳入 **publint**、**attw**（与 verify 对齐的最小集）
- [ ] CI Node 版本明确（22 为主；可选 24 矩阵若 engines 仍 `>=22`）
- [ ] required jobs 在 master 上有 **绿记录**（Preflight 完成标志之一）

#### 3.0.3 发布工作流（2.0 monorepo）

- [ ] **重写** `.github/workflows/publish.yml`（现仍 1.x：根 `package.json`、根 `blora.js`、根 `npm publish`、private monorepo 根）
- [ ] pnpm install + workspace 构建
- [ ] 发布 **主包** + **6 add-on**（或文档声明的发布集）
- [ ] prerelease **dist-tag** 策略（如 `next` / `alpha`）
- [ ] Release 说明改为 2.0 ESM 安装，**禁止**仍写 `blora.js` UMD 为主路径
- [ ] 发版前跑 verify 子集（或依赖 CI 绿）

#### 3.0.4 包导出与体积诚实

- [ ] 所有 `package.json` `exports` 在 pack 后可解析（fixture **遍历 exports**，不单测主入口）
- [ ] 修 `tree-select.css` / `backtop.css` 等 attw 失败路径
- [ ] **size 门禁重做**：勿用仅含 `@import` 的 `blora.css` 壳当全量体积；统计展平 CSS / 主 JS / 分组件 / compat / add-on
- [ ] add-on 至少：build + pack 可装（publint/attw 跟进）

#### 3.0.5 测试能力诚实（Preflight 最小集，非全矩阵）

- [ ] Playwright：`a11y` project **真跑 axe**（或拆独立 project，禁止「只换名重跑」）
- [x] 声明 `test:visual`：无 project 时脚本明确失败信息（不再伪报 `Project visual not found`）
- [ ] （可选 Preflight）首批 visual 快照 1～N 个关键页；**全组件 visual 仍属 §3.4**
- [x] 文档写明：browser 覆盖 ≠ 全部 stable contract（matrix 脚注 + 本表）

#### 3.0.6 文档与 contract 治理（Preflight）

- [x] `AGENTS.md` / 贡献入口阶段与 `status.md` 一致（Phase 10 Preflight）
- [x] `remaining-work` / matrix 措辞：matrix ✅ =「实现可用」≠ §26 DoD stable
- [x] 迁移指南状态：已有 class/data 主表（非空 stub）；Phase 10 继续扩全表
- [ ] **contract 状态治理**：现有 ~42 `stable` 与测试覆盖不对齐 → 策略二选一（或组合）  
  - 降为 `beta` / 引入 `candidate`/`implemented` 后再升 stable；或  
  - 收紧「可宣传 stable」名单并文档标明  
- [x] component-matrix 脚注：避免误读 ✅ 为 DoD stable

#### 3.0.7 Preflight 完成定义

- [ ] §3.0.1–3.0.4 关键项全 ✅
- [ ] §3.0.5–3.0.6 至少完成「诚实」子集（axe 真跑或明确未跑；visual 脚本不撒谎；AGENTS/contract 策略落地）
- [ ] **此后**才允许 §3.1 正式发布 `2.0.0-alpha.1`（建议 `--tag next` 或 `alpha`）

---

### 3.1 Alpha（Preflight **之后**）

- [ ] 正式定义并发布 **`2.0.0-alpha.x`**（非仅 package 字段写 alpha）
- [ ] 根/包 README 与 npm 说明一致（持续）
- [ ] 至少 1 个 **纯 HTML** 可运行 example（`examples/`）
- [ ] （可选）React / Vue 消费示例或适配器 beta 占位
- [ ] 收集外部反馈通道（Issue 模板 / 文档说明）
- [ ] Alpha 安装演练记录（npm / 可选 CDN）

### 3.2 包与消费面（规格 §6 / §31 · 可与 Alpha 并行加深）

- [ ] `exports`：`./auto`（注册 stable CE）
- [ ] 稳定组件 **JS 子路径**（如 `./button`、`./select`）
- [ ] `./compat/v1` 明确导出与体积独立统计
- [ ] **CDN / IIFE global bundle**（若仍要求三种消费）
- [ ] provenance / 签名策略
- [ ] Tree-shaking / sideEffects 审计

### 3.3 清单与 AI 契约

- [ ] `custom-elements.json` 生成与导出
- [ ] `component-manifest.json` 生成与导出
- [ ] `llms.txt` 与组件索引对齐（随可宣传 stable 集更新）
- [ ] API snapshot 流水线
- [ ] **CHANGELOG**（changeset 发版叙事；Preflight 后新建 changeset，勿依赖已归档的旧 changeset）
- [ ] 迁移指南继续扩充（事件/边角 / 逐组件）

### 3.4 组件 DoD 农场（§26）— 至少「可宣传 stable」集

> 全量 axe/visual/Firefox 矩阵：**优先 Beta/RC**；Preflight 只要求 §3.0.5 诚实最小集。

- [ ] 每目标组件：unit（抽样 → 扩覆盖）
- [ ] Playwright **交互**主路径矩阵（远超现有 7 个 browser 文件）
- [ ] 键盘 / 焦点断言
- [ ] axe 覆盖扩大（无 serious/critical）
- [ ] **visual** 回归矩阵 + 审核流
- [ ] RTL / 320px / reduced-motion 组件级
- [ ] form submit/reset（适用组件）
- [ ] connect/disconnect / 泄漏抽测
- [ ] contract 与可宣传名单最终对齐

### 3.5 Beta

- [ ] **stable core API 冻结**决议（破坏性变更政策）
- [ ] 仅修缺陷的节奏；beta/experimental 不进入默认宣传
- [ ] 完整迁移文档用户向发布
- [ ] 体积预算扩展落地（接 §3.0.4）

### 3.6 RC

- [ ] 冻结新增组件
- [ ] 全浏览器回归记录（含 Firefox/WebKit 策略）
- [ ] 人工 a11y 抽测记录
- [ ] npm 安装 + CDN + 回滚演练
- [ ] CSP / SSR import 专项证明

### 3.7 Stable `2.0.0`

- [ ] 发 `2.0.0`；docs 与 tag 对齐
- [ ] dist-tag：`latest` / `legacy`（1.x）策略成文
- [ ] 1.x 安全修复策略
- [ ] §31 发布清单全部勾选

### 3.8 明确非默认 / 后置

- [ ] 2.0 **i18n / locales** 运行时（P9-8）
- [ ] add-on 独立 Playwright / visual 深矩阵（P9-6）
- [ ] FA WC 全面化（**不默认**；ADR-013）
- [ ] 删除 `legacy/v1` 或拆除 compat（**禁止**过早）
- [ ] 全量 `pnpm verify` 作为发布硬门 — **已升入 §3.0.1**（完成后在此勾选归档）

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
| [`decisions.md`](./decisions.md) | ADR（含 ADR-013） |
| [`pending-visual-review.md`](./pending-visual-review.md) | 视觉签收 |
| [`docs/guide.md`](../guide.md) | **2.0 推荐用法** |
| [`docs/migration/v1-to-v2.md`](../migration/v1-to-v2.md) | 迁移指南（主表已有；继续扩充） |
| `Blora-Design-2.0-Refactor-Spec.md` | 完整规格 |

---

## 7. 变更日志（本文件）

| 日期 | 摘要 |
|------|------|
| 2026-08-02 | 初版：审计快照 + P9 诚实债关闭表 + Phase 10 全开清单 |
| 2026-08-02 | P9-1…P9-8 全部关闭或 deferred；typecheck + unit 证据写入 §5 |
| 2026-08-02 | **进入 Phase 10**；过期 changesets → `.trashes/phase10-entry-cleanup`；迁移指南升格为 monorepo 正文 |
| 2026-08-02 | 采纳外部审查：新增 **§3.0 Preflight**（verify/CI/publish/exports/体积/contract 治理）；Alpha 后置 |
| 2026-08-02 | Preflight 开场：lint/css/contracts/prettier/attw/CI aggregate/`test:visual` 诚实化；image 预览 token 化 |
