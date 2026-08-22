import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createCarouselController } from "../src/components/carousel/carousel.js";
import { createTreeController } from "../src/components/tree/tree.js";
import { createRateController } from "../src/components/rate/rate.js";
import { createOtpController } from "../src/components/otp/otp.js";
import { createSliderController } from "../src/components/slider/slider.js";
import { createMegamenuController } from "../src/components/megamenu/megamenu.js";
import { createDockController } from "../src/components/dock/dock.js";
import { OverlayController } from "../src/controllers/overlay-controller.js";
import { createBloraIcon } from "../src/core/icons.js";

describe("OverlayController", () => {
  it("locks and unlocks the overlay owner document", () => {
    const foreignDocument = document.implementation.createHTMLDocument("overlay");
    const overlay = foreignDocument.createElement("div");
    foreignDocument.body.appendChild(overlay);
    const controller = new OverlayController(overlay, {
      trapFocus: false,
      restoreFocus: false,
      closeOnEscape: false,
      closeOnOutsidePointer: false,
    });

    controller.open();
    expect(foreignDocument.body.style.position).toBe("fixed");
    expect(foreignDocument.documentElement.dataset.bloraScrollLocked).toBe("1");
    expect(document.body.style.position).not.toBe("fixed");
    expect(document.documentElement.dataset.bloraScrollLocked).toBeUndefined();

    controller.close();
    expect(foreignDocument.body.style.position).toBe("");
    expect(foreignDocument.documentElement.dataset.bloraScrollLocked).toBeUndefined();
  });

  it("keeps scroll locks isolated between documents", () => {
    const foreignDocument = document.implementation.createHTMLDocument("overlay");
    const localOverlay = document.createElement("div");
    const foreignOverlay = foreignDocument.createElement("div");
    document.body.appendChild(localOverlay);
    foreignDocument.body.appendChild(foreignOverlay);
    const local = new OverlayController(localOverlay, {
      trapFocus: false,
      restoreFocus: false,
    });
    const foreign = new OverlayController(foreignOverlay, {
      trapFocus: false,
      restoreFocus: false,
    });

    local.open();
    foreign.open();
    local.close();
    expect(document.body.style.position).not.toBe("fixed");
    expect(document.documentElement.dataset.bloraScrollLocked).toBeUndefined();
    expect(foreignDocument.body.style.position).toBe("fixed");
    expect(foreignDocument.documentElement.dataset.bloraScrollLocked).toBe("1");

    foreign.close();
    localOverlay.remove();
  });

  it("freezes the document at the current scroll offset", () => {
    const overlay = document.createElement("div");
    document.body.appendChild(overlay);
    const previousOverflow = document.body.style.overflow;
    const controller = new OverlayController(overlay, {
      trapFocus: false,
      restoreFocus: false,
      closeOnEscape: false,
      closeOnOutsidePointer: false,
    });

    controller.open();
    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toMatch(/^-?\d+(\.\d+)?px$/);
    expect(document.body.style.overflow).toBe("visible");
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.documentElement.dataset.bloraScrollLocked).toBe("1");

    controller.close();
    expect(document.body.style.position).toBe("");
    expect(document.body.style.top).toBe("");
    expect(document.body.style.overflow).toBe(previousOverflow);
    expect(document.documentElement.style.overflow).toBe("");
    expect(document.documentElement.dataset.bloraScrollLocked).toBeUndefined();
    overlay.remove();
  });

  it("keeps the document modal marker until the last modal closes", () => {
    const firstElement = document.createElement("div");
    const secondElement = document.createElement("div");
    document.body.append(firstElement, secondElement);
    const options = { trapFocus: false, restoreFocus: false };
    const first = new OverlayController(firstElement, options);
    const second = new OverlayController(secondElement, options);

    first.open();
    second.open();
    expect(document.documentElement.hasAttribute("data-blora-modal-open")).toBe(true);
    first.close();
    expect(document.documentElement.hasAttribute("data-blora-modal-open")).toBe(true);
    second.close();
    expect(document.documentElement.hasAttribute("data-blora-modal-open")).toBe(false);
    firstElement.remove();
    secondElement.remove();
  });
});

