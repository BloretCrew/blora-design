/**
 * Blora Design 2.0 - Copy controller (clipboard only).
 * Text-rotate lives in @bloret-crew/blora-design-effects — not here.
 */

export interface CopyController {
  destroy(): void;
}

export function createCopyController(root: HTMLElement): CopyController {
  const btn = root.querySelector<HTMLElement>(
    ".blora-copy__btn, .blora-typo-copy__btn, [data-copy]",
  );
  if (!btn) return { destroy: () => {} };

  let originalNodes: Node[] = [];
  let restoreTimer: ReturnType<typeof setTimeout> | null = null;

  const createCheckmark = (): SVGElement => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "14");
    svg.setAttribute("height", "14");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M20 6L9 17l-5-5");
    svg.appendChild(path);
    return svg;
  };

  const onClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text =
      root.getAttribute("data-blora-copy") ||
      root.dataset.copyText ||
      btn.dataset.copyText ||
      root.textContent?.trim() ||
      "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        // noop
      }
      ta.remove();
    }

    originalNodes = Array.from(btn.childNodes);
    btn.replaceChildren(createCheckmark());
    root.setAttribute("data-copied", "");
    if (restoreTimer) clearTimeout(restoreTimer);
    restoreTimer = setTimeout(() => {
      btn.replaceChildren(...originalNodes);
      root.removeAttribute("data-copied");
    }, 1500);
  };

  btn.addEventListener("click", onClick);

  return {
    destroy() {
      btn.removeEventListener("click", onClick);
      if (restoreTimer) clearTimeout(restoreTimer);
    },
  };
}
