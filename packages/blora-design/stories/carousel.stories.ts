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
    <div class="blora-carousel" style="width: 100%; max-width: 480px;">
      <div class="blora-carousel__track">
        <div
          class="blora-carousel__slide"
          style="background: linear-gradient(135deg, #9F5964, #c47a8a); min-height: 200px; display: grid; place-items: center; color: white; font-size: 1.5rem;"
        >
          Slide 1
        </div>
      </div>
      <button
        class="blora-carousel__arrow"
        style="position: absolute; top: 50%; left: 12px; transform: translateY(-50%);"
        type="button"
        aria-label="上一张"
      >
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
      <button
        class="blora-carousel__arrow"
        style="position: absolute; top: 50%; right: 12px; transform: translateY(-50%);"
        type="button"
        aria-label="下一张"
      >
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
      <div
        class="blora-carousel__dots"
        style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px;"
      >
        <span
          class="blora-carousel__dot"
          data-active
          style="width: 8px; height: 8px; border-radius: 50%; background: white; cursor: pointer;"
        ></span>
        <span
          class="blora-carousel__dot"
          style="width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer;"
        ></span>
        <span
          class="blora-carousel__dot"
          style="width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer;"
        ></span>
      </div>
    </div>
  `,
};
