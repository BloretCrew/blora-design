/**
 * Blora Design 2.0 - Splitter controller
 * Draggable divider to resize two panes.
 */
import { BloraElement } from "../../core/blora-element.js";

export const BLORA_SPLITTER_TAG = "blora-splitter";

export interface SplitterController {
  destroy(): void;
  getPosition(): number;
  setPosition(percent: number): void;
}

export function createSplitterController(root: HTMLElement): SplitterController {
  const doc = root.ownerDocument;
  const panes = Array.from(root.querySelectorAll<HTMLElement>(".blora-splitter__pane"));
  if (panes.length < 2) return { destroy: () => {}, getPosition: () => 50, setPosition: () => {} };

  // Insert a handle between panes if not present
  let handle = root.querySelector<HTMLElement>(".blora-splitter__handle");
  if (!handle) {
    handle = doc.createElement("div");
    handle.className = "blora-splitter__handle";
    const grip = doc.createElement("span");
    grip.className = "blora-splitter__grip";
    handle.appendChild(grip);
    root.insertBefore(handle, panes[1]!);
  }

  const min = Number(root.dataset.min ?? 50);
  let dragging = false;
  let position = Number(root.dataset.position ?? 50);

  handle.tabIndex = 0;
  handle.setAttribute("role", "separator");
  handle.setAttribute("aria-orientation", "vertical");

  const setPosition = (percent: number, emit = false) => {
    const rect = root.getBoundingClientRect();
    const minPct = rect.width > 0 ? (min / rect.width) * 100 : 0;
    position = Math.max(minPct, Math.min(100 - minPct, percent));
    panes[0]!.style.flex = `0 0 ${position}%`;
    panes[1]!.style.flex = "1 1 0%";
    handle!.setAttribute("aria-valuenow", String(Math.round(position)));
    if (emit)
      root.dispatchEvent(
        new CustomEvent("blora-splitter-change", {
          bubbles: true,
          detail: { position },
        }),
      );
  };

  const onDown = (e: PointerEvent) => {
    dragging = true;
    handle!.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const rect = root.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;

    setPosition(pct, true);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setPosition(position + (e.key === "ArrowRight" ? 2 : -2), true);
  };

  const onUp = (e: PointerEvent) => {
    dragging = false;
    try {
      handle!.releasePointerCapture(e.pointerId);
    } catch {
      // noop
    }
  };

  handle.addEventListener("pointerdown", onDown);
  handle.addEventListener("pointermove", onMove);
  handle.addEventListener("pointerup", onUp);
  handle.addEventListener("keydown", onKey);
  setPosition(position);

  return {
    destroy() {
      handle!.removeEventListener("pointerdown", onDown);
      handle!.removeEventListener("pointermove", onMove);
      handle!.removeEventListener("pointerup", onUp);
      handle!.removeEventListener("keydown", onKey);
    },
    getPosition: () => position,
    setPosition: (percent: number) => setPosition(percent, true),
  };
}

interface SplitterPaneDefinition {
  nodes: Node[];
  style: string;
}

/** Splitter CE that consumes exactly two pane definitions and owns the separator. */
export class BloraSplitter extends BloraElement {
  private controller: SplitterController | null = null;
  private definitions: SplitterPaneDefinition[] | null = null;
  private reflecting = false;

  static get observedAttributes(): string[] {
    return ["position", "min"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal || this.reflecting) return;
    this.sync();
  }

  get position(): number {
    return this.controller?.getPosition() ?? Number(this.getAttribute("position") ?? 50);
  }

  set position(percent: number) {
    this.setAttribute("position", String(percent));
  }

  setPosition(percent: number): void {
    this.controller?.setPosition(percent);
  }

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-splitter-pane")
        .slice(0, 2)
        .map((item) => ({
          nodes: Array.from(item.childNodes).map((node) => node.cloneNode(true)),
          style: item.getAttribute("style") ?? "",
        }));
    }
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-splitter";
    root.dataset.bloraGenerated = "";
    root.dataset.min = this.getAttribute("min") ?? "50";
    root.dataset.position = this.getAttribute("position") ?? "50";
    this.definitions.forEach((definition) => {
      const pane = this.ownerDocument.createElement("div");
      pane.className = "blora-splitter__pane";
      pane.style.cssText = definition.style;
      pane.append(...definition.nodes.map((node) => node.cloneNode(true)));
      root.appendChild(pane);
    });
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-splitter");
    if (!root) return;
    const min = this.getAttribute("min");
    if (min) root.dataset.min = min;
    const position = this.getAttribute("position");
    if (position) {
      root.dataset.position = position;
      this.controller?.setPosition(Number(position));
    }
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-splitter");
    if (!root) return;
    this.controller?.destroy();
    this.controller = createSplitterController(root);
    this.listen(root, "blora-splitter-change", (event) => {
      const position = (event as CustomEvent<{ position: number }>).detail.position;
      this.reflecting = true;
      this.setAttribute("position", String(position));
      this.reflecting = false;
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraSplitter(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_SPLITTER_TAG)) return;
  registry.define(BLORA_SPLITTER_TAG, BloraSplitter);
}
