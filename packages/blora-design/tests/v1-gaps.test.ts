/**
 * Real shipped APIs for named v1 gaps (Phase 9 close).
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  createFormController,
  openImagePreview,
  createMessageElement,
  createNotificationElement,
  notify,
  createTableController,
} from "../src/index.js";
import { createBackTopController } from "../src/components/backtop/backtop.js";
import { createCollapseController } from "../src/components/collapse/collapse.js";
import { createImageController } from "../src/components/image/image.js";
import { createStepsController } from "../src/components/steps/steps.js";
import { createTreeController } from "../src/components/tree/tree.js";
import { createTreeSelectController } from "../src/components/tree-select/tree-select.js";

describe("v1 gaps — Tree Select", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="blora-treeselect" data-options='[{"label":"A","value":"a","children":[{"label":"A1","value":"a1"}]}]'>
        <input class="blora-input" type="text" />
      </div>`;
  });

  it("opens panel and selects a leaf", () => {
    const root = document.querySelector<HTMLElement>(".blora-treeselect")!;
    const ctrl = createTreeSelectController(root);
    ctrl.open();
    expect(root.hasAttribute("data-open")).toBe(true);
    // expand first then click leaf if nested
    const first = root.querySelector(".blora-treeselect__node") as HTMLElement;
    first?.click();
    const nodes = root.querySelectorAll(".blora-treeselect__node");
    const target = nodes[nodes.length - 1] as HTMLElement;
    target?.click();
    expect(ctrl.getValue().length).toBeGreaterThan(0);
    ctrl.destroy();
    expect(root.hasAttribute("data-open")).toBe(false);
  });
});

describe("v1 gaps — Form validate", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form class="blora-form" data-blora-form>
        <div class="blora-field">
          <input class="blora-input" name="email" type="email" required data-blora-validate="email" />
          <div class="blora-field__error" hidden></div>
        </div>
        <div class="blora-field">
          <input class="blora-input" name="name" type="text" required />
          <div class="blora-field__error" hidden></div>
        </div>
      </form>`;
  });

  it("fails empty required fields and passes when filled", () => {
    const form = document.querySelector("form")!;
    const ctrl = createFormController(form);
    const bad = ctrl.validate();
    expect(bad.valid).toBe(false);
    expect(bad.errors.length).toBeGreaterThan(0);
    expect(form.querySelector(".blora-field")?.getAttribute("data-state")).toBe("invalid");

    const email = form.querySelector<HTMLInputElement>('[name="email"]')!;
    const name = form.querySelector<HTMLInputElement>('[name="name"]')!;
    email.value = "a@b.com";
    name.value = "Alice";
    const ok = ctrl.validate();
    expect(ok.valid).toBe(true);
    expect(ok.values.email).toBe("a@b.com");
    expect(ok.values.name).toBe("Alice");
    ctrl.destroy();
  });
});

describe("v1 gaps — BackTop", () => {
  it("toggles visibility API and destroys cleanly", () => {
    document.body.innerHTML = `<button type="button" class="blora-backtop" data-show-after="10">↑</button>`;
    const btn = document.querySelector<HTMLElement>(".blora-backtop")!;
    const ctrl = createBackTopController(btn, { showAfter: 10 });
    expect(btn.querySelector("svg")).toBeTruthy();
    expect(btn.querySelector("svg path")).toBeTruthy();
    ctrl.show();
    expect(btn.hasAttribute("data-hidden")).toBe(false);
    ctrl.hide();
    expect(btn.hasAttribute("data-hidden")).toBe(true);
    ctrl.destroy();
  });
});

describe("tree expand height symmetry", () => {
  it("sets measured maxHeight on open and 0 on close", () => {
    document.body.innerHTML = `
      <div class="blora-tree">
        <div class="blora-tree__node"><span class="blora-tree__toggle">▸</span><span>Parent</span></div>
        <div class="blora-tree__children">
          <div class="blora-tree__node"><span>Child A</span></div>
          <div class="blora-tree__node"><span>Child B</span></div>
        </div>
      </div>`;
    const root = document.querySelector<HTMLElement>(".blora-tree")!;
    const node = root.querySelector<HTMLElement>(".blora-tree__node")!;
    const kids = root.querySelector<HTMLElement>(".blora-tree__children")!;
    const ctrl = createTreeController(root);
    node.click();
    expect(node.hasAttribute("data-open")).toBe(true);
    const openH = kids.style.maxHeight;
    expect(openH === "none" || parseFloat(openH) > 0).toBe(true);
    node.click();
    expect(node.hasAttribute("data-open")).toBe(false);
    expect(kids.style.maxHeight).toBe("0px");
    ctrl.destroy();
  });
});

describe("v1 gaps — Image preview", () => {
  afterEach(() => {
    document.querySelectorAll(".blora-image-preview").forEach((el) => el.remove());
  });

  it("opens overlay and closes", () => {
    const handle = openImagePreview(
      [
        { src: "https://example.com/a.png", alt: "a" },
        { src: "https://example.com/b.png", alt: "b" },
      ],
      0,
    );
    expect(handle).not.toBeNull();
    expect(document.querySelector(".blora-image-preview[data-open]")).toBeTruthy();
    expect(handle!.el.querySelector(".blora-image-preview__close svg")).not.toBeNull();
    expect(handle!.el.querySelector(".blora-image-preview__btn--prev svg")).not.toBeNull();
    expect(handle!.el.querySelector(".blora-image-preview__btn--next svg")).not.toBeNull();
    expect(handle!.el.querySelector("img")?.getAttribute("src")).toContain("a.png");
    handle!.next();
    expect(handle!.el.querySelector("img")?.getAttribute("src")).toContain("b.png");
    handle!.close();
    expect(document.querySelector(".blora-image-preview")).toBeNull();
  });

  it("createImageController wires preview click", () => {
    document.body.innerHTML = `
      <figure class="blora-image" data-blora-preview data-variant="preview">
        <img src="https://example.com/x.png" alt="x" />
      </figure>`;
    const root = document.querySelector<HTMLElement>(".blora-image")!;
    const ctrl = createImageController(root);
    root.click();
    expect(document.querySelector(".blora-image-preview")).toBeTruthy();
    document.querySelector(".blora-image-preview")?.remove();
    ctrl.destroy();
  });
});

describe("v1 gaps — Notification placement", () => {
  afterEach(() => {
    document.querySelectorAll(".blora-notify-container").forEach((el) => el.remove());
  });

  it("places notification in bottom-left container", () => {
    const h = notify({
      title: "Hello",
      description: "World",
      type: "success",
      placement: "bottom-left",
      duration: 0,
    });
    expect(h).not.toBeNull();
    const c = document.querySelector(".blora-notify-container--bottom-left");
    expect(c).toBeTruthy();
    expect(c?.contains(h!.el)).toBe(true);
    expect(h!.el.querySelector(".blora-notification__title")?.textContent).toBe("Hello");
    expect(h!.el.querySelector(".blora-notification__icon svg")?.outerHTML).toBe(
      createNotificationElement({ title: "Hello", type: "success" }).querySelector(
        ".blora-notification__icon svg",
      )?.outerHTML,
    );
    h!.close();
  });

  it("uses the shared message renderer and status icon", () => {
    const pill = createMessageElement({ content: "Saved", type: "success" });
    expect(pill.querySelector(".blora-message__content")?.textContent).toBe("Saved");
    expect(pill.querySelectorAll(".blora-message__icon path")).toHaveLength(1);
  });
});

describe("v1 gaps — Table pagination", () => {
  it("pages rows with data-page-size", () => {
    document.body.innerHTML = `
      <div class="blora-table-wrap" data-page-size="2">
        <table class="blora-table">
          <thead><tr><th data-sort>N</th></tr></thead>
          <tbody>
            <tr><td>1</td></tr><tr><td>2</td></tr><tr><td>3</td></tr><tr><td>4</td></tr>
          </tbody>
        </table>
      </div>`;
    const wrap = document.querySelector<HTMLElement>(".blora-table-wrap")!;
    const ctrl = createTableController(wrap, { pageSize: 2 });
    expect(ctrl.getPageCount()).toBe(2);
    expect(ctrl.getPage()).toBe(1);
    const rows = wrap.querySelectorAll("tbody tr");
    expect(rows[0]!.hidden).toBe(false);
    expect(rows[1]!.hidden).toBe(false);
    expect(rows[2]!.hidden).toBe(true);
    ctrl.setPage(2);
    expect(ctrl.getPage()).toBe(2);
    expect(rows[2]!.hidden).toBe(false);
    expect(rows[0]!.hidden).toBe(true);
    ctrl.destroy();
  });
});

describe("table row selection", () => {
  it("injects select column and syncs select-all", () => {
    document.body.innerHTML = `
      <div>
        <div class="blora-table-wrap" data-blora-selectable>
          <table class="blora-table" id="sel-t">
            <thead><tr><th data-col-key="n">N</th></tr></thead>
            <tbody>
              <tr><td>A</td></tr>
              <tr><td>B</td></tr>
            </tbody>
          </table>
        </div>
      </div>`;
    const wrap = document.querySelector<HTMLElement>(".blora-table-wrap")!;
    const ctrl = createTableController(wrap);
    expect(wrap.querySelector("th[data-blora-select-col]")).toBeTruthy();
    expect(wrap.querySelectorAll("td[data-blora-select-col]").length).toBe(2);
    expect(wrap.querySelector(".blora-checkbox__box")).toBeTruthy();
    const all = wrap.querySelector<HTMLInputElement>("input[data-blora-select-all]")!;
    all.checked = true;
    all.dispatchEvent(new Event("change", { bubbles: true }));
    expect(ctrl.getSelectedRows().length).toBe(2);
    ctrl.clearSelection();
    expect(ctrl.getSelectedRows().length).toBe(0);
    ctrl.destroy();
  });
});

describe("table column settings", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <div class="blora-table-wrap" data-blora-cols data-blora-cols-key="test-cols">
        <table class="blora-table" id="t-cols">
          <thead><tr>
            <th data-col-key="a">A</th>
            <th data-col-key="b">B</th>
            <th data-col-key="c">C</th>
          </tr></thead>
          <tbody>
            <tr><td>1</td><td>2</td><td>3</td></tr>
          </tbody>
        </table>
      </div>`;
  });

  it("hides a column and persists config", () => {
    const wrap = document.querySelector<HTMLElement>(".blora-table-wrap")!;
    const ctrl = createTableController(wrap);
    expect(ctrl.getColumnConfig().length).toBe(3);
    ctrl.setColumnVisible("b", false);
    const thB = wrap.querySelector<HTMLElement>('th[data-col-key="b"]')!;
    expect(thB.hidden).toBe(true);
    const cfg = JSON.parse(localStorage.getItem("test-cols") || "[]") as Array<{
      key: string;
      visible: boolean;
    }>;
    expect(cfg.find((c) => c.key === "b")?.visible).toBe(false);
    ctrl.resetColumns();
    expect(wrap.querySelector<HTMLElement>('th[data-col-key="b"]')!.hidden).toBe(false);
    ctrl.destroy();
  });
});

describe("table virtual scroll", () => {
  it("renders a window of rows via setRows", () => {
    document.body.innerHTML = `
      <div class="blora-table-wrap" data-blora-virtual data-virtual-axis="y" data-row-height="40" data-viewport-height="200" data-overscan="2">
        <table class="blora-table">
          <thead><tr><th data-col-key="n">N</th><th data-col-key="v">V</th></tr></thead>
          <tbody></tbody>
        </table>
      </div>`;
    const wrap = document.querySelector<HTMLElement>(".blora-table-wrap")!;
    const ctrl = createTableController(wrap);
    const data = Array.from({ length: 100 }, (_, i) => [`r${i}`, String(i)]);
    ctrl.setRows(data);
    const bodyRows = wrap.querySelectorAll("tbody tr:not(.blora-table-virtual-pad)");
    expect(bodyRows.length).toBeGreaterThan(0);
    expect(bodyRows.length).toBeLessThan(100);
    expect(wrap.getAttribute("data-virtual-total")).toBe("100");
    expect(wrap.querySelector(".blora-table-virtual")).toBeTruthy();
    ctrl.destroy();
  });

  it("virtualizes columns when many cols exceed narrow viewport", () => {
    document.body.innerHTML = `
      <div class="blora-table-wrap" data-blora-virtual data-virtual-axis="both"
        data-row-height="40" data-col-width="100" data-viewport-height="200" data-overscan="1"
        style="width:280px">
        <table class="blora-table"><thead><tr></tr></thead><tbody></tbody></table>
      </div>`;
    const wrap = document.querySelector<HTMLElement>(".blora-table-wrap")!;
    /* Force scroller clientWidth in jsdom */
    const ctrl = createTableController(wrap);
    const keys = Array.from({ length: 30 }, (_, c) => `c${c}`);
    const data = Array.from({ length: 50 }, (_, r) => {
      const o: Record<string, string> = {};
      keys.forEach((k, c) => {
        o[k] = `${r}-${c}`;
      });
      return o;
    });
    ctrl.setRows(data, keys);
    const scroller = wrap.querySelector<HTMLElement>(".blora-table-virtual")!;
    Object.defineProperty(scroller, "clientWidth", { configurable: true, get: () => 280 });
    Object.defineProperty(scroller, "clientHeight", { configurable: true, get: () => 200 });
    Object.defineProperty(scroller, "scrollLeft", { configurable: true, writable: true, value: 0 });
    /* Re-render after mocking metrics */
    scroller.dispatchEvent(new Event("scroll"));
    /* Force sync render by setRows again */
    ctrl.setRows(data, keys);
    scroller.dispatchEvent(new Event("scroll"));
    /* Manually trigger: setRows already rendered; re-call via scroll path may not remeasure.
       Check attributes after setRows with mocked clientWidth — re-init is cleaner: */
    ctrl.destroy();
    const ctrl2 = createTableController(wrap);
    const scroller2 =
      wrap.querySelector<HTMLElement>(".blora-table-virtual") ||
      (() => {
        ctrl2.setRows(data, keys);
        return wrap.querySelector<HTMLElement>(".blora-table-virtual")!;
      })();
    Object.defineProperty(scroller2, "clientWidth", { configurable: true, get: () => 280 });
    Object.defineProperty(scroller2, "clientHeight", { configurable: true, get: () => 200 });
    ctrl2.setRows(data, keys);
    const colStart = Number(wrap.getAttribute("data-virtual-col-start") || 0);
    const colEnd = Number(wrap.getAttribute("data-virtual-col-end") || 30);
    expect(colEnd - colStart).toBeLessThan(30);
    expect(wrap.hasAttribute("data-virtual-x")).toBe(true);
    ctrl2.destroy();
  });
});

