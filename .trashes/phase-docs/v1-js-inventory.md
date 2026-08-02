# Blora Design 1.x JavaScript 公共 API 清单

> 从 `blora.js`（6,214 行）和 `blora.d.ts`（196 行）提取。此文件是 2.0 重构的迁移参考。

## 模块模式

UMD 工厂模式。全局名 `window.Blora`，导出 `module.exports = Blora`。

## 外部依赖

**零运行时第三方依赖。** QRCode 和 Markdown 为文件内自包含实现。

## 全局 API（`Blora.*`）

### 属性

| 属性          | 类型                                      | 说明                 |
| ------------- | ----------------------------------------- | -------------------- |
| `version`     | `string`                                  | `"1.0.0"`            |
| `locale`      | `Locale`                                  | 当前语言数据（只读） |
| `locales`     | `string[]`                                | 可用语言码           |
| `palettes`    | `Readonly<Record<string, PalettePreset>>` | 配色预设             |
| `textFxNames` | `readonly string[]`                       | 文字效果名列表       |

### 方法

| 方法                  | 参数                      | 返回                             | 说明                   |
| --------------------- | ------------------------- | -------------------------------- | ---------------------- |
| `init`                | `root?, options?`         | `void`                           | 初始化 root 下所有组件 |
| `configure`           | `options?`                | `Config`                         | 设置全局配置           |
| `setOptions`          | `options?`                | `Config`                         | configure 别名         |
| `getConfig`           | -                         | `Config`                         | 获取当前配置           |
| `cls`                 | `...parts`                | `string`                         | 拼接 classPrefix       |
| `classPrefix`         | -                         | `string`                         | 获取当前前缀           |
| `applyPalette`        | `name, target?, options?` | `boolean`                        | 应用配色               |
| `getPalette`          | `target?`                 | `string`                         | 获取当前配色           |
| `applyColorMode`      | `mode, target?, options?` | `boolean`                        | 应用颜色模式           |
| `getColorMode`        | `target?`                 | `ColorMode`                      | 获取颜色模式           |
| `formatShortcut`      | `shortcut, platform?`     | `string`                         | 格式化快捷键           |
| `getShortcutPlatform` | `base?`                   | `string`                         | 获取当前平台           |
| `t`                   | `key, params?`            | `string`                         | 翻译框架文案           |
| `setLocale`           | `code, pack?`             | `string`                         | 切换语言               |
| `getLocale`           | -                         | `string`                         | 获取当前语言码         |
| `validate`            | `form`                    | `FormValidationResult`           | 同步表单校验           |
| `validateAsync`       | `form`                    | `Promise<FormValidationResult>`  | 异步表单校验           |
| `validateField`       | `field`                   | `FieldValidationResult`          | 单字段校验             |
| `validateFieldAsync`  | `field`                   | `Promise<FieldValidationResult>` | 异步单字段校验         |
| `clearValidation`     | `form`                    | `void`                           | 清除校验状态           |
| `getValues`           | `form`                    | `Record<string, unknown>`        | 获取表单值             |
| `setValues`           | `form, values`            | `Record<string, unknown>`        | 设置表单值             |
| `registerAsyncRule`   | `name, fn`                | `void`                           | 注册异步校验规则       |
| `toast` / `message`   | `options`                 | `void`                           | 显示 toast             |
| `notify`              | `options`                 | `{close, el}                     | null`                  | 通知          |
| `confirm`             | `options?`                | `Promise<boolean>`               | 确认对话框             |
| `preview`             | `target, options?`        | `void`                           | 图片预览               |
| `closePreview`        | -                         | `void`                           | 关闭预览               |
| `tour`                | `options?`                | `void`                           | 引导                   |
| `backTop`             | `options?`                | `Element                         | null`                  | 返回顶部      |
| `textFx`              | `target, name?, options?` | `Element                         | null`                  | 文字效果      |
| `markdown` / `md`     | `source, options?`        | `string`                         | Markdown -> HTML       |
| `renderMarkdown`      | `el, source?, options?`   | `Element                         | null`                  | 渲染 Markdown |
| `qrcode`              | `target, options?`        | `void`                           | 生成二维码             |
| `openModal`           | `target`                  | `void`                           | 打开模态框             |
| `closeModal`          | `target`                  | `void`                           | 关闭模态框             |
| `openDrawer`          | `target`                  | `void`                           | 打开抽屉               |
| `closeDrawer`         | `target`                  | `void`                           | 关闭抽屉               |