describe("createCarouselController", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("div");
    root.className = "blora-carousel";
    root.innerHTML = `
      <div class="blora-carousel__track">
        <div class="blora-carousel__slide"></div>
        <div class="blora-carousel__slide"></div>
        <div class="blora-carousel__slide"></div>
      </div>
      <button class="blora-carousel__arrow blora-carousel__arrow--prev"></button>
      <button class="blora-carousel__arrow blora-carousel__arrow--next"></button>
      <div class="blora-carousel__dots">
        <span class="blora-carousel__dot"></span>
        <span class="blora-carousel__dot"></span>
        <span class="blora-carousel__dot"></span>
      </div>`;
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it("sets first dot active on init", () => {
    createCarouselController(root);
    const dots = root.querySelectorAll(".blora-carousel__dot");
    expect(dots[0]!.hasAttribute("data-active")).toBe(true);
    expect(dots[1]!.hasAttribute("data-active")).toBe(false);
  });

  it("advances to next slide on next arrow click", () => {
    const ctrl = createCarouselController(root);
    const nextBtn = root.querySelector(".blora-carousel__arrow--next") as HTMLButtonElement;
    nextBtn.click();
    const dots = root.querySelectorAll(".blora-carousel__dot");
    expect(dots[1]!.hasAttribute("data-active")).toBe(true);
    expect(dots[0]!.hasAttribute("data-active")).toBe(false);
    ctrl.destroy();
  });

  it("wraps around on prev from first slide", () => {
    const ctrl = createCarouselController(root);
    const prevBtn = root.querySelector(".blora-carousel__arrow--prev") as HTMLButtonElement;
    prevBtn.click();
    const dots = root.querySelectorAll(".blora-carousel__dot");
    expect(dots[2]!.hasAttribute("data-active")).toBe(true);
    ctrl.destroy();
  });

  it("jumps to slide on dot click", () => {
    const ctrl = createCarouselController(root);
    const dots = root.querySelectorAll(".blora-carousel__dot");
    dots[2]!.click();
    expect(dots[2]!.hasAttribute("data-active")).toBe(true);
    ctrl.destroy();
  });
});

describe("createTreeController", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("div");
    root.className = "blora-tree";
    root.innerHTML = `
      <div class="blora-tree__node" data-open>
        <span class="blora-tree__toggle">v</span><span>Folder</span>
      </div>
      <div class="blora-tree__children">
        <div class="blora-tree__node"><span style="width:1em"></span><span>Leaf</span></div>
      </div>`;
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it("toggles data-open on whole-row click (v1 parity)", () => {
    const ctrl = createTreeController(root);
    const node = root.querySelector(".blora-tree__node") as HTMLElement;
    expect(node.hasAttribute("data-open")).toBe(true);
    // Click the label text, not just the chevron
    const label = node.querySelector("span:last-child") as HTMLElement;
    label.click();
    expect(node.hasAttribute("data-open")).toBe(false);
    node.click();
    expect(node.hasAttribute("data-open")).toBe(true);
    ctrl.destroy();
  });

  it("selects node on click", () => {
    const ctrl = createTreeController(root);
    const leaf = root.querySelectorAll(".blora-tree__node")[1] as HTMLElement;
    leaf.click();
    expect(leaf.hasAttribute("data-selected")).toBe(true);
    ctrl.destroy();
  });
});

describe("createRateController", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("div");
    root.className = "blora-rate";
    root.dataset.value = "3";
    root.innerHTML = `
      <span class="blora-rate__star" data-active>★</span>
      <span class="blora-rate__star" data-active>★</span>
      <span class="blora-rate__star" data-active>★</span>
      <span class="blora-rate__star">★</span>
      <span class="blora-rate__star">★</span>`;
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it("sets rating on star click", () => {
    const ctrl = createRateController(root);
    const stars = root.querySelectorAll(".blora-rate__star");
    stars[4]!.click();
    expect(root.dataset.value).toBe("5");
    expect(stars[4]!.hasAttribute("data-active")).toBe(true);
    ctrl.destroy();
  });

  it("does not respond when readonly", () => {
    root.setAttribute("data-readonly", "");
    const ctrl = createRateController(root);
    const stars = root.querySelectorAll(".blora-rate__star");
    stars[4]!.click();
    expect(root.dataset.value).toBe("3");
    ctrl.destroy();
  });

  it("sets rating when the SVG inside a star is the click target", () => {
    const ctrl = createRateController(root);
    const stars = root.querySelectorAll(".blora-rate__star");
    const svg = createBloraIcon("star");
    stars[4]!.replaceChildren(svg);
    svg.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(root.dataset.value).toBe("5");
    expect(stars[4]!.hasAttribute("data-active")).toBe(true);
    ctrl.destroy();
  });
});

describe("createOtpController", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("div");
    root.className = "blora-otp";
    root.dataset.mode = "numeric";
    root.innerHTML = `
      <input class="blora-otp__input" maxlength="1" type="text">
      <input class="blora-otp__input" maxlength="1" type="text">
      <input class="blora-otp__input" maxlength="1" type="text">`;
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it("filters non-numeric in numeric mode", () => {
    const ctrl = createOtpController(root);
    const input = root.querySelector(".blora-otp__input") as HTMLInputElement;
    input.value = "a";
    input.dispatchEvent(new Event("input"));
    expect(input.value).toBe("");
    ctrl.destroy();
  });

  it("accepts numeric in numeric mode", () => {
    const ctrl = createOtpController(root);
    const input = root.querySelector(".blora-otp__input") as HTMLInputElement;
    input.value = "5";
    input.dispatchEvent(new Event("input"));
    expect(input.value).toBe("5");
    ctrl.destroy();
  });
});

