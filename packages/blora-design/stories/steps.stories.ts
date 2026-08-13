import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraSteps } from "../src/components/steps";

defineBloraSteps();

const meta = {
  title: "Navigation/Steps",
  component: "blora-steps",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-steps current="2">
      <blora-step title="需求分析" description="明确业务需求与技术方案"></blora-step>
      <blora-step title="设计开发" description="UI 设计 + 代码实现"></blora-step>
      <blora-step title="测试验收" description="功能测试 + 代码审查"></blora-step>
      <blora-step title="上线" description="发布到生产环境"></blora-step>
    </blora-steps>
  `,
};
