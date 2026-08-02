/**
 * Structural honesty checks for Phase-9 closeout artifacts (docs-facing).
 * Reads monorepo paths from this package — fails if recommended-entry docs regress to 1.x-only.
 */
import { existsSync, readFileSync } from "node:fs";
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

  it("root README recommends 2.0 alpha and blora-button, not 1.x global Blora as primary", () => {
    const body = read("README.md");
    expect(body).toMatch(/2\.0\.0-alpha/);
    expect(body).toMatch(/blora-button/);
    expect(body).toMatch(/createTableController/);
    // Must not present 1.x package version as current
    expect(body).not.toMatch(/\*\*版本\*\* `1\.0\.0`/);
    expect(body).not.toMatch(/\*\*Version\*\* `1\.0\.0`/);
  });

  it("llms.txt points at existing migration path", () => {
    const body = read("llms.txt");
    expect(body).toMatch(/docs\/migration\/v1-to-v2\.md/);
    expect(existsSync(resolve(repoRoot, "docs/migration/v1-to-v2.md"))).toBe(true);
    expect(body).toMatch(/remaining-work\.md/);
  });

  it("status.md links remaining-work master tracker", () => {
    const body = read("docs/refactor/status.md");
    expect(body).toMatch(/remaining-work\.md/);
  });
});
