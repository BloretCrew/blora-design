import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createSidebarLayoutController } from "../../../addons/layout/src/index";
import "../../../addons/layout/src/layout.css";

const meta = {
  title: "Add-ons/Layout/Sidebar Layout",
  component: ".blora-sidebar-layout",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Sidebar nav with grouped links, replicating v1 showcase sidebar */
const sidebarNav = html`
  <nav style="font-size: var(--blora-text-sm);">
    <div
      style="font-size: var(--blora-text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--blora-color-text-disabled); padding: var(--blora-space-3) 0.7em var(--blora-space-1);"
    >
      规范
    </div>
    <a class="blora-navbar__link" href="#" aria-current="page" style="display: block;">概述</a>
    <a class="blora-navbar__link" href="#" style="display: block;">色彩</a>
    <a class="blora-navbar__link" href="#" style="display: block;">字体</a>
    <a class="blora-navbar__link" href="#" style="display: block;">间距</a>
    <a class="blora-navbar__link" href="#" style="display: block;">阴影与纹理</a>
    <a class="blora-navbar__link" href="#" style="display: block;">图标</a>

    <div
      style="font-size: var(--blora-text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--blora-color-text-disabled); padding: var(--blora-space-3) 0.7em var(--blora-space-1);"
    >
      基础
    </div>
    <a class="blora-navbar__link" href="#" style="display: block;">按钮</a>
    <a class="blora-navbar__link" href="#" style="display: block;">表单输入</a>
    <a class="blora-navbar__link" href="#" style="display: block;">选择器</a>
    <a class="blora-navbar__link" href="#" style="display: block;">标签徽章</a>
    <a class="blora-navbar__link" href="#" style="display: block;">头像</a>
    <a class="blora-navbar__link" href="#" style="display: block;">进度与加载</a>

    <div
      style="font-size: var(--blora-text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--blora-color-text-disabled); padding: var(--blora-space-3) 0.7em var(--blora-space-1);"
    >
      导航
    </div>
    <a class="blora-navbar__link" href="#" style="display: block;">导航组件</a>
    <a class="blora-navbar__link" href="#" style="display: block;">数据展示</a>

    <div
      style="font-size: var(--blora-text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--blora-color-text-disabled); padding: var(--blora-space-3) 0.7em var(--blora-space-1);"
    >
      反馈
    </div>
    <a class="blora-navbar__link" href="#" style="display: block;">反馈与提示</a>
    <a class="blora-navbar__link" href="#" style="display: block;">模态与抽屉</a>
    <a class="blora-navbar__link" href="#" style="display: block;">命令面板</a>

    <div
      style="font-size: var(--blora-text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--blora-color-text-disabled); padding: var(--blora-space-3) 0.7em var(--blora-space-1);"
    >
      布局
    </div>
    <a class="blora-navbar__link" href="#" style="display: block;">布局</a>
    <a class="blora-navbar__link" href="#" style="display: block;">进阶组件</a>
    <a class="blora-navbar__link" href="#" style="display: block;">模型</a>
  </nav>
`;

const bindSidebar = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createSidebarLayoutController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-sidebar-layout" data-blora-sidebar-layout ${ref(bindSidebar)}>
      <button type="button" class="blora-button blora-sidebar-layout__toggle" data-variant="outline" data-blora-sidebar-toggle>
        菜单
      </button>
      <div class="blora-sidebar-layout__mask"></div>
      <aside class="blora-sidebar-layout__aside">${sidebarNav}</aside>
      <main class="blora-sidebar-layout__content">
        <h3 class="blora-h3">设计规范</h3>
        <p class="blora-text-muted">
          左侧导航按组分块，复刻 v1 展示页侧边栏结构。窄屏（≤900px）下折叠为抽屉。
        </p>
      </main>
    </div>
  `,
};

export const Compact: Story = {
  render: () => html`
    <div
      class="blora-sidebar-layout blora-sidebar-layout--compact"
      data-blora-sidebar-layout
      ${ref(bindSidebar)}
    >
      <button type="button" class="blora-button blora-sidebar-layout__toggle" data-variant="outline" data-blora-sidebar-toggle>
        菜单
      </button>
      <div class="blora-sidebar-layout__mask"></div>
      <aside class="blora-sidebar-layout__aside">${sidebarNav}</aside>
      <main class="blora-sidebar-layout__content">
        <h3 class="blora-h3">紧凑模式</h3>
        <p class="blora-text-muted">min-height: 20rem（默认 28rem）</p>
      </main>
    </div>
  `,
};
