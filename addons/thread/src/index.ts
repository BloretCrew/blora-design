/**
 * Blora Design 2.0 - Thread and Post add-on (forum thread).
 * Spec §9: Add-on package, not bundled into core.
 * Spec §17.5: Controller must have destroy().
 * Visual baseline: archived 1.x blora.js initThread (≈5684-5752)
 *                  + Bloret BBS post page comment stream.
 * @packageDocumentation
 */

export interface ThreadOptions {
  /**
   * Label for expand button when collapsed.
   * Default: `"展开评论"`. Overridden per-button by `data-label-expand`.
   */
  expandLabel?: string;
  /**
   * Label for collapse button when expanded.
   * Default: `"收起评论"`. Overridden per-button by `data-label-collapse`.
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
  /** Toggle a reaction button (`data-blora-post-react` / `data-blora-thread-react`) */
  toggleReact(btn: HTMLElement): void;
  /** Toggle a long comment body between expanded and collapsed */
  toggleCommentFold(commentCard: HTMLElement): void;
  /** Switch the composer between its tabs (edit / preview) */
  setComposerTab(composer: HTMLElement, tab: string): void;
  /** Destroy the controller, removing all event listeners */
  destroy(): void;
}

const DEFAULT_EXPAND = "展开评论";
const DEFAULT_COLLAPSE = "收起评论";

function prefersReduced(el: HTMLElement): boolean {
  const win = el.ownerDocument?.defaultView;
  return !!win?.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function ownerWin(el: HTMLElement): Window | null {
  return el.ownerDocument?.defaultView ?? null;
}

/** Find the required animated replies body. */
function findReplyBody(box: HTMLElement): HTMLElement | null {
  return box.querySelector<HTMLElement>("[data-blora-thread-body]");
}

function findToggleInBox(box: HTMLElement): HTMLElement | null {
  return box.querySelector<HTMLElement>("[data-blora-thread-toggle]");
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
 * Create a thread controller for the declared data-attribute structure:
 * expand/collapse of reply sections and long comments, post + comment
 * reactions, and composer tabs.
 *
 * @param root - Thread container marked with `[data-blora-thread]` or any ancestor
 * @param options - Default labels
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
      toggleCommentFold: () => {},
      setComposerTab: () => {},
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
    const active = !btn.hasAttribute("data-active");
    btn.toggleAttribute("data-active", active);
    btn.setAttribute("aria-pressed", String(active));
  }

  function doExpand(box: HTMLElement): void {
    const btn = findToggleInBox(box);
    const body = findReplyBody(box);
    if (!body) return;

    const labels = labelsFor(btn, labelDefaults);
    box.removeAttribute("data-collapsed");

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
      if (!box.hasAttribute("data-collapsed")) {
        body.style.maxHeight = "none";
      }
      body.removeEventListener("transitionend", onEnd);
    };
    body.addEventListener("transitionend", onEnd, { signal });

    ownerWin(root)?.setTimeout(() => {
      if (!box.hasAttribute("data-collapsed")) {
        body.style.maxHeight = "none";
      }
    }, 420);
  }

  function doCollapse(box: HTMLElement): void {
    const btn = findToggleInBox(box);
    const body = findReplyBody(box);
    if (!body) return;

    const labels = labelsFor(btn, labelDefaults);

    if (prefersReduced(root)) {
      box.setAttribute("data-collapsed", "");
      body.style.maxHeight = "";
      setToggleState(btn, false, labels);
      return;
    }

    /* 收起：先锁当前高度再收到 0 */
    body.style.maxHeight = `${body.scrollHeight}px`;
    void body.offsetHeight;
    box.setAttribute("data-collapsed", "");
    body.style.maxHeight = "0px";
    setToggleState(btn, false, labels);
  }

  function doToggle(box: HTMLElement): void {
    if (box.hasAttribute("data-collapsed")) {
      doExpand(box);
    } else {
      doCollapse(box);
    }
  }

  /* —— reply toggle buttons —— */
  const toggleButtons = root.querySelectorAll<HTMLElement>("[data-blora-thread-toggle]");

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

  /* —— long-comment fold —— */
  function doToggleCommentFold(comment: HTMLElement): void {
    comment.toggleAttribute("data-collapsed");
  }

  const commentFoldButtons = root.querySelectorAll<HTMLElement>("[data-blora-thread-comment-fold]");
  commentFoldButtons.forEach((btn) => {
    btn.addEventListener(
      "click",
      () => {
        const comment =
          btn.closest<HTMLElement>(".blora-thread-comment") ??
          btn.closest<HTMLElement>("[data-blora-thread-comment]");
        if (!comment) return;
        doToggleCommentFold(comment);
      },
      { signal },
    );
  });

  /* —— post + comment reactions —— */
  const reactButtons = root.querySelectorAll<HTMLElement>(
    "[data-blora-post-react], [data-blora-thread-react]",
  );
  reactButtons.forEach((btn) => {
    btn.addEventListener(
      "click",
      () => {
        doToggleReact(btn);
      },
      { signal },
    );
  });

  /* —— composer tabs —— */
  function doSetComposerTab(composer: HTMLElement, tab: string): void {
    composer.setAttribute("data-tab", tab);
    for (const t of composer.querySelectorAll<HTMLElement>("[data-blora-thread-tab]")) {
      t.toggleAttribute("data-active", t.getAttribute("data-tab") === tab);
      t.setAttribute("aria-selected", String(t.getAttribute("data-tab") === tab));
    }
  }

  const composerTabs = root.querySelectorAll<HTMLElement>("[data-blora-thread-tab]");
  composerTabs.forEach((tab) => {
    tab.addEventListener(
      "click",
      () => {
        const composer = tab.closest<HTMLElement>(".blora-thread-composer");
        const name = tab.getAttribute("data-tab") || "edit";
        if (!composer) return;
        doSetComposerTab(composer, name);
      },
      { signal },
    );
  });

  return {
    toggle: doToggle,
    expand: doExpand,
    collapse: doCollapse,
    toggleReact: doToggleReact,
    toggleCommentFold: doToggleCommentFold,
    setComposerTab: doSetComposerTab,
    destroy: () => {
      abortController.abort();
    },
  };
}
