import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import {
  applyColorScheme,
  createPalettePickerController,
  getColorScheme,
} from "../../../addons/theming/src/index";
import "../../../addons/theming/src/theming.css";
import "../../tokens/generated/tokens.themes.css";

const meta = {
  title: "Add-ons/Theming/Palette Picker",
  component: ".blora-palette-picker",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const ensureLightDoc = (): void => {
  // Storybook canvas is light; pin scheme so OS dark + theme pack cannot bleach text
  applyColorScheme("light", document.documentElement, { persist: false, emit: false });
};

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  ensureLightDoc();
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createPalettePickerController(el);
};

export const Default: Story = {
  render: () => {
    ensureLightDoc();
    return html`
      <div
        style="display: flex; justify-content: flex-end; align-items: flex-start; gap: 0.75rem; min-height: 18rem;"
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
      <p
        class="blora-text-sm"
        style="margin-top: 1.5rem; color: var(--blora-color-text-secondary); max-width: 28rem;"
      >
        Sample body text uses theme tokens. Switch palette and light/dark — text should stay
        readable on the canvas.
      </p>
    `;
  },
};
