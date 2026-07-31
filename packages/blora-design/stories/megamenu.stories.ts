import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Megamenu",
  component: ".blora-megamenu",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-megamenu">
      <p class="blora-text-muted">megamenu component (beta)</p>
    </div>
  `,
};
