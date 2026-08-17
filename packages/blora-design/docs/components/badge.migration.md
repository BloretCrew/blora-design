# Badge Migration: 1.x → 2.0

## When to use Badge (not Tag)

| 用 Badge | 用 Tag |
| -------- | ------ |
| 数量、红点、未读 | 分类、关键词、主题 |
| New / 成功 / 警告等状态 | 可关闭、可筛选 |
| 贴在头像或卡片角上 | 出现在正文或筛选条里 |

## Class Mapping

| 1.x | 2.0 | Notes |
| --- | --- | ----- |
| `.blora-badge` | `.blora-badge` | Count chip |
| `.blora-badge--dot` | `.blora-badge[data-variant="dot"]` | |
| `.blora-badge--circle` | `.blora-badge[data-variant="circle"]` | |
| `.blora-badge--pill` | `.blora-badge[data-variant="pill"]` | |
| `.blora-badge--neutral` | `.blora-badge[data-variant="neutral"]` | |
| `.blora-badge--success` | `.blora-badge[data-variant="success"]` | |
| `.blora-badge--info` | `.blora-badge[data-variant="info"]` | |
| `.blora-badge--warning` | `.blora-badge[data-variant="warning"]` | Added |
| `.blora-badge--danger` | `.blora-badge[data-variant="danger"]` | Added |
| — | `data-icon` | Optional Lucide name; call `enhanceBadges()` |

## Before / After

```html
<span class="blora-badge blora-badge--pill">New</span>
<span class="blora-badge" data-variant="pill">New</span>
```
