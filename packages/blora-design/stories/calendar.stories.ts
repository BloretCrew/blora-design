import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Calendar",
  component: ".blora-calendar",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-calendar">
      <p class="blora-text-muted">calendar component (beta)</p>
    </div>
  `,
};
