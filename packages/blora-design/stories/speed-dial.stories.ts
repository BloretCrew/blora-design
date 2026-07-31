import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Speed Dial",
  component: ".blora-speed-dial",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-speed-dial">
      <p class="blora-text-muted">speed-dial component (beta)</p>
    </div>
  `,
};
