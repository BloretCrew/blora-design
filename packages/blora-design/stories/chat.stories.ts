import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = { title: "Data display/Chat", component: "blora-chat", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;
export const Default: Story = {
  render: () =>
    html`<div class="blora-stack" style="gap:var(--blora-space-4);max-width:480px">
      <blora-chat
        author="Alex"
        time="10:24"
        avatar="A"
        message="设计稿已经同步，可以开始组件联调。"
      ></blora-chat
      ><blora-chat
        author="Blora"
        time="10:26"
        avatar="B"
        avatar-variant="primary"
        side="end"
        message="收到，先处理表单和导航。"
      ></blora-chat>
    </div>`,
};
