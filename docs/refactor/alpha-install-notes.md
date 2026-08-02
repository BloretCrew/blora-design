# Alpha install verification (2.0.0-alpha.1)

**Date:** 2026-08-02  
**Channel:** npm dist-tag `alpha`

## Packages on npm

| Package | `2.0.0-alpha.1` | `@alpha` | `latest` |
|---------|-----------------|----------|----------|
| `@bloret-crew/blora-design` | ✅ | 2.0.0-alpha.1 | **1.0.0** (1.x line preserved) |
| `@bloret-crew/blora-design-markdown` | ✅ | 2.0.0-alpha.1 | 2.0.0-alpha.1 |
| `@bloret-crew/blora-design-thread` | ✅ | 2.0.0-alpha.1 | 2.0.0-alpha.1 |
| `@bloret-crew/blora-design-qrcode` | ✅ | 2.0.0-alpha.1 | 2.0.0-alpha.1 |
| `@bloret-crew/blora-design-effects` | ✅ | 2.0.0-alpha.1 | 2.0.0-alpha.1 |
| `@bloret-crew/blora-design-layout` | ✅ | 2.0.0-alpha.1 | 2.0.0-alpha.1 |
| `@bloret-crew/blora-design-theming` | ✅ | 2.0.0-alpha.1 | 2.0.0-alpha.1 |

## Smoke install

Isolated temp dir:

```bash
npm install @bloret-crew/blora-design@2.0.0-alpha.1
node --input-type=module -e "import { VERSION, isBrowser } from '@bloret-crew/blora-design'; console.log(VERSION, isBrowser())"
# → 2.0.0-alpha.1 false

npm install @bloret-crew/blora-design-markdown@2.0.0-alpha.1 @bloret-crew/blora-design-qrcode@2.0.0-alpha.1
# renderMarkdown / buildQRMatrix import OK
```

## Consumer install

```bash
pnpm add @bloret-crew/blora-design@alpha
# optional add-ons
pnpm add @bloret-crew/blora-design-markdown@alpha
```

Feedback: GitHub Issues (bug / alpha feedback templates).
