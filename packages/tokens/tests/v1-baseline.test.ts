import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..", "..", "..");
const css = readFileSync(join(repositoryRoot, "legacy", "v1", "blora.css"), "utf8");
const themesDir = resolve(import.meta.dirname, "..", "src", "themes");

const variableToKey: Record<string, string> = {
  "--blora-accent-neutral": "accentNeutral",
  "--blora-accent-neutral-soft": "accentNeutralSoft",
  "--blora-accent-secondary": "accentSecondary",
  "--blora-background": "background",
  "--blora-banner-bg": "bannerBg",
  "--blora-banner-fg": "bannerFg",
  "--blora-border-subtle": "borderSubtle",
  "--blora-code-bg": "codeBg",
  "--blora-code-fg": "codeFg",
  "--blora-danger": "danger",
  "--blora-foreground": "foreground",
  "--blora-info": "info",
  "--blora-info-soft": "infoSoft",
  "--blora-on-accent": "onAccent",
  "--blora-on-media": "onMedia",
  "--blora-overlay-drawer": "overlayDrawer",
  "--blora-overlay-modal": "overlayModal",
  "--blora-primary": "primary",
  "--blora-primary-hover": "primaryHover",
  "--blora-primary-soft": "primarySoft",
  "--blora-success": "success",
  "--blora-success-soft": "successSoft",
  "--blora-support": "support",
  "--blora-surface-1": "surface1",
  "--blora-surface-2": "surface2",
  "--blora-surface-3": "surface3",
  "--blora-text-disabled": "textDisabled",
  "--blora-text-emphasis": "textEmphasis",
  "--blora-text-muted": "textMuted",
  "--blora-text-strong": "textStrong",
  "--blora-text-subtle": "textSubtle",
  "--blora-tooltip-bg": "tooltipBg",
  "--blora-warning": "warning",
};

function extractBlock(pattern: RegExp, label: string): string {
  const match = css.match(pattern);
  if (!match?.[1]) throw new Error(`Missing ${label} block in frozen v1 CSS`);
  return match[1];
}

function parseDeclarations(block: string): Record<string, string> {
  const values: Record<string, string> = {};
  for (const match of block.matchAll(/(--blora-[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    const key = variableToKey[match[1]];
    if (key) values[key] = match[2].trim();
  }
  return values;
}

function tokenValues(value: Record<string, { $value: string }>): Record<string, string> {
  return Object.fromEntries(Object.entries(value).map(([key, token]) => [key, token.$value]));
}

describe("frozen v1 theme baseline", () => {
  for (const file of readdirSync(themesDir)
    .filter((name) => name.endsWith(".tokens.json"))
    .sort()) {
    const palette = file.replace(".tokens.json", "");
    it(`${palette} light and dark values match legacy/v1/blora.css`, () => {
      const theme = JSON.parse(readFileSync(join(themesDir, file), "utf8"));
      const light = parseDeclarations(
        extractBlock(
          new RegExp(`:root\\[data-blora-palette="${palette}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`),
          `${palette} light`,
        ),
      );
      const dark = parseDeclarations(
        extractBlock(
          palette === "coral"
            ? /:root\.blora-dark:not\(\[data-blora-palette\]\)[\s\S]*?:root\.blora-dark\[data-blora-palette="coral"\] body\s*\{([\s\S]*?)\n\}/
            : new RegExp(
                `:root\\.blora-dark\\[data-blora-palette="${palette}"\\],[\\s\\S]*?\\{([\\s\\S]*?)\\n\\}`,
              ),
          `${palette} dark`,
        ),
      );

      expect(tokenValues(theme.light.color.coral)).toEqual(light);
      expect(tokenValues(theme.dark.color.coral)).toEqual(dark);
    });
  }
});
