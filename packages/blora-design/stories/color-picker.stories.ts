import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createColorPickerController } from "../src/components/color-picker";

const meta = {
  title: "Forms/Color Picker",
  component: ".blora-color-picker",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createColorPickerController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-color-picker" ${ref(init)} style="margin-bottom: 16rem;">
      <div class="blora-color-swatch" data-color="#3B82F6" style="background:#3B82F6;"></div>
      <div class="blora-color-panel">
        <div class="blora-color-custom">
          <span class="blora-color-preview" style="background:#3B82F6;"></span>
          <input class="blora-input blora-color-hex" type="text" value="#3B82F6" />
        </div>
      </div>
    </div>
  `,
};
