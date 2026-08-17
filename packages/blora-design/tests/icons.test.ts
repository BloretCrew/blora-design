import { describe, expect, it } from "vitest";
import { createBloraIcon } from "../src/core/icons.js";

describe("internal composite icon factory", () => {
  it.each(["home", "search", "user", "settings", "check", "info", "inbox", "thumbs-up"] as const)(
    "creates a consistent decorative %s SVG",
    (name) => {
      const icon = createBloraIcon(name, 20);
      expect(icon.localName).toBe("svg");
      expect(icon.getAttribute("viewBox")).toBe("0 0 24 24");
      expect(icon.getAttribute("width")).toBe("20");
      expect(icon.getAttribute("height")).toBe("20");
      expect(icon.getAttribute("stroke")).toBe("currentColor");
      expect(icon.getAttribute("aria-hidden")).toBe("true");
      expect(icon.getAttribute("data-blora-icon")).toBe(name);
      expect(icon.childElementCount).toBeGreaterThan(0);
    },
  );
});
