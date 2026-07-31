/**
 * Blora Design 2.0 - Thread and Post add-on.
 * Spec §9: Add-on package, not bundled into core.
 * Spec §17.5: Controller must have destroy().
 * Visual baseline: legacy/v1/blora.js lines 5683-5750.
 * @packageDocumentation
 */

export interface ThreadOptions {
  /** Label for expand button (default: "Expand replies") */
  expandLabel?: string;
  /** Label for collapse button (default: "Collapse replies") */
  collapseLabel?: string;
}

export interface ThreadController {
  /** Toggle a reply box between expanded and collapsed */
  toggle(replyBox: HTMLElement): void;
  /** Expand a reply box */
  expand(replyBox: HTMLElement): void;
  /** Collapse a reply box */
  collapse(replyBox: HTMLElement): void;
  /** Destroy the controller, removing all event listeners */
  destroy(): void;
}

function prefersReduced(el: HTMLElement): boolean {
  const win = el.ownerDocument?.defaultView;
  return !!win?.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function findReplyBody(box: HTMLElement): HTMLElement | null {
  return (
    box.querySelector<HTMLElement>("[data-blora-thread-body], .blora-post__replies-body") ?? null
  );
}

function findToggleButton(thread: HTMLElement): HTMLElement | null {
  return (
    thread.querySelector<HTMLElement>("[data-blora-thread-toggle], .blora-post__collapse") ?? null
  );
}

/**
 * Create a thread controller for managing expand/collapse of reply sections.
 *
 * @param root - The thread container element
 * @param options - Labels and configuration
 * @returns A controller with toggle, expand, collapse, and destroy methods
 */
export function createThreadController(
  root: HTMLElement,
  options?: ThreadOptions,
): ThreadController {
  if (typeof document === "undefined") {
    return {
      toggle: () => {},
      expand: () => {},
      collapse: () => {},
      destroy: () => {},
    };
  }

  const expandLabel = options?.expandLabel ?? "Expand replies";
  const collapseLabel = options?.collapseLabel ?? "Collapse replies";
  const abortController = new AbortController();
  const { signal } = abortController;

  // Find all toggle buttons and attach click listeners
  const toggleButtons = root.querySelectorAll<HTMLElement>(
    "[data-blora-thread-toggle], .blora-post__collapse",
  );

  toggleButtons.forEach((btn) => {
    btn.addEventListener(
      "click",
      () => {
        const box =
          btn.closest<HTMLElement>("[data-blora-thread-replies]") ??
          root.querySelector<HTMLElement>("[data-blora-thread-replies]") ??
          btn.closest<HTMLElement>(".blora-post__replies");
        if (!box) return;
        doToggle(box);
      },
      { signal },
    );
  });

  function doToggle(box: HTMLElement): void {
    const isCollapsed = box.classList.contains("is-collapsed");
    if (isCollapsed) {
      doExpand(box);
    } else {
      doCollapse(box);
    }
  }

  function doExpand(box: HTMLElement): void {
    const body = findReplyBody(box);
    if (!body) return;

    box.classList.remove("is-collapsed");

    const btn = findToggleButton(root);
    if (btn) {
      btn.textContent = collapseLabel;
      btn.setAttribute("aria-expanded", "true");
    }

    if (prefersReduced(root)) {
      body.style.maxHeight = "";
      return;
    }

    body.style.maxHeight = "0px";
    void body.offsetHeight;
    body.style.maxHeight = `${body.scrollHeight}px`;

    const onEnd = (e: TransitionEvent): void => {
      if (e.propertyName && e.propertyName !== "max-height") return;
      if (!box.classList.contains("is-collapsed")) {
        body.style.maxHeight = "none";
      }
      body.removeEventListener("transitionend", onEnd);
    };
    body.addEventListener("transitionend", onEnd, { signal });

    // Fallback: ensure max-height is released
    const win = root.ownerDocument?.defaultView;
    win?.setTimeout(() => {
      if (!box.classList.contains("is-collapsed")) {
        body.style.maxHeight = "none";
      }
    }, 420);
  }

  function doCollapse(box: HTMLElement): void {
    const body = findReplyBody(box);
    if (!body) return;

    if (prefersReduced(root)) {
      box.classList.add("is-collapsed");
      body.style.maxHeight = "";
      const btn = findToggleButton(root);
      if (btn) {
        btn.textContent = expandLabel;
        btn.setAttribute("aria-expanded", "false");
      }
      return;
    }

    body.style.maxHeight = `${body.scrollHeight}px`;
    void body.offsetHeight;
    box.classList.add("is-collapsed");
    body.style.maxHeight = "0px";

    const btn = findToggleButton(root);
    if (btn) {
      btn.textContent = expandLabel;
      btn.setAttribute("aria-expanded", "false");
    }
  }

  return {
    toggle: doToggle,
    expand: doExpand,
    collapse: doCollapse,
    destroy: () => {
      abortController.abort();
    },
  };
}
