# Blora Design 2.0 重构实施规格

> 面向 Vibe Coding / AI Coding Agent 的可执行工程文档  
> 目标仓库：`https://github.com/BloretCrew/blora-design`  
> 目标版本：`2.0.0`  
> 文档状态：实施基线  
> 适用角色：AI Coding Agent、维护者、审查者、组件贡献者  
> 关键词：Web Standards、Design Tokens、Web Components、Progressive Enhancement、Accessibility、Visual Regression、AI-readable Contract

---

## 0. 如何使用本文档

本文档不是方向性建议，而是 Blora Design 2.0 的实施规格。执行重构的 AI 必须把本文档视作“架构约束 + 工作拆解 + 验收标准”，不能只挑选容易的部分执行。

### 0.1 执行规则

1. **先建立新架构和自动化门禁，再迁移组件。**
2. **禁止直接在现有 `blora.css`、`blora.js` 上继续堆叠 2.0 功能。**
3. **禁止一次性删除 1.x 实现。** 旧实现要作为兼容测试输入和迁移参考保留到 2.0 Release Candidate。
4. 每次只迁移一组有关联的组件，并同时完成：
   - 源码；
   - 类型；
   - 组件契约；
   - Story；
   - 单元测试；
   - 浏览器交互测试；
   - 无障碍测试；
   - 视觉回归基线；
   - 文档；
   - 1.x 迁移说明。
5. **不得用“文档中已说明”代替自动检查。** 能通过脚本检测的规范必须写成脚本、测试或 lint 规则。
6. **不得为了赶进度伪造空测试、跳过测试或批量更新错误截图。**
7. 任何破坏公共 API 的变更必须登记在 `docs/migration/v1-to-v2.md` 和 `changeset` 中。
8. 任何新依赖必须说明它属于：
   - 运行时依赖；
   - 构建依赖；
   - 文档依赖；
   - 测试依赖。
9. 默认目标是 **零运行时第三方依赖**。构建、测试和文档工具可以使用开发依赖。
10. 所有提交必须保持 `pnpm verify` 可通过。迁移中暂未实现的组件可以进入 legacy 包，但不能留下半实现的新 API。
11. **2.0 的视觉参考只能来自重构开始时仓库当前展示页的实际渲染结果。** 禁止以历史提交、旧 npm 包、隐藏分支、未展示的内部版本、其他 UI 框架默认样式或 AI 自行生成的风格作为视觉基准。

### 0.2 规范词语

本文档中的：

- **必须 / MUST**：不满足不得发布。
- **禁止 / MUST NOT**：出现即视为缺陷。
- **应该 / SHOULD**：除非有书面 ADR 说明，否则必须执行。
- **可以 / MAY**：按实际需要选择。

### 0.3 建议的执行方式

AI 应按“阶段”执行，每阶段独立提交。不要直接领取“重构整个项目”后做一次巨型提交。建议维护下列状态文件：

```text
docs/refactor/
├── status.md             # 当前阶段、已完成项、阻塞项
├── decisions.md          # 临时决策，最终沉淀为 ADR
├── component-matrix.md   # 每个组件的迁移状态
└── known-differences.md  # 1.x 与 2.x 的已知视觉/行为差异
```

### 0.4 展示页唯一视觉基准

Blora Design 2.0 的唯一视觉母版是重构开始时目标仓库当前 HEAD 中 `index.html` 引用当前 `blora.css`、`blora.js` 后，在锁定测试环境中的实际渲染结果。本文档编写时对应的仓库 HEAD 为：

```text
a148715d06ee9551cbee262ffae6ad377b564df6
```

执行 AI 必须遵守：

1. 颜色、字体、字号、间距、圆角、边框、阴影、层级、组件形态、状态表现、动效节奏和整体气质，均以该展示页为视觉来源。
2. README、历史文档、历史 tag、旧 npm 发布包或源码注释与当前展示页冲突时：
   - 视觉问题以当前展示页的实际渲染为准；
   - 公共 API 问题以当前发布 API 审计结果为准；
   - 无障碍和安全问题以 2.0 规范为准，但必须尽量保持当前视觉语言。
3. 不要求跨浏览器数学意义上的逐像素相等，允许以下轻微变化：
   - 为正确语义和键盘操作调整内部 DOM；
   - 为 WCAG 2.2 AA 调整对比度、焦点环或点击区域；
   - 修复移动端溢出、RTL、缩放和字体 fallback；
   - 修复明显 bug；
   - 因 Shadow DOM、原生平台能力或字体渲染产生的细小差异。
4. 允许的变化不能改变组件的识别特征和整体设计语言。禁止借重构之名重新设计、套用 Storybook 默认风格、套用其他组件库风格或让 AI 自行“现代化”。
5. 每个允许的可见差异必须记录在 `docs/refactor/known-differences.md`，说明：
   - 组件；
   - 当前展示页表现；
   - 2.0 表现；
   - 改变原因；
   - 对比截图；
   - 审核状态。
6. 若无法判断某一视觉细节，应从当前展示页生成最小复现并截图，不得去历史版本寻找一个“看起来合理”的答案。
7. 新文档站可以重新组织页面布局，但其中展示的正式组件必须延续当前展示页的组件视觉；Docs shell 的改版不能被误当成组件改版。

验收原则：

> 允许 2.0 比当前展示页更稳定、更可访问、更容易组合，但看起来必须仍然是当前展示页中的 Blora Design，而不是另一个设计系统。

---

## 1. 现状审计与问题定义

截至 1.0.0，仓库主要由以下文件组成：

| 文件           |   规模/职责 | 2.0 前的主要问题                                                             |
| -------------- | ----------: | ---------------------------------------------------------------------------- |
| `blora.css`    | 约 4,500 行 | 令牌、reset、布局、组件、工具类、Demo 辅助样式混在一个文件                   |
| `blora.js`     | 约 6,300 行 | 50 多个初始化器、全局配置、i18n、组件状态和工具函数共享一个闭包              |
| `blora.d.ts`   |   约 215 行 | 只描述全局 API，无法覆盖组件属性、事件、slot、CSS Parts 和生命周期           |
| `index.html`   | 约 2,860 行 | 同时承担展示页、文档、人工测试场、示例来源，存在大量内联样式和 Demo 专属 CSS |
| `docs/*.md`    | 约 2,300 行 | 信息丰富，但主要是人类可读说明，无法充当机器校验契约                         |
| `package.json` |    单包发布 | 只有 `node --check blora.js`，缺少构建、类型、测试、a11y 和视觉门禁          |

现有实现中可观察到：

- 约 100 个 `data-blora-*` 属性；
- 大量 `.blora-*` class 及 `--modifier` 组合；
- 数十种内部 DOM 子元素命名；
- `Blora.init(root)` 每次遍历所有初始化器；
- 多种事件命名并存：
  - `change`；
  - `blora:change`；
  - `blora:table-change`；
  - `blora:treeselect-change`；
  - `blora:autocomplete-select`；
- 部分组件由脚本动态拼接 `innerHTML`；
- 主题、语言、表单、表格、Markdown、QRCode、文字特效共用同一个运行时；
- 简单 CSS 组件和复杂交互组件没有清晰的包边界。

### 1.1 根因

问题不是“使用原生 HTML/CSS/JS”，而是以下契约缺失：

1. **组件边界缺失**：无法确定一段 DOM 属于哪个组件、内部结构是否允许用户依赖。
2. **单一事实来源缺失**：实现、文档、示例、类型由不同代码片段人工维护。
3. **状态模型缺失**：`disabled`、`loading`、`open`、`selected`、`invalid` 有时是 class，有时是属性，有时是 dataset。
4. **生命周期缺失**：全局 `init()` 只解决“绑定”，没有统一的 connect、update、disconnect 和 cleanup。
5. **自动门禁缺失**：无法自动判断展示页面是否已经偏离真实组件。
6. **发布边界缺失**：核心 UI、复杂业务模式和视觉特效全部进入同一个文件。
7. **面向 AI 的结构化信息缺失**：AI 只能从巨型 CSS、JS 和 Demo 中猜测正确用法。

### 1.2 2.0 要解决的具体问题

2.0 必须使以下问题有确定答案：

- Button 的合法 variant 有哪些？
- Select 会发出什么事件，事件 detail 的类型是什么？
- Dialog 打开时焦点去哪，关闭后返回哪里？
- 哪些 CSS 自定义属性允许业务覆盖？
- 哪些内部节点允许通过 `::part()` 定制？
- 一个组件是否支持原生表单提交？
- 文档中的示例是否就是测试使用的示例？
- 深色模式、RTL、reduced-motion 是否经过自动测试？
- 旧的 `.blora-btn--primary` 如何迁移？
- AI 使用了不存在的属性时，CI 是否会失败？
- 只引入 Button 时，是否仍需下载完整 6,000 行运行时？

---

## 2. 2.0 产品目标、非目标与成功指标

### 2.1 产品目标

Blora Design 2.0 是一个：

1. 基于 Web 标准；
2. 可在纯 HTML、原生 JavaScript、React、Vue 和其他框架中使用；
3. 不要求业务项目采用指定构建工具；
4. 支持 npm、ESM CDN、传统 `<script>` 三种消费方式；
5. 令牌驱动；
6. 默认支持浅色、深色、系统模式和产品主题覆盖；
7. 符合 WCAG 2.2 AA 基线；
8. 可 Tree-shaking；
9. 默认零第三方运行时依赖；
10. 对 AI 和 IDE 提供结构化组件契约；
11. 具备自动化交互、a11y、视觉回归和包体积门禁；
12. 允许 1.x 项目渐进迁移的 Web UI 设计系统。

### 2.2 非目标

2.0 核心包不负责：

- 业务 API；
- 数据请求和缓存；
- 路由；
- 权限系统；
- WebSocket；
- 富文本编辑器；
- Markdown 内容安全策略；
- 图表引擎；
- 通用 QRCode 编码器；
- 完整论坛/BBS 业务模型；
- 虚拟 DOM；
- React/Vue 运行时；
- 服务端状态管理；
- 将所有浏览器原生控件重新发明一遍。

### 2.3 成功指标

发布 `2.0.0` 前至少满足：

| 指标                   | 要求                                                         |
| ---------------------- | ------------------------------------------------------------ |
| 核心组件 API 覆盖      | 100% 具有契约、类型、Story、测试                             |
| Story 与组件源码一致性 | Story 直接 import 正式组件，不复制实现                       |
| 可访问性               | 核心 Story 自动 axe 检测无 serious/critical 问题             |
| 键盘交互               | APG 对应组件具有显式 Playwright 用例                         |
| 视觉回归               | Chromium 桌面/移动、light/dark 全覆盖；关键浮层增加 WebKit   |
| TypeScript             | `strict: true`，无业务性 `any`                               |
| 运行时依赖             | 核心包为 0                                                   |
| Tree-shaking           | 单组件入口不注册、不打包其他组件                             |
| SSR 导入安全           | 在无 `window/document/customElements` 环境 import 不抛错     |
| CSP                    | 核心运行时不使用 `eval`、`new Function`、内联事件处理器      |
| 旧版迁移               | 1.x 公共用法有映射表和 compat 入口                           |
| 文档                   | 每个稳定组件含用法、API、a11y、迁移、反例                    |
| AI 契约                | 发布包包含 `custom-elements.json`、组件 manifest、`llms.txt` |

---

## 3. 核心架构决策

### 3.1 采用“原生语义元素 + Web Components”的混合架构

禁止把所有组件机械改写为自定义元素。

#### A. 原生语义优先

如果 HTML 原生元素已经具备正确语义、表单行为和无 JavaScript 降级能力，则使用原生元素加稳定 class：

