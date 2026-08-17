# Button Migration: 1.x → 2.0

## Class Mapping

| 1.x                     | 2.0                                       | Notes                                                         |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| `.blora-btn`            | `.blora-button`                           | Full word, no abbreviation                                    |
| `.blora-btn--primary`   | `.blora-button[data-variant="primary"]`   | data attribute instead of BEM modifier                        |
| `.blora-btn--secondary` | `.blora-button[data-variant="secondary"]` |                                                               |
| `.blora-btn--danger`    | `.blora-button[data-variant="danger"]`    |                                                               |
| `.blora-btn--ghost`     | `.blora-button[data-variant="ghost"]`     |                                                               |
| `.blora-btn--outline`   | `.blora-button[data-variant="outline"]`   |                                                               |
| `.blora-btn--text`      | `.blora-button[data-variant="text"]`      |                                                               |
| `.blora-btn--xs`        | `.blora-button[data-size="xs"]`           |                                                               |
| `.blora-btn--sm`        | `.blora-button[data-size="sm"]`           |                                                               |
| `.blora-btn--lg`        | `.blora-button[data-size="lg"]`           |                                                               |
| `.blora-btn--xl`        | `.blora-button[data-size="xl"]`           |                                                               |
| `.blora-btn--icon`      | `.blora-button[data-size="icon"]`         | Circle by default; `data-shape="square"` for a rounded square |

## State Changes

| 1.x                     | 2.0                                                | Notes                 |
| ----------------------- | -------------------------------------------------- | --------------------- |
| `.blora-btn.is-loading` | `.blora-button[data-loading]` + `aria-busy="true"` | Semantic + ARIA       |
| `.blora-btn:disabled`   | `.blora-button:disabled`                           | Same native attribute |

## API Changes

The 2.0 `setButtonLoading(button, loading, options)` helper replaces any inline
loading logic. It sets `aria-busy`, `data-loading`, and optionally `disabled`
and swaps the accessible label.

## Before / After

### Before (1.x)

```html
<button class="blora-btn blora-btn--primary blora-btn--lg">Save</button>
```

### After (2.0)

```html
<button class="blora-button" type="button" data-variant="primary" data-size="lg">Save</button>
```

## Notes

- Always specify `type` explicitly (Spec §17.1: "默认不推断 type").
- Icon-only buttons must have `aria-label` (Spec §17.1).
- Optional `data-icon` is hydrated by `enhanceButtons()` using `createBloraIcon()`.
- Loading keeps the label visible and places the spinner before the text.
- `.blora-fab` and `.blora-button-group` remain class-based.
- Height is locked to `--blora-button-height` (`1em + 2 × pad-y + 2px` border). Icons, images, and other children are capped at `1em` and cannot raise the box.
