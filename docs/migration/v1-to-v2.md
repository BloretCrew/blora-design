# Migrate Blora Design 1.x → 2.0

> **Status:** stub (Phase 8/9). Expand to full class/data/event tables in **Phase 10** (see [`docs/refactor/remaining-work.md`](../refactor/remaining-work.md) §3.3).  
> **Do not** use this as a complete codemod manual yet—pair with `compat/v1` and fixtures.

## Mindset

| 1.x | 2.0 |
|-----|-----|
| `blora.css` + `blora.js` + `Blora.init()` | ESM package + per-component CSS + `createXxxController` / `defineBlora*` |
| `Blora.toast` / `Blora.table.*` | Named exports: `toast`, `createTableController`, … |
| `.blora-btn.blora-btn--primary` | `.blora-button[data-variant="primary"]` |
| Auto-scan `data-blora-*` | Explicit controller bind (compat may assist old markup) |

## Recommended path

1. Install `@bloret-crew/blora-design@2.0.0-alpha.x` (or workspace monorepo).  
2. Switch styles to tokens + foundations + needed component CSS.  
3. Replace global API calls with named imports from package entry.  
4. Re-bind interactive roots with controllers after mount; call `destroy()` on unmount.  
5. Optional: enable **compat/v1** temporarily for class/token aliases while rewriting markup.  
6. Run repo codemod / `migrate:check` where available (Phase 8 tools under package scripts).  
7. Visual-check against Storybook and, if needed, `legacy/showcase-v1.html`.

## Token map

CSV: [`token-map-v1-v2.csv`](./token-map-v1-v2.csv).

## Class / event quick map

See [`docs/ai/migration-rules.md`](../ai/migration-rules.md) and `packages/blora-design/src/compat/v1/`.

## Frozen 1.x sources

- `legacy/v1/` — frozen implementation  
- `legacy/showcase-v1.html` — visual baseline showcase  
- **Do not delete** for migration reference.

## 2.0 usage (target)

Full examples: [`docs/guide.md`](../guide.md).
