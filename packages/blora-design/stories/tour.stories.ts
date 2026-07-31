import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Feedback/Tour",
  component: ".blora-tour",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-tour">
      <p class="blora-text-muted">tour component (beta)</p>
    </div>
  `,
};
