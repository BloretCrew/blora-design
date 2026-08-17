import { describe, expect, it } from "vitest";
import { paginationWindow } from "../src/components/pagination/pagination.js";

describe("paginationWindow", () => {
  it("keeps a 5-page window when both ellipses hide more than one page", () => {
    const window = paginationWindow(7, 12, 7);
    expect(window.windowed).toBe(true);
    expect(window.showStartEllipsis).toBe(true);
    expect(window.showEndEllipsis).toBe(true);
    expect(window.windowSize).toBe(5);
    expect(window.offset).toBe(3);
    expect(window.inner).toEqual([5, 6, 7, 8, 9]);
    expect(window.items).toEqual([1, "ellipsis", 5, 6, 7, 8, 9, "ellipsis", 12]);
  });

  it("grows the window by 1 instead of leaving a gap next to the first page", () => {
    const nearStart = paginationWindow(5, 12, 7);
    expect(nearStart.showStartEllipsis).toBe(false);
    expect(nearStart.showEndEllipsis).toBe(true);
    expect(nearStart.windowSize).toBe(6);
    expect(nearStart.offset).toBe(0);
    expect(nearStart.inner).toEqual([2, 3, 4, 5, 6, 7]);
    expect(nearStart.items).toEqual([1, 2, 3, 4, 5, 6, 7, "ellipsis", 12]);

    const atStart = paginationWindow(2, 12, 7);
    expect(atStart.showStartEllipsis).toBe(false);
    expect(atStart.windowSize).toBe(6);
    expect(atStart.inner).toEqual([2, 3, 4, 5, 6, 7]);
  });

  it("grows the window by 1 instead of leaving a gap next to the last page", () => {
    const nearEnd = paginationWindow(8, 12, 7);
    expect(nearEnd.showStartEllipsis).toBe(true);
    expect(nearEnd.showEndEllipsis).toBe(false);
    expect(nearEnd.windowSize).toBe(6);
    expect(nearEnd.offset).toBe(4);
    expect(nearEnd.inner).toEqual([6, 7, 8, 9, 10, 11]);
    expect(nearEnd.items).toEqual([1, "ellipsis", 6, 7, 8, 9, 10, 11, 12]);
  });

  it("falls back to a full list when both end gaps would be filled", () => {
    const window = paginationWindow(4, 8, 7);
    expect(window.windowed).toBe(false);
    expect(window.showStartEllipsis).toBe(false);
    expect(window.showEndEllipsis).toBe(false);
    expect(window.items).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
