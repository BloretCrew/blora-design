# Effects · 1.x → 2.0 迁移

## 包

- **2.0**：`@bloret-crew/blora-design-effects`（不进核心包）
- CSS：`@bloret-crew/blora-design-effects/effects.css`
- Composite CE：`<blora-text-fx>`、`<blora-text-rotate>`、`<blora-countdown>`、`<blora-count-up>`、`<blora-diff>`、`<blora-hover-gallery>`、`<blora-watermark>`
- 保留 service：`textFx()`（命令式重播）、快捷键格式化与初始化

## 2.0 职责

每个 CE 拥有自己的 DOM 结构和连接/断开生命周期；消费者只提供内容或属性。控制器仍可用于增强任意既有元素。

| 能力     | CE 写法                                                                                                              | 说明                                           |
| -------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 文字动效 | `<blora-text-fx effect="ripple" loop>`                                                                               | 内容保持原文；CE 负责拆分、复制/选择保护和重播 |
| 文字轮换 | `<blora-text-rotate interval="3200">`                                                                                | 子元素自动成为轮换项，悬停/聚焦暂停            |
| 倒计时   | `<blora-countdown seconds="86405" label="天,时,分,秒">`                                                              | 自动生成四个单位；完成时派发 `blora:complete`  |
| 数字增长 | `<blora-count-up value="12847" duration="900">`                                                                      | 进入视口后播放                                 |
| 双边对比 | `<blora-diff value="50"><blora-diff-before>…</blora-diff-before><blora-diff-after>…</blora-diff-after></blora-diff>` | CE 生成 divider 与 range                       |
| 悬停画廊 | `<blora-hover-gallery aria-label="图库">`                                                                            | 子元素自动包装为 item；生成 track 与进度点     |
| 水印     | `<blora-watermark text="BLORA">`                                                                                     | 生成 `aria-hidden` 平铺层                      |

## 行为变化

| 1.x / 早期 2.0                               | 当前 2.0                              |
| -------------------------------------------- | ------------------------------------- |
| 手写 `.blora-text-rotate__item` + controller | `<blora-text-rotate>` 自动包装子元素  |
| 手写 `.blora-countdown__unit` 四组结构       | `<blora-countdown>` 自动生成单位      |
| 手写 `.blora-diff__*` 树 + range             | `<blora-diff>` 只要求两个 pane 子元素 |
| 手写 `.blora-hover-gallery__item`            | `<blora-hover-gallery>` 自动包装      |
| `data-blora-watermark` + controller          | `<blora-watermark text="...">`        |

## 示例

```html
<link rel="stylesheet" href="effects.css" />

<blora-text-fx effect="bloom" loop>Bloom text</blora-text-fx>

<blora-text-rotate interval="3200">
  <span>结构统一</span>
  <span>令牌驱动</span>
</blora-text-rotate>

<blora-countdown seconds="86405"></blora-countdown>

<blora-count-up value="12847">0</blora-count-up>

<blora-diff value="50">
  <blora-diff-before><div class="before-pane"></div></blora-diff-before>
  <blora-diff-after><div class="after-pane"></div></blora-diff-after>
</blora-diff>

<blora-hover-gallery aria-label="图库">
  <div class="pane-a"></div>
  <div class="pane-b"></div>
</blora-hover-gallery>

<blora-watermark text="BLORA"><p>受保护内容</p></blora-watermark>

<script type="module">
  import "@bloret-crew/blora-design-effects";
</script>
```

## 注意

- 快捷键提示继续使用原生 `<kbd data-blora-shortcut="mod+k">`。
- `textFx(el, name)` 仍可用于任意既有元素或显式重播；不要与 CE 同时作用于同一节点。
- 水印是视觉标记，不是防复制边界。
