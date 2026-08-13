import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraDropdown } from "../src/components/dropdown";

defineBloraDropdown();

const meta = {
  title: "Actions/Dropdown",
  component: "blora-dropdown",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-dropdown label="下拉菜单">
      <blora-dropdown-item value="one">操作一</blora-dropdown-item>
      <blora-dropdown-item value="two">操作二</blora-dropdown-item>
      <blora-dropdown-item value="three">操作三</blora-dropdown-item>
    </blora-dropdown>
  `,
};

export const WithSeparator: Story = {
  render: () => html`
    <blora-dropdown label="操作菜单">
      <blora-dropdown-item value="edit">编辑</blora-dropdown-item>
      <blora-dropdown-item value="copy">复制</blora-dropdown-item>
      <blora-dropdown-item value="delete" separator>删除</blora-dropdown-item>
    </blora-dropdown>
  `,
};