```html
<button class="blora-button" data-variant="primary" data-size="md">保存</button>

<input class="blora-input" type="email" name="email" autocomplete="email" />

<table class="blora-table">
  ...
</table>
```

适用：

- Button；
- Link；
- Input；
- Textarea；
- 原生 Select；
- Checkbox；
- Radio；
- 基础 Switch（以 checkbox 为语义核心）；
- Table；
- Progress；
- Meter；
- Details/Disclosure；
- Typography；
- Card；
- Badge；
- Alert；
- 布局原语。

#### B. 复合交互使用 Web Components

只有当组件需要管理多节点结构、浮层、复杂键盘交互、动态选项或跨框架状态同步时，才使用 Autonomous Custom Element：

```html
<blora-select name="country" label="国家或地区" placeholder="请选择">
  <blora-option value="cn">中国</blora-option>
  <blora-option value="jp">日本</blora-option>
</blora-select>
```

适用：

- 自定义 Select / Combobox；
- Tabs；
- Dialog；
- Drawer；
- Dropdown / Menu；
- Tooltip / Popover；
- Toast Region；
- Pagination（有受控状态时）；
- Tree；
- Tree Select；
- Date Picker；
- Cascader；
- Transfer；
- Tour；
- Splitter。

### 3.2 为什么不把 Button 也强制做成 `<blora-button>`

原生 `<button>` 天然具备：

- 键盘激活；
- `disabled`；
- 表单提交；
- 无 JavaScript可用；
- 正确的可访问性树；
- 更少的升级闪烁；
- 更好的框架和自动化测试兼容。

设计系统应该增强平台，而不是替换平台。

可以额外提供框架包装器 `<Button>`，但其最终 DOM 必须仍为 `<button>`。

### 3.3 Shadow DOM 使用规则

1. 复合 Web Component 默认使用 **open Shadow DOM**。
2. 所有允许业务定制的内部节点必须声明 CSS Parts。
3. 所有视觉主题必须通过 CSS Custom Properties 穿透。
4. 不允许业务依赖未公开的 Shadow DOM 结构。
5. 布局型、内容型、需要宿主 CSS 深度参与的组件优先使用 Light DOM。
6. 如果 Shadow DOM 会显著损害语义、表单、SEO 或内容投影，则写 ADR 后使用 Light DOM。
7. 禁止 closed Shadow DOM。

### 3.4 渐进增强

必须满足：

- 没有 JS 时，原生组件仍可读、可提交、可导航。
- 复合组件在未升级前不得导致页面内容完全不可见。
- 自定义元素升级期间允许用：

```css
:not(:defined) {
  /* 仅处理必要的布局稳定，不隐藏可读内容 */
}
```

- 禁止全局使用 `blora-select:not(:defined) { display: none; }`。
- 对不具备合理无 JS 降级的控件，文档必须明确标注“requires JavaScript”。

### 3.5 ESM-first、显式注册、SSR 安全

组件模块导出 class，但默认入口不得在 import 时修改全局：

```ts
import {
  BloraSelect,
  defineBloraSelect,
} from "@bloret-crew/blora-design/select";

defineBloraSelect();
```

需要自动注册时使用显式副作用入口：

```ts
import "@bloret-crew/blora-design/auto";
```

CDN：

```html
<script type="module">
  import { defineAll } from "https://cdn.jsdelivr.net/npm/@bloret-crew/blora-design@2/+esm";
  defineAll();
</script>
```

传统页面：

```html
<script src="https://cdn.jsdelivr.net/npm/@bloret-crew/blora-design@2/dist/blora.global.js"></script>
```

`blora.global.js` 可以注册全部稳定组件并暴露有限的 `window.Blora` 兼容 API；现代 ESM 主入口不得创建全局变量。

---

## 4. 目标仓库结构

采用 pnpm workspace。仓库建议结构如下：

```text
blora-design/
├── .changeset/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── pull_request_template.md
│   └── workflows/
│       ├── ci.yml
│       ├── docs.yml
│       ├── preview.yml
│       └── release.yml
├── apps/
│   ├── docs/                         # Storybook / 文档站
│   ├── playground-html/              # 无构建纯 HTML 验证
│   ├── playground-react/
│   └── playground-vue/
├── packages/
│   ├── design-system/                # 对外主包 @bloret-crew/blora-design
│   ├── tokens/                       # Token 源和生成物
│   ├── foundations/                  # reset/base/layout/utility
│   ├── components/                   # 组件实现
│   ├── compat-v1/                    # 1.x 兼容层
│   ├── react/                        # 可选 React 适配器
│   └── vue/                          # 可选 Vue 适配器
├── addons/
│   ├── markdown/
│   ├── qrcode/
│   ├── thread/
│   └── effects/
├── scripts/
│   ├── build-tokens.mjs
│   ├── build-manifests.mjs
│   ├── check-api.mjs
│   ├── check-css-contract.mjs
│   ├── check-doc-examples.mjs
│   ├── check-migration.mjs
│   └── report-size.mjs
├── tests/
│   ├── fixtures/
│   │   ├── html/
│   │   ├── react/
│   │   └── vue/
│   ├── integration/
│   ├── visual/
│   └── migration/
├── docs/
│   ├── architecture/
│   │   ├── adr-001-hybrid-components.md
│   │   ├── adr-002-shadow-dom.md
│   │   ├── adr-003-token-format.md
│   │   └── adr-004-versioning.md
│   ├── migration/
│   │   └── v1-to-v2.md
│   ├── contributing/
│   └── refactor/
├── AGENTS.md
├── custom-elements.json
├── component-manifest.json
├── llms.txt
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

### 4.1 主包内部结构

```text
packages/design-system/
├── package.json
├── src/
│   ├── index.ts
│   ├── auto.ts
│   ├── global.ts
│   └── styles.ts
└── dist/
    ├── index.js
    ├── index.d.ts
    ├── auto.js
    ├── blora.global.js
    ├── tokens.css
    ├── foundations.css
    ├── components.css
    ├── blora.css
    ├── custom-elements.json
    └── component-manifest.json
```

### 4.2 单组件目录模板

```text
packages/components/src/select/
├── select.ts
├── select.styles.ts
├── select.types.ts
├── select.events.ts
├── select.contract.json
├── select.stories.ts
├── select.test.ts
├── select.e2e.ts
├── select.a11y.ts
├── select.visual.ts
├── select.docs.md
├── select.migration.md
└── index.ts
```

不是所有测试都必须拆成多个物理文件；小组件可合并。但上述测试维度都必须存在。

---

## 5. Workspace 与基础工程配置

### 5.1 根 `package.json`

参考骨架：

```json
{
  "name": "blora-design-workspace",
  "private": true,
  "packageManager": "pnpm@10",
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "dev": "pnpm --filter @blora/docs dev",
    "build": "pnpm build:tokens && pnpm -r build",
    "build:tokens": "node scripts/build-tokens.mjs",
    "build:manifests": "node scripts/build-manifests.mjs",
    "typecheck": "pnpm -r typecheck",
    "lint": "pnpm lint:js && pnpm lint:css && pnpm lint:contracts",
    "lint:js": "eslint .",
    "lint:css": "stylelint \"**/*.css\"",
    "lint:contracts": "node scripts/check-api.mjs && node scripts/check-css-contract.mjs",
    "test": "vitest run",
    "test:browser": "playwright test",
    "test:a11y": "playwright test --project=a11y",
    "test:visual": "playwright test --project=visual",
    "test:migration": "playwright test tests/migration",
    "test:html": "playwright test tests/fixtures/html",
    "size": "node scripts/report-size.mjs",
    "verify": "pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:browser && pnpm size",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm build && changeset publish"
  }
}
```

版本号不要在源码中手工维护第二份。构建时从主包 `package.json` 注入：

```ts
export const version = __BLORA_VERSION__;
```

### 5.2 `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "addons/*"
```

### 5.3 TypeScript

`tsconfig.base.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "useDefineForClassFields": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "skipLibCheck": false,
    "noEmit": true
  }
}
```

禁止：

- 大面积 `any`；
- `// @ts-ignore`；
- 为通过构建而关闭 strict；
- 在组件代码中直接断言 `as HTMLElement` 而不检查；
- 将 DOM event detail 写成 `Record<string, unknown>` 逃避建模。

确需绕过时必须使用 `@ts-expect-error` 并写明浏览器/API 原因。

### 5.4 格式与 lint

必须配置：

- ESLint；
- `typescript-eslint`；
- Stylelint；
- Prettier；
- JSON Schema 校验；
- Markdown lint；
- `publint`；
- `arethetypeswrong`；
- 包体积检查工具。

Lint 规则至少禁止：

- 生产代码 `console.log`；
- 未处理 Promise；
- 无清理的全局事件监听；
- `innerHTML` 写入未经可信构造的字符串；
- CSS 中未登记的 `--blora-*`；
- 组件样式中直接使用十六进制颜色；
- 组件样式中使用未登记的任意 `z-index`；
- Story 内复制正式组件的内部 DOM。

---

## 6. 包设计与发布入口

### 6.1 对外主包

继续使用：

```text
@bloret-crew/blora-design
```

主包聚合稳定能力，避免用户必须理解 monorepo 内部结构。

建议 `exports`：

```json
{
  "name": "@bloret-crew/blora-design",
  "version": "2.0.0",
  "type": "module",
  "sideEffects": ["./dist/auto.js", "./dist/*.css"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./auto": {
      "types": "./dist/auto.d.ts",
      "import": "./dist/auto.js"
    },
    "./button": {
      "types": "./dist/components/button/index.d.ts",
      "import": "./dist/components/button/index.js"
    },
    "./select": {
      "types": "./dist/components/select/index.d.ts",
      "import": "./dist/components/select/index.js"
    },
    "./dialog": {
      "types": "./dist/components/dialog/index.d.ts",
      "import": "./dist/components/dialog/index.js"
    },
    "./tokens.css": "./dist/tokens.css",
    "./foundations.css": "./dist/foundations.css",
    "./components.css": "./dist/components.css",
    "./blora.css": "./dist/blora.css",
    "./compat/v1": {
      "types": "./dist/compat/v1.d.ts",
      "import": "./dist/compat/v1.js"
    },
    "./compat/v1.css": "./dist/compat/v1.css",
    "./custom-elements.json": "./dist/custom-elements.json",
    "./component-manifest.json": "./dist/component-manifest.json",
    "./package.json": "./package.json"
  }
}
```

所有稳定组件都应拥有子路径入口。不要让用户从 `dist/internal/...` 导入。

### 6.2 入口行为

| 入口                          |  是否有副作用 | 用途                              |
| ----------------------------- | ------------: | --------------------------------- |
| `@.../blora-design`           |            否 | 导出 class、define 函数、配置工具 |
| `@.../blora-design/auto`      |            是 | 注册全部稳定 Custom Elements      |
| `@.../blora-design/select`    |            否 | Select 单组件                     |
| `@.../blora-design/blora.css` |           CSS | 全量样式                          |
| `@.../blora-design/compat/v1` | 是或显式 init | 1.x DOM 行为兼容                  |

### 6.3 独立适配包

2.0.0 可以先将 React/Vue 适配器标记为 beta，但架构必须预留：

```text
@bloret-crew/blora-react
@bloret-crew/blora-vue
```

适配器必须薄：

- 不复制组件逻辑；
- 不复制 Token；
- 不改变事件语义；
- 不将所有 Web Component 属性变成无类型字符串；
- React 适配器处理事件绑定和 JSX 类型；
- Vue 适配器处理 `v-model` 和 custom element compiler 配置。

---

