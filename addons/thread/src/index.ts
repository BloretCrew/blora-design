/**
 * Blora Design 2.0 - Thread add-on.
 *
 * Timeline owns comment-stream ordering and its connecting rail. This add-on
 * provides two open composite custom elements: one comment card with automatic
 * long-content folding, and one comment composer shell.
 * @packageDocumentation
 */

import { BloraElement, createBloraIcon, t } from "@bloret-crew/blora-design";

export const BLORA_THREAD_COMMENT_TAG = "blora-thread-comment";
export const BLORA_THREAD_COMPOSER_TAG = "blora-thread-composer";

const DEFAULT_COLLAPSE_HEIGHT = 158;
const DEFAULT_EXPAND = () => t("thread.expand");
const DEFAULT_COLLAPSE = () => t("thread.collapse");

interface CommentAssigned {
  body: Node[];
  head: Node[];
  quote: Node[];
  reactions: Node[];
}

function commentSlot(node: Node): keyof CommentAssigned {
  if (node.nodeType !== Node.ELEMENT_NODE) return "body";
  const slot = (node as HTMLElement).getAttribute("slot");
  if (slot === "head" || slot === "quote") return slot;
  if (slot === "reactions" || slot === "react") return "reactions";
  return "body";
}

/** One forum-style comment card with automatic per-comment long-content folding. */
export class BloraThreadComment extends BloraElement {
  private assigned: CommentAssigned | null = null;
  private body: HTMLElement | null = null;
  private fold: HTMLElement | null = null;
  private foldButton: HTMLButtonElement | null = null;
  private initialized = false;
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private refreshQueued = false;

  static get observedAttributes(): string[] {
    return ["collapse-height", "label-expand", "label-collapse"];
  }

  attributeChangedCallback(): void {
    if (this.isConnectedInternal) this.scheduleRefresh();
  }

  get collapsible(): boolean {
    return this.hasAttribute("data-collapsible");
  }

  get collapsed(): boolean {
    return this.hasAttribute("data-collapsed");
  }

  refresh(): void {
    this.measure();
  }

  expand(): void {
    if (!this.collapsible) return;
    this.removeAttribute("data-collapsed");
    this.syncFoldButton();
  }

  collapse(): void {
    if (!this.collapsible) return;
    this.setAttribute("data-collapsed", "");
    this.syncFoldButton();
  }

  toggle(): void {
    if (this.collapsed) this.expand();
    else this.collapse();
  }

  protected render(): void {
    this.classList.add("blora-thread-comment");
    const assigned = this.takeAssigned();
    const doc = this.ownerDocument;
    const card = doc.createElement("article");
    card.className = "blora-thread-comment__card";
    card.dataset.bloraGenerated = "";

    if (assigned.head.length) {
      const head = doc.createElement("header");
      head.className = "blora-thread-comment__head";
      head.append(...this.take(assigned.head));
      card.append(head);
    }

    if (assigned.quote.length) {
      const quote = doc.createElement("div");
      quote.className = "blora-thread-comment__quote";
      quote.append(...this.take(assigned.quote));
      card.append(quote);
    }

    const body = doc.createElement("div");
    body.className = "blora-thread-comment__body";
    body.id = this.id
      ? `${this.id}-body`
      : `blora-thread-body-${Math.random().toString(36).slice(2, 9)}`;
    body.append(...this.take(assigned.body));
    card.append(body);
    this.body = body;

    if (assigned.reactions.length) {
      const reactions = doc.createElement("div");
      reactions.className = "blora-thread-comment__react";
      reactions.append(...this.take(assigned.reactions));
      card.append(reactions);
    }

    this.replaceChildren(card);
    this.setAttribute("data-blora-ready", "");
  }

