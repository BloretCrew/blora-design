# Blora Design 2.0 — AI 项目交接文档（完整版）

> **文档目的**：把本仓库完整交接给**另一段 AI 对话 / 新 Agent**，使其能**准确无误**理解现状、进度、目录职责、禁忌、当前致命问题与已拍板的改进方向，并**按本文件引导的下一步行动**继续工程，而不是重新发明架构或破坏视觉基线。
> **写作日期**：2026-08-08（会话内工程状态为准）
> **仓库路径示例**：`D:\MyFiles\Documents\projects\blora-design-2`
> **维护**：重大架构/目录变更后必须更新本文件。

---

## 0. 给你（接任 AI）的强制阅读顺序

按顺序打开，**不要跳过 1–4**：

| 顺序 | 路径                                              | 读什么                                          |
| ---- | ------------------------------------------------- | ----------------------------------------------- |
| 1    | **本文件** `docs/handoff/AI-PROJECT-HANDOFF.md`   | 全貌 + 当前任务 + 禁忌                          |
| 2    | `AGENTS.md`（或根目录 `Agents.md`）               | 贡献/视觉基线铁律                               |
| 3    | `docs/refactor/remaining-work.md`                 | **进度唯一源**（主跟踪）                        |
| 4    | `docs/refactor/status.md`                         | 阶段摘要                                        |
| 5    | `docs/refactor/decisions.md`                      | 已有 ADR（含 **ADR-013**；见下文「方向变更」）  |
| 6    | `docs/guide.md`                                   | 2.0 **推荐用法**（人类开发者）                  |
| 7    | `docs/refactor/component-matrix.md`               | 组件迁移矩阵                                    |
| 8    | `packages/blora-design/contracts/*.contract.json` | 改组件前的 API 合同                             |
| 9    | `packages/blora-design/stories/*.stories.ts`      | **复合控件的真源 DOM**（比 showcase 更可信）    |
| 10   | `examples/showcase-v2/index.html`                 | 76/76 核心组件目录（单视图、同源 Preview/HTML） |
| 11   | `legacy/showcase-v1.html` + `legacy/v1/`          | **冻结** 1.x 视觉/行为母版，**禁止改**          |

**规格大部头（只作对照，不是现行实现真理）：**

- `Blora-Design-2.0-Refactor-Spec.md` — 早期完整重构规格；其中大量 **FA-WC 理想形态**与实现不一致，见 §12。

**不要当作现行推荐：**

- `docs/framework.md` 正文大量 **1.x** 历史罗列（顶部有 2.0 入口说明）。
- 根目录若出现旧 `blora.css` / `blora.js`（应在 `.trashes/`，见冻结规则）。
- **已删除**：`toast` 包路径与 `toast()` 公共 API（产品面为 `message` + `notify`）。

---

## 1. 一句话项目是什么

**Blora Design 2.0** 是一套 **token 驱动、无 React/Vue 运行时依赖** 的 Web UI 设计系统 monorepo：

- 包名：`@bloret-crew/blora-design`（核心）+ `@bloret-crew/blora-tokens` + 多个 `@bloret-crew/blora-design-*` add-on。
- 当前版本目标：**`2.0.0-alpha.1`**（预发布 / Phase 10）。
- 技术形态（**现行实现**）：
  - **CSS 组件**（BEM 风格 class + `data-*`）
  - **Headless controller**（`createXxxController(el)`）
  - **少量 Web Component**（如 `blora-select`、`blora-dialog`）
  - **服务 API**（`message` / `notify` 等）
- **视觉唯一母版**：冻结的 1.x 展示渲染（见 §3），**禁止**用其他 UI 框架默认皮肤或 AI「现代化」重画。

组织 / 许可：Apache-2.0；`pnpm` workspace；Node ≥ 22。

---

## 2. 进度与阶段（现状）

### 2.1 总状态（2026-08）

| 项目                                           | 状态                                    |
| ---------------------------------------------- | --------------------------------------- |
| Phase 0–9                                      | ✅ 仓库自限完成                         |
| Phase 10 预发布                                | 🔄 进行中（Preflight / 门禁 / 发布链）  |
| 正式 Stable `2.0.0`                            | ❌ 未到；以 `remaining-work.md` §3 为准 |
| 规格全书 DoD（每组件 Playwright/axe/视觉全勾） | ❌ 未达到                               |

**主跟踪文档（唯一进度源）：**
`docs/refactor/remaining-work.md`
`docs/refactor/status.md` 只作摘要并链到主表。

### 2.2 阶段一览

