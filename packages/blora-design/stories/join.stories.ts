import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Join",
  component: ".blora-join",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-join">
      <button class="blora-button" type="button" data-variant="outline">左</button>
      <button class="blora-button" type="button" data-variant="outline">中</button>
      <button class="blora-button" type="button" data-variant="outline">右</button>
    </div>
  `,
};

export const Vertical: Story = {
  render: () => html`
    <div class="blora-join" data-orientation="vertical">
      <button class="blora-button" type="button" data-variant="outline">上</button>
      <button class="blora-button" type="button" data-variant="outline">中</button>
      <button class="blora-button" type="button" data-variant="outline">下</button>
    </div>
  `,
};

export const Mixed: Story = {
  render: () => html`
    <div class="blora-join">
      <input class="blora-input" type="search" placeholder="搜索组件" aria-label="搜索组件" />
      <button class="blora-button" type="button" data-variant="primary">搜索</button>
    </div>
  `,
};
