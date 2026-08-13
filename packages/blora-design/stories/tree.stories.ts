import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data display/Tree",
  component: "blora-tree",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-tree style="max-width:300px;">
      <blora-tree-node value="tech" label="技术部" open selected>
        <blora-tree-node value="frontend" label="前端组" open>
          <blora-tree-node value="zhang" label="张三"></blora-tree-node>
          <blora-tree-node value="li" label="李四"></blora-tree-node>
          <blora-tree-node value="wang" label="王五"></blora-tree-node>
        </blora-tree-node>
        <blora-tree-node value="design" label="设计组">
          <blora-tree-node value="zhao" label="赵六"></blora-tree-node>
          <blora-tree-node value="sun" label="孙八"></blora-tree-node>
        </blora-tree-node>
      </blora-tree-node>
    </blora-tree>
  `,
};
