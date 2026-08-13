import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data input/Textarea",
  component: ".blora-textarea",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <textarea class="blora-textarea" placeholder="请输入内容..." rows="4"></textarea>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <textarea class="blora-textarea" placeholder="disabled" rows="3" disabled></textarea>
  `,
};
