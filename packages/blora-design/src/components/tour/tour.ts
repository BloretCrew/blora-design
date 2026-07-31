/**
 * Blora Design 2.0 - Tour controller
 * Steps through highlighted elements with a tooltip.
 */
export interface TourController {
  destroy(): void;
}

export function createTourController(root: HTMLElement): TourController {
  const startBtn = root.querySelector<HTMLElement>("[data-tour-start]");
  const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-tour-step]"));
  if (steps.length === 0) return { destroy: () => {} };

  let current = -1;
  let overlay: HTMLElement | null = null;
  let tooltip: HTMLElement | null = null;

  const createOverlay = () => {
    overlay = document.createElement("div");
    overlay.className = "blora-tour__overlay";
    document.body.appendChild(overlay);

    tooltip = document.createElement("div");
    tooltip.className = "blora-tour__tooltip";
    tooltip.innerHTML = `
      <div class="blora-tour__title"></div>
      <div class="blora-tour__desc"></div>
      <div class="blora-tour__footer">
        <span class="blora-tour__counter"></span>
        <div class="blora-tour__buttons">
          <button class="blora-tour__skip" type="button">跳过</button>
          <button class="blora-tour__prev" type="button">上一步</button>
          <button class="blora-tour__next" type="button">下一步</button>
        </div>
      </div>`;
    document.body.appendChild(tooltip);

    tooltip.querySelector(".blora-tour__skip")!.addEventListener("click", end);
    tooltip.querySelector(".blora-tour__prev")!.addEventListener("click", () => goTo(current - 1));
    tooltip.querySelector(".blora-tour__next")!.addEventListener("click", () => {
      if (current < steps.length - 1) goTo(current + 1);
      else end();
    });
  };

  const goTo = (idx: number) => {
    current = Math.max(0, Math.min(idx, steps.length - 1));
    const step = steps[current]!;
    const rect = step.getBoundingClientRect();

    overlay!.style.position = "fixed";
    overlay!.style.boxShadow = `0 0 0 9999px color-mix(in srgb, var(--blora-color-text-primary) 45%, transparent)`;
    overlay!.style.borderRadius = "var(--blora-radius-sm)";
    overlay!.style.top = `${rect.top - 4}px`;
    overlay!.style.left = `${rect.left - 4}px`;
    overlay!.style.width = `${rect.width + 8}px`;
    overlay!.style.height = `${rect.height + 8}px`;
    overlay!.style.zIndex = "var(--blora-z-toast)";

    tooltip!.querySelector(".blora-tour__title")!.textContent =
      step.dataset.tourTitle ?? "";
    tooltip!.querySelector(".blora-tour__desc")!.textContent =
      step.dataset.tourDesc ?? "";
    tooltip!.querySelector(".blora-tour__counter")!.textContent =
      `${current + 1} / ${steps.length}`;

    const nextBtn = tooltip!.querySelector<HTMLElement>(".blora-tour__next")!;
    nextBtn.textContent = current < steps.length - 1 ? "下一步" : "完成";
    tooltip!.querySelector<HTMLElement>(".blora-tour__prev")!.style.visibility =
      current > 0 ? "visible" : "hidden";

    tooltip!.style.position = "fixed";
    tooltip!.style.top = `${rect.bottom + 12}px`;
    tooltip!.style.left = `${rect.left}px`;
    tooltip!.style.zIndex = "var(--blora-z-toast)";
    tooltip!.setAttribute("data-open", "");
  };

  const start = () => {
    createOverlay();
    goTo(0);
  };

  const end = () => {
    overlay?.remove();
    tooltip?.remove();
    overlay = null;
    tooltip = null;
    current = -1;
  };

  startBtn?.addEventListener("click", start);

  return {
    destroy() {
      end();
      startBtn?.removeEventListener("click", start);
    },
  };
}
