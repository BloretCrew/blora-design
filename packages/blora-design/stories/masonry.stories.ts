import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Masonry",
  component: ".blora-masonry",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-masonry">
      <p class="blora-text-muted">masonry component (beta)</p>
    </div>
  `,
};
