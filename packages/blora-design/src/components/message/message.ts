/**
 * Message service — Ant Design style floating pills (top-center).
 *
 * Visual: `.blora-message` (same CSS as static inline pills).
 * Pair with Notification (card + title/desc + corner placement).
 * There is no separate Toast product API in Blora 2.0.
 */

import { createStatusIcon } from "../../core/status-icon.js";

export type MessageType = "info" | "success" | "warning" | "danger";

export interface MessageOptions {
  /** Body text (Ant: content) */
  content?: string;
  /** Alias of `content` (optional) */
  message?: string;
  type?: MessageType | "error";
  /** Auto-close ms; 0 = stay until closed. Default 3000. */
  duration?: number;
}

export interface MessageHandle {
  close(): void;
  el: HTMLElement;
}

export interface MessageApi {
  (opts: MessageOptions | string): MessageHandle | null;
  open(opts: MessageOptions): MessageHandle | null;
  success(content: string, duration?: number): MessageHandle | null;
  info(content: string, duration?: number): MessageHandle | null;
  warning(content: string, duration?: number): MessageHandle | null;
  danger(content: string, duration?: number): MessageHandle | null;
  /** Ant alias → `danger` */
  error(content: string, duration?: number): MessageHandle | null;
}

const CONTAINER_CLASS = "blora-message-container";

function normalizeType(type?: MessageOptions["type"]): MessageType {
  if (type === "error" || type === "danger") return "danger";
  if (type === "success" || type === "warning" || type === "info") return type;
  return "info";
}

function ensureContainer(doc: Document): HTMLElement {
  let c = doc.querySelector<HTMLElement>(`.${CONTAINER_CLASS}`);
  if (!c) {
    c = doc.createElement("div");
    c.className = `${CONTAINER_CLASS} blora-portal`;
    c.setAttribute("data-blora-message-root", "");
    (doc.body || doc.documentElement).appendChild(c);
  }
  return c;
}

function appendStatusIcon(doc: Document, host: HTMLElement, type: MessageType): void {
  const wrap = doc.createElement("span");
  wrap.className = "blora-message__icon";
  wrap.setAttribute("aria-hidden", "true");

  wrap.appendChild(createStatusIcon(doc, type, 16));
  host.appendChild(wrap);
}

/** Build the exact static pill used by the floating service. */
export function createMessageElement(
  opts: MessageOptions | string,
  doc: Document = document,
): HTMLElement {
  const options = typeof opts === "string" ? { content: opts } : opts || {};
  const type = normalizeType(options.type);
  const el = doc.createElement("span");
  el.className = "blora-message";
  el.setAttribute("data-variant", type);
  el.setAttribute("role", "status");
  appendStatusIcon(doc, el, type);
  const content = doc.createElement("span");
  content.className = "blora-message__content";
  content.textContent = (options.content ?? options.message ?? "").trim();
  el.appendChild(content);
  return el;
}

function openMessage(opts: MessageOptions): MessageHandle | null {
  if (typeof document === "undefined") return null;
  const doc = document;
  const container = ensureContainer(doc);
  const el = createMessageElement(opts, doc);

  container.appendChild(el);

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    el.classList.add("is-leaving");
    window.setTimeout(() => {
      el.remove();
      if (container.childElementCount === 0) container.remove();
    }, 200);
  };

  const ms = opts.duration == null ? 3000 : opts.duration;
  if (ms > 0) window.setTimeout(close, ms);

  return { close, el };
}

function callMessage(opts: MessageOptions | string): MessageHandle | null {
  if (typeof opts === "string") return openMessage({ content: opts });
  return openMessage(opts || {});
}

function typed(type: MessageType) {
  return (content: string, duration?: number): MessageHandle | null => {
    const opts: MessageOptions = { content, type };
    if (duration !== undefined) opts.duration = duration;
    return openMessage(opts);
  };
}

export const message: MessageApi = Object.assign(callMessage, {
  open: (opts: MessageOptions) => openMessage(opts || {}),
  success: typed("success"),
  info: typed("info"),
  warning: typed("warning"),
  danger: typed("danger"),
  error: typed("danger"),
});
