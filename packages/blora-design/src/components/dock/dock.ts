/**
 * Blora Design 2.0 - Dock controller only.
 * Megamenu → components/megamenu; Speed Dial → components/speed-dial.
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon, type BloraIconName } from "../../core/icons.js";

export const BLORA_DOCK_TAG = "blora-dock";

export interface DockController {
  destroy(): void;
  getCurrent(): number;
  select(index: number): void;
}

/**
 * Dock: active state + sliding indicator (segmented-style).
 */
export function createDockController(root: HTMLElement): DockController {
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  const items = Array.from(root.querySelectorAll<HTMLElement>(".blora-dock__item"));
  if (!items.length || !win) return { destroy: () => {}, getCurrent: () => 0, select: () => {} };

  let indicator = root.querySelector<HTMLElement>(".blora-dock__indicator");
  if (!indicator) {
    indicator = doc.createElement("span");
    indicator.className = "blora-dock__indicator";
    indicator.setAttribute("aria-hidden", "true");
    root.insertBefore(indicator, root.firstChild);
  }

  const moveIndicator = (item: HTMLElement | null) => {
    if (!item || !indicator) {
      indicator!.style.opacity = "0";
      return;
    }
    const rootRect = root.getBoundingClientRect();
    const r = item.getBoundingClientRect();
    const left = r.left - rootRect.left + root.scrollLeft;
    indicator.style.opacity = "1";
    indicator.style.width = `${r.width}px`;
    indicator.style.height = `${r.height}px`;
    indicator.style.transform = `translate(${left}px, ${r.top - rootRect.top}px)`;
  };

  const setActive = (item: HTMLElement) => {
    items.forEach((it) => it.removeAttribute("data-active"));
    item.setAttribute("data-active", "");
    moveIndicator(item);
    root.dispatchEvent(
      new CustomEvent("blora-dock-change", {
        bubbles: true,
        detail: { index: items.indexOf(item), value: item.dataset.value ?? "" },
      }),
    );
  };

  const onClick = (e: MouseEvent) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>(".blora-dock__item");
    if (!item || !root.contains(item)) return;
    e.preventDefault();
    setActive(item);
  };

  const active = items.find((it) => it.hasAttribute("data-active")) ?? items[0];
  // Measure after layout (Storybook/fonts) so indicator is correct without a click
  if (active) {
    setActive(active);
    requestAnimationFrame(() => {
      moveIndicator(active);
      requestAnimationFrame(() => moveIndicator(active));
    });
  }

  root.addEventListener("click", onClick);
  const onResize = () => {
    const cur = items.find((it) => it.hasAttribute("data-active"));
    if (cur) moveIndicator(cur);
  };
  win.addEventListener("resize", onResize);
  // Fonts can change item width after first paint
  void doc.fonts?.ready?.then?.(onResize);

  return {
    destroy() {
      root.removeEventListener("click", onClick);
      win.removeEventListener("resize", onResize);
    },
    getCurrent: () => items.findIndex((item) => item.hasAttribute("data-active")),
    select(index: number) {
      const item = items[index];
      if (item) setActive(item);
    },
  };
}

interface DockItemDefinition {
  active: boolean;
  href: string;
  icon: string | null;
  nodes: Node[];
  value: string;
}

/** Dock CE that consumes declarative items and owns the sliding indicator. */
export class BloraDock extends BloraElement {
  private controller: DockController | null = null;
  private definitions: DockItemDefinition[] | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["current", "label", "static"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get current(): number {
    return this.controller?.getCurrent() ?? Number(this.getAttribute("current") ?? 0);
  }

  set current(index: number) {
    this.setAttribute("current", String(index));
  }

  select(index: number): void {
    this.controller?.select(index);
  }

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-dock-item")
        .map((item) => ({
          active: item.hasAttribute("active"),
          href: item.getAttribute("href") ?? "#",
          icon: item.getAttribute("icon"),
          nodes: Array.from(item.childNodes).map((node) => node.cloneNode(true)),
          value: item.getAttribute("value") ?? "",
        }));
    }
    const current = Number(this.getAttribute("current") ?? 0);
    const root = this.ownerDocument.createElement("nav");
    root.className = "blora-dock";
    if (this.hasAttribute("static")) root.classList.add("blora-dock--static");
    root.dataset.bloraGenerated = "";
    root.setAttribute("aria-label", this.getAttribute("label") ?? "底部导航");
    this.definitions.forEach((definition, index) => {
      const item = this.ownerDocument.createElement("a");
      item.className = "blora-dock__item";
      item.href = definition.href;
      item.dataset.value = definition.value;
      if (definition.active || index === current) item.dataset.active = "";
      if (definition.icon) {
        const icon = createBloraIcon(definition.icon as BloraIconName, 20, this.ownerDocument);
        if (icon.childElementCount) item.appendChild(icon);
      }
      item.append(...definition.nodes.map((node) => node.cloneNode(true)));
      root.appendChild(item);
    });
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
    const root = this.querySelector<HTMLElement>(".blora-dock");
    if (!root) return;
    this.controller = createDockController(root);
    this.listen(root, "blora-dock-change", (event) => {
      const index = (event as CustomEvent<{ index: number }>).detail.index;
      this.reflecting = true;
      this.setAttribute("current", String(index));
      this.reflecting = false;
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraDock(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_DOCK_TAG)) return;
  registry.define(BLORA_DOCK_TAG, BloraDock);
}
