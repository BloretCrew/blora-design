import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Steps",
  component: ".blora-steps",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-steps">
      <div class="blora-step" data-state="done">
        <div class="blora-step__head">
          <span class="blora-step__icon">1</span>
        </div>
        <div class="blora-step__title">创建账户</div>
        <div class="blora-step__desc">填写基本信息</div>
      </div>
      <div class="blora-step" data-state="active">
        <div class="blora-step__head">
          <span class="blora-step__icon">2</span>
        </div>
        <div class="blora-step__title">验证身份</div>
        <div class="blora-step__desc">手机或邮箱验证</div>
      </div>
      <div class="blora-step" data-state="pending">
        <div class="blora-step__head">
          <span class="blora-step__icon">3</span>
        </div>
        <div class="blora-step__title">完成设置</div>
        <div class="blora-step__desc">个性化配置</div>
      </div>
      <div class="blora-step" data-state="pending">
        <div class="blora-step__head">
          <span class="blora-step__icon">4</span>
        </div>
        <div class="blora-step__title">开始使用</div>
        <div class="blora-step__desc">进入控制台</div>
      </div>
    </div>
  `,
};
