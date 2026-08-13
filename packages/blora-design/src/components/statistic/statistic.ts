import { BloraElement } from "../../core/blora-element.js";

export const BLORA_STATISTIC_TAG = "blora-statistic";

/** Attribute-driven statistic that owns the official `.blora-stat` tree. */
export class BloraStatistic extends BloraElement {
  private initialValue: string | null = null;

  static get observedAttributes(): string[] {
    return ["label", "value", "suffix", "trend", "direction"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal) return;
    this.sync();
  }

  get value(): string {
    return this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  protected render(): void {
    if (this.initialValue === null) this.initialValue = this.textContent?.trim() ?? "";
    const doc = this.ownerDocument;
    const root = doc.createElement("div");
    root.className = "blora-stat";
    root.dataset.bloraGenerated = "";

    const label = this.getAttribute("label");
    if (label) {
      const labelNode = doc.createElement("div");
      labelNode.className = "blora-stat__label";
      labelNode.textContent = label;
      root.appendChild(labelNode);
    }

    const valueNode = doc.createElement("div");
    valueNode.className = "blora-stat__value";
    valueNode.textContent = this.getAttribute("value") ?? this.initialValue;
    const suffix = this.getAttribute("suffix");
    if (suffix) {
      const suffixNode = doc.createElement("span");
      suffixNode.className = "blora-stat__suffix";
      suffixNode.textContent = suffix;
      valueNode.appendChild(suffixNode);
    }
    root.appendChild(valueNode);

    const trend = this.getAttribute("trend");
    if (trend) {
      const trendNode = doc.createElement("div");
      trendNode.className = "blora-stat__trend";
      trendNode.textContent = trend;
      const direction = this.getAttribute("direction");
      if (direction === "up" || direction === "down") trendNode.dataset.direction = direction;
      root.appendChild(trendNode);
    }

    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-stat");
    if (!root) {
      this.render();
      return;
    }
    const label = this.getAttribute("label");
    let labelNode = root.querySelector<HTMLElement>(".blora-stat__label");
    if (label) {
      if (!labelNode) {
        labelNode = this.ownerDocument.createElement("div");
        labelNode.className = "blora-stat__label";
        root.prepend(labelNode);
      }
      labelNode.textContent = label;
    } else {
      labelNode?.remove();
    }
    const valueNode = root.querySelector<HTMLElement>(".blora-stat__value");
    if (valueNode) {
      const suffix = this.getAttribute("suffix");
      valueNode.textContent = this.getAttribute("value") ?? this.initialValue ?? "";
      if (suffix) {
        const suffixNode = this.ownerDocument.createElement("span");
        suffixNode.className = "blora-stat__suffix";
        suffixNode.textContent = suffix;
        valueNode.appendChild(suffixNode);
      }
    }
    const trend = this.getAttribute("trend");
    let trendNode = root.querySelector<HTMLElement>(".blora-stat__trend");
    if (trend) {
      if (!trendNode) {
        trendNode = this.ownerDocument.createElement("div");
        trendNode.className = "blora-stat__trend";
        root.appendChild(trendNode);
      }
      trendNode.textContent = trend;
      const direction = this.getAttribute("direction");
      if (direction === "up" || direction === "down") trendNode.dataset.direction = direction;
      else delete trendNode.dataset.direction;
    } else {
      trendNode?.remove();
    }
  }

  protected bindEvents(): void {}
}

export function defineBloraStatistic(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_STATISTIC_TAG)) return;
  registry.define(BLORA_STATISTIC_TAG, BloraStatistic);
}
