# QR Code · 1.x → 2.0 迁移

## 包

- **2.0**：`@bloret-crew/blora-design-qrcode`（不进核心包）
- CSS：`@bloret-crew/blora-design-qrcode/qrcode.css`
- Composite CE：`<blora-qrcode>`
- 纯函数 / 命令式服务：`buildQRMatrix()`、`renderQRCode()`

## 2.0 职责

`<blora-qrcode>` 拥有 canvas 生命周期：连接时渲染，`value`、`size`、`label` 变化时重绘。矩阵生成与命令式渲染保留为纯函数服务。

## 行为变化

| 1.x / 早期 2.0                                 | 当前 2.0                                            |
| ---------------------------------------------- | --------------------------------------------------- |
| `data-blora-qrcode` + `data-text` + controller | `<blora-qrcode value="..." size="180" label="...">` |
| 手动 `createQRCodeController(el)`              | 导入包后自动定义 CE；controller 仅作为高级路径保留  |
| 无障碍名称由消费者手写                         | `label` 属性写入 `role="img"` 与 `aria-label`       |

## 示例

```html
<link rel="stylesheet" href="qrcode.css" />

<blora-qrcode value="https://blora.design/components" size="180" label="Blora Design 文档二维码">
</blora-qrcode>

<script type="module">
  import "@bloret-crew/blora-design-qrcode";
</script>
```

## 注意

- 当前矩阵实现是 beta 简化编码器（固定版本、输入截断）；生产级扫描场景请自行验证。
- `buildQRMatrix()` 与 `renderQRCode()` 保持纯函数/命令式入口，供 SSR 或自定义宿主使用。
