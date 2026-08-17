# Showcase v2

Full-page demo mirroring the **section inventory** of the archived 1.x showcase (`D:\MyFiles\Documents\projects\blora-design\legacy\showcase-v1.html`), implemented with **Blora Design 2.0 only**.

Published at **https://bloretcrew.github.io/blora-design/** (`Pages` workflow on `master`).

## Run

```bash
# from monorepo root — always full build so dist CSS exists
pnpm --filter @bloret-crew/blora-design build

# serve (file:// may break CSS @import in some browsers)
python -m http.server 8765
# open http://127.0.0.1:8765/examples/showcase-v2/
```

Assets:

- `../../packages/blora-design/dist/blora.css`
- `../../packages/blora-design/dist/blora.global.js`

## Structure tests

```bash
pnpm --filter @bloret-crew/blora-design exec vitest run tests/showcase-v2-structure.test.ts
```
