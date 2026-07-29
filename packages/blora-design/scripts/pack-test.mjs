/**
 * Pack & test fixture: builds the package, creates a tarball,
 * installs it in a temp directory, and runs import tests.
 *
 * Spec §20.6 requires: npm pack, install tgz, ESM import, CSS import,
 * Node SSR import, TypeScript compile, check package files.
 */
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { execSync } from "node:child_process";

const pkgDir = resolve(import.meta.dirname, "..");
const pkgName = "@bloret-crew/blora-design";

console.log("[pack:test] Building package...");
execSync("pnpm build", { cwd: pkgDir, stdio: "inherit" });

console.log("[pack:test] Packing...");
execSync("pnpm pack", { cwd: pkgDir, stdio: "inherit" });

// Find the tgz
const { readdirSync } = await import("node:fs");
const tgz = readdirSync(pkgDir).find(
  (f) => f.startsWith("bloret-crew-blora-design-") && f.endsWith(".tgz"),
);
if (!tgz) {
  console.error("[pack:test] No tarball found after pnpm pack");
  process.exit(1);
}
const tgzPath = join(pkgDir, tgz);

// Create temp fixture
const tmpDir = mkdtempSync(join(tmpdir(), "blora-packtest-"));
console.log(`[pack:test] Using temp dir: ${tmpDir}`);

try {
  // Install the tarball
  console.log(`[pack:test] Installing ${tgz}...`);
  execSync(`npm install ${tgzPath}`, { cwd: tmpDir, stdio: "inherit" });

  // ESM import test
  const esmDir = join(tmpDir, "esm-test");
  mkdirSync(esmDir, { recursive: true });
  writeFileSync(
    join(esmDir, "test.mjs"),
    `import { VERSION, isBrowser } from "${pkgName}";\n` +
      `if (VERSION !== "2.0.0-alpha.0") throw new Error("Version mismatch: " + VERSION);\n` +
      `if (typeof isBrowser !== "function") throw new Error("isBrowser is not a function");\n` +
      `console.log("[pack:test] ESM import OK, version:", VERSION);\n`,
  );
  execSync("node test.mjs", { cwd: esmDir, stdio: "inherit" });

  // Node SSR import test (should not throw without window/document)
  const ssrDir = join(tmpDir, "ssr-test");
  mkdirSync(ssrDir, { recursive: true });
  writeFileSync(
    join(ssrDir, "test.mjs"),
    `import { VERSION } from "${pkgName}";\n` +
      `if (VERSION !== "2.0.0-alpha.0") throw new Error("Version mismatch in SSR: " + VERSION);\n` +
      `console.log("[pack:test] SSR import OK, version:", VERSION);\n`,
  );
  execSync("node test.mjs", { cwd: ssrDir, stdio: "inherit" });

  // Check that dist/ files are present in the tarball
  console.log("[pack:test] Checking tarball contents...");
  const tarList = execSync(`npm pack --dry-run --json`, {
    cwd: pkgDir,
    encoding: "utf-8",
  });
  const files = JSON.parse(tarList)[0].files.map((f) => f.path);
  const requiredFiles = ["dist/index.js", "dist/index.d.ts"];
  for (const req of requiredFiles) {
    if (!files.includes(req)) {
      throw new Error(`[pack:test] Missing required file in tarball: ${req}`);
    }
  }
  console.log("[pack:test] All required files present in tarball.");
  console.log("[pack:test] All pack tests passed.");
} finally {
  // Cleanup
  rmSync(tmpDir, { recursive: true, force: true });
  // Remove the tgz from pkg dir
  const tgzFullPath = join(pkgDir, tgz);
  if (existsSync(tgzFullPath)) {
    rmSync(tgzFullPath);
  }
}
