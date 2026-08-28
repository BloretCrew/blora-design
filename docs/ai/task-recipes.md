# AI Task Recipes

> Common tasks for AI agents working on Blora Design 2.0.

## Recipe: Migrate a CSS-only Component

1. Read `docs/refactor/component-matrix.md` for the component's current coverage.
2. Read `docs/migration/from-any-ui-to-blora-design.md` before proposing a new component.
3. Confirm the capability is not already covered by the published component manifest.
4. Create the contract: `packages/blora-design/contracts/<name>.contract.json`.
5. Write the CSS using registered tokens only.
6. Create Stories covering all variants, sizes, and states.
7. Write unit tests.
8. Write browser interaction tests.
9. Write a11y tests.
10. Create visual regression baseline.
11. Write the relevant user-facing usage and migration guidance.
12. Run `pnpm verify`.

## Recipe: Migrate a JS-enhanced Component

1. Read `docs/refactor/component-matrix.md` and the published component manifest for existing coverage.
2. Read the component contract and the complete migration standard.
3. Decide: official CSS-only pattern, official native element pattern, or Custom Element only when the capability is not already covered.
4. If Custom Element: extend `BloraElement`, use open Shadow DOM, declare CSS Parts.
5. If form-associated: implement `ElementInternals` API.
6. Follow the component template in Spec §4.2.
7. Complete all Definition of Done items.

## Recipe: Add a Design Token

1. Add the token to the appropriate DTCG JSON file (Phase 2+).
2. Run `pnpm build:tokens` to generate CSS/TS.
3. Verify the token is used in component CSS, not hardcoded values.
4. Register the token in the appropriate DTCG source and document its semantic purpose.
5. Run `pnpm verify`.

## Recipe: Run Verification

```bash
pnpm verify
```

This runs: lint, lint:css, lint:contracts, format:check, typecheck, test, build, publint, attw, test:browser, size.

Never declare completion without `pnpm verify` passing.