## 7. Design Tokens 重构

### 7.1 单一事实来源

当前 CSS 变量不能继续作为手写源。2.0 以 DTCG 风格的 `.tokens.json` 作为源数据，再生成 CSS、TypeScript 和文档数据。

目录：

```text
packages/tokens/
├── src/
│   ├── primitive/
│   │   ├── color.tokens.json
│   │   ├── dimension.tokens.json
│   │   ├── duration.tokens.json
│   │   ├── typography.tokens.json
│   │   └── shadow.tokens.json
│   ├── semantic/
│   │   ├── color-light.tokens.json
│   │   ├── color-dark.tokens.json
│   │   ├── typography.tokens.json
│   │   ├── motion.tokens.json
│   │   └── layout.tokens.json
│   ├── component/
│   │   ├── button.tokens.json
│   │   ├── field.tokens.json
│   │   └── overlay.tokens.json
│   └── themes/
│       ├── coral.tokens.json
│       ├── ocean.tokens.json
│       ├── graphite.tokens.json
│       └── ...
├── generated/
│   ├── tokens.css
│   ├── tokens.dark.css
│   ├── tokens.ts
│   ├── tokens.json
│   └── token-manifest.json
└── package.json
```

### 7.2 Token 三层模型

#### Primitive

表达原始材料，不在组件中直接使用：

```json
{
  "color": {
    "coral": {
      "600": {
        "$type": "color",
        "$value": {
          "colorSpace": "srgb",
          "components": [0.624, 0.349, 0.392],
          "alpha": 1,
          "hex": "#9F5964"
        }
      }
    }
  }
}
```

#### Semantic

表达跨产品意图，组件优先消费：

```json
{
  "color": {
    "surface": {
      "canvas": {
        "$type": "color",
        "$value": "{color.neutral.025}",
        "$description": "页面最底层背景"
      },
      "default": {
        "$type": "color",
        "$value": "{color.neutral.000}",
        "$description": "卡片、菜单和控件的默认表面"
      },
      "raised": {
        "$type": "color",
        "$value": "{color.neutral.000}"
      }
    },
    "text": {
      "primary": {
        "$type": "color",
        "$value": "{color.neutral.900}"
      },
      "secondary": {
        "$type": "color",
        "$value": "{color.neutral.700}"
      },
      "muted": {
        "$type": "color",
        "$value": "{color.neutral.550}"
      },
      "disabled": {
        "$type": "color",
        "$value": "{color.neutral.400}"
      }
    },
    "action": {
      "primary": {
        "default": {
          "$type": "color",
          "$value": "{color.coral.600}"
        },
        "hover": {
          "$type": "color",
          "$value": "{color.coral.700}"
        },
        "active": {
          "$type": "color",
          "$value": "{color.coral.800}"
        }
      }
    }
  }
}
```

#### Component

只在确有必要时建立：

```json
{
  "button": {
    "primary": {
      "background": {
        "$type": "color",
        "$value": "{color.action.primary.default}"
      },
      "foreground": {
        "$type": "color",
        "$value": "{color.text.on-accent}"
      }
    }
  }
}
```

禁止为每个 CSS 属性都创建 component token。Component token 只用于需要长期主题覆盖承诺的部位。

### 7.3 CSS 命名

生成后的变量统一使用：

```text
--blora-color-surface-canvas
--blora-color-text-primary
--blora-color-action-primary-hover
--blora-space-4
--blora-radius-control
--blora-duration-fast
--blora-easing-standard
--blora-z-overlay
```

规则：

- 全小写 kebab-case；
- 名称表达用途，不表达当前颜色；
- 禁止新组件直接使用 `--blora-primary` 这类含义过宽的变量；
- 可以在 compat CSS 中将旧变量映射到新变量；
- 令牌删除遵循 SemVer；
- 废弃 Token 在源文件中加 `$deprecated`；
- 每个 Token 必须有 `$type` 或从父组继承明确类型。

### 7.4 1.x Token 兼容映射

`compat/v1.css` 中提供一轮过渡：

```css
:root {
  --blora-background: var(--blora-color-surface-canvas);
  --blora-surface-1: var(--blora-color-surface-default);
  --blora-text-strong: var(--blora-color-text-primary);
  --blora-foreground: var(--blora-color-text-secondary);
  --blora-primary: var(--blora-color-action-primary-default);
  --blora-primary-hover: var(--blora-color-action-primary-hover);
  --blora-dur-fast: var(--blora-duration-fast);
  --blora-ease: var(--blora-easing-standard);
}
```

需要建立完整 CSV/Markdown 映射：

```text
docs/migration/token-map-v1-v2.csv
```

字段：

```text
v1_token,v2_token,status,reason,removal_version
```

### 7.5 主题

主题只重映射 Primitive/Semantic 色彩，不复制整套组件 CSS：

```css
[data-blora-theme="ocean"] {
  --blora-color-action-primary-default: ...;
  --blora-color-focus-ring: ...;
}
```

颜色模式：

```css
:root,
[data-blora-color-scheme="light"] {
  color-scheme: light;
}

[data-blora-color-scheme="dark"] {
  color-scheme: dark;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-blora-color-scheme]) {
    color-scheme: dark;
  }
}
```

禁止同时以 `.blora-dark`、dataset、配置对象维护三份状态。`.blora-dark` 仅在 compat 层映射。

### 7.6 Token 自动校验

`pnpm build:tokens` 必须：

1. 校验 JSON；
2. 校验引用存在；
3. 检测循环引用；
4. 校验 `$type`；
5. 生成 CSS；
6. 生成 TypeScript 常量；
7. 生成文档 manifest；
8. 检查暗色/亮色必需语义 Token 是否齐全；
9. 检查新旧 Token 映射；
10. 检查组件 CSS 中是否出现未登记的变量；
11. 检查组件 CSS 中是否直接写颜色值。

允许的直接颜色值只出现在：

- Primitive Token；
- 明确登记的媒体遮罩；
- 浏览器兼容 fallback。

---

## 8. CSS 架构

### 8.1 Cascade Layers

全量 CSS 使用固定层级：

```css
@layer blora.tokens, blora.reset, blora.base, blora.components, blora.utilities;
```

顺序不得由单组件自行改变。

建议文件：

```text
tokens.css
reset.css
base.css
layout.css
utilities.css
components/*.css
```

全量入口：

```css
@import "./tokens.css" layer(blora.tokens);
@import "./reset.css" layer(blora.reset);
@import "./base.css" layer(blora.base);
@import "./components.css" layer(blora.components);
@import "./utilities.css" layer(blora.utilities);
```

### 8.2 Reset 改为可选

1.x 会在 `.blora-scope` 下重置 button、列表、链接等宿主元素。2.0 必须把侵入性 reset 移到独立入口：

```js
import "@bloret-crew/blora-design/tokens.css";
import "@bloret-crew/blora-design/foundations.css";
```

若用户需要完整页面基线，再导入：

```js
import "@bloret-crew/blora-design/reset.css";
```

主组件 CSS 不应依赖“所有 button 已被全局清空样式”。

### 8.3 选择器规范

必须：

- 公共 class 使用 `.blora-*`；
- 低 specificity 场景使用 `:where()`；
- 状态优先用原生属性或 ARIA：
  - `[disabled]`；
  - `[aria-expanded="true"]`；
  - `[aria-selected="true"]`；
  - `[data-state="open"]`；
- variant 使用 `[data-variant="primary"]`；
- size 使用 `[data-size="sm"]`；
- 业务可见 class 不使用构建 hash。

禁止：

- `!important`，除非是可访问性或 compat，并附原因；
- 超过三级的后代选择器；
- 依赖 Story/Demo 父节点修正正式组件；
- `transition: all`；
- 任意 `z-index: 99999`；
- 在组件中直接覆盖 `html`、`body`；
- 用 DOM 顺序实现不可理解的状态；
- 让外部必须知道 Shadow DOM 内部结构。

### 8.4 逻辑属性与 RTL

必须使用：

- `margin-inline`；
- `padding-block`；
- `inset-inline-start`；
- `border-start-start-radius`；
- `text-align: start`。

不要用 `left/right` 表达逻辑方向，除非组件含真实物理方向语义，例如图片对比拖拽。

每个导航、菜单、输入、分页和浮层组件至少有一条 `dir="rtl"` 测试。

### 8.5 Container Queries

组件响应式优先根据容器，而不是页面 viewport：

```css
.blora-card-grid {
  container-type: inline-size;
}

@container (width < 36rem) {
  .blora-card-grid__item {
    grid-column: 1 / -1;
  }
}
```

页面骨架才使用 viewport media query。

### 8.6 Motion

每个动效必须：

- 使用已登记 duration/easing token；
- 不使用 `transition: all`；
- 不以动效作为唯一状态提示；
- 支持：

```css
@media (prefers-reduced-motion: reduce) {
  /* 取消非必要位移、旋转、缩放和自动播放 */
}
```

自动轮播、文字特效和 Tour 在 reduced-motion 下必须停止自动动画。

### 8.7 CSS 公共契约

每个组件 contract 要列出：

- 公共 class；
- variant；
- size；
- state；
- CSS Custom Properties；
- CSS Parts；
- 是否允许 `::part()`；
- 哪些内部 class 明确不稳定。

构建脚本比较 contract 与实际 CSS，检测：

- 文档声明但 CSS 不存在；
- CSS 新增公共选择器但 contract 未登记；
- 删除公共选择器未记录 breaking change。

---

## 9. 组件契约与命名规范

### 9.1 组件 contract

每个组件必须有 `*.contract.json`。示例：

```json
{
  "$schema": "../../../schemas/component-contract.schema.json",
  "name": "select",
  "status": "stable",
  "kind": "custom-element",
  "tagName": "blora-select",
  "since": "2.0.0",
  "requiresJavaScript": true,
  "formAssociated": true,
  "attributes": {
    "name": { "type": "string" },
    "value": { "type": "string", "reflects": true },
    "disabled": { "type": "boolean", "reflects": true },
    "required": { "type": "boolean", "reflects": true },
    "multiple": { "type": "boolean", "reflects": true },
    "searchable": { "type": "boolean", "reflects": true },
    "placeholder": { "type": "string" },
    "label": { "type": "string" },
    "max-visible-tags": { "type": "number", "default": 3 }
  },
  "properties": {
    "options": { "type": "readonly BloraOptionData[]" },
    "selectedOptions": {
      "type": "readonly BloraOptionData[]",
      "readonly": true
    }
  },
  "methods": {
    "focus": { "returns": "void" },
    "checkValidity": { "returns": "boolean" },
    "reportValidity": { "returns": "boolean" },
    "setCustomValidity": {
      "parameters": [{ "name": "message", "type": "string" }],
      "returns": "void"
    }
  },
  "events": {
    "input": {
      "native": true,
      "bubbles": true,
      "composed": true
    },
    "change": {
      "native": true,
      "bubbles": true,
      "composed": true
    },
    "blora-open": {
      "detail": "BloraOpenEventDetail",
      "bubbles": true,
      "composed": true,
      "cancelable": true
    },
    "blora-close": {
      "detail": "BloraCloseEventDetail",
      "bubbles": true,
      "composed": true
    }
  },
  "slots": {
    "default": "blora-option elements",
    "label": "Custom label content",
    "help-text": "Help or validation message"
  },
  "parts": [
    "field",
    "label",
    "control",
    "value",
    "trigger",
    "popup",
    "listbox",
    "option",
    "tag",
    "clear-button",
    "help-text"
  ],
  "cssProperties": ["--blora-select-popup-max-height"],
  "accessibilityPattern": "combobox",
  "migrationFromV1": "select.migration.md"
}
```

