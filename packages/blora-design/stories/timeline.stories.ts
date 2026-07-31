import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Timeline",
  component: ".blora-timeline",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-timeline" style="max-width: 24rem;">
      <div class="blora-timeline__item">
        <div class="blora-timeline__dot" data-variant="primary"></div>
        <div class="blora-timeline__time">09:00</div>
        <div class="blora-timeline__title">项目启动</div>
        <div class="blora-timeline__desc">召开启动会议</div>
      </div>
      <div class="blora-timeline__item">
        <div class="blora-timeline__dot" data-variant="success"></div>
        <div class="blora-timeline__time">12:00</div>
        <div class="blora-timeline__title">完成设计</div>
        <div class="blora-timeline__desc">UI 设计稿已确认</div>
      </div>
      <div class="blora-timeline__item">
        <div class="blora-timeline__dot"></div>
        <div class="blora-timeline__time">15:00</div>
        <div class="blora-timeline__title">开发中</div>
      </div>
    </div>
  `,
};
