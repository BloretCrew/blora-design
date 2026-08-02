# Contract status policy (Phase 10 Preflight)

> Until §26 DoD farms catch up, **do not treat every `status: "stable"` in `*.contract.json` as “ship-ready stable”.**

## Meanings (working)

| Status | Meaning for 2.0 alpha / preflight |
|--------|-------------------------------------|
| **stable** (in file today) | *Aspirational / implemented surface* — API+CSS+Story exist; **not** full Playwright/axe/visual DoD |
| **beta** | Explicitly unstable or subset path; may change |
| **experimental** | May be removed or redesigned |

## Governance until Beta freeze

1. **Marketing / README “stable core”** lists only packages/components that pass Preflight + documented browser smoke (expand over time). Default public claim: **2.0.0-alpha**, not “all contracts stable”.
2. **Do not mass-rewrite 42 contracts in one PR** without a scripted audit; prefer:
   - Keep file `status` as-is for now, **or**
   - Batch demote components without unit/browser coverage to `beta` in a dedicated PR.
3. **component-matrix.md** `✅` means “implemented available”, **not** §26 DoD.
4. Promotion to true **stable** requires: unit + browser interaction (or intentional CSS-only) + axe smoke where interactive + contract review.

## Next actions

- [ ] Optional script: list contracts with `stable` and no matching `tests/**` coverage → candidates for demotion  
- [ ] After Preflight green, publish Alpha with honest status wording  
- [ ] Before Beta API freeze, align contract status with DoD checklist in `remaining-work.md` §3.4  

See also: `remaining-work.md` §3.0.6, ADR-013.
