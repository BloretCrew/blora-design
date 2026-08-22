/**
 * Blora Design 2.0 - Color Picker (HSV spectrum + hex sync, v1 parity)
 */
import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";

export const BLORA_COLOR_PICKER_TAG = "blora-color-picker";
export interface ColorPickerController {
  destroy(): void;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const normalizeHex = (value: string): string | null => {
  let hex = String(value || "").trim();
  if (hex && !hex.startsWith("#")) hex = "#" + hex;
  if (/^#[0-9a-f]{3}$/i.test(hex))
    hex =
      "#" +
      hex
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("");
  return /^#[0-9a-f]{6}$/i.test(hex) ? hex.toUpperCase() : null;
};

const hexToHsv = (hex: string) => {
  const value = normalizeHex(hex) || "#000000";
  const r = parseInt(value.slice(1, 3), 16) / 255;
  const g = parseInt(value.slice(3, 5), 16) / 255;
  const b = parseInt(value.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta) {
    if (max === r) h = 60 * (((g - b) / delta) % 6);
    else if (max === g) h = 60 * ((b - r) / delta + 2);
    else h = 60 * ((r - g) / delta + 4);
  }
  if (h < 0) h += 360;
  return { h, s: max ? delta / max : 0, v: max };
};

const hsvToHex = ({ h, s, v }: { h: number; s: number; v: number }) => {
  const chroma = v * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - chroma;
  const rgb =
    h < 60
      ? [chroma, x, 0]
      : h < 120
        ? [x, chroma, 0]
        : h < 180
          ? [0, chroma, x]
          : h < 240
            ? [0, x, chroma]
            : h < 300
              ? [x, 0, chroma]
              : [chroma, 0, x];
  return (
    "#" +
    rgb
      .map((channel) =>
        Math.round((channel + m) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
      .toUpperCase()
  );
};

export function createColorPickerController(root: HTMLElement): ColorPickerController {
  const swatch = root.querySelector<HTMLElement>(".blora-color-swatch");
  let panel = root.querySelector<HTMLElement>(".blora-color-panel");
  if (!swatch) return { destroy: () => {} };

  if (!panel) {
    panel = document.createElement("div");
    panel.className = "blora-color-panel";
    root.appendChild(panel);
  }

  let spectrum = panel.querySelector<HTMLElement>(".blora-color-spectrum");
  if (!spectrum) {
    spectrum = document.createElement("div");
    spectrum.className = "blora-color-spectrum";
    spectrum.tabIndex = 0;
    spectrum.setAttribute("role", "slider");
    spectrum.setAttribute("aria-label", t("color.spectrum"));
    const cursor = document.createElement("span");
    cursor.className = "blora-color-spectrum__cursor";
    cursor.setAttribute("aria-hidden", "true");
    spectrum.appendChild(cursor);
    panel.insertBefore(spectrum, panel.firstChild);
  }
  const cursor = spectrum.querySelector<HTMLElement>(".blora-color-spectrum__cursor")!;

  let hueInput = panel.querySelector<HTMLInputElement>(".blora-color-hue");
  if (!hueInput) {
    hueInput = document.createElement("input");
    hueInput.className = "blora-color-hue";
    hueInput.type = "range";
    hueInput.min = "0";
    hueInput.max = "359";
    hueInput.step = "1";
    hueInput.setAttribute("aria-label", t("color.hue"));
    spectrum.insertAdjacentElement("afterend", hueInput);
  }

  let hexInput = panel.querySelector<HTMLInputElement>(".blora-color-hex");
  if (!hexInput) {
    const row = document.createElement("div");
    row.className = "blora-color-custom";
    const preview = document.createElement("span");
    preview.className = "blora-color-preview";
    hexInput = document.createElement("input");
    hexInput.className = "blora-input blora-color-hex";
    hexInput.type = "text";
    hexInput.placeholder = "#RRGGBB";
    row.append(preview, hexInput);
    panel.appendChild(row);
  }
  const preview = panel.querySelector<HTMLElement>(".blora-color-preview");

  let current =
    normalizeHex(swatch.dataset.color || "") ||
    normalizeHex(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--blora-color-action-primary-default",
      ),
    ) ||
    "#3B82F6";
  let hsv = hexToHsv(current);

  const HUE_GRAD = "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)";
  const applySpectrumStyles = () => {
    const hue = Math.round(hsv.h);
    spectrum!.style.background = `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hue} 100% 50%)`;
    hueInput!.style.background = HUE_GRAD;
  };

  const render = (emit = false) => {
    current = hsvToHex(hsv);
    swatch.style.background = current;
    swatch.dataset.color = current;
    swatch.setAttribute("aria-label", t("color.swatch", { color: current }));
    applySpectrumStyles();
    hueInput!.value = String(Math.round(hsv.h));
    cursor.style.left = hsv.s * 100 + "%";
    cursor.style.top = (1 - hsv.v) * 100 + "%";
    if (preview) preview.style.background = current;
    if (hexInput && document.activeElement !== hexInput) hexInput.value = current;
    if (emit) {
      root.dispatchEvent(
        new CustomEvent("blora:change", {
          bubbles: true,
          detail: { value: current, hsv: { ...hsv } },
        }),
      );
    }
  };

  const setFromPoint = (clientX: number, clientY: number, emit = true) => {
    const rect = spectrum!.getBoundingClientRect();
    hsv.s = clamp((clientX - rect.left) / rect.width, 0, 1);
    hsv.v = 1 - clamp((clientY - rect.top) / rect.height, 0, 1);
    render(emit);
  };

  const onSpectrumDown = (e: PointerEvent) => {
    e.preventDefault();
    spectrum!.focus();
    spectrum!.setPointerCapture(e.pointerId);
    setFromPoint(e.clientX, e.clientY);
  };
  const onSpectrumMove = (e: PointerEvent) => {
    if (spectrum!.hasPointerCapture(e.pointerId)) setFromPoint(e.clientX, e.clientY);
  };
  const onHue = () => {
    hsv.h = Number(hueInput!.value);
    render(true);
  };
  const onHex = () => {
    const value = normalizeHex(hexInput!.value);
    hexInput!.setAttribute("aria-invalid", String(!value));
    if (value) {
      hsv = hexToHsv(value);
      render(true);
    }
  };

  const open = () => {
    panel!.removeAttribute("data-align-end");
    panel!.setAttribute("data-open", "");
    swatch.setAttribute("aria-expanded", "true");
    if (panel!.getBoundingClientRect().right > window.innerWidth - 8)
      panel!.setAttribute("data-align-end", "");
    render();
  };
  const close = () => {
    panel!.removeAttribute("data-open");
    swatch.setAttribute("aria-expanded", "false");
  };
  const onSwatch = (e: MouseEvent) => {
    e.stopPropagation();
    if (panel!.hasAttribute("data-open")) close();
    else open();
  };
  const onDoc = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) close();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  swatch.setAttribute("role", "button");
  swatch.tabIndex = 0;
  swatch.setAttribute("aria-haspopup", "dialog");
  swatch.setAttribute("aria-expanded", "false");

  spectrum.addEventListener("pointerdown", onSpectrumDown);
  spectrum.addEventListener("pointermove", onSpectrumMove);
  hueInput.addEventListener("input", onHue);
  hexInput.addEventListener("input", onHex);
  swatch.addEventListener("click", onSwatch);
  document.addEventListener("click", onDoc);
  document.addEventListener("keydown", onKey);
  render();

  return {
    destroy() {
      spectrum!.removeEventListener("pointerdown", onSpectrumDown);
      spectrum!.removeEventListener("pointermove", onSpectrumMove);
      hueInput!.removeEventListener("input", onHue);
      hexInput!.removeEventListener("input", onHex);
      swatch.removeEventListener("click", onSwatch);
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    },
  };
}

/** HSV color picker CE that owns swatch, spectrum, hue and hex controls. */
export class BloraColorPicker extends BloraElement {
  private controller: ColorPickerController | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["value", "label", "disabled"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get value(): string {
    return this.querySelector<HTMLElement>(".blora-color-swatch")?.dataset.color ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  open(): void {
    if (!this.hasAttribute("disabled"))
      this.querySelector<HTMLElement>(".blora-color-swatch")?.click();
  }

  close(): void {
    const panel = this.querySelector<HTMLElement>(".blora-color-panel");
    const swatch = this.querySelector<HTMLElement>(".blora-color-swatch");
    panel?.removeAttribute("data-open");
    swatch?.setAttribute("aria-expanded", "false");
  }

  protected render(): void {
    const value = normalizeHex(this.getAttribute("value") ?? "") ?? "#3B82F6";
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-color-picker";
    root.dataset.bloraGenerated = "";
    const swatch = this.ownerDocument.createElement("div");
    swatch.className = "blora-color-swatch";
    swatch.dataset.color = value;
    swatch.style.background = value;
    swatch.setAttribute(
      "aria-label",
      this.getAttribute("label") ?? t("color.swatch", { color: value }),
    );
    if (this.hasAttribute("disabled")) swatch.setAttribute("aria-disabled", "true");
    const panel = this.ownerDocument.createElement("div");
    panel.className = "blora-color-panel";
    panel.setAttribute("role", "dialog");
    const spectrum = this.ownerDocument.createElement("div");
    spectrum.className = "blora-color-spectrum";
    spectrum.tabIndex = 0;
    spectrum.setAttribute("role", "slider");
    spectrum.setAttribute("aria-label", t("color.spectrum"));
    const cursor = this.ownerDocument.createElement("span");
    cursor.className = "blora-color-spectrum__cursor";
    cursor.setAttribute("aria-hidden", "true");
    spectrum.appendChild(cursor);
    const hue = this.ownerDocument.createElement("input");
    hue.className = "blora-color-hue";
    hue.type = "range";
    hue.min = "0";
    hue.max = "359";
    hue.step = "1";
    hue.setAttribute("aria-label", t("color.hue"));
    const custom = this.ownerDocument.createElement("div");
    custom.className = "blora-color-custom";
    const preview = this.ownerDocument.createElement("span");
    preview.className = "blora-color-preview";
    preview.style.background = value;
    const hex = this.ownerDocument.createElement("input");
    hex.className = "blora-input blora-color-hex";
    hex.type = "text";
    hex.value = value;
    hex.placeholder = "#RRGGBB";
    custom.append(preview, hex);
    panel.append(spectrum, hue, custom);
    root.append(swatch, panel);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const field = this.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    if (field) {
      field.disabled = this.hasAttribute("disabled");
      if (this.hasAttribute("placeholder"))
        field.placeholder = this.getAttribute("placeholder") ?? "";
      if (this.hasAttribute("value") && this.ownerDocument.activeElement !== field) {
        field.value = this.getAttribute("value") ?? field.value;
      }
    }
    this.rebind();
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-color-picker");
    if (!root || this.hasAttribute("disabled")) return;
    this.controller = createColorPickerController(root);
    this.listen(root, "blora:change", (event) => {
      const value = (event as CustomEvent<{ value: string }>).detail.value;
      this.reflecting = true;
      this.setAttribute("value", value);
      this.reflecting = false;
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraColorPicker(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_COLOR_PICKER_TAG)) return;
  registry.define(BLORA_COLOR_PICKER_TAG, BloraColorPicker);
}
