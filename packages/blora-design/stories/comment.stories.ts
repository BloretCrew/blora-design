import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Comment",
  component: ".blora-comment",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-comment" style="display: flex; gap: var(--blora-space-3); max-width: 480px;">
      <span
        style="width: 2.5em; height: 2.5em; border-radius: 50%; background: var(--blora-color-action-primary-default); color: var(--blora-color-text-on-accent); display: grid; place-items: center; font-weight: 600; flex: none;"
        >R</span
      >
      <div style="flex: 1; min-width: 0;">
        <div
          style="display: flex; align-items: center; gap: var(--blora-space-2); margin-bottom: 4px;"
        >
          <span class="blora-text-sm" style="font-weight: 600;">Rhedar</span>
          <span class="blora-text-xs blora-text-subtle">2 小时前</span>
        </div>
        <div class="blora-text-sm" style="margin-bottom: var(--blora-space-2);">
          这个组件库的设计非常统一，token 系统让主题切换变得很方便。
        </div>
        <div style="display: flex; gap: var(--blora-space-4);">
          <button class="blora-button" data-variant="ghost" data-size="sm" type="button">
            回复
          </button>
          <button class="blora-button" data-variant="ghost" data-size="sm" type="button">
            👍 12
          </button>
        </div>
      </div>
    </div>
  `,
};
