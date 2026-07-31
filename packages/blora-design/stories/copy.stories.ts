import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = { title: "Forms/Copy", component: ".blora-copy", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <span class="blora-copy">
      <code class="blora-code">npm i @bloret-crew/blora-design</code>
      <span class="blora-copy__icon">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </span>
    </span>
  `,
};
