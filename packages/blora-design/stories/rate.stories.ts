import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = { title: "Forms/Rate", component: ".blora-rate", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;

const star = html`<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  stroke="currentColor"
  stroke-width="2"
>
  <path
    d="m12 3 2.7 5.47 6.04.88-4.37 4.26 1.03 6.02L12 16.79l-5.4 2.84 1.03-6.02-4.37-4.26 6.04-.88z"
  />
</svg>`;
const starOutline = html`<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
>
  <path
    d="m12 3 2.7 5.47 6.04.88-4.37 4.26 1.03 6.02L12 16.79l-5.4 2.84 1.03-6.02-4.37-4.26 6.04-.88z"
  />
</svg>`;

export const Default: Story = {
  render: () => html`
    <div class="blora-rate">
      <span class="blora-rate__star" data-on>${star}</span>
      <span class="blora-rate__star" data-on>${star}</span>
      <span class="blora-rate__star" data-on>${star}</span>
      <span class="blora-rate__star">${starOutline}</span>
      <span class="blora-rate__star">${starOutline}</span>
    </div>
  `,
};
