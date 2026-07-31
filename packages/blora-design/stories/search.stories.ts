import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createSearchController } from "../src/components/search";

const meta = {
  title: "Forms/Search",
  component: ".blora-search",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const initSearch = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createSearchController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-search" style="max-width: 20rem;" ${ref(initSearch)}>
      <button class="blora-search__icon" type="button" aria-label="搜索">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.34-4.34" />
        </svg>
      </button>
      <input class="blora-input" type="search" placeholder="搜索项目、用户…" />
      <button class="blora-search__clear" type="button" aria-label="清除" hidden>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  `,
};
