import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const packageDir = resolve(import.meta.dirname, "..");
const tokenDir = resolve(packageDir, "..", "tokens", "generated");
const distDir = resolve(packageDir, "dist");

mkdirSync(distDir, { recursive: true });
for (const file of ["tokens.css", "tokens.dark.css", "tokens.themes.css", "token-manifest.json"]) {
  copyFileSync(resolve(tokenDir, file), resolve(distDir, file));
}

console.log("[copy-tokens] Copied generated token assets into the main package dist/.");
