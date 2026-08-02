# AI Task Recipes

> Common tasks for AI agents working on Blora Design 2.0.

## Recipe: Migrate a CSS-only Component

1. Read `docs/refactor/v1-css-inventory.json` for the component's 1.x CSS.
2. Read `docs/refactor/component-matrix.md` for the component's migration status.
3. Create the contract: `packages/blora-design/contracts/<name>.contract.json`.
4. Write the CSS using registered tokens only.
5. Create Stories covering all variants, sizes, and states.
6. Write unit tests.
7. Write browser interaction tests.
8. Write a11y tests.
9. Create visual regression baseline.
10. Write migration doc.
11. Run `pnpm verify`.

## Recipe: Migrate a JS-enhanced Component

1. Read `docs/refactor/v1-js-inventory.json` (or archived `.trashes/phase-docs/v1-js-inventory.md`) for the component's 1.x JS API.
2. Read `docs/refactor/v1-public-surface.json` for the component's public API.
3. Decide: native element + class, or Custom Element.
4. If Custom Element: extend `BloraElement`, use open Shadow DOM, declare CSS Parts.
5. If form-associated: implement `ElementInternals` API.
6. Follow the component template in Spec §4.2.
7. Complete all Definition of Done items.

## Recipe: Add a Design Token

1. Add the token to the appropriate DTCG JSON file (Phase 2+).
2. Run `pnpm build:tokens` to generate CSS/TS.
3. Verify the token is used in component CSS, not hardcoded values.
4. If replacing a 1.x token, add mapping to `docs/migration/token-map-v1-v2.csv`.
5. Run `pnpm verify`.

## Recipe: Run Verification

```bash
pnpm verify
```

This runs: lint, lint:css, lint:contracts, format:check, typecheck, test, build, publint, attw, test:browser, size.

Never declare completion without `pnpm verify` passing.
