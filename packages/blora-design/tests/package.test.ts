import { describe, it, expect } from "vitest";
import { VERSION, isBrowser } from "../src/index.js";

describe("package entry", () => {
  it("exports the correct version", () => {
    expect(VERSION).toBe("2.0.0-alpha.1");
  });

  it("isBrowser returns true in jsdom", () => {
    expect(isBrowser()).toBe(true);
  });
});
