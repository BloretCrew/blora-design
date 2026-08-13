import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = {
  title: "Feedback/Result",
  component: "blora-result",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Variants: Story = {
  render: () =>
    html`<div class="blora-grid blora-grid--4">
      <blora-result variant="success" title="操作成功" description="数据已保存"></blora-result
      ><blora-result variant="warning" title="注意" description="存在待处理项"></blora-result
      ><blora-result variant="error" title="加载失败" description="请稍后重试"></blora-result
      ><blora-result variant="info" title="提示" description="保存中…"></blora-result>
    </div>`,
};
