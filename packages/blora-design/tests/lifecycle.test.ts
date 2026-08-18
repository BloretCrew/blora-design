/**
 * Controller connect/destroy lifecycle — destroy is idempotent and detaches handlers.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createTableController } from "../src/components/table/table.js";
import { createTreeController } from "../src/components/tree/tree.js";
import { createCollapseController } from "../src/components/collapse/collapse.js";

describe("controller lifecycle / destroy", () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
  });

  afterEach(() => {
    host.remove();
  });

  it("table: destroy is idempotent and stops sort handler", () => {
    host.innerHTML = `
      <div class="blora-table-wrap">
        <table class="blora-table">
          <thead><tr>
            <th data-sort data-col-key="n">Name</th>
            <th data-sort data-col-key="v">Val</th>
          </tr></thead>
          <tbody>
            <tr><td>B</td><td>2</td></tr>
            <tr><td>A</td><td>1</td></tr>
          </tbody>
        </table>
      </div>`;
    const wrap = host.querySelector(".blora-table-wrap") as HTMLElement;
    const ctrl = createTableController(wrap);
    const th = wrap.querySelector("th[data-sort]") as HTMLElement;
    expect(th.querySelector(".blora-table__sort svg")?.getAttribute("data-blora-icon")).toBe(
      "arrow-down-up",
    );
    th.click();
    const afterFirst = th.getAttribute("aria-sort") || th.getAttribute("data-sort-dir") || "";
    expect(afterFirst.length).toBeGreaterThan(0);
    expect(th.querySelector(".blora-table__sort svg")?.getAttribute("data-blora-icon")).toBe(
      "arrow-up",
    );
    ctrl.destroy();
    expect(() => ctrl.destroy()).not.toThrow();
    th.click();
    const afterDestroy = th.getAttribute("aria-sort") || th.getAttribute("data-sort-dir") || "";
    expect(afterDestroy).toBe(afterFirst);
  });

  it("tree: destroy is idempotent and stops row toggle", () => {
    host.innerHTML = `
      <div class="blora-tree">
        <div class="blora-tree__node" data-open>
          <span class="blora-tree__toggle">v</span><span>Folder</span>
        </div>
        <div class="blora-tree__children">
          <div class="blora-tree__node"><span style="width:1em"></span><span>Leaf</span></div>
        </div>
      </div>`;
    const root = host.querySelector(".blora-tree") as HTMLElement;
    const ctrl = createTreeController(root);
    const node = root.querySelector(".blora-tree__node") as HTMLElement;
    expect(node.hasAttribute("data-open")).toBe(true);
    const label = node.querySelector("span:last-child") as HTMLElement;
    label.click();
    expect(node.hasAttribute("data-open")).toBe(false);
    ctrl.destroy();
    expect(() => ctrl.destroy()).not.toThrow();
    const openAfterDestroy = node.hasAttribute("data-open");
    label.click();
    expect(node.hasAttribute("data-open")).toBe(openAfterDestroy);
  });

  it("collapse: destroy is idempotent", () => {
    host.innerHTML = `
      <div class="blora-collapse">
        <div class="blora-collapse__item">
          <button type="button" class="blora-collapse__head">H</button>
          <div class="blora-collapse__body"><div class="blora-collapse__content">C</div></div>
        </div>
      </div>`;
    const root = host.querySelector(".blora-collapse") as HTMLElement;
    const ctrl = createCollapseController(root);
    ctrl.destroy();
    expect(() => ctrl.destroy()).not.toThrow();
  });
});
