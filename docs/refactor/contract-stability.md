# Contract status policy (2.0 Beta)

> Effective with `2.0.0-beta.0`. Contract status is part of the public Beta communication and must remain aligned with the API snapshot and migration documentation.

## Meanings

| Status | Meaning in 2.0 Beta |
|--------|---------------------|
| **stable** | Implemented, documented and covered by the current release gates. Its documented public attributes, events, methods, classes, CSS properties and parts are frozen for the 2.0 Beta line. |
| **beta** | Available for evaluation but may still change before Stable. Any breaking adjustment requires a changelog entry and migration note. |
| **experimental** | May be redesigned or removed and must not be marketed as stable core. |

## Beta freeze rules

1. The 53 contracts currently marked `stable` form the stable-core contract set for `2.0.0-beta.0`.
2. The 34 contracts marked `beta` remain explicitly non-frozen beyond the general prerelease compatibility promise.
3. Stable contract changes after Beta must be additive or defect fixes that preserve documented behavior. Removing or renaming public surface requires a future major-version plan.
4. `component-matrix.md` `✅` continues to mean implemented and available; contract status communicates the compatibility promise.
5. Package exports and `dist/api-snapshot.json` are reviewed at each prerelease. Unexpected removals fail the release review.
6. Promotion from `beta` to `stable` requires contract review plus relevant unit/browser coverage; interactive components also require accessibility evidence.

## Marketing boundary

The project may state **“2.0 Beta; stable-core API frozen”**. It must not state that every component has completed the full cross-browser, visual and manual accessibility matrix before RC.

See also:

- [`beta-api-freeze.md`](./beta-api-freeze.md)
- [`beta-cadence.md`](./beta-cadence.md)
- [`remaining-work.md`](./remaining-work.md)
