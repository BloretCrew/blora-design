import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createRateController } from "../src/components/rate";

const meta = {
  title: "Forms/Rate",
  component: ".blora-rate",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createRateController(el);
};

const stars = (active: number) =>
  [0, 1, 2, 3, 4]
    .map((i) => `<span class="blora-rate__star"${i < active ? " data-active" : ""}>★</span>`)
    .join("");

export const Default: Story = {
  render: () => html`
    <div class="blora-rate" data-value="4" ${ref(init)}>
      <span class="blora-rate__star" data-active>★</span>
      <span class="blora-rate__star" data-active>★</span>
      <span class="blora-rate__star" data-active>★</span>
      <span class="blora-rate__star" data-active>★</span>
      <span class="blora-rate__star">★</span>
    </div>
  `,
};

export const Readonly: Story = {
  render: () => html`
    <div class="blora-rate" data-value="3" data-readonly ${ref(init)}>
      <span class="blora-rate__star" data-active>★</span>
      <span class="blora-rate__star" data-active>★</span>
      <span class="blora-rate__star" data-active>★</span>
      <span class="blora-rate__star">★</span>
      <span class="blora-rate__star">★</span>
      <span class="blora-hint" style="margin-left: var(--blora-space-2);">只读</span>
    </div>
  `,
};
