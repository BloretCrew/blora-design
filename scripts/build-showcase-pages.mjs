/**
 * Assemble a GitHub Pages root for https://bloretcrew.github.io/blora-design/
 * Showcase HTML is rewritten from monorepo ../../ paths to site-relative paths.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, ".pages-site");
const showcase = resolve(root, "examples/showcase-v2/index.html");

const copies = [
  ["packages/blora-design/dist", "packages/blora-design/dist"],
  ["addons/theming/dist", "addons/theming/dist"],
  ["addons/layout/dist", "addons/layout/dist"],
  ["addons/effects/dist", "addons/effects/dist"],
  ["addons/markdown/dist", "addons/markdown/dist"],
  ["addons/qrcode/dist", "addons/qrcode/dist"],
  ["addons/thread/dist", "addons/thread/dist"],
  ["legacy/visual-baseline-light.png", "legacy/visual-baseline-light.png"],
  ["legacy/visual-baseline-dark.png", "legacy/visual-baseline-dark.png"],
  ["docs/standards.md", "docs/standards.md"],
];

if (!existsSync(showcase)) {
  console.error("[pages] missing examples/showcase-v2/index.html");
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

let html = readFileSync(showcase, "utf8");
html = html
  .replaceAll("../../packages/", "packages/")
  .replaceAll("../../addons/", "addons/")
  .replaceAll("../../legacy/", "legacy/")
  .replaceAll("../../docs/", "docs/");
writeFileSync(resolve(out, "index.html"), html);
writeFileSync(resolve(out, ".nojekyll"), "");

for (const [from, to] of copies) {
  const source = resolve(root, from);
  const target = resolve(out, to);
  if (!existsSync(source)) {
    console.error(`[pages] missing ${from}`);
    process.exit(1);
  }
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
}

console.log(`[pages] wrote ${out}`);
