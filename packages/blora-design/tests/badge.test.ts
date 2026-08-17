import { describe, it, expect, afterEach } from "vitest";
import { enhanceBadges } from "../src/components/badge/index.js";

describe("enhanceBadges shape", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("marks a single character as a circle, including semantic colors", () => {
    const three = document.createElement("span");
    three.className = "blora-badge";
    three.dataset.variant = "danger";
    three.textContent = "3";
    const word = document.createElement("span");
    word.className = "blora-badge";
    word.dataset.variant = "danger";
    word.textContent = "Warning";
    const many = document.createElement("span");
    many.className = "blora-badge";
    many.textContent = "99+";
    document.body.append(three, word, many);

    enhanceBadges();

    expect(three.getAttribute("data-shape")).toBe("circle");
    expect(word.getAttribute("data-shape")).toBe("pill");
    expect(many.getAttribute("data-shape")).toBe("pill");
  });

  it("does not circle pill or icon+label badges", () => {
    const pill = document.createElement("span");
    pill.className = "blora-badge";
    pill.dataset.variant = "pill";
    pill.textContent = "N";
    const withIcon = document.createElement("span");
    withIcon.className = "blora-badge";
    withIcon.dataset.icon = "info";
    withIcon.textContent = "I";
    document.body.append(pill, withIcon);

    enhanceBadges();

    expect(pill.hasAttribute("data-shape")).toBe(false);
    expect(withIcon.hasAttribute("data-shape")).toBe(false);
    expect(withIcon.querySelector("svg")).not.toBeNull();
  });
});
