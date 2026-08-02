/**
 * Generate contracts, stories, and update integration files
 * for all batch-created beta components.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pkgDir = resolve(root, "packages/blora-design");
const componentsDir = resolve(pkgDir, "src", "components");

// Get all component dirs that have CSS but no .ts file (CSS-only beta components)
const newComponents = [];
for (const dir of readdirSync(componentsDir, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const cssFiles = readdirSync(resolve(componentsDir, dir.name)).filter((f) => f.endsWith(".css"));
  const tsFiles = readdirSync(resolve(componentsDir, dir.name)).filter((f) => f.endsWith(".ts"));
  if (cssFiles.length > 0 && tsFiles.length === 0) {
    // Check if contract already exists
    const contractPath = resolve(pkgDir, "contracts", `${dir.name}.contract.json`);
    if (!existsSync(contractPath)) {
      newComponents.push(dir.name);
    }
  }
}

console.log(`Found ${newComponents.length} components needing contracts+stories:`);
console.log(newComponents.join(", "));

// Story title mapping
const storyTitles = {
  "chart-container": "Data/Chart Container",
  "color-picker": "Forms/Color Picker",
  "command-palette": "Navigation/Command Palette",
  "text-rotate": "Feedback/Text Rotate",
  fab: "Navigation/FAB",
  dock: "Navigation/Dock",
  deck: "Layout/Deck",
  mockup: "Layout/Mockup",
  masonry: "Layout/Masonry",
  watermark: "Layout/Watermark",
  affix: "Layout/Affix",
  comment: "Data/Comment",
  chat: "Data/Chat",
  slider: "Forms/Slider",
  range: "Forms/Range",
  rate: "Forms/Rate",
  otp: "Forms/OTP",
  "tags-input": "Forms/Tags Input",
  search: "Forms/Search",
  calendar: "Data/Calendar",
  datepicker: "Forms/Date Picker",
  timepicker: "Forms/Time Picker",
  cascader: "Forms/Cascader",
  tree: "Data/Tree",
  transfer: "Forms/Transfer",
  autocomplete: "Forms/AutoComplete",
  mentions: "Forms/Mentions",
  carousel: "Data/Carousel",
  tour: "Feedback/Tour",
  splitter: "Layout/Splitter",
  upload: "Forms/Upload",
  countdown: "Data/Countdown",
  copy: "Forms/Copy",
  "speed-dial": "Navigation/Speed Dial",
  megamenu: "Navigation/Megamenu",
};

// Generate contract JSON
for (const name of newComponents) {
  const contract = {
    $schema: "../../schemas/component-contract.schema.json",
    name,
    status: "beta",
    kind: "css-only",
    since: "2.0.0",
    requiresJavaScript: false,
    formAssociated: false,
    attributes: {},
    properties: {},
    methods: {},
    events: {},
    slots: { default: "Content" },
    parts: [],
    cssProperties: [],
    accessibilityPattern: "section",
    migrationFromV1: `${name}.migration.md`,
  };
  const contractPath = resolve(pkgDir, "contracts", `${name}.contract.json`);
  writeFileSync(contractPath, JSON.stringify(contract, null, 2) + "\n");
}

console.log(`\n✓ Created ${newComponents.length} contracts`);

// Generate stories
for (const name of newComponents) {
  const title = storyTitles[name] || "Components/" + name;
  const className = `.blora-${name}`;

  const story = `import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: ${JSON.stringify(title)},
  component: ${JSON.stringify(className)},
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html\`
    <div class="${className.replace(".", "")}">
      <p class="blora-text-muted">${name} component (beta)</p>
    </div>
  \`,
};
`;

  const storyPath = resolve(pkgDir, "stories", `${name}.stories.ts`);
  writeFileSync(storyPath, story);
}

console.log(`✓ Created ${newComponents.length} stories`);

// Update package.json exports
const pkgJsonPath = resolve(pkgDir, "package.json");
const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
const exportEntries = [
  `"./components/${newComponents[0]}.css": "./dist/components/${newComponents[0]}/${newComponents[0]}.css"`,
];
for (const name of newComponents.slice(1)) {
  exportEntries.push(`    "./components/${name}.css": "./dist/components/${name}/${name}.css"`);
}

// Find the position of "./compat/v1" in exports and insert before it
const exportsStr = JSON.stringify(pkgJson.exports, null, 2);
// Instead, just add the new entries programmatically
for (const name of newComponents) {
  const key = `./components/${name}.css`;
  const val = `./dist/components/${name}/${name}.css`;
  if (!pkgJson.exports[key]) {
    // Insert before "./compat/v1"
    const newExports = {};
    for (const [k, v] of Object.entries(pkgJson.exports)) {
      if (k === "./compat/v1") {
        newExports[key] = val;
      }
      newExports[k] = v;
    }
    pkgJson.exports = newExports;
  }
}
writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + "\n");
console.log(`✓ Updated package.json exports`);

// Update attw exclusions in root package.json
const rootPkgPath = resolve(root, "package.json");
const rootPkg = JSON.parse(readFileSync(rootPkgPath, "utf8"));
const attwCmd = rootPkg.scripts.attw;
const newExclusions = newComponents.map((c) => `./components/${c}.css`);
const newAttw = attwCmd.replace("./compat/v1.css", newExclusions.join(" ") + " ./compat/v1.css");
rootPkg.scripts.attw = newAttw;
writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + "\n");
console.log(`✓ Updated root package.json attw exclusions`);

// Update preview.ts imports
const previewPath = resolve(pkgDir, ".storybook", "preview.ts");
let preview = readFileSync(previewPath, "utf8");
const newImports = newComponents.map((c) => `import "../src/components/${c}/${c}.css";`).join("\n");
// Insert before the blank line before const preview
preview = preview.replace(/^const preview/m, newImports + "\n\nconst preview");
writeFileSync(previewPath, preview);
console.log(`✓ Updated preview.ts imports`);

console.log(`\nDone! ${newComponents.length} components fully created.`);
