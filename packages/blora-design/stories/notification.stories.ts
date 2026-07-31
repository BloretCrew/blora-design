import type { Meta, StoryObj } from "@storybook/web-components";
import { html, svg } from "lit";

const meta = {
  title: "Feedback/Notification",
  component: ".blora-notification",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const successIcon = svg`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
const warningIcon = svg`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>`;
const dangerIcon = svg`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
const infoIcon = svg`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;
const closeIcon = svg`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

export const Variants: Story = {
  render: () => html`
    <div class="blora-stack" style="max-width: 24rem;">
      <div class="blora-notification" data-variant="success">
        <span class="blora-notification__icon">${successIcon}</span>
        <div style="flex:1;">
          <div class="blora-notification__title">保存成功</div>
          <div class="blora-notification__desc">文档已保存至云端。</div>
        </div>
        <button class="blora-notification__close" aria-label="关闭">${closeIcon}</button>
      </div>
      <div class="blora-notification" data-variant="warning">
        <span class="blora-notification__icon">${warningIcon}</span>
        <div style="flex:1;">
          <div class="blora-notification__title">存储空间不足</div>
          <div class="blora-notification__desc">剩余空间不足 1GB，请及时清理。</div>
        </div>
        <button class="blora-notification__close" aria-label="关闭">${closeIcon}</button>
      </div>
      <div class="blora-notification" data-variant="danger">
        <span class="blora-notification__icon">${dangerIcon}</span>
        <div style="flex:1;">
          <div class="blora-notification__title">删除失败</div>
          <div class="blora-notification__desc">该项目存在关联数据，不可删除。</div>
        </div>
        <button class="blora-notification__close" aria-label="关闭">${closeIcon}</button>
      </div>
      <div class="blora-notification" data-variant="info">
        <span class="blora-notification__icon">${infoIcon}</span>
        <div style="flex:1;">
          <div class="blora-notification__title">系统通知</div>
          <div class="blora-notification__desc">scheduled maintenance</div>
        </div>
        <button class="blora-notification__close" aria-label="关闭">${closeIcon}</button>
      </div>
    </div>
  `,
};
