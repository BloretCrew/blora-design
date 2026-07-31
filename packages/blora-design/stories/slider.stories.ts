import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createSliderController } from "../src/components/slider";

const meta = {
  title: "Forms/Slider",
  component: ".blora-slider",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createSliderController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-slider" ${ref(init)}>
      <input class="blora-slider__input" type="range" min="0" max="100" value="42" />
      <span class="blora-slider__value">42</span>
    </div>
  `,
};
