/**
 * Notification service with multi-placement stacks (v1 notify containers).
 */
export type NotificationPlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface NotificationOptions {
  title?: string;
  description?: string;
  type?: "success" | "warning" | "danger" | "info";
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

export function notify(opts: NotificationOptions | string): NotificationHandle | null {
  if (typeof document === "undefined") return null;
  const options: NotificationOptions = typeof opts === "string" ? { title: opts } : opts || {};
  const placement = options.placement || "top-right";
  const type = options.type || "info";
  const doc = document;
  const container = ensureContainer(doc, placement);

  const el = doc.createElement("div");
  el.className = "blora-notification";
  el.setAttribute("data-variant", type);
  el.setAttribute("role", "status");

  const icon = doc.createElement("div");
  icon.className = "blora-notification__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent =
    type === "success" ? "✓" : type === "warning" ? "!" : type === "danger" ? "×" : "i";

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

  const closeBtn = doc.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "blora-notification__close";
  closeBtn.setAttribute("aria-label", "关闭");
  closeBtn.textContent = "×";

  el.append(icon, body, closeBtn);
  container.appendChild(el);

  const close = () => {
    el.classList.add("is-leaving");
    setTimeout(() => el.remove(), 200);
  };
  closeBtn.addEventListener("click", close);
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
    setTimeout(() => root.remove(), 200);
  };
  btn.addEventListener("click", onClose);
  return {
    destroy() {
      btn.removeEventListener("click", onClose);
    },
  };
}
