import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Rate",
  component: ".blora-rate",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-rate">
      <p class="blora-text-muted">rate component (beta)</p>
    </div>
  `,
};
