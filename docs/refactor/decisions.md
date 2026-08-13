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

## ADR-003: ESM-only 包，不提供 CJS 入口

**日期**：2026-07-29
**状态**：已采纳

### 背景

Spec §3.5 要求 ESM-first。根 `package.json` 设为 `"type": "module"`，包也设为 `"type": "module"`。arethetypeswrong 检测到 CJS 消费者无法直接 `require()` 包入口。

### 决策

2.0 核心包为 ESM-only。CJS 消费者需使用动态 `import()`。`arethetypeswrong` 使用 `--profile esm-only`，忽略 `node10` 和 `node16-cjs` 解析。未来如需 CJS 兼容，通过独立 `cjs` 入口或 wrapper 包提供，不降级主入口。

### 理由

- Spec 明确 ESM-first，现代 Node 22+ 和所有现代打包器原生支持 ESM。
- 提供双入口增加维护成本和包体积。
- CJS 消费者可用动态 import 作为 fallback。

---

## ADR-004: 包 exports 暂时只暴露主入口

**日期**：2026-07-29
**状态**：已采纳

### 背景

Spec §6.1 建议包 exports 包含 `./tokens.css`、`./foundations.css`、`./reset.css`、`./components/*`、`./auto` 等子路径。但 Phase 1 尚无任何 CSS 或组件产物，publint 会报错指向不存在的文件。

### 决策

Phase 1 阶段包 exports 只暴露 `.`（主入口）和 `./package.json`。随着 Phase 2（tokens）、Phase 3（foundations）、Phase 4+（components）逐步添加产物，再扩展 exports 子路径。

### 理由

- publint 要求 exports 指向的文件必须存在。
- 提前声明不存在的入口会误导消费者。
- 每个 Phase 独立扩展 exports 符合渐进式构建原则。

---

## ADR-005: 使用 arethetypeswrong esm-only profile

**日期**：2026-07-29
**状态**：已采纳

### 背景

arethetypeswrong 默认 strict profile 会将 ESM-only 包的 `cjs-resolves-to-esm` 标记为错误。

### 决策

使用 `--profile esm-only` 运行 arethetypeswrong，忽略 `node10` 和 `node16-cjs` 解析条件。

### 理由

- 见 ADR-003，包为 ESM-only，CJS 兼容不是目标。
- ESM 和 bundler 解析均通过即可。

---

## ADR-006: Token primitive 层使用 palette-specific 命名而非通用色阶

**日期**：2026-07-29
**状态**：已采纳

### 背景

Spec §7.2 的示例使用 `color.coral.600` 这样的色阶命名作为 primitive token。但 1.x 的 `blora.css` 没有使用色阶系统，而是直接用语义名称（如 `--blora-background: #FAF7F8`）。

### 决策

Primitive 层使用与 1.x token 名称对应的 palette-specific 命名（如 `color.coral.background`、`color.coral.primary`），而不是通用色阶。Semantic 层通过引用 primitive 层实现语义映射。每个 theme 文件覆写 primitive 层的颜色值。

### 理由

- 精确映射 1.x 事实来源，不引入 1.x 不存在的色阶概念
- theme 切换时只覆写 primitive 颜色值，semantic 引用自动跟随
- 避免人为推断 1.x 的单一 hex 值属于哪个色阶
- Phase 8 兼容层可以直接将 `--blora-background` 映射到 `--blora-color-coral-background`

---

## ADR-007: Table controller 推迟到 beta，Phase 7 只交付 CSS-only table

**日期**：2026-07-30  
**状态**：**已由后续工作取代**（superseded，2026-08-02）

### 背景

Spec §17.5 将 Table 拆成两层：CSS-only native table 和可选 headless controller（排序、选择、分页、虚拟化）。Spec 明确虚拟表格、列固定、列设置和拖拽排序属于 advanced，必须单独测试。

### 原决策（Phase 7）

Phase 7 只交付 CSS-only table 样式。`createTableController()` 曾计划推迟到 beta。

### 取代说明（Phase 9）

已实现 `createTableController` 主路径，并写入契约 / Story / `tests/v1-gaps.test.ts`：

- 排序（三态）、本地分页  
- 列设置（`data-blora-cols`）  
- 虚拟滚动（`data-blora-virtual`，轴 y / x / both）  
- **内置行选**（`data-blora-selectable`，注入 Blora checkbox，非业务拼装）

全量 Playwright 交互与视觉农场仍归 **Phase 10**，不改变「主路径已交付」的事实。

---

## ADR-008: Avatar 的 blora-pulse 动画定义在组件 CSS 内

**日期**：2026-07-30
**状态**：已采纳

### 背景

v1 的 `@keyframes blora-pulse` 定义在 `blora.css` 全局作用域。v2 按组件拆分 CSS，每个组件 CSS 独立加载。Avatar 的 `blora-dot[data-pulse]` 依赖此动画。

### 决策

