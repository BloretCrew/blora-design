# .trashes

临时收纳：过时/重复/阶段性文件，**请人工确认后删除**。不要在业务代码中引用此目录。

| 子目录 | 内容 |
|--------|------|
| `scratch-issues/` | ISSUES-731/801 等问题清单草稿 |
| `verify-shots/` | 本地验证截图与临时 HTML |
| `root-v1-leftovers/` | 仓库根目录残留的 1.x blora.css/js（正式冻结副本在 `legacy/v1/`） |
| `phase-scripts/` | 一次性迁移/生成脚本 |
| `phase-docs/` | 阶段性文档与 inventory 可读版（JSON 仍在 docs/refactor） |
| `core-migrated-to-addons/` | 已迁出核心、改从 addon 引入的组件 CSS 与 contract 备份 |
| `phase10-entry-cleanup/` | 进入 Phase 10 时清理：过期 changesets、空目录说明 |

迁移到 add-on 后请使用：

- `@bloret-crew/blora-design-effects`（countdown / text-rotate / watermark / …）
- `@bloret-crew/blora-design-layout`（affix / sidebar-layout / …）
- `@bloret-crew/blora-design-theming`（palette）
- `@bloret-crew/blora-design-thread` 等

详见 `docs/refactor/addon-core-gaps.md` 与 **`docs/refactor/remaining-work.md`**。
