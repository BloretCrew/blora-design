import type { Meta, StoryObj } from "@storybook/web-components";
import { html, svg } from "lit";

const meta = {
  title: "Feedback/Result",
  component: ".blora-result",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const successIcon = svg`<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
const warningIcon = svg`<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>`;
const errorIcon = svg`<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
const infoIcon = svg`<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;

export const Variants: Story = {
  render: () => html`
    <div class="blora-grid blora-grid--4">
      <div class="blora-result" data-variant="success">
        <div class="blora-result__icon">${successIcon}</div>
        <div class="blora-result__title">操作成功</div>
        <div class="blora-result__desc">数据已保存</div>
      </div>
      <div class="blora-result" data-variant="warning">
        <div class="blora-result__icon">${warningIcon}</div>
        <div class="blora-result__title">注意</div>
        <div class="blora-result__desc">存在待处理项</div>
      </div>
      <div class="blora-result" data-variant="error">
        <div class="blora-result__icon">${errorIcon}</div>
        <div class="blora-result__title">加载失败</div>
        <div class="blora-result__desc">请稍后重试</div>
      </div>
      <div class="blora-result" data-variant="info">
        <div class="blora-result__icon">${infoIcon}</div>
        <div class="blora-result__title">提示</div>
        <div class="blora-result__desc">保存中…</div>
      </div>
    </div>
  `,
};