| 阶段     | 内容                                                    | 状态    |
| -------- | ------------------------------------------------------- | ------- |
| Phase 0  | 冻结 1.x、视觉基线、公共面清单                          | ✅      |
| Phase 1  | monorepo、TS、lint、test、CI、Storybook、publint        | ✅      |
| Phase 2  | DTCG tokens、主题、对比度                               | ✅      |
| Phase 3  | foundations（reset/base/layout/utilities）、@layer、RTL | ✅      |
| Phase 4  | 试点 Button → Dialog → Select                           | ✅      |
| Phase 5  | 表单与反馈（Field…Alert…；历史上含 Toast）              | ✅      |
| Phase 6  | 导航与浮层                                              | ✅      |
| Phase 7  | 数据与内容（Table/List…）                               | ✅      |
| Phase 8  | compat v1、codemod、migrate:check                       | ✅      |
| Phase 9  | 六个 add-on + 核心缺口（Table 行选/分页/虚拟等）        | ✅ 自限 |
| Phase 10 | Preflight、质量农场、Beta 政策                          | 🔄      |

### 2.3 近期会话内已做的重要产品变更（交接必知）

下列变更可能**尚未**完全写回 `remaining-work.md` 勾选，但代码已存在：

1. **Toast 产品面删除**
   - `toast()` / `./toast` 导出 / toast stories **已移除**。
   - 产品反馈服务 = **`message`（Ant 味顶部胶囊）+ `notify`（四角通知卡）**。
   - `message.success` / `.error`（→ danger）等 shorthand 已实现。

2. **Notification**
   - `notify()` 使用 **SVG 图标**（对齐 Storybook，不再用文字 `i`/`×`）。
   - 四角 placement **进出场动画**按角落方向分别滑入/滑出。
   - Showcase 提供四角按钮演示。

3. **Alert / Message / Table 选择列** 等视觉/对齐修复（历史会话）。

4. **Showcase v2 重写**
   - 路径：`examples/showcase-v2/index.html`。
   - 已按核心 `component-manifest.json` 覆盖 76/76 组件；浮动 Navbar + 正式 Sidebar Nav + 单组件内容区。
   - 每个组件只有一份 `<template>` 正式声明；Preview 懒克隆该声明，HTML 由同一 DOM 源序列化，避免两套示例漂移。
   - 复合组件只走 CE，Table/Form 只走正式 headless controller，Message/Notification 只走正式 service API。

5. **结构门禁测试**
   - `packages/blora-design/tests/showcase-v2-structure.test.ts`
   - 与 manifest 精确对齐、禁止 1.x/旧复合树、禁止未发布内部 class，并检查所需构建资产。
   - 浏览器门禁逐一切换并挂载 76 个页面，同时收集运行时异常；桌面和移动配置均覆盖。

6. **Composite CE 结构根治（2026-08-08）**
   - ADR-015 已取代 ADR-013 的默认 headless 推荐。
   - Range、Date/Time、Search、Transfer、Accordion/Collapse、Command、Segmented、Tabs 已由 light-DOM CE 生成官方树并复用原 controller。
   - `auto` / global `autoDefine()`、主 Story、Showcase、contracts 与 CE mount 门禁已同步到标签 API。

### 2.4 包与版本

| 包                                   | 说明                                                  |
| ------------------------------------ | ----------------------------------------------------- |
| `@bloret-crew/blora-design`          | 核心组件 CSS + controllers + 少量 CE + message/notify |
| `@bloret-crew/blora-tokens`          | DTCG token 源与生成                                   |
| `@bloret-crew/blora-design-thread`   | 会话线程 add-on                                       |
| `@bloret-crew/blora-design-markdown` | Markdown                                              |
| `@bloret-crew/blora-design-qrcode`   | QRCode                                                |
| `@bloret-crew/blora-design-effects`  | 文字动效等                                            |
| `@bloret-crew/blora-design-layout`   | 侧栏/锚点等                                           |
| `@bloret-crew/blora-design-theming`  | 色板 / color scheme                                   |

名称以各包 `package.json` 为准（规格里旧短名可能过时）。

---

## 3. 视觉基线与不可违反的约束

### 3.1 视觉母版

- **基准 commit**：`a148715d06ee9551cbee262ffae6ad377b564df6`
- **冻结展示页**：`legacy/showcase-v1.html`
- **冻结 1.x 源**：`legacy/v1/`（`blora.css` / `blora.js` / `blora.d.ts` / locales / svg）
- **基线截图**：`legacy/visual-baseline-light.png`、`legacy/visual-baseline-dark.png`
- **元数据**：`docs/refactor/visual-baseline.json`
- **差异登记**：`docs/refactor/known-differences.md`（仅允许登记过的 WCAG/RTL/bug 微调）

### 3.2 禁止（对 AI 尤其致命）

1. 从 git 历史 / 旧 npm / 隐藏分支 **抽样式** 当目标。
2. 以 Ant/MUI/其他框架默认 UI 当视觉目标。
3. AI 自行「现代化」重设计。
4. 只改文档宣称完成、不验渲染。
5. **用 `innerHTML` 写入用户内容**。
6. 组件 CSS **写死**色/间距/圆角/阴影/时长/z-index（必须用已登记 token）。
7. 未更新 **contract + API snapshot** 就加公共属性/事件/class/part/token。
8. 直接改 **生成物**（如 tokens `generated/`、部分 `dist/` 产物应以 build 为准）。
9. **改 `legacy/` 冻结内容**（除明确的基线流程外视为违规）。

