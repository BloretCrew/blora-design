# 浏览器回归策略（RC）

**日期**：2026-08-27
**范围**：2.0 beta 线到 RC。**RC 实测已完成。**

## 必跑（CI）

GitHub Actions `Browser Tests` job：

- Playwright **Chromium** 桌面
- Playwright **Pixel 7**（mobile-chromium）
- Playwright **axe** smoke（`a11y` project，无 serious/critical）

视觉回归：`test:visual` 当前 30 张审核过的基线（见 `visual-review.md`）；仍不作为 CI required job。

## Firefox

- 策略：与 Chromium 共用同一套 `tests/browser/*.spec.ts`。
- 本地：`pnpm exec playwright test --config playwright.config.ts --project=firefox --workers=1`。
- CI：暂不加入 required job；required 门禁保持 Chromium 桌面、Chromium 移动和 axe smoke，不改变 CI gates。
- RC 实测：Windows Playwright Firefox 153.0，87/87 通过（2026-08-27）。
- 已知差异：classic scrollbar gutter（Command 遮罩已按 Chromium 修过；Firefox overlay scrollbar 通常不占槽）。

## WebKit / Safari

- CI 的 `ubuntu-latest` 不跑官方 Safari。Playwright WebKit 可作近似。
- RC 实测：Windows Playwright WebKit 26.5，87/87 通过（2026-08-27）。
- 测试中的跨主题对比度 fixture 禁用了过渡动画，避免 WebKit 在主题切换中间帧读取临时颜色；这不改变产品 CSS 或运行时行为。
- 记录位置：本文件附录；真实 Safari 人工抽测仍需有 Safari 设备后另行记录。

## 附录（实测记录）

| 引擎 | 日期 | 结果 | 备注 |
|------|------|------|------|
| Chromium CI | 随 master | 以 Actions 为准 | required |
| Firefox（Playwright，Windows 开发机） | 2026-08-27 | **87/87 通过** | 当前 RC 代码与完整交互套件；单 worker。覆盖 BBBS、全部核心浏览器规格、对比度、Composite CE、内容组件、Dialog、基础、Overlay、Select、Tooltip。 |
| WebKit（Playwright，Windows 开发机） | 2026-08-27 | **87/87 通过** | 当前 RC 代码与完整交互套件；单 worker。对比度 fixture 禁用 transition 以避免主题切换中间帧误报；其余为真实运行时验证。 |
| Safari 真机人工抽测 | 不适用 | 未执行 | 当前环境没有 Safari 设备；Playwright WebKit 结果已记录，真 Safari 需另有设备后补充。 |

> 说明：Firefox/WebKit 的 RC 实测已在 Windows Playwright 完成；与 CI 的 Linux Chromium 字体/滚动条环境仍有差异。真实 Safari 人工抽测因环境没有 Safari 设备未执行。CI required 门禁维持 Chromium 三项目不变。
