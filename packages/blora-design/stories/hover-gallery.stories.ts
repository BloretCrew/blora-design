import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createHoverGalleryController } from "../../../addons/effects/src/index";
import "../../../addons/effects/src/effects.css";

const meta = {
  title: "Data display/Hover Gallery",
  component: ".blora-hover-gallery",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createHoverGalleryController(el);
};

export const Default: Story = {
  render: () => html`
    <div
      class="blora-hover-gallery blora-hover-gallery--wide"
      style="max-width: 28rem;"
      tabindex="0"
      aria-label="图库"
      ${ref(init)}
    >
      <div class="blora-hover-gallery__track">
        <div
          class="blora-hover-gallery__item is-active"
          style="background:linear-gradient(135deg,#9F5964,#5D6680);"
        ></div>
        <div
          class="blora-hover-gallery__item"
          style="background:linear-gradient(135deg,#5B756B,#303143);"
        ></div>
        <div
          class="blora-hover-gallery__item"
          style="background:linear-gradient(135deg,#405D87,#AF8A55);"
        ></div>
      </div>
    </div>
    <p class="blora-text-xs" style="color:var(--blora-color-text-subtle);margin-top:0.5rem;">
      拖拽或方向键切换
    </p>
  `,
};
