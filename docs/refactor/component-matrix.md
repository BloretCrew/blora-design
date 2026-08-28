# 组件迁移矩阵

> 与仓库现状对齐（2026-08-08）。状态：⬚ 未开始 | 🔄 进行中 | ✅ 实现可用（API/CSS/Story）| ❌ 不迁移
> **✅ ≠ contract `stable` ≠ §26 全 DoD。** 完整门禁 / 可宣传 stable 治理见 [`remaining-work.md`](./remaining-work.md) §3.0–3.4。  
> Playwright/axe/视觉全矩阵在 Phase 10（Preflight 最小诚实集 + 后续农场）。

## Stable Core

| 组件 | 类型 | 状态 | 备注 |
|---|---|---|---|
| Button | CSS + loading helper | ✅ | `.blora-button` + `data-variant` |
| Input / Textarea / Field | CSS + field limit | ✅ | Form validate 见 Form |
| Checkbox / Radio / Switch | CSS + checkbox controller | ✅ | |
| Select | WC | ✅ | `<blora-select>` |
| Tag / Badge / Avatar | CSS | ✅ | intentional CSS-only |
| Alert / Progress | Composite CE + advanced controller | ✅ | 官方结构由 CE 持有 |
| Spinner / Skeleton | CSS | ✅ | intentional CSS-only |
| Message | css + service | ✅ | `.blora-message` / `message()`（无 toast） |
| Card / List | CSS | ✅ | List 无外框，可 Card 组合 |
| Empty / Result | Composite CE | ✅ | 官方结构由 CE 持有 |
| Table | headless | ✅ | sort + page + **cols** + **virtual (Y/X)** + **selectable 内置行选** |
| Tabs / Segmented | Composite CE + advanced controller | ✅ | ADR-015 默认标签 API |
| Breadcrumb / Pagination | Composite CE + advanced controller | ✅ | |
| Dropdown / Tooltip / Popover / Dialog / Drawer | Composite CE + advanced controller | ✅ | |
| Navbar | Composite CE | ✅ | |
| Sidebar Navigation | Composite CE | ✅ | 分组、当前项与链接状态由官方 CE 持有 |
| Collapse / Accordion | Composite CE + advanced controller | ✅ | 测量高度展开；手写树非默认 |
| Tree / Tree Select | Composite CE + advanced controller | ✅ | |
| Form | headless validate | ✅ | Phase 9 补齐 |
| Date / Time / Range / Search / Transfer | Composite CE + advanced controller | ✅ | 官方 light DOM；beta contract 见各组件 |
| Calendar / Cascader / Autocomplete | Composite CE + advanced controller | ✅ | beta 路径有单测抽样 |
| Command Palette | Composite CE + advanced controller | ✅ | `<blora-command>` |
| Mentions / OTP / Tags Input / Upload / Number Input / Swap | Composite CE + advanced controller | ✅ | Upload 包含紧凑 File Picker；Number Input 与 Swap 使用原生表单控件 |
| Image | Composite CE + preview API | ✅ | `openImagePreview` |
| Notification | CSS + `notify()` | ✅ | 多 placement |
| Steps | Composite CE + advanced controller | ✅ | |
| BackTop | Composite CE + advanced controller | ✅ | Phase 9 补齐 |
| Deck / Speed Dial / Megamenu / Dock | Composite CE + advanced controller | ✅ | 决策留核 |
| FAB | CSS | ✅ | intentional CSS-only |
| Media Container | CSS | ✅ | 正式比例与 object-fit 契约 |
| Indicator / Hero / Footer / Join / Divider | CSS | ✅ | 页面骨架与角标定位收成正式契约 |
| Menu | CSS | ✅ | 原生链接列表；侧栏仍用 Sidebar Nav |

## Add-ons（Phase 9 ✅）

| 组件 | 包 | 状态 |
|---|---|---|
| Thread | thread | ✅ |
| Markdown | markdown | ✅ |
| QRCode | qrcode | ✅ |
| Text FX / Rotate / Countdown / CountUp / Diff / Hover Gallery / Watermark / Shortcuts | effects | ✅ |
| Sidebar / Affix / Anchor / Spy / Smooth Scroll | layout | ✅ |
| Palette / Color scheme | theming | ✅ |

## Foundations / Infra

| 项目 | 状态 |
|---|---|
| Tokens + themes | ✅ |
| Reset / base / layout / utilities | ✅ |
| Workspace / CI / Showcase / verify 脚本 | ✅ |

## DoD 清单（每个组件理想态）

仍适用；**当前不要求每个组件全部勾满**。Phase 9 收口要求：公开 API 可测、文档不撒谎、包可 typecheck。全量农场 → Phase 10。

- [ ] Playwright 交互（全矩阵）
- [ ] axe a11y
- [ ] 视觉回归基线
- [ ] RTL / 320px / reduced-motion 专项
- [x] 逐组件 npm 迁移示例：`docs/migration/from-any-ui-to-blora-design.md`
