/**
 * Blora Design 2.0 - Tabs controller
 *
 * Spec §17.3: Tabs with indicator animation and panel fade-in.
 * Ported from v1 initTabs, adapted as a destroyable headless controller.
 *
 * The CSS-only base works without this controller (tabs get a static
 * background in pills mode). When the controller is active it creates a
 * sliding indicator element and adds `data-tabs-enhanced` to the root so
 * CSS switches to the animated indicator.
 */

import { BloraElement } from "../../core/blora-element.js";

export const BLORA_TABS_TAG = "blora-tabs";

export interface TabsController {
  /** Activate a specific tab by index. */
  select(index: number, focus?: boolean): void;
  /** Destroy the controller, removing all listeners and the indicator. */
  destroy(): void;
}

/**
 * Keys that trigger tab navigation.
 */
const HORIZONTAL_KEYS = new Set(["ArrowLeft", "ArrowRight", "Home", "End"]);
const VERTICAL_KEYS = new Set(["ArrowUp", "ArrowDown", "Home", "End"]);
let tabsInstanceId = 0;

/**
 * Create a tabs controller on a `.blora-tabs` root element.
 *
 * - Creates a `.blora-tabs__indicator` element inside the nav.
 * - Handles click and keyboard navigation (APG tabs pattern).
 * - Moves the indicator with smooth CSS transitions.
 * - Fades panels in on switch via `data-entering` attribute.
 * - Repositions the indicator on resize via ResizeObserver.
 * - Cleans up all listeners and observers on `destroy()`.
 */
