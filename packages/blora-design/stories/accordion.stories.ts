import type { Meta, StoryObj } from "@storybook/web-components";
import { html, svg } from "lit";

const meta = {
  title: "Data/Accordion",
  component: ".blora-accordion",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const chevron = svg`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;

function toggleAccordion(e: Event): void {
  const head = (e.target as HTMLElement).closest(".blora-accordion__head");
  if (!head) return;
  const root = head.closest(".blora-accordion");
  const item = head.closest(".blora-accordion__item");
  if (!root || !item) return;

  const wasOpen = item.hasAttribute("data-open");
  const body = item.querySelector<HTMLElement>(".blora-accordion__body");

  // Simultaneously: close others and toggle current
  root.querySelectorAll(".blora-accordion__item").forEach((el) => {
    const elBody = el.querySelector<HTMLElement>(".blora-accordion__body");
    if (!elBody) return;

    if (el === item) {
      // Toggle current
      if (wasOpen) {
        // Collapse current: lock height then animate to 0
        elBody.style.maxHeight = `${elBody.scrollHeight}px`;
        void elBody.offsetHeight;
        el.removeAttribute("data-open");
        elBody.style.maxHeight = "0px";
      } else {
        // Expand current: from 0 to content height
        el.setAttribute("data-open", "");
        elBody.style.maxHeight = "0px";
        void elBody.offsetHeight;
        elBody.style.maxHeight = `${elBody.scrollHeight}px`;
        // Release after transition
        const onEnd = (ev: TransitionEvent) => {
          if (ev.propertyName !== "max-height") return;
          if (el.hasAttribute("data-open")) elBody.style.maxHeight = "none";
          elBody.removeEventListener("transitionend", onEnd);
        };
        elBody.addEventListener("transitionend", onEnd);
      }
    } else {
      // Close others simultaneously
      if (!el.hasAttribute("data-open")) return;
      elBody.style.maxHeight = `${elBody.scrollHeight}px`;
      void elBody.offsetHeight;
      el.removeAttribute("data-open");
      elBody.style.maxHeight = "0px";
    }
  });
}

export const Default: Story = {
  render: () => html`
    <div class="blora-accordion" style="max-width: 24rem;" @click=${toggleAccordion}>
      <div class="blora-accordion__item" data-open>
        <div class="blora-accordion__head">
          <span>什么是响应式布局？</span>
          <span class="blora-accordion__icon">${chevron}</span>
        </div>
        <div class="blora-accordion__body" style="max-height: none;">
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
            Grid 是二维布局模型，同时控制行和列。适用于复杂页面分区和仪表盘等场景。
          </div>
        </div>
      </div>
    </div>
  `,
};
