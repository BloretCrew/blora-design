import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraCommand } from "../src/components/command-palette";

defineBloraCommand();

const meta = {
  title: "Navigation/Command Palette",
  component: "blora-command",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-command placeholder="输入命令或搜索...">
      <blora-command-item value="new" icon="document" shortcut="⌘N">新建文档</blora-command-item>
      <blora-command-item value="open" icon="folder" shortcut="⌘O">打开文件</blora-command-item>
      <blora-command-item value="settings" icon="settings" shortcut="⌘,">设置</blora-command-item>
      <blora-command-item value="search" icon="search" shortcut="⌘K">全局搜索</blora-command-item>
    </blora-command>
  `,
};
