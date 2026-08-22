import { describe, it, expect, beforeEach } from "vitest";
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
    expect(customElements.get(BLORA_DIALOG_TAG)?.name).toBe("BloraDialog");
  });

  it("defineBloraDialog is idempotent", () => {
    defineBloraDialog();
    defineBloraDialog();
    expect(customElements.get(BLORA_DIALOG_TAG)?.name).toBe("BloraDialog");
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

  it("close() removes open immediately without a data-closing flag", () => {
    const dialog = document.createElement("blora-dialog") as BloraDialog;
    document.body.appendChild(dialog);

    dialog.show();
    expect(dialog.hasAttribute("open")).toBe(true);

    let closed = false;
    dialog.addEventListener("blora-close", () => {
      closed = true;
    });

    dialog.close();

    expect(dialog.hasAttribute("open")).toBe(false);
    expect(dialog.hasAttribute("data-closing")).toBe(false);
    expect(closed).toBe(true);
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
    const dialog = document.createElement("blora-dialog") as BloraDialog;
    document.body.appendChild(dialog);

    dialog.show();

    dialog.addEventListener("blora-before-close", (e) => {
      e.preventDefault();
    });

    dialog.close();

    expect(dialog.hasAttribute("open")).toBe(true);
  });

  it("opens from a declarative open attribute", () => {
    document.body.innerHTML = `<blora-dialog open><span slot="title">确认</span>正文</blora-dialog>`;
    const dialog = document.querySelector("blora-dialog") as BloraDialog;
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(dialog.shadowRoot?.querySelector(".blora-dialog__panel")).not.toBeNull();
  });

  it("survives disconnect and reconnect without rebuilding shadow", () => {
    const dialog = document.createElement("blora-dialog") as BloraDialog;
    document.body.appendChild(dialog);
    const shadow = dialog.shadowRoot;
    expect(shadow).not.toBeNull();
    dialog.remove();
    document.body.appendChild(dialog);
    expect(dialog.shadowRoot).toBe(shadow);
    dialog.show();
    expect(dialog.hasAttribute("open")).toBe(true);
  });

  it("hides an empty footer and reveals it when slotted actions are added", async () => {
    const dialog = document.createElement("blora-dialog") as BloraDialog;
    document.body.appendChild(dialog);
    const footer = dialog.shadowRoot!.querySelector<HTMLElement>(".blora-dialog__footer")!;

    expect(footer.hidden).toBe(true);

    const action = document.createElement("button");
    action.slot = "footer";
    action.textContent = "Confirm";
    dialog.appendChild(action);
    await Promise.resolve();

    expect(footer.hidden).toBe(false);

    action.remove();
    await Promise.resolve();
    expect(footer.hidden).toBe(true);
  });
});
