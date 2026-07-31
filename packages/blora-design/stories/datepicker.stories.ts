import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Date Picker",
  component: ".blora-datepicker",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-datepicker">
      <input
        class="blora-input"
        type="text"
        value="2026-07-31"
        style="padding-inline-end: 2.4em; cursor: text;"
      />
      <span
        class="blora-datepicker__icon"
        style="position: absolute; inset-inline-end: 0.8em; top: 50%; transform: translateY(-50%); color: var(--blora-color-text-subtle);"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </span>
    </div>
  `,
};
