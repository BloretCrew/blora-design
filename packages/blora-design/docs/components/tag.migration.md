# Tag Migration: 1.x → 2.0

## When to use Tag (not Badge)

| 用 Tag             | 用 Badge                    |
| ------------------ | --------------------------- |
| 分类、关键词、主题 | 数量、红点、未读            |
| 可关闭、可筛选     | 状态提示（New、成功、警告） |
| 浅底描边胶囊       | 实心胶囊或角标              |

2.0 去掉 `solid`。实心状态条请写 Badge。

## Class Mapping

| 1.x                     | 2.0                                  | Notes                                      |
| ----------------------- | ------------------------------------ | ------------------------------------------ |
| `.blora-tag`            | `.blora-tag`                         | Unchanged                                  |
| `.blora-tag--primary`   | `.blora-tag[data-variant="primary"]` |                                            |
| `.blora-tag--neutral`   | `.blora-tag[data-variant="neutral"]` |                                            |
| `.blora-tag--info`      | `.blora-tag[data-variant="info"]`    |                                            |
| `.blora-tag--success`   | `.blora-tag[data-variant="success"]` |                                            |
| `.blora-tag--warning`   | `.blora-tag[data-variant="warning"]` |                                            |
| `.blora-tag--solid`     | **removed**                          | Use `.blora-badge` for a solid status chip |
| `.blora-tag--removable` | `.blora-tag--removable`              | Keep with `.blora-tag__close`              |

## Before / After

```html
<!-- 1.x solid status — do not port as Tag -->
<span class="blora-tag blora-tag--solid">深色</span>

<!-- 2.0: solid status is a Badge -->
<span class="blora-badge" data-variant="neutral">深色</span>

<!-- 2.0: category stays a Tag -->
<span class="blora-tag" data-variant="primary">React</span>
```
