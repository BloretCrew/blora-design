/**
 * Structural honesty checks for Phase-9 closeout artifacts (docs-facing).
 * Reads monorepo paths from this package — fails if recommended-entry docs regress to 1.x-only.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../../..");

function read(rel: string): string {
  const path = resolve(repoRoot, rel);
  expect(existsSync(path), `missing ${rel}`).toBe(true);
  return readFileSync(path, "utf8");
}

describe("Phase-9 honesty artifacts", () => {
  it("master remaining-work tracker exists and lists Phase 10 open work", () => {
    const body = read("docs/refactor/remaining-work.md");
    expect(body).toMatch(/Phase 10/);
    expect(body).toMatch(/P9-1/);
    expect(body).toMatch(/主跟踪文档|剩余工作总表/);
    expect(body).toMatch(/createTableController|ADR-013|pnpm verify/);
  });

  it("migration stub exists at docs/migration/v1-to-v2.md", () => {
    const body = read("docs/migration/v1-to-v2.md");
    expect(body).toMatch(/2\.0/);
    expect(body).toMatch(/createXxxController|createTableController/);
  });

  it("root README recommends Stable 2.0 and blora-button, not 1.x global Blora as primary", () => {
    const body = read("README.md");
    expect(body).toMatch(/2\.0\.0/);
    expect(body).toMatch(/blora-button/);
    expect(body).toMatch(/createTableController/);
    // Must not present 1.x package version as current
    expect(body).not.toMatch(/\*\*版本\*\* `1\.0\.0`/);
    expect(body).not.toMatch(/\*\*Version\*\* `1\.0\.0`/);
  });

  it("ships side-effect auto entry for stable custom elements", () => {
    const src = read("packages/blora-design/src/auto.ts");
    expect(src).toMatch(/defineBloraSelect/);
    expect(src).toMatch(/defineBloraDialog/);
    const pkg = JSON.parse(read("packages/blora-design/package.json"));
    expect(pkg.exports["./auto"]).toBeTruthy();
    expect(pkg.sideEffects).toEqual(expect.arrayContaining(["./dist/auto.js"]));
  });

  it("declares JS subpaths and manifest exports for pre-beta package surface", () => {
    const pkg = JSON.parse(read("packages/blora-design/package.json"));
    for (const key of ["./button", "./select", "./dialog", "./table", "./blora.global.js"]) {
      expect(pkg.exports[key], key).toBeTruthy();
    }
    expect(pkg.exports["./custom-elements.json"]).toBeTruthy();
    expect(pkg.exports["./component-manifest.json"]).toBeTruthy();
    expect(pkg.customElements).toMatch(/custom-elements\.json/);
  });

  it("publishes every custom-element contract in the Custom Elements Manifest", () => {
    const contractsDir = resolve(repoRoot, "packages/blora-design/contracts");
    const expectedTags = readdirSync(contractsDir)
      .filter((name) => name.endsWith(".contract.json"))
      .map((name) => JSON.parse(readFileSync(resolve(contractsDir, name), "utf8")))
      .filter(
        (contract: {
          kind?: string;
          tagName?: string;
        }): contract is {
          kind: "custom-element";
          tagName: string;
        } => contract.kind === "custom-element" && typeof contract.tagName === "string",
      )
      .map((contract) => contract.tagName)
      .sort();
    const manifest = JSON.parse(read("packages/blora-design/custom-elements.json")) as {
      modules: Array<{ declarations?: Array<{ tagName?: string }> }>;
    };
    const publishedTags = manifest.modules
      .flatMap((module) => module.declarations ?? [])
      .map((declaration) => declaration.tagName)
      .filter((tagName): tagName is string => typeof tagName === "string")
      .sort();
    expect(publishedTags).toEqual(expectedTags);
  });

  it("publishes the complete migration standard and links it from the main entries", () => {
    const migration = read("docs/migration/from-any-ui-to-blora-design.md");
    expect(migration).toMatch(/从任意 UI 实现迁移到 Blora Design 2\.0/);
    expect(migration).toMatch(/完整组件替换矩阵/);
    expect(migration).toMatch(/严格禁止事项/);
    expect(migration).toMatch(/不得用|严格禁止事项|不重复实现/);
    expect(migration).toMatch(/pnpm verify/);
    expect(read("README.md")).toMatch(/from-any-ui-to-blora-design\.md/);
    expect(read("docs/guide.md")).toMatch(/from-any-ui-to-blora-design\.md/);
    expect(read("docs/framework.md")).toMatch(/from-any-ui-to-blora-design\.md/);
  });

  it("llms.txt points at the current and historical migration paths", () => {
    const body = read("llms.txt");
    expect(body).toMatch(/docs\/migration\/from-any-ui-to-blora-design\.md/);
    expect(body).toMatch(/docs\/migration\/v1-to-v2\.md/);
    expect(existsSync(resolve(repoRoot, "docs/migration/from-any-ui-to-blora-design.md"))).toBe(
      true,
    );
    expect(existsSync(resolve(repoRoot, "docs/migration/v1-to-v2.md"))).toBe(true);
    expect(body).toMatch(/remaining-work\.md/);
  });

  it("status.md links remaining-work master tracker", () => {
    const body = read("docs/refactor/status.md");
    expect(body).toMatch(/remaining-work\.md/);
  });
});
