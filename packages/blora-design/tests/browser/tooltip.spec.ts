import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";

const tokensCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "dist", "tokens.css"),
  "utf8",
);
const foundationsCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "dist", "foundations.css"),
  "utf8",
);
const tooltipCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "src", "components", "tooltip", "tooltip.css"),
  "utf8",
);
const indicatorCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "src", "components", "indicator", "indicator.css"),
  "utf8",
);
const joinCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "src", "components", "join", "join.css"),
  "utf8",
);
const buttonCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "src", "components", "button", "button.css"),
  "utf8",
);

function htmlPage(content: string): string {
  return `<style>${tokensCss}</style><style>${foundationsCss}</style><style>${tooltipCss}</style><style>${indicatorCss}</style><style>${joinCss}</style><style>${buttonCss}</style>${content}`;
}

test("tooltip start and end sit on opposite inline sides", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <div style="padding:120px;display:flex;justify-content:center;gap:80px">
        <span class="blora-tooltip" data-placement="start" id="start">
          起始
          <span class="blora-tooltip__bubble" style="opacity:1">左侧</span>
        </span>
        <span class="blora-tooltip" data-placement="end" id="end">
          结束
          <span class="blora-tooltip__bubble" style="opacity:1">右侧</span>
        </span>
      </div>
    `),
  );

  const geometry = await page.evaluate(() => {
    const start = document.querySelector("#start")!.getBoundingClientRect();
    const startBubble = document
      .querySelector("#start .blora-tooltip__bubble")!
      .getBoundingClientRect();
    const end = document.querySelector("#end")!.getBoundingClientRect();
    const endBubble = document
      .querySelector("#end .blora-tooltip__bubble")!
      .getBoundingClientRect();
    return {
      startLeftOfTrigger: startBubble.right <= start.left + 1,
      endRightOfTrigger: endBubble.left >= end.right - 1,
    };
  });

  expect(geometry).toEqual({ startLeftOfTrigger: true, endRightOfTrigger: true });
});

test("indicator placements pin the overlay to the matching corner", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <div style="padding:40px;display:flex;gap:48px">
        <span class="blora-indicator" id="def">
          <button class="blora-button" type="button">默认</button>
          <span class="blora-indicator__item" id="def-item">•</span>
        </span>
        <span class="blora-indicator" data-placement="bottom-start" id="bs">
          <button class="blora-button" type="button">左下</button>
          <span class="blora-indicator__item" id="bs-item">•</span>
        </span>
      </div>
    `),
  );

  const geometry = await page.evaluate(() => {
    const host = (id: string) => document.getElementById(id)!.getBoundingClientRect();
    const item = (id: string) => document.getElementById(id)!.getBoundingClientRect();
    const defH = host("def");
    const defI = item("def-item");
    const bsH = host("bs");
    const bsI = item("bs-item");
    return {
      defaultTopRight: defI.right > defH.right - 8 && defI.top < defH.top + 8,
      bottomStart: bsI.left < bsH.left + 8 && bsI.bottom > bsH.bottom - 8,
    };
  });

  expect(geometry.defaultTopRight).toBe(true);
  expect(geometry.bottomStart).toBe(true);
});

test("join and button group share button welding geometry", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <div class="blora-join" id="join">
        <button class="blora-button" type="button" data-variant="outline">左</button>
        <button class="blora-button" type="button" data-variant="outline">右</button>
      </div>
      <div class="blora-button-group" id="group">
        <button class="blora-button" type="button" data-variant="outline">左</button>
        <button class="blora-button" type="button" data-variant="outline">右</button>
      </div>
    `),
  );

  const geometry = await page.evaluate(() => {
    const inspect = (selector: string) => {
      const buttons = [...document.querySelectorAll<HTMLElement>(`${selector} .blora-button`)];
      const first = buttons[0]!.getBoundingClientRect();
      const last = buttons[1]!.getBoundingClientRect();
      return {
        welded: Math.abs(last.left - first.right) <= 1,
        heights: [first.height, last.height],
        radii: buttons.map((button) => {
          const style = getComputedStyle(button);
          return [
            style.borderStartStartRadius,
            style.borderStartEndRadius,
            style.borderEndEndRadius,
            style.borderEndStartRadius,
          ];
        }),
      };
    };
    return { join: inspect("#join"), group: inspect("#group") };
  });

  expect(geometry.join.welded).toBe(true);
  expect(geometry.group.welded).toBe(true);
  expect(geometry.join.heights).toEqual(geometry.group.heights);
  expect(geometry.join.radii).toEqual(geometry.group.radii);
});