将 `@keyframes blora-pulse` 定义在 `avatar.css` 内。由于 CSS `@keyframes` 是全局的（不受 `@layer` 隔离），当 `blora.css` 全量加载时不会有重复定义问题；当仅加载 `avatar.css` 子路径时动画也可用。

### 理由

- `@keyframes` 在 CSS 中是全局标识符，不受 `@layer` 或组件隔离影响。
- 将动画定义在使用它的组件 CSS 中，保持组件自包含。
- 全量 `blora.css` 加载时浏览器会合并同名 `@keyframes`，无副作用。

---

## ADR-009: compat 层通过 JS 运行时转换 class，而非复制组件 CSS

**日期**：2026-07-30
**状态**：已采纳

### 背景

Spec §23.1 定义了兼容等级 A（旧 markup 基本不改即可工作）。1.x 使用 `.blora-btn--primary` 等 BEM modifier class，2.0 使用 `data-variant="primary"` 等 data 属性。需要让旧 markup 在 2.0 中工作。

### 决策

compat/v1.css 只提供 token 变量映射（旧变量名指向新变量名），不复制组件 CSS。compat/v1.ts 的 `initV1Compatibility()` 在运行时扫描 DOM，将旧 class 名替换为新 class 名 + data 属性。

### 理由

- 复制组件 CSS 到 compat 层会导致大量样式重复，增加包体积。
- CSS 没有原生的 class 别名机制。
- JS 运行时转换只需 ~12 kB，且不进入 modern bundle。
- MutationObserver 确保动态添加的 DOM 也能被转换。
- 符合 Spec "compat 不进入 modern bundle" 的要求。

---

## ADR-010: codemod 和 migrate:check 作为独立 Node.js 脚本

**日期**：2026-07-30
**状态**：已采纳

### 背景

Spec §19.5-19.6 要求实现 codemod 和 migrate:check。需要选择实现方式。

### 决策

作为 `packages/blora-design/scripts/` 下的独立 Node.js 脚本实现，不依赖 TypeScript 编译。映射规则在 `mappings.ts`（运行时）和 `codemod.mjs`（构建时）中分别维护。

### 理由

- Node.js 脚本可直接 `npx` 运行，无需安装额外依赖。
- 不引入 jscodeshift 等重型 codemod 框架，保持零依赖。
- 正则表达式转换足以覆盖低风险自动转换（class 重命名、data 属性）。
- 复杂 DOM（Select、Table controller）只生成 TODO 报告，不做自动重写（Spec §19.6 要求）。
- mappings.ts 和 codemod.mjs 中的映射规则保持一致，未来可考虑提取为共享 JSON。

---

## ADR-011: Add-on 包作为独立 workspace 包而非核心包子路径

**日期**：2026-07-30
**状态**：已采纳

### 背景

Spec §9 要求将 Markdown、Thread、QRCode、Effects 从核心包拆出。Spec §5 的目录结构显示 `addons/` 在仓库根目录下。需要决定 add-on 的打包方式。

### 决策

每个 add-on 作为独立的 pnpm workspace 包，发布为独立的 npm 包（`@bloret-crew/blora-design-markdown` 等），而非核心包的子路径。add-on 包以 `@bloret-crew/blora-design` 为 peer dependency。

### 理由

- 独立包让用户按需安装，不增加核心包体积。
- 独立版本管理：add-on 可以有自己的发布节奏（beta -> stable）。
- Spec §17.6 要求 Markdown 安全策略独立，独立包让安全决策更明确。
- 核心包 exports 不被 add-on 污染。
- pnpm workspace 天然支持多包开发，无需额外配置。

---

## ADR-012: Markdown 解析器使用占位符保护链接和代码

**日期**：2026-07-30
**状态**：已采纳

### 背景

Markdown 行内解析中，链接替换后的 HTML 包含 `blora-md__a` 等 class 名，其中的 `__` 被斜体正则 `_([^_\n]+)_` 误匹配。类似地，行内代码也需要保护。

### 决策

使用 Unicode 私有区域字符 `\uE000` 作为占位符分隔符，在处理斜体/粗体之前将链接和代码替换为占位符，处理完后再恢复。

### 理由

- `\uE000` 是 Unicode 私用区域字符，不会出现在正常 Markdown 文本中。
- 不是控制字符，不触发 ESLint `no-control-regex` 规则。
- 占位符方式比修改斜体正则更可靠，不会影响正常的斜体解析。
- [ ] Firefox/WebKit CI 矩阵何时启用（Phase 1 暂只跑 Chromium）

---

## ADR-014: Beta 前 stable-core API 冻结与发版节奏

**日期**：2026-08-02  
**状态**：已采纳（文档：`docs/refactor/beta-api-freeze.md`）

### 决策

1. 发布 `2.0.0-beta.*` 起，主包公开 export / 稳定 CE / stable contract 表面进入冻结（见 beta-api-freeze.md）。  
2. Beta 期间默认只修缺陷与可加性 API；破坏性变更走 major 或明确弃用窗口。  
3. 宣传不把 experimental / contract `beta` 当作默认「全 stable」。  
4. 体积预算以 `check-size.mjs` 为准并在 Beta 前扩展关键子路径。

