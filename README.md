# Blora Design

> **Blora Design** — 令牌驱动、暗色友好、**零依赖** 的 Web UI 设计系统（HTML 三件套）。  
> **Blora** 是品牌前缀；产品与框架请称 **Blora Design**（代码中的 `Blora` / `blora-*` 为精简标识）。

**包名** `@bloret-crew/blora-design` · **版本** `1.0.0` · **许可** Apache-2.0  
**仓库** [BloretCrew/blora-design](https://github.com/BloretCrew/blora-design) · **作者** [RhedarLiu](https://github.com/RhedarLiu)

打开本仓库的 `index.html`，可浏览设计令牌与全部组件演示。

---

## 它是什么

Blora Design 不是 React/Vue 组件库，而是：

| 文件 | 职责 |
|------|------|
| `blora.css` | 设计令牌 + 全部组件样式 |
| `blora.js` | 交互层（Tab / Modal / Form / Table / Select…），自动 `init` |
| class + `data-blora-*` | 声明式标记，写在 HTML 里即可工作 |

适合：静态站、论坛/BBS 壳、管理后台、文档站、任何不想绑构建链的前端。

**不做**：业务 API、WebSocket、真 WYSIWYG 编辑器、React 运行时。业务逻辑用你们自己的代码接；UI 壳统一用 Blora Design。

---

## 30 秒上手

### CDN（推荐静态页 / 随时可升 1.x）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- 防配色闪烁：在 CSS 前恢复 localStorage（可选） -->
  <script>
    (() => {
      const root = document.documentElement;
      try {
        const palette = localStorage.getItem("blora-palette") || "coral";
        const mode = localStorage.getItem("blora-color-mode") || "system";
        root.dataset.bloraColorPreference = mode;
        if (palette !== "coral") root.dataset.bloraPalette = palette;
        if (mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches)) {
          root.classList.add("blora-dark");
        }
      } catch (_) {}
    })();
  </script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@bloret-crew/blora-design@1/blora.css">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <title>My App</title>
</head>
<body class="blora-page blora-scope">
  <div class="blora-container blora-stack">
    <h1 class="blora-h1">你好，Blora Design</h1>
    <p class="blora-text-lead">示例页面</p>
    <div class="blora-row">
      <button type="button" class="blora-btn blora-btn--primary">主操作</button>
      <button type="button" class="blora-btn blora-btn--outline">次操作</button>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/@bloret-crew/blora-design@1/blora.js"></script>
</body>
</html>
```

> 生产环境若需钉死版本，把 `@1` 换成 `@1.0.0`。`@1` 会跟随 1.x 最新补丁/小版本。

### npm

```bash
npm i @bloret-crew/blora-design
```

```js
// 任意入口
import "@bloret-crew/blora-design/blora.css";
import Blora from "@bloret-crew/blora-design";
// 默认 autoInit；动态插入 DOM 后：
// Blora.init(document.getElementById("mount"));
```

### 直接拷贝

```bash
cp node_modules/@bloret-crew/blora-design/blora.{css,js,d.ts} your-project/
# 或从本仓库根目录拷贝
```

---

## 视觉基线（与展示页一致的前提）

要做出和 `index.html` 同级的观感，请**整页采用 Blora Design**，不要「按钮用我们的、下拉用浏览器原生」。

1. **页面作用域**  
   - 整站：`<body class="blora-page blora-scope">`  
   - 嵌入宿主：只给局部根节点 `class="blora-scope"`

2. **字体**（展示页使用）  
   - UI / 标题：`Noto Sans SC`（或令牌默认的系统无衬线栈）  
   - 代码：`JetBrains Mono`

3. **颜色**  
   - 底色与文字占大部分，主色 / 状态色少用  
   - 改色请覆写 `--blora-*` 或 `Blora.applyPalette('ocean')`，不要在组件上写死 `#hex`

4. **圆角 / 间距 / 阴影**  
   - 只用 `--blora-space-*`、`--blora-radius-*`、`--blora-shadow-*`  
   - 表单控件默认全圆角，卡片用较大圆角

5. **交互控件一律使用 Blora Design 的 class**（`blora-*`）  
   见 [使用与迁移指南](./docs/guide.md) 中的「禁止半套原生」。

完整令牌与规范见 [`docs/standards.md`](./docs/standards.md)。

---

## 组件能力一览

