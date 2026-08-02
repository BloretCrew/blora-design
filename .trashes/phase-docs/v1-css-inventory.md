# Blora Design 1.x — CSS Public Surface Inventory

> Machine-readable companion: [`v1-css-inventory.json`](./v1-css-inventory.json)
> Source: `blora.css` (v1.0.0, Apache-2.0, 4,499 lines)

This document is a human-readable summary of the structured JSON inventory. It covers every `--blora-*` custom property, every `.blora-*` public class, every `data-blora-*` attribute, the structural organization, and notable patterns flagged for the 2.0 refactor.

---

## 1. CSS Custom Properties (Design Tokens)

The default light-mode (Coral) tokens live in a single `:root` block (lines 14–157). They are grouped below by category. See the JSON for exact values, selectors, and line numbers.

### Color / primitive tokens (24)

Background/surface scale (`--blora-background`, `--blora-surface-1..3`), text scale (`--blora-text-strong` … `--blora-text-disabled`), `--blora-border-subtle`, and the functional accents: `--blora-primary`, `--blora-primary-hover`, `--blora-primary-soft`, `--blora-danger`, `--blora-accent-neutral`(+`-soft`), `--blora-info`(+`-soft`), `--blora-success`(+`-soft`), `--blora-support`, `--blora-warning`, `--blora-accent-secondary`.

### Spacing tokens (13)

`--blora-space-0` … `--blora-space-12` (0 → 8rem), starting at 4px with a 1.5× progression.

### Typography tokens (19)

Font stacks (`--blora-font-heading/sans/mono`), text sizes (`--blora-text-xs` … `--blora-text-5xl`), line heights (`--blora-leading-tight/normal/loose`), letter tracking (`--blora-tracking-tight/normal/wide/caps`).

### Radius tokens (7)

`--blora-radius-xs/sm/md/lg/xl/2xl/full` (6px → 9999px).

### Shadow tokens (8)

`--blora-shadow-1..4`, `--blora-shadow-inset`, `--blora-shadow-primary`, plus the focus rings `--blora-focus-ring` / `--blora-focus-ring-strong`.

### Duration / easing tokens (8)

`--blora-ease`, `--blora-ease-soft`, `--blora-ease-overshoot`, `--blora-dur-fast/base/slow/emphasis`, `--blora-tabs-fade-duration`.

### Z-index tokens (6)

`--blora-z-base` (1), `--blora-z-sticky` (100), `--blora-z-dropdown` (1000), `--blora-z-drawer` (1100), `--blora-z-modal` (1200), `--blora-z-toast` (1300).

### Border tokens (3)

`--blora-border`, `--blora-border-strong`, `--blora-border-primary` (composite `1px solid …` values).

### Component metrics (5)

`--blora-control-height`, `--blora-control-pad-x`, `--blora-control-radius`, `--blora-range-track-size`, `--blora-range-thumb-size`. These are also overridden by `html[data-blora-size="sm|lg"]` for global density.

### Derived color tokens (15)

`--blora-on-accent`, `--blora-brand-glyph`, `--blora-on-media`, `--blora-media-overlay`(+`-strong`), `--blora-media-indicator`, `--blora-primary-tint`, `--blora-selection-bg`, `--blora-overlay-modal`, `--blora-overlay-drawer`, `--blora-code-bg`, `--blora-code-fg`, `--blora-banner-bg`, `--blora-banner-fg`, `--blora-tooltip-bg`. These compose from primitives via `color-mix()` so they auto-track palette changes.

### Texture tokens (2)

`--blora-background-texture`, `--blora-background-overlay` (both `none` by default; dark mode sets a low-contrast radial-gradient texture).

### Component-specific tokens (40+)

A large set of component-local variables — some `--blora-*` prefixed, some not. Highlights:

