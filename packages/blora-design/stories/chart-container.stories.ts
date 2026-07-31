import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Chart Container",
  component: ".blora-chart",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-chart" style="max-width: 480px;">
      <div
        class="blora-chart__header"
        style="display: flex; justify-content: space-between; align-items: center; padding: var(--blora-space-3) var(--blora-space-4); border-bottom: 1px solid var(--blora-color-border-subtle);"
      >
        <div>
          <div style="font-weight: 600; font-size: var(--blora-text-sm);">访问趋势</div>
          <div class="blora-text-xs blora-text-subtle">最近 7 天</div>
        </div>
        <span class="blora-tag" data-variant="success">+12%</span>
      </div>
      <div class="blora-chart__body" style="padding: var(--blora-space-4); min-height: 160px;">
        <svg viewBox="0 0 400 160" width="100%" height="160" preserveAspectRatio="none">
          <polyline
            points="0,120 57,90 114,100 171,60 228,70 285,40 342,50 400,20"
            fill="none"
            stroke="var(--blora-color-action-primary-default)"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <polyline
            points="0,120 57,90 114,100 171,60 228,70 285,40 342,50 400,20 400,160 0,160"
            fill="var(--blora-color-action-primary-default)"
            fill-opacity="0.08"
          />
        </svg>
      </div>
    </div>
  `,
};
