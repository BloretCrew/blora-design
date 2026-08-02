# 重构状态

> Blora Design 2.0 重构进度跟踪。每个阶段完成后更新此文件。

## 当前阶段

**Phase 9：Add-ons** - 🔄 扩包中（见 `docs/refactor/addon-core-gaps.md`）

## 阶段进度

| 阶段 | 状态 | 说明 |
|---|---|---|
| Phase 0：冻结与基线 | ✅ 完成 | 冻结 1.x 行为事实、捕获公共 API、生成视觉基线 |
| Phase 1：Workspace 与门禁 | ✅ 完成 | pnpm workspace、TS strict、lint、test、CI、Storybook、publint |
| Phase 2：Token | ✅ 完成 | DTCG 三层 token、确定性生成器、9 套主题、v1 映射、对比度门禁 |
| Phase 3：Foundations | ✅ 完成 | reset、base、layout、utilities、@layer、RTL、reduced-motion |
| Phase 4：三个试点组件 | ✅ 完成 | Button -> Dialog -> Select |
| Phase 5：核心表单和反馈 | ✅ 完成 | Field/Input/Checkbox/Radio/Switch/Tag/Alert/Badge/Progress/Spinner/Skeleton/Toast |
| Phase 6：导航与浮层 | ✅ 完成 | Tabs/Breadcrumb/Pagination/Dropdown/Tooltip/Popover/Drawer/Navbar |
| Phase 7：数据与内容基础 | ✅ 完成 | Card/Table/List/Accordion/Timeline/Empty/Result/Avatar |
| Phase 8：兼容层与 Codemod | ✅ 完成 | Token/class 映射、event 别名、warning、codemod、migrate:check、fixtures |
| Phase 9：Add-ons | 🔄 进行中 | Thread/Markdown/QRCode/Effects/Layout/Theming；对照 docs/refactor/addon-core-gaps.md |
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

### 已提交

- [x] 提交 Phase 0（commit `24b6003`）

## Phase 1 详细进度

### 已完成

#### Workspace 结构（Spec §5.1-5.2）

- [x] pnpm workspace（`pnpm-workspace.yaml`，含 `apps/*`、`packages/*`、`addons/*`）
- [x] 根 `package.json` 改为 monorepo root（`@bloret-crew/blora-design-monorepo`，private，ESM）
- [x] 包 `packages/blora-design/`（`@bloret-crew/blora-design`，2.0.0-alpha.0，ESM）

#### TypeScript（Spec §5.3）

- [x] `tsconfig.base.json`：strict、noUncheckedIndexedAccess、exactOptionalPropertyTypes、useDefineForClassFields、verbatimModuleSyntax、isolatedModules、skipLibCheck=false
- [x] 包级 `tsconfig.json`（extends base）
- [x] 包级 `tsconfig.lint.json`（含 tests/stories 用于 ESLint typed linting）

#### Lint（Spec §5.4）

- [x] ESLint（flat config，含 typescript-eslint）
  - `no-console` error（允许 warn/error）
  - `@typescript-eslint/no-floating-promises` error（typed linting）
  - `@typescript-eslint/no-explicit-any` error
  - `no-unsanitized/method` + `no-unsanitized/property` error（禁止 innerHTML 写入未可信字符串）
  - `no-eval` + `no-new-func` error
  - `prefer-const` + `no-var` error
- [x] Stylelint（含 `custom-property-pattern: ^blora-[a-z0-9-]+$`、selector-class-pattern）
- [x] Prettier（`.prettierrc.json`、`.prettierignore`）
- [x] Markdown lint（`markdownlint-cli2`，`.markdownlint-cli2.jsonc`）
- [x] `publint`
- [x] `arethetypeswrong`（`--profile esm-only`）

#### 测试（Spec §20）

- [x] Vitest（jsdom 环境，包级 `vitest.config.ts`）
- [x] Playwright（chromium + mobile-chromium + a11y projects）
- [x] 单元测试 stub（`tests/package.test.ts`：VERSION + isBrowser）
- [x] 浏览器 smoke 测试（`tests/browser/smoke.spec.ts`：Storybook loads）
- [x] Pack fixture 测试（`scripts/pack-test.mjs`：npm pack + install tgz + ESM import + SSR import）

#### Storybook（Spec §18）

- [x] Storybook web-components-vite 配置（`.storybook/main.ts`）
- [x] Preview 配置（`.storybook/preview.ts`：light/dark backgrounds、a11y）
- [x] Version story stub（`stories/version.stories.ts`）

