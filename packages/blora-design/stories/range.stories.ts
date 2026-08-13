import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraRange } from "../src/components/range";

defineBloraRange();

const meta = {
  title: "Data input/Range",
  component: "blora-range",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="display:grid;gap:var(--blora-space-8);padding: 0 1rem 2.5rem;">
      <div>
        <p class="blora-hint" style="margin:0 0 0.75rem;">默认 · 拖动显示 tooltip</p>
        <blora-range min="0" max="100" values="20,75"></blora-range>
      </div>
      <div>
        <p class="blora-hint" style="margin:0 0 0.75rem;">tooltip="false" 关闭</p>
        <blora-range min="0" max="100" values="10,90" tooltip="false"></blora-range>
      </div>
    </div>
  `,
};
