import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraStatistic } from "../src/components/statistic";

defineBloraStatistic();

const meta = {
  title: "Data display/Statistic",
  component: "blora-statistic",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-grid blora-grid--3">
      <blora-statistic
        label="活跃用户"
        value="12,847"
        trend="↑ 12.5%"
        direction="up"
      ></blora-statistic>
      <blora-statistic
        label="月收入"
        value="¥86.2"
        suffix="万"
        trend="↑ 8.3%"
        direction="up"
      ></blora-statistic>
      <blora-statistic
        label="流失率"
        value="2.1"
        suffix="%"
        trend="↓ 0.4%"
        direction="down"
      ></blora-statistic>
    </div>
  `,
};
