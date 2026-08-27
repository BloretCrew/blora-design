# @bloret-crew/blora-design

Blora Design 2.0 — token-driven, accessible, zero-dependency Web UI design system.

**Status: 2.0.0-rc.0** (Phase 10 RC; frozen stable-core package surface — see monorepo `CHANGELOG.md`)

## Entry points

| Import | Notes |
|--------|--------|
| `@bloret-crew/blora-design` | Main ESM (tree-shake friendly) |
| `@bloret-crew/blora-design/auto` | Side-effect: define the complete default Composite CE surface |
| `@bloret-crew/blora-design/button` (also select/dialog/table) | JS subpaths |
| `@bloret-crew/blora-design/blora.global.js` | IIFE CDN → `globalThis.Blora` |
| `@bloret-crew/blora-design/custom-elements.json` | CEM |
| `@bloret-crew/blora-design/component-manifest.json` | Component list |

`sideEffects`: CSS under `dist/*.css` and `dist/auto.js` only.

## Installation

```sh
pnpm add @bloret-crew/blora-design@beta
```

## Usage (2.0)

```js
import "@bloret-crew/blora-design/tokens.css";
import "@bloret-crew/blora-design/foundations.css";
import "@bloret-crew/blora-design/components/button.css";
import "@bloret-crew/blora-design/auto";
import { setButtonLoading, createTableController, message } from "@bloret-crew/blora-design";
```

```html
<button type="button" class="blora-button" data-variant="primary">OK</button>
<blora-range values="25,70"></blora-range>
<blora-search placeholder="Search…"></blora-search>
```

- Prefer **native HTML + CSS** for primitives and **Composite Custom Elements** for structure-sensitive controls. Headless controllers remain advanced APIs.
- Do **not** treat 1.x global `Blora.*` as the 2.0 API. There is no runtime 1.x compatibility layer — write 2.0 markup and tokens. Visual baseline is archived outside this repo (`D:/MyFiles/Documents/projects/blora-design/legacy/`).
- Human guide (Chinese): [`docs/guide.md`](../../docs/guide.md)

## License

Apache-2.0
