# Basic HTML example (2.0 beta)

Requires a prior monorepo build:

```bash
pnpm --filter @bloret-crew/blora-design run build
```

Serve from the **repo root** (so relative paths to `packages/blora-design/dist` work):

```bash
npx serve .
# open /examples/basic/
```

Or open `index.html` via a static server of your choice. File:// may block ES modules in some browsers.

Production install:

```bash
pnpm add @bloret-crew/blora-design
```

See `docs/guide.md`.
