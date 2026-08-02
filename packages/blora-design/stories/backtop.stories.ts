import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createBackTopController } from "../src/components/backtop";

const meta = {
  title: "Navigation/BackTop",
  component: ".blora-backtop",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy?.();
  /* Defer so Lit finishes mounting the host before we append the SVG icon */
  requestAnimationFrame(() => {
    (el as any).__ctrl = createBackTopController(el, { showAfter: 80 });
  });
};

export const Default: Story = {
  render: () => html`
    <div style="height: 120vh; padding: 1rem;">
      <p style="color: var(--blora-color-text-muted); font-size: var(--blora-text-sm);">
        Scroll down — BackTop appears after threshold, click returns to top.
      </p>
      <p style="margin-top: 40vh;">Mid page…</p>
      <p style="margin-top: 40vh;">Bottom</p>
      <!-- Empty host: controller injects v1 arrow-up SVG via DOM APIs (never innerHTML) -->
      <button
        type="button"
        class="blora-backtop"
        data-show-after="80"
        aria-label="回到顶部"
        ${ref(init)}
      ></button>
    </div>
  `,
};
