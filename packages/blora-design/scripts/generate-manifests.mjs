/**
 * Generate component-manifest.json + custom-elements.json into dist/ (and package root copies for tooling).
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const packageDir = resolve(import.meta.dirname, "..");
const contractsDir = join(packageDir, "contracts");
const distDir = join(packageDir, "dist");
const packageJson = JSON.parse(readFileSync(join(packageDir, "package.json"), "utf8"));

const contracts = readdirSync(contractsDir)
  .filter((f) => f.endsWith(".contract.json"))
  .map((f) => JSON.parse(readFileSync(join(contractsDir, f), "utf8")))
  .sort((a, b) => String(a.name).localeCompare(String(b.name)));

const manifest = {
  name: packageJson.name,
  version: packageJson.version,
  generatedAt: new Date().toISOString(),
  components: contracts.map((c) => ({
    name: c.name,
    status: c.status ?? "beta",
    kind: c.kind ?? "unknown",
    requiresJavaScript: !!c.requiresJavaScript,
    formAssociated: !!c.formAssociated,
    cssExport: `./components/${c.name}.css`,
    contract: `contracts/${c.name}.contract.json`,
  })),
  jsSubpaths: ["./button", "./select", "./dialog", "./table", "./toast", "./auto", "./compat/v1"],
  notes:
    "status=stable in contracts is aspirational until Phase 10 DoD; see docs/refactor/contract-stability.md",
};

/** Minimal Custom Elements Manifest for shipped CE */
const cem = {
  schemaVersion: "1.0.0",
  readme: "",
  modules: [
    {
      kind: "javascript-module",
      path: "dist/components/select/index.js",
      declarations: [
        {
          kind: "class",
          name: "BloraSelect",
          tagName: "blora-select",
          customElement: true,
          description: "Form-associated select combobox",
          superclass: { name: "BloraElement", module: "dist/index.js" },
        },
      ],
      exports: [
        { kind: "js", name: "BloraSelect", declaration: { name: "BloraSelect" } },
        { kind: "js", name: "defineBloraSelect", declaration: { name: "defineBloraSelect" } },
        {
          kind: "custom-element-definition",
          name: "blora-select",
          declaration: { name: "BloraSelect" },
        },
      ],
    },
    {
      kind: "javascript-module",
      path: "dist/components/dialog/index.js",
      declarations: [
        {
          kind: "class",
          name: "BloraDialog",
          tagName: "blora-dialog",
          customElement: true,
          description: "Modal dialog custom element",
          superclass: { name: "BloraElement", module: "dist/index.js" },
        },
      ],
      exports: [
        { kind: "js", name: "BloraDialog", declaration: { name: "BloraDialog" } },
        { kind: "js", name: "defineBloraDialog", declaration: { name: "defineBloraDialog" } },
        {
          kind: "custom-element-definition",
          name: "blora-dialog",
          declaration: { name: "BloraDialog" },
        },
      ],
    },
  ],
};

/** Public API snapshot from package exports + main named re-exports (static) */
const indexSrc = readFileSync(join(packageDir, "src/index.ts"), "utf8");
const namedExports = [...indexSrc.matchAll(/export\s*\{([^}]+)\}/g)].flatMap((m) =>
  m[1]
    .split(",")
    .map((s) =>
      s
        .trim()
        .split(/\s+as\s+/)
        .pop()
        .replace(/^type\s+/, "")
        .trim(),
    )
    .filter(Boolean),
);

const apiSnapshot = {
  version: packageJson.version,
  generatedAt: new Date().toISOString(),
  packageExports: Object.keys(packageJson.exports || {}).sort(),
  mainNamedExports: [...new Set(namedExports)].sort(),
  customElements: ["blora-select", "blora-dialog"],
};

if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

writeFileSync(join(distDir, "component-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
writeFileSync(join(distDir, "custom-elements.json"), JSON.stringify(cem, null, 2) + "\n");
writeFileSync(join(distDir, "api-snapshot.json"), JSON.stringify(apiSnapshot, null, 2) + "\n");

// Package-root copies for tooling / exports
writeFileSync(
  join(packageDir, "component-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
writeFileSync(join(packageDir, "custom-elements.json"), JSON.stringify(cem, null, 2) + "\n");

console.log(
  `[generate-manifests] ${manifest.components.length} components; CE modules: ${cem.modules.length}; API names: ${apiSnapshot.mainNamedExports.length}`,
);