### 3.3 图标约定

- **风格**：线性、约 **2px 描边**、圆端圆角（与 **Lucide** 同造型；v1 showcase 图标区写明此规范）。
- **不内置**整包图标字体；业务内联 SVG 或自引 lucide。
- 组件内置图标（如 backtop、部分 chevron）按 lucide-style path。
- **最高优先级**：Core、Add-ons、Storybook 与 Showcase 中，凡承担 UI 操作、状态或导航含义的图形，必须优先复用 `packages/blora-design/src/core/icons.ts` 的 `createBloraIcon()` Lucide 风格 SVG。库中缺少时先扩充统一图标库；禁止使用 Emoji、图标字体或 `‹`、`›`、`×`、`★`、`→`、`+` 等文本字形冒充图标。真实省略号、数学符号、快捷键和用户文本除外。

---

## 4. 架构现状（实现 vs 规格 vs 即将转向）

### 4.1 现行默认（代码 + guide）

```
业务 HTML（class + data-*）
    + createXxxController(root)   // 多数交互
    或 <blora-select> / <blora-dialog>  // 少量 CE
    + blora.css（@layer 聚合）或按组件 CSS
```

- **消息**：`message()` / `message.success()` → 顶部居中胶囊 `.blora-message`
- **通知**：`notify({ title, description, type, placement })` → `.blora-notification`
- **无 toast 产品名**（已删）

### 4.2 ADR-013（已由 ADR-015 取代）

路径：`docs/refactor/decisions.md` → **ADR-013 / ADR-015**

- 历史默认：**headless + 少量 CE**；该默认已 superseded。
- 当前默认：结构敏感的复合控件使用 **Composite CE + light DOM**；headless 手写树为 advanced/compat。
- 全员 FA-WC 仍为分阶段能力，不是结构根治的前置条件。

**产品方指示已落实（2026-08-08）：** ADR-015 已正式 supersede ADR-013 的默认推荐；后续新增复合控件继续遵循同一结构封装原则。

### 4.3 为何 Ant Design 很少出现 showcase 分叉

Ant 业务写的是 **组件 API**，内部 DOM 由库生成。
Blora 当前大量 **开放 BEM 内部结构给业务手写** → 演示页/AI 极易写错 → **同一套 CSS，第二套错误 HTML** → 看起来像「两套设计」。
这是 **交付模型问题**，不是 token 双轨。

---

## 5. Monorepo 顶层目录与文件

根目录主要项：

### 5.1 目录

| 路径                                  | 作用                               | 备注                                          |
| ------------------------------------- | ---------------------------------- | --------------------------------------------- |
| `packages/`                           | 可发布包：`blora-design`、`tokens` | 核心                                          |
| `addons/`                             | 六个 add-on 包源码                 | thread/markdown/qrcode/effects/layout/theming |
| `docs/`                               | 人类与 AI 文档                     | refactor/guide/migration/ai/handoff           |
| `examples/`                           | 可运行示例                         | `basic`、`showcase-v2`                        |
| `legacy/`                             | **冻结** 1.x 基线                  | **勿改业务逻辑/样式**                         |
| `scripts/`                            | 根级脚本                           | pack-test-addons、publint-addons              |
| `.github/`                            | CI workflows                       |                                               |
| `.changeset/`                         | Changesets 发版                    |                                               |
| `.agents/`                            | Agent 技能等                       | 如 verify skill                               |
| `.trashes/`                           | 迁移过程废弃物/备份                | **勿当现行 API**                              |
| `playwright-report/`、`test-results/` | 本地测试产物                       | 可 gitignore 类                               |
| `node_modules/`                       | 依赖                               | 生成                                          |

### 5.2 根文件

| 文件                                   | 作用                                                           |
| -------------------------------------- | -------------------------------------------------------------- |
| `package.json`                         | monorepo 脚本：`verify`、`build`、`test`、`storybook`、`attw`… |
| `pnpm-workspace.yaml`                  | workspace 成员                                                 |
| `pnpm-lock.yaml`                       | 锁文件                                                         |
| `tsconfig.base.json`                   | 共享 TS 配置                                                   |
| `vitest.config.ts`                     | 根 vitest（若有）                                              |
| `playwright.config.ts`                 | 浏览器/a11y/visual 项目                                        |
| `eslint.config.mjs`                    | ESLint                                                         |
| `.prettierrc.json` / `.prettierignore` | 格式化                                                         |
| `.stylelintrc.json`                    | CSS lint                                                       |
| `.markdownlint-cli2.jsonc`             | Markdown lint                                                  |
| `AGENTS.md`                            | **贡献铁律**（AI 必读）                                        |
| `README.md`                            | 仓库简介 / 2.0 快速开始                                        |
| `CHANGELOG.md`                         | 变更日志                                                       |
| `LICENSE` / `NOTICE`                   | 许可                                                           |
| `llms.txt`                             | LLM 索引入口                                                   |
| `Blora-Design-2.0-Refactor-Spec.md`    | 早期完整规格（对照用，非现行真理）                             |
| `gpt-reply.md`                         | 历史讨论痕迹                                                   | **非规范** |
| `.gitignore`                           | 忽略规则                                                       |

