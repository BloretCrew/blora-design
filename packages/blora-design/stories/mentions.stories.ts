import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Mentions",
  component: ".blora-mentions",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-mentions">
      <p class="blora-text-muted">mentions component (beta)</p>
    </div>
  `,
};
