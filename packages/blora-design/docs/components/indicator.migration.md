# Indicator migration

1.x used BEM placement modifiers. 2.0 prefers `data-placement`. The old classes still work.

```html
<span class="blora-indicator" data-placement="top-start">
  <button class="blora-button" type="button">通知</button>
  <span class="blora-indicator__item"><span class="blora-badge">3</span></span>
</span>
```
