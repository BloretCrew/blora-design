import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createPaginationController } from "../src/components/pagination";

const meta = {
  title: "Navigation/Pagination",
  component: ".blora-pagination",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createPaginationController(el);
};

export const Default: Story = {
  render: () => html`
    <nav class="blora-pagination" aria-label="分页" ${ref(init)}>
      <button class="blora-pagination__item blora-pagination__nav" type="button" aria-label="上一页">
        <span aria-hidden="true">‹</span>
      </button>
      <button class="blora-pagination__item" type="button" aria-current="page">1</button>
      <button class="blora-pagination__item" type="button">2</button>
      <button class="blora-pagination__item" type="button">3</button>
      <button class="blora-pagination__item" type="button">4</button>
      <button class="blora-pagination__item" type="button">5</button>
      <button class="blora-pagination__item blora-pagination__nav" type="button" aria-label="下一页">
        <span aria-hidden="true">›</span>
      </button>
    </nav>
  `,
};