- **Button locals** (not prefixed): `--btn-bg`, `--btn-fg`, `--btn-bd` on `.blora-btn` and its variants.
- **Switch locals**: `--switch-w/h/pad/knob` on `.blora-switch__track`.
- **JS-driven geometry**: `--blora-tab-w/x/h/y`, `--blora-collapse-h`, `--blora-tree-h`, `--blora-float-shift-x/top/left`, `--blora-deck-y/scale/opacity`, `--blora-diff-position`.
- **Overridable by host**: `--blora-diff-ratio`, `--blora-gallery-ratio`, `--blora-line-clamp`, `--blora-qr-size`, `--blora-masonry-cols`, `--blora-sidebar-width/min-height`, `--blora-hero-min-height`, `--blora-media-ratio`, `--blora-chart-min-h`.
- **Phone mockup geometry**: `--blora-phone-rim/max/radius/screen-radius/island-radius/…` (six derived `calc()` tokens scaled from a 462px daisyUI reference).
- **Speed dial**: `--blora-sd-gap/r/trigger-size/action-size`.
- **Navbar**: `--blora-navbar-inset/max-width/radius/padding`.

### Palette overrides (light)

9 palette presets at `:root[data-blora-palette="<name>"]` (lines 164–234): `cinnabar`, `indigo`, `lotus`, `ocean`, `graphite`, `mono`, `circuit`, `coral` (default), `dusk`. Each redefines **only color + a few derived tokens** (`--blora-on-accent`, overlays, `--blora-code-*`, `--blora-banner-bg`, `--blora-tooltip-bg` where needed). Spacing/radius/shadow/motion/typography are inherited unchanged - a deliberate design constraint.

### Dark mode overrides

- Global dark (`:root.blora-dark, :root.blora-dark body`, line 4218) redefines all surface/text/border tokens, overlays, code/banner/tooltip tokens, **all four shadows**, the inset shadow, and sets a low-contrast background texture + `color-scheme: dark`.
- Each palette has its own dark variant (`:root.blora-dark[data-blora-palette="…"]`). Functional colors (`--blora-primary` etc.) **are** overridden for indigo, lotus, ocean, graphite, mono, circuit, coral, dusk - but **not** for cinnabar (which only overrides surface/text/code tokens).
- Component-level dark adjustments (`.blora-dark …`) patch: secondary button, solid tag, contrast avatar, `pre`, banner `::before`, tooltip bubble, and post reply background.

---

## 2. Public CSS Classes (`.blora-*`)

The stylesheet exposes ~14 component groups with bases, modifiers, state classes, and sub-elements. Below is a summary; the JSON has the full per-component breakdown.

