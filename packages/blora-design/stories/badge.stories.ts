import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { createBloraIcon } from "../src/core/icons";

const meta = {
  title: "Data display/Badge",
  component: ".blora-badge",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "数量、红点或状态提示。实心、不可关闭。分类、关键词、可移除标签用 Tag。",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Variants: Story = {
  render: () => html`
    <div class="blora-row">
      <span class="blora-badge">9</span>
      <span class="blora-badge">99+</span>
      <span class="blora-badge" data-variant="dot"></span>
      <span class="blora-badge" data-variant="pill">New</span>
      <span class="blora-badge" data-variant="neutral">5</span>
      <span class="blora-badge" data-variant="success">3</span>
      <span class="blora-badge" data-variant="info">i</span>
      <span class="blora-badge" data-variant="warning">!</span>
      <span class="blora-badge" data-variant="danger">!</span>
    </div>
  `,
};

export const WithIcon: Story = {
  render: () => html`
    <div class="blora-row">
      <span class="blora-badge" data-variant="info">${createBloraIcon("info", 12)} Info</span>
      <span class="blora-badge" data-variant="success"
        >${createBloraIcon("circle-check", 12)} Success</span
      >
      <span class="blora-badge" data-variant="warning"
        >${createBloraIcon("triangle-alert", 12)} Warning</span
      >
      <span class="blora-badge" data-variant="danger">${createBloraIcon("ban", 12)} Error</span>
    </div>
  `,
};
