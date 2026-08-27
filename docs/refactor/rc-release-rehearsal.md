# RC 发布链演练记录

**日期**：2026-08-27  
**当前代码线**：`2.0.0-rc.0`（已发布）

## RC 门禁

- [x] `pnpm verify` 全量通过
- [x] Firefox Playwright 全量通过：87/87
- [x] WebKit Playwright 全量通过：87/87
- [x] npm clean consumer 安装七个公开包（`2.0.0-rc.0`，2026-08-27 复跑）
- [x] Node SSR-safe import（`2.0.0-rc.0`）
- [x] CDN IIFE 可达（`2.0.0-rc.0`，2026-08-27 复跑）
- [x] CSP 页面允许 CDN IIFE 加载（`2.0.0-rc.0`，2026-08-27 复跑）
- [x] rollback 操作演练（非变更式，未移动公共 dist-tag）

## 浏览器实测

```text
pnpm exec playwright test --config playwright.config.ts --project=firefox --workers=1
87 passed (1.8m)

pnpm exec playwright test --config playwright.config.ts --project=webkit --workers=1
87 passed (9.2m)
```

Firefox 和 WebKit 使用当前 RC 收口代码。跨主题对比度测试 fixture 禁用了过渡动画，避免引擎在主题切换中间帧读取临时颜色；这不改变产品 CSS 或运行时行为。

## npm clean consumer

在临时目录执行了 npm 安装：

```text
npm install --ignore-scripts --no-audit --no-fund
  @bloret-crew/blora-design@2.0.0-beta.1
  @bloret-crew/blora-design-markdown@2.0.0-beta.1
  @bloret-crew/blora-design-thread@2.0.0-beta.1
  @bloret-crew/blora-design-qrcode@2.0.0-beta.1
  @bloret-crew/blora-design-effects@2.0.0-beta.1
  @bloret-crew/blora-design-layout@2.0.0-beta.1
  @bloret-crew/blora-design-theming@2.0.0-beta.1
```

结果：七个包均安装成功；核心 ESM import 返回 `VERSION === "2.0.0-rc.0"`、`isBrowser() === false`，六个 add-on 的实际公开导出均可导入，安装后的核心包版本为 `2.0.0-rc.0`。验证不依赖不存在的 `defineBloraTheming` 导出。

## CDN / CSP

- `https://cdn.jsdelivr.net/npm/@bloret-crew/blora-design@2.0.0-rc.0/dist/blora.global.js`：HTTP 200。
- 本地 HTTP fixture 使用：

```http
Content-Security-Policy: default-src 'none'; script-src https://cdn.jsdelivr.net; style-src 'unsafe-inline';
```

仅允许 jsDelivr 外链脚本时，Chromium 成功加载 RC.0 CDN IIFE；`globalThis.Blora.VERSION === "2.0.0-rc.0"`，无页面错误。页面没有使用 inline script，因此结果不受 CSP inline-script 阻断干扰。

## SSR import

```text
node --input-type=module -e "const m=await import('./packages/blora-design/dist/index.js'); console.log(m.VERSION, m.isBrowser())"
→ VERSION 2.0.0-rc.0
→ isBrowser() false
```

Node 环境导入没有访问浏览器专属对象；`defineBloraTimeline`、`createTableController` 等导出均为 function。

## Rollback rehearsal

本次不移动 npm 公共 tag，只演练发布工作流的回滚路径：

1. 发现 RC 缺陷时，停止继续向 `rc` / `latest` 发布。
2. 对受影响包执行：

   ```bash
   npm dist-tag add @bloret-crew/blora-design@<previous-known-good> rc
   npm dist-tag add @bloret-crew/blora-design-<addon>@<previous-known-good> rc
   ```

3. 通过 `npm view <package> dist-tags version` 验证回退指向。
4. 保留有缺陷版本，不使用 unpublish；修复后重新运行 `pnpm verify` 并发布下一个 RC。

RC.0 发布后的 npm tag 状态已核对：核心包 `latest=1.0.0`、`alpha=2.0.0-alpha.1`、`beta=2.0.0-beta.1`、`rc=2.0.0-rc.0`。本项目没有 1.x 用户或消费者，因此不会为 1.x 提供安全维护、兼容层、legacy 发布线或迁移支持承诺；本记录中的旧 `latest=1.0.0` 只是发布历史状态，不是 2.0 Stable 的目标策略。

## Stable 2.0.0 最终验收（2026-08-27）

- Git tag `v2.0.0` 已推送。
- GitHub Actions Release run `33082759486` 成功：构建、publint、attw、七包发布和 GitHub Release 均成功。
- npm `latest` 已指向 `2.0.0`；七个公开包的 `@latest` 均核对为 `2.0.0`。
- 全新临时 consumer 安装七个 `2.0.0` 包成功；核心版本、SSR-safe import 和六个 add-on import 均通过。
- Stable CDN IIFE 在限制性 CSP 页面中成功加载：`globalThis.Blora.VERSION === "2.0.0"`，无页面错误。
- 工作区最终 `pnpm verify` 通过。

真实 Safari 设备当前环境不可用，因此不伪造真机结果；Playwright WebKit 26.5 已完成 87/87，作为可执行的 Safari 近似覆盖。

## 结论

RC.0 的本地质量门禁、Firefox/WebKit 实测、npm/CDN/CSP/SSR 证据、非变更式 rollback rehearsal、Stable tag/npm/GitHub Release 和最终验收已完成。GitHub Actions release run `33082759486` 成功，npm `latest` 指向 `2.0.0`。本项目不建立 1.x 维护或兼容发布线。
