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
      <a class="blora-breadcrumb__item" href="#">首页</a>
      <a class="blora-breadcrumb__item" href="#">产品</a>
      <span class="blora-breadcrumb__item" aria-current="page">详情</span>
    </nav>
  `,
};
