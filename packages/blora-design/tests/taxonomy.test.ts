import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const packageRoot = resolve(import.meta.dirname, "..");
const repoRoot = resolve(packageRoot, "../..");
const taxonomy = JSON.parse(readFileSync(resolve(packageRoot, "taxonomy.json"), "utf8"));
const categoryIds = new Set(taxonomy.categories.map((category: { id: string }) => category.id));

describe("component taxonomy", () => {
  it("assigns every core contract a known category", () => {
    const contracts = readdirSync(resolve(packageRoot, "contracts")).filter((name) =>
      name.endsWith(".contract.json"),
    );
    for (const file of contracts) {
      const name = file.replace(/\.contract\.json$/, "");
      const contract = JSON.parse(readFileSync(resolve(packageRoot, "contracts", file), "utf8"));
      expect(taxonomy.components[name], name).toBe(contract.category);
      expect(categoryIds.has(contract.category), name).toBe(true);
    }
  });

  it("keeps the showcase catalog on the same groups as contracts", () => {
    const html = readFileSync(resolve(repoRoot, "examples/showcase-v2/index.html"), "utf8");
    const labels = Object.fromEntries(
      taxonomy.categories.map((category: { id: string; label: string; eyebrow: string }) => [
        category.id,
        category,
      ]),
    );
    for (const match of html.matchAll(
      /<template\b[^>]*data-(?:component|addon)="([^"]+)"[^>]*data-group="([^"]+)"[^>]*data-eyebrow="([^"]+)"/g,
    )) {
      const category = labels[taxonomy.components[match[1]!]];
      expect(category, match[1]).toBeDefined();
      expect(match[2], match[1]).toBe(category.label);
      expect(match[3], match[1]).toBe(category.eyebrow);
    }
    expect(html).toContain('["操作", "数据展示", "导航", "反馈", "数据输入", "布局", "样机"]');
  });
});
