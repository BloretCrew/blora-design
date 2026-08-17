import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Divider",
  component: ".blora-divider",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div>
      <p>上方内容</p>
      <hr class="blora-divider" />
      <p>下方内容</p>
    </div>
  `,
};

export const Vertical: Story = {
  render: () => html`
    <div class="blora-row">
      <span>左</span>
      <hr class="blora-divider" data-orientation="vertical" />
      <span>右</span>
    </div>
  `,
};

export const Text: Story = {
  render: () => html`<div class="blora-divider" data-variant="text">或者</div>`,
};

export const Dashed: Story = {
  render: () => html`<hr class="blora-divider" data-variant="dashed" />`,
};
