import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Carousel",
  component: ".blora-carousel",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-carousel">
      <p class="blora-text-muted">carousel component (beta)</p>
    </div>
  `,
};
