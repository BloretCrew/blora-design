import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createPopconfirmController } from "../src/components/popconfirm";

const meta = {
  title: "Feedback/Popconfirm",
  component: ".blora-popconfirm",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createPopconfirmController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-popconfirm" ${ref(init)} style="display:inline-block;position:relative;">
      <button
        type="button"
        class="blora-button"
        data-variant="danger"
        data-blora-popconfirm-trigger
      >
        删除
      </button>
      <div
        class="blora-popconfirm__panel"
        style="position:absolute;top:calc(100% + 8px);left:0;z-index:10;padding:var(--blora-space-3);background:var(--blora-color-surface-default);border:1px solid var(--blora-color-border-subtle);border-radius:var(--blora-radius-md);box-shadow:var(--blora-shadow-3);display:none;min-width:12rem;"
      >
        <p style="margin:0 0 0.75rem;font-size:var(--blora-text-sm);">确认删除此项？</p>
        <div style="display:flex;gap:0.5rem;justify-content:flex-end;">
          <button
            type="button"
            class="blora-button"
            data-size="sm"
            data-variant="ghost"
            data-cancel
          >
            取消
          </button>
          <button
            type="button"
            class="blora-button"
            data-size="sm"
            data-variant="danger"
            data-confirm
          >
            确定
          </button>
        </div>
      </div>
    </div>
    <style>
      .blora-popconfirm[data-open] .blora-popconfirm__panel,
      .blora-popconfirm.is-open .blora-popconfirm__panel {
        display: block !important;
      }
    </style>
  `,
};
