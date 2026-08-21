import { beforeEach, describe, expect, it } from "vitest";
import { createThreadController } from "../src/index.js";

function setScrollHeight(el: HTMLElement, value: number): void {
  Object.defineProperty(el, "scrollHeight", { configurable: true, value });
}

describe("Thread add-on", () => {
  let root: HTMLElement;
  let shortComment: HTMLElement;
  let shortBody: HTMLElement;
  let longComment: HTMLElement;
  let longBody: HTMLElement;
  let reactBtn: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    root = document.createElement("div");
    root.className = "blora-thread";
    root.setAttribute("data-blora-thread", "");
    root.innerHTML = `
      <div class="blora-thread-comment" id="short">
        <div class="blora-thread-comment__card">
          <div class="blora-thread-comment__body">Short comment</div>
          <div class="blora-thread-comment__react">
            <button type="button" data-blora-thread-react aria-label="添加表情"></button>
          </div>
        </div>
      </div>
      <div class="blora-thread-comment" id="long" data-label-expand="阅读全文" data-label-collapse="收起全文">
        <div class="blora-thread-comment__card">
          <div class="blora-thread-comment__body">Long comment body</div>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    shortComment = root.querySelector("#short")!;
    shortBody = shortComment.querySelector(".blora-thread-comment__body")!;
    longComment = root.querySelector("#long")!;
    longBody = longComment.querySelector(".blora-thread-comment__body")!;
    reactBtn = shortComment.querySelector("[data-blora-thread-react]")!;
    setScrollHeight(shortBody, 80);
    setScrollHeight(longBody, 320);
  });

  it("returns the focused comment-stream controller surface", () => {
    const controller = createThreadController(root);
    expect(typeof controller.refresh).toBe("function");
    expect(typeof controller.expandComment).toBe("function");
    expect(typeof controller.collapseComment).toBe("function");
    expect(typeof controller.toggleComment).toBe("function");
    expect(typeof controller.toggleReact).toBe("function");
    expect(typeof controller.setComposerTab).toBe("function");
    expect(typeof controller.destroy).toBe("function");
    controller.destroy();
  });

  it("does not fold short comments or create a fold control", () => {
    const controller = createThreadController(root);
    controller.refresh();
    expect(shortComment.hasAttribute("data-collapsible")).toBe(false);
    expect(shortComment.hasAttribute("data-collapsed")).toBe(false);
    expect(shortComment.querySelector(".blora-thread-comment__fold")).toBeNull();
    controller.destroy();
  });

  it("auto-folds long comments and generates the gradient floating control", () => {
    const controller = createThreadController(root, { collapseHeight: 158 });
    controller.refresh();
    expect(longComment.hasAttribute("data-collapsible")).toBe(true);
    expect(longComment.hasAttribute("data-collapsed")).toBe(true);
    expect(longBody.style.getPropertyValue("--blora-thread-collapse-height")).toBe("158px");
    expect(longBody.style.getPropertyValue("--blora-thread-content-height")).toBe("320px");
    const fold = longComment.querySelector<HTMLElement>(".blora-thread-comment__fold")!;
    expect(fold).not.toBeNull();
    expect(fold.hasAttribute("data-blora-generated")).toBe(true);
    const button = fold.querySelector<HTMLButtonElement>(".blora-button")!;
    expect(button.textContent).toContain("阅读全文");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.querySelector('svg[data-blora-icon="chevron-down"]')).not.toBeNull();
    controller.destroy();
  });

  it("honors a per-comment collapsed height", () => {
    longComment.setAttribute("data-collapse-height", "96");
    const controller = createThreadController(root);
    controller.refresh();
    expect(longBody.style.getPropertyValue("--blora-thread-collapse-height")).toBe("96px");
    controller.destroy();
  });

  it("expands and collapses a long comment through button and API", () => {
    const controller = createThreadController(root);
    controller.refresh();
    const button = longComment.querySelector<HTMLButtonElement>(".blora-button")!;
    button.click();
    expect(longComment.hasAttribute("data-collapsed")).toBe(false);
    expect(button.textContent).toContain("收起全文");
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.querySelector('svg[data-blora-icon="arrow-up"]')).not.toBeNull();
    controller.collapseComment(longComment);
    expect(longComment.hasAttribute("data-collapsed")).toBe(true);
    controller.expandComment(longComment);
    expect(longComment.hasAttribute("data-collapsed")).toBe(false);
    controller.toggleComment(longComment);
    expect(longComment.hasAttribute("data-collapsed")).toBe(true);
    controller.destroy();
  });

  it("toggles a comment reaction with data-active and aria-pressed", () => {
    const controller = createThreadController(root);
    reactBtn.click();
    expect(reactBtn.hasAttribute("data-active")).toBe(true);
    expect(reactBtn.getAttribute("aria-pressed")).toBe("true");
    controller.toggleReact(reactBtn);
    expect(reactBtn.hasAttribute("data-active")).toBe(false);
    controller.destroy();
  });

  it("switches composer tabs and exposes the API", () => {
    root.insertAdjacentHTML(
      "beforeend",
      `<div class="blora-thread-composer">
        <div class="blora-thread-composer__tabs">
          <button type="button" data-blora-thread-tab data-tab="edit" data-active>编辑</button>
          <button type="button" data-blora-thread-tab data-tab="preview">预览</button>
        </div>
        <textarea class="blora-thread-composer__input"></textarea>
      </div>`,
    );
    const composer = root.querySelector<HTMLElement>(".blora-thread-composer")!;
    const preview = root.querySelector<HTMLButtonElement>('[data-tab="preview"]')!;
    const controller = createThreadController(root);
    preview.click();
    expect(composer.getAttribute("data-tab")).toBe("preview");
    expect(preview.hasAttribute("data-active")).toBe(true);
    controller.setComposerTab(composer, "edit");
    expect(composer.getAttribute("data-tab")).toBe("edit");
    controller.destroy();
  });

  it("destroy removes generated controls and measurement state", () => {
    const controller = createThreadController(root);
    controller.refresh();
    expect(longComment.querySelector(".blora-thread-comment__fold")).not.toBeNull();
    controller.destroy();
    expect(longComment.querySelector(".blora-thread-comment__fold")).toBeNull();
    expect(longComment.hasAttribute("data-collapsible")).toBe(false);
    expect(longComment.hasAttribute("data-collapsed")).toBe(false);
    expect(longBody.style.getPropertyValue("--blora-thread-collapse-height")).toBe("");
    expect(longBody.style.getPropertyValue("--blora-thread-content-height")).toBe("");
  });
});
