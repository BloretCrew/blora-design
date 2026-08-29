/**
 * Blora Design 2.0 Token Builder
 *
 * Spec §7.6: validate DTCG sources and generate deterministic CSS, JS,
 * TypeScript declarations, combined JSON, and documentation manifest.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const packageDir = resolve(scriptDir, "..");
const srcDir = join(packageDir, "src");
const outDir = join(packageDir, "generated");

const ALLOWED_TYPES = new Set([
  "border",
  "color",
  "dimension",
  "duration",
  "easing",
  "fontFamily",
  "number",
  "other",
  "shadow",
]);

const THEME_PRIMITIVE_VARIABLES = {
  accentNeutral: "--blora-color-coral-accent-neutral",
  accentNeutralSoft: "--blora-color-coral-accent-neutral-soft",
  accentSecondary: "--blora-color-coral-accent-secondary",
  background: "--blora-color-coral-background",
  bannerBg: "--blora-color-banner-background",
  bannerFg: "--blora-color-banner-foreground",
  borderSubtle: "--blora-color-coral-border-subtle",
  codeBg: "--blora-color-code-background",
  codeFg: "--blora-color-code-foreground",
  danger: "--blora-color-coral-danger",
  foreground: "--blora-color-coral-foreground",
  info: "--blora-color-coral-info",
  infoSoft: "--blora-color-coral-info-soft",
  onAccent: "--blora-color-coral-on-accent",
  onMedia: "--blora-color-coral-on-media",
  overlayDrawer: "--blora-color-coral-overlay-drawer",
  overlayModal: "--blora-color-coral-overlay-modal",
  primary: "--blora-color-coral-primary",
  primaryHover: "--blora-color-coral-primary-hover",
  primarySoft: "--blora-color-coral-primary-soft",
  success: "--blora-color-coral-success",
  successSoft: "--blora-color-coral-success-soft",
  support: "--blora-color-coral-support",
  surface1: "--blora-color-coral-surface-1",
  surface2: "--blora-color-coral-surface-2",
  surface3: "--blora-color-coral-surface-3",
  textDisabled: "--blora-color-coral-text-disabled",
  textEmphasis: "--blora-color-coral-text-emphasis",
  textMuted: "--blora-color-coral-text-muted",
  textStrong: "--blora-color-coral-text-strong",
  textSubtle: "--blora-color-coral-text-subtle",
  tooltipBg: "--blora-color-tooltip-background",
  tooltipFg: "--blora-color-tooltip-foreground",
  warning: "--blora-color-coral-warning",
};

function deepMerge(target, source) {
  if (source === null || source === undefined) return target;
  if (typeof source !== "object" || Array.isArray(source)) return source;
  if (typeof target !== "object" || target === null || Array.isArray(target)) return source;

  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    result[key] =
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? deepMerge(target[key] ?? {}, value)
        : value;
  }
  return result;
}

function flattenTokens(value, path = []) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return [];

  const tokens = [];
  for (const [key, child] of Object.entries(value)) {
    if (key.startsWith("$")) continue;
    if (typeof child !== "object" || child === null || Array.isArray(child)) continue;

    if (Object.hasOwn(child, "$type") || Object.hasOwn(child, "$value")) {
      tokens.push({ path: [...path, key], token: child });
    } else {
      tokens.push(...flattenTokens(child, [...path, key]));
    }
  }
  return tokens;
}

function toKebabCase(segment) {
  return String(segment)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([a-zA-Z])(\d+)/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function pathToCssVar(path) {
  return `--blora-${path.map(toKebabCase).join("-")}`;
}

function resolveReference(value) {
  if (typeof value !== "string") return value;
  return value.replace(/\{([^}]+)\}/g, (_, reference) => {
    return `var(${pathToCssVar(reference.split("."))})`;
  });
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function loadTokenDir(dir, excludedFiles = new Set()) {
  if (!existsSync(dir)) return {};

  let merged = {};
  for (const file of readdirSync(dir).sort()) {
    if (!file.endsWith(".json") || excludedFiles.has(file)) continue;
    merged = deepMerge(merged, loadJson(join(dir, file)));
  }
  return merged;
}

function validateTokens(tokens) {
  const errors = [];
  const flatTokens = flattenTokens(tokens);
  const byPath = new Map(flatTokens.map((entry) => [entry.path.join("."), entry.token]));

  for (const { path, token } of flatTokens) {
    const tokenPath = path.join(".");
    if (!Object.hasOwn(token, "$type")) errors.push(`${tokenPath}: missing $type`);
    if (!Object.hasOwn(token, "$value")) errors.push(`${tokenPath}: missing $value`);
    if (token.$type && !ALLOWED_TYPES.has(token.$type)) {
      errors.push(`${tokenPath}: unsupported $type "${token.$type}"`);
    }

    if (typeof token.$value === "string") {
      for (const match of token.$value.matchAll(/\{([^}]+)\}/g)) {
        if (!byPath.has(match[1])) errors.push(`${tokenPath}: unknown reference {${match[1]}}`);
      }
    }
  }

  const state = new Map();
  const stack = [];
  function visit(tokenPath) {
    const status = state.get(tokenPath);
    if (status === "done") return;
    if (status === "visiting") {
      const start = stack.indexOf(tokenPath);
      errors.push(`Circular reference: ${[...stack.slice(start), tokenPath].join(" -> ")}`);
      return;
    }

    state.set(tokenPath, "visiting");
    stack.push(tokenPath);
    const token = byPath.get(tokenPath);
    if (typeof token?.$value === "string") {
      for (const match of token.$value.matchAll(/\{([^}]+)\}/g)) {
        if (byPath.has(match[1])) visit(match[1]);
      }
    }
    stack.pop();
    state.set(tokenPath, "done");
  }

  for (const tokenPath of byPath.keys()) visit(tokenPath);
  return errors;
}

function tokenDeclarations(tokens, indent = "  ") {
  return flattenTokens(tokens).map(({ path, token }) => {
    return `${indent}${pathToCssVar(path)}: ${resolveReference(token.$value)};`;
  });
}

function generateLightCss(tokens) {
  return [
    "/* Generated by packages/tokens/scripts/build-tokens.mjs. Do not edit. */",
    ":root {",
    "  color-scheme: light;",
    ...tokenDeclarations(tokens),
    "}",
    "",
  ].join("\n");
}

