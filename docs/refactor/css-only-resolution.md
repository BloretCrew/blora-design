# CSS-only component resolution

> Maps former “CSS-only / almost no behavior” core components to either a controller/API or intentional CSS-only (v1 had no JS).

## Intentional CSS-only (v1 pure presentation)

| Component | Rationale |
|-----------|-----------|
| Avatar | Presentational |
| Badge | Presentational |
| Card | Layout chrome |
| Descriptions | Definition list styling |
| Input | Native enhanced by Field/Form |
| List | Row dividers; compose with Card for chrome |
| Message | Static pill + `message()` top-center service |
| Skeleton | Loading placeholder |
| Spinner | Loading indicator |
| Tag | Presentational chip |
| Textarea | Native + Field/Form |
| FAB | Presentational action control |
| Media Container | Presentational frame |
| Indicator / Hero / Footer / Join / Divider / Menu | Page chrome; no required JS |

## Composite CE / Controller API present (v1 had JS or interactive path)

| Component | API | Notes |
|-----------|-----|--------|
| Accordion | `<blora-accordion>` | Alias of collapse single-open |
| Collapse | `<blora-collapse>` | Measured height expand |
| Checkbox | `<blora-checkbox>` | Check-all |
| Dialog | `BloraDialog` WC | Full dialog |
| Drawer | `<blora-drawer>` | Open/close |
| Dropdown | `createDropdownController` | Menu |
| Field | `<blora-field>` | Limit counter |
| Form | `createFormController` | **New** validate |
| Image | `<blora-image>` + `openImagePreview` | Loading + lightbox |
| Notification | `notify` + `createNotificationController` | Multi-placement |
| Pagination | `<blora-pagination>` | |
| Popconfirm | `createPopconfirmController` | |
| Popover | `<blora-popover>` | |
| Progress | `createProgressController` | |
| Segmented | `<blora-segmented>` | |
| Select | `BloraSelect` WC | |
| Steps | `<blora-steps>` | **New** interactive current |
| Table | `createTableController` | Sort + page + cols + virtual + **selectable** |
| Tabs | `<blora-tabs>` | |
| Tooltip | `<blora-tooltip>` | |
| Message (service) | `message` | |
| BackTop | `<blora-backtop>` + `initBackTop` | **New** |
| Tree Select | `<blora-tree-select>` | **New** |
| FAB | CSS + optional BackTop class | BackTop owns scroll show |
| Masonry | CSS-only columns | v1 had no dedicated JS controller |

## Spot-check (automated)

See `packages/blora-design/tests/v1-gaps.test.ts` and addon package tests.