### 子 API

| 命名空间       | 方法                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `Blora.table`  | `sort`, `setPage`, `setRows`, `setLoading`, `getSelection`, `clearSelection`, `getState`, `renderPagination` |
| `Blora.select` | `setOptions`                                                                                                 |

## 配置（`Blora.Options` / `Blora.Config`）

| 选项                  | 类型                        | 默认值               | 说明               |
| --------------------- | --------------------------- | -------------------- | ------------------ |
| `autoInit`            | `boolean`                   | `true`               | 自动初始化         |
| `portalRoot`          | `string \| Element \| null` | `null`               | 浮层根节点         |
| `colorModeStorageKey` | `string`                    | `"blora-color-mode"` | 颜色模式存储键     |
| `paletteStorageKey`   | `string`                    | `"blora-palette"`    | 配色存储键         |
| `classPrefix`         | `string`                    | `"blora"`            | class 前缀         |
| `tableColsStorageKey` | `string`                    | -                    | 表格列设置存储键   |
| `size`                | `ControlSize`               | `"md"`               | 控件尺寸           |
| `validateOn`          | `string`                    | -                    | 校验触发时机       |
| `tablePageSize`       | `number`                    | -                    | 表格每页行数       |
| `locale`              | `string \| LocalePack`      | `"zh-CN"`            | 语言               |
| `localeCode`          | `string`                    | -                    | 配合 pack 的语言码 |
| `messages`            | `Record<string, string>`    | -                    | 覆盖文案           |

## 组件初始化器（50 个）

`Blora.init(root)` 按以下顺序执行 50 个初始化器，每个用 `querySelectorAll` 扫描 DOM：

