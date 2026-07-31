import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Affix",
  component: ".blora-affix",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div
      style="height: 200px; overflow-y: auto; border: var(--blora-border-subtle); border-radius: var(--blora-radius-md); position: relative;"
    >
      <div style="padding: var(--blora-space-4); height: 600px;">
        <p class="blora-text-sm blora-text-muted">滚动此区域查看固钉效果。</p>
        <div
          class="blora-affix"
          style="position: sticky; top: 0; background: var(--blora-color-surface-default); border: var(--blora-border-subtle); border-radius: var(--blora-radius-md); padding: var(--blora-space-3); margin: var(--blora-space-4) 0; box-shadow: var(--blora-shadow-2); z-index: var(--blora-z-sticky);"
        >
          <span class="blora-text-sm" style="font-weight: 500;">固钉栏 · 滚动时保持顶部固定</span>
        </div>
        <p class="blora-text-sm blora-text-muted">下方还有很多内容...</p>
      </div>
    </div>
  `,
};
