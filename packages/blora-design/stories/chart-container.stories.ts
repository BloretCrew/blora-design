import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = {
  title: "Data display/Chart Container",
  component: "blora-chart-container",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Default: Story = {
  render: () =>
    html`<blora-chart-container
      title="访问趋势"
      subtitle="最近 7 天"
      trend="+12%"
      style="max-width:480px"
      ><svg viewBox="0 0 400 160" width="100%" height="160" preserveAspectRatio="none">
        <polyline
          points="0,120 57,90 114,100 171,60 228,70 285,40 342,50 400,20"
          fill="none"
          stroke="var(--blora-color-action-primary-default)"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        /></svg
    ></blora-chart-container>`,
};

export const TrendVariants: Story = {
  render: () => html\`<div class="blora-grid blora-grid--2"><blora-chart-container title="增长" trend="+8.3%" trend-variant="success"><div>趋势向上</div></blora-chart-container><blora-chart-container title="下降" trend="-4.1%" trend-variant="danger"><div>趋势向下</div></blora-chart-container></div>\`,
};
