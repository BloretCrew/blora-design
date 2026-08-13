import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraPopconfirm } from "../src/components/popconfirm";

defineBloraPopconfirm();

const meta = {
  title: "Feedback/Popconfirm",
  component: "blora-popconfirm",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-popconfirm
      trigger="删除"
      message="确认删除此项？"
      cancel-label="取消"
      confirm-label="确定"
    ></blora-popconfirm>
  `,
};
