# Changelog

## Unreleased

Beta follows a defect-first cadence. Public stable-core exports are frozen from `2.0.0-beta.0`; beta contracts and explicitly experimental surfaces may still change with migration notes.

## 2.0.0-beta.0

### Released packages

- `@bloret-crew/blora-design@2.0.0-beta.0`
- `@bloret-crew/blora-design-markdown@2.0.0-beta.0`
- `@bloret-crew/blora-design-thread@2.0.0-beta.0`
- `@bloret-crew/blora-design-qrcode@2.0.0-beta.0`
- `@bloret-crew/blora-design-effects@2.0.0-beta.0`
- `@bloret-crew/blora-design-layout@2.0.0-beta.0`
- `@bloret-crew/blora-design-theming@2.0.0-beta.0`

npm dist-tag: **`beta`**

### Beta commitments

- Stable-core public exports, package subpaths, documented stable contracts, Custom Element tags, events and methods are frozen under the Beta API policy.
- Beta contracts remain changeable only with changelog and migration notes.
- The release line accepts defects, accessibility, documentation, tests and compatible performance work by default; public additions must be optional and backward-compatible.

### Highlights since Alpha.1

- Completed the 87-component Showcase v2 catalog with lazy single-route previews and Preview/HTML generated from one declaration.
- Unified all UI, status and navigation icons through `createBloraIcon()` with geometry generated from `lucide-static`; retained only documented non-icon SVG exceptions.
- Added Composite Custom Element coverage and hardened package manifests, API snapshots, JavaScript subpaths, global IIFE and add-on packaging.
- Fixed Dialog top-layer and scroll-lock behavior, Drawer host visibility, sticky Sidebar Layout position retention, Preview auto-height, Transfer alignment and Indicator anchoring.
- Unified Button Group and Join horizontal button welding while retaining Join-only vertical and mixed-input behavior.
- Removed the Cinnabar and Ocean themes; retained Coral, Indigo, Lotus, Graphite, Mono, Circuit and Dusk.
- Replaced Avenir-first typography with the platform system font stack.
- Removed the 1.x runtime compatibility entry; migrate markup, tokens and services directly to 2.0.
- Expanded browser, axe, visual, lifecycle, icon-policy, package and CI gates. All known visual and behavioral differences were approved by the project owner on 2026-08-19.

### Install

```bash
pnpm add @bloret-crew/blora-design@beta
# or pin
pnpm add @bloret-crew/blora-design@2.0.0-beta.0
```

See `docs/guide.md`, `docs/migration/v1-to-v2.md` and `docs/refactor/beta-install-notes.md`.

## 2.0.0-alpha.1

### Released packages

- `@bloret-crew/blora-design@2.0.0-alpha.1`
- `@bloret-crew/blora-design-markdown@2.0.0-alpha.1`
- `@bloret-crew/blora-design-thread@2.0.0-alpha.1`
- `@bloret-crew/blora-design-qrcode@2.0.0-alpha.1`
- `@bloret-crew/blora-design-effects@2.0.0-alpha.1`
- `@bloret-crew/blora-design-layout@2.0.0-alpha.1`
- `@bloret-crew/blora-design-theming@2.0.0-alpha.1`

npm dist-tag: **`alpha`**

### Highlights

- Phase 9 complete (add-ons + core gap paths); Phase 10 **Preflight** gates green on CI.
- ESM-first usage: tokens/foundations CSS + `createXxxController` / `defineBloraSelect` (not 1.x global `Blora`).
- Table: sort, pagination, column settings, virtual scroll, **built-in row selection**.
- Form validate, TreeSelect, BackTop, image preview, multi-placement `notify`.
- CI: corepack pnpm, publint/attw, pack fixtures (core + add-ons), Playwright + axe smoke.
- Example: `examples/basic/`.

### Install

```bash
pnpm add @bloret-crew/blora-design@alpha
# or pin
pnpm add @bloret-crew/blora-design@2.0.0-alpha.1
```

## 2.0.0-alpha.0

Development snapshot during Phase 0–9; not a formal prerelease channel.