  protected bindEvents(): void {
    this.listen(this, "click", (event) => {
      const target = event.target as Element | null;
      const fold = target?.closest<HTMLElement>("[data-blora-thread-comment-fold]");
      if (fold && this.contains(fold)) {
        this.toggle();
        return;
      }
      const reaction = target?.closest<HTMLElement>("[data-blora-thread-react]");
      if (!reaction || !this.contains(reaction)) return;
      const active = !reaction.hasAttribute("data-active");
      reaction.toggleAttribute("data-active", active);
      reaction.setAttribute("aria-pressed", String(active));
    });

    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.scheduleRefresh());
      this.resizeObserver.observe(this);
    }
    if (this.body && typeof MutationObserver !== "undefined") {
      this.mutationObserver = new MutationObserver(() => this.scheduleRefresh());
      this.mutationObserver.observe(this.body, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
    this.ownerDocument.defaultView?.addEventListener("load", () => this.scheduleRefresh(), {
      signal: this.abortController.signal,
    });
    this.scheduleRefresh();
  }

  protected onDisconnect(): void {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
  }

  private takeAssigned(): CommentAssigned {
    if (!this.assigned) {
      const assigned: CommentAssigned = { body: [], head: [], quote: [], reactions: [] };
      for (const node of Array.from(this.childNodes)) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as HTMLElement).hasAttribute("data-blora-generated")
        ) {
          continue;
        }
        if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) continue;
        assigned[commentSlot(node)].push(node);
      }
      this.assigned = assigned;
    }
    return this.assigned;
  }

  private take(nodes: Node[]): Node[] {
    for (const node of nodes) node.parentNode?.removeChild(node);
    return nodes;
  }

  private scheduleRefresh(): void {
    if (this.refreshQueued) return;
    this.refreshQueued = true;
    queueMicrotask(() => {
      this.refreshQueued = false;
      this.measure();
    });
  }

  private collapseHeight(): number {
    const value = Number(this.getAttribute("collapse-height"));
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_COLLAPSE_HEIGHT;
  }

  private measure(): void {
    const body = this.body;
    if (!body) return;
    const fullHeight = body.scrollHeight;
    const collapseHeight = this.collapseHeight();

    if (fullHeight <= collapseHeight + 1) {
      this.removeAttribute("data-collapsible");
      this.removeAttribute("data-collapsed");
      body.style.removeProperty("--blora-thread-collapse-height");
      body.style.removeProperty("--blora-thread-content-height");
      this.fold?.remove();
      this.fold = null;
      this.foldButton = null;
      return;
    }

    this.setAttribute("data-collapsible", "");
    body.style.setProperty("--blora-thread-collapse-height", `${collapseHeight}px`);
    body.style.setProperty("--blora-thread-content-height", `${fullHeight}px`);
    this.ensureFold();
    if (!this.initialized) this.setAttribute("data-collapsed", "");
    this.initialized = true;
    this.syncFoldButton();
  }

  private ensureFold(): void {
    if (this.fold || !this.body) return;
    const fold = this.ownerDocument.createElement("div");
    fold.className = "blora-thread-comment__fold";
    fold.dataset.bloraGenerated = "";
    const button = this.ownerDocument.createElement("button");
    button.type = "button";
    button.className = "blora-button";
    button.dataset.variant = "outline";
    button.dataset.size = "sm";
    button.dataset.bloraThreadCommentFold = "";
    button.setAttribute("aria-controls", this.body.id);
    fold.append(button);
    this.body.insertAdjacentElement("afterend", fold);
    this.fold = fold;
    this.foldButton = button;
  }

  private syncFoldButton(): void {
    if (!this.foldButton) return;
    const expanded = !this.collapsed;
    const label = expanded
      ? this.getAttribute("label-collapse") || DEFAULT_COLLAPSE()
      : this.getAttribute("label-expand") || DEFAULT_EXPAND();
    this.foldButton.replaceChildren(
      createBloraIcon(expanded ? "arrow-up" : "chevron-down", 16, this.ownerDocument),
      this.ownerDocument.createTextNode(label),
    );
    this.foldButton.setAttribute("aria-expanded", String(expanded));
  }
}

interface ComposerAssigned {
  actions: Node[];
  editor: Node[];
  preview: Node[];
  toolbar: Node[];
}

function composerSlot(node: Node): keyof ComposerAssigned {
  if (node.nodeType !== Node.ELEMENT_NODE) return "editor";
  const slot = (node as HTMLElement).getAttribute("slot");
  if (slot === "toolbar" || slot === "actions" || slot === "preview") return slot;
  return "editor";
}

/** Open comment composer shell; consumers own toolbar and submit behavior. */
export class BloraThreadComposer extends BloraElement {
  private assigned: ComposerAssigned | null = null;
  private indicatorObserver: ResizeObserver | null = null;

  static get observedAttributes(): string[] {
    return ["tab", "edit-label", "preview-label"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal) return;
    if (name === "tab") this.setTab(this.getAttribute("tab") || "edit", false);
    else this.syncLabels();
  }

  get tab(): string {
    return this.getAttribute("tab") === "preview" ? "preview" : "edit";
  }

  set tab(value: string) {
    this.setAttribute("tab", value === "preview" ? "preview" : "edit");
  }

