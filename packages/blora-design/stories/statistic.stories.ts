import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Statistic",
  component: ".blora-stat",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-grid blora-grid--3">
      <div class="blora-stat">
        <div class="blora-stat__label">活跃用户</div>
        <div class="blora-stat__value">12,847</div>
        <div class="blora-stat__trend" data-direction="up">↑ 12.5%</div>
      </div>
      <div class="blora-stat">
        <div class="blora-stat__label">月收入</div>
        <div class="blora-stat__value">¥86.2<span class="blora-stat__suffix">万</span></div>
        <div class="blora-stat__trend" data-direction="up">↑ 8.3%</div>
      </div>
      <div class="blora-stat">
        <div class="blora-stat__label">流失率</div>
        <div class="blora-stat__value">2.1<span class="blora-stat__suffix">%</span></div>
        <div class="blora-stat__trend" data-direction="down">↓ 0.4%</div>
      </div>
    </div>
  `,
};
