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

const rawJs = readFileSync(resolve(import.meta.dirname, "..", "..", "dist", "index.js"), "utf8");
const aliasMatch = rawJs.match(/(\w+)\s+as\s+defineBloraDialog/);
const alias = aliasMatch ? aliasMatch[1]! : "defineBloraDialog";
const testJs = rawJs.replace(/\nexport \{[^}]*\};?\s*$/s, `\n${alias}();`);

function htmlPage(content: string): string {
  return `<style>${tokensCss}</style><style>${foundationsCss}</style><style>${buttonCss}</style><script>${testJs}</script>${content}`;
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

  const overflowBefore = await page.evaluate(() => document.body.style.overflow);
  expect(overflowBefore).not.toBe("hidden");

  await page
    .locator("#dialog")
    .evaluate((el: HTMLElement) => (el as unknown as { show: () => void }).show());
  await page.waitForTimeout(50);
  const overflowDuring = await page.evaluate(() => document.body.style.overflow);
  expect(overflowDuring).toBe("hidden");

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const overflowAfter = await page.evaluate(() => document.body.style.overflow);
  expect(overflowAfter).not.toBe("hidden");
});
