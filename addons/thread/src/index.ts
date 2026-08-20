/**
 * Blora Design 2.0 - Thread add-on (forum comment stream).
 *
 * Business fields remain consumer-authored. The controller owns only:
 * - automatic long-comment folding by rendered height;
 * - the gradient/blur fold affordance and floating button;
 * - comment reaction state;
 * - composer edit / preview tabs.
 * @packageDocumentation
 */

import { createBloraIcon } from "@bloret-crew/blora-design";

export interface ThreadOptions {
  /** Collapsed comment-body height in pixels. Default: 158. */
  collapseHeight?: number;
  /** Default label for a collapsed long comment. Default: 展开评论. */
  expandLabel?: string;
  /** Default label for an expanded long comment. Default: 收起评论. */
  collapseLabel?: string;
}

export interface ThreadController {
  /** Re-measure all comments and add/remove automatic fold controls. */
  refresh(): void;
  /** Expand one long comment. */
  expandComment(comment: HTMLElement): void;
  /** Collapse one long comment. */
  collapseComment(comment: HTMLElement): void;
  /** Toggle one long comment between expanded and collapsed. */
  toggleComment(comment: HTMLElement): void;
  /** Toggle a reaction button (`data-blora-thread-react`). */
  toggleReact(btn: HTMLElement): void;
  /** Switch the composer between edit / preview tabs. */
  setComposerTab(composer: HTMLElement, tab: string): void;
  /** Remove listeners, generated controls and inline measurement state. */
  destroy(): void;
}

const DEFAULT_COLLAPSE_HEIGHT = 158;
const DEFAULT_EXPAND = "展开评论";
const DEFAULT_COLLAPSE = "收起评论";

interface CommentState {
  body: HTMLElement;
  fold: HTMLElement;
  button: HTMLButtonElement;
}

function commentsIn(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(".blora-thread-comment, [data-blora-thread-comment]"),
  );
}

function labelsFor(
  comment: HTMLElement,
  options: Required<Pick<ThreadOptions, "expandLabel" | "collapseLabel">>,
): { expand: string; collapse: string } {
  return {
    expand: comment.getAttribute("data-label-expand") || options.expandLabel,
    collapse: comment.getAttribute("data-label-collapse") || options.collapseLabel,
  };
}

