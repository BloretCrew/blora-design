import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Indicator",
  component: ".blora-indicator",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <span class="blora-indicator">
      <button class="blora-button" type="button">收件箱</button>
      <span class="blora-indicator__item"><span class="blora-badge">12</span></span>
    </span>
  `,
};

export const TopStart: Story = {
  render: () => html`
    <span class="blora-indicator" data-placement="top-start">
      <button class="blora-button" type="button">通知</button>
      <span class="blora-indicator__item"
        ><span class="blora-badge" data-variant="danger">3</span></span
      >
    </span>
  `,
};

export const BottomEnd: Story = {
  render: () => html`
    <span class="blora-indicator" data-placement="bottom-end">
      <button class="blora-button" type="button">任务</button>
      <span class="blora-indicator__item"
        ><span class="blora-badge" data-variant="info">8</span></span
      >
    </span>
  `,
};

export const BottomStart: Story = {
  render: () => html`
    <span class="blora-indicator" data-placement="bottom-start">
      <button class="blora-button" type="button">消息</button>
      <span class="blora-indicator__item"
        ><span class="blora-badge" data-variant="success">1</span></span
      >
    </span>
  `,
};

export const Inside: Story = {
  render: () => html`
    <span class="blora-indicator" data-placement="inside">
      <div class="blora-avatar" data-size="lg" data-variant="primary">AB</div>
      <span class="blora-indicator__item"
        ><span class="blora-dot" data-variant="success"></span
      ></span>
    </span>
  `,
};
