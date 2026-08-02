import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createPalettePickerController } from "../../../addons/theming/src/index";
import "../../../addons/theming/src/theming.css";
import "../../tokens/generated/tokens.themes.css";

const meta = {
  title: "Add-ons/Theming/Palette Picker",
  component: ".blora-palette-picker",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createPalettePickerController(el);
};

export const Default: Story = {
  render: () => html`
    <div style="display:flex;justify-content:flex-end;min-height:16rem;">
      <div class="blora-palette-picker" data-blora-palette-picker ${ref(init)}>
        <button
          type="button"
          class="blora-button blora-palette-picker__trigger"
          data-variant="outline"
          data-blora-palette-trigger
        >
          <span class="blora-palette-picker__label">Coral</span>
        </button>
      </div>
    </div>
  `,
};