export function createTabsController(root: HTMLElement): TabsController {
  const abortController = new AbortController();
  const { signal } = abortController;

  const navEl = root.querySelector<HTMLElement>(".blora-tabs__nav");
  if (!navEl) {
    return { select: () => {}, destroy: () => {} };
  }
  const nav: HTMLElement = navEl;

  const tabs = Array.from(nav.querySelectorAll<HTMLElement>(".blora-tabs__tab"));
  const panels = Array.from(root.querySelectorAll<HTMLElement>(".blora-tabs__panel"));

  // Guard against SSR / missing window APIs
  const win = typeof window !== "undefined" ? window : undefined;

  // --- Create indicator ---
  const indicator = win?.document.createElement("span") ?? null;
  if (indicator) {
    indicator.className = "blora-tabs__indicator";
    indicator.setAttribute("aria-hidden", "true");
    nav.appendChild(indicator);
  }

  // Mark root as enhanced so CSS switches from static fallback to indicator
  root.setAttribute("data-tabs-enhanced", "");

  const isVertical = root.getAttribute("data-orientation") === "vertical";
  const navKeys = isVertical ? VERTICAL_KEYS : HORIZONTAL_KEYS;

  // --- ARIA setup ---
  nav.setAttribute("role", "tablist");
  tabs.forEach((tab, i) => {
    tab.setAttribute("role", "tab");
    const isActive = tab.getAttribute("aria-selected") === "true";
    if (tab.hasAttribute("disabled") || tab.getAttribute("aria-disabled") === "true") {
      tab.setAttribute("aria-disabled", "true");
      tab.tabIndex = -1;
    } else {
      tab.tabIndex = isActive ? 0 : -1;
    }
    // Link tab to panel if panel exists
    if (panels[i]) {
      const tabId = tab.id || `blora-tabs-tab-${i}`;
      const panelId = panels[i]!.id || `blora-tabs-panel-${i}`;
      if (!tab.id) tab.id = tabId;
      if (!panels[i]!.id) panels[i]!.id = panelId;
      tab.setAttribute("aria-controls", panelId);
      panels[i]!.setAttribute("role", "tabpanel");
      panels[i]!.setAttribute("aria-labelledby", tabId);
    }
  });

  // --- Indicator movement ---
  function moveIndicator(tab: HTMLElement | undefined, instant: boolean): void {
    if (!indicator || !tab) return;
    if (instant) {
      indicator.setAttribute("data-instant", "");
    } else {
      indicator.removeAttribute("data-instant");
    }
    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    indicator.style.setProperty("--blora-tab-x", `${tabRect.left - navRect.left}px`);
    indicator.style.setProperty("--blora-tab-y", `${tabRect.top - navRect.top}px`);
    indicator.style.setProperty("--blora-tab-w", `${tabRect.width}px`);
    indicator.style.setProperty("--blora-tab-h", `${tabRect.height}px`);

    if (instant && win) {
      win.requestAnimationFrame(() => {
        indicator.removeAttribute("data-instant");
      });
    }
  }

  // --- Activate a tab ---
  function activate(tab: HTMLElement, focus: boolean): void {
    const index = tabs.indexOf(tab);
    if (index === -1) return;
    if (tab.hasAttribute("disabled") || tab.getAttribute("aria-disabled") === "true") return;

    tabs.forEach((t, i) => {
      const active = i === index;
      t.setAttribute("aria-selected", String(active));
      if (!t.hasAttribute("disabled") && t.getAttribute("aria-disabled") !== "true") {
        t.tabIndex = active ? 0 : -1;
      }
    });

    panels.forEach((p, i) => {
      const visible = i === index;
      p.style.display = visible ? "" : "none";
      p.setAttribute("aria-hidden", String(!visible));
      if (visible) {
        // Restart the fade-in animation
        p.removeAttribute("data-entering");
        void p.offsetWidth; // force reflow
        p.setAttribute("data-entering", "");
      }
    });

    moveIndicator(tab, false);

    if (focus) {
      tab.focus();
    }
  }

  // --- Find initial active tab ---
  function findInitialActive(): HTMLElement | undefined {
    const explicit = tabs.find((t) => t.getAttribute("aria-selected") === "true");
    if (explicit) return explicit;
    return tabs.find(
      (t) => !t.hasAttribute("disabled") && t.getAttribute("aria-disabled") !== "true",
    );
  }

  // --- Event handlers ---
  nav.addEventListener(
    "click",
    (event: Event) => {
      const target = event.target as HTMLElement;
      const tab = target.closest<HTMLElement>(".blora-tabs__tab");
      if (!tab || !nav.contains(tab)) return;
      activate(tab, false);
    },
    { signal },
  );

  nav.addEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (!navKeys.has(event.key)) return;

      const enabled = tabs.filter(
        (t) => !t.hasAttribute("disabled") && t.getAttribute("aria-disabled") !== "true",
      );
      if (enabled.length === 0) return;

      const current = enabled.indexOf(document.activeElement as HTMLElement);
      let targetIndex: number;

      if (event.key === "Home") {
        targetIndex = 0;
      } else if (event.key === "End") {
        targetIndex = enabled.length - 1;
      } else {
        const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
        targetIndex = (Math.max(current, 0) + step + enabled.length) % enabled.length;
      }

      event.preventDefault();
      activate(enabled[targetIndex]!, true);
    },
    { signal },
  );

  // --- Initial indicator position (instant, no animation) ---
  moveIndicator(findInitialActive(), true);

  // --- Ensure only the initial panel is visible ---
  const initialActive = findInitialActive();
  const initialIndex = initialActive ? tabs.indexOf(initialActive) : 0;
  panels.forEach((p, i) => {
    const visible = i === initialIndex;
    p.style.display = visible ? "" : "none";
    p.setAttribute("aria-hidden", String(!visible));
  });

  // --- Resize observer for indicator repositioning ---
  let resizeObserver: ResizeObserver | undefined;
  if (win && typeof ResizeObserver !== "undefined") {
    resizeObserver = new win.ResizeObserver(() => {
      const active = tabs.find((t) => t.getAttribute("aria-selected") === "true");
      moveIndicator(active, true);
    });
    resizeObserver.observe(nav);
  }

  return {
    select(index: number, focus = false): void {
      const tab = tabs[index];
      if (tab) activate(tab, focus);
    },
    destroy(): void {
      abortController.abort();
      resizeObserver?.disconnect();
      indicator?.remove();
      root.removeAttribute("data-tabs-enhanced");
    },
  };
}

interface TabDefinition {
  content: Node[];
  disabled: boolean;
  label: string;
  selected: boolean;
  value: string;
}

/** Composite CE. Child `<blora-tab>` definitions become the supported tablist/panel tree. */
export class BloraTabs extends BloraElement {
  private controller: TabsController | null = null;
  private definitions: TabDefinition[] | null = null;
  private reflecting = false;
  private readonly instanceId = ++tabsInstanceId;

  static get observedAttributes(): string[] {
    return ["flush", "value", "variant", "orientation"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal) return;
    if (name === "value") {
      if (!this.reflecting) this.activateFromValue();
      return;
    }
    this.sync();
  }

