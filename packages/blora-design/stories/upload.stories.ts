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
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m17 8-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
        </div>
        <div class="blora-text-sm">点击或拖拽文件到此处上传</div>
        <div class="blora-text-xs blora-text-subtle" style="margin-top: 4px;">
          支持单个或批量文件
        </div>
      </div>
      <div class="blora-stack" style="margin-top: var(--blora-space-3);">
        <div
          class="blora-row"
          style="justify-content: space-between; align-items: center; padding: 0.5em 0.8em; background: var(--blora-color-surface-raised); border-radius: var(--blora-radius-sm);"
        >
          <span class="blora-text-sm">📄 report.pdf</span>
          <span class="blora-text-xs blora-text-muted">2.4 MB</span>
        </div>
        <div
          class="blora-row"
          style="justify-content: space-between; align-items: center; padding: 0.5em 0.8em; background: var(--blora-color-surface-raised); border-radius: var(--blora-radius-sm);"
        >
          <span class="blora-text-sm">🖼️ photo.jpg</span>
          <span class="blora-text-xs blora-text-muted">856 KB</span>
        </div>
      </div>
    </div>
  `,
};
