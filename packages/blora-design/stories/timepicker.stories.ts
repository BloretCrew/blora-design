import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Time Picker",
  component: ".blora-timepicker",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-timepicker">
      <input class="blora-input" type="text" value="14:30" style="padding-inline-end: 2.4em;" />
      <span
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
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </span>
    </div>
  `,
};
