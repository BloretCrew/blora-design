---
name: verify
description: 验证 Blora Design 的视觉/交互改动 — 用无头 Chrome 截图观察真实渲染效果
---

# 验证 Blora Design 改动

零依赖静态站,无构建步骤。验证 = 让浏览器真实渲染,截图观察。

## 无头 Chrome 截图配方

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --hide-scrollbars --window-size=760,480 --virtual-time-budget=6000 \
  --screenshot="D:\...绝对路径...\out.png" "file:///D:/.../page.html"
```

要点:
- `--screenshot` **必须用绝对 Windows 路径**,相对路径会报"拒绝访问 (0x5)"。
- `--virtual-time-budget=6000` 等 Google Fonts 与动画就绪。
- 页面内联 `<script>` 制造的状态(如 `getSelection().selectAllChildren(...)`)**会**被画进截图,可用于验证选区、焦点等伪类难截的状态。
- 验证局部改动时,在临时目录(如 `_verify_tmp/`,相对引用 `../blora.css`)搭最小复现页,新旧规则各截一张对比;结束后删除临时目录。
- 暗色模式:`<html class="blora-dark">` 即可。

## 值得驱动的流

- `index.html` 是组件全集展示页,直接 file:// 打开即可,无需起服务。
- JS 改动后可用 `node --check blora.js` 先查语法(已有权限),再截图看行为。
