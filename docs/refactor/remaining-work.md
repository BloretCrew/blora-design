# 2.0 重构剩余工作总表（主跟踪文档）

> **用途**：从本文件起，直到整个 2.0 重构完成，**以本清单为唯一进度源**（`status.md` 只摘要并链接此处）。  
> **建立日期**：2026-08-02  
> **审计基线**：对照 `Blora-Design-2.0-Refactor-Spec.md` §25–26 / §31 与仓库自限收口（Phase 9 DoD 缩窄版）。  
> **本文件不替代** contract / Showcase；只跟踪阶段与诚实债。

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
| Phase 6 导航与浮层 | ✅ | Tabs…Drawer/Navbar/Sidebar Navigation |
| Phase 7 数据与内容 | ✅ | Card/Table/List…；table controller 后在 Phase 9 补齐高级路径 |
| Phase 8 迁移工具 | ✅ | codemod、migrate:check、fixtures；早期 runtime compat 后续已撤销 |
| Phase 9 Add-ons | ✅ 自限 | 六包 + 核心 v1 缺口；**规格级 DoD 未勾满** |
| Phase 10 预发布 | 🔄 | **2026-08-02 进入**；见 §3 |

### Phase 9 已交付（自限）

- Add-ons：thread / markdown / qrcode / effects / layout / theming（API + Story + 单测）
- 核心缺口：TreeSelect、Form、BackTop、Image preview、notify 多 placement、Table（分页 / 列设置 / 虚拟 Y·X / **内置行选**）
- 文档：`guide.md` 2.0 主路径；`addon-core-gaps` / matrix / css-only-resolution；人眼 visual review 已确认
- **未**纳入 Phase 9 自限：全量 Playwright / axe / 视觉农场 → Phase 10

包版本现状：`@bloret-crew/blora-design` 与六个 add-on 为 **`2.0.0-beta.1`**；stable-core API 冻结，进入 RC 收口。
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
| **P9-5** | 规格偏 FA WC，实现多为 headless controller | 历史由 ADR-013 关闭；2026-08-08 ADR-015 改为 Composite CE 默认、FA 分阶段 | ✅ 已由新 ADR 更新 |
| **P9-6** | add-on 无 Playwright / visual 农场；qrcode jsdom canvas 噪音 | **Deferred → Phase 10** 质量农场；非诚实债阻塞 | ✅ 已处置（deferred） |
| **P9-7** | 全量 `pnpm verify` 未作 Phase 9 硬门 | 本收口以 typecheck + unit 为证；全量 verify **Deferred → Phase 10 / CI**（见 §5） | ✅ 已处置（deferred + 证据） |
| **P9-8** | 2.0 核心 i18n / locales 对等缺失 | `t()` + `en` / `zh-CN` 目录；chrome 走 locale pack | ✅ |

### 2.1 包名与实现形态诚实说明（P9-4）

| 规格示例 / 早期表 | 仓库实现 | 说明 |
|-------------------|----------|------|
| `@bloret-crew/blora-markdown` 等 | `@bloret-crew/blora-design-markdown` 等 | 统一 `blora-design-*` 前缀；**以 package.json 为准** |
| Table 行为「beta controller」 | `createTableController` + contract **stable**（主路径） | 高级路径已交付；**全量 browser DoD 仍属 Phase 10** |
| 大量 `<blora-tabs>` / FA WC | 结构敏感控件已进入 Composite CE 默认面；FA 仍按表单合同分阶段 | 见 **ADR-015**（supersedes ADR-013） |

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
> Phase 10 入口清理已完成；废弃备份不再保留在工作区。

### 3.0 Phase 10 Preflight（Alpha **之前** · 门禁与发布链）

> 外部审查建议采纳：先修真实门禁与 2.0 发布链，再发 `2.0.0-alpha.*`。  
> **No-Go Alpha** 直到本小节关键项勾完（或显式降级并文档说明）。

#### 3.0.1 `pnpm verify` / 本地门禁

