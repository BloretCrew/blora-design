/**
 * One-time Phase 2 migration helper.
 * Extracts palette overrides from the frozen 1.x visual source into DTCG theme files.
 * It is not part of the regular build: after Phase 2, JSON files are the source of truth.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const repositoryRoot = resolve(scriptDir, "..", "..", "..");
const css = readFileSync(join(repositoryRoot, "legacy", "v1", "blora.css"), "utf8");
const themesDir = resolve(scriptDir, "..", "src", "themes");

const palettes = [
  "cinnabar",
  "indigo",
  "lotus",
  "ocean",
  "graphite",
  "mono",
  "circuit",
  "coral",
  "dusk",
];

const variableToKey = {
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

function extractBlock(pattern, label) {
  const match = css.match(pattern);
  if (!match) throw new Error(`Could not find ${label} block in legacy/v1/blora.css`);
  return match[1];
}

function parseDeclarations(block) {
  const result = {};
  for (const match of block.matchAll(/(--blora-[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    const key = variableToKey[match[1]];
    if (!key) continue;
    result[key] = { $type: "color", $value: match[2].trim() };
  }
  return result;
}

for (const palette of palettes) {
  const lightBlock = extractBlock(
    new RegExp(`:root\\[data-blora-palette="${palette}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`),
    `${palette} light`,
  );
  const darkBlock = extractBlock(
    palette === "coral"
      ? /:root\.blora-dark:not\(\[data-blora-palette\]\)[\s\S]*?:root\.blora-dark\[data-blora-palette="coral"\] body\s*\{([\s\S]*?)\n\}/
      : new RegExp(
          `:root\\.blora-dark\\[data-blora-palette="${palette}"\\],[\\s\\S]*?\\{([\\s\\S]*?)\\n\\}`,
        ),
    `${palette} dark`,
  );

  const theme = {
    $description: `${palette[0].toUpperCase()}${palette.slice(1)} palette extracted from the frozen 1.x baseline.`,
    light: { color: { coral: parseDeclarations(lightBlock) } },
    dark: { color: { coral: parseDeclarations(darkBlock) } },
  };

  writeFileSync(join(themesDir, `${palette}.tokens.json`), `${JSON.stringify(theme, null, 2)}\n`);
}

console.log(`[sync-v1-themes] Wrote ${palettes.length} theme files from the frozen 1.x baseline.`);
