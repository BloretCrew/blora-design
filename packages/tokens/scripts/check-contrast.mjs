import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const themesDir = join(packageDir, "src", "themes");

function parseHex(value) {
  const match = /^#([0-9a-f]{6})$/i.exec(value);
  if (!match) throw new Error(`Contrast checks require six-digit hex colors, got ${value}`);
  return [0, 2, 4].map((offset) => Number.parseInt(match[1].slice(offset, offset + 2), 16) / 255);
}

function linearize(channel) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const [red, green, blue] = parseHex(hex).map(linearize);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

export function checkThemeContrast() {
  const failures = [];
  for (const file of readdirSync(themesDir)
    .filter((name) => name.endsWith(".tokens.json"))
    .sort()) {
    const theme = JSON.parse(readFileSync(join(themesDir, file), "utf8"));
    const palette = file.replace(".tokens.json", "");

    for (const mode of ["light", "dark"]) {
      const tokens = theme[mode].color.coral;
      const inherited = mode === "dark" ? theme.light.color.coral : tokens;
      const values = (key) => tokens[key]?.$value ?? inherited[key]?.$value;
      const checks = [
        ["primary text / canvas", values("textStrong"), values("background"), 4.5],
        ["secondary text / canvas", values("foreground"), values("background"), 4.5],
        ["on-accent text / primary", values("onAccent"), values("primary"), 4.5],
        ["code text / code background", values("codeFg"), values("codeBg"), 4.5],
      ];

      for (const [label, foreground, background, minimum] of checks) {
        if (!foreground || !background) continue;
        const ratio = contrastRatio(foreground, background);
        if (ratio < minimum) {
          failures.push(
            `${palette}/${mode} ${label}: ${ratio.toFixed(2)}:1 < ${minimum}:1 (${foreground} on ${background})`,
          );
        }
      }
    }
  }
  return failures;
}

const isDirectRun =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isDirectRun) {
  const failures = checkThemeContrast();
  if (failures.length > 0) {
    console.error(`[contrast] ${failures.length} WCAG AA contrast failure(s):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
  console.log("[contrast] All registered text/background pairs meet WCAG 2.2 AA (4.5:1). ");
}
