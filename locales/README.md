# Blora locales

官方语言包（与内置 `zh-CN` / `en` 对齐，便于 CDN 分包或业务覆盖）。

## 使用

```js
// bundler / npm
const en = require("@bloret-crew/blora-design/locales/en");
Blora.setLocale("en", en);
```

```html
<script src="blora.js"></script>
<script src="locales/en.js"></script>
<script>
  Blora.setLocale("en", BloraLocales.en);
</script>
```

## CDN

发布 npm 后：

```
https://cdn.jsdelivr.net/npm/@bloret-crew/blora-design@1/locales/en.js
https://cdn.jsdelivr.net/npm/@bloret-crew/blora-design@1/locales/zh-CN.js
```

自定义语言：复制任一文件，改 `messages` 与日历字段，再 `Blora.setLocale("xx", pack)`。
