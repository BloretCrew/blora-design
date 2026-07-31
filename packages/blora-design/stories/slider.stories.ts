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
      <span class="blora-text-sm blora-text-muted">0</span>
      <div class="blora-slider__track">
        <div class="blora-slider__fill" style="width: 60%;"></div>
        <div class="blora-slider__thumb" style="left: 60%;"></div>
      </div>
      <span class="blora-text-sm blora-text-primary" style="min-width: 3ch; text-align: end;"
        >60</span
      >
    </div>
  `,
};
