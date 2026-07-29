# 重构状态

> Blora Design 2.0 重构进度跟踪。每个阶段完成后更新此文件。

## 当前阶段

**Phase 1：Workspace 与门禁** - ✅ 完成（待提交）

## 阶段进度

| 阶段 | 状态 | 说明 |
|---|---|---|
| Phase 0：冻结与基线 | ✅ 完成 | 冻结 1.x 行为事实、捕获公共 API、生成视觉基线 |
| Phase 1：Workspace 与门禁 | ✅ 完成 | pnpm workspace、TS strict、lint、test、CI、Storybook、publint |
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

### 待完成

- [ ] 提交 Phase 1

## 阻塞项

无。

## 关键决策

见 `decisions.md`。
