import { beforeEach, describe, expect, it } from "vitest";
import {
  BLORA_THREAD_COMMENT_TAG,
  BLORA_THREAD_COMPOSER_TAG,
  BloraThreadComment,
  BloraThreadComposer,
  defineBloraThreadElements,
} from "../src/index.js";

function setScrollHeight(el: HTMLElement, value: number): void {
  Object.defineProperty(el, "scrollHeight", { configurable: true, value });
}

async function settle(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

function createComment(bodyText = "Comment body"): BloraThreadComment {
  const comment = document.createElement(BLORA_THREAD_COMMENT_TAG) as BloraThreadComment;
  const head = document.createElement("div");
  head.slot = "head";
  head.textContent = "Author";
  const body = document.createElement("p");
  body.textContent = bodyText;
  const reactions = document.createElement("div");
  reactions.slot = "reactions";
  reactions.innerHTML = '<button type="button" data-blora-thread-react></button>';
  comment.append(head, body, reactions);
  document.body.append(comment);
  return comment;
}

describe("Thread composite custom elements", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    defineBloraThreadElements(customElements);
  });

  it("registers the public comment and composer elements", () => {
    expect(customElements.get(BLORA_THREAD_COMMENT_TAG)).toBe(BloraThreadComment);
    expect(customElements.get(BLORA_THREAD_COMPOSER_TAG)).toBe(BloraThreadComposer);
  });

  it("renders an open consumer-authored comment card", async () => {
    const comment = createComment();
    await settle();
    expect(comment.querySelector(".blora-thread-comment__card")).not.toBeNull();
    expect(comment.querySelector(".blora-thread-comment__head")?.textContent).toContain("Author");
    expect(comment.querySelector(".blora-thread-comment__body")?.textContent).toContain(
      "Comment body",
    );
    expect(comment.querySelector(".blora-thread-comment__react")).not.toBeNull();
  });

  it("does not fold a short comment", async () => {
    const comment = createComment();
    await settle();
    const body = comment.querySelector<HTMLElement>(".blora-thread-comment__body")!;
    setScrollHeight(body, 80);
    comment.refresh();
    expect(comment.collapsible).toBe(false);
    expect(comment.querySelector(".blora-thread-comment__fold")).toBeNull();
  });

  it("auto-folds a long comment and honors collapse-height", async () => {
    const comment = createComment("Long comment");
    comment.setAttribute("collapse-height", "96");
    await settle();
    const body = comment.querySelector<HTMLElement>(".blora-thread-comment__body")!;
    setScrollHeight(body, 320);
    comment.refresh();
    expect(comment.collapsible).toBe(true);
    expect(comment.collapsed).toBe(true);
    expect(body.style.getPropertyValue("--blora-thread-collapse-height")).toBe("96px");
    expect(body.style.getPropertyValue("--blora-thread-content-height")).toBe("320px");
    const button = comment.querySelector<HTMLButtonElement>("[data-blora-thread-comment-fold]")!;
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.querySelector('svg[data-blora-icon="chevron-down"]')).not.toBeNull();
  });

  it("expands and collapses through methods and the generated button", async () => {
    const comment = createComment();
    await settle();
    const body = comment.querySelector<HTMLElement>(".blora-thread-comment__body")!;
    setScrollHeight(body, 320);
    comment.refresh();
    const button = comment.querySelector<HTMLButtonElement>("[data-blora-thread-comment-fold]")!;
    button.click();
    expect(comment.collapsed).toBe(false);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    comment.collapse();
    expect(comment.collapsed).toBe(true);
    comment.expand();
    expect(comment.collapsed).toBe(false);
    comment.toggle();
    expect(comment.collapsed).toBe(true);
  });

  it("toggles optional reaction state without prescribing reaction content", async () => {
    const comment = createComment();
    await settle();
    const reaction = comment.querySelector<HTMLButtonElement>("[data-blora-thread-react]")!;
    reaction.click();
    expect(reaction.hasAttribute("data-active")).toBe(true);
    expect(reaction.getAttribute("aria-pressed")).toBe("true");
    reaction.click();
    expect(reaction.hasAttribute("data-active")).toBe(false);
  });

  it("renders composer definitions and leaves toolbar actions consumer-controlled", async () => {
    const composer = document.createElement(BLORA_THREAD_COMPOSER_TAG) as BloraThreadComposer;
    const toolbar = document.createElement("div");
    toolbar.slot = "toolbar";
    const custom = document.createElement("button");
    custom.type = "button";
    custom.textContent = "Custom";
    toolbar.append(custom);
    const editor = document.createElement("textarea");
    const preview = document.createElement("div");
    preview.slot = "preview";
    preview.textContent = "Preview content";
    const actions = document.createElement("div");
    actions.slot = "actions";
    actions.innerHTML = '<button type="button">Submit</button>';
    composer.append(toolbar, editor, preview, actions);
    document.body.append(composer);
    await settle();

    let clicks = 0;
    custom.addEventListener("click", () => clicks++);
    custom.click();
    expect(clicks).toBe(1);
    expect(composer.querySelector(".blora-thread-composer__toolbar")?.contains(custom)).toBe(true);
    expect(editor.classList.contains("blora-thread-composer__input")).toBe(true);
    expect(composer.querySelector(".blora-thread-composer__footer")?.textContent).toContain(
      "Submit",
    );
  });

  it("switches edit and preview with attributes, methods and keyboard", async () => {
    const composer = document.createElement(BLORA_THREAD_COMPOSER_TAG) as BloraThreadComposer;
    const editor = document.createElement("textarea");
    const preview = document.createElement("div");
    preview.slot = "preview";
    preview.textContent = "Preview";
    composer.append(editor, preview);
    document.body.append(composer);
    await settle();

    const tabs = composer.querySelectorAll<HTMLButtonElement>("[data-blora-thread-tab]");
    expect(composer.tab).toBe("edit");
    tabs[1]!.click();
    expect(composer.tab).toBe("preview");
    expect(editor.getClientRects).toBeDefined();
    expect(composer.querySelector<HTMLElement>(".blora-thread-composer__preview")?.hidden).toBe(
      false,
    );

    tabs[1]!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(composer.tab).toBe("edit");
    composer.setTab("preview");
    expect(composer.getAttribute("data-tab")).toBe("preview");
  });

  it("emits the composer tab change event", async () => {
    const composer = document.createElement(BLORA_THREAD_COMPOSER_TAG) as BloraThreadComposer;
    composer.append(document.createElement("textarea"));
    document.body.append(composer);
    await settle();
    let detail: unknown;
    composer.addEventListener("blora-thread-tab-change", (event) => {
      detail = (event as CustomEvent).detail;
    });
    composer.setTab("preview");
    expect(detail).toEqual({ tab: "preview" });
  });
});
