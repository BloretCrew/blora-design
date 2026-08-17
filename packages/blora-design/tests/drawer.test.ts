import { describe, it, expect, beforeEach } from "vitest";
import { defineBloraDrawer, BloraDrawer } from "../src/components/drawer/index.js";

describe("BloraDrawer", () => {
  beforeEach(() => {
    defineBloraDrawer();
    document.body.innerHTML = "";
  });

  it("open() stamps open on the host so the FOUC hide rule lifts", () => {
    const drawer = document.createElement("blora-drawer") as BloraDrawer;
    drawer.setAttribute("title", "侧栏");
    drawer.textContent = "内容";
    document.body.appendChild(drawer);
    expect(drawer.hasAttribute("open")).toBe(false);
    drawer.open();
    expect(drawer.hasAttribute("open")).toBe(true);
    expect(drawer.hasAttribute("data-open")).toBe(true);
    expect(drawer.querySelector(".blora-drawer")?.classList.contains("is-open")).toBe(true);
  });
});
