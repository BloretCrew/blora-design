import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = {
  title: "Navigation/Breadcrumb",
  component: "blora-breadcrumb",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Default: Story = {
  render: () =>
    html`<blora-breadcrumb
      ><blora-breadcrumb-item label="首页" href="#"></blora-breadcrumb-item
      ><blora-breadcrumb-item label="产品" href="#"></blora-breadcrumb-item
      ><blora-breadcrumb-item label="详情" href="#"></blora-breadcrumb-item
      ><blora-breadcrumb-item label="当前页" current></blora-breadcrumb-item
    ></blora-breadcrumb>`,
};
