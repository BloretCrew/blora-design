/** Structural gates for the component-catalog prototype in examples/showcase-v2. */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../../..");
const showcasePath = resolve(repoRoot, "examples/showcase-v2/index.html");
const distCss = resolve(repoRoot, "packages/blora-design/dist/blora.css");
const distDarkCss = resolve(repoRoot, "packages/blora-design/dist/tokens.dark.css");
const distJs = resolve(repoRoot, "packages/blora-design/dist/blora.global.js");
const sourceRoot = resolve(repoRoot, "packages/blora-design/src");
const addonNames = ["effects", "layout", "markdown", "qrcode", "theming", "thread"] as const;
const themingSourceRoot = resolve(repoRoot, "addons/theming/src");
const layoutSourceRoot = resolve(repoRoot, "addons/layout/src");
const addonSourceRoots = addonNames.map((name) => resolve(repoRoot, `addons/${name}/src`));
const layoutDistJs = resolve(repoRoot, "addons/layout/dist/layout.global.js");
const layoutDistCss = resolve(repoRoot, "addons/layout/dist/layout.css");
const themingDistJs = resolve(repoRoot, "addons/theming/dist/theming.global.js");
const themingDistCss = resolve(repoRoot, "addons/theming/dist/theming.css");
const contractsRoot = resolve(repoRoot, "packages/blora-design/contracts");
const remainingWorkPath = resolve(repoRoot, "docs/refactor/remaining-work.md");
const manifestPath = resolve(repoRoot, "packages/blora-design/component-manifest.json");

function collectCssClasses(directory: string, classes = new Set<string>()): Set<string> {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) collectCssClasses(path, classes);
    else if (entry.isFile() && entry.name.endsWith(".css")) {
      const css = readFileSync(path, "utf8");
      for (const match of css.matchAll(/\.((?:blora-)[a-z0-9_-]+)/gi)) classes.add(match[1]!);
    }
  }
  return classes;
}

