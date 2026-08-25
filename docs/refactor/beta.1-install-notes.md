# Beta install verification (2.0.0-beta.1)

**Date:** 2026-08-25  
**Channel:** npm dist-tag `beta`

## Release packages

| Package | Version | Channel |
|---------|---------|---------|
| `@bloret-crew/blora-design` | `2.0.0-beta.1` | `@beta` |
| `@bloret-crew/blora-design-markdown` | `2.0.0-beta.1` | `@beta` |
| `@bloret-crew/blora-design-thread` | `2.0.0-beta.1` | `@beta` |
| `@bloret-crew/blora-design-qrcode` | `2.0.0-beta.1` | `@beta` |
| `@bloret-crew/blora-design-effects` | `2.0.0-beta.1` | `@beta` |
| `@bloret-crew/blora-design-layout` | `2.0.0-beta.1` | `@beta` |
| `@bloret-crew/blora-design-theming` | `2.0.0-beta.1` | `@beta` |

The core package keeps npm `latest` on the 1.x line until Stable 2.0.0. Beta.1 advances only the `beta` dist-tag.

## Pre-tag gates

The release commit must pass:

```bash
pnpm verify
pnpm pack:test
pnpm pack:test:addons
```

The packed core consumer check covers:

- ESM main import and `VERSION === "2.0.0-beta.1"`;
- SSR-safe import (`isBrowser() === false` in Node);
- `./auto`, stable JavaScript subpaths and CSS exports;
- `custom-elements.json`, `component-manifest.json` and `api-snapshot.json`;
- add-on imports against the packed Beta.1 core package.

## Consumer install after publish

```bash
pnpm add @bloret-crew/blora-design@beta

pnpm add \
  @bloret-crew/blora-design-markdown@beta \
  @bloret-crew/blora-design-thread@beta \
  @bloret-crew/blora-design-qrcode@beta \
  @bloret-crew/blora-design-effects@beta \
  @bloret-crew/blora-design-layout@beta \
  @bloret-crew/blora-design-theming@beta
```

Post-publish verification records the resolved versions, ESM/SSR imports, packed manifests, CDN IIFE and the `beta` dist-tag for all seven packages.

## Rollback

If Beta.1 is defective:

1. Move each affected package's `beta` tag back to `2.0.0-beta.0`:

   ```bash
   npm dist-tag add @bloret-crew/blora-design@2.0.0-beta.0 beta
   ```

   Repeat for each affected add-on.
2. Deprecate Beta.1 with a short compatibility message instead of unpublishing it.
3. Fix forward in `2.0.0-beta.2` after the full release gates pass.

## Result

_To be completed after the tag workflow and npm consumer verification finish._