---

## ADR-013: 默认 headless controller + 少量 CE，而非全量 form-associated WC

**日期**：2026-08-02  
**状态**：已由 ADR-015 取代（superseded，2026-08-08）

### 背景

`Blora-Design-2.0-Refactor-Spec.md` 组件映射表中大量条目以 `<blora-*>` / form-associated Custom Element 为理想形态。实现与 `Agents.md` 约束为：**优先原生 HTML 语义，仅在复合交互时使用自定义元素**。Phase 4–9 交付以 `div`/`table`/`form` + `createXxxController` 为主；Select / Dialog 等为 CE。

### 决策

1. **2.0 默认公共形态** = 原生（或轻量 markup）+ headless controller + 组件 CSS。  
2. **CE / form-associated** 仅用于已交付且契约声明的组件（如 `blora-select`、`blora-dialog`），不作为「每个控件必须 FA WC」的门槛。  
3. 规格表中的 WC 形态视为 **可选未来增强**，不是 Phase 9 未完成项；推进 FA WC 需单独 ADR 与 Phase 10+ 排期。  
4. Add-on 包名以 monorepo 为准：`@bloret-crew/blora-design-*`（非规格示例中的短名 `@bloret-crew/blora-markdown`）。

### 理由

- 与 1.x 展示页 DOM / 迁移路径更贴近，利于 progressive enhancement 与 SSR 输出真实表格/表单。  
- 降低 Shadow DOM / form association 全覆盖的实现与测试成本。  
- 保持 Agents 规则一致，避免文档推荐与实现两套故事。

### 后果

- 文档（`guide.md`、根 README、`remaining-work.md`）以 controller 路径为推荐。  
- Phase 10 DoD 按 **已交付形态** 写浏览器/a11y 测试，不强制先 CE 化再测。

---

## ADR-015: 复合控件默认使用 light-DOM Custom Element 封装官方结构

**日期**：2026-08-08
**状态**：已采纳；取代 ADR-013 的默认公共形态

### 背景

ADR-013 将「CSS + 业务手写 BEM 内部树 + headless controller」作为默认路径。实践证明，这会让 Storybook、Showcase、业务项目和 AI 生成代码分别复制复合 DOM；任何缺失节点或虚构 class 都会静默退化为原生皮肤或裸布局，形成同一套 CSS 下的“两套脸”。结构测试和文档提醒只能发现部分错误，不能消除业务侧重复拼树的根因。

### 决策

1. **复合控件的默认公共形态改为 Custom Element**。CE 使用 light DOM 生成仓库维护的官方 BEM class 树，再绑定既有 `createXxxController`；组件 CSS、token 和 controller 仍为唯一视觉/行为实现。
2. 首批默认 CE 为：`blora-range`、`blora-datepicker`、`blora-timepicker`、`blora-search`、`blora-transfer`、`blora-accordion`、`blora-collapse`、`blora-command`、`blora-segmented`、`blora-tabs`，并与既有 `blora-select`、`blora-dialog` 一起由 `@bloret-crew/blora-design/auto` 注册。
3. Storybook 主故事、Showcase 和用户文档只走 CE API；已迁 CE 的 `createXxxController(root)` 不再由主包导出，直接手写复合 BEM 树由 contract 驱动门禁禁止。内部 controller 仅作为 CE 实现细节；1.x 迁移只能走显式 compat 包。
4. CE 只负责官方结构、属性映射、生命周期和 controller 绑定；禁止复制第二套组件样式，禁止通过 `innerHTML` 注入用户内容。
5. Form-associated Custom Element 分阶段推进。表单类 light-DOM CE 可依赖内部原生表单控件参与提交；是否升级为 `ElementInternals`/FA-WC 由后续逐组件合同与测试决定，不作为本次结构根治的前置条件。
6. 展示型或原生语义已足够的简单组件继续使用 HTML + CSS；本决策不要求全库每个 class 都变成 CE。

### 理由

- 开发者只需使用标签和声明式子项，不再复制 Story 的内部节点树。
- Story、Showcase 与业务项目复用同一个结构生成器，错误结构无法静默成为默认路径。
- light DOM 保持 token/主题继承、SSR 外壳和现有 CSS 选择器兼容，且能直接复用 controller，控制迁移成本。
- 未迁为 CE 的 Table / Form 等开放数据能力继续保留明确的 headless 出口；已迁组件不再暴露双重公共入口。

### 后果

- 新增 CE 属性、事件或子项语法必须更新对应 contract、API snapshot/CEM、Story 与浏览器测试。
- `auto` 与 `blora.global.js` 的 `autoDefine()` 必须注册完整默认 CE 集合。
- 文档中 ADR-013 的 headless-first 表述应删除或标为历史；已迁 CE 的旧手写树从一方消费面移除并由自动门禁阻止回归。
