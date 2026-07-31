import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Time Picker",
  component: ".blora-timepicker",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-timepicker">
      <p class="blora-text-muted">timepicker component (beta)</p>
    </div>
  `,
};
