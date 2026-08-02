import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createUploadController } from "../src/components/upload";

const meta = {
  title: "Forms/Upload",
  component: ".blora-upload",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createUploadController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-upload" ${ref(init)}>
      <div class="blora-dropzone">
        <div class="blora-dropzone__icon">
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
      <div class="blora-stack blora-upload__list" style="margin-top: var(--blora-space-3);"></div>
    </div>
  `,
};
