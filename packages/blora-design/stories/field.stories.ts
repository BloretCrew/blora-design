import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Field",
  component: ".blora-field",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-field">
      <label class="blora-label" for="demo-input">用户名</label>
      <input class="blora-input" id="demo-input" type="text" placeholder="输入用户名" />
      <div class="blora-hint">3-20 个字符</div>
    </div>
  `,
};

export const WithError: Story = {
  render: () => html`
    <div class="blora-field">
      <label class="blora-label" for="demo-err">邮箱</label>
      <input class="blora-input" id="demo-err" type="email" value="invalid" />
      <div class="blora-error">请输入有效的邮箱地址</div>
    </div>
  `,
};
