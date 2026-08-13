import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createAffixController } from "../../../addons/layout/src/index";
import "../../../addons/layout/src/layout.css";

const meta = {
  title: "Layout/Affix",
  component: ".blora-affix",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  // Measure after layout
  requestAnimationFrame(() => {
    (el as any).__ctrl = createAffixController(el);
  });
};

export const Default: Story = {
  render: () => html`
    <div
      style="max-width: 40rem; width: 100%; margin: 0 auto; padding: 1rem 0 70vh; box-sizing: border-box;"
    >
      <p
        style="margin: 0 0 3rem; color: var(--blora-color-text-muted); font-size: var(--blora-text-sm);"
      >
        Scroll down. The bar sticks to the top after it reaches the threshold.
      </p>

      <div style="height: 4rem;"></div>

      <div class="blora-affix" data-offset="12" style="width: 100%; display: block;" ${ref(init)}>
        <div
          class="blora-affix__inner"
          style="
            background: var(--blora-color-surface-default);
            border: 1px solid var(--blora-color-border-subtle);
            border-radius: var(--blora-radius-md);
            padding: 0.65rem 1rem;
            box-shadow: var(--blora-shadow-2);
          "
        >
          <strong
            style="font-size: var(--blora-text-sm); color: var(--blora-color-text-primary); flex: none;"
            >Affix bar</strong
          >
          <span
            style="font-size: var(--blora-text-xs); color: var(--blora-color-text-subtle); flex: none;"
            >Stays visible while scrolling</span
          >
        </div>
      </div>

      <div
        style="margin-top: 2rem; color: var(--blora-color-text-muted); font-size: var(--blora-text-sm);"
      >
        <p>Page content continues below…</p>
        <p style="margin-top: 40vh;">More content…</p>
        <p style="margin-top: 40vh;">Bottom</p>
      </div>
    </div>
  `,
};
