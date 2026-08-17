import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Deck",
  component: "blora-deck",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const card = (title: string, detail: string, front = false) => html`
  <blora-deck-card variant=${front ? "default" : "content"} ?front=${front}>
    <div
      style="display: flex; height: 100%; flex-direction: column; justify-content: center; align-items: center; gap: var(--blora-space-2); padding: var(--blora-space-5); box-sizing: border-box;"
    >
      <strong>${title}</strong>
      <p class="blora-text-muted" style="margin: 0;">${detail}</p>
    </div>
  </blora-deck-card>
`;

export const Default: Story = {
  render: () => html`
    <div style="display: flex; justify-content: center; padding: var(--blora-space-6);">
      <blora-deck label="卡片叠层" current="2" style="width: 280px; height: 320px;">
        ${card("设计评审", "队列预览 · 第 1 张")} ${card("接口联调", "待办卡片 · 第 2 张")}
        ${card("当前卡片", "相册 / 队列预览 · 第 3 张", true)}
        ${card("上线检查", "发布清单 · 第 4 张")}
      </blora-deck>
    </div>
  `,
};
