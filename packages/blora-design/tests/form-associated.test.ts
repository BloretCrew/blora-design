import { describe, it, expect, beforeEach } from "vitest";
import { BloraSwitch, defineBloraSwitch } from "../src/components/switch/switch.js";
import { defineBloraCheckbox, BLORA_CHECKBOX_TAG } from "../src/components/checkbox/checkbox.js";
import { BloraRange, defineBloraRange } from "../src/components/range/range.js";
import { BloraSlider, defineBloraSlider } from "../src/components/slider/slider.js";
import { BloraTagsInput, defineBloraTagsInput } from "../src/components/tags-input/tags-input.js";
import { BloraSearch, defineBloraSearch } from "../src/components/search/search.js";
import { BloraUpload, defineBloraUpload } from "../src/components/upload/upload.js";
import { BloraOtp, defineBloraOtp } from "../src/components/otp/otp.js";

describe("form-associated CEs", () => {
  beforeEach(() => {
    defineBloraSwitch();
    defineBloraCheckbox();
    defineBloraRange();
    defineBloraSlider();
    defineBloraTagsInput();
    defineBloraSearch();
    defineBloraUpload();
    defineBloraOtp();
    document.body.innerHTML = "";
  });

  it("declares formAssociated on switch", () => {
    expect(BloraSwitch.formAssociated).toBe(true);
  });

  it("declares formAssociated across the form control family", () => {
    expect(BloraRange.formAssociated).toBe(true);
    expect(BloraSlider.formAssociated).toBe(true);
    expect(BloraTagsInput.formAssociated).toBe(true);
    expect(BloraSearch.formAssociated).toBe(true);
    expect(BloraUpload.formAssociated).toBe(true);
    expect(BloraOtp.formAssociated).toBe(true);
  });

  it("declares checkbox as a form-associated custom element", () => {
    expect(
      (document.defaultView?.customElements.get(BLORA_CHECKBOX_TAG) as typeof HTMLElement)
        .formAssociated,
    ).toBe(true);
  });

  it("single checkbox keeps an internals-backed host", () => {
    const el = document.createElement(BLORA_CHECKBOX_TAG);
    el.setAttribute("name", "agree");
    el.setAttribute("value", "yes");
    el.setAttribute("checked", "");
    document.body.append(el);
    const input = el.querySelector("input")!;
    expect(input).toBeTruthy();
    if (typeof el.attachInternals === "function") {
      expect(input.name).toBe("");
    }
  });

  it("keeps native controls unnamed when internals are available", () => {
    const search = document.createElement("blora-search");
    search.setAttribute("name", "q");
    const slider = document.createElement("blora-slider");
    slider.setAttribute("name", "volume");
    const upload = document.createElement("blora-upload");
    upload.setAttribute("name", "docs");
    document.body.append(search, slider, upload);
    if (typeof search.attachInternals !== "function") return;
    expect(search.querySelector("input")!.name).toBe("");
    expect(slider.querySelector("input")!.name).toBe("");
    expect(upload.querySelector('input[type="file"]')!.name).toBe("");
  });

  it("range and tags-input expose values-shaped submission state", () => {
    const range = document.createElement("blora-range");
    range.setAttribute("values", "10,60");
    document.body.append(range);
    expect(range.values).toEqual([10, 60]);

    const tags = document.createElement("blora-tags-input");
    tags.setAttribute("values", "a,b");
    document.body.append(tags);
    expect(tags.values).toEqual(["a", "b"]);
    tags.values = ["x"];
    expect(tags.getAttribute("values")).toBe("x");

    const otp = document.createElement("blora-otp");
    otp.setAttribute("length", "4");
    document.body.append(otp);
    expect(otp.value).toBe("");
  });
});
