# 1.x 与 2.x 已知差异

> 记录 Blora Design 2.0 与 1.x 展示页（`legacy/showcase-v1.html`）之间**有意**或**已审核**的可见视觉/行为差异。  
> 格式：组件、1.x、2.0、原因、审核状态。

## 格式

```
### [组件名] - [简短描述]

- **组件**：…
- **1.x 表现**：…
- **2.0 表现**：…
- **改变原因**：a11y / RTL / bug 修复 / WCAG / 架构 / 其他
- **审核状态**：pending / approved / rejected
```

---

### Checkbox - 对勾垂直居中微调

- **组件**：checkbox
- **1.x 表现**：对勾在 grid 居中下视觉略偏下。
- **2.0 表现**：`::after` 使用 `rotate(-45deg) scale(n)`，与 transfer 行复选框统一。
- **改变原因**：bug 修复
- **审核状态**：approved

### Pagination - 上一页/下一页按钮放大 50%

- **组件**：pagination
- **1.x 表现**：导航按钮约 2em。
- **2.0 表现**：`.blora-pagination__nav` 更大触控目标。
- **改变原因**：可用性
- **审核状态**：approved

### Tabs - Pills 底部裁切修复

- **组件**：tabs
- **1.x 表现**：Pills 底部完整。
- **2.0 表现**：曾出现 1px 裁切；以修复后 Story 为准。
- **改变原因**：bug 修复
- **审核状态**：approved

### Calendar - 选中日空心、今日底点

- **组件**：calendar
- **1.x 表现**：选中日实心填充等（以冻结展示页为准）。
- **2.0 表现**：选中日空心描边 + 主色字；今日为数字下方圆点。
- **改变原因**：与当前产品 QA 目标对齐（非静默改版）
- **审核状态**：approved（人眼 2026-08-02）

### Collapse / Accordion - 测量高度动画

- **组件**：collapse / accordion
- **1.x 表现**：展开模型与 2.0 实现细节可能不同。
- **2.0 表现**：关闭 `max-height: 0`，打开使用测量高度 token；去掉过大硬顶。
- **改变原因**：bug 修复（展开对称、避免假 400px 顶）
- **审核状态**：approved

### Table - 排序指示默认隐藏

- **组件**：table
- **1.x 表现**：表头排序箭头可见性可能始终显示。
- **2.0 表现**：默认隐藏；hover 显示 ⇅；已排序显示 ▲/▼。
- **改变原因**：与 QA 目标对齐
- **审核状态**：approved

### Table - 行选内置

- **组件**：table
- **1.x 表现**：`data-blora-selectable` 由 1.x JS 注入选择列。
- **2.0 表现**：同等由 `createTableController` 注入 `blora-checkbox` + 批量条；**不要求**业务拼装。
- **改变原因**：架构（headless controller）
- **审核状态**：approved

### Popover - 相对触发器左对齐

- **组件**：popover
- **1.x 表现**：可能居中于触发器。
- **2.0 表现**：面板相对触发器左对齐（`left: 0`）。
- **改变原因**：与 QA 目标对齐
- **审核状态**：approved

### List - 无外框

- **组件**：list
- **1.x / 2.0**：列表根节点无外边框；需要卡片感时与 Card 组合。
- **改变原因**：有意设计（intentional CSS-only 壳）
- **审核状态**：approved

### API 表面 - 无全局 Blora 单例

- **组件**：package entry
- **1.x 表现**：`Blora.init` / `Blora.toast` / `Blora.table.*` 全局对象。
- **2.0 表现**：ESM 具名导出 + `createXxxController`；兼容层可选。
- **改变原因**：架构（2.0 重构）
- **审核状态**：approved
