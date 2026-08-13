import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = {
  title: "Data display/Timeline",
  component: "blora-timeline",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Default: Story = {
  render: () =>
    html`<blora-timeline style="max-width:24rem"
      ><blora-timeline-item
        time="09:00"
        title="项目启动"
        description="召开启动会议"
        variant="primary"
      ></blora-timeline-item
      ><blora-timeline-item
        time="12:00"
        title="完成设计"
        description="UI 设计稿已确认"
        variant="success"
      ></blora-timeline-item
      ><blora-timeline-item time="15:00" title="开发中"></blora-timeline-item
    ></blora-timeline>`,
};
