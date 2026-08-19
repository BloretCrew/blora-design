# Beta install verification (2.0.0-beta.0)

**Date:** 2026-08-19  
**Channel:** npm dist-tag `beta`

## Release candidate packages

| Package | Version | Channel |
|---------|---------|---------|
| `@bloret-crew/blora-design` | `2.0.0-beta.0` | `@beta` |
| `@bloret-crew/blora-design-markdown` | `2.0.0-beta.0` | `@beta` |
| `@bloret-crew/blora-design-thread` | `2.0.0-beta.0` | `@beta` |
| `@bloret-crew/blora-design-qrcode` | `2.0.0-beta.0` | `@beta` |
| `@bloret-crew/blora-design-effects` | `2.0.0-beta.0` | `@beta` |
| `@bloret-crew/blora-design-layout` | `2.0.0-beta.0` | `@beta` |
| `@bloret-crew/blora-design-theming` | `2.0.0-beta.0` | `@beta` |

The core package keeps npm `latest` on the 1.x line until Stable 2.0.0. The Beta release uses the `beta` dist-tag.

## Local package rehearsal

Before tagging, the release commit must pass:

```bash
pnpm verify
pnpm pack:test
pnpm pack:test:addons
```

The packed core package is installed in an isolated temporary consumer and checked for:

- ESM main import and `VERSION === "2.0.0-beta.0"`
- SSR-safe import (`isBrowser() === false` in Node)
- `./auto`, stable JavaScript subpaths and CSS exports
- `custom-elements.json`, `component-manifest.json` and `api-snapshot.json`
- add-on imports against the packed Beta core package

## Consumer install after publish

```bash
pnpm add @bloret-crew/blora-design@beta

# optional add-ons
pnpm add \
  @bloret-crew/blora-design-markdown@beta \
  @bloret-crew/blora-design-thread@beta \
  @bloret-crew/blora-design-qrcode@beta \
  @bloret-crew/blora-design-effects@beta \
  @bloret-crew/blora-design-layout@beta \
  @bloret-crew/blora-design-theming@beta
```

## Rollback

The release workflow publishes Beta with `--tag beta`, so it does not replace the core package's `latest` tag. If a Beta is defective:

1. Move `beta` back to the previous known-good prerelease with `npm dist-tag add @bloret-crew/blora-design@<version> beta` and repeat for affected add-ons.
2. Deprecate the defective version with a migration message instead of unpublishing it.
3. Publish a new `2.0.0-beta.N` after all release gates pass.

## Feedback

Use GitHub Issues with the bug or prerelease feedback templates. Beta follows the defect-first policy in [`beta-cadence.md`](./beta-cadence.md).
