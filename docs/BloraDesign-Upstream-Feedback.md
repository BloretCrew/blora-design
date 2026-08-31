# Blora Design 上游反馈与迁移改进建议

> 这份文档总结 Bloret PassPort 从旧版手写/混合 UI 迁移到 Blora Design 2.0.x 的完整经验。目标不是记录某一个页面的修改，而是让下一个开发者只按照官方文档和组件契约执行一次迁移，就能得到稳定、完整、可访问、响应式且视觉一致的结果，不需要在迁移完成后再通过截图逐项返工。
>
> 建议将本文作为 Blora Design 的上游 issue、迁移指南补充和发布验收清单使用。

## 一、总体结论

Blora Design 的组件覆盖范围已经足够完成一个完整的账户中心、认证页、管理后台和 API 管理页面。迁移过程中遇到的主要问题不是“缺少组件”，而是以下四类信息没有在一个地方形成闭环：

1. **组件契约、实际运行时行为和示例代码不完全一致**；
2. **组件之间的组合规则没有明确说明**，开发者容易选对单个组件，却组合出错误的布局层级；
3. **服务端渲染、资源加载、主题首屏和自定义元素升级时机没有被作为正式迁移问题说明**；
4. **文档主要描述组件“能做什么”，没有充分描述“什么时候应该用它、不能怎么用、如何验收”。**

因此，迁移结果往往是“HTML 看起来已经使用 Blora”，但仍然存在：

- 首屏主题闪烁；
- 选中 Tab 文字被指示条覆盖；
- 图标没有加载或尺寸失控；
- 隐藏属性被应用 CSS 覆盖；
- 长文本破坏 Steps、List 或 Copy 布局；
- 原生 `alert`、`confirm`、`prompt` 混入 Blora 交互；
- 空状态、反馈、分页和危险操作没有使用正确的组件；
- 页面结构虽然用了 Card，但信息层级仍然错误；
- 组件事件、属性和 SSR 初始状态之间缺少明确约定。

建议 Blora Design 将迁移指导从“组件目录”升级为“组件目录 + 页面模式 + 反例 + 自动验收工具”的组合。

---

## 二、最高优先级问题

### P0：主题首屏闪烁（FOUC）必须由框架原生解决

#### 现象

用户已经选择浅色模式，但从侧边栏进行整页跳转时，页面会先出现一帧系统深色模式，然后再恢复为浅色模式。

#### 根因

当前主题资源的行为类似：

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-blora-color-scheme], [data-blora-theme]) {
    color-scheme: dark;
    --blora-color-surface-canvas: #17161c;
  }
}
```

而主题偏好通过 `localStorage` 保存，真正恢复主题的逻辑位于 `type="module"` 脚本，或者等到 `blora-palette-picker` 升级后才执行。于是首屏时间线变成：

```text
html 没有主题属性
→ tokens.dark.css 根据操作系统画出深色
→ 首次绘制
→ module/custom element 执行
→ 根据用户偏好切回浅色
```

#### 建议框架修改

1. 提供官方、可复制的阻塞式主题启动脚本；
2. 该脚本必须在 `tokens.dark.css`、`tokens.themes.css` 和主 CSS 之前执行；
3. 脚本直接读取官方定义的 storage key；
4. 脚本在首帧前设置：
   - `data-blora-color-scheme`；
   - `data-blora-theme`；
   - `document.documentElement.style.colorScheme`；
5. `theming.global.js` 应在自身加载时主动恢复主题，而不是只在 palette picker 连接时恢复；
6. 明确无 storage 值时的默认规则：固定 `light`，或者明确跟随系统，但 CSS 和 JS 必须使用同一套语义；
7. 提供 Playwright/Web Test 的首帧主题测试，模拟“操作系统深色 + 用户选择浅色”。

#### 建议文档加入

```html
<head>
  <!-- 必须位于所有 Blora CSS 之前，且不能是 type=module -->
  <script>
    (function () {
      var root = document.documentElement;
      var scheme = localStorage.getItem("blora-color-scheme") || "light";
      var theme = localStorage.getItem("blora-theme");
      root.setAttribute("data-blora-color-scheme", scheme);
      if (theme) root.setAttribute("data-blora-theme", theme);
      root.style.colorScheme = scheme;
    })();
  </script>
  <link rel="stylesheet" href="/blora/blora.css" />
  <link rel="stylesheet" href="/blora/tokens.dark.css" />
