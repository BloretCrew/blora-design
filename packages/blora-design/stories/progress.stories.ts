import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Feedback/Progress",
  component: ".blora-progress",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-stack">
      <div class="blora-progress">
        <div class="blora-progress__label"><span>上传中</span><span>30%</span></div>
        <div class="blora-progress__bar">
          <div class="blora-progress__fill" style="width: 30%;"></div>
        </div>
      </div>
      <div class="blora-progress">
        <div class="blora-progress__label"><span>处理中</span><span>60%</span></div>
        <div class="blora-progress__bar">
          <div class="blora-progress__fill" data-variant="success" style="width: 60%;"></div>
        </div>
      </div>
      <div class="blora-progress">
        <div class="blora-progress__label"><span>下载中</span><span>90%</span></div>
        <div class="blora-progress__bar">
          <div class="blora-progress__fill" data-variant="info" style="width: 90%;"></div>
        </div>
      </div>
      <div class="blora-progress">
        <div class="blora-progress__label"><span>不确定</span><span>—</span></div>
        <div class="blora-progress__bar">
          <div class="blora-progress__fill" data-variant="striped" style="width: 100%;"></div>
        </div>
      </div>
    </div>
  `,
};
