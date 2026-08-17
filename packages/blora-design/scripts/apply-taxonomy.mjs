/**
 * Apply taxonomy.json to contracts, Storybook titles, and showcase groups.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const packageDir = resolve(import.meta.dirname, "..");
const repoRoot = resolve(packageDir, "../..");
const taxonomy = JSON.parse(readFileSync(join(packageDir, "taxonomy.json"), "utf8"));
const categories = new Map(taxonomy.categories.map((category) => [category.id, category]));

function withCategory(json, categoryId) {
  if (json.category === categoryId) return json;
  const next = {};
  for (const [key, value] of Object.entries(json)) {
    if (key === "category") continue;
    next[key] = value;
    if (key === "name") next.category = categoryId;
  }
  if (!("category" in next)) next.category = categoryId;
  return next;
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

for (const file of readdirSync(join(packageDir, "contracts")).filter((name) =>
  name.endsWith(".contract.json"),
)) {
  const name = file.replace(/\.contract\.json$/, "");
  const categoryId = taxonomy.components[name];
  if (!categoryId) throw new Error(`taxonomy.json missing component ${name}`);
  const path = join(packageDir, "contracts", file);
  writeJson(path, withCategory(JSON.parse(readFileSync(path, "utf8")), categoryId));
}

const addonContracts = [
  ["addons/effects/contracts/effects.contract.json", "effects"],
  ["addons/layout/contracts/layout.contract.json", "layout"],
  ["addons/markdown/contracts/markdown.contract.json", "markdown"],
  ["addons/qrcode/contracts/qrcode.contract.json", "qrcode"],
  ["addons/theming/contracts/theming.contract.json", "theming"],
  ["addons/thread/contracts/thread.contract.json", "thread"],
];
for (const [rel, name] of addonContracts) {
  const categoryId = taxonomy.components[name];
  if (!categoryId) throw new Error(`taxonomy.json missing addon ${name}`);
  const path = resolve(repoRoot, rel);
  writeJson(path, withCategory(JSON.parse(readFileSync(path, "utf8")), categoryId));
}

const storiesDir = join(packageDir, "stories");
for (const file of readdirSync(storiesDir).filter((name) => name.endsWith(".stories.ts"))) {
  const key = file.replace(/\.stories\.ts$/, "");
  const title = taxonomy.stories[key];
  if (!title) {
    if (key === "version") continue;
    throw new Error(`taxonomy.json missing story ${key}`);
  }
  const path = join(storiesDir, file);
  const source = readFileSync(path, "utf8");
  if (new RegExp(`title:\\s*"${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(source)) {
    continue;
  }
  const next = source.replace(/title:\s*"[^"]+"/, `title: "${title}"`);
  if (next === source) throw new Error(`could not update title in ${file}`);
  writeFileSync(path, next);
}

const showcasePath = resolve(repoRoot, "examples/showcase-v2/index.html");
let showcase = readFileSync(showcasePath, "utf8");
showcase = showcase.replace(
  /data-(component|addon)="([^"]+)" data-label="([^"]+)" data-group="[^"]*" data-eyebrow="[^"]*"/g,
  (match, kind, name, label) => {
    const categoryId = taxonomy.components[name];
    if (!categoryId) throw new Error(`taxonomy.json missing showcase ${kind} ${name}`);
    const category = categories.get(categoryId);
    return `data-${kind}="${name}" data-label="${label}" data-group="${category.label}" data-eyebrow="${category.eyebrow}"`;
  },
);
writeFileSync(showcasePath, showcase);

console.log("applied taxonomy to contracts, stories, and showcase");