</head>
```

这段逻辑应由框架提供 helper 或构建输出，应用不应自行复制。

---

### P0：组件契约必须和实际运行时、CSS、示例同步

目前开发者需要同时查看：

- contract JSON；
- dist 运行时代码；
- dist CSS；
- 示例页面；
- 版本变更记录；

才能判断一个属性是否真正有效。例如 `blora-copy masked` 在 2.0.5 才能可靠使用，`blora-input data-size="sm"` 在 2.0.6 才可用。如果文档只说“支持”而没有注明最低版本和运行时验证方式，迁移者很容易得到“代码正确但页面无效”的结果。

#### 建议每个组件契约都包含

```json
{
  "since": "2.0.5",
  "runtimeRequired": true,
  "attributes": {
    "masked": {
      "type": "boolean",
      "default": false,
      "behavior": "视觉内容默认隐藏，但复制仍使用完整 text"
    }
  },
  "events": {
    "blora-change": {
      "detail": "{ page: number }"
    }
  },
  "compositionRules": [
    "适合放在 blora-list__item 的操作区",
    "不要用 CSS 隐藏组件内部内容替代 masked"
  ],
  "antiPatterns": ["不要把 text 属性改成掩码文本", "不要额外创建眼睛按钮维护 reveal 状态"]
}
```

#### 建议增加自动检查

发布包时自动验证：

- contract 中声明的属性在运行时确实存在；
- 示例代码可以直接运行；
- 示例中的事件名称和实际事件一致；
- CSS 中使用的内部 class 与组件渲染结果一致；
- 每个版本的 `package.json`、lockfile、资源版本和文档版本一致。

---

## 三、组件和底层实现改进建议

## 1. `blora-copy`：敏感内容能力应在文档中作为正式模式

### 迁移中遇到的问题

API Key 需要满足：

- 默认隐藏；
- 点击眼睛显示/再次隐藏；
- 隐藏状态仍可复制完整值；
- 长文本不破坏列表布局。

在原生能力出现前，应用很容易错误地：

- 创建额外的 `*` 文本；
- 隐藏真正的 copy 组件；
- 自己创建眼睛按钮；
- 自己维护显示状态；
- 最终造成复制内容和显示内容不同步。

### 框架建议

`masked` 应有明确的官方示例：

```html
<blora-copy text="sk-example-full-value" masked label="复制 API Key"></blora-copy>
```

文档必须明确：

- `text` 永远传完整原文；
- `masked` 只影响视觉呈现；
- 复制按钮在隐藏状态仍复制完整原文；
- 眼睛按钮由组件提供；
- 不应覆盖组件内部显示元素；
- 不应再创建同一份敏感内容的假显示节点。

### 长文本布局建议

组件应默认允许在 flex/grid 容器中收缩，并提供一个明确的单行模式：

```css
.blora-copy {
  min-width: 0;
}
```

若默认使用省略号，应在契约中说明；若默认允许换行，也应提供推荐组合类或属性，避免应用自行深入覆盖内部 class。

---

## 2. `blora-input`：小号尺寸应尽早提供并明确作用范围

Key 名称编辑属于列表内的紧凑编辑场景。标准 Input 的高度、字号和宽度都显得过大，因此需要 `data-size="sm"`。

建议：

- 所有基础表单控件统一支持 `data-size="sm"`、`md`、`lg`；
- 在 2.0.6 之前就提供 Input 小号；
- 明确 `size` 只影响高度、字号、内边距和圆角，不自动改变 width；
- 文档提供“列表内编辑”“工具栏筛选”“对话框表单”三个尺寸示例；
- 提供 CSS custom properties，让应用可以控制宽度，而不是误以为 size 会改变宽度。

建议示例：

```html
<input class="blora-input" data-size="sm" aria-label="Key 名称" />
```

同时建议提供 `blora-inline-edit` 或在 `blora-list` 文档中提供完整的编辑模式，而不是让每个应用重复实现 Enter、Escape、blur 和错误恢复。

---

## 3. `blora-steps`：不能用 `nowrap` 破坏等宽布局

### 迁移中遇到的问题

AI 服务页面的三步说明中，长标题或长描述被 `white-space: nowrap` 强制保持单行，导致：

- 三列宽度不一致；
- 第三步右侧出现不自然的空白；
- 连接线长度不均；
- 中文、英文和俄文长度差异进一步放大问题。

### 框架建议

默认布局应具备：

```css
.blora-steps {
  display: grid;
  grid-template-columns: repeat(var(--blora-steps-count), minmax(0, 1fr));
}

