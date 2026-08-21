import { describe, expect, it } from "vitest";
import { createBloraIcon, isBloraIconName, registerBloraIcons } from "../src/core/icons.js";
import { BLORA_ICON_FULL_DATA } from "../src/core/icons-full.data.js";

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

describe("opt-in full Lucide table", () => {
  it("registers every lucide icon under its canonical name", () => {
    expect(BLORA_ICON_FULL_DATA["rocket"]).toBeDefined();
    expect(BLORA_ICON_FULL_DATA["zap"]).toBeDefined();
    expect(Object.keys(BLORA_ICON_FULL_DATA).length).toBeGreaterThan(1000);
  });

  it("renders a non-curated icon after registration", () => {
    expect(isBloraIconName("rocket")).toBe(false);
    registerBloraIcons(BLORA_ICON_FULL_DATA);
    expect(isBloraIconName("rocket")).toBe(true);
    const icon = createBloraIcon("rocket", 16);
    expect(icon.getAttribute("data-blora-icon")).toBe("rocket");
    expect(icon.childElementCount).toBeGreaterThan(0);
  });

  it("preserves numbered SVG attributes for line-based icons", () => {
    const italic = BLORA_ICON_FULL_DATA["italic"];
    expect(italic).toEqual([
      { tag: "line", attrs: { x1: "19", y1: "4", x2: "10", y2: "4" } },
      { tag: "line", attrs: { x1: "14", y1: "20", x2: "5", y2: "20" } },
      { tag: "line", attrs: { x1: "15", y1: "4", x2: "9", y2: "20" } },
    ]);
  });
});