| Component group      | Base classes                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Modifier examples                                                                                                                                                                     | State examples                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scope/page**       | `body.blora-page`, `.blora-scope`, `.blora-portal`                                                                                                                                                                                                                                                                                                                                                                                                                             | —                                                                                                                                                                                     | —                                                                                                                                             |
| **Typography**       | `.blora-h1..h4`, `.blora-text-lead/muted/faint/primary/mono/caps`, `.blora-prose`, `.blora-quote`, `.blora-code`, `.blora-pre`                                                                                                                                                                                                                                                                                                                                                 | —                                                                                                                                                                                     | —                                                                                                                                             |
| **Layout**           | `.blora-container/stack/row/actions/grid/card/panel/spacer/divider`                                                                                                                                                                                                                                                                                                                                                                                                            | `--prose/--wide`, `--sm/--lg/--xl`, `--hover/--flat/--inset`, `--vert/--dashed/--text`                                                                                                | —                                                                                                                                             |
| **Buttons**          | `.blora-btn`, `.blora-fab`, `.blora-btn-group`                                                                                                                                                                                                                                                                                                                                                                                                                                 | `--primary/--secondary/--danger/--ghost/--outline/--text`, `--xs/--sm/--lg/--xl/--icon`, `--static`                                                                                   | `.is-loading`, `.is-hidden`                                                                                                                   |
| **Forms**            | `.blora-field/label/hint/error`, inputs (`input/textarea/select/search/number`), `.blora-checkbox/radio/switch/slider/rate/segmented/tags-input/upload/dropzone/otp/color-picker/datepicker/file-input/filter/validator`                                                                                                                                                                                                                                                       | `--req/--popup/--searchable/--multiple/--indeterminate`, `--sm/--lg`, `--success/--validating/--error`                                                                                | `.is-open`, `.is-active`, `.is-selected`, `.is-disabled`, `.is-dragover`, `.is-over-limit`                                                    |
| **Tags & badges**    | `.blora-tag`, `.blora-badge`, `.blora-indicator`, `.blora-avatar-wrap`, `.blora-dot`                                                                                                                                                                                                                                                                                                                                                                                           | `--primary/--neutral/--info/--success/--warning/--solid/--removable`, `--dot/--circle/--pill`, position variants                                                                      | —                                                                                                                                             |
| **Avatar**           | `.blora-avatar`, `.blora-avatar-group`                                                                                                                                                                                                                                                                                                                                                                                                                                         | `--xs/--sm/--lg/--xl`, `--primary/--neutral/--info/--success/--contrast/--square`                                                                                                     | —                                                                                                                                             |
| **Progress/loading** | `.blora-progress`, `.blora-spinner`, `.blora-skeleton`                                                                                                                                                                                                                                                                                                                                                                                                                         | `--circular`, `--striped/--neutral/--success/--info`, `--sm/--lg`, `--text/--title/--circle/--block`                                                                                  | —                                                                                                                                             |
| **Navigation**       | `.blora-navbar`, `.blora-palette-picker/card`, `.blora-tabs`, `.blora-breadcrumb`, `.blora-pagination`, `.blora-steps/step`, `.blora-menu`, `.blora-dropdown`, `.blora-brand-mark`                                                                                                                                                                                                                                                                                             | `--floating/--full`, `--pills/--vert`                                                                                                                                                 | `.is-active`, `.is-open`, `.is-disabled`, `.is-entering`                                                                                      |
| **Data display**     | `.blora-table*`, `.blora-list`, `.blora-collapse`, `.blora-timeline`, `.blora-tree`, `.blora-stat`, `.blora-descriptions`, `.blora-carousel`, `.blora-image`, `.blora-diff`, `.blora-hover-gallery`, `.blora-empty/result`, `.blora-calendar`, `.blora-transfer`, `.blora-cascader`                                                                                                                                                                                            | `--striped/--virtual`, `--pills/--vert`, `--hover/--frame/--preview`, `--success/--warning/--error/--info`                                                                            | `.is-loading/--empty/--dragging/--drag-over/--open/--active/--selected/--disabled/--today/--other/--dragging`                                 |
| **Feedback**         | `.blora-alert`, `.blora-banner`, `.blora-message`, `.blora-notification`, `.blora-tooltip`, `.blora-popover`, `.blora-popconfirm`, `.blora-modal`, `.blora-cmdk-*`, `.blora-drawer`, `.blora-toast(-container)`, `.blora-confirm-dialog`                                                                                                                                                                                                                                       | `--info/--success/--warning/--danger/--ghost`, `--lg/--sm/--cmdk`, `--right/--left/--top/--bottom`, `--bottom`                                                                        | `.is-open`, `.is-closing`, `.is-leaving`, `.is-portaled`                                                                                      |
| **Utilities**        | `.blora-center`, `.blora-hide`, `.blora-mt/mb-*`, `.blora-w-*`, `.blora-flex*`, `.blora-gap-*`, `.blora-items-center`, `.blora-justify-between`, `.blora-image-muted/monochrome`, `.blora-text-center/right`                                                                                                                                                                                                                                                                   | —                                                                                                                                                                                     | —                                                                                                                                             |
| **Extended**         | `.blora-swap`, `.blora-speed-dial(-stage/-grid)`, `.blora-fieldset`, `.blora-file-input`, `.blora-filter`, `.blora-validator`, `.blora-sidebar-layout`, `.blora-dock`, `.blora-megamenu`, `.blora-hero`, `.blora-footer`, `.blora-deck`, `.blora-kbd`, `.blora-chat`, `.blora-countdown`, `.blora-text-rotate`, `.blora-text-fx`                                                                                                                                               | `--rotate/--left/--flower/--radial`, `--flat/--static`, `--center/--surface/--compact`, `--sm`, `--end`, text-fx: `--grow/--shrink/--shake/--nod/--jitter/--explode/--ripple/--bloom` | `.is-open`, `.is-play`, `.is-loop`, `.is-active`, `.is-front`, `.is-dragging`                                                                 |
| **Advanced**         | `.blora-image-preview`, `.blora-notify-container`, `.blora-affix`, `.blora-anchor`, `.blora-treeselect`, `.blora-autocomplete`, `.blora-mentions`, `.blora-tour-*`, `.blora-watermark`, `.blora-splitter`, `.blora-typo-*`, `.blora-qrcode`, `.blora-skeleton-card/list`, `.blora-backtop`, `.blora-masonry`, `.blora-comment`, `.blora-thread/post`, `.blora-md`, `.blora-media-frame`, `.blora-chart`, `.blora-mockup(--browser/--code/--window/--phone)` + alias `*-mockup` | container position variants, `--vertical`, `--silver/--accent/--flush/--elevated`, `--reply`, `--center`                                                                              | `.is-open`, `.is-fixed`, `.is-active`, `.is-selected`, `.is-disabled`, `.is-leaving`, `.is-dragging`, `.is-visible/--hidden`, `.is-collapsed` |

