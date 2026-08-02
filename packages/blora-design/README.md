# @bloret-crew/blora-design

Blora Design 2.0 — token-driven, accessible, zero-dependency Web UI design system.

**Status: 2.0.0-alpha.1** (Phase 10 Alpha; pre-Beta package surface — see monorepo `CHANGELOG.md`)

### Entry points

| Import | Notes |
|--------|--------|
| `@bloret-crew/blora-design` | Main ESM (tree-shake friendly) |
| `@bloret-crew/blora-design/auto` | Side-effect: define `blora-select` + `blora-dialog` |
| `@bloret-crew/blora-design/button` (also select/dialog/table/toast) | JS subpaths |
| `@bloret-crew/blora-design/blora.global.js` | IIFE CDN → `globalThis.Blora` |
| `@bloret-crew/blora-design/compat/v1` | 1.x compatibility |
| `@bloret-crew/blora-design/custom-elements.json` | CEM |
| `@bloret-crew/blora-design/component-manifest.json` | Component list |

`sideEffects`: CSS under `dist/*.css` and `dist/auto.js` only.

## Installation

```sh
pnpm add @bloret-crew/blora-design
```

## Usage (2.0)

```js
import "@bloret-crew/blora-design/tokens.css";
import "@bloret-crew/blora-design/foundations.css";
import "@bloret-crew/blora-design/components/button.css";
import { setButtonLoading, createTableController, toast } from "@bloret-crew/blora-design";
```

```html
<button type="button" class="blora-button" data-variant="primary">OK</button>
```

- Prefer **native HTML + CSS** or **headless controllers**; use Web Components where shipped (`blora-select`, `blora-dialog`).
- Do **not** treat 1.x global `Blora.*` as the 2.0 API. Migration: `compat/v1`, `legacy/v1/`, monorepo codemod.
- Human guide (Chinese): [`docs/guide.md`](../../docs/guide.md)

## License

Apache-2.0
