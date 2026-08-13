import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraField } from "../src/components/field";

defineBloraField();

const meta = {
  title: "Data input/Field",
  component: "blora-field",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="display: grid; gap: var(--blora-space-5); max-width: 28rem;">
      <blora-field
        label="文本输入"
        placeholder="请输入用户名"
        limit="20"
        hint="最长 20 个字符，超出部分文字高亮标红，不会截断输入。"
      ></blora-field>
      <blora-field
        label="错误态"
        value="invalid input"
        error="此处输入无效，请重新填写。"
      ></blora-field>
      <blora-field label="禁用" value="此项不可编辑" disabled></blora-field>
    </div>
  `,
};
