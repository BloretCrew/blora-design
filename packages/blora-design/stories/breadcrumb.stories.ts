import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Breadcrumb",
  component: ".blora-breadcrumb",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <nav class="blora-breadcrumb">
      <a href="#">首页</a>
      <span class="blora-breadcrumb__sep">/</span>
      <a href="#">产品</a>
      <span class="blora-breadcrumb__sep">/</span>
      <a href="#">详情</a>
      <span class="blora-breadcrumb__sep">/</span>
      <span class="blora-breadcrumb__current">当前页</span>
    </nav>
  `,
};
