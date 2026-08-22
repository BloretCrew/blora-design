import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test } from "@playwright/test";

const globalJs = readFileSync(
  resolve(import.meta.dirname, "..", "..", "dist", "blora.global.js"),
  "utf8",
);
const globalCss = [
  "tokens.css",
  "foundations/reset.css",
  "foundations/base.css",
  "components/accordion/accordion.css",
  "components/collapse/collapse.css",
  "components/sidebar-nav/sidebar-nav.css",
]
  .map((file) => readFileSync(resolve(import.meta.dirname, "..", "..", "dist", file), "utf8"))
  .join("\n");

function htmlPage(content: string): string {
  return `<script>${globalJs}</script><script>globalThis.Blora.autoDefine()</script>${content}`;
}

function styledHtmlPage(content: string): string {
  return `<style>${globalCss}</style>${htmlPage(content)}`;
}

test("parser-time CE upgrade waits for declarative child definitions", async ({ page }) => {
  const fixture = resolve(import.meta.dirname, "fixtures/parser-composite.html");
  await page.goto(pathToFileURL(fixture).href);
  await expect(page.locator("#parser-steps .blora-step")).toHaveCount(3);
  await expect(page.locator('#parser-steps .blora-step[data-state="active"]')).toContainText(
    "Build",
  );
});

test("Sidebar Navigation owns grouped links and current-page state", async ({ page }) => {
  await page.setContent(
    styledHtmlPage(`
      <blora-sidebar-nav id="sidebar-nav" label="Components" value="accordion">
        <blora-sidebar-nav-group label="Data display">
          <blora-sidebar-nav-link label="Accordion" href="#accordion" value="accordion"></blora-sidebar-nav-link>
          <blora-sidebar-nav-link label="Collapse" href="#collapse" value="collapse"></blora-sidebar-nav-link>
        </blora-sidebar-nav-group>
      </blora-sidebar-nav>
      <script>
        document.querySelector('#sidebar-nav').addEventListener('blora-change', (event) => {
          globalThis.sidebarNavChange = event.detail;
        });
      </script>
    `),
  );

  const root = page.locator("#sidebar-nav");
  const links = root.locator(".blora-sidebar-nav__link");
  await expect(root.locator('nav[aria-label="Components"]')).toHaveCount(1);
  await expect(root.locator('[role="group"][aria-label="Data display"]')).toHaveCount(1);
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toHaveAttribute("aria-current", "page");

  const restingColors = await links.evaluateAll((items) =>
    items.map((item) => ({
      background: getComputedStyle(item).backgroundColor,
      color: getComputedStyle(item).color,
      height: item.getBoundingClientRect().height,
    })),
  );
  expect(restingColors[0]?.background).toBe(restingColors[1]?.background);
  expect(restingColors[0]?.color).not.toBe(restingColors[1]?.color);
  const coarsePointer = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
  if (coarsePointer) expect(restingColors[0]?.height).toBeGreaterThanOrEqual(44);

  await links.nth(1).click();
  await expect(root).toHaveAttribute("value", "collapse");
  await expect(links.nth(1)).toHaveAttribute("aria-current", "page");
  expect(
    await page.evaluate(
      () => (globalThis as typeof globalThis & { sidebarNavChange?: unknown }).sidebarNavChange,
    ),
  ).toEqual({ href: "#collapse", value: "collapse" });
});

test("Composite CE mounts official light DOM and search clear works", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <blora-range id="range" values="25,70"></blora-range>
      <blora-datepicker id="date"></blora-datepicker>
      <blora-timepicker id="time" value="14:30"></blora-timepicker>
      <blora-search id="search" placeholder="Search"></blora-search>
    `),
  );

  await expect(page.locator("#range .blora-range__thumb")).toHaveCount(2);
  await expect(page.locator('#date input[type="date"]')).toHaveCount(1);
  await expect(page.locator('#time input[type="time"]')).toHaveValue("14:30");
  const input = page.locator("#search input");
  await input.fill("Blora");
  await expect(page.locator("#search .blora-search__clear")).toBeVisible();
  await page.locator("#search .blora-search__clear").click();
  await expect(input).toHaveValue("");
});

test("Transfer, accordion, segmented and tabs reuse controller interactions", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <blora-transfer id="transfer">
        <blora-transfer-item value="a">Alpha</blora-transfer-item>
        <blora-transfer-item value="b" target>Beta</blora-transfer-item>
      </blora-transfer>
      <blora-accordion id="accordion">
        <blora-accordion-item heading="One" open>First</blora-accordion-item>
        <blora-accordion-item heading="Two">Second</blora-accordion-item>
      </blora-accordion>
      <blora-segmented id="segmented" value="day">
        <blora-segment value="day">Day</blora-segment>
        <blora-segment value="week">Week</blora-segment>
      </blora-segmented>
      <blora-tabs id="tabs">
        <blora-tab label="One" selected>Panel one</blora-tab>
        <blora-tab label="Two">Panel two</blora-tab>
      </blora-tabs>
    `),
  );

  const sourceCheck = page.locator('#transfer input[data-value="a"]');
  await sourceCheck.check();
  await page.locator('#transfer [data-transfer="right"]').click();
  await expect(
    page.locator("#transfer .blora-transfer__panel").nth(1).locator('[data-value="a"]'),
  ).toHaveCount(1);

  await page.locator("#accordion .blora-accordion__head").nth(1).click();
  await expect(page.locator("#accordion .blora-accordion__item").nth(0)).not.toHaveAttribute(
    "data-open",
    "",
  );
  await expect(page.locator("#accordion .blora-accordion__item").nth(1)).toHaveAttribute(
    "data-open",
    "",
  );

  await page.locator("#segmented .blora-segmented__item").nth(1).click();
  await expect(page.locator("#segmented .blora-segmented__item").nth(1)).toHaveAttribute(
    "aria-checked",
    "true",
  );

  await page.locator("#tabs .blora-tabs__tab").nth(1).click();
  await expect(page.locator("#tabs .blora-tabs__tab").nth(1)).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#tabs .blora-tabs__panel").nth(1)).toBeVisible();
});

test("accordion and collapse hover highlights only the heading and chevron", async ({ page }) => {
  await page.setContent(
    styledHtmlPage(`
      <div class="blora-scope">
        <blora-accordion id="accordion-hover">
          <blora-accordion-item heading="Accordion heading">Accordion content</blora-accordion-item>
        </blora-accordion>
        <blora-collapse id="collapse-hover">
          <blora-collapse-item heading="Collapse heading">Collapse content</blora-collapse-item>
        </blora-collapse>
      </div>
    `),
  );

  for (const selector of [
    "#accordion-hover .blora-accordion__head",
    "#collapse-hover .blora-collapse__head",
  ]) {
    const head = page.locator(selector);
    const before = await head.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, color: style.color };
    });
    await head.hover();
    await page.waitForTimeout(250);
    const after = await head.evaluate((element) => {
      const style = getComputedStyle(element);
      const icon = element.querySelector<HTMLElement>(
        ".blora-accordion__icon, .blora-collapse__icon",
      );
      return {
        background: style.backgroundColor,
        color: style.color,
        iconColor: icon ? getComputedStyle(icon).color : "",
      };
    });
    expect(after.background).toBe(before.background);
    expect(after.color).not.toBe(before.color);
    expect(after.iconColor).toBe(after.color);
  }
});

