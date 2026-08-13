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

## 2026-08-11 Showcase full catalog review

- `examples/showcase-v2/` now covers all 76 core manifest components.
- Reviewed actual headless-Chrome renders for the desktop catalog, mobile sidebar, Accordion,
  Collapse HTML panel, palette picker, FAB, Statistic, Table, Dialog, and Select.
- FAB review confirms the official static docs modifier keeps the control 56×56, circular, centered,
  and contained by the Preview; the default floating variant remains 56×56 on desktop and 48×48
  below the 560px breakpoint.
- The catalog routes and mounts every component in both desktop and mobile Chromium without page
  errors; the active sidebar item is kept visible when routing and when opening the mobile drawer.
- Accepted snapshot changes are limited to the expanded catalog shell plus the representative
  component panels listed above.

## CI

`pnpm test:visual` runs project `visual` only (not the full interaction suite).
Optional: wire into CI as non-blocking or required after baselines stabilize.