describe("createSliderController", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("div");
    root.className = "blora-slider";
    root.innerHTML = `
      <input class="blora-slider__input" type="range" min="0" max="100" value="42">
      <span class="blora-slider__value">42</span>`;
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it("updates value display on input change", () => {
    const ctrl = createSliderController(root);
    const input = root.querySelector(".blora-slider__input") as HTMLInputElement;
    const value = root.querySelector(".blora-slider__value") as HTMLElement;
    input.value = "75";
    input.dispatchEvent(new Event("input"));
    expect(value.textContent).toBe("75");
    ctrl.destroy();
  });

  it("sets --blora-slider-fill custom property", () => {
    const ctrl = createSliderController(root);
    const input = root.querySelector(".blora-slider__input") as HTMLInputElement;
    input.value = "50";
    input.dispatchEvent(new Event("input"));
    expect(root.style.getPropertyValue("--blora-slider-fill")).toBe("50%");
    ctrl.destroy();
  });
});

describe("createMegamenuController", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("div");
    root.className = "blora-megamenu";
    root.innerHTML = `
      <button class="blora-megamenu__trigger" type="button">Menu</button>
      <div class="blora-megamenu__panel"></div>`;
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it("toggles panel open on trigger click", () => {
    const ctrl = createMegamenuController(root);
    const trigger = root.querySelector(".blora-megamenu__trigger") as HTMLButtonElement;
    expect(root.hasAttribute("data-open")).toBe(false);
    trigger.click();
    expect(root.hasAttribute("data-open")).toBe(true);
    trigger.click();
    expect(root.hasAttribute("data-open")).toBe(false);
    ctrl.destroy();
  });
});

describe("createDockController", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("nav");
    root.className = "blora-dock";
    root.innerHTML = `
      <a class="blora-dock__item" data-active href="#">A</a>
      <a class="blora-dock__item" href="#">B</a>
      <a class="blora-dock__item" href="#">C</a>`;
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it("sets data-active on clicked item and removes from others", () => {
    const ctrl = createDockController(root);
    const items = root.querySelectorAll(".blora-dock__item");
    items[1]!.click();
    expect(items[0]!.hasAttribute("data-active")).toBe(false);
    expect(items[1]!.hasAttribute("data-active")).toBe(true);
    ctrl.destroy();
  });
});

describe("createCalendarController", () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = document.createElement("div");
    root.className = "blora-calendar";
    document.body.appendChild(root);
  });
  afterEach(() => root.remove());

  it("renders day grid and navigates months", async () => {
    const { createCalendarController } = await import("../src/components/calendar/calendar.js");
    const ctrl = createCalendarController(root);
    expect(root.querySelector(".blora-calendar__grid")).toBeTruthy();
    expect(root.querySelectorAll(".blora-calendar__cell[data-day]").length).toBeGreaterThan(27);
    const next = root.querySelector('[data-nav="next"]') as HTMLButtonElement;
    const titleBefore = root.querySelector(".blora-calendar__title")!.textContent;
    next.click();
    const titleAfter = root.querySelector(".blora-calendar__title")!.textContent;
    expect(titleAfter).not.toBe(titleBefore);
    ctrl.destroy();
  });

  it("zooms to months then years", async () => {
    const { createCalendarController } = await import("../src/components/calendar/calendar.js");
    const ctrl = createCalendarController(root);
    (root.querySelector("[data-zoom]") as HTMLElement).click();
    expect(root.querySelector(".blora-calendar__grid--months")).toBeTruthy();
    (root.querySelector("[data-zoom]") as HTMLElement).click();
    expect(root.querySelector(".blora-calendar__grid--years")).toBeTruthy();
    ctrl.destroy();
  });
});

describe("createTagsInputController", () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = document.createElement("div");
    root.className = "blora-tags-input";
    root.innerHTML = `<span class="blora-tag" data-variant="primary">A<button class="blora-tag__close" type="button" aria-label="移除"></button></span><input type="text" />`;
    document.body.appendChild(root);
  });
  afterEach(() => root.remove());

  it("adds tag on Enter and removes on close", async () => {
    const { createTagsInputController } =
      await import("../src/components/tags-input/tags-input.js");
    const ctrl = createTagsInputController(root);
    const input = root.querySelector("input") as HTMLInputElement;
    input.value = "NewTag";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(root.textContent).toContain("NewTag");
    const closes = root.querySelectorAll(".blora-tag__close");
    expect(closes.length).toBeGreaterThan(1);
    (closes[0] as HTMLElement).click();
    expect(root.querySelectorAll(".blora-tag").length).toBeGreaterThan(0);
    ctrl.destroy();
  });
});