test("Command CE generates search/results and emits the existing command event", async ({
  page,
}) => {
  await page.setContent(
    htmlPage(`
      <blora-command id="command">
        <blora-command-item value="new" icon="document" shortcut="Ctrl+N">New document</blora-command-item>
        <blora-command-item value="open" icon="folder">Open file</blora-command-item>
      </blora-command>
    `),
  );

  await expect(page.locator("#command .blora-command__search input")).toHaveCount(1);
  await page.locator("#command").evaluate((host) => {
    (globalThis as typeof globalThis & { commandLabel?: string }).commandLabel = "";
    host.addEventListener("blora:command", (event) => {
      const detail = (event as CustomEvent<{ label: string }>).detail;
      (globalThis as typeof globalThis & { commandLabel?: string }).commandLabel = detail.label;
    });
  });
  await page.locator("#command .blora-command__item").nth(1).click();
  await expect
    .poll(() =>
      page.evaluate(
        () => (globalThis as typeof globalThis & { commandLabel?: string }).commandLabel,
      ),
    )
    .toContain("Open file");
});

test("Statistic, steps, radio and switch own their official trees and native behavior", async ({
  page,
}) => {
  await page.setContent(
    htmlPage(`
      <form id="form">
        <blora-radio id="radio-a" name="choice" value="a" checked>Alpha</blora-radio>
        <blora-radio id="radio-b" name="choice" value="b">Beta</blora-radio>
        <blora-switch id="switch" name="enabled" value="yes">Enabled</blora-switch>
      </form>
      <blora-statistic id="stat" label="Revenue" value="86.2" suffix="K" trend="↑ 8.3%" direction="up"></blora-statistic>
      <blora-steps id="steps" current="1">
        <blora-step title="Plan" description="Scope"></blora-step>
        <blora-step title="Build" description="Implement"></blora-step>
        <blora-step title="Ship"></blora-step>
      </blora-steps>
    `),
  );

  await expect(page.locator("#stat > .blora-stat[data-blora-generated]")).toHaveCount(1);
  await expect(page.locator("#stat .blora-stat__value")).toHaveText("86.2K");
  await expect(page.locator('#steps .blora-step[data-state="active"]')).toContainText("Build");
  await page.locator("#steps .blora-step").nth(2).click();
  await expect(page.locator("#steps")).toHaveAttribute("current", "2");
  await expect(page.locator('#steps .blora-step[data-state="done"]')).toHaveCount(2);

  await page.locator("#radio-b input").check();
  await expect(page.locator("#radio-a")).not.toHaveAttribute("checked", "");
  await expect(page.locator("#radio-b")).toHaveAttribute("checked", "");
  await page.locator("#switch input").check();
  await expect(page.locator("#switch")).toHaveAttribute("checked", "");
  await expect
    .poll(() =>
      page
        .locator("#form")
        .evaluate((form) => Object.fromEntries(new FormData(form as HTMLFormElement))),
    )
    .toEqual({ choice: "b", enabled: "yes" });
});

test("Form composite CEs generate native controls and reuse their controllers", async ({
  page,
}) => {
  await page.setContent(
    htmlPage(`
      <blora-slider id="slider" value="25" tooltip></blora-slider>
      <blora-rate id="rate" value="2"></blora-rate>
      <blora-otp id="otp" length="4" mode="numeric"></blora-otp>
      <blora-tags-input id="tags" values="React,Vue"></blora-tags-input>
      <blora-checkbox id="checks" name="options">
        <blora-checkbox-option check-all>All</blora-checkbox-option>
        <blora-checkbox-option value="a">Alpha</blora-checkbox-option>
        <blora-checkbox-option value="b">Beta</blora-checkbox-option>
      </blora-checkbox>
      <blora-field id="field" label="Name" limit="3"></blora-field>
      <blora-upload id="upload" multiple></blora-upload>
    `),
  );

  await page.locator("#slider input").fill("70");
  await expect(page.locator("#slider")).toHaveAttribute("value", "70");
  await expect(page.locator("#slider .blora-slider__value")).toHaveText("70");
  await page.locator("#rate .blora-rate__star").nth(3).click();
  await expect(page.locator("#rate")).toHaveAttribute("value", "4");
  await page.locator("#otp input").first().fill("7");
  await expect(page.locator("#otp")).toHaveAttribute("value", "7");
  await page.locator("#tags input").fill("Svelte");
  await page.locator("#tags input").press("Enter");
  await expect(page.locator("#tags .blora-tag")).toHaveCount(3);
  await page.locator("#checks input[data-blora-checkall]").check();
  await expect(page.locator("#checks input:checked")).toHaveCount(3);
  await page.locator("#field input").fill("Blora");
  await expect(page.locator("#field .blora-limit")).toHaveAttribute("data-over-limit", "");
  await expect(page.locator("#upload .blora-dropzone svg")).toHaveCount(1);
  await expect(page.locator('#upload input[type="file"]')).toHaveAttribute("multiple", "");
});

