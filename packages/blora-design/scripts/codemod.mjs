#!/usr/bin/env node
/**
 * Blora Design 2.0 - Codemod for 1.x -> 2.0 migration.
 * Spec §19.6: Low-risk automatic conversions.
 *
 * Usage:
 *   node scripts/codemod.mjs <path>           # Apply transformations
 *   node scripts/codemod.mjs --check <path>   # Dry-run, report only
 *
 * Transforms:
 *   .blora-btn                  -> .blora-button
 *   .blora-btn--primary         -> data-variant="primary"
 *   .blora-btn--sm              -> data-size="sm"
 *   .blora-dark                 -> data-blora-color-scheme="dark"
 *   .blora-collapse             -> .blora-accordion
 *   data-blora-palette          -> data-blora-theme
 *   blora:appearancechange      -> blora-appearance-change
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join, extname, relative } from "node:path";

// --- 1.x → 2.0 rewrite rules (no runtime compat layer) ---

const CLASS_TRANSFORMS = [
  // Button modifiers (before base)
  {
    v1: "blora-btn--primary",
    v2Class: "blora-button",
    attr: { name: "data-variant", value: "primary" },
    remove: true,
  },
  {
    v1: "blora-btn--secondary",
    v2Class: "blora-button",
    attr: { name: "data-variant", value: "secondary" },
    remove: true,
  },
  {
    v1: "blora-btn--danger",
    v2Class: "blora-button",
    attr: { name: "data-variant", value: "danger" },
    remove: true,
  },
  {
    v1: "blora-btn--ghost",
    v2Class: "blora-button",
    attr: { name: "data-variant", value: "ghost" },
    remove: true,
  },
  {
    v1: "blora-btn--outline",
    v2Class: "blora-button",
    attr: { name: "data-variant", value: "outline" },
    remove: true,
  },
  {
    v1: "blora-btn--text",
    v2Class: "blora-button",
    attr: { name: "data-variant", value: "text" },
    remove: true,
  },
  {
    v1: "blora-btn--xs",
    v2Class: "blora-button",
    attr: { name: "data-size", value: "xs" },
    remove: true,
  },
  {
    v1: "blora-btn--sm",
    v2Class: "blora-button",
    attr: { name: "data-size", value: "sm" },
    remove: true,
  },
  {
    v1: "blora-btn--lg",
    v2Class: "blora-button",
    attr: { name: "data-size", value: "lg" },
    remove: true,
  },
  {
    v1: "blora-btn--xl",
    v2Class: "blora-button",
    attr: { name: "data-size", value: "xl" },
    remove: true,
  },
  {
    v1: "blora-btn--icon",
    v2Class: "blora-button",
    attr: { name: "data-size", value: "icon" },
    remove: true,
  },
  { v1: "blora-btn", v2Class: "blora-button", attr: null, remove: true },

  // Card modifiers
  {
    v1: "blora-card--hover",
    v2Class: null,
    attr: { name: "data-variant", value: "hover" },
    remove: true,
  },
  {
    v1: "blora-card--flat",
    v2Class: null,
    attr: { name: "data-variant", value: "flat" },
    remove: true,
  },
  {
    v1: "blora-card--inset",
    v2Class: null,
    attr: { name: "data-variant", value: "inset" },
    remove: true,
  },
  {
    v1: "blora-card--relative",
    v2Class: null,
    attr: { name: "data-positioned", value: "" },
    remove: true,
  },
  {
    v1: "blora-card--with-badge",
    v2Class: null,
    attr: { name: "data-with-badge", value: "" },
    remove: true,
  },

  // Table
  {
    v1: "blora-table--striped",
    v2Class: null,
    attr: { name: "data-striped", value: "" },
    remove: true,
  },

  // List
  { v1: "blora-list--hover", v2Class: null, attr: { name: "data-hover", value: "" }, remove: true },

  // Collapse -> Accordion
  { v1: "blora-collapse__content", v2Class: "blora-accordion__content", attr: null, remove: true },
  { v1: "blora-collapse__body", v2Class: "blora-accordion__body", attr: null, remove: true },
  { v1: "blora-collapse__icon", v2Class: "blora-accordion__icon", attr: null, remove: true },
  { v1: "blora-collapse__head", v2Class: "blora-accordion__head", attr: null, remove: true },
  { v1: "blora-collapse__item", v2Class: "blora-accordion__item", attr: null, remove: true },
  { v1: "blora-collapse", v2Class: "blora-accordion", attr: null, remove: true },

  // Avatar modifiers
  { v1: "blora-avatar--xs", v2Class: null, attr: { name: "data-size", value: "xs" }, remove: true },
  { v1: "blora-avatar--sm", v2Class: null, attr: { name: "data-size", value: "sm" }, remove: true },
  { v1: "blora-avatar--lg", v2Class: null, attr: { name: "data-size", value: "lg" }, remove: true },
  { v1: "blora-avatar--xl", v2Class: null, attr: { name: "data-size", value: "xl" }, remove: true },
  {
    v1: "blora-avatar--primary",
    v2Class: null,
    attr: { name: "data-variant", value: "primary" },
    remove: true,
  },
  {
    v1: "blora-avatar--neutral",
    v2Class: null,
    attr: { name: "data-variant", value: "neutral" },
    remove: true,
  },
  {
    v1: "blora-avatar--info",
    v2Class: null,
    attr: { name: "data-variant", value: "info" },
    remove: true,
  },
  {
    v1: "blora-avatar--success",
    v2Class: null,
    attr: { name: "data-variant", value: "success" },
    remove: true,
  },
  {
    v1: "blora-avatar--contrast",
    v2Class: null,
    attr: { name: "data-variant", value: "contrast" },
    remove: true,
  },
  {
    v1: "blora-avatar--square",
    v2Class: null,
    attr: { name: "data-shape", value: "square" },
    remove: true,
  },

  // Timeline dot modifiers
  {
    v1: "blora-timeline__dot--primary",
    v2Class: null,
    attr: { name: "data-variant", value: "primary" },
    remove: true,
  },
  {
    v1: "blora-timeline__dot--success",
    v2Class: null,
    attr: { name: "data-variant", value: "success" },
    remove: true,
  },

  // Result modifiers
  {
    v1: "blora-result--success",
    v2Class: null,
    attr: { name: "data-variant", value: "success" },
    remove: true,
  },
  {
    v1: "blora-result--warning",
    v2Class: null,
    attr: { name: "data-variant", value: "warning" },
    remove: true,
  },
  {
    v1: "blora-result--error",
    v2Class: null,
    attr: { name: "data-variant", value: "error" },
    remove: true,
  },
  {
    v1: "blora-result--info",
    v2Class: null,
    attr: { name: "data-variant", value: "info" },
    remove: true,
  },

  // Status dot modifiers
  {
    v1: "blora-dot--primary",
    v2Class: null,
    attr: { name: "data-variant", value: "primary" },
    remove: true,
  },
  {
    v1: "blora-dot--success",
    v2Class: null,
    attr: { name: "data-variant", value: "success" },
    remove: true,
  },
  {
    v1: "blora-dot--warning",
    v2Class: null,
    attr: { name: "data-variant", value: "warning" },
    remove: true,
  },
  { v1: "blora-dot--pulse", v2Class: null, attr: { name: "data-pulse", value: "" }, remove: true },
];

const STATE_TRANSFORMS = [
  { context: "blora-btn", state: "is-loading", attr: { name: "data-loading", value: "" } },
  { context: "blora-fab", state: "is-hidden", attr: { name: "data-hidden", value: "" } },
  { context: "blora-collapse__item", state: "is-open", attr: { name: "data-open", value: "" } },
  { context: "blora-table-wrap", state: "is-loading", attr: { name: "data-loading", value: "" } },
  { context: "blora-table-wrap", state: "is-empty", attr: { name: "data-empty", value: "" } },
];

const ATTR_TRANSFORMS = [
  { v1: "data-blora-palette", v2: "data-blora-theme" },
  { v1: "data-blora-size", v2: "data-blora-density" },
  { v1: "data-blora-color-mode", v2: "data-blora-color-scheme" },
];

const EVENT_TRANSFORMS = [
  { v1: "blora:appearancechange", v2: "blora-appearance-change" },
  { v1: "blora:palettechange", v2: "blora-theme-change" },
  { v1: "blora:modetoggle", v2: "blora-color-scheme-change" },
];

const SUPPORTED_EXTENSIONS = [
  ".html",
  ".htm",
  ".vue",
  ".jsx",
  ".tsx",
  ".svelte",
  ".php",
  ".rb",
  ".erb",
];

// --- File walking ---

function walkFiles(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "dist")
      continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(path, results);
    } else if (SUPPORTED_EXTENSIONS.includes(extname(path))) {
      results.push(path);
    }
  }
  return results;
}

// --- Transformations ---

function transformClassAttr(content) {
  let result = content;
  let changes = 0;

  for (const t of CLASS_TRANSFORMS) {
    // Match class="... blora-btn--primary ..." or class='... blora-btn--primary ...'
    const escaped = t.v1.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const classRegex = new RegExp(`(class\\s*=\\s*["'])([^"']*\\b${escaped}\\b[^"']*)(["'])`, "g");

    result = result.replace(classRegex, (match, prefix, classVal, suffix) => {
      const classes = classVal.split(/\s+/);
      const idx = classes.indexOf(t.v1);
      if (idx === -1) return match;

      changes++;

      // Replace old class with new class
      if (t.v2Class && t.v2Class !== t.v1) {
        // Only add v2 class if not already present
        if (!classes.includes(t.v2Class)) {
          classes[idx] = t.v2Class;
        } else {
          classes.splice(idx, 1);
        }
      } else if (t.remove) {
        classes.splice(idx, 1);
      }

      return `${prefix}${classes.filter(Boolean).join(" ")}${suffix}`;
    });

    // For attribute-based conversions, we need to add the data attribute
    // to the nearest opening tag. This is handled in transformTags.
  }

  return { content: result, changes };
}

function transformTags(content) {
  let result = content;
  let changes = 0;

  // For each tag that contains a v1 class needing a data attribute,
  // add the data attribute to that tag.
  for (const t of CLASS_TRANSFORMS) {
    if (!t.attr) continue;
    const escaped = t.v1.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Find tags with the v1 class (before it was removed by transformClassAttr)
    // We look for class="... v1class ..." in the original content
    const tagRegex = new RegExp(
      `(<[a-zA-Z][^>]*?\\sclass\\s*=\\s*["'][^"']*\\b${escaped}\\b[^"']*["'])([^>]*>)`,
      "g",
    );

    result = result.replace(tagRegex, (match, before, after) => {
      const attrName = t.attr.name;
      const attrValue = t.attr.value;

      // Check if attribute already exists
      const attrCheck = new RegExp(`\\s${attrName}(\\s|=|>|/)`);
      if (attrCheck.test(before + after)) return match;

      changes++;
      const attrStr = attrValue ? ` ${attrName}="${attrValue}"` : ` ${attrName}`;
      return `${before}${attrStr}${after}`;
    });
  }

  // State class transforms (.is-open -> data-open etc.)
  for (const t of STATE_TRANSFORMS) {
    const escapedCtx = t.context.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedState = t.state.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const tagRegex = new RegExp(
      `(<[a-zA-Z][^>]*?\\sclass\\s*=\\s*["'][^"']*\\b${escapedCtx}\\b[^"']*\\b${escapedState}\\b[^"']*["'])([^>]*>)`,
      "g",
    );

    result = result.replace(tagRegex, (match, before, after) => {
      const attrName = t.attr.name;
      const attrCheck = new RegExp(`\\s${attrName}(\\s|=|>|/)`);
      if (attrCheck.test(before + after)) return match;

      changes++;
      const attrStr = t.attr.value ? ` ${attrName}="${t.attr.value}"` : ` ${attrName}`;
      return `${before}${attrStr}${after}`;
    });
  }

  // Data attribute transforms
  for (const t of ATTR_TRANSFORMS) {
    const escaped = t.v1.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const attrRegex = new RegExp(`\\b${escaped}\\b`, "g");
    const matches = result.match(attrRegex);
    if (matches) {
      result = result.replace(attrRegex, t.v2);
      changes += matches.length;
    }
  }

  // Event name transforms (in JS/JSX/Vue)
  for (const t of EVENT_TRANSFORMS) {
    const escaped = t.v1.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const eventRegex = new RegExp(`["']${escaped}["']`, "g");
    const matches = result.match(eventRegex);
    if (matches) {
      result = result.replace(eventRegex, `"${t.v2}"`);
      changes += matches.length;
    }
  }

  return { content: result, changes };
}

function transformContent(content) {
  // First add data attributes to tags, then transform classes
  const { content: step1, changes: changes1 } = transformTags(content);
  const { content: step2, changes: changes2 } = transformClassAttr(step1);
  return { content: step2, changes: changes1 + changes2 };
}

// --- Main ---

const args = process.argv.slice(2);
const dryRun = args.includes("--check") || args.includes("--dry-run");
const paths = args.filter((a) => !a.startsWith("--"));

if (paths.length === 0) {
  console.error("Usage: codemod.mjs [--check] <path>");
  console.error("  --check   Dry-run, report changes without writing");
  process.exit(1);
}

let totalFiles = 0;
let totalChanges = 0;
const report = [];

for (const targetPath of paths) {
  const absPath = resolve(targetPath);
  const stat = statSync(absPath);
  const files = stat.isDirectory() ? walkFiles(absPath) : [absPath];

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const { content: transformed, changes } = transformContent(content);

    if (changes > 0) {
      totalFiles++;
      totalChanges += changes;
      report.push({ file: relative(process.cwd(), file), changes });

      if (!dryRun) {
        writeFileSync(file, transformed, "utf8");
      }
    }
  }
}

console.log(
  `[codemod] ${dryRun ? "Dry run: " : ""}${totalChanges} change(s) in ${totalFiles} file(s).`,
);

if (dryRun && report.length > 0) {
  console.log("\nFiles that would be changed:");
  for (const r of report) {
    console.log(`  ${r.file} (${r.changes} change(s))`);
  }
}

if (dryRun && totalChanges > 0) process.exit(1);