function collectLoadedCssClasses(
  entryPaths: string[],
  classes = new Set<string>(),
  visited = new Set<string>(),
): Set<string> {
  for (const entryPath of entryPaths) {
    const path = resolve(entryPath);
    if (visited.has(path) || !existsSync(path)) continue;
    visited.add(path);
    const css = readFileSync(path, "utf8");
    for (const match of css.matchAll(/\.((?:blora-)[a-z0-9_-]+)/gi)) classes.add(match[1]!);
    const imports = [...css.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']/gi)]
      .map((match) => match[1]!)
      .filter((specifier) => !/^(?:https?:|data:)/i.test(specifier))
      .map((specifier) => resolve(dirname(path), specifier));
    collectLoadedCssClasses(imports, classes, visited);
  }
  return classes;
}

function compositeElementNames(): string[] {
  const core = readdirSync(contractsRoot)
    .filter((name) => name.endsWith(".contract.json"))
    .map((name) => JSON.parse(readFileSync(resolve(contractsRoot, name), "utf8")))
    .filter((contract) => contract.kind === "custom-element")
    .map((contract) => contract.name as string);
  const addonContracts = [
    resolve(repoRoot, "addons/layout/contracts/layout.contract.json"),
    resolve(repoRoot, "addons/theming/contracts/theming.contract.json"),
  ];
  const addons = addonContracts.flatMap((path) =>
    Object.keys(JSON.parse(readFileSync(path, "utf8")).customElements ?? {}).map((tag) =>
      tag.replace(/^blora-/, ""),
    ),
  );
  return [...core, ...addons];
}

const FORBIDDEN = [
  /class="[^"]*\bblora-btn\b/,
  /Blora\.init\s*\(/,
  /legacy\/v1\/blora\.(?:css|js)/,
  /blora-btn--/,
] as const;

describe("showcase-v2 full component catalog", () => {
  it("contains exactly one source template for every official core component", () => {
    expect(existsSync(showcasePath), showcasePath).toBe(true);
    const html = readFileSync(showcasePath, "utf8");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const expected = manifest.components
      .map((component: { name: string }) => component.name)
      .sort();
    const actual = [...html.matchAll(/<template\b[^>]*data-component="([^"]+)"/g)]
      .map((match) => match[1]!)
      .sort();
    expect(actual).toEqual(expected);
    expect(new Set(actual).size).toBe(expected.length);
    expect(html).toMatch(/id="component-panel-root"/);
    expect(html).toMatch(/sourceTemplates/);
  });

  it("contains one independent catalog page for every official add-on", () => {
    const html = readFileSync(showcasePath, "utf8");
    const actual = [...html.matchAll(/<template\b[^>]*data-addon="([^"]+)"/g)].map(
      (match) => match[1]!,
    );
    expect(actual.sort()).toEqual([...addonNames].sort());
    expect(new Set(actual).size).toBe(addonNames.length);
    for (const addon of addonNames) {
      expect(html).toContain(`addons/${addon}/dist/${addon}.css`);
      if (addon !== "layout" && addon !== "theming") {
        expect(html).toContain(`addons/${addon}/dist/${addon}.global.js`);
      }
    }
    expect(html).toMatch(/data-addon="thread"[\s\S]*class="blora-thread"/);
    expect(html).toMatch(/data-addon="layout"[\s\S]*<blora-sidebar-layout\b/);
    expect(html).toMatch(/data-addon="markdown"[\s\S]*type="text\/markdown"/);
    expect(html).toMatch(/data-addon="effects"[\s\S]*<blora-text-fx effect="big"/);
    expect(html).toMatch(
      /data-addon="qrcode"[\s\S]*<blora-qrcode\b[^>]*value="https:\/\/blora\.design\/components"/,
    );
    expect(html).toMatch(/data-addon="theming"[\s\S]*<blora-palette-picker\b/);
    expect(html).toMatch(/function sourceLines\(template\) \{[\s\S]*serializeNode\(node\)/);
    expect(html).toMatch(/const extra = sourceScripts\[template\.dataset\.component\]/);
    expect(html).toMatch(/function isShowcaseChrome\(/);
    expect(html).not.toMatch(/if \(override\) return override/);
  });

  it("appends complete add-on and service scripts after serialized markup", () => {
    const html = readFileSync(showcasePath, "utf8");
    expect(html).toContain("<blora-thread-comment");
    expect(html).toContain("<blora-thread-composer>");
    expect(html).not.toContain("createThreadController");
    expect(html).toContain("<blora-text-fx");
    expect(html).toContain("<blora-count-up");
    expect(html).toContain("<blora-diff");
    expect(html).toContain("<blora-hover-gallery");
    expect(html).toContain("<blora-watermark");
    expect(html).toContain("initShortcutHints");
    expect(html).toContain("<blora-qrcode");
    expect(html).toContain("bootThemeFromStorage");
    expect(html).toContain("createMessageElement");
    expect(html).toContain("createNotificationElement");
    expect(html).toContain("createNotificationController");
    expect(html).toMatch(/import "@bloret-crew\/blora-design-thread\/thread\.css"/);
    expect(html).toMatch(/import "@bloret-crew\/blora-design-effects\/effects\.css"/);
    expect(html).toMatch(/import "@bloret-crew\/blora-design-markdown\/markdown\.css"/);
  });

  it("keeps multi-case components grouped in the showcase catalog", () => {
    const html = readFileSync(showcasePath, "utf8");
    const templateStarts = [...html.matchAll(/<template\b[^>]*data-component="([^"]+)"[^>]*>/g)];
    const multiCase = templateStarts.filter(
      (match, index) =>
        (
          html
            .slice(match.index!, templateStarts[index + 1]?.index ?? html.length)
            .match(/data-showcase-case=/g) ?? []
        ).length > 1,
    );
    expect(multiCase.length).toBeGreaterThan(5);
    expect(new Set(multiCase.map((match) => match[1]!))).toEqual(
      new Set(multiCase.map((match) => match[1]!)),
    );
  });

  it("keeps literal variant, size, state, and direction values in the showcase", () => {
    const html = readFileSync(showcasePath, "utf8");
    const templateStarts = [...html.matchAll(/<template\b[^>]*data-component="([^"]+)"[^>]*>/g)];
    const templateByComponent = new Map(
      templateStarts.map((match, index) => [
        match[1]!,
        html.slice(match.index!, templateStarts[index + 1]?.index ?? html.length),
      ]),
    );
    const attributes = [
      "variant",
      "data-variant",
      "size",
      "data-size",
      "mode",
      "orientation",
      "position",
      "filter",
      "type",
    ];
    const missing: string[] = [];

    for (const [component, template] of templateByComponent) {
      for (const attribute of attributes) {
        const escaped = attribute.replace("-", "\\-");
        const values = [
          ...template.matchAll(new RegExp(`(?<![\\w-])${escaped}=["']([^"'$<{]+)["']`, "g")),
        ].map((match) => match[1]!);
        for (const value of new Set(values)) {
          if (!/^[A-Za-z0-9][A-Za-z0-9/_-]*$/.test(value))
            missing.push(`${component}: ${attribute}="${value}"`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("keeps Speed Dial on the complete v1 Lucide-style variant set", () => {
    const html = readFileSync(showcasePath, "utf8");
    const sourceCss = readFileSync(
      resolve(sourceRoot, "components/speed-dial/speed-dial.css"),
      "utf8",
    );
    const builtCss = readFileSync(
      resolve(repoRoot, "packages/blora-design/dist/components/speed-dial/speed-dial.css"),
      "utf8",
    );
    const component = readFileSync(
      resolve(sourceRoot, "components/speed-dial/speed-dial.ts"),
      "utf8",
    );
    for (const css of [sourceCss, builtCss]) {
      expect(css).toContain(".blora-speed-dial-stage > blora-speed-dial");
      expect(css).not.toMatch(/\.blora-speed-dial-stage\s*>\s*\.blora-speed-dial\s*\{/);
      expect(css).toContain("minmax(17.5rem, 1fr)");
    }
    expect(component).not.toMatch(/createElementNS|speedDialIcon|slice\(0\s*,\s*1\)/);
    expect(component).toContain('createNamedIcon(this.ownerDocument, "plus", "plus")');
    expect(component).toContain('createNamedIcon(this.ownerDocument, "close", "close")');
    expect(html).not.toMatch(/📷|▧|◉|main\.textContent\s*=|>编</);
    for (const icon of [
      "camera",
      "image",
      "mic",
      "document-add",
      "upload",
      "share",
      "pencil",
      "copy",
      "trash",
      "eye",
      "phone",
      "mail",
      "message",
      "chart",
      "home",
      "search",
      "star",
      "sun",
    ]) {
      expect(html, `Speed Dial must use registered icon ${icon}`).toContain(`"${icon}"`);
    }
    expect(html.match(/<div class="blora-speed-dial-stage">/g)).toHaveLength(8);
    const speedDialTemplate = html.match(
      /<template data-component="speed-dial"[\s\S]*?<\/template>/,
    )?.[0];
    expect(speedDialTemplate).toBeDefined();
    expect(speedDialTemplate).not.toMatch(/<blora-speed-dial\b[^>]*\sopen(?:\s|>)/);
    expect(html).toContain('action-appearance="label"');
    expect(html).toContain('action-appearance="button"');
    expect(html).toContain('main-icon="pencil"');
  });

  it("loads the 2.0 runtime plus light and dark design tokens", () => {
    const html = readFileSync(showcasePath, "utf8");
    expect(html).toMatch(/packages\/blora-design\/dist\/blora\.css/);
    expect(html).toMatch(/packages\/blora-design\/dist\/tokens\.dark\.css/);
    expect(html).toMatch(/packages\/blora-design\/dist\/tokens\.themes\.css/);
    expect(html).toMatch(/packages\/blora-design\/dist\/blora\.global\.js/);
    expect(html).toMatch(/addons\/theming\/dist\/theming\.css/);
    expect(html).toMatch(/addons\/theming\/dist\/theming\.global\.js/);
    expect(html).toMatch(/addons\/layout\/dist\/layout\.css/);
    expect(html).toMatch(/addons\/layout\/dist\/layout\.global\.js/);
    expect(html).not.toMatch(/legacy\/v1\/blora\.(?:css|js)/);
  });

  it("composes its navbar and responsive sidebar from official framework surfaces", () => {
    const html = readFileSync(showcasePath, "utf8");
    expect(html).toMatch(/<blora-navbar\b[^>]+class="showcase-navbar"[^>]+variant="floating"/);
    expect(html).toMatch(/<blora-palette-picker\b[^>]+button-variant="ghost"/);
    expect(html).toMatch(/<blora-navbar-action\b[^>]+label="规范文档"/);
    expect(html).toMatch(/<blora-navbar-action\b[^>]+label="开始使用"/);
    expect(html).toMatch(/<blora-palette-picker\b/);
    expect(html).toMatch(/<blora-color-scheme-toggle\b[^>]+id="theme-toggle"/);
    expect(html).toMatch(/<blora-sidebar-layout\b[^>]+class="showcase-catalog"/);
    expect(html).toMatch(/<blora-sidebar-layout-sidebar\b[^>]+id="component-sidebar"/);
    expect(html).toMatch(/<blora-sidebar-layout-content\b[^>]+id="component-content"/);
    expect(html).toMatch(
      /createElement\("blora-sidebar-nav",\s*\{[\s\S]*?id: "component-navigation"/,
    );
    expect(html).toMatch(/createElement\("blora-sidebar-nav-group"/);
    expect(html).toMatch(/createElement\("blora-sidebar-nav-link"/);
    expect(html).not.toMatch(/blora-navbar__link/);
    expect(html).not.toMatch(/create(?:PalettePicker|SidebarLayout)Controller/);
    expect(html).not.toMatch(/\bdemo-(?:navbar|sidebar|shell|icon-button)/);
  });

  it("uses the official declarative API for every core custom element", () => {
    const html = readFileSync(showcasePath, "utf8");
    const contracts = readdirSync(contractsRoot)
      .filter((name) => name.endsWith(".contract.json"))
      .map((name) => JSON.parse(readFileSync(resolve(contractsRoot, name), "utf8")));
    for (const contract of contracts.filter((contract) => contract.kind === "custom-element")) {
      expect(html, `${contract.name} must use ${contract.tagName}`).toMatch(
        new RegExp(`<${contract.tagName}\\b`),
      );
    }
    expect(html).toMatch(/Blora\.autoDefine\s*\(/);
    for (const pattern of FORBIDDEN) expect(html, `forbidden ${pattern}`).not.toMatch(pattern);
  });

  it("allows only declarative CE consumption for every migrated composite", () => {
    const consumers = [showcasePath];
    const names = compositeElementNames();
    for (const path of consumers) {
      const source = readFileSync(path, "utf8");
      for (const name of names) {
        const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pascal = name
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("");
        expect(source, `${path} must not author ${name} internal classes`).not.toMatch(
          new RegExp(`\\bblora-${escaped}__[a-z0-9_-]+`, "i"),
        );
        const allowedPublicHelpers =
          name === "speed-dial" ? "(?!-(?:stage(?:__label)?|grid)\\b)" : "";
        expect(source, `${path} must not author legacy .blora-${name} roots`).not.toMatch(
          new RegExp(
            `(?:class\\s*=\\s*["'][^"']*\\b|\\.)blora-${escaped}${allowedPublicHelpers}\\b`,
            "i",
          ),
        );
        expect(source, `${path} must not mount ${name} controllers`).not.toMatch(
          new RegExp(`create${pascal}Controller\\s*\\(`),
        );
      }
    }
  });

  it("keeps the documented core CE count in sync with contracts", () => {
    const coreCount = readdirSync(contractsRoot)
      .filter((name) => name.endsWith(".contract.json"))
      .map((name) => JSON.parse(readFileSync(resolve(contractsRoot, name), "utf8")))
      .filter((contract) => contract.kind === "custom-element").length;
    expect(readFileSync(remainingWorkPath, "utf8")).toContain(`当前 ${coreCount} 个`);
  });

  it("uses official Tabs CE for every Preview/HTML switch", () => {
    const html = readFileSync(showcasePath, "utf8");
    expect(html).toMatch(/id: "component-navigation",[\s\S]*?value: "button"/);
    expect(html).toMatch(/createElement\("blora-tabs", \{ flush: "" \}\)/);
    expect(html).toMatch(/createElement\("blora-tab"/);
    expect(html).toMatch(/createElement\("blora-mockup"/);
    expect(html).toMatch(/createElement\("blora-mockup-line"/);
    expect(html).toMatch(/class: "showcase-code-panel"/);
    expect(html).toMatch(/source\.content\.cloneNode\(true\)/);
    expect(html).toMatch(/serializeNode/);
    expect(html).toMatch(/const sourceScripts =/);
    expect(html).not.toMatch(/if \(override\) return override/);
    expect(html).not.toMatch(/codeOverrides/);
    expect(html).not.toMatch(/class="showcase-code"/);
    expect(html).not.toMatch(/<pre\b[^>]*>\s*<code>/);
    expect(html).toMatch(/addEventListener\("hashchange"/);
    expect(html).not.toMatch(/role="tablist"/);
    expect(html).not.toMatch(/event\.key !== "ArrowLeft"/);
    expect(html).not.toMatch(/repeating-linear-gradient/);
    expect(html).not.toMatch(/showcase-section__anchor/);
  });

  it("does not invent shipped blora-* classes", () => {
    const html = readFileSync(showcasePath, "utf8");
    const cssClasses = collectCssClasses(sourceRoot);
    collectCssClasses(themingSourceRoot, cssClasses);
    collectCssClasses(layoutSourceRoot, cssClasses);
    addonSourceRoots.forEach((path) => collectCssClasses(path, cssClasses));
    const authored = [...html.matchAll(/\bclass="([^"]*)"/g)]
      .flatMap((match) => match[1]!.split(/\s+/))
      .filter((className) => className.startsWith("blora-"));
    const unknown = [...new Set(authored.filter((name) => !cssClasses.has(name)))];
    expect(unknown, "showcase contains invented/unshipped blora-* classes").toEqual([]);
  });

  it("loads every official CSS class authored by the showcase from its actual bundles", () => {
    const html = readFileSync(showcasePath, "utf8");
    const loadedClasses = collectLoadedCssClasses([
      distCss,
      ...addonNames.map((name) => resolve(repoRoot, `addons/${name}/dist/${name}.css`)),
    ]);
    const authored = [...html.matchAll(/\bclass="([^"]*)"/g)]
      .flatMap((match) => match[1]!.split(/\s+/))
      .filter((className) => className.startsWith("blora-"));
    const missing = [...new Set(authored.filter((name) => !loadedClasses.has(name)))].sort();
    expect(missing, "showcase classes missing from the CSS bundles it actually loads").toEqual([]);
  });

  it("resizes the Preview surface to visible component content", () => {
    const html = readFileSync(showcasePath, "utf8");
    expect(html).toContain("const resizePreview = () =>");
    expect(html).toContain("new ResizeObserver(schedulePreviewResize).observe(mount)");
    expect(html).toContain("new MutationObserver(schedulePreviewResize).observe(mount");
    expect(html).toContain("mount.style.minHeight =");
  });

  it("has every required built asset", () => {
    for (const path of [
      distCss,
      distDarkCss,
      distJs,
      layoutDistJs,
      layoutDistCss,
      themingDistJs,
      themingDistCss,
    ]) {
      expect(existsSync(path), path).toBe(true);
    }
  });
});
