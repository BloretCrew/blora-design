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
const buttonCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "dist", "components", "button", "button.css"),
  "utf8",
);
const navbarCss = readFileSync(
  resolve(import.meta.dirname, "..", "..", "dist", "components", "navbar", "navbar.css"),
  "utf8",
);

const globalJs = readFileSync(
  resolve(import.meta.dirname, "..", "..", "dist", "blora.global.js"),
  "utf8",
);
const testJs = `${globalJs}\nglobalThis.Blora.defineBloraDialog();`;

function htmlPage(content: string): string {
  return `<style>${tokensCss}</style><style>${foundationsCss}</style><style>${buttonCss}</style><style>${navbarCss}</style><script>${testJs}</script>${content}`;
}

test("dialog opens and closes via API", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <blora-dialog id="dialog">
        <span slot="title">Test Dialog</span>
        <p>Dialog content</p>
        <div slot="footer">
          <button class="blora-button" type="button" data-variant="ghost" id="cancel-btn">Cancel</button>
        </div>
      </blora-dialog>
    `),
  );

  await page.waitForFunction(
    () => !!(document.querySelector("blora-dialog") as unknown as { show?: () => void })?.show,
  );

  await page
    .locator("#dialog")
    .evaluate((el: HTMLElement) => (el as unknown as { show: () => void }).show());
  await page.waitForTimeout(50);
  await expect(page.locator("#dialog")).toHaveAttribute("open", "");

  // Click close button via shadow DOM evaluate
  await page.locator("#dialog").evaluate((el: HTMLElement) => {
    const shadow = el.shadowRoot;
    const btn = shadow?.querySelector(".blora-dialog__close-button") as HTMLButtonElement | null;
    btn?.click();
  });
  await page.waitForTimeout(300);
  await expect(page.locator("#dialog")).not.toHaveAttribute("open", "");
});

test("dialog host creates a modal layer above sticky page chrome", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <header id="sticky" class="blora-navbar" style="position:fixed;inset:0 0 auto;height:80px">Chrome</header>
      <blora-dialog id="dialog"><span slot="title">Test</span><p>Content</p></blora-dialog>
    `),
  );
  await page.waitForFunction(
    () => !!(document.querySelector("blora-dialog") as unknown as { show?: () => void })?.show,
  );
  await page
    .locator("#dialog")
    .evaluate((el: HTMLElement) => (el as unknown as { show: () => void }).show());
  await expect
    .poll(() =>
      page.evaluate(() => {
        const hit = document.elementFromPoint(innerWidth / 2, 20);
        return hit?.closest("blora-dialog")?.id ?? hit?.id;
      }),
    )
    .toBe("dialog");
  await expect(page.locator("html")).toHaveAttribute("data-blora-modal-open", "");
  await expect
    .poll(() =>
      page.evaluate(() => {
        const navbarGlass = document.querySelector<HTMLElement>(".blora-navbar");
        return navbarGlass ? getComputedStyle(navbarGlass, "::before").backdropFilter : "none";
      }),
    )
    .toBe("none");
});

