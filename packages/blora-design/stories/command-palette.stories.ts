import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Command Palette",
  component: ".blora-command",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div
      class="blora-command"
      style="max-width: 480px; background: var(--blora-color-surface-default); border: var(--blora-border-subtle); border-radius: var(--blora-radius-lg); box-shadow: var(--blora-shadow-4); overflow: hidden;"
    >
      <div
        style="padding: var(--blora-space-3) var(--blora-space-4); border-bottom: 1px solid var(--blora-color-border-subtle); display: flex; align-items: center; gap: var(--blora-space-2);"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          style="color: var(--blora-color-text-subtle);"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <input
          class="blora-input"
          type="text"
          placeholder="输入命令或搜索..."
          style="border: none; background: none; box-shadow: none; padding: 0; flex: 1;"
        />
      </div>
      <div
        class="blora-command__results"
        style="max-height: 320px; overflow-y: auto; padding: var(--blora-space-2);"
      >
        <div
          class="blora-command__item"
          data-active
          style="display: flex; align-items: center; gap: var(--blora-space-3); padding: 0.6em 0.8em; border-radius: var(--blora-radius-sm); cursor: pointer; background: var(--blora-color-surface-raised);"
        >
          <span>📄</span><span class="blora-text-sm">新建文档</span
          ><kbd
            class="blora-command__kbd"
            style="margin-inline-start: auto; font-family: var(--blora-font-mono); font-size: var(--blora-text-xs); color: var(--blora-color-text-subtle);"
            >⌘N</kbd
          >
        </div>
        <div
          class="blora-command__item"
          style="display: flex; align-items: center; gap: var(--blora-space-3); padding: 0.6em 0.8em; border-radius: var(--blora-radius-sm); cursor: pointer;"
        >
          <span>📂</span><span class="blora-text-sm">打开文件</span
          ><kbd
            style="margin-inline-start: auto; font-family: var(--blora-font-mono); font-size: var(--blora-text-xs); color: var(--blora-color-text-subtle);"
            >⌘O</kbd
          >
        </div>
        <div
          class="blora-command__item"
          style="display: flex; align-items: center; gap: var(--blora-space-3); padding: 0.6em 0.8em; border-radius: var(--blora-radius-sm); cursor: pointer;"
        >
          <span>⚙️</span><span class="blora-text-sm">设置</span
          ><kbd
            style="margin-inline-start: auto; font-family: var(--blora-font-mono); font-size: var(--blora-text-xs); color: var(--blora-color-text-subtle);"
            >⌘,</kbd
          >
        </div>
        <div
          class="blora-command__item"
          style="display: flex; align-items: center; gap: var(--blora-space-3); padding: 0.6em 0.8em; border-radius: var(--blora-radius-sm); cursor: pointer;"
        >
          <span>🔍</span><span class="blora-text-sm">全局搜索</span
          ><kbd
            style="margin-inline-start: auto; font-family: var(--blora-font-mono); font-size: var(--blora-text-xs); color: var(--blora-color-text-subtle);"
            >⌘K</kbd
          >
        </div>
      </div>
    </div>
  `,
};
