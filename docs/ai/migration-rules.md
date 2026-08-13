# AI Migration Rules

> Rules for AI agents when migrating 1.x code to 2.0.

## Class Mapping

| 1.x Class             | 2.0 Replacement                         | Status  |
| --------------------- | --------------------------------------- | ------- |
| `.blora-btn`          | `.blora-button`                         | planned |
| `.blora-btn--primary` | `.blora-button[data-variant="primary"]` | planned |
| `.blora-btn--sm`      | `.blora-button[data-size="sm"]`         | planned |
| `.blora-modal`        | `<blora-dialog>`                        | planned |
| `.blora-dark`         | `[data-blora-color-scheme="dark"]`      | planned |

## Event Mapping

| 1.x Event                   | 2.0 Event                           | Status  |
| --------------------------- | ----------------------------------- | ------- |
| `blora:change`              | `change` (native) or `blora-select` | planned |
| `blora:table-change`        | `change` + custom detail            | planned |
| `blora:treeselect-change`   | `blora-select`                      | planned |
| `blora:autocomplete-select` | `blora-select`                      | planned |

## Data Attribute Mapping

| 1.x Attribute           | 2.0 Replacement                              | Status  |
| ----------------------- | -------------------------------------------- | ------- |
| `data-blora-modal-open` | `dialog.showModal()`                         | planned |
| `data-blora-form`       | Native Constraint Validation + `blora-field` | planned |
| `Blora.init()`          | Custom Elements auto-upgrade                 | planned |

> Phase 8 compat / codemod 已落地；本表为速查。完整映射见 `packages/blora-design/src/compat/v1/`。  
> **2.0 新代码**请直接写 `.blora-button[data-variant]` 与 contract 指定的 Composite CE；只有 Table / Form 等 headless contract 才创建 controller，见 [`docs/guide.md`](../guide.md)。
