import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Feedback/Tag",
  component: ".blora-tag",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html` <span class="blora-tag">默认标签</span> `,
};

export const Variants: Story = {
  render: () => html`
    <div class="blora-row">
      <span class="blora-tag">Default</span>
      <span class="blora-tag" data-variant="primary">Primary</span>
      <span class="blora-tag" data-variant="neutral">Neutral</span>
      <span class="blora-tag" data-variant="info">Info</span>
      <span class="blora-tag" data-variant="success">Success</span>
      <span class="blora-tag" data-variant="warning">Warning</span>
      <span class="blora-tag" data-variant="solid">Solid</span>
    </div>
  `,
};
