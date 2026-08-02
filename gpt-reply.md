结论：Phase 9 的功能迁移成果可以认可，但目前不建议直接发布 Phase 10 Alpha。

更准确的状态应该是：

> Phase 9 自限完成 → Phase 10 Preflight 进行中 → 门禁全绿后发布 Alpha

仓库其实已经在最新提交中把状态改成了“Phase 10 进行中”，所以你不是“准备进入 Phase 10”，而是已经进入了。现在应该先完成 Phase 10 的入口整顿。

## 做得好的部分

整体架构已经比 1.0 健康很多：

- pnpm workspace 和 TypeScript strict 已建立。
- 1.x 源码、展示页和视觉基线被完整冻结。
- Token 生成确定，160 个亮色 Token、40 个暗色覆盖、9 套主题。
- 76 份组件 contract、91 个 Story。
- 核心包和 6 个 add-on 都能构建。
- 全 workspace typecheck 通过。
- Token 对比度检查通过。
- Storybook 能完整构建。
- 主包 `publint` 通过。
- 主包 tarball 可以安装，ESM 和 SSR import 测试通过。
- 核心 91 个单测及 add-on 测试断言本身均通过。
- ADR-013 对“原生 DOM + headless controller，少量 CE”的调整是合理的，没有必要强行把所有组件改成 Web Components。

这说明方向没有跑偏，Phase 9 不是虚假的空架构。

## 当前阻塞项

### 1. `pnpm verify` 确实失败

我在最新提交 `b88278e` 上完整执行了 `pnpm verify`，当前结果：

| 门禁               | 结果                                |
| ------------------ | ----------------------------------- |
| JavaScript lint    | ❌ 4 个错误                         |
| CSS lint           | ❌ 72 个错误                        |
| Token/CSS contract | ❌ 27 个错误                        |
| Prettier           | ❌ 58 个文件                        |
| TypeScript         | ✅                                  |
| Token 对比度       | ✅                                  |
| Build              | ✅                                  |
| Publint            | ✅                                  |
| `attw`             | ❌                                  |
| Unit assertions    | ✅，但进程不退出                    |
| Browser            | 本地环境无法下载 Chromium，未能实跑 |
| Pack fixture       | ✅                                  |

其中 CSS 问题不全是格式：

- 未登记 Token；
- 组件 CSS 直接写颜色；
- 未登记 z-index；
- `.is-open`、`.is-leaving` 等状态 class 与 2.0 规则冲突；
- `image.css` 有直接色值；
- `tree-select`、`popover`、`notification` 有未登记层级。

这些必须在 Alpha 之前处理。

### 2. 发布工作流仍然是 1.x 的，当前必然失败

