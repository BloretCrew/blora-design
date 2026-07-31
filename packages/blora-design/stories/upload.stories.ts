import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Upload",
  component: ".blora-upload",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-upload">
      <div
        class="blora-dropzone"
        style="border: 2px dashed var(--blora-color-border-subtle); border-radius: var(--blora-radius-md); padding: var(--blora-space-8); text-align: center; cursor: pointer; transition: all var(--blora-duration-fast) var(--blora-easing-standard);"
      >
        <div
          class="blora-dropzone__icon"
          style="color: var(--blora-color-text-subtle); margin-bottom: var(--blora-space-2);"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 3v12" />
            <path d="m17 8-5-5-5 5" />
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          </svg>
        </div>
        <div class="blora-text-sm">
          <strong>拖拽文件至此</strong> 或
          <span style="color: var(--blora-color-action-primary-default);">点击选择</span>
        </div>
        <div class="blora-text-xs blora-text-subtle" style="margin-top: 4px;">
          支持 SVG / PNG / JPG · 单文件 ≤ 8MB
        </div>
      </div>
      <div class="blora-stack" style="margin-top: var(--blora-space-3);">
        <div
          class="blora-row"
          style="justify-content: space-between; align-items: center; padding: 0.5em 0.8em; background: var(--blora-color-surface-raised); border-radius: var(--blora-radius-sm);"
        >
          <span class="blora-text-sm" style="display:inline-flex;align-items:center;gap:0.4em;">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color:var(--blora-color-text-subtle);"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            report.pdf
          </span>
          <span class="blora-text-xs blora-text-muted">2.4 MB</span>
        </div>
        <div
          class="blora-row"
          style="justify-content: space-between; align-items: center; padding: 0.5em 0.8em; background: var(--blora-color-surface-raised); border-radius: var(--blora-radius-sm);"
        >
          <span class="blora-text-sm" style="display:inline-flex;align-items:center;gap:0.4em;">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color:var(--blora-color-text-subtle);"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L6 20" />
            </svg>
            photo.jpg
          </span>
          <span class="blora-text-xs blora-text-muted">856 KB</span>
        </div>
      </div>
    </div>
  `,
};