- [x] JS lint（eslint）全绿（2026-08-02 Preflight 开场）
- [x] CSS lint（stylelint）全绿 — token/z-index/`is-*` 规则与硬编码色已收口
- [x] Token / CSS contract 检查全绿
- [x] Prettier `format:check` 全绿
- [x] Typecheck ✅（已具备；保持）
- [x] Token 对比度 ✅（复跑 2026-08-02）
- [x] Build + publint 主包 ✅（复跑）
- [x] **`attw` 全绿** — 新 CSS 子路径加入 exclude 列表（CSS 由 stylelint/pack 守护；attw 聚焦 JS/types）
- [x] Unit 断言通过 + forks pool（QR canvas mock；进程可正常结束）
- [x] QRCode 测试 mock `getContext`（无 canvas 噪音）
- [x] **`pnpm verify` 关键门禁本地可绿**（lint/css/contracts/contrast/format/typecheck/test/build/publint/attw/size/pack；browser 本地全量 2026-08-02 修 sort 断言后通过）
- [x] 浏览器测在 CI 可跑（workflow 已装 Chromium；定义明确）

#### 3.0.2 CI 与聚合

- [x] 修复 `ci.yml` aggregate：`every()` → `contains(needs.*.result, 'failure')` / `cancelled`
- [x] CI 纳入 **publint**、**attw**、**publint:addons**、**pack:test:addons**（build-package job）
- [x] CI Node 版本明确（`NODE_VERSION: "22"`）
- [x] required jobs 在 master 上有 **绿记录**（CI run `c6b8bb8` / Actions #30748903722 全 job success，2026-08-02）

#### 3.0.3 发布工作流（2.0 monorepo）

- [x] **重写** `.github/workflows/publish.yml`（pnpm monorepo；不再读根 `blora.js`）
- [x] pnpm install + workspace 构建
- [x] 发布 **主包** + **6 add-on**（`pnpm --filter … publish`）
- [x] prerelease **dist-tag** 策略（`alpha` / `beta` / `rc` / `latest`）
- [x] Release 说明改为 2.0 ESM 安装
- [x] 发版前跑 publint + attw（workflow 内）

#### 3.0.4 包导出与体积诚实

- [x] 所有 `package.json` `exports` 在 pack 后可解析（`pack-test.mjs` **遍历 exports**）
- [x] `tree-select` / `backtop` attw 路径已处理（exclude + pack 校验文件存在）
- [x] **size 门禁重做**：shell `blora.css` + **flattened CSS** + `index.js` + compat
- [x] add-on 独立 pack/publint 门禁（`pnpm publint:addons` + `pnpm pack:test:addons`；markdown/qrcode 构建复制 CSS）

#### 3.0.5 测试能力诚实（Preflight 最小集，非全矩阵）

- [x] Playwright：`a11y` project **真跑 axe**（`a11y.spec.ts` + AxeBuilder；与 chromium 分离）
- [x] 声明 `test:visual`：无 project 时脚本明确失败信息（不再伪报 `Project visual not found`）
- [x] （可选 Preflight）首批 visual 快照 1～N 个关键页 — **明确不做**：§3.4 已有 visual smoke（3 张基线 + 审核流）；全矩阵推迟到 RC（2026-08-03）
- [x] 文档写明：browser 覆盖 ≠ 全部 stable contract（matrix 脚注 + 本表）

#### 3.0.6 文档与 contract 治理（Preflight）

- [x] `AGENTS.md` / 贡献入口阶段与 `status.md` 一致（Phase 10 Preflight）
- [x] `remaining-work` / matrix 措辞：matrix ✅ =「实现可用」≠ §26 DoD stable
- [x] 迁移指南状态：已有 class/data 主表（非空 stub）；Phase 10 继续扩全表
- [x] **contract 状态治理**：政策见 [`contract-stability.md`](./contract-stability.md)（暂不批量降档；Alpha 文案诚实）  
- [x] component-matrix 脚注：避免误读 ✅ 为 DoD stable

#### 3.0.7 Preflight 完成定义

- [x] §3.0.1–3.0.4 关键项本地 ✅ + **CI 全绿**
- [x] §3.0.5–3.0.6 诚实子集完成（axe 真跑；visual 脚本不撒谎；AGENTS/contract 政策）
- [x] Preflight 关键路径完成 → **可进入 §3.1 发 `2.0.0-alpha.1`**（打 tag 触发 publish；dist-tag `alpha`）

---

### 3.1 Alpha（Preflight **之后**）

- [x] 正式定义 **`2.0.0-alpha.1`**（各包 version + `CHANGELOG.md` + tag `v2.0.0-alpha.1`）
- [x] 根/包 README 与版本说明对齐（持续维护）
- [x] 至少 1 个 **纯 HTML** 可运行 example（`examples/basic/`）
- [x] （可选）React / Vue 消费示例或适配器 beta 占位 — **明确不做大型示例**：改为在 `docs/guide.md` / `docs/framework.md` 写清框架集成方式（挂载子树 + controller + CSS import）（2026-08-03）
- [x] 收集外部反馈通道（`.github/ISSUE_TEMPLATE` bug + alpha feedback）
- [x] Alpha 安装演练记录（见 [`alpha-install-notes.md`](./alpha-install-notes.md)；七包均在 npm）

