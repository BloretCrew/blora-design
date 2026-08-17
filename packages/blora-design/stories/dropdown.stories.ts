import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraDropdown } from "../src/components/dropdown";

defineBloraDropdown();

const meta = {
  title: "Actions/Dropdown",
  component: "blora-dropdown",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-dropdown label="下拉菜单">
      <blora-dropdown-item value="one">操作一</blora-dropdown-item>
      <blora-dropdown-item value="two">操作二</blora-dropdown-item>
      <blora-dropdown-item value="three">操作三</blora-dropdown-item>
    </blora-dropdown>
  `,
};

export const WithSeparator: Story = {
  render: () => html`
    <blora-dropdown label="操作菜单">
      <blora-dropdown-item value="edit">编辑</blora-dropdown-item>
      <blora-dropdown-item value="copy">复制</blora-dropdown-item>
      <blora-dropdown-item value="delete" separator>删除</blora-dropdown-item>
    </blora-dropdown>
  `,
};

export const Align: Story = {
  render: () => html`
    <div class="blora-row">
      <blora-dropdown label="起点" align="start">
        <blora-dropdown-item value="one">操作一</blora-dropdown-item>
        <blora-dropdown-item value="two">操作二</blora-dropdown-item>
      </blora-dropdown>
      <blora-dropdown label="居中" align="center">
        <blora-dropdown-item value="one">操作一</blora-dropdown-item>
        <blora-dropdown-item value="two">操作二</blora-dropdown-item>
      </blora-dropdown>
      <blora-dropdown label="终点" align="end">
        <blora-dropdown-item value="one">操作一</blora-dropdown-item>
        <blora-dropdown-item value="two">操作二</blora-dropdown-item>
      </blora-dropdown>
    </div>
  `,
};

export const Card: Story = {
  render: () => html`
    <blora-dropdown label="打开卡片">
      <article class="blora-card" data-variant="flat">
        <div class="blora-card__title">这是一张卡片</div>
        <div class="blora-card__body">下拉面板可以放入任意正式组件。</div>
      </article>
    </blora-dropdown>
  `,
};

export const Helper: Story = {
  render: () => html`
    <p>
      一段普通文字和辅助说明
      <blora-dropdown variant="helper" label="更多说明">
        <strong>需要更多信息？</strong>
        <span class="blora-text-muted">这里是一段补充描述。</span>
      </blora-dropdown>
    </p>
  `,
};
