import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createCommandPaletteController } from "../src/components/command-palette";
import { createSearchController } from "../src/components/search";

const meta = {
  title: "Navigation/Command Palette",
  component: ".blora-command",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__search?.destroy();
  (el as any).__ctrl = createCommandPaletteController(el);
  const search = el.querySelector<HTMLElement>(".blora-search");
  if (search) (el as any).__search = createSearchController(search);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-command" ${ref(init)}>
      <div class="blora-command__search">
        <div class="blora-search">
          <span class="blora-search__icon" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </span>
          <input class="blora-input" type="search" placeholder="输入命令或搜索..." />
          <button class="blora-search__clear" type="button" aria-label="清除" hidden>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div class="blora-cmdk-results blora-command__results">
        <div class="blora-cmdk-item blora-command__item" data-active>
          <span
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" /></svg
          ></span>
          <span class="blora-text-sm">新建文档</span>
          <kbd class="blora-command__kbd" data-keys="⌘N">⌘N</kbd>
        </div>
        <div class="blora-cmdk-item blora-command__item">
          <span
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
              /></svg
          ></span>
          <span class="blora-text-sm">打开文件</span>
          <kbd class="blora-command__kbd" data-keys="⌘O">⌘O</kbd>
        </div>
        <div class="blora-cmdk-item blora-command__item">
          <span
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2" /></svg
          ></span>
          <span class="blora-text-sm">设置</span>
          <kbd class="blora-command__kbd" data-keys="⌘,">⌘,</kbd>
        </div>
        <div class="blora-cmdk-item blora-command__item">
          <span
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" /></svg
          ></span>
          <span class="blora-text-sm">全局搜索</span>
          <kbd class="blora-command__kbd" data-keys="⌘K">⌘K</kbd>
        </div>
      </div>
    </div>
  `,
};
