# Beta API freeze policy (pre–beta.0)

**Status:** Adopted for approaching **2.0.0-beta** (not yet released).  
**Scope:** `@bloret-crew/blora-design` and public add-ons published under `@bloret-crew/blora-design-*`.

## 1. Stable-core API freeze (when beta tag ships)

Once **`2.0.0-beta.0`** (or agreed beta version) is published:

1. **Public exports** listed in `dist/api-snapshot.json` and `package.json#exports` for the main package must not remove or rename symbols without a **SemVer major** plan.
2. **Custom elements** `blora-select`, `blora-dialog` tags and define helpers remain stable.
3. **Documented data attributes / class contracts** in `*.contract.json` with `status: "stable"` are freeze candidates; `beta` / experimental may still change with changelog notes.
4. Bug fixes that preserve API surface are always allowed.
5. New optional exports (new subpaths, new optional options with defaults) are allowed in beta as **additive** only.

Until beta is tagged, master may still adjust alpha APIs; document in CHANGELOG.

## 2. Cadence after beta.0

| Allowed | Not allowed (without major bump) |
|---------|----------------------------------|
| Defect fixes | Removing public exports |
| Docs, tests, a11y/visual | Renaming events/classes in stable contracts |
| Additive optional APIs | Silent visual restyles without known-differences |
| Performance/internal refactors with same public surface | Shipping experimental as default marketing |

**Marketing:** default install docs for beta should say **2.0 beta**, list **stable-core** surfaces, and mark `beta` contracts / experimental add-on APIs as non-guaranteed. Do not claim “all contracts stable”.

## 3. User-facing migration publish

Primary user docs for beta:

- `docs/guide.md` — recommended 2.0 usage  
- `docs/migration/v1-to-v2.md` — 1.x → 2.0  
- `docs/refactor/alpha-install-notes.md` — npm channel notes (extend for beta)  
- `CHANGELOG.md`  

There is no `@bloret-crew/blora-design/compat/v1` entry.

## 4. Size budgets

Enforced by `packages/blora-design/scripts/check-size.mjs` (shell CSS, flattened CSS, main JS, global IIFE, key JS subpaths). Extend budgets only with review when intentional growth is required.

## 5. Not in this freeze

- Full visual matrix for every component (expand in RC)
- FA-WC for all controls (ADR-013)
- Deleting `legacy/v1`