test("Overlay composite CEs open, close and emit their public events", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <div style="padding:5rem;display:flex;gap:2rem;">
        <blora-tooltip id="tooltip" trigger="Help" text="Helpful text"></blora-tooltip>
        <blora-popover id="popover" trigger="Open" content="Panel content"></blora-popover>
        <blora-popconfirm id="confirm" trigger="Delete" message="Delete item?"></blora-popconfirm>
        <blora-dropdown id="dropdown" label="Actions">
          <blora-dropdown-item value="edit">Edit</blora-dropdown-item>
          <blora-dropdown-item value="delete" separator>Delete</blora-dropdown-item>
        </blora-dropdown>
      </div>
      <blora-drawer id="drawer" title="Details">Drawer content</blora-drawer>
    `),
  );

  await page.locator("#tooltip .blora-tooltip").hover();
  await expect(page.locator("#tooltip .blora-tooltip__bubble")).toBeVisible();
  await page.locator("#popover .blora-popover__trigger").click();
  await expect(page.locator("#popover")).toHaveAttribute("open", "");
  await expect(page.locator("#popover .blora-popover")).toHaveAttribute("data-open", "");
  await page.locator("#popover [data-blora-close]").click();
  await expect(page.locator("#popover")).not.toHaveAttribute("open", "");
  await expect(page.locator("#popover .blora-popover")).not.toHaveAttribute("data-open", "");

  await page.locator("#confirm").evaluate((host) => {
    host.addEventListener("blora-confirm", () => host.setAttribute("data-confirmed", ""));
  });
  await page.locator("#confirm .blora-popconfirm__trigger").click();
  await page.locator("#confirm [data-confirm]").click();
  await expect(page.locator("#confirm")).toHaveAttribute("data-confirmed", "");
  await page.locator("#dropdown [data-dropdown-trigger]").click();
  await expect(page.locator("#dropdown .blora-dropdown")).toHaveAttribute("data-open", "");
  await page.locator("#dropdown .blora-dropdown__item").first().click();
  await expect(page.locator("#dropdown .blora-dropdown")).not.toHaveAttribute("data-open", "");

  await page.locator("#drawer").evaluate((host) => (host as HTMLElement & { open(): void }).open());
  await expect(page.locator("#drawer .blora-drawer")).toHaveAttribute("data-open", "");
  await page.locator("#drawer .blora-drawer__close").click();
  await expect(page.locator("#drawer .blora-drawer")).not.toHaveAttribute("data-open", "", {
    timeout: 1_000,
  });
});

test("Action and status composite CEs own structure and update state", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <blora-backtop id="backtop" show-after="80"></blora-backtop>
      <blora-copy id="copy" text="npm i blora"></blora-copy>
      <blora-progress id="progress" label="Upload" value="30"></blora-progress>
      <blora-pagination id="pagination" page="1" total="5"></blora-pagination>
      <blora-color-picker id="picker" value="#3B82F6"></blora-color-picker>
    `),
  );

  await expect(page.locator("#backtop .blora-backtop svg")).toHaveCount(1);
  await expect(page.locator("#copy .blora-code")).toHaveText("npm i blora");
  await page
    .locator("#progress")
    .evaluate((host) => (host as HTMLElement & { setValue(value: number): void }).setValue(65));
  await expect(page.locator("#progress .blora-progress__fill")).toHaveCSS("width", /.+/);
  await expect(page.locator("#progress [data-progress-label]")).toHaveText("65%");
  await page.locator("#pagination .blora-pagination__item").nth(2).click();
  await expect(page.locator("#pagination")).toHaveAttribute("page", "2");

  await page.locator("#pagination").evaluate((host) => {
    host.setAttribute("page", "7");
    host.setAttribute("total", "12");
  });
  await expect(page.locator("#pagination .blora-pagination__ellipsis")).toHaveCount(2);
  await page.locator('#pagination [data-direction="next"]').click();
  await expect(page.locator("#pagination")).toHaveAttribute("page", "8");
  await page
    .locator("#picker .blora-color-swatch")
    .evaluate((swatch) => (swatch as HTMLElement).click());
  await expect(page.locator("#picker .blora-color-panel")).toHaveAttribute("data-open", "");
  await page.locator("#picker .blora-color-hex").fill("#FF0000");
  await expect(page.locator("#picker")).toHaveAttribute("value", "#FF0000");
});

test("Suggestion and tree composite CEs own structure and reuse controller behavior", async ({
  page,
}) => {
  await page.setContent(
    htmlPage(`
      <div style="padding:3rem;display:grid;gap:2rem;max-width:36rem;">
        <blora-autocomplete id="autocomplete" label="Component" placeholder="Search">
          <blora-autocomplete-option value="Button"></blora-autocomplete-option>
          <blora-autocomplete-option value="Badge"></blora-autocomplete-option>
        </blora-autocomplete>
        <blora-mentions id="mentions" label="Assignee" placeholder="Type @">
          <blora-mention value="alice" label="Alice" initials="AL"></blora-mention>
          <blora-mention value="bob" label="Bob" initials="BO"></blora-mention>
        </blora-mentions>
        <blora-cascader id="cascader" placeholder="Select member">
          <blora-cascader-option label="Engineering">
            <blora-cascader-option label="Frontend">
              <blora-cascader-option label="Alice"></blora-cascader-option>
            </blora-cascader-option>
          </blora-cascader-option>
        </blora-cascader>
        <blora-tree id="tree">
          <blora-tree-node label="Engineering" value="engineering" open>
            <blora-tree-node label="Frontend" value="frontend"></blora-tree-node>
          </blora-tree-node>
        </blora-tree>
        <blora-tree-select id="tree-select" label="Region" placeholder="Select region">
          <blora-tree-select-option label="East" value="east">
            <blora-tree-select-option label="Shanghai" value="sh"></blora-tree-select-option>
          </blora-tree-select-option>
        </blora-tree-select>
      </div>
    `),
  );

  await page.locator("#autocomplete input").fill("But");
  await expect(page.locator("#autocomplete .blora-autocomplete__option")).toHaveCount(1);
  await page.locator("#autocomplete .blora-autocomplete__option").click();
  await expect(page.locator("#autocomplete")).toHaveAttribute("value", "Button");

  await page.locator("#mentions textarea").fill("@");
  await expect(page.locator("body > .blora-mentions__menu")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("#mentions textarea")).toHaveValue("@alice ");

  await page.locator("#cascader .blora-cascader__trigger").click();
  await page
    .locator("#cascader .blora-cascader__option")
    .filter({ hasText: "Engineering" })
    .click();
  await page.locator("#cascader .blora-cascader__option").filter({ hasText: "Frontend" }).click();
  await page.locator("#cascader .blora-cascader__option").filter({ hasText: "Alice" }).click();
  await expect(page.locator("#cascader")).toHaveAttribute(
    "value",
    "Engineering / Frontend / Alice",
  );

  await page.locator("#tree .blora-tree__node").nth(1).click();
  await expect(page.locator("#tree")).toHaveAttribute("value", "frontend");
  await page.locator("#tree-select input").click();
  await page.locator("#tree-select .blora-treeselect__node").first().click();
  await page.locator("#tree-select .blora-treeselect__node").nth(1).click();
  await expect(page.locator("#tree-select")).toHaveAttribute("value", "sh");
});