#### CI（Spec §24）

- [x] `.github/workflows/ci.yml`：lint-type、unit、build-package、browser、aggregate（required）

#### Changesets（Spec §24.4）

- [x] `.changeset/config.json`
- [x] 初始 changeset（`.changeset/establish-workspace.md`）

#### AI 契约文件（Spec §19）

- [x] `llms.txt`（系统定位、安装、入口、禁止事项）
- [x] `docs/ai/migration-rules.md`（class/event/data-attribute 映射 stub）
- [x] `docs/ai/anti-patterns.md`（禁止事项清单）
- [x] `docs/ai/task-recipes.md`（AI 操作食谱）
- [x] `packages/blora-design/schemas/component-contract.schema.json`
- [x] `packages/blora-design/scripts/check-contracts.mjs`（stub）

#### 脚本（Spec §5.1）

- [x] `pnpm verify`：lint + lint:css + lint:contracts + lint:md + format:check + typecheck + test + build + publint + attw + test:browser + size
- [x] `pnpm format` / `pnpm format:check`
- [x] `pnpm lint:md`
- [x] `pnpm lint:contracts`
- [x] `pnpm publint` / `pnpm attw`
- [x] `pnpm test:a11y` / `pnpm test:visual`（Playwright project 选择器）
- [x] 包级 `build:tokens`（stub）、`size`（stub）、`pack:test`

### 验收

- [x] 空的新架构可以完整 build/test
- [x] 现有 legacy 文件不阻塞 lint（明确 ignore）
- [x] CI required checks 可运行
- [x] 没有迁移业务组件
- [x] `pnpm verify` 全部通过

### 已提交

- [x] 提交 Phase 1（commit `838c92b`）

## Phase 2 详细进度

### 已完成

#### Token 源与包结构（Spec §7.1-7.2）

- [x] 创建内部 workspace 包 `packages/tokens/`（`@bloret-crew/blora-tokens`）
- [x] Primitive：color、dimension、duration、typography、shadow
- [x] Semantic：color-light、color-dark、typography、motion、layout
- [x] Component token 目录预留给 Phase 4+
- [x] Themes：coral、cinnabar、indigo、lotus、ocean、graphite、mono、circuit、dusk
- [x] 9 套主题值由一次性迁移脚本直接从冻结的 `legacy/v1/blora.css` 提取

#### 确定性生成器（Spec §7.6）

- [x] 校验 `$type` / `$value` 与允许的 token 类型
- [x] 校验引用存在并检测真实循环引用
- [x] 生成 `tokens.css`、`tokens.dark.css`、`tokens.themes.css`
- [x] 生成可执行 `tokens.js`、类型声明 `tokens.d.ts`、源码参考 `tokens.ts`
- [x] 生成确定性的 `token-manifest.json` 与 `tokens.json`（不含时间戳）
- [x] CSS 变量统一为小写 kebab-case
- [x] light / dark / system 颜色模式选择器
- [x] 主包构建时复制 token CSS 与 manifest，并开放子路径 exports

#### 自动门禁

- [x] v1 冻结主题基线逐 palette、逐 light/dark 值比对
- [x] light/dark 必需语义 token 完整性检查
- [x] v1→v2 token 映射完整性及目标存在性检查
- [x] 组件 CSS 未登记 `--blora-*` 检测
- [x] 组件 CSS 直接颜色值检测
- [x] 组件 CSS 未登记 z-index 检测
- [x] WCAG 2.2 AA 文本对比度检查（9 套主题 light/dark）
- [x] Stylelint 禁止直接 hex 与未登记 z-index

#### 迁移与测试

- [x] `docs/migration/token-map-v1-v2.csv`
- [x] token 来源、生成产物、可执行 JS、主题、确定性单元测试
- [x] 主包 pack fixture 验证 CSS 子路径、manifest、ESM/SSR 与 TypeScript
- [x] 删除全部 generated/dist 后，`pnpm verify` 可重新生成并通过

### 验收

- [x] 所有 token 值可追溯到冻结的 1.x 基线
- [x] dark 语义完整
- [x] palette 仅覆盖颜色 token
- [x] 连续构建产物无 diff
- [x] `pnpm verify` 全部通过

### 已提交

- [x] 提交 Phase 2（commit `4c2d5ce`）

## Phase 3 详细进度

### 已完成

#### CSS 架构（Spec §8.1）

