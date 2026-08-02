import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createPopoverController } from "../src/components/popover";

const meta = {
  title: "Navigation/Popover",
  component: ".blora-popover",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createPopoverController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-popover" ${ref(init)} style="display:inline-block;">
      <button type="button" class="blora-button" data-variant="outline" data-blora-popover>
        打开 Popover
      </button>
      <div class="blora-popover__panel" style="min-width:12rem;padding:var(--blora-space-3);">
        <p style="margin:0 0 0.75rem;font-size:var(--blora-text-sm);">面板内容</p>
        <button type="button" class="blora-button" data-size="sm" data-blora-close>关闭</button>
      </div>
    </div>
  `,
};
