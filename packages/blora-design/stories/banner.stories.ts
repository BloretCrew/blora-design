import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Feedback/Banner",
  component: ".blora-banner",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-banner">
      <div class="blora-banner__body">
        <div class="blora-banner__title">新版本 · v2.0 发布</div>
        <div class="blora-banner__desc">带来更好的用户体验和更多功能，欢迎升级。</div>
      </div>
      <div class="blora-banner__actions">
        <button class="blora-button" type="button" data-variant="primary" data-size="sm">
          立即升级
        </button>
        <button class="blora-button" type="button" data-variant="outline" data-size="sm">
          详情
        </button>
      </div>
    </div>
  `,
};
