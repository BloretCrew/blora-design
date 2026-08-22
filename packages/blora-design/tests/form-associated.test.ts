import { describe, it, expect, beforeEach } from "vitest";
import { BloraSwitch, defineBloraSwitch } from "../src/components/switch/switch.js";
import { defineBloraCheckbox, BLORA_CHECKBOX_TAG } from "../src/components/checkbox/checkbox.js";

describe("form-associated CEs", () => {
  beforeEach(() => {
    defineBloraSwitch();
    defineBloraCheckbox();
    document.body.innerHTML = "";
  });

  it("declares formAssociated on switch", () => {
    expect(BloraSwitch.formAssociated).toBe(true);
  });

  it("single checkbox keeps an internals-backed host", () => {
    const el = document.createElement(BLORA_CHECKBOX_TAG);
    el.setAttribute("name", "agree");
    el.setAttribute("checked", "");
    document.body.append(el);
    const input = el.querySelector("input")!;
    expect(input).toBeTruthy();
    if (typeof el.attachInternals === "function") {
      expect(input.name).toBe("");
    }
  });
});
