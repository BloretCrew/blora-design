import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";

const dist = resolve(import.meta.dirname, "..", "..", "dist");

function readDist(...parts: string[]): string {
  return readFileSync(resolve(dist, ...parts), "utf8");
}

const pageCss = [
  readDist("tokens.css"),
  readDist("foundations", "reset.css"),
  readDist("foundations", "base.css"),
  readDist("components", "button", "button.css"),
  readDist("components", "tag", "tag.css"),
  readDist("components", "command-palette", "command-palette.css"),
  readDist("components", "search", "search.css"),
  readDist("components", "input", "input.css"),
  readDist("components", "tour", "tour.css"),
].join("\n");

const globalJs = readDist("blora.global.js");

function htmlPage(content: string): string {
  return `<style>${pageCss}</style><script>${globalJs}</script><script>globalThis.Blora.autoDefine()</script>${content}`;
}

test("command overlay covers the viewport and locks the window scrollbar", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.setContent(
    htmlPage(`
      <div style="height:2400px">tall page so the window would scroll</div>
      <blora-command id="command" data-overlay placeholder="search">
        <blora-command-item value="new" label="New"></blora-command-item>
      </blora-command>
    `),
  );
  await page.evaluate(() => document.documentElement.scrollTo(0, 400));
  await page.locator("#command").evaluate((host) => {
    (host as HTMLElement & { show: () => void }).show();
  });

  const overlay = page.locator("blora-command[data-overlay][open]");
  await expect(overlay).toBeVisible();
  const box = await overlay.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeLessThanOrEqual(0);
  expect(box!.y).toBeLessThanOrEqual(0);
  expect(box!.width).toBeGreaterThanOrEqual(1280);
  expect(box!.height).toBeGreaterThanOrEqual(720);

  const metrics = await overlay.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      overflow: style.overflow,
      borderWidth: style.borderWidth,
      scrollLocked: document.documentElement.dataset.bloraScrollLocked,
      htmlOverflowY: getComputedStyle(document.documentElement).overflowY,
    };
  });
  expect(metrics.overflow).toBe("visible");
  expect(metrics.borderWidth === "0px" || metrics.borderWidth.startsWith("0")).toBe(true);
  expect(metrics.scrollLocked).toBe("1");
  expect(metrics.htmlOverflowY).toBe("hidden");
});

test("tour spotlight ring contains the target and spreads a page dimmer", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.setContent(
    htmlPage(`
      <blora-tour>
        <blora-tour-step title="A" description="one">
          <span class="blora-tag" data-variant="primary" id="tour-target">步骤 A</span>
        </blora-tour-step>
      </blora-tour>
    `),
  );
  await page.locator("[data-tour-start]").click();

  const overlay = page.locator("body > .blora-tour__overlay");
  const ring = overlay.locator(".blora-tour__ring");
  await expect(overlay).toHaveAttribute("data-open", "");
  await expect(page.locator("body > .blora-tour__tooltip")).toBeVisible();

  const [ringBox, targetBox, paint] = await Promise.all([
    ring.boundingBox(),
    page.locator("#tour-target").boundingBox(),
    ring.evaluate((el) => {
      const style = getComputedStyle(el);
      const overlayStyle = getComputedStyle(el.parentElement!);
      return {
        boxShadow: style.boxShadow,
        overlayBackground: overlayStyle.backgroundColor,
        overlayMask: overlayStyle.maskImage || overlayStyle.webkitMaskImage,
      };
    }),
  ]);
  expect(ringBox).not.toBeNull();
  expect(targetBox).not.toBeNull();
  expect(ringBox!.x).toBeLessThanOrEqual(targetBox!.x + 1);
  expect(ringBox!.y).toBeLessThanOrEqual(targetBox!.y + 1);
  expect(ringBox!.x + ringBox!.width).toBeGreaterThanOrEqual(targetBox!.x + targetBox!.width - 1);
  expect(ringBox!.y + ringBox!.height).toBeGreaterThanOrEqual(targetBox!.y + targetBox!.height - 1);
  expect(paint.boxShadow).toContain("9999px");
  expect(paint.overlayMask === "none" || paint.overlayMask === "").toBe(true);
});