/** Create a comment-stream controller. */
export function createThreadController(
  root: HTMLElement,
  options?: ThreadOptions,
): ThreadController {
  if (typeof document === "undefined") {
    return {
      refresh: () => {},
      expandComment: () => {},
      collapseComment: () => {},
      toggleComment: () => {},
      toggleReact: () => {},
      setComposerTab: () => {},
      destroy: () => {},
    };
  }

  const defaults = {
    collapseHeight: Math.max(1, options?.collapseHeight ?? DEFAULT_COLLAPSE_HEIGHT),
    expandLabel: options?.expandLabel ?? DEFAULT_EXPAND,
    collapseLabel: options?.collapseLabel ?? DEFAULT_COLLAPSE,
  };
  const doc = root.ownerDocument;
  const abortController = new AbortController();
  const { signal } = abortController;
  const states = new Map<HTMLElement, CommentState>();
  const initialized = new WeakSet<HTMLElement>();
  let refreshQueued = false;
  let mutationObserver: MutationObserver | null = null;

  function bodyFor(comment: HTMLElement): HTMLElement | null {
    return comment.querySelector<HTMLElement>(".blora-thread-comment__body");
  }

  function heightFor(comment: HTMLElement): number {
    const raw = Number(comment.getAttribute("data-collapse-height"));
    return Number.isFinite(raw) && raw > 0 ? raw : defaults.collapseHeight;
  }

  function setButtonContent(comment: HTMLElement, button: HTMLButtonElement): void {
    const labels = labelsFor(comment, defaults);
    const expanded = !comment.hasAttribute("data-collapsed");
    button.replaceChildren(
      createBloraIcon(expanded ? "arrow-up" : "chevron-down", 16, doc),
      doc.createTextNode(expanded ? labels.collapse : labels.expand),
    );
    button.setAttribute("aria-expanded", String(expanded));
  }

  function ensureFold(comment: HTMLElement, body: HTMLElement): CommentState {
    const existing = states.get(comment);
    if (existing) return existing;

    const fold = doc.createElement("div");
    fold.className = "blora-thread-comment__fold";
    fold.dataset.bloraGenerated = "";

    const button = doc.createElement("button");
    button.type = "button";
    button.className = "blora-button";
    button.dataset.variant = "outline";
    button.dataset.size = "sm";
    button.dataset.bloraThreadCommentFold = "";
    button.addEventListener("click", () => toggleComment(comment), { signal });
    fold.appendChild(button);

    body.insertAdjacentElement("afterend", fold);
    const state = { body, fold, button };
    states.set(comment, state);
    return state;
  }

  function measureComment(comment: HTMLElement): void {
    const body = bodyFor(comment);
    if (!body) return;
    const collapseHeight = heightFor(comment);

    // Temporarily remove the clamp so scrollHeight reflects the complete body.
    const wasCollapsed = comment.hasAttribute("data-collapsed");
    comment.removeAttribute("data-collapsed");
    body.style.removeProperty("--blora-thread-collapse-height");
    const fullHeight = body.scrollHeight;

    if (fullHeight <= collapseHeight + 1) {
      comment.removeAttribute("data-collapsible");
      comment.removeAttribute("data-collapsed");
      states.get(comment)?.fold.remove();
      states.delete(comment);
      return;
    }

    comment.setAttribute("data-collapsible", "");
    body.style.setProperty("--blora-thread-collapse-height", `${collapseHeight}px`);
    const state = ensureFold(comment, body);
    if (wasCollapsed || !initialized.has(comment)) {
      comment.setAttribute("data-collapsed", "");
    }
    initialized.add(comment);
    setButtonContent(comment, state.button);
  }

  function doRefresh(): void {
    mutationObserver?.disconnect();
    commentsIn(root).forEach(measureComment);
    mutationObserver?.observe(root, { childList: true, characterData: true, subtree: true });
  }

  function doExpandComment(comment: HTMLElement): void {
    if (!comment.hasAttribute("data-collapsible")) return;
    comment.removeAttribute("data-collapsed");
    const state = states.get(comment);
    if (state) setButtonContent(comment, state.button);
  }

  function doCollapseComment(comment: HTMLElement): void {
    if (!comment.hasAttribute("data-collapsible")) return;
    comment.setAttribute("data-collapsed", "");
    const state = states.get(comment);
    if (state) setButtonContent(comment, state.button);
  }

  function toggleComment(comment: HTMLElement): void {
    if (comment.hasAttribute("data-collapsed")) doExpandComment(comment);
    else doCollapseComment(comment);
  }

  function doToggleReact(btn: HTMLElement): void {
    const active = !btn.hasAttribute("data-active");
    btn.toggleAttribute("data-active", active);
    btn.setAttribute("aria-pressed", String(active));
  }

  root.querySelectorAll<HTMLElement>("[data-blora-thread-react]").forEach((btn) => {
    btn.addEventListener("click", () => doToggleReact(btn), { signal });
  });

  function doSetComposerTab(composer: HTMLElement, tab: string): void {
    composer.setAttribute("data-tab", tab);
    for (const item of composer.querySelectorAll<HTMLElement>("[data-blora-thread-tab]")) {
      const active = item.getAttribute("data-tab") === tab;
      item.toggleAttribute("data-active", active);
      item.setAttribute("aria-selected", String(active));
    }
  }

  root.querySelectorAll<HTMLElement>("[data-blora-thread-tab]").forEach((tab) => {
    tab.addEventListener(
      "click",
      () => {
        const composer = tab.closest<HTMLElement>(".blora-thread-composer");
        if (composer) doSetComposerTab(composer, tab.getAttribute("data-tab") || "edit");
      },
      { signal },
    );
  });

  function scheduleRefresh(): void {
    if (refreshQueued) return;
    refreshQueued = true;
    queueMicrotask(() => {
      refreshQueued = false;
      doRefresh();
    });
  }

  const win = doc.defaultView;
  const resizeObserver =
    typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleRefresh) : null;
  // Observe the thread width, not each folded body: observing body height would
  // feed the controller's own max-height change back into another measurement.
  resizeObserver?.observe(root);
  mutationObserver =
    typeof MutationObserver !== "undefined" ? new MutationObserver(scheduleRefresh) : null;
  mutationObserver?.observe(root, { childList: true, characterData: true, subtree: true });
  win?.addEventListener("load", scheduleRefresh, { signal });
  scheduleRefresh();

  return {
    refresh: doRefresh,
    expandComment: doExpandComment,
    collapseComment: doCollapseComment,
    toggleComment,
    toggleReact: doToggleReact,
    setComposerTab: doSetComposerTab,
    destroy: () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      abortController.abort();
      for (const [comment, state] of states) {
        state.fold.remove();
        state.body.style.removeProperty("--blora-thread-collapse-height");
        comment.removeAttribute("data-collapsible");
        comment.removeAttribute("data-collapsed");
      }
      states.clear();
    },
  };
}
