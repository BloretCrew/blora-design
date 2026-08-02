import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createCollapseController } from "../src/components/collapse";

const meta = {
  title: "Data/Collapse",
  component: ".blora-collapse",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createCollapseController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-collapse" ${ref(init)} style="max-width: 28rem;">
      <div class="blora-collapse__item" data-open>
        <button class="blora-collapse__head" type="button">
          <span>什么是 Blora Design？</span>
          <span class="blora-collapse__icon">▸</span>
        </button>
        <div class="blora-collapse__body">
          <div class="blora-collapse__content">
            一套基于 Web 标准的令牌驱动 UI 设计系统。
          </div>
        </div>
      </div>
      <div class="blora-collapse__item">
        <button class="blora-collapse__head" type="button">
          <span>如何安装？</span>
          <span class="blora-collapse__icon">▸</span>
        </button>
        <div class="blora-collapse__body">
          <div class="blora-collapse__content">
            <code class="blora-code">pnpm add @bloret-crew/blora-design</code>
          </div>
        </div>
      </div>
      <div class="blora-collapse__item">
        <button class="blora-collapse__head" type="button">
          <span>支持哪些浏览器？</span>
          <span class="blora-collapse__icon">▸</span>
        </button>
        <div class="blora-collapse__body">
          <div class="blora-collapse__content">现代 Chromium / Firefox / Safari。</div>
        </div>
      </div>
    </div>
  `,
};

/* Accordion is a separate component — do not nest under Collapse stories. */
