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

### Button - 加载态保留文字

- **组件**：button
- **1.x 表现**：`.blora-btn.is-loading` 把文字设为透明，只显示居中转圈。
- **2.0 表现**：`data-loading` 在文字左侧显示转圈，文字保持可见；纯图标按钮仍只显示转圈。
- **改变原因**：可用性（加载中仍需知道按钮在做什么）
- **审核状态**：approved

### Dialog - 打开时挂到 body，遮罩盖满视口

- **组件**：dialog
- **1.x 表现**：模态挂到 portal / body，遮罩相对视口。锁滚动用 `position: fixed` 冻结页面，避免 `overflow: hidden` 打断 sticky 顶栏。
- **2.0 表现**：`show()` 把主机挂到 `document.body` 并 `showPopover()` 进入顶层，遮罩按视口铺满。滚动锁与 1.x 相同：冻结 `body` 而不是写 `overflow: hidden`。滚动到顶或滚下去，navbar 都留在视口顶部、叠在遮罩后面。
- **改变原因**：bug 修复
- **审核状态**：pending

### Tooltip - 四向放置

- **组件**：tooltip
- **1.x 表现**：浮层主要在触发器上方，靠 JS 做横向避让。
- **2.0 表现**：`placement` 支持 `top` / `bottom` / `start` / `end`，以及物理 `left` / `right`。
- **改变原因**：架构（侧向提示是真实能力，不是皮肤）
- **审核状态**：pending

### Button - 内部内容无法撑高

- **组件**：button
- **1.x 表现**：高度由 padding + 内容决定，大图标或图片会把同尺寸按钮撑得不一样高。
- **2.0 表现**：高度锁在 `--blora-button-height`（字号 + 上下 padding + 双边框）。图标尺寸走 `--blora-button-icon-size`（默认 `auto`，尊重 `createBloraIcon` 的宽高）；`data-size="icon"` 默认为 `1.125rem`。内部内容不能撑高按钮，但不会被压成 `1em`。
- **改变原因**：架构（同 `data-size` 必须等高，不因插图/图标变化）
- **审核状态**：pending

### Checkbox - 对勾垂直居中微调

- **组件**：checkbox
- **1.x 表现**：对勾在 grid 居中下视觉略偏下。
- **2.0 表现**：`::after` 使用 `rotate(-45deg) scale(n)`，与 transfer 行复选框统一。
- **改变原因**：bug 修复
- **审核状态**：approved

### Sidebar layout - seamless 窄屏是视口抽屉

- **组件**：sidebar-layout
- **1.x 表现**：`max-width: 900px` 时 aside / mask 为 `position: fixed`，从视口左侧滑出。
- **2.0 表现**：`variant="default"` 抽屉仍叠在卡片内部（演示卡 / Storybook）。`variant="seamless"` 页面壳不再套一层圆角卡片，抽屉回到视口 `fixed`，并取消 `isolation`，使侧栏叠在 navbar 之上。
- **改变原因**：bug 修复（页面导航被收进内容卡）
- **审核状态**：pending

### Sidebar layout - seamless 抽屉开关是左下 FAB

- **组件**：sidebar-layout
- **1.x 表现**：窄屏开关是内容区左上角的小 outline 按钮。
- **2.0 表现**：`variant="seamless"` 使用正式 `.blora-fab[data-variant="surface"]`，固定在视口左下；`toggle-label` 作为 `aria-label`。卡片变体仍用 outline 文字钮。
- **改变原因**：可用性（页面级导航开关不应占掉标题行）
- **审核状态**：pending

### Checkbox - 全选组纵向间距

- **组件**：checkbox
- **1.x 表现**：选项是 `inline-flex`，放进 `.blora-stack` 后仍会横排贴在一起。
- **2.0 表现**：`blora-checkbox[data-group]` 内选项纵向排列，间距 `--blora-space-3`。
- **改变原因**：bug 修复
- **审核状态**：pending

### Radio - 内圆点几何居中

- **组件**：radio
- **1.x 表现**：内圆点用 `inset: 0; margin: auto` + `scale()`，非整倍 DPR / 125% 缩放下会偏 1px。
- **2.0 表现**：`top/left: 50%` + `translate(-50%, -50%)`，外圈 `box-sizing: border-box` + grid 居中。
- **改变原因**：bug 修复
- **审核状态**：pending

### Pagination - 上一页/下一页按钮放大 50%

