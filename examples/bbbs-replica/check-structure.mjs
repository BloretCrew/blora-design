import { access, readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(root, "../..");
const pages = ["index.html", "thread.html"];
const localResources = new Set();

for (const page of pages) {
  const pagePath = resolve(root, page);
  await access(pagePath);
  const source = await readFile(pagePath, "utf8");

  if (
    /(?:href|src|from|import\s*\()\s*[=(]?\s*["'][^"']*\/(?:packages\/blora-design|addons\/[^/]+)\/src\//i.test(
      source,
    )
  ) {
    throw new Error(`${page} 引用了私有 /src/ 路径`);
  }

  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const resource = match[1];
    if (/^(?:https?:|data:|#)/.test(resource)) continue;
    localResources.add(resolve(root, resource));
  }
}

for (const resource of localResources) await access(resource);

const sharedJs = await readFile(resolve(root, "shared.js"), "utf8");
if (
  /(?:href|src|from|import\s*\()\s*[=(]?\s*["'][^"']*\/(?:packages\/blora-design|addons\/[^/]+)\/src\//i.test(
    sharedJs,
  )
) {
  throw new Error("shared.js 引用了私有 /src/ 路径");
}

const tokenManifest = JSON.parse(
  await readFile(resolve(repositoryRoot, "packages/tokens/generated/token-manifest.json"), "utf8"),
);
const registeredVariables = new Set(
  [...tokenManifest.tokens, ...tokenManifest.darkOverrides].map((token) => token.name),
);
for (const contractsDir of [
  "packages/blora-design/contracts",
  "addons/layout/contracts",
  "addons/theming/contracts",
  "addons/thread/contracts",
]) {
  const absolute = resolve(repositoryRoot, contractsDir);
  for (const file of (await readdir(absolute)).filter((name) => name.endsWith(".contract.json"))) {
    const contract = JSON.parse(await readFile(resolve(absolute, file), "utf8"));
    for (const property of contract.cssProperties ?? []) registeredVariables.add(property);
    for (const customElement of Object.values(contract.customElements ?? {})) {
      for (const property of customElement.cssProperties ?? []) registeredVariables.add(property);
    }
  }
}

const sharedCss = await readFile(resolve(root, "shared.css"), "utf8");
const usedVariables = new Set(
  [...sharedCss.matchAll(/var\((--blora-[a-z0-9-]+)/gi)].map((match) => match[1]),
);
const unregisteredVariables = [...usedVariables].filter(
  (variable) => !registeredVariables.has(variable),
);
if (unregisteredVariables.length) {
  throw new Error(`shared.css 使用未登记的 Blora 变量：${unregisteredVariables.join(", ")}`);
}

process.stdout.write(
  `BBBS replica structure OK: ${pages.length} pages, ${localResources.size} local resources, ${usedVariables.size} registered Blora variables.\n`,
);
