import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data input/Input",
  component: ".blora-input",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html` <input class="blora-input" type="text" placeholder="请输入..." /> `,
};

export const Types: Story = {
  render: () => html`
    <div class="blora-stack">
      <input class="blora-input" type="text" placeholder="text" />
      <input class="blora-input" type="password" placeholder="password" />
      <input class="blora-input" type="email" placeholder="email" />
      <input class="blora-input" type="number" placeholder="number" />
      <input class="blora-input" type="search" placeholder="search" />
      <input class="blora-input" type="text" placeholder="disabled" disabled />
    </div>
  `,
};
