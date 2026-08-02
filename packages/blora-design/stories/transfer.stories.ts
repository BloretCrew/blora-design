import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createTransferController } from "../src/components/transfer";

const meta = {
  title: "Forms/Transfer",
  component: ".blora-transfer",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createTransferController(el);
};

const row = (name: string, checked = false) =>
  html` <label class="blora-transfer__row">
    <input type="checkbox" ?checked=${checked} />
    <span class="blora-transfer__check"></span>
    <span>${name}</span>
  </label>`;

export const Default: Story = {
  render: () => html`
    <div class="blora-transfer" ${ref(init)}>
      <div class="blora-transfer__panel">
        <div class="blora-transfer__head">候选 · 5</div>
        <div class="blora-transfer__list">
          ${row("张三")}${row("李四", true)}${row("王五")}${row("赵六")}${row("钱七")}
        </div>
      </div>
      <div class="blora-transfer__actions">
        <button
          class="blora-button"
          data-variant="outline"
          data-size="icon"
          type="button"
          data-transfer="right"
          aria-label="右移"
        >
          ›
        </button>
        <button
          class="blora-button"
          data-variant="outline"
          data-size="icon"
          type="button"
          data-transfer="left"
          aria-label="左移"
        >
          ‹
        </button>
      </div>
      <div class="blora-transfer__panel">
        <div class="blora-transfer__head">已选 · 1</div>
        <div class="blora-transfer__list">${row("李四", true)}</div>
      </div>
    </div>
  `,
};
