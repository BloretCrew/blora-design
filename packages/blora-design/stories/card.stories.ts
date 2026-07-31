import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Card",
  component: ".blora-card",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-card" style="max-width: 24rem;">
      <div class="blora-card__title">卡片标题</div>
      <div class="blora-card__body">这是卡片内容区域，可以放置任意文本或其他组件。</div>
      <div class="blora-card__foot">
        <button class="blora-button" type="button" data-variant="primary" data-size="sm">
          操作
        </button>
      </div>
    </div>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div class="blora-stack" style="max-width: 20rem;">
      <div class="blora-card">
        <div class="blora-card__title">Default</div>
        <div class="blora-card__body">默认卡片样式</div>
      </div>
      <div class="blora-card" data-variant="hover">
        <div class="blora-card__title">Hover</div>
        <div class="blora-card__body">悬浮效果卡片</div>
      </div>
      <div class="blora-card" data-variant="flat">
        <div class="blora-card__title">Flat</div>
        <div class="blora-card__body">无阴影卡片</div>
      </div>
      <div class="blora-card" data-variant="inset">
        <div class="blora-card__title">Inset</div>
        <div class="blora-card__body">内嵌卡片</div>
      </div>
    </div>
  `,
};

export const Panel: Story = {
  render: () => html`
    <div class="blora-panel" style="max-width: 24rem;">
      <div class="blora-panel__header">
        <span>面板标题</span>
        <button class="blora-button" type="button" data-variant="text" data-size="sm">更多</button>
      </div>
      <p>面板内容区域，比卡片更宽松的容器。</p>
    </div>
  `,
};