test("Calendar, carousel, deck and image CEs own structure and interactions", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <blora-calendar id="calendar" value="2026-08-08"></blora-calendar>
      <blora-carousel id="carousel">
        <blora-carousel-slide>First</blora-carousel-slide>
        <blora-carousel-slide>Second</blora-carousel-slide>
      </blora-carousel>
      <blora-deck id="deck" style="width:280px;height:260px;">
        <blora-deck-card>One</blora-deck-card>
        <blora-deck-card>Two</blora-deck-card>
      </blora-deck>
      <blora-image
        id="image"
        src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        alt="Pixel"
        caption="Preview"
        variant="preview"
        preview
      ></blora-image>
    `),
  );

  await page.locator('#calendar .blora-calendar__cell[data-day="9"]').click();
  await expect(page.locator("#calendar")).toHaveAttribute("value", "2026-08-09");
  await page.locator("#carousel .blora-carousel__arrow--next").click();
  await expect(page.locator("#carousel")).toHaveAttribute("current", "1");
  await page.locator("#deck .blora-deck").focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#deck")).toHaveAttribute("current", "1");
  await page.locator("#image .blora-image").click();
  await expect(page.locator("body > .blora-image-preview")).toBeVisible();
  for (const selector of [
    ".blora-image-preview__close",
    ".blora-image-preview__btn--prev",
    ".blora-image-preview__btn--next",
  ]) {
    const alignment = await page.locator(selector).evaluate((button) => {
      const buttonRect = button.getBoundingClientRect();
      const iconRect = button.querySelector("svg")!.getBoundingClientRect();
      return {
        x: Math.abs(iconRect.x + iconRect.width / 2 - (buttonRect.x + buttonRect.width / 2)),
        y: Math.abs(iconRect.y + iconRect.height / 2 - (buttonRect.y + buttonRect.height / 2)),
      };
    });
    expect(alignment.x).toBeLessThanOrEqual(0.5);
    expect(alignment.y).toBeLessThanOrEqual(0.5);
  }
  await page.keyboard.press("Escape");
  await expect(page.locator("body > .blora-image-preview")).toHaveCount(0);
});

test("Remaining controller-backed CEs own structure and reflect state", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <blora-dock id="dock" static>
        <blora-dock-item value="home" active>Home</blora-dock-item>
        <blora-dock-item value="search">Search</blora-dock-item>
      </blora-dock>
      <blora-megamenu id="menu" label="Products">
        <blora-megamenu-section title="Work"><a href="#projects">Projects</a></blora-megamenu-section>
      </blora-megamenu>
      <blora-speed-dial id="dial">
        <blora-speed-dial-action value="camera" label="Camera">C</blora-speed-dial-action>
        <blora-speed-dial-action value="gallery" label="Gallery">G</blora-speed-dial-action>
      </blora-speed-dial>
      <blora-splitter id="splitter" position="50" style="width:600px;height:180px;">
        <blora-splitter-pane>Left</blora-splitter-pane>
        <blora-splitter-pane>Right</blora-splitter-pane>
      </blora-splitter>
      <blora-tour id="tour">
        <blora-tour-step title="One" description="First step"><span>Target one</span></blora-tour-step>
        <blora-tour-step title="Two" description="Second step"><span>Target two</span></blora-tour-step>
      </blora-tour>
    `),
  );

  await page.locator("#dock .blora-dock__item").nth(1).click();
  await expect(page.locator("#dock")).toHaveAttribute("current", "1");
  await page.locator("#menu .blora-megamenu__trigger").click();
  await expect(page.locator("#menu")).toHaveAttribute("open", "");
  await page.locator("#dial .blora-speed-dial__trigger").click();
  await expect(page.locator("#dial")).toHaveAttribute("open", "");
  await page.locator("#dial .blora-speed-dial__action").first().click();
  await expect(page.locator("#dial")).not.toHaveAttribute("open", "");
  await page.locator("#splitter .blora-splitter__handle").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#splitter")).not.toHaveAttribute("position", "50");
  await page.locator("#tour [data-tour-start]").click();
  await expect(page.locator("#tour")).toHaveAttribute("open", "");
  await expect(page.locator(".blora-tour__tooltip")).toBeVisible();
  await page.locator(".blora-tour__tooltip .blora-tour__next").click();
  await expect(page.locator(".blora-tour__tooltip .blora-tour__counter")).toHaveText("2 / 2");
  await page.locator(".blora-tour__tooltip .blora-tour__next").click();
  await expect(page.locator(".blora-tour__tooltip")).toHaveCount(0);
});

test("Fixed composite CEs generate their official internal trees", async ({ page }) => {
  await page.setContent(
    htmlPage(`
      <blora-alert id="alert" variant="info" title="Notice" description="Details" dismissible></blora-alert>
      <blora-banner id="banner" title="Version 2" description="Ready to upgrade">
        <blora-banner-action label="Upgrade" value="upgrade" variant="primary"></blora-banner-action>
      </blora-banner>
      <blora-breadcrumb id="breadcrumb"><blora-breadcrumb-item label="Home"></blora-breadcrumb-item><blora-breadcrumb-item label="Current" current></blora-breadcrumb-item></blora-breadcrumb>
      <blora-chart-container id="chart" title="Visits"><svg></svg></blora-chart-container>
      <blora-chat id="chat" author="Alex" message="Hello"></blora-chat>
      <blora-comment id="comment">Consistent<span slot="author">Rhedar</span></blora-comment>
      <blora-empty id="empty" title="Nothing" action-label="Create"></blora-empty>
      <blora-mockup id="mockup" variant="browser" address="https://blora.design">Preview</blora-mockup>
      <blora-navbar id="navbar"><blora-navbar-link label="Docs" current></blora-navbar-link><blora-navbar-action label="Login" variant="primary"></blora-navbar-action></blora-navbar>
      <blora-result id="result" variant="success" title="Saved"></blora-result>
      <blora-timeline id="timeline"><blora-timeline-item time="09:00" title="Start"></blora-timeline-item></blora-timeline>
    `),
  );
  await expect(page.locator("#alert .blora-alert__icon svg")).toHaveCount(1);
  await expect(page.locator("#banner .blora-banner__actions button")).toHaveCount(1);
  await expect(page.locator("#breadcrumb .blora-breadcrumb__sep")).toHaveCount(1);
  await expect(page.locator("#chart .blora-chart__body svg")).toHaveCount(1);
  await expect(page.locator("#chat .blora-chat__bubble")).toHaveText("Hello");
  await expect(page.locator("#comment .blora-comment__body")).toHaveText("Consistent");
  await expect(page.locator("#empty .blora-empty__title")).toHaveText("Nothing");
  await expect(page.locator("#mockup .blora-mockup__toolbar")).toHaveCount(1);
  await expect(page.locator("#navbar .blora-navbar__link")).toHaveCount(1);
  await expect(page.locator("#result .blora-result__icon svg")).toHaveCount(1);
  await expect(page.locator("#timeline .blora-timeline__item")).toHaveCount(1);
  await page.locator("#alert .blora-alert__close").click();
  await expect(page.locator("#alert")).toHaveCount(0);
});