### 9.2 contract 是机器事实来源

由 contract + TypeScript/JSDoc 生成：

- `component-manifest.json`；
- `custom-elements.json`；
- 文档 API 表；
- JSX/Vue 类型；
- AI 组件索引；
- API snapshot；
- 部分 smoke test。

Story 不作为 API 事实来源，Story 是 contract 的使用实例。

### 9.3 命名规则

#### Tag

```text
blora-select
blora-option
blora-dialog
blora-tabs
blora-tab
blora-tab-panel
```

#### CSS class

```text
blora-button
blora-input
blora-card
blora-stack
```

2.0 新 class 不再使用不必要缩写：

- `.blora-btn` → `.blora-button`；
- `.blora-msg` → `.blora-message`；
- `.blora-cmdk-*` → `.blora-command-*`。

旧缩写只留在 compat。

#### 属性

- HTML attribute：kebab-case；
- JS property：camelCase；
- Boolean attribute 使用存在/不存在语义；
- 不允许 `disabled="false"` 被解释为 false；
- enum 值使用小写 kebab-case；
- 可反射状态必须明确 `reflects: true`。

#### 事件

规则：

- 表单值变化优先发标准 `input` 和 `change`；
- 组件生命周期事件使用 `blora-open`、`blora-close`、`blora-before-open`；
- 不再新增冒号事件；
- 所有跨 Shadow DOM 事件必须明确 `composed`；
- 可阻止的动作必须 `cancelable: true`；
- detail 必须有导出类型；
- 事件名禁止组件各自发明，例如不再同时存在 `blora:change`、`blora:treeselect-change`。

统一事件表：

| 事件                 | 使用范围            | cancelable | detail                             |
| -------------------- | ------------------- | ---------: | ---------------------------------- |
| `input`              | 值正在变化          |         否 | 无，读 `event.target.value`        |
| `change`             | 值已提交            |         否 | 无                                 |
| `blora-before-open`  | 打开前              |         是 | `{ source, reason }`               |
| `blora-open`         | 打开完成/状态已切换 |         否 | `{ source, reason }`               |
| `blora-before-close` | 关闭前              |         是 | `{ source, reason, returnValue? }` |
| `blora-close`        | 关闭后              |         否 | `{ source, reason, returnValue? }` |
| `blora-select`       | 非表单型选择动作    |         否 | `{ value, item }`                  |
| `blora-invalid`      | 自定义校验失败      |         否 | `{ validity, message }`            |

### 9.4 状态规则

优先级：

1. 原生属性；
2. ARIA 属性；
3. `data-state`；
4. 内部私有状态。

示例：

```html
<button disabled>
  <blora-select aria-expanded="true">
    <blora-dialog open data-state="open"></blora-dialog
  ></blora-select>
</button>
```

禁止把公共状态仅存成 `.is-open`。Compat 可以映射 `.is-open`，2.0 正式 API 不暴露它。

---

## 10. Web Component 基类与生命周期

### 10.1 基类职责

建立非常薄的 `BloraElement`：

```ts
export abstract class BloraElement extends HTMLElement {
  protected readonly abortController = new AbortController();
  protected readonly internals?: ElementInternals;

  connectedCallback(): void {
    this.upgradeProperties();
    this.render();
    this.bindEvents();
  }

  disconnectedCallback(): void {
    this.abortController.abort();
    this.onDisconnect();
  }

  protected listen(
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options: AddEventListenerOptions = {},
  ): void {
    target.addEventListener(type, listener, {
      ...options,
      signal: this.abortController.signal,
    });
  }

  protected emit<T>(
    name: string,
    detail: T,
    options: CustomEventInit<T> = {},
  ): boolean {
    return this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
        ...options,
      }),
    );
  }

  protected abstract render(): void;
  protected abstract bindEvents(): void;
  protected onDisconnect(): void {}
  private upgradeProperties(): void {
    // 处理 custom element upgrade 前写入的实例属性
  }
}
```

实际实现必须解决重复 connect：

- `AbortController` 在重新连接时需重新创建；
- `render()` 不得重复破坏用户内容；
- property upgrade 只执行一次；
- `define*()` 必须幂等；
- disconnected 后所有 document/window listener、observer、timer 都必须释放。

### 10.2 禁止巨型基类

`BloraElement` 不得承担：

- i18n 全量状态；
- 表格状态；
- 浮层定位；
- 表单校验规则全集；
- 请求；
- 全局主题存储。

通用能力放在独立 controller：

```text
controllers/
├── focus-controller.ts
├── form-controller.ts
├── overlay-controller.ts
├── roving-tabindex-controller.ts
├── localization-controller.ts
└── direction-controller.ts
```

### 10.3 DOM 创建与安全

优先：

- `document.createElement`；
- `<template>` 的静态可信模板；
- `textContent`；
- `setAttribute`；
- 经过严格限定的模板工具。

禁止把用户输入拼入 `innerHTML`：

```ts
// 禁止
root.innerHTML = `<div>${userContent}</div>`;

// 应使用
const div = document.createElement("div");
div.textContent = userContent;
root.replaceChildren(div);
```

Markdown、富 HTML、SVG 等需要明确 sanitizer 边界，并从核心包移出。

### 10.4 组件注册

```ts
export const BLORA_SELECT_TAG = "blora-select";

export function defineBloraSelect(
  registry: CustomElementRegistry = customElements,
): void {
  if (!registry.get(BLORA_SELECT_TAG)) {
    registry.define(BLORA_SELECT_TAG, BloraSelect);
  }
}
```

SSR 安全版本：

```ts
export function defineBloraSelect(
  registry: CustomElementRegistry | undefined = typeof customElements ===
  "undefined"
    ? undefined
    : customElements,
): void {
  if (!registry || registry.get(BLORA_SELECT_TAG)) return;
  registry.define(BLORA_SELECT_TAG, BloraSelect);
}
```

---

## 11. 表单组件规范

### 11.1 原生优先

以下组件必须以原生表单元素为核心：

```html
<label class="blora-field">
  <span class="blora-field__label">邮箱</span>
  <input class="blora-input" type="email" name="email" required />
  <span class="blora-field__help">用于接收通知</span>
</label>
```

不要让 CSS 组件依赖 JS 才能提交。

### 11.2 Form-associated Custom Elements

自定义 Select、Date Picker 等必须使用：

```ts
static formAssociated = true;

private readonly internals = this.attachInternals();
```

并实现：

- `name`；
- `value`；
- `disabled`；
- `required`；
- `form`；
- `labels`；
- `validity`；
- `validationMessage`；
- `willValidate`；
- `checkValidity()`；
- `reportValidity()`；
- `setCustomValidity()`；
- `formAssociatedCallback()`；
- `formDisabledCallback()`；
- `formResetCallback()`；
- `formStateRestoreCallback()`。

值变化时：

```ts
this.internals.setFormValue(this.value);
```

多选值需明确采用：

- 重复 key 的 `FormData`；
- JSON 字符串；
- 分隔字符串。

推荐使用 `FormData` 重复 key，并在文档中固定。

### 11.3 校验

2.0 不应再建立一套与浏览器并行、优先级模糊的全局表单校验系统。

规则：

1. 首先支持 HTML Constraint Validation。
2. 自定义组件通过 `ElementInternals.setValidity()` 接入。
3. Blora 可提供 UI 呈现层，但不替换浏览器 validity 模型。
4. 异步校验作为独立 helper，不进入所有组件基类。
5. 错误文本通过 `aria-describedby` 关联。
6. invalid 不只依赖红色表达。
7. 提交时第一个错误控件获得焦点，并确保滚入可视区域。

### 11.4 Field 组合

Field 是组合规范，不强制做自定义元素：

```html
<div class="blora-field" data-state="invalid">
  <label class="blora-field__label" for="email">
    邮箱
    <span aria-hidden="true">*</span>
  </label>
  <input
    id="email"
    class="blora-input"
    aria-invalid="true"
    aria-describedby="email-help email-error"
  />
  <div id="email-help" class="blora-field__help">工作邮箱</div>
  <div id="email-error" class="blora-field__error">请输入有效邮箱</div>
</div>
```

每个表单组件 Story 必须覆盖：

- empty；
- filled；
- placeholder；
- disabled；
- readonly；
- required；
- invalid；
- help text；
- prefix/suffix；
- long label；
- 中文/英文；
- 320px；
- dark；
- RTL；
- browser autofill；
- form reset；
- native submit。

---

## 12. 浮层系统

### 12.1 统一 Overlay Controller

Modal、Drawer、Popover、Tooltip、Dropdown、Select Popup、Date Picker 不得各自实现一套：

- portal；
- z-index；
- outside click；
- Escape；
- focus return；
- scroll lock；
- placement；
- viewport collision。

建立 `OverlayController`，至少处理：

```ts
interface OverlayOptions {
  modal: boolean;
  closeOnEscape: boolean;
  closeOnOutsidePointer: boolean;
  restoreFocus: boolean;
  trapFocus: boolean;
  lockScroll: boolean;
  placement?: Placement;
  anchor?: Element;
}
```

### 12.2 Overlay Stack

必须维护栈：

- Escape 只关闭最上层；
- 嵌套 Dialog 不应同时关闭；
- 子 Popover 点击不应触发父 Dialog outside-click；
- scroll lock 采用引用计数；
- 最后一层关闭才恢复 body；
- focus 按层级返回；
- Toast 不进入 modal focus stack。

### 12.3 原生平台能力

优先评估：

- `<dialog>`；
- Popover API；
- CSS Anchor Positioning；
- `inert`；
- `:modal`；
- `::backdrop`。

但必须根据支持基线提供 fallback 或渐进增强。每项采用决策写 ADR，不得在不同组件中随意混用。

### 12.4 Dialog 验收

Dialog 必须验证：

- 打开后焦点进入；
- `aria-labelledby` 或 `aria-label`；
- modal 使用 `aria-modal`/原生 `<dialog>`；
- Tab/Shift+Tab 不逃逸；
- Escape 可按配置关闭；
- 关闭后返回触发器；
- 遮罩点击行为可配置；
- 多层时只操作顶层；
- 页面滚动锁定不跳动；
- iOS/Safari 验证；
- reduced-motion；
- 打开/关闭事件；
- `before-close` 可阻止；
- 异步确认时按钮 loading；
- 长内容可滚动，标题/底部操作区保持可用；
- 320px 与 200% zoom。

---

## 13. 可访问性基线

目标：稳定组件符合 WCAG 2.2 AA；复合交互遵循 WAI-ARIA APG 对应模式。

### 13.1 全局要求

1. 所有交互有可访问名称。
2. 所有功能可以键盘完成。
3. 焦点指示器清晰，不能被 overflow 裁剪。
4. 不使用颜色作为唯一信息。
5. 普通文本对比度至少 4.5:1；大文本至少 3:1。
6. UI 组件和图形对象满足必要非文本对比度。
7. 指针目标按 WCAG 2.2 和产品基线设计，常用触控操作优先达到约 44×44 CSS px。
8. 支持 200% zoom 和文本放大。
9. 支持 `prefers-reduced-motion`。
10. 状态变化通过正确语义或 live region 传达。
11. `aria-*` 不替代原生语义。
12. Shadow DOM 内部可访问名称与外部 label 必须实测。

### 13.2 键盘模式

为每种模式建立测试表：

