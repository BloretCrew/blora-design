import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createCarouselController } from "../src/components/carousel/carousel.js";
import { createTreeController } from "../src/components/tree/tree.js";
import { createRateController } from "../src/components/rate/rate.js";
import { createOtpController } from "../src/components/otp/otp.js";
import { createSliderController } from "../src/components/slider/slider.js";
import { createMegamenuController } from "../src/components/dock/dock.js";
import { createDockController } from "../src/components/dock/dock.js";

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

  it("toggles data-open on toggle click", () => {
    const ctrl = createTreeController(root);
    const toggle = root.querySelector(".blora-tree__toggle") as HTMLElement;
    const node = root.querySelector(".blora-tree__node") as HTMLElement;
    expect(node.hasAttribute("data-open")).toBe(true);
    toggle.click();
    expect(node.hasAttribute("data-open")).toBe(false);
    toggle.click();
    expect(node.hasAttribute("data-open")).toBe(true);
    ctrl.destroy();
  });

  it("selects leaf node on click", () => {
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
    const panel = root.querySelector(".blora-megamenu__panel") as HTMLElement;
    expect(panel.hasAttribute("data-open")).toBe(false);
    trigger.click();
    expect(panel.hasAttribute("data-open")).toBe(true);
    trigger.click();
    expect(panel.hasAttribute("data-open")).toBe(false);
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