test("showcase catalog routes one of every official component at a time", async ({ page }) => {
  const showcase = resolve(import.meta.dirname, "../../../..", "examples/showcase-v2/index.html");
  await page.goto(`${pathToFileURL(showcase).href}#accordion`);
  await page.waitForFunction(() => customElements.get("blora-accordion"));
  await page.waitForFunction(() => customElements.get("blora-tabs"));
  await page.waitForFunction(() => customElements.get("blora-sidebar-nav"));
  await page.waitForFunction(() => customElements.get("blora-sidebar-layout"));
  await page.waitForFunction(() => customElements.get("blora-palette-picker"));
  await page.waitForFunction(() => customElements.get("blora-color-scheme-toggle"));

  const routeCount = await page
    .locator("#showcase-component-sources template:is([data-component], [data-addon])")
    .count();
  await expect(page.locator("[data-component-panel]")).toHaveCount(routeCount);
  await expect(page.locator("#component-navigation .blora-sidebar-nav__link")).toHaveCount(
    routeCount,
  );
  await expect(page.locator("#panel-accordion")).toBeVisible();
  await expect(page.locator("#panel-collapse")).toBeHidden();
  await expect(
    page.locator("#component-navigation .blora-sidebar-nav__link").filter({ hasText: "Accordion" }),
  ).toHaveAttribute("aria-current", "page");
  const mobileMenu = page.locator("#showcase-shell .blora-sidebar-layout__toggle");
  if (!(await mobileMenu.isVisible())) {
    await expect
      .poll(() =>
        page.evaluate(() => {
          const sidebar = document.querySelector<HTMLElement>("#component-sidebar")!;
          const current = document.querySelector<HTMLElement>(
            '#component-navigation .blora-sidebar-nav__link[aria-current="page"]',
          )!;
          const sidebarRect = sidebar.getBoundingClientRect();
          const currentRect = current.getBoundingClientRect();
          return currentRect.top >= sidebarRect.top && currentRect.bottom <= sidebarRect.bottom;
        }),
      )
      .toBe(true);
  }
  const sidebarLinkColors = await page.evaluate(() => {
    const current = document.querySelector<HTMLElement>(
      '#component-navigation .blora-sidebar-nav__link[aria-current="page"]',
    )!;
    const inactive = document.querySelector<HTMLElement>(
      '#component-navigation .blora-sidebar-nav__link:not([aria-current="page"])',
    )!;
    const currentStyle = getComputedStyle(current);
    const inactiveStyle = getComputedStyle(inactive);
    return {
      currentColor: currentStyle.color,
      inactiveColor: inactiveStyle.color,
      currentBackground: currentStyle.backgroundColor,
      inactiveBackground: inactiveStyle.backgroundColor,
    };
  });
  expect(sidebarLinkColors.currentColor).not.toBe(sidebarLinkColors.inactiveColor);
  expect(sidebarLinkColors.currentBackground).toBe(sidebarLinkColors.inactiveBackground);
  await expect(page.locator("#demo-accordion .blora-accordion__head")).toHaveCount(3);
  if (!(await mobileMenu.isVisible())) {
    const sidebar = page.locator("#component-sidebar");
    const collapseLink = page
      .locator("#component-navigation .blora-sidebar-nav__link")
      .filter({ hasText: "Collapse" });
    await collapseLink.scrollIntoViewIfNeeded();
    const scrollTopBeforeRoute = await sidebar.evaluate((element) => element.scrollTop);
    await collapseLink.click();
    await expect(page.locator("#panel-collapse")).toBeVisible();
    await expect(page.locator("#panel-collapse h1")).not.toBeFocused();
    await expect
      .poll(() => sidebar.evaluate((element) => element.scrollTop))
      .toBe(scrollTopBeforeRoute);
    await page
      .locator("#component-navigation .blora-sidebar-nav__link")
      .filter({ hasText: "Accordion" })
      .click();
    await expect(page.locator("#panel-accordion")).toBeVisible();
    await expect
      .poll(() => sidebar.evaluate((element) => element.scrollTop))
      .toBe(scrollTopBeforeRoute);
  }
  const previewPanelGap = await page.evaluate(() => {
    const preview = document.querySelector<HTMLElement>(
      '[data-preview-mount="accordion"][data-case="basic"]',
    )!;
    const panel = preview.closest<HTMLElement>(".blora-tabs__panel")!;
    return preview.getBoundingClientRect().top - panel.getBoundingClientRect().top;
  });
  expect(previewPanelGap).toBe(0);
  const htmlTab = page.locator("#panel-accordion .blora-tabs__tab").filter({ hasText: "HTML" });
  await htmlTab.focus();
  await expect(htmlTab).toBeFocused();
  await expect
    .poll(() => htmlTab.evaluate((element) => getComputedStyle(element).outlineOffset))
    .toBe("-6px");
  await expect
    .poll(() =>
      htmlTab.evaluate((element) => {
        const indicator =
          element.parentElement!.querySelector<HTMLElement>(".blora-tabs__indicator")!;
        return getComputedStyle(indicator).height;
      }),
    )
    .toBe("3px");
  const concentricRadii = await htmlTab.evaluate((element) => ({
    tab: Number.parseFloat(getComputedStyle(element).borderTopLeftRadius),
    surface: Number.parseFloat(
      getComputedStyle(element.closest<HTMLElement>(".showcase-example")!).borderTopLeftRadius,
    ),
  }));
  expect(concentricRadii.tab).toBe(concentricRadii.surface);
  const firstAccordionHead = page.locator("#demo-accordion .blora-accordion__head").first();
  const firstAccordionPanel = page.locator("#demo-accordion .blora-accordion__body").first();
  const accordionPanelId = await firstAccordionPanel.getAttribute("id");
  await expect(firstAccordionHead).toHaveAttribute("aria-controls", accordionPanelId!);
  await expect(firstAccordionPanel).toHaveAttribute("role", "region");
  await expect(firstAccordionPanel).toHaveAttribute(
    "aria-labelledby",
    (await firstAccordionHead.getAttribute("id"))!,
  );
  await expect(firstAccordionPanel).toHaveAttribute("aria-hidden", "false");

  const navbarGeometry = await page.evaluate(() => {
    const host = document.querySelector<HTMLElement>(".showcase-navbar")!;
    const navbar = host.querySelector<HTMLElement>(".blora-navbar")!;
    const mark = navbar.querySelector<HTMLElement>(".blora-brand-mark")!;
    const controls = [...navbar.querySelectorAll<HTMLElement>(".blora-button[data-size='sm']")];
    return {
      navbarHeight: navbar.getBoundingClientRect().height,
      markHeight: mark.getBoundingClientRect().height,
      controlHeights: controls
        .map((control) => control.getBoundingClientRect().height)
        .filter((height) => height > 0),
    };
  });
  expect(navbarGeometry.navbarHeight).toBeLessThanOrEqual(60);
  expect(navbarGeometry.markHeight).toBeGreaterThanOrEqual(32);
  for (const height of navbarGeometry.controlHeights) expect(height).toBe(32);

  const layerOrder = await page.evaluate(() => {
    const navbar = document.querySelector<HTMLElement>(".showcase-navbar .blora-navbar")!;
    const tab = document.querySelector<HTMLElement>("[data-example='accordion'] .blora-tabs__tab")!;
    return {
      navbarZ: Number(getComputedStyle(navbar).zIndex),
      tabZ: Number(getComputedStyle(tab).zIndex),
    };
  });
  // Sticky page chrome must paint above example content (tabs tier)
  expect(layerOrder.navbarZ).toBeGreaterThan(layerOrder.tabZ);

  const accordionTabs = page.locator('[data-example="accordion"] .blora-tabs__tab');
  await accordionTabs.filter({ hasText: "HTML" }).click();
  await expect(page.locator('[data-example="accordion"] .blora-mockup')).toBeVisible();
  expect(
    await page.locator('[data-example="accordion"] .blora-mockup__line').count(),
  ).toBeGreaterThan(5);
  const codePanelGaps = await page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>(
      '[data-example="accordion"] .showcase-code-panel',
    )!;
    const code = document.querySelector<HTMLElement>('[data-example="accordion"] .blora-mockup')!;
    const panelRect = panel.getBoundingClientRect();
    const codeRect = code.getBoundingClientRect();
    return [
      codeRect.top - panelRect.top,
      panelRect.right - codeRect.right,
      panelRect.bottom - codeRect.bottom,
      codeRect.left - panelRect.left,
    ];
  });
  expect(Math.max(...codePanelGaps) - Math.min(...codePanelGaps)).toBeLessThanOrEqual(1);
  await expect(page.locator('[data-preview-mount="accordion"][data-case="basic"]')).toBeHidden();
  await accordionTabs.filter({ hasText: "Preview" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(accordionTabs.filter({ hasText: "HTML" })).toBeFocused();

  const paletteTrigger = page.locator("[data-blora-palette-trigger]");
  await paletteTrigger.click();
  await expect(page.locator(".blora-palette-picker")).toHaveAttribute("data-open", "");
  await expect(page.locator("[data-blora-palette-option]")).toHaveCount(7);
  const paletteTextGeometry = await page.evaluate(() => {
    const title = document.querySelector<HTMLElement>(".blora-palette-picker__title")!;
    const hint = document.querySelector<HTMLElement>(".blora-palette-picker__hint")!;
    const card = document.querySelector<HTMLElement>("[data-blora-palette-option]")!;
    const name = card.querySelector<HTMLElement>(".blora-palette-card__name")!;
    const description = card.querySelector<HTMLElement>(".blora-palette-card__desc")!;
    const titleRect = title.getBoundingClientRect();
    const hintRect = hint.getBoundingClientRect();
    const nameRect = name.getBoundingClientRect();
    const descriptionRect = description.getBoundingClientRect();
    return {
      titleBeforeHint: titleRect.bottom <= hintRect.top,
      nameBeforeDescription: nameRect.bottom <= descriptionRect.top,
      menuLineHeight: Number.parseFloat(
        getComputedStyle(document.querySelector<HTMLElement>(".blora-palette-picker__menu")!)
          .lineHeight,
      ),
    };
  });
  expect(paletteTextGeometry.titleBeforeHint).toBe(true);
  expect(paletteTextGeometry.nameBeforeDescription).toBe(true);
  expect(paletteTextGeometry.menuLineHeight).toBeGreaterThan(0);
  await page.locator('[data-blora-palette-option="indigo"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-blora-theme", "indigo");
  const indigoLabel = await page.evaluate(() => window.Blora.t("theme.name.indigo"));
  await expect(paletteTrigger.locator(".blora-palette-picker__label")).toHaveText(indigoLabel);

  const startedInDrawerMode = await mobileMenu.isVisible();
  if (startedInDrawerMode) {
    await mobileMenu.click();
    await expect(page.locator("#showcase-shell")).toHaveAttribute("data-open", "");
  }
  await page
    .locator("#component-navigation .blora-sidebar-nav__link")
    .filter({ hasText: "Collapse" })
    .click();
  await expect(page.locator("#panel-collapse")).toBeVisible();
  await expect(page.locator("#panel-accordion")).toBeHidden();
  if (startedInDrawerMode) await expect(mobileMenu).toBeFocused();
  else await expect(page.locator("#panel-collapse h1")).not.toBeFocused();
  await expect(page).toHaveURL(/#collapse$/);
  await expect(page.locator("#demo-collapse .blora-collapse__item[data-open]")).toHaveCount(2);
  const closedCollapseHead = page.locator("#demo-collapse .blora-collapse__head").last();
  const closedCollapsePanel = page.locator("#demo-collapse .blora-collapse__body").last();
  await expect(closedCollapseHead).toHaveAttribute(
    "aria-controls",
    (await closedCollapsePanel.getAttribute("id"))!,
  );
  await expect(closedCollapsePanel).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("#showcase-shell")).not.toHaveAttribute("data-open", "");

  await page.locator("#theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-blora-color-scheme", "dark");

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(mobileMenu).toBeVisible();
  await mobileMenu.click();
  await expect(page.locator("#showcase-shell")).toHaveAttribute("data-open", "");
  await expect(page.locator("#component-sidebar")).toBeVisible();
  await expect(page.locator("#component-sidebar")).not.toHaveAttribute("inert", "");
  await expect
    .poll(() =>
      page.evaluate(() => {
        const sidebar = document.querySelector<HTMLElement>("#component-sidebar")!;
        const current = document.querySelector<HTMLElement>(
          '#component-navigation .blora-sidebar-nav__link[aria-current="page"]',
        )!;
        const sidebarRect = sidebar.getBoundingClientRect();
        const currentRect = current.getBoundingClientRect();
        return currentRect.top >= sidebarRect.top && currentRect.bottom <= sidebarRect.bottom;
      }),
    )
    .toBe(true);
  await page
    .locator("#component-navigation .blora-sidebar-nav__link")
    .filter({ hasText: "Accordion" })
    .click();
  await expect(page.locator("#showcase-shell")).not.toHaveAttribute("data-open", "");
  await expect(page.locator("#panel-accordion")).toBeVisible();
  const narrowLayout = await page.evaluate(() => {
    const preview = document.querySelector<HTMLElement>(
      '[data-preview-mount="accordion"][data-case="basic"]',
    )!;
    const accordion = document.querySelector<HTMLElement>("#demo-accordion")!;
    const previewRect = preview.getBoundingClientRect();
    const accordionRect = accordion.getBoundingClientRect();
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      previewTopGap: accordionRect.top - previewRect.top,
      accordionRight: accordionRect.right,
    };
  });
  expect(narrowLayout.documentWidth).toBeLessThanOrEqual(narrowLayout.viewportWidth);
  expect(narrowLayout.accordionRight).toBeLessThanOrEqual(narrowLayout.viewportWidth);
  expect(narrowLayout.previewTopGap).toBeLessThanOrEqual(40);
});

