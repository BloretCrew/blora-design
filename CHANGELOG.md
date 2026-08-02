# Changelog

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

See `docs/guide.md` and `docs/refactor/remaining-work.md`.

## 2.0.0-alpha.0

Development snapshot during Phase 0–9; not a formal prerelease channel.
