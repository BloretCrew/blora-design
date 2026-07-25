# Blora Design · 完善清单

> 对照主流 UI 框架（Ant Design / Element Plus / MUI / daisyUI 等）梳理的可完善项。  
> **已完成项打 `[x]`**；未做项保持 `[ ]`。  
> 不必一次做完——后续可按需挑选条目推进。

**定位（已确认）**：继续 **HTML 三件套**（`blora.css` + `blora.js` + class/`data-blora-*`），**不**引入 React/Vue 等非静态应用框架。行为与数据能力通过 JS 约定 + DOM 事件补齐。

---

## 图例

| 标记 | 含义 |
|------|------|
| `[x]` | 已具备或本轮已落地 |
| `[ ]` | 待完善（可选） |
| **P0 / P1 / P2** | 建议优先级（仅供挑选时参考） |

---

## A. 定位与接入（工程）

- [x] 零依赖：纯 CSS + 原生 JS
- [x] 设计令牌（`--blora-*`）与多配色 / 暗色模式
- [x] npm 包形态（`package.json` / `exports` / `style`）
- [x] 类型入口 `blora.d.ts`
- [x] 作用域约定（`.blora-page` / `.blora-scope`）
- [x] 文档：`docs/standards.md` + `docs/framework.md`
- [x] 组件全集展示页 `index.html`
- [x] `Blora.configure` / `Blora.getConfig`（size、validateOn、tablePageSize、portalRoot、messages）
- [x] 刷新章节恢复：摘掉原生硬跳 + **smooth 滚入**（同侧栏，无白屏隐藏）
- [ ] P1 · Storybook / 独立组件文档站（每组件一页可复制片段）
- [ ] P1 · 主题生成脚本（由主色导出完整令牌）
- [ ] P2 · CDN 正式发布与版本锁定说明
- [ ] P2 · 视觉回归 / a11y CI
- [ ] P2 · Vue / React **薄封装**（可选附加包，非本体）

---

## B. 行为与数据能力（三件套内）

### B1. 表单

- [x] 控件样式：input / textarea / select / checkbox / radio / switch / …
- [x] 原生约束 + `.is-error` / `.is-success` / `.blora-validator`
- [x] **`data-blora-form` 校验行为层**（submit 拦截、blur/change 可选）
- [x] **`Blora.validate` / `validateField` / `clearValidation`**
- [x] **`data-blora-rule` / `data-blora-message`**
- [x] 事件 **`blora:validate` / `blora:invalid`**
- [ ] P0 · 异步校验钩子（`data-blora-async` / Promise 规则）
- [ ] P0 · 字段级 `name` 聚合为 `values` / `setValues` 工具
- [ ] P1 · 统一 Form 布局变体（horizontal / inline）文档化组件
- [ ] P1 · 联动显示/禁用（`data-blora-when`）
- [ ] P2 · 密码强度、验证码倒计时等业务模板

### B2. 表格 / 列表数据

- [x] 表格样式、条纹、排序列视觉 class
- [x] **本地排序**（`th.blora-table-sort` / `data-blora-sort`）
- [x] **本地分页**（行 `hidden` + `data-page` / `data-page-size`）
- [x] **分页导航渲染**（`data-blora-pagination`）
- [x] 事件 **`blora:table-change` / `blora:page-change`**
- [x] API **`Blora.table.sort` / `setPage` / `getState`**
- [x] **`data-blora-table-mode="remote"`**（只派发事件）
- [ ] P0 · `Blora.table.setRows(el, rows)` 数据驱动刷新 tbody
- [ ] P0 · 加载中 / 空数据态与表格联动
- [ ] P1 · 列固定、多选行、批量操作条
- [ ] P1 · 虚拟滚动（大列表）
- [ ] P2 · 列设置（显示/隐藏/顺序）持久化

### B3. 选择器深度

- [x] Select / 自定义下拉、Cascader、Date/Time、Transfer、Color
- [ ] P0 · Select 远程搜索（`blora:search` + 填充选项）
- [ ] P0 · TreeSelect（树形选择）
- [ ] P1 · AutoComplete / Mentions
- [ ] P1 · 多选 Select 折叠标签（max-tag-count）
- [ ] P2 · 大数据虚拟列表 Select

### B4. 配置与国际化

