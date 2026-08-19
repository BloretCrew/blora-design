import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const workspaceRoot = resolve(import.meta.dirname, "../../..");
const packageRoot = resolve(import.meta.dirname, "..");
const sourceRoot = resolve(packageRoot, "src");
const forbiddenGlyphs = "‹›×✕✖★☆←→↑↓↔↕▾▼▲⌂⌕◎⚙◉○●▣📷🖼🎤📁📄📤📞✉💬🔍";
const emojiPattern = /\p{Extended_Pictographic}/u;

/** Files allowed to build non-Lucide SVG for reasons other than UI icons. */
const allowedInlineSvg = new Map<string, string>([
  ["packages/blora-design/src/components/navbar/navbar.ts", "proprietary brand mark"],
  ["packages/blora-design/src/components/progress/progress.ts", "progress meter rings"],
  ["packages/blora-design/src/components/tour/tour.ts", "dynamic spotlight mask geometry"],
]);

/** Declarative SVGs that are data visualizations, not interface icons. */
const allowedSvgMarkup = new Map<string, string>([
  ["examples/showcase-v2/index.html", "chart data visualization"],
  ["packages/blora-design/stories/chart-container.stories.ts", "chart data visualization"],
  ["packages/blora-design/tests/browser/composite-elements.spec.ts", "empty chart slot fixture"],
]);

function files(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    if (["dist", "node_modules"].includes(entry)) return [];
    const path = resolve(directory, entry);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(?:css|html|js|jsx|mjs|ts|tsx)$/.test(path) ? [path] : [];
  });
}

function rel(path: string): string {
  return relative(workspaceRoot, path).replaceAll("\\", "/");
}

const auditedRoots = [
  resolve(workspaceRoot, "addons"),
  resolve(workspaceRoot, "examples"),
  resolve(workspaceRoot, "packages/blora-design/src"),
  resolve(workspaceRoot, "packages/blora-design/stories"),
  resolve(workspaceRoot, "packages/blora-design/tests"),
];

function auditedFiles(): string[] {
  return auditedRoots.flatMap(files);
}

describe("Lucide icon policy", () => {
  it("does not generate UI icons from text glyphs or emoji", () => {
    const violations = files(resolve(sourceRoot, "components")).flatMap((file) => {
      const source = readFileSync(file, "utf8");
      return source.split(/\r?\n/).flatMap((line, index) => {
        if (line.trimStart().startsWith("//") || line.trimStart().startsWith("*")) return [];
        const assignsText = /(?:textContent|innerText)\s*=/.test(line);
        const containsForbidden = [...forbiddenGlyphs].some((glyph) => line.includes(glyph));
        return assignsText && (containsForbidden || emojiPattern.test(line))
          ? [`${rel(file)}:${index + 1}: ${line.trim()}`]
          : [];
      });
    });
    expect(violations).toEqual([]);
  });

  it("builds UI icons through createBloraIcon instead of one-off SVG factories", () => {
    const violations = auditedFiles().flatMap((file) => {
      const id = rel(file);
      if (id === "packages/blora-design/src/core/icons.ts") return [];
      if (allowedInlineSvg.has(id)) return [];
      const source = readFileSync(file, "utf8");
      return source.split(/\r?\n/).flatMap((line, index) => {
        if (!/createElementNS\([^)]*["']svg["']/.test(line)) return [];
        return [`${id}:${index + 1}: ${line.trim()}`];
      });
    });
    expect(violations, "hand-rolled SVG belongs in icons.ts or an allowlisted exception").toEqual(
      [],
    );
  });

  it("does not embed UI icon SVG markup or CSS data images", () => {
    const violations = auditedFiles().flatMap((file) => {
      const id = rel(file);
      if (id === "packages/blora-design/tests/icon-policy.test.ts") return [];
      if (allowedSvgMarkup.has(id) || allowedInlineSvg.has(id)) return [];
      const source = readFileSync(file, "utf8");
      return source.split(/\r?\n/).flatMap((line, index) => {
        if (/<svg\b|data:image\/svg\+xml/i.test(line)) {
          return [`${id}:${index + 1}: ${line.trim()}`];
        }
        return [];
      });
    });
    expect(violations, "inline UI SVG must use createBloraIcon").toEqual([]);
  });

  it("does not use icon-like CSS generated content", () => {
    const violations = auditedFiles().flatMap((file) => {
      if (!file.endsWith(".css")) return [];
      const source = readFileSync(file, "utf8");
      return source.split(/\r?\n/).flatMap((line, index) => {
        const content = line.match(/content:\s*["']([^"']+)["']/)?.[1] ?? "";
        return [...forbiddenGlyphs].some((glyph) => content.includes(glyph))
          ? [`${rel(file)}:${index + 1}: ${line.trim()}`]
          : [];
      });
    });
    expect(violations).toEqual([]);
  });

  it("documents why remaining SVG exceptions are not Lucide icons", () => {
    for (const [id, reason] of [...allowedInlineSvg, ...allowedSvgMarkup]) {
      expect(reason.length, id).toBeGreaterThan(8);
      expect(readFileSync(resolve(workspaceRoot, id), "utf8")).toBeTruthy();
    }
  });

  it("does not use v1 state classes as runtime state", () => {
    const legacyStates = [
      "is-open",
      "is-hidden",
      "is-selected",
      "is-active",
      "is-disabled",
      "is-error",
      "is-front",
      "is-collapsed",
      "is-danger",
      "is-today",
      "is-inactive",
    ];
    const violations = auditedFiles().flatMap((file) => {
      const id = rel(file);
      if (id === "packages/blora-design/tests/icon-policy.test.ts") return [];
      const source = readFileSync(file, "utf8");
      return source.split(/\r?\n/).flatMap((line, index) => {
        if (!legacyStates.some((state) => line.includes(state))) return [];
        const isComment =
          line.trimStart().startsWith("//") ||
          line.trimStart().startsWith("*") ||
          line.trimStart().startsWith("#");
        if (isComment) return [];
        return [`${id}:${index + 1}: ${line.trim()}`];
      });
    });
    expect(violations, "v1 state classes are not runtime state; use data-* attributes").toEqual([]);
  });
});
