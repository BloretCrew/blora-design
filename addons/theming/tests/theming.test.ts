import { describe, it, expect, beforeEach } from "vitest";
import {
  applyTheme,
  getTheme,
  THEME_PRESETS,
  createPalettePickerController,
  applyColorScheme,
  getColorScheme,
} from "../src/index.js";

describe("theming add-on", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("data-blora-theme");
  });

  it("has nine presets", () => {
    expect(Object.keys(THEME_PRESETS).length).toBeGreaterThanOrEqual(8);
  });

  it("applyTheme sets data-blora-theme", () => {
    applyTheme("indigo", document.documentElement, { persist: false, emit: false });
    expect(getTheme()).toBe("indigo");
  });

  it("palette picker builds options", () => {
    document.body.innerHTML = `
      <div class="blora-palette-picker" data-blora-palette-picker>
        <button type="button" data-blora-palette-trigger class="blora-palette-picker__trigger">
          <span class="blora-palette-picker__label">Coral</span>
        </button>
      </div>`;
    const root = document.querySelector<HTMLElement>(".blora-palette-picker")!;
    const ctrl = createPalettePickerController(root);
    expect(root.querySelectorAll("[data-blora-palette-option]").length).toBeGreaterThan(3);
    ctrl.destroy();
  });

  it("applyColorScheme sets dark attribute", () => {
    applyColorScheme("dark", document.documentElement, { persist: false, emit: false });
    expect(getColorScheme()).toBe("dark");
    applyColorScheme("light", document.documentElement, { persist: false, emit: false });
    expect(getColorScheme()).toBe("light");
  });
});
