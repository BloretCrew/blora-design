# Blora Design

> **墨分五色，留白为意。**
> 一套融合 Claude 之温润纸感与东方水墨气韵的 Web UI 设计系统。

Blora Design 以宣纸为底、以印泥为章、以飞白为界，提供完整的设计规范、CSS 框架与全部 Web 控件的示例，可读、可塑、可传承。

```
纸 → 温润之底    墨 → 结构之骨    章 → 点睛之笔
```

---

## 特性

- **三根一脉**：纸、墨、章三色根，共筑东方气韵
- **零依赖**：纯 CSS + ~6KB JS，不绑构建工具
- **令牌驱动**：70+ CSS 变量，一键换肤 / 暗色模式
- **28 类组件**：覆盖市面上几乎所有 Web 控件
- **签名元素**：印章、飞白分隔、墨晕、墨滴加载
- **可访问性**：WCAG AA 对比度、键盘可达、reduced-motion
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
├── index.html       # 组件全集展示（28 类，按类别分组）
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
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;600&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <title>我的水墨页</title>
</head>
<body>
  <div class="blora-container blora-stack" style="padding-top: 80px;">
    <h1 class="blora-h1">墨分五色</h1>
    <p class="blora-text-lead">气韵生动，落墨成章。</p>
    <div class="blora-row">
      <button class="blora-btn blora-btn--primary">钤印</button>
      <button class="blora-btn blora-btn--outline">描边</button>
    </div>
    <hr class="blora-brush">
    <div class="blora-card">
      <h3 class="blora-card__title">素笺</h3>
      <p class="blora-card__body">一卡一世界。</p>
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
| **基础** | 按钮 · 图标 · 排版 · 印章 · 飞白分隔 · 引文 · 代码 |
| **表单** | 输入 · 多行 · 选择 · 密码 · 搜索 · 前后缀 · 数字步进 · 复选 · 单选 · 开关 · 滑块 · 范围 · 评分 · 分段 · 标签输入 · OTP · 颜色 · 上传/拖拽 |
| **选择器** | 日期 · 时间 · 级联 · 穿梭框 |
| **标识** | 标签 · 徽章 · 状态点 · 头像（含图片/组/徽章） |
| **进度** | 线形 · 环形 · 条纹 · Spinner · 墨滴加载 · 骨架屏 |
| **导航** | 顶栏 · 标签页（下划线/Pills/纵向）· 面包屑 · 分页 · 步骤 · 侧栏菜单 · 下拉菜单 |
| **数据** | 表格 · 列表 · 折叠 · 时间轴 · 树 · 统计 · 描述列表 · 轮播 · 图片（含相框/题图/水墨化）· 空态 · 结果 · 日历 · 图表容器 |
| **反馈** | 警告 · 横幅 · 消息 · 通知 · Toast · Tooltip · Popover · Popconfirm |
| **层** | 模态（S/M/L）· 抽屉（上/下/左/右）· 命令面板 |
| **布局** | 栅格 · 卡面 · 面板 · 分隔 · 堆叠 · 行 |
| **主题** | 暗色模式「夜墨」· 令牌换肤 |

---

## 设计三言

1. **底为纸，骨为墨，眼为章。**
2. **90% 纸墨，5% 印泥，5% 余彩。**
3. **一处用印，全篇皆活。**

详见 [`docs/standards.md`](docs/standards.md)。

---

## 兼容性

Chrome / Edge / Firefox / Safari 最新两版；iOS 14+；Android Chrome 90+。
依赖 CSS 变量、`backdrop-filter`、flex `gap`。

---

## 许可

MIT © Blora Design

---

> 一印既落，全篇皆活。望君慎用印泥。
