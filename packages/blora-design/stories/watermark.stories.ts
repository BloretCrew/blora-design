import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createWatermarkController } from "../../../addons/effects/src/index";
import "../../../addons/effects/src/effects.css";

const meta = {
  title: "Data display/Watermark",
  component: ".blora-watermark",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createWatermarkController(el);
};

export const Default: Story = {
  render: () => html`
    <div
      class="blora-watermark"
      data-blora-watermark
      data-text="Blora"
      ${ref(init)}
      style="min-height: 16rem; min-width: 100%; padding: var(--blora-space-6); border: 1px solid var(--blora-color-border-subtle); border-radius: var(--blora-radius-lg); box-sizing: border-box;"
    >
      <p style="position: relative; z-index: 1; margin: 0;">带水印的内容区域</p>
    </div>
  `,
};
