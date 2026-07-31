import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Feedback/Text Rotate",
  component: ".blora-text-rotate",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="font-size: 2rem; font-weight: 600;">
      轻松
      <span
        class="blora-text-rotate"
        style="display: inline-block; color: var(--blora-color-action-primary-default);"
      >
        <span class="blora-text-rotate__word" data-active>设计</span>
      </span>
      你的界面
    </div>
  `,
};