### Notable class conventions

- **State classes** use a consistent `.is-*` prefix: `.is-open`, `.is-active`, `.is-selected`, `.is-disabled`, `.is-loading`, `.is-dragging`, `.is-drag-over`, `.is-hidden`, `.is-visible`, `.is-collapsed`, `.is-leaving`, `.is-fixed`, `.is-front`, `.is-dragover`, `.is-over-limit`, `.is-play`, `.is-loop`, `.is-clickable`, `.is-entering`, `.is-instant`, `.is-placeholder`, `.is-ghost`, `.is-switching`, `.is-when-hidden`, `.is-validating`, `.is-success`, `.is-error`.
- **BEM-like sub-elements** use `__`: `.blora-card__title`, `.blora-modal__dialog`, `.blora-tabs__indicator`, etc.
- **Modifiers** use `--`: `.blora-btn--primary`, `.blora-card--hover`, `.blora-tabs--vert`, etc.
- Some components have **alias class names** for backward compat (e.g., `.blora-browser-mockup` alongside `.blora-mockup--browser`).

---

## 3. `data-blora-*` Attributes

| Attribute                   | Applied to             | Values                                                               | Purpose                                                               |
| --------------------------- | ---------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `data-blora-palette`        | `:root`                | cinnabar, indigo, lotus, ocean, graphite, mono, circuit, coral, dusk | Switch color palette preset (light + dark)                            |
| `data-blora-size`           | `html`                 | sm, lg                                                               | Global density override (control height + text-sm)                    |
| `data-blora-navbar-variant` | `html`                 | floating, full                                                       | Navbar layout variant                                                 |
| `data-variant`              | `.blora-navbar`        | floating, full                                                       | Per-instance navbar variant (backward compat)                         |
| `data-blora-error-ui`       | form fields            | popup                                                                | Error display style (comment-ref; CSS keys off `.blora-error--popup`) |
| `data-blora-when`           | `.blora-form` children | -                                                                    | Conditional field visibility (JS-driven)                              |
| `data-blora-sort`           | `th`                   | -                                                                    | Sortable column header                                                |
| `data-blora-fixed`          | `td`/`th`              | left, right                                                          | Sticky fixed table columns                                            |
| `data-blora-preview`        | `.blora-image`         | -                                                                    | Enable lightbox preview                                               |
| `data-blora-text-fx`        | text                   | grow, shrink, shake, nod, jitter, explode, ripple, bloom             | Text animation (comment-ref; classes are `.blora-text-fx--*`)         |
| `data-blora-countup`        | `.blora-stat__value`   | -                                                                    | Count-up animation (CSS only sets tabular-nums)                       |
| `data-layout`               | `.blora-form`          | horizontal, inline                                                   | Form layout (alt to `--horizontal`/`--inline` classes)                |
| `data-prefix`               | `.blora-mockup__line`  | -                                                                    | Code-mockup line label                                                |

