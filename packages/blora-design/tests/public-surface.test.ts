import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import * as Blora from "../src/index.js";

const srcRoot = resolve(import.meta.dirname, "../src");
const componentsRoot = resolve(srcRoot, "components");
const allowedControllerExports = new Set([
  "createTableController",
  "createFormController",
  "createNotificationController",
]);

describe("public CE-only surface", () => {
  it("does not export headless controllers for migrated composites from the main package", () => {
    expect(Blora.createTableController).toEqual(expect.any(Function));
    expect(Blora.createFormController).toEqual(expect.any(Function));
    expect(Blora.createNotificationController).toEqual(expect.any(Function));
    expect("bindDrawerTriggers" in Blora).toBe(false);
    expect("createTabsController" in Blora).toBe(false);
    expect("createDrawerController" in Blora).toBe(false);
    expect("createFieldController" in Blora).toBe(false);
    expect("createUploadController" in Blora).toBe(false);
    expect("createDropdownController" in Blora).toBe(false);
  });

  it("keeps internal Controller types off CE component public indexes", () => {
    const keep = new Set(["table", "form", "notification"]);
    const leaks: string[] = [];
    for (const name of readdirSync(componentsRoot)) {
      if (keep.has(name)) continue;
      const indexPath = resolve(componentsRoot, name, "index.ts");
      let source = "";
      try {
        source = readFileSync(indexPath, "utf8");
      } catch {
        continue;
      }
      const exported = source.match(/type\s+[A-Z][A-Za-z]+Controller\b/g) ?? [];
      for (const symbol of exported) leaks.push(`${name}/index.ts:${symbol}`);
      if (/export\s+type\s+\{[^}]*Controller/s.test(source)) {
        leaks.push(`${name}/index.ts:export type Controller`);
      }
    }
    expect(leaks).toEqual([]);
  });

  it("keeps create*Controller off CE component public indexes", () => {
    const keep = new Set(["table", "form", "notification"]);
    const leaks: string[] = [];
    for (const name of readdirSync(componentsRoot)) {
      if (keep.has(name)) continue;
      const indexPath = resolve(componentsRoot, name, "index.ts");
      let source = "";
      try {
        source = readFileSync(indexPath, "utf8");
      } catch {
        continue;
      }
      const exported = source.match(/create[A-Z][A-Za-z]+Controller/g) ?? [];
      for (const symbol of exported) {
        if (!allowedControllerExports.has(symbol)) leaks.push(`${name}/index.ts:${symbol}`);
      }
    }
    expect(leaks).toEqual([]);
  });

  it("does not export bindDrawerTriggers from the main entry", () => {
    const index = readFileSync(resolve(srcRoot, "index.ts"), "utf8");
    expect(index).not.toMatch(/\bbindDrawerTriggers\b/);
  });
});
