import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Megamenu",
  component: ".blora-megamenu",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-megamenu" style="position: relative; display: inline-block;">
      <button class="blora-button" data-variant="outline" type="button">产品分类 ▾</button>
      <div
        class="blora-megamenu__panel"
        data-open
        style="position: absolute; top: calc(100% + 6px); inset-inline-start: 0; background: var(--blora-color-surface-default); border: var(--blora-border-subtle); border-radius: var(--blora-radius-lg); box-shadow: var(--blora-shadow-4); padding: var(--blora-space-5); width: 480px; z-index: var(--blora-z-dropdown);"
      >
        <div
          class="blora-megamenu__grid"
          style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--blora-space-5);"
        >
          <div>
            <div class="blora-text-caps" style="margin-bottom: var(--blora-space-2);">基础组件</div>
            <a class="blora-navbar__link" href="#" style="display: block;">按钮</a>
            <a class="blora-navbar__link" href="#" style="display: block;">输入框</a>
            <a class="blora-navbar__link" href="#" style="display: block;">选择器</a>
          </div>
          <div>
            <div class="blora-text-caps" style="margin-bottom: var(--blora-space-2);">导航组件</div>
            <a class="blora-navbar__link" href="#" style="display: block;">标签页</a>
            <a class="blora-navbar__link" href="#" style="display: block;">面包屑</a>
            <a class="blora-navbar__link" href="#" style="display: block;">分页</a>
          </div>
          <div>
            <div class="blora-text-caps" style="margin-bottom: var(--blora-space-2);">反馈组件</div>
            <a class="blora-navbar__link" href="#" style="display: block;">警告</a>
            <a class="blora-navbar__link" href="#" style="display: block;">通知</a>
            <a class="blora-navbar__link" href="#" style="display: block;">对话框</a>
          </div>
        </div>
      </div>
    </div>
  `,
};
