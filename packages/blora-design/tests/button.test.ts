import { describe, it, expect, beforeEach } from "vitest";
import { setButtonLoading } from "../src/components/button/index.js";

describe("setButtonLoading", () => {
  let button: HTMLButtonElement;

  beforeEach(() => {
    button = document.createElement("button");
    button.className = "blora-button";
    button.type = "button";
    button.textContent = "Save";
    document.body.appendChild(button);
  });

  it("sets aria-busy and data-loading when loading is true", () => {
    setButtonLoading(button, true);

    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.hasAttribute("data-loading")).toBe(true);
  });

  it("disables the button by default", () => {
    setButtonLoading(button, true);

    expect(button.disabled).toBe(true);
  });

  it("preserves disabled state when disable option is false", () => {
    button.disabled = false;
    setButtonLoading(button, true, { disable: false });

    expect(button.disabled).toBe(false);
  });

  it("swaps text content when label is provided", () => {
    setButtonLoading(button, true, { label: "Saving..." });

    expect(button.textContent).toBe("Saving...");
  });

  it("restores original text when loading is turned off", () => {
    setButtonLoading(button, true, { label: "Saving..." });
    setButtonLoading(button, false, { label: "Saving..." });

    expect(button.textContent).toBe("Save");
  });

  it("removes aria-busy and data-loading when loading is false", () => {
    setButtonLoading(button, true);
    setButtonLoading(button, false);

    expect(button.hasAttribute("aria-busy")).toBe(false);
    expect(button.hasAttribute("data-loading")).toBe(false);
    expect(button.disabled).toBe(false);
  });

  it("does not set label data attribute when no label provided", () => {
    setButtonLoading(button, true);

    expect(button.dataset.loadingLabel).toBeUndefined();
    expect(button.textContent).toBe("Save");
  });
});