test("dialog separators align with content", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <blora-dialog id="dialog">
        <span slot="title">Confirm</span><p>Continue?</p>
        <div slot="footer"><button class="blora-button">Confirm</button></div>
      </blora-dialog>
    `),
  );
  await page.waitForFunction(
    () => !!(document.querySelector("blora-dialog") as unknown as { show?: () => void })?.show,
  );
  await page
    .locator("#dialog")
    .evaluate((element: HTMLElement) => (element as unknown as { show: () => void }).show());
  const geometry = await page.locator("#dialog").evaluate((element) => {
    const root = element.shadowRoot!;
    const header = root.querySelector<HTMLElement>(".blora-dialog__header")!;
    const footer = root.querySelector<HTMLElement>(".blora-dialog__footer")!;
    const headerRule = getComputedStyle(header, "::after");
    const footerRule = getComputedStyle(footer, "::before");
    return {
      headerPaddingBlock: getComputedStyle(header).paddingBlockStart,
      footerPaddingBlock: getComputedStyle(footer).paddingBlockStart,
      headerRuleStart: headerRule.insetInlineStart,
      headerRuleEnd: headerRule.insetInlineEnd,
      footerRuleStart: footerRule.insetInlineStart,
      footerRuleEnd: footerRule.insetInlineEnd,
    };
  });
  expect(geometry).toEqual({
    headerPaddingBlock: "24px",
    footerPaddingBlock: "16px",
    headerRuleStart: "32px",
    headerRuleEnd: "32px",
    footerRuleStart: "32px",
    footerRuleEnd: "32px",
  });
});

test("dialog without footer content omits the footer separator and space", async ({ page }) => {
  await page.setContent(
    htmlPage(
      `<blora-dialog id="dialog"><span slot="title">Persistent</span><p>Content</p></blora-dialog>`,
    ),
  );
  await page.waitForFunction(
    () => !!(document.querySelector("blora-dialog") as unknown as { show?: () => void })?.show,
  );
  await page
    .locator("#dialog")
    .evaluate((element: HTMLElement) => (element as unknown as { show: () => void }).show());
  const footer = page.locator("#dialog").locator(".blora-dialog__footer");
  await expect(footer).toBeHidden();
  await expect
    .poll(() =>
      page.locator("#dialog").evaluate((element) => {
        const root = element.shadowRoot!;
        const body = root.querySelector<HTMLElement>(".blora-dialog__body")!;
        const panel = root.querySelector<HTMLElement>(".blora-dialog__panel")!;
        return Math.round(
          panel.getBoundingClientRect().bottom - body.getBoundingClientRect().bottom,
        );
      }),
    )
    .toBe(0);
});

test("dialog backdrop enters the top layer outside clipped and filtered ancestors", async ({
  page,
}) => {
  await page.setContent(
    htmlPage(`
      <div id="clipped" style="overflow:clip;filter:blur(0);width:240px;height:120px">
        <blora-dialog id="dialog"><span slot="title">Test</span><p>Content</p></blora-dialog>
      </div>
    `),
  );
  await page.waitForFunction(
    () => !!(document.querySelector("blora-dialog") as unknown as { show?: () => void })?.show,
  );
  await page
    .locator("#dialog")
    .evaluate((el: HTMLElement) => (el as unknown as { show: () => void }).show());
  const geometry = await page.locator("#dialog").evaluate((element) => {
    const backdrop = element.shadowRoot!.querySelector<HTMLElement>(".blora-dialog__backdrop")!;
    const rect = backdrop.getBoundingClientRect();
    return {
      popoverOpen: element.matches(":popover-open"),
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
    };
  });
  expect(geometry.popoverOpen).toBe(true);
  expect(geometry.left).toBe(0);
  expect(geometry.top).toBe(0);
  // Mobile emulation rounds 100dvh differently from innerHeight by <= 1px
  expect(Math.abs(geometry.right - geometry.viewportWidth)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.bottom - geometry.viewportHeight)).toBeLessThanOrEqual(1);
});

test("dialog closes on Escape key", async ({ page }) => {
  await page.setContent(
    htmlPage(
      `<blora-dialog id="dialog"><span slot="title">Test</span><p>Content</p></blora-dialog>`,
    ),
  );

  await page.waitForFunction(
    () => !!(document.querySelector("blora-dialog") as unknown as { show?: () => void })?.show,
  );

  await page
    .locator("#dialog")
    .evaluate((el: HTMLElement) => (el as unknown as { show: () => void }).show());
  await page.waitForTimeout(50);
  await expect(page.locator("#dialog")).toHaveAttribute("open", "");

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  await expect(page.locator("#dialog")).not.toHaveAttribute("open", "");
});

test("dialog closes on outside click", async ({ page }) => {
  await page.setContent(
    htmlPage(
      `<blora-dialog id="dialog"><span slot="title">Test</span><p>Content</p></blora-dialog>`,
    ),
  );

  await page.waitForFunction(
    () => !!(document.querySelector("blora-dialog") as unknown as { show?: () => void })?.show,
  );

  await page
    .locator("#dialog")
    .evaluate((el: HTMLElement) => (el as unknown as { show: () => void }).show());
  await page.waitForTimeout(50);
  await expect(page.locator("#dialog")).toHaveAttribute("open", "");

  // Click on backdrop via shadow DOM evaluate
  await page.locator("#dialog").evaluate((el: HTMLElement) => {
    const shadow = el.shadowRoot;
    const backdrop = shadow?.querySelector(".blora-dialog__backdrop") as HTMLElement | null;
    backdrop?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
  });
  await page.waitForTimeout(300);
  await expect(page.locator("#dialog")).not.toHaveAttribute("open", "");
});

test("dialog with close-on-outside-click=false stays open on backdrop click", async ({ page }) => {
  await page.setContent(
    htmlPage(
      `<blora-dialog id="dialog" close-on-outside-click="false"><span slot="title">Persistent</span><p>Content</p></blora-dialog>`,
    ),
  );

  await page.waitForFunction(
    () => !!(document.querySelector("blora-dialog") as unknown as { show?: () => void })?.show,
  );

  await page
    .locator("#dialog")
    .evaluate((el: HTMLElement) => (el as unknown as { show: () => void }).show());
  await page.waitForTimeout(50);
  await expect(page.locator("#dialog")).toHaveAttribute("open", "");

  await page.locator("#dialog").evaluate((el: HTMLElement) => {
    const shadow = el.shadowRoot;
    const mask = shadow?.querySelector(".blora-dialog__mask") as HTMLElement | null;
    mask?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
  });
  await page.waitForTimeout(300);
  await expect(page.locator("#dialog")).toHaveAttribute("open", "");

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  await expect(page.locator("#dialog")).not.toHaveAttribute("open", "");
});

test("dialog locks body scroll when open", async ({ page }) => {
  await page.setContent(
    htmlPage(
      `<blora-dialog id="dialog"><span slot="title">Test</span><p>Content</p></blora-dialog>`,
    ),
  );

  await page.waitForFunction(
    () => !!(document.querySelector("blora-dialog") as unknown as { show?: () => void })?.show,
  );

  const lockBefore = await page.evaluate(() => ({
    locked: document.documentElement.dataset.bloraScrollLocked ?? "",
    rootOverflow: document.documentElement.style.overflow,
    bodyPosition: document.body.style.position,
  }));
  expect(lockBefore.locked).toBe("");
  expect(lockBefore.rootOverflow).not.toBe("hidden");
  expect(lockBefore.bodyPosition).not.toBe("fixed");

  await page
    .locator("#dialog")
    .evaluate((el: HTMLElement) => (el as unknown as { show: () => void }).show());
  await page.waitForTimeout(50);
  const lockDuring = await page.evaluate(() => ({
    locked: document.documentElement.dataset.bloraScrollLocked ?? "",
    rootOverflow: document.documentElement.style.overflow,
    bodyPosition: document.body.style.position,
  }));
  /* Lock freezes the viewport via html overflow; the body stays in flow so
     position:sticky headers keep working (Firefox loses them under fixed). */
  expect(lockDuring.locked).toBe("1");
  expect(lockDuring.rootOverflow).toBe("hidden");
  expect(lockDuring.bodyPosition).not.toBe("fixed");

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const lockAfter = await page.evaluate(() => ({
    locked: document.documentElement.dataset.bloraScrollLocked ?? "",
    rootOverflow: document.documentElement.style.overflow,
    bodyPosition: document.body.style.position,
  }));
  expect(lockAfter.locked).toBe("");
  expect(lockAfter.rootOverflow).not.toBe("hidden");
  expect(lockAfter.bodyPosition).not.toBe("fixed");
});

test("dialog scroll lock keeps a sticky navbar in the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 480 });
  await page.setContent(
    htmlPage(`
      <style>
        html, body { margin: 0; }
        #chrome {
          position: sticky;
          top: 0;
          z-index: 100;
          height: 64px;
          background: #fff;
        }
        #pad { height: 2400px; }
      </style>
      <header id="chrome" class="blora-navbar">Chrome</header>
      <div id="pad"></div>
      <blora-dialog id="dialog"><span slot="title">Test</span><p>Content</p></blora-dialog>
    `),
  );

  await page.waitForFunction(
    () => !!(document.querySelector("blora-dialog") as unknown as { show?: () => void })?.show,
  );

  const navbarTop = () =>
    page.evaluate(() => document.getElementById("chrome")?.getBoundingClientRect().top ?? -999);

  await page
    .locator("#dialog")
    .evaluate((el: HTMLElement) => (el as unknown as { show: () => void }).show());
  await expect.poll(navbarTop).toBeGreaterThanOrEqual(0);
  await expect.poll(navbarTop).toBeLessThan(2);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  await page.evaluate(() => window.scrollTo(0, 480));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  await expect.poll(navbarTop).toBeGreaterThanOrEqual(0);
  await expect.poll(navbarTop).toBeLessThan(2);

  await page
    .locator("#dialog")
    .evaluate((el: HTMLElement) => (el as unknown as { show: () => void }).show());
  await expect.poll(navbarTop).toBeGreaterThanOrEqual(0);
  await expect.poll(navbarTop).toBeLessThan(2);
  await expect(page.locator("html")).toHaveAttribute("data-blora-scroll-locked", "1");
});
