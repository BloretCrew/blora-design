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
          <span
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="flex:none;"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" /></svg></span
          ><span class="blora-text-sm">新建文档</span
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
          <span
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="flex:none;"
            >
              <path
                d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
              /></svg></span
          ><span class="blora-text-sm">打开文件</span
          ><kbd
            style="margin-inline-start: auto; font-family: var(--blora-font-mono); font-size: var(--blora-text-xs); color: var(--blora-color-text-subtle);"
            >⌘O</kbd
          >
        </div>
        <div
          class="blora-command__item"
          style="display: flex; align-items: center; gap: var(--blora-space-3); padding: 0.6em 0.8em; border-radius: var(--blora-radius-sm); cursor: pointer;"
        >
          <span
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="flex:none;"
            >
              <circle cx="12" cy="12" r="3" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              /></svg></span
          ><span class="blora-text-sm">设置</span
          ><kbd
            style="margin-inline-start: auto; font-family: var(--blora-font-mono); font-size: var(--blora-text-xs); color: var(--blora-color-text-subtle);"
            >⌘,</kbd
          >
        </div>
        <div
          class="blora-command__item"
          style="display: flex; align-items: center; gap: var(--blora-space-3); padding: 0.6em 0.8em; border-radius: var(--blora-radius-sm); cursor: pointer;"
        >
          <span
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="flex:none;"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" /></svg></span
          ><span class="blora-text-sm">全局搜索</span
          ><kbd
            style="margin-inline-start: auto; font-family: var(--blora-font-mono); font-size: var(--blora-text-xs); color: var(--blora-color-text-subtle);"
            >⌘K</kbd
          >
        </div>
      </div>
    </div>
  `,
};