test("showcase catalog drops the previous panel from layout on switch", async ({ page }) => {
  const showcase = resolve(import.meta.dirname, "../../../..", "examples/showcase-v2/index.html");
  await page.goto(`${pathToFileURL(showcase).href}#autocomplete`);
  await page.waitForFunction(() => customElements.get("blora-sidebar-nav"));
  await expect(page.locator("#panel-autocomplete")).toBeVisible();

  const mobileMenu = page.locator("#showcase-shell .blora-sidebar-layout__toggle");
  if (await mobileMenu.isVisible()) await mobileMenu.click();

  await page
    .locator("#component-navigation .blora-sidebar-nav__link")
    .filter({ hasText: "Cascader" })
    .click();
  await expect(page.locator("#panel-cascader")).toBeVisible();

  const layout = await page.evaluate(() => {
    const previous = document.querySelector<HTMLElement>("#panel-autocomplete")!;
    const next = document.querySelector<HTMLElement>("#panel-cascader")!;
    const visible = [...document.querySelectorAll<HTMLElement>("[data-component-panel]")].filter(
      (panel) => getComputedStyle(panel).display !== "none",
    );
    return {
      previousDisplay: getComputedStyle(previous).display,
      previousHeight: previous.getBoundingClientRect().height,
      nextDisplay: getComputedStyle(next).display,
      nextTop: next.getBoundingClientRect().top,
      headingTop: next.querySelector("h1")!.getBoundingClientRect().top,
      visibleIds: visible.map((panel) => panel.id),
      transitionProperty: getComputedStyle(previous).transitionProperty,
    };
  });

  expect(layout.previousDisplay).toBe("none");
  expect(layout.previousHeight).toBe(0);
  expect(layout.nextDisplay).toBe("block");
  expect(layout.visibleIds).toEqual(["panel-cascader"]);
  expect(layout.transitionProperty).not.toMatch(/display/);
  expect(layout.headingTop).toBeLessThan(layout.nextTop + 160);
});

