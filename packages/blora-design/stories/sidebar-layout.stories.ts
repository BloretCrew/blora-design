import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Sidebar Layout",
  component: ".blora-sidebar-layout",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-sidebar-layout">
      <aside class="blora-sidebar-layout__aside">
        <nav class="blora-stack" style="gap: 0.25rem;">
          <a class="blora-navbar__link" href="#" aria-current="page" style="display:block;">概览</a>
          <a class="blora-navbar__link" href="#" style="display:block;">用户管理</a>
          <a class="blora-navbar__link" href="#" style="display:block;">系统设置</a>
          <a class="blora-navbar__link" href="#" style="display:block;">日志</a>
        </nav>
      </aside>
      <main class="blora-sidebar-layout__content">
        <h3 class="blora-h3">主内容区域</h3>
        <p class="blora-text-muted">
          侧边栏在窄屏（≤900px）下会折叠为抽屉式菜单，点击切换按钮展开。
        </p>
      </main>
    </div>
  `,
};

export const Compact: Story = {
  render: () => html`
    <div class="blora-sidebar-layout blora-sidebar-layout--compact">
      <aside class="blora-sidebar-layout__aside">
        <div class="blora-stack">
          <div class="blora-text-caps">导航</div>
          <a class="blora-navbar__link" href="#" style="display:block;">项目一</a>
          <a class="blora-navbar__link" href="#" style="display:block;">项目二</a>
        </div>
      </aside>
      <main class="blora-sidebar-layout__content">
        <p class="blora-text-muted">紧凑模式（min-height: 20rem）</p>
      </main>
    </div>
  `,
};
