/**
 * Blora Design 2.0 - Thread and Post add-on.
 * Spec §9: Add-on package, not bundled into core.
 * Spec §17.5: Controller must have destroy().
 * Visual baseline: legacy/v1/blora.js initThread (≈5684-5752)
 *                  + legacy/showcase-v1.html 论坛跟帖 demo.
 * @packageDocumentation
 */

export interface ThreadOptions {
  /**
   * Label for expand button when collapsed.
   * Default: `"展开评论"` (v1). Overridden per-button by `data-label-expand`.
   */
  expandLabel?: string;
  /**
   * Label for collapse button when expanded.
   * Default: `"收起评论"` (v1). Overridden per-button by `data-label-collapse`.
   */
  collapseLabel?: string;
}

export interface ThreadController {
  /** Toggle a reply box between expanded and collapsed */
  toggle(replyBox: HTMLElement): void;
  /** Expand a reply box */
  expand(replyBox: HTMLElement): void;
  /** Collapse a reply box */
  collapse(replyBox: HTMLElement): void;
  /** Toggle a post reaction button (`data-blora-post-react`) */
  toggleReact(btn: HTMLElement): void;
  /** Destroy the controller, removing all event listeners */
  destroy(): void;
}

const DEFAULT_EXPAND = "展开评论";
const DEFAULT_COLLAPSE = "收起评论";

function prefersReduced(el: HTMLElement): boolean {
  const win = el.ownerDocument?.defaultView;
  return !!win?.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function ownerDoc(el: HTMLElement): Document {
  return el.ownerDocument ?? document;
}

function ownerWin(el: HTMLElement): Window | null {
  return el.ownerDocument?.defaultView ?? null;
}

/** Find or synthesize the animated replies body (v1 compatibility). */
function ensureReplyBody(box: HTMLElement, toggleBtn: HTMLElement | null): HTMLElement | null {
  let body = box.querySelector<HTMLElement>("[data-blora-thread-body], .blora-post__replies-body");
  if (body) return body;

  /* v1 兼容：无 body 时把帖子包一层再动画 */
  const doc = ownerDoc(box);
  body = doc.createElement("div");
  body.className = "blora-post__replies-body";
  body.setAttribute("data-blora-thread-body", "");

  Array.from(box.children).forEach((el) => {
    if (el === toggleBtn) return;
    if (el instanceof HTMLElement && el.classList.contains("blora-post")) {
      body!.appendChild(el);
    }
  });

  if (toggleBtn && toggleBtn.parentElement === box) {
    box.insertBefore(body, toggleBtn);
  } else {
    box.appendChild(body);
  }
  return body;
}

function findToggleInBox(box: HTMLElement): HTMLElement | null {
  return (
    box.querySelector<HTMLElement>("[data-blora-thread-toggle], .blora-post__collapse") ?? null
  );
}

function labelsFor(
  btn: HTMLElement | null,
  options: Required<Pick<ThreadOptions, "expandLabel" | "collapseLabel">>,
): { expand: string; collapse: string } {
  return {
    expand: btn?.getAttribute("data-label-expand") || options.expandLabel,
    collapse: btn?.getAttribute("data-label-collapse") || options.collapseLabel,
  };
}

function setToggleState(
  btn: HTMLElement | null,
  expanded: boolean,
  labels: { expand: string; collapse: string },
): void {
  if (!btn) return;
  btn.textContent = expanded ? labels.collapse : labels.expand;
  btn.setAttribute("aria-expanded", String(expanded));
}

/**
 * Create a thread controller for expand/collapse of reply sections and post reactions.
 * Matches v1 `initThread` behaviour.
 *
 * @param root - Thread container (`.blora-thread` / `[data-blora-thread]`) or any ancestor
 * @param options - Default labels (Chinese v1 defaults)
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
      toggleReact: () => {},
      destroy: () => {},
    };
  }

  const labelDefaults = {
    expandLabel: options?.expandLabel ?? DEFAULT_EXPAND,
    collapseLabel: options?.collapseLabel ?? DEFAULT_COLLAPSE,
  };
  const abortController = new AbortController();
  const { signal } = abortController;

  function doToggleReact(btn: HTMLElement): void {
    btn.classList.toggle("is-active");
    btn.setAttribute("aria-pressed", String(btn.classList.contains("is-active")));
  }

  function doExpand(box: HTMLElement): void {
    const btn = findToggleInBox(box);
    const body = ensureReplyBody(box, btn);
    if (!body) return;

    const labels = labelsFor(btn, labelDefaults);
    box.classList.remove("is-collapsed");

    if (prefersReduced(root)) {
      body.style.maxHeight = "";
      setToggleState(btn, true, labels);
      return;
    }

    body.style.maxHeight = "0px";
    void body.offsetHeight;
    body.style.maxHeight = `${body.scrollHeight}px`;
    setToggleState(btn, true, labels);

    const onEnd = (e: TransitionEvent): void => {
      if (e.propertyName && e.propertyName !== "max-height") return;
      if (!box.classList.contains("is-collapsed")) {
        body.style.maxHeight = "none";
      }
      body.removeEventListener("transitionend", onEnd);
    };
    body.addEventListener("transitionend", onEnd, { signal });

    ownerWin(root)?.setTimeout(() => {
      if (!box.classList.contains("is-collapsed")) {
        body.style.maxHeight = "none";
      }
    }, 420);
  }

  function doCollapse(box: HTMLElement): void {
    const btn = findToggleInBox(box);
    const body = ensureReplyBody(box, btn);
    if (!body) return;

    const labels = labelsFor(btn, labelDefaults);

    if (prefersReduced(root)) {
      box.classList.add("is-collapsed");
      body.style.maxHeight = "";
      setToggleState(btn, false, labels);
      return;
    }

    /* 收起：先锁当前高度再收到 0 */
    body.style.maxHeight = `${body.scrollHeight}px`;
    void body.offsetHeight;
    box.classList.add("is-collapsed");
    body.style.maxHeight = "0px";
    setToggleState(btn, false, labels);
  }

  function doToggle(box: HTMLElement): void {
    if (box.classList.contains("is-collapsed")) {
      doExpand(box);
    } else {
      doCollapse(box);
    }
  }

  /* —— toggle buttons (v1: [data-blora-thread-toggle]) —— */
  const toggleButtons = root.querySelectorAll<HTMLElement>(
    "[data-blora-thread-toggle], .blora-post__collapse",
  );

  toggleButtons.forEach((btn) => {
    btn.addEventListener(
      "click",
      () => {
        const box =
          btn.closest<HTMLElement>("[data-blora-thread-replies]") ??
          btn.closest<HTMLElement>(".blora-post__replies") ??
          root.querySelector<HTMLElement>("[data-blora-thread-replies], .blora-post__replies");
        if (!box) return;
        doToggle(box);
      },
      { signal },
    );
  });

  /* —— post react (v1: [data-blora-post-react]) —— */
  const reactButtons = root.querySelectorAll<HTMLElement>("[data-blora-post-react]");
  reactButtons.forEach((btn) => {
    btn.addEventListener(
      "click",
      () => {
        doToggleReact(btn);
      },
      { signal },
    );
  });

  return {
    toggle: doToggle,
    expand: doExpand,
    collapse: doCollapse,
    toggleReact: doToggleReact,
    destroy: () => {
      abortController.abort();
    },
  };
}
