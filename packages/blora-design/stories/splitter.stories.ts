import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createSplitterController } from "../src/components/splitter";

const meta = {
  title: "Layout/Splitter",
  component: ".blora-splitter",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createSplitterController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-splitter" data-min="100" style="min-height:10rem;" ${ref(init)}>
      <div class="blora-splitter__pane" style="background: var(--blora-color-surface-raised); display: grid; place-items: center; padding: var(--blora-space-4);">左栏 · 拖拽中间条</div>
      <div class="blora-splitter__pane" style="display: grid; place-items: center; padding: var(--blora-space-4);">右栏 · 自适应</div>
    </div>
  `,
};
