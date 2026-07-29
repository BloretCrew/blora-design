import { describe, it, expect, beforeEach } from "vitest";
import {
  defineBloraSelect,
  BloraSelect,
  BLORA_SELECT_TAG,
} from "../src/components/select/index.js";

describe("BloraSelect", () => {
  beforeEach(() => {
    defineBloraSelect();
    document.body.innerHTML = "";
  });

  it("defines the custom element", () => {
    expect(customElements.get(BLORA_SELECT_TAG)).toBe(BloraSelect);
  });

  it("defineBloraSelect is idempotent", () => {
    defineBloraSelect();
    defineBloraSelect();
    expect(customElements.get(BLORA_SELECT_TAG)).toBe(BloraSelect);
  });

  it("collects options from slotted blora-option elements", () => {
    const select = document.createElement("blora-select") as BloraSelect;
    select.innerHTML = `
      <blora-option value="a">A</blora-option>
      <blora-option value="b">B</blora-option>
    `;
    document.body.appendChild(select);

    expect(select.options.length).toBe(2);
    expect(select.options[0]!.value).toBe("a");
    expect(select.options[1]!.label).toBe("B");
  });

  it("setting value updates display and form value", () => {
    const select = document.createElement("blora-select") as BloraSelect;
    select.innerHTML = `<blora-option value="x">X</blora-option>`;
    document.body.appendChild(select);

    select.value = "x";
    expect(select.value).toBe("x");
  });

  it("open() emits blora-open event", () => {
    const select = document.createElement("blora-select") as BloraSelect;
    select.innerHTML = `<blora-option value="a">A</blora-option>`;
    document.body.appendChild(select);

    let opened = false;
    select.addEventListener("blora-open", () => {
      opened = true;
    });

    select.open();
    expect(opened).toBe(true);
  });

  it("disabled select does not open", () => {
    const select = document.createElement("blora-select") as BloraSelect;
    select.setAttribute("disabled", "");
    select.innerHTML = `<blora-option value="a">A</blora-option>`;
    document.body.appendChild(select);

    let opened = false;
    select.addEventListener("blora-open", () => {
      opened = true;
    });

    select.open();
    expect(opened).toBe(false);
  });

  it("blora-before-open is cancelable", () => {
    const select = document.createElement("blora-select") as BloraSelect;
    select.innerHTML = `<blora-option value="a">A</blora-option>`;
    document.body.appendChild(select);

    select.addEventListener("blora-before-open", (e) => {
      e.preventDefault();
    });

    select.open();

    // Should not have opened
    expect(
      select.shadowRoot?.querySelector(".blora-select__popup")?.hasAttribute("data-open"),
    ).toBeFalsy();
  });
});
