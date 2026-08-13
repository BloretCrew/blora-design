import { BloraElement } from "../../core/blora-element.js";

export const BLORA_CHAT_TAG = "blora-chat";

export class BloraChat extends BloraElement {
  static get observedAttributes(): string[] {
    return ["author", "time", "avatar", "message", "side", "avatar-variant"];
  }

  attributeChangedCallback(): void {
    if (this.isConnectedInternal) this.sync();
  }

  protected render(): void {
    const root = this.ownerDocument.createElement("article");
    root.className = "blora-chat";
    if (this.getAttribute("side") === "end") root.classList.add("blora-chat--end");
    root.dataset.bloraGenerated = "";
    const avatar = this.ownerDocument.createElement("span");
    avatar.className = "blora-avatar blora-chat__avatar";
    avatar.dataset.size = "sm";
    avatar.dataset.variant = this.getAttribute("avatar-variant") ?? "info";
    avatar.textContent =
      this.getAttribute("avatar") ?? (this.getAttribute("author") ?? "?").slice(0, 1);
    const content = this.ownerDocument.createElement("div");
    content.className = "blora-chat__content";
    const meta = this.ownerDocument.createElement("div");
    meta.className = "blora-chat__meta";
    const author = this.ownerDocument.createElement("span");
    author.textContent = this.getAttribute("author") ?? "";
    const time = this.ownerDocument.createElement("time");
    time.textContent = this.getAttribute("time") ?? "";
    meta.append(author, time);
    const bubble = this.ownerDocument.createElement("div");
    bubble.className = "blora-chat__bubble";
    bubble.textContent = this.getAttribute("message") ?? "";
    content.append(meta, bubble);
    root.append(avatar, content);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-chat");
    if (!root) return;
    root.classList.toggle("blora-chat--end", this.getAttribute("side") === "end");
    const avatar = root.querySelector<HTMLElement>(".blora-avatar");
    if (avatar) {
      avatar.dataset.variant = this.getAttribute("avatar-variant") ?? "info";
      avatar.textContent =
        this.getAttribute("avatar") ?? (this.getAttribute("author") ?? "?").slice(0, 1);
    }
    const author = root.querySelector(".blora-chat__meta span");
    if (author) author.textContent = this.getAttribute("author") ?? "";
    const time = root.querySelector("time");
    if (time) time.textContent = this.getAttribute("time") ?? "";
    const bubble = root.querySelector(".blora-chat__bubble");
    if (bubble) bubble.textContent = this.getAttribute("message") ?? "";
  }

  protected bindEvents(): void {}
}

export function defineBloraChat(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_CHAT_TAG)) return;
  registry.define(BLORA_CHAT_TAG, BloraChat);
}
