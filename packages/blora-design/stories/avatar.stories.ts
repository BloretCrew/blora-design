import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data display/Avatar",
  component: ".blora-avatar",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Sizes: Story = {
  render: () => html`
    <div class="blora-row">
      <div class="blora-avatar" data-size="xs">XS</div>
      <div class="blora-avatar" data-size="sm">SM</div>
      <div class="blora-avatar">MD</div>
      <div class="blora-avatar" data-size="lg">LG</div>
      <div class="blora-avatar" data-size="xl">XL</div>
    </div>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div class="blora-row">
      <div class="blora-avatar" data-variant="primary">P</div>
      <div class="blora-avatar" data-variant="neutral">N</div>
      <div class="blora-avatar" data-variant="info">I</div>
      <div class="blora-avatar" data-variant="success">S</div>
      <div class="blora-avatar" data-variant="contrast">C</div>
    </div>
  `,
};

export const Shapes: Story = {
  render: () => html`
    <div class="blora-row">
      <div class="blora-avatar">圆</div>
      <div class="blora-avatar" data-shape="square">方</div>
    </div>
  `,
};

export const Group: Story = {
  render: () => html`
    <div class="blora-avatar-group">
      <div class="blora-avatar" data-size="sm" data-variant="primary">A</div>
      <div class="blora-avatar" data-size="sm" data-variant="success">B</div>
      <div class="blora-avatar" data-size="sm" data-variant="info">C</div>
      <div class="blora-avatar" data-size="sm" data-variant="neutral">+2</div>
    </div>
  `,
};

export const WithBadge: Story = {
  render: () => html`
    <div class="blora-avatar-wrap">
      <div class="blora-avatar" data-size="lg" data-variant="primary">AB</div>
      <span class="blora-badge">3</span>
    </div>
  `,
};

export const StatusDot: Story = {
  render: () => html`
    <div class="blora-row">
      <span class="blora-dot"></span> 默认
      <span class="blora-dot" data-variant="primary"></span> 主色
      <span class="blora-dot" data-variant="success"></span> 成功
      <span class="blora-dot" data-variant="warning"></span> 警告
    </div>
  `,
};

export const PulseStatus: Story = {
  render: () => html\`<div class="blora-avatar-wrap"><div class="blora-avatar" data-size="lg" data-variant="primary">AB</div><span class="blora-dot" data-variant="success" data-pulse aria-label="在线"></span></div>\`,
};
