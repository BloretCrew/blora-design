import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Transfer",
  component: ".blora-transfer",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-transfer">
      <p class="blora-text-muted">transfer component (beta)</p>
    </div>
  `,
};
