/**
 * Progress: set value via data-value or API.
 */
import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";

export const BLORA_PROGRESS_TAG = "blora-progress";
export interface ProgressController {
  setValue(n: number): void;
  destroy(): void;
}

export function createProgressController(root: HTMLElement): ProgressController {
  const bar =
    root.querySelector<HTMLElement>(".blora-progress__fill") ??
    root.querySelector<HTMLElement>(".blora-progress__ring-fill") ??
    root.querySelector<HTMLElement>(".blora-progress__bar") ??
    root;
  const label =
    root.querySelector<HTMLElement>("[data-progress-label]") ??
    root.querySelector<HTMLElement>(".blora-progress__label");

  const setValue = (n: number) => {
    const v = Math.max(0, Math.min(100, n));
    root.setAttribute("aria-valuenow", String(v));
    root.dataset.value = String(v);
    if (bar.classList.contains("blora-progress__ring-fill")) {
      bar.style.strokeDashoffset = String(100 - v);
    } else {
      bar.style.width = `${v}%`;
    }
    if (label) label.textContent = `${Math.round(v)}%`;
  };

  const initial = Number(root.dataset.value || root.getAttribute("aria-valuenow") || 0);
  if (!Number.isNaN(initial)) setValue(initial);

  return {
    setValue,
    destroy() {},
  };
}

/** Progress CE that owns accessible label, track and fill structure. */
export class BloraProgress extends BloraElement {
  private controller: ProgressController | null = null;

  static get observedAttributes(): string[] {
    return ["value", "label", "variant", "shape"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal) return;
    if (name === "shape") {
      this.render();
      this.rebind();
      return;
    }
    this.sync();
  }

  get value(): number {
    return Number(this.querySelector<HTMLElement>(".blora-progress")?.dataset.value ?? 0);
  }

  set value(value: number) {
    this.setAttribute("value", String(value));
  }

  setValue(value: number): void {
    this.value = value;
  }

  protected render(): void {
    const value = Math.max(0, Math.min(100, Number(this.getAttribute("value") ?? 0)));
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-progress";
    root.dataset.bloraGenerated = "";
    root.dataset.value = String(value);
    root.setAttribute("role", "progressbar");
    root.setAttribute("aria-valuemin", "0");
    root.setAttribute("aria-valuemax", "100");
    root.setAttribute("aria-valuenow", String(value));
    const shape = this.getAttribute("shape") ?? "linear";
    root.dataset.shape = shape;
    root.setAttribute("aria-label", this.getAttribute("label") ?? t("progress.label"));
    if (shape === "circular") {
      root.classList.add("blora-progress--circular");
      const ring = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
      ring.setAttribute("class", "blora-progress__ring");
      ring.setAttribute("viewBox", "0 0 36 36");
      ring.setAttribute("aria-hidden", "true");
      const track = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "circle");
      track.setAttribute("class", "blora-progress__ring-track");
      track.setAttribute("cx", "18");
      track.setAttribute("cy", "18");
      track.setAttribute("r", "15.5");
      const fill = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "circle");
      fill.setAttribute("class", "blora-progress__ring-fill");
      fill.setAttribute("cx", "18");
      fill.setAttribute("cy", "18");
      fill.setAttribute("r", "15.5");
      fill.style.strokeDashoffset = String(100 - value);
      const variant = this.getAttribute("variant");
      if (variant) fill.dataset.variant = variant;
      ring.append(track, fill);
      const output = this.ownerDocument.createElement("span");
      output.className = "blora-progress__circular-label";
      output.dataset.progressLabel = "";
      output.textContent = `${Math.round(value)}%`;
      root.append(ring, output);
      this.replaceChildren(root);
      return;
    }
    const label = this.ownerDocument.createElement("div");
    label.className = "blora-progress__label";
    const labelText = this.ownerDocument.createElement("span");
    labelText.textContent = this.getAttribute("label") ?? t("progress.label");
    const output = this.ownerDocument.createElement("span");
    output.dataset.progressLabel = "";
    output.textContent = `${Math.round(value)}%`;
    label.append(labelText, output);
    const track = this.ownerDocument.createElement("div");
    track.className = "blora-progress__bar";
    const fill = this.ownerDocument.createElement("div");
    fill.className = "blora-progress__fill";
    const variant = this.getAttribute("variant");
    if (variant) fill.dataset.variant = variant;
    track.appendChild(fill);
    root.append(label, track);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-progress");
    if (!root) return;
    const value = Math.max(0, Math.min(100, Number(this.getAttribute("value") ?? 0)));
    root.setAttribute("aria-label", this.getAttribute("label") ?? t("progress.label"));
    const variant = this.getAttribute("variant");
    const fill =
      root.querySelector<HTMLElement>(".blora-progress__fill") ??
      root.querySelector<HTMLElement>(".blora-progress__ring-fill");
    if (fill) {
      if (variant) fill.dataset.variant = variant;
      else delete fill.dataset.variant;
    }
    const labelText = root.querySelector(".blora-progress__label span:not([data-progress-label])");
    if (labelText) labelText.textContent = this.getAttribute("label") ?? t("progress.label");
    this.controller?.setValue(value);
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-progress");
    this.controller?.destroy();
    this.controller = root ? createProgressController(root) : null;
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraProgress(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_PROGRESS_TAG)) return;
  registry.define(BLORA_PROGRESS_TAG, BloraProgress);
}
