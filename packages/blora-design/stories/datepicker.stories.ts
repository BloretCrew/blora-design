import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Date Picker",
  component: ".blora-datepicker",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-datepicker">
      <p class="blora-text-muted">datepicker component (beta)</p>
    </div>
  `,
};
