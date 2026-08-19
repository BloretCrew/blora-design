import { describe, it, expect, beforeEach } from "vitest";
import { createThreadController } from "../src/index.js";

describe("Thread add-on", () => {
  let root: HTMLElement;
  let replyBox: HTMLElement;
  let toggleBtn: HTMLElement;
  let reactBtn: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    root = document.createElement("div");
    root.className = "blora-thread";
    root.setAttribute("data-blora-thread", "");
    root.innerHTML = `
      <article class="blora-post">
        <div class="blora-post__body">Main post</div>
        <div class="blora-post__react">
          <button type="button" class="blora-post__react-btn" data-blora-post-react aria-label="表情">☺</button>
        </div>
        <div class="blora-post__replies" data-blora-thread-replies>
          <div class="blora-post__replies-body" data-blora-thread-body>
            <article class="blora-post blora-post--reply">Reply 1</article>
            <article class="blora-post blora-post--reply">Reply 2</article>
          </div>
          <button type="button" class="blora-post__collapse" data-blora-thread-toggle
            aria-expanded="true"
            data-label-collapse="收起评论"
            data-label-expand="展开评论">收起评论</button>
        </div>
      </article>
    `;
    document.body.appendChild(root);
    replyBox = root.querySelector(".blora-post__replies")!;
    toggleBtn = root.querySelector(".blora-post__collapse")!;
    reactBtn = root.querySelector("[data-blora-post-react]")!;
  });

  it("returns a controller with toggle, expand, collapse, toggleReact, destroy", () => {
    const controller = createThreadController(root);
    expect(typeof controller.toggle).toBe("function");
    expect(typeof controller.expand).toBe("function");
    expect(typeof controller.collapse).toBe("function");
    expect(typeof controller.toggleReact).toBe("function");
    expect(typeof controller.destroy).toBe("function");
    controller.destroy();
  });

  it("collapse adds data-collapsed", () => {
    const controller = createThreadController(root);
    controller.collapse(replyBox);
    expect(replyBox.hasAttribute("data-collapsed")).toBe(true);
    controller.destroy();
  });

  it("collapse sets aria-expanded to false and v1 default expand label", () => {
    const controller = createThreadController(root);
    controller.collapse(replyBox);
    expect(toggleBtn.getAttribute("aria-expanded")).toBe("false");
    expect(toggleBtn.textContent).toBe("展开评论");
    controller.destroy();
  });

  it("expand removes data-collapsed and restores collapse label", () => {
    const controller = createThreadController(root);
    controller.collapse(replyBox);
    expect(replyBox.hasAttribute("data-collapsed")).toBe(true);
    controller.expand(replyBox);
    expect(replyBox.hasAttribute("data-collapsed")).toBe(false);
    expect(toggleBtn.getAttribute("aria-expanded")).toBe("true");
    expect(toggleBtn.textContent).toBe("收起评论");
    controller.destroy();
  });

  it("toggle switches between collapsed and expanded", () => {
    const controller = createThreadController(root);
    expect(replyBox.hasAttribute("data-collapsed")).toBe(false);
    controller.toggle(replyBox);
    expect(replyBox.hasAttribute("data-collapsed")).toBe(true);
    controller.toggle(replyBox);
    expect(replyBox.hasAttribute("data-collapsed")).toBe(false);
    controller.destroy();
  });

  it("destroy does not throw", () => {
    const controller = createThreadController(root);
    expect(() => controller.destroy()).not.toThrow();
  });

  it("clicking toggle button triggers toggle", () => {
    createThreadController(root);
    expect(replyBox.hasAttribute("data-collapsed")).toBe(false);
    toggleBtn.click();
    expect(replyBox.hasAttribute("data-collapsed")).toBe(true);
    toggleBtn.click();
    expect(replyBox.hasAttribute("data-collapsed")).toBe(false);
  });

  it("uses custom labels from options", () => {
    const controller = createThreadController(root, {
      expandLabel: "Show",
      collapseLabel: "Hide",
    });
    // data-label-* on button still wins over options
    controller.collapse(replyBox);
    expect(toggleBtn.textContent).toBe("展开评论");
    controller.destroy();
  });

  it("falls back to options labels when data-label attrs are absent", () => {
    toggleBtn.removeAttribute("data-label-expand");
    toggleBtn.removeAttribute("data-label-collapse");
    const controller = createThreadController(root, {
      expandLabel: "Show",
      collapseLabel: "Hide",
    });
    controller.collapse(replyBox);
    expect(toggleBtn.textContent).toBe("Show");
    controller.expand(replyBox);
    expect(toggleBtn.textContent).toBe("Hide");
    controller.destroy();
  });

  it("post react click toggles data-active and aria-pressed", () => {
    createThreadController(root);
    expect(reactBtn.hasAttribute("data-active")).toBe(false);
    reactBtn.click();
    expect(reactBtn.hasAttribute("data-active")).toBe(true);
    expect(reactBtn.getAttribute("aria-pressed")).toBe("true");
    reactBtn.click();
    expect(reactBtn.hasAttribute("data-active")).toBe(false);
    expect(reactBtn.getAttribute("aria-pressed")).toBe("false");
  });

  it("toggleReact API matches click behaviour", () => {
    const controller = createThreadController(root);
    controller.toggleReact(reactBtn);
    expect(reactBtn.hasAttribute("data-active")).toBe(true);
    controller.toggleReact(reactBtn);
    expect(reactBtn.hasAttribute("data-active")).toBe(false);
    controller.destroy();
  });

  it("does not synthesize a missing replies body", () => {
    root.innerHTML = `
      <article class="blora-post">
        <div class="blora-post__replies" data-blora-thread-replies>
          <article class="blora-post blora-post--reply">R1</article>
          <button type="button" class="blora-post__collapse" data-blora-thread-toggle
            aria-expanded="true">收起评论</button>
        </div>
      </article>
    `;
    const box = root.querySelector<HTMLElement>("[data-blora-thread-replies]")!;
    const controller = createThreadController(root);
    controller.collapse(box);
    expect(box.querySelector("[data-blora-thread-body]")).toBeNull();
    expect(box.hasAttribute("data-collapsed")).toBe(false);
    controller.destroy();
  });

  it("scopes toggle label updates to the correct replies box", () => {
    root.innerHTML = `
      <article class="blora-post">
        <div class="blora-post__replies" data-blora-thread-replies id="box-a">
          <div class="blora-post__replies-body" data-blora-thread-body>
            <article class="blora-post blora-post--reply">A</article>
          </div>
          <button type="button" class="blora-post__collapse" data-blora-thread-toggle
            data-label-expand="展开A" data-label-collapse="收起A" aria-expanded="true">收起A</button>
        </div>
      </article>
      <article class="blora-post">
        <div class="blora-post__replies" data-blora-thread-replies id="box-b">
          <div class="blora-post__replies-body" data-blora-thread-body>
            <article class="blora-post blora-post--reply">B</article>
          </div>
          <button type="button" class="blora-post__collapse" data-blora-thread-toggle
            data-label-expand="展开B" data-label-collapse="收起B" aria-expanded="true">收起B</button>
        </div>
      </article>
    `;
    const boxA = root.querySelector<HTMLElement>("#box-a")!;
    const btnB = root.querySelector<HTMLElement>("#box-b [data-blora-thread-toggle]")!;
    const controller = createThreadController(root);
    controller.collapse(boxA);
    expect(boxA.querySelector("[data-blora-thread-toggle]")?.textContent).toBe("展开A");
    expect(btnB.textContent).toBe("收起B");
    controller.destroy();
  });
});
