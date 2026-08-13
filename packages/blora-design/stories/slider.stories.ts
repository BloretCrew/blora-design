import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraSlider } from "../src/components/slider";

defineBloraSlider();

const meta = {
  title: "Data input/Slider",
  component: "blora-slider",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="display:grid;gap:var(--blora-space-6);padding:2rem 1rem 1rem;">
      <div>
        <p class="blora-hint" style="margin:0 0 0.5rem;">默认 · 拖动显示 tooltip（data-tooltip）</p>
        <blora-slider min="0" max="100" value="42" tooltip></blora-slider>
      </div>
      <div>
        <p class="blora-hint" style="margin:0 0 0.5rem;">关闭 tooltip</p>
        <blora-slider min="0" max="100" value="60"></blora-slider>
      </div>
    </div>
  `,
};
