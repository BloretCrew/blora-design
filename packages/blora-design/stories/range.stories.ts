import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = { title: "Forms/Range", component: ".blora-range", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-range">
      <div class="blora-range__track">
        <div class="blora-range__fill" style="left: 25%; width: 50%;"></div>
        <div class="blora-range__thumb" style="left: 25%;"></div>
        <div class="blora-range__thumb" style="left: 75%;"></div>
      </div>
    </div>
    <div class="blora-text-xs blora-text-muted" style="margin-top: 0.5rem;">¥250 — ¥750</div>
  `,
};
