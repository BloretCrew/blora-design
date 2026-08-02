# 组件迁移矩阵

> 与仓库现状对齐（2026-08-02）。状态：⬚ 未开始 | 🔄 进行中 | ✅ 实现可用（API/CSS/Story）| ❌ 不迁移  
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
| Alert / Spinner / Progress / Skeleton | CSS + progress ctrl | ✅ | |
| Toast | service | ✅ | `toast` / `message` |
| Card / List / Empty / Result | CSS | ✅ | List 无外框，可 Card 组合 |
| Table | headless | ✅ | sort + page + **cols** + **virtual (Y/X)** + **selectable 内置行选** |
| Tabs / Breadcrumb / Pagination | CSS + controllers | ✅ | |
| Dropdown / Tooltip / Popover / Dialog / Drawer | headless / WC | ✅ | |
| Navbar | CSS | ✅ | |
| Collapse / Accordion | headless | ✅ | 测量高度展开 |
| Tree | headless | ✅ | |
| Tree Select | headless | ✅ | Phase 9 补齐 |
| Form | headless validate | ✅ | Phase 9 补齐 |
| Calendar / Date / Time / Cascader / Transfer / … | headless 子集 | ✅ | beta 路径有单测抽样 |
| Mentions / OTP / Tags Input / Upload / Command Palette | headless | ✅ | |
| Image | loading + preview | ✅ | `openImagePreview` |
| Notification | CSS + `notify()` | ✅ | 多 placement |
| Steps | CSS + controller | ✅ | |
| BackTop | CSS + controller | ✅ | Phase 9 补齐 |
| Deck / Speed Dial / Megamenu / Dock / FAB | core | ✅ | 决策留核 |

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
| Workspace / CI / Storybook / verify 脚本 | ✅ |

## DoD 清单（每个组件理想态）

仍适用；**当前不要求每个组件全部勾满**。Phase 9 收口要求：公开 API 可测、文档不撒谎、包可 typecheck。全量农场 → Phase 10。

- [ ] Playwright 交互（全矩阵）
- [ ] axe a11y
- [ ] 视觉回归基线
- [ ] RTL / 320px / reduced-motion 专项
- [ ] 1.x 迁移说明逐组件
