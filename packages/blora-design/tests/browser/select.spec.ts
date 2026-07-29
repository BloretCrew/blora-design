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
const dlgAlias = aliasMatch ? aliasMatch[1]! : "defineBloraDialog";
const selAliasMatch = rawJs.match(/(\w+)\s+as\s+defineBloraSelect/);
const selAlias = selAliasMatch ? selAliasMatch[1]! : "defineBloraSelect";
const testJs = rawJs.replace(/\nexport \{[^}]*\};?\s*$/s, `\n${dlgAlias}();\n${selAlias}();`);

function htmlPage(content: string): string {
  return `<style>${tokensCss}</style><style>${foundationsCss}</style><style>${buttonCss}</style><script>${testJs}</script>${content}`;
}

test("select opens and shows options on trigger click", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <blora-select id="select" placeholder="Choose">
        <blora-option value="a">Apple</blora-option>
        <blora-option value="b">Banana</blora-option>
        <blora-option value="c">Cherry</blora-option>
      </blora-select>
    `),
  );

  await page.waitForFunction(
    () => !!(document.querySelector("blora-select") as unknown as { open?: () => void })?.open,
  );

  // Click trigger to open
  await page.locator("#select").evaluate((el: HTMLElement) => {
    const trigger = el.shadowRoot?.querySelector(".blora-select__trigger") as HTMLButtonElement;
    trigger?.click();
  });
  await page.waitForTimeout(50);

  // Popup should be visible
  const popupVisible = await page.locator("#select").evaluate((el: HTMLElement) => {
    const popup = el.shadowRoot?.querySelector(".blora-select__popup");
    return popup?.hasAttribute("data-open") ?? false;
  });
  expect(popupVisible).toBe(true);
});

test("select submits value in a native form", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <form id="test-form">
        <blora-select id="select" name="fruit">
          <blora-option value="apple">Apple</blora-option>
          <blora-option value="banana">Banana</blora-option>
        </blora-select>
        <button class="blora-button" type="submit" data-variant="primary">Submit</button>
      </form>
    `),
  );

  await page.waitForFunction(
    () => !!(document.querySelector("blora-select") as unknown as { open?: () => void })?.open,
  );

  // Select "banana" via API
  await page.locator("#select").evaluate((el: HTMLElement) => {
    (el as unknown as { value: string }).value = "banana";
  });

  // Submit form
  let submittedValue = "";
  await page.exposeFunction("onSubmit", (val: string) => {
    submittedValue = val;
  });
  await page.locator("#test-form").evaluate((form: HTMLFormElement) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      (window as unknown as { onSubmit: (v: string) => void }).onSubmit(
        data.get("fruit") as string,
      );
    });
  });

  await page.locator('button[type="submit"]').click();
  expect(submittedValue).toBe("banana");
});

test("select closes on Escape", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <blora-select id="select" placeholder="Choose">
        <blora-option value="a">A</blora-option>
      </blora-select>
    `),
  );

  await page.waitForFunction(
    () => !!(document.querySelector("blora-select") as unknown as { open?: () => void })?.open,
  );

  // Open via API
  await page.locator("#select").evaluate((el: HTMLElement) => {
    (el as unknown as { open: () => void }).open();
  });
  await page.waitForTimeout(50);

  // Focus the trigger and press Escape
  await page.locator("#select").evaluate((el: HTMLElement) => {
    const trigger = el.shadowRoot?.querySelector(".blora-select__trigger") as HTMLButtonElement;
    trigger?.focus();
  });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(50);

  const popupVisible = await page.locator("#select").evaluate((el: HTMLElement) => {
    const popup = el.shadowRoot?.querySelector(".blora-select__popup");
    return popup?.hasAttribute("data-open") ?? false;
  });
  expect(popupVisible).toBe(false);
});
