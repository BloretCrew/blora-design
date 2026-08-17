import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Hero",
  component: ".blora-hero",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <section class="blora-hero">
      <div class="blora-hero__content">
        <h2>设计系统，按契约交付</h2>
        <p class="blora-text-muted">令牌驱动的页面开场区，沿用 1.x 高度与内边距。</p>
      </div>
    </section>
  `,
};

export const Center: Story = {
  render: () => html`
    <section class="blora-hero" data-align="center">
      <div class="blora-hero__content">
        <h2>居中开场</h2>
        <p class="blora-text-muted">标题与说明水平居中。</p>
      </div>
    </section>
  `,
};

export const Surface: Story = {
  render: () => html`
    <section class="blora-hero" data-variant="surface">
      <div class="blora-hero__content">
        <h2>浅底开场</h2>
        <p class="blora-text-muted">使用表面色而不是画布色。</p>
      </div>
    </section>
  `,
};

export const Compact: Story = {
  render: () => html`
    <section class="blora-hero" data-size="compact" data-align="center">
      <div class="blora-hero__content">
        <h2>紧凑开场</h2>
        <p class="blora-text-muted">最小高度降到 16rem。</p>
      </div>
    </section>
  `,
};
