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
/**
 * Create a thread controller for expand/collapse of reply sections and post reactions.
 * Matches v1 `initThread` behaviour.
 *
 * @param root - Thread container (`.blora-thread` / `[data-blora-thread]`) or any ancestor
 * @param options - Default labels (Chinese v1 defaults)
 */
export declare function createThreadController(root: HTMLElement, options?: ThreadOptions): ThreadController;
//# sourceMappingURL=index.d.ts.map