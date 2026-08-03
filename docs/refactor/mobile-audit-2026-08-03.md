# Mobile / size / font audit (2026-08-03)

Quick pass while fixing Sidebar + Watermark. Not a full §26 matrix.

## Fixed this session

| Area | Issue | Fix |
|------|--------|-----|
| Sidebar layout | Viewport `@media` while Storybook canvas is narrow → broken two-column; mask `fixed` unusable under transforms; hard to close | Drawer mode from **component width** (`ResizeObserver` + `data-drawer`); absolute mask/aside; mask/Esc/nav click close |
| Watermark | Small host showed ~1 stamp | Tile size from host size; explicit `background-repeat: repeat`; re-paint on resize |
| Badge | Cross-device text offset | `line-height: 1` + grid center (earlier) |
| Tag | Inherited leading drift | `line-height: 1.25` |
| Avatar text | CJK metrics | grid + `line-height: 1` |
| Transfer | Side-by-side crushed on phone | Stack column ≤560px |
| Cascader panel | Wide columns overflow phone | `max-width: min(100%, 100vw-2rem)` + smaller column min |
| **Button** | Grid/flex **stretch** → tall “exploded” pills (sidebar 菜单) | `width: max-content; align-self: flex-start; height: auto` |
| **Palette picker** | ≤560px hid label → empty outline | Keep label + ellipsis |
| **Banner** | Narrow width → one-char vertical wrap | container query stack + smaller title + overflow-wrap |
| **Dialog** | Mobile bottom-sheet + persistent still closed outside | Stay centered; honor `close-on-outside-click="false"` |

## Already OK (spot check)

- Table wrap: `overflow-x: auto` + touch scroll
- Tabs nav: horizontal scroll, scrollbar hidden
- Dialog: bottom sheet ≤560px + safe-area
- Pagination: `overflow-x: auto`, item `line-height: 1`
- Navbar: hide menu/title ≤720px
- Dock / FAB / BackTop: fixed (viewport intentional)

## Known residual risks (not fixed now)

| Item | Risk | Notes |
|------|------|--------|
| Affix | `position: fixed` in Storybook transforms | Same class of bug as old sidebar; pin may misplace in docs canvas |
| Dropdown / Popover / Mentions | fixed or absolute min-width | May clip on 320px; need portal + flip (partial in controllers) |
| Megamenu | full-width panels | Mobile story may need dedicated collapse |
| Chart container | min widths | Depends on host chart lib |
| Storybook Docs | canvas vs viewport | Prefer container queries / ResizeObserver for layout chrome |
| i18n long strings | nowrap labels | German/long CN may overflow buttons without wrap policy |

## Suggested next pass

1. Affix + floating overlays: portal or absolute-within-host strategy consistent with sidebar.
2. Visual smoke at 320 / 375 / 768 in Playwright (expand `visual` project).
3. Font harness: CJK + system UI fonts screenshot for badge/tag/avatar/button.
