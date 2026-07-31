import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Feedback/Text Rotate",
  component: ".blora-text-rotate",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-text-rotate">
      <p class="blora-text-muted">text-rotate component (beta)</p>
    </div>
  `,
};
