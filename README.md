# Blora Design

> 一套以令牌驱动、暗色友好、零依赖为目标的 Web UI 设计系统。

Blora Design 提供完整的设计规范、CSS 框架与全部 Web 控件的示例，可读、可塑、可复用。

```
底色 → 沉稳之底    文字 → 结构之骨    主色 → 点睛之笔
```

---

## 特性

- **语义色层级**：背景与表面、内容、交互与状态分层映射，组件不依赖具体色名
- **零依赖**：纯 CSS + 原生 JS，不绑构建工具
- **令牌驱动**：70+ CSS 变量，九套配色与完整暗色模式
- **完整组件集**：覆盖常见 Web 应用的输入、导航、数据、反馈、布局与展示场景
- **统一风格**：现代无衬线、连续圆角、柔和阴影与玻璃浮层
- **可访问性**：WCAG AA 对比度、浮层/标签页/树键盘可达、reduced-motion
- **响应式**：桌面 / 平板 / 移动 ≥ 320px 不破版

---

## 速览

打开 `index.html` 即可浏览全部组件：

```bash
# 任选一种本地预览
python -m http.server 8000
#   → http://localhost:8000

npx serve .
#   → http://localhost:3000
```

或直接双击 `index.html` 在浏览器中打开。

---

## 文件

```
blora-design-2/
├── blora.css        # 框架本体 · 设计令牌 + 全部组件样式
├── blora.js         # 交互层 · Tab/Modal/Drawer/Toast/Carousel…
├── index.html       # 组件全集展示（按使用场景分组）
└── docs/
    ├── standards.md  # 设计规范（哲学/色彩/字体/间距/动效/无障碍）
    └── framework.md  # 框架文档（安装/令牌/组件 API/JS 用法）
```

---

## 30 秒上手

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="blora.css">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <title>我的页面</title>
</head>
<body class="blora-page blora-scope">
  <div class="blora-container blora-stack">
    <h1 class="blora-h1">页面标题</h1>
    <p class="blora-text-lead">页面的引导说明文字。</p>
    <div class="blora-row">
      <button class="blora-btn blora-btn--primary">确定</button>
      <button class="blora-btn blora-btn--outline">描边</button>
    </div>
    <hr class="blora-divider">
    <div class="blora-card">
      <h3 class="blora-card__title">卡片标题</h3>
      <p class="blora-card__body">卡片正文内容示例。</p>
    </div>
  </div>
  <script src="blora.js"></script>
</body>
</html>
```

---

## 组件清单

| 类别 | 组件 |
|------|------|
| **基础** | 图标 · 排版 · 分隔线 · 引文 · 代码 |
| **动作** | 按钮 · FAB · Speed Dial · Swap · 按钮组 |
| **表单** | 输入 · 多行 · 选择 · 密码 · 搜索 · 前后缀 · 数字步进 · 复选 · 单选 · 开关 · 滑块 · 范围 · 评分 · 分段 · 标签输入 · OTP · 颜色 · Fieldset · File Input · Filter · Validator · 上传/拖拽 |
| **选择器** | 日期 · 时间 · 级联 · 穿梭框 |
| **标识** | 标签 · 徽章 · 状态点 · 头像（含图片/组/徽章） |
| **进度** | 线形 · 环形 · 条纹 · Spinner · 骨架屏 |
| **导航** | 顶栏 · 标签页（下划线/Pills/纵向）· 面包屑 · 分页 · 步骤 · 侧栏菜单 · 响应式 Sidebar · 下拉菜单 · Megamenu · Dock |
| **数据** | 表格 · 列表 · 折叠 · 时间轴 · 树 · 统计 · 描述列表 · 轮播 · 图片 · Hover Gallery · Diff · Chat · Countdown · Kbd · 空态 · 结果 · 日历 · 图表容器 |
| **反馈** | 警告 · 横幅 · 消息 · 通知 · Toast · Tooltip · Popover · Popconfirm |
| **层** | 模态（S/M/L）· 抽屉（上/下/左/右）· 命令面板 |
| **布局** | 栅格 · 卡面 · 面板 · 分隔 · 堆叠 · 行 · Join · Indicator · Hero · Footer · Mask · Deck |
| **展示** | Text Rotate · Browser/Code/Phone/Window Mockup |
| **外观** | 九套配色 · 浅色/深色/跟随系统 |

---

## 设计原则

1. **组件只消费语义令牌，不绑定具体配色。**
2. **表面与正文承担主要信息，强调色面积保持在 5% 以内。**
3. **默认覆盖键盘、焦点、明暗模式和移动端，不把可访问性留给业务补丁。**

详见 [`docs/standards.md`](docs/standards.md)。

---

## 兼容性

Chrome / Edge 111+、Firefox 113+、Safari 16.2+；iOS 16.2+；Android Chrome 111+。
依赖 CSS 变量、`color-mix()`、`backdrop-filter`、flex `gap`。

---

## 许可

MIT © Blora Design

---

> 主色克制，全局皆亮。
