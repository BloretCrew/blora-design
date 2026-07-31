import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = { title: "Layout/Deck", component: ".blora-deck", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-deck" style="position: relative; width: 320px; height: 200px;">
      <div
        class="blora-deck__card"
        style="position: absolute; inset: 0; background: var(--blora-color-surface-raised); border: var(--blora-border-subtle); border-radius: var(--blora-radius-lg); box-shadow: var(--blora-shadow-2); transform: translateY(12px) scale(0.95); opacity: 0.5; z-index: 1;"
      ></div>
      <div
        class="blora-deck__card"
        style="position: absolute; inset: 0; background: var(--blora-color-surface-raised); border: var(--blora-border-subtle); border-radius: var(--blora-radius-lg); box-shadow: var(--blora-shadow-3); transform: translateY(6px) scale(0.98); opacity: 0.8; z-index: 2;"
      ></div>
      <div
        class="blora-deck__card"
        data-front
        style="position: absolute; inset: 0; background: var(--blora-color-surface-default); border: var(--blora-border-subtle); border-radius: var(--blora-radius-lg); box-shadow: var(--blora-shadow-4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--blora-space-2); z-index: 3;"
      >
        <div style="font-weight: 600; font-size: var(--blora-text-lg);">当前卡片</div>
        <div class="blora-text-sm blora-text-muted">3 / 3</div>
      </div>
    </div>
  `,
};