- [x] `@layer blora.tokens, blora.reset, blora.base, blora.components, blora.utilities;` 声明
- [x] 全量入口 `blora.css`：`@import` 各层按固定顺序

#### Reset（Spec §8.2）

- [x] `reset.css`：独立入口，侵入性 reset 仅在 `.blora-scope` / `.blora-portal` / `body.blora-page` 下生效
- [x] 不导入 reset 时组件仍可正常工作
- [x] `:where()` 零 specificity
- [x] 无 `!important`

#### Base（Spec §8.3-8.4, 8.6）

- [x] 作用域字体、颜色、行高
- [x] 标题 `.blora-h1` ~ `.blora-h4`
- [x] 辅助文本 `.blora-text-lead` / `.blora-text-muted` / `.blora-text-faint` / `.blora-text-primary` / `.blora-text-mono` / `.blora-text-caps`
- [x] 链接颜色与过渡
- [x] 引文 `.blora-quote`（`border-inline-start` 逻辑属性）
- [x] 行内代码 `.blora-code`
- [x] 代码块 `.blora-pre`（`inset-inline-end` 逻辑属性）
- [x] Prose `.blora-prose`
- [x] 焦点环 `:focus-visible`（2px outline + offset）
- [x] `@media (prefers-reduced-motion: reduce)` 全局降级

#### Layout（Spec §8.5）

- [x] Container（`.blora-container` / `--prose` / `--wide`，`margin-inline` / `padding-inline` 逻辑属性）
- [x] Stack（`.blora-stack` / `--sm` / `--lg` / `--xl`）
- [x] Row（`.blora-row` / `--tight` / `--between` / `--center`）
- [x] Actions（`.blora-actions` / `--tight` / `--end`）
- [x] Grid（`.blora-grid` / `--2` / `--3` / `--4`）
- [x] `container-type: inline-size` + `@container` 响应式
- [x] `@media` viewport fallback
- [x] Card（`.blora-card` + 子元素 + `--hover` / `--flat` / `--inset`，`container-type: inline-size`）
- [x] Panel（`.blora-panel` + `__header`）
- [x] Spacer（`.blora-spacer`）
- [x] Divider（`.blora-divider` / `--vert` / `--dashed` / `--text`）

#### Utilities

- [x] 最小集合：`.blora-sr-only` / `.blora-hidden` / `.blora-text-start` / `.blora-text-center` / `.blora-text-end` / `.blora-w-full` / `.blora-w-auto` / `.blora-overflow-*` / `.blora-gap-*`

#### 包集成

- [x] `copy-tokens.mjs` 同时复制 token CSS、foundation CSS 文件、组装 `blora.css`
- [x] 独立入口：`reset.css`、`foundations.css`（reset+base+layout）
- [x] 全量入口：`blora.css`（@layer + @import 全部）
- [x] 包 exports 开放 `./reset.css`、`./foundations.css`、`./blora.css`
- [x] Size 预算：foundations.css ≤10KB、blora.css ≤20KB gzip

#### 测试

- [x] 9 个单元测试：CSS 结构、逻辑属性、@layer 声明、产物完整性
- [x] 2 个浏览器测试：320px 响应式网格折叠、RTL 方向
- [x] 总计 29 个单元测试 + 9 个浏览器测试通过

### 验收

- [x] 嵌入任意宿主页面不会重置宿主全部 button/list（reset 独立入口）
- [x] 纯 HTML fixture 可用（浏览器测试验证）
- [x] 布局通过 320px 和 RTL 浏览器测试
- [x] 无 Demo 专属修复
- [x] `pnpm verify` 从干净状态全部通过

### 待完成

- [ ] 提交 Phase 3

## Phase 4-6 详细进度（汇总）

### Phase 4：三个试点组件

- [x] Button（CSS-only native button + `setButtonLoading()` helper）
- [x] Dialog（Web Component + Shadow DOM + OverlayController）
- [x] Select（form-associated combobox + keyboard navigation）

### Phase 5：核心表单和反馈

- [x] Field/Input/Textarea、Checkbox/Radio/Switch、Tag/Alert/Badge、Progress/Spinner/Skeleton、Toast（共 13 个 CSS-only 组件）

### Phase 6：导航与浮层

- [x] Tabs/Breadcrumb/Pagination/Dropdown/Tooltip/Popover/Drawer/Navbar（共 8 个 CSS-only 组件）

## Phase 7 详细进度

### 已完成

#### 组件（Spec §17 + Phase 7 清单）