- **组件**：pagination
- **1.x 表现**：导航按钮约 2em。
- **2.0 表现**：`.blora-pagination__nav` 更大触控目标。
- **改变原因**：可用性
- **审核状态**：approved

### Comment - 改为 slot 布局壳

- **组件**：comment
- **1.x 表现**：作者手写 `.blora-comment` 树；2.0 前期 CE 用 `author` / `time` / `likes` 等属性生成固定操作。
- **2.0 表现**：`<blora-comment>` 只负责布局。头像、作者、时间、正文、操作通过 slot 塞入现有组件。
- **改变原因**：架构（评论内容因产品而异，不应收成底层属性）
- **审核状态**：pending

### Tag - 去掉 solid 变体

- **组件**：tag
- **1.x 表现**：`.blora-tag--solid` 是深色实心胶囊，和 Badge 文字状态条几乎同形。
- **2.0 表现**：删除 `solid`。实心状态用 Badge；Tag 只保留浅底描边分类（含可关闭）。
- **改变原因**：其他（Badge / Tag 职责分开）
- **审核状态**：pending

### Badge - 语义文字徽标内边距对齐 Tag

- **组件**：badge
- **1.x 表现**：所有徽标共用 `height: 1.5em; padding: 0 0.4em`，长单词左右几乎贴边。
- **2.0 表现**：数字角标 / 圆点 / 圆形仍用 1.x 紧凑尺寸；`neutral` / `info` / `success` / `warning` / `danger` 文字徽标使用与 `.blora-tag` 相同的 `0.2em 0.7em` 内边距。
- **改变原因**：其他（文字徽标可读性）
- **审核状态**：pending

### Pagination - 当前页悬浮反馈弱化

- **组件**：pagination
- **1.x 表现**：当前页悬浮仍可能应用普通页码的浅色背景，产生明显换色。
- **2.0 表现**：当前页悬浮保持强调色背景和前景色，仅轻微放大至 `1.06`。
- **改变原因**：其他（降低已选状态的悬浮干扰）
- **审核状态**：approved

### Input / Textarea / Select / Tags Input - 连贯圆角矩形

- **组件**：input、textarea、select 触发器、tags-input
- **1.x 表现**：`border-radius: 14px` 圆形弧。
- **2.0 表现**：与按钮同一套 `--blora-radius-lg` + `corner-shape: superellipse(1.2)`。卡片、面板、弹层、下拉、OTP 等矩形壳同样套超椭圆；圆形与胶囊除外。
- **改变原因**：其他（圆角衔接）
- **审核状态**：pending

### Button - 圆角与直线用超椭圆衔接

- **组件**：button
- **1.x 表现**：`border-radius: 14px` 圆形弧，接到长边时曲率突变。
- **2.0 表现**：半径改为 `--blora-radius-lg`（18px），支持时使用 `corner-shape: superellipse(1.2)`，比 14px 超椭圆更圆，仍保持弧线与直线顺接。`data-size="icon"` 与 Speed Dial 圆形触发器强制 `corner-shape: round`，避免被拧成超椭圆。
- **改变原因**：其他（圆角衔接）
- **审核状态**：pending

### Pagination - 单侧省略号改为扩窗补位

- **组件**：pagination
- **1.x 表现**：靠近首页/末页时省略号仍占位（或只藏一页），`1` 与窗口之间留空。
- **2.0 表现**：省略号若只会藏住紧邻首页/末页的那一页，则不渲染该省略号，固定窗口 +1 补齐，例如 `1 2 3 4 5 6 7 … 12`。
- **改变原因**：其他（避免空白占位）
- **审核状态**：pending

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

### Select - 多选标签复用官方 Tag

- **组件**：select
- **1.x 表现**：`.blora-select-tag` 为灰底小圆角芯片。
- **2.0 表现**：Shadow 内复用官方 `.blora-tag[data-variant=primary]` / `.blora-tag__close`，与 Tags Input 一致。
- **改变原因**：与正式 Tag 表面统一（非另造一套芯片）
- **审核状态**：pending

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
- **2.0 表现**：ESM 具名导出 + Composite CE；仅 Table / Form 等未迁能力保留 headless controller，兼容层可选。
- **改变原因**：架构（2.0 重构）
- **审核状态**：approved

### Palette Picker - 小号说明文字对比度

