import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Drawer",
  component: ".blora-drawer",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Right: Story = {
  render: () => html`
    <div
      style="position: relative; height: 320px; overflow: hidden; border-radius: var(--blora-radius-lg);"
    >
      <div class="blora-drawer" open data-position="right">
        <div class="blora-drawer__mask"></div>
        <div class="blora-drawer__panel">
          <div style="padding: var(--blora-space-5);">
            <h3
              style="margin: 0 0 var(--blora-space-3) 0; font-family: var(--blora-font-heading); font-size: var(--blora-text-lg);"
            >
              侧栏标题
            </h3>
            <p
              style="margin: 0; color: var(--blora-color-text-emphasis); font-size: var(--blora-text-sm);"
            >
              这是抽屉内容区域。可以放置表单、详情信息或其他组件。
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const Left: Story = {
  render: () => html`
    <div
      style="position: relative; height: 320px; overflow: hidden; border-radius: var(--blora-radius-lg);"
    >
      <div class="blora-drawer" open data-position="left">
        <div class="blora-drawer__mask"></div>
        <div class="blora-drawer__panel">
          <div style="padding: var(--blora-space-5);">
            <h3
              style="margin: 0 0 var(--blora-space-3) 0; font-family: var(--blora-font-heading); font-size: var(--blora-text-lg);"
            >
              左侧筛选
            </h3>
            <div class="blora-stack">
              <label class="blora-checkbox"
                ><input type="checkbox" checked /><span class="blora-checkbox__box"></span
                >选项一</label
              >
              <label class="blora-checkbox"
                ><input type="checkbox" /><span class="blora-checkbox__box"></span>选项二</label
              >
              <label class="blora-checkbox"
                ><input type="checkbox" /><span class="blora-checkbox__box"></span>选项三</label
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
