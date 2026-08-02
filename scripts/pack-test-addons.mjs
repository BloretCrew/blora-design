/**
 * Pack + install fixture for each public add-on package.
 * Ensures CSS subpath exports exist and ESM import works with peer core.
 */
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const addons = [
  "markdown",
  "thread",
  "qrcode",
  "effects",
  "layout",
  "theming",
];

console.log("[pack:test:addons] Building core + add-ons...");
execSync("pnpm --filter @bloret-crew/blora-design run build", {
  cwd: root,
  stdio: "inherit",
});
for (const name of addons) {
  execSync(`pnpm --filter @bloret-crew/blora-design-${name} run build`, {
    cwd: root,
    stdio: "inherit",
  });
}

// Pack core for peer dependency
const coreDir = join(root, "packages", "blora-design");
execSync("pnpm pack", { cwd: coreDir, stdio: "inherit" });
const coreTarball = readdirSync(coreDir).find(
  (f) => f.startsWith("bloret-crew-blora-design-") && f.endsWith(".tgz") && !f.includes("markdown"),
);
if (!coreTarball) throw new Error("[pack:test:addons] core tarball missing");
const coreTarballPath = join(coreDir, coreTarball);

let failed = 0;

for (const name of addons) {
  const pkgDir = join(root, "addons", name);
  const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
  console.log(`[pack:test:addons] ${pkg.name}...`);

  try {
    execSync("pnpm pack", { cwd: pkgDir, stdio: "inherit" });
    const tarball = readdirSync(pkgDir).find(
      (f) => f.startsWith("bloret-crew-") && f.endsWith(".tgz"),
    );
    if (!tarball) throw new Error("no tarball");
    const tarballPath = join(pkgDir, tarball);
    const fixtureDir = mkdtempSync(join(tmpdir(), `blora-addon-${name}-`));

    try {
      writeFileSync(
        join(fixtureDir, "package.json"),
        JSON.stringify(
          {
            name: `blora-addon-fixture-${name}`,
            private: true,
            type: "module",
          },
          null,
          2,
        ),
      );
      // Install core peer then add-on
      execSync(`npm install --ignore-scripts ${JSON.stringify(coreTarballPath)}`, {
        cwd: fixtureDir,
        stdio: "inherit",
      });
      execSync(`npm install --ignore-scripts ${JSON.stringify(tarballPath)}`, {
        cwd: fixtureDir,
        stdio: "inherit",
      });

      const installRoot = join(fixtureDir, "node_modules", ...pkg.name.split("/"));
      const installed = JSON.parse(readFileSync(join(installRoot, "package.json"), "utf8"));
      for (const [key, target] of Object.entries(installed.exports || {})) {
        if (key === "./package.json") continue;
        const paths = typeof target === "string" ? [target] : Object.values(target).filter((v) => typeof v === "string");
        for (const rel of paths) {
          const abs = join(installRoot, rel.replace(/^\.\//, ""));
          if (!existsSync(abs)) {
            throw new Error(`export ${key} -> ${rel} missing`);
          }
        }
      }

      writeFileSync(
        join(fixtureDir, "import.mjs"),
        `import * as m from ${JSON.stringify(pkg.name)};\nconsole.log("[pack:test:addons] import OK", Object.keys(m).slice(0, 5).join(","));\n`,
      );
      execSync("node import.mjs", { cwd: fixtureDir, stdio: "inherit" });
      console.log(`[pack:test:addons] ${pkg.name} OK`);
    } finally {
      rmSync(fixtureDir, { recursive: true, force: true });
      rmSync(tarballPath, { force: true });
    }
  } catch (e) {
    console.error(`[pack:test:addons] ${pkg.name} FAILED`, e);
    failed += 1;
  }
}

rmSync(coreTarballPath, { force: true });

if (failed) {
  console.error(`[pack:test:addons] ${failed} package(s) failed`);
  process.exit(1);
}
console.log("[pack:test:addons] All add-on pack fixtures passed.");
