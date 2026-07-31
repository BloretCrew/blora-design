import { describe, it, expect, beforeEach } from "vitest";
import { createThreadController } from "../src/index.js";

describe("Thread add-on", () => {
  let root: HTMLElement;
  let replyBox: HTMLElement;
  let toggleBtn: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    root = document.createElement("div");
    root.className = "blora-thread";
    root.innerHTML = `
      <div class="blora-post">
        <div class="blora-post__body">Main post</div>
        <div class="blora-post__replies" data-blora-thread-replies>
          <div class="blora-post__replies-body" data-blora-thread-body>
            <div class="blora-post blora-post--reply">Reply 1</div>
            <div class="blora-post blora-post--reply">Reply 2</div>
          </div>
          <button class="blora-post__collapse" data-blora-thread-toggle aria-expanded="true">
            Collapse replies
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    replyBox = root.querySelector(".blora-post__replies")!;
    toggleBtn = root.querySelector(".blora-post__collapse")!;
  });

  it("returns a controller with toggle, expand, collapse, destroy methods", () => {
    const controller = createThreadController(root);
    expect(typeof controller.toggle).toBe("function");
    expect(typeof controller.expand).toBe("function");
    expect(typeof controller.collapse).toBe("function");
    expect(typeof controller.destroy).toBe("function");
    controller.destroy();
  });

  it("collapse adds is-collapsed class", () => {
    const controller = createThreadController(root);
    controller.collapse(replyBox);
    expect(replyBox.classList.contains("is-collapsed")).toBe(true);
    controller.destroy();
  });

  it("collapse sets aria-expanded to false", () => {
    const controller = createThreadController(root);
    controller.collapse(replyBox);
    expect(toggleBtn.getAttribute("aria-expanded")).toBe("false");
    controller.destroy();
  });

  it("expand removes is-collapsed class", () => {
    const controller = createThreadController(root);
    controller.collapse(replyBox);
    expect(replyBox.classList.contains("is-collapsed")).toBe(true);
    controller.expand(replyBox);
    expect(replyBox.classList.contains("is-collapsed")).toBe(false);
    controller.destroy();
  });

  it("expand sets aria-expanded to true", () => {
    const controller = createThreadController(root);
    controller.collapse(replyBox);
    controller.expand(replyBox);
    expect(toggleBtn.getAttribute("aria-expanded")).toBe("true");
    controller.destroy();
  });

  it("toggle switches between collapsed and expanded", () => {
    const controller = createThreadController(root);
    expect(replyBox.classList.contains("is-collapsed")).toBe(false);
    controller.toggle(replyBox);
    expect(replyBox.classList.contains("is-collapsed")).toBe(true);
    controller.toggle(replyBox);
    expect(replyBox.classList.contains("is-collapsed")).toBe(false);
    controller.destroy();
  });

  it("destroy does not throw", () => {
    const controller = createThreadController(root);
    expect(() => controller.destroy()).not.toThrow();
  });

  it("clicking toggle button triggers toggle", () => {
    createThreadController(root);
    expect(replyBox.classList.contains("is-collapsed")).toBe(false);
    toggleBtn.click();
    expect(replyBox.classList.contains("is-collapsed")).toBe(true);
  });

  it("uses custom labels", () => {
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
});
