import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data display/Tag",
  component: ".blora-tag",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "分类、关键词、可关闭标签。浅底描边，不承担数量或状态提示。数量、红点、New/Warning 用 Badge。",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html` <span class="blora-tag">默认标签</span> `,
};

export const Variants: Story = {
  render: () => html`
    <div class="blora-row">
      <span class="blora-tag">Default</span>
      <span class="blora-tag" data-variant="primary">Primary</span>
      <span class="blora-tag" data-variant="neutral">Neutral</span>
      <span class="blora-tag" data-variant="info">Info</span>
      <span class="blora-tag" data-variant="success">Success</span>
      <span class="blora-tag" data-variant="warning">Warning</span>
    </div>
  `,
};

export const Removable: Story = {
  render: () => html`
    <div class="blora-row">
      <span class="blora-tag blora-tag--removable" data-variant="primary"
        >React<button class="blora-tag__close" type="button" aria-label="移除"></button
      ></span>
      <span class="blora-tag blora-tag--removable"
        >设计系统<button class="blora-tag__close" type="button" aria-label="移除"></button
      ></span>
    </div>
  `,
};

export const VersusBadge: Story = {
  render: () => html`
    <p class="blora-text-muted">Tag 回答「这是什么」；数量、红点、状态提示用 Badge。</p>
  `,
};
