import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Countdown",
  component: ".blora-countdown",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-countdown">
      <div class="blora-countdown__unit">
        <span class="blora-countdown__value">02</span><span class="blora-countdown__label">天</span>
      </div>
      <div class="blora-countdown__sep">:</div>
      <div class="blora-countdown__unit">
        <span class="blora-countdown__value">14</span><span class="blora-countdown__label">时</span>
      </div>
      <div class="blora-countdown__sep">:</div>
      <div class="blora-countdown__unit">
        <span class="blora-countdown__value">35</span><span class="blora-countdown__label">分</span>
      </div>
      <div class="blora-countdown__sep">:</div>
      <div class="blora-countdown__unit">
        <span class="blora-countdown__value">42</span><span class="blora-countdown__label">秒</span>
      </div>
    </div>
  `,
};