- **组件**：theming / palette-picker
- **1.x 表现**：菜单提示和配色说明使用低对比度 subtle 文本。
- **2.0 表现**：提示和说明使用 emphasis 文本，保证白色与选中 tint 背景上的 12px 文字符合 WCAG 2.2 AA。
- **改变原因**：WCAG / a11y
- **审核状态**：pending（axe 已验证）

### Sidebar Navigation - 当前项只高亮文字

- **组件**：sidebar-nav
- **1.x 表现**：当前项使用主题色文字、字重和主题色浅底。
- **2.0 表现**：当前项只使用主题色文字和字重；浅底仅作为 hover 反馈。
- **改变原因**：统一 Storybook、Showcase 与正式组件的状态层级，避免当前态与 hover 态竞争。
- **审核状态**：approved（用户确认 2026-08-10）

### Accordion / Collapse - 完整 disclosure 关联

- **组件**：accordion / collapse
- **1.x 表现**：标题按钮和内容区域没有稳定的双向 ID 关联，关闭内容仍可能留在辅助技术可访问树中。
- **2.0 表现**：CE 自动生成原生标题按钮、`aria-expanded`、`aria-controls`、内容 `region`、`aria-labelledby` 与同步的 `aria-hidden`。
- **改变原因**：WCAG / a11y bug 修复
- **审核状态**：pending（axe 与浏览器交互测试已验证）

### Palette Picker - 弹层文字使用正常行高

- **组件**：theming / palette-picker
- **1.x 表现**：无对应 CE 宿主继承问题。
- **2.0 表现**：CE 宿主和菜单显式使用正式 normal 行高，标题、提示、配色名称与说明保持独立文本行。
- **改变原因**：修复 `line-height: 0` 从宿主继承到 light DOM 弹层造成的文字重叠。
- **审核状态**：pending（浏览器几何断言与视觉回归已验证）

### Tabs - 正式 full-bleed 面板模式

- **组件**：tabs
- **1.x / 2.0 默认表现**：普通面板在导航下保留 `space-5` 顶部间距。
- **2.0 新增表现**：`<blora-tabs flush>` 移除 CE 自有 panel inset，供 Preview、代码区等自行持有完整背景和间距的内容使用。
- **改变原因**：避免全宽内容与 Tabs 默认间距叠加形成异色空带，同时不破坏普通文字面板的 v1 视觉基线。
- **审核状态**：pending（Showcase 浏览器几何断言与视觉回归已验证）

### Tabs - 指示线与焦点环视觉分离

- **组件**：tabs
- **1.x / 2.0 原表现**：选中指示线为 2px；键盘焦点环在 flush 容器中可能与指示线视觉粘连。
- **2.0 修正表现**：水平与垂直选中指示线统一为 3px，焦点环使用 6px 安全内缩，与指示线保留清晰间隔。
- **改变原因**：WCAG / a11y 可见性与视觉层级修复
- **审核状态**：approved（用户确认 2026-08-12）

### Dialog - 内缩分界线

- **组件**：dialog
- **1.x / 2.0 原表现**：Header 与 Footer 分界线贯穿面板全宽。
- **2.0 修正表现**：分界线与内容列对齐、左右内缩 `space-6`；Header 与 Footer 保持原有垂直内边距。
- **空 Footer 行为**：未提供 footer 内容时，操作区、底部分界线及其占位高度自动隐藏；动态 slot 内容会实时同步。
- **改变原因**：视觉层级优化
- **审核状态**：approved（用户确认 2026-08-12）

### Button Group - 稳定悬浮与完整焦点环

- **组件**：button / button-group
- **1.x / 2.0 原表现**：组内按钮沿用独立按钮的上浮动效；横向滚动容器可能裁切 v1 外置焦点环的上下边缘。
- **2.0 修正表现**：组内 hover/active 仅使用背景反馈、不发生位移；滚动容器预留并抵消焦点安全区，完整显示外置焦点环且不改变布局占位。
- **改变原因**：交互稳定性与 WCAG / a11y 可见性修复
- **审核状态**：approved（用户确认 2026-08-12）

### Navbar - 毛玻璃背景更加通透

- **组件**：navbar
- **1.x 表现**：毛玻璃层使用 82% 表面色混合。
- **2.0 表现**：毛玻璃层使用 72% 表面色混合，保留 20px 模糊、饱和度、边框和前景对比度。
- **改变原因**：其他（经产品要求降低不透明度）
- **审核状态**：approved
