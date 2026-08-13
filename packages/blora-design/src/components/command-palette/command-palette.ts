/**
 * Blora Design 2.0 - Command Palette controller
 * Filter items, keyboard nav, adaptive ⌘/Ctrl shortcuts.
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon, type BloraIconName } from "../../core/icons.js";
import { createSearchController, type SearchController } from "../search/search.js";

export const BLORA_COMMAND_TAG = "blora-command";

export interface CommandPaletteController {
  destroy(): void;
}

function modKey(): string {
  if (typeof navigator !== "undefined") {
    const p = navigator.platform || "";
    const ua = navigator.userAgent || "";
    if (/Mac|iPhone|iPad|iPod/i.test(p) || /Mac OS X/i.test(ua)) return "⌘";
  }
  return "Ctrl+";
}

export function createCommandPaletteController(root: HTMLElement): CommandPaletteController {
  const input = root.querySelector<HTMLInputElement>("input");
  const results =
    root.querySelector<HTMLElement>(".blora-cmdk-results, .blora-command__results") || root;
  const items = () =>
    Array.from(results.querySelectorAll<HTMLElement>(".blora-cmdk-item, .blora-command__item"));

  // Adaptive kbd labels
  const mod = modKey();
  root
    .querySelectorAll<HTMLElement>("kbd[data-keys], .blora-command__kbd, .blora-cmdk-kbd")
    .forEach((kbd) => {
      const keys = kbd.dataset.keys || kbd.textContent || "";
      // Replace leading ⌘ or Ctrl with platform mod
      kbd.textContent = keys.replace(/^(⌘|Ctrl\+?|ctrl\+?)/, mod === "⌘" ? "⌘" : "Ctrl+");
      if (!kbd.dataset.keys) kbd.dataset.keys = keys;
    });

  let active = 0;

  const paint = () => {
    const list = items().filter((el) => el.style.display !== "none");
    list.forEach((el, i) => {
      el.toggleAttribute("data-active", i === active);
      el.classList.toggle("is-active", i === active);
    });
  };

  const filter = () => {
    const q = (input?.value || "").trim().toLowerCase();
    let first = -1;
    items().forEach((el, i) => {
      const label = (el.textContent || "").toLowerCase();
      const show = !q || label.includes(q);
      el.style.display = show ? "" : "none";
      if (show && first < 0) first = i;
    });
    active = 0;
    paint();
  };

  const onKey = (e: KeyboardEvent) => {
    const visible = items().filter((el) => el.style.display !== "none");
    if (!visible.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      active = Math.min(visible.length - 1, active + 1);
      paint();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      active = Math.max(0, active - 1);
      paint();
    } else if (e.key === "Enter") {
      e.preventDefault();
      visible[active]?.click();
    }
  };

  items().forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const visible = items().filter((x) => x.style.display !== "none");
      active = visible.indexOf(el);
      paint();
    });
    el.addEventListener("click", () => {
      root.dispatchEvent(
        new CustomEvent("blora:command", {
          bubbles: true,
          detail: { label: el.textContent?.trim() },
        }),
      );
    });
  });

  input?.addEventListener("input", filter);
  input?.addEventListener("keydown", onKey);
  paint();

  return {
    destroy() {
      input?.removeEventListener("input", filter);
      input?.removeEventListener("keydown", onKey);
    },
  };
}

interface CommandItemDefinition {
  disabled: boolean;
  icon: BloraIconName;
  label: string;
  shortcut: string;
  value: string;
}

const COMMAND_ICONS = new Set<BloraIconName>(["document", "folder", "search", "settings"]);

/** Composite CE that owns the command search and official result item tree. */
export class BloraCommand extends BloraElement {
  private controller: CommandPaletteController | null = null;
  private searchController: SearchController | null = null;
  private definitions: CommandItemDefinition[] | null = null;

  static get observedAttributes(): string[] {
    return ["placeholder"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal) return;
    this.sync();
  }

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-command-item")
        .map((item) => {
          const requested = (item.getAttribute("icon") ?? "document") as BloraIconName;
          const label = item.getAttribute("label") ?? item.textContent?.trim() ?? "";
          return {
            disabled: item.hasAttribute("disabled"),
            icon: COMMAND_ICONS.has(requested) ? requested : "document",
            label,
            shortcut: item.getAttribute("shortcut") ?? "",
            value: item.getAttribute("value") ?? label,
          };
        });
    }

    const root = document.createElement("div");
    root.className = "blora-command";
    root.dataset.bloraGenerated = "";
    const searchWrap = document.createElement("div");
    searchWrap.className = "blora-command__search";
    const search = document.createElement("div");
    search.className = "blora-search";
    const icon = document.createElement("span");
    icon.className = "blora-search__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.appendChild(createBloraIcon("search"));
    const input = document.createElement("input");
    input.className = "blora-input";
    input.type = "search";
    input.placeholder = this.getAttribute("placeholder") ?? "输入命令或搜索...";
    const clear = document.createElement("button");
    clear.className = "blora-search__clear";
    clear.type = "button";
    clear.hidden = true;
    clear.setAttribute("aria-label", "清除");
    clear.appendChild(createBloraIcon("close"));
    search.append(icon, input, clear);
    searchWrap.appendChild(search);

    const results = document.createElement("div");
    results.className = "blora-cmdk-results blora-command__results";
    this.definitions.forEach((definition, index) => {
      const item = document.createElement("div");
      item.className = "blora-cmdk-item blora-command__item";
      item.dataset.value = definition.value;
      if (index === 0) item.dataset.active = "";
      if (definition.disabled) {
        item.dataset.disabled = "";
        item.setAttribute("aria-disabled", "true");
      }
      const itemIcon = document.createElement("span");
      itemIcon.appendChild(createBloraIcon(definition.icon));
      const text = document.createElement("span");
      text.className = "blora-text-sm";
      text.textContent = definition.label;
      item.append(itemIcon, text);
      if (definition.shortcut) {
        const kbd = document.createElement("kbd");
        kbd.className = "blora-command__kbd";
        kbd.dataset.keys = definition.shortcut;
        kbd.textContent = definition.shortcut;
        item.appendChild(kbd);
      }
      results.appendChild(item);
    });

    root.append(searchWrap, results);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const input = this.querySelector<HTMLInputElement>(".blora-search .blora-input, .blora-input");
    if (input) input.placeholder = this.getAttribute("placeholder") ?? input.placeholder;
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-command");
    const search = root?.querySelector<HTMLElement>(".blora-search");
    if (!root) return;
    this.controller?.destroy();
    this.searchController?.destroy();
    this.controller = createCommandPaletteController(root);
    if (search) this.searchController = createSearchController(search);
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.searchController?.destroy();
    this.controller = null;
    this.searchController = null;
  }
}

export function defineBloraCommand(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_COMMAND_TAG)) return;
  registry.define(BLORA_COMMAND_TAG, BloraCommand);
}
