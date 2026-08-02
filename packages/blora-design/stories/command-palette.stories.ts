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
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <!-- lucide settings gear (not incomplete sun rays) -->
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
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
