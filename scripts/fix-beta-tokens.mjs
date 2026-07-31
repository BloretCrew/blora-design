/**
 * Fix token contract violations in beta component CSS files.
 * - Replace unregistered z-index values with registered tokens
 * - Replace direct color values with registered tokens
 * - Replace known v1 token names with v2 equivalents
 * - Add component-level CSS properties to contracts
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pkgDir = resolve(root, "packages/blora-design");
const componentsDir = resolve(pkgDir, "src", "components");
const contractsDir = resolve(pkgDir, "contracts");

// Known v1->v2 token name fixes (ones the convert script missed)
const tokenNameFixes = [
  [/--blora-code-bg/g, "--blora-color-code-background"],
  [/--blora-code-fg/g, "--blora-color-code-foreground"],
  [/--blora-media-indicator/g, "--blora-color-overlay-media-indicator"],
];

// z-index fixes: replace calc() and raw numbers with registered tokens
const zIndexFixes = [
  [/z-index:\s*calc\(var\(--blora-z-sticky\)\s*\+\s*1\)/g, "z-index: var(--blora-z-sticky)"],
  [/z-index:\s*calc\(var\(--blora-z-sticky\)\s*\+\s*10\)/g, "z-index: var(--blora-z-dropdown)"],
  [/z-index:\s*calc\(var\(--blora-z-modal\)\s*\+\s*5\)/g, "z-index: var(--blora-z-toast)"],
  [/z-index:\s*calc\(var\(--blora-z-modal\)\s*\+\s*6\)/g, "z-index: var(--blora-z-toast)"],
  [/z-index:\s*calc\(var\(--blora-z-drawer\)\s*-\s*1\)/g, "z-index: var(--blora-z-dropdown)"],
  // Raw numbers in z-index
  [/z-index:\s*10\b/g, "z-index: var(--blora-z-sticky)"],
  [/z-index:\s*5\b/g, "z-index: var(--blora-z-sticky)"],
  [/z-index:\s*4\b/g, "z-index: var(--blora-z-base)"],
  [/z-index:\s*3\b/g, "z-index: var(--blora-z-base)"],
  [/z-index:\s*2\b/g, "z-index: var(--blora-z-base)"],
  [/z-index:\s*1\b/g, "z-index: var(--blora-z-base)"],
];

// Direct color fixes
const colorFixes = [
  [/rgba\(20,\s*18,\s*22,\s*0\.45\)/g, "var(--blora-color-overlay-modal)"],
  [/#000\b/gi, "var(--blora-color-text-primary)"],
  [/#6b6b6b\b/gi, "var(--blora-color-text-subtle)"],
  [/#c47a4a\b/gi, "var(--blora-color-action-primary-default)"],
  [/#c8c4cc\b/gi, "var(--blora-color-border-subtle)"],
];

// Component-level CSS properties to add to contracts
const componentCssProps = {
  "chart-container": ["--blora-chart-min-h"],
  deck: ["--blora-deck-y", "--blora-deck-scale", "----blora-deck-opacity"],
  masonry: ["--blora-masonry-cols"],
  megamenu: ["--blora-megamenu-offset"],
  mockup: [
    "--blora-phone-max",
    "--blora-phone-radius",
    "--blora-phone-radius-se",
    "--blora-phone-rim",
    "--blora-phone-screen-radius",
    "--blora-phone-screen-radius-se",
    "--blora-phone-island-radius",
  ],
  "speed-dial": [
    "--blora-sd-action-size",
    "--blora-sd-gap",
    "--blora-sd-r",
    "--blora-sd-trigger-size",
  ],
  tree: ["--blora-tree-h"],
};

// Process all CSS files in component directories
const componentDirs = readdirSync(componentsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let fixedFiles = 0;

for (const dir of componentDirs) {
  const cssFiles = readdirSync(resolve(componentsDir, dir)).filter(f => f.endsWith(".css"));
  for (const cssFile of cssFiles) {
    const cssPath = resolve(componentsDir, dir, cssFile);
    let css = readFileSync(cssPath, "utf8");
    let modified = false;

    // Apply token name fixes
    for (const [from, to] of tokenNameFixes) {
      if (from.test(css)) {
        css = css.replace(from, to);
        modified = true;
      }
    }

    // Apply z-index fixes
    for (const [from, to] of zIndexFixes) {
      if (from.test(css)) {
        css = css.replace(from, to);
        modified = true;
      }
    }

    // Apply color fixes
    for (const [from, to] of colorFixes) {
      if (from.test(css)) {
        css = css.replace(from, to);
        modified = true;
      }
    }

    if (modified) {
      writeFileSync(cssPath, css);
      fixedFiles++;
    }
  }
}

// Update contracts with component-level CSS properties
for (const [component, props] of Object.entries(componentCssProps)) {
  // Fix the deck typo
  const cleanProps = props.map(p => p.replace(/^--+/, "--"));
  const contractPath = resolve(contractsDir, `${component}.contract.json`);
  const contract = JSON.parse(readFileSync(contractPath, "utf8"));
  contract.cssProperties = [...new Set([...(contract.cssProperties || []), ...cleanProps])];
  writeFileSync(contractPath, JSON.stringify(contract, null, 2) + "\n");
}

console.log(`Fixed ${fixedFiles} CSS files and updated ${Object.keys(componentCssProps).length} contracts`);
