# CSS-only component resolution

> Maps former “CSS-only / almost no behavior” core components to either a controller/API or intentional CSS-only (v1 had no JS).

## Intentional CSS-only (v1 pure presentation)

| Component | Rationale |
|-----------|-----------|
| Alert | Static status banner; no v1 init |
| Avatar | Presentational |
| Badge | Presentational |
| Banner | Presentational strip |
| Breadcrumb | Static nav trail (links only) |
| Card | Layout chrome |
| Chart Container | Host shell for charts |
| Chat | Markup/CSS shell (messages as content) |
| Comment | Markup/CSS shell |
| Descriptions | Definition list styling |
| Empty | Empty state illustration/text |
| Input | Native enhanced by Field/Form |
| List | Row dividers; compose with Card for chrome |
| Message | Static pill + `message()` top-center service |
| Mockup | Decorative device frame |
| Navbar | Structural header CSS |
| Radio | Native + CSS (group via form) |
| Result | Status page layout |
| Skeleton | Loading placeholder |
| Spinner | Loading indicator |
| Statistic | Number display |
| Switch | Native checkbox + CSS |
| Tag | Presentational chip |
| Textarea | Native + Field/Form |
| Timeline | Static vertical list |

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
