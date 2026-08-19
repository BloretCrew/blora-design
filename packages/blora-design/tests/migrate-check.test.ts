import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const script = resolve(import.meta.dirname, "../scripts/migrate-check.mjs");
const fixture = (name: string) => resolve(import.meta.dirname, `fixtures/html/${name}`);

describe("migrate:check Composite CE gate", () => {
  it("rejects a hyphenated CE internal class", () => {
    const result = spawnSync(process.execPath, [script, fixture("migration-ce-internal.html")], {
      encoding: "utf8",
    });
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("composite-ce:sidebar-nav:internal-markup");
  });

  it("accepts the current color-picker blora:change event", () => {
    const result = spawnSync(process.execPath, [script, fixture("migration-current-event.html")], {
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("No deprecated patterns found");
  });

  it("allows contract-declared CSS-only component classes", () => {
    const result = spawnSync(process.execPath, [script, fixture("migration-css-public.html")], {
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("No deprecated patterns found");
  });
});
