import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Color Picker",
  component: ".blora-color-picker",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const colors = [
  "#9F5964",
  "#3D3E50",
  "#5B8C5A",
  "#D49B3B",
  "#4A7C9B",
  "#8B5CF6",
  "#EC4899",
  "#1E293B",
];

export const Default: Story = {
  render: () => html`
    <div class="blora-color-picker">
      <button
        class="blora-color-swatch"
        style="background: #9F5964; width: 2.5em; height: 2.5em; border-radius: var(--blora-radius-md); border: 1px solid var(--blora-color-border-subtle); cursor: pointer;"
        type="button"
        aria-label="选择颜色"
      ></button>
      <div
        class="blora-color-panel"
        data-open
        style="position: absolute; top: calc(100% + 6px); left: 0; display: flex; flex-wrap: wrap; gap: 6px; padding: 12px; background: var(--blora-color-surface-default); border: var(--blora-border-subtle); border-radius: var(--blora-radius-md); box-shadow: var(--blora-shadow-3); width: 200px; z-index: var(--blora-z-dropdown);"
      >
        ${colors.map((c) => html`<button class="blora-color-swatch" style="background: ${c}; width: 28px; height: 28px; border-radius: var(--blora-radius-sm); border: 1px solid var(--blora-color-border-subtle); cursor: pointer;" type="button"></button>`)}
        <div
          style="width: 100%; height: 1px; background: var(--blora-color-border-subtle); margin: 4px 0;"
        ></div>
        <input
          class="blora-input"
          type="text"
          value="#9F5964"
          style="width: 100%; font-family: var(--blora-font-mono);"
        />
      </div>
    </div>
  `,
};
