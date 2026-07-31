import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Slider",
  component: ".blora-slider",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-slider">
      <p class="blora-text-muted">slider component (beta)</p>
    </div>
  `,
};
