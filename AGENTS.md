# Blora Design 贡献规则

> 本文件面向所有贡献者（人类和 AI Agent）。Blora Design 2.0 正在进行重构，以下是必须遵守的工程约束。

## 项目状态

当前处于 **2.0 重构 Phase 10（预发布）— `2.0.0-beta.0` 已发布，RC 门禁收口优先**。
阶段进度与开放清单见 `docs/refactor/status.md` 与 **`docs/refactor/remaining-work.md`（主跟踪）**。

## 视觉基线（不可违反）

Blora Design 2.0 的唯一视觉母版是重构开始时仓库当前 HEAD 中展示页引用 `blora.css`、`blora.js` 后的实际渲染结果。

- **基准 commit**：`a148715d06ee9551cbee262ffae6ad377b564df6`
- **展示页副本**：`D:\MyFiles\Documents\projects\blora-design\legacy\showcase-v1.html`（冻结的 1.x 展示页，已移出本仓库）
- **1.x 源码冻结**：`D:\MyFiles\Documents\projects\blora-design\legacy\v1\`（`blora.css` / `blora.js` / …）
- **视觉基线截图**：`D:\MyFiles\Documents\projects\blora-design\legacy\visual-baseline-light.png`、`visual-baseline-dark.png`；展示页静态副本在 `examples/showcase-v2/assets/`
- **基线元数据**：`docs/refactor/visual-baseline.json`
- **勿使用** 仓库根目录旧 `blora.*`（若见过，已迁到 `.trashes/root-v1-leftovers/`）

### 禁止事项

1. **禁止从历史提交、旧 npm 包、隐藏分支提取视觉样式。**
2. **禁止以其他 UI 框架默认样式作为视觉目标。**
3. **禁止 AI 自行生成"现代化"风格。**
4. **禁止以"文档中已说明"代替实际渲染检查。**
5. 允许为 WCAG 2.2 AA、RTL、bug 修复做轻微调整，但必须记录在 `docs/refactor/known-differences.md`。

## 工程规则

- **图标最高优先级规则**：所有承担 UI 操作、状态或导航含义的图标，必须优先使用项目 `createBloraIcon()` 提供的 Lucide 风格 SVG；缺少图标时先扩充该统一图标库。禁止用 Emoji、图标字体或 `‹`、`›`、`×`、`★`、`→`、`+` 等文本字形冒充图标。省略号、数学符号、键盘快捷键和用户内容等真实文本语义不受此限制。

- 先阅读目标组件 contract（`*.contract.json`）再编辑。
- 优先原生 HTML 语义，仅在复合交互行为时使用自定义元素。
- 不要在未经更新 contract 和 API snapshot 的情况下新增公共属性、事件、class、CSS part 或 token。
- 不要通过 `innerHTML` 写入用户内容。
- 不要在组件 CSS 中写死颜色、间距、圆角、阴影、时长和 z-index——使用登记的 token。
- 每个行为变更必须有浏览器测试。
- 每个视觉变更必须有审核过的快照更新。
- 声明完成前运行 `pnpm verify`（Phase 1 建立后）。
- 不要直接编辑生成文件。
- 不要跳过测试或伪造空测试。
- 不要批量更新截图后不审查。

## 2.0 重构执行纪律

1. **先建立新架构和自动化门禁，再迁移组件。**
2. **禁止直接在现有 `blora.css`、`blora.js` 上继续堆叠 2.0 功能。**
3. **禁止一次性删除 1.x 实现。** 旧实现冻结在仓库外 `D:\MyFiles\Documents\projects\blora-design\legacy\v1\`（已归档，不再作为兼容测试输入）。
4. 每次只迁移一组有关联的组件，并同时完成：源码、类型、契约、Story、单元测试、浏览器交互测试、无障碍测试、视觉回归基线、文档、1.x 迁移说明。
5. 每个阶段独立提交，不要做巨型提交。

## 文件结构

```
examples/showcase-v2/
├── index.html              # 2.0 组件展示页
└── assets/                 # 展示页静态资源（含基线截图副本）

docs/refactor/
├── status.md               # 当前阶段、已完成项、阻塞项
├── decisions.md            # 临时决策，最终沉淀为 ADR
├── known-differences.md    # 1.x 与 2.x 的已知视觉/行为差异
├── visual-baseline.json    # 视觉基线元数据
├── v1-public-surface.json  # 1.x 公共 API 结构化清单
├── component-matrix.md     # 每个组件的迁移状态
├── v1-css-inventory.json    # 1.x CSS 清单
└── v1-js-inventory.json     # 1.x JS 清单
```
