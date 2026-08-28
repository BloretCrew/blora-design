# Blora Design

> **Blora Design 2.0** — token-driven, dark-friendly, **zero runtime dependency** Web UI design system.
> Brand prefix **Blora**; product name **Blora Design** (`blora-*` classes / package scope).

**Package** `@bloret-crew/blora-design` · **Version** `2.0.0` · **License** Apache-2.0
**Repo** [BloretCrew/blora-design](https://github.com/BloretCrew/blora-design)

**Status:** Blora Design 2.0 Stable (`2.0.0`) — final acceptance complete.
**Migration standard:** [`docs/migration/from-any-ui-to-blora-design.md`](./docs/migration/from-any-ui-to-blora-design.md)
**Master remaining-work checklist:** [`docs/refactor/remaining-work.md`](./docs/refactor/remaining-work.md)

Interactive demos: **[showcase](https://bloretcrew.github.io/blora-design/)**. Frozen 1.x reference is archived at `D:/MyFiles/Documents/projects/blora-design/legacy/` (not the 2.0 recommended entry).

---

## What it is (2.0)

| Piece | Role |
|-------|------|
| **Design tokens + foundations CSS** | DTCG → generated CSS; themes / dark |
| **Per-component CSS** | Import only what you need (or `blora.css` aggregate) |
| **ESM API** | Composite Custom Elements, explicit Table/Form headless APIs, services (`message`, `notify`) |
| **Contracts** | `packages/blora-design/contracts/*.contract.json` |

Not a React/Vue runtime library. Use native HTML + CSS for primitives and Composite Custom Elements for structure-sensitive controls.

**Does not include:** business APIs, WebSockets, full WYSIWYG, mandatory React runtime.

---

## 30-second start (2.0)

```bash
pnpm add @bloret-crew/blora-design@latest
```

```js
import "@bloret-crew/blora-design/blora.css";
import "@bloret-crew/blora-design/auto";
import {
  VERSION,
  setButtonLoading,
  createTableController,
  message,
} from "@bloret-crew/blora-design";

console.log(VERSION); // e.g. 2.0.0
```

```html
<button type="button" class="blora-button" data-variant="primary">主操作</button>
<button type="button" class="blora-button" data-variant="outline">次操作</button>
<blora-range min="0" max="100" values="25,70"></blora-range>
<blora-search placeholder="搜索项目…"></blora-search>

<div class="blora-table-wrap" data-blora-selectable>
  <table class="blora-table" id="demo">
    <!-- business columns only; selection column is injected by createTableController -->
  </table>
</div>
```

```js
createTableController(document.querySelector(".blora-table-wrap"));
message.success("已保存");
```

> **Not recommended for new 2.0 apps:** global `Blora.init()`, `blora.js` UMD, or `blora-btn blora-btn--primary`.
> Those belong to frozen **1.x** (archived at `D:/MyFiles/Documents/projects/blora-design/legacy/`). 2.0 has no runtime compatibility layer. See [migration](./docs/migration/v1-to-v2.md).

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
| Composite Custom Element | Structure-sensitive controls (Range, Pickers, Search, Transfer, Tabs, …) |
| Headless controller (advanced) | Open data DOM (Table, Tree, Form, Drawer, …) |

Composite CE is the default for complex structure (ADR-015, superseding ADR-013). Full FA-WC-for-everything is still staged per form contract.

---

## Visual baseline

2.0 visuals must remain traceable to the locked 1.x showcase baseline (archived at `D:/MyFiles/Documents/projects/blora-design/legacy/`, metadata in `docs/refactor/visual-baseline.json`).
Use tokens (`--blora-*`); do not invent a second design system.

Human usage guide: [`docs/guide.md`](./docs/guide.md). Tokens: [`docs/standards.md`](./docs/standards.md).

---

## Capability map (high level)

| Area | 2.0 notes |
|------|-----------|
| Primitives | Button (`.blora-button` + `data-variant`), Field, Input, Checkbox, … |
| Overlays | Dialog CE, Drawer controller, Popover, Tooltip, Message / Notify |
| Data | Table controller: sort, page, columns, virtual Y/X, **built-in row select** |
| Forms | Range/Datepicker/Timepicker/Search/Transfer CE; advanced Form, Tree Select, Mentions controllers |
| Add-ons | Markdown, Thread, QRCode, Effects, Layout, Theming |

Component migration status: [`docs/refactor/component-matrix.md`](./docs/refactor/component-matrix.md).

---

## Repo layout (2.0 monorepo)

```
blora-design-2/
├── packages/blora-design/   # core ESM + CSS + contracts
├── packages/tokens/        # token sources / generators
├── addons/                 # markdown, thread, qrcode, effects, layout, theming
├── examples/showcase-v2/   # 2.0 component showcase (+ assets/)
├── docs/                   # guide, standards, refactor trackers, migration
└── pnpm-workspace.yaml

# Frozen 1.x sources + visual baselines were archived outside this repository:
# D:/MyFiles/Documents/projects/blora-design/legacy/
```

```bash
pnpm install
pnpm build:tokens
pnpm --filter @bloret-crew/blora-design run typecheck
pnpm --filter @bloret-crew/blora-design exec vitest run
```

---

## Docs

| Doc | Role |
|-----|------|
| [**Guide (2.0)**](./docs/guide.md) | Recommended usage & migration mindset |
| [Standards](./docs/standards.md) | Design tokens & a11y principles |
| [Framework](./docs/framework.md) | Historical 1.x detail **for migration only**; 2.0 pointer at top |
| [Migration from any UI](./docs/migration/from-any-ui-to-blora-design.md) | Strict migration standard for frameworks and hand-written UI |
| [Migration v1→v2](./docs/migration/v1-to-v2.md) | Historical 1.x mapping only |
| [Remaining work](./docs/refactor/remaining-work.md) | **Historical release checklist and post-release records** |
| [Status](./docs/refactor/status.md) | Phase summary |

AI-oriented skim: [`llms.txt`](./llms.txt).

---

## Versioning

- Current line: **`2.0.0` Stable** — the stable-core API and published contracts are frozen for the 2.0 line.
- 1.x is an unsupported historical line; Blora Design does not provide 1.x maintenance, security fixes, compatibility or migration support.
- The `latest` npm tag points to `2.0.0`; release automation is documented in `.github/workflows/`.
- Release automation: see `.github/workflows/` (publish still tied to maintainer process).

---

## License

Apache-2.0 · see `LICENSE` and `NOTICE`.
