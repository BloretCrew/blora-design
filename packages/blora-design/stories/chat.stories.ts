import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = { title: "Data/Chat", component: ".blora-chat", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div
      class="blora-chat"
      style="display: flex; flex-direction: column; gap: var(--blora-space-3); max-width: 480px;"
    >
      <div
        class="blora-chat__msg"
        style="display: flex; gap: var(--blora-space-2); align-items: flex-start;"
      >
        <span
          style="width: 2em; height: 2em; border-radius: 50%; background: var(--blora-color-status-info); color: white; display: grid; place-items: center; font-size: var(--blora-text-xs); flex: none;"
          >A</span
        >
        <div
          style="background: var(--blora-color-surface-raised); padding: 0.6em 1em; border-radius: var(--blora-radius-lg); border-start-start-radius: 4px; font-size: var(--blora-text-sm);"
        >
          你好，这个设计系统怎么安装？
        </div>
      </div>
      <div
        class="blora-chat__msg"
        style="display: flex; gap: var(--blora-space-2); align-items: flex-start;"
      >
        <span
          style="width: 2em; height: 2em; border-radius: 50%; background: var(--blora-color-status-success); color: white; display: grid; place-items: center; font-size: var(--blora-text-xs); flex: none;"
          >B</span
        >
        <div
          style="background: var(--blora-color-surface-raised); padding: 0.6em 1em; border-radius: var(--blora-radius-lg); border-start-start-radius: 4px; font-size: var(--blora-text-sm);"
        >
          npm i @bloret-crew/blora-design 就可以了
        </div>
      </div>
      <div
        class="blora-chat__msg"
        data-self
        style="display: flex; gap: var(--blora-space-2); align-items: flex-start; flex-direction: row-reverse;"
      >
        <span
          style="width: 2em; height: 2em; border-radius: 50%; background: var(--blora-color-action-primary-default); color: white; display: grid; place-items: center; font-size: var(--blora-text-xs); flex: none;"
          >R</span
        >
        <div
          style="background: var(--blora-color-action-primary-default); color: var(--blora-color-text-on-accent); padding: 0.6em 1em; border-radius: var(--blora-radius-lg); border-start-end-radius: 4px; font-size: var(--blora-text-sm);"
        >
          谢谢！
        </div>
      </div>
    </div>
  `,
};
