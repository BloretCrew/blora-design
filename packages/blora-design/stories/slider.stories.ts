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
    <div style="display:grid;gap:var(--blora-space-6);padding:2rem 1rem 1rem;">
      <div>
        <p class="blora-hint" style="margin:0 0 0.5rem;">默认 · 拖动显示 tooltip（data-tooltip）</p>
        <div class="blora-slider" data-tooltip ${ref(init)}>
          <input class="blora-slider__input" type="range" min="0" max="100" value="42" />
          <span class="blora-slider__value">42</span>
        </div>
      </div>
      <div>
        <p class="blora-hint" style="margin:0 0 0.5rem;">关闭 tooltip</p>
        <div
          class="blora-slider"
          ${ref((el) => {
            if (!(el instanceof HTMLElement)) return;
            (el as any).__ctrl?.destroy();
            (el as any).__ctrl = createSliderController(el);
          })}
        >
          <input class="blora-slider__input" type="range" min="0" max="100" value="60" />
          <span class="blora-slider__value">60</span>
        </div>
      </div>
    </div>
  `,
};