当前 [publish.yml](https://github.com/BloretCrew/blora-design/blob/master/.github/workflows/publish.yml) 仍然：

- 从根 `package.json` 读取版本；
- 查找已经不存在的根 `blora.js`；
- 执行根目录 `npm publish`，但根包是 `private: true`；
- 发布说明仍要求加载 `blora.js`；
- 没有安装 pnpm workspace；
- 没有执行完整门禁；
- 不会正确发布 6 个 add-on；
- 没有 prerelease dist-tag 策略。

这属于 Alpha 发布的 P0 阻塞项，必须整体重写，不能继续沿用。

### 3. CI 聚合表达式有问题

[ci.yml](https://github.com/BloretCrew/blora-design/blob/master/.github/workflows/ci.yml) 使用：

```yaml
every(needs.*.result == 'success')
```

GitHub Actions 官方表达式函数中没有 `every()`；应改成显式比较或 `contains(needs.*.result, 'failure')` 形式。[GitHub Actions 表达式文档](https://docs.github.com/actions/reference/evaluate-expressions-in-workflows-and-actions)

另外 CI 目前没有运行：

- `publint`；
- `attw`；
- 真正的 visual；
- 真正的 axe；
- add-on pack/publish 验证。

因此即使现有 aggregate 变绿，也不能证明包消费面正确。

### 4. a11y 和 visual 门禁目前只是名字，不是真实能力

当前 Playwright 配置只有：

```text
chromium
mobile-chromium
a11y
```

问题是：

- `a11y` 项目只是把普通 38 条浏览器测试再跑一遍；
- 浏览器测试中没有 `AxeBuilder`；
- 所以当前 `test:a11y` 并没有执行 axe；
- 没有 `visual` project；
- `pnpm test:visual` 会立即报 `Project "visual" not found`；
- 当前视觉快照数量为 0；
- 没有 Firefox/WebKit；
- 只有 7 个浏览器测试文件，远远覆盖不了 42 个 stable contract。

因此 [remaining-work.md](https://github.com/BloretCrew/blora-design/blob/master/docs/refactor/remaining-work.md) 将这些留在 Phase 10 是正确的，但必须排在 Alpha 发布之前，而不是之后慢慢补。

### 5. 包导出仍有断点

`attw` 已经实际发现：

- `./components/tree-select.css` 无法解析；
- `./components/backtop.css` 无法解析。

此外计划中尚未完成：

- `./auto`；
- 稳定组件 JS 子路径；
- `custom-elements.json`；
- `component-manifest.json`；
- IIFE/global bundle；
- CHANGELOG；
- 纯 HTML example。

当前 `pack:test` 只验证主入口，所以没发现坏掉的子路径。需要让 pack fixture 遍历所有 `exports`。

### 6. 单测断言通过，但进程没有正常退出

在当前声明支持的 Node 24.14 环境中：

- 核心 91 个测试全部通过；
- 6 个 add-on 测试断言全部通过；
- 但每个 Vitest 进程都没有自动退出，只能手动终止。

可能原因：

- controller 留有 timer、observer 或 listener；
- Vitest 2 与 Node 24 的兼容问题；
- jsdom 资源没有释放。

因为根 `engines` 写的是 `node >=22`，Node 24 也属于承诺范围。要么修复，要么明确收窄支持版本并建立 Node 22/24 CI 矩阵。

QRCode 测试还持续打印 `HTMLCanvasElement.getContext` 未实现错误，虽然断言通过，但不应作为干净测试结果。

### 7. 体积门禁目前不真实

当前 size 检查显示：

```text
blora.css: 775 B gzip
```

但这个文件只是包含大量 `@import` 的聚合入口，并不是全部 CSS 的实际下载体积。

同时：

- `dist/index.js` 为 173 KB，gzip 41.14 KB；
- 所有 controller 都聚合进主入口；
- 没有 JS 子路径；
- add-on 没有 size、publint、attw、pack fixture 门禁。

因此 Phase 10 必须重新计算：

- 展平后的全量 CSS；
- 单组件 CSS；
- 主入口 JS；
- 单组件 JS；
- 每个 add-on；
- compat 独立体积。

### 8. 状态文档存在漂移

目前：

- [status.md](https://github.com/BloretCrew/blora-design/blob/master/docs/refactor/status.md) 写 Phase 10 已进行；
- `remaining-work.md` 也写已进入 Phase 10；
- 根 `AGENTS.md` 仍写“当前 Phase 0”；
- `remaining-work.md` 仍称迁移文档是 stub，但现在迁移文档已经有约 220 行；
- `component-matrix.md` 将大量组件标为“✅ 可用”，容易被误读为 stable；
- 42 个 contract 已标 stable，但只有 9 个核心单测文件和 7 个浏览器测试文件。

建议 contract 状态先改成：

```text
implemented
candidate
stable
beta
```

或者将现有 42 个 stable 暂时降为 `candidate`，完成组件级 DoD 后再升 stable。

## 建议调整 Phase 10 顺序

在 `remaining-work.md` 的 Alpha 前面增加一个 `3.0 Phase 10 Preflight`：

1. 修复所有 lint、format、Token contract。
2. 修复 Vitest 不退出和 QRCode canvas 噪音。
3. 修复 `attw` 导出错误。
4. 重写 CI aggregate，加入 publint/attw。
5. 重写 monorepo prerelease workflow。
6. 确保 `pnpm verify` 在 Node 22 CI 完整通过。
7. 增加真实 axe project。
8. 增加 visual project 和首批快照。
9. 生成 manifest。
10. 增加 `./auto` 和稳定组件 JS 子路径。
11. 增加纯 HTML 安装 fixture。
12. 同步 `AGENTS.md`、status、remaining-work。
13. 重新治理 42 个 stable contract。
14. 所有包执行 publint、attw、pack fixture。
15. 完成 Alpha 发布演练，再发布 `2.0.0-alpha.1 --tag next`。

## 最终判断

- Phase 9 功能迁移：**可以认为完成。**
- Phase 10 工作计划方向：**大体正确，但顺序不够安全、遗漏发布链和 CI 真门禁。**
- 现在发布 Alpha：**No-Go。**
- 现在开始 Phase 10 Preflight：**Go。**
- Preflight 全绿后发布 Alpha：**Go。**

所以可以继续做 Phase 10，但第一步不是发 Alpha，而是先做上述入口收口。
