# 1.x 与 2.x 已知差异

> 记录 Blora Design 2.0 与 1.x 展示页之间的所有可见视觉和行为差异。
> 每个差异必须包含：组件、1.x 表现、2.0 表现、改变原因、审核状态。

## 格式

每个差异条目使用以下格式：

```
### [组件名] - [简短描述]

- **组件**：button / select / dialog / ...
- **1.x 表现**：...
- **2.0 表现**：...
- **改变原因**：a11y / RTL / bug 修复 / WCAG / 其他
- **审核状态**：pending / approved / rejected
```

---

## 尚无差异记录

Phase 0 阶段不产生视觉差异，所有 2.0 实现尚未开始。差异将在 Phase 4（试点组件迁移）开始后逐条记录。

---

### Checkbox - 对勾垂直居中微调

- **组件**：checkbox
- **1.x 表现**：对勾（border-based checkmark）在 `display: grid; place-items: center` 下视觉上略微偏下，因 -45deg 旋转后 checkmark 形状的重心偏向底部。
- **2.0 表现**：`::after` transform 使用纯 `rotate(-45deg) scale(n)`（无 translateY 补偿），与 `.blora-transfer__check` 的标准完全一致；`data-variant` 的 transfer 行复选框是基准（issue 28 按 Angular 行标准统一）。
- **改变原因**：bug 修复（视觉居中，统一各复选框表面）
- **审核状态**：approved

### Pagination - 上一页/下一页按钮放大 50%

- **组件**：pagination
- **1.x 表现**：`<` `>` 导航按钮为 2em 尺寸。
- **2.0 表现**：`.blora-pagination__nav` 为 `min-width: 3em; height: 3em; font-size: var(--blora-text-lg)`，比常规页码项大 50%（issue 35 要求）。
- **改变原因**：可用性（更大的触控目标）
- **审核状态**：approved

### Tabs - Pills 底部裁切修复

- **组件**：tabs
- **1.x 表现**：Pills 变体标签底部完整显示。
- **2.0 表现**：Pills 变体标签底部被裁切 1px（因 `margin-bottom: -1px` 未在 pills 变体中重置）。
- **改变原因**：bug 修复（`margin-bottom: 0` 重置）
- **审核状态**：pending
