import { BloraElement } from "../../core/blora-element.js";

export const BLORA_COMMENT_TAG = "blora-comment";

type NamedSlot = "actions" | "author" | "avatar" | "meta" | "nested";
type Assigned = Record<NamedSlot | "body", Node[]>;

function slotName(el: HTMLElement): NamedSlot | "body" {
  const slot = el.getAttribute("slot");
  if (el.localName === "blora-comment" || slot === "nested") return "nested";
  if (slot === "time" || slot === "meta") return "meta";
  if (slot === "avatar" || slot === "author" || slot === "actions") return slot;
  return "body";
}

export class BloraComment extends BloraElement {
  private assigned: Assigned | null = null;

  protected render(): void {
    const assigned = this.takeAssigned();
    const doc = this.ownerDocument;
    const article = doc.createElement("article");
    article.className = "blora-comment";
    article.dataset.bloraGenerated = "";

    const main = doc.createElement("div");
    main.className = "blora-comment__main";

    if (assigned.author.length || assigned.meta.length) {
      const head = doc.createElement("div");
      head.className = "blora-comment__head";
      if (assigned.author.length) {
        const author = doc.createElement("span");
        author.className = "blora-comment__author";
        author.append(...this.take(assigned.author));
        head.append(author);
      }
      if (assigned.meta.length) {
        const meta = doc.createElement("span");
        meta.className = "blora-comment__time";
        meta.append(...this.take(assigned.meta));
        head.append(meta);
      }
      main.append(head);
    }

    if (assigned.body.length) {
      const body = doc.createElement("div");
      body.className = "blora-comment__body";
      body.append(...this.take(assigned.body));
      main.append(body);
    }

    if (assigned.actions.length) {
      const actions = doc.createElement("div");
      actions.className = "blora-comment__actions";
      actions.append(...this.take(assigned.actions));
      main.append(actions);
    }

    if (assigned.nested.length) {
      const nested = doc.createElement("div");
      nested.className = "blora-comment__nested";
      nested.append(...this.take(assigned.nested));
      main.append(nested);
    }

    if (assigned.avatar.length) {
      const avatar = doc.createElement("div");
      avatar.className = "blora-comment__avatar";
      avatar.append(...this.take(assigned.avatar));
      article.append(avatar, main);
    } else {
      article.append(main);
    }

    this.replaceChildren(article);
  }

  protected bindEvents(): void {}

  private takeAssigned(): Assigned {
    if (!this.assigned) {
      const assigned: Assigned = {
        avatar: [],
        author: [],
        meta: [],
        body: [],
        actions: [],
        nested: [],
      };
      for (const node of Array.from(this.childNodes)) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (el.hasAttribute("data-blora-generated")) continue;
          assigned[slotName(el)].push(el);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          assigned.body.push(node);
        }
      }
      this.assigned = assigned;
    }
    return this.assigned;
  }

  private take(nodes: Node[]): Node[] {
    for (const node of nodes) node.parentNode?.removeChild(node);
    return nodes;
  }
}

export function defineBloraComment(registry: CustomElementRegistry = customElements): void {
  if (!registry.get(BLORA_COMMENT_TAG)) {
    registry.define(BLORA_COMMENT_TAG, BloraComment);
  }
}