### 3.2 包与消费面（规格 §6 / §31 · 可与 Alpha 并行加深）

- [x] `exports`：`./auto`（注册完整默认 Composite CE 面，当前 61 个；side-effect entry；数量由 manifest 构建校验）
- [x] 稳定组件 **JS 子路径**：`./button` `./select` `./dialog` `./table`（vite 分 entry；toast 已删除，用 `message`）
- [x] ~~`./compat/v1` 导出 + size 预算~~ **已撤销**：2.0 不提供 1.x 运行时兼容层
- [x] **CDN / IIFE**：`./blora.global.js`（`vite.global.config.ts`，`globalThis.Blora`）
- [x] provenance / 签名策略：**publish.yml** 支持 opt-in `vars.NPM_PROVENANCE=1` + `id-token: write`（默认不强制，避免未配置 trusted publishing 时发版失败）
- [x] Tree-shaking / sideEffects：`sideEffects` 仅 CSS + `dist/auto.js`；主入口与 JS 子路径无额外副作用声明

### 3.3 清单与 AI 契约

- [x] `custom-elements.json` 生成与导出（`scripts/generate-manifests.mjs` → dist + `package.customElements`）
- [x] `component-manifest.json` 生成与导出（contracts 汇总）
- [x] `llms.txt` 与入口索引对齐（auto / 子路径 / global / manifests）
- [x] API snapshot 流水线（`dist/api-snapshot.json`，构建时生成）
- [x] **CHANGELOG**（`CHANGELOG.md` 含 2.0.0-alpha.1；后续可用 changeset 续写）
- [x] 迁移指南扩充入口表（§2.1 包入口摘要）；事件/逐组件仍可继续加

### 3.4 组件 DoD 农场（§26）— 至少「可宣传 stable」集

> 全量 axe/visual/Firefox 矩阵：**优先 Beta/RC**。  
> **Beta 发版前基线（本阶段）**：现有 unit + browser 全套 + axe smoke + contract 政策文档；不宣称每个 stable contract 已过 §26。

- [x] 抽样 unit 覆盖（controllers / v1-gaps / 试点 + docs-honesty）
- [x] Playwright 交互套件本地/CI 绿（button/dialog/select/data-content/compat/foundations + a11y）
- [x] 键盘 / 焦点：select/dialog 浏览器测覆盖部分路径
- [x] axe 最小 smoke（无 serious/critical）
- [x] **visual** 回归 smoke + 审核流（project `visual`；基线 3 张；`docs/refactor/visual-review.md`）— 全矩阵仍可 RC 扩
- [x] RTL / 320px foundations 抽样（foundations.spec）
- [x] form submit：select 浏览器测
- [x] connect/disconnect / 泄漏抽测：`tests/lifecycle.test.ts`（table/tree/collapse destroy 幂等与卸载）
- [x] contract 与可宣传名单政策：`contract-stability.md`（升 stable 前须 DoD）

### 3.5 Beta（Beta.1 缺陷收口发布）

- [x] **stable core API 冻结**决议：`docs/refactor/beta-api-freeze.md` + ADR-014
- [x] 仅修缺陷的节奏与宣传边界：`docs/refactor/beta-cadence.md`
- [x] 完整迁移文档用户向基线：`guide.md` + `migration/v1-to-v2.md`（含用户向发布检查）
- [x] 体积预算扩展落地：`check-size.mjs`（子路径 + global + add-on 合计）
- [x] 打 `2.0.0-beta.0` 与发布演练（2026-08-19；`beta` dist-tag；见 `beta-install-notes.md`）
- [x] 准备 `2.0.0-beta.1` 缺陷收口版（2026-08-25；CHANGELOG、七包版本、文档与发布记录；见 `beta.1-install-notes.md`）

### 3.6 RC

