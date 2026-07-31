import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Pagination",
  component: ".blora-pagination",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <nav class="blora-pagination" aria-label="分页">
      <button class="blora-pagination__item blora-pagination__nav" disabled aria-label="上一页">
        ‹
      </button>
      <button class="blora-pagination__item" aria-current="page">1</button>
      <button class="blora-pagination__item">2</button>
      <button class="blora-pagination__item">3</button>
      <button class="blora-pagination__item">4</button>
      <button class="blora-pagination__item">5</button>
      <span class="blora-pagination__ellipsis">…</span>
      <button class="blora-pagination__item">12</button>
      <button class="blora-pagination__item blora-pagination__nav" aria-label="下一页">›</button>
    </nav>
  `,
};