  setTab(tab: string, emit = true): void {
    const next = tab === "preview" ? "preview" : "edit";
    if (this.getAttribute("tab") !== next) this.setAttribute("tab", next);
    this.dataset.tab = next;
    for (const item of this.querySelectorAll<HTMLElement>("[data-blora-thread-tab]")) {
      const active = item.dataset.tab === next;
      item.toggleAttribute("data-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    }
    const preview = this.querySelector<HTMLElement>(".blora-thread-composer__preview");
    if (preview) preview.hidden = next !== "preview";
    this.moveTabIndicator();
    if (emit) this.emit("blora-thread-tab-change", { tab: next });
  }

  /** Slide the tab pill to the active option, mirroring the segmented control. */
  private moveTabIndicator(): void {
    const tabs = this.querySelector<HTMLElement>(".blora-thread-composer__tabs");
    const active = tabs?.querySelector<HTMLElement>("[data-blora-thread-tab][data-active]");
    const indicator = tabs?.querySelector<HTMLElement>(".blora-thread-composer__tabs-indicator");
    if (!tabs || !active || !indicator) return;
    const tabsRect = tabs.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    indicator.style.left = `${activeRect.left - tabsRect.left}px`;
    indicator.style.width = `${activeRect.width}px`;
  }

  protected render(): void {
    this.classList.add("blora-thread-composer");
    const assigned = this.takeAssigned();
    const doc = this.ownerDocument;

    if (assigned.toolbar.length) {
      const toolbar = doc.createElement("div");
      toolbar.className = "blora-thread-composer__toolbar";
      toolbar.dataset.bloraGenerated = "";
      toolbar.append(...this.take(assigned.toolbar));
      this.append(toolbar);
    }

    const tabs = doc.createElement("div");
    tabs.className = "blora-thread-composer__tabs";
    tabs.dataset.bloraGenerated = "";
    tabs.setAttribute("role", "tablist");
    const indicator = doc.createElement("span");
    indicator.className = "blora-thread-composer__tabs-indicator";
    indicator.setAttribute("aria-hidden", "true");
    tabs.appendChild(indicator);
    for (const tab of ["edit", "preview"]) {
      const button = doc.createElement("button");
      button.type = "button";
      button.dataset.bloraThreadTab = "";
      button.dataset.tab = tab;
      button.setAttribute("role", "tab");
      tabs.append(button);
    }
    this.append(tabs);

    for (const node of this.take(assigned.editor)) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).localName === "textarea") {
        (node as HTMLElement).classList.add("blora-thread-composer__input");
      }
      this.append(node);
    }

    if (assigned.preview.length) {
      const preview = doc.createElement("div");
      preview.className = "blora-thread-composer__preview";
      preview.dataset.bloraGenerated = "";
      preview.setAttribute("role", "tabpanel");
      preview.append(...this.take(assigned.preview));
      this.append(preview);
    }

    if (assigned.actions.length) {
      const actions = doc.createElement("div");
      actions.className = "blora-thread-composer__footer";
      actions.dataset.bloraGenerated = "";
      actions.append(...this.take(assigned.actions));
      this.append(actions);
    }

    this.setAttribute("data-blora-ready", "");
    this.syncLabels();
    this.setTab(this.tab, false);
  }

  protected bindEvents(): void {
    const tabs = this.querySelector<HTMLElement>(".blora-thread-composer__tabs");
    if (tabs && typeof ResizeObserver !== "undefined") {
      this.indicatorObserver?.disconnect();
      this.indicatorObserver = new ResizeObserver(() => this.moveTabIndicator());
      this.indicatorObserver.observe(tabs);
    }
    this.listen(this, "click", (event) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-blora-thread-tab]",
      );
      if (target && this.contains(target)) this.setTab(target.dataset.tab || "edit");
    });
    this.listen(this, "keydown", (event) => {
      const keyEvent = event as KeyboardEvent;
      const target = (keyEvent.target as Element | null)?.closest<HTMLElement>(
        "[data-blora-thread-tab]",
      );
      if (!target || !["ArrowLeft", "ArrowRight"].includes(keyEvent.key)) return;
      keyEvent.preventDefault();
      const next = keyEvent.key === "ArrowRight" ? "preview" : "edit";
      this.setTab(next);
      this.querySelector<HTMLElement>(`[data-blora-thread-tab][data-tab="${next}"]`)?.focus();
    });
  }

  protected onDisconnect(): void {
    this.indicatorObserver?.disconnect();
    this.indicatorObserver = null;
  }

  private takeAssigned(): ComposerAssigned {
    if (!this.assigned) {
      const assigned: ComposerAssigned = { actions: [], editor: [], preview: [], toolbar: [] };
      for (const node of Array.from(this.childNodes)) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as HTMLElement).hasAttribute("data-blora-generated")
        ) {
          continue;
        }
        if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) continue;
        assigned[composerSlot(node)].push(node);
      }
      this.assigned = assigned;
    }
    return this.assigned;
  }

  private take(nodes: Node[]): Node[] {
    for (const node of nodes) node.parentNode?.removeChild(node);
    return nodes;
  }

  private syncLabels(): void {
    const edit = this.querySelector<HTMLElement>('[data-blora-thread-tab][data-tab="edit"]');
    const preview = this.querySelector<HTMLElement>('[data-blora-thread-tab][data-tab="preview"]');
    if (edit) edit.textContent = this.getAttribute("edit-label") || t("thread.edit");
    if (preview) preview.textContent = this.getAttribute("preview-label") || t("thread.preview");
  }
}

export function defineBloraThreadElements(registry: CustomElementRegistry = customElements): void {
  if (!registry.get(BLORA_THREAD_COMMENT_TAG)) {
    registry.define(BLORA_THREAD_COMMENT_TAG, BloraThreadComment);
  }
  if (!registry.get(BLORA_THREAD_COMPOSER_TAG)) {
    registry.define(BLORA_THREAD_COMPOSER_TAG, BloraThreadComposer);
  }
}

if (typeof customElements !== "undefined") defineBloraThreadElements(customElements);
