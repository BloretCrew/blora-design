import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Tour",
  component: "blora-tour",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-tour label="开始漫游">
      <blora-tour-step title="胶囊标签" description="高亮贴合 Tag 的全圆角胶囊。"
        ><span class="blora-tag" data-variant="primary">步骤 A</span></blora-tour-step
      >
      <blora-tour-step title="圆角按钮" description="高亮跟随按钮的超椭圆圆角。"
        ><button class="blora-button" data-variant="outline" type="button">
          步骤 B
        </button></blora-tour-step
      >
      <blora-tour-step title="头像" description="圆形头像的高亮同样是圆。"
        ><div class="blora-avatar" data-size="lg" data-variant="primary">A</div></blora-tour-step
      >
      <blora-tour-step title="输入框" description="较宽的超椭圆输入壳。"
        ><input
          class="blora-input"
          type="text"
          value="hello@blora"
          readonly
          aria-label="示例邮箱"
          style="width:12rem"
      /></blora-tour-step>
      <blora-tour-step title="纯文字" description="没有圆角的文本，只加一圈很浅的外扩。"
        ><span class="blora-hint">步骤 C 文案</span></blora-tour-step
      >
    </blora-tour>
  `,
};
