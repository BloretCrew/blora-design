import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Comment",
  component: ".blora-comment",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-comment">
      <p class="blora-text-muted">comment component (beta)</p>
    </div>
  `,
};
