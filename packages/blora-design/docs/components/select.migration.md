# Select Migration: 1.x -> 2.0

## Element Mapping

| 1.x                                                | 2.0               | Notes                                                                |
| -------------------------------------------------- | ----------------- | -------------------------------------------------------------------- |
| `.blora-select-wrap`                               | `<blora-select>`  | Custom element with Shadow DOM                                       |
| `.blora-select-trigger`                            | `::part(trigger)` | CSS Part                                                             |
| `.blora-select-trigger__label`                     | `::part(value)`   | CSS Part                                                             |
| `.blora-select-menu`                               | `::part(popup)`   | CSS Part                                                             |
| `.blora-select-option`                             | `::part(option)`  | CSS Part, `<blora-option>` slot                                      |
| `.blora-select-wrap .blora-select` (hidden native) | N/A               | No hidden native select needed; form-associated via ElementInternals |

## State Changes

| 1.x                                | 2.0                                      | Notes                         |
| ---------------------------------- | ---------------------------------------- | ----------------------------- |
| `.blora-select-trigger.is-open`    | `aria-expanded="true"` on trigger        | ARIA state                    |
| `.blora-select-option.is-selected` | `data-selected` + `aria-selected="true"` |                               |
| `.blora-select-option.is-active`   | `data-active`                            | Keyboard navigation highlight |
| `.blora-select-option.is-disabled` | `data-disabled` + `aria-disabled="true"` |                               |
| `data-blora-multiple`              | `multiple`                               | 正式多选模式                  |
| `data-blora-max-tag-count`         | `max-tag-count`                          | 超出数量折叠为 `+n`           |

## Events

| 1.x            | 2.0                          | Notes                    |
| -------------- | ---------------------------- | ------------------------ |
| `blora:change` | `change` (native)            | Standard event, composed |
| N/A            | `input`                      | Native input event       |
| N/A            | `blora-open` / `blora-close` | Overlay lifecycle        |

## Before / After

### Before (1.x)

```html
<div class="blora-select-wrap">
  <select class="blora-select" name="country">
    <option value="cn">China</option>
    <option value="jp">Japan</option>
  </select>
  <button class="blora-select-trigger">Choose...</button>
  <div class="blora-select-menu">...</div>
</div>
```

### After (2.0)

```html
<blora-select name="country" placeholder="Choose a country">
  <blora-option value="cn">China</blora-option>
  <blora-option value="jp">Japan</blora-option>
</blora-select>
```

## Form Association

2.0 uses `ElementInternals` API for form association (Spec §11.2).
The `name` attribute and `value` property work with native `<form>` submission.
In multiple mode, `value` is a comma-separated serialization and the readonly `values`
property exposes the selected value list.

## Keyboard Navigation

| Key       | Action                         |
| --------- | ------------------------------ |
| ArrowDown | Open or move to next option    |
| ArrowUp   | Move to previous option        |
| Home      | Move to first option           |
| End       | Move to last option            |
| Enter     | Select active option and close |
| Escape    | Close without selecting        |
| Tab       | Close and move focus           |
