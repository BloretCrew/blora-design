import { BloraElement } from "../../core/blora-element.js";

export const BLORA_COMMENT_TAG = "blora-comment";

export class BloraComment extends BloraElement {
  static get observedAttributes(): string[] {
    return ["author", "time", "avatar", "content", "likes"];
  }

  attributeChangedCallback(): void {
    if (this.isConnectedInternal) this.sync();
  }

  protected render(): void {
    const root = this.ownerDocument.createElement("article");
    root.className = "blora-comment";
    root.dataset.bloraGenerated = "";
    const avatar = this.ownerDocument.createElement("span");
    avatar.className = "blora-avatar";
    avatar.dataset.size = "sm";
    avatar.dataset.variant = "primary";
    avatar.textContent =
      this.getAttribute("avatar") ?? (this.getAttribute("author") ?? "?").slice(0, 1);
    const main = this.ownerDocument.createElement("div");
    main.className = "blora-comment__main";
    const head = this.ownerDocument.createElement("div");
    head.className = "blora-comment__head";
    const author = this.ownerDocument.createElement("span");
    author.className = "blora-comment__author";
    author.textContent = this.getAttribute("author") ?? "";
    const time = this.ownerDocument.createElement("span");
    time.className = "blora-comment__time";
    time.textContent = this.getAttribute("time") ?? "";
    head.append(author, time);
    const body = this.ownerDocument.createElement("div");
    body.className = "blora-comment__body";
    body.textContent = this.getAttribute("content") ?? "";
    const actions = this.ownerDocument.createElement("div");
    actions.className = "blora-comment__actions";
    const action = (value: string, label: string) => {
      const button = this.ownerDocument.createElement("button");
      button.type = "button";
      button.dataset.value = value;
      button.textContent = label;
      return button;
    };
    actions.append(action("reply", "回复"), action("like", this.getAttribute("likes") ?? "赞"));
    main.append(head, body, actions);
    root.append(avatar, main);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const author = this.querySelector(".blora-comment__author");
    if (author) author.textContent = this.getAttribute("author") ?? "";
    const time = this.querySelector(".blora-comment__time");
    if (time) time.textContent = this.getAttribute("time") ?? "";
    const body = this.querySelector(".blora-comment__body");
    if (body) body.textContent = this.getAttribute("content") ?? "";
    const avatar = this.querySelector(".blora-avatar");
    if (avatar) {
      avatar.textContent =
        this.getAttribute("avatar") ?? (this.getAttribute("author") ?? "?").slice(0, 1);
    }
    const like = this.querySelector<HTMLButtonElement>('[data-value="like"]');
    if (like) like.textContent = this.getAttribute("likes") ?? "赞";
  }

  protected bindEvents(): void {
    const actions = this.querySelector(".blora-comment__actions");
    if (!actions) return;
    this.listen(actions, "click", (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>("button");
      if (button) this.emit("blora-comment-action", { value: button.dataset.value ?? "" });
    });
  }
}

export function defineBloraComment(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_COMMENT_TAG)) return;
  registry.define(BLORA_COMMENT_TAG, BloraComment);
}
