import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Empty",
  component: ".blora-empty",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-empty">
      <div class="blora-empty__icon">
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
        >
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
          <path
            d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
          />
        </svg>
      </div>
      <div class="blora-empty__title">暂无数据</div>
      <div class="blora-empty__desc">列表为空，可创建一个新项开始。</div>
      <button class="blora-button" type="button" data-variant="primary" data-size="sm">
        创建项目
      </button>
    </div>
  `,
};
