# 组件迁移矩阵

> 跟踪每个 Blora Design 组件从 1.x 到 2.0 的迁移状态。
> 状态说明：⬚ 未开始 | 🔄 进行中 | ✅ 完成 | ⏸️ 暂停 | ❌ 不迁移

## Stable Core（Phase 4-7）

| 组件 | 1.x 实现 | 2.0 目标 | 类型 | 状态 | 阶段 |
|---|---|---|---|---|---|
| **Button** | `.blora-btn` | `.blora-button` | 原生元素样式 | ⬚ | Phase 4 |
| **Input** | `.blora-input` | `.blora-input` | 原生元素样式 | ⬚ | Phase 5 |
| **Textarea** | `.blora-textarea` | `.blora-textarea` | 原生元素样式 | ⬚ | Phase 5 |
| **Field** | `.blora-field` / `.blora-form-item` | `.blora-field` | CSS 组合 | ⬚ | Phase 5 |
| **Checkbox** | `.blora-checkbox` | `.blora-checkbox` + native input | 原生语义组合 | ⬚ | Phase 5 |
| **Radio** | `.blora-radio` | `.blora-radio` + native input | 原生语义组合 | ⬚ | Phase 5 |
| **Switch** | `.blora-switch` | `.blora-switch` + checkbox | 原生语义组合 | ⬚ | Phase 5 |
| **Select (native)** | `.blora-select` | `.blora-select-native` | 原生 select | ⬚ | Phase 5 |
| **Select (custom)** | `.blora-select-wrap` | `<blora-select>` | Form-associated WC | ⬚ | Phase 4 |
| **Tag** | `.blora-tag` | `.blora-tag` | CSS | ⬚ | Phase 5 |
| **Badge** | `.blora-badge` | `.blora-badge` | CSS | ⬚ | Phase 7 |
| **Avatar** | `.blora-avatar` | `.blora-avatar` | CSS | ⬚ | Phase 7 |
| **Alert** | `.blora-alert` | `.blora-alert` | CSS | ⬚ | Phase 5 |
| **Spinner** | `.blora-spinner` | `.blora-spinner` | CSS | ⬚ | Phase 5 |
| **Progress** | `.blora-progress` | `.blora-progress` | CSS | ⬚ | Phase 5 |
| **Skeleton** | `.blora-skeleton` | `.blora-skeleton` | CSS | ⬚ | Phase 5 |
| **Toast** | `Blora.toast()` | `toast()` + `<blora-toast-region>` | Service + WC | ⬚ | Phase 5 |
| **Card** | `.blora-card` | `.blora-card` | CSS | ⬚ | Phase 7 |
| **Panel** | `.blora-panel` | `.blora-panel` | CSS | ⬚ | Phase 7 |
| **Container** | `.blora-container` | `.blora-container` | CSS | ⬚ | Phase 3 |
| **Stack** | - | `.blora-stack` | CSS | ⬚ | Phase 3 |
| **Cluster** | - | `.blora-cluster` | CSS | ⬚ | Phase 3 |
| **Grid** | - | `.blora-grid` | CSS | ⬚ | Phase 3 |
| **Tabs** | `[data-blora-tabs]` | `<blora-tabs>` | WC | ⬚ | Phase 6 |
| **Breadcrumb** | `.blora-breadcrumb` | `.blora-breadcrumb` | CSS | ⬚ | Phase 6 |
| **Pagination** | `[data-blora-pagination]` | `<blora-pagination>` | WC | ⬚ | Phase 6 |
| **Table** | `.blora-table` | `.blora-table` + `createTableController()` | CSS + Headless | ⬚ | Phase 7 |
| **Dropdown** | `[data-blora-dropdown-trigger]` | `<blora-dropdown>` | WC | ⬚ | Phase 6 |
| **Menu** | `.blora-dropdown-menu` | `<blora-menu>` | WC | ⬚ | Phase 6 |
| **Tooltip** | `.blora-tooltip` | `<blora-tooltip>` | WC | ⬚ | Phase 6 |
| **Popover** | `[data-blora-popover]` | `<blora-popover>` | WC | ⬚ | Phase 6 |
| **Dialog** | `[data-blora-modal-open]` | `<blora-dialog>` | WC | ⬚ | Phase 4 |
| **Drawer** | `[data-blora-drawer-open]` | `<blora-drawer>` | WC | ⬚ | Phase 6 |
| **Navbar** | `.blora-navbar` | `.blora-navbar` | CSS | ⬚ | Phase 6 |
| **Collapse** | `.blora-collapse` | native `<details>` | 混合 | ⬚ | Phase 7 |
| **Accordion** | `[data-blora-accordion]` | `<blora-accordion>` | WC | ⬚ | Phase 7 |
| **Empty** | `.blora-empty` | `.blora-empty` | CSS | ⬚ | Phase 7 |
| **Result** | `.blora-result` | `.blora-result` | CSS | ⬚ | Phase 7 |

