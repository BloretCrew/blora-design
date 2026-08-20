/**
 * Generate the official Lucide icon data table from lucide-static (ISC).
 * Run via `pnpm --filter @bloret-crew/blora-design exec node scripts/gen-icons.mjs`
 * after bumping lucide-static.
 *
 * The output is committed so the runtime keeps zero dependencies. Icon names
 * here are the stable public Blora names; each maps to the canonical Lucide
 * glyph whose paths are copied verbatim from lucide-static.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");
const lucideRoot = resolve(packageRoot, "node_modules", "lucide-static", "icons");
const outFile = resolve(packageRoot, "src", "core", "icons.data.ts");

// Stable public Blora name -> canonical Lucide icon (SVG file name).
const ICON_MAP = {
  "arrow-up": "arrow-up",
  ban: "ban",
  calendar: "calendar",
  camera: "camera",
  chart: "chart-bar",
  check: "check",
  "chevron-down": "chevron-down",
  "chevron-left": "chevron-left",
  "chevron-right": "chevron-right",
  "circle-alert": "circle-alert",
  "circle-check": "circle-check",
  clock: "clock",
  close: "x",
  copy: "copy",
  document: "file",
  "document-add": "file-plus",
  ellipsis: "ellipsis",
  eye: "eye",
  flame: "flame",
  folder: "folder",
  grip: "grip",
  heart: "heart",
  home: "home",
  image: "image",
  inbox: "inbox",
  info: "info",
  key: "key",
  mail: "mail",
  menu: "menu",
  message: "message-square",
  mic: "mic",
  minus: "minus",
  moon: "moon",
  palette: "palette",
  pencil: "pencil",
  phone: "phone",
  plus: "plus",
  "arrow-down-up": "arrow-down-up",
  "arrow-down": "arrow-down",
  search: "search",
  settings: "settings",
  sparkles: "sparkles",
  share: "share",
  smile: "smile",
  star: "star",
  sun: "sun",
  "thumbs-up": "thumbs-up",
  trash: "trash",
  "triangle-alert": "triangle-alert",
  upload: "upload",
  user: "user",
};

/**
 * Parse a lucide-static SVG into a list of { tag, attrs } nodes.
 * Supported tags mirror createBloraIcon's builder (circle | path | rect).
 */
function parseSvg(name, file) {
  const src = readFileSync(file, "utf8");
  const nodes = [];
  const re = /<(circle|path|rect)\b([^>]*?)\/>/g;
  let m;
  while ((m = re.exec(src))) {
    const tag = m[1];
    const attrs = {};
    for (const attr of m[2].matchAll(/([a-zA-Z-]+)="([^"]*)"/g)) {
      attrs[attr[1]] = attr[2];
    }
    // Keep only presentation-relevant attributes.
    const keep = {};
    for (const k of [
      "d",
      "cx",
      "cy",
      "r",
      "x",
      "y",
      "width",
      "height",
      "rx",
      "fill",
      "fill-rule",
    ]) {
      if (attrs[k] !== undefined) keep[k] = attrs[k];
    }
    nodes.push({ tag, attrs: keep });
  }
  if (nodes.length === 0) {
    throw new Error(`No drawable nodes parsed from ${name} (${file})`);
  }
  return nodes;
}

const lines = [
  "/* Generated from lucide-static (ISC) — do not edit by hand.",
  "   Run `node scripts/gen-icons.mjs` to regenerate after bumping lucide-static. */",
  "",
  "export interface BloraIconNode {",
  '  tag: "circle" | "path" | "rect";',
  "  attrs: Record<string, string>;",
  "}",
  "",
  "export const BLORA_ICON_DATA: Record<string, BloraIconNode[]> = {",
];

const sorted = Object.keys(ICON_MAP).sort();
for (const name of sorted) {
  const file = join(lucideRoot, `${ICON_MAP[name]}.svg`);
  if (!existsSync(file)) {
    throw new Error(`Missing lucide icon ${ICON_MAP[name]} for ${name}`);
  }
  const nodes = parseSvg(name, file);
  const nodeStr = nodes
    .map((n) => `{ tag: "${n.tag}", attrs: ${JSON.stringify(n.attrs)} }`)
    .join(", ");
  lines.push(`  ${JSON.stringify(name)}: [${nodeStr}],`);
}

lines.push("};", "");
writeFileSync(outFile, lines.join("\n"));
console.log(`[gen-icons] wrote ${outFile} (${sorted.length} icons from lucide-static)`);
