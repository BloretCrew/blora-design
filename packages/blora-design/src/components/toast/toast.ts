/**
 * Toast / message service (v1 toast simplified, no innerHTML XSS).
 */
export interface ToastOptions {
  message?: string;
  type?: "success" | "warning" | "danger" | "info";
  duration?: number;
}

export interface ToastHandle {
  close(): void;
  el: HTMLElement;
}

function ensureContainer(doc: Document): HTMLElement {
  let c = doc.querySelector<HTMLElement>(".blora-toast-container");
  if (!c) {
    c = doc.createElement("div");
    c.className = "blora-toast-container blora-portal";
    c.style.cssText =
      "position:fixed;inset-block-start:var(--blora-space-5);inset-inline-end:var(--blora-space-5);z-index:var(--blora-z-toast, 1100);display:flex;flex-direction:column;gap:var(--blora-space-2);pointer-events:none;";
    (doc.body || doc.documentElement).appendChild(c);
  }
  return c;
}

export function toast(opts: ToastOptions | string): ToastHandle | null {
  if (typeof document === "undefined") return null;
  const options: ToastOptions = typeof opts === "string" ? { message: opts } : opts || {};
  const doc = document;
  const c = ensureContainer(doc);
  const type = options.type || "info";
  const el = doc.createElement("div");
  el.className = "blora-toast";
  el.setAttribute("data-variant", type);
  el.setAttribute("role", "status");
  el.style.pointerEvents = "auto";

  const body = doc.createElement("div");
  body.className = "blora-toast__body";
  const title = doc.createElement("div");
  title.className = "blora-toast__title";
  title.textContent = options.message || "";
  body.appendChild(title);
  el.appendChild(body);

  const closeBtn = doc.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "blora-toast__close";
  closeBtn.setAttribute("aria-label", "关闭");
  closeBtn.textContent = "×";
  el.appendChild(closeBtn);

  c.appendChild(el);
  const ms = options.duration == null ? 3000 : options.duration;
  const close = () => {
    el.classList.add("is-leaving");
    setTimeout(() => el.remove(), 240);
  };
  closeBtn.addEventListener("click", close);
  if (ms > 0) setTimeout(close, ms);
  return { close, el };
}

export function message(opts: ToastOptions | string): ToastHandle | null {
  return toast(opts);
}