## Advanced（Phase 7+，beta 状态）

| 组件 | 1.x 实现 | 2.0 目标 | 类型 | 状态 |
|---|---|---|---|---|
| **Tree** | `.blora-tree` | `<blora-tree>` | WC | ⬚ |
| **Tree Select** | `initTreeSelect` | `<blora-tree-select>` | Form-associated WC | ⬚ |
| **Date Picker** | `[data-blora-datepicker]` | `<blora-date-picker>` | Form-associated WC | ⬚ |
| **Time Picker** | `[data-blora-timepicker]` | `<blora-time-picker>` | Form-associated WC | ⬚ |
| **Calendar** | `[data-blora-calendar]` | `<blora-calendar>` | WC | ⬚ |
| **Cascader** | `[data-blora-cascader]` | `<blora-cascader>` | Form-associated WC | ⬚ |
| **Transfer** | `.blora-transfer` | `<blora-transfer>` | Form-associated WC | ⬚ |
| **Carousel** | `.blora-carousel` | `<blora-carousel>` | WC | ⬚ |
| **Tour** | `Blora.tour()` | `<blora-tour>` | WC | ⬚ |
| **Splitter** | `initSplitter` | `<blora-splitter>` | WC | ⬚ |
| **Command Palette** | `initCommandPalette` | `<blora-command>` | WC | ⬚ |
| **File Upload** | `[data-blora-file-upload]` | `<blora-file-upload>` | WC | ⬚ |
| **OTP** | `.blora-otp` | `<blora-otp>` | WC | ⬚ |
| **Mentions** | `initMentions` | `<blora-mentions>` | WC | ⬚ |
| **AutoComplete** | `initAutoComplete` | `<blora-autocomplete>` | WC | ⬚ |
| **Color Picker** | `.blora-color-picker` | `<blora-color-picker>` | Form-associated WC | ⬚ |
| **Slider** | `.blora-slider` | `<blora-slider>` | WC | ⬚ |
| **Range** | `.blora-range` | `<blora-range>` | WC | ⬚ |
| **Rate** | `.blora-rate` | `<blora-rate>` | WC | ⬚ |
| **Segmented** | `.blora-segmented` | `.blora-segmented` | CSS | ⬚ |
| **Number** | `.blora-number` | `.blora-number` | 原生增强 | ⬚ |
| **Tags Input** | `.blora-tags-input` | `<blora-tags-input>` | WC | ⬚ |
| **Search** | `.blora-search` | `<blora-search>` | WC | ⬚ |

## Add-ons（Phase 9，移出核心包）

