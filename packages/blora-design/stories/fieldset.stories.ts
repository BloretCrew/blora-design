import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data input/Fieldset",
  component: ".blora-fieldset",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () =>
    html`<fieldset class="blora-fieldset">
      <legend class="blora-fieldset__legend">发布设置</legend>
      <p class="blora-fieldset__description">使用原生语义组织一组相关控件。</p>
      <blora-checkbox label="允许评论"></blora-checkbox>
    </fieldset>`,
};

export const Flat: Story = {
  render: () =>
    html`<fieldset class="blora-fieldset" data-variant="flat">
      <legend class="blora-fieldset__legend">平面分组</legend>
      <p class="blora-fieldset__description">无容器表面的轻量分组。</p>
    </fieldset>`,
};
