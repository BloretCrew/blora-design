/**
 * Size budgets for published artifacts.
 * `blora.css` is an @import shell — we also measure flattened CSS (resolved imports).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const distDir = resolve(import.meta.dirname, "..", "dist");

const budgets = [
  { file: "tokens.css", gzipBytes: 8 * 1024 },
  { file: "tokens.dark.css", gzipBytes: 4 * 1024 },
  { file: "foundations.css", gzipBytes: 10 * 1024 },
  /** Shell only — keep small so we notice accidental inlining */
  { file: "blora.css", gzipBytes: 20 * 1024, note: "import-shell" },
  { file: "index.js", gzipBytes: 60 * 1024 },
  { file: "compat/v1/index.js", gzipBytes: 8 * 1024, optional: true },
  { file: "blora.global.js", gzipBytes: 80 * 1024, optional: true, note: "cdn-iife" },
  { file: "components/button/index.js", gzipBytes: 8 * 1024, optional: true },
  { file: "components/select/index.js", gzipBytes: 20 * 1024, optional: true },
  { file: "components/table/index.js", gzipBytes: 24 * 1024, optional: true },
];

/** Flattened CSS budget (tokens + foundations + all component CSS under dist/) */
const FLATTENED_CSS_GZIP_BUDGET = 180 * 1024;

function gzipSize(buf) {
  return gzipSync(buf, { level: 9 }).length;
}

function resolveCssImports(entryPath, seen = new Set()) {
  const abs = resolve(entryPath);
  if (seen.has(abs)) return Buffer.alloc(0);
  if (!existsSync(abs)) {
    console.warn(`[size] missing import target: ${abs}`);
    return Buffer.alloc(0);
  }
  seen.add(abs);
  const source = readFileSync(abs, "utf8");
  const dir = dirname(abs);
  let out = "";
  const importRe = /@import\s+(?:url\()?["']([^"']+)["']\)?[^;]*;/g;
  let last = 0;
  let m;
  while ((m = importRe.exec(source))) {
    out += source.slice(last, m.index);
    last = m.index + m[0].length;
    const target = resolve(dir, m[1]);
    out += resolveCssImports(target, seen).toString("utf8");
  }
  out += source.slice(last);
  return Buffer.from(out, "utf8");
}

function walkCssFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkCssFiles(p, acc);
    else if (name.endsWith(".css")) acc.push(p);
  }
  return acc;
}

if (!existsSync(distDir)) {
  console.error("[size] dist/ does not exist. Run the build before size checks.");
  process.exit(1);
}

let failures = 0;

for (const budget of budgets) {
  const path = resolve(distDir, budget.file);
  if (!existsSync(path)) {
    if (budget.optional) {
      console.log(`[size] ${budget.file}: (optional, missing)`);
      continue;
    }
    console.error(`[size] Missing required artifact: ${budget.file}`);
    failures += 1;
    continue;
  }

  const source = readFileSync(path);
  const gzipBytes = gzipSize(source);
  const status = gzipBytes <= budget.gzipBytes ? "OK" : "OVER";
  const note = budget.note ? ` [${budget.note}]` : "";
  console.log(
    `[size] ${budget.file}: ${gzipBytes} B gzip / ${budget.gzipBytes} B budget (${status})${note}`,
  );
  if (gzipBytes > budget.gzipBytes) failures += 1;
}

// Flattened CSS: prefer resolving blora.css imports; fallback sum all component + token files
const bloraEntry = resolve(distDir, "blora.css");
let flatBuf;
if (existsSync(bloraEntry)) {
  flatBuf = resolveCssImports(bloraEntry);
} else {
  const parts = [
    resolve(distDir, "tokens.css"),
    resolve(distDir, "foundations.css"),
    ...walkCssFiles(resolve(distDir, "components")),
  ]
    .filter((p) => existsSync(p))
    .map((p) => readFileSync(p));
  flatBuf = Buffer.concat(parts);
}

const flatGzip = gzipSize(flatBuf);
const flatStatus = flatGzip <= FLATTENED_CSS_GZIP_BUDGET ? "OK" : "OVER";
console.log(
  `[size] flattened-css (resolved imports): ${flatGzip} B gzip / ${FLATTENED_CSS_GZIP_BUDGET} B budget (${flatStatus})`,
);
if (flatGzip > FLATTENED_CSS_GZIP_BUDGET) failures += 1;

const themesPath = resolve(distDir, "tokens.themes.css");
if (existsSync(themesPath)) {
  const gzipBytes = gzipSize(readFileSync(themesPath));
  console.log(`[size] tokens.themes.css: ${gzipBytes} B gzip (optional theme bundle)`);
}

if (failures > 0) {
  console.error(`[size] ${failures} artifact(s) exceeded budget or were missing.`);
  process.exit(1);
}

console.log("[size] All size budgets passed (shell + flattened CSS + JS).");