| 组件 | 1.x 实现 | 2.0 目标包 | 状态 |
|---|---|---|---|
| **Markdown** | `Blora.markdown()` / `initMarkdown` | `@bloret-crew/blora-markdown` | ⬚ |
| **Thread/BBS** | `initThread` | `@bloret-crew/blora-thread` | ⬚ |
| **QRCode** | `Blora.qrcode()` / `initQRCode` | `@bloret-crew/blora-qrcode` | ⬚ |
| **Text FX** | `Blora.textFx()` / `initTextFx` | `@bloret-crew/blora-effects` | ⬚ |
| **Text Rotate** | `initTextRotate` | `@bloret-crew/blora-effects` | ⬚ |
| **Countdown** | `[data-blora-countdown]` | `@bloret-crew/blora-effects` | ⬚ |
| **CountUp** | `initCountUp` | `@bloret-crew/blora-effects` | ⬚ |
| **Image Diff** | `.blora-diff` | `@bloret-crew/blora-effects` | ⬚ |
| **Hover Gallery** | `.blora-hover-gallery` | `@bloret-crew/blora-effects` | ⬚ |
| **Deck** | `.blora-deck` | `@bloret-crew/blora-effects` | ⬚ |
| **Watermark** | `initWatermark` | `@bloret-crew/blora-effects` | ⬚ |
| **Speed Dial** | `[data-blora-speed-dial]` | `@bloret-crew/blora-effects` | ⬚ |
| **Mega Menu** | `[data-blora-megamenu]` | `@bloret-crew/blora-effects` | ⬚ |
| **Sidebar Layout** | `[data-blora-sidebar-layout]` | `@bloret-crew/blora-layout` | ⬚ |
| **Affix** | `initAffix` | `@bloret-crew/blora-layout` | ⬚ |
| **Anchor** | `initAnchor` | `@bloret-crew/blora-layout` | ⬚ |
| **Scroll Spy** | `[data-blora-spy]` | `@bloret-crew/blora-layout` | ⬚ |
| **Smooth Scroll** | `initSmoothScroll` | `@bloret-crew/blora-layout` | ⬚ |
| **Palette Picker** | `[data-blora-palette-picker]` | `@bloret-crew/blora-theming` | ⬚ |
| **Shortcut Hints** | `[data-blora-shortcut]` | `@bloret-crew/blora-effects` | ⬚ |

## Foundations（Phase 2-3）

| 项目 | 状态 | 阶段 |
|---|---|---|
| Design Tokens (DTCG JSON) | ⬚ | Phase 2 |
| Token 生成器 (CSS/TS/manifest) | ⬚ | Phase 2 |
| v1 Token 映射 | ⬚ | Phase 2 |
| Optional Reset | ⬚ | Phase 3 |
| Base Typography | ⬚ | Phase 3 |
| Focus Styles | ⬚ | Phase 3 |
| @layer Cascade | ⬚ | Phase 3 |
| RTL / Logical Properties | ⬚ | Phase 3 |
| Reduced Motion | ⬚ | Phase 3 |

## Infrastructure（Phase 1）

| 项目 | 状态 |
|---|---|
| pnpm workspace | ⬚ |
| TypeScript strict | ⬚ |
| ESLint / Stylelint / Prettier | ⬚ |
| Vitest | ⬚ |
| Playwright | ⬚ |
| Storybook | ⬚ |
| Changesets | ⬚ |
| CI (GitHub Actions) | ⬚ |
| `pnpm verify` | ⬚ |
| `npm pack` fixture | ⬚ |

## DoD 检查清单（每个组件完成时填写）

每个组件只有满足以下全部条件才可标记 ✅：

- [ ] 正确原生语义或 ADR 说明
- [ ] contract.json
- [ ] TypeScript 类型
- [ ] Story
- [ ] 单元测试
- [ ] Playwright 交互测试
- [ ] 键盘测试
- [ ] axe a11y 测试
- [ ] 视觉回归基线
- [ ] light/dark
- [ ] 320px
- [ ] RTL
- [ ] reduced-motion
- [ ] 1.x 迁移说明
- [ ] manifest 更新
- [ ] custom-elements.json 更新
