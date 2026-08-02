import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createAffixController } from "../../../addons/layout/src/index";
import "../../../addons/layout/src/layout.css";

const meta = {
  title: "Add-ons/Layout/Affix",
  component: ".blora-affix",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createAffixController(el);
};

export const Default: Story = {
  render: () => html`
    <div style="min-height: 140vh; padding: var(--blora-space-4); max-width: 40rem;">
      <p class="blora-text-sm" style="color: var(--blora-color-text-muted); margin: 0 0 2rem;">
        Scroll this page. The bar sticks to the top after it reaches the threshold.
      </p>
      <div style="height: 6rem;"></div>
      <div class="blora-affix" data-offset="12" ${ref(init)}>
        <div
          class="blora-affix__inner"
          style="
            display: flex;
            align-items: center;
            gap: var(--blora-space-3);
            width: 100%;
            max-width: 40rem;
            box-sizing: border-box;
            background: var(--blora-color-surface-default);
            border: 1px solid var(--blora-color-border-subtle);
            border-radius: var(--blora-radius-md);
            padding: var(--blora-space-3) var(--blora-space-4);
            box-shadow: var(--blora-shadow-2);
          "
        >
          <strong class="blora-text-sm">Affix bar</strong>
          <span class="blora-text-xs" style="color: var(--blora-color-text-subtle);"
            >Stays visible while scrolling</span
          >
        </div>
      </div>
      <div style="height: 90vh; margin-top: 1rem;">
        <p class="blora-text-sm" style="color: var(--blora-color-text-muted);">
          Page content continues below…
        </p>
      </div>
    </div>
  `,
};
