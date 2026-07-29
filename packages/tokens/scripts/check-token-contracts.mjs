import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const repositoryRoot = resolve(packageDir, "..", "..");
const generatedDir = join(packageDir, "generated");
const componentSourceDir = join(repositoryRoot, "packages", "blora-design", "src");
const mappingPath = join(repositoryRoot, "docs", "migration", "token-map-v1-v2.csv");
const legacyCssPath = join(repositoryRoot, "legacy", "v1", "blora.css");

const requiredLightTokens = [
  "color.surface.canvas",
  "color.surface.default",
  "color.surface.raised",
  "color.surface.sunken",
  "color.text.primary",
  "color.text.secondary",
  "color.text.disabled",
  "color.action.primary.default",
  "color.action.primary.hover",
  "color.status.danger",
  "color.status.info",
  "color.status.success",
  "color.status.warning",
  "color.overlay.modal",
  "color.overlay.drawer",
  "color.code.background",
  "color.code.foreground",
];

const requiredDarkTokens = [
  "color.surface.canvas",
  "color.surface.default",
  "color.surface.raised",
  "color.surface.sunken",
  "color.text.primary",
  "color.text.secondary",
  "color.text.disabled",
  "color.action.primary.default",
  "color.action.primary.hover",
  "color.status.danger",
  "color.status.info",
  "color.status.success",
  "color.status.warning",
  "color.overlay.modal",
  "color.overlay.drawer",
  "color.code.background",
  "color.code.foreground",
  "shadow.1",
  "shadow.2",
  "shadow.3",
  "shadow.4",
];

function walkFiles(dir) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(path));
    else files.push(path);
  }
  return files;
}

function extractRootTokenNames(css) {
  const rootBlock = css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1];
  if (!rootBlock) throw new Error("Could not find the v1 :root token block");
  return [...rootBlock.matchAll(/(--blora-[a-z0-9-]+)\s*:/gi)].map((match) => match[1]);
}

function parseCsv(csv) {
  const [header, ...rows] = csv.trim().split(/\r?\n/);
  const columns = header.split(",");
  return rows.map((row) => {
    const values = row.split(",");
    return Object.fromEntries(columns.map((column, index) => [column, values[index]]));
  });
}

export function checkTokenContracts() {
  const errors = [];
  const manifest = JSON.parse(readFileSync(join(generatedDir, "token-manifest.json"), "utf8"));
  const lightPaths = new Set(manifest.tokens.map((token) => token.path));
  const darkPaths = new Set(manifest.darkOverrides.map((token) => token.path));
  const registeredVariables = new Set(manifest.tokens.map((token) => token.name));
  for (const token of manifest.darkOverrides) registeredVariables.add(token.name);

  // Load component contract declared CSS properties (component-scoped variables)
  const contractsDir = join(repositoryRoot, "packages", "blora-design", "contracts");
  if (existsSync(contractsDir)) {
    for (const file of readdirSync(contractsDir).filter((f) => f.endsWith(".contract.json"))) {
      const contract = JSON.parse(readFileSync(join(contractsDir, file), "utf8"));
      for (const prop of contract.cssProperties ?? []) {
        registeredVariables.add(prop);
      }
    }
  }

  for (const path of requiredLightTokens) {
    if (!lightPaths.has(path)) errors.push(`Missing required light semantic token: ${path}`);
  }
  for (const path of requiredDarkTokens) {
    if (!darkPaths.has(path)) errors.push(`Missing required dark semantic override: ${path}`);
  }

  const mappings = parseCsv(readFileSync(mappingPath, "utf8"));
  const mappingByV1 = new Map(mappings.map((mapping) => [mapping.v1_token, mapping]));
  const legacyTokenNames = extractRootTokenNames(readFileSync(legacyCssPath, "utf8"));
  for (const legacyName of legacyTokenNames) {
    const mapping = mappingByV1.get(legacyName);
    if (!mapping) {
      errors.push(`Missing v1 token mapping: ${legacyName}`);
      continue;
    }
    if (!registeredVariables.has(mapping.v2_token)) {
      errors.push(`v1 mapping target is not generated: ${legacyName} -> ${mapping.v2_token}`);
    }
  }

  for (const file of walkFiles(componentSourceDir).filter((path) => extname(path) === ".css")) {
    const css = readFileSync(file, "utf8");
    for (const match of css.matchAll(/var\((--blora-[a-z0-9-]+)/gi)) {
      if (!registeredVariables.has(match[1])) {
        errors.push(`${file}: unregistered token variable ${match[1]}`);
      }
    }
    for (const match of css.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi)) {
      errors.push(`${file}: direct color value is forbidden (${match[0]})`);
    }
    for (const match of css.matchAll(/z-index\s*:\s*([^;]+)/gi)) {
      if (!/^var\(--blora-z-[a-z0-9-]+\)$/.test(match[1].trim()) && match[1].trim() !== "auto") {
        errors.push(`${file}: unregistered z-index value ${match[1].trim()}`);
      }
    }
  }

  return errors;
}

const isDirectRun =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isDirectRun) {
  const errors = checkTokenContracts();
  if (errors.length > 0) {
    console.error(`[check-token-contracts] ${errors.length} error(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  console.log(
    "[check-token-contracts] Semantic coverage, v1 mapping, and component CSS checks passed.",
  );
}
