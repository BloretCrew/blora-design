import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createSegmentedController } from "../src/components/segmented";

const meta = {
  title: "Forms/Segmented",
  component: ".blora-segmented",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createSegmentedController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-segmented" ${ref(init)} style="max-width: 20rem;">
      <span class="blora-segmented__indicator" aria-hidden="true"></span>
      <button type="button" class="blora-segmented__item is-active" data-value="day">日</button>
      <button type="button" class="blora-segmented__item" data-value="week">周</button>
      <button type="button" class="blora-segmented__item" data-value="month">月</button>
    </div>
  `,
};
