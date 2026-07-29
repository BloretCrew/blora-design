/**
 * Pack fixture for the published main package.
 * Builds, packs, installs the tarball in isolation, and checks ESM, SSR,
 * CSS subpaths, TypeScript declarations, and required package files.
 */
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync, execSync } from "node:child_process";

const packageDir = resolve(import.meta.dirname, "..");
const typescriptCli = resolve(
  packageDir,
  "..",
  "..",
  "node_modules",
  "typescript",
  "lib",
  "tsc.js",
);
const packageJson = JSON.parse(readFileSync(join(packageDir, "package.json"), "utf8"));
const packageName = packageJson.name;
const packageVersion = packageJson.version;

console.log("[pack:test] Building package...");
execSync("pnpm build", { cwd: packageDir, stdio: "inherit" });

console.log("[pack:test] Packing...");
execSync("pnpm pack", { cwd: packageDir, stdio: "inherit" });

const tarballName = readdirSync(packageDir).find(
  (file) => file.startsWith("bloret-crew-blora-design-") && file.endsWith(".tgz"),
);
if (!tarballName) throw new Error("[pack:test] No tarball found after pnpm pack");

const tarballPath = join(packageDir, tarballName);
const fixtureDir = mkdtempSync(join(tmpdir(), "blora-packtest-"));

try {
  writeFileSync(
    join(fixtureDir, "package.json"),
    JSON.stringify({ name: "blora-pack-fixture", private: true, type: "module" }, null, 2),
  );
  console.log(`[pack:test] Installing ${tarballName}...`);
  execSync(`npm install --ignore-scripts ${JSON.stringify(tarballPath)}`, {
    cwd: fixtureDir,
    stdio: "inherit",
  });

  writeFileSync(
    join(fixtureDir, "test.mjs"),
    [
      `import { VERSION, isBrowser } from ${JSON.stringify(packageName)};`,
      `if (VERSION !== ${JSON.stringify(packageVersion)}) throw new Error("Version mismatch: " + VERSION);`,
      `if (isBrowser() !== false) throw new Error("SSR import unexpectedly detected a browser");`,
      `console.log("[pack:test] ESM and SSR import OK:", VERSION);`,
      "",
    ].join("\n"),
  );
  execFileSync("node", ["test.mjs"], { cwd: fixtureDir, stdio: "inherit" });

  const packageInstallDir = join(fixtureDir, "node_modules", "@bloret-crew", "blora-design");
  for (const file of [
    "dist/index.js",
    "dist/index.d.ts",
    "dist/tokens.css",
    "dist/tokens.dark.css",
    "dist/tokens.themes.css",
    "dist/token-manifest.json",
  ]) {
    if (!existsSync(join(packageInstallDir, file))) {
      throw new Error(`[pack:test] Installed package is missing ${file}`);
    }
  }

  const css = readFileSync(join(packageInstallDir, "dist", "tokens.css"), "utf8");
  if (!css.includes("--blora-color-surface-canvas")) {
    throw new Error("[pack:test] tokens.css is missing semantic tokens");
  }

  const typeFixture = join(fixtureDir, "type-fixture");
  mkdirSync(typeFixture);
  writeFileSync(
    join(typeFixture, "index.ts"),
    `import { VERSION } from ${JSON.stringify(packageName)};\nconst version: string = VERSION;\nconsole.log(version);\n`,
  );
  writeFileSync(
    join(typeFixture, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          module: "ESNext",
          moduleResolution: "Bundler",
          noEmit: true,
          strict: true,
          target: "ES2022",
        },
        include: ["index.ts"],
      },
      null,
      2,
    ),
  );
  execFileSync(process.execPath, [typescriptCli, "-p", "tsconfig.json"], {
    cwd: typeFixture,
    stdio: "inherit",
  });

  console.log("[pack:test] All package fixture checks passed.");
} finally {
  rmSync(fixtureDir, { recursive: true, force: true });
  rmSync(tarballPath, { force: true });
}
