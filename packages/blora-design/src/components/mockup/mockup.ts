import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_MOCKUP_TAG = "blora-mockup";

export class BloraMockup extends BloraElement {
  private content: Node[] | null = null;

  static get observedAttributes(): string[] {
    return ["variant", "address", "title", "label"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal) return;
    if (name === "variant") {
      this.render();
      return;
    }
    this.sync();
  }

  protected render(): void {
    if (!this.content)
      this.content = Array.from(this.childNodes).map((node) => node.cloneNode(true));
    const variant = this.getAttribute("variant") ?? "browser";
    const root = this.ownerDocument.createElement("section");
    root.className = `blora-mockup blora-mockup--${variant}`;
    root.dataset.bloraGenerated = "";
    root.setAttribute("aria-label", this.getAttribute("label") ?? `${variant} mockup`);
    if (variant === "code") {
      this.content.forEach((node) => {
        if (node instanceof Element && node.localName === "blora-mockup-line") {
          const line = this.ownerDocument.createElement("pre");
          line.className = "blora-mockup__line";
          const tone = node.getAttribute("tone");
          if (["danger", "highlight", "info", "muted", "success", "warning"].includes(tone ?? "")) {
            line.classList.add(`blora-mockup__line--${tone}`);
          }
          const prefix = node.getAttribute("prefix");
          if (prefix != null) line.dataset.prefix = prefix;
          line.append(...Array.from(node.childNodes).map((child) => child.cloneNode(true)));
          root.appendChild(line);
          return;
        }
        if (node.nodeType !== Node.TEXT_NODE || node.textContent?.trim()) {
          root.appendChild(node.cloneNode(true));
        }
      });
    } else if (variant === "phone") {
      const camera = this.ownerDocument.createElement("div");
      camera.className = "blora-mockup__camera";
      camera.setAttribute("aria-hidden", "true");
      const display = this.ownerDocument.createElement("div");
      display.className = "blora-mockup__display";
      const body = this.ownerDocument.createElement("div");
      body.className = "blora-mockup__display-body";
      body.append(...this.content.map((node) => node.cloneNode(true)));
      display.appendChild(body);
      root.append(camera, display);
    } else {
      const toolbar = this.ownerDocument.createElement("div");
      toolbar.className = "blora-mockup__toolbar";
      const dots = this.ownerDocument.createElement("span");
      dots.className = "blora-mockup__dots";
      dots.setAttribute("aria-hidden", "true");
      dots.appendChild(this.ownerDocument.createElement("span"));
      toolbar.appendChild(dots);
      const heading = this.ownerDocument.createElement(variant === "browser" ? "div" : "span");
      heading.className = variant === "browser" ? "blora-mockup__address" : "blora-mockup__title";
      if (variant === "browser") {
        heading.append(
          createBloraIcon("search", 16, this.ownerDocument),
          this.ownerDocument.createTextNode(this.getAttribute("address") ?? "about:blank"),
        );
      } else {
        heading.textContent = this.getAttribute("title") ?? "Window";
      }
      toolbar.appendChild(heading);
      const body = this.ownerDocument.createElement("div");
      body.className = "blora-mockup__body";
      body.append(...this.content.map((node) => node.cloneNode(true)));
      root.append(toolbar, body);
    }
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-mockup");
    if (!root) return;
    root.setAttribute(
      "aria-label",
      this.getAttribute("label") ?? `${this.getAttribute("variant") ?? "browser"} mockup`,
    );
    const address = root.querySelector(".blora-mockup__address");
    if (address) {
      address.replaceChildren(
        createBloraIcon("search", 16, this.ownerDocument),
        this.ownerDocument.createTextNode(this.getAttribute("address") ?? "about:blank"),
      );
    }
    const title = root.querySelector(".blora-mockup__title");
    if (title) title.textContent = this.getAttribute("title") ?? "Window";
  }

  protected bindEvents(): void {}
}

export function defineBloraMockup(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_MOCKUP_TAG)) return;
  registry.define(BLORA_MOCKUP_TAG, BloraMockup);
}