Note: `data-variant` and `data-layout` and `data-prefix` are **not** `data-blora-*` prefixed but are consumed by selectors.

---

## 4. Organization / Cascade Structure

**No `@layer` declarations.** The stylesheet is a single flat file ordered by section (16 numbered sections, lines marked with `/* ===…=== */` banners):

1. Design Tokens (`:root`)
1. Palette Presets (light, 9 palettes)
1. Reset (scoped via `:where()`)
1. Typography
1. Layout
1. Buttons
1. Forms
1. Tags & Badges
1. Avatar
1. Progress & Loading
1. Navigation
1. Data Display
1. Feedback
1. Utilities
1. Extended Components + Advanced Components
1. Dark Mode
1. Keyframes
1. Reduced Motion + RTL (appended)

**Scoping mechanism:** Three root scopes gate base/reset/typography: `body.blora-page`, `.blora-scope`, `.blora-portal`. These are wrapped in `:where()` selectors (zero specificity) so the reset never outranks component styles. Component classes (`.blora-*`) work inside any of these scopes. Palette/dark/size modes switch via `:root[data-blora-*]` and `:root.blora-dark` attribute/class selectors.

**Responsive strategy:** `@media (max-width: …)` for viewport breakpoints (880/900/720/560px) **and** `@container (max-width: …)` queries for container-query-based reflow (cards, panels, fieldsets, tabs, calendars declare `container-type: inline-size`). The `@container` rules let components reflow when nested in narrow containers regardless of viewport. `@supports` is used for `corner-shape: superellipse()` on phone mockups.

---

## 5. Notable Patterns

### `!important` usage (18 occurrences)

- **Native-input resets** (lines 306–308, 969–973): force-zero outline/border/box-shadow/background on `.blora-select-trigger__input` to avoid a "rectangular inner box" appearance.
- **Button loading** (line 595): `color: transparent !important` to hide text behind the spinner.
- **Conditional fields** (line 716): `display: none !important` for `[data-blora-when].is-when-hidden` / `[hidden]`.
- **Native chrome hiding** (line 1321): datepicker calendar-picker indicator.
- **Mobile navbar hiding** (lines 1640, 1644): hide menu/secondary at `max-width: 560px`.
- **Utility** (line 2301): `.blora-hide { display: none !important; }`.
- **Collapse** (line 3593): `max-height: 0 !important` for collapsed post replies.
- **Reduced motion** (lines 4464–4466): force `0.01ms` durations.

> For 2.0: most of these can be replaced with `@layer`-based ordering or more specific selectors; the reduced-motion guard is acceptable.

### `transition: all` usage (9 occurrences)

On `.blora-btn`, `.blora-select-trigger`, `.blora-select-menu`, `.blora-select-option`, `.blora-checkbox__box`, `.blora-radio__dot`, `.blora-switch__track`, `.blora-tags-input`, `.blora-datepicker__btn`. A refactor should prefer explicit transition-property lists to avoid unintended transitions and perf cost.

### Z-index

- **6 tokens** (`--blora-z-base/sticky/dropdown/drawer/modal/toast`) with values 1 / 100 / 1000 / 1100 / 1200 / 1300.
- **12 `calc()` offsets** stack components above/below token layers (e.g. `.blora-image-preview` at `calc(var(--blora-z-modal) + 20)` = 1220; `.blora-tour-pop` at `calc(var(--blora-z-modal) + 6)` = 1206; `.blora-fab`/`.blora-backtop` at `calc(var(--blora-z-sticky) + 10)` = 110).
- **6 hardcoded** z-index values (slider/range tips = 10; indicator item = 2; fixed table cells = 2–3; tabs indicator/tab = 0–1). These should migrate to tokens.

