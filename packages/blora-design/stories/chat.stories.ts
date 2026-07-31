import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Chat",
  component: ".blora-chat",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-stack" style="gap: var(--blora-space-4); max-width: 480px;">
      <div class="blora-chat">
        <span
          class="blora-avatar blora-avatar--info blora-chat__avatar"
          style="width:2.5em;height:2.5em;border-radius:50%;background:var(--blora-color-status-info);color:var(--blora-color-text-on-accent);display:grid;place-items:center;font-weight:600;flex:none;"
          >A</span
        >
        <div class="blora-chat__content">
          <div class="blora-chat__meta"><span>Alex</span><time>10:24</time></div>
          <div class="blora-chat__bubble">设计稿已经同步，可以开始组件联调。</div>
        </div>
      </div>
      <div class="blora-chat blora-chat--end">
        <span
          class="blora-avatar blora-avatar--primary blora-chat__avatar"
          style="width:2.5em;height:2.5em;border-radius:50%;background:var(--blora-color-action-primary-default);color:var(--blora-color-text-on-accent);display:grid;place-items:center;font-weight:600;flex:none;"
          >B</span
        >
        <div class="blora-chat__content">
          <div class="blora-chat__meta"><span>Blora</span><time>10:26</time></div>
          <div class="blora-chat__bubble">收到，先处理表单和导航。</div>
        </div>
      </div>
      <div class="blora-chat">
        <span
          class="blora-avatar blora-avatar--info blora-chat__avatar"
          style="width:2.5em;height:2.5em;border-radius:50%;background:var(--blora-color-status-info);color:var(--blora-color-text-on-accent);display:grid;place-items:center;font-weight:600;flex:none;"
          >A</span
        >
        <div class="blora-chat__content">
          <div class="blora-chat__meta"><span>Alex</span><time>10:28</time></div>
          <div class="blora-chat__bubble">好的，Tab 和 Dropdown 我先跑通，然后合并到 main。</div>
        </div>
      </div>
    </div>
  `,
};
