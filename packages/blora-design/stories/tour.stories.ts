import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Tour",
  component: "blora-tour",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-tour label="开始漫游">
      <blora-tour-step title="标签" description="这是第一步：高亮当前标签。"
        ><span class="blora-tag" data-variant="primary">步骤 A</span></blora-tour-step
      >
      <blora-tour-step title="按钮" description="第二步：关注操作按钮。"
        ><button class="blora-button" data-variant="outline" type="button">
          步骤 B
        </button></blora-tour-step
      >
      <blora-tour-step title="说明" description="第三步：可跳过或完成引导。"
        ><span class="blora-hint">步骤 C 文案</span></blora-tour-step
      >
    </blora-tour>
  `,
};