| 组件            | 必测按键                                                           |
| --------------- | ------------------------------------------------------------------ |
| Tabs            | ArrowLeft/Right 或 Up/Down、Home、End、Enter/Space（手动激活模式） |
| Select/Combobox | Arrow、Home、End、Enter、Escape、字符搜索                          |
| Dialog          | Tab、Shift+Tab、Escape                                             |
| Menu            | Arrow、Home、End、Enter、Space、Escape、字符搜索                   |
| Tree            | ArrowLeft/Right/Up/Down、Home、End、Enter/Space                    |
| Slider          | Arrow、PageUp/Down、Home、End                                      |
| Date Picker     | Arrow、Home、End、PageUp/Down、Escape、Enter                       |
| Carousel        | 控制按钮键盘激活、暂停自动播放                                     |

### 13.3 自动检查不是全部

axe 通过不代表组件可访问。每个复杂组件必须有：

- 自动 axe；
- 键盘 E2E；
- role/name/state 断言；
- 焦点序列断言；
- 至少一次人工屏幕阅读器记录，写入组件 docs。

Release Candidate 建议人工抽测：

- NVDA + Firefox/Chrome；
- VoiceOver + Safari；
- Windows High Contrast；
- 400% zoom；
- reduced-motion；
- RTL。

---

## 14. i18n、方向与文案

### 14.1 i18n 分层

核心包只管理组件自带文案，例如：

- Close；
- Previous/Next；
- Clear；
- Loading；
- No results。

业务文案不进入 Blora。

### 14.2 Locale API

```ts
interface BloraLocale {
  code: string;
  direction: "ltr" | "rtl";
  messages: Record<BloraMessageKey, string>;
  date?: {
    months: readonly string[];
    weekdays: readonly string[];
    firstDayOfWeek: number;
  };
}

setLocale(locale: BloraLocale): void;
getLocale(): Readonly<BloraLocale>;
```

不要再让一个 `locale` 参数同时接受字符串、旧日期对象、部分 pack 和任意 messages，导致类型模糊。兼容层负责解析旧输入。

### 14.3 文案键

所有键集中声明并生成类型：

```ts
export type BloraMessageKey =
  | "common.close"
  | "common.clear"
  | "select.placeholder"
  | "select.noResults"
  | "pagination.previous"
  | "pagination.next";
```

构建时校验：

- 每个 locale 键齐全；
- 无多余键；
- 插值变量一致；
- 文档列出缺省 fallback。

### 14.4 日期与时间

优先使用 `Intl.DateTimeFormat`、`Intl.NumberFormat`、`Intl.Collator`，不要手写所有 locale 格式。

Date Picker 必须区分：

- 展示值；
- 提交值；
- 时区；
- locale；
- first day of week；
- min/max；
- 日期和日期时间。

  2.0.0 如果无法正确处理时区，应只承诺 local date，不要声称是完整 datetime 解决方案。

---

## 15. 配置系统

### 15.1 去除隐式全局可变配置

1.x 的全局 `CONFIG` 会影响页面所有组件。2.0 改为：

1. CSS 主题通过根属性和 Token；
2. locale 通过 context/provider；
3. 单组件配置通过属性/属性值；
4. 仅保留极少数全局默认项；
5. 支持局部根节点覆盖。

推荐：

```html
<div
  class="blora-root"
  data-blora-theme="ocean"
  data-blora-density="compact"
  lang="zh-CN"
>
  ...
</div>
```

### 15.2 主题闪烁

提供官方、极小的 head 脚本：

```html
<script src=".../color-scheme-init.min.js"></script>
```

该脚本只负责在 CSS 解析前读取颜色模式并写根属性。必须：

- 可选；
- 无内联脚本要求；
- 支持自定义 storage key；
- CSP 友好；
- 不承担组件注册。

### 15.3 存储

组件库默认不应擅自把所有状态写入 localStorage。

允许持久化：

- 用户选择的 color scheme；
- 用户显式选择的 theme；
- 表格列设置（必须有稳定 key）。

持久化必须：

- 可关闭；
- storage key 可配置；
- 捕获 storage 异常；
- 不存敏感数据；
- 不在 SSR import 时访问 storage。

---

## 16. 组件分层与迁移矩阵

### 16.1 包分层

#### Stable Core

2.0.0 必须稳定：

- Tokens；
- Foundations；
- Typography；
- Button / Icon Button；
- Link；
- Field；
- Input / Textarea；
- Checkbox / Radio / Switch；
- Native Select skin；
- Custom Select / Combobox；
- Card / Panel；
- Tag / Badge / Avatar；
- Alert；
- Spinner / Progress / Skeleton；
- Container / Stack / Cluster / Grid；
- Navbar 基础布局；
- Tabs；
- Breadcrumb；
- Pagination；
- Table 基础展示；
- Dropdown / Menu；
- Tooltip / Popover；
- Dialog；
- Drawer；
- Toast / Notification；
- Empty / Result；
- Collapse / Accordion。

#### Advanced

可以在 2.0.x 稳定，2.0.0 中不得假装完成：

- Date Picker；
- Time Picker；
- Calendar；
- Cascader；
- Tree Select；
- Transfer；
- Virtual Table；
- Table column settings；
- Carousel；
- Tour；
- Splitter；
- Command Palette；
- File Upload；
- OTP；
- Mentions；
- AutoComplete；
- Color Picker。

#### Add-ons

移出核心：

- Markdown；
- Thread/BBS；
- QRCode；
- Text FX；
- Text Rotate；
- Countdown；
- CountUp；
- Image Diff；
- Hover Gallery；
- Deck；
- Mockup；
- Watermark；
- Masonry；
- Speed Dial；
- Chart mock；
- 纯视觉媒体效果。

### 16.2 1.x → 2.x 组件迁移表

| 1.x 能力                    | 2.x 目标                             | 类型                | 2.0.0 状态   |
| --------------------------- | ------------------------------------ | ------------------- | ------------ |
| `.blora-btn`                | `.blora-button`                      | 原生元素样式        | stable       |
| `.blora-input`              | `.blora-input`                       | 原生元素样式        | stable       |
| `.blora-textarea`           | `.blora-textarea`                    | 原生元素样式        | stable       |
| `.blora-checkbox`           | `.blora-checkbox` + native input     | 原生语义组合        | stable       |
| `.blora-radio`              | `.blora-radio` + native input        | 原生语义组合        | stable       |
| `.blora-switch`             | `.blora-switch` + checkbox           | 原生语义组合        | stable       |
| `.blora-select` 原生皮肤    | `.blora-select-native`               | 原生 select         | stable       |
| 自定义 `.blora-select-wrap` | `<blora-select>`                     | Form-associated WC  | stable       |
| `.blora-tabs`               | `<blora-tabs>`                       | WC                  | stable       |
| `.blora-modal`              | `<blora-dialog>`                     | WC                  | stable       |
| `.blora-drawer`             | `<blora-drawer>`                     | WC                  | stable       |
| `.blora-dropdown`           | `<blora-dropdown>`                   | WC                  | stable       |
| `.blora-tooltip`            | `<blora-tooltip>` 或属性增强         | WC                  | stable       |
| `.blora-popover`            | `<blora-popover>`                    | WC                  | stable       |
| Toast/Notify/Message        | `toast()` + `<blora-toast-region>`   | Service + WC        | stable       |
| `.blora-table`              | `.blora-table`                       | 原生 table 样式     | stable       |
| `data-blora-table` 行为     | `createTableController()`            | Headless controller | beta         |
| `.blora-pagination`         | `<blora-pagination>`                 | WC                  | stable       |
| `.blora-collapse`           | native details / `<blora-accordion>` | 混合                | stable       |
| `.blora-tree`               | `<blora-tree>`                       | WC                  | beta         |
| TreeSelect                  | `<blora-tree-select>`                | WC                  | beta         |
| DatePicker                  | `<blora-date-picker>`                | Form-associated WC  | beta         |
| TimePicker                  | `<blora-time-picker>`                | Form-associated WC  | beta         |
| Cascader                    | `<blora-cascader>`                   | Form-associated WC  | beta         |
| Transfer                    | `<blora-transfer>`                   | Form-associated WC  | beta         |
| Markdown                    | `@bloret-crew/blora-markdown`        | add-on              | beta         |
| Thread                      | `@bloret-crew/blora-thread`          | add-on/pattern      | experimental |
| QRCode                      | `@bloret-crew/blora-qrcode`          | add-on              | experimental |
| Text FX                     | `@bloret-crew/blora-effects`         | add-on              | experimental |

### 16.3 状态等级

每个组件 contract 必须声明：

- `experimental`：API 可能变化，不进入默认 `auto`；
- `beta`：API 基本稳定，但仍可能有 minor 变更；
- `stable`：遵循 SemVer；
- `deprecated`：文档提供替代方案和移除版本。

只有 stable 组件可作为 2.0.0 完成度宣传。

---

## 17. 关键组件实施规格

### 17.1 Button

HTML：

```html
<button
  class="blora-button"
  type="button"
  data-variant="primary"
  data-size="md"
>
  <svg class="blora-button__icon" aria-hidden="true">...</svg>
  <span class="blora-button__label">保存</span>
</button>
```

合法 variant：

```text
primary | secondary | outline | ghost | danger | text
```

合法 size：

```text
xs | sm | md | lg | xl
```

规范：

- 默认不推断 `type`，文档要求在表单内显式写；
- loading 使用 `aria-busy="true"` 和 `data-loading`；
- loading 时保留按钮宽度；
- loading 时是否 disabled 必须由 helper 同步；
- icon-only 必须有 `aria-label`；
- 不允许只放无名称 SVG；
- danger 不自动等于确认流程；
- anchor 不能伪装 disabled button，若是导航仍用 `<a>`。

辅助函数可选：

```ts
setButtonLoading(button, true, { label: "保存中" });
```

但 CSS 本身不依赖该 helper。

### 17.2 Select / Combobox

必须先分别定义：

- native select skin；
- select-only combobox；
- editable combobox/autocomplete；
- multi-select。

不要用一个 `searchable` 开关让所有键盘模型混在一起。

关键行为：

- trigger 有可访问名称；
- popup role 与 `aria-controls` 正确；
- open 同步 `aria-expanded`；
- active option 同步 `aria-activedescendant` 或 roving tabindex；
- Escape 关闭并恢复；
- 键入字符执行 type-ahead；
- editable 模式区分 `input` 值和 committed value；
- disabled option 跳过；
- multiple 提交值有明确定义；
- 选项动态变化使用 MutationObserver 或 property API；
- 大列表虚拟化不得破坏 `aria-setsize`/`aria-posinset`；
- mobile 触控和屏幕阅读器实测；
- label 点击聚焦组件；
- form reset 和 browser restore 可用。

### 17.3 Tabs

HTML：

```html
<blora-tabs activation="automatic">
  <blora-tab slot="tab" panel="overview">概览</blora-tab>
  <blora-tab slot="tab" panel="settings">设置</blora-tab>
  <blora-tab-panel name="overview">...</blora-tab-panel>
  <blora-tab-panel name="settings">...</blora-tab-panel>
</blora-tabs>
```

支持：

- automatic / manual activation；
- horizontal / vertical；
- disabled tab；
- selected value；
- 受控/非受控模式的明确边界；
- 动态新增/删除；
- 深链接作为可选 controller，不内置修改 URL。

### 17.4 Toast

API：

```ts
const handle = toast({
  variant: "success",
  title: "保存成功",
  description: "修改已经发布",
  duration: 5000,
  action: {
    label: "撤销",
    onClick: () => undo(),
  },
});

handle.update({ description: "已同步到云端" });
handle.close();
```

要求：

- 普通提示 `role="status"`；
- 紧急错误谨慎使用 `role="alert"`；
- hover/focus 暂停计时；
- 页面不可见时暂停计时；
- 操作按钮可键盘访问；
- 队列有上限；
- 不因新 Toast 抢夺焦点；
- reduced-motion；
- region 有可访问名称；
- promise toast 独立 helper，不污染核心数据请求。