describe("createMegamenuController root data-open", () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = document.createElement("div");
    root.className = "blora-megamenu";
    root.innerHTML = `<button class="blora-megamenu__trigger">Open</button><div class="blora-megamenu__panel">Panel</div>`;
    document.body.appendChild(root);
  });
  afterEach(() => root.remove());

  it("toggles data-open on root", async () => {
    const { createMegamenuController } = await import("../src/components/megamenu/megamenu.js");
    const ctrl = createMegamenuController(root);
    const btn = root.querySelector("button") as HTMLButtonElement;
    btn.click();
    expect(root.hasAttribute("data-open")).toBe(true);
    btn.click();
    expect(root.hasAttribute("data-open")).toBe(false);
    ctrl.destroy();
  });
});

describe("createFieldController overflow highlight", () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = document.createElement("div");
    root.innerHTML = `<div class="blora-field"><input class="blora-input" data-limit="5" value="12345678" /></div>`;
    document.body.appendChild(root);
  });
  afterEach(() => root.remove());

  it("marks over-limit and fills overflow mirror text", async () => {
    const { createFieldController } = await import("../src/components/field/field.js");
    const ctrl = createFieldController(root);
    const wrap = root.querySelector(".blora-limit") as HTMLElement;
    expect(wrap).toBeTruthy();
    expect(wrap.hasAttribute("data-over-limit")).toBe(true);
    const overflow = wrap.querySelector(".blora-limit__overflow") as HTMLElement;
    expect(overflow.textContent).toBe("678");
    ctrl.destroy();
  });
});

describe("createDatepickerController custom panel", () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = document.createElement("div");
    root.className = "blora-datepicker";
    root.innerHTML = `<input class="blora-input" type="date" min="1900-01-01" max="2099-12-31" /><button class="blora-datepicker__btn" type="button"></button>`;
    document.body.appendChild(root);
  });
  afterEach(() => root.remove());

  it("keeps type=date and opens custom panel on button click", async () => {
    const { createDatepickerController } =
      await import("../src/components/datepicker/datepicker.js");
    const ctrl = createDatepickerController(root);
    const input = root.querySelector("input") as HTMLInputElement;
    expect(input.type).toBe("date");
    const btn = root.querySelector("button") as HTMLButtonElement;
    btn.click();
    const panel = root.querySelector(".blora-datepicker__panel") as HTMLElement;
    expect(panel.hasAttribute("data-open")).toBe(true);
    expect(panel.querySelector(".blora-datepicker__grid")).toBeTruthy();
    ctrl.destroy();
  });

  it("keeps panel open when zooming year/month title", async () => {
    const { createDatepickerController } =
      await import("../src/components/datepicker/datepicker.js");
    const ctrl = createDatepickerController(root);
    const btn = root.querySelector("button") as HTMLButtonElement;
    btn.click();
    const panel = root.querySelector(".blora-datepicker__panel") as HTMLElement;
    const title = panel.querySelector("[data-zoom]") as HTMLElement;
    title.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(panel.hasAttribute("data-open")).toBe(true);
    expect(panel.querySelector(".blora-datepicker__grid--months")).toBeTruthy();
    // second zoom → years, still open
    const title2 = panel.querySelector("[data-zoom]") as HTMLElement;
    title2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(panel.hasAttribute("data-open")).toBe(true);
    expect(panel.querySelector(".blora-datepicker__grid--years")).toBeTruthy();
    ctrl.destroy();
  });
});

describe("createCopyController checkmark", () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = document.createElement("div");
    root.className = "blora-copy";
    root.dataset.copyText = "hello";
    root.innerHTML = `<button class="blora-copy__btn" type="button"><span>icon</span></button>`;
    document.body.appendChild(root);
    // mock clipboard
    Object.assign(navigator, {
      clipboard: { writeText: async () => {} },
    });
  });
  afterEach(() => root.remove());

  it("swaps to check icon and sets data-copied", async () => {
    const { createCopyController } = await import("../src/components/copy/copy.js");
    const ctrl = createCopyController(root);
    const btn = root.querySelector("button") as HTMLButtonElement;
    await btn.click();
    // click handler is async
    await new Promise((r) => setTimeout(r, 20));
    expect(root.hasAttribute("data-copied")).toBe(true);
    expect(btn.querySelector("svg")).toBeTruthy();
    ctrl.destroy();
  });
});
