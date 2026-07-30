#!/usr/bin/env node
/**
 * Blora Design 2.0 - Migration checker.
 * Spec §19.5: AI migration validator.
 *
 * Usage:
 *   node scripts/migrate-check.mjs <path>
 *
 * Detects deprecated 1.x patterns and outputs a report with:
 *   file:line, rule ID, issue, suggestion, doc link, auto-fixable
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, join, extname, relative } from "node:path";

const DOC_BASE = "/docs/migration/v1-to-v2";

// --- Rule definitions ---

/** @type {Array<{id: string, pattern: RegExp, message: (m: string) => string, suggestion: string, anchor: string, fixable: boolean}>} */
const RULES = [
  // Deprecated classes
  {
    id: "deprecated-class:blora-btn",
    pattern: /\bblora-btn\b(?![-])/g,
    message: () => `.blora-btn is deprecated`,
    suggestion: `.blora-button`,
    anchor: "button",
    fixable: true,
  },
  {
    id: "deprecated-class:blora-btn--",
    pattern: /blora-btn--([a-z]+)/g,
    message: (m) => `.${m} is deprecated`,
    suggestion: `data-variant or data-size attribute`,
    anchor: "button",
    fixable: true,
  },
  {
    id: "deprecated-class:blora-collapse",
    pattern: /\bblora-collapse\b/g,
    message: () => `.blora-collapse is deprecated`,
    suggestion: `.blora-accordion`,
    anchor: "accordion",
    fixable: true,
  },
  {
    id: "deprecated-class:blora-card--",
    pattern: /blora-card--([a-z-]+)/g,
    message: (m) => `.${m} is deprecated`,
    suggestion: `data-variant or data-positioned attribute`,
    anchor: "card",
    fixable: true,
  },
  {
    id: "deprecated-class:blora-table--striped",
    pattern: /blora-table--striped/g,
    message: () => `.blora-table--striped is deprecated`,
    suggestion: `data-striped attribute`,
    anchor: "table",
    fixable: true,
  },
  {
    id: "deprecated-class:blora-list--hover",
    pattern: /blora-list--hover/g,
    message: () => `.blora-list--hover is deprecated`,
    suggestion: `data-hover attribute`,
    anchor: "list",
    fixable: true,
  },
  {
    id: "deprecated-class:blora-avatar--",
    pattern: /blora-avatar--([a-z]+)/g,
    message: (m) => `.${m} is deprecated`,
    suggestion: `data-size, data-variant, or data-shape attribute`,
    anchor: "avatar",
    fixable: true,
  },
  {
    id: "deprecated-class:blora-result--",
    pattern: /blora-result--([a-z]+)/g,
    message: (m) => `.${m} is deprecated`,
    suggestion: `data-variant attribute`,
    anchor: "result",
    fixable: true,
  },
  {
    id: "deprecated-class:blora-dot--",
    pattern: /blora-dot--([a-z]+)/g,
    message: (m) => `.${m} is deprecated`,
    suggestion: `data-variant or data-pulse attribute`,
    anchor: "avatar",
    fixable: true,
  },
  {
    id: "deprecated-class:blora-timeline__dot--",
    pattern: /blora-timeline__dot--([a-z]+)/g,
    message: (m) => `.${m} is deprecated`,
    suggestion: `data-variant attribute`,
    anchor: "timeline",
    fixable: true,
  },

  // Deprecated state classes
  {
    id: "deprecated-state:is-open",
    pattern: /\bis-open\b/g,
    message: () => `.is-open state class is deprecated`,
    suggestion: `data-open attribute`,
    anchor: "accordion",
    fixable: true,
  },
  {
    id: "deprecated-state:is-loading",
    pattern: /\bis-loading\b/g,
    message: () => `.is-loading state class is deprecated`,
    suggestion: `data-loading attribute`,
    anchor: "button",
    fixable: true,
  },
  {
    id: "deprecated-state:is-empty",
    pattern: /\bis-empty\b/g,
    message: () => `.is-empty state class is deprecated`,
    suggestion: `data-empty attribute`,
    anchor: "table",
    fixable: true,
  },
  {
    id: "deprecated-state:is-hidden",
    pattern: /\bis-hidden\b/g,
    message: () => `.is-hidden state class is deprecated`,
    suggestion: `data-hidden attribute`,
    anchor: "button",
    fixable: true,
  },

  // Deprecated data attributes
  {
    id: "deprecated-attr:data-blora-palette",
    pattern: /data-blora-palette/g,
    message: () => `data-blora-palette is deprecated`,
    suggestion: `data-blora-theme`,
    anchor: "tokens",
    fixable: true,
  },
  {
    id: "deprecated-attr:data-blora-size",
    pattern: /data-blora-size/g,
    message: () => `data-blora-size is deprecated`,
    suggestion: `data-blora-density`,
    anchor: "tokens",
    fixable: true,
  },
  {
    id: "deprecated-attr:data-blora-color-mode",
    pattern: /data-blora-color-mode/g,
    message: () => `data-blora-color-mode is deprecated`,
    suggestion: `data-blora-color-scheme`,
    anchor: "tokens",
    fixable: true,
  },

  // Deprecated events
  {
    id: "deprecated-event:blora-colon",
    pattern: /["']blora:[a-z]+["']/g,
    message: (m) => `${m} event is deprecated`,
    suggestion: `blora-* event name (no colon)`,
    anchor: "events",
    fixable: true,
  },

  // Deprecated global API
  {
    id: "deprecated-api:Blora.init",
    pattern: /Blora\.init\b/g,
    message: () => `Blora.init() is deprecated`,
    suggestion: `Import and call define*() functions`,
    anchor: "api",
    fixable: false,
  },
  {
    id: "deprecated-api:Blora.configure",
    pattern: /Blora\.configure\b/g,
    message: () => `Blora.configure() is deprecated`,
    suggestion: `Use per-component configuration`,
    anchor: "api",
    fixable: false,
  },

  // Accessibility: button without type
  {
    id: "a11y:button-without-type",
    pattern: /<button(?![^>]*\btype\s*=)/g,
    message: () => `Button without type attribute`,
    suggestion: `Add type="button" (or type="submit")`,
    anchor: "a11y",
    fixable: false,
  },

  // Internal class access (__ prefix)
  {
    id: "internal-class-access",
    pattern: /blora-[a-z]+__[^"'\s]*__/g,
    message: (m) => `Accessing internal class ${m} is not supported`,
    suggestion: `Use public API only`,
    anchor: "internals",
    fixable: false,
  },

  // Direct Shadow DOM access
  {
    id: "shadow-dom-access",
    pattern: /\.shadowRoot\b/g,
    message: () => `Direct Shadow DOM access is not supported`,
    suggestion: `Use public component API`,
    anchor: "internals",
    fixable: false,
  },
];

// --- File walking ---

const SUPPORTED_EXTENSIONS = [
  ".html",
  ".htm",
  ".vue",
  ".jsx",
  ".tsx",
  ".ts",
  ".js",
  ".svelte",
  ".php",
  ".rb",
  ".erb",
  ".css",
  ".scss",
];

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

// --- Main ---

const args = process.argv.slice(2);
const paths = args.filter((a) => !a.startsWith("--"));

if (paths.length === 0) {
  console.error("Usage: migrate-check.mjs <path>");
  process.exit(1);
}

const findings = [];

for (const targetPath of paths) {
  const absPath = resolve(targetPath);
  if (!existsSync(absPath)) {
    console.error(`Path not found: ${absPath}`);
    continue;
  }
  const stat = statSync(absPath);
  const files = stat.isDirectory() ? walkFiles(absPath) : [absPath];

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const lines = content.split("\n");

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];

      for (const rule of RULES) {
        // Reset regex lastIndex for each line
        rule.pattern.lastIndex = 0;
        let match;
        while ((match = rule.pattern.exec(line)) !== null) {
          findings.push({
            file: relative(process.cwd(), file),
            line: lineNum + 1,
            ruleId: rule.id,
            issue: rule.message(match[0]),
            suggestion: rule.suggestion,
            docLink: `${DOC_BASE}#${rule.anchor}`,
            autoFixable: rule.fixable,
          });
        }
      }
    }
  }
}

// Output report
if (findings.length === 0) {
  console.log("[migrate:check] No deprecated patterns found. ✓");
  process.exit(0);
}

console.log(`[migrate:check] ${findings.length} finding(s):\n`);

// Group by file
const byFile = new Map();
for (const f of findings) {
  if (!byFile.has(f.file)) byFile.set(f.file, []);
  byFile.get(f.file).push(f);
}

for (const [file, fileFindings] of byFile) {
  console.log(`  ${file}:`);
  for (const f of fileFindings) {
    const fixable = f.autoFixable ? " [auto-fixable]" : "";
    console.log(`    ${f.line}:${f.ruleId} - ${f.issue}`);
    console.log(`      Suggestion: ${f.suggestion}`);
    console.log(`      See: ${f.docLink}${fixable}`);
  }
  console.log();
}

const fixableCount = findings.filter((f) => f.autoFixable).length;
console.log(`Total: ${findings.length} finding(s), ${fixableCount} auto-fixable.`);
console.log(`Run \`npx @bloret-crew/blora-codemod ${paths.join(" ")}\` to auto-fix.`);
process.exit(1);