### 17.5 Table

拆成两层：

1. CSS-only native table；
2. 可选 headless controller。

不要默认把 table 改成 ARIA grid。只有实现完整二维键盘导航时才使用 grid。

Controller：

```ts
const controller = createTableController(table, {
  sort: true,
  selection: "multiple",
  pagination: { pageSize: 20 },
});

controller.getState();
controller.setRows(rows);
controller.destroy();
```

必须有 `destroy()`。不得再通过 dataset 私有 bound 标记永久占用节点。

虚拟表格、列固定、列设置和拖拽排序属于 advanced，必须单独测试。

### 17.6 Markdown

从核心移出，原因：

- 安全策略独立；
- Markdown 语法和 sanitizer 是专门领域；
- 不应让所有 UI 用户下载解析器；
- 自定义解析器容易产生 XSS 和兼容缺陷。

Add-on API 必须要求使用者选择安全策略：

```ts
renderMarkdown(source, {
  sanitize: true,
  allowHtml: false,
});
```

如果没有可靠 sanitizer，默认禁止原始 HTML。

---

## 18. Story 与文档系统

### 18.1 展示页不再手写组件实现

现有 `index.html` 冻结为：

```text
legacy/showcase-v1.html
```

仅用于视觉迁移对照，不再作为 2.0 文档入口。

2.0 文档使用 Storybook Web Components 或等价的“Story 单一来源”系统。推荐 Storybook，因为它能统一：

- Live preview；
- Controls；
- 自动文档；
- source snippet；
- a11y；
- 视觉快照；
- 交互测试。

### 18.2 Story 结构

```ts
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraSelect } from "./select";

defineBloraSelect();

const meta = {
  title: "Forms/Select",
  component: "blora-select",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Form-associated select-only combobox.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-select name="country" label="国家或地区">
      <blora-option value="cn">中国</blora-option>
      <blora-option value="jp">日本</blora-option>
    </blora-select>
  `,
};
```

Storybook 自身可以使用 Lit 模板作为开发依赖；正式组件运行时不得因此依赖 Lit。

### 18.3 每个组件必需 Story

至少：

```text
Default
Variants
Sizes
States
Disabled
Invalid
LongContent
Responsive
Dark
RTL
ReducedMotion
Keyboard
RealisticComposition
```

复杂组件增加：

```text
Controlled
Uncontrolled
DynamicContent
NestedOverlay
Empty
Loading
Error
LargeDataset
FormSubmit
FormReset
```

### 18.4 示例源码一致性

文档展示的代码必须来自 Story 的 render 或共享 fixture。

禁止：

- 为文档复制一份“更漂亮”的 HTML；
- Story 通过私有 class 修正组件；
- 文档示例使用未发布 API；
- 在 docs 全局 CSS 中覆盖组件缺陷。

`check-doc-examples.mjs` 应校验：

- 示例中的 tag/attribute/variant 在 contract 中存在；
- 导入路径在 package exports 中存在；
- 示例可以构建；
- 示例没有 legacy API，除非明确位于迁移文档。

### 18.5 展示页专属样式

Docs shell 可以有 `.docs-*` 样式，但：

- 不使用 `.blora-*` 命名；
- 不进入 npm 包；
- 不改变组件内部；
- 示例 Canvas 使用与用户页面相同的正式 CSS 入口；
- Demo 不得依赖 Docs 父节点获得正确宽高或颜色。

---

## 19. 面向 AI 的工程契约

### 19.1 必需文件

根目录发布：

```text
AGENTS.md
llms.txt
component-manifest.json
custom-elements.json
schemas/component-contract.schema.json
docs/ai/migration-rules.md
docs/ai/anti-patterns.md
docs/ai/task-recipes.md
```

### 19.2 `AGENTS.md`

应包含：

```md
# Blora Design contribution rules

- Read the target component contract before editing.
- Do not add public attributes, events, classes, CSS parts, or tokens without
  updating the contract and API snapshot.
- Prefer native HTML semantics.
- Use a custom element only for composite behavior.
- Do not write user content through innerHTML.
- Do not add raw colors, spacing, shadows, motion durations, or z-index values
  in component CSS.
- Every behavior change requires browser tests.
- Every visual change requires reviewed snapshot updates.
- Run pnpm verify before declaring completion.
- Do not edit generated files directly.
```

### 19.3 `llms.txt`

控制在易读范围，包含：

- 系统定位；
- 安装方法；
- 核心使用原则；
- 官方文档入口；
- manifest 路径；
- 组件索引；
- 禁止事项；
- 迁移入口。

不要把全部文档复制到 `llms.txt`。

### 19.4 `component-manifest.json`

这是比 CEM 更偏 Blora 使用规范的索引：

```json
{
  "schemaVersion": "1.0",
  "library": {
    "name": "Blora Design",
    "package": "@bloret-crew/blora-design",
    "version": "2.0.0"
  },
  "components": [
    {
      "name": "button",
      "kind": "native",
      "selector": "button.blora-button",
      "status": "stable",
      "docs": "./docs/components/button.md",
      "contract": "./contracts/button.contract.json",
      "examples": ["./examples/button/default.html"]
    },
    {
      "name": "select",
      "kind": "custom-element",
      "tagName": "blora-select",
      "status": "stable",
      "docs": "./docs/components/select.md",
      "contract": "./contracts/select.contract.json"
    }
  ]
}
```

### 19.5 AI 迁移校验器

实现：

```bash
pnpm blora migrate:check ./path/to/app
```

或：

```bash
npx @bloret-crew/blora-codemod check ./src
```

第一版至少检测：

- 不存在的 `.blora-*` class；
- 不存在的 `<blora-*>` tag；
- 不存在的 attribute/variant/size；
- 使用 `.is-open` 等私有状态；
- 直接访问 Shadow DOM；
- 直接依赖 `__` 内部 class；
- 组件 CSS 中覆盖未公开内部结构；
- Blora 作用域内裸用需要统一皮肤的控件；
- 写死已可由 Token 表达的颜色/间距/圆角；
- 缺少 button `type`；
- icon-only button 缺少名称；
- input 缺 label；
- 旧的 `data-blora-*`；
- 旧 `Blora.init()`；
- 旧 `blora:*` 事件。

输出必须包含：

```text
文件:行号
规则 ID
问题
建议替换
迁移文档链接
是否可自动修复
```

### 19.6 Codemod

优先实现低风险自动转换：

```text
.blora-btn                  -> .blora-button
.blora-btn--primary         -> data-variant="primary"
.blora-btn--sm              -> data-size="sm"
.blora-dark                 -> data-blora-color-scheme="dark"
data-blora-modal-open       -> 对应 dialog.show()
blora:appearancechange      -> blora-appearance-change（若保留）
```

复杂 DOM（Select、Table、DatePicker）只生成 TODO 报告，不做不可验证的自动重写。

---

## 20. 测试体系

### 20.1 测试金字塔

#### Unit

测试：

- Token 转换；
- 状态 reducer；
- value normalization；
- locale 插值；
- placement 计算；
- contract schema；
- register 幂等；
- SSR import。

#### Browser Component / Integration

Playwright 测试：

- 真实 Custom Element upgrade；
- 用户交互；
- Shadow DOM；
- 表单提交/reset；
- 焦点；
- 事件；
- 动态连接/断开；
- 多实例；
- 多文档/iframe（关键组件）；
- React/Vue fixture。

#### Visual

截图：

- light/dark；
- desktop/mobile；
- default/hover/focus/active/disabled/invalid；
- long content；
- 中文/英文；
- RTL；
- high contrast（可用模拟的部分）；
- overlays。

### 20.2 Playwright 项目

建议：

```ts
projects: [
  { name: "chromium", use: devices["Desktop Chrome"] },
  { name: "firefox", use: devices["Desktop Firefox"] },
  { name: "webkit", use: devices["Desktop Safari"] },
  { name: "mobile-chromium", use: devices["Pixel 7"] },
  { name: "mobile-webkit", use: devices["iPhone 15"] },
  { name: "a11y", use: devices["Desktop Chrome"] },
  { name: "visual", use: devices["Desktop Chrome"] },
];
```

普通 PR：

- Chromium 全量；
- Firefox/WebKit 核心交互；
- visual 关键矩阵。

合并到主分支/发布：

- 全浏览器矩阵。

### 20.3 组件测试模板

```ts
test("submits the selected value with a native form", async ({ page }) => {
  await page.setContent(`
    <form id="form">
      <blora-select name="country">
        <blora-option value="cn">中国</blora-option>
        <blora-option value="jp">日本</blora-option>
      </blora-select>
      <button type="submit">提交</button>
    </form>
  `);

  await installBlora(page);
  await page.locator("blora-select").click();
  await page.getByRole("option", { name: "日本" }).click();

  const value = await page
    .locator("#form")
    .evaluate((form: HTMLFormElement) => {
      return new FormData(form).get("country");
    });

  expect(value).toBe("jp");
});
```

还要测试：

- upgrade 前 property；
- disconnect/reconnect；
- listener 是否重复；
- programmatic property update；
- attribute update；
- form reset；
- disabled；
- invalid；
- event bubbles/composed/cancelable；
- 多实例隔离。

### 20.4 a11y

使用 `@axe-core/playwright`：

```ts
const results = await new AxeBuilder({ page }).include("#story-root").analyze();

expect(results.violations).toEqual([]);
```

如果必须暂时豁免：

- 只允许具体规则、具体 Story；
- 写 issue；
- 写 owner；
- 写截止版本；
- 不允许全局 disable axe rule。

### 20.5 视觉快照治理

规则：

1. 快照只能由明确的视觉变更更新。
2. PR 必须说明变更原因。
3. 不允许执行“更新全部快照”后不审查。
4. 动画、时间、随机数和系统字体必须固定。
5. 截图使用仓库自带字体或可靠 fallback。
6. 每个截图应只包含一个有意义状态，避免超长全组件拼图。
7. 1.x 展示页仅作为迁移参考，不作为 2.0 永久像素基线。

### 20.6 包测试

必须对打包产物测试，而不仅是 `src`：

- `npm pack`；
- 在临时 fixture 安装 tgz；
- ESM import；
- 子路径 import；
- CSS import；
- CDN/global bundle；
- Node SSR import；
- TypeScript compile；
- React；
- Vue；
- 纯 HTML；
- 检查 package `files` 没有遗漏 manifest 和 CSS。

---

## 21. 性能与包体积

### 21.1 预算

首轮建议预算，实施后根据真实产物调整并锁定：

| 产物                       |              gzip 目标 |
| -------------------------- | ---------------------: |
| Tokens CSS                 |                 ≤ 8 KB |
| Foundations CSS            |                ≤ 10 KB |
| Button CSS + helper        |                 ≤ 3 KB |
| Select JS                  |                ≤ 15 KB |
| Dialog JS                  |                ≤ 10 KB |
| Stable components JS 全量  |                ≤ 80 KB |
| Stable components CSS 全量 |                ≤ 70 KB |
| Compat v1 JS/CSS           | 单独统计，不计核心预算 |

预算不是通过降低可访问性实现。超标时先拆包、去重复、延迟加载。

### 21.2 初始化性能

禁止继续在每次 `init(root)` 时运行 50 多次 `querySelectorAll()`。

2.0：

- 原生 CSS 组件不初始化；
- Custom Elements 浏览器自动按 tag upgrade；
- 全局 service 只在首次调用创建；
- 动态插入无需业务再次调用 `Blora.init()`；
- 不使用全页 MutationObserver 扫描所有节点；
- 大列表使用按需 controller。

### 21.3 内存与清理

测试必须确认：

- disconnect 后 document/window listener 被移除；
- ResizeObserver/IntersectionObserver/MutationObserver disconnect；
- timer clear；
- overlay portal 删除；
- Toast handle 释放；
- 多次打开关闭不会线性增长节点；
- `defineAll()` 多次执行不报错。

---

## 22. 安全与 CSP

### 22.1 核心安全规则

禁止：

- 把用户字符串插入 `innerHTML`；
- `eval`；
- `new Function`；
- 内联 `onclick`；
- 从 dataset 执行函数名；
- 自动解析并执行 Markdown/HTML；
- 不受限地复制用户属性到内部节点；
- 在 URL 属性中允许 `javascript:`。

### 22.2 Trusted Types

核心包应做到不要求 Trusted Types policy。需要 HTML 的 add-on：

- 接受 sanitizer；
- 默认不允许 raw HTML；
- 文档说明 CSP/Trusted Types 集成；
- 测试常见 XSS payload。

### 22.3 SVG/Icon

建议图标 API：

- 用户通过 slot 传 SVG；
- 官方 icon 单独包；
- 内部必要图标使用静态可信模板；
- 禁止接受任意 SVG 字符串后 `innerHTML`。

---

## 23. 1.x 兼容层

### 23.1 兼容目标

兼容层用于迁移，不用于永久维持所有内部实现。

支持范围分级：

| 等级 | 含义                             |
| ---- | -------------------------------- |
| A    | 旧 markup 基本不改即可工作       |
| B    | 样式兼容，行为需一次 codemod     |
| C    | 提供迁移警告和文档，不自动兼容   |
| D    | 2.0 移除，改为 add-on 或外部方案 |

### 23.2 兼容入口

```html
<link rel="stylesheet" href=".../blora.css" />
<link rel="stylesheet" href=".../compat/v1.css" />
<script type="module">
  import { initV1Compatibility } from ".../compat/v1.js";
  initV1Compatibility();
