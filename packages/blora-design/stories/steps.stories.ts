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
          <span class="blora-step__icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>
          <div class="blora-step__line"></div>
        </div>
        <div class="blora-step__title">需求分析</div>
        <div class="blora-step__desc">明确业务需求与技术方案</div>
      </div>
      <div class="blora-step" data-state="done">
        <div class="blora-step__head">
          <span class="blora-step__icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>
          <div class="blora-step__line"></div>
        </div>
        <div class="blora-step__title">设计开发</div>
        <div class="blora-step__desc">UI 设计 + 代码实现</div>
      </div>
      <div class="blora-step" data-state="active">
        <div class="blora-step__head">
          <span class="blora-step__icon">3</span>
          <div class="blora-step__line"></div>
        </div>
        <div class="blora-step__title">测试验收</div>
        <div class="blora-step__desc">功能测试 + 代码审查</div>
      </div>
      <div class="blora-step" data-state="pending">
        <div class="blora-step__head">
          <span class="blora-step__icon">4</span>
        </div>
        <div class="blora-step__title">上线</div>
        <div class="blora-step__desc">发布到生产环境</div>
      </div>
    </div>
  `,
};
