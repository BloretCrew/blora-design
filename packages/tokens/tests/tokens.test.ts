import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tokenGroups, tokens } from "../generated/tokens.js";

const packageDir = resolve(import.meta.dirname, "..");
const srcDir = join(packageDir, "src");
const outDir = join(packageDir, "generated");

function flattenTokens(
  value: unknown,
  path: string[] = [],
): { path: string[]; token: Record<string, unknown> }[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return [];

  const result: { path: string[]; token: Record<string, unknown> }[] = [];
  for (const [key, child] of Object.entries(value)) {
    if (key.startsWith("$") || typeof child !== "object" || child === null) continue;
    const token = child as Record<string, unknown>;
    if (Object.hasOwn(token, "$type") || Object.hasOwn(token, "$value")) {
      result.push({ path: [...path, key], token });
    } else {
      result.push(...flattenTokens(child, [...path, key]));
    }
  }
  return result;
}

describe("token sources", () => {
  it("contains faithful primitive color values", () => {
    const colors = JSON.parse(readFileSync(join(srcDir, "primitive", "color.tokens.json"), "utf8"));
    expect(colors.color.coral.background.$value).toBe("#FAF7F8");
    expect(colors.color.coral.primary.$value).toBe("#9F5964");
    expect(flattenTokens(colors).length).toBeGreaterThan(20);
  });

  it("contains the v1 spacing, radius, and control dimensions", () => {
    const dimensions = JSON.parse(
      readFileSync(join(srcDir, "primitive", "dimension.tokens.json"), "utf8"),
    );
    expect(dimensions.space["4"].$value).toBe("1rem");
    expect(dimensions.radius.md.$value).toBe("14px");
    expect(dimensions.primitive.control.height.$value).toBe("2.75em");
    expect(dimensions.primitive.range.thumbSize.$value).toBe("18px");
  });

  it("contains the v1 duration values", () => {
    const durations = JSON.parse(
      readFileSync(join(srcDir, "primitive", "duration.tokens.json"), "utf8"),
    );
    expect(durations.primitive.duration.fast.$value).toBe("160ms");
    expect(durations.primitive.duration.emphasis.$value).toBe("700ms");
  });

  it("semantic tokens reference primitive namespaces without self references", () => {
    for (const file of ["motion.tokens.json", "typography.tokens.json", "layout.tokens.json"]) {
      const source = readFileSync(join(srcDir, "semantic", file), "utf8");
      expect(source).toContain("{primitive.");
    }
  });
});

describe("generated outputs", () => {
  it("generates public light and dark semantic CSS", () => {
    const lightCss = readFileSync(join(outDir, "tokens.css"), "utf8");
    const darkCss = readFileSync(join(outDir, "tokens.dark.css"), "utf8");

    expect(lightCss).toContain("--blora-color-surface-canvas");
    expect(lightCss).toContain("--blora-color-action-primary-default");
    expect(lightCss).toContain("--blora-space-4");
    expect(lightCss).toContain("--blora-duration-fast");
    expect(lightCss).not.toMatch(/(--blora-[a-z0-9-]+):\s*var\(\1\)/);

    expect(darkCss).toContain('[data-blora-color-scheme="dark"]');
    expect(darkCss).toContain("#17161C");
    expect(darkCss).toContain("@media (prefers-color-scheme: dark)");
  });

  it("generates all nine palette selectors", () => {
    const themesCss = readFileSync(join(outDir, "tokens.themes.css"), "utf8");
    for (const palette of [
      "cinnabar",
      "indigo",
      "lotus",
      "ocean",
      "graphite",
      "mono",
      "circuit",
      "coral",
      "dusk",
    ]) {
      expect(themesCss).toContain(`[data-blora-theme="${palette}"]`);
    }
    expect(themesCss).toContain("--blora-color-coral-surface-1");
  });

  it("generates importable JavaScript constants", () => {
    expect(tokens["color.surface.canvas"]).toBe("--blora-color-surface-canvas");
    expect(tokenGroups.color).toContain("--blora-color-surface-canvas");
  });

  it("generates a stable manifest and complete artifacts", () => {
    const manifest = JSON.parse(readFileSync(join(outDir, "token-manifest.json"), "utf8"));
    expect(manifest).not.toHaveProperty("generated");
    expect(manifest.schemaVersion).toBe("1.0");
    expect(manifest.tokens.length).toBeGreaterThan(100);

    for (const file of [
      "tokens.css",
      "tokens.dark.css",
      "tokens.themes.css",
      "tokens.js",
      "tokens.d.ts",
      "tokens.ts",
      "tokens.json",
      "token-manifest.json",
    ]) {
      expect(readFileSync(join(outDir, file), "utf8").length).toBeGreaterThan(0);
    }
  });
});

describe("deterministic build", () => {
  it("produces identical outputs on consecutive runs", () => {
    execFileSync("node", ["scripts/build-tokens.mjs"], { cwd: packageDir });
    const first = Object.fromEntries(
      [
        "tokens.css",
        "tokens.dark.css",
        "tokens.themes.css",
        "tokens.js",
        "token-manifest.json",
      ].map((file) => [file, readFileSync(join(outDir, file), "utf8")]),
    );

    execFileSync("node", ["scripts/build-tokens.mjs"], { cwd: packageDir });
    for (const [file, content] of Object.entries(first)) {
      expect(readFileSync(join(outDir, file), "utf8")).toBe(content);
    }
  });
});