- [x] Card/Panel（CSS-only）：`data-variant`（hover/flat/inset）、`data-positioned`、`data-with-badge`、`__title/__body/__foot/__badge` 子元素
- [x] Table（CSS-only native table）：`data-striped`、sortable headers（`aria-sort` + `::after` 箭头）、sticky columns（`data-blora-fixed`）、selection column、bulk bar、virtual scroll container、loading overlay
- [x] List（CSS-only）：`__item/__meta/__title/__desc`、`data-hover` 可交互模式
- [x] Accordion（CSS-only）：`data-open` 展开收起、`__icon` 旋转动画、`--blora-accordion-max-height` 组件变量
- [x] Timeline（CSS-only）：`::before` 垂直线、`__dot` 绝对定位 + `data-variant`、`__time/__title/__desc`
- [x] Empty（CSS-only）：居中布局、`__icon/__title/__desc`
- [x] Result（CSS-only）：`data-variant`（success/warning/error/info）图标着色、`__icon/__title/__desc`
- [x] Avatar（CSS-only）：`data-size`（xs/sm/md/lg/xl）、`data-variant`（primary/neutral/info/success/contrast）、`data-shape`（circle/square）、`blora-avatar-group` 重叠、`blora-avatar-wrap` + `blora-badge` 定位、`blora-dot` 状态点 + `blora-pulse` 动画

#### 工程约束

- [x] 所有组件 CSS 仅使用登记的 token，无硬编码颜色
- [x] z-index 仅使用 `var(--blora-z-base)` / `var(--blora-z-sticky)`
- [x] 逻辑属性（`inset-inline-start/end`、`padding-inline-start`、`margin-inline-start`）替代物理方向
- [x] 8 个 `*.contract.json` 通过 schema 校验
- [x] 包 exports 新增 8 个组件子路径
- [x] attw 排除新增 8 个 CSS 入口
- [x] Playwright config 支持 `PLAYWRIGHT_WORKERS` 环境变量

#### 测试

- [x] 17 个浏览器测试 × 3 个 project = 51 个测试用例
- [x] 总计 49 个单元测试 + 99 个浏览器测试通过
- [x] `pnpm verify` 从干净状态全部通过

## Phase 8 详细进度

### 已完成

#### 兼容层 CSS（Spec §7.4, §23.2）

- [x] `compat/v1.css`：Token 变量映射（110 条，从 CSV 生成）+ `.blora-dark` 暗色模式兼容
- [x] 使用 `@layer blora.compat` 隔离，不干扰现代样式

#### 兼容层 JS（Spec §23.2-23.3）

- [x] `compat/v1.ts`：`initV1Compatibility()` 运行时兼容
- [x] Class 映射：旧 class 名 -> 新 class 名 + data 属性（46 条规则）
- [x] State 映射：`.is-open`/`.is-loading`/`.is-empty`/`.is-hidden` -> data 属性（5 条规则）
- [x] Data 属性映射：`data-blora-palette` -> `data-blora-theme` 等（3 条规则）
- [x] 事件别名：`blora:appearancechange` -> `blora-appearance-change` 等（3 条规则）
- [x] Deprecation warning：每页每规则只警告一次（Set 去重）
- [x] MutationObserver：监听动态添加的 DOM 节点
- [x] `getCompatReport()`：不修改 DOM 的检测报告
- [x] SSR 安全：`typeof document === "undefined"` 守卫

#### 独立入口（Spec §23.2）

- [x] Vite 多入口构建：`index.js`（25 kB）+ `compat/v1/index.js`（12.8 kB）
- [x] compat 不进入 modern bundle
- [x] 包 exports：`./compat/v1` + `./compat/v1.css`

#### Codemod（Spec §19.6）

- [x] `codemod.mjs`：自动转换 class 名、modifier -> data 属性、state class -> data 属性、data 属性重命名、事件名重命名
- [x] 支持 `--check` dry-run 模式
- [x] 支持 HTML/Vue/JSX/TSX/Svelte/PHP 文件

#### 迁移校验器（Spec §19.5）

- [x] `migrate-check.mjs`：检测废弃 class、state class、data 属性、事件名、全局 API、a11y 问题
- [x] 输出格式：文件:行号、规则 ID、问题、建议替换、文档链接、是否可自动修复

#### Fixtures（Spec §23 验收）

- [x] 3 个迁移 fixture：button+card、accordion、table+list+avatar+result
- [x] 浏览器测试验证 v1 -> v2 迁移后视觉一致性

