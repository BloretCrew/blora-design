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

/**
 * Blora Design 2.0 - Transfer controller
 * Moves checked items between source and target panels.
 */
export interface TransferController {
  destroy(): void;
}

export function createTransferController(root: HTMLElement): TransferController {
  const panels = root.querySelectorAll<HTMLElement>(".blora-transfer__panel");
  const buttons = root.querySelectorAll<HTMLElement>(".blora-transfer__action, [data-transfer]");
  if (panels.length < 2 || buttons.length === 0) return { destroy: () => {} };

  const sourcePanel = panels[0]!;
  const targetPanel = panels[1]!;
  const sourceList = sourcePanel.querySelector<HTMLElement>(".blora-transfer__list");
  const targetList = targetPanel.querySelector<HTMLElement>(".blora-transfer__list");

  const updateHeads = () => {
    const sourceHead = sourcePanel.querySelector(".blora-transfer__head");
    const targetHead = targetPanel.querySelector(".blora-transfer__head");
    if (sourceHead) {
      const count = sourceList?.querySelectorAll(".blora-transfer__row").length ?? 0;
      sourceHead.textContent = `候选 · ${count}`;
    }
    if (targetHead) {
      const count = targetList?.querySelectorAll(".blora-transfer__row").length ?? 0;
      targetHead.textContent = `已选 · ${count}`;
    }
  };

  const move = (direction: string) => {
    if (direction === "right" || direction === "to-right") {
      const checked = Array.from(
        sourceList?.querySelectorAll<HTMLInputElement>(".blora-transfer__row input:checked") ?? [],
      );
      checked.forEach((input) => {
        const row = input.closest(".blora-transfer__row");
        if (row && targetList) {
          input.checked = false;
          targetList.appendChild(row);
        }
      });
    } else {
      const checked = Array.from(
        targetList?.querySelectorAll<HTMLInputElement>(".blora-transfer__row input:checked") ?? [],
      );
      checked.forEach((input) => {
        const row = input.closest(".blora-transfer__row");
        if (row && sourceList) {
          input.checked = false;
          sourceList.appendChild(row);
        }
      });
    }
    updateHeads();
  };

  const onClick = (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-transfer]");
    if (!btn) return;
    e.preventDefault();
    move(btn.dataset.transfer ?? "right");
  };

  root.addEventListener("click", onClick);

  return {
    destroy() {
      root.removeEventListener("click", onClick);
    },
  };
}

/**
 * Blora Design 2.0 - Field controller
 * v1 text-limit: overflow characters highlighted red via mirror layer.
 */
export interface FieldController {
  destroy(): void;
}

export function createFieldController(root: HTMLElement): FieldController {
  const inputs = root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "[data-limit], [data-blora-limit]",
  );
  const cleanupFns: (() => void)[] = [];

  const splitValue = (value: string, limit: number) => {
    const chars = Array.from(value || "");
    return {
      count: chars.length,
      normal: chars.slice(0, limit).join(""),
      overflow: chars.slice(limit).join(""),
    };
  };

  inputs.forEach((field) => {
    const limit = Number(field.dataset.limit ?? field.dataset.bloraLimit ?? 0);
    if (!Number.isFinite(limit) || limit < 1) return;

    field.removeAttribute("maxlength");
    let wrapper = field.closest<HTMLElement>(".blora-limit");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "blora-limit";
      field.parentNode?.insertBefore(wrapper, field);
      wrapper.appendChild(field);
    }
    wrapper.classList.toggle("blora-limit--textarea", field.tagName === "TEXTAREA");

    let mirror = wrapper.querySelector<HTMLElement>(".blora-limit__mirror");
    let normal: HTMLElement;
    let overflow: HTMLElement;
    let counter: HTMLElement;

    if (!mirror) {
      mirror = document.createElement("div");
      mirror.className = "blora-limit__mirror";
      mirror.setAttribute("aria-hidden", "true");
      const mirrorInner = document.createElement("span");
      mirrorInner.className = "blora-limit__mirror-inner";
      normal = document.createElement("span");
      overflow = document.createElement("span");
      overflow.className = "blora-limit__overflow";
      mirrorInner.append(normal, overflow);
      mirror.appendChild(mirrorInner);
      counter = document.createElement("span");
      counter.className = "blora-limit__count";
      counter.setAttribute("aria-live", "polite");
      wrapper.append(mirror, counter);
    } else {
      normal = mirror.querySelector(
        ".blora-limit__mirror-inner > span:not(.blora-limit__overflow)",
      )!;
      overflow = mirror.querySelector(".blora-limit__overflow")!;
      counter = wrapper.querySelector(".blora-limit__count")!;
    }

    const syncScroll = () => {
      const inner = mirror!.querySelector<HTMLElement>(".blora-limit__mirror-inner");
      if (inner) inner.style.transform = `translateX(${-field.scrollLeft}px)`;
      mirror!.scrollTop = field.scrollTop;
    };

    const update = () => {
      const state = splitValue(field.value, limit);
      const over = state.count > limit;
      normal.textContent = state.normal || "";
      overflow.textContent = state.overflow || "";
      counter.textContent = `${state.count}/${limit}`;
      if (over) wrapper!.setAttribute("data-over-limit", "");
      else wrapper!.removeAttribute("data-over-limit");
      if (over) field.setAttribute("aria-invalid", "true");
      else field.removeAttribute("aria-invalid");
      syncScroll();
    };

    field.addEventListener("input", update);
    field.addEventListener("scroll", syncScroll);
    update();
    cleanupFns.push(() => {
      field.removeEventListener("input", update);
      field.removeEventListener("scroll", syncScroll);
    });
  });

  return {
    destroy() {
      cleanupFns.forEach((fn) => fn());
    },
  };
}
