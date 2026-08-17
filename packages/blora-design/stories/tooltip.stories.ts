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

export const Bottom: Story = {
  render: () => html`
    <div style="padding: 3rem; text-align: center;">
      <blora-tooltip trigger="下方提示" text="出现在触发器下方" placement="bottom"></blora-tooltip>
    </div>
  `,
};

export const Start: Story = {
  render: () => html`
    <div style="padding: 3rem; text-align: center;">
      <blora-tooltip trigger="起始侧" text="逻辑起始侧，LTR 在左" placement="start"></blora-tooltip>
    </div>
  `,
};

export const End: Story = {
  render: () => html`
    <div style="padding: 3rem; text-align: center;">
      <blora-tooltip trigger="结束侧" text="逻辑结束侧，LTR 在右" placement="end"></blora-tooltip>
    </div>
  `,
};
