import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createImageDiffController } from "../../../addons/effects/src/index";
import "../../../addons/effects/src/effects.css";

const meta = {
  title: "Add-ons/Effects/Image Diff",
  component: ".blora-diff",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createImageDiffController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-diff" ${ref(init)} style="max-width: 28rem;">
      <div class="blora-diff__item blora-diff__item--before">
        <div style="width:100%;height:100%;background:linear-gradient(135deg,#9F5964,#5D6680);"></div>
      </div>
      <div class="blora-diff__item">
        <div style="width:100%;height:100%;background:linear-gradient(135deg,#5B756B,#303143);"></div>
      </div>
      <div class="blora-diff__divider" aria-hidden="true"></div>
      <input class="blora-diff__range" type="range" min="0" max="100" value="50" aria-label="对比位置" />
    </div>
  `,
};
