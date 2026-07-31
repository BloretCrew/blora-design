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
    <div class="blora-comment" style="max-width: 480px;">
      <span
        class="blora-avatar blora-avatar--sm blora-avatar--primary"
        style="width:2.5em;height:2.5em;border-radius:50%;background:var(--blora-color-action-primary-default);color:var(--blora-color-text-on-accent);display:grid;place-items:center;font-weight:600;flex:none;"
        >R</span
      >
      <div class="blora-comment__main">
        <div class="blora-comment__head">
          <span class="blora-comment__author">Rhedar</span>
          <span class="blora-comment__time">2 小时前</span>
        </div>
        <div class="blora-comment__body">
          这个组件库的设计非常统一，token 系统让主题切换变得很方便。
        </div>
        <div class="blora-comment__actions">
          <button type="button">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 17l-5-5 5-5" />
              <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
            </svg>
            回复
          </button>
          <button type="button">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M7 10v12" />
              <path
                d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L14 2a3.13 3.13 0 0 1 3 3.88Z"
              />
            </svg>
            12
          </button>
        </div>
      </div>
    </div>
  `,
};
