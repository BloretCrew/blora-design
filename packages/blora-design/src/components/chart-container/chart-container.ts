import { BloraElement } from "../../core/blora-element.js";

export const BLORA_CHART_CONTAINER_TAG = "blora-chart-container";

export class BloraChartContainer extends BloraElement {
  private content: Node[] | null = null;

  static get observedAttributes(): string[] {
    return ["title", "subtitle", "trend", "trend-variant"];
  }

  attributeChangedCallback(): void {
    if (this.isConnectedInternal) this.sync();
  }

  protected render(): void {
    if (!this.content)
      this.content = Array.from(this.childNodes).map((node) => node.cloneNode(true));
    const root = this.ownerDocument.createElement("section");
    root.className = "blora-chart";
    root.dataset.bloraGenerated = "";
    const header = this.ownerDocument.createElement("div");
    header.className = "blora-chart__header";
    const headings = this.ownerDocument.createElement("div");
    const title = this.ownerDocument.createElement("div");
    title.className = "blora-chart__title";
    title.textContent = this.getAttribute("title") ?? "";
    const subtitle = this.ownerDocument.createElement("div");
    subtitle.className = "blora-text-xs blora-text-subtle";
    subtitle.textContent = this.getAttribute("subtitle") ?? "";
    headings.append(title, subtitle);
    header.appendChild(headings);
    const trendText = this.getAttribute("trend");
    if (trendText) {
      const trend = this.ownerDocument.createElement("span");
      trend.className = "blora-tag";
      trend.dataset.variant = this.getAttribute("trend-variant") ?? "success";
      trend.textContent = trendText;
      header.appendChild(trend);
    }
    const body = this.ownerDocument.createElement("div");
    body.className = "blora-chart__body";
    body.append(...this.content.map((node) => node.cloneNode(true)));
    root.append(header, body);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const title = this.querySelector(".blora-chart__title");
    if (title) title.textContent = this.getAttribute("title") ?? "";
    const subtitle = this.querySelector(".blora-text-xs");
    if (subtitle) subtitle.textContent = this.getAttribute("subtitle") ?? "";
    const trendText = this.getAttribute("trend");
    const trend = this.querySelector<HTMLElement>(".blora-tag");
    if (trendText) {
      if (!trend) {
        this.render();
        return;
      }
      trend.textContent = trendText;
      trend.dataset.variant = this.getAttribute("trend-variant") ?? "success";
    } else {
      trend?.remove();
    }
  }

  protected bindEvents(): void {}
}

export function defineBloraChartContainer(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_CHART_CONTAINER_TAG)) return;
  registry.define(BLORA_CHART_CONTAINER_TAG, BloraChartContainer);
}