| #   | 名称                  | 选择器                                       | 组件                 |
| --- | --------------------- | -------------------------------------------- | -------------------- |
| 1   | `initTabs`            | `[data-blora-tabs]`                          | Tabs                 |
| 2   | `initCollapse`        | `.blora-collapse__item`                      | Collapse / Accordion |
| 3   | `initModal`           | `[data-blora-modal-open]`                    | Modal                |
| 4   | `initDrawer`          | `[data-blora-drawer-open]`                   | Drawer               |
| 5   | `initPopover`         | `[data-blora-popover]`                       | Popover              |
| 6   | `initTooltip`         | `.blora-tooltip`                             | Tooltip              |
| 7   | `initDropdown`        | `[data-blora-dropdown-trigger]`              | Dropdown             |
| 8   | `initSpeedDial`       | `[data-blora-speed-dial]`                    | Speed Dial           |
| 9   | `initSidebarLayout`   | `[data-blora-sidebar-layout]`                | Sidebar Layout       |
| 10  | `initMegamenu`        | `[data-blora-megamenu]`                      | Mega Menu            |
| 11  | `initSegmented`       | `.blora-segmented`                           | Segmented Control    |
| 12  | `initSearch`          | `.blora-search`                              | Search Input         |
| 13  | `initBtnLoading`      | `[data-blora-loading]`                       | Button Loading       |
| 14  | `initRate`            | `.blora-rate`                                | Rate / Rating        |
| 15  | `initSlider`          | `.blora-slider`                              | Slider               |
| 16  | `initProgress`        | `.blora-progress`                            | Progress             |
| 17  | `initTextLimit`       | `input[data-blora-limit]`                    | Text Limit           |
| 18  | `initTagsInput`       | `.blora-tags-input`                          | Tags Input           |
| 19  | `initNumber`          | `.blora-number`                              | Number Input         |
| 20  | `initCheckbox`        | `[data-blora-checkall]`                      | Checkbox (check all) |
| 21  | `initTree`            | `.blora-tree`                                | Tree                 |
| 22  | `initCarousel`        | `.blora-carousel`                            | Carousel             |
| 23  | `initBackTop`         | `[data-blora-backtop], .blora-backtop`       | Back to Top          |
| 24  | `initScrollSpy`       | `[data-blora-spy]`                           | Scroll Spy           |
| 25  | `initSmoothScroll`    | `a[href^="#"]`                               | Smooth Scroll        |
| 26  | `initPalettePicker`   | `[data-blora-palette-picker]`                | Palette Picker       |
| 27  | `initColorModeToggle` | `[data-blora-color-mode]`                    | Color Mode Toggle    |
| 28  | `initFileUpload`      | `[data-blora-file-upload], .blora-dropzone`  | File Upload          |
| 29  | `initCommandPalette`  | -                                            | Command Palette      |
| 30  | `initDateGuard`       | -                                            | Date Guard           |
| 31  | `initOTP`             | `.blora-otp`                                 | OTP Input            |
| 32  | `initCustomSelect`    | `.blora-select-wrap`                         | Custom Select        |
| 33  | `initRange`           | `.blora-range`                               | Range Slider         |
| 34  | `initTransfer`        | `.blora-transfer`                            | Transfer             |
| 35  | `initCascader`        | `[data-blora-cascader]`                      | Cascader             |
| 36  | `initDatePicker`      | `[data-blora-datepicker]`                    | Date Picker          |
| 37  | `initTimePicker`      | `[data-blora-timepicker]`                    | Time Picker          |
| 38  | `initCalendar`        | `[data-blora-calendar]`                      | Calendar             |
| 39  | `initColorPicker`     | `.blora-color-picker`                        | Color Picker         |
| 40  | `initCountdown`       | `[data-blora-countdown]`                     | Countdown            |
| 41  | `initDiff`            | `.blora-diff`                                | Image Diff           |
| 42  | `initHoverGallery`    | `.blora-hover-gallery`                       | Hover Gallery        |
| 43  | `initDeck`            | `.blora-deck`                                | Deck                 |
| 44  | `initTextRotate`      | `.blora-text-rotate`                         | Text Rotate          |
| 45  | `initTextFx`          | `.blora-text-fx, [data-blora-text-fx]`       | Text FX              |
| 46  | `initShortcutHints`   | `[data-blora-shortcut]`                      | Shortcut Hints       |
| 47  | `initForms`           | `form[data-blora-validate], form.blora-form` | Form Validation      |
| 48  | `initTables`          | `.blora-table`                               | Table                |
| 49  | `initImagePreview`    | -                                            | Image Preview        |
| 50  | `initAffix`           | -                                            | Affix                |
| 51  | `initAnchor`          | -                                            | Anchor               |
| 52  | `initTreeSelect`      | -                                            | Tree Select          |
| 53  | `initAutoComplete`    | -                                            | AutoComplete         |
| 54  | `initMentions`        | -                                            | Mentions             |
| 55  | `initTour`            | -                                            | Tour                 |
| 56  | `initWatermark`       | -                                            | Watermark            |
| 57  | `initSplitter`        | -                                            | Splitter             |
| 58  | `initMarkdown`        | -                                            | Markdown             |
| 59  | `initTypography`      | -                                            | Typography           |
| 60  | `initThread`          | -                                            | Thread / BBS         |
| 61  | `initQRCode`          | -                                            | QRCode               |
| 62  | `initCountUp`         | -                                            | CountUp              |

## 自定义事件清单

事件命名不一致是 1.x 的已知问题。以下是 JS 中 dispatch 的所有自定义事件：

| 事件名                      | 组件                                               | bubbles | detail                               |
| --------------------------- | -------------------------------------------------- | ------- | ------------------------------------ |
| `blora:localechange`        | i18n                                               | 是      | locale 数据                          |
| `blora:change`              | Segmented, Rate, Range, ColorPicker, Custom Select | 是      | `{value, item}` 或 `{min, max}`      |
| `blora:appearancechange`    | Palette / ColorMode                                | 是      | `{palette, mode, dark}`              |
| `blora:backtop-sync`        | BackTop                                            | 否      | -                                    |
| `blora:filechange`          | FileUpload                                         | 是      | 文件信息                             |
| `blora:search`              | Search                                             | 是      | 搜索值                               |
| `blora:validate`            | Form                                               | 是      | 校验结果                             |
| `blora:invalid`             | Form                                               | 是      | 校验错误                             |
| `blora:submit`              | Form                                               | 是      | 表单数据                             |
| `blora:table-change`        | Table                                              | 是      | `{page, pageSize, sortKey, sortDir}` |
| `blora:table-select`        | Table                                              | 是      | 选择信息                             |
| `blora:page-change`         | Pagination                                         | 是      | 页码                                 |
| `blora:treeselect-change`   | TreeSelect                                         | 是      | `{value, item}`                      |
| `blora:autocomplete-select` | AutoComplete                                       | 是      | `{value, option}`                    |
| `blora:complete`            | Countdown                                          | 是      | -                                    |
| `change` (native)           | Select, Checkbox, DatePicker, TimePicker           | 是      | -                                    |
| `input` (native)            | Search, ColorPicker                                | 是      | -                                    |

