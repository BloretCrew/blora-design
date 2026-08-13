import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = {
  title: "Navigation/Navbar",
  component: "blora-navbar",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;
const content = html`<blora-navbar-link label="设计规范" href="#" current></blora-navbar-link
  ><blora-navbar-link label="设计令牌" href="#"></blora-navbar-link
  ><blora-navbar-link label="组件" href="#"></blora-navbar-link
  ><blora-navbar-action label="规范文档" href="#"></blora-navbar-action
  ><blora-navbar-action label="登录" href="#" variant="primary"></blora-navbar-action>`;
export const Floating: Story = {
  render: () =>
    html`<blora-navbar title="Blora Design" variant="floating">${content}</blora-navbar>`,
};
export const FullWidth: Story = {
  render: () => html`<blora-navbar title="Blora Design" variant="full">${content}</blora-navbar>`,
};
