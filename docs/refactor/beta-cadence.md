# Beta 节奏与宣传（3.5）

## 缺陷优先

`2.0.0-beta.0` 起进入 beta 版本线：

- **默认只接**：bug、a11y、文档、测试、性能且不改 public API。
- **可加**：新可选 API / 新 export，须 changelog。
- **禁止默认**：无迁移说明的破坏性变更、把 experimental 写进首页「核心能力」主列表。

详见 [`beta-api-freeze.md`](./beta-api-freeze.md)。

## 宣传边界

| 可以说 | 不要说 |
|--------|--------|
| 2.0 beta；API 趋向稳定 | 「生产 stable / 全部组件 DoD」 |
| 安装 `@bloret-crew/blora-design@beta` | 把 contract 里仍为 beta 的组件当冻结 |
| Showcase + guide 为主文档 | Repository source imports or copied component implementations |

## 用户向迁移文档

- 主：`docs/guide.md` + `docs/migration/from-any-ui-to-blora-design.md`
- 渠道：`docs/refactor/rc-release-rehearsal.md`（安装演练、dist-tag 与回滚）
- 变更：`CHANGELOG.md`
