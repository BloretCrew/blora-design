import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const packageRoot = resolve(import.meta.dirname, "..");
const sourceRoot = resolve(packageRoot, "src");
const forbiddenGlyphs = "‹›×✕✖★☆←→↑↓↔↕▾▼▲⌂⌕◎⚙◉○●▣📷🖼🎤📁📄📤📞✉💬🔍";
const emojiPattern = /\p{Extended_Pictographic}/u;

/** Files allowed to build non-Lucide SVG for reasons other than UI icons. */
const allowedInlineSvg = new Map<string, string>([
  ["src/components/navbar/navbar.ts", "proprietary brand mark"],
  ["src/components/progress/progress.ts", "progress meter rings"],
]);

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? sourceFiles(path) : path.endsWith(".ts") ? [path] : [];
  });
}

function rel(path: string): string {
  return relative(packageRoot, path).replaceAll("\\", "/");
}

describe("Lucide icon policy", () => {
  it("does not generate UI icons from text glyphs or emoji", () => {
    const violations = sourceFiles(resolve(sourceRoot, "components")).flatMap((file) => {
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
    const violations = sourceFiles(sourceRoot).flatMap((file) => {
      const id = rel(file);
      if (id === "src/core/icons.ts") return [];
      if (allowedInlineSvg.has(id)) return [];
      const source = readFileSync(file, "utf8");
      return source.split(/\r?\n/).flatMap((line, index) => {
        if (!/createElementNS\([^)]*svg/.test(line)) return [];
        return [`${id}:${index + 1}: ${line.trim()}`];
      });
    });
    expect(violations, "hand-rolled SVG belongs in icons.ts or an allowlisted exception").toEqual(
      [],
    );
  });

  it("documents why remaining inline SVG files are not Lucide icons", () => {
    for (const [id, reason] of allowedInlineSvg) {
      expect(reason.length, id).toBeGreaterThan(8);
      expect(readFileSync(resolve(packageRoot, id), "utf8")).toMatch(/createElementNS/);
    }
  });
});
