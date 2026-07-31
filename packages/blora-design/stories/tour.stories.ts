import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Feedback/Tour",
  component: ".blora-tour",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div
      class="blora-tour__card"
      style="max-width: 320px; padding: var(--blora-space-4); background: var(--blora-color-surface-default); border: var(--blora-border-subtle); border-radius: var(--blora-radius-lg); box-shadow: var(--blora-shadow-4); position: relative; z-index: var(--blora-z-modal);"
    >
      <div
        class="blora-tour__title"
        style="font-weight: 600; font-size: var(--blora-text-base); margin-bottom: var(--blora-space-2);"
      >
        功能引导
      </div>
      <div
        class="blora-tour__desc"
        style="font-size: var(--blora-text-sm); color: var(--blora-color-text-muted); margin-bottom: var(--blora-space-4);"
      >
        这是导航栏，你可以在这里切换页面、搜索内容或查看通知。
      </div>
      <div
        class="blora-tour__actions"
        style="display: flex; justify-content: space-between; align-items: center;"
      >
        <span class="blora-text-xs blora-text-subtle">2 / 4</span>
        <div style="display: flex; gap: var(--blora-space-2);">
          <button class="blora-button" data-variant="outline" data-size="sm" type="button">
            上一步
          </button>
          <button class="blora-button" data-variant="primary" data-size="sm" type="button">
            下一步
          </button>
        </div>
      </div>
    </div>
  `,
};
