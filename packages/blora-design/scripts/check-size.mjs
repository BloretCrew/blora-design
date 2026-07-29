import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const distDir = resolve(import.meta.dirname, "..", "dist");

const budgets = [
  { file: "tokens.css", gzipBytes: 8 * 1024 },
  { file: "tokens.dark.css", gzipBytes: 4 * 1024 },
  { file: "foundations.css", gzipBytes: 10 * 1024 },
  { file: "blora.css", gzipBytes: 20 * 1024 },
];

if (!existsSync(distDir)) {
  console.error("[size] dist/ does not exist. Run the build before size checks.");
  process.exit(1);
}

let failures = 0;
for (const budget of budgets) {
  const path = resolve(distDir, budget.file);
  if (!existsSync(path)) {
    console.error(`[size] Missing required artifact: ${budget.file}`);
    failures += 1;
    continue;
  }

  const source = readFileSync(path);
  const gzipBytes = gzipSync(source, { level: 9 }).length;
  const status = gzipBytes <= budget.gzipBytes ? "OK" : "OVER";
  console.log(
    `[size] ${budget.file}: ${gzipBytes} B gzip / ${budget.gzipBytes} B budget (${status})`,
  );
  if (gzipBytes > budget.gzipBytes) failures += 1;
}

const themesPath = resolve(distDir, "tokens.themes.css");
if (existsSync(themesPath)) {
  const gzipBytes = gzipSync(readFileSync(themesPath), { level: 9 }).length;
  console.log(
    `[size] tokens.themes.css: ${gzipBytes} B gzip (optional theme bundle, reported separately)`,
  );
}

if (failures > 0) {
  console.error(`[size] ${failures} artifact(s) exceeded budget or were missing.`);
  process.exit(1);
}

console.log("[size] All active Phase 2 budgets passed.");