</script>
```

Compat 层必须：

- 独立打包；
- 默认不随现代入口加载；
- 开发环境输出一次性 warning；
- 支持关闭 warning；
- 提供检测报告；
- 明确计划至少维护到哪个 2.x 版本。

### 23.3 Deprecation warning

```text
[Blora compat] `.blora-btn--primary` is deprecated.
Use `.blora-button[data-variant="primary"]`.
See: /docs/migration/v1-to-v2#button
```

同一规则每页只警告一次，避免刷屏。

### 23.4 迁移文档结构

`docs/migration/v1-to-v2.md`：

1. 升级前检查；
2. 安装方式；
3. CSS 入口变化；
4. 全局 API 变化；
5. Token 映射；
6. Class 映射；
7. data attribute 映射；
8. event 映射；
9. 按组件 before/after；
10. 自动 codemod；
11. 无法自动迁移的内容；
12. 常见错误；
13. 回滚方法。

---

## 24. CI 与发布

### 24.1 PR CI

`.github/workflows/ci.yml` 至少：

```text
checkout
setup node 22
enable corepack
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:browser
pnpm size
pnpm pack:test
```

### 24.2 并行任务

拆成：

- lint/type；
- unit；
- build/package；
- browser；
- visual；
- migration fixtures。

最终需要一个 required aggregate job，避免 branch protection 随矩阵名称变化失效。

### 24.3 预览

每个 PR 构建 Storybook 静态预览，方便人工审核：

- 组件 API；
- 视觉变化；
- a11y panel；
- dark/RTL；
- migration example。

### 24.4 Changesets

每个公共变更必须有 changeset：

```md
---
"@bloret-crew/blora-design": minor
---

Add form-associated `blora-select`.
```

2.0 开发期：

- 发布 `2.0.0-alpha.n`；
- 再发布 `beta`；
- 再发布 `rc`；
- 最后 stable。

### 24.5 Release Channel

```text
next   -> 2.0.0-alpha / beta / rc
latest -> 稳定版
legacy -> 最新 1.x
```

不要在稳定前把不完整 2.0 标为 `latest`。

### 24.6 发布门禁

发布 workflow 必须检查：

- tag 与 package version 一致；
- 工作树对应 commit；
- `pnpm verify`；
- `npm pack` 内容；
- provenance；
- changelog；
- migration docs；
- custom-elements.json；
- component-manifest.json；
- docs build；
- 包体积；
- npm dry-run；
- 无未处理 changeset。

建议开启 npm Trusted Publishing / provenance，减少长期 token 风险。若暂时沿用 `NPM_TOKEN`，需记录迁移计划。

---

## 25. 分阶段实施计划

### Phase 0：冻结与基线

目标：保存 1.0 行为事实，避免重构过程中失去参照。

任务：

- 将当前 HEAD `a148715d06ee9551cbee262ffae6ad377b564df6` 记录为 2.0 唯一视觉来源；如果正式开工前 HEAD 已变化，必须由维护者确认新的基准 commit，并同步更新本文档；
- 创建 `v1-maintenance` 分支；
- 将现有 `index.html` 复制到 `legacy/showcase-v1.html`；
- 将现有 `blora.css/js/d.ts` 移入 `legacy/v1/` 或保留根文件并标记；
- 记录当前 npm 包内容；
- 在锁定浏览器、viewport、DPR、字体、语言、主题和动效设置后，对当前展示页全部组件生成迁移参考截图；
- 对 hover、focus、active、disabled、loading、invalid、open、selected 等可见状态生成逐组件基准；
- 对含动画的组件记录初始、关键中间状态、结束状态以及 duration/easing；
- 收集公共 class、data attribute、事件、Token、JS API；
- 生成 `docs/refactor/v1-public-surface.json`；
- 建立 `component-matrix.md`；
- 建立 `docs/refactor/visual-baseline.json`，记录基准 commit、浏览器版本、viewport、DPR、字体和截图路径；
- 在 `AGENTS.md` 中明确禁止从历史版本、旧包和其他设计系统提取视觉样式；
- 不改视觉。

验收：

- 能运行 1.0 展示页；
- 有结构化 API 清单；
- 有 1.0 安装包 fixture；
- 有版本维护策略。
- 每个待迁移组件都能追溯到当前展示页中的视觉基准或明确标记“当前展示页未覆盖”；
- 任意视觉截图都能证明来自所记录的唯一基准 commit，而不是历史版本。

建议提交：

```text
chore(refactor): capture v1 public surface and visual baseline
```

### Phase 1：Workspace 与门禁

任务：

- pnpm workspace；
- TypeScript strict；
- ESLint/Stylelint/Prettier；
- Vitest；
- Playwright；
- Storybook；
- Changesets；
- CI；
- `pnpm verify`；
- `npm pack` fixture。

验收：

- 空的新架构可以完整 build/test；
- 现有 legacy 文件不阻塞 lint，可通过明确 ignore；
- CI required checks 可运行；
- 没有迁移业务组件。

提交：

```text
build: establish v2 workspace and quality gates
```

### Phase 2：Token

任务：

- 将现有 CSS Token 抽到 DTCG 风格 JSON；
- 建 Primitive/Semantic/Component 三层；
- 迁移 light/dark；
- 迁移所有 palette；
- 生成 CSS/TS/manifest；
- 建 v1 映射；
- 建颜色对比校验；
- 建 Token 文档页面。

验收：

- 生成值与 1.x 基线可比；
- 组件 CSS 无手写颜色；
- dark 语义完整；
- palette 只覆盖主题相关 Token；
- build 是确定性的，连续运行无 diff。

提交：

```text
feat(tokens): add generated three-layer token system
```

### Phase 3：Foundations

任务：

- optional reset；
- base typography；
- focus styles；
- container/stack/cluster/grid；
- utility 最小集合；
- `@layer`；
- RTL/logical properties；
- reduced-motion。

验收：

- 嵌入任意宿主页面不会重置宿主全部 button/list；
- 纯 HTML fixture 可用；
- 布局 Story 通过 320px 和 RTL；
- 无 Demo 专属修复。

### Phase 4：三个试点组件

顺序：

1. Button：验证 CSS-only contract；
2. Dialog：验证 overlay、focus、events；
3. Select：验证 form-associated、复杂键盘和 Shadow DOM。

这三个组件完成后必须暂停扩张，复盘：

- contract 是否足够；
- Story 是否真能复用为测试；
- manifest 是否能生成；
- React/Vue 是否能消费；
- 包入口是否 Tree-shaking；
- compat 是否可行；
- AI 检查器是否能识别错误。

验收后写 ADR 更新。

### Phase 5：核心表单和反馈

迁移：

- Field；
- Input；
- Textarea；
- Checkbox；
- Radio；
- Switch；
- Native Select；
- Tag；
- Alert；
- Progress；
- Spinner；
- Skeleton；
- Toast。

每个组件必须完成 Definition of Done。

### Phase 6：导航与浮层

迁移：

- Tabs；
- Breadcrumb；
- Pagination；
- Dropdown/Menu；
- Tooltip；
- Popover；
- Drawer；
- Navbar 基础。

重点测试嵌套浮层和键盘。

### Phase 7：数据与内容基础

迁移：

- Card/Panel；
- Table CSS；
- 可选 Table controller；
- List；
- Accordion；
- Timeline；
- Empty；
- Result；
- Avatar/Badge。

虚拟化等高级能力先 beta。

### Phase 8：兼容层与 Codemod

任务：

- Token 映射；
- class 映射；
- 旧 data behavior adapter；
- 事件别名；
- warning；
- codemod；
- migration fixtures；
- `migrate:check`。

验收：

- 至少三个真实风格 fixture 从 1.x 迁到 2.x；
- compat 不进入 modern bundle；
- warning 不重复；
- 迁移报告可定位文件与行。

### Phase 9：Add-ons

按风险拆出 Markdown、Thread、QRCode、Effects。无法达到安全/质量要求的功能可暂不发布，不能为了“功能数量不减少”留在核心。

### Phase 10：预发布

#### Alpha

- 架构和 API 可变；
- 收集纯 HTML/React/Vue 项目反馈。

#### Beta

- stable core API 冻结；
- 只修缺陷；
- 开始写完整迁移文档。

#### RC

- 不再新增组件；
- 全浏览器回归；
- 人工 a11y；
- 包体积审查；
- npm 安装演练；
- CDN 演练；
- 回滚演练。

#### Stable

- `2.0.0` 发布；
- docs 对应版本；
- `latest` 切换；
- 1.x 标记 legacy，但保留安全修复策略。

---

## 26. 每个组件的 Definition of Done

一个组件只有同时满足以下项目才可标记 stable：

### 实现

- [ ] 使用正确原生语义或有 ADR 说明。
- [ ] 公共 API 最小且一致。
- [ ] 没有依赖 Demo/Story 样式。
- [ ] disconnect 后无泄漏。
- [ ] 动态属性更新有效。
- [ ] 多实例隔离。
- [ ] SSR import 安全。
- [ ] 无不可信 `innerHTML`。

### 样式

- [ ] 只使用登记 Token。
- [ ] light/dark。
- [ ] hover/focus/active/disabled/invalid。
- [ ] 320px。
- [ ] 200% zoom。
- [ ] long content。
- [ ] RTL。
- [ ] reduced-motion。
- [ ] 宿主样式冲突验证。

### API

- [ ] contract。
- [ ] TypeScript。
- [ ] attributes/properties/events/slots/parts。
- [ ] custom-elements.json。
- [ ] API snapshot。
- [ ] SemVer/changeset。

### 测试

- [ ] unit。
- [ ] browser interaction。
- [ ] keyboard。
- [ ] event flags。
- [ ] a11y。
- [ ] visual。
- [ ] form submit/reset（如适用）。
- [ ] connect/disconnect。
- [ ] package fixture。

### 文档

- [ ] Overview。
- [ ] Usage。
- [ ] Variants。
- [ ] API。
- [ ] Accessibility。
- [ ] Theming。
- [ ] Do/Don't。
- [ ] 1.x migration。
- [ ] React/Vue notes。
- [ ] AI-readable example。

---

## 27. 代码审查清单

审查者必须回答：

1. 这是原生元素可以解决的问题吗？
2. 新 API 是否能由现有 API 组合出来？
3. 是否引入第二种状态表达方式？
4. 是否新增未登记 Token/class/event/part？
5. 是否存在 Story 私有修正？
6. 是否有真实浏览器测试？
7. 键盘和焦点是否有断言，而非只靠 axe？
8. disconnect 是否清理？
9. 是否破坏 SSR import？
10. 是否增加运行时依赖？
11. 是否增加全量包但不能 Tree-shake？
12. 是否需要 changeset？
13. 是否更新迁移文档？
14. 视觉快照变化是否合理？
15. 是否在复杂组件里重复实现 overlay/form/i18n controller？
16. 用户字符串是否进入 HTML？
17. 是否依赖 Demo 父容器？
18. 是否在 320px、dark、RTL 下验证？

---

## 28. Vibe Coding Agent 的具体任务模板

把以下模板作为每次组件迁移任务的开头：

```md
你正在迁移 Blora Design 2.0 的 [COMPONENT]。

