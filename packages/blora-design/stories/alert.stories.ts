import type { Meta, StoryObj } from "@storybook/web-components";
import { html, svg } from "lit";

const meta = {
  title: "Feedback/Alert",
  component: ".blora-alert",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

// SVG icons matching v1 showcase and result component (20x20 for alert context)
const infoIcon = svg`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;
const successIcon = svg`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
const warningIcon = svg`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>`;
const dangerIcon = svg`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
const closeIcon = svg`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

export const Variants: Story = {
  render: () => html`
    <div class="blora-stack">
      <div class="blora-alert" data-variant="info">
        <span class="blora-alert__icon">${infoIcon}</span>
        <div class="blora-alert__body">
          <div class="blora-alert__title">提示</div>
          <div class="blora-alert__desc">这是一条信息提示。</div>
        </div>
        <button class="blora-alert__close" aria-label="关闭">${closeIcon}</button>
      </div>
      <div class="blora-alert" data-variant="success">
        <span class="blora-alert__icon">${successIcon}</span>
        <div class="blora-alert__body">
          <div class="blora-alert__title">成功</div>
          <div class="blora-alert__desc">操作已完成。</div>
        </div>
      </div>
      <div class="blora-alert" data-variant="warning">
        <span class="blora-alert__icon">${warningIcon}</span>
        <div class="blora-alert__body">
          <div class="blora-alert__title">警告</div>
          <div class="blora-alert__desc">请注意潜在风险。</div>
        </div>
      </div>
      <div class="blora-alert" data-variant="danger">
        <span class="blora-alert__icon">${dangerIcon}</span>
        <div class="blora-alert__body">
          <div class="blora-alert__title">错误</div>
          <div class="blora-alert__desc">操作失败，请重试。</div>
        </div>
      </div>
    </div>
  `,
};
