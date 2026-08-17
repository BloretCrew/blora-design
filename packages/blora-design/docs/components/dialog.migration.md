# Dialog Migration: 1.x -> 2.0

## Element Mapping

| 1.x                    | 2.0                          | Notes                           |
| ---------------------- | ---------------------------- | ------------------------------- |
| `.blora-modal`         | `<blora-dialog>`             | Custom element with Shadow DOM  |
| `.blora-modal.is-open` | `open` attribute / `.show()` | Native attribute for open state |
| `.blora-modal__mask`   | `::part(backdrop)`           | CSS Part                        |
| `.blora-modal__dialog` | `::part(panel)`              | CSS Part                        |
| `.blora-modal__head`   | `::part(header)`             | CSS Part                        |
| `.blora-modal__title`  | `::part(title)`              | CSS Part, slot="title"          |
| `.blora-modal__close`  | `::part(close-button)`       | CSS Part                        |
| `.blora-modal__body`   | `::part(body)`               | CSS Part, default slot          |
| `.blora-modal__foot`   | `::part(footer)`             | CSS Part, slot="footer"         |
| `.blora-modal--sm`     | `size="sm"`                  | Attribute                       |
| `.blora-modal--lg`     | `size="lg"`                  | Attribute                       |

## API Changes

| 1.x (JS)                            | 2.0                          | Notes               |
| ----------------------------------- | ---------------------------- | ------------------- |
| `data-blora-modal-open` on trigger  | `dialog.show()`              | Explicit API        |
| `data-blora-modal-close` on element | `dialog.close()`             | Explicit API        |
| `blora:change` event                | `blora-open` / `blora-close` | Unified event names |

## Events

| Event                | cancelable | detail                             |
| -------------------- | ---------- | ---------------------------------- |
| `blora-before-open`  | yes        | `{ source, reason }`               |
| `blora-open`         | no         | `{ source, reason }`               |
| `blora-before-close` | yes        | `{ source, reason, returnValue? }` |
| `blora-close`        | no         | `{ source, reason, returnValue? }` |

## Before / After

### Before (1.x)

```html
<div class="blora-modal" id="myModal">
  <div class="blora-modal__mask"></div>
  <div class="blora-modal__dialog">
    <div class="blora-modal__head">
      <span class="blora-modal__title">Title</span>
      <button class="blora-modal__close" data-blora-modal-close>&times;</button>
    </div>
    <div class="blora-modal__body">Content</div>
    <div class="blora-modal__foot">
      <button class="blora-btn" data-blora-modal-close>Close</button>
    </div>
  </div>
</div>
```

### After (2.0)

```html
<blora-dialog id="myModal">
  <span slot="title">Title</span>
  <p>Content</p>
  <div slot="footer">
    <button
      class="blora-button"
      type="button"
      data-variant="ghost"
      onclick="document.getElementById('myModal').close()"
    >
      Close
    </button>
  </div>
</blora-dialog>
```

## Overlay Features

2.0 Dialog uses a unified `OverlayController` (Spec §12.1) that provides:

- Focus trap (Tab/Shift+Tab does not escape)
- Focus return to trigger on close
- Scroll lock with reference counting (freezes `body` with `position: fixed`, same as 1.x, so sticky chrome stays in the viewport)
- Escape key handling
- Outside click handling
- Overlay stack management (nested dialogs)