- [x] `portalRoot`、配色/明暗 storage key
- [x] 全局 **size**（`html[data-blora-size]`）
- [x] 校验文案 **messages** 可配置
- [x] **i18n 底座**：`Blora.t` / `setLocale` / 内置 `zh-CN`+`en` / 任意语言 pack 扩展
- [x] 框架生成文案走 key（校验、分页 aria、日期字段、级联前缀）
- [x] `blora:localechange` 事件
- [ ] P1 · 更多 key（Modal/Drawer 默认按钮、空态、上传提示等若有硬编码则收口）
- [ ] P1 · RTL（`dir=rtl`）系统验证与修补
- [ ] P2 · 官方语言包目录（`locales/*.js`）与 CDN 分包
- [ ] P2 · 前缀 class 可配置（多实例隔离）

---

## C. 组件覆盖（对照主流清单）

### C1. 已具备（展示 + 样式 / 部分行为）

- [x] 按钮 / 按钮组 / FAB / Speed Dial / Swap
- [x] 输入族、上传/拖拽、OTP、评分、滑块、范围、分段
- [x] 标签 / 徽章 / 头像 / Indicator
- [x] 进度 / Spinner / 骨架屏
- [x] Navbar / Tabs / 面包屑 / 分页 / 步骤 / 侧栏 / Dropdown / Megamenu / Dock
- [x] Table / List / Collapse / Timeline / Tree / Descriptions / Stat
- [x] Carousel / Image / Hover Gallery / Diff / Chat / Countdown / Calendar
- [x] Empty / Result / Alert / Banner / Toast / Tooltip / Popover / Popconfirm
- [x] Modal / Drawer / 命令面板
- [x] Grid / Card / Panel / Hero / Footer / Deck / Mockup
- [x] 配色器 / 明暗切换

### C2. 建议补齐的组件

#### P0

- [ ] **TreeSelect**
- [ ] **Image Preview**（灯箱 / 组图）
- [ ] **Message / Notification** 全局堆叠与位置 API（在 Toast 之上系统化）
- [ ] **Affix** 通用固钉
- [ ] **Anchor** 锚点导航（通用化展示页 spy）

#### P1

- [ ] **AutoComplete**
- [ ] **Mentions**
- [ ] **Tour**（漫游引导）
- [ ] **Watermark**
- [ ] **Splitter** / 可拖拽分栏
- [ ] **Typography** 组件级 API（复制、省略、标题锚点）
- [ ] **Icon** 体系（可按需 SVG 精灵或文档化图标集）
- [ ] **QRCode**
- [ ] **BackTop** 独立 API（现有 FAB 回顶可抽）
- [ ] **Skeleton** 更多矩阵模板
- [ ] **Drawer/Modal** 业务预设（确认、表单弹窗）

#### P2

- [ ] Masonry
- [ ] Comment
- [ ] Statistic 动效
- [ ] Map / 富文本 / 音视频 容器约定
- [ ] Chart 仅约定容器，不内置图表引擎

---

## D. 无访问性与规范

- [x] 焦点环、部分键盘路径、reduced-motion
- [x] 语义色与对比度目标（文档声明 WCAG AA）
- [ ] P0 · 每组件 ARIA 模式清单（Dialog、Listbox、Grid…）
- [ ] P0 · 键盘操作矩阵文档 + 手工/自动抽检
- [ ] P1 · 焦点陷阱与恢复统一审计（Modal/Drawer/Cmdk）
- [ ] P1 · 高对比 / 强制色模式抽检
- [ ] P2 · 完整 axe/Lighthouse CI 门禁

---

## E. 设计系统资产

- [x] 设计原则与令牌文档
- [x] 展示页与 mockup
- [ ] P1 · Figma 变量与代码令牌同步说明
- [ ] P1 · 空态/错误/加载 文案规范
- [ ] P2 · 动效时间表与「何时用 overshoot」决策树
- [ ] P2 · 内容区与营销页布局模板库

---

## F. 本轮（行为 / 数据）已落地摘要

| 项 | 状态 |
|----|------|
| Form：`data-blora-form` + validate API + 事件 | [x] |
| Table：本地排序/分页 + remote 事件 + `Blora.table` | [x] |
| Pagination：data 驱动渲染 + `blora:page-change` | [x] |
| Configure：size / validateOn / tablePageSize / messages | [x] |
| 类型定义 `blora.d.ts` 同步 | [x] |
| 展示页 Demo（校验表单、可排序分页表） | [x] |

---

## 使用方式（给后续挑选任务）

1. 在本文件中找 `[ ]` 条目。  
2. 直接点名例如：「做 B2 的 setRows」或「做 P0 TreeSelect」。  
3. 做完后把对应项改为 `[x]`，并在 PR/提交说明里提一句。

---

*最后更新：与 Form / Table / Configure 行为层落地同步。*
