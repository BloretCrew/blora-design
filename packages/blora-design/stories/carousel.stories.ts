import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createCarouselController } from "../src/components/carousel";

const meta = {
  title: "Data/Carousel",
  component: ".blora-carousel",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createCarouselController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-carousel" ${ref(init)}>
      <div class="blora-carousel__track">
        <div class="blora-carousel__slide">
          <div
            style="height: 240px; display: grid; place-items: center; background: var(--blora-color-surface-sunken); border-radius: var(--blora-radius-md); font-family: var(--blora-font-display); font-size: 2rem; color: var(--blora-color-text-emphasis);"
          >
            项目概览
          </div>
        </div>
        <div class="blora-carousel__slide">
          <div
            style="height: 240px; display: grid; place-items: center; background: var(--blora-color-action-primary-default); color: var(--blora-color-text-on-accent); border-radius: var(--blora-radius-md); font-family: var(--blora-font-display); font-size: 2rem;"
          >
            数据展示
          </div>
        </div>
        <div class="blora-carousel__slide">
          <div
            style="height: 240px; display: grid; place-items: center; background: var(--blora-color-status-info); color: var(--blora-color-text-on-accent); border-radius: var(--blora-radius-md); font-family: var(--blora-font-display); font-size: 2rem;"
          >
            图表分析
          </div>
        </div>
      </div>
      <button class="blora-carousel__arrow blora-carousel__arrow--prev" type="button" aria-label="上一张">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button class="blora-carousel__arrow blora-carousel__arrow--next" type="button" aria-label="下一张">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <div class="blora-carousel__dots">
        <span class="blora-carousel__dot" data-active></span>
        <span class="blora-carousel__dot"></span>
        <span class="blora-carousel__dot"></span>
      </div>
    </div>
  `,
};

export const Autoplay: Story = {
  render: () => html`
    <div class="blora-carousel" data-autoplay ${ref(init)}>
      <div class="blora-carousel__track">
        <div class="blora-carousel__slide">
          <div style="height: 240px; display: grid; place-items: center; background: var(--blora-color-surface-sunken); border-radius: var(--blora-radius-md); font-family: var(--blora-font-display); font-size: 2rem;">幻灯片 A</div>
        </div>
        <div class="blora-carousel__slide">
          <div style="height: 240px; display: grid; place-items: center; background: var(--blora-color-action-primary-default); color: var(--blora-color-text-on-accent); border-radius: var(--blora-radius-md); font-family: var(--blora-font-display); font-size: 2rem;">幻灯片 B</div>
        </div>
        <div class="blora-carousel__slide">
          <div style="height: 240px; display: grid; place-items: center; background: var(--blora-color-status-success); color: var(--blora-color-text-on-accent); border-radius: var(--blora-radius-md); font-family: var(--blora-font-display); font-size: 2rem;">幻灯片 C</div>
        </div>
      </div>
      <button class="blora-carousel__arrow blora-carousel__arrow--prev" type="button" aria-label="上一张"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
      <button class="blora-carousel__arrow blora-carousel__arrow--next" type="button" aria-label="下一张"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
      <div class="blora-carousel__dots">
        <span class="blora-carousel__dot" data-active></span>
        <span class="blora-carousel__dot"></span>
        <span class="blora-carousel__dot"></span>
      </div>
    </div>
  `,
};
