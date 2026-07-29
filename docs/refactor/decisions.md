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

## 待决策

- [ ] 视觉回归测试框架的具体截图策略（Playwright snapshot vs 第三方工具）
- [ ] Firefox/WebKit CI 矩阵何时启用（Phase 1 暂只跑 Chromium）

