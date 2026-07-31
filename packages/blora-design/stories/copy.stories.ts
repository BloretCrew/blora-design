import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Copy",
  component: ".blora-copy",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-copy">
      <p class="blora-text-muted">copy component (beta)</p>
    </div>
  `,
};
