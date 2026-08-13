import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraProgress } from "../src/components/progress";

defineBloraProgress();

const meta = {
  title: "Feedback/Progress",
  component: "blora-progress",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-stack">
      <blora-progress label="上传中" value="30"></blora-progress>
      <blora-progress label="处理中" value="60" variant="success"></blora-progress>
      <blora-progress label="下载中" value="90" variant="info"></blora-progress>
      <blora-progress label="不确定" value="100" variant="striped"></blora-progress>
    </div>
  `,
};

export const Circular: Story = {
  render: () => html\`
    <div class="blora-row">
      <blora-progress shape="circular" label="完成度" value="70"></blora-progress>
      <blora-progress shape="circular" label="同步中" value="40" variant="success"></blora-progress>
    </div>
  \`,
};
