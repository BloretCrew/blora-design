/**
 * Blora Design 2.0 - Command Palette controller
 * Filter items, keyboard nav, adaptive ⌘/Ctrl shortcuts.
 */
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
