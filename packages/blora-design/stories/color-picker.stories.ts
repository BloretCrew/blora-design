import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createColorPickerController } from "../src/components/copy";

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

const colors = [
  "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#1abc9c",
  "#3498db", "#9b59b6", "#34495e", "#ecf0f1", "#95a5a6",
];

export const Default: Story = {
  render: () => html`
    <div class="blora-color-picker" ${ref(init)}>
      <div class="blora-color-swatch">
        ${colors.map((c) => html`<span class="blora-color-picker__swatch" data-color=${c} style="background:${c};"></span>`)}
      </div>
      <div class="blora-color-panel">
        <div class="blora-color-custom">
          <span class="blora-color-preview" style="background: ${colors[0]};"></span>
          <input class="blora-input blora-color-hex" type="text" placeholder="#RRGGBB" value=${colors[0]} />
        </div>
      </div>
    </div>
  `,
};
