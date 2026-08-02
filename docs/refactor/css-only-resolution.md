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
| Message | Static pill (service uses toast/notify) |
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

## Controller / API present (v1 had JS or interactive path)

| Component | API | Notes |
|-----------|-----|--------|
| Accordion | `createAccordionController` | Alias of collapse single-open |
| Collapse | `createCollapseController` | Measured height expand |
| Checkbox | `createCheckboxController` | Check-all |
| Dialog | `BloraDialog` WC | Full dialog |
| Drawer | `createDrawerController` | Open/close |
| Dropdown | `createDropdownController` | Menu |
| Field | `createFieldController` | Limit counter |
| Form | `createFormController` | **New** validate |
| Image | `createImageController` + `openImagePreview` | Loading + lightbox |
| Notification | `notify` + `createNotificationController` | Multi-placement |
| Pagination | `createPaginationController` | |
| Popconfirm | `createPopconfirmController` | |
| Popover | `createPopoverController` | |
| Progress | `createProgressController` | |
| Segmented | `createSegmentedController` | |
| Select | `BloraSelect` WC | |
| Steps | `createStepsController` | **New** interactive current |
| Table | `createTableController` | Sort + page + cols + virtual + **selectable** |
| Tabs | `createTabsController` | |
| Tooltip | `createTooltipController` | |
| Toast | `toast` / `message` | |
| BackTop | `createBackTopController` | **New** |
| Tree Select | `createTreeSelectController` | **New** |
| FAB | CSS + optional BackTop class | BackTop owns scroll show |
| Masonry | CSS-only columns | v1 had no dedicated JS controller |

## Spot-check (automated)

See `packages/blora-design/tests/v1-gaps.test.ts` and addon package tests.
