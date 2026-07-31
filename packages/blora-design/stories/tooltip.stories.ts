import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Tooltip",
  component: ".blora-tooltip",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="padding: 3rem; text-align: center;">
      <span class="blora-tooltip" data-open>
        悬停查看
        <span class="blora-tooltip__bubble">这是一个提示信息</span>
      </span>
    </div>
  `,
};
