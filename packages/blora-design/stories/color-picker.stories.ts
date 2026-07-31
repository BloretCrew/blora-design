import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Color Picker",
  component: ".blora-color-picker",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-color-picker">
      <p class="blora-text-muted">color-picker component (beta)</p>
    </div>
  `,
};