.blora-step {
  min-width: 0;
}

.blora-step__title,
.blora-step__desc {
  white-space: normal;
  overflow-wrap: anywhere;
}
```

如果确实需要横向单行模式，应增加显式属性，例如：

```html
<blora-steps orientation="horizontal" text-wrap="nowrap"></blora-steps>
```

而不是让默认 CSS 强制 nowrap。

必须增加测试：

- 长中文；
- 长英文单词；
- 多语言混排；
- 手机宽度；
- 2、3、4 个步骤；
- 有无描述文字。

---

## 4. `blora-tabs`：指示条不能覆盖 Tab 文本

迁移登录页时，pills Tab 的选中背景/指示条曾覆盖“登录”文字，只显示一块空的药丸。

建议组件内部明确层级：

```css
.blora-tabs__indicator {
  z-index: 0;
}

.blora-tab,
.blora-tabs__tab {
  position: relative;
  z-index: 1;
}
```

并增加组件测试：

- 选中第一个 Tab；
- 选中最后一个 Tab；
- 中文、英文、俄文标签；
- 键盘切换；
- 指示条动画过程中截图/布局检查。

文档应说明使用方式是：

```html
<blora-tabs>
  <blora-tab value="login" label="登录"></blora-tab>
  <blora-tab value="register" label="注册"></blora-tab>