- [x] 冻结新增组件（RC 起只接受缺陷、无障碍、文档和发布阻塞修复；不再新增公共组件/API，2026-08-27）
- [x] 全浏览器回归策略成文 — [`browser-matrix.md`](./browser-matrix.md)
- [x] Firefox Playwright 全量实测：87/87 通过（Windows，2026-08-27）
- [x] WebKit Playwright 全量实测：87/87 通过（Windows，2026-08-27）
- [x] 人工 a11y 抽测记录 — [`a11y-spotcheck.md`](./a11y-spotcheck.md)
- [x] npm 安装 + CDN + 回滚演练 — [`rc-release-rehearsal.md`](./rc-release-rehearsal.md)
- [x] CSP / SSR import 专项证明 — [`rc-release-rehearsal.md`](./rc-release-rehearsal.md)
- [ ] 真实 Safari 设备人工抽测（当前环境无 Safari 设备；Playwright WebKit 已完成）

### 3.7 Stable `2.0.0`

- [ ] 发 `2.0.0`；docs 与 tag 对齐
- [ ] `latest` 指向 2.0 Stable；不建立 `legacy` 兼容发布线
- [x] 明确不提供 1.x 安全修复、兼容层、迁移支持或维护承诺（1.x 无用户/消费者，2026-08-27）
- [ ] §31 发布清单全部勾选

### 3.8 明确非默认 / 后置

- [x] Showcase 核心组件目录：已按 `component-manifest.json` 扩展为 87/87；单视图懒挂载，Preview / HTML 同源生成，并由结构门禁防止清单漂移
- [x] 2.0 **i18n / locales** 运行时（P9-8）— `t()` + `en` / `zh-CN` 目录；组件 chrome 不再硬编码语言
- [ ] add-on 独立 Playwright / visual 深矩阵（P9-6）
- [x] add-on Composite CE：`<blora-affix>` / `<blora-anchor sync-hash>` / `<blora-markdown>` 已交付；Smooth Scroll 仍为 Document service
- [x] FA WC：Select / Switch / Checkbox / Number Input / Range / Slider / Search / Upload / Tags Input / OTP 使用 ElementInternals；其余控件按合同使用原生提交或非表单语义（ADR-015）
- [x] runtime compat 已撤销；仓库外 `legacy/v1` 作为冻结基线继续保留
- [x] 全量 `pnpm verify` 作为发布硬门 — 2026-08-09 单次完整 exit 0，见 §5

---

## 4. 产品视觉 / 功能 delta（本诚实债收口）

| 日期 | 变更 | Story / 路径 | 需人眼？ |
|------|------|--------------|----------|
| 2026-08-02 | **无**。Phase 9 诚实债收口仅文档/ADR/llms/README/migration stub | — | **否** |
| 2026-08-09 | 结构敏感组件统一为 Composite CE；保持冻结视觉基线，修复 Statistic 展示页结构漂移 | 全部迁移 Story + `showcase-v2` | **已截图复核并通过 visual suite** |
| 2026-08-09 | `showcase-v2` 由全量长页改为浮动 Navbar + 单视图组件目录原型 | 当前仅 Accordion / Collapse；侧栏、Preview/HTML、桌面/移动路由 | **Agent 已截图复核；待用户确认后扩展** |
| 2026-08-11 | `showcase-v2` 组件目录扩展并持续与 manifest 对齐；当前为 87/87 核心组件，当前页懒挂载、导航活动项自动定位、Preview / HTML 同源 | `examples/showcase-v2/`；manifest 对齐门禁；桌面/移动全目录浏览器巡检 | **Agent 已审查 Accordion、Statistic、Table、Dialog、Select、代码面板、主题面板及移动侧栏快照** |
| 2026-08-19 | `known-differences.md` 全部待审核项由项目所有者人工批准 | 全部已登记视觉与行为差异 | **approved** |
| 2026-08-22 | 组件 chrome 改走 locale pack；dialog/command/tour/drawer/image 接入 OverlayController（焦点陷阱含 slot） | Showcase 浮层与分页/日历等 chrome | **否**（文案跟 `html lang`；视觉母版仍是冻结基线） |

若后续为修死链或假声明而改 `packages/**/src` 且影响渲染或交互，必须在此表追加行，并更新 `pending-visual-review.md`。

---

## 5. 验证证据（诚实债收口）

