import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = {
  title: "Feedback/Alert",
  component: "blora-alert",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Variants: Story = {
  render: () =>
    html`<div class="blora-stack">
      <blora-alert
        variant="info"
        title="提示"
        description="这是一条信息提示。"
        dismissible
      ></blora-alert
      ><blora-alert variant="success" title="成功" description="操作已完成。"></blora-alert
      ><blora-alert variant="warning" title="警告" description="请注意潜在风险。"></blora-alert
      ><blora-alert variant="danger" title="错误" description="操作失败，请重试。"></blora-alert>
    </div>`,
};