### Hardcoded colors in component CSS (not in `:root`)

- **Color picker internals**: `#000`/`#fff` spectrum gradient (line 1288), rainbow `#f00,#ff0,…` hue slider (line 1298). These are inherently fixed.
- **Image preview / tour overlays**: hardcoded `rgba(12,10,14,0.82)`, `rgba(20,18,22,0.45)`, `rgba(255,255,255,0.12/0.22/0.75/0.82)`, `#fff` (lines 3029–3060, 3190, 3211). These sit above the token system on dark backdrops - candidates for `--blora-on-media` / `--blora-media-overlay` tokens.
- **Phone mockup**: hardcoded `#6b6b6b` rim (tokenized as `--blora-phone-rim`), `#000` background/camera (lines 3950–3992), `#c47a4a` accent rim (line 4055).
- **Fallback literal**: `var(--blora-on-accent, #fff)` on `.blora-error--popup::before` (line 671).

### Other patterns

- **`:where()`** is used extensively for zero-specificity reset/base rules - good practice, keep for 2.0.
- **`:is()`** groups variant selectors (navbar, media elements, validator inputs, floating panels).
- **`:has()`** (modern relative selector) is used in ~8 places: speed-dial close/main swapping, conditional `:has(input:checked)` for filter reset, `:has(:user-invalid)` validator, megamenu open detection, mockup toolbar/dots presence, `html:has(body.blora-page)`. Relies on `:has()` support.
- **`:user-invalid` / `:user-valid`** pseudo-classes used in `.blora-validator` (modern, progressive enhancement).
- **`backdrop-filter: blur()`** on navbar, floating menus/popovers/panels, dock, megamenu, modal mask, image preview - broad usage; degrades gracefully (opaque fallbacks provided).
- **`container-type: inline-size`** on 9 components enabling container queries.
- **`color-mix(in srgb, …)`** used pervasively for derived tints/overlays - a 2.0 baseline dependency on `color-mix` support.
- **`@supports (corner-shape: superellipse())`** progressive enhancement for phone mockup corners.
- **`prefers-reduced-motion`** guard zeroes all transitions/animations (via `:where()` scope + `!important`).
- **`[dir="rtl"]`** overrides for 12 selector groups (table, select, search, fab/backtop, drawer, form label, breadcrumb, pagination, fixed columns).
- **27 `@keyframes`** animations: spin/pulse/shimmer/stripe/fade-in/out/pop-in/out/slide-*(4 dirs × in/out)/toast/tab-panel + 8 text-fx animations (grow/shrink/shake/nod/jitter/explode/ripple/bloom).
- **Local (non-`--blora-*`) button tokens** (`--btn-bg/-fg/-bd`) - a private convention reused across button variants, the banner secondary, and speed-dial actions.

---

## 6. Refactor Considerations

Based on the inventory, patterns that the 2.0 refactor (per `Blora-Design-2.0-Refactor-Spec.md`) should address:

1. **No `@layer`** - introducing cascade layers would make ordering explicit and reduce reliance on source order + `:where()`.
2. **`transition: all`** (9 sites) should become explicit property lists.
3. **Hardcoded z-index** (6 sites) should migrate to tokens.
4. **Hardcoded overlay/preview colors** should reuse `--blora-on-media` / `--blora-media-overlay*`.
5. **Non-prefixed local tokens** (`--btn-*`, `--switch-*`) break the `--blora-*` namespace convention.
6. **Alias class names** (`*-mockup` alongside `--mockup`) create duplication.
7. **`!important`** usage (18 sites) should be reduced via layering/specificity.
8. **Component-specific tokens** (40+) are inconsistently prefixed; some are `--blora-*`, some are component-local without the prefix.
9. **Cinnabar dark** lacks functional-color overrides (inherits light primary/danger) - a possible gap.
10. **`:has()` dependency** - used in core components (validator, filter reset, speed-dial); ensure baseline support is documented.
