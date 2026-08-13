import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../../addons/layout/src/index";
import "../../../addons/layout/src/layout.css";

const meta = {
  title: "Layout/Sidebar Layout",
  component: "blora-sidebar-layout",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Shared official Sidebar Navigation inside the responsive layout shell. */
const sidebarNav = html`
  <blora-sidebar-nav label="设计系统导航" value="overview">
    <blora-sidebar-nav-group label="规范">
      <blora-sidebar-nav-link
        label="概述"
        href="#overview"
        value="overview"
      ></blora-sidebar-nav-link>
      <blora-sidebar-nav-link label="色彩" href="#colors" value="colors"></blora-sidebar-nav-link>
      <blora-sidebar-nav-link
        label="字体"
        href="#typography"
        value="typography"
      ></blora-sidebar-nav-link>
      <blora-sidebar-nav-link label="间距" href="#spacing" value="spacing"></blora-sidebar-nav-link>
      <blora-sidebar-nav-link
        label="阴影与纹理"
        href="#shadows"
        value="shadows"
      ></blora-sidebar-nav-link>
      <blora-sidebar-nav-link label="图标" href="#icons" value="icons"></blora-sidebar-nav-link>
    </blora-sidebar-nav-group>
    <blora-sidebar-nav-group label="基础">
      <blora-sidebar-nav-link label="按钮" href="#button" value="button"></blora-sidebar-nav-link>
      <blora-sidebar-nav-link label="表单输入" href="#input" value="input"></blora-sidebar-nav-link>
      <blora-sidebar-nav-link label="选择器" href="#select" value="select"></blora-sidebar-nav-link>
      <blora-sidebar-nav-link label="标签徽章" href="#tag" value="tag"></blora-sidebar-nav-link>
      <blora-sidebar-nav-link label="头像" href="#avatar" value="avatar"></blora-sidebar-nav-link>
      <blora-sidebar-nav-link
        label="进度与加载"
        href="#progress"
        value="progress"
      ></blora-sidebar-nav-link>
    </blora-sidebar-nav-group>
    <blora-sidebar-nav-group label="导航">
      <blora-sidebar-nav-link
        label="导航组件"
        href="#navigation"
        value="navigation"
      ></blora-sidebar-nav-link>
      <blora-sidebar-nav-link label="数据展示" href="#data" value="data"></blora-sidebar-nav-link>
    </blora-sidebar-nav-group>
    <blora-sidebar-nav-group label="反馈">
      <blora-sidebar-nav-link
        label="反馈与提示"
        href="#feedback"
        value="feedback"
      ></blora-sidebar-nav-link>
      <blora-sidebar-nav-link
        label="模态与抽屉"
        href="#overlay"
        value="overlay"
      ></blora-sidebar-nav-link>
      <blora-sidebar-nav-link
        label="命令面板"
        href="#command"
        value="command"
      ></blora-sidebar-nav-link>
    </blora-sidebar-nav-group>
    <blora-sidebar-nav-group label="布局">
      <blora-sidebar-nav-link label="布局" href="#layout" value="layout"></blora-sidebar-nav-link>
      <blora-sidebar-nav-link
        label="进阶组件"
        href="#advanced"
        value="advanced"
      ></blora-sidebar-nav-link>
      <blora-sidebar-nav-link label="模型" href="#model" value="model"></blora-sidebar-nav-link>
    </blora-sidebar-nav-group>
  </blora-sidebar-nav>
`;

export const Default: Story = {
  render: () => html`
    <blora-sidebar-layout toggle-label="菜单" label="设计系统导航">
      <blora-sidebar-layout-sidebar>${sidebarNav}</blora-sidebar-layout-sidebar>
      <blora-sidebar-layout-content>
        <h3 class="blora-h3">设计规范</h3>
        <p class="blora-text-muted">
          左侧导航按组分块，复刻 v1 展示页侧边栏结构。窄屏（≤900px）下折叠为抽屉。
        </p>
      </blora-sidebar-layout-content>
    </blora-sidebar-layout>
  `,
};

export const Compact: Story = {
  render: () => html`
    <blora-sidebar-layout toggle-label="菜单" label="设计系统导航" compact>
      <blora-sidebar-layout-sidebar>${sidebarNav}</blora-sidebar-layout-sidebar>
      <blora-sidebar-layout-content>
        <h3 class="blora-h3">紧凑模式</h3>
        <p class="blora-text-muted">min-height: 20rem（默认 28rem）</p>
      </blora-sidebar-layout-content>
    </blora-sidebar-layout>
  `,
};
