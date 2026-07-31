import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Countdown",
  component: ".blora-countdown",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-countdown">
      <p class="blora-text-muted">countdown component (beta)</p>
    </div>
  `,
};