test("showcase catalog mounts all component previews without runtime errors", async ({ page }) => {
  const showcase = resolve(import.meta.dirname, "../../../..", "examples/showcase-v2/index.html");
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(`${pathToFileURL(showcase).href}#accordion`);
  await page.waitForFunction(() => customElements.get("blora-sidebar-nav"));
  const names = await page
    .locator("#showcase-component-sources template[data-component]")
    .evaluateAll((templates) =>
      templates.map((template) => (template as HTMLElement).dataset.component!),
    );
  const expectedNames = readdirSync(resolve(import.meta.dirname, "..", "..", "contracts"))
    .filter((name) => name.endsWith(".contract.json"))
    .map(
      (name) =>
        JSON.parse(
          readFileSync(resolve(import.meta.dirname, "..", "..", "contracts", name), "utf8"),
        ).name,
    )
    .sort();
  const expectedCatalogNames = [
    ...expectedNames,
    "effects",
    "layout",
    "markdown",
    "qrcode",
    "theming",
    "thread",
  ].sort();
  expect([...names].sort()).toEqual(expectedCatalogNames);

  for (const name of names) {
    await page.evaluate((component) => {
      location.hash = component;
    }, name);
    const panel = page.locator(`[data-component-panel="${name}"]`);
    await expect(panel, name).toBeVisible();
    await expect(panel, name).toHaveAttribute("data-hydrated", "true");
    expect(await panel.locator(`[data-preview-mount="${name}"] > *`).count(), name).toBeGreaterThan(
      0,
    );
  }

  expect(pageErrors).toEqual([]);
});

test("showcase FAB remains circular and contained by its preview", async ({ page }) => {
  const showcase = resolve(import.meta.dirname, "../../../..", "examples/showcase-v2/index.html");
  await page.goto(`${pathToFileURL(showcase).href}#fab`);
  await expect(page.locator('[data-component-panel="fab"]')).toHaveAttribute(
    "data-hydrated",
    "true",
  );

  const geometry = await page.evaluate(() => {
    const inspect = (caseName: string) => {
      const preview = document
        .querySelector<HTMLElement>(`[data-preview-mount="fab"][data-case="${caseName}"]`)!
        .getBoundingClientRect();
      const buttons = [
        ...document.querySelectorAll<HTMLElement>(
          `[data-preview-mount="fab"][data-case="${caseName}"] .blora-fab`,
        ),
      ];
      const rects = buttons.map((button) => button.getBoundingClientRect());
      return {
        positions: buttons.map((button) => getComputedStyle(button).position),
        sizes: rects.map((rect) => [rect.width, rect.height]),
        contained: rects.every(
          (rect) =>
            rect.left >= preview.left &&
            rect.right <= preview.right &&
            rect.top >= preview.top &&
            rect.bottom <= preview.bottom,
        ),
        centered:
          Math.abs(
            (rects[0]!.left + rects.at(-1)!.right) / 2 - (preview.left + preview.width / 2),
          ) <= 1,
        separated:
          rects.length < 2 ||
          rects.every((rect, index) => index === 0 || rect.left > rects[index - 1]!.right),
      };
    };
    return { defaultCase: inspect("Default"), variants: inspect("Variants") };
  });

  expect(geometry.defaultCase).toEqual({
    positions: ["relative"],
    sizes: [[56, 56]],
    contained: true,
    centered: true,
    separated: true,
  });
  expect(geometry.variants).toEqual({
    positions: ["relative", "relative"],
    sizes: [
      [56, 56],
      [56, 56],
    ],
    contained: true,
    centered: true,
    separated: true,
  });
});

