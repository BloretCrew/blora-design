# phase10-entry-cleanup

Moved when entering Phase 10 (2026-08-02). Confirm before permanent delete.

| Path | Why |
|------|-----|
| `stale-changesets/` | Unreleased Changeset notes for Phase 1–6 work already in tree; version never bumped past `2.0.0-alpha.0`. Fresh changesets should be written for Phase 10 releases. |
| `empty-placeholders/REMOVED.md` | Empty untracked dirs removed: root `scripts/`, `packages/blora-design/src/tokens`, `packages/blora-design/src/utils`, `packages/tokens/src/component`. |

**Not moved (still live):** `legacy/`, inventory JSON, `docs/framework.md` (1.x对照), browser/unit tests, `.trashes/*` archives, `docs/refactor/*`.
