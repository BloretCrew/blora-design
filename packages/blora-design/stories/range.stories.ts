import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createRangeController } from "../src/components/range";

const meta = {
  title: "Forms/Range",
  component: ".blora-range",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createRangeController(el);
};

export const Default: Story = {
  render: () => html`
    <div style="padding: 0 1rem 2.5rem;">
      <div class="blora-range" data-min="0" data-max="100" ${ref(init)}>
        <div class="blora-range__track"><div class="blora-range__fill"></div></div>
        <div class="blora-range__thumb" data-val="20"></div>
        <div class="blora-range__thumb" data-val="75"></div>
        <span class="blora-range__value">20 – 75</span>
      </div>
    </div>
  `,
};