test("showcase Speed Dial exposes all eight official v1 variants inside independent stages", async ({
  page,
}) => {
  const showcase = resolve(import.meta.dirname, "../../../..", "examples/showcase-v2/index.html");
  await page.goto(`${pathToFileURL(showcase).href}#speed-dial`);
  await expect(page.locator('[data-component-panel="speed-dial"]')).toHaveAttribute(
    "data-hydrated",
    "true",
  );

  const preview = page.locator('[data-preview-mount="speed-dial"][data-case="AllVariants"]');
  const stages = preview.locator(".blora-speed-dial-stage");
  await expect(stages).toHaveCount(8);
  await expect(preview.locator("blora-speed-dial[open]")).toHaveCount(0);
  await expect(preview.locator('blora-speed-dial[mode="left"]')).toHaveCount(1);
  await expect(preview.locator('blora-speed-dial[mode="flower"]')).toHaveCount(2);
  await expect(preview.locator("blora-speed-dial[close-button]")).toHaveCount(1);
  await expect(preview.locator("blora-speed-dial[main-icon]")).toHaveCount(2);
  await expect(preview.locator(".blora-speed-dial__action")).toHaveCount(26);
  await expect(preview.locator(".blora-speed-dial__action svg")).toHaveCount(23);
  await expect(preview.locator(".blora-speed-dial__item")).toHaveCount(9);
  await expect(preview.locator('.blora-speed-dial__action[data-size="sm"]')).toHaveCount(3);
  await expect(preview.locator(".blora-speed-dial__main svg")).toHaveCount(2);
  await expect(preview.locator(".blora-speed-dial__main").filter({ hasText: "编" })).toHaveCount(0);

  const dials = preview.locator("blora-speed-dial");
  for (let index = 0; index < 8; index += 1) {
    await dials.nth(index).locator("[data-blora-speed-dial-trigger]").click();
  }
  await expect(preview.locator("blora-speed-dial[open]")).toHaveCount(8);

  const geometry = await preview.evaluate((root) => {
    const previewRect = root.getBoundingClientRect();
    const cases = [...root.querySelectorAll<HTMLElement>(".blora-speed-dial-stage")].map(
      (stage) => {
        const stageRect = stage.getBoundingClientRect();
        const controls = [
          ...stage.querySelectorAll<HTMLElement>(
            ".blora-speed-dial__trigger, .blora-speed-dial__action, .blora-speed-dial__close",
          ),
        ].filter((control) => getComputedStyle(control).visibility !== "hidden");
        return controls.every((control) => {
          const rect = control.getBoundingClientRect();
          return (
            rect.left >= stageRect.left - 1 &&
            rect.right <= stageRect.right + 1 &&
            rect.top >= stageRect.top - 1 &&
            rect.bottom <= stageRect.bottom + 1
          );
        });
      },
    );
    return {
      cases,
      previewContained: root.scrollWidth <= previewRect.width + 1,
      documentContained: document.documentElement.scrollWidth <= window.innerWidth,
    };
  });

  expect(geometry.cases).toEqual([true, true, true, true, true, true, true, true]);
  expect(geometry.previewContained).toBe(true);
  expect(geometry.documentContained).toBe(true);
});

test("showcase Field visibly demonstrates and updates the official over-limit state", async ({
  page,
}) => {
  const showcase = resolve(import.meta.dirname, "../../../..", "examples/showcase-v2/index.html");
  await page.goto(`${pathToFileURL(showcase).href}#field`);

  const preview = page.locator('[data-preview-mount="field"][data-case="Default"]');
  const field = preview.locator('blora-field[name="text-limit"]');
  const input = field.locator("input");
  const limit = field.locator(".blora-limit");

  await expect(limit).toHaveAttribute("data-over-limit", "");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(field.locator(".blora-limit__overflow")).not.toBeEmpty();
  await expect(field.locator(".blora-limit__count")).toContainText("/20");

  await input.fill("Blora");
  await expect(limit).not.toHaveAttribute("data-over-limit", "");
  await expect(input).not.toHaveAttribute("aria-invalid", "true");
  await expect(field.locator(".blora-limit__count")).toHaveText("5/20");
});

test("showcase Pagination matches the v1 window and keeps active hover colour stable", async ({
  page,
}) => {
  const showcase = resolve(import.meta.dirname, "../../../..", "examples/showcase-v2/index.html");
  await page.goto(`${pathToFileURL(showcase).href}#pagination`);

  const preview = page.locator('[data-preview-mount="pagination"][data-case="EllipsisWindow"]');
  const windowed = preview.locator('blora-pagination[total="12"]');
  await expect(windowed.locator(".blora-pagination__ellipsis")).toHaveCount(2);
  const pageButtons = () => windowed.locator('[data-page]:not([aria-hidden="true"])');
  await expect(pageButtons()).toHaveText(["1", "5", "6", "7", "8", "9", "12"]);

  const activePage = windowed.locator('[aria-current="page"]');
  const activeBackground = await activePage.evaluate(
    (button) => getComputedStyle(button).backgroundColor,
  );
  await activePage.hover();
  await expect
    .poll(() => activePage.evaluate((button) => getComputedStyle(button).transform))
    .not.toBe("none");
  await expect
    .poll(() => activePage.evaluate((button) => getComputedStyle(button).backgroundColor))
    .toBe(activeBackground);

  const hoverOverflow = await windowed.evaluate((host) => {
    const root = host.querySelector<HTMLElement>(".blora-pagination");
    const pane = host.querySelector<HTMLElement>(".blora-pagination__window");
    if (!root || !pane) return null;
    const paneStyle = getComputedStyle(pane);
    const rootStyle = getComputedStyle(root);
    return {
      paneOverflowY: paneStyle.overflowY,
      rootOverflowY: rootStyle.overflowY,
      paneGutter: pane.offsetWidth - pane.clientWidth,
      rootGutter: root.offsetHeight - root.clientHeight,
    };
  });
  expect(hoverOverflow).not.toBeNull();
  expect(["hidden", "clip"]).toContain(hoverOverflow!.paneOverflowY);
  expect(["hidden", "clip"]).toContain(hoverOverflow!.rootOverflowY);
  expect(hoverOverflow!.paneGutter).toBe(0);
  expect(hoverOverflow!.rootGutter).toBe(0);

  await windowed
    .locator('[data-direction="next"]')
    .evaluate((button) => (button as HTMLButtonElement).click());
  await expect(windowed).toHaveAttribute("page", "8");
  await expect(windowed.locator(".blora-pagination__ellipsis[data-inactive]")).toHaveCount(1);
  await expect(pageButtons()).toHaveText(["1", "6", "7", "8", "9", "10", "11", "12"]);

  await windowed.evaluate((host) => host.setAttribute("page", "5"));
  await expect(pageButtons()).toHaveText(["1", "2", "3", "4", "5", "6", "7", "12"]);
  await expect(windowed.locator('[data-edge="start"]')).toHaveAttribute("data-inactive", "");
});

test("every showcase route remains horizontally contained", async ({ page }) => {
  const showcase = resolve(import.meta.dirname, "../../../..", "examples/showcase-v2/index.html");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${pathToFileURL(showcase).href}#accordion`);
  await page.waitForFunction(() => customElements.get("blora-sidebar-nav"));
  const names = await page
    .locator("#showcase-component-sources template[data-component]")
    .evaluateAll((templates) =>
      templates.map((template) => (template as HTMLElement).dataset.component!),
    );

  for (const name of names) {
    await page.evaluate((component) => {
      location.hash = component;
    }, name);
    const panel = page.locator(`[data-component-panel="${name}"]`);
    await expect(panel, name).toBeVisible();
    await expect(panel, name).toHaveAttribute("data-hydrated", "true");
    const geometry = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(geometry.scrollWidth, name).toBeLessThanOrEqual(geometry.viewportWidth);
  }
});
