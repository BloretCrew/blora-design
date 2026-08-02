import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import {
  applyColorScheme,
  createPalettePickerController,
  getColorScheme,
} from "../../../addons/theming/src/index";
import "../../../addons/theming/src/theming.css";
/* tokens.dark.css + tokens.themes.css loaded globally in .storybook/preview.ts */

const meta = {
  title: "Add-ons/Theming/Palette Picker",
  component: ".blora-palette-picker",
  tags: ["autodocs"],
  parameters: {
    // Don't force Storybook gray bg over our scheme canvas
    backgrounds: { disable: true },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const pinLight = (): void => {
  applyColorScheme("light", document.documentElement, { persist: false, emit: false });
};

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  pinLight();
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createPalettePickerController(el);
};

export const Default: Story = {
  render: () => {
    pinLight();
    return html`
      <div style="min-height: 20rem; padding: 0.5rem;">
        <div
          style="display: flex; justify-content: flex-end; align-items: flex-start; gap: 0.75rem;"
        >
          <button
            type="button"
            class="blora-button"
            data-variant="outline"
            data-size="sm"
            @click=${() => {
              const next = getColorScheme() === "dark" ? "light" : "dark";
              applyColorScheme(next);
            }}
          >
            Toggle light / dark
          </button>
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
        <div style="margin-top: 2rem; max-width: 32rem;">
          <h3 class="blora-h3" style="margin: 0 0 0.5rem; color: var(--blora-color-text-primary);">
            Sample heading
          </h3>
          <p
            style="margin: 0; color: var(--blora-color-text-secondary); font-size: var(--blora-text-sm);"
          >
            Body text should stay readable in both light and dark. Switch palette and scheme —
            canvas and type use the same token surface.
          </p>
          <p
            style="margin: 1rem 0 0; color: var(--blora-color-text-muted); font-size: var(--blora-text-sm);"
          >
            Muted secondary line for contrast check.
          </p>
        </div>
      </div>
    `;
  },
};
