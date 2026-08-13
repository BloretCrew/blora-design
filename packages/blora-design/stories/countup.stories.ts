import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createCountUpController } from "../../../addons/effects/src/index";

const meta = {
  title: "Data display/CountUp",
  component: "[data-blora-countup]",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createCountUpController(el);
};

export const Default: Story = {
  render: () => html`
    <div
      style="display:flex;gap:2rem;font-family:var(--blora-font-mono);font-size:var(--blora-text-2xl);"
    >
      <span data-blora-countup="1280" data-duration="1200" ${ref(init)}>0</span>
      <span data-blora-countup="99.5" data-decimals="1" data-suffix="%" ${ref(init)}>0</span>
    </div>
  `,
};
