# Thread · 1.x → 2.0 迁移

## 包

- **2.0**：`@bloret-crew/blora-design-thread`（不进核心包）
- CSS：`@bloret-crew/blora-design-thread/thread.css`
- Composite CE：`<blora-thread-comment>`、`<blora-thread-composer>`
- 顺序 / 连线 / 节点：核心 `<blora-timeline>`

## 2.0 职责

Thread 不再提供 1.x 的 `.blora-post*` 主帖 + replies 双层结构，也不再要求页面初始化根控制器。论坛页面用三套正交能力组合：

1. 核心 `blora-timeline`：评论 / 活动事件的顺序、垂直连线、Lucide 图标节点、任意内容承载。
2. `<blora-thread-comment>`：单条论坛评论卡片、反应状态与长内容自动折叠。
3. `<blora-thread-composer>`：开放式评论撰写区、工具栏布局和编辑 / 预览切换。

作者、头像、徽章、时间、回复对象、工具按钮、提交动作和预览渲染均由消费者填写。

## 行为变化

| 1.x / 早期 2.0                              | 当前 2.0                                                     |
| ------------------------------------------- | ------------------------------------------------------------ |
| `Blora.init()` / `createThreadController`   | 导入包后自动定义两个 Composite CE                            |
| replies 整组展开 / 收起                     | 删除；每条 `<blora-thread-comment>` 根据正文实际高度独立折叠 |
| 手写 `.comment-fold-btn`                    | 评论 CE 仅在正文超高时生成标准 Blora Button、渐隐和高度动画  |
| `data-collapse-height`                      | `<blora-thread-comment collapse-height="158">`               |
| `data-label-expand` / `data-label-collapse` | `label-expand` / `label-collapse`                            |
| 根控制器的展开 / 收起方法                   | 评论 CE 的 `refresh()`、`expand()`、`collapse()`、`toggle()` |
| 评论编辑 / 预览 data 属性                   | `<blora-thread-composer tab="edit                            | preview">`与`setTab()` |
| 评论工具栏                                  | `slot="toolbar"` 只提供布局；按钮内容和行为由消费者定义      |
| 提交区                                      | `slot="actions"`，提交、定时发送等行为由消费者实现           |

## 示例

```html
<link rel="stylesheet" href="blora.css" />
<link rel="stylesheet" href="thread.css" />

<div class="blora-thread">
  <blora-timeline>
    <blora-timeline-item icon="thumbs-up" time="· 6个月前">
      <b class="blora-text-primary">Detrital</b> 点赞了帖子
    </blora-timeline-item>

    <blora-timeline-item icon="message" content-layout="block">
      <blora-thread-comment collapse-height="158">
        <div slot="head">
          <span class="blora-avatar" data-size="sm">D</span>
          <b>Detrital</b>
          <span class="blora-tag">何意味</span>
          <span class="blora-text-muted">评论于 6个月前</span>
        </div>
        <div slot="quote">## 妈妈</div>
        <p>评论正文。超过阈值时自动折叠。</p>
        <div slot="reactions">
          <button data-blora-thread-react aria-label="添加表情"></button>
        </div>
      </blora-thread-comment>
    </blora-timeline-item>
  </blora-timeline>

  <blora-thread-composer>
    <div slot="toolbar">
      <button type="button" aria-label="粗体"></button>
    </div>
    <textarea placeholder="撰写评论"></textarea>
    <div slot="preview">消费者提供的预览内容</div>
    <div slot="actions">
      <button class="blora-button" data-variant="primary">发表评论</button>
      <button class="blora-button" data-variant="outline">定时发送</button>
    </div>
  </blora-thread-composer>
</div>

<script type="module">
  import "@bloret-crew/blora-design-thread";
</script>
```

## 注意

- 必须同时加载核心 Timeline 与 Thread CSS / JS。
- 短评论不会生成折叠控件。
- Thread 工具栏只提供统一布局，不绑定按钮类型或点击行为。
- Markdown 编辑和预览渲染由消费者或 Markdown add-on 实现。
- 用户表情（例如 `😂 2`）是内容；UI 图标仍须走 `createBloraIcon()`。