### 事件命名问题

1. `change` 和 `blora:change` 并存，语义重叠
2. 冒号命名（`blora:change`）与无冒号命名（`change`）混用
3. 组件特定事件（`blora:table-change`、`blora:treeselect-change`、`blora:autocomplete-select`）各自发明
4. 2.0 规格要求统一为 `blora-*` 前缀，废除冒号事件

## `data-blora-*` 属性清单

### 全局/配置

| 属性                          | 用途                | 读取组件        |
| ----------------------------- | ------------------- | --------------- |
| `data-blora-size`             | 控件尺寸 (sm/md/lg) | 全局 (html)     |
| `data-blora-class-prefix`     | class 前缀          | 全局 (html)     |
| `data-blora-palette`          | 配色名              | 全局 (html)     |
| `data-blora-color-preference` | 颜色模式偏好        | 全局 (html)     |
| `data-blora-color-mode`       | 颜色模式切换按钮    | ColorModeToggle |

### 组件行为

| 属性                            | 用途              | 组件                   |
| ------------------------------- | ----------------- | ---------------------- |
| `data-blora-tabs`               | Tabs 容器         | Tabs                   |
| `data-blora-accordion`          | 手风琴组          | Collapse               |
| `data-blora-close`              | 关闭按钮          | Modal, Drawer, Popover |
| `data-blora-modal-open`         | 打开模态框        | Modal                  |
| `data-blora-drawer-open`        | 打开抽屉          | Drawer                 |
| `data-blora-popover`            | Popover 触发器    | Popover                |
| `data-blora-dropdown-trigger`   | Dropdown 触发器   | Dropdown               |
| `data-blora-loading`            | 按钮 loading 状态 | Button                 |
| `data-blora-shortcut`           | 快捷键提示        | ShortcutHints          |
| `data-blora-backtop`            | 返回顶部按钮      | BackTop                |
| `data-blora-spy`                | 滚动监听偏移量    | ScrollSpy              |
| `data-blora-palette-picker`     | 配色选择器        | PalettePicker          |
| `data-blora-palette-trigger`    | 选择器触发器      | PalettePicker          |
| `data-blora-palette-option`     | 配色选项          | PalettePicker          |
| `data-blora-file-upload`        | 文件上传容器      | FileUpload             |
| `data-blora-file-input`         | 文件输入          | FileUpload             |
| `data-blora-file-trigger`       | 上传触发器        | FileUpload             |
| `data-blora-file-clear`         | 清除按钮          | FileUpload             |
| `data-blora-file-empty`         | 空状态            | FileUpload             |
| `data-blora-file-output`        | 输出区            | FileUpload             |
| `data-blora-file-name`          | 文件名显示        | FileUpload             |
| `data-blora-search`             | 搜索选择          | CustomSelect           |
| `data-blora-remote`             | 远程搜索          | CustomSelect           |
| `data-blora-multiple`           | 多选              | CustomSelect           |
| `data-blora-virtual`            | 虚拟列表          | CustomSelect           |
| `data-blora-max-tag-count`      | 最大标签数        | CustomSelect           |
| `data-blora-checkall`           | 全选主控          | Checkbox               |
| `data-blora-check-group`        | 复选框组          | Checkbox               |
| `data-blora-limit`              | 文本长度限制      | TextLimit              |
| `data-blora-limit-group`        | 限制组            | TextLimit              |
| `data-blora-limit-action`       | 限制动作          | TextLimit              |
| `data-blora-limit-invalid`      | 限制无效标记      | TextLimit              |
| `data-blora-manual`             | 跳过自动绑定      | Number/OTP             |
| `data-blora-speed-dial`         | 速度拨号容器      | SpeedDial              |
| `data-blora-speed-dial-trigger` | 触发器            | SpeedDial              |
| `data-blora-speed-dial-close`   | 关闭按钮          | SpeedDial              |
| `data-blora-speed-dial-main`    | 主按钮            | SpeedDial              |
| `data-blora-sidebar-layout`     | 侧边栏布局        | SidebarLayout          |
| `data-blora-sidebar-toggle`     | 侧边栏切换        | SidebarLayout          |
| `data-blora-megamenu`           | 大菜单            | MegaMenu               |
| `data-blora-megamenu-trigger`   | 触发器            | MegaMenu               |
| `data-blora-cascader`           | 级联选择          | Cascader               |
| `data-blora-datepicker`         | 日期选择          | DatePicker             |
| `data-blora-timepicker`         | 时间选择          | TimePicker             |
| `data-blora-calendar`           | 日历              | Calendar               |
| `data-blora-countdown`          | 倒计时            | Countdown              |
| `data-blora-transfer`           | 穿梭框方向        | Transfer               |
| `data-blora-pagination`         | 分页容器          | Pagination             |
| `data-blora-text-fx`            | 文字效果名        | TextFx                 |
| `data-blora-text-fx-play`       | 播放              | TextFx                 |
| `data-blora-text-fx-click`      | 点击触发          | TextFx                 |
| `data-blora-text-fx-host`       | 效果宿主          | TextFx                 |
| `data-blora-fx-split`           | 分割标记          | TextFx                 |
| `data-blora-fx-text`            | 文本缓存          | TextFx                 |
| `data-blora-validate`           | 表单校验          | Form                   |
| `data-blora-error`              | 错误显示          | Form                   |
| `data-blora-fixed`              | 表格列固定        | Table                  |

