import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createCountdownController } from "../../../addons/effects/src/index";
import "../../../addons/effects/src/effects.css";

const meta = {
  title: "Data display/Countdown",
  component: ".blora-countdown",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createCountdownController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-countdown" data-blora-countdown data-seconds="3661" ${ref(init)}>
      <div class="blora-countdown__unit">
        <span class="blora-countdown__value" data-unit="days">0</span
        ><span class="blora-countdown__label">天</span>
      </div>
      <div class="blora-countdown__unit">
        <span class="blora-countdown__value" data-unit="hours">00</span
        ><span class="blora-countdown__label">时</span>
      </div>
      <div class="blora-countdown__unit">
        <span class="blora-countdown__value" data-unit="minutes">00</span
        ><span class="blora-countdown__label">分</span>
      </div>
      <div class="blora-countdown__unit">
        <span class="blora-countdown__value" data-unit="seconds">00</span
        ><span class="blora-countdown__label">秒</span>
      </div>
    </div>
  `,
};
