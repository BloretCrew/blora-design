# AI Anti-Patterns

> Common mistakes AI agents make when working with Blora Design 2.0.

## Visual

- **Do NOT** extract visual styles from historical commits, old npm packages, or hidden branches.
- **Do NOT** use other UI framework defaults as a visual target.
- **Do NOT** generate "modernized" styles on your own.
- **Do NOT** substitute "documented" for "actually rendered" -- always check real rendering.

## CSS

- **Do NOT** hardcode colors, spacing, radii, shadows, durations, or z-index in component CSS.
- **Do NOT** use `!important` unless for a11y or compat, and always explain why.
- **Do NOT** use `transition: all`.
- **Do NOT** use descendant selectors deeper than 3 levels.
- **Do NOT** override `html` or `body` from component CSS.

## JavaScript

- **Do NOT** use `innerHTML` with user-supplied strings.
- **Do NOT** use `eval`, `new Function`, or inline event handlers.
- **Do NOT** run `querySelectorAll` for all 50+ initializers on every `init()` call.
- **Do NOT** create a global mutable config object that affects all components.

## Components

- **Do NOT** force all components into Custom Elements. Use native elements where possible.
- **Do NOT** use closed Shadow DOM.
- **Do NOT** create a giant base class that handles i18n, tables, overlays, forms, etc.
- **Do NOT** copy component internal DOM in Stories.

## Testing

- **Do NOT** fabricate empty tests.
- **Do NOT** skip tests.
- **Do NOT** batch-update screenshots without review.
- **Do NOT** use "documented" as proof of behavior -- write actual tests.
