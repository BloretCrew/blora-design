# CSS-only component resolution

> Maps presentational core capabilities to either a public controller/API or an intentional CSS-only pattern.

## Intentional CSS-only presentation

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

## Composite CE / Controller API present

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
| Masonry | CSS-only columns | The capability is presentational and has no public behavior controller |

## Spot-check (automated)

See the core package unit tests and add-on package tests.
