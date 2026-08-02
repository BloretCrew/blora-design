# Visual regression review flow

## Purpose

Playwright project **`visual`** captures component chrome screenshots. Baselines live next to the spec:

`packages/blora-design/tests/browser/visual.spec.ts-snapshots/`

## Commands

```bash
# Requires build (tokens + component CSS in dist)
pnpm --filter @bloret-crew/blora-design run build

# Update baselines after intentional visual change (review diffs!)
pnpm exec playwright test --project=visual --update-snapshots

# CI / local check against baselines
pnpm test:visual
```

## Review rules (Agents.md)

1. Do **not** bulk-update snapshots without eye-check.
2. Prefer token/CSS intentional deltas documented in `pending-visual-review.md` or `known-differences.md`.
3. Failures: open the HTML report / `-snapshots` diff; fix CSS or accept with review note.
4. Scope today: **smoke set** (button row, table chrome, invalid field) — expand matrix in RC.

## CI

`pnpm test:visual` runs project `visual` only (not the full interaction suite).
Optional: wire into CI as non-blocking or required after baselines stabilize.