### 5.3 常用命令

```bash
# 安装
pnpm install

# 生成 tokens + 构建所有包（showcase 依赖 dist CSS！）
pnpm build
# 或仅核心：
pnpm --filter @bloret-crew/blora-design build

# ⚠️ 禁止只跑 vite build 而不跑 copy-tokens：会 emptyOutDir 清掉 dist CSS，演示页全裸

# 单元测试
pnpm --filter @bloret-crew/blora-design test
pnpm --filter @bloret-crew/blora-design exec vitest run tests/showcase-v2-structure.test.ts

# Storybook（组件真源 UI）
pnpm --filter @bloret-crew/blora-design storybook
# 默认 :6006

# 全景演示（需先 full build）
python -m http.server 8765
# 打开 http://127.0.0.1:8765/examples/showcase-v2/

# 全量门禁（重）
pnpm verify
```

**构建陷阱（已踩过）：**
`packages/blora-design` 的 vite `emptyOutDir: true`。
只执行 `vite build` / `vite.global` **不跑** `copy-tokens.mjs` → `dist/blora.css` 与组件 CSS **消失** → showcase 全无样式。
**永远用 package 的 `pnpm ... build` 全脚本。**

---

## 6. `packages/tokens` — 设计令牌

| 路径                                       | 作用                                     |
| ------------------------------------------ | ---------------------------------------- |
| `packages/tokens/src/`                     | Token 源（DTCG / 主题定义等）            |
| `packages/tokens/generated/`               | **生成物** tokens.css / dark / themes 等 |
| `packages/tokens/scripts/build-tokens.mjs` | 生成器入口（根 `build:tokens` 调用）     |
| `packages/tokens/tests/`                   | 对比度、契约等检查                       |
| `package.json`                             | `@bloret-crew/blora-tokens`              |

**规则：** 改视觉色/间距 → 改 token 源再生成，**不要**在组件 CSS 写死色值。

---

## 7. `packages/blora-design` — 核心包（最重要）

### 7.1 顶层

| 路径                                               | 作用                                                               |
| -------------------------------------------------- | ------------------------------------------------------------------ |
| `src/`                                             | 源码                                                               |
| `stories/`                                         | Storybook 故事（**复合控件 DOM 真源**）                            |
| `contracts/`                                       | 每组件 `*.contract.json`（**公共 API 合同**）                      |
| `schemas/`                                         | contract schema                                                    |
| `tests/`                                           | Vitest 单测 + 结构门禁                                             |
| `scripts/`                                         | 构建/检查/codemod/manifest                                         |
| `.storybook/`                                      | Storybook 配置（preview 里 import 全量组件 CSS）                   |
| `package.json`                                     | exports 面（CSS 子路径、JS 子路径、global）                        |
| `vite.config.ts`                                   | 库构建多 entry（index、auto、compat、button/select/dialog/table…） |
| `vite.global.config.ts`                            | `blora.global.js` IIFE → `window.Blora`                            |
| `component-manifest.json` / `custom-elements.json` | 清单（构建会刷新）                                                 |
| `dist/`                                            | **构建输出**（gitignore 与否以仓库为准；开发/showcase 依赖它）     |
| `README.md`                                        | 包说明                                                             |

### 7.2 `src/` 结构

| 路径                                         | 作用                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/index.ts`                               | **主 ESM 导出**（controllers、message、notify、define*…）                            |
| `src/auto.ts`                                | side-effect：注册稳定 CE                                                             |
| `src/blora.css`                              | 源侧聚合入口（layer 声明 + import foundations/tokens；**完整组件列表在 dist 组装**） |
| `src/build-globals.d.ts` / `css-inline.d.ts` | 构建类型辅助                                                                         |
| `src/foundations/`                           | reset / base / layout / utilities                                                    |
| `src/components/<name>/`                     | 每组件：`*.css`、可选 `*.ts`、`index.ts`                                             |
| `src/core/`                                  | `BloraElement` 基类等 CE 基础设施                                                    |
| `src/controllers/`                           | 共享 controller（如 `overlay-controller`）                                           |
| `src/entries/`                               | 分包 entry：button、select、dialog、table、global                                    |
| `src/compat/v1/`                             | 1.x class/token 兼容层                                                               |

### 7.3 典型组件目录模式

```
src/components/range/
  range.css      # 样式（认 .blora-range__track 等）
  range.ts       # createRangeController
  index.ts       # 再导出
