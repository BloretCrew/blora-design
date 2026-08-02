import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createDeckController } from "../src/components/deck";

const meta = {
  title: "Layout/Deck",
  component: ".blora-deck",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createDeckController(el);
};

export const Default: Story = {
  render: () => html`
    <div style="display: flex; justify-content: center; padding: var(--blora-space-6);">
      <div
        class="blora-deck"
        tabindex="0"
        aria-label="卡片叠层"
        style="width: 280px; height: 320px;"
        ${ref(init)}
      >
        <article
          class="blora-card"
          data-variant="flat"
          style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: var(--blora-space-2); padding: var(--blora-space-5);"
        >
          <strong>设计评审</strong>
          <p class="blora-text-muted" style="margin: 0;">队列预览 · 第 1 张</p>
        </article>
        <article
          class="blora-card"
          data-variant="flat"
          style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: var(--blora-space-2); padding: var(--blora-space-5);"
        >
          <strong>接口联调</strong>
          <p class="blora-text-muted" style="margin: 0;">待办卡片 · 第 2 张</p>
        </article>
        <article
          class="blora-card"
          style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: var(--blora-space-2); padding: var(--blora-space-5);"
        >
          <strong>当前卡片</strong>
          <p class="blora-text-muted" style="margin: 0;">相册 / 队列预览 · 第 3 张</p>
        </article>
        <article
          class="blora-card"
          data-variant="flat"
          style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: var(--blora-space-2); padding: var(--blora-space-5);"
        >
          <strong>上线检查</strong>
          <p class="blora-text-muted" style="margin: 0;">发布清单 · 第 4 张</p>
        </article>
      </div>
    </div>
  `,
};