## JS 操作的 CSS 类（状态类）

| 类名           | 操作       | 组件                                                                |
| -------------- | ---------- | ------------------------------------------------------------------- |
| `.is-open`     | add/remove | Modal, Drawer, Popover, Dropdown, Collapse, MegaMenu, PalettePicker |
| `.is-active`   | add/remove | Tabs, Carousel, Segmented                                           |
| `.is-selected` | add/remove | Select, Tree, TreeSelect, DatePicker, Calendar                      |
| `.is-disabled` | add/remove | Select, Pagination                                                  |
| `.is-loading`  | add/remove | Button                                                              |
| `.is-invalid`  | add/remove | Form                                                                |
| `.is-hidden`   | add/remove | Tooltip                                                             |
| `.is-visible`  | add/remove | BackTop, Toast                                                      |
| `.blora-dark`  | add/remove | ColorMode                                                           |

## 组件完整列表

### Stable Core（规格要求 2.0.0 必须稳定）

Button, Input, Textarea, Checkbox, Radio, Switch, Select (native skin), Custom Select, Field, Card/Panel, Tag, Badge, Avatar, Alert, Spinner, Progress, Skeleton, Container, Stack, Cluster, Grid, Navbar, Tabs, Breadcrumb, Pagination, Table, Dropdown, Menu, Tooltip, Popover, Dialog, Drawer, Toast, Notification, Empty, Result, Collapse, Accordion

### Advanced（规格允许 2.0.x 稳定）

Date Picker, Time Picker, Calendar, Cascader, Tree Select, Transfer, Virtual Table, Table Column Settings, Carousel, Tour, Splitter, Command Palette, File Upload, OTP, Mentions, AutoComplete, Color Picker, Tree, Slider, Range, Rate, Segmented, Number, Tags Input, Search

### Add-ons（规格要求移出核心）

Markdown, Thread/BBS, QRCode, Text FX, Text Rotate, Countdown, CountUp, Image Diff, Hover Gallery, Deck, Mockup, Watermark, Masonry, Speed Dial, Sidebar Layout, Mega Menu, Affix, Anchor, Scroll Spy, Smooth Scroll, Palette Picker, Color Mode Toggle, Shortcut Hints
