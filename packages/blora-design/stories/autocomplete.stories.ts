import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/AutoComplete",
  component: ".blora-autocomplete",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-autocomplete" style="position: relative; max-width: 20rem;">
      <input
        class="blora-input"
        type="text"
        value="re"
        placeholder="输入搜索..."
        style="padding-inline-start: 2.4em;"
      />
      <svg
        style="position: absolute; inset-inline-start: 0.8em; top: 50%; transform: translateY(-50%); color: var(--blora-color-text-subtle);"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
      <div
        class="blora-autocomplete__list"
        data-open
        style="position: absolute; top: 100%; inset-inline-start: 0; inset-inline-end: 0; margin-top: 6px; background: var(--blora-color-surface-default); border: var(--blora-border-subtle); border-radius: var(--blora-radius-md); box-shadow: var(--blora-shadow-3); z-index: var(--blora-z-dropdown);"
      >
        <div class="blora-autocomplete__item" data-active>React</div>
        <div class="blora-autocomplete__item">Redux</div>
        <div class="blora-autocomplete__item">Remix</div>
        <div class="blora-autocomplete__item">Recoil</div>
      </div>
    </div>
  `,
};
