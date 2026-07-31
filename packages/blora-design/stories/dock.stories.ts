import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Dock",
  component: ".blora-dock",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-dock">
      <p class="blora-text-muted">dock component (beta)</p>
    </div>
  `,
};
