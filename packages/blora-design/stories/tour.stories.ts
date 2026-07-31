import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createTourController } from "../src/components/tour";

const meta = {
  title: "Navigation/Tour",
  component: ".blora-tour",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createTourController(el);
};

export const Default: Story = {
  render: () => html`
    <div ${ref(init)} style="display: flex; flex-direction: column; gap: var(--blora-space-4); align-items: flex-start;">
      <button class="blora-button" data-variant="primary" type="button" data-tour-start>开始漫游</button>
      <div style="display: flex; gap: var(--blora-space-3); align-items: center;">
        <span class="blora-tag" data-variant="primary" data-tour-step data-tour-title="标签" data-tour-desc="这是第一步：高亮当前标签。">步骤 A</span>
        <button class="blora-button" data-variant="outline" type="button" data-tour-step data-tour-title="按钮" data-tour-desc="第二步：关注操作按钮。">步骤 B</button>
        <span class="blora-hint" data-tour-step data-tour-title="说明" data-tour-desc="第三步：可跳过或完成引导。">步骤 C 文案</span>
      </div>
    </div>
  `,
};
