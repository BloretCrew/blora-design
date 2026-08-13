import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Dock",
  component: "blora-dock",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-dock label="底部导航" static>
      <blora-dock-item value="home" href="#dock" icon="home" active
        ><span>首页</span></blora-dock-item
      >
      <blora-dock-item value="search" href="#dock" icon="search"><span>搜索</span></blora-dock-item>
      <blora-dock-item value="account" href="#dock" icon="user"><span>账户</span></blora-dock-item>
      <blora-dock-item value="settings" href="#dock" icon="settings"
        ><span>设置</span></blora-dock-item
      >
    </blora-dock>
  `,
};
