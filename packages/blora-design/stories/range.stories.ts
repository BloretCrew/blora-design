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
    <div style="display:grid;gap:var(--blora-space-8);padding: 0 1rem 2.5rem;">
      <div>
        <p class="blora-hint" style="margin:0 0 0.75rem;">默认 · 拖动显示 tooltip</p>
        <div class="blora-range" data-min="0" data-max="100" ${ref(init)}>
          <div class="blora-range__track"><div class="blora-range__fill"></div></div>
          <div class="blora-range__thumb" data-val="20" tabindex="0"></div>
          <div class="blora-range__thumb" data-val="75" tabindex="0"></div>
          <span class="blora-range__value">20 – 75</span>
        </div>
      </div>
      <div>
        <p class="blora-hint" style="margin:0 0 0.75rem;">data-tooltip="false" 关闭</p>
        <div
          class="blora-range"
          data-min="0"
          data-max="100"
          data-tooltip="false"
          ${ref((el) => {
            if (!(el instanceof HTMLElement)) return;
            (el as any).__ctrl?.destroy();
            (el as any).__ctrl = createRangeController(el);
          })}
        >
          <div class="blora-range__track"><div class="blora-range__fill"></div></div>
          <div class="blora-range__thumb" data-val="10" tabindex="0"></div>
          <div class="blora-range__thumb" data-val="90" tabindex="0"></div>
          <span class="blora-range__value">10 – 90</span>
        </div>
      </div>
    </div>
  `,
};
