import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Sidebar Navigation",
  component: "blora-sidebar-nav",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Grouped: Story = {
  render: () => html`
    <blora-sidebar-nav label="组件导航" value="overview" style="width: 18rem;">
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
      </blora-sidebar-nav-group>
      <blora-sidebar-nav-group label="基础">
        <blora-sidebar-nav-link label="按钮" href="#button" value="button"></blora-sidebar-nav-link>
        <blora-sidebar-nav-link
          label="表单输入"
          href="#input"
          value="input"
        ></blora-sidebar-nav-link>
      </blora-sidebar-nav-group>
    </blora-sidebar-nav>
  `,
};
