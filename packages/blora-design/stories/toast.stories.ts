import type { Meta, StoryObj } from "@storybook/web-components";
import { html, svg } from "lit";

const meta = {
  title: "Feedback/Toast",
  component: ".blora-toast",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Toast uses the notification card visual style.
// "Toast" is the *action* of showing a notification transiently
// (auto-dismiss, positioned in corner) — not a separate visual style.
const successIcon = svg`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
const warningIcon = svg`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>`;
const dangerIcon = svg`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
const infoIcon = svg`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;
const closeIcon = svg`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

export const Variants: Story = {
  render: () => html`
    <div class="blora-stack" style="max-width: 24rem;">
      <div class="blora-toast" data-variant="success">
        <span class="blora-toast__icon">${successIcon}</span>
        <div class="blora-toast__body">
          <div class="blora-toast__title">保存成功</div>
          <div class="blora-toast__desc">文档已保存至云端。</div>
        </div>
        <button class="blora-toast__close" aria-label="关闭">${closeIcon}</button>
      </div>
      <div class="blora-toast" data-variant="warning">
        <span class="blora-toast__icon">${warningIcon}</span>
        <div class="blora-toast__body">
          <div class="blora-toast__title">请注意</div>
          <div class="blora-toast__desc">磁盘空间不足，请及时清理。</div>
        </div>
        <button class="blora-toast__close" aria-label="关闭">${closeIcon}</button>
      </div>
      <div class="blora-toast" data-variant="danger">
        <span class="blora-toast__icon">${dangerIcon}</span>
        <div class="blora-toast__body">
          <div class="blora-toast__title">操作失败</div>
          <div class="blora-toast__desc">网络异常，请稍后重试。</div>
        </div>
        <button class="blora-toast__close" aria-label="关闭">${closeIcon}</button>
      </div>
      <div class="blora-toast" data-variant="info">
        <span class="blora-toast__icon">${infoIcon}</span>
        <div class="blora-toast__body">
          <div class="blora-toast__title">提示</div>
          <div class="blora-toast__desc">系统将于今晚 22:00 进行维护。</div>
        </div>
        <button class="blora-toast__close" aria-label="关闭">${closeIcon}</button>
      </div>
    </div>
  `,
};
