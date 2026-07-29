/**
 * Size checker stub.
 * Will enforce package size budgets from the spec:
 * - Tokens CSS: <= 8 KB gzip
 * - Foundations CSS: <= 10 KB gzip
 * - Button CSS + helper: <= 3 KB gzip
 * - Select JS: <= 15 KB gzip
 * - Dialog JS: <= 10 KB gzip
 * - Stable components JS total: <= 80 KB gzip
 * - Stable components CSS total: <= 70 KB gzip
 */
import { existsSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { resolve } from "node:path";

const distDir = resolve(import.meta.dirname, "..", "dist");

if (!existsSync(distDir)) {
  console.log("[size] dist/ does not exist yet. Build first.");
  process.exit(0);
}

console.log("[size] Package size check (stub - budgets will be enforced in Phase 2+)");
console.log("[size] OK");