describe("controller parity sample", () => {
  it("collapse open/close/destroy", () => {
    document.body.innerHTML = `
      <div class="blora-collapse">
        <div class="blora-collapse__item">
          <button type="button" class="blora-collapse__head">H</button>
          <div class="blora-collapse__body"><div class="blora-collapse__content">Body</div></div>
        </div>
      </div>`;
    const root = document.querySelector<HTMLElement>(".blora-collapse")!;
    const item = root.querySelector<HTMLElement>(".blora-collapse__item")!;
    const head = root.querySelector<HTMLElement>(".blora-collapse__head")!;
    const ctrl = createCollapseController(root);
    head.click();
    expect(item.hasAttribute("data-open")).toBe(true);
    head.click();
    expect(item.hasAttribute("data-open")).toBe(false);
    ctrl.destroy();
  });

  it("steps setCurrent", () => {
    document.body.innerHTML = `
      <div class="blora-steps">
        <div class="blora-step" data-status="process" data-current></div>
        <div class="blora-step" data-status="wait"></div>
        <div class="blora-step" data-status="wait"></div>
      </div>`;
    const root = document.querySelector<HTMLElement>(".blora-steps")!;
    const ctrl = createStepsController(root);
    ctrl.setCurrent(2);
    expect(ctrl.getCurrent()).toBe(2);
    expect(root.querySelectorAll(".blora-step")[2]?.hasAttribute("data-current")).toBe(true);
    ctrl.destroy();
  });
});