</blora-tabs>
```

还是使用 `button[role=tab]`，二者不能在不同示例中混用而不解释。

---

## 5. 图标系统：SSR、按钮和完整图标包需要统一策略

### 迁移中遇到的问题

页面中使用 `data-icon` 时出现过：

- 图标没有被 hydration；
- 按钮内 SVG 没有明确尺寸，按默认 SVG 尺寸撑爆布局；
- 侧栏使用完整 icon 包前，timeline 中的 `link` 等图标无法显示；
- 登录页没有侧栏的图标注入逻辑，导致按钮只显示文字。

### 框架建议

1. 提供统一的图标渲染方式，不要让应用自己判断哪些元素会被 `auto.js` 处理；
2. `auto.js` 应覆盖所有官方约定的 `[data-icon]` 使用位置，包括按钮内部；
3. 如果按钮内部需要排除 hydration，应提供正式原因和替代 API；
4. 所有生成的 SVG 必须有默认 `width`、`height`、`viewBox`；
5. `blora-button` 内部 icon 尺寸应固定为 token，而不是继承 SVG 的 auto 尺寸；
6. `icons-full.js` 和 `auto.js` 的加载顺序、用途、体积和兼容性应在文档中明确；
7. 提供 SSR helper：

```js
createBloraIconMarkup("github", { size: 16, label: "GitHub" });
```

这样服务端渲染页面不需要额外等待 hydration 才有关键图标。

推荐官方约定：

```html
<blora-button icon="key-round" icon-position="start"> 使用通行密钥登录 </blora-button>
```

比 `data-icon` + 页面脚本更稳定。

---

## 6. `blora-pagination`：默认模式应是完整分页，simple 必须是明确选择

迁移日志页面时，最初使用：

```html
<blora-pagination variant="simple" ...></blora-pagination>
```

但用户期望的是带数字页码、前后页和省略号的完整分页：

```html
<blora-pagination label="分页" page="7" total="12" max-visible="7"></blora-pagination>
```

### 建议

- 默认 variant 使用完整分页；
- `variant="simple"` 只用于明确需要“上一页 / 当前页 / 下一页”的场景；
- 文档同时展示两种模式，并说明使用场景；
- `max-visible` 的计算和边界行为写入契约；
- 文档提供事件处理示例：

```js
pagination.addEventListener("blora-change", (event) => {
  loadPage(event.detail.page);
});
```

- 提供 SSR 首屏状态和动态更新示例；
- 在手机宽度下自动压缩或滚动，不让数字页码溢出。

---

## 7. `hidden`、`display` 和自定义元素初始状态必须有明确规范

迁移中遇到过一个典型问题：元素带有 `hidden` 属性，但应用 CSS 同时写了 `display: flex`，导致浏览器默认隐藏规则被覆盖，隐藏内容始终显示。

建议框架全局 CSS 提供：

```css
[hidden] {
  display: none !important;
}
```

同时文档明确：

- 组件隐藏状态优先使用 `hidden` 或官方属性；
- 应用不应对带 `hidden` 的组件写裸 `display`；
- 如果组件需要显示为 flex/grid，CSS 应写成：

```css
.component:not([hidden]) {
  display: flex;
}
```

- 自定义元素升级前后的 `hidden` 状态必须一致；
- `show()`、`close()`、`open`、`hidden` 的关系必须在 Dialog 文档中说明。

建议在框架测试中加入所有 overlay、empty、alert、dialog 的 hidden 属性测试。

---

## 8. Message、Alert、Confirm、Prompt 应形成完整反馈体系

迁移过程中需要区分：

| 场景                   | 推荐组件/机制                           |
| ---------------------- | --------------------------------------- |
| 页面内持续存在的错误   | `blora-alert` 或 `blora-field` error    |
| 操作成功/失败的短反馈  | `message.success()` / `message.error()` |
| 需要用户确认的危险操作 | `blora-popconfirm` 或 Dialog            |
| 需要输入内容的操作     | Dialog + Input/Field                    |
| 空列表                 | `blora-empty`                           |
| 加载中                 | `blora-spinner` / `blora-skeleton`      |

当前最容易发生的错误是：页面迁移后仍保留原生 `alert`、`confirm`、`prompt`。这会造成视觉、可访问性、移动端体验和主题表现不一致。

### 框架建议

1. `message` 提供无需应用额外拼接 message layer 的稳定入口；
2. message 的 top-layer、z-index、dialog 叠加顺序由框架统一处理；
3. 提供 `blora-confirm` 或 `blora-popconfirm` 的完整示例；
4. 提供“异步请求成功/失败/加载中”的标准模板；
5. 文档明确 Message 与 Alert 的选择规则；
6. 为无 JavaScript 或 SSR 场景提供降级策略。

例如关闭双重验证不应是：

```js
if (!password) alert("请输入密码");
```

而应是：

```js
if (!password) {
  message.error("请输入密码");
  return;
}
```

---

## 9. `blora-field` 必须成为表单迁移的首选结构

登录页迁移中，手写的大号标签会让“用户名”“密码”看起来像标题。正确的结构应该由 Field 统一处理：

```html
<blora-field label="用户名">
  <input class="blora-input" name="username" autocomplete="username" />