| 分组 | 内容 |
|------|------|
| **基础** | 按钮、图标按钮、FAB、按钮组、链接、分割线、卡片、面板 |
| **表单** | Input / Textarea / Select（自定义壳）/ Checkbox / Radio / Switch / Number / OTP / Slider / Rate / Tags / 文件上传 / 字数限制 / 表单校验与联动 |
| **选择器** | Cascader / Date·Time / Calendar / Color / Transfer / TreeSelect / AutoComplete / Mentions |
| **导航** | Navbar / Tabs / Breadcrumb / Pagination / Steps / Menu / Dropdown / Megamenu / Sidebar / Dock / Speed Dial / Segmented / 命令面板 |
| **数据** | Table（排序·分页·多选·固定列·虚拟·列设置）/ List / Collapse / Timeline / Tree / Descriptions / Stat·CountUp / Carousel / Diff / Hover Gallery / Deck |
| **反馈** | Alert / Toast·Message / Notify / Confirm / Progress / Skeleton / Empty / Result / Tooltip / Popover |
| **浮层** | Modal / Drawer |
| **布局** | Container / Grid / Stack / Row / Affix / Splitter / Masonry / Watermark |
| **内容** | Typography / Markdown / Comment / **Thread 论坛跟帖** / 代码块 / Blockquote / Mockup 模型 |
| **工具** | 配色 / 明暗 / 快捷键提示 / 回到顶部 / 图片预览 / Tour / QRCode / 倒计时 / i18n |

详细 class、`data-blora-*` 与 API：**[docs/guide.md](./docs/guide.md)**（使用 + 迁移）。  
工程师 API 长文：[`docs/framework.md`](./docs/framework.md)。

---

## 仓库结构

```
blora-design/
├── blora.css          # 样式与令牌
├── blora.js           # 交互层（UMD / CommonJS）
├── blora.d.ts         # TypeScript 声明
├── bloret-mini.svg    # 品牌小标
├── index.html         # 组件全集展示（开发与对照用）
├── locales/           # zh-CN / en 语言包（可 CDN 分包）
├── docs/
│   ├── guide.md       # 使用指引 + 迁移指引（从这里开始）
│   ├── standards.md   # 设计规范
│   └── framework.md   # 框架与组件 API
├── package.json
├── LICENSE · NOTICE   # Apache-2.0
```

---

## 脚本与类型

```bash
npm run check   # node --check blora.js
```

```ts
import Blora from "@bloret-crew/blora-design";
Blora.toast({ type: "success", message: "已保存" });
Blora.version; // "1.0.0"
```

---

## 文档导航

| 文档 | 说明 |
|------|------|
| [**使用与迁移指南**](./docs/guide.md) | 导入、每个组件怎么写、视觉基线、**不要用原生控件**、从旧站迁移 |
| [设计规范](./docs/standards.md) | 色彩 / 字体 / 间距 / 动效 / 无障碍 |
| [框架文档](./docs/framework.md) | 令牌、初始化、组件与 JS API 详解 |

---

## 版本与在线更新

| 方式 | 示例 | 更新策略 |
|------|------|----------|
| CDN 跟主版本 | `@bloret-crew/blora-design@1` | 自动获得 1.x 最新（推荐文档/可接受小改的站点） |
| CDN 钉死 | `@1.0.0` | 最稳，升级时改版本号 |
| npm | `"@bloret-crew/blora-design": "^1.0.0"` | `npm update` |

SemVer：补丁修 bug；次版本加兼容能力；主版本才允许破坏性变更。

### 维护者：发新版（GitHub Actions → npm + Release）

1. 同步改 `package.json` 的 `version` 与 `blora.js` 里 `VERSION`  
2. commit 并 push 到 `master`  
3. 打标签并推送（**tag 必须与版本号一致**，如 `1.0.1` → `v1.0.1`）：

```bash
git tag -a v1.0.1 -m "Blora Design 1.0.1"
git push origin v1.0.1
```

4. Actions 工作流 [Release](../../actions) 会在该 tag 上自动：  
   - `npm publish` 到 `@bloret-crew/blora-design`  
   - 创建 [GitHub Release](../../releases)（安装说明 + 自动变更列表）  
5. 仓库需配置 Secret：**`NPM_TOKEN`**（npm Automation / Granular 令牌，对 `@bloret-crew` 有 publish 权限）

---

## 本地预览展示页

```bash
git clone https://github.com/BloretCrew/blora-design.git
cd blora-design
npx serve .
# 打开提示的本地地址，查看 index.html
```

---

## 原则摘要

1. **一整页一套系统** — 控件、反馈、表格、导航都用 Blora Design，避免「半套原生」。  
2. **语义令牌，不写死色值** — 组件只吃 `--blora-*`。  
3. **声明式优先** — class + `data-blora-*`，需要时再调全局 `Blora.*` API。  
4. **零依赖** — 不引入打包器也能跑；需要时也可进 npm 工程。

完整注意事项与迁移步骤见 [docs/guide.md](./docs/guide.md)。

---

## License

[Apache License 2.0](./LICENSE) © BloretCrew · RhedarLiu

See also [`NOTICE`](./NOTICE).
