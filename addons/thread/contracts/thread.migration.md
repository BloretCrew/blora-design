# Thread / Post · 1.x → 2.0 迁移

## 包

- **2.0**：`@bloret-crew/blora-design-thread`（**不进核心包**）
- CSS：`@bloret-crew/blora-design-thread/thread.css`
- API：`createThreadController(root, options?)`

## 行为对等（v1 `initThread`）

| v1                                                          | 2.0                                                               |
| ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `Blora.init()` / 自动 `initThread`                          | 显式 `createThreadController(root)`                               |
| 收起/展开 `[data-blora-thread-toggle]`                      | 同                                                                |
| 默认文案「展开评论 / 收起评论」                             | 同；可用 `options` 或 `data-label-expand` / `data-label-collapse` |
| `[data-blora-post-react]` 切换 `is-active` + `aria-pressed` | 同（`toggleReact` API）                                           |
| 无 body 时自动包一层 `.blora-post__replies-body`            | 同                                                                |
| `prefers-reduced-motion`                                    | 同                                                                |
| `destroy`                                                   | `controller.destroy()`（AbortController）                         |

## 样式 class（保持）

`.blora-thread`、`.blora-post`、`.blora-post--reply`、`.blora-post__quote`、`.blora-post__collapse`、`.blora-comment` 等与 v1 一致。

Token 映射到 v2 semantic tokens；暗色用 `:root[data-blora-color-scheme="dark"]`（不再依赖 `.blora-dark` 祖先）。

## 示例

```html
<link rel="stylesheet" href="blora.css" />
<link rel="stylesheet" href="node_modules/@bloret-crew/blora-design-thread/thread.css" />

<div class="blora-thread" data-blora-thread id="thread">
  <!-- 结构同 v1 showcase 论坛跟帖 -->
</div>

<script type="module">
  import { createThreadController } from "@bloret-crew/blora-design-thread";
  const root = document.getElementById("thread");
  const ctrl = createThreadController(root);
  // ctrl.destroy() when unmounting
</script>
```

## 注意

- Markdown 正文（`data-blora-md`）属于 **Markdown add-on**，不在本包内。
- Comment 简易样式本包带一份；核心包也有独立 `comment.css`（Story `Data/Comment`）。
