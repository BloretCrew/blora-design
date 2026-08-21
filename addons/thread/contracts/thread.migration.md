# Thread · 1.x → 2.0 迁移

## 包

- **2.0**：`@bloret-crew/blora-design-thread`（不进核心包）
- CSS：`@bloret-crew/blora-design-thread/thread.css`
- API：`createThreadController(root, options?)`
- 顺序 / 连线 / 节点：核心 `<blora-timeline>`

## 2.0 职责

Thread 不再提供 1.x 的 `.blora-post*` 主帖 + replies 双层结构。论坛页面用两套正交能力组合：

1. 核心 `blora-timeline`：评论 / 活动事件的顺序、垂直连线、Lucide 图标节点、任意内容承载。
2. Thread add-on：论坛评论卡片、反应区、长内容自动折叠、编辑 / 预览撰写区。

作者、头像、徽章、时间、回复对象、操作按钮和表情统计均由消费者填写。

## 行为变化

| 1.x                                | 2.0                                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `Blora.init()` / 自动 `initThread` | 显式 `createThreadController(root)`                                                          |
| replies 整组展开 / 收起            | 删除；每条长评论根据正文的实际渲染高度独立折叠                                               |
| 手写 `.comment-fold-btn`           | controller 仅在正文超过阈值时启用正文底边 `mask-image` 渐隐、平滑高度过渡和浮动 Blora Button |
| 固定折叠高度                       | `options.collapseHeight`（默认 158px）或每条 `data-collapse-height`                          |
| 评论反应 class                     | `[data-blora-thread-react]` 切换 `data-active` + `aria-pressed`                              |
| 评论编辑 / 预览                    | `[data-blora-thread-tab][data-tab="edit                                                      | preview"]` |
| 销毁                               | `controller.destroy()`；清理监听、观察器、生成按钮和测量状态                                 |

## 示例

```html
<link rel="stylesheet" href="blora.css" />
<link rel="stylesheet" href="thread.css" />

<div class="blora-thread" data-blora-thread id="thread">
  <blora-timeline>
    <blora-timeline-item icon="thumbs-up" time="· 6个月前">
      <b class="blora-text-primary">Detrital</b> 点赞了帖子
    </blora-timeline-item>

    <blora-timeline-item icon="message" content-layout="block">
      <div class="blora-thread-comment" data-collapse-height="158">
        <div class="blora-thread-comment__card">
          <div class="blora-thread-comment__head">
            <span class="blora-avatar" data-size="sm">D</span>
            <div class="blora-thread-comment__meta">
              <b>Detrital</b>
              <span class="blora-tag">何意味</span>
              <span class="blora-text-muted">评论于 6个月前</span>
            </div>
            <div class="blora-thread-comment__actions">
              <button class="blora-button" data-variant="ghost" data-size="xs">回复</button>
            </div>
          </div>
          <div class="blora-thread-comment__quote">## 妈妈</div>
          <div class="blora-thread-comment__body">
            <p>评论正文。超过阈值时自动折叠。</p>
          </div>
          <div class="blora-thread-comment__react">
            <button data-blora-thread-react aria-label="添加表情"></button>
          </div>
        </div>
      </div>
    </blora-timeline-item>
  </blora-timeline>
</div>

<script type="module">
  import { createThreadController } from "@bloret-crew/blora-design-thread";
  const controller = createThreadController(document.getElementById("thread"));
  // controller.destroy() when unmounting
</script>
```

## 注意

- 必须同时加载核心 Timeline 与 Thread CSS / JS。
- 短评论不会生成折叠控件。
- Markdown 正文属于 Markdown add-on，不在本包内。
- 用户表情（例如 `😂 2`）是内容；UI 图标仍须走 `createBloraIcon()`。
