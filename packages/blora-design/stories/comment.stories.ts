import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { createBloraIcon } from "../src/core/icons";
const meta = {
  title: "Data display/Comment",
  component: "blora-comment",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Default: Story = {
  render: () =>
    html`<blora-comment style="max-width:480px">
      <span slot="avatar" class="blora-avatar" data-size="sm">R</span>
      <span slot="author">Rhedar</span>
      <time slot="meta">2 小时前</time>
      这个组件库的设计非常统一，token 系统让主题切换变得很方便。
      <button
        slot="actions"
        type="button"
        class="blora-button"
        data-size="xs"
        data-variant="outline"
      >
        回复
      </button>
      <button
        slot="actions"
        type="button"
        class="blora-button"
        data-size="xs"
        data-variant="outline"
        aria-label="赞"
      >
        ${createBloraIcon("thumbs-up", 12)} 12
      </button>
    </blora-comment>`,
};
