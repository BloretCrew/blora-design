import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Speed Dial",
  component: ".blora-speed-dial",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const plusIcon = html`<svg
  viewBox="0 0 24 24"
  width="22"
  height="22"
  fill="none"
  stroke="currentColor"
  stroke-width="2.25"
  stroke-linecap="round"
>
  <path d="M12 5v14M5 12h14" />
</svg>`;
const closeIcon = html`<svg
  viewBox="0 0 24 24"
  width="22"
  height="22"
  fill="none"
  stroke="currentColor"
  stroke-width="2.25"
  stroke-linecap="round"
>
  <path d="M18 6 6 18M6 6l12 12" />
</svg>`;
const cameraIcon = html`<svg
  viewBox="0 0 24 24"
  width="18"
  height="18"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
  <circle cx="12" cy="13" r="4" />
</svg>`;
const galleryIcon = html`<svg
  viewBox="0 0 24 24"
  width="18"
  height="18"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect x="3" y="3" width="18" height="18" rx="2" />
  <circle cx="9" cy="9" r="2" />
  <path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L6 20" />
</svg>`;
const micIcon = html`<svg
  viewBox="0 0 24 24"
  width="18"
  height="18"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
  <path d="M12 19v4M8 23h8" />
</svg>`;
const editIcon = html`<svg
  viewBox="0 0 24 24"
  width="18"
  height="18"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M12 20h9" />
  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
</svg>`;
const copyIcon = html`<svg
  viewBox="0 0 24 24"
  width="18"
  height="18"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect x="9" y="9" width="13" height="13" rx="2" />
  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
</svg>`;
const trashIcon = html`<svg
  viewBox="0 0 24 24"
  width="18"
  height="18"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
</svg>`;

export const Vertical: Story = {
  render: () => html`
    <div style="display: flex; gap: 3rem; align-items: flex-end; padding: 2rem; min-height: 300px;">
      <div>
        <p class="blora-text-xs blora-text-subtle" style="margin-bottom: 1rem;">垂直 · 图标</p>
        <div class="blora-speed-dial" data-open>
          <button
            class="blora-button"
            data-variant="primary"
            class="blora-speed-dial__trigger"
            type="button"
            aria-label="新建"
          >
            ${plusIcon}
          </button>
          <div class="blora-speed-dial__actions">
            <button
              class="blora-button"
              data-variant="secondary"
              class="blora-speed-dial__action"
              type="button"
              aria-label="拍照"
            >
              ${cameraIcon}
            </button>
            <button
              class="blora-button"
              data-variant="secondary"
              class="blora-speed-dial__action"
              type="button"
              aria-label="图库"
            >
              ${galleryIcon}
            </button>
            <button
              class="blora-button"
              data-variant="secondary"
              class="blora-speed-dial__action"
              type="button"
              aria-label="语音"
            >
              ${micIcon}
            </button>
          </div>
        </div>
      </div>
      <div>
        <p class="blora-text-xs blora-text-subtle" style="margin-bottom: 1rem;">垂直 · 标签</p>
        <div class="blora-speed-dial" data-open>
          <button
            class="blora-button"
            data-variant="primary"
            class="blora-speed-dial__trigger"
            type="button"
            aria-label="快捷操作"
          >
            ${plusIcon}
          </button>
          <div class="blora-speed-dial__actions">
            <div class="blora-speed-dial__item">
              <span class="blora-speed-dial__label">编辑</span>
              <button
                class="blora-button"
                data-variant="secondary"
                class="blora-speed-dial__action"
                type="button"
                aria-label="编辑"
              >
                ${editIcon}
              </button>
            </div>
            <div class="blora-speed-dial__item">
              <span class="blora-speed-dial__label">复制</span>
              <button
                class="blora-button"
                data-variant="secondary"
                class="blora-speed-dial__action"
                type="button"
                aria-label="复制"
              >
                ${copyIcon}
              </button>
            </div>
            <div class="blora-speed-dial__item">
              <span class="blora-speed-dial__label">删除</span>
              <button
                class="blora-button"
                data-variant="danger"
                class="blora-speed-dial__action"
                type="button"
                aria-label="删除"
              >
                ${trashIcon}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p class="blora-text-xs blora-text-subtle" style="margin-bottom: 1rem;">关闭钮替换</p>
        <div class="blora-speed-dial" data-open>
          <button
            class="blora-button"
            data-variant="primary"
            class="blora-speed-dial__trigger"
            type="button"
            aria-label="快捷操作"
          >
            ${plusIcon}
          </button>
          <button
            class="blora-button"
            data-variant="danger"
            class="blora-speed-dial__close"
            type="button"
            aria-label="关闭"
          >
            ${closeIcon}
          </button>
          <div class="blora-speed-dial__actions">
            <div class="blora-speed-dial__item">
              <span class="blora-speed-dial__label">编辑</span>
              <button
                class="blora-button"
                data-variant="secondary"
                class="blora-speed-dial__action"
                type="button"
                aria-label="编辑"
              >
                ${editIcon}
              </button>
            </div>
            <div class="blora-speed-dial__item">
              <span class="blora-speed-dial__label">删除</span>
              <button
                class="blora-button"
                data-variant="danger"
                class="blora-speed-dial__action"
                type="button"
                aria-label="删除"
              >
                ${trashIcon}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p class="blora-text-xs blora-text-subtle" style="margin-bottom: 1rem;">水平 · 向左</p>
        <div class="blora-speed-dial blora-speed-dial--left" data-open>
          <button
            class="blora-button"
            data-variant="primary"
            class="blora-speed-dial__trigger"
            type="button"
            aria-label="快捷操作"
          >
            ${plusIcon}
          </button>
          <div class="blora-speed-dial__actions">
            <button
              class="blora-button"
              data-variant="secondary"
              class="blora-speed-dial__action"
              type="button"
              aria-label="拍照"
            >
              ${cameraIcon}
            </button>
            <button
              class="blora-button"
              data-variant="secondary"
              class="blora-speed-dial__action"
              type="button"
              aria-label="图库"
            >
              ${galleryIcon}
            </button>
            <button
              class="blora-button"
              data-variant="secondary"
              class="blora-speed-dial__action"
              type="button"
              aria-label="语音"
            >
              ${micIcon}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
};
