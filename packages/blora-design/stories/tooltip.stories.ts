import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraTooltip } from "../src/components/tooltip";

defineBloraTooltip();

const meta = {
  title: "Feedback/Tooltip",
  component: "blora-tooltip",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="padding: 3rem; text-align: center;">
      <blora-tooltip trigger="悬停或聚焦查看" text="这是一个提示信息"></blora-tooltip>
    </div>
  `,
};
