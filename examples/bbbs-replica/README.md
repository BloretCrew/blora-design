# BBBS replica

这是一个第三方消费侧示例，复刻本地项目 BBBS 的 Today 首页与帖子详情页。页面可直接通过 `file://` 打开，也可由任意简单静态服务器托管。

## BBBS 对照点

- 左侧保留“百络谷”品牌、全局搜索、发现导航、常看板块、用户区与外观工具。
- Today 保留日期标题、Bloriko 每日摘要、快速发帖、个性化推荐理由、帖子摘要和回复/浏览统计。
- 帖子页保留返回路径、作者与编辑时间、正文、标签、状态和统计，并提供 4 条评论与评论撰写区。
- 桌面端侧栏粘性固定；窄屏由 Sidebar Layout 自动切换为抽屉。
- 首页搜索、推荐筛选与快速发帖可操作；帖子页长评论折叠、编辑/预览标签、格式按钮和静态提交可操作。

## 公开 Blora 依赖

所有依赖均来自已构建公开产物：

- `packages/blora-design/dist/blora.css`
- `packages/blora-design/dist/tokens.dark.css`
- `packages/blora-design/dist/tokens.themes.css`
- `packages/blora-design/dist/blora.global.js`
- `packages/blora-design/dist/icons-full.global.js`
- `addons/layout/dist/layout.css` 与 `layout.global.js`
- `addons/theming/dist/theming.css` 与 `theming.global.js`
- `addons/thread/dist/thread.css` 与 `thread.global.js`

正式表面包括 Sidebar Layout、Sidebar Navigation、Search、Button、Avatar、Card、List、Tag、Badge、Thread 与 Theming。页面图标全部通过公开 `createBloraIcon()` 创建。

## 已知差异与复用性缺口

- BBBS 原站由真实 API 提供推荐、搜索联想、发帖审核、评论树和用户状态；此示例使用静态中文数据，只演示前端结构与本地交互。
- Thread add-on 提供评论卡片、长内容折叠和 composer 外壳，但不提供 BBBS 的楼中楼数据模型、Markdown 渲染、评论接口与权限逻辑；这些仍应由消费方实现。
- Sidebar Navigation 的公开定义支持文字标签，不提供每条链接的图标 slot，因此侧栏保持 BBBS 的分组和密度，但没有绕过组件内部结构加入导航图标。
- BBBS 原站的图片附件、AI 流式翻译、阅读器模式、通知面板和悬浮新建菜单不属于这两个页面的最小复刻范围。
