import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = {
  title: "Feedback/Banner",
  component: "blora-banner",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Default: Story = {
  render: () =>
    html`<blora-banner
      title="新版本 · v2.0 发布"
      description="带来更好的用户体验和更多功能，欢迎升级。"
      ><blora-banner-action label="立即升级" value="upgrade" variant="primary"></blora-banner-action
      ><blora-banner-action label="详情" value="details"></blora-banner-action
    ></blora-banner>`,
};
