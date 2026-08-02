/**
 * Run publint on each public add-on package (requires dist built).
 */
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const addons = ["markdown", "thread", "qrcode", "effects", "layout", "theming"];

for (const name of addons) {
  const dir = resolve(root, "addons", name);
  console.log(`[publint:addons] ${name}...`);
  execSync("pnpm exec publint .", { cwd: dir, stdio: "inherit" });
}
console.log("[publint:addons] All good.");
