import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data input/Cascader",
  component: "blora-cascader",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="max-width: 28rem;">
      <blora-cascader placeholder="选择成员" show-result>
        <blora-cascader-option label="技术部">
          <blora-cascader-option label="前端组">
            <blora-cascader-option label="张三"></blora-cascader-option>
            <blora-cascader-option label="李四"></blora-cascader-option>
          </blora-cascader-option>
          <blora-cascader-option label="设计组">
            <blora-cascader-option label="孙八"></blora-cascader-option>
          </blora-cascader-option>
        </blora-cascader-option>
        <blora-cascader-option label="产品部">
          <blora-cascader-option label="桌面组">
            <blora-cascader-option label="周十"></blora-cascader-option>
          </blora-cascader-option>
        </blora-cascader-option>
      </blora-cascader>
    </div>
  `,
};