</blora-field>
```

建议 Field 文档明确：

- `label`、`description`、`error` 和控件之间的关系；
- 自动生成和关联 `id` / `aria-describedby` 的规则；
- `error` 与 `aria-invalid` 是否自动同步；
- 不要在 label 后自行添加冒号；
- 不要用 heading 元素代替 Field label；
- Field 在 dialog、card、list inline edit 中的间距差异。

建议提供 `blora-form` 的完整验证范例，避免每个应用自己实现错误状态同步。

---

## 10. Card、List、Descriptions、Hero 的组合模式需要官方页面级示例

迁移中反复出现的不是“不会使用 Card”，而是“单个组件都使用了，但组合层级不对”。例如：

- 两个等宽卡片并排，右边只有注册按钮，造成视觉重心错误；
- Key 列表没有被组合进 Card；
- Minecraft 账户使用手写 div 列表而不是 Card + List；
- 首页信息区没有统一使用 `table.blora-descriptions`；
- Hero、标题和说明 Card 的内边距不一致；
- AI 页面卡片之间没有统一间距。

### 建议新增“页面模式”文档

至少提供以下可直接复制的完整页面模式：

1. 认证页：单 Card + Tabs + Field + 主按钮 + 第三方登录；
2. 账户首页：Profile Card + Descriptions + Security Card + Linked Accounts；
3. 资源管理页：统计 Card + Create Form + Card-wrapped List；
4. 管理后台：Toolbar + Table + Pagination + Dialog；
5. 空状态页：Card + Empty + 主操作；
6. 详情页：Hero + Description Cards + Actions；
7. 设置页：Card + Fieldset + Field + Message；
8. 资源列表项：Avatar + List Meta + Copy + Danger Button。

每个页面模式必须同时包含：

- 桌面布局；
- 手机布局；
- 空状态；
- 错误状态；
- 加载状态；
- 长文本；
- 中英文或多语言；
- 键盘操作；
- 组件事件绑定。

### 推荐组合规则

```html
<div class="blora-card" style="padding:0;overflow:hidden">
  <div class="blora-list">
    <div class="blora-list__item">
      <div class="blora-avatar" data-size="sm">A</div>
      <div class="blora-list__meta">
        <div class="blora-list__title">名称</div>
        <div class="blora-list__desc">描述</div>
      </div>
      <div class="blora-list__actions">
        <blora-copy text="完整内容" masked label="复制内容"></blora-copy>
        <button class="blora-button" data-variant="danger" data-size="sm">删除</button>
      </div>
    </div>
  </div>
</div>
```

这一类组合应成为官方标准，而不是由应用迁移时自行摸索。

---

## 四、迁移文档当前不足与改进建议

## 1. 需要提供“迁移前审计”章节

迁移开始前，文档应要求开发者先扫描：

- 手写 Card、Panel、Box；
- 手写按钮、链接按钮、图标按钮；
- 原生 `alert`、`confirm`、`prompt`；
- 自定义 input/select/checkbox；
- 自定义分页；
- 自定义 loading、empty、error；
- 手写进度条、统计数、步骤条、时间线；
- Emoji、字符图标和外部 SVG；
- `prefers-color-scheme`、`.dark`、`.light` 和背景覆盖；
- 固定宽度、固定高度和绝对定位；
- `display: flex` 与 `[hidden]` 同时出现；
- 所有 `data-icon` 的 hydration 依赖。

建议官方提供命令：

```bash
npx blora-audit scan ./src
```

输出应按优先级列出：

```text
P0 theme boot / hidden override
P1 native feedback / custom pagination / custom form control
P2 handmade card/list/statistic/progress/timeline
P3 spacing, typography, icon, responsive refinements
```

---

## 2. 需要提供“组件选择决策表”

迁移者不应只看到组件名称，还要知道选择理由：

| 需求                 | 应使用                      | 不应继续使用            |
| -------------------- | --------------------------- | ----------------------- |
| 字段标签、描述、错误 | `blora-field`               | 大号手写 label + p      |
| 成功/失败短反馈      | Message                     | `alert()`               |
| 持续页面错误         | `blora-alert`               | 红色 div                |
| 空列表               | `blora-empty`               | 手写灰色 p              |
| 资源条目             | Card + `blora-list`         | 手写 ul/li 或 div 流    |
| 复制敏感值           | `blora-copy masked`         | `*` 文本 + 自制眼睛     |
| 步骤说明             | `blora-steps`               | `.step-num` + 手写列表  |
| 进度                 | `blora-progress`            | `.bar-bg` + `.bar-fill` |
| 统计数字             | `blora-statistic`           | 手写数字卡              |
| 页码                 | `blora-pagination`          | 上一页/下一页按钮组     |
| 危险确认             | `blora-popconfirm` / Dialog | `confirm()`             |
| 图标                 | 官方 icon API               | Emoji、字符、无尺寸 SVG |
| 方形品牌图           | Image/普通容器              | 圆形 Avatar 强行裁切    |

---

## 3. 需要提供“反例文档”

以下错误在迁移中都真实发生过，应该进入官方文档：

### 错误：用 Avatar 展示方形品牌 Logo

```html
<span class="blora-avatar">
  <img src="logo.png" />
