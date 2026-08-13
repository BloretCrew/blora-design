import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data input/Tree Select",
  component: "blora-tree-select",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-tree-select label="地区" placeholder="选择地区">
      <blora-tree-select-option label="华东" value="east">
        <blora-tree-select-option label="上海" value="sh"></blora-tree-select-option>
        <blora-tree-select-option label="杭州" value="hz"></blora-tree-select-option>
      </blora-tree-select-option>
      <blora-tree-select-option label="华北" value="north">
        <blora-tree-select-option label="北京" value="bj"></blora-tree-select-option>
        <blora-tree-select-option label="天津" value="tj"></blora-tree-select-option>
      </blora-tree-select-option>
    </blora-tree-select>
  `,
};