| 检查 | 命令 | 结果 | 证据 |
|------|------|------|------|
| typecheck | `pnpm --filter @bloret-crew/blora-design run typecheck` | ✅ exit 0（2026-08-02） | implementer scratch `phase9-honesty-typecheck.log` |
| unit | `pnpm --filter @bloret-crew/blora-design exec vitest run` | ✅ 91 tests passed（含 `docs-honesty.test.ts`） | implementer scratch `phase9-honesty-unit.log` |
| full `pnpm verify` | `pnpm verify` | ✅ exit 0（2026-08-09）；核心 121 tests、全 workspace 219 tests、Playwright 106 tests；build/publint/attw/size/pack 全通过 | 本地单次完整门禁输出 |

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
| 2026-08-02 | **进入 Phase 10**；过期 changesets 已清理；迁移指南升格为 monorepo 正文 |
| 2026-08-02 | 采纳外部审查：新增 **§3.0 Preflight**（verify/CI/publish/exports/体积/contract 治理）；Alpha 后置 |
| 2026-08-09 | 75 组件完成 58 CE / 17 intentional non-CE 收口；完整 `pnpm verify` 首次单次全绿 |
| 2026-08-09 | Showcase 组件目录重构：先交付 Accordion / Collapse 双组件原型，待用户确认后再扩展全量 |
| 2026-08-11 | Showcase 核心组件目录扩展完成并持续 manifest 对齐；当前 87/87，加入逐页运行时巡检与代表性视觉快照 |
| 2026-08-02 | Preflight 开场：lint/css/contracts/prettier/attw/CI aggregate/`test:visual` 诚实化；image 预览 token 化 |
| 2026-08-02 | Preflight 续：publish.yml 2.0、CI publint/attw、pack exports 遍历、size 展平、axe 真 project、QR mock、contract-stability 政策 |
| 2026-08-02 | Preflight：add-on pack/publint、markdown/qrcode CSS 进 dist、examples/basic、browser sort 测试对齐 ▲▼ |
| 2026-08-02 | CI 根因：`pnpm/action-setup` 秒挂 → corepack；lint:md 收窄 globs；**master CI 全绿** |
| 2026-08-02 | **2.0.0-alpha.1** 版本对齐 + CHANGELOG；tag `v2.0.0-alpha.1` 触发 monorepo publish |
| 2026-08-02 | npm 七包核验 + 安装演练；Issue 模板；`./auto` CE 入口 |
| 2026-08-02 | **Pre-Beta 包面**：JS 子路径、IIFE global、CEM/manifest/api-snapshot、llms、provenance opt-in；**未进入 §3.5 Beta 发版** |
| 2026-08-02 | §3.4 visual + lifecycle；§3.5 冻结/节奏/迁移/体积；完成 Beta 发布准备 |
| 2026-08-19 | known differences 全部人工批准；版本统一为 `2.0.0-beta.0`；完成 Beta 发布演练并打 tag |
| 2026-08-22 | 发版前收口批次：① QR 编码器升级为多分段（numeric/alphanumeric/kanji + ECI/mask 选项，DP 最优分段），对照参考实现全 mask 逐位一致；修掉旧编码器三个从未被验证的缺陷（finder 分隔环涂反、format 第二副本横/纵条位序错）；② form-associated 铺满 range/slider/search/upload/tags-input/otp（ElementInternals，内层原生控件在可用时不占名）；③ 覆盖层滚动锁从 body `position:fixed` 快照改为 `html{overflow:hidden}`（修复 Firefox 下 position:sticky 头部失去 scrollport 跳出的真实缺陷）；④ Speed Dial 触发激活改为宿主级事件委托 + 子树重建自愈（MutationObserver→rebind）+ 事件实例去重（修 Chromium 重复绑定导致的双重开合）；⑤ Firefox/WebKit 本地实测补录到 browser-matrix.md 附录；⑥ Thread 撰写区「编辑/预览」切换新增 segmented 同款滑动指示器（替换原静态背景切换）。门禁维持 Chromium 三 project 不变。 |
| 2026-08-22 | 核心 i18n：`t()` + `en` / `zh-CN`；浮层走 OverlayController（含 slot 焦点）；文档入口改为 Showcase |
| 2026-08-22 | 产品缺口收口：i18n 热更新、Drawer popover、QR 全版本编码器、Affix/Anchor/Markdown CE、部分 FA、framework.md 2.0、浏览器/a11y 记录；add-on 体积预算提至 136KiB（编码器 + 新 CE + locale 目录） |
| 2026-08-22 | 产品缺口收口：i18n 热更新、Drawer popover、QR 1–40 编码器、Affix/Anchor/Markdown CE、FA 主机、framework.md 2.0、浏览器/a11y 记录 |
| 2026-08-25 | 准备 `2.0.0-beta.1`：汇总 beta.0 后缺陷修复，统一七个发布包版本，补 CHANGELOG / 安装回滚记录，并同步 QR、FA、视觉矩阵文档真值。 |
