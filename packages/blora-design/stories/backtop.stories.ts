import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraBacktop } from "../src/components/backtop";

defineBloraBacktop();

const meta = {
  title: "Navigation/BackTop",
  component: "blora-backtop",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="height: 120vh; padding: 1rem;">
      <p style="color: var(--blora-color-text-muted); font-size: var(--blora-text-sm);">
        Scroll down — BackTop appears after threshold, click returns to top.
      </p>
      <p style="margin-top: 40vh;">Mid page…</p>
      <p style="margin-top: 40vh;">Bottom</p>
      <blora-backtop show-after="80" label="回到顶部"></blora-backtop>
    </div>
  `,
};