#### 迁移文档（Spec §23.4）

- [x] `docs/migration/v1-to-v2.md`：12 节完整迁移指南

#### 测试

- [x] 19 个 compat 单元测试（映射表、CSS token 映射、codemod/migrate-check 脚本内容）
- [x] 5 个浏览器测试 × 3 个 project = 15 个测试用例
- [x] 总计 50 个单元测试 + 114 个浏览器测试通过
- [x] `pnpm verify` 从干净状态全部通过

### 验收

- [x] 至少三个真实风格 fixture 从 1.x 迁到 2.x
- [x] compat 不进入 modern bundle（独立入口 12.8 kB vs 主入口 25 kB）
- [x] warning 不重复（Set 去重，每规则每页一次）
- [x] 迁移报告可定位文件与行（migrate-check.mjs 输出 file:line 格式）

## Phase 9 详细进度

### 已完成

#### Markdown add-on（Spec §17.6）

- [x] `@bloret-crew/blora-design-markdown` 独立 workspace 包
- [x] `renderMarkdown(source, options)` API，要求显式安全策略（`sanitize`、`allowHtml`）
- [x] 默认转义所有 HTML（`sanitize: true, allowHtml: false`）
- [x] `renderMarkdownTo(element, source, options)` 便捷函数
- [x] 支持：标题、加粗/斜体/删除线、行内代码、围栏代码、链接（仅安全协议）、图片、列表、引用、分割线
- [x] 使用占位符保护链接和代码不被斜体正则误匹配
- [x] CSS 使用 v2 token，`@layer blora.addons` 隔离
- [x] 25 个单元测试

#### QRCode add-on

- [x] `@bloret-crew/blora-design-qrcode` 独立 workspace 包
- [x] `renderQRCode(container, text, options)` + `buildQRMatrix(text)` API
- [x] 从 v1 迁移 QR 矩阵生成算法（finder patterns + data bits）
- [x] SSR 安全（`typeof document` 守卫）
- [x] 10 个单元测试

#### Thread add-on

- [x] `@bloret-crew/blora-design-thread` 独立 workspace 包
- [x] `createThreadController(root, options)` headless controller（Spec §17.5）
- [x] `toggle`/`expand`/`collapse`/`toggleReact`/`destroy` 方法（v1 `initThread` 对等）
- [x] 默认中文标签「展开评论 / 收起评论」+ `data-label-expand|collapse` 覆盖
- [x] 无 body 时自动包一层 `.blora-post__replies-body`（v1 兼容）
- [x] `[data-blora-post-react]` 切换 `is-active` + `aria-pressed`
- [x] AbortController 管理事件监听器（不使用 dataset bound 标记）
- [x] `prefers-reduced-motion` 支持
- [x] `aria-expanded` 无障碍属性；toggle 文案按 replies box 作用域更新
- [x] CSS 从 v1 迁移全部 Thread/Post/Comment 样式，使用 v2 token 和逻辑属性
- [x] 构建产物包含 `dist/thread.css`；Storybook `Add-ons/Thread`
- [x] `.blora-dark` 替换为 `:root[data-blora-color-scheme="dark"]`
- [x] 13 个单元测试 + `thread.migration.md`

#### Effects add-on

- [x] `@bloret-crew/blora-design-effects` 独立 workspace 包
- [x] `textFx(target, name, options)` API
- [x] 8 种效果：grow、shrink、shake、nod、jitter、explode、ripple、bloom
- [x] 分字效果（explode/ripple/bloom）自动拆分文本为 span
- [x] `prefers-reduced-motion` 支持
- [x] SSR 安全
- [x] CSS 从 v1 迁移全部 `.blora-text-fx` 样式和 `@keyframes`
- [x] 16 个单元测试

#### 工程配置

- [x] ESLint 配置：为 add-on 包添加 typed-linting 块
- [x] Stylelint 配置：为 add-on 包添加 overrides（允许 `.is-*` 状态类和 `--fx-*` 自定义属性）
- [x] 所有包使用 v2 token，逻辑属性，`@layer blora.addons` 隔离
- [x] `pnpm verify` 从干净状态全部通过

#### 测试

- [x] 单元测试含 thread 13 条（expand/collapse/react/body-wrap/label 作用域）
- [x] 114 个浏览器测试
- [x] `pnpm verify` 从干净状态全部通过

## 阻塞项

无。

## 关键决策

见 `decisions.md`。
