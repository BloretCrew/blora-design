# 浏览器回归策略（RC）

**日期**：2026-08-22  
**范围**：2.0 beta 线到 RC。

## 必跑（CI）

GitHub Actions `Browser Tests` job：

- Playwright **Chromium** 桌面
- Playwright **Pixel 7**（mobile-chromium）
- Playwright **axe** smoke（`a11y` project，无 serious/critical）

视觉回归：`test:visual` 当前 30 张审核过的基线（见 `visual-review.md`）；仍不作为 CI required job。

## Firefox

- 策略：与 Chromium 共用同一套 `tests/browser/*.spec.ts`。
- 本地：`pnpm exec playwright test --config playwright.config.ts --project=firefox`（需先 `pnpm exec playwright install firefox`）。
- CI：暂不加入 required job。原因是当前 runner 只装 Chromium 依赖；把 Firefox 加进必跑会拉长安装并引入与 Windows 开发机不一致的字体/滚动条差。RC 发版前在 Linux 上跑一次 Firefox 交互套件，把失败记入本文件附录。
- 已知差异：classic scrollbar gutter（Command 遮罩已按 Chromium 修过；Firefox overlay scrollbar 通常不占槽）。

## WebKit / Safari

- CI 的 `ubuntu-latest` 不跑官方 Safari。Playwright WebKit 可作近似。
- 策略：RC 前用 Playwright WebKit 跑 dialog / command / tour / drawer 四条 overlay 规格，再在一台 Safari 上人工点 Showcase 浮层。
- 记录位置：本文件附录，发 RC 时补日期与结果。

## 附录（实测记录）

| 引擎 | 日期 | 结果 | 备注 |
|------|------|------|------|
| Chromium CI | 随 master | 以 Actions 为准 | required |
| Firefox（Playwright，Windows 开发机） | 2026-08-22 | 交互套件 70/70 通过（修复后） | 修了两处引擎差异：① 路由切换保侧栏位置的用例改键盘激活导航（Playwright 点击前的隐式滚动在 FF 滚的是侧栏容器本身，Chrome 滚的是窗口——自动化差异，非产品缺陷）；② dialog 滚动锁从 body `position:fixed` 快照改为 `html{overflow:hidden}`——FF 下 fixed 快照会让 position:sticky 头部失去 scrollport 而跳出视口（真实产品 bug，见 overlay-controller）。 |
| WebKit（Playwright，Windows 开发机） | 2026-08-22 | 交互套件全量通过（修复后） | ① Speed Dial 八连开用例改 `HTMLElement.click()` 激活：WK 异步滚动合成会让物理点击落点漂移、被 outside-close 吞掉；② 滚动锁同上。五 project 全并行时 WK 有资源性超时抖动，验证需限 workers。 |
| Safari 真机人工抽测 | _待填_ | | RC 前在真 Safari 上人工过一遍 Showcase 浮层 |

> 说明：Firefox/WebKit 目前是本地实测（Windows），与 CI 的 Linux Chromium 字体/滚动条环境仍有差异；RC 发版前按上文策略在 Linux 上再跑一次 Firefox。CI required 门禁维持 Chromium 三项目不变。
