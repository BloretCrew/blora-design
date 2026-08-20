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
| 无 body 时自动包一层 `.blora-post__replies-body`            | 2.0 不再自动合成，需显式写 `data-blora-thread-body`               |
| `prefers-reduced-motion`                                    | 同                                                                |
| `destroy`                                                   | `controller.destroy()`（AbortController）                         |

## 样式 class（2.0 最小壳）

- **保留**：`.blora-thread`、`.blora-post`、`.blora-post--reply`、`.blora-post__head`、`.blora-post__body`、`.blora-post__quote`、`.blora-post__react` / `__react-btn`、`.blora-post__replies` / `__replies-body` / `__collapse`。
- **已移除**（不再由 add-on 提供样式，需由消费者自写，参考 `comment` 做法）：`.blora-post__identity`、`__who`、`__author-row`、`__author`、`__badge`、`__reply-to`、`__sub`、`__loc`、`__tools`、`__more`、`__title`、`__quote-label`、`__quote-text`。用 `avatar` + `tag` + `button` + tokens 自拼头部/引用/工具栏。

Token 映射到 v2 semantic tokens；暗色用 `:root[data-blora-color-scheme="dark"]`（不再依赖 `.blora-dark` 祖先）。

## 示例（头部自写）

```html
<link rel="stylesheet" href="blora.css" />
<link rel="stylesheet" href="node_modules/@bloret-crew/blora-design-thread/thread.css" />

<div class="blora-thread" data-blora-thread id="thread">
  <article class="blora-post">
    <header class="blora-post__head">
      <!-- 头部完全自写 -->
      <span class="blora-avatar" data-size="sm">D</span>
      <a style="font-weight:600">diddy123</a>
      <span class="blora-tag" data-variant="warning" data-size="sm">何意味</span>
    </header>
    <div class="blora-post__body">正文…</div>
    <div class="blora-post__replies" data-blora-thread-replies>
      <div data-blora-thread-body>…</div>
      <button data-blora-thread-toggle>展开评论</button>
    </div>
  </article>
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
- Comment 简易样式本包不再提供，核心包 `comment.css` 为独立组件。
