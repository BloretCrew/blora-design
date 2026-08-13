import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = { title: "Data display/Empty", component: "blora-empty", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;
export const Default: Story = {
  render: () =>
    html`<blora-empty
      title="暂无数据"
      description="列表为空，可创建一个新项开始。"
      action-label="创建项目"
    ></blora-empty>`,
};
