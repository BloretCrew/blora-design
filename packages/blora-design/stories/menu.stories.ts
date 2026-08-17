import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Menu",
  component: ".blora-menu",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <nav class="blora-menu" aria-label="文档导航">
      <p class="blora-menu__title">指南</p>
      <a class="blora-menu__item" href="#menu" aria-current="page">开始使用</a>
      <a class="blora-menu__item" href="#menu">令牌</a>
      <a class="blora-menu__item" href="#menu" aria-disabled="true">即将推出</a>
    </nav>
  `,
};

export const Horizontal: Story = {
  render: () => html`
    <nav class="blora-menu" data-orientation="horizontal" aria-label="页面导航">
      <a class="blora-menu__item" href="#menu" aria-current="page">概览</a>
      <a class="blora-menu__item" href="#menu">组件</a>
      <a class="blora-menu__item" href="#menu">主题</a>
    </nav>
  `,
};
