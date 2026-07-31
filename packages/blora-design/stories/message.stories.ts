import type { Meta, StoryObj } from "@storybook/web-components";
import { html, svg } from "lit";

const meta = {
  title: "Feedback/Message",
  component: ".blora-message",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const infoIcon = svg`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;
const successIcon = svg`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
const warningIcon = svg`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>`;
const dangerIcon = svg`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

export const Variants: Story = {
  render: () => html`
    <div class="blora-stack">
      <span class="blora-message" data-variant="info">
        <span class="blora-message__icon">${infoIcon}</span>这是一条提示消息
      </span>
      <span class="blora-message" data-variant="success">
        <span class="blora-message__icon">${successIcon}</span>操作已成功完成
      </span>
      <span class="blora-message" data-variant="warning">
        <span class="blora-message__icon">${warningIcon}</span>请关注重要提示
      </span>
      <span class="blora-message" data-variant="danger">
        <span class="blora-message__icon">${dangerIcon}</span>系统遇到了问题
      </span>
    </div>
  `,
};
