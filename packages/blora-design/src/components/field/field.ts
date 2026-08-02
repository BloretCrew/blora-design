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
