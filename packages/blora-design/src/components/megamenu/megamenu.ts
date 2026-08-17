/**
 * Blora Design 2.0 - Megamenu controller
 * Stays in core (product decision). Baseline: v1 initMegamenu.
 */
import { BloraElement } from "../../core/blora-element.js";

export const BLORA_MEGAMENU_TAG = "blora-megamenu";

export interface MegamenuController {
  open(): void;
  close(): void;
  destroy(): void;
}

/** v1 initMegamenu parity: data-open, panel fit, Escape, exclusive open. */
export function createMegamenuController(root: HTMLElement): MegamenuController {
  if (typeof document === "undefined") {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }

  const doc = root.ownerDocument;
  const win = doc.defaultView;
  const trigger =
    root.querySelector<HTMLElement>("[data-blora-megamenu-trigger], .blora-megamenu__trigger") ||
    root.querySelector<HTMLElement>("button");
  const panel = root.querySelector<HTMLElement>(".blora-megamenu__panel");
  if (!trigger || !panel || !win) {
    return { open: () => {}, close: () => {}, destroy: () => {} };
  }

  if (!panel.id) {
    panel.id = `blora-megamenu-${Math.random().toString(36).slice(2, 9)}`;
  }
  trigger.setAttribute("aria-controls", panel.id);
  trigger.setAttribute("aria-haspopup", "true");
  trigger.setAttribute("aria-expanded", "false");

  const positionPanel = () => {
    if (!root.hasAttribute("data-open")) return;
    if (typeof win.matchMedia === "function" && win.matchMedia("(max-width: 900px)").matches)
      return;
    panel.style.setProperty("--blora-megamenu-offset", "0px");
    const rect = panel.getBoundingClientRect();
    const gutter =
      parseFloat(win.getComputedStyle(panel).getPropertyValue("--blora-space-4")) || 16;
    let offset = Math.min(0, win.innerWidth - gutter - rect.right);
    if (rect.left + offset < gutter) offset += gutter - (rect.left + offset);
    panel.style.setProperty("--blora-megamenu-offset", `${offset}px`);
  };

  const setOpen = (open: boolean, focus = false) => {
    if (open) {
      doc
        .querySelectorAll<HTMLElement>(
          "[data-blora-megamenu][data-open], .blora-megamenu[data-open]",
        )
        .forEach((other) => {
          if (other === root) return;
          other.removeAttribute("data-open");
          other.classList.remove("is-open");
          const ot = other.querySelector<HTMLElement>(
            "[data-blora-megamenu-trigger], .blora-megamenu__trigger",
          );
          ot?.setAttribute("aria-expanded", "false");
        });
      root.setAttribute("data-open", "");
      root.classList.add("is-open");
    } else {
      root.removeAttribute("data-open");
      root.classList.remove("is-open");
    }
    trigger.setAttribute("aria-expanded", String(open));
    root.dispatchEvent(
      new CustomEvent("blora-megamenu-toggle", { bubbles: true, detail: { open } }),
    );
    if (open) win.requestAnimationFrame(positionPanel);
    if (open && focus) {
      panel.querySelector<HTMLElement>("a, button")?.focus();
    }
  };

  const onTriggerClick = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(!root.hasAttribute("data-open"));
  };

  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true, true);
    }
  };

  const onMenuKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      trigger.focus();
    }
  };

  const onPanelClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  };

  const onDocClick = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) setOpen(false);
  };

  trigger.addEventListener("click", onTriggerClick);
  trigger.addEventListener("keydown", onTriggerKey);
  root.addEventListener("keydown", onMenuKey);
  panel.addEventListener("click", onPanelClick);
  doc.addEventListener("click", onDocClick);
  win.addEventListener("resize", positionPanel);

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    destroy() {
      trigger.removeEventListener("click", onTriggerClick);
      trigger.removeEventListener("keydown", onTriggerKey);
      root.removeEventListener("keydown", onMenuKey);
      panel.removeEventListener("click", onPanelClick);
      doc.removeEventListener("click", onDocClick);
      win.removeEventListener("resize", positionPanel);
    },
  };
}

interface MegamenuSectionDefinition {
  nodes: Node[];
  title: string;
}

/** Megamenu CE that owns trigger, panel and section grid structure. */
export class BloraMegamenu extends BloraElement {
  private controller: MegamenuController | null = null;
  private definitions: MegamenuSectionDefinition[] | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["label", "open"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  open(): void {
    this.controller?.open();
  }

  close(): void {
    this.controller?.close();
  }

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-megamenu-section")
        .map((item) => ({
          nodes: Array.from(item.childNodes).map((node) => node.cloneNode(true)),
          title: item.getAttribute("title") ?? "",
        }));
    }
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-megamenu";
    root.dataset.bloraGenerated = "";
    root.dataset.bloraMegamenu = "";
    const trigger = this.ownerDocument.createElement("button");
    trigger.className = "blora-button blora-megamenu__trigger";
    trigger.type = "button";
    trigger.dataset.variant = "outline";
    trigger.dataset.bloraMegamenuTrigger = "";
    trigger.textContent = this.getAttribute("label") ?? "浏览产品";
    const panel = this.ownerDocument.createElement("div");
    panel.className = "blora-megamenu__panel";
    const grid = this.ownerDocument.createElement("div");
    grid.className = "blora-megamenu__grid";
    this.definitions.forEach((definition) => {
      const section = this.ownerDocument.createElement("div");
      const title = this.ownerDocument.createElement("div");
      title.className = "blora-megamenu__title";
      title.textContent = definition.title;
      section.appendChild(title);
      definition.nodes.forEach((node) => {
        const copy = node.cloneNode(true);
        if (copy instanceof this.ownerDocument.defaultView!.HTMLAnchorElement)
          copy.classList.add("blora-megamenu__link");
        section.appendChild(copy);
      });
      grid.appendChild(section);
    });
    panel.appendChild(grid);
    root.append(trigger, panel);
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
    const root = this.querySelector<HTMLElement>(".blora-megamenu");
    if (!root) return;
    this.controller = createMegamenuController(root);
    this.listen(root, "blora-megamenu-toggle", (event) => {
      const open = (event as CustomEvent<{ open: boolean }>).detail.open;
      this.reflecting = true;
      this.toggleAttribute("open", open);
      this.reflecting = false;
    });
    if (this.hasAttribute("open")) this.controller.open();
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraMegamenu(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_MEGAMENU_TAG)) return;
  registry.define(BLORA_MEGAMENU_TAG, BloraMegamenu);
}
