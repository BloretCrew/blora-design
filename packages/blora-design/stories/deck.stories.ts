import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Deck",
  component: ".blora-deck",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-deck">
      <p class="blora-text-muted">deck component (beta)</p>
    </div>
  `,
};
