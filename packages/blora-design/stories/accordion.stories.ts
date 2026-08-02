import type { Meta, StoryObj } from "@storybook/web-components";
import { html, svg } from "lit";
import { ref } from "lit/directives/ref.js";
import { createAccordionController } from "../src/components/accordion";

const meta = {
  title: "Data/Accordion",
  component: ".blora-accordion",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const chevron = svg`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy?.();
  (el as any).__ctrl = createAccordionController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-accordion" style="max-width: 24rem;" ${ref(init)}>
      <div class="blora-accordion__item" data-open>
        <div class="blora-accordion__head">
          <span>什么是响应式布局？</span>
          <span class="blora-accordion__icon">${chevron}</span>
        </div>
        <div class="blora-accordion__body">
          <div class="blora-accordion__content">
            响应式布局是指页面能根据设备屏幕尺寸自动调整布局。通过 CSS Flexbox 和 Grid 实现适配。
          </div>
        </div>
      </div>
      <div class="blora-accordion__item">
        <div class="blora-accordion__head">
          <span>什么是 Flexbox？</span>
          <span class="blora-accordion__icon">${chevron}</span>
        </div>
        <div class="blora-accordion__body">
          <div class="blora-accordion__content">
            Flexbox 是一维布局模型，适用于行或列方向的排列。通过 display:flex
            启用，提供对齐与分布能力。
          </div>
        </div>
      </div>
      <div class="blora-accordion__item">
        <div class="blora-accordion__head">
          <span>什么是 Grid 布局？</span>
          <span class="blora-accordion__icon">${chevron}</span>
        </div>
        <div class="blora-accordion__body">
          <div class="blora-accordion__content">
            Grid 是二维布局模型，同时控制行和列。适用于复杂页面分区和仪表盘等场景。任意长度内容都会按真实高度展开，没有固定上限。
          </div>
        </div>
      </div>
    </div>
  `,
};
