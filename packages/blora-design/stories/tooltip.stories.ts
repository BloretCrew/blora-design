import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createTooltipController } from "../src/components/tooltip";

const meta = {
  title: "Feedback/Tooltip",
  component: ".blora-tooltip",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createTooltipController(el);
};

export const Default: Story = {
  render: () => html`
    <div style="padding: 3rem; text-align: center;">
      <span class="blora-tooltip" ${ref(init)} tabindex="0">
        悬停或聚焦查看
        <span class="blora-tooltip__bubble">这是一个提示信息</span>
      </span>
    </div>
  `,
};
