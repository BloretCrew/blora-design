/**
 * Steps: click/keyboard to set current step (optional interactive path).
 */
export interface StepsController {
  setCurrent(index: number): void;
  getCurrent(): number;
  destroy(): void;
}

export function createStepsController(root: HTMLElement): StepsController {
  if (typeof document === "undefined") {
    return { setCurrent: () => {}, getCurrent: () => 0, destroy: () => {} };
  }
  root.classList.add("blora-steps");
  const steps = () => Array.from(root.querySelectorAll<HTMLElement>(".blora-step, [data-blora-step]"));

  const getCurrent = () => {
    const list = steps();
    const i = list.findIndex((s) => s.hasAttribute("data-current") || s.getAttribute("data-status") === "process");
    return i >= 0 ? i : 0;
  };

  const setCurrent = (index: number) => {
    const list = steps();
    list.forEach((s, i) => {
      s.removeAttribute("data-current");
      if (i < index) s.setAttribute("data-status", "finish");
      else if (i === index) {
        s.setAttribute("data-status", "process");
        s.setAttribute("data-current", "");
      } else s.setAttribute("data-status", "wait");
      s.setAttribute("aria-current", i === index ? "step" : "false");
    });
    root.dispatchEvent(
      new CustomEvent("blora-steps-change", { bubbles: true, detail: { index } }),
    );
  };

  const onClick = (e: MouseEvent) => {
    if (root.getAttribute("data-clickable") === "false") return;
    const step = (e.target as HTMLElement).closest<HTMLElement>(".blora-step, [data-blora-step]");
    if (!step || !root.contains(step)) return;
    const list = steps();
    const i = list.indexOf(step);
    if (i >= 0) setCurrent(i);
  };

  root.addEventListener("click", onClick);
  /* normalize initial */
  setCurrent(getCurrent());

  return {
    setCurrent,
    getCurrent,
    destroy() {
      root.removeEventListener("click", onClick);
    },
  };
}
