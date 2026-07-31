import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Mockup",
  component: ".blora-mockup",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Browser: Story = {
  render: () => html`
    <div class="blora-mockup blora-mockup--browser" style="max-width: 480px;">
      <div
        class="blora-mockup__bar"
        style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: var(--blora-color-surface-sunken); border-radius: var(--blora-radius-lg) var(--blora-radius-lg) 0 0;"
      >
        <span style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f57;"></span>
        <span style="width: 10px; height: 10px; border-radius: 50%; background: #febc2e;"></span>
        <span style="width: 10px; height: 10px; border-radius: 50%; background: #28c840;"></span>
        <div
          style="flex: 1; margin-inline-start: 8px; padding: 2px 8px; background: var(--blora-color-surface-default); border-radius: var(--blora-radius-sm); font-size: var(--blora-text-xs); color: var(--blora-color-text-subtle);"
        >
          https://bloret.design
        </div>
      </div>
      <div
        class="blora-mockup__display"
        style="padding: var(--blora-space-5); background: var(--blora-color-surface-default); border: var(--blora-border-subtle); border-top: none; border-radius: 0 0 var(--blora-radius-lg) var(--blora-radius-lg); min-height: 120px;"
      >
        <p class="blora-text-sm blora-text-muted">浏览器窗口内容区域</p>
      </div>
    </div>
  `,
};

export const Phone: Story = {
  render: () => html`
    <div
      class="blora-mockup blora-mockup--phone"
      style="width: 200px; padding: 12px; background: var(--blora-color-surface-sunken); border-radius: 28px; box-shadow: var(--blora-shadow-4);"
    >
      <div
        style="width: 60px; height: 6px; background: var(--blora-color-text-primary); border-radius: 3px; margin: 0 auto 12px; opacity: 0.3;"
      ></div>
      <div
        class="blora-mockup__display"
        style="background: var(--blora-color-surface-default); border-radius: 16px; min-height: 320px; padding: var(--blora-space-3);"
      >
        <p class="blora-text-sm blora-text-muted">手机屏幕内容</p>
      </div>
    </div>
  `,
};