必须先阅读：

- Blora-Design-2.0-Refactor-Spec.md
- AGENTS.md
- 目标组件 contract
- 目标组件对应 WAI-ARIA APG 模式
- legacy/v1 中该组件实现
- docs/refactor/component-matrix.md

执行范围：

1. 建立或更新 component contract。
2. 实现源码，不修改无关组件。
3. 增加类型、Story、单元测试、Playwright、axe、视觉测试。
4. 增加 v1 → v2 迁移说明。
5. 更新 manifest 和 API snapshot。
6. 运行 pnpm verify。

硬性约束：

- 优先原生 HTML。
- 不增加运行时依赖。
- 不用 innerHTML 写用户数据。
- 不写死颜色、间距、圆角、阴影、时长和 z-index。
- 不使用 Demo 私有 CSS 修复组件。
- 不跳过测试。
- 不编辑 generated 文件。
- 不顺手重构范围外代码。

完成报告必须包含：

- 修改文件；
- 公共 API 变化；
- 测试结果；
- 包体积变化；
- a11y 决策；
- 未解决问题；
- 是否需要 changeset。
```

### 28.1 第一次执行总提示词

```md
请按照《Blora Design 2.0 重构实施规格》执行 Phase 0 和 Phase 1。

此轮不要迁移任何组件，也不要改现有视觉。目标是：

- 冻结 1.0 行为和公共 API；
- 建立 pnpm workspace；
- 建立 TypeScript strict、lint、unit、Playwright、Storybook、Changesets 和 CI；
- 建立 docs/refactor/status.md 与 component-matrix.md；
- 让 pnpm verify 在新骨架上通过。

每完成一个阶段单独提交。遇到规范中未决定的问题时写 ADR，不要自行扩大范围。
```

### 28.2 Token 阶段提示词

```md
执行 Phase 2，仅重构 Design Tokens。

要求：

- 以 DTCG 风格 .tokens.json 为源；
- Primitive、Semantic、Component 三层；
- 覆盖现有 light/dark 和全部 palette；
- 生成 CSS/TypeScript/manifest；
- 建立完整 v1 → v2 token mapping；
- 增加循环引用、类型、缺失主题、硬编码颜色和颜色对比校验；
- 保持组件代码暂不迁移；
- build 连续执行不得产生 diff。
```

### 28.3 试点阶段提示词

```md
执行 Phase 4，严格按 Button → Dialog → Select 顺序。

每完成一个组件暂停并运行完整 verify。三个组件完成后不要继续扩张，
先输出架构复盘，验证：

- CSS-only 原生组件契约；
- Overlay controller；
- Form-associated custom element；
- Story/测试/文档单源；
- custom-elements.json；
- 纯 HTML、React、Vue fixture；
- Tree-shaking 和 SSR import；
- v1 compat/codemod 可行性。
```

---

## 29. 禁止事项

以下做法即使“看起来能运行”也不得合并：

1. 把 6,300 行 JS 机械分文件，但仍由一个全局 `init()` 扫描。
2. 把所有组件都改成自定义元素。
3. 把所有组件都塞进一个 `customElements.define` bundle。
4. 只改目录，不建立 contract 和测试。
5. 用 Storybook Controls 代替正式 API 设计。
6. 让 Story 自己拼内部 DOM。
7. 用 `data-*` 存放复杂 JSON 作为主要 API。
8. 用 `.is-open`、`.is-active` 作为唯一公共状态。
9. 同一语义同时提供三种事件名。
10. 用全局 MutationObserver 模拟 Custom Elements。
11. 为解决冲突大量加入 `!important`。
12. 在组件 CSS 中写死颜色和间距。
13. 通过隐藏 focus outline 追求视觉整洁。
14. axe 通过就宣称无障碍完成。
15. 为追求像素一致复制 1.x 的明显结构缺陷。
16. 在核心包继续内置 Markdown、QRCode、论坛业务和文字特效。
17. 默认访问 localStorage、document 或 window，导致 SSR import 崩溃。
18. 通过更新全部截图掩盖回归。
19. 删除 1.x 兼容信息后让使用者自行猜测。
20. 发布 2.0 stable 时仍有未标记状态的半成品组件。

---

## 30. 风险与应对

### 风险 1：重构范围过大

应对：

- 先试点 Button/Dialog/Select；
- stable core 数量受控；
- advanced 延后；
- add-on 分离；
- 每阶段独立发布 prerelease。

### 风险 2：Web Components 与框架事件差异

应对：

- typed wrappers；
- React/Vue fixture；
- 标准事件优先；
- composed/bubbles 明确；
- 不把复杂对象只藏在 attribute 字符串。

### 风险 3：Shadow DOM 难定制

应对：

- CSS Token；
- CSS Parts；
- Slots；
- open shadow root；
- contract 明确公共定制面；
- 布局/内容组件使用 Light DOM。

### 风险 4：兼容层变成永久负担

应对：

- 独立入口；
- 体积独立统计；
- deprecation；
- codemod；
- 公开移除计划；
- 新文档不展示旧 API。

### 风险 5：AI 生成大量形式化文件但没有真实质量

应对：

- browser behavior test；
- package fixture；
- API snapshot；
- contract 与源码交叉校验；
- 禁止空测试；
- 人工审查试点；
- 每阶段可运行演示。

### 风险 6：视觉变化引发“不是 Blora”

应对：

- 先迁移 Token；
- 只从锁定的当前展示页生成 1.x 参考截图；
- 视觉变化写 `known-differences.md`；
- 品牌视觉与结构缺陷分开评估；
- 2.0 可以修正可访问性和一致性，不追求跨环境逐像素复制；
- 任何轻微改变仍必须以当前展示页为出发点，禁止改用历史版本或其他设计系统作为目标。

---

## 31. 2.0 发布清单

### 包

- [ ] `@bloret-crew/blora-design@2.0.0` 可安装。
- [ ] `exports` 全部可解析。
- [ ] CSS 子路径可导入。
- [ ] ESM 无副作用入口有效。
- [ ] `/auto` 有明确副作用。
- [ ] global CDN bundle 有效。
- [ ] `npm pack` 内容正确。
- [ ] provenance/签名策略完成。

### 功能

- [ ] stable core 全部达到 DoD。
- [ ] beta/experimental 不进入默认宣传。
- [ ] compat 独立可用。
- [ ] codemod/checker 可用。
- [ ] 纯 HTML/React/Vue 示例可运行。

### 质量

- [ ] 所有 required CI 通过。
- [ ] 浏览器矩阵通过。
- [ ] 无 serious/critical axe 问题。
- [ ] 人工 a11y 抽测记录完成。
- [ ] visual diff 审核完成。
- [ ] 包体积未超预算。
- [ ] SSR import 通过。
- [ ] CSP fixture 通过。
- [ ] 内存泄漏抽测完成。

### 文档

- [ ] README 是 2.0。
- [ ] 文档站与 2.0 tag 对齐。
- [ ] 每个 stable 组件文档完整。
- [ ] v1 → v2 迁移完整。
- [ ] Token 映射完整。
- [ ] class/data/event 映射完整。
- [ ] `llms.txt`。
- [ ] `component-manifest.json`。
- [ ] `custom-elements.json`。
- [ ] Changelog。
- [ ] 1.x legacy 支持说明。

### 发布演练

- [ ] alpha 使用者反馈已处理。
- [ ] beta API 已冻结。
- [ ] RC 安装和 CDN 演练通过。
- [ ] 版本、tag、包、Release 一致。
- [ ] 回滚方案明确。
- [ ] `latest` 与 `legacy` dist-tag 正确。

---

## 32. 推荐的首批 Issues

建议按以下标题创建 Issues：

1. `chore(v2): capture v1 public API and visual baseline`
2. `build(v2): introduce pnpm workspace and strict TypeScript`
3. `test(v2): add Playwright, axe and visual regression harness`
4. `docs(v2): replace showcase source duplication with component stories`
5. `feat(tokens): introduce DTCG token source and generators`
6. `feat(foundations): add optional reset and cascade layers`
7. `feat(button): migrate button as native semantic primitive`
8. `feat(overlay): implement shared overlay controller`
9. `feat(dialog): migrate modal to blora-dialog`
10. `feat(select): implement form-associated blora-select`
11. `feat(manifest): generate component and custom-elements manifests`
12. `feat(ai): add migration checker and AI usage contract`
13. `feat(compat): add v1 class and token compatibility layer`
14. `feat(codemod): automate safe v1 to v2 markup changes`
15. `release: publish 2.0.0-alpha.1`

每个 Issue 必须引用本规格对应章节，并包含验收清单。

---

## 33. 参考标准与实现依据

实施时优先参考原始规范和平台文档：

- [Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/)
- [Custom Elements Manifest](https://custom-elements-manifest.open-wc.org/)
- [MDN: Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
- [MDN: ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WAI-ARIA APG Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Node.js package entry points](https://nodejs.org/api/packages.html#package-entry-points)

APG 示例是实现指导，不是复制代码许可证，也不是自动证明可访问性。Blora 必须结合真实浏览器和辅助技术测试。

---

## 34. 最终架构原则摘要

Blora Design 2.0 的长期维护原则固定为：

1. **原生语义优先。**
2. **复杂交互才使用 Web Components。**
3. **Token 是视觉事实来源。**
4. **Contract 是公共 API 事实来源。**
5. **Story 是文档与测试共享的使用实例。**
6. **展示页必须消费正式组件。**
7. **核心与 add-on 分离。**
8. **现代入口无隐式全局副作用。**
9. **兼容层独立、可移除。**
10. **可访问性、浏览器行为和视觉都有自动门禁。**
11. **AI 能通过 manifest 判断正确用法，不能靠猜。**
12. **每个组件可单独导入、测试、发布和演进。**

如果重构结果仍然需要用户阅读一个数千行展示页来猜正确 DOM，如果修改一个 Select 仍要重新执行全库初始化，如果文档和组件仍是两份手写代码，那么即使目录变漂亮，也不算完成 2.0。

2.0 真正的完成标准是：**源码、类型、契约、示例、测试、文档和迁移规则围绕同一个组件边界自动保持一致。**
