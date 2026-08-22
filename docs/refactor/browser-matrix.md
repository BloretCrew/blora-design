# 浏览器回归策略（RC）

**日期**：2026-08-22  
**范围**：2.0 beta 线到 RC。

## 必跑（CI）

GitHub Actions `Browser Tests` job：

- Playwright **Chromium** 桌面
- Playwright **Pixel 7**（mobile-chromium）
- Playwright **axe** smoke（`a11y` project，无 serious/critical）

视觉回归：`test:visual` 三张审核过的基线（见 `visual-review.md`）。全组件视觉农场仍是 RC 扩容，不作为当前 required job。

## Firefox

- 策略：与 Chromium 共用同一套 `tests/browser/*.spec.ts`。
- 本地：`pnpm exec playwright test --config playwright.config.ts --project=firefox`（需先 `pnpm exec playwright install firefox`）。
- CI：暂不加入 required job。原因是当前 runner 只装 Chromium 依赖；把 Firefox 加进必跑会拉长安装并引入与 Windows 开发机不一致的字体/滚动条差。RC 发版前在 Linux 上跑一次 Firefox 交互套件，把失败记入本文件附录。
- 已知差异：classic scrollbar gutter（Command 遮罩已按 Chromium 修过；Firefox overlay scrollbar 通常不占槽）。

## WebKit / Safari

- CI 的 `ubuntu-latest` 不跑官方 Safari。Playwright WebKit 可作近似。
- 策略：RC 前用 Playwright WebKit 跑 dialog / command / tour / drawer 四条 overlay 规格，再在一台 Safari 上人工点 Showcase 浮层。
- 记录位置：本文件附录，发 RC 时补日期与结果。

## 附录（待 RC 填写）

| 引擎 | 日期 | 结果 | 备注 |
|------|------|------|------|
| Chromium CI | 随 master | 以 Actions 为准 | required |
| Firefox 本地/RC | _待填_ | | |
| WebKit / Safari | _待填_ | | overlay 抽测 |
