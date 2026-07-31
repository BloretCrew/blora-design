import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Splitter",
  component: ".blora-splitter",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div
      class="blora-splitter"
      style="display: flex; height: 200px; border: var(--blora-border-subtle); border-radius: var(--blora-radius-md); overflow: hidden;"
    >
      <div
        class="blora-splitter__panel"
        style="flex: 1; padding: var(--blora-space-4); overflow: auto;"
      >
        <p class="blora-text-sm blora-text-muted">左侧面板内容</p>
      </div>
      <div
        class="blora-splitter__bar"
        style="width: 6px; background: var(--blora-color-surface-sunken); cursor: col-resize; display: flex; align-items: center; justify-content: center;"
      >
        <div
          style="width: 2px; height: 24px; background: var(--blora-color-text-subtle); border-radius: 1px;"
        ></div>
      </div>
      <div
        class="blora-splitter__panel"
        style="flex: 1; padding: var(--blora-space-4); overflow: auto;"
      >
        <p class="blora-text-sm blora-text-muted">右侧面板内容</p>
      </div>
    </div>
  `,
};
