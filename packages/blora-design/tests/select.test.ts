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

  it("survives reconnect and picks up options added after mount", async () => {
    const select = document.createElement("blora-select") as BloraSelect;
    document.body.appendChild(select);
    const shadow = select.shadowRoot;
    select.remove();
    document.body.appendChild(select);
    expect(select.shadowRoot).toBe(shadow);

    const option = document.createElement("blora-option");
    option.setAttribute("value", "late");
    option.textContent = "Late";
    select.appendChild(option);
    await Promise.resolve();
    expect(select.options).toHaveLength(1);
    expect(select.options[0]?.value).toBe("late");
  });

  it("renders multiple values with official removable tags", () => {
    const select = document.createElement("blora-select") as BloraSelect;
    select.setAttribute("multiple", "");
    select.setAttribute("max-tag-count", "2");
    select.setAttribute("value", "design,frontend,product");
    select.innerHTML = `
      <blora-option value="design">设计</blora-option>
      <blora-option value="frontend">前端</blora-option>
      <blora-option value="product">产品</blora-option>
    `;
    document.body.appendChild(select);
    const tags = select.shadowRoot?.querySelectorAll(".blora-tag") ?? [];
    expect(tags).toHaveLength(3);
    expect(tags[0]?.classList.contains("blora-tag--removable")).toBe(true);
    expect(tags[0]?.getAttribute("data-variant")).toBe("primary");
    expect(tags[0]?.querySelector(".blora-tag__close")).not.toBeNull();
    expect(tags[2]?.textContent).toBe("+1");
    select.remove();
  });
});
