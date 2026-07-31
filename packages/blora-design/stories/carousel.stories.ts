import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Carousel",
  component: ".blora-carousel",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div
      class="blora-carousel"
      style="position: relative; width: 100%; max-width: 480px; overflow: hidden; border-radius: var(--blora-radius-lg);"
    >
      <div class="blora-carousel__track">
        <div
          class="blora-carousel__slide"
          style="min-height: 200px; display: grid; place-items: center; color: white; font-size: 1.5rem; background: linear-gradient(135deg, var(--blora-color-action-primary-default), color-mix(in srgb, var(--blora-color-action-primary-default) 60%, white));"
        >
          Slide 1
        </div>
      </div>
      <button class="blora-carousel__arrow" type="button" aria-label="上一张">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button class="blora-carousel__arrow" type="button" aria-label="下一张">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
      <div class="blora-carousel__dots">
        <span class="blora-carousel__dot" data-active></span>
        <span class="blora-carousel__dot"></span>
        <span class="blora-carousel__dot"></span>
      </div>
    </div>
  `,
};
