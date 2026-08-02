import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Badge",
  component: ".blora-badge",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Variants: Story = {
  render: () => html`
    <div class="blora-row">
      <span class="blora-badge">9</span>
      <span class="blora-badge">99+</span>
      <span class="blora-badge" data-variant="dot"></span>
      <span class="blora-badge" data-variant="pill">New</span>
      <span class="blora-badge" data-variant="neutral">5</span>
      <span class="blora-badge" data-variant="success">3</span>
      <span class="blora-badge" data-variant="info">i</span>
    </div>
  `,
};
