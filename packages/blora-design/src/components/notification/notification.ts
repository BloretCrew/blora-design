/**
 * Notification service with multi-placement stacks.
 * Visual must match Feedback/Notification Storybook (SVG icons + close stroke).
 */
import { t } from "../../core/i18n.js";
import { createBloraIcon } from "../../core/icons.js";
import { whenMotionDone } from "../../core/motion.js";
import { createStatusIcon } from "../../core/status-icon.js";

export type NotificationPlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left";

type NotificationType = "success" | "warning" | "danger" | "info";

export interface NotificationOptions {
  title?: string;
  description?: string;
  type?: NotificationType | "error";
  duration?: number;
  placement?: NotificationPlacement;
}

export interface NotificationHandle {
  close(): void;
  el: HTMLElement;
}

const PLACEMENT_CLASS: Record<NotificationPlacement, string> = {
  "top-right": "blora-notify-container--top-right",
  "top-left": "blora-notify-container--top-left",
  "bottom-right": "blora-notify-container--bottom-right",
  "bottom-left": "blora-notify-container--bottom-left",
};

function normalizeType(type?: NotificationOptions["type"]): NotificationType {
  if (type === "error" || type === "danger") return "danger";
  if (type === "success" || type === "warning" || type === "info") return type;
  return "info";
}

function ensureContainer(doc: Document, placement: NotificationPlacement): HTMLElement {
  const cls = PLACEMENT_CLASS[placement];
  let c = doc.querySelector<HTMLElement>(`.blora-notify-container.${cls}`);
  if (!c) {
    c = doc.createElement("div");
    c.className = `blora-notify-container ${cls} blora-portal`;
    c.setAttribute("data-placement", placement);
    (doc.body || doc.documentElement).appendChild(c);
  }
  return c;
}

function appendStatusIcon(doc: Document, host: HTMLElement, type: NotificationType): void {
  const wrap = doc.createElement("span");
  wrap.className = "blora-notification__icon";
  wrap.setAttribute("aria-hidden", "true");

  wrap.appendChild(createStatusIcon(doc, type, 22));
  host.appendChild(wrap);
}

function appendCloseButton(doc: Document, host: HTMLElement): HTMLButtonElement {
  const closeBtn = doc.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "blora-notification__close";
  closeBtn.setAttribute("aria-label", t("common.close"));
  closeBtn.appendChild(createBloraIcon("close", 16, doc));
  host.appendChild(closeBtn);
  return closeBtn;
}

/** Build the exact notification card used by notify(). */
export function createNotificationElement(
  opts: NotificationOptions | string,
  doc: Document = document,
): HTMLElement {
  const options: NotificationOptions = typeof opts === "string" ? { title: opts } : opts || {};
  const type = normalizeType(options.type);
  const el = doc.createElement("div");
  el.className = "blora-notification";
  el.setAttribute("data-variant", type);
  el.setAttribute("role", "status");
  appendStatusIcon(doc, el, type);

  const body = doc.createElement("div");
  body.className = "blora-notification__body";
  const title = doc.createElement("div");
  title.className = "blora-notification__title";
  title.textContent = options.title || options.description || "";
  body.appendChild(title);
  if (options.description && options.title) {
    const desc = doc.createElement("div");
    desc.className = "blora-notification__desc";
    desc.textContent = options.description;
    body.appendChild(desc);
  }
  el.appendChild(body);
  appendCloseButton(doc, el);
  return el;
}

export function notify(opts: NotificationOptions | string): NotificationHandle | null {
  if (typeof document === "undefined") return null;
  const options: NotificationOptions = typeof opts === "string" ? { title: opts } : opts || {};
  /* Normalize invalid placements (e.g. "bottom-end") so a typo doesn't leave
     the container without a positioning class (invisible notification). */
  const placement = (
    options.placement && PLACEMENT_CLASS[options.placement] ? options.placement : "top-right"
  ) as NotificationPlacement;
  const doc = document;
  const container = ensureContainer(doc, placement);
  const el = createNotificationElement(options, doc);

  const close = () => {
    el.classList.add("is-leaving");
    whenMotionDone(el, () => el.remove());
  };
  el.querySelector(".blora-notification__close")?.addEventListener("click", close);
  container.appendChild(el);

  const ms = options.duration == null ? 4500 : options.duration;
  if (ms > 0) setTimeout(close, ms);

  return { close, el };
}

export function createNotificationController(root: HTMLElement): { destroy(): void } {
  /* Static card: wire close button if present */
  const btn = root.querySelector<HTMLElement>(".blora-notification__close, [data-blora-close]");
  if (!btn) return { destroy: () => {} };
  const onClose = () => {
    root.classList.add("is-leaving");
    root.dispatchEvent(new CustomEvent("blora-notification-close", { bubbles: true }));
    whenMotionDone(root, () => root.remove());
  };
  btn.addEventListener("click", onClose);
  return {
    destroy() {
      btn.removeEventListener("click", onClose);
    },
  };
}
