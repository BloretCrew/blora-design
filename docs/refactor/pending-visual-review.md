# Pending visual review (user eye-check)

> Working-tree / Phase 9 收口相关 CSS 变更清单。  
> **人眼确认状态：✅ 已确认（2026-08-02）** — 可作提交依据；新的视觉改动请另开条目。

## New surfaces (new components / APIs)

| # | Change | Story path | Delta | Review |
|---|--------|------------|--------|--------|
| N1 | Tree Select panel + nodes | **Forms / Tree Select** | New combobox dropdown; v2 tokens | ✅ |
| N2 | BackTop fixed control | **Navigation / BackTop** | FAB-like; v1 lucide arrow-up SVG; shadow-4 + primary | ✅ |
| N3 | Image lightbox | **Data / Image** | Full-screen scrim + stage/nav/close | ✅ |
| N4 | Notify multi-placement stacks | API `notify({ placement })` | TL/TR/BL/BR containers | ✅ |
| N5 | Form validate story | **Forms / Form Validate** | field `data-state` invalid/valid | ✅ |

## Existing components — CSS restyles

| # | Component | Story path | What changed | Review |
|---|-----------|------------|--------------|--------|
| E1 | Calendar | **Data / Calendar** | Selected: hollow outline; today: under-dot | ✅ |
| E2 | Collapse | **Data / Collapse** | Measured max-height expand/collapse | ✅ |
| E3 | Accordion | **Data / Accordion** | Same height model as Collapse | ✅ |
| E4 | Table | **Data / Table** | Sort glyphs hide until hover / sorted | ✅ |
| E5 | Mentions | **Forms / Mentions** | Portal + z-index token | ✅ |
| E6 | Popover | **Feedback / Popover** | Panel left-aligned to trigger | ✅ |
| E7 | Tree | **Data / Tree** | Symmetric measured expand | ✅ |
| E8 | Affix | **Add-ons / Layout / Affix** | Flex nowrap when fixed | ✅ |
| E9 | Theming | **Add-ons / Theming** | Dark paints story root | ✅ |
| E10 | FAB / BackTop split | **Actions / FAB**, **BackTop** | Invalid selectors removed; dedicated CSS | ✅ |
| E11 | Image | **Data / Image** | Loading + preview cursor + lightbox | ✅ |
| E12 | Notification | **Feedback / Notification** | Multi-placement CSS | ✅ |

## List / Button

| # | Component | Note | Review |
|---|-----------|------|--------|
| L1 | List | No outer border (intentional); Card composition story | ✅ |
| L2 | Button | Removed redundant Dark story | ✅ |

## Follow-up polish

| # | Component | Story | Delta | Review |
|---|-----------|-------|--------|--------|
| F1 | Tree Select chevron | Tree Select | 12px lucide chevron | ✅ |
| F2 | Markdown code block | Markdown | mono 0.875rem / 1.7 | ✅ |
| F3 | Drawer | Drawer | Close anim + placements | ✅ |
| F4 | Toast | Toast | Close align + SVG | ✅ |
| F5 | Command palette | Command Palette | Settings gear icon | ✅ |
| F6 | BackTop shadow | BackTop | shadow-4 + primary | ✅ |
| F7 | Table column panel | Table → Column settings | blora-checkbox in panel | ✅ |
| F8 | Table virtual | Virtual Y / X+Y | Row + col windows | ✅ |
| F9 | Table row select | Table → Selectable rows | Built-in `data-blora-selectable` | ✅ |

## Not in this list

- Token regeneration without component selector edits  
- Pure TS controller logic with no CSS touch  

## Phase-9 honesty closeout (2026-08-02)

| Item | Product visual/functional delta? |
|------|----------------------------------|
| Root README → 2.0 | **None** (docs only) |
| `llms.txt` + `docs/migration/v1-to-v2.md` | **None** |
| `framework.md` demotion wording | **None** |
| ADR-009 + `remaining-work.md` | **None** |

**No Storybook eye-check required** for this closeout. Master tracker: [`remaining-work.md`](./remaining-work.md) §4.
