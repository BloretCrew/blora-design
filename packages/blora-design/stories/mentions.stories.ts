import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Mentions",
  component: ".blora-mentions",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-mentions" style="position: relative; max-width: 24rem;">
      <textarea class="blora-textarea" placeholder="输入 @ 提及用户..." style="min-height: 80px;">
@Rh</textarea>
      <div
        class="blora-mentions__dropdown"
        data-open
        style="position: absolute; top: 100%; inset-inline-start: 0; margin-top: 4px; background: var(--blora-color-surface-default); border: var(--blora-border-subtle); border-radius: var(--blora-radius-md); box-shadow: var(--blora-shadow-3); z-index: var(--blora-z-dropdown); min-width: 200px; padding: var(--blora-space-1);"
      >
        <div
          class="blora-mentions__item"
          data-active
          style="display: flex; align-items: center; gap: var(--blora-space-2); padding: 0.5em 0.8em; border-radius: var(--blora-radius-sm); cursor: pointer; background: var(--blora-color-surface-raised);"
        >
          <span
            class="blora-avatar"
            data-size="xs"
            data-variant="primary"
            style="width: 1.5em; height: 1.5em; border-radius: 50%; background: var(--blora-color-action-primary-default); color: var(--blora-color-text-on-accent); display: grid; place-items: center; font-size: var(--blora-text-xs);"
            >R</span
          >
          <span class="blora-text-sm">Rhedar</span>
        </div>
        <div
          class="blora-mentions__item"
          style="display: flex; align-items: center; gap: var(--blora-space-2); padding: 0.5em 0.8em; border-radius: var(--blora-radius-sm); cursor: pointer;"
        >
          <span
            class="blora-avatar"
            data-size="xs"
            data-variant="info"
            style="width: 1.5em; height: 1.5em; border-radius: 50%; background: var(--blora-color-status-info); color: var(--blora-color-text-on-accent); display: grid; place-items: center; font-size: var(--blora-text-xs);"
            >A</span
          >
          <span class="blora-text-sm">Alice</span>
        </div>
        <div
          class="blora-mentions__item"
          style="display: flex; align-items: center; gap: var(--blora-space-2); padding: 0.5em 0.8em; border-radius: var(--blora-radius-sm); cursor: pointer;"
        >
          <span
            class="blora-avatar"
            data-size="xs"
            data-variant="success"
            style="width: 1.5em; height: 1.5em; border-radius: 50%; background: var(--blora-color-status-success); color: var(--blora-color-text-on-accent); display: grid; place-items: center; font-size: var(--blora-text-xs);"
            >B</span
          >
          <span class="blora-text-sm">Bob</span>
        </div>
      </div>
    </div>
  `,
};
