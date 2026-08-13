import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = {
  title: "Data display/Comment",
  component: "blora-comment",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Default: Story = {
  render: () =>
    html`<blora-comment
      author="Rhedar"
      time="2 小时前"
      avatar="R"
      content="这个组件库的设计非常统一，token 系统让主题切换变得很方便。"
      likes="12"
      style="max-width:480px"
    ></blora-comment>`,
};
