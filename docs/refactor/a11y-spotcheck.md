# 人工无障碍抽测记录

**日期**：2026-08-22  
**页面**：`examples/showcase-v2/index.html`（`lang=zh-CN`）+ Playwright `a11y` project

## 自动化（每次 CI）

- `a11y.spec.ts`：主按钮 + 带标签字段；Showcase 目录页。
- 规则：AxeBuilder，无 serious / critical。
- 键盘路径已覆盖：Dialog Escape / 焦点陷阱 / 外部点击；Select 开关；Command combobox；Tour Escape；Drawer Escape。

## 人工抽测（本轮）

抽的是 Showcase 里用户最容易踩的浮层和表单，不是 87 组件全表。

| 组件 | 路径 | 结果 |
|------|------|------|
| Dialog | 打开后 Tab 只在面板内循环；Escape 关闭；关闭按钮有 `aria-label` | 通过（Playwright dialog.spec + OverlayController slot 陷阱） |
| Command | 输入框 combobox + listbox；遮罩盖住滚动条槽 | 通过（overlay-cover.spec） |
| Tour | 工具条 `role=dialog`；洞在目标上；Escape 结束 | 通过（tour 浏览器测） |
| Drawer | 打开后锁滚动；关闭按钮有名 | 通过（drawer 测）；现已进 popover 顶层 |
| Pagination | 上一页/下一页走 `t()`，不靠写死中文 | 通过 |
| Palette | 触发器文案跟 `html lang` | 通过（靛蓝 / Indigo） |
| Switch / Checkbox | `formAssociated`；单控件由 ElementInternals 提交 | 单测覆盖 Switch/Checkbox 主机 |

未抽：每个 beta contract 的读屏全文、Windows 高对比主题、完整触摸目标 44px 清单。RC 发版前再补一页 Dialog / Datepicker / Table 读屏笔记。
