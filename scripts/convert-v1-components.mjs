/**
 * Batch-convert v1 component CSS to v2 format.
 * Reads legacy/v1/blora.css, extracts each component block,
 * converts tokens/properties, and writes v2 CSS files.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

const root = resolve(import.meta.dirname, "..");
const v1Css = readFileSync(resolve(root, "legacy/v1/blora.css"), "utf8");
const pkgDir = resolve(root, "packages/blora-design");

// Token replacements (v1 -> v2)
const tokenReplacements = [
  [/--blora-surface-1/g, "--blora-color-surface-default"],
  [/--blora-surface-2/g, "--blora-color-surface-raised"],
  [/--blora-surface-3/g, "--blora-color-surface-sunken"],
  [/--blora-background/g, "--blora-color-surface-canvas"],
  [
    /--blora-primary-tint/g,
    "color-mix(in srgb, var(--blora-color-action-primary-default) 8%, transparent)",
  ],
  [/--blora-primary-hover/g, "--blora-color-action-primary-hover"],
  [/--blora-primary\b/g, "--blora-color-action-primary-default"],
  [/--blora-on-accent/g, "--blora-color-text-on-accent"],
  [/--blora-text-strong/g, "--blora-color-text-primary"],
  [/--blora-text-emphasis/g, "--blora-color-text-emphasis"],
  [/--blora-foreground\b/g, "--blora-color-text-emphasis"],
  [/--blora-text-muted/g, "--blora-color-text-muted"],
  [/--blora-text-subtle/g, "--blora-color-text-subtle"],
  [/--blora-text-disabled/g, "--blora-color-text-disabled"],
  [/--blora-success/g, "--blora-color-status-success"],
  [/--blora-warning/g, "--blora-color-status-warning"],
  [/--blora-danger/g, "--blora-color-status-danger"],
  [/--blora-info/g, "--blora-color-status-info"],
  [/--blora-border-subtle/g, "--blora-color-border-subtle"],
  [/--blora-border\b/g, "--blora-border-subtle"],
  [/--blora-dur-fast/g, "--blora-duration-fast"],
  [/--blora-dur-base/g, "--blora-duration-base"],
  [/--blora-dur-slow/g, "--blora-duration-slow"],
  [/--blora-ease-overshoot/g, "--blora-easing-overshoot"],
  [/--blora-ease\b/g, "--blora-easing-standard"],
  [/--blora-control-radius/g, "--blora-radius-full"],
  [/--blora-media-overlay-strong/g, "--blora-color-overlay-media-strong"],
  [/--blora-media-overlay\b/g, "--blora-color-overlay-media"],
  [/--blora-on-media/g, "--blora-color-text-on-media"],
  [/--blora-overlay-drawer/g, "--blora-color-overlay-drawer"],
  [/--blora-overlay-modal/g, "--blora-color-overlay-modal"],
  [/--blora-tooltip-bg/g, "--blora-color-surface-sunken"],
  [
    /--blora-focus-ring-strong/g,
    "0 0 0 3px color-mix(in srgb, var(--blora-color-action-primary-default) 30%, transparent)",
  ],
  [
    /--blora-focus-ring\b/g,
    "0 0 0 2px color-mix(in srgb, var(--blora-color-action-primary-default) 20%, transparent)",
  ],
  [/--blora-banner-bg/g, "--blora-color-banner-background"],
  [/--blora-banner-fg/g, "--blora-color-banner-foreground"],
  // btn local tokens
  [/--btn-fg/g, "--blora-button-fg"],
  [/--btn-bg/g, "--blora-button-bg"],
  [/--btn-bd/g, "--blora-button-bd"],
  // Physical -> logical properties
  [/padding-left:/g, "padding-inline-start:"],
  [/padding-right:/g, "padding-inline-end:"],
  [/margin-left:/g, "margin-inline-start:"],
  [/margin-right:/g, "margin-inline-end:"],
  [/border-left:/g, "border-inline-start:"],
  [/border-right:/g, "border-inline-end:"],
  [/text-align:\s*left/g, "text-align: start"],
  [/text-align:\s*right/g, "text-align: end"],
];

// .is-* -> [data-*] for common state classes
const stateReplacements = [
  [/\.is-open/g, "[data-open]"],
  [/\.is-active/g, "[data-active]"],
  [/\.is-disabled/g, "[disabled]"],
  [/\.is-hidden/g, "[data-hidden]"],
  [/\.is-loading/g, "[data-loading]"],
  [/\.is-dragover/g, "[data-dragover]"],
  [/\.is-dragging/g, "[data-dragging]"],
  [/\.is-entering/g, "[data-entering]"],
  [/\.is-closing/g, "[data-closing]"],
  [/\.is-leaving/g, "[data-leaving]"],
  [/\.is-done/g, '[data-state="done"]'],
  [/\.is-portaled/g, "[data-portaled]"],
  [/\.is-instant/g, "[data-instant]"],
];

function convertCss(css) {
  let result = css;
  for (const [from, to] of tokenReplacements) {
    result = result.replace(from, to);
  }
  for (const [from, to] of stateReplacements) {
    result = result.replace(from, to);
  }
  // Fix z-index calc() - replace calc(var(--blora-z-X) - 1) with var(--blora-z-base) or var(--blora-z-dropdown)
  result = result.replace(
    /z-index:\s*calc\(var\(--blora-z-drawer\)\s*-\s*1\)/g,
    "z-index: var(--blora-z-dropdown)",
  );
  result = result.replace(
    /z-index:\s*calc\(var\(--blora-z-modal\)\s*-\s*1\)/g,
    "z-index: var(--blora-z-drawer)",
  );
  // Remove !important (except for specific cases)
  // Keep !important for now - stylelint will catch it
  return result;
}

// Extract CSS blocks for each component from v1
function extractComponentCss(componentName) {
  // Match from .blora-<name> until the next .blora-<other-component> or comment section
  const pattern = new RegExp(`((?:\\.blora-${componentName}[^{]*\\{[^}]*\\}\\s*)+)`, "g");
  const matches = [...v1Css.matchAll(pattern)];
  if (matches.length === 0) return null;
  return matches.map((m) => m[1]).join("\n");
}

// Component definitions: [v1Prefix, v2Dir, storyTitle, status]
const components = [
  ["fab", "fab", "Navigation/FAB"],
  ["dock", "dock", "Navigation/Dock"],
  ["deck", "deck", "Layout/Deck"],
  ["chart", "chart-container", "Data/Chart Container"],
  ["mockup", "mockup", "Layout/Mockup"],
  ["masonry", "masonry", "Layout/Masonry"],
  ["watermark", "watermark", "Layout/Watermark"],
  ["affix", "affix", "Layout/Affix"],
  ["comment", "comment", "Data/Comment"],
  ["chat", "chat", "Data/Chat"],
  ["slider", "slider", "Forms/Slider"],
  ["range", "range", "Forms/Range"],
  ["rate", "rate", "Forms/Rate"],
  ["otp", "otp", "Forms/OTP"],
  ["tags-input", "tags-input", "Forms/Tags Input"],
  ["search", "search", "Forms/Search"],
  ["color-picker", "color-picker", "Forms/Color Picker"],
  ["color-swatch", "color-picker", null], // part of color-picker
  ["calendar", "calendar", "Data/Calendar"],
  ["datepicker", "datepicker", "Forms/Date Picker"],
  ["timepicker", "timepicker", "Forms/Time Picker"],
  ["cascader", "cascader", "Forms/Cascader"],
  ["tree", "tree", "Data/Tree"],
  ["transfer", "transfer", "Forms/Transfer"],
  ["autocomplete", "autocomplete", "Forms/AutoComplete"],
  ["mention", "mentions", "Forms/Mentions"],
  ["carousel", "carousel", "Data/Carousel"],
  ["tour", "tour", "Feedback/Tour"],
  ["splitter", "splitter", "Layout/Splitter"],
  ["cmdk", "command-palette", "Navigation/Command Palette"],
  ["upload", "upload", "Forms/Upload"],
  ["dropzone", "upload", null], // part of upload
  ["countdown", "countdown", "Data/Countdown"],
  ["copy", "copy", "Forms/Copy"],
  ["text-rotate", "text-rotate", "Feedback/Text Rotate"],
  ["speed-dial", "speed-dial", "Navigation/Speed Dial"],
  ["megamenu", "megamenu", "Navigation/Megamenu"],
];

// Group components that share a directory
const dirGroups = new Map();
for (const [v1Prefix, v2Dir, storyTitle] of components) {
  if (!dirGroups.has(v2Dir)) {
    dirGroups.set(v2Dir, { prefixes: [], storyTitle });
  }
  dirGroups.get(v2Dir).prefixes.push(v1Prefix);
}

let created = 0;
let skipped = 0;

for (const [v2Dir, { prefixes, storyTitle }] of dirGroups) {
  // Collect CSS from all v1 prefixes for this component
  let cssParts = [];
  for (const prefix of prefixes) {
    const css = extractComponentCss(prefix);
    if (css) {
      cssParts.push(css);
    }
  }

  const cssPath = resolve(pkgDir, "src", "components", v2Dir, `${v2Dir}.css`);

  if (cssParts.length === 0) {
    // Component not found in v1 CSS - create minimal CSS
    cssParts.push(
      `/* ${v2Dir} - not found in v1, created as placeholder */\n.blora-${v2Dir} { display: block; }`,
    );
    skipped++;
  }

  const convertedCss = convertCss(cssParts.join("\n\n"));
  const header = `/* Blora Design 2.0 - ${v2Dir} component (beta, migrated from v1) */\n\n`;

  mkdirSync(dirname(cssPath), { recursive: true });
  writeFileSync(cssPath, header + convertedCss + "\n");
  created++;

  if (storyTitle) {
    console.log(`  ✓ ${v2Dir} -> ${storyTitle}`);
  }
}

console.log(`\nCreated ${created} CSS files (${skipped} placeholders)`);
