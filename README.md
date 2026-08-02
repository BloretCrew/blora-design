# Blora Design

> **Blora Design 2.0** — token-driven, dark-friendly, **zero runtime dependency** Web UI design system.  
> Brand prefix **Blora**; product name **Blora Design** (`blora-*` classes / package scope).

**Package** `@bloret-crew/blora-design` · **Version** `2.0.0-alpha.0` · **License** Apache-2.0  
**Repo** [BloretCrew/blora-design](https://github.com/BloretCrew/blora-design)

**Status:** Phase 9 (add-ons + core gap fill) complete under the repo’s scoped DoD. Full-spec component DoD and publish track → **Phase 10**.  
**Master remaining-work checklist:** [`docs/refactor/remaining-work.md`](./docs/refactor/remaining-work.md)

Interactive demos: **Storybook** (`pnpm storybook`). Frozen 1.x reference: `legacy/showcase-v1.html` (not the 2.0 recommended entry).

---

## What it is (2.0)

| Piece | Role |
|-------|------|
| **Design tokens + foundations CSS** | DTCG → generated CSS; themes / dark |
| **Per-component CSS** | Import only what you need (or `blora.css` aggregate) |
| **ESM API** | Headless `createXxxController`, services (`toast`, `notify`), a few Web Components (`blora-select`, `blora-dialog`) |
| **Contracts** | `packages/blora-design/contracts/*.contract.json` |

Not a React/Vue component library by default. Use native HTML + CSS + controllers (or light framework wrappers you own).

**Does not include:** business APIs, WebSockets, full WYSIWYG, mandatory React runtime.

---

## 30-second start (2.0)

```bash
pnpm add @bloret-crew/blora-design
```

```js
import "@bloret-crew/blora-design/tokens.css";
import "@bloret-crew/blora-design/foundations.css";
import "@bloret-crew/blora-design/components/button.css";
import {
  VERSION,
  setButtonLoading,
  createTableController,
  toast,
  defineBloraSelect,
} from "@bloret-crew/blora-design";

defineBloraSelect();
console.log(VERSION); // e.g. 2.0.0-alpha.0
```

```html
<button type="button" class="blora-button" data-variant="primary">主操作</button>
<button type="button" class="blora-button" data-variant="outline">次操作</button>

<div class="blora-table-wrap" data-blora-selectable>
  <table class="blora-table" id="demo">
    <!-- business columns only; selection column is injected by createTableController -->
  </table>
</div>
```

```js
createTableController(document.querySelector(".blora-table-wrap"));
toast("已保存");
```

> **Not recommended for new 2.0 apps:** global `Blora.init()`, `blora.js` UMD, or `blora-btn blora-btn--primary`.  
> Those belong to **1.x** / optional **compat** (`legacy/v1/`, `compat/v1`). See [migration](./docs/migration/v1-to-v2.md).

Optional add-ons:

```bash
pnpm add @bloret-crew/blora-design-markdown @bloret-crew/blora-design-theming
# also: thread, qrcode, effects, layout
```

---

## Architecture defaults

| Pattern | When |
|---------|------|
| Native HTML + CSS | Presentational (Alert, Tag, List, …) |
| Headless controller | Composite behavior on real DOM (Table, Tree, Form, Drawer, …) |
| Custom Element | Shipped CE surface (Select, Dialog, …) |

Full FA-WC-for-everything is **not** the 2.0 default (ADR-009 in `docs/refactor/decisions.md`).

---

## Visual baseline

2.0 visuals must remain traceable to the locked 1.x showcase baseline (`legacy/`, `docs/refactor/visual-baseline.json`).  
Use tokens (`--blora-*`); do not invent a second design system.

Human usage guide: [`docs/guide.md`](./docs/guide.md). Tokens: [`docs/standards.md`](./docs/standards.md).

---

## Capability map (high level)

| Area | 2.0 notes |
|------|-----------|
| Primitives | Button (`.blora-button` + `data-variant`), Field, Input, Checkbox, … |
| Overlays | Dialog CE, Drawer controller, Popover, Tooltip, Toast / Notify |
| Data | Table controller: sort, page, columns, virtual Y/X, **built-in row select** |
| Forms | `createFormController`, Tree Select, Mentions, … (many paths still **beta** in contracts) |
| Add-ons | Markdown, Thread, QRCode, Effects, Layout, Theming |

Component migration status: [`docs/refactor/component-matrix.md`](./docs/refactor/component-matrix.md).

---

## Repo layout (2.0 monorepo)

```
blora-design-2/
├── packages/blora-design/   # core ESM + CSS + contracts + Storybook
├── packages/tokens/        # token sources / generators
├── addons/                 # markdown, thread, qrcode, effects, layout, theming
├── legacy/                 # frozen 1.x sources + visual baselines (do not delete)
├── docs/                   # guide, standards, refactor trackers, migration
├── Blora-Design-2.0-Refactor-Spec.md
└── pnpm-workspace.yaml
```

```bash
pnpm install
pnpm build:tokens
pnpm --filter @bloret-crew/blora-design run typecheck
pnpm --filter @bloret-crew/blora-design exec vitest run
pnpm storybook
```

---

## Docs

| Doc | Role |
|-----|------|
| [**Guide (2.0)**](./docs/guide.md) | Recommended usage & migration mindset |
| [Standards](./docs/standards.md) | Design tokens & a11y principles |
| [Framework](./docs/framework.md) | Historical 1.x detail **for migration only**; 2.0 pointer at top |
| [Migration v1→v2](./docs/migration/v1-to-v2.md) | Migration entry (stub → expands in Phase 10) |
| [Remaining work](./docs/refactor/remaining-work.md) | **Master checklist until refactor done** |
| [Status](./docs/refactor/status.md) | Phase summary |

AI-oriented skim: [`llms.txt`](./llms.txt).

---

## Versioning

- Current line: **`2.0.0-alpha.*`** — API may still change before beta freeze.  
- 1.x remains available on npm for existing sites; do not treat 1.x CDN `@1` as the 2.0 guide.  
- Release automation: see `.github/workflows/` (publish still tied to maintainer process).

---

## License

Apache-2.0 · see `LICENSE` and `NOTICE`.
