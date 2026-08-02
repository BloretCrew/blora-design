# 任务：将 bbs.bloret.net 迁移到 Blora Design

> 本文件是给 **迁移 AI / 工程师** 的提示词与步骤清单，可整段复制使用。  
> 仓库：https://github.com/BloretCrew/blora-design · 包：`@bloret-crew/blora-design`

你是前端迁移工程师。目标：把 **bbs.bloret.net** 的 **UI 壳** 迁到 **Blora Design**（零依赖 HTML 三件套），使页面观感与交互与官方展示页一致，而不是「半套 Blora Design + 半套浏览器原生 / 临时自写」。

---

## 产品与仓库（必读）

| 项 | 内容 |
|----|------|
| 产品全称 | **Blora Design**（说明里写全称；代码里 `Blora` / `blora-*` 可精简） |
| 品牌前缀 | Blora |
| npm | `@bloret-crew/blora-design`（当前 1.0.x） |
| 源码 / 文档 | https://github.com/BloretCrew/blora-design |
| 许可 | Apache-2.0 |

### 安装

```bash
npm i @bloret-crew/blora-design
```

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@bloret-crew/blora-design@1/blora.css">
<script src="https://cdn.jsdelivr.net/npm/@bloret-crew/blora-design@1/blora.js"></script>
```

或 bundler：

```js
import "@bloret-crew/blora-design/blora.css";
import Blora from "@bloret-crew/blora-design";
```

生产环境若要钉死版本，把 CDN 的 `@1` 换成 `@1.0.0`（或当前最新 patch）。

---

## 必读文档（按顺序）

1. **[docs/guide.md](./guide.md)**（或 GitHub 同路径）  
   - 导入、页面骨架、`blora-page` / `blora-scope`  
   - **禁止半套原生**（最重要）  
   - 各组件 class / `data-blora-*` 用法  
   - 迁移步骤与验收清单  

2. **[README.md](../README.md)**  
   - 安装、版本策略、包结构  

3. **[docs/standards.md](./standards.md)**  
   - 颜色 / 字体 / 间距 / 圆角 / 动效令牌（改色只覆写 `--blora-*`）  

4. **[docs/framework.md](./framework.md)**  
   - 组件与 `Blora.*` API 详表  

5. **展示页（视觉与结构最终参照）**  
   - 克隆仓库后本地打开 `index.html`  
   - 或对照 GitHub 上的 `index.html`  
   - **拿不准结构时，抄展示页同类 demo，不要自己发明皮肤**

补充：

- 默认配色是 **`coral`**（未设 `data-blora-palette` 时的 `:root`）。  
- 版本以 `Blora.version` / npm 为准。  
- 文档以 **GitHub 仓库** 为准（npm 包内文档可能略滞后）。

---

## 迁移原则（必须遵守）

1. **一整页一套系统**：按钮、输入、下拉、表格、弹层、Toast、导航都用 Blora Design；禁止主流程里出现未包 class 的裸 `input` / `select` / `button` 或系统默认弹层。  
2. **壳用 Blora Design，逻辑留站点**：路由、鉴权、API、WebSocket、上传、实时聊天、Live、AI 代写、真 WYSIWYG 编辑器等 **产品能力** 不塞进组件库；只换 UI 壳。  
3. **缺大组件就拼，不要退回原生**：发帖区 = textarea + 工具按钮 + Mentions + Form 校验 + Markdown 预览；列表 = Card/List + Pagination；设置 = Form + Switch/Select/Tabs。  
4. **声明式优先**：class + `data-blora-*`；动态插入 DOM 后调用 `Blora.init(subtree)`。  
5. **表单**：`data-blora-form` 默认拦截原生 submit（避免 `?username=` 写进 URL），成功听 `blora:submit`；真要浏览器提交才加 `data-blora-native-submit`。校验 UI 用 `data-blora-error-ui="popup"`，不要浏览器黄泡。  
6. **动态生成的控件也必须完整结构**（例如 checkbox 必须是 `label.blora-checkbox` + `span.blora-checkbox__box`，禁止裸 checkbox）。  
7. **令牌**：颜色/间距/圆角用 `--blora-*`，禁止在组件上写死品牌色 hex 导致暗色/换肤坏掉。  
8. **作用域**：整站 `body.blora-page.blora-scope`；若嵌入旧壳，只用局部 `.blora-scope` + 必要时 `Blora.configure({ portalRoot, colorModeStorageKey, paletteStorageKey })`。  
9. **文案风格**：技术说明写清楚即可，不要文学化口号。  
10. **不要引入** React/Vue 组件库与 Blora Design 控件皮肤混用；旧 Bootstrap/Ant 类名逐步替换掉。

---

## 推荐迁移顺序（分步提交，每步可验收）

### 阶段 0：摸底

- 列出 bbs 路由/页面：首页、分区列表、帖子详情、发帖/回复、用户/设置、管理、登录注册、搜索等。  
- 标出当前技术栈（Express SPA / 模板 / 静态资源路径）。  
- 区分：**UI 壳** vs **业务模块**（WS、Live、AI、富文本核心逻辑等）。  

### 阶段 1：全局接入

- 引入 `blora.css` + `blora.js`（或 npm）。  
- 根节点 `blora-page blora-scope`；可选：CSS 前恢复 palette/colorMode 的防闪脚本（见 README / guide）。  
- 全局字体可与展示页一致（如 Noto Sans SC + JetBrains Mono）。  
- 顶栏 / 侧栏 / 页脚先换成 Navbar / 布局 token，去掉旧全局 reboot 冲突。  

### 阶段 2：基础控件与反馈

- 所有按钮 → `blora-btn` 变体。  
- 表单 → `blora-input` / `textarea` / `blora-select` / checkbox / radio / switch。  
- `alert` / `confirm` → `Blora.toast` / `message` / `notify` / `confirm`。  
- Modal/Drawer 用 Blora Design 结构，放在 body 或 portal。  

### 阶段 3：列表与数据

- 帖子列表：List/Card + Tag + Pagination。  
- 管理表：`data-blora-table`（排序/分页/多选按需）。  
- 空态 / 加载：Empty / Skeleton / Progress。  

### 阶段 4：内容与论坛结构

- 帖子详情：`blora-thread` + `blora-post` + `data-blora-md`（Markdown）。  
- 轻评论可用 `blora-comment`。  
- 发帖/回复：拼装 composer（工具栏 + textarea + Mentions + 预览 + Form），不要等专用富文本组件。  

### 阶段 5：设置与杂项

- 设置页 Form + Tabs + Switch/Select。  
- 图片预览 `Blora.preview`；回到顶部 FAB / backTop。  
- 需要中英文时：`Blora.setLocale` + `locales/`。  

### 阶段 6：清理

- 删除未再使用的旧 CSS/组件皮肤。  
- 全局搜：裸 select、系统 checkbox、`alert(`、未包 class 的 button。  
- 按 guide 验收清单逐项打勾。  

---

## 页面 → Blora Design 拼法速查

| 页面 | 拼法 |
|------|------|
| 布局壳 | container、Navbar、Sidebar、`blora-stack` / `grid` |
| 帖子列表 | List/Card + Tag + Pagination + Empty |
| 帖子详情 | Thread + Markdown + Divider + 工具条按钮 |
| 发帖/回复 | Form + textarea + Mentions + 按钮组 + Markdown 预览 |
| 登录/注册/设置 | Form + validate + Switch/Select |
| 管理后台 | Table + Modal + Confirm + Toast |
| 聊天（若有） | List + 气泡 Card + 底部输入；实时仍用现有 WS |
| Live / AI | 保留业务模块；外壳用 Card/Drawer/按钮 |

---

## 验收标准（对齐展示页）

- [ ] CSS + JS 已引入，`Blora.version` 可打印  
- [ ] 根节点有 `blora-page` 和/或 `blora-scope`  
- [ ] 主流程无裸原生控件皮肤  
- [ ] 无浏览器默认校验黄泡、无 `alert` 主路径  
- [ ] 颜色/间距来自令牌；暗色可切换  
- [ ] 动态 DOM 有 `Blora.init`  
- [ ] 未混用另一套 UI 库控件皮肤  
- [ ] 论坛读写路径：列表 + 详情 Thread/MD + 发帖拼装可用  

---

## 工作方式

- 先读 **guide.md**，再动代码；结构不确定时对照 **`index.html`**。  
- 小步提交：每阶段可截图 / 可点验。  
- 不要重写 Blora Design 源码来「加业务」；业务写在 bbs 项目内。  
- 若必须新增可复用壳组件，优先在 bbs 业务层拼装；只有多处重复再考虑上游贡献。  
- 输出时说明：改了哪些路由/文件、还剩哪些业务模块未迁 UI。  

---

## 反例（禁止）

- 只换按钮颜色，下拉仍用系统 `<select>` 默认皮  
- 校验靠 `setCustomValidity` 弹出浏览器气泡  
- 成功提交用 GET 把表单参数写进 URL（除非明确需要）  
- 弹层写在 `overflow: hidden` 容器内被裁切  
- 与 Ant Design / Bootstrap 按钮类混在同一表单  
- 文学化口号式文案；技术说明保持直白  

---

## 开始方式

先给出 **阶段 0 摸底报告**（页面清单 + 技术栈 + 迁移优先级），再进入阶段 1。  
**未经确认不要大范围删除业务逻辑。**

（可选补充，由 bbs 负责人填写）

- 仓库路径 / 分支：  
- 禁止修改的目录：  
- 部署方式：  
