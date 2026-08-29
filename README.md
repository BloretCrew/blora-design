# Blora Design 2.0

> Token-driven, dark-friendly, zero-runtime-dependency Web UI design system.

**Package** `@bloret-crew/blora-design` · **Version** `2.0.0` · **License** Apache-2.0
**Status** Stable · **npm** `latest`

## 入口

- [使用指南](./docs/guide.md)
- [完整迁移规范](./docs/migration/from-any-ui-to-blora-design.md)
- [设计规范](./docs/standards.md)
- [框架接入说明](./docs/framework.md)
- [组件 Showcase](https://bloretcrew.github.io/blora-design/)
- [组件 contract](./packages/blora-design/contracts/)
- [组件 manifest](./packages/blora-design/component-manifest.json)
- [发布与验收记录](./docs/refactor/rc-release-rehearsal.md)

## 安装

所有消费项目必须从 npm 安装，只使用 published npm exports，不得引用本仓库源码、git 路径或复制组件实现。

```bash
npm install @bloret-crew/blora-design
```

```ts
import "@bloret-crew/blora-design/blora.css";
import "@bloret-crew/blora-design/auto";
import { createTableController, message } from "@bloret-crew/blora-design";
```

可选 add-on：

```bash
npm install \
  @bloret-crew/blora-design-markdown \
  @bloret-crew/blora-design-thread \
  @bloret-crew/blora-design-qrcode \
  @bloret-crew/blora-design-effects \
  @bloret-crew/blora-design-layout \
  @bloret-crew/blora-design-theming
```

## 30 秒示例

```html
<button type="button" class="blora-button" data-variant="primary">保存</button>
<blora-search label="搜索项目" placeholder="输入关键词"></blora-search>
<blora-range label="价格范围" min="0" max="100" values="20,80"></blora-range>

<div class="blora-table-wrap" data-blora-selectable>
  <table class="blora-table">
    <thead><tr><th data-sort data-col-key="name">成员</th></tr></thead>
    <tbody><tr data-row-key="u1"><td>张三</td></tr></tbody>
  </table>
</div>
```

```ts
const table = document.querySelector<HTMLElement>(".blora-table-wrap");
const controller = createTableController(table);
message.success("保存成功");
window.addEventListener("pagehide", () => controller.destroy(), { once: true });
```

## 组件选择规则

| 场景 | 规则 |
|---|---|
| 展示型内容 | 使用官方 class 和语义 HTML，例如 `.blora-card`、`.blora-quote`、`.blora-tag`、`.blora-badge` |
| 结构敏感交互 | 使用官方 Composite Custom Element，例如 `<blora-select>`、`<blora-dialog>`、`<blora-tabs>` |
| 开放数据 DOM | 使用官方 headless controller，例如 `createTableController()`、`createFormController()` |
| 图标 | 使用 `createBloraIcon()` 或官方组件生成的 Lucide SVG |
| 样式 | 使用注册的 `--blora-*` token 和官方 CSS |

业务项目不得复制组件源码、内部 CSS、内部 DOM 或第二套组件视觉。完整规则和每个组件示例见[完整迁移规范](./docs/migration/from-any-ui-to-blora-design.md)。

## 设计系统能力

- 87 个核心组件；
- 6 套主题和明暗模式；
- Composite Custom Element 默认结构；
- Table / Form 等开放 DOM controller；
- i18n locale pack；
- RTL、reduced-motion 和 WCAG 2.2 AA 门禁；
- Markdown、Thread、QRCode、Effects、Layout、Theming 六个 add-on；
- ESM、CSS 子路径和 CDN IIFE；
- Chromium、移动 Chromium、Firefox、WebKit 和 Safari 人工验收。

## 验证

```bash
pnpm verify
```

发布包使用已生成的 `dist/` 文件。消费项目只使用 npm `exports`，不导入 `packages/**/src` 或 `addons/**/src`。

## 许可证

Apache-2.0 · 详见 `LICENSE` 和 `NOTICE`。