</span>
```

如果品牌图本身是方形标志，圆形裁切和阴影会产生细黑边。应提供品牌图标容器或普通 Image 组合。

### 错误：给 `blora-select` 加 `blora-input`

```html
<blora-select class="blora-input"></blora-select>
```

这会造成双重边框。Select 应使用自己的组件样式。

### 错误：直接把 copy 文本替换成星号

```js
copy.textContent = "****************";
```

这会破坏复制语义。应使用：

```html
<blora-copy text="完整值" masked></blora-copy>
```

### 错误：隐藏元素同时写 display

```html
<div id="result" hidden></div>
```

```css
#result {
  display: flex;
}
```

应使用 `[hidden]` 规范或 `:not([hidden])`。

### 错误：默认使用 simple pagination

```html
<blora-pagination variant="simple"></blora-pagination>
```

如果用户需要数字页码，应使用默认完整模式和 `max-visible`。

### 错误：把不同层级内容放成同等重量的 Card

登录表单和一个注册按钮不应做成两个并排 Card。认证模式应放在一个 Card 中，用 Tabs 或底部轻量链接表达关系。

---

## 4. 需要提供“版本升级矩阵”

迁移指南必须列出每个能力的最低版本：

| 能力                           |            最低版本 | 迁移注意事项                 |
| ------------------------------ | ------------------: | ---------------------------- |
| 主题阻塞启动                   | 建议 2.0.x 原生提供 | 必须早于 CSS 首绘            |
| `blora-copy masked`            |               2.0.5 | 隐藏不影响复制               |
| `blora-input data-size="sm"`   |               2.0.6 | 只缩小控件，不改变 width     |
| `blora-pagination max-visible` |               2.0.0 | 完整分页模式使用默认 variant |
| `blora-field error`            |        对应发布版本 | 需确认 aria 同步行为         |
| Message top-layer              |        对应发布版本 | 需确认与 Dialog 叠加顺序     |

升级文档还应告诉开发者：

- npm 包是否需要同时升级 theming 包；
- 资源 URL 是否需要 cache busting；
- 是否需要清理旧的 node_modules 构建产物；
- 如何检查浏览器实际加载的版本；
- 如何避免旧 `auto.js` 被缓存一小时；
- 包版本、资源 query 参数和测试断言如何保持一致。

---

## 五、建议的标准迁移流程

以下流程应该成为 Blora Design 官方迁移指南的主流程。

### 阶段 0：锁定版本与运行环境

1. 升级 `@bloret-crew/blora-design` 和配套 theming 包；
2. 读取实际安装版本，不只看 `package.json`；
3. 确认所有 CSS/JS 资源来自同一版本；
4. 清理或失效旧浏览器缓存；
5. 安装官方迁移审计工具。

### 阶段 1：建立主题和资源基础

1. 加入阻塞式主题启动；
2. 按官方顺序加载 reset、tokens、主 CSS、icons、auto、theming；
3. 统一图标加载策略；
4. 确认 `[hidden]` 全局行为；
5. 确认 Message、Dialog、Popover 的 top-layer 行为。

### 阶段 2：页面结构迁移

按页面而不是按单个 CSS 类迁移：

1. App Shell：Page、Sidebar、Main Content；
2. 认证页：单 Card、Tabs、Field、按钮层级；
3. 首页：Profile、Descriptions、Security、Linked Accounts、Activity；
4. 管理页：Toolbar、Table、Dialog、Pagination；
5. 资源页：Statistic、Progress、List、Copy、Empty；
6. 详情页：Hero、Descriptions、Actions；
7. 设置页：Fieldset、Field、Alert、Message。

### 阶段 3：删除旧实现

逐项删除：

- 旧 Card/Panel CSS；
- 旧 Button CSS；
- 旧 Input/Select/Checkbox CSS；
- 手写进度条；
- 手写步骤；
- 手写分页；
- 手写 Empty/Error/Success；
- 原生反馈 API；
- Emoji 和无尺寸 SVG 图标；
- 未使用的状态同步代码；
- 旧的背景、主题和暗色覆盖逻辑。

### 阶段 4：组合和响应式修正

每个列表、表单和操作区都检查：

- 卡片是否包住列表；
- 信息层级是否正确；
- 主操作是否只有一个 primary；
- 危险操作是否使用 danger；
- copy、按钮和文本是否能收缩；
- 长文本是否换行或省略；
- 删除按钮是否水平和垂直居中；
- 手机是否需要单列；
- 空状态和错误状态是否仍然占据合理空间。

### 阶段 5：交互和无障碍验收

必须实际操作：

- 登录、注册 Tab 切换；
- 密码错误和空字段；
- 通行密钥登录；
- 主题色和深浅色切换；
- 创建、复制、显示/隐藏、删除和编辑 Key；
- 分页翻页；
- 删除账户确认；
- 选择 Minecraft 账户并打开档案管理；
- 关闭双重验证的错误、成功和确认流程；
- Dialog 打开、关闭和键盘操作；
- 空状态、加载状态、错误状态。

### 阶段 6：浏览器回归验证

每个共享组件至少检查：

- 桌面宽度；
- 手机宽度；
- 浅色模式；
- 深色模式；
- 系统深色 + 用户浅色；
- 中英文和俄文；
- 长文本；
- 无数据；
- 网络失败；
- 首次加载和整页跳转后的首帧。

### 阶段 7：自动化验收

建议官方提供 `blora migrate verify`，至少检查：

- 没有原生 `alert/confirm/prompt`；
- 没有旧 Button/Input/Panel 类；
- 没有 Emoji 状态图标；
- 没有裸 `display` 覆盖 `[hidden]`；
- 所有 `blora-copy masked` 都传完整 text；
- 所有分页都绑定 `blora-change`；
- 主题 boot 在 CSS 前；
- 图标资源顺序正确；
- 页面有 Empty、Error、Loading 状态；
- 页面移动端没有横向溢出。

---

## 六、建议增加的官方测试矩阵

### 组件级

- 属性是否被运行时识别；
- 属性动态变化是否触发重新渲染；
- 自定义元素升级前后 DOM 是否稳定；
- 事件是否冒泡、是否 composed；
- 键盘和屏幕阅读器行为；
- Shadow DOM 内外 CSS 边界；
- 多语言长文本；
- 暗色和主题色；
- reduced motion。

### 组合级

- Card + List；
- List + Copy + Button；
- Tabs + Form；
- Dialog + Field + Message；
- Timeline + Icon；
- Steps + 长描述；
- Pagination + 异步加载；
- Empty + Card；
- Hero + Description Card。

### 页面级

- 首次加载；
- 整页导航；
- 页面刷新；
- 浏览器后退/前进；
- 移动端；
- 网络错误；
- 空数据库；
- 权限不足；
- 非默认语言；
- 系统主题和用户主题冲突。

---

## 七、给 Blora Design 上游的具体 Issue 清单

建议拆分为以下 issue 或 milestone：

### 框架底层

- [ ] 提供首帧前的 blocking theme boot；
- [ ] 统一 CSS/JS/主题资源版本；
- [ ] 修复或明确 `[hidden]` 的全局优先级；
- [ ] 统一 top-layer、Message、Dialog、Popover 的堆叠管理；
- [ ] 提供 SSR 图标渲染 helper；
- [ ] 提供组件版本自检和运行时诊断信息；
- [ ] 提供无障碍和多语言自动测试矩阵。

### 组件行为

- [ ] 修复 Steps 默认 nowrap 导致的等宽布局问题；
- [ ] 修复 Tabs 指示条覆盖文字问题；
- [ ] 确保 Button 内部 icon 永远有稳定尺寸；
- [ ] 让 Copy masked 成为完整、稳定、可测试的能力；
- [ ] 为 Input 提供统一尺寸体系；
- [ ] 将完整 Pagination 作为默认或明确说明默认选择；
- [ ] 为 List 提供标准 actions 区和 inline edit 模式；
- [ ] 为危险确认提供完整 Popconfirm/Dialog 模式；
- [ ] 确保 Field 自动关联 label、description、error 和 aria 属性。

### 文档

- [ ] 增加页面模式，而不只是组件 API；
- [ ] 增加组件选择决策表；
- [ ] 增加反例和迁移前后对照；
- [ ] 增加版本最低要求矩阵；
- [ ] 增加 SSR/CSR、自定义元素升级和资源顺序说明；
- [ ] 增加主题首帧和缓存失效说明；
- [ ] 增加桌面/移动/多语言/空态/错误态示例；
- [ ] 增加“不要自行覆盖组件内部 class”的说明；
- [ ] 增加交互验收清单；
- [ ] 为所有示例提供可直接运行的完整页面。

### 工具链

- [ ] 提供迁移扫描器；
- [ ] 提供组件组合 lint 规则；
- [ ] 提供资源版本检查；
- [ ] 提供主题 FOUC 测试；
- [ ] 提供截图/布局回归测试模板；
- [ ] 提供安装后诊断命令，检查包版本、资源版本和契约一致性；
- [ ] 提供 codemod，将常见旧组件映射到 Blora 组件。

---

## 八、迁移完成的定义

一个应用只有同时满足以下条件，才能算完成 Blora Design 迁移：

### 视觉和布局

- 主页面没有因错误层级产生空卡片或视觉重心偏移；
- 卡片、列表和页面区块间距一致；
- 长文本不会破坏布局；
- 删除、编辑、复制等操作在桌面和手机上均稳定；
- 品牌 Logo 没有被错误地圆形裁切或产生阴影边；
- 所有按钮、图标和分页都使用稳定的 Blora 样式。

### 交互

- 没有不必要的原生 `alert`、`confirm`、`prompt`；
- 成功、失败、警告和空状态使用正确的 Blora 反馈组件；
- 敏感内容默认隐藏但仍可复制；
- 所有分页、Tab、Dialog、Dropdown 和 List 操作都能实际工作；
- 键盘用户可以完成主要流程。

### 主题

- 用户选择的主题在整页导航时不会闪烁；
- 系统深色和用户浅色冲突时首帧仍正确；
- 所有组件使用主题 token，不依赖手写黑白颜色；
- 主题资源和运行时代码版本一致。

### 工程质量

- 不再保留已被组件替代的旧 CSS 和状态代码；
- 页面生成器、组件契约和测试互相一致；
- 桌面、手机、空态、错误态、加载态和多语言均已验证；
- 浏览器回归测试通过；
- 迁移完成后不需要再依靠逐张截图发现基础组件使用错误。

---

## 九、已采纳与暂缓项

### 已纳入本轮框架改进

- `blora-field` 自动生成稳定的 hint/error ID，并同步 `aria-describedby` 与 `aria-invalid`；
- Theming add-on 提供 `getThemeBootScript()`，用于在 CSS 首次绘制前恢复主题和明暗模式；
- 使用指南和迁移规范补充首屏主题启动方式，并更新当前 npm 稳定版本；
- 保留并继续覆盖 Copy 掩码、Input 小号和 Steps 长文本/窄容器回归测试。

### 暂不直接改动的反馈

- Tabs 指示条：当前实现已有层级保护，后续只补充多语言和 pills 回归测试；
- Pagination：默认完整分页与 `simple` 变体已经由契约明确，补充使用场景说明即可；
- List actions / inline edit：目前没有稳定的公共契约，先以页面模式文档覆盖，不直接依赖内部 class；
- 全局 `[hidden] !important`：这是应用 CSS 覆盖浏览器语义造成的问题，不加入侵入性全局规则；
- SSR 图标字符串 helper、迁移扫描器：列入后续独立设计，不在本轮引入未定 API。

## 十、最终建议

Blora Design 下一阶段最重要的方向不是继续增加更多组件，而是把已有组件变成**可预测、可组合、可迁移**的设计系统：

1. 先解决主题首帧、资源版本和自定义元素生命周期问题；
2. 让 contract、运行时、CSS 和示例由自动化测试保证一致；
3. 把 Card、List、Field、Copy、Pagination、Message 等组件的组合方式写成页面模式；
4. 把常见错误作为反例正式记录；
5. 提供迁移扫描器和自动验收工具；
6. 把响应式、多语言、空态、错误态和可访问性纳入每个示例；
7. 对“应该使用哪个组件”给出明确决策，而不是只列出所有可用组件；
8. 让开发者按照文档执行一次完整迁移，就能直接得到生产级结果。

Blora Design 目前已经具备支撑这些页面的能力。真正需要补齐的是从“组件库”到“迁移系统”的最后一层：**明确的选择规则、可靠的默认行为、完整的页面范式和自动化的验收标准**。