function generateDarkCss(darkTokens) {
  const declarations = tokenDeclarations(darkTokens);
  const mediaDeclarations = tokenDeclarations(darkTokens, "    ");
  return [
    "/* Generated by packages/tokens/scripts/build-tokens.mjs. Do not edit. */",
    ':root[data-blora-color-scheme="dark"]:not([data-blora-theme]) {',
    "  color-scheme: dark;",
    ...declarations,
    "}",
    "",
    "@media (prefers-color-scheme: dark) {",
    "  :root:not([data-blora-color-scheme], [data-blora-theme]) {",
    "    color-scheme: dark;",
    ...mediaDeclarations,
    "  }",
    "}",
    "",
  ].join("\n");
}

const THEME_SEMANTIC_VARIABLES = {
  accentNeutral: "--blora-color-status-neutral",
  accentNeutralSoft: "--blora-color-status-neutral-soft",
  accentSecondary: "--blora-color-status-secondary",
  background: "--blora-color-surface-canvas",
  bannerBg: "--blora-color-banner-background",
  bannerFg: "--blora-color-banner-foreground",
  borderSubtle: "--blora-color-border-subtle",
  codeBg: "--blora-color-code-background",
  codeFg: "--blora-color-code-foreground",
  danger: "--blora-color-status-danger",
  foreground: "--blora-color-text-secondary",
  info: "--blora-color-status-info",
  infoSoft: "--blora-color-status-info-soft",
  onAccent: "--blora-color-text-on-accent",
  onMedia: "--blora-color-text-on-media",
  overlayDrawer: "--blora-color-overlay-drawer",
  overlayModal: "--blora-color-overlay-modal",
  primary: "--blora-color-action-primary-default",
  primaryHover: "--blora-color-action-primary-hover",
  primarySoft: "--blora-color-action-primary-soft",
  success: "--blora-color-status-success",
  successSoft: "--blora-color-status-success-soft",
  support: "--blora-color-status-support",
  surface1: "--blora-color-surface-default",
  surface2: "--blora-color-surface-raised",
  surface3: "--blora-color-surface-sunken",
  textDisabled: "--blora-color-text-disabled",
  textEmphasis: "--blora-color-text-emphasis",
  textMuted: "--blora-color-text-muted",
  textStrong: "--blora-color-text-primary",
  textSubtle: "--blora-color-text-subtle",
  tooltipBg: "--blora-color-tooltip-background",
  tooltipFg: "--blora-color-tooltip-foreground",
  warning: "--blora-color-status-warning",
};

function themeDeclarations(modeData, includeSemantic = false) {
  const values = modeData?.color?.coral ?? {};
  const lines = [];
  for (const [key, token] of Object.entries(values)) {
    const primitiveVariable = THEME_PRIMITIVE_VARIABLES[key];
    if (!primitiveVariable) throw new Error(`Theme token key has no CSS mapping: ${key}`);
    lines.push(`  ${primitiveVariable}: ${token.$value};`);

    const semanticVariable = THEME_SEMANTIC_VARIABLES[key];
    if (includeSemantic && semanticVariable) {
      lines.push(`  ${semanticVariable}: ${token.$value};`);
    }
  }
  return lines;
}

