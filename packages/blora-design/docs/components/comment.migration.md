# Comment Migration: 1.x → 2.0

Comment is a layout shell. It does not own time, likes, or action semantics.

## 1.x

Authors copied the BEM tree:

```html
<div class="blora-comment">
  <div class="blora-avatar">张</div>
  <div class="blora-comment__main">
    <div class="blora-comment__head">
      <span class="blora-comment__author">张三</span>
      <span class="blora-comment__time">2 小时前</span>
    </div>
    <div class="blora-comment__body">正文</div>
    <div class="blora-comment__actions">
      <button type="button">回复</button>
      <button type="button">赞</button>
    </div>
  </div>
</div>
```

## 2.0

Authors slot existing components. `author`, `time`, `avatar`, `content`, and `likes` attributes are removed.

```html
<blora-comment>
  <span slot="avatar" class="blora-avatar" data-size="sm">张</span>
  <span slot="author">张三</span>
  <time slot="meta">2 小时前</time>
  正文
  <button slot="actions" type="button" class="blora-button" data-size="xs" data-variant="outline">
    回复
  </button>
  <button
    slot="actions"
    type="button"
    class="blora-button"
    data-size="xs"
    data-variant="outline"
    data-icon="thumbs-up"
    aria-label="赞"
  >
    12
  </button>
</blora-comment>
```

CSS-only authors may still write the `.blora-comment` tree directly.