```

**CSS-only 组件**可能只有 css。
**CE 组件**（select/dialog）含自定义元素类。
**服务**（message/notification）含命令式 API。

### 7.4 已废弃 / 删除（标明）

| 项                                                  | 状态                                            |
| --------------------------------------------------- | ----------------------------------------------- |
| `toast` 组件目录 / `toast()` API / `./toast` export | **已删除**                                      |
| `stories/toast.stories.ts`                          | **已删除**                                      |
| `contracts/toast.contract.json`                     | **已删除**                                      |
| 产品名 Toast                                        | **废弃**；用 Message + Notification             |
| 根级历史 `blora.js` 业务堆叠                        | **禁止**；1.x 只在 `legacy/v1`                  |
| ADR-013「永远 headless 默认」                       | **已由 ADR-015 取代**；手写树为 advanced/compat |

### 7.5 关键 scripts（`packages/blora-design/scripts/`）

| 脚本                     | 作用                                                                      |
| ------------------------ | ------------------------------------------------------------------------- |
| `copy-tokens.mjs`        | 拷 tokens + foundations + **所有组件 CSS** 到 dist，组装 `dist/blora.css` |
| `generate-manifests.mjs` | 生成 component-manifest / 相关清单                                        |
| `check-contracts.mjs`    | contract 校验                                                             |
| `check-size.mjs`         | 体积预算                                                                  |
| `codemod.mjs`            | 迁移 codemod                                                              |
| `migrate-check.mjs`      | 迁移检查                                                                  |
| `pack-test.mjs`          | pack 冒烟                                                                 |
| `build-tokens.mjs`       | （若存在）tokens 相关                                                     |

### 7.6 测试

| 路径                                  | 作用                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| `tests/*.test.ts`                     | 单元 / 诚实文档 / v1 gaps 等                                                 |
| `tests/showcase-v2-structure.test.ts` | **Showcase 结构门禁**（section、禁止 1.x、禁止假 range、transfer/mockup 等） |
| Playwright（根 config）               | browser / a11y / visual（Phase 10 农场方向）                                 |

---

## 8. 组件清单（`src/components`，约 75）

下列均为目录名（各有 css ± ts）。**完整行为以 contract + story + 源码为准。**

accordion, alert, autocomplete, avatar, backtop, badge, banner, breadcrumb, button, calendar, card, carousel, cascader, chart-container, chat, checkbox, collapse, color-picker, command-palette, comment, copy, datepicker, deck, descriptions, dialog, dock, drawer, dropdown, empty, fab, field, form, image, input, list, masonry, megamenu, mentions, **message**, mockup, navbar, **notification**, otp, pagination, popconfirm, popover, progress, radio, **range**, rate, result, **search**, segmented, **select**, skeleton, slider, speed-dial, spinner, splitter, statistic, steps, switch, **table**, tabs, tag, tags-input, textarea, timeline, **timepicker**, tooltip, tour, **transfer**, tree, tree-select, upload

**加粗** = 近期与「DOM 真源 / 服务 API / 演示事故」强相关。

**分类心智：**

- **CSS 单层**：button、tag、badge、alert（静态结构）…
- **Headless 复合**（易拼错）：range、datepicker、timepicker、transfer、search、accordion、command、tabs…
- **CE**：select、dialog（及未来根治对象）
- **服务**：message、notification（notify）
- **Table**：`createTableController` + `data-blora-selectable` 等

---

## 9. `addons/` — 扩展包

每个 add-on 大致：

```
addons/<name>/
  src/
  contracts/   # 若有
  tests/
  package.json
  dist/        # 构建后
```

| 包目录     | 能力摘要                                 |
| ---------- | ---------------------------------------- |
| `thread`   | 对话线程 UI controller                   |
| `markdown` | Markdown 渲染                            |
| `qrcode`   | 二维码                                   |
| `effects`  | 文字动效、watermark 等                   |
| `layout`   | sidebar、affix、anchor、smooth-scroll 等 |
| `theming`  | 色板、`applyColorScheme` 等              |

Story 按 daisyUI 式目录归类（`packages/blora-design/taxonomy.json`）：操作 / 数据展示 / 导航 / 反馈 / 数据输入 / 布局 / 样机。Add-on 能力并入对应分组，不再单独开 Add-ons 顶栏。

---

## 10. `docs/` — 文档地图

### 10.1 顶层

| 文件                                 | 作用                          | 可信度           |
| ------------------------------------ | ----------------------------- | ---------------- |
| `docs/guide.md`                      | **2.0 主用法**                | 高（现行推荐）   |
| `docs/framework.md`                  | 历史 1.x 大全 + 顶部 2.0 入口 | 中低（正文 1.x） |
| `docs/standards.md`                  | 设计/token/a11y 标准          | 高               |
| `docs/handoff/AI-PROJECT-HANDOFF.md` | **本交接文档**                | 本文件           |

### 10.2 `docs/refactor/`

| 文件                                             | 作用                                    |
| ------------------------------------------------ | --------------------------------------- |
| `remaining-work.md`                              | **进度唯一源**                          |
| `status.md`                                      | 阶段摘要                                |
| `decisions.md`                                   | ADR 集（ADR-015 取代 ADR-013 默认推荐） |
| `component-matrix.md`                            | 组件状态矩阵                            |
| `known-differences.md`                           | 1.x/2.x 已知差异                        |
| `visual-baseline.json`                           | 基线元数据                              |
| `v1-public-surface.json`                         | 1.x 公共面清单                          |
| `v1-css-inventory.json` / `v1-js-inventory.json` | 1.x 清单                                |
| `css-only-resolution.md`                         | CSS-only 决议说明                       |
| `contract-stability.md`                          | 契约稳定性                              |
| `beta-api-freeze.md` / `beta-cadence.md`         | Beta 政策                               |
| `addon-core-gaps.md`                             | add-on/核心缺口                         |
| `pending-visual-review.md` / `visual-review.md`  | 视觉审查记录                            |
| `mobile-audit-2026-08-03.md`                     | 移动审计                                |
| `alpha-install-notes.md`                         | Alpha 安装                              |
| `showcase-postmortem/`                           | showcase 翻车事后分析（含坏文件备份）   |

### 10.3 `docs/migration/`

| 文件                  | 作用         |
| --------------------- | ------------ |
| `v1-to-v2.md`         | 迁移指南     |
| `token-map-v1-v2.csv` | token 映射表 |

### 10.4 `docs/ai/`

| 文件                 | 作用      |
| -------------------- | --------- |
| `anti-patterns.md`   | AI 反模式 |
| `migration-rules.md` | 迁移规则  |
| `task-recipes.md`    | 任务配方  |

---

## 11. `examples/` — 示例

| 路径                              | 作用                                    |
| --------------------------------- | --------------------------------------- |
| `examples/basic/`                 | 最小 ESM 示例（table + message 等）     |
| `examples/basic/README.md`        | 说明                                    |
| `examples/showcase-v2/index.html` | **全景演示页**（v1 章节结构 + 2.0 API） |
| `examples/showcase-v2/README.md`  | 如何 build / 起服务 / 结构测试          |

**Showcase 依赖：**

```html
<link href="../../packages/blora-design/dist/blora.css">
<script src="../../packages/blora-design/dist/blora.global.js">
```

必须先 **完整** `pnpm --filter @bloret-crew/blora-design build`。

**结构测试：**
`packages/blora-design/tests/showcase-v2-structure.test.ts`

---

## 12. `legacy/` — 冻结基线（只读）

| 路径                           | 作用                                      |
| ------------------------------ | ----------------------------------------- |
| `legacy/showcase-v1.html`      | 1.x 完整展示页（章节大纲参考 + 视觉母版） |
| `legacy/v1/blora.css`          | 1.x 样式                                  |
| `legacy/v1/blora.js`           | 1.x 行为                                  |
| `legacy/v1/blora.d.ts`         | 1.x 类型                                  |
| `legacy/v1/locales/`           | 1.x i18n                                  |
| `legacy/v1/bloret-mini.svg`    | 品牌                                      |
| `legacy/visual-baseline-*.png` | 基线截图                                  |

**图标（v1 文案）：** 线性、2px、圆端；建议 SVG 内联；造型对齐 Lucide。

---

## 13. 已根治的历史核心问题（必须防回归）

### 13.1 现象

- Storybook 中控件正确，但旧 Showcase / 手写业务 HTML 曾经频繁生成错误结构。
- 当前 Showcase 已改为 76 组件正式 API 目录；结构、浏览器和视觉门禁用于防止假 DOM 回流。
- 用户目标：**避免 v1 的「演示一套、真用一套」**；若 showcase 再歪，品牌与多项目迁移会崩。

### 13.2 根因（不是 token 双轨）

```
样式系统（一套 blora.css）
        ↑ 只认正确 class 树
手写 HTML（第二套、易错）  ← 断点在这里
```

- **Ant 等**：业务用 `<Slider />`，内部 DOM 库生成 → 几乎无「第二套 HTML」。
- **Blora 现状**：开放 BEM 内部结构 + headless → 业务/AI/演示 **必须拼对树**，否则静默退化成原生或裸布局。

### 13.3 次生事故

| 事故                      | 原因                                                   |
| ------------------------- | ------------------------------------------------------ |
| Showcase 全页无样式       | 只 vite build，未 copy-tokens，`dist/blora.css` 被清空 |
| `message` 弹出像 toast 卡 | 旧 `message`≡`toast`；已改为胶囊服务并删 toast         |
| notify 图标简陋           | 服务曾用文字 glyph；已改 SVG                           |
| 演示页结构测试            | 已加，但 **不能单独根治业务项目**                      |

### 13.4 用户（产品方）最新决策意图

1. **可以推翻 ADR-013 的「默认永远 headless」**。
2. 要 **根治不统一**，开发者 **最省心**，**严格设计风格**，工作量可接受。
3. 认可 **A 方向：结构封装（Composite CE / mount 生成 DOM）**，而非只靠演示纪律。
4. FA-WC 全面化与 A **同向不同合同**；根治优先 **封装结构**，FA 按表单需要第二阶段。

---

## 14. 建议的解决方向（给下任的执行纲领）

### 14.1 目标架构（推荐拍板）

**对外：Custom Element 为主（复合控件）**
**对内：复用现有 CSS class 树 + 现有 controller 逻辑**
**文档/Showcase：只展示 CE（或 mount API）**
**Headless 手写树：降级 advanced/compat**
**FA：表单类 CE 增强，非第一天全家桶**

示例目标 API：

```html
<link rel="stylesheet" href=".../blora.css" />
<script type="module">
  import "@bloret-crew/blora-design/auto"; // 注册全部 CE
</script>

<blora-range min="0" max="100" values="25,70"></blora-range>
<blora-datepicker name="d"></blora-datepicker>
<blora-search placeholder="搜索"></blora-search>
<blora-transfer></blora-transfer>
```

### 14.2 推荐实施顺序

1. **新 ADR**（supersede ADR-013 默认推荐）
   - 默认公共形态 = Composite CE（light DOM 灌官方树 + 内嵌 controller）
   - 手写 BEM 复合树 = 非默认
2. **样板 CE（必须做透）**
   - `blora-range`、`blora-datepicker`（已反复踩坑）
   - connectedCallback 生成与 story 一致的 DOM，再调现有 controller
3. **批量高风险控件**
   timepicker, search, transfer, accordion, collapse, tabs, segmented, command-palette, upload, tree…
4. **`auto` / `defineAll` 扩全**
5. **Storybook 删除「仅手写树」主故事**（或标 legacy）
6. **Showcase 全部改为 CE**
7. **可选：`createXxxController` 入口 ensureStructure + dev 报错**
8. **表单 FA 补强**（name/value/FormData）
9. **多项目：`blora check` CLI / codemod**

### 14.3 明确不要做的「假根治」

- 只修 showcase、不加封装
- 只写文档「请对照 Storybook」
- 第一天全量 Shadow + 全员 FA 拖死发布
- 破坏视觉基线去「更像 Ant 的默认主题色」

### 14.4 成功标准

- 新项目开发者 **无需**阅读 BEM 内部树即可做出正确 UI。
- AI 生成代码优先输出 **标签 API**，无法静默退化成原生 range/date。
- Showcase 与 Storybook **同源组件**，结构测试 + 抽样视觉通过。
- 多项目迁移 = 装包 + auto + css，而不是拷贝 HTML 范本。

---

## 15. 关键文件：公共 API 入口

### 15.1 CSS

- 全量：`@bloret-crew/blora-design/blora.css` → `dist/blora.css`（@import 链）
- 按需：`@bloret-crew/blora-design/components/<name>.css`
- Tokens：`tokens.css` / `tokens.dark.css` / `tokens.themes.css`
- Foundations：经 blora.css 或单独 foundations

**Layer 顺序**（不可打乱）：tokens → reset → base → components → utilities。
不要重复 link tokens + 全量 blora.css 导致 layer 爆炸（showcase 注释已警告）。

### 15.2 JS

- ESM：`import { createTableController, message, notify, defineBloraSelect, defineBloraDialog, ... } from "@bloret-crew/blora-design"`
- Auto CE：`import "@bloret-crew/blora-design/auto"`
- Global：`blora.global.js` → `window.Blora`（showcase 使用）
- 子路径 entry：`./button` `./select` `./dialog` `./table`（**无 ./toast**）

### 15.3 契约

改任何公共 class/属性/事件前：

1. 读 `contracts/<name>.contract.json`
2. 改实现
3. 更新 contract + 生成 manifest/snapshot（按包脚本）
4. 更新 story + 测试

---

## 16. Storybook vs Showcase vs Legacy（给 AI 的导航）

| 场景                             | 去哪                                           |
| -------------------------------- | ---------------------------------------------- |
| 「这个控件正确 DOM 长什么样？」  | `packages/blora-design/stories/<x>.stories.ts` |
| 「公共 API 允不允许？」          | `contracts/<x>.contract.json`                  |
| 「全站拼起来什么样？」           | `examples/showcase-v2/`（须 full build）       |
| 「1.x 视觉母版？」               | `legacy/showcase-v1.html` 渲染结果             |
| 「进度做到哪？」                 | `docs/refactor/remaining-work.md`              |
| 「为什么不能改成 Material 风？」 | `AGENTS.md` 视觉基线                           |

**优先级冲突时：**
视觉基线 > contract > story 真源 DOM > guide 推荐 > showcase 现状 > 规格理想 FA 表 > framework.md 1.x 正文。

---

## 17. `.trashes/` — 废弃物（标明）

历史迁移/清理备份，**不是现行公共 API**。可能含：

- `root-v1-leftovers` — 根目录旧 blora 残留
- `core-migrated-to-addons`
- `phase-docs` / `phase-scripts` / `phase10-entry-cleanup`
- `scratch-issues` / `verify-shots`
- `README.md` 说明

需要考古时再看；**禁止**从中恢复「官方推荐路径」。

---

## 18. 接任 AI 的「第一个工作日」清单

### 必做理解

- [ ] 读完本文件 §0–§4、§12–§14
- [ ] 打开 ADR-013，并记住 **产品方要 supersede 默认 headless**
- [ ] 跑通：`pnpm --filter @bloret-crew/blora-design build`
- [ ] 打开 Storybook Forms/Range 与 showcase Range 对比心智
- [ ] 跑：`vitest run tests/showcase-v2-structure.test.ts`

### 建议的第一个工程任务（根治启动）

1. 撰写 **新 ADR：Composite CE 为默认公共形态**（supersede ADR-013 的默认推荐段落）。
2. 实现 **`blora-range` CE 样板**：
   - 内部生成与 `stories/range.stories.ts` 一致的 DOM
   - 复用 `createRangeController`
   - Story 改为只演示 CE
   - Showcase 只使用 `<blora-range>`
3. 同样样板化 **`blora-datepicker`**。
4. 扩展 `auto.ts` 注册。
5. 更新 `guide.md` 主路径。
6. 将 headless 手写树标为 advanced。

### 禁止的第一个任务

- 大刷视觉主题色「更现代」。
- 重写整库 React 封装当唯一解。
- 删除 `legacy/`。
- 只改 showcase 宣称「根治完成」。

---

## 19. 风险与矛盾清单

| 风险                            | 说明                                                            |
| ------------------------------- | --------------------------------------------------------------- |
| 规格 FA-WC vs ADR-013 vs 新方向 | 以 **产品最新意图 + 新 ADR** 为准；更新 remaining-work 诚实说明 |
| 体积与复杂度                    | CE 全面化增加 JS；用 light DOM + 复用 controller 控制成本       |
| SSR / SEO                       | light DOM 可服务端输出外壳；完整交互仍需 hydrate/define         |
| 破坏性变更                      | 主版本 alpha 可迁；需 changelog + 迁移表「旧树 → 标签」         |
| Showcase 再回归                 | 结构测试 + 最终只许 CE                                          |
| dist 丢失 CSS                   | 永远 full package build                                         |

---

## 20. 术语表

| 术语                | 含义                                              |
| ------------------- | ------------------------------------------------- |
| Contract            | `contracts/*.contract.json` 公共 API 合同         |
| Headless controller | `createXxxController(el)`，假定 el 内已有正确 DOM |
| CE                  | Custom Element                                    |
| FA-WC               | Form-Associated Custom Element                    |
| Composite           | 多节点内部结构控件                                |
| Token               | `--blora-*` 设计变量                              |
| Showcase            | `examples/showcase-v2` 全景页                     |
| Legacy              | 冻结 1.x                                          |
| Message             | 顶部胶囊反馈服务 + `.blora-message`               |
| Notification        | 四角通知卡 + `notify()`                           |
| Toast               | **已删除** 的旧产品名                             |

---

## 21. 目录树速查（精简）

```
blora-design-2/
├── AGENTS.md                 # 铁律
├── package.json              # monorepo 脚本
├── packages/
│   ├── tokens/               # 令牌源 + generated
│   └── blora-design/         # 核心设计系统
│       ├── src/components/*  # 组件
│       ├── stories/*         # Storybook 真源 DOM
│       ├── contracts/*       # API 合同
│       ├── tests/*           # 单测 + showcase 结构门禁
│       └── scripts/*         # copy-tokens 等
├── addons/*                  # 6 个扩展包
├── examples/
│   ├── basic/
│   └── showcase-v2/          # 全景演示（曾 DOM 分叉）
├── legacy/                   # 冻结 1.x 基线
├── docs/
│   ├── guide.md
│   ├── refactor/             # remaining-work = 进度源
│   ├── migration/
│   ├── ai/
│   └── handoff/              # 本交接文档
├── scripts/                  # 根脚本
└── .trashes/                 # 废弃备份
```

---

## 22. 交接确认（给人类与 AI）

若你是接任 AI，请在开始改代码前用一句话回复人类确认：

> 已理解：Blora 2.0 monorepo、视觉基线不可违、当前 Phase 10；致命问题是 **手写复合 DOM 导致与 Storybook/设计不一致**；产品要求 **以 Composite CE 封装 DOM 根治**，可 supersede ADR-013 默认 headless；下一步从 **新 ADR + range/datepicker CE 样板** 开始，而非只修 showcase。

然后执行 §18。

---

## 23. 文档维护

| 何时更新本文件                |
| ----------------------------- |
| 新 ADR 落地                   |
| toast/message 级公共 API 再变 |
| showcase 生成方式改变         |
| Phase 10 关键或 Beta 发布     |
| 目录大迁移                    |

**文件路径：** `docs/handoff/AI-PROJECT-HANDOFF.md`

---

_End of handoff document._