function generateThemesCss(themesDir) {
  const lines = ["/* Generated theme overrides. Do not edit. */", ""];
  for (const file of readdirSync(themesDir)
    .filter((name) => name.endsWith(".json"))
    .sort()) {
    const themeName = file.replace(".tokens.json", "");
    const theme = loadJson(join(themesDir, file));

    if (theme.light) {
      lines.push(
        `:root[data-blora-theme="${themeName}"] {`,
        ...themeDeclarations(theme.light),
        "}",
        "",
      );
    }
    if (theme.dark) {
      lines.push(
        `:root[data-blora-color-scheme="dark"][data-blora-theme="${themeName}"] {`,
        ...themeDeclarations(theme.dark, true),
        "}",
        "",
      );
      lines.push(
        "@media (prefers-color-scheme: dark) {",
        `  :root:not([data-blora-color-scheme])[data-blora-theme="${themeName}"] {`,
        ...themeDeclarations(theme.dark).map((line) => `  ${line}`),
        "  }",
        "}",
        "",
      );
    }
  }
  return lines.join("\n");
}

function generateJavaScript(tokens) {
  const entries = flattenTokens(tokens).map(({ path }) => {
    return `  ${JSON.stringify(path.join("."))}: ${JSON.stringify(pathToCssVar(path))},`;
  });

  const groups = new Map();
  for (const { path } of flattenTokens(tokens)) {
    const group = path[0];
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(pathToCssVar(path));
  }

  const groupLines = [];
  for (const [group, variables] of groups) {
    groupLines.push(`  ${JSON.stringify(group)}: [`);
    for (const variable of variables) groupLines.push(`    ${JSON.stringify(variable)},`);
    groupLines.push("  ],");
  }

  return [
    "// Generated by packages/tokens/scripts/build-tokens.mjs. Do not edit.",
    "export const tokens = {",
    ...entries,
    "};",
    "",
    "export const tokenGroups = {",
    ...groupLines,
    "};",
    "",
    "export default tokens;",
    "",
  ].join("\n");
}

function generateDeclarations(tokens) {
  const names = flattenTokens(tokens).map(({ path }) => JSON.stringify(path.join(".")));
  const union = names.length > 0 ? names.join(" | ") : "never";
  return [
    "// Generated by packages/tokens/scripts/build-tokens.mjs. Do not edit.",
    `export type TokenName = ${union};`,
    "export declare const tokens: Readonly<Record<TokenName, string>>;",
    "export declare const tokenGroups: Readonly<Record<string, readonly string[]>>;",
    "export default tokens;",
    "",
  ].join("\n");
}

function generateTypeScript(tokens) {
  return generateJavaScript(tokens)
    .replace("export const tokens = {", "export const tokens = {")
    .replace("\n};\n\nexport const tokenGroups", "\n} as const;\n\nexport const tokenGroups")
    .replace(
      "\n};\n\nexport default tokens;",
      "\n} as const;\n\nexport type TokenName = keyof typeof tokens;\n\nexport default tokens;",
    );
}

function generateManifest(lightTokens, darkTokens) {
  return JSON.stringify(
    {
      schemaVersion: "1.0",
      tokens: flattenTokens(lightTokens).map(({ path, token }) => ({
        name: pathToCssVar(path),
        path: path.join("."),
        type: token.$type,
        value: token.$value,
        ...(token.$description ? { description: token.$description } : {}),
      })),
      darkOverrides: flattenTokens(darkTokens).map(({ path, token }) => ({
        name: pathToCssVar(path),
        path: path.join("."),
        type: token.$type,
        value: token.$value,
      })),
    },
    null,
    2,
  );
}

export function buildTokens() {
  const primitive = loadTokenDir(join(srcDir, "primitive"));
  const semanticDir = join(srcDir, "semantic");
  const semanticLight = loadTokenDir(semanticDir, new Set(["color-dark.tokens.json"]));
  const darkOverrides = loadJson(join(semanticDir, "color-dark.tokens.json"));
  const lightTokens = deepMerge(primitive, semanticLight);

  const validationErrors = validateTokens(lightTokens);
  if (validationErrors.length > 0) {
    throw new Error(
      `Token validation failed:\n${validationErrors.map((error) => `- ${error}`).join("\n")}`,
    );
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "tokens.css"), generateLightCss(lightTokens));
  writeFileSync(join(outDir, "tokens.dark.css"), generateDarkCss(darkOverrides));
  writeFileSync(join(outDir, "tokens.themes.css"), generateThemesCss(join(srcDir, "themes")));
  writeFileSync(join(outDir, "tokens.js"), generateJavaScript(lightTokens));
  writeFileSync(join(outDir, "tokens.d.ts"), generateDeclarations(lightTokens));
  writeFileSync(join(outDir, "tokens.ts"), generateTypeScript(lightTokens));
  writeFileSync(join(outDir, "token-manifest.json"), generateManifest(lightTokens, darkOverrides));
  writeFileSync(
    join(outDir, "tokens.json"),
    JSON.stringify({ light: lightTokens, darkOverrides }, null, 2),
  );

  return {
    darkCount: flattenTokens(darkOverrides).length,
    lightCount: flattenTokens(lightTokens).length,
  };
}

const isDirectRun =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isDirectRun) {
  const result = buildTokens();
  console.log(
    `[build:tokens] Generated ${result.lightCount} light tokens and ${result.darkCount} dark overrides in ${relative(process.cwd(), outDir)}.`,
  );
}