  select(index: number, focus = false): void {
    this.controller?.select(index, focus);
    this.reflectValueFromIndex(index);
  }

  protected render(): void {
    if (!this.definitions) this.definitions = this.readDefinitions();
    if (!this.definitions.length && this.querySelector(".blora-tabs")) return;

    const selectedValue =
      this.getAttribute("value") ??
      this.definitions.find((definition) => definition.selected)?.value ??
      this.definitions.find((definition) => !definition.disabled)?.value;
    const root = document.createElement("div");
    root.className = "blora-tabs";
    root.dataset.bloraGenerated = "";
    const nav = document.createElement("div");
    nav.className = "blora-tabs__nav";
    root.appendChild(nav);

    this.definitions.forEach((definition, index) => {
      const tab = document.createElement("button");
      tab.className = "blora-tabs__tab";
      tab.type = "button";
      tab.id = `blora-tabs-tab-${this.instanceId}-${index}`;
      tab.dataset.value = definition.value;
      tab.disabled = definition.disabled;
      tab.textContent = definition.label;
      tab.setAttribute("aria-selected", String(definition.value === selectedValue));
      nav.appendChild(tab);
    });

    this.definitions.forEach((definition, index) => {
      const panel = document.createElement("div");
      panel.className = "blora-tabs__panel";
      panel.id = `blora-tabs-panel-${this.instanceId}-${index}`;
      panel.append(...definition.content);
      root.appendChild(panel);
    });
    this.replaceChildren(root);
    this.syncChrome(root);
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-tabs");
    if (!root) return;
    this.controller?.destroy();
    this.controller = createTabsController(root);
    this.listen(root, "click", (event) => {
      const tab = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>(
        ".blora-tabs__tab",
      );
      if (!tab || !root.contains(tab) || tab.disabled) return;
      this.reflectValue(tab.dataset.value ?? "");
    });
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-tabs");
    if (!root) return;
    this.syncChrome(root);
    this.controller?.destroy();
    this.controller = createTabsController(root);
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }

  private readDefinitions(): TabDefinition[] {
    const items = Array.from(this.children).filter((item) => item.localName === "blora-tab");
    if (items.length) {
      return items.map((item) => {
        const label = item.getAttribute("label") ?? "";
        return {
          content: Array.from(item.childNodes),
          disabled: item.hasAttribute("disabled"),
          label,
          selected: item.hasAttribute("selected"),
          value: item.getAttribute("value") ?? label,
        };
      });
    }
    const tabs = Array.from(this.querySelectorAll<HTMLButtonElement>(".blora-tabs__tab"));
    const panels = Array.from(this.querySelectorAll<HTMLElement>(".blora-tabs__panel"));
    return tabs.map((tab, index) => ({
      content: Array.from(panels[index]?.childNodes ?? []),
      disabled: tab.disabled,
      label: tab.textContent ?? "",
      selected: tab.getAttribute("aria-selected") === "true",
      value: tab.dataset.value ?? tab.textContent ?? "",
    }));
  }

  private syncChrome(root: HTMLElement): void {
    const variant = this.getAttribute("variant");
    const orientation = this.getAttribute("orientation");
    if (variant) root.dataset.variant = variant;
    else delete root.dataset.variant;
    if (orientation) root.dataset.orientation = orientation;
    else delete root.dataset.orientation;
    root.toggleAttribute("data-flush", this.hasAttribute("flush"));
  }

  private activateFromValue(): void {
    const value = this.getAttribute("value") ?? "";
    const tabs = Array.from(this.querySelectorAll<HTMLElement>(".blora-tabs__tab"));
    const index = tabs.findIndex((tab) => (tab.dataset.value ?? "") === value);
    if (index >= 0) this.controller?.select(index);
  }

  private reflectValueFromIndex(index: number): void {
    const tab = this.querySelectorAll<HTMLElement>(".blora-tabs__tab")[index];
    if (tab) this.reflectValue(tab.dataset.value ?? "");
  }

  private reflectValue(value: string): void {
    if ((this.getAttribute("value") ?? "") === value) return;
    this.reflecting = true;
    if (value) this.setAttribute("value", value);
    else this.removeAttribute("value");
    this.reflecting = false;
    this.emit("blora-change", { value });
  }
}

export function defineBloraTabs(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_TABS_TAG)) return;
  registry.define(BLORA_TABS_TAG, BloraTabs);
}
