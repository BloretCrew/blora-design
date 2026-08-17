import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const previewPath = resolve(import.meta.dirname, "../.storybook/preview.ts");
const dockStoryPath = resolve(import.meta.dirname, "../stories/dock.stories.ts");

describe("Storybook preview runtime", () => {
  it("registers the declarative Custom Elements used by stories and Autodocs", () => {
    const preview = readFileSync(previewPath, "utf8");
    expect(preview).toMatch(/import\s+["']\.\.\/src\/auto\.(?:js|ts)["']/);
  });

  it("uses the Dock CE icon attributes instead of hand-built glyphs", () => {
    const story = readFileSync(dockStoryPath, "utf8");
    expect(story).toMatch(/<blora-dock\b/);
    expect(story).toMatch(/icon="home"/);
    expect(story).toMatch(/icon="search"/);
    expect(story).toMatch(/icon="user"/);
    expect(story).toMatch(/icon="settings"/);
    expect(story).not.toMatch(/createBloraIcon\(/);
    expect(story).not.toMatch(/[⌂⌕◎⚙]/);
  });
});
