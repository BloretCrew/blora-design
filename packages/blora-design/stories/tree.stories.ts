import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Tree",
  component: ".blora-tree",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-tree">
      <p class="blora-text-muted">tree component (beta)</p>
    </div>
  `,
};
