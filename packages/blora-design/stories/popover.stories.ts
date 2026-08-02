import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createPopoverController } from "../src/components/popover";

const meta = {
  title: "Feedback/Popover",
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
    <div style="padding: 2rem; text-align: start;">
      <div class="blora-popover" ${ref(init)}>
        <button type="button" class="blora-button" data-variant="outline" data-blora-popover>
          Open Popover
        </button>
        <div class="blora-popover__panel" role="dialog">
          <p
            style="margin: 0 0 0.75rem; font-size: var(--blora-text-sm); color: var(--blora-color-text-secondary); text-align: start;"
          >
            Panel left-aligned with the trigger button.
          </p>
          <button type="button" class="blora-button" data-size="sm" data-blora-close>Close</button>
        </div>
      </div>
    </div>
  `,
};
