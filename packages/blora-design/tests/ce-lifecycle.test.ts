import { describe, expect, it, beforeEach } from "vitest";
import { defineBloraCheckbox } from "../src/components/checkbox/index.js";
import { defineBloraDrawer } from "../src/components/drawer/index.js";
import { defineBloraDropdown } from "../src/components/dropdown/index.js";
import { defineBloraField } from "../src/components/field/index.js";
import { defineBloraSearch } from "../src/components/search/index.js";
import { defineBloraTabs } from "../src/components/tabs/index.js";
import { defineBloraUpload } from "../src/components/upload/index.js";

describe("composite CE lifecycle", () => {
  beforeEach(() => {
    defineBloraTabs();
    defineBloraUpload();
    defineBloraCheckbox();
    defineBloraField();
    defineBloraDrawer();
    defineBloraDropdown();
    defineBloraSearch();
    document.body.innerHTML = "";
  });

  it("keeps the selected tab when flush changes", () => {
    document.body.innerHTML = `
      <blora-tabs>
        <blora-tab label="概览" value="overview" selected>A</blora-tab>
        <blora-tab label="详情" value="details">B</blora-tab>
      </blora-tabs>`;
    const tabs = document.querySelector("blora-tabs")!;
    (tabs as HTMLElement & { select(index: number): void }).select(1);
    expect(tabs.getAttribute("value")).toBe("details");
    tabs.setAttribute("flush", "");
    expect(tabs.querySelectorAll(".blora-tabs__tab")[1]?.getAttribute("aria-selected")).toBe(
      "true",
    );
    expect(tabs.querySelector(".blora-tabs")?.hasAttribute("data-flush")).toBe(true);
  });

  it("updates upload accept without replacing the file input", () => {
    document.body.innerHTML = `<blora-upload prompt="上传"></blora-upload>`;
    const upload = document.querySelector("blora-upload")!;
    const input = upload.querySelector<HTMLInputElement>('input[type="file"]')!;
    upload.setAttribute("accept", ".png");
    expect(upload.querySelector('input[type="file"]')).toBe(input);
    expect(input.accept).toBe(".png");
  });

  it("keeps a checked checkbox when its label changes", () => {
    document.body.innerHTML = `<blora-checkbox label="允许" checked></blora-checkbox>`;
    const checkbox = document.querySelector("blora-checkbox")!;
    const input = checkbox.querySelector<HTMLInputElement>("input")!;
    expect(input.checked).toBe(true);
    checkbox.setAttribute("label", "允许评论");
    expect(checkbox.querySelector("input")).toBe(input);
    expect(input.checked).toBe(true);
    expect(checkbox.textContent).toContain("允许评论");
  });

  it("keeps typed field value when hint changes", () => {
    document.body.innerHTML = `<blora-field label="名称" name="title"></blora-field>`;
    const field = document.querySelector("blora-field")!;
    const input = field.querySelector<HTMLInputElement>("input")!;
    input.value = "草稿";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    field.setAttribute("hint", "可选");
    expect(field.querySelector("input")).toBe(input);
    expect(input.value).toBe("草稿");
    expect(field.querySelector(".blora-field__help")?.textContent).toBe("可选");
  });

  it("preserves nested drawer content instead of flattening it", () => {
    const drawer = document.createElement("blora-drawer");
    drawer.setAttribute("title", "详情");
    const form = document.createElement("form");
    const field = document.createElement("input");
    field.name = "note";
    form.appendChild(field);
    drawer.appendChild(form);
    document.body.appendChild(drawer);
    expect(drawer.querySelector("form")).toBe(form);
    expect(drawer.querySelector("input[name='note']")).toBe(field);
    drawer.setAttribute("title", "仍是详情");
    expect(drawer.querySelector("form")).toBe(form);
    expect(drawer.querySelector(".blora-drawer__title")?.textContent).toBe("仍是详情");
  });

  it("keeps a search field value when the placeholder changes", () => {
    document.body.innerHTML = `<blora-search value="token"></blora-search>`;
    const search = document.querySelector("blora-search")!;
    const input = search.querySelector<HTMLInputElement>("input")!;
    expect(input.value).toBe("token");
    search.setAttribute("placeholder", "查找组件");
    expect(search.querySelector("input")).toBe(input);
    expect(input.value).toBe("token");
    expect(input.placeholder).toBe("查找组件");
  });

  it("uses a Lucide chevron instead of a text glyph on dropdown triggers", () => {
    document.body.innerHTML = `
      <blora-dropdown label="操作">
        <blora-dropdown-item label="编辑" value="edit"></blora-dropdown-item>
      </blora-dropdown>`;
    const dropdown = document.querySelector("blora-dropdown")!;
    expect(dropdown.textContent ?? "").not.toMatch(/[▾▼‹›]/);
    expect(dropdown.querySelector("[data-dropdown-trigger] svg")).not.toBeNull();
  });
});
