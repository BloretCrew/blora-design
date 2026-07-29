import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  defineBloraDialog,
  BloraDialog,
  BLORA_DIALOG_TAG,
} from "../src/components/dialog/index.js";

describe("BloraDialog", () => {
  beforeEach(() => {
    defineBloraDialog();
    document.body.innerHTML = "";
  });

  it("defines the custom element", () => {
    expect(customElements.get(BLORA_DIALOG_TAG)).toBe(BloraDialog);
  });

  it("defineBloraDialog is idempotent", () => {
    defineBloraDialog();
    defineBloraDialog();
    expect(customElements.get(BLORA_DIALOG_TAG)).toBe(BloraDialog);
  });

  it("show() sets open attribute and emits blora-open", () => {
    const dialog = document.createElement("blora-dialog") as BloraDialog;
    document.body.appendChild(dialog);

    let opened = false;
    dialog.addEventListener("blora-open", () => {
      opened = true;
    });

    dialog.show();

    expect(dialog.hasAttribute("open")).toBe(true);
    expect(opened).toBe(true);
  });

  it("close() removes open attribute and emits blora-close", async () => {
    vi.useFakeTimers();
    const dialog = document.createElement("blora-dialog") as BloraDialog;
    document.body.appendChild(dialog);

    dialog.show();
    expect(dialog.hasAttribute("open")).toBe(true);

    let closed = false;
    dialog.addEventListener("blora-close", () => {
      closed = true;
    });

    dialog.close();
    vi.advanceTimersByTime(300);

    expect(dialog.hasAttribute("open")).toBe(false);
    expect(closed).toBe(true);
    vi.useRealTimers();
  });

  it("blora-before-open is cancelable", () => {
    const dialog = document.createElement("blora-dialog") as BloraDialog;
    document.body.appendChild(dialog);

    dialog.addEventListener("blora-before-open", (e) => {
      e.preventDefault();
    });

    dialog.show();

    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("blora-before-close is cancelable", () => {
    vi.useFakeTimers();
    const dialog = document.createElement("blora-dialog") as BloraDialog;
    document.body.appendChild(dialog);

    dialog.show();

    dialog.addEventListener("blora-before-close", (e) => {
      e.preventDefault();
    });

    dialog.close();
    vi.advanceTimersByTime(300);

    expect(dialog.hasAttribute("open")).toBe(true);
    vi.useRealTimers();
  });
});
